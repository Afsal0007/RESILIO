import { ScrollView, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { getFacility } from '@/mock-data/facilities';
import { FONT } from '@/theme/tokens';
import ScreenContainer from '@/components/layout/ScreenContainer';
import Header from '@/components/layout/Header';
import Card from '@/components/ui/Card';
import StatusBadge from '@/components/ui/StatusBadge';
import SectionHeading from '@/components/ui/SectionHeading';
import Button from '@/components/ui/Button';

export default function FacilityDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const facility = getFacility(id);

  return (
    <ScreenContainer>
      <Header title="Facility" showBack />
      <ScrollView className="flex-1 px-4" contentContainerStyle={{ paddingBottom: 32 }}>
        <Text className="text-[20px] text-ink" style={{ fontFamily: FONT.extrabold }}>
          {facility.name}
        </Text>
        <Text className="mt-1 text-[14px] text-ink/70" style={{ fontFamily: FONT.regular }}>
          {facility.type} · {facility.location}
        </Text>
        <View className="mt-3">
          <StatusBadge
            status={facility.urgency}
            label={facility.urgency === 'unavailable' ? 'Urgent need' : undefined}
          />
        </View>

        <View className="mt-6">
          <SectionHeading>Urgent needs</SectionHeading>
          {facility.needs.map((need) => (
            <Card key={need.name} variant="alert" status={need.status} className="mb-3">
              <View className="flex-row items-center justify-between">
                <Text className="text-[15px] text-ink" style={{ fontFamily: FONT.semibold }}>
                  {need.name}
                </Text>
                <StatusBadge status={need.status} />
              </View>
            </Card>
          ))}
        </View>

        <Button label="Request support" onPress={() => router.push(`/facilities/${facility.id}/request`)} />
      </ScrollView>
    </ScreenContainer>
  );
}
