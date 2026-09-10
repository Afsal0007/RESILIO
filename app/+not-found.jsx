import { Link, Stack } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Not found' }} />
      <View className="flex-1 items-center justify-center bg-white p-6">
        <Text className="text-xl font-bold">This screen doesn&apos;t exist.</Text>
        <Link href="/home" asChild>
          <Pressable className="mt-4">
            <Text className="text-brand">Go to Home</Text>
          </Pressable>
        </Link>
      </View>
    </>
  );
}
