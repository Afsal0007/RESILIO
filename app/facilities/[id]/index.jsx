import { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { FONT } from '@/theme/tokens';
import useGuardedAction from '@/hooks/useGuardedAction';
import { matchingResources, mergeFacility, useResilience } from '@/services/resilienceStore';
import { getFacility } from '@/mock-data/facilities';
import ScreenContainer from '@/components/layout/ScreenContainer';
import Header from '@/components/layout/Header';
import Card from '@/components/ui/Card';
import StatusBadge from '@/components/ui/StatusBadge';
import SectionHeading from '@/components/ui/SectionHeading';
import Button from '@/components/ui/Button';

export default function FacilityDetail() {
  const { id } = useLocalSearchParams();
  const requireAuth = useGuardedAction();
  const { facilityNeeds, facilityFlags, resources, matchResourceToNeed } = useResilience();
  const facilityId = Array.isArray(id) ? id[0] : id;
  const facility = mergeFacility(getFacility(facilityId), facilityNeeds, facilityFlags);
  const [findingNeedId, setFindingNeedId] = useState(null);

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

  const matches = matchingResources(
    resources,
    facility.needs.find((need) => need.id === findingNeedId)
  );

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
        {facility.alternativeRoute ? (
          <Text className="mt-3 text-[13px] text-ink/80" style={{ fontFamily: FONT.medium }}>
            Alternative route advised for this site.
          </Text>
        ) : null}

        <View className="mt-6">
          <SectionHeading>Urgent needs</SectionHeading>
          {facility.needs.map((need) => (
            <Card key={need.id || need.name} variant="alert" status={need.status} className="mb-3">
              <View className="flex-row items-center justify-between">
                <Text className="text-[15px] text-ink" style={{ fontFamily: FONT.semibold }}>
                  {need.matchStatus === 'in_progress'
                    ? `${need.name} — matched, delivery in progress`
                    : need.name}
                </Text>
                <StatusBadge
                  status={need.status}
                  label={need.matchStatus === 'in_progress' ? 'In progress' : undefined}
                />
              </View>
              {need.status === 'unavailable' && need.matchStatus !== 'in_progress' ? (
                <Button
                  className="mt-3"
                  size="small"
                  variant="secondary"
                  label={findingNeedId === need.id ? 'Hide matches' : 'Find a Match'}
                  onPress={() => setFindingNeedId(findingNeedId === need.id ? null : need.id)}
                />
              ) : null}
            </Card>
          ))}
        </View>

        {findingNeedId ? (
          <View className="mb-5">
            <SectionHeading>Available matches</SectionHeading>
            {matches.length === 0 ? (
              <Text className="mb-3 text-[14px] text-ink/70" style={{ fontFamily: FONT.regular }}>
                No available resource matches this need yet.
              </Text>
            ) : (
              matches.map((resource) => (
                <Card key={resource.id} variant="browse" className="mb-3">
                  <Text className="text-[15px] text-ink" style={{ fontFamily: FONT.semibold }}>
                    {resource.name}
                  </Text>
                  <Text className="mt-1 text-[13px] text-ink/70" style={{ fontFamily: FONT.regular }}>
                    {resource.quantity} {resource.unit} · {resource.provider}
                  </Text>
                  <Button
                    className="mt-3"
                    size="small"
                    label="Request This"
                    onPress={async () => {
                      await matchResourceToNeed(resource.id, findingNeedId);
                      setFindingNeedId(null);
                    }}
                  />
                </Card>
              ))
            )}
          </View>
        ) : null}

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
