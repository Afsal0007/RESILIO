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
import { ROLE_LIST, getRoleIcon, isVerificationRequired } from '@/constants/roles';
import { getSafeRedirect } from '@/components/auth/redirect';
import Header from '@/components/layout/Header';
import ScreenContainer from '@/components/layout/ScreenContainer';
import TextField from '@/components/forms/TextField';

export default function Signup() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { signUp } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState(null);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const intended = getSafeRedirect(params.redirect);

  const validate = () => {
    const nextErrors = {};
    if (!name.trim()) nextErrors.name = 'Name is required.';
    if (!email.trim()) nextErrors.email = 'Email is required.';
    if (!password) nextErrors.password = 'Password is required.';
    else if (password.length < 6) nextErrors.password = 'Use at least 6 characters.';
    if (confirmPassword !== password) nextErrors.confirmPassword = 'Passwords do not match.';
    if (!role) nextErrors.role = 'Please select a role.';
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const onSubmit = async () => {
    if (!validate()) return;
    setFormError('');
    setSubmitting(true);
    try {
      const user = await signUp({ name, email, password, role });
      if (isVerificationRequired(user.role)) {
        router.replace('/volunteer/verify');
      } else {
        router.replace(intended);
      }
    } catch (error) {
      setFormError(error.message || 'Unable to create account.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScreenContainer>
      <Header title="Sign Up" showBack />
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView className="flex-1 px-4 py-4" keyboardShouldPersistTaps="handled">
          <Text className="mb-1 text-2xl font-bold text-gray-900">Create account</Text>
          <Text className="mb-6 text-sm text-gray-500">
            Choose how you want to help during floods and landslides.
          </Text>

          {formError ? (
            <Text className="mb-4 text-sm text-status-red">{formError}</Text>
          ) : null}

          <TextField
            label="Name"
            value={name}
            onChangeText={setName}
            placeholder="Your full name"
            autoCapitalize="words"
            error={errors.name}
          />
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
            placeholder="Create a password"
            secureTextEntry
            error={errors.password}
          />
          <TextField
            label="Confirm password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="Repeat password"
            secureTextEntry
            error={errors.confirmPassword}
          />

          <Text className="mb-2 text-sm font-medium text-gray-700">Role</Text>
          {errors.role ? <Text className="mb-2 text-xs text-status-red">{errors.role}</Text> : null}

          <View className="flex-row flex-wrap justify-between">
            {ROLE_LIST.map((item) => {
              const Icon = getRoleIcon(item.icon);
              const selected = role === item.id;
              return (
                <Pressable
                  key={item.id}
                  onPress={() => setRole(item.id)}
                  className={`mb-3 w-[31%] items-center rounded-xl border p-3 ${
                    selected ? 'border-brand bg-sky-50' : 'border-gray-200 bg-white'
                  }`}
                >
                  <Icon color={selected ? '#0ea5e9' : '#64748b'} size={22} />
                  <Text
                    className={`mt-2 text-center text-xs font-semibold ${
                      selected ? 'text-brand' : 'text-gray-700'
                    }`}
                  >
                    {item.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <Pressable
            className="mt-2 items-center rounded-xl bg-brand py-3"
            onPress={onSubmit}
            disabled={submitting}
          >
            {submitting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="font-semibold text-white">Create account</Text>
            )}
          </Pressable>

          <Link href={{ pathname: '/login', params: { redirect: intended } }} asChild>
            <Pressable className="mt-4 items-center py-2">
              <Text className="text-sm text-gray-600">
                Already have an account? <Text className="font-semibold text-brand">Login</Text>
              </Text>
            </Pressable>
          </Link>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}
