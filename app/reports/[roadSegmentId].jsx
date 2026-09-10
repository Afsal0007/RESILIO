import { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { getRoadReport } from '@/mock-data/road-reports';
import { FONT } from '@/theme/tokens';
import ScreenContainer from '@/components/layout/ScreenContainer';
import Header from '@/components/layout/Header';
import Card from '@/components/ui/Card';
import StatusBadge from '@/components/ui/StatusBadge';
import ProgressBar from '@/components/ui/ProgressBar';
import SectionHeading from '@/components/ui/SectionHeading';
import Button from '@/components/ui/Button';

export default function RoadReport() {
  const { roadSegmentId } = useLocalSearchParams();
  const report = getRoadReport(roadSegmentId);
  const [confirmed, setConfirmed] = useState(false);
  const confirmations = confirmed
    ? [...report.confirmations, { id: 'you', name: 'You', time: 'Just now' }]
    : report.confirmations;

  return (
    <ScreenContainer>
      <Header title={report.roadName} showBack />
      <ScrollView className="flex-1 px-4" contentContainerStyle={{ paddingBottom: 32 }}>
        <Card variant="alert" status={report.status} className="mt-2">
          <View className="flex-row items-start justify-between">
            <View className="flex-1 pr-3">
              <Text className="text-[16px] text-ink" style={{ fontFamily: FONT.bold }}>
                {report.segment}
              </Text>
              <Text className="mt-1 text-[14px] text-ink/80" style={{ fontFamily: FONT.regular }}>
                {report.issue}
              </Text>
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
          {confirmations.map((item) => (
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
          label={confirmed ? 'Confirmed' : 'Confirm this report'}
          disabled={confirmed}
          onPress={() => setConfirmed(true)}
        />
      </ScrollView>
    </ScreenContainer>
  );
}
