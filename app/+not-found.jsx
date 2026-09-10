import { Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { FONT } from '@/theme/tokens';
import Button from '@/components/ui/Button';
import ScreenContainer from '@/components/layout/ScreenContainer';

export default function NotFoundScreen() {
  const router = useRouter();

  return (
    <ScreenContainer>
      <View className="flex-1 items-center justify-center px-6">
        <Text className="text-center text-[20px] text-ink" style={{ fontFamily: FONT.extrabold }}>
          This screen does not exist.
        </Text>
        <View className="mt-5 w-full">
          <Button label="Go to Home" onPress={() => router.replace('/home')} />
        </View>
      </View>
    </ScreenContainer>
  );
}
