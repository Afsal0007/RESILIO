import { Pressable, Text, View } from 'react-native';
import { Cloud } from 'lucide-react-native';
import { COLORS, FONT, RADIUS } from '@/theme/tokens';

function formatTemp(tempC) {
  if (!Number.isFinite(tempC)) return '—';
  return `${Math.round(tempC)}°`;
}

export default function WeatherButton({ current, loading, onPress }) {
  if (!current && !loading) return null;

  if (!current) {
    return (
      <View
        className="mt-3 flex-row items-center self-start bg-paper-dim px-3"
        style={{ height: 32, borderRadius: RADIUS.pill }}
        accessibilityLabel="Loading weather"
      >
        <Cloud color={COLORS.ink} size={14} />
        <Text className="ml-1.5 text-[12px] text-ink/50" style={{ fontFamily: FONT.medium }}>
          Weather
        </Text>
      </View>
    );
  }

  const label = `${formatTemp(current.tempC)} · ${current.condition || 'Weather'}`;

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Weather ${label}`}
      className="mt-3 flex-row items-center self-start bg-paper-dim px-3"
      style={{ height: 32, borderRadius: RADIUS.pill }}
    >
      <Cloud color={COLORS.backwater} size={14} />
      <Text className="ml-1.5 text-[12px] text-ink" style={{ fontFamily: FONT.semibold }}>
        {label}
      </Text>
    </Pressable>
  );
}
