import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, Text, View } from 'react-native';
import { Link, useLocalSearchParams, useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { ROLE_LIST, getRoleIcon } from '@/constants/roles';
import { getSafeRedirect } from '@/components/auth/redirect';
import { FONT, COLORS } from '@/theme/tokens';
import ScreenContainer from '@/components/layout/ScreenContainer';
import Header from '@/components/layout/Header';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import SectionHeading from '@/components/ui/SectionHeading';
import Card from '@/components/ui/Card';

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

  const finishLogin = () => router.replace(destination);

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
      <Header title="Login" variant="status" showBack />
      <KeyboardAvoidingView className="flex-1" behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView className="flex-1 px-4 py-4" keyboardShouldPersistTaps="handled">
          <Text className="text-[22px] text-ink" style={{ fontFamily: FONT.extrabold }}>
            Welcome back
          </Text>
          <Text className="mb-5 mt-1 text-[14px] text-ink/70" style={{ fontFamily: FONT.regular }}>
            Browse as a guest anytime. Login is only needed to submit data.
          </Text>
          {formError ? (
            <Text className="mb-3 text-[13px] text-laterite" style={{ fontFamily: FONT.medium }}>
              {formError}
            </Text>
          ) : null}
          <Input label="Email" value={email} onChangeText={setEmail} placeholder="you@email.com" keyboardType="email-address" error={errors.email} />
          <Input label="Password" value={password} onChangeText={setPassword} placeholder="Your password" secureTextEntry error={errors.password} />
          <Button label="Login" onPress={onSubmit} loading={submitting} />
          <View className="mt-4 flex-row justify-between">
            <Link href={{ pathname: '/signup', params: { redirect: destination } }} asChild>
              <Text className="text-[13px] text-backwater" style={{ fontFamily: FONT.semibold, minHeight: 44, paddingTop: 12 }}>
                Create an account
              </Text>
            </Link>
            <Link href="/forgot-password" asChild>
              <Text className="text-[13px] text-ink/70" style={{ fontFamily: FONT.medium, minHeight: 44, paddingTop: 12 }}>
                Forgot password?
              </Text>
            </Link>
          </View>
          <SectionHeading className="mt-8">Demo login</SectionHeading>
          <Text className="mb-3 text-[13px] text-ink/70" style={{ fontFamily: FONT.regular }}>
            Instant access as a pre-seeded user. No credentials needed.
          </Text>
          {ROLE_LIST.map((role) => {
            const Icon = getRoleIcon(role.icon);
            return (
              <Card
                key={role.id}
                variant="browse"
                className="mb-3"
                onPress={() => onDemoLogin(role.id)}
              >
                <View className="flex-row items-center">
                  <Icon color={COLORS.backwater} size={18} />
                  <Text className="ml-2 text-[14px] text-ink" style={{ fontFamily: FONT.semibold }}>
                    {demoRole === role.id ? 'Signing in…' : `Demo as ${role.label}`}
                  </Text>
                </View>
              </Card>
            );
          })}
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}
