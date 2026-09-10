import { Modal, Pressable, Text, View } from 'react-native';
import { useRouter } from 'expo-router';

export default function LoginPromptModal({
  visible,
  onClose,
  intendedRoute = '/home',
  actionLabel = 'do this',
}) {
  const router = useRouter();

  const goTo = (pathname) => {
    onClose?.();
    router.push({
      pathname,
      params: { redirect: intendedRoute },
    });
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View className="flex-1 items-center justify-center bg-black/40 px-6">
        <View className="w-full rounded-2xl bg-white p-5">
          <Text className="text-xl font-bold text-gray-900">Login to do this</Text>
          <Text className="mt-2 text-sm text-gray-600">
            You can browse emergency info as a guest. Sign in to {actionLabel}.
          </Text>

          <Pressable
            className="mt-5 items-center rounded-xl bg-brand py-3"
            onPress={() => goTo('/login')}
          >
            <Text className="font-semibold text-white">Login</Text>
          </Pressable>

          <Pressable
            className="mt-3 items-center rounded-xl border border-brand py-3"
            onPress={() => goTo('/signup')}
          >
            <Text className="font-semibold text-brand">Sign Up</Text>
          </Pressable>

          <Pressable className="mt-3 items-center py-3" onPress={onClose}>
            <Text className="font-medium text-gray-500">Continue Browsing</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}
