import { ScrollView, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { DASHBOARD_STATS, ZONES } from '@/mock-data/dashboard';
import { FONT, STATUS_HEX } from '@/theme/tokens';
import ScreenContainer from '@/components/layout/ScreenContainer';
import Header from '@/components/layout/Header';
import Card from '@/components/ui/Card';
import StatusBadge from '@/components/ui/StatusBadge';
import SectionHeading from '@/components/ui/SectionHeading';

export default function Dashboard() {
  const router = useRouter();

  return (
    <ScreenContainer>
      <Header title="Dashboard" variant="status" showBack />
      <ScrollView className="flex-1 px-4" contentContainerStyle={{ paddingBottom: 32 }}>
        <View className="mt-4 flex-row flex-wrap justify-between">
          {DASHBOARD_STATS.map((stat) => (
            <View key={stat.id} className="mb-3" style={{ width: '48%' }}>
              <Card variant="alert" status={stat.status}>
                <Text
                  className="text-[28px]"
                  style={{ fontFamily: FONT.extrabold, color: STATUS_HEX[stat.status] }}
                >
                  {stat.value}
                </Text>
                <Text className="mt-1 text-[13px] text-ink" style={{ fontFamily: FONT.semibold }}>
                  {stat.label}
                </Text>
              </Card>
            </View>
          ))}
        </View>
        <SectionHeading>Zones</SectionHeading>
        {ZONES.map((zone) => (
          <Card
            key={zone.id}
            variant="alert"
            status={zone.status}
            className="mb-3"
            onPress={() => router.push(`/dashboard/zone/${zone.id}`)}
          >
            <View className="flex-row items-start justify-between">
              <Text className="flex-1 pr-3 text-[15px] text-ink" style={{ fontFamily: FONT.bold }}>
                {zone.name}
              </Text>
              <StatusBadge status={zone.status} />
            </View>
          </Card>
        ))}
      </ScrollView>
    </ScreenContainer>
  );
}
