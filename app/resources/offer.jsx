import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { FONT } from '@/theme/tokens';
import ScreenContainer from '@/components/layout/ScreenContainer';
import Header from '@/components/layout/Header';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Chip from '@/components/ui/Chip';

const CATEGORIES = ['Food', 'Water', 'Shelter', 'Medical', 'Transport', 'Boats'];

export default function OfferResource() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('Food');

  return (
    <ScreenContainer>
      <Header title="Offer a resource" showBack />
      <KeyboardAvoidingView className="flex-1" behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView className="flex-1 px-4" contentContainerStyle={{ paddingBottom: 32 }}>
          <Text className="mb-4 text-[14px] text-ink/80" style={{ fontFamily: FONT.regular }}>
            List what you can give. Pickup details stay with you until a camp or team claims it.
          </Text>
          <Input label="What are you offering?" value={name} onChangeText={setName} placeholder="Boats, rice kits, tarps" autoCapitalize="sentences" />
          <Text className="mb-2 text-[13px] text-ink" style={{ fontFamily: FONT.medium }}>
            Category
          </Text>
          <ScrollView horizontal className="mb-4" showsHorizontalScrollIndicator={false}>
            {CATEGORIES.map((item) => (
              <Chip key={item} label={item} selected={category === item} onPress={() => setCategory(item)} />
            ))}
          </ScrollView>
          <Input label="Quantity" value={quantity} onChangeText={setQuantity} placeholder="e.g. 20 kits" />
          <Input label="Pickup location" value={location} onChangeText={setLocation} placeholder="Town or landmark" autoCapitalize="words" />
          <Button label="Publish offer" onPress={() => router.replace('/resources')} />
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}
