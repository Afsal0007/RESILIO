import { Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { HeartHandshake, Siren } from 'lucide-react-native';
import { COLORS, FONT } from '@/theme/tokens';
import { useApp } from '@/context/AppContext';
import ScreenContainer from '@/components/layout/ScreenContainer';
import Header from '@/components/layout/Header';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

export default function RoleSelect() {
  const router = useRouter();
  const { setHelpMode } = useApp();

  const choose = async (mode) => {
    await setHelpMode(mode);
    router.replace('/home');
  };

  return (
    <ScreenContainer>
      <Header title="How can we help?" />
      <View className="flex-1 px-4 pt-4">
        <Text className="mb-4 text-[14px] text-ink/80" style={{ fontFamily: FONT.regular }}>
          This only changes the home view. It is not your account role.
        </Text>
        <Card variant="browse" className="mb-3" onPress={() => choose('need')}>
          <View className="flex-row items-center">
            <Siren color={COLORS.backwater} size={26} />
            <View className="ml-3 flex-1">
              <Text className="text-[16px] text-ink" style={{ fontFamily: FONT.bold }}>
                I Need Help
              </Text>
              <Text className="mt-1 text-[13px] text-ink/70" style={{ fontFamily: FONT.regular }}>
                Camps, alerts, and SOS first.
              </Text>
            </View>
          </View>
        </Card>
        <Card variant="browse" className="mb-6" onPress={() => choose('give')}>
          <View className="flex-row items-center">
            <HeartHandshake color={COLORS.monsoon} size={26} />
            <View className="ml-3 flex-1">
              <Text className="text-[16px] text-ink" style={{ fontFamily: FONT.bold }}>
                I Can Help
              </Text>
              <Text className="mt-1 text-[13px] text-ink/70" style={{ fontFamily: FONT.regular }}>
                Volunteer and resource actions first.
              </Text>
            </View>
          </View>
        </Card>
        <Button label="Skip, I'm just browsing" variant="ghost" onPress={() => choose(null)} />
      </View>
    </ScreenContainer>
  );
}
