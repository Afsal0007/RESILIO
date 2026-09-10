import { Pressable, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';

export default function Header({ title, showBack = false }) {
  const router = useRouter();

  return (
    <View className="flex-row items-center border-b border-gray-200 bg-white px-4 py-3">
      {showBack ? (
        <Pressable onPress={() => router.back()} className="mr-2 p-1" hitSlop={8}>
          <ChevronLeft color="#0f172a" size={24} />
        </Pressable>
      ) : null}
      <Text className="flex-1 text-lg font-bold text-gray-900">{title}</Text>
    </View>
  );
}
