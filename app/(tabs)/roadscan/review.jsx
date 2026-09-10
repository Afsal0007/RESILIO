import { Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { FONT, RADIUS } from '@/theme/tokens';
import ScreenContainer from '@/components/layout/ScreenContainer';
import Header from '@/components/layout/Header';
import Button from '@/components/ui/Button';

export default function RoadScanReview() {
  const router = useRouter();

  return (
    <ScreenContainer>
      <Header title="Review scan" showBack />
      <View className="flex-1 px-4 pb-6">
        <View className="mt-2 flex-1 bg-paper-dim" style={{ borderRadius: RADIUS.soft }} />
        <Text className="mt-4 text-[14px] text-ink/80" style={{ fontFamily: FONT.regular }}>
          Submit this frame if the water, debris, or closure is clear. Retake if the road is cut off.
        </Text>
        <View className="mt-5" style={{ gap: 12 }}>
          <Button label="Submit report" onPress={() => router.replace('/roadscan/result')} />
          <Button label="Retake" variant="secondary" onPress={() => router.replace('/roadscan')} />
        </View>
      </View>
    </ScreenContainer>
  );
}
