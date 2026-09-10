import { Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Upload } from 'lucide-react-native';
import { COLORS, FONT, RADIUS } from '@/theme/tokens';
import ScreenContainer from '@/components/layout/ScreenContainer';
import Header from '@/components/layout/Header';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

export default function VolunteerVerify() {
  const router = useRouter();

  return (
    <ScreenContainer>
      <Header title="Verify credentials" showBack />
      <View className="flex-1 px-4 pt-2">
        <Text className="mb-4 text-[14px] text-ink/80" style={{ fontFamily: FONT.regular }}>
          Medical, rescue, electrician, and technician roles need a licence or ID photo. This upload is a placeholder.
        </Text>
        <Card variant="browse">
          <View
            className="items-center justify-center bg-paper py-8"
            style={{ borderRadius: RADIUS.sharp, minHeight: 140 }}
          >
            <Upload color={COLORS.backwater} size={28} />
            <Text className="mt-3 text-[14px] text-ink" style={{ fontFamily: FONT.semibold }}>
              Tap to add ID or licence
            </Text>
          </View>
        </Card>
        <Button className="mt-5" label="Submit for review" onPress={() => router.replace('/volunteer/dashboard')} />
        <Button className="mt-3" variant="ghost" label="Skip for now" onPress={() => router.replace('/volunteer/dashboard')} />
      </View>
    </ScreenContainer>
  );
}
