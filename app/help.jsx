import { ScrollView, Text } from 'react-native';
import { HELP_TOPICS } from '@/mock-data/profile';
import { FONT } from '@/theme/tokens';
import ScreenContainer from '@/components/layout/ScreenContainer';
import Header from '@/components/layout/Header';
import Card from '@/components/ui/Card';

export default function Help() {
  return (
    <ScreenContainer>
      <Header title="Help" showBack />
      <ScrollView className="flex-1 px-4" contentContainerStyle={{ paddingBottom: 32 }}>
        {HELP_TOPICS.map((topic) => (
          <Card key={topic.id} variant="browse" className="mb-3">
            <Text className="text-[15px] text-ink" style={{ fontFamily: FONT.bold }}>
              {topic.title}
            </Text>
            <Text className="mt-2 text-[14px] text-ink/80" style={{ fontFamily: FONT.regular }}>
              {topic.body}
            </Text>
          </Card>
        ))}
      </ScrollView>
    </ScreenContainer>
  );
}
