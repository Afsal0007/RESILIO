import { Modal, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { FONT, RADIUS } from '@/theme/tokens';
import Button from '@/components/ui/Button';

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
      <View className="flex-1 items-center justify-center bg-ink/50 px-6">
        <View className="w-full bg-paper p-5" style={{ borderRadius: RADIUS.soft }}>
          <Text className="text-[20px] text-ink" style={{ fontFamily: FONT.extrabold }}>
            Login to do this
          </Text>
          <Text className="mt-2 text-[14px] text-ink/80" style={{ fontFamily: FONT.regular }}>
            You can browse emergency info as a guest. Sign in to {actionLabel}.
          </Text>
          <View className="mt-5" style={{ gap: 12 }}>
            <Button label="Login" onPress={() => goTo('/login')} />
            <Button label="Sign Up" variant="secondary" onPress={() => goTo('/signup')} />
            <Button label="Continue Browsing" variant="ghost" onPress={onClose} />
          </View>
        </View>
      </View>
    </Modal>
  );
}
