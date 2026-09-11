import { useMemo, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { VOLUNTEER_CATEGORIES } from '@/mock-data/volunteers';
import { FONT } from '@/theme/tokens';
import { skillCategoryForRole } from '@/constants/roles';
import { KERALA_REGION } from '@/hooks/useUserLocation';
import {
  listOnDutyVolunteers,
  toPublicVolunteerMarker,
  useVolunteerPresence,
} from '@/services/volunteerPresenceStore';
import ScreenContainer from '@/components/layout/ScreenContainer';
import Header from '@/components/layout/Header';
import ResilioMap from '@/components/map/ResilioMap';
import Card from '@/components/ui/Card';
import Chip from '@/components/ui/Chip';
import StatusBadge from '@/components/ui/StatusBadge';
import SectionHeading from '@/components/ui/SectionHeading';

const FILTERS = [{ id: 'all', label: 'All' }, ...VOLUNTEER_CATEGORIES];

export default function SkillMap() {
  const { presence } = useVolunteerPresence();
  const [category, setCategory] = useState('all');
  const [selectedId, setSelectedId] = useState(null);

  const volunteers = useMemo(() => {
    const onDuty = listOnDutyVolunteers(presence);
    if (category === 'all') return onDuty;
    return onDuty.filter((entry) => skillCategoryForRole(entry.role) === category);
  }, [category, presence]);

  const markers = useMemo(
    () =>
      volunteers
        .map((entry) => {
          const marker = toPublicVolunteerMarker(entry);
          if (!marker) return null;
          return {
            ...marker,
            onPress: () => setSelectedId(entry.userId),
          };
        })
        .filter(Boolean),
    [volunteers]
  );

  return (
    <ScreenContainer>
      <Header title="Skill map" showBack />
      <View className="h-72">
        <ResilioMap initialRegion={KERALA_REGION} markers={markers} />
      </View>
      <ScrollView className="flex-1 px-4 pt-4" contentContainerStyle={{ paddingBottom: 24 }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
          {FILTERS.map((item) => (
            <Chip
              key={item.id}
              label={item.label}
              selected={category === item.id}
              onPress={() => setCategory(item.id)}
            />
          ))}
        </ScrollView>
        <SectionHeading>People on the ground</SectionHeading>
        {volunteers.length === 0 ? (
          <Text className="text-[14px] text-ink/70" style={{ fontFamily: FONT.regular }}>
            No one in this category is sharing an approximate location right now.
          </Text>
        ) : (
          volunteers.map((entry) => {
            const marker = toPublicVolunteerMarker(entry);
            if (!marker) return null;
            return (
              <Card key={entry.userId} variant="browse" className="mb-3" onPress={() => setSelectedId(entry.userId)}>
                <View className="flex-row items-start justify-between">
                  <Text className="flex-1 pr-3 text-[15px] text-ink" style={{ fontFamily: FONT.bold }}>
                    {marker.title}
                  </Text>
                  <StatusBadge status="available" label="On duty" />
                </View>
                <Text className="mt-1 text-[12px] text-ink/70" style={{ fontFamily: FONT.medium }}>
                  {selectedId === entry.userId
                    ? marker.description
                    : `${VOLUNTEER_CATEGORIES.find((item) => item.id === marker.category)?.label || 'Community'} · approximate area`}
                </Text>
              </Card>
            );
          })
        )}
      </ScrollView>
    </ScreenContainer>
  );
}
