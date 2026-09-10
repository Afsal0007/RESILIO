import { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { FONT } from '@/theme/tokens';
import ScreenContainer from '@/components/layout/ScreenContainer';
import Header from '@/components/layout/Header';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

export default function Settings() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();
  const [loggingOut, setLoggingOut] = useState(false);

  const onLogout = async () => {
    setLoggingOut(true);
    try {
      await logout();
      router.replace('/home');
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <ScreenContainer>
      <Header title="Settings" showBack />
      <ScrollView className="flex-1 px-4" contentContainerStyle={{ paddingBottom: 32 }}>
        {isAuthenticated ? (
          <Card variant="browse" className="mb-4">
            <Text className="text-[16px] text-ink" style={{ fontFamily: FONT.bold }}>
              {user?.name}
            </Text>
            <Text className="mt-1 text-[13px] text-ink/70" style={{ fontFamily: FONT.regular }}>
              {user?.email}
            </Text>
            <Text className="mt-1 text-[13px] text-backwater" style={{ fontFamily: FONT.semibold }}>
              {user?.role?.replace(/_/g, ' ')}
            </Text>
          </Card>
        ) : (
          <Text className="mb-4 text-[14px] text-ink/80" style={{ fontFamily: FONT.regular }}>
            You are browsing as a guest.
          </Text>
        )}

        <Card variant="browse" className="mb-3" onPress={() => router.push('/settings/privacy')}>
          <Text className="text-[15px] text-ink" style={{ fontFamily: FONT.semibold }}>
            Privacy
          </Text>
        </Card>
        <Card variant="browse" className="mb-3" onPress={() => router.push('/help')}>
          <Text className="text-[15px] text-ink" style={{ fontFamily: FONT.semibold }}>
            Help
          </Text>
        </Card>
        <Card variant="browse" className="mb-5" onPress={() => router.push('/profile/locations')}>
          <Text className="text-[15px] text-ink" style={{ fontFamily: FONT.semibold }}>
            Saved locations
          </Text>
        </Card>

        {isAuthenticated ? (
          <Button label="Log Out" variant="danger" loading={loggingOut} onPress={onLogout} />
        ) : (
          <View style={{ gap: 12 }}>
            <Button label="Login" onPress={() => router.push('/login')} />
            <Button label="Sign Up" variant="secondary" onPress={() => router.push('/signup')} />
          </View>
        )}
      </ScrollView>
    </ScreenContainer>
  );
}
