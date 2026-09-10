import { Stack } from 'expo-router';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

export default function SosLayout() {
  return (
    <ProtectedRoute>
      <Stack screenOptions={{ headerShown: false }} />
    </ProtectedRoute>
  );
}
