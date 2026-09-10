import { Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { ROAD_REPORTS } from '@/mock-data/road-reports';
import { FONT } from '@/theme/tokens';
import ScreenContainer from '@/components/layout/ScreenContainer';
import Header from '@/components/layout/Header';
import Card from '@/components/ui/Card';
import StatusBadge from '@/components/ui/StatusBadge';
import Button from '@/components/ui/Button';

export default function RoadScanResult() {
  const router = useRouter();
  const report = ROAD_REPORTS[0];

  return (
    <ScreenContainer>
      <Header title="Scan result" showBack />
      <View className="flex-1 px-4 pb-6">
        <Card variant="alert" status={report.status} className="mt-2">
          <View className="flex-row items-start justify-between">
            <View className="flex-1 pr-3">
              <Text className="text-[16px] text-ink" style={{ fontFamily: FONT.bold }}>
                {report.roadName}
              </Text>
              <Text className="mt-1 text-[13px] text-ink/80" style={{ fontFamily: FONT.regular }}>
                {report.issue}
              </Text>
            </View>
            <StatusBadge status={report.status} />
          </View>
        </Card>
        <Button className="mt-5" label="Open full report" onPress={() => router.push(`/reports/${report.id}`)} />
        <Button className="mt-3" variant="secondary" label="Scan another road" onPress={() => router.replace('/roadscan')} />
      </View>
    </ScreenContainer>
  );
}
