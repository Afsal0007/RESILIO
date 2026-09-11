# RESILIO RoadScan AI server

Separate Python service for `POST /analyze/road`. The Expo app never holds Hugging Face credentials. Put `HF_TOKEN` and `HF_MODEL` only in `ai-server/.env`.

## Setup

```bash
cd ai-server
python -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env        # then fill in real HF_TOKEN and HF_MODEL
uvicorn main:app --host 0.0.0.0 --port 8000
```

On Windows PowerShell:

```powershell
cd ai-server
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
uvicorn main:app --host 0.0.0.0 --port 8000
```

## Phone vs localhost

The Expo app's `EXPO_PUBLIC_RESILIO_AI_URL` (see the app `.env.example`) must point at **this machine's LAN IP**, not `localhost`, for a physical phone to reach the server — for example `http://192.168.x.x:8000`. Both devices must be on the same Wi-Fi network. `localhost` on the phone is the phone itself.

## Verify the backend first

Test on this computer before involving Expo Go, so backend bugs are not mixed with network issues:

```bash
curl -X POST http://localhost:8000/analyze/road ^
  -F "file=@path/to/road.jpg" ^
  -F "latitude=10.0261" ^
  -F "longitude=76.3125"
```

On macOS/Linux use `\` instead of `^` for line continuations:

```bash
curl -X POST http://localhost:8000/analyze/road \
  -F "file=@path/to/road.jpg" \
  -F "latitude=10.0261" \
  -F "longitude=76.3125"
```

A valid image should return JSON with `label`, `issue`, `confidence`, `source`, `needs_confirmation`, and the coordinates. If `HF_TOKEN` / `HF_MODEL` are still placeholders, or Hugging Face is unreachable, you should get the local fallback (`source: local-fallback`) rather than a crash.

The server calls `https://router.huggingface.co/hf-inference/models/{HF_MODEL}` (the old `api-inference.huggingface.co` host was retired). The token needs **Inference Providers** permission: https://huggingface.co/settings/tokens
