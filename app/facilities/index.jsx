import { ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Hospital } from 'lucide-react-native';
import { useFacilities } from '@/services/resilienceStore';
import ScreenContainer from '@/components/layout/ScreenContainer';
import Header from '@/components/layout/Header';
import EmptyState from '@/components/layout/EmptyState';
import FacilityCard from '@/components/cards/FacilityCard';

export default function Facilities() {
  const router = useRouter();
  const facilities = useFacilities();

  return (
    <ScreenContainer>
      <Header title="Facilities" showBack />
      {facilities.length === 0 ? (
        <EmptyState icon={Hospital} message="No facilities listed for this district." />
      ) : (
        <ScrollView className="flex-1 px-4" contentContainerStyle={{ paddingBottom: 24, paddingTop: 4 }}>
          {facilities.map((facility) => (
            <FacilityCard
              key={facility.id}
              facility={facility}
              onPress={() => router.push(`/facilities/${facility.id}`)}
            />
          ))}
        </ScrollView>
      )}
    </ScreenContainer>
  );
}
