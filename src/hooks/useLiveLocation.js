import { useEffect, useRef } from 'react';
import { Alert, AppState } from 'react-native';
import * as Location from 'expo-location';
import { isDutySharingRole } from '@/constants/roles';
import { useAuth } from '@/context/AuthContext';
import { useVolunteerPresence } from '@/services/volunteerPresenceStore';

const BACKGROUND_CLEAR_MS = 3 * 60 * 1000;

export default function useLiveLocation(onDuty, userId, role) {
  const { setPresence, setOnDuty, clearPresence } = useVolunteerPresence();
  const watchRef = useRef(null);
  const backgroundTimerRef = useRef(null);
  const roleRef = useRef(role);
  roleRef.current = role;

  useEffect(() => {
    let cancelled = false;

    async function startWatching() {
      if (!onDuty || !userId) return;

      const { status } = await Location.requestForegroundPermissionsAsync();
      if (cancelled) return;
      if (status !== 'granted') {
        setOnDuty(userId, false);
        Alert.alert(
          'Location needed',
          'Location access is required to go on duty so coordinators can match you to nearby requests.'
        );
        return;
      }

      try {
        const first = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        if (cancelled) return;
        setPresence(userId, {
          lat: first.coords.latitude,
          lng: first.coords.longitude,
          role: roleRef.current,
        });
      } catch {
        // Watcher below still tries for a live fix.
      }

      if (cancelled) return;

      try {
        watchRef.current = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.Balanced,
            timeInterval: 15000,
            distanceInterval: 25,
          },
          (position) => {
            setPresence(userId, {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
              role: roleRef.current,
            });
          }
        );
      } catch {
        if (cancelled) return;
        setOnDuty(userId, false);
        Alert.alert(
          'Location needed',
          'Could not start live location. Check location services and try again.'
        );
      }
    }

    function stopWatching() {
      watchRef.current?.remove?.();
      watchRef.current = null;
    }

    if (onDuty && userId) {
      startWatching();
    } else {
      stopWatching();
    }

    return () => {
      cancelled = true;
      stopWatching();
      if (onDuty && userId) clearPresence(userId);
    };
  }, [onDuty, userId, setPresence, setOnDuty, clearPresence]);

  useEffect(() => {
    if (!onDuty || !userId) return undefined;

    const subscription = AppState.addEventListener('change', (nextState) => {
      if (nextState === 'background' || nextState === 'inactive') {
        if (backgroundTimerRef.current) return;
        backgroundTimerRef.current = setTimeout(() => {
          watchRef.current?.remove?.();
          watchRef.current = null;
          clearPresence(userId);
          setOnDuty(userId, false);
          backgroundTimerRef.current = null;
        }, BACKGROUND_CLEAR_MS);
        return;
      }

      if (nextState === 'active' && backgroundTimerRef.current) {
        clearTimeout(backgroundTimerRef.current);
        backgroundTimerRef.current = null;
      }
    });

    return () => {
      subscription.remove();
      if (backgroundTimerRef.current) {
        clearTimeout(backgroundTimerRef.current);
        backgroundTimerRef.current = null;
      }
    };
  }, [onDuty, userId, clearPresence, setOnDuty]);
}

export function VolunteerLiveTracker() {
  const { user } = useAuth();
  const { presence } = useVolunteerPresence();
  const onDuty = Boolean(user?.id && presence[user.id]?.onDuty && isDutySharingRole(user.role));
  useLiveLocation(onDuty, user?.id, user?.role);
  return null;
}

// TODO(EAS): True background tracking (updates while the app is closed or the
// phone is locked) needs Location.startLocationUpdatesAsync + a TaskManager
// background task, plus UIBackgroundModes: ["location"] in app.json and
// ACCESS_BACKGROUND_LOCATION on Android. None of that works in Expo Go — only
// in a standalone EAS build — and iOS App Store review is strict about
// justifying background location. Add that once we ship EAS builds.
