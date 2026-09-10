import { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import {
  HeartHandshake,
  LifeBuoy,
  Stethoscope,
  Users,
  Wrench,
} from 'lucide-react-native';
import { VOLUNTEER_CATEGORIES } from '@/mock-data/volunteers';
import { FONT } from '@/theme/tokens';
import ScreenContainer from '@/components/layout/ScreenContainer';
import Header from '@/components/layout/Header';
import SectionHeading from '@/components/ui/SectionHeading';
import IconTile from '@/components/ui/IconTile';
import Button from '@/components/ui/Button';

const ICONS = {
  medical: Stethoscope,
  technical: Wrench,
  rescue: LifeBuoy,
  relief: HeartHandshake,
  community: Users,
};

export default function VolunteerJoin() {
  const router = useRouter();
  const [category, setCategory] = useState('relief');

  return (
    <ScreenContainer>
      <Header title="Join as volunteer" showBack />
      <ScrollView className="flex-1 px-4" contentContainerStyle={{ paddingBottom: 32 }}>
        <Text className="mb-4 text-[14px] text-ink/80" style={{ fontFamily: FONT.regular }}>
          Pick the desk you can staff. Skills come next.
        </Text>
        <SectionHeading>Category</SectionHeading>
        <View className="flex-row flex-wrap justify-between">
          {VOLUNTEER_CATEGORIES.map((item) => (
            <IconTile
              key={item.id}
              icon={ICONS[item.id]}
              label={item.label}
              selected={category === item.id}
              onPress={() => setCategory(item.id)}
            />
          ))}
        </View>
        <Button
          className="mt-2"
          label="Choose skills"
          onPress={() => router.push({ pathname: '/volunteer/skills', params: { category } })}
        />
      </ScrollView>
    </ScreenContainer>
  );
}
