import { ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Inbox } from 'lucide-react-native';
import { REQUESTS } from '@/mock-data/requests';
import ScreenContainer from '@/components/layout/ScreenContainer';
import Header from '@/components/layout/Header';
import EmptyState from '@/components/layout/EmptyState';
import RequestCard from '@/components/cards/RequestCard';

export default function Requests() {
  const router = useRouter();

  return (
    <ScreenContainer>
      <Header title="Requests" showBack />
      {REQUESTS.length === 0 ? (
        <EmptyState icon={Inbox} message="No incoming requests yet." />
      ) : (
        <ScrollView className="flex-1 px-4" contentContainerStyle={{ paddingBottom: 24, paddingTop: 4 }}>
          {REQUESTS.map((request) => (
            <RequestCard
              key={request.id}
              request={request}
              variant="alert"
              onPress={() => router.push(`/requests/${request.id}`)}
            />
          ))}
        </ScrollView>
      )}
    </ScreenContainer>
  );
}
