import { Text, View } from 'react-native';
import { FONT, RADIUS, STATUS_HEX, STATUS_LABELS } from '@/theme/tokens';

export default function StatusBadge({ status = 'available', label }) {
  const color = STATUS_HEX[status] || STATUS_HEX.available;
  const text = label || STATUS_LABELS[status] || status;

  return (
    <View
      className="flex-row items-center self-start bg-paper px-2.5"
      style={{ height: 24, borderRadius: RADIUS.pill }}
    >
      <View className="mr-1.5 h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
      <Text className="text-[11px] text-ink" style={{ fontFamily: FONT.semibold }}>
        {text}
      </Text>
    </View>
  );
}
