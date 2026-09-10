import { Stack } from 'expo-router';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

export default function RoadScanLayout() {
  return (
    <ProtectedRoute>
      <Stack screenOptions={{ headerShown: false }} />
    </ProtectedRoute>
  );
}
