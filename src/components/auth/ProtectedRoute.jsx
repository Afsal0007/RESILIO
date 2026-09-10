import { ActivityIndicator, View } from 'react-native';
import { useEffect } from 'react';
import { usePathname, useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { COLORS } from '@/theme/tokens';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) {
      router.replace({
        pathname: '/login',
        params: { redirect: pathname },
      });
    }
  }, [isAuthenticated, isLoading, pathname, router]);

  if (isLoading || !isAuthenticated) {
    return (
      <View className="flex-1 items-center justify-center bg-paper">
        <ActivityIndicator color={COLORS.backwater} />
      </View>
    );
  }

  return children;
}
