import { ActivityIndicator, Text, View } from 'react-native';

export default function SplashView({ showSpinner = true }) {
  return (
    <View className="flex-1 items-center justify-center bg-brand">
      <Text className="text-4xl font-bold text-white">RESILIO</Text>
      <Text className="mt-2 text-white">Kerala Climate Resilience</Text>
      {showSpinner ? <ActivityIndicator color="#ffffff" style={{ marginTop: 32 }} /> : null}
    </View>
  );
}
