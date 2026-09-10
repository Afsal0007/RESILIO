import PlaceholderScreen from '@/components/layout/PlaceholderScreen';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

export default function Screen() {
  return (
    <ProtectedRoute>
      <PlaceholderScreen title="Request facility" path="app/facilities/[id]/request" />
    </ProtectedRoute>
  );
}
