import { Pressable, Text } from 'react-native';
import { COLORS, FONT, RADIUS } from '@/theme/tokens';

export default function Chip({ label, selected = false, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      className={`mr-2 items-center justify-center px-3 ${
        selected ? 'bg-backwater' : 'bg-paper'
      }`}
      style={{
        minHeight: 44,
        borderRadius: RADIUS.pill,
        borderWidth: 1,
        borderColor: selected ? COLORS.backwater : COLORS.paperDim,
      }}
    >
      <Text
        className={selected ? 'text-paper' : 'text-ink'}
        style={{ fontFamily: FONT.semibold, fontSize: 13 }}
      >
        {label}
      </Text>
    </Pressable>
  );
}
