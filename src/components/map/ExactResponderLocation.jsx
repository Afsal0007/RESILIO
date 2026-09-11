import { useEffect, useMemo, useState } from 'react';
import { Text, View } from 'react-native';
import { FONT, RADIUS } from '@/theme/tokens';
import { ROLES } from '@/constants/roles';
import { useAuth } from '@/context/AuthContext';
import { useVolunteerPresence } from '@/services/volunteerPresenceStore';
import { haversineKm, roundKm } from '@/utils/distance';
import { requestUserCoords } from '@/hooks/useUserLocation';
import ResilioMap from '@/components/map/ResilioMap';
import Card from '@/components/ui/Card';
import StatusBadge from '@/components/ui/StatusBadge';
import SectionHeading from '@/components/ui/SectionHeading';

function etaMinutes(km) {
  if (km == null) return null;
  return Math.max(1, Math.round((km / 20) * 60));
}

function asCoords(lat, lng) {
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
  return { lat, lng };
}

export default function ExactResponderLocation({
  taskKey,
  requesterId,
  fallbackVolunteerId,
  fallbackCoords,
  volunteerName,
}) {
  const { user } = useAuth();
  const { getPresence, getAcceptedVolunteerId } = useVolunteerPresence();
  const [viewerCoords, setViewerCoords] = useState(null);

  const volunteerId = getAcceptedVolunteerId(taskKey) || fallbackVolunteerId;
  const presence = volunteerId ? getPresence(volunteerId) : null;
  const canSeeExact = Boolean(
    user?.id && volunteerId && (user.id === requesterId || user.id === volunteerId)
  );

  const pin = asCoords(presence?.lat, presence?.lng) || asCoords(fallbackCoords?.lat, fallbackCoords?.lng);
  const live = Boolean(presence?.onDuty && asCoords(presence?.lat, presence?.lng));

  useEffect(() => {
    if (!canSeeExact) return undefined;
    let active = true;
    requestUserCoords().then((coords) => {
      if (active) setViewerCoords(coords);
    });
    return () => {
      active = false;
    };
  }, [canSeeExact]);

  const distanceKm = useMemo(() => {
    if (!viewerCoords || !pin) return null;
    return roundKm(haversineKm(viewerCoords.latitude, viewerCoords.longitude, pin.lat, pin.lng));
  }, [pin, viewerCoords]);

  if (!canSeeExact) {
    if (volunteerId) {
      return (
        <View className="mt-6">
          <SectionHeading>Responder location</SectionHeading>
          <Text className="text-[14px] text-ink/70" style={{ fontFamily: FONT.regular }}>
            {volunteerName || 'A volunteer'} is assigned. Exact location is visible to the requester and the matched volunteer.
          </Text>
        </View>
      );
    }
    return null;
  }

  const roleLabel = volunteerName || ROLES[presence?.role]?.label || 'Assigned volunteer';
  const minutes = etaMinutes(distanceKm);

  return (
    <View className="mt-6">
      <SectionHeading>Responder location</SectionHeading>
      {pin ? (
        <>
          <View className="overflow-hidden" style={{ height: 180, borderRadius: RADIUS.soft }}>
            <ResilioMap
              style={{ height: 180 }}
              initialRegion={{
                latitude: pin.lat,
                longitude: pin.lng,
                latitudeDelta: 0.02,
                longitudeDelta: 0.02,
              }}
              markers={[
                {
                  id: `exact-${volunteerId}`,
                  title: `${roleLabel} en route`,
                  coordinate: { latitude: pin.lat, longitude: pin.lng },
                  pinColor: '#B23A2E',
                },
              ]}
            />
          </View>
          <Card variant="browse" className="mt-3">
            <View className="flex-row items-start justify-between">
              <View className="flex-1 pr-3">
                <Text className="text-[15px] text-ink" style={{ fontFamily: FONT.semibold }}>
                  {roleLabel} · {live ? 'live location' : 'last known location'}
                </Text>
                <Text className="mt-1 text-[13px] text-ink/70" style={{ fontFamily: FONT.regular }}>
                  {distanceKm != null
                    ? `${distanceKm} km away${minutes ? ` · about ${minutes} min` : ''}`
                    : 'Exact coordinates shared because this request is already matched.'}
                </Text>
              </View>
              <StatusBadge status="available" label={live ? 'En route' : 'Assigned'} />
            </View>
          </Card>
        </>
      ) : (
        <Text className="text-[14px] text-ink/70" style={{ fontFamily: FONT.regular }}>
          {roleLabel} is assigned. Their pin appears here as soon as a location fix is available.
        </Text>
      )}
    </View>
  );
}
