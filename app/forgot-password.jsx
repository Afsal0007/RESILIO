import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { FONT } from '@/theme/tokens';
import ScreenContainer from '@/components/layout/ScreenContainer';
import Header from '@/components/layout/Header';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

export default function ForgotPassword() {
  const router = useRouter();
  const { forgotPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [message, setMessage] = useState('');

  const onSubmit = async () => {
    if (!email.trim()) {
      setError('Email is required.');
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      const result = await forgotPassword({ email });
      setMessage(result.message);
      setSent(true);
    } catch (err) {
      setError(err.message || 'Unable to send reset link.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScreenContainer>
      <Header title="Forgot password" variant="status" showBack />
      <KeyboardAvoidingView className="flex-1" behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView className="flex-1 px-4 py-4" keyboardShouldPersistTaps="handled">
          {sent ? (
            <>
              <Text className="text-[22px] text-ink" style={{ fontFamily: FONT.extrabold }}>
                Check your email
              </Text>
              <Text className="mt-3 text-[14px] text-ink/80" style={{ fontFamily: FONT.regular }}>
                {message}
              </Text>
              <Text className="mt-2 text-[13px] text-ink/70" style={{ fontFamily: FONT.regular }}>
                This is a simulated reset for the mock auth service.
              </Text>
              <Button className="mt-6" label="Back to login" onPress={() => router.replace('/login')} />
            </>
          ) : (
            <>
              <Text className="text-[22px] text-ink" style={{ fontFamily: FONT.extrabold }}>
                Reset password
              </Text>
              <Text className="mb-5 mt-1 text-[14px] text-ink/70" style={{ fontFamily: FONT.regular }}>
                Enter your email and we will send a reset link.
              </Text>
              <Input label="Email" value={email} onChangeText={setEmail} placeholder="you@email.com" keyboardType="email-address" error={error} />
              <Button label="Send Reset Link" onPress={onSubmit} loading={submitting} />
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}
