import { Text, View } from 'react-native';
import { FONT, STATUS_LABELS } from '@/theme/tokens';
import Chip from '@/components/ui/Chip';

const STATUSES = ['available', 'limited', 'unavailable'];

export default function StatusPicker({ label, value, onChange }) {
  return (
    <View className="mb-4">
      {label ? (
        <Text className="mb-1.5 text-[13px] text-ink" style={{ fontFamily: FONT.medium }}>
          {label}
        </Text>
      ) : null}
      <View className="flex-row flex-wrap">
        {STATUSES.map((status) => (
          <Chip
            key={status}
            label={STATUS_LABELS[status]}
            selected={value === status}
            onPress={() => onChange(status)}
          />
        ))}
      </View>
    </View>
  );
}
