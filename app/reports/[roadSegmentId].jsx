import { useMemo } from 'react';
import { Image, ScrollView, Text, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { FONT, RADIUS } from '@/theme/tokens';
import { useAuth } from '@/context/AuthContext';
import { useResilience } from '@/services/resilienceStore';
import ScreenContainer from '@/components/layout/ScreenContainer';
import Header from '@/components/layout/Header';
import Card from '@/components/ui/Card';
import StatusBadge from '@/components/ui/StatusBadge';
import ProgressBar from '@/components/ui/ProgressBar';
import SectionHeading from '@/components/ui/SectionHeading';
import Button from '@/components/ui/Button';

export default function RoadReport() {
  const { roadSegmentId } = useLocalSearchParams();
  const { user } = useAuth();
  const { getRoadReport, confirmRoadReport } = useResilience();
  const id = Array.isArray(roadSegmentId) ? roadSegmentId[0] : roadSegmentId;
  const report = getRoadReport(id);
  const confirmerName = user?.name || 'You';
  const alreadyConfirmed = useMemo(
    () => Boolean(report?.confirmations?.some((item) => item.name === confirmerName)),
    [report, confirmerName]
  );

  if (!report) {
    return (
      <ScreenContainer>
        <Header title="Road report" showBack />
        <View className="flex-1 px-4 pt-6">
          <Text className="text-[15px] text-ink/70" style={{ fontFamily: FONT.medium }}>
            This report is no longer listed.
          </Text>
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <Header title={report.roadName} showBack />
      <ScrollView className="flex-1 px-4" contentContainerStyle={{ paddingBottom: 32 }}>
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
                {report.segment}
              </Text>
              <Text className="mt-1 text-[14px] text-ink/80" style={{ fontFamily: FONT.regular }}>
                {report.issue}
              </Text>
              {report.latitude == null ? (
                <Text className="mt-2 text-[12px] text-ink/70" style={{ fontFamily: FONT.medium }}>
                  Location unavailable
                </Text>
              ) : null}
            </View>
            <StatusBadge status={report.status} />
          </View>
        </Card>

        <View className="mt-5">
          <SectionHeading>Confidence</SectionHeading>
          <Text className="mb-2 text-[13px] text-ink/70" style={{ fontFamily: FONT.medium }}>
            {Math.round(report.confidence * 100)}% based on photo plus confirmations
          </Text>
          <ProgressBar value={report.confidence} status={report.status} />
        </View>

        <View className="mt-6">
          <SectionHeading>Confirmations</SectionHeading>
          {(report.confirmations || []).map((item) => (
            <Card key={item.id} variant="browse" className="mb-3">
              <Text className="text-[14px] text-ink" style={{ fontFamily: FONT.semibold }}>
                {item.name}
              </Text>
              <Text className="text-[12px] text-ink/70" style={{ fontFamily: FONT.regular }}>
                {item.time}
              </Text>
            </Card>
          ))}
        </View>

        <Button
          className="mt-2"
          label={alreadyConfirmed ? 'Confirmed' : 'Confirm this report'}
          disabled={alreadyConfirmed}
          onPress={() => confirmRoadReport(report.id, confirmerName)}
        />
      </ScrollView>
    </ScreenContainer>
  );
}
