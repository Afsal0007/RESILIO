import { ScrollView, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { getRequest } from '@/mock-data/requests';
import { FONT } from '@/theme/tokens';
import { useAuth } from '@/context/AuthContext';
import { isDutySharingRole } from '@/constants/roles';
import { useVolunteerPresence } from '@/services/volunteerPresenceStore';
import ScreenContainer from '@/components/layout/ScreenContainer';
import Header from '@/components/layout/Header';
import Card from '@/components/ui/Card';
import StatusBadge from '@/components/ui/StatusBadge';
import Button from '@/components/ui/Button';

export default function RequestDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const { acceptTask } = useVolunteerPresence();
  const request = getRequest(id);

  return (
    <ScreenContainer>
      <Header title="Request" showBack />
      <ScrollView className="flex-1 px-4" contentContainerStyle={{ paddingBottom: 32 }}>
        <Card variant="alert" status={request.status} className="mt-1">
          <View className="flex-row items-start justify-between">
            <Text className="flex-1 pr-3 text-[18px] text-ink" style={{ fontFamily: FONT.extrabold }}>
              {request.title}
            </Text>
            <StatusBadge status={request.status} />
          </View>
          <Text className="mt-2 text-[14px] text-ink/80" style={{ fontFamily: FONT.regular }}>
            {request.details}
          </Text>
          <Text className="mt-3 text-[13px] text-ink/70" style={{ fontFamily: FONT.medium }}>
            {request.requester} · {request.location}
          </Text>
        </Card>
        <View className="mt-5" style={{ gap: 12 }}>
          <Button
            label="Accept"
            onPress={() => {
              if (user?.id && isDutySharingRole(user.role)) {
                acceptTask(`request:${request.id}`, user.id);
              }
              router.push(`/requests/${request.id}/active`);
            }}
          />
          <Button label="Decline" variant="danger" onPress={() => router.back()} />
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
