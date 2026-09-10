import { useCallback, useState } from 'react';
import { Text, View } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { CloudRain, Mountain } from 'lucide-react-native';
import { COLORS, FONT } from '@/theme/tokens';
import { fetchCurrentWeather, formatWeatherSummary } from '@/services/weather';
import { KERALA_REGION, requestUserCoords } from '@/hooks/useUserLocation';
import ScreenContainer from '@/components/layout/ScreenContainer';
import Header from '@/components/layout/Header';
import SectionHeading from '@/components/ui/SectionHeading';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

const SCENARIOS = [
  {
    id: 'rain',
    title: 'Heavy rain',
    copy: '12-hour burst on the Periyar. Watch camps and NH 66.',
    Icon: CloudRain,
  },
  {
    id: 'slide',
    title: 'Landslide',
    copy: 'Slope failure on the Wayanad ghat. Roads close first.',
    Icon: Mountain,
  },
];

export default function Simulator() {
  const router = useRouter();
  const [weatherLabel, setWeatherLabel] = useState('Current conditions: loading…');

  useFocusEffect(
    useCallback(() => {
      let active = true;
      (async () => {
        try {
          const coords = await requestUserCoords();
          const lat = coords?.latitude ?? KERALA_REGION.latitude;
          const lng = coords?.longitude ?? KERALA_REGION.longitude;
          const weather = await fetchCurrentWeather(lat, lng);
          if (active) setWeatherLabel(formatWeatherSummary(weather));
        } catch {
          if (active) setWeatherLabel(formatWeatherSummary(null));
        }
      })();
      return () => {
        active = false;
      };
    }, [])
  );

  return (
    <ScreenContainer>
      <Header title="Simulator" variant="status" showBack />
      <View className="flex-1 px-4 pt-4">
        <Card variant="browse" className="mb-5">
          <Text className="text-[14px] text-ink" style={{ fontFamily: FONT.semibold }}>
            {weatherLabel}
          </Text>
          <Text className="mt-1 text-[12px] text-ink/70" style={{ fontFamily: FONT.regular }}>
            Live readout only. Run scenario still uses the scripted demo, not a live forecast.
          </Text>
        </Card>
        <SectionHeading>Pick a scenario</SectionHeading>
        {SCENARIOS.map((item) => (
          <Card key={item.id} variant="browse" className="mb-3">
            <View className="flex-row items-start">
              <item.Icon color={COLORS.backwater} size={24} />
              <View className="ml-3 flex-1">
                <Text className="text-[16px] text-ink" style={{ fontFamily: FONT.bold }}>
                  {item.title}
                </Text>
                <Text className="mt-1 text-[13px] text-ink/70" style={{ fontFamily: FONT.regular }}>
                  {item.copy}
                </Text>
              </View>
            </View>
            <Button
              className="mt-4"
              label="Run scenario"
              onPress={() => router.push({ pathname: '/simulator/results', params: { scenario: item.id } })}
            />
          </Card>
        ))}
      </View>
    </ScreenContainer>
  );
}
