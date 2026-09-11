export const HEAVY_RAIN_MM = 10;
const WEATHER_URL = 'https://api.openweathermap.org/data/2.5/weather';
const FORECAST_URL = 'https://api.openweathermap.org/data/2.5/forecast';
const REQUEST_TIMEOUT_MS = 8000;
const FORECAST_WINDOW_MS = 5.5 * 60 * 60 * 1000;

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

export function formatHourLabel(date) {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) return '';
  const hours = date.getHours();
  const suffix = hours >= 12 ? 'PM' : 'AM';
  const hour12 = hours % 12 || 12;
  return `${hour12} ${suffix}`;
}

function parseForecastEntry(entry) {
  const time = new Date(entry.dt * 1000);
  if (Number.isNaN(time.getTime())) return null;
  const condition = entry.weather?.[0]?.main || 'Unknown';
  const description = entry.weather?.[0]?.description || condition.toLowerCase();
  const tempC = Number(entry.main?.temp);
  const rainMm = Number(entry.rain?.['3h'] ?? 0);
  return {
    time,
    tempC: Number.isFinite(tempC) ? tempC : null,
    condition,
    description,
    rainMm: Number.isFinite(rainMm) ? rainMm : 0,
  };
}

export async function fetchForecast(lat, lng) {
  const key = process.env.EXPO_PUBLIC_OWM_KEY;
  if (!key) return null;

  try {
    const url = `${FORECAST_URL}?lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lng)}&units=metric&appid=${encodeURIComponent(key)}`;
    const response = await fetchWithTimeout(url, REQUEST_TIMEOUT_MS);
    if (!response.ok) return null;
    const payload = await response.json();
    const now = Date.now();
    const until = now + FORECAST_WINDOW_MS;
    return (payload.list || [])
      .map(parseForecastEntry)
      .filter((entry) => {
        if (!entry) return false;
        const time = entry.time.getTime();
        return time >= now && time <= until;
      });
  } catch {
    return null;
  }
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
