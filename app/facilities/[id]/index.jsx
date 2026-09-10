import { ScrollView, Text, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { getFacility } from '@/mock-data/facilities';
import { FONT } from '@/theme/tokens';
import useGuardedAction from '@/hooks/useGuardedAction';
import ScreenContainer from '@/components/layout/ScreenContainer';
import Header from '@/components/layout/Header';
import Card from '@/components/ui/Card';
import StatusBadge from '@/components/ui/StatusBadge';
import SectionHeading from '@/components/ui/SectionHeading';
import Button from '@/components/ui/Button';

export default function FacilityDetail() {
  const { id } = useLocalSearchParams();
  const requireAuth = useGuardedAction();
  const facility = getFacility(id);

  if (!facility) {
    return (
      <ScreenContainer>
        <Header title="Facility" showBack />
        <View className="flex-1 px-4 pt-6">
          <Text className="text-[15px] text-ink/70" style={{ fontFamily: FONT.medium }}>
            This facility is no longer listed.
          </Text>
        </View>
      </ScreenContainer>
    );
  }

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

        {/* TODO: facility "manage" actions (org admins editing needs lists) are not in this pass. Guard those screens when they are built. */}
        <Button
          label="Request support"
          onPress={() =>
            requireAuth(
              `/facilities/${facility.id}/request`,
              'post an urgent need'
            )
          }
        />
      </ScrollView>
    </ScreenContainer>
  );
}
