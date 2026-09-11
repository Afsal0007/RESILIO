import { useCallback, useRef, useState } from 'react';
import { Image, KeyboardAvoidingView, Platform, ScrollView, Text, View } from 'react-native';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { FONT, RADIUS } from '@/theme/tokens';
import { requestUserCoords } from '@/hooks/useUserLocation';
import { analyzeRoadEvidence } from '@/services/ai';
import { reverseGeocodeRoad } from '@/services/osm';
import { useResilience } from '@/services/resilienceStore';
import ScreenContainer from '@/components/layout/ScreenContainer';
import Header from '@/components/layout/Header';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

export default function RoadScanReview() {
  const router = useRouter();
  const { photoUri } = useLocalSearchParams();
  const uri = Array.isArray(photoUri) ? photoUri[0] : photoUri;
  const { addRoadReport } = useResilience();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [roadName, setRoadName] = useState('');
  const [roadNameSource, setRoadNameSource] = useState(null);
  const [additionalDetail, setAdditionalDetail] = useState('');
  const [nameError, setNameError] = useState('');
  const [locatingRoad, setLocatingRoad] = useState(true);
  const editedRef = useRef(false);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      setLocatingRoad(true);
      (async () => {
        try {
          const coords = await requestUserCoords();
          if (!active) return;
          if (!coords) return;
          const result = await reverseGeocodeRoad(coords.latitude, coords.longitude);
          if (!active || editedRef.current || !result?.roadName) return;
          setRoadName(result.roadName);
          setRoadNameSource('auto');
        } finally {
          if (active) setLocatingRoad(false);
        }
      })();
      return () => {
        active = false;
      };
    }, [])
  );

  const onChangeRoadName = (value) => {
    editedRef.current = true;
    setRoadName(value);
    setRoadNameSource('manual');
    if (nameError) setNameError('');
  };

  const onSubmit = async () => {
    if (submitting) return;
    const trimmedName = roadName.trim();
    if (!trimmedName) {
      setNameError('Add a road name so others can find this report');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      const coords = await requestUserCoords();
      const capturedAt = new Date().toISOString();
      const analysis = await analyzeRoadEvidence(uri, {
        latitude: coords?.latitude,
        longitude: coords?.longitude,
      });
      const trimmedDetail = additionalDetail.trim();
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
        roadName: trimmedName,
        roadNameSource: roadNameSource || 'manual',
        segment: trimmedDetail || (coords ? 'Near your location' : 'Location unavailable'),
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
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView className="flex-1 px-4" contentContainerStyle={{ paddingBottom: 24 }}>
          {uri ? (
            <Image
              source={{ uri }}
              className="mt-2"
              style={{ height: 180, borderRadius: RADIUS.soft, width: '100%' }}
              resizeMode="cover"
            />
          ) : (
            <View className="mt-2 bg-paper-dim" style={{ height: 180, borderRadius: RADIUS.soft }} />
          )}
          <Text className="mt-4 text-[14px] text-ink/80" style={{ fontFamily: FONT.regular }}>
            {submitting
              ? 'Analyzing this frame for a possible observation. This can take a few seconds.'
              : 'This is a possible observation, not a confirmed closure. Community confirmation is still required.'}
          </Text>
          {locatingRoad ? (
            <Text className="mt-3 text-[13px] text-ink/70" style={{ fontFamily: FONT.medium }}>
              Locating road name…
            </Text>
          ) : null}
          {error ? (
            <Text className="mt-2 text-[13px] text-laterite" style={{ fontFamily: FONT.medium }}>
              {error}
            </Text>
          ) : null}
          <View className="mt-4">
            <Input
              label="Road name"
              value={roadName}
              onChangeText={onChangeRoadName}
              placeholder="Enter the road name or a nearby landmark"
              autoCapitalize="words"
              error={nameError}
            />
            <Input
              label="Additional detail (optional)"
              value={additionalDetail}
              onChangeText={setAdditionalDetail}
              placeholder="e.g. near the temple junction, before the bridge"
              autoCapitalize="sentences"
            />
          </View>
          <View className="mt-1" style={{ gap: 12 }}>
            <Button label="Submit report" loading={submitting} onPress={onSubmit} />
            <Button
              label="Retake"
              variant="secondary"
              disabled={submitting}
              onPress={() => router.replace('/roadscan')}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}
