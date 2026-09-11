import { Image, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { FONT, RADIUS } from '@/theme/tokens';
import { useResilience } from '@/services/resilienceStore';
import ScreenContainer from '@/components/layout/ScreenContainer';
import Header from '@/components/layout/Header';
import Card from '@/components/ui/Card';
import StatusBadge from '@/components/ui/StatusBadge';
import Button from '@/components/ui/Button';

function confidencePercent(confidence) {
  const numeric = Number(confidence);
  if (!Number.isFinite(numeric)) return 0;
  return Math.round(Math.min(1, Math.max(0, numeric)) * 100);
}

export default function RoadScanResult() {
  const router = useRouter();
  const { reportId } = useLocalSearchParams();
  const { getRoadReport } = useResilience();
  const id = Array.isArray(reportId) ? reportId[0] : reportId;
  const report = getRoadReport(id);

  if (!report) {
    return (
      <ScreenContainer>
        <Header title="Scan result" showBack />
        <View className="flex-1 px-4 pb-6">
          <Text className="mt-4 text-[15px] text-ink/70" style={{ fontFamily: FONT.medium }}>
            This scan is no longer listed.
          </Text>
        </View>
      </ScreenContainer>
    );
  }

  const locationLabel =
    report.latitude == null || report.longitude == null ? 'Location unavailable' : report.segment;
  const timeLabel = report.scannedAt || report.capturedAt || 'Just now';
  const source = report.source || report.aiAnalysis?.source;
  const fallback = Boolean(report.aiAnalysis?.fallback);

  return (
    <ScreenContainer>
      <Header title="Scan result" showBack />
      <View className="flex-1 px-4 pb-6">
        {report.evidenceUri ? (
          <Image
            source={{ uri: report.evidenceUri }}
            className="mt-2"
            style={{ height: 180, borderRadius: RADIUS.soft, width: '100%' }}
            resizeMode="cover"
          />
        ) : null}
        <Card variant="alert" status={report.status} className="mt-2">
          <View className="flex-row items-start justify-between">
            <View className="flex-1 pr-3">
              <Text className="text-[16px] text-ink" style={{ fontFamily: FONT.bold }}>
                {report.issue || 'Uncertain observation from this photo.'}
              </Text>
              <Text className="mt-2 text-[13px] text-ink/80" style={{ fontFamily: FONT.regular }}>
                Possible observation · {confidencePercent(report.confidence)}% confidence
                {source ? ` · ${source}` : ''}
              </Text>
              <Text className="mt-1 text-[13px] text-ink/80" style={{ fontFamily: FONT.medium }}>
                Community confirmation needed
              </Text>
              {fallback ? (
                <Text className="mt-2 text-[12px] text-ink/70" style={{ fontFamily: FONT.regular }}>
                  AI analysis was unavailable. This report is still an uncertain observation.
                </Text>
              ) : null}
              <Text className="mt-2 text-[12px] text-ink/70" style={{ fontFamily: FONT.medium }}>
                {locationLabel} · {timeLabel}
              </Text>
            </View>
            <StatusBadge status={report.status} label="Possible observation" />
          </View>
        </Card>
        <Button className="mt-5" label="Open full report" onPress={() => router.push(`/reports/${report.id}`)} />
        <Button className="mt-3" variant="secondary" label="Scan another road" onPress={() => router.replace('/roadscan')} />
      </View>
    </ScreenContainer>
  );
}
