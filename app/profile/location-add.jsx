import PlaceholderScreen from '@/components/layout/PlaceholderScreen';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

export default function Screen() {
  return (
    <ProtectedRoute>
      <PlaceholderScreen title="Add location" path="app/profile/location-add" />
    </ProtectedRoute>
  );
}
