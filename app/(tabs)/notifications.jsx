import { ScrollView, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Bell } from 'lucide-react-native';
import { NOTIFICATIONS } from '@/mock-data/alerts';
import { FONT } from '@/theme/tokens';
import ScreenContainer from '@/components/layout/ScreenContainer';
import Header from '@/components/layout/Header';
import EmptyState from '@/components/layout/EmptyState';
import Card from '@/components/ui/Card';
import StatusBadge from '@/components/ui/StatusBadge';

export default function Notifications() {
  const router = useRouter();

  return (
    <ScreenContainer>
      <Header title="Alerts" />
      {NOTIFICATIONS.length === 0 ? (
        <EmptyState icon={Bell} message="No alerts right now." />
      ) : (
        <ScrollView className="flex-1 px-4" contentContainerStyle={{ paddingBottom: 24, paddingTop: 4 }}>
          {NOTIFICATIONS.map((item) => (
            <Card key={item.id} variant="alert" status={item.status} className="mb-3" onPress={() => router.push('/camps')}>
              <View className="flex-row items-start justify-between">
                <Text className="flex-1 pr-3 text-[15px] text-ink" style={{ fontFamily: FONT.bold }}>
                  {item.title}
                </Text>
                <StatusBadge status={item.status} />
              </View>
              <Text className="mt-1 text-[13px] text-ink/80" style={{ fontFamily: FONT.regular }}>
                {item.body}
              </Text>
              <Text className="mt-2 text-[12px] text-ink/60" style={{ fontFamily: FONT.medium }}>
                {item.time}
              </Text>
            </Card>
          ))}
        </ScrollView>
      )}
    </ScreenContainer>
  );
}
