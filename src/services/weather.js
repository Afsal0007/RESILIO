export const HEAVY_RAIN_MM = 10;
const WEATHER_URL = 'https://api.openweathermap.org/data/2.5/weather';
const REQUEST_TIMEOUT_MS = 8000;

async function fetchWithTimeout(url, timeoutMs) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

export function formatWeatherSummary(weather) {
  if (!weather) return 'Current conditions unavailable';
  const rain = weather.rainLastHourMm;
  const rainLabel =
    rain > 0 ? `${rain.toFixed(1)} mm/hr` : 'no rain in the last hour';
  return `Current conditions: ${weather.description || weather.condition}, ${rainLabel}`;
}

export async function fetchCurrentWeather(lat, lng) {
  const key = process.env.EXPO_PUBLIC_OWM_KEY;
  if (!key) return null;

  try {
    const url = `${WEATHER_URL}?lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lng)}&units=metric&appid=${encodeURIComponent(key)}`;
    const response = await fetchWithTimeout(url, REQUEST_TIMEOUT_MS);
    if (!response.ok) return null;
    const payload = await response.json();
    const condition = payload.weather?.[0]?.main || 'Unknown';
    const description = payload.weather?.[0]?.description || condition.toLowerCase();
    const rainLastHourMm = Number(payload.rain?.['1h'] ?? 0);
    const tempC = Number(payload.main?.temp);

    return {
      condition,
      description,
      rainLastHourMm: Number.isFinite(rainLastHourMm) ? rainLastHourMm : 0,
      tempC: Number.isFinite(tempC) ? tempC : null,
    };
  } catch {
    return null;
  }
}
