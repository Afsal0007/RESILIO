import '../global.css';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { AppProvider } from '@/context/AppContext';
import { COLORS } from '@/theme/tokens';
import SplashView from '@/components/layout/SplashView';

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Manrope: require('../assets/fonts/Manrope_400Regular.ttf'),
    'Manrope-Medium': require('../assets/fonts/Manrope_500Medium.ttf'),
    'Manrope-SemiBold': require('../assets/fonts/Manrope_600SemiBold.ttf'),
    'Manrope-Bold': require('../assets/fonts/Manrope_700Bold.ttf'),
    'Manrope-ExtraBold': require('../assets/fonts/Manrope_800ExtraBold.ttf'),
  });

  if (!fontsLoaded) {
    return <SplashView fontsReady={false} />;
  }

  return (
    <AuthProvider>
      <AppProvider>
        <RootNavigation />
      </AppProvider>
    </AuthProvider>
  );
}

function RootNavigation() {
  const { isLoading } = useAuth();

  if (isLoading) {
    return <SplashView fontsReady />;
  }

  return (
    <>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: COLORS.paper } }} />
    </>
  );
}
