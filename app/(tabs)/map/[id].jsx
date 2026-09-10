import { Text } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { getCamp } from '@/mock-data/camps';
import { FONT } from '@/theme/tokens';
import ScreenContainer from '@/components/layout/ScreenContainer';
import Header from '@/components/layout/Header';
import Card from '@/components/ui/Card';
import StatusBadge from '@/components/ui/StatusBadge';
import Button from '@/components/ui/Button';
import MapPlaceholder from '@/components/map/MapPlaceholder';

export default function MapPin() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const camp = getCamp(id);

  return (
    <ScreenContainer>
      <Header title={camp.name} showBack />
      <MapPlaceholder />
      <Card variant="browse" className="m-4">
        <Text className="text-[16px] text-ink" style={{ fontFamily: FONT.bold }}>
          {camp.name}
        </Text>
        <Text className="mt-1 text-[13px] text-ink/70" style={{ fontFamily: FONT.regular }}>
          {camp.location}
        </Text>
        <StatusBadge status={camp.status} />
        <Button className="mt-4" label="Open camp details" onPress={() => router.push(`/camps/${camp.id}`)} />
      </Card>
    </ScreenContainer>
  );
}
