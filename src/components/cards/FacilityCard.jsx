import { Text, View } from 'react-native';
import { FONT } from '@/theme/tokens';
import Card from '@/components/ui/Card';
import StatusBadge from '@/components/ui/StatusBadge';

export default function FacilityCard({ facility, onPress }) {
  return (
    <Card variant="browse" onPress={onPress} className="mb-3">
      <View className="flex-row items-start justify-between">
        <View className="flex-1 pr-3">
          <Text className="text-[16px] text-ink" style={{ fontFamily: FONT.bold }}>
            {facility.name}
          </Text>
          <Text className="mt-0.5 text-[13px] text-ink/70" style={{ fontFamily: FONT.regular }}>
            {facility.type} · {facility.location}
          </Text>
        </View>
        <StatusBadge status={facility.urgency} label={facility.urgency === 'unavailable' ? 'Urgent' : undefined} />
      </View>
      <Text className="mt-2 text-[13px] text-ink/80" style={{ fontFamily: FONT.medium }}>
        {facility.needs?.[0]?.name ? `Need: ${facility.needs[0].name}` : facility.district}
      </Text>
    </Card>
  );
}
