import { ScrollView, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { FONT } from '@/theme/tokens';
import { useAuth } from '@/context/AuthContext';
import { useVolunteerPresence } from '@/services/volunteerPresenceStore';
import { withAssignedTimeline, useResilience } from '@/services/resilienceStore';
import { requestUserCoords } from '@/hooks/useUserLocation';
import ScreenContainer from '@/components/layout/ScreenContainer';
import Header from '@/components/layout/Header';
import Card from '@/components/ui/Card';
import StatusBadge from '@/components/ui/StatusBadge';
import Button from '@/components/ui/Button';

export default function RequestDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const { acceptTask, setPresence } = useVolunteerPresence();
  const { getInboxRecord, updateSosCase, updateFacilityRequest } = useResilience();
  const recordId = Array.isArray(id) ? id[0] : id;
  const found = getInboxRecord(recordId);

  if (!found) {
    return (
      <ScreenContainer>
        <Header title="Request" showBack />
        <Text className="px-4 pt-6 text-[15px] text-ink/70" style={{ fontFamily: FONT.medium }}>
          This request is no longer listed.
        </Text>
      </ScreenContainer>
    );
  }

  const { kind, record } = found;
  const isSos = kind === 'sos';
  const title = isSos ? record.type : record.item;
  const details = isSos
    ? record.location
    : [record.quantity, record.notes].filter(Boolean).join(' · ');
  const meta = isSos
    ? `${record.requesterName || 'Citizen SOS'} · ${record.location}`
    : `${record.facilityName || 'Facility'} · ${record.location || ''}`;
  const alreadyAccepted = Boolean(record.assignedTo) || record.status === 'accepted';

  const onAccept = async () => {
    if (!alreadyAccepted && user?.id) {
      const coords = await requestUserCoords();
      const patch = {
        status: 'accepted',
        assignedTo: user.id,
        assignedName: user.name,
        acceptedVolunteerId: user.id,
        assignedLat: coords?.latitude ?? null,
        assignedLng: coords?.longitude ?? null,
        timeline: withAssignedTimeline(record.timeline),
      };
      if (coords) {
        setPresence(user.id, { lat: coords.latitude, lng: coords.longitude, role: user.role });
      }
      if (isSos) {
        await updateSosCase(record.id, patch);
        acceptTask(`sos:${record.id}`, user.id);
      } else {
        await updateFacilityRequest(record.id, patch);
        acceptTask(`facility:${record.id}`, user.id);
      }
    }
    router.push(`/requests/${record.id}/active`);
  };

  return (
    <ScreenContainer>
      <Header title={isSos ? 'SOS' : 'Facility need'} showBack />
      <ScrollView className="flex-1 px-4" contentContainerStyle={{ paddingBottom: 32 }}>
        <Card variant="alert" status={record.status} className="mt-1">
          <View className="flex-row items-start justify-between">
            <Text className="flex-1 pr-3 text-[18px] text-ink" style={{ fontFamily: FONT.extrabold }}>
              {title}
            </Text>
            <StatusBadge
              status={alreadyAccepted ? 'accepted' : record.status}
              label={alreadyAccepted ? 'Volunteer assigned' : undefined}
            />
          </View>
          {details ? (
            <Text className="mt-2 text-[14px] text-ink/80" style={{ fontFamily: FONT.regular }}>
              {details}
            </Text>
          ) : null}
          <Text className="mt-3 text-[13px] text-ink/70" style={{ fontFamily: FONT.medium }}>
            {meta}
          </Text>
        </Card>
        <View className="mt-5" style={{ gap: 12 }}>
          <Button
            label={alreadyAccepted ? 'Open active task' : 'Accept'}
            onPress={onAccept}
          />
          <Button label="Decline" variant="danger" onPress={() => router.back()} />
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
