import { View } from 'react-native';
import { COLORS, RADIUS, STATUS_HEX } from '@/theme/tokens';

export default function ProgressBar({ value = 0, status, className = '' }) {
  const pct = Math.max(0, Math.min(100, Math.round(value * 100)));
  const fill = status ? STATUS_HEX[status] : COLORS.backwater;

  return (
    <View className={`h-2 w-full bg-paper overflow-hidden ${className}`} style={{ borderRadius: RADIUS.pill }}>
      <View className="h-2" style={{ width: `${pct}%`, backgroundColor: fill, borderRadius: RADIUS.pill }} />
    </View>
  );
}
