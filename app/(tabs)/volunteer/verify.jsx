import PlaceholderScreen from '@/components/layout/PlaceholderScreen';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

export default function Screen() {
  return (
    <ProtectedRoute>
      <PlaceholderScreen title="Verify credentials" path="app/(tabs)/volunteer/verify" />
    </ProtectedRoute>
  );
}
