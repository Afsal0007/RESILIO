import PlaceholderScreen from '@/components/layout/PlaceholderScreen';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

export default function Screen() {
  return (
    <ProtectedRoute>
      <PlaceholderScreen title="Offer a resource" path="app/resources/offer" />
    </ProtectedRoute>
  );
}
