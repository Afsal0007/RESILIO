import { ScrollView, Text, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { getRequest } from '@/mock-data/requests';
import { FONT } from '@/theme/tokens';
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
  const request = getRequest(requestId);

  return (
    <ScreenContainer>
      <Header title="Active task" showBack />
      <ScrollView className="flex-1 px-4 pt-2" contentContainerStyle={{ paddingBottom: 32 }}>
        <Card variant="browse">
          <View className="flex-row items-start justify-between">
            <Text className="flex-1 pr-3 text-[16px] text-ink" style={{ fontFamily: FONT.bold }}>
              {request.title}
            </Text>
            <StatusBadge status={request.status} />
          </View>
          <Text className="mt-2 text-[13px] text-ink/70" style={{ fontFamily: FONT.regular }}>
            {request.location}
          </Text>
        </Card>
        <View className="mt-6">
          <SectionHeading>Status</SectionHeading>
          <Timeline steps={request.timeline} />
        </View>
        <ExactResponderLocation
          taskKey={`request:${request.id}`}
          requesterId={request.requesterId}
          fallbackVolunteerId={request.acceptedVolunteerId}
        />
      </ScrollView>
    </ScreenContainer>
  );
}
