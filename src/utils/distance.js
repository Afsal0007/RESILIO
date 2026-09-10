export const THRISSUR_TOWN = {
  latitude: 10.5276,
  longitude: 76.2144,
};

const EARTH_RADIUS_KM = 6371;

function toRad(degrees) {
  return (degrees * Math.PI) / 180;
}

export function haversineKm(lat1, lng1, lat2, lng2) {
  if (![lat1, lng1, lat2, lng2].every(Number.isFinite)) return null;

  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;

  return 2 * EARTH_RADIUS_KM * Math.asin(Math.min(1, Math.sqrt(a)));
}

export function roundKm(km) {
  if (km == null || Number.isNaN(km)) return null;
  return Math.round(km * 10) / 10;
}

function originFromCoords(userCoords) {
  if (userCoords && Number.isFinite(userCoords.latitude) && Number.isFinite(userCoords.longitude)) {
    return userCoords;
  }
  return THRISSUR_TOWN;
}

export function campDistanceKm(camp, userCoords) {
  const origin = originFromCoords(userCoords);
  return haversineKm(origin.latitude, origin.longitude, camp?.lat, camp?.lng);
}

export function sortCampsByNearest(camps, userCoords) {
  return [...camps].sort((a, b) => {
    const da = campDistanceKm(a, userCoords) ?? Number.POSITIVE_INFINITY;
    const db = campDistanceKm(b, userCoords) ?? Number.POSITIVE_INFINITY;
    return da - db;
  });
}

export function withLiveDistance(camps, userCoords) {
  const hasGps = Boolean(
    userCoords && Number.isFinite(userCoords.latitude) && Number.isFinite(userCoords.longitude)
  );

  return camps.map((camp) => {
    const next = { ...camp };
    delete next.distanceKm;
    if (!hasGps) return next;
    const km = roundKm(haversineKm(userCoords.latitude, userCoords.longitude, camp.lat, camp.lng));
    if (km == null) return next;
    return { ...next, distanceKm: km };
  });
}
