import { useState } from 'react';
import { Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { FONT } from '@/theme/tokens';
import { useAuth } from '@/context/AuthContext';
import ScreenContainer from '@/components/layout/ScreenContainer';
import Header from '@/components/layout/Header';
import Button from '@/components/ui/Button';
import PhotoPicker from '@/components/ui/PhotoPicker';

export default function VolunteerVerify() {
  const router = useRouter();
  const { submitVerification } = useAuth();
  const [uri, setUri] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const onSubmit = async () => {
    if (!uri || submitting) {
      setError(uri ? '' : 'Add an ID or licence photo first.');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      await submitVerification(uri);
      router.replace('/volunteer/dashboard');
    } catch (err) {
      setError(err?.message || 'Could not submit the photo. Try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScreenContainer>
      <Header title="Verify credentials" showBack />
      <View className="flex-1 px-4 pt-2">
        <Text className="mb-4 text-[14px] text-ink/80" style={{ fontFamily: FONT.regular }}>
          Medical, rescue, electrician, and technician roles need a licence or ID photo. Take a photo or choose one from your library, then submit for review.
        </Text>
        <PhotoPicker value={uri} onChange={(next) => { setUri(next); setError(''); }} />
        {error ? (
          <Text className="mt-3 text-[13px] text-laterite" style={{ fontFamily: FONT.medium }}>
            {error}
          </Text>
        ) : null}
        <Button
          className="mt-5"
          label="Submit for review"
          disabled={!uri}
          loading={submitting}
          onPress={onSubmit}
        />
        <Button className="mt-3" variant="ghost" label="Skip for now" onPress={() => router.replace('/volunteer/dashboard')} />
      </View>
    </ScreenContainer>
  );
}
