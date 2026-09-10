import { ScrollView, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { FONT } from '@/theme/tokens';
import { canManageCamp, useCamps } from '@/services/campsStore';
import ScreenContainer from '@/components/layout/ScreenContainer';
import Header from '@/components/layout/Header';
import Card from '@/components/ui/Card';
import StatusBadge from '@/components/ui/StatusBadge';
import VerificationBadge from '@/components/ui/VerificationBadge';
import ProgressBar from '@/components/ui/ProgressBar';
import SectionHeading from '@/components/ui/SectionHeading';
import Button from '@/components/ui/Button';

export default function CampDetail() {
  const { id } = useLocalSearchParams();
  const campId = Array.isArray(id) ? id[0] : id;
  const router = useRouter();
  const { user } = useAuth();
  const { getCamp } = useCamps();
  const camp = getCamp(campId);

  if (!camp) {
    return (
      <ScreenContainer>
        <Header title="Camp details" showBack />
        <View className="flex-1 px-4 pt-6">
          <Text className="text-[15px] text-ink/70" style={{ fontFamily: FONT.medium }}>
            This camp is no longer listed.
          </Text>
        </View>
      </ScreenContainer>
    );
  }

  const occupancy = camp.capacity ? camp.occupied / camp.capacity : 0;
  const canManage = canManageCamp(user, camp);

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
        <View className="mt-3 flex-row flex-wrap" style={{ gap: 8 }}>
          <StatusBadge status={camp.status} />
          <VerificationBadge verified={Boolean(camp.verified)} />
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

        {canManage ? (
          <Button
            className="mt-5"
            label="Manage camp"
            variant="secondary"
            onPress={() => router.push(`/camps/${camp.id}/manage`)}
          />
        ) : null}
      </ScrollView>
    </ScreenContainer>
  );
}
