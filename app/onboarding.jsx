import { Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { FONT } from '@/theme/tokens';
import ScreenContainer from '@/components/layout/ScreenContainer';
import Header from '@/components/layout/Header';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

export default function Onboarding() {
  const router = useRouter();

  return (
    <ScreenContainer>
      <Header title="Welcome" />
      <View className="flex-1 px-4 pt-4">
        <Card variant="browse" className="mb-3">
          <Text className="text-[16px] text-ink" style={{ fontFamily: FONT.bold }}>
            See camps and roads without an account
          </Text>
          <Text className="mt-2 text-[14px] text-ink/80" style={{ fontFamily: FONT.regular }}>
            Login only when you submit data: SOS, scans, offers, or volunteer forms.
          </Text>
        </Card>
        <Card variant="browse" className="mb-6">
          <Text className="text-[16px] text-ink" style={{ fontFamily: FONT.bold }}>
            Built for Kerala monsoon response
          </Text>
          <Text className="mt-2 text-[14px] text-ink/80" style={{ fontFamily: FONT.regular }}>
            Floods, landslides, camps, and local volunteers in one place.
          </Text>
        </Card>
        <Button label="Continue" onPress={() => router.replace('/role-select')} />
        <Button className="mt-3" variant="ghost" label="Skip to home" onPress={() => router.replace('/home')} />
      </View>
    </ScreenContainer>
  );
}
