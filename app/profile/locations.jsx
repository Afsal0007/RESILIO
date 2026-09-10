import { ScrollView, Text } from 'react-native';
import { MapPin } from 'lucide-react-native';
import { SAVED_LOCATIONS } from '@/mock-data/profile';
import { FONT } from '@/theme/tokens';
import useGuardedAction from '@/hooks/useGuardedAction';
import ScreenContainer from '@/components/layout/ScreenContainer';
import Header from '@/components/layout/Header';
import EmptyState from '@/components/layout/EmptyState';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

export default function Locations() {
  const requireAuth = useGuardedAction();
  const addLocation = () => requireAuth('/profile/location-add', 'add a location');

  return (
    <ScreenContainer>
      <Header title="Saved locations" showBack />
      {SAVED_LOCATIONS.length === 0 ? (
        <EmptyState
          icon={MapPin}
          message="No saved places yet."
          actionLabel="Add a location"
          onAction={addLocation}
        />
      ) : (
        <ScrollView className="flex-1 px-4" contentContainerStyle={{ paddingBottom: 24 }}>
          {SAVED_LOCATIONS.map((place) => (
            <Card key={place.id} variant="browse" className="mb-3">
              <Text className="text-[15px] text-ink" style={{ fontFamily: FONT.bold }}>
                {place.label}
              </Text>
              <Text className="mt-1 text-[13px] text-ink/70" style={{ fontFamily: FONT.regular }}>
                {place.address}
              </Text>
            </Card>
          ))}
          <Button label="Add a location" onPress={addLocation} />
        </ScrollView>
      )}
    </ScreenContainer>
  );
}
