import { Link } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { useApp } from '@/context/AppContext';

export default function Home() {
  const { showLoginPrompt } = useApp();

  return (
    <View className="flex-1 bg-white p-4">
      <Text className="text-xl font-bold">Home</Text>
      <Text className="text-sm text-gray-500">app/(tabs)/home</Text>

      <Pressable
        className="mt-6 items-center rounded-xl bg-status-red py-3"
        onPress={() =>
          showLoginPrompt({
            intendedRoute: '/sos',
            actionLabel: 'send an SOS request',
          })
        }
      >
        <Text className="font-semibold text-white">Send SOS</Text>
      </Pressable>

      <View className="mt-6 flex-row flex-wrap">
        {[
          ['Login', '/login'],
          ['Sign up', '/signup'],
          ['Settings', '/settings'],
          ['Role select', '/role-select'],
          ['Camps', '/camps'],
          ['Resources', '/resources'],
          ['Facilities', '/facilities'],
          ['Dashboard', '/dashboard'],
        ].map(([label, href]) => (
          <Link key={href} href={href} asChild>
            <Pressable className="mb-2 mr-2 rounded-full border border-gray-200 px-3 py-2">
              <Text className="text-sm text-gray-700">{label}</Text>
            </Pressable>
          </Link>
        ))}
      </View>
    </View>
  );
}
