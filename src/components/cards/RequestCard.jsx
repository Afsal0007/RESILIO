import { Text, View } from 'react-native';
import { FONT } from '@/theme/tokens';
import Card from '@/components/ui/Card';
import StatusBadge from '@/components/ui/StatusBadge';

export default function RequestCard({ request, onPress, variant = 'browse' }) {
  return (
    <Card variant={variant} status={request.status} onPress={onPress} className="mb-3">
      <View className="flex-row items-start justify-between">
        <View className="flex-1 pr-3">
          <Text className="text-[16px] text-ink" style={{ fontFamily: FONT.bold }}>
            {request.title}
          </Text>
          <Text className="mt-0.5 text-[13px] text-ink/70" style={{ fontFamily: FONT.regular }}>
            {request.type} · {request.location}
          </Text>
        </View>
        <StatusBadge status={request.status} />
      </View>
      <Text className="mt-2 text-[12px] text-ink/70" style={{ fontFamily: FONT.medium }}>
        {request.requester} · {request.createdAt}
      </Text>
    </Card>
  );
}
