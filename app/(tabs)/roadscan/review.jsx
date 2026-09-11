import { useState } from 'react';
import { Image, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { FONT, RADIUS } from '@/theme/tokens';
import { requestUserCoords } from '@/hooks/useUserLocation';
import { useResilience } from '@/services/resilienceStore';
import ScreenContainer from '@/components/layout/ScreenContainer';
import Header from '@/components/layout/Header';
import Button from '@/components/ui/Button';

export default function RoadScanReview() {
  const router = useRouter();
  const { photoUri } = useLocalSearchParams();
  const uri = Array.isArray(photoUri) ? photoUri[0] : photoUri;
  const { addRoadReport } = useResilience();
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async () => {
    if (submitting) return;
    setSubmitting(true);
    try {
      const coords = await requestUserCoords();
      const capturedAt = new Date().toISOString();
      const report = await addRoadReport({
        evidenceUri: uri || null,
        latitude: coords?.latitude ?? null,
        longitude: coords?.longitude ?? null,
        capturedAt,
        detectedIssue: 'possible_flooding',
        confidence: 0.4,
        status: 'limited',
        confirmations: [],
        scannedAt: 'Just now',
        roadName: 'RoadScan report',
        segment: coords ? 'Near your location' : 'Location unavailable',
      });
      router.replace({
        pathname: '/roadscan/result',
        params: { reportId: report.id },
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScreenContainer>
      <Header title="Review scan" showBack />
      <View className="flex-1 px-4 pb-6">
        {uri ? (
          <Image
            source={{ uri }}
            className="mt-2 flex-1"
            style={{ borderRadius: RADIUS.soft, width: '100%' }}
            resizeMode="cover"
          />
        ) : (
          <View className="mt-2 flex-1 bg-paper-dim" style={{ borderRadius: RADIUS.soft }} />
        )}
        <Text className="mt-4 text-[14px] text-ink/80" style={{ fontFamily: FONT.regular }}>
          Submit this frame if the water, debris, or closure is clear. Retake if the road is cut off.
        </Text>
        <View className="mt-5" style={{ gap: 12 }}>
          <Button label="Submit report" loading={submitting} onPress={onSubmit} />
          <Button label="Retake" variant="secondary" onPress={() => router.replace('/roadscan')} />
        </View>
      </View>
    </ScreenContainer>
  );
}
