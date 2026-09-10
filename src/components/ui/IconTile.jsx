import { Pressable, Text } from 'react-native';
import { COLORS, FONT, RADIUS } from '@/theme/tokens';

export default function IconTile({ icon: Icon, label, selected = false, onPress, className = '' }) {
  return (
    <Pressable
      onPress={onPress}
      className={`mb-3 items-center justify-center px-2 py-3 ${className}`}
      style={{
        width: '31%',
        minHeight: 88,
        borderRadius: RADIUS.soft,
        borderWidth: 1.5,
        borderColor: selected ? COLORS.backwater : COLORS.paperDim,
        backgroundColor: selected ? COLORS.paper : COLORS.white,
      }}
    >
      {Icon ? <Icon color={selected ? COLORS.backwater : COLORS.ink} size={22} /> : null}
      <Text
        className="mt-2 text-center text-[11px] text-ink"
        style={{ fontFamily: FONT.semibold }}
        numberOfLines={2}
      >
        {label}
      </Text>
    </Pressable>
  );
}
