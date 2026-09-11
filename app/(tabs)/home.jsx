import { useCallback, useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { Camera, LayoutDashboard, Map, Siren, HeartHandshake, Settings } from 'lucide-react-native';
import { useAuth } from '@/context/AuthContext';
import { useApp } from '@/context/AppContext';
import useGuardedAction from '@/hooks/useGuardedAction';
import { useCamps } from '@/services/campsStore';
import { fetchCurrentWeather, fetchForecast, HEAVY_RAIN_MM } from '@/services/weather';
import { KERALA_REGION, requestUserCoords } from '@/hooks/useUserLocation';
import { sortCampsByNearest, withLiveDistance } from '@/utils/distance';
import { ALERTS } from '@/mock-data/alerts';
import { COLORS, FONT, RADIUS } from '@/theme/tokens';
import ScreenContainer from '@/components/layout/ScreenContainer';
import Header from '@/components/layout/Header';
import SectionHeading from '@/components/ui/SectionHeading';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import CampCard from '@/components/cards/CampCard';
import WeatherButton from '@/components/ui/WeatherButton';
import WeatherSheet from '@/components/ui/WeatherSheet';

const QUICK_LINKS = [
  { label: 'RoadScan', href: '/roadscan', Icon: Camera },
  { label: 'Map', href: '/map', Icon: Map },
  { label: 'Volunteer', href: '/volunteer/dashboard', Icon: HeartHandshake },
  { label: 'Dashboard', href: '/dashboard', Icon: LayoutDashboard },
];

export default function Home() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const { setHelpMode } = useApp();
  const requireAuth = useGuardedAction();
  const { camps } = useCamps();
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(Boolean(process.env.EXPO_PUBLIC_OWM_KEY));
  const [weatherSheetOpen, setWeatherSheetOpen] = useState(false);
  const [userCoords, setUserCoords] = useState(null);
  const mockAlert = ALERTS[0];
  const heavyRain = weather && weather.rainLastHourMm > HEAVY_RAIN_MM;
  const greeting = isAuthenticated ? `Hello, ${user.name.split(' ')[0]}` : 'Hello';
  const nearest = useMemo(() => {
    const [camp] = withLiveDistance(sortCampsByNearest(camps, userCoords), userCoords);
    return camp;
  }, [camps, userCoords]);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      (async () => {
        try {
          const coords = await requestUserCoords();
          if (active) setUserCoords(coords);
          const lat = coords?.latitude ?? KERALA_REGION.latitude;
          const lng = coords?.longitude ?? KERALA_REGION.longitude;
          const [current, upcoming] = await Promise.all([
            fetchCurrentWeather(lat, lng),
            fetchForecast(lat, lng),
          ]);
          if (!active) return;
          setWeather(current);
          setForecast(upcoming);
        } catch {
          if (active) {
            setWeather(null);
            setForecast(null);
          }
        } finally {
          if (active) setWeatherLoading(false);
        }
      })();
      return () => {
        active = false;
      };
    }, [])
  );

  return (
    <ScreenContainer>
      <Header
        title="RESILIO"
        rightAction={
          <Pressable
            onPress={() => router.push('/settings')}
            className="items-center justify-center"
            style={{ width: 44, height: 44 }}
          >
            <Settings color={COLORS.ink} size={22} />
          </Pressable>
        }
      />
      <ScrollView className="flex-1 px-4" contentContainerStyle={{ paddingBottom: 24 }}>
        <Text className="mt-1 text-[15px] text-ink/70" style={{ fontFamily: FONT.medium }}>
          {greeting}. Kerala disaster support.
        </Text>
        <WeatherButton
          current={weather}
          loading={weatherLoading}
          onPress={() => setWeatherSheetOpen(true)}
        />

        <View className="mt-5 flex-row" style={{ gap: 12 }}>
          <Pressable
            onPress={async () => {
              await setHelpMode('need');
              router.push('/camps');
            }}
            className="flex-1 bg-backwater px-3 py-4"
            style={{ borderRadius: RADIUS.soft, minHeight: 108 }}
          >
            <Siren color={COLORS.paper} size={22} />
            <Text className="mt-3 text-[16px] text-paper" style={{ fontFamily: FONT.bold }}>
              I Need Help
            </Text>
            <Text className="mt-1 text-[12px] text-paper/80" style={{ fontFamily: FONT.regular }}>
              Camps, SOS, and open roads
            </Text>
          </Pressable>
          <Pressable
            onPress={async () => {
              await setHelpMode('give');
              requireAuth('/volunteer/join', 'join as a volunteer');
            }}
            className="flex-1 bg-monsoon px-3 py-4"
            style={{ borderRadius: RADIUS.soft, minHeight: 108 }}
          >
            <HeartHandshake color={COLORS.paper} size={22} />
            <Text className="mt-3 text-[16px] text-paper" style={{ fontFamily: FONT.bold }}>
              I Can Help
            </Text>
            <Text className="mt-1 text-[12px] text-paper/80" style={{ fontFamily: FONT.regular }}>
              Skills, boats, and supplies
            </Text>
          </Pressable>
        </View>

        {heavyRain ? (
          <Card variant="alert" status="unavailable" className="mt-5">
            <Text className="text-[14px] text-ink" style={{ fontFamily: FONT.bold }}>
              Heavy rainfall detected in your area
            </Text>
            <Text className="mt-1 text-[13px] text-ink/80" style={{ fontFamily: FONT.regular }}>
              {weather.rainLastHourMm.toFixed(1)} mm in the last hour. Move to higher ground if you are near a river or slope.
            </Text>
          </Card>
        ) : null}

        {mockAlert ? (
          <Card
            variant="alert"
            status="unavailable"
            className={heavyRain ? 'mt-3' : 'mt-5'}
            onPress={() => router.push('/notifications')}
          >
            <Text className="text-[14px] text-ink" style={{ fontFamily: FONT.bold }}>
              {mockAlert.title}
            </Text>
            <Text className="mt-1 text-[13px] text-ink/80" style={{ fontFamily: FONT.regular }}>
              {mockAlert.body}
            </Text>
          </Card>
        ) : null}

        {nearest ? (
          <View className="mt-6">
            <SectionHeading>Nearest camp</SectionHeading>
            <CampCard camp={nearest} onPress={() => router.push(`/camps/${nearest.id}`)} />
          </View>
        ) : null}

        <SectionHeading>Quick links</SectionHeading>
        <View className="flex-row flex-wrap" style={{ gap: 12 }}>
          {QUICK_LINKS.map((item) => (
            <Pressable
              key={item.href}
              onPress={() => {
                if (item.href === '/roadscan') {
                  requireAuth('/roadscan', 'scan a road');
                  return;
                }
                if (item.href === '/volunteer/dashboard') {
                  requireAuth('/volunteer/dashboard', 'open the volunteer desk');
                  return;
                }
                router.push(item.href);
              }}
              className="items-center justify-center bg-paper-dim"
              style={{ width: '47%', minHeight: 72, borderRadius: RADIUS.soft }}
            >
              <item.Icon color={COLORS.backwater} size={20} />
              <Text className="mt-1 text-[13px] text-ink" style={{ fontFamily: FONT.semibold }}>
                {item.label}
              </Text>
            </Pressable>
          ))}
        </View>

        <View className="mt-6">
          <Button
            label="Send SOS"
            variant="danger"
            onPress={() => requireAuth('/sos', 'send an SOS request')}
          />
        </View>
      </ScrollView>
      <WeatherSheet
        visible={weatherSheetOpen}
        onClose={() => setWeatherSheetOpen(false)}
        current={weather}
        forecast={forecast}
      />
    </ScreenContainer>
  );
}
