import { Pressable, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { HeartHandshake, SkipForward, Siren } from 'lucide-react-native';
import { useApp } from '@/context/AppContext';
import Header from '@/components/layout/Header';
import ScreenContainer from '@/components/layout/ScreenContainer';

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
      <View className="flex-1 px-4 py-6">
        <Text className="text-2xl font-bold text-gray-900">Choose a home view</Text>
        <Text className="mt-2 mb-6 text-sm text-gray-500">
          This is only a UI preference. It does not change your account or permissions.
        </Text>

        <Pressable
          className="mb-3 flex-row items-center rounded-2xl border border-gray-200 p-4"
          onPress={() => choose('need')}
        >
          <Siren color="#0ea5e9" size={28} />
          <View className="ml-3 flex-1">
            <Text className="text-base font-semibold text-gray-900">I Need Help</Text>
            <Text className="text-sm text-gray-500">Show nearby camps, alerts, and SOS first.</Text>
          </View>
        </Pressable>

        <Pressable
          className="mb-3 flex-row items-center rounded-2xl border border-gray-200 p-4"
          onPress={() => choose('give')}
        >
          <HeartHandshake color="#0ea5e9" size={28} />
          <View className="ml-3 flex-1">
            <Text className="text-base font-semibold text-gray-900">I Can Help</Text>
            <Text className="text-sm text-gray-500">Show volunteer and resource actions first.</Text>
          </View>
        </Pressable>

        <Pressable
          className="mt-4 flex-row items-center justify-center py-3"
          onPress={() => choose(null)}
        >
          <SkipForward color="#64748b" size={18} />
          <Text className="ml-2 font-medium text-gray-500">Skip, I&apos;m just browsing</Text>
        </Pressable>
      </View>
    </ScreenContainer>
  );
}
