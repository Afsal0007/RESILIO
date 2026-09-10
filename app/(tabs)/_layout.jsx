import { Tabs } from 'expo-router';
import BottomNav from '@/components/layout/BottomNav';

export const unstable_settings = {
  initialRouteName: 'home',
};

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <BottomNav {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen name="home" options={{ title: 'Home' }} />
      <Tabs.Screen name="map" options={{ title: 'Map' }} />
      <Tabs.Screen name="roadscan" options={{ title: 'RoadScan' }} />
      <Tabs.Screen
        name="volunteer"
        options={{
          title: 'Volunteer',
          href: '/volunteer/dashboard',
        }}
      />
      <Tabs.Screen name="notifications" options={{ title: 'Alerts' }} />
    </Tabs>
  );
}
