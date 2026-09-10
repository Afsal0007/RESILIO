import { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { VOLUNTEER_SKILLS } from '@/mock-data/volunteers';
import { FONT } from '@/theme/tokens';
import ScreenContainer from '@/components/layout/ScreenContainer';
import Header from '@/components/layout/Header';
import Chip from '@/components/ui/Chip';
import Button from '@/components/ui/Button';
import SectionHeading from '@/components/ui/SectionHeading';

export default function VolunteerSkills() {
  const router = useRouter();
  const { category = 'relief' } = useLocalSearchParams();
  const skills = VOLUNTEER_SKILLS[category] || VOLUNTEER_SKILLS.relief;
  const [picked, setPicked] = useState([]);

  const toggle = (skill) => {
    setPicked((current) =>
      current.includes(skill) ? current.filter((item) => item !== skill) : [...current, skill]
    );
  };

  return (
    <ScreenContainer>
      <Header title="Your skills" showBack />
      <ScrollView className="flex-1 px-4" contentContainerStyle={{ paddingBottom: 32 }}>
        <Text className="mb-4 text-[14px] text-ink/80" style={{ fontFamily: FONT.regular }}>
          Select every skill you can use today. You can add more later.
        </Text>
        <SectionHeading>Skill list</SectionHeading>
        <View className="flex-row flex-wrap">
          {skills.map((skill) => (
            <View key={skill} className="mb-2">
              <Chip label={skill} selected={picked.includes(skill)} onPress={() => toggle(skill)} />
            </View>
          ))}
        </View>
        <Button className="mt-4" label="Continue to verification" onPress={() => router.push('/volunteer/verify')} />
      </ScrollView>
    </ScreenContainer>
  );
}
