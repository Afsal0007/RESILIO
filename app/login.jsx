import { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { Link, useLocalSearchParams, useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { ROLE_LIST, getRoleIcon } from '@/constants/roles';
import { getSafeRedirect } from '@/components/auth/redirect';
import Header from '@/components/layout/Header';
import ScreenContainer from '@/components/layout/ScreenContainer';
import TextField from '@/components/forms/TextField';

export default function Login() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { login, demoLogin } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [demoRole, setDemoRole] = useState(null);

  const destination = getSafeRedirect(params.redirect);

  const validate = () => {
    const nextErrors = {};
    if (!email.trim()) nextErrors.email = 'Email is required.';
    if (!password) nextErrors.password = 'Password is required.';
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const finishLogin = () => {
    router.replace(destination);
  };

  const onSubmit = async () => {
    if (!validate()) return;
    setFormError('');
    setSubmitting(true);
    try {
      await login({ email, password });
      finishLogin();
    } catch (error) {
      setFormError(error.message || 'Unable to log in.');
    } finally {
      setSubmitting(false);
    }
  };

  const onDemoLogin = async (roleId) => {
    setFormError('');
    setDemoRole(roleId);
    try {
      await demoLogin(roleId);
      finishLogin();
    } catch (error) {
      setFormError(error.message || 'Demo login failed.');
    } finally {
      setDemoRole(null);
    }
  };

  return (
    <ScreenContainer>
      <Header title="Login" showBack />
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView className="flex-1 px-4 py-4" keyboardShouldPersistTaps="handled">
          <Text className="mb-1 text-2xl font-bold text-gray-900">Welcome back</Text>
          <Text className="mb-6 text-sm text-gray-500">
            Browse as a guest anytime. Login is only needed to submit data.
          </Text>

          {formError ? (
            <Text className="mb-4 text-sm text-status-red">{formError}</Text>
          ) : null}

          <TextField
            label="Email"
            value={email}
            onChangeText={setEmail}
            placeholder="you@email.com"
            keyboardType="email-address"
            error={errors.email}
          />
          <TextField
            label="Password"
            value={password}
            onChangeText={setPassword}
            placeholder="Your password"
            secureTextEntry
            error={errors.password}
          />

          <Pressable
            className="items-center rounded-xl bg-brand py-3"
            onPress={onSubmit}
            disabled={submitting}
          >
            {submitting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="font-semibold text-white">Login</Text>
            )}
          </Pressable>

          <View className="mt-4 flex-row justify-between">
            <Link href={{ pathname: '/signup', params: { redirect: destination } }} asChild>
              <Pressable>
                <Text className="text-sm font-medium text-brand">Create an account</Text>
              </Pressable>
            </Link>
            <Link href="/forgot-password" asChild>
              <Pressable>
                <Text className="text-sm font-medium text-gray-500">Forgot password?</Text>
              </Pressable>
            </Link>
          </View>

          <Text className="mb-3 mt-8 text-base font-semibold text-gray-900">Demo Login</Text>
          <Text className="mb-3 text-sm text-gray-500">
            Instant access as a pre-seeded user. No credentials needed.
          </Text>

          <View className="flex-row flex-wrap gap-2">
            {ROLE_LIST.map((role) => {
              const Icon = getRoleIcon(role.icon);
              const loading = demoRole === role.id;
              return (
                <Pressable
                  key={role.id}
                  className="mb-2 w-[48%] flex-row items-center rounded-xl border border-gray-200 px-3 py-3"
                  onPress={() => onDemoLogin(role.id)}
                  disabled={Boolean(demoRole)}
                >
                  <Icon color="#0ea5e9" size={18} />
                  <Text className="ml-2 flex-1 text-sm font-medium text-gray-800">
                    {loading ? 'Signing in…' : `Demo as ${role.label}`}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}
