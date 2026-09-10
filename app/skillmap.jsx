import { ScrollView, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { VOLUNTEER_TASKS } from '@/mock-data/volunteers';
import { FONT } from '@/theme/tokens';
import ScreenContainer from '@/components/layout/ScreenContainer';
import Header from '@/components/layout/Header';
import MapPlaceholder from '@/components/map/MapPlaceholder';
import Card from '@/components/ui/Card';
import StatusBadge from '@/components/ui/StatusBadge';
import SectionHeading from '@/components/ui/SectionHeading';

export default function SkillMap() {
  const router = useRouter();

  return (
    <ScreenContainer>
      <Header title="Skill map" showBack />
      <View className="h-56">
        <MapPlaceholder />
      </View>
      <ScrollView className="flex-1 px-4 pt-4" contentContainerStyle={{ paddingBottom: 24 }}>
        <SectionHeading>People on the ground</SectionHeading>
        {VOLUNTEER_TASKS.map((task) => (
          <Card key={task.id} variant="browse" className="mb-3" onPress={() => router.push('/volunteer/dashboard')}>
            <View className="flex-row items-start justify-between">
              <Text className="flex-1 pr-3 text-[15px] text-ink" style={{ fontFamily: FONT.bold }}>
                {task.title}
              </Text>
              <StatusBadge status={task.status} />
            </View>
          </Card>
        ))}
      </ScrollView>
    </ScreenContainer>
  );
}
