import { Pressable, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { COLORS, FONT, TOUCH_MIN } from '@/theme/tokens';

export default function Header({
  title,
  showBack = false,
  variant = 'default',
  rightAction,
}) {
  const router = useRouter();
  const isStatus = variant === 'status';
  const fg = isStatus ? COLORS.paper : COLORS.ink;

  return (
    <View className={`flex-row items-center px-4 ${isStatus ? 'bg-backwater' : 'bg-paper'}`}>
      {showBack ? (
        <Pressable
          onPress={() => router.back()}
          className="mr-1 items-center justify-center"
          style={{ width: TOUCH_MIN, height: TOUCH_MIN }}
          hitSlop={4}
        >
          <ChevronLeft color={fg} size={26} />
        </Pressable>
      ) : (
        <View style={{ width: 8 }} />
      )}
      <Text
        className="flex-1 py-3"
        style={{ fontFamily: FONT.extrabold, fontSize: 22, color: fg }}
        numberOfLines={1}
      >
        {title}
      </Text>
      {rightAction ? <View className="ml-2 items-center justify-center" style={{ minWidth: TOUCH_MIN, minHeight: TOUCH_MIN }}>{rightAction}</View> : null}
    </View>
  );
}
