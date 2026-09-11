const OVERPASS_URL = 'https://overpass-api.de/api/interpreter';
const REQUEST_TIMEOUT_MS = 12000;
const cache = {};

function cacheKey(lat, lng, radiusMeters) {
  return `${lat.toFixed(2)}:${lng.toFixed(2)}:${radiusMeters}`;
}

function parseOsmHospital(element) {
  const lat = element.lat ?? element.center?.lat;
  const lng = element.lon ?? element.center?.lon;
  if (lat == null || lng == null) return null;

  const tags = element.tags || {};
  const name = tags.name || tags['name:en'] || tags['official_name'] || 'Hospital';
  const location =
    tags['addr:city'] ||
    tags['addr:suburb'] ||
    tags['addr:town'] ||
    tags['addr:place'] ||
    tags['addr:street'] ||
    'Kerala';
  const district =
    tags['addr:district'] ||
    tags['addr:state_district'] ||
    tags['addr:county'] ||
    location;

  return {
    id: `osm-${element.id}`,
    name,
    type: 'Hospital',
    lat,
    lng,
    location,
    district,
    source: 'osm',
  };
}

async function fetchWithTimeout(url, options, timeoutMs) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

export async function fetchNearbyHospitals(lat, lng, radiusMeters = 15000) {
  const key = cacheKey(lat, lng, radiusMeters);
  if (cache[key]) return cache[key];

  const query = `
    [out:json][timeout:25];
    (
      node["amenity"="hospital"](around:${radiusMeters},${lat},${lng});
      way["amenity"="hospital"](around:${radiusMeters},${lat},${lng});
    );
    out center tags;
  `;

  try {
    const response = await fetchWithTimeout(
      OVERPASS_URL,
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        },
        body: `data=${encodeURIComponent(query.trim())}`,
      },
      REQUEST_TIMEOUT_MS
    );

    if (!response.ok) throw new Error(`Overpass ${response.status}`);
    const payload = await response.json();
    const hospitals = (payload.elements || []).map(parseOsmHospital).filter(Boolean);
    cache[key] = hospitals;
    return hospitals;
  } catch {
    return [];
  }
}

const ROAD_NAME_KEYS = ['road', 'pedestrian', 'footway', 'path', 'residential'];
const NOMINATIM_REVERSE_URL = 'https://nominatim.openstreetmap.org/reverse';
const NOMINATIM_HEADERS = {
  Accept: 'application/json',
  'User-Agent': 'RESILIO-Kerala-DisasterApp/1.0 (hackathon prototype)',
};

function reverseCacheKey(lat, lng) {
  return `rev:${Number(lat).toFixed(2)}:${Number(lng).toFixed(2)}`;
}

function roadNameFromAddress(address = {}) {
  for (const key of ROAD_NAME_KEYS) {
    const value = String(address[key] || '').trim();
    if (value) return value;
  }
  return null;
}

export async function reverseGeocodeRoad(lat, lng) {
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
  const key = reverseCacheKey(lat, lng);
  if (Object.prototype.hasOwnProperty.call(cache, key)) return cache[key];

  try {
    const url = `${NOMINATIM_REVERSE_URL}?format=jsonv2&lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lng)}&zoom=17&addressdetails=1`;
    const response = await fetchWithTimeout(
      url,
      { method: 'GET', headers: NOMINATIM_HEADERS },
      REQUEST_TIMEOUT_MS
    );
    if (!response.ok) return null;
    const payload = await response.json();
    const roadName = roadNameFromAddress(payload.address);
    if (!roadName) {
      cache[key] = null;
      return null;
    }
    const result = {
      roadName,
      displayName: payload.display_name || roadName,
    };
    cache[key] = result;
    return result;
  } catch {
    return null;
  }
}
