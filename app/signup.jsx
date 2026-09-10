import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, Text, View } from 'react-native';
import { Link, useLocalSearchParams, useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { ROLE_LIST, getRoleIcon, isVerificationRequired } from '@/constants/roles';
import { getSafeRedirect } from '@/components/auth/redirect';
import { FONT } from '@/theme/tokens';
import ScreenContainer from '@/components/layout/ScreenContainer';
import Header from '@/components/layout/Header';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import IconTile from '@/components/ui/IconTile';
import SectionHeading from '@/components/ui/SectionHeading';

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
      <Header title="Sign up" variant="status" showBack />
      <KeyboardAvoidingView className="flex-1" behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView className="flex-1 px-4 py-4" keyboardShouldPersistTaps="handled">
          <Text className="text-[22px] text-ink" style={{ fontFamily: FONT.extrabold }}>
            Create account
          </Text>
          <Text className="mb-5 mt-1 text-[14px] text-ink/70" style={{ fontFamily: FONT.regular }}>
            Choose how you want to help during floods and landslides.
          </Text>
          {formError ? (
            <Text className="mb-3 text-[13px] text-laterite" style={{ fontFamily: FONT.medium }}>
              {formError}
            </Text>
          ) : null}
          <Input label="Name" value={name} onChangeText={setName} placeholder="Your full name" autoCapitalize="words" error={errors.name} />
          <Input label="Email" value={email} onChangeText={setEmail} placeholder="you@email.com" keyboardType="email-address" error={errors.email} />
          <Input label="Password" value={password} onChangeText={setPassword} placeholder="Create a password" secureTextEntry error={errors.password} />
          <Input label="Confirm password" value={confirmPassword} onChangeText={setConfirmPassword} placeholder="Repeat password" secureTextEntry error={errors.confirmPassword} />
          <SectionHeading>Role</SectionHeading>
          {errors.role ? (
            <Text className="mb-2 text-[12px] text-laterite" style={{ fontFamily: FONT.medium }}>
              {errors.role}
            </Text>
          ) : null}
          <View className="flex-row flex-wrap justify-between">
            {ROLE_LIST.map((item) => (
              <IconTile
                key={item.id}
                icon={getRoleIcon(item.icon)}
                label={item.label}
                selected={role === item.id}
                onPress={() => setRole(item.id)}
              />
            ))}
          </View>
          <Button label="Create account" onPress={onSubmit} loading={submitting} />
          <Link href={{ pathname: '/login', params: { redirect: intended } }} asChild>
            <Text className="mt-4 text-center text-[13px] text-ink/70" style={{ fontFamily: FONT.regular, minHeight: 44, paddingTop: 12 }}>
              Already have an account? <Text className="text-backwater" style={{ fontFamily: FONT.semibold }}>Login</Text>
            </Text>
          </Link>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}
