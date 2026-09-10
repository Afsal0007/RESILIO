import { useCallback, useEffect, useState } from 'react';
import * as Location from 'expo-location';

export const KERALA_REGION = {
  latitude: 10.05,
  longitude: 76.3,
  latitudeDelta: 3.5,
  longitudeDelta: 3.5,
};

export const NEIGHBORHOOD_DELTA = 0.05;

export function regionFromCoords(coords, delta = NEIGHBORHOOD_DELTA) {
  return {
    latitude: coords.latitude,
    longitude: coords.longitude,
    latitudeDelta: delta,
    longitudeDelta: delta,
  };
}

export async function requestUserCoords() {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') return null;

    const position = await Promise.race([
      Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced }),
      new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Location timed out')), 8000);
      }),
    ]);

    return {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
    };
  } catch {
    return null;
  }
}

export default function useUserLocation({ requestOnMount = false } = {}) {
  const [coords, setCoords] = useState(null);
  const [granted, setGranted] = useState(false);

  const refresh = useCallback(async () => {
    const next = await requestUserCoords();
    if (next) {
      setCoords(next);
      setGranted(true);
      return next;
    }
    setGranted(false);
    return null;
  }, []);

  useEffect(() => {
    if (!requestOnMount) return undefined;
    refresh();
    return undefined;
  }, [requestOnMount, refresh]);

  return { coords, granted, refresh };
}
