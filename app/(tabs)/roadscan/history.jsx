import { ScrollView, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { FolderOpen } from 'lucide-react-native';
import { FONT } from '@/theme/tokens';
import { useResilience } from '@/services/resilienceStore';
import ScreenContainer from '@/components/layout/ScreenContainer';
import Header from '@/components/layout/Header';
import EmptyState from '@/components/layout/EmptyState';
import Card from '@/components/ui/Card';
import StatusBadge from '@/components/ui/StatusBadge';

export default function RoadScanHistory() {
  const router = useRouter();
  const { roadReports } = useResilience();
  const reports = [...roadReports].sort((a, b) => {
    const aTime = Date.parse(a.capturedAt || '') || 0;
    const bTime = Date.parse(b.capturedAt || '') || 0;
    if (aTime !== bTime) return bTime - aTime;
    return 0;
  });

  return (
    <ScreenContainer>
      <Header title="Scan history" showBack />
      {reports.length === 0 ? (
        <EmptyState icon={FolderOpen} message="No scans yet. Capture a road to start the log." />
      ) : (
        <ScrollView className="flex-1 px-4" contentContainerStyle={{ paddingBottom: 24 }}>
          {reports.map((report) => (
            <Card
              key={report.id}
              variant="browse"
              className="mb-3"
              onPress={() => router.push(`/reports/${report.id}`)}
            >
              <View className="flex-row items-start justify-between">
                <View className="flex-1 pr-3">
                  <Text className="text-[15px] text-ink" style={{ fontFamily: FONT.bold }}>
                    {report.roadName}
                  </Text>
                  <Text className="mt-0.5 text-[13px] text-ink/70" style={{ fontFamily: FONT.regular }}>
                    {report.latitude == null ? 'Location unavailable' : report.segment} · {report.scannedAt}
                  </Text>
                </View>
                <StatusBadge status={report.status} />
              </View>
            </Card>
          ))}
        </ScrollView>
      )}
    </ScreenContainer>
  );
}
