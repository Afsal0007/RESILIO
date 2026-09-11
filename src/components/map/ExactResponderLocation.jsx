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

export default function ExactResponderLocation({ taskKey, requesterId, fallbackVolunteerId }) {
  const { user } = useAuth();
  const { getPresence, getAcceptedVolunteerId } = useVolunteerPresence();
  const [viewerCoords, setViewerCoords] = useState(null);

  const volunteerId = getAcceptedVolunteerId(taskKey) || fallbackVolunteerId;
  const presence = volunteerId ? getPresence(volunteerId) : null;
  const canSeeExact = Boolean(
    user?.id && volunteerId && (user.id === requesterId || user.id === volunteerId)
  );

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
    if (!viewerCoords || !presence || presence.lat == null || presence.lng == null) return null;
    return roundKm(haversineKm(viewerCoords.latitude, viewerCoords.longitude, presence.lat, presence.lng));
  }, [presence, viewerCoords]);

  if (!canSeeExact) return null;

  const roleLabel = ROLES[presence?.role]?.label || 'Assigned volunteer';
  const live = Boolean(presence?.onDuty && Number.isFinite(presence.lat) && Number.isFinite(presence.lng));
  const minutes = etaMinutes(distanceKm);

  return (
    <View className="mt-6">
      <SectionHeading>Responder location</SectionHeading>
      {live ? (
        <>
          <View className="overflow-hidden" style={{ height: 180, borderRadius: RADIUS.soft }}>
            <ResilioMap
              style={{ height: 180 }}
              initialRegion={{
                latitude: presence.lat,
                longitude: presence.lng,
                latitudeDelta: 0.02,
                longitudeDelta: 0.02,
              }}
              markers={[
                {
                  id: `exact-${volunteerId}`,
                  title: `${roleLabel} en route`,
                  coordinate: { latitude: presence.lat, longitude: presence.lng },
                  pinColor: '#B23A2E',
                },
              ]}
            />
          </View>
          <Card variant="browse" className="mt-3">
            <View className="flex-row items-start justify-between">
              <View className="flex-1 pr-3">
                <Text className="text-[15px] text-ink" style={{ fontFamily: FONT.semibold }}>
                  {roleLabel} · live location
                </Text>
                <Text className="mt-1 text-[13px] text-ink/70" style={{ fontFamily: FONT.regular }}>
                  {distanceKm != null
                    ? `${distanceKm} km away${minutes ? ` · about ${minutes} min` : ''}`
                    : 'Exact coordinates shared because this request is already matched.'}
                </Text>
              </View>
              <StatusBadge status="available" label="En route" />
            </View>
          </Card>
        </>
      ) : (
        <Text className="text-[14px] text-ink/70" style={{ fontFamily: FONT.regular }}>
          The assigned responder will appear here with an exact location once they are on duty.
        </Text>
      )}
    </View>
  );
}
