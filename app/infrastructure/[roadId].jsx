import { ScrollView, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { getRoadReport } from '@/mock-data/road-reports';
import { FONT } from '@/theme/tokens';
import ScreenContainer from '@/components/layout/ScreenContainer';
import Header from '@/components/layout/Header';
import MapPlaceholder from '@/components/map/MapPlaceholder';
import Card from '@/components/ui/Card';
import StatusBadge from '@/components/ui/StatusBadge';
import Button from '@/components/ui/Button';

export default function Infrastructure() {
  const { roadId } = useLocalSearchParams();
  const router = useRouter();
  const report = getRoadReport(roadId);

  return (
    <ScreenContainer>
      <Header title={report.roadName} showBack />
      <View className="h-48">
        <MapPlaceholder />
      </View>
      <ScrollView className="flex-1 px-4 pt-4">
        <Card variant="alert" status={report.status}>
          <View className="flex-row items-start justify-between">
            <View className="flex-1 pr-3">
              <Text className="text-[16px] text-ink" style={{ fontFamily: FONT.bold }}>
                {report.segment}
              </Text>
              <Text className="mt-1 text-[13px] text-ink/80" style={{ fontFamily: FONT.regular }}>
                {report.issue}
              </Text>
            </View>
            <StatusBadge status={report.status} />
          </View>
        </Card>
        <Button className="mt-4" label="Open road report" onPress={() => router.push(`/reports/${report.id}`)} />
      </ScrollView>
    </ScreenContainer>
  );
}
