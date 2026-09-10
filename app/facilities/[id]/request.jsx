import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, Text } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { getFacility } from '@/mock-data/facilities';
import { FONT } from '@/theme/tokens';
import ScreenContainer from '@/components/layout/ScreenContainer';
import Header from '@/components/layout/Header';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

export default function FacilityRequest() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const facility = getFacility(id);
  const [item, setItem] = useState(facility.needs[0]?.name || '');
  const [quantity, setQuantity] = useState('');
  const [notes, setNotes] = useState('');

  return (
    <ProtectedRoute>
      <ScreenContainer>
        <Header title="Request support" showBack />
        <KeyboardAvoidingView className="flex-1" behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <ScrollView className="flex-1 px-4" contentContainerStyle={{ paddingBottom: 32 }}>
            <Text className="mb-4 text-[14px] text-ink/80" style={{ fontFamily: FONT.regular }}>
              Sending to {facility.name}. Keep the ask specific so a volunteer can fill it.
            </Text>
            <Input label="What do you need?" value={item} onChangeText={setItem} autoCapitalize="sentences" />
            <Input label="How much?" value={quantity} onChangeText={setQuantity} placeholder="Units, beds, hours" />
            <Input label="Notes" value={notes} onChangeText={setNotes} placeholder="Gate, contact, time window" multiline />
            <Button label="Send request" onPress={() => router.replace('/requests')} />
          </ScrollView>
        </KeyboardAvoidingView>
      </ScreenContainer>
    </ProtectedRoute>
  );
}
