import { Redirect, Stack, usePathname } from 'expo-router';
import { useAuth } from '@/context/AuthContext';

export default function RequestsLayout() {
  const { isAuthenticated, isLoading } = useAuth();
  const pathname = usePathname();

  if (!isLoading && !isAuthenticated) {
    return <Redirect href={{ pathname: '/login', params: { redirect: pathname } }} />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
