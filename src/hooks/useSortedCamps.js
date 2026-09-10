import { useCallback, useMemo, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import { requestUserCoords } from '@/hooks/useUserLocation';
import { sortCampsByNearest, withLiveDistance } from '@/utils/distance';

export default function useSortedCamps(camps) {
  const [userCoords, setUserCoords] = useState(null);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      requestUserCoords().then((coords) => {
        if (active) setUserCoords(coords);
      });
      return () => {
        active = false;
      };
    }, [])
  );

  return useMemo(
    () => withLiveDistance(sortCampsByNearest(camps, userCoords), userCoords),
    [camps, userCoords]
  );
}
