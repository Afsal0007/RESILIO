import { ScrollView, Text, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { FONT } from '@/theme/tokens';
import { useResilience } from '@/services/resilienceStore';
import ScreenContainer from '@/components/layout/ScreenContainer';
import Header from '@/components/layout/Header';
import Card from '@/components/ui/Card';
import StatusBadge from '@/components/ui/StatusBadge';
import Timeline from '@/components/ui/Timeline';
import SectionHeading from '@/components/ui/SectionHeading';
import ExactResponderLocation from '@/components/map/ExactResponderLocation';

export default function ActiveRequest() {
  const { id } = useLocalSearchParams();
  const requestId = Array.isArray(id) ? id[0] : id;
  const { getInboxRecord } = useResilience();
  const found = getInboxRecord(requestId);

  if (!found) {
    return (
      <ScreenContainer>
        <Header title="Active task" showBack />
        <Text className="px-4 pt-6 text-[15px] text-ink/70" style={{ fontFamily: FONT.medium }}>
          This request is no longer listed.
        </Text>
      </ScreenContainer>
    );
  }

  const { kind, record } = found;
  const isSos = kind === 'sos';
  const title = isSos ? record.type : record.item;
  const location = isSos ? record.location : record.facilityName || record.location;
  const taskKey = isSos ? `sos:${record.id}` : `facility:${record.id}`;
  const volunteerId = record.assignedTo || record.acceptedVolunteerId;
  const assigned = Boolean(volunteerId) || record.status === 'accepted';

  return (
    <ScreenContainer>
      <Header title="Active task" showBack />
      <ScrollView className="flex-1 px-4 pt-2" contentContainerStyle={{ paddingBottom: 32 }}>
        <Card variant="browse">
          <View className="flex-row items-start justify-between">
            <Text className="flex-1 pr-3 text-[16px] text-ink" style={{ fontFamily: FONT.bold }}>
              {title}
            </Text>
            <StatusBadge
              status={assigned ? 'accepted' : record.status}
              label={assigned ? 'Volunteer assigned' : undefined}
            />
          </View>
          <Text className="mt-2 text-[13px] text-ink/70" style={{ fontFamily: FONT.regular }}>
            {location}
          </Text>
        </Card>
        <View className="mt-6">
          <SectionHeading>Status</SectionHeading>
          <Timeline steps={record.timeline || []} />
        </View>
        <ExactResponderLocation
          taskKey={taskKey}
          requesterId={record.requesterId}
          fallbackVolunteerId={volunteerId}
          volunteerName={record.assignedName}
          fallbackCoords={{ lat: record.assignedLat, lng: record.assignedLng }}
        />
      </ScrollView>
    </ScreenContainer>
  );
}
