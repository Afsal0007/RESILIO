import { Text } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { FONT, STATUS_HEX } from '@/theme/tokens';
import { campPinStatus, useCamps } from '@/services/campsStore';
import ScreenContainer from '@/components/layout/ScreenContainer';
import Header from '@/components/layout/Header';
import Card from '@/components/ui/Card';
import StatusBadge from '@/components/ui/StatusBadge';
import Button from '@/components/ui/Button';
import ResilioMap from '@/components/map/ResilioMap';

export default function MapPin() {
  const { id } = useLocalSearchParams();
  const campId = Array.isArray(id) ? id[0] : id;
  const router = useRouter();
  const { getCamp } = useCamps();
  const camp = getCamp(campId);

  if (!camp) {
    return (
      <ScreenContainer>
        <Header title="Map pin" showBack />
        <Text className="px-4 pt-6 text-[15px] text-ink/70" style={{ fontFamily: FONT.medium }}>
          This pin is no longer listed.
        </Text>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <Header title={camp.name} showBack />
      <ResilioMap
        initialRegion={{
          latitude: camp.lat,
          longitude: camp.lng,
          latitudeDelta: 0.04,
          longitudeDelta: 0.04,
        }}
        markers={[
          {
            id: camp.id,
            title: camp.name,
            coordinate: { latitude: camp.lat, longitude: camp.lng },
            pinColor: STATUS_HEX[campPinStatus(camp)],
          },
        ]}
      />
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
