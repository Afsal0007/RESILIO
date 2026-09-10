import { ScrollView, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { VOLUNTEER_TASKS } from '@/mock-data/volunteers';
import { FONT } from '@/theme/tokens';
import ScreenContainer from '@/components/layout/ScreenContainer';
import Header from '@/components/layout/Header';
import Card from '@/components/ui/Card';
import StatusBadge from '@/components/ui/StatusBadge';
import SectionHeading from '@/components/ui/SectionHeading';
import Button from '@/components/ui/Button';

export default function VolunteerDashboard() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();

  return (
    <ScreenContainer>
      <Header title="Volunteer" />
      <ScrollView className="flex-1 px-4" contentContainerStyle={{ paddingBottom: 24 }}>
        <Card variant="browse" className="mt-1">
          <Text className="text-[16px] text-ink" style={{ fontFamily: FONT.bold }}>
            {isAuthenticated ? user.name : 'Guest volunteer'}
          </Text>
          <Text className="mt-1 text-[13px] text-ink/70" style={{ fontFamily: FONT.regular }}>
            {isAuthenticated ? user.role.replace(/_/g, ' ') : 'Log in to take assignments'}
          </Text>
          <View className="mt-3 flex-row" style={{ gap: 8 }}>
            <StatusBadge status={isAuthenticated && user.verified ? 'available' : 'limited'} label={isAuthenticated && user.verified ? 'Verified' : 'Unverified'} />
          </View>
        </Card>

        <View className="mt-6">
          <SectionHeading>Assigned tasks</SectionHeading>
          {VOLUNTEER_TASKS.map((task) => (
            <Card key={task.id} variant="browse" className="mb-3" onPress={() => router.push('/requests')}>
              <View className="flex-row items-start justify-between">
                <View className="flex-1 pr-3">
                  <Text className="text-[15px] text-ink" style={{ fontFamily: FONT.bold }}>
                    {task.title}
                  </Text>
                  <Text className="mt-1 text-[12px] text-ink/70" style={{ fontFamily: FONT.medium }}>
                    {task.when}
                  </Text>
                </View>
                <StatusBadge status={task.status} />
              </View>
            </Card>
          ))}
        </View>

        <Button label="Update skills" variant="secondary" onPress={() => router.push('/volunteer/join')} />
      </ScrollView>
    </ScreenContainer>
  );
}
