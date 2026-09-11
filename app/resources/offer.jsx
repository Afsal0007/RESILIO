import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { FONT } from '@/theme/tokens';
import { useAuth } from '@/context/AuthContext';
import { useResilience } from '@/services/resilienceStore';
import ScreenContainer from '@/components/layout/ScreenContainer';
import Header from '@/components/layout/Header';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Chip from '@/components/ui/Chip';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

const CATEGORIES = ['Food', 'Water', 'Shelter', 'Medical', 'Transport', 'Boats', 'Generator'];

export default function OfferResource() {
  const router = useRouter();
  const { user } = useAuth();
  const { addResourceOffer } = useResilience();
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('Food');
  const [submitting, setSubmitting] = useState(false);

  const onPublish = async () => {
    if (submitting || !name.trim()) return;
    setSubmitting(true);
    try {
      await addResourceOffer({
        name: name.trim(),
        category,
        quantity: Number(quantity) || quantity || 1,
        location: location.trim() || 'Kerala',
        provider: user?.name || 'Community offer',
        status: 'available',
        unit: 'units',
        notes: 'Offered through RESILIO.',
      });
      router.replace('/resources');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ProtectedRoute>
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
            <Button label="Publish offer" loading={submitting} onPress={onPublish} />
          </ScrollView>
        </KeyboardAvoidingView>
      </ScreenContainer>
    </ProtectedRoute>
  );
}
