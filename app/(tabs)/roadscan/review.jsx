import { useState } from 'react';
import { Image, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { FONT, RADIUS } from '@/theme/tokens';
import { requestUserCoords } from '@/hooks/useUserLocation';
import { analyzeRoadEvidence } from '@/services/ai';
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
  const [error, setError] = useState('');

  const onSubmit = async () => {
    if (submitting) return;
    setSubmitting(true);
    setError('');
    try {
      const coords = await requestUserCoords();
      const capturedAt = new Date().toISOString();
      const analysis = await analyzeRoadEvidence(uri, {
        latitude: coords?.latitude,
        longitude: coords?.longitude,
      });
      const report = await addRoadReport({
        evidenceUri: uri || null,
        latitude: coords?.latitude ?? null,
        longitude: coords?.longitude ?? null,
        capturedAt,
        detectedIssue: analysis.label,
        label: analysis.label,
        issue: analysis.issue,
        confidence: analysis.confidence,
        source: analysis.source,
        status: analysis.status,
        aiAnalysis: analysis,
        confirmations: [],
        scannedAt: 'Just now',
        roadName: 'RoadScan report',
        segment: coords ? 'Near your location' : 'Location unavailable',
      });
      router.replace({
        pathname: '/roadscan/result',
        params: { reportId: report.id },
      });
    } catch {
      setError('Could not save this scan. Try again.');
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
          {submitting
            ? 'Analyzing this frame for a possible observation. This can take a few seconds.'
            : 'This is a possible observation, not a confirmed closure. Community confirmation is still required.'}
        </Text>
        {error ? (
          <Text className="mt-2 text-[13px] text-laterite" style={{ fontFamily: FONT.medium }}>
            {error}
          </Text>
        ) : null}
        <View className="mt-5" style={{ gap: 12 }}>
          <Button label="Submit report" loading={submitting} onPress={onSubmit} />
          <Button
            label="Retake"
            variant="secondary"
            disabled={submitting}
            onPress={() => router.replace('/roadscan')}
          />
        </View>
      </View>
    </ScreenContainer>
  );
}
