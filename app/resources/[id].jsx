import { Text, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { getResource } from '@/mock-data/resources';
import { FONT } from '@/theme/tokens';
import ScreenContainer from '@/components/layout/ScreenContainer';
import Header from '@/components/layout/Header';
import Card from '@/components/ui/Card';
import StatusBadge from '@/components/ui/StatusBadge';
import Button from '@/components/ui/Button';

export default function ResourceDetail() {
  const { id } = useLocalSearchParams();
  const resource = getResource(id);

  return (
    <ScreenContainer>
      <Header title="Resource" showBack />
      <View className="flex-1 px-4 pt-2">
        <Card variant="browse">
          <View className="flex-row items-start justify-between">
            <Text className="flex-1 pr-3 text-[18px] text-ink" style={{ fontFamily: FONT.extrabold }}>
              {resource.name}
            </Text>
            <StatusBadge status={resource.status} />
          </View>
          <Text className="mt-2 text-[14px] text-ink/80" style={{ fontFamily: FONT.regular }}>
            {resource.quantity} {resource.unit} · {resource.category}
          </Text>
          <Text className="mt-3 text-[14px] text-ink" style={{ fontFamily: FONT.medium }}>
            {resource.provider}
          </Text>
          <Text className="text-[13px] text-ink/70" style={{ fontFamily: FONT.regular }}>
            {resource.location}
          </Text>
          <Text className="mt-3 text-[14px] text-ink/80" style={{ fontFamily: FONT.regular }}>
            {resource.notes}
          </Text>
        </Card>
        <Button className="mt-5" label={`Call ${resource.contact}`} onPress={() => {}} />
      </View>
    </ScreenContainer>
  );
}
