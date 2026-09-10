import { Text, View } from 'react-native';

export default function PlaceholderScreen({ title, path }) {
  return (
    <View className="flex-1 bg-white p-4">
      <Text className="text-xl font-bold">{title}</Text>
      <Text className="text-sm text-gray-500">{path}</Text>
    </View>
  );
}
