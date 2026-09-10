import { Text, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { getSos } from '@/mock-data/sos';
import { FONT } from '@/theme/tokens';
import ScreenContainer from '@/components/layout/ScreenContainer';
import Header from '@/components/layout/Header';
import Card from '@/components/ui/Card';
import StatusBadge from '@/components/ui/StatusBadge';
import Timeline from '@/components/ui/Timeline';
import SectionHeading from '@/components/ui/SectionHeading';

export default function SosStatus() {
  const { id } = useLocalSearchParams();
  const sos = getSos(id);

  return (
    <ScreenContainer>
      <Header title="SOS status" showBack />
      <View className="flex-1 px-4 pt-2">
        <Card variant="alert" status={sos.status}>
          <View className="flex-row items-start justify-between">
            <View className="flex-1 pr-3">
              <Text className="text-[16px] text-ink" style={{ fontFamily: FONT.bold }}>
                {sos.type}
              </Text>
              <Text className="mt-1 text-[13px] text-ink/70" style={{ fontFamily: FONT.regular }}>
                {sos.location}
              </Text>
            </View>
            <StatusBadge status={sos.status} />
          </View>
        </Card>
        <View className="mt-6">
          <SectionHeading>Progress</SectionHeading>
          <Timeline steps={sos.timeline} />
        </View>
      </View>
    </ScreenContainer>
  );
}
