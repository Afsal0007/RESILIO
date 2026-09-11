import { useMemo } from 'react';
import { ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Inbox } from 'lucide-react-native';
import { toInboxItems, useResilience } from '@/services/resilienceStore';
import ScreenContainer from '@/components/layout/ScreenContainer';
import Header from '@/components/layout/Header';
import EmptyState from '@/components/layout/EmptyState';
import RequestCard from '@/components/cards/RequestCard';

export default function Requests() {
  const router = useRouter();
  const { sosCases, facilityRequests } = useResilience();
  const items = useMemo(
    () => toInboxItems(sosCases, facilityRequests),
    [sosCases, facilityRequests]
  );

  return (
    <ScreenContainer>
      <Header title="Requests" showBack />
      {items.length === 0 ? (
        <EmptyState icon={Inbox} message="No incoming requests yet." />
      ) : (
        <ScrollView className="flex-1 px-4" contentContainerStyle={{ paddingBottom: 24, paddingTop: 4 }}>
          {items.map((request) => (
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
