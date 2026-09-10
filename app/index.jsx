import { useEffect } from 'react';
import { useRootNavigationState, useRouter } from 'expo-router';
import SplashView from '@/components/layout/SplashView';

export default function Index() {
  const router = useRouter();
  const navigationState = useRootNavigationState();

  useEffect(() => {
    if (!navigationState?.key) return;
    const timer = setTimeout(() => {
      router.replace('/home');
    }, 600);
    return () => clearTimeout(timer);
  }, [navigationState?.key, router]);

  return <SplashView />;
}
