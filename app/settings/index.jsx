import { useState } from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import Header from '@/components/layout/Header';
import ScreenContainer from '@/components/layout/ScreenContainer';

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
      <View className="flex-1 p-4">
        <Text className="text-xl font-bold">Settings</Text>
        <Text className="mb-6 text-sm text-gray-500">app/settings/index</Text>

        {isAuthenticated ? (
          <View className="mb-6 rounded-xl border border-gray-200 p-4">
            <Text className="text-base font-semibold text-gray-900">{user?.name}</Text>
            <Text className="text-sm text-gray-500">{user?.email}</Text>
            <Text className="mt-1 text-sm text-brand">{user?.role}</Text>
          </View>
        ) : (
          <Text className="mb-6 text-sm text-gray-600">You are browsing as a guest.</Text>
        )}

        <Link href="/settings/privacy" asChild>
          <Pressable className="mb-3 rounded-xl border border-gray-200 px-4 py-3">
            <Text className="font-medium text-gray-900">Privacy</Text>
          </Pressable>
        </Link>

        {isAuthenticated ? (
          <Pressable
            className="items-center rounded-xl bg-status-red py-3"
            onPress={onLogout}
            disabled={loggingOut}
          >
            {loggingOut ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="font-semibold text-white">Log Out</Text>
            )}
          </Pressable>
        ) : (
          <View className="gap-3">
            <Link href="/login" asChild>
              <Pressable className="items-center rounded-xl bg-brand py-3">
                <Text className="font-semibold text-white">Login</Text>
              </Pressable>
            </Link>
            <Link href="/signup" asChild>
              <Pressable className="items-center rounded-xl border border-brand py-3">
                <Text className="font-semibold text-brand">Sign Up</Text>
              </Pressable>
            </Link>
          </View>
        )}
      </View>
    </ScreenContainer>
  );
}
