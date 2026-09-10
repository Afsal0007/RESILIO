import PlaceholderScreen from '@/components/layout/PlaceholderScreen';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

export default function Screen() {
  return (
    <ProtectedRoute>
      <PlaceholderScreen title="Volunteer skills" path="app/(tabs)/volunteer/skills" />
    </ProtectedRoute>
  );
}
