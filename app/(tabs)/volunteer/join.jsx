import PlaceholderScreen from '@/components/layout/PlaceholderScreen';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

export default function Screen() {
  return (
    <ProtectedRoute>
      <PlaceholderScreen title="Join as volunteer" path="app/(tabs)/volunteer/join" />
    </ProtectedRoute>
  );
}
