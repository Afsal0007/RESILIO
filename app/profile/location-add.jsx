import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import ScreenContainer from '@/components/layout/ScreenContainer';
import Header from '@/components/layout/Header';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

export default function LocationAdd() {
  const router = useRouter();
  const [label, setLabel] = useState('');
  const [address, setAddress] = useState('');

  return (
    <ScreenContainer>
      <Header title="Add location" showBack />
      <KeyboardAvoidingView className="flex-1" behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView className="flex-1 px-4" contentContainerStyle={{ paddingBottom: 32 }}>
          <Input label="Label" value={label} onChangeText={setLabel} placeholder="Home, office, amma's house" autoCapitalize="sentences" />
          <Input label="Address" value={address} onChangeText={setAddress} placeholder="Town, landmark, pin" autoCapitalize="words" />
          <Button label="Save location" onPress={() => router.replace('/profile/locations')} />
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}
