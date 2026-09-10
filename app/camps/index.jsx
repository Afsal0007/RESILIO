import { ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Tent } from 'lucide-react-native';
import { CAMPS } from '@/mock-data/camps';
import ScreenContainer from '@/components/layout/ScreenContainer';
import Header from '@/components/layout/Header';
import EmptyState from '@/components/layout/EmptyState';
import CampCard from '@/components/cards/CampCard';

export default function Camps() {
  const router = useRouter();

  return (
    <ScreenContainer>
      <Header title="Camps" showBack />
      {CAMPS.length === 0 ? (
        <EmptyState icon={Tent} message="No open camps in this district yet." />
      ) : (
        <ScrollView className="flex-1 px-4" contentContainerStyle={{ paddingBottom: 24, paddingTop: 4 }}>
          {CAMPS.map((camp) => (
            <CampCard key={camp.id} camp={camp} onPress={() => router.push(`/camps/${camp.id}`)} />
          ))}
        </ScrollView>
      )}
    </ScreenContainer>
  );
}
