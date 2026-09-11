import { Modal, Pressable, Text, View } from 'react-native';
import { FONT, RADIUS, COLORS } from '@/theme/tokens';
import { formatHourLabel, HEAVY_RAIN_MM } from '@/services/weather';
import Button from '@/components/ui/Button';
import SectionHeading from '@/components/ui/SectionHeading';

function formatTemp(tempC) {
  if (!Number.isFinite(tempC)) return '—';
  return `${Math.round(tempC)}°`;
}

function rainColor(mm) {
  return mm > HEAVY_RAIN_MM ? COLORS.laterite : undefined;
}

export default function WeatherSheet({ visible, onClose, current, forecast }) {
  const rainMm = Number(current?.rainLastHourMm ?? 0);
  const entries = Array.isArray(forecast) ? forecast : [];

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable className="flex-1 justify-end bg-ink/50" onPress={onClose}>
        <Pressable
          onPress={() => {}}
          className="w-full bg-paper px-5 pt-5 pb-6"
          style={{ borderTopLeftRadius: RADIUS.soft, borderTopRightRadius: RADIUS.soft }}
        >
          <Text className="text-[20px] text-ink" style={{ fontFamily: FONT.extrabold }}>
            {current ? formatTemp(current.tempC) : 'Weather'}
          </Text>
          <Text className="mt-1 text-[15px] text-ink/80 capitalize" style={{ fontFamily: FONT.medium }}>
            {current?.description || current?.condition || 'Current conditions unavailable'}
          </Text>
          {current && rainMm > 0 ? (
            <Text
              className="mt-2 text-[13px]"
              style={{ fontFamily: FONT.medium, color: rainColor(rainMm) || COLORS.ink }}
            >
              {rainMm.toFixed(1)} mm in the last hour
            </Text>
          ) : null}

          <View className="mt-5">
            <SectionHeading>Next 5 hours</SectionHeading>
            {entries.length === 0 ? (
              <Text className="text-[13px] text-ink/60" style={{ fontFamily: FONT.regular }}>
                Forecast unavailable right now
              </Text>
            ) : (
              entries.map((entry) => (
                <View key={entry.time.toISOString()} className="mb-3 flex-row items-baseline justify-between">
                  <Text className="text-[14px] text-ink" style={{ fontFamily: FONT.semibold }}>
                    {formatHourLabel(entry.time)}
                  </Text>
                  <Text className="flex-1 px-3 text-[13px] text-ink/80 capitalize" style={{ fontFamily: FONT.regular }}>
                    {entry.description || entry.condition}
                  </Text>
                  <Text className="text-[14px] text-ink" style={{ fontFamily: FONT.medium }}>
                    {formatTemp(entry.tempC)}
                    {entry.rainMm > 0 ? ` · ${entry.rainMm.toFixed(1)} mm` : ''}
                  </Text>
                </View>
              ))
            )}
          </View>

          <Button className="mt-2" label="Close" variant="secondary" onPress={onClose} />
        </Pressable>
      </Pressable>
    </Modal>
  );
}
