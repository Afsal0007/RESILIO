import { Pressable, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Camera } from 'lucide-react-native';
import { COLORS, FONT, RADIUS } from '@/theme/tokens';
import ScreenContainer from '@/components/layout/ScreenContainer';
import Header from '@/components/layout/Header';
import Button from '@/components/ui/Button';

export default function RoadScanCapture() {
  const router = useRouter();

  return (
    <ScreenContainer>
      <Header title="RoadScan" />
      <View className="flex-1 px-4 pb-6">
        <Text className="mt-2 text-[14px] text-ink/80" style={{ fontFamily: FONT.regular }}>
          Stand on the shoulder. Frame the blocked or flooded stretch. Keep the road in the centre of the shot.
        </Text>
        <View
          className="mt-4 flex-1 items-center justify-center bg-ink"
          style={{ borderRadius: RADIUS.soft }}
        >
          <Camera color={COLORS.paper} size={40} />
          <Text className="mt-3 text-paper" style={{ fontFamily: FONT.medium }}>
            Camera preview
          </Text>
        </View>
        <Pressable
          onPress={() => router.push('/roadscan/review')}
          className="mt-4 self-center items-center justify-center bg-paper"
          style={{
            width: 72,
            height: 72,
            borderRadius: RADIUS.pill,
            borderWidth: 4,
            borderColor: COLORS.backwater,
          }}
        >
          <View className="h-14 w-14 rounded-full bg-backwater" />
        </Pressable>
        <Button className="mt-3" variant="ghost" label="Open scan history" onPress={() => router.push('/roadscan/history')} />
      </View>
    </ScreenContainer>
  );
}
