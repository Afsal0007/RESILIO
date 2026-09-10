import { Stack } from 'expo-router';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

export default function RequestsLayout() {
  return (
    <ProtectedRoute>
      <Stack screenOptions={{ headerShown: false }} />
    </ProtectedRoute>
  );
}
