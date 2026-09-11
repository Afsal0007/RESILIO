import os
from io import BytesIO
from typing import Any, Optional

import requests
from dotenv import load_dotenv
from fastapi import FastAPI, File, Form, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image, UnidentifiedImageError


def env_value(name: str) -> str:
    return str(os.getenv(name) or "").strip()


load_dotenv()
print(f"[startup] HF_MODEL={'set: ' + model if (model := env_value('HF_MODEL')) else 'MISSING'}")
print(f"[startup] HF_TOKEN={'set (' + str(len(token)) + ' chars)' if (token := env_value('HF_TOKEN')) else 'MISSING'}")

HF_INFERENCE_URL = "https://router.huggingface.co/hf-inference/models/{model}"
HF_TIMEOUT_SECONDS = 30

ISSUE_BY_LABEL = {
    "possible_flooding": "Possible flooding on the road",
    "possible_landslide": "Possible landslide near the road",
    "possible_debris": "Possible debris on the road",
    "possible_blockage": "Possible blockage on the road",
    "fallen_tree": "Possible fallen tree on the road",
    "road_damage": "Possible road damage",
    "no_clear_disruption": "No clear disruption in this frame. Community confirmation is still needed.",
    "possible_disruption": "Possible disruption on the road",
}

# Longer / more specific substrings first.
LABEL_MATCHES = (
    ("fallen_tree", "fallen_tree"),
    ("flooding", "possible_flooding"),
    ("flood", "possible_flooding"),
    ("landslide", "possible_landslide"),
    ("blockage", "possible_blockage"),
    ("debris", "possible_debris"),
    ("damage", "road_damage"),
    ("clear", "no_clear_disruption"),
)

app = FastAPI(title="RESILIO RoadScan AI")

# Permissive CORS for Expo Go on a phone during development.
# Lock this down to known origins before any real deployment.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


def clamp_confidence(value: Any) -> float:
    try:
        numeric = float(value)
    except (TypeError, ValueError):
        numeric = 0.0
    return round(min(1.0, max(0.0, numeric)), 3)


def with_location(payload: dict, latitude: Optional[float], longitude: Optional[float]) -> dict:
    payload["latitude"] = latitude
    payload["longitude"] = longitude
    payload["needs_confirmation"] = True
    return payload


def invalid_image_response(latitude: Optional[float], longitude: Optional[float]) -> dict:
    return with_location(
        {
            "label": "invalid_image",
            "issue": "The uploaded image could not be analyzed.",
            "confidence": 0,
            "source": "validation",
        },
        latitude,
        longitude,
    )


def local_fallback(latitude: Optional[float], longitude: Optional[float]) -> dict:
    return with_location(
        {
            "label": "possible_disruption",
            "issue": "Possible road disruption detected.",
            "confidence": 0.42,
            "source": "local-fallback",
        },
        latitude,
        longitude,
    )


def is_real_image(raw: bytes) -> bool:
    if not raw:
        return False
    try:
        with Image.open(BytesIO(raw)) as image:
            image.verify()
        return True
    except (UnidentifiedImageError, OSError, ValueError):
        return False


def normalize_label(raw_label: str) -> str:
    text = str(raw_label or "").strip().lower().replace("-", "_").replace(" ", "_")
    if "unclear" in text:
        text = text.replace("unclear", "")
    for needle, label in LABEL_MATCHES:
        if needle in text:
            return label
    return "possible_disruption"


def prediction_list(payload: Any) -> Optional[list]:
    if isinstance(payload, dict) and payload.get("error"):
        return None
    if isinstance(payload, list) and payload:
        if isinstance(payload[0], list):
            return prediction_list(payload[0])
        if all(isinstance(item, dict) and "label" in item for item in payload):
            return payload
    return None


def from_huggingface(payload: Any, model: str) -> Optional[dict]:
    predictions = prediction_list(payload)
    if not predictions:
        return None
    top = max(predictions, key=lambda item: float(item.get("score") or item.get("confidence") or 0))
    label = normalize_label(str(top.get("label") or ""))
    score = top.get("score", top.get("confidence"))
    return {
        "label": label,
        "issue": ISSUE_BY_LABEL.get(label, ISSUE_BY_LABEL["possible_disruption"]),
        "confidence": clamp_confidence(0.42 if score is None else score),
        "source": f"huggingface:{model}",
    }


def call_huggingface(raw: bytes, token: str, model: str, content_type: str) -> tuple[Optional[int], Any]:
    url = HF_INFERENCE_URL.format(model=model)
    print(f"[huggingface] POST {url}")
    try:
        response = requests.post(
            url,
            headers={
                "Authorization": f"Bearer {token}",
                "Content-Type": content_type or "application/octet-stream",
            },
            data=raw,
            timeout=HF_TIMEOUT_SECONDS,
        )
    except requests.RequestException as exc:
        print(f"[huggingface] RequestException: {exc}")
        return None, None
    preview = (response.text or "")[:300]
    print(f"[huggingface] status={response.status_code}")
    print(f"[huggingface] body={preview}")
    try:
        body = response.json()
    except ValueError:
        return response.status_code, None
    return response.status_code, body


@app.post("/analyze/road")
async def analyze_road(
    file: UploadFile = File(...),
    latitude: Optional[float] = Form(None),
    longitude: Optional[float] = Form(None),
):
    raw = await file.read()
    if not is_real_image(raw):
        return invalid_image_response(latitude, longitude)

    token = env_value("HF_TOKEN")
    model = env_value("HF_MODEL")
    if not token or not model:
        print("[analyze] local_fallback: missing HF_TOKEN or HF_MODEL")
        return local_fallback(latitude, longitude)

    status_code, body = call_huggingface(raw, token, model, file.content_type or "")
    if status_code is None:
        print("[analyze] local_fallback: Hugging Face unreachable (network/DNS)")
        return local_fallback(latitude, longitude)
    if status_code == 503:
        print("[analyze] local_fallback: Hugging Face returned 503 (cold model loading)")
        return local_fallback(latitude, longitude)

    result = from_huggingface(body, model)
    if result is None:
        print("[analyze] local_fallback: unparseable prediction (not a usable list)")
        return local_fallback(latitude, longitude)

    return with_location(result, latitude, longitude)
