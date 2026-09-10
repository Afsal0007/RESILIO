import { Stack } from 'expo-router';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

export const unstable_settings = {
  initialRouteName: 'dashboard',
};

export default function VolunteerLayout() {
  return (
    <ProtectedRoute>
      <Stack screenOptions={{ headerShown: false }} />
    </ProtectedRoute>
  );
}
