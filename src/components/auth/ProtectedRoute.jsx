import { ActivityIndicator, View } from 'react-native';
import { Redirect, usePathname } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { COLORS } from '@/theme/tokens';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();
  const pathname = usePathname();

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-paper">
        <ActivityIndicator color={COLORS.backwater} />
      </View>
    );
  }

  if (!isAuthenticated) {
    return (
      <Redirect
        href={{
          pathname: '/login',
          params: { redirect: pathname },
        }}
      />
    );
  }

  return children;
}
