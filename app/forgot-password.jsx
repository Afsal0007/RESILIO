import { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
} from 'react-native';
import { Link } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import Header from '@/components/layout/Header';
import ScreenContainer from '@/components/layout/ScreenContainer';
import TextField from '@/components/forms/TextField';

export default function ForgotPassword() {
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
      <Header title="Forgot password" showBack />
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView className="flex-1 px-4 py-4" keyboardShouldPersistTaps="handled">
          {sent ? (
            <>
              <Text className="text-2xl font-bold text-gray-900">Check your email</Text>
              <Text className="mt-3 text-sm text-gray-600">{message}</Text>
              <Text className="mt-2 text-sm text-gray-500">
                This is a simulated reset for the mock auth service.
              </Text>
              <Link href="/login" asChild>
                <Pressable className="mt-6 items-center rounded-xl bg-brand py-3">
                  <Text className="font-semibold text-white">Back to login</Text>
                </Pressable>
              </Link>
            </>
          ) : (
            <>
              <Text className="mb-1 text-2xl font-bold text-gray-900">Reset password</Text>
              <Text className="mb-6 text-sm text-gray-500">
                Enter your email and we will send a reset link.
              </Text>
              <TextField
                label="Email"
                value={email}
                onChangeText={setEmail}
                placeholder="you@email.com"
                keyboardType="email-address"
                error={error}
              />
              <Pressable
                className="items-center rounded-xl bg-brand py-3"
                onPress={onSubmit}
                disabled={submitting}
              >
                {submitting ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text className="font-semibold text-white">Send Reset Link</Text>
                )}
              </Pressable>
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}
