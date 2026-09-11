# RoadScan AI contract

The Expo client never talks to a model provider. It only calls this backend. Model credentials stay on the server.

AI output is probabilistic. It is a possible observation, not a confirmed closure or a clearance. Community verification is still required before acting on a report.

## Endpoint

`POST {EXPO_PUBLIC_RESILIO_AI_URL}/analyze/road`

A physical phone cannot use `localhost`. Use the computer's LAN IP, for example `http://192.168.60.11:8000`.

## Request

`multipart/form-data`. Do not send a manual `Content-Type` from the client; the runtime must set the boundary.

| Field | Required | Notes |
| --- | --- | --- |
| `file` | yes | Captured road image |
| `latitude` | no | GPS latitude as a string |
| `longitude` | no | GPS longitude as a string |

## Success response

```json
{
  "label": "possible_flooding",
  "issue": "Possible flooding on the road",
  "confidence": 0.81,
  "source": "road-model-v1"
}
```

Supported labels:

- `possible_flooding`
- `possible_landslide`
- `possible_debris`
- `possible_blockage`
- `fallen_tree`
- `road_damage`
- `no_clear_disruption`
- `possible_disruption`

`confidence` must be numeric. The client clamps it to `0..1`.

## Client fallback

The app still creates a report when:

- `EXPO_PUBLIC_RESILIO_AI_URL` is missing
- the endpoint is unreachable
- the request times out (~15 seconds)
- the body is not valid JSON or `confidence` is not numeric

Fallback shape used by the client:

- `label`: `possible_disruption`
- `issue`: uncertain observation; community confirmation needed
- `confidence`: `0.35`
- `source`: `fallback-local`
- `status`: `limited`

The fallback must not claim the road is definitely safe or definitely unsafe.
