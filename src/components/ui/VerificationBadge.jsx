import { Text, View } from 'react-native';
import { Shield } from 'lucide-react-native';
import { COLORS, FONT, RADIUS } from '@/theme/tokens';

export default function VerificationBadge({ verified = false }) {
  const color = verified ? COLORS.leaf : '#7A8A86';

  return (
    <View
      className="flex-row items-center self-start bg-paper px-2.5"
      style={{ height: 24, borderRadius: RADIUS.pill }}
    >
      <Shield color={color} size={12} />
      <Text className="ml-1 text-[11px] text-ink" style={{ fontFamily: FONT.semibold, color }}>
        {verified ? 'Verified' : 'Pending verification'}
      </Text>
    </View>
  );
}
