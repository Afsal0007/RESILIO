import { ScrollView, Text, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { FONT } from '@/theme/tokens';
import ScreenContainer from '@/components/layout/ScreenContainer';
import Header from '@/components/layout/Header';
import SectionHeading from '@/components/ui/SectionHeading';
import Card from '@/components/ui/Card';
import StatusBadge from '@/components/ui/StatusBadge';

const CHAIN = [
  { id: 'road', title: 'NH 66, Edapally', before: 'available', afterRain: 'limited', afterSlide: 'unavailable', note: 'Water on the carriageway, then a cut.' },
  { id: 'hospital', title: 'Nearest district hospital', before: 'available', afterRain: 'limited', afterSlide: 'limited', note: 'Ambulances reroute. Wait times rise.' },
  { id: 'camp', title: 'Devamatha CMI Public School', before: 'limited', afterRain: 'unavailable', afterSlide: 'unavailable', note: 'Inflow of families. Food and beds run short.' },
];

export default function SimulatorResults() {
  const { scenario } = useLocalSearchParams();
  const isSlide = scenario === 'slide';
  const afterKey = isSlide ? 'afterSlide' : 'afterRain';

  return (
    <ScreenContainer>
      <Header title="Scenario result" variant="status" showBack />
      <ScrollView className="flex-1 px-4" contentContainerStyle={{ paddingBottom: 32 }}>
        <Text className="mt-2 text-[14px] text-ink/80" style={{ fontFamily: FONT.regular }}>
          {isSlide ? 'Landslide on the ghat. The chain starts with the road.' : 'Heavy rain on the Periyar. Status shifts in this order.'}
        </Text>
        <View className="mt-5">
          <SectionHeading>Before / after</SectionHeading>
          {CHAIN.map((item, index) => (
            <View key={item.id} style={{ marginLeft: index * 12 }} className="mb-3">
              <Card variant="alert" status={item[afterKey]}>
                <Text className="text-[15px] text-ink" style={{ fontFamily: FONT.bold }}>
                  {item.title}
                </Text>
                <View className="mt-2 flex-row items-center" style={{ gap: 8 }}>
                  <StatusBadge status={item.before} />
                  <Text className="text-[12px] text-ink/60" style={{ fontFamily: FONT.medium }}>
                    →
                  </Text>
                  <StatusBadge status={item[afterKey]} />
                </View>
                <Text className="mt-2 text-[13px] text-ink/80" style={{ fontFamily: FONT.regular }}>
                  {item.note}
                </Text>
              </Card>
            </View>
          ))}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
