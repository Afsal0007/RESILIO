import { usePathname, useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';

export default function useRequireAuth() {
  const { isAuthenticated, isLoading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  return {
    isAuthenticated,
    isLoading,
    requireAuth: () => {
      if (!isLoading && !isAuthenticated) {
        router.replace({
          pathname: '/login',
          params: { redirect: pathname },
        });
        return false;
      }
      return isAuthenticated;
    },
  };
}
