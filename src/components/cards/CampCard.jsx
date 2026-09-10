import { Text, View } from 'react-native';
import { FONT } from '@/theme/tokens';
import StatusBadge from '@/components/ui/StatusBadge';
import CampSourceBadge from '@/components/ui/CampSourceBadge';
import ProgressBar from '@/components/ui/ProgressBar';
import Card from '@/components/ui/Card';

export default function CampCard({ camp, onPress, variant = 'browse' }) {
  const occupancy = camp.capacity ? camp.occupied / camp.capacity : 0;
  const distanceLabel =
    camp.distanceKm == null
      ? null
      : camp.distanceKm < 1
        ? 'Nearby'
        : `${camp.distanceKm} km`;

  return (
    <Card variant={variant} status={camp.status} onPress={onPress} className="mb-3">
      <View className="flex-row items-start justify-between">
        <View className="flex-1 pr-3">
          <Text className="text-[16px] text-ink" style={{ fontFamily: FONT.bold }}>
            {camp.name}
          </Text>
          <Text className="mt-0.5 text-[13px] text-ink/70" style={{ fontFamily: FONT.regular }}>
            {camp.location}{distanceLabel ? ` · ${distanceLabel}` : ''}
          </Text>
        </View>
        <StatusBadge status={camp.status} />
      </View>
      <View className="mt-2">
        <CampSourceBadge camp={camp} />
      </View>
      <View className="mt-3 flex-row items-center justify-between">
        <Text className="text-[12px] text-ink/70" style={{ fontFamily: FONT.medium }}>
          {camp.occupied}/{camp.capacity} people
        </Text>
        <Text className="text-[12px] text-ink/70" style={{ fontFamily: FONT.medium }}>
          {Math.round(occupancy * 100)}% full
        </Text>
      </View>
      <ProgressBar className="mt-2" value={occupancy} status={camp.status} />
    </Card>
  );
}
