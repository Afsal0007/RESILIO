import { Text, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useDashboardZones } from '@/services/resilienceStore';
import { FONT } from '@/theme/tokens';
import ScreenContainer from '@/components/layout/ScreenContainer';
import Header from '@/components/layout/Header';
import Card from '@/components/ui/Card';
import StatusBadge from '@/components/ui/StatusBadge';
import SectionHeading from '@/components/ui/SectionHeading';

export default function ZoneDashboard() {
  const { id } = useLocalSearchParams();
  const zones = useDashboardZones();
  const zoneId = Array.isArray(id) ? id[0] : id;
  const zone = zones.find((item) => item.id === zoneId);

  if (!zone) {
    return (
      <ScreenContainer>
        <Header title="Zone" variant="status" showBack />
        <View className="flex-1 px-4 pt-4">
          <Text className="text-[15px] text-ink/70" style={{ fontFamily: FONT.medium }}>
            This zone is no longer listed.
          </Text>
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <Header title={zone.name} variant="status" showBack />
      <View className="flex-1 px-4 pt-4">
        <StatusBadge status={zone.status} />
        <View className="mt-5">
          <SectionHeading>Live counts</SectionHeading>
          {[
            ['Camps in zone', zone.camps],
            ['Roads closed', zone.roadsClosed],
            ['Volunteers', zone.volunteers],
          ].map(([label, value]) => (
            <Card key={label} variant="browse" className="mb-3">
              <Text className="text-[13px] text-ink/70" style={{ fontFamily: FONT.medium }}>
                {label}
              </Text>
              <Text className="text-[22px] text-ink" style={{ fontFamily: FONT.extrabold }}>
                {value}
              </Text>
            </Card>
          ))}
        </View>
      </View>
    </ScreenContainer>
  );
}
