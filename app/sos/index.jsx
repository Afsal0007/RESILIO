import { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { SOS_TYPES } from '@/mock-data/sos';
import { useResilience } from '@/services/resilienceStore';
import { FONT } from '@/theme/tokens';
import { useAuth } from '@/context/AuthContext';
import ScreenContainer from '@/components/layout/ScreenContainer';
import Header from '@/components/layout/Header';
import SectionHeading from '@/components/ui/SectionHeading';
import Chip from '@/components/ui/Chip';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

const PRIORITIES = [
  { id: 'unavailable', label: 'Life at risk' },
  { id: 'limited', label: 'Need help soon' },
  { id: 'available', label: 'Can wait a bit' },
];

export default function Sos() {
  const router = useRouter();
  const { user } = useAuth();
  const { createSosCase } = useResilience();
  const [type, setType] = useState('flood');
  const [priority, setPriority] = useState('unavailable');
  const [location, setLocation] = useState('Near Aluva jetty, Ernakulam');
  const [sending, setSending] = useState(false);

  return (
    <ScreenContainer>
      <Header title="SOS" showBack />
      <ScrollView className="flex-1 px-4" contentContainerStyle={{ paddingBottom: 32 }}>
        <Text className="mb-4 text-[14px] text-ink/80" style={{ fontFamily: FONT.regular }}>
          Use this only if someone needs pickup or urgent medical help.
        </Text>
        <SectionHeading>Emergency type</SectionHeading>
        <View className="mb-4 flex-row flex-wrap">
          {SOS_TYPES.map((item) => (
            <View key={item.id} className="mb-2">
              <Chip label={item.label} selected={type === item.id} onPress={() => setType(item.id)} />
            </View>
          ))}
        </View>
        <SectionHeading>Priority</SectionHeading>
        {PRIORITIES.map((item) => (
          <Card
            key={item.id}
            variant="alert"
            status={item.id}
            className="mb-3"
            onPress={() => setPriority(item.id)}
          >
            <Text className="text-[15px] text-ink" style={{ fontFamily: FONT.semibold }}>
              {item.label}
              {priority === item.id ? ' · selected' : ''}
            </Text>
          </Card>
        ))}
        <Input label="Location" value={location} onChangeText={setLocation} autoCapitalize="words" />
        <Button
          label="Send SOS"
          variant="danger"
          loading={sending}
          onPress={async () => {
            if (sending) return;
            setSending(true);
            try {
              const selected = SOS_TYPES.find((item) => item.id === type);
              const sos = await createSosCase({
                type: selected?.label || 'Flooded home',
                priority,
                status: priority,
                location,
                requesterId: user?.id || null,
                requesterName: user?.name || 'Citizen SOS',
              });
              router.push(`/sos/${sos.id}/status`);
            } finally {
              setSending(false);
            }
          }}
        />
      </ScrollView>
    </ScreenContainer>
  );
}
