import { ScrollView, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Tent } from 'lucide-react-native';
import { useAuth } from '@/context/AuthContext';
import { isOrganizationRole } from '@/constants/roles';
import { useCamps } from '@/services/campsStore';
import useSortedCamps from '@/hooks/useSortedCamps';
import ScreenContainer from '@/components/layout/ScreenContainer';
import Header from '@/components/layout/Header';
import EmptyState from '@/components/layout/EmptyState';
import CampCard from '@/components/cards/CampCard';
import Button from '@/components/ui/Button';

export default function Camps() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const { camps } = useCamps();
  const nearbyCamps = useSortedCamps(camps);
  const canRegister = isAuthenticated && isOrganizationRole(user?.role);

  return (
    <ScreenContainer>
      <Header title="Camps" showBack />
      {canRegister ? (
        <View className="px-4 pb-2 pt-1">
          <Button label="Register a camp" onPress={() => router.push('/camps/register')} />
        </View>
      ) : null}
      {nearbyCamps.length === 0 ? (
        <EmptyState icon={Tent} message="No open camps in this district yet." />
      ) : (
        <ScrollView className="flex-1 px-4" contentContainerStyle={{ paddingBottom: 24, paddingTop: 4 }}>
          {nearbyCamps.map((camp) => (
            <CampCard key={camp.id} camp={camp} onPress={() => router.push(`/camps/${camp.id}`)} />
          ))}
        </ScrollView>
      )}
    </ScreenContainer>
  );
}
