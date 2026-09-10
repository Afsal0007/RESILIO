import { Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { FONT } from '@/theme/tokens';
import ScreenContainer from '@/components/layout/ScreenContainer';
import Header from '@/components/layout/Header';
import Card from '@/components/ui/Card';
import StatusBadge from '@/components/ui/StatusBadge';
import Button from '@/components/ui/Button';

export default function Profile() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const name = isAuthenticated ? user.name : 'Guest';
  const role = isAuthenticated ? user.role.replace(/_/g, ' ') : 'Browsing';

  return (
    <ScreenContainer>
      <Header title="Profile" showBack />
      <View className="flex-1 px-4 pt-2">
        <Card variant="browse">
          <Text className="text-[20px] text-ink" style={{ fontFamily: FONT.extrabold }}>
            {name}
          </Text>
          <Text className="mt-1 text-[14px] text-ink/70" style={{ fontFamily: FONT.medium }}>
            {role}
          </Text>
          <View className="mt-3">
            <StatusBadge
              status={isAuthenticated && user.verified ? 'available' : 'limited'}
              label={isAuthenticated && user.verified ? 'Verified' : 'Guest or unverified'}
            />
          </View>
        </Card>
        <Button className="mt-4" label="Saved locations" variant="secondary" onPress={() => router.push('/profile/locations')} />
        <Button className="mt-3" label="Settings" variant="ghost" onPress={() => router.push('/settings')} />
      </View>
    </ScreenContainer>
  );
}
