import { ScrollView, Text, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { getCamp } from '@/mock-data/camps';
import { FONT } from '@/theme/tokens';
import ScreenContainer from '@/components/layout/ScreenContainer';
import Header from '@/components/layout/Header';
import Card from '@/components/ui/Card';
import StatusBadge from '@/components/ui/StatusBadge';
import ProgressBar from '@/components/ui/ProgressBar';
import SectionHeading from '@/components/ui/SectionHeading';

export default function CampDetail() {
  const { id } = useLocalSearchParams();
  const camp = getCamp(id);
  const occupancy = camp.occupied / camp.capacity;

  return (
    <ScreenContainer>
      <Header title="Camp details" showBack />
      <ScrollView className="flex-1 px-4" contentContainerStyle={{ paddingBottom: 32 }}>
        <Text className="text-[20px] text-ink" style={{ fontFamily: FONT.extrabold }}>
          {camp.name}
        </Text>
        <Text className="mt-1 text-[14px] text-ink/70" style={{ fontFamily: FONT.regular }}>
          {camp.location}
        </Text>
        <View className="mt-3">
          <StatusBadge status={camp.status} />
        </View>

        <Card variant="browse" className="mt-5">
          <SectionHeading>Capacity</SectionHeading>
          <Text className="mb-2 text-[13px] text-ink" style={{ fontFamily: FONT.medium }}>
            {camp.occupied} of {camp.capacity} people
          </Text>
          <ProgressBar value={occupancy} status={camp.status} />
        </Card>

        <View className="mt-5">
          <SectionHeading>Supplies</SectionHeading>
          {[
            ['Food', camp.food],
            ['Water', camp.water],
            ['Medical', camp.medical],
          ].map(([label, status]) => (
            <Card key={label} variant="alert" status={status} className="mb-3">
              <View className="flex-row items-center justify-between">
                <Text className="text-[15px] text-ink" style={{ fontFamily: FONT.semibold }}>
                  {label}
                </Text>
                <StatusBadge status={status} />
              </View>
            </Card>
          ))}
        </View>

        {/* TODO: camp "manage" actions (org admins editing capacity/needs) are not in this pass. Guard those screens when they are built. */}
        <Card variant="browse">
          <Text className="text-[13px] text-ink/70" style={{ fontFamily: FONT.medium }}>
            Warden
          </Text>
          <Text className="text-[15px] text-ink" style={{ fontFamily: FONT.semibold }}>
            {camp.warden}
          </Text>
          <Text className="mt-2 text-[13px] text-ink/70" style={{ fontFamily: FONT.medium }}>
            Contact
          </Text>
          <Text className="text-[15px] text-ink" style={{ fontFamily: FONT.semibold }}>
            {camp.contact}
          </Text>
        </Card>
      </ScrollView>
    </ScreenContainer>
  );
}
