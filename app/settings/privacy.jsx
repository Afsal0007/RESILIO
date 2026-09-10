import { ScrollView, Text } from 'react-native';
import { FONT } from '@/theme/tokens';
import ScreenContainer from '@/components/layout/ScreenContainer';
import Header from '@/components/layout/Header';
import Card from '@/components/ui/Card';

export default function Privacy() {
  return (
    <ScreenContainer>
      <Header title="Privacy" showBack />
      <ScrollView className="flex-1 px-4" contentContainerStyle={{ paddingBottom: 32 }}>
        <Card variant="browse" className="mt-1">
          <Text className="text-[15px] text-ink" style={{ fontFamily: FONT.bold }}>
            What we store in this build
          </Text>
          <Text className="mt-2 text-[14px] text-ink/80" style={{ fontFamily: FONT.regular }}>
            Session, help-mode preference, and mock users live on this device in AsyncStorage. Nothing is sent to a live backend yet.
          </Text>
        </Card>
        <Card variant="browse" className="mt-3">
          <Text className="text-[15px] text-ink" style={{ fontFamily: FONT.bold }}>
            Location
          </Text>
          <Text className="mt-2 text-[14px] text-ink/80" style={{ fontFamily: FONT.regular }}>
            Location permission is requested only when a feature needs it. Saved places are optional.
          </Text>
        </Card>
      </ScrollView>
    </ScreenContainer>
  );
}
