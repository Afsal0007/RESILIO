import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { useApp } from '@/context/AppContext';

export default function useGuardedAction() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { showLoginPrompt } = useApp();

  return (intendedRoute, actionLabel) => {
    if (isAuthenticated) {
      router.push(intendedRoute);
      return;
    }
    showLoginPrompt({ intendedRoute, actionLabel });
  };
}
