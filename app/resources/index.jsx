import { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Package } from 'lucide-react-native';
import { RESOURCE_CATEGORIES, RESOURCES } from '@/mock-data/resources';
import ScreenContainer from '@/components/layout/ScreenContainer';
import Header from '@/components/layout/Header';
import EmptyState from '@/components/layout/EmptyState';
import Chip from '@/components/ui/Chip';
import Button from '@/components/ui/Button';
import ResourceCard from '@/components/cards/ResourceCard';

export default function Resources() {
  const router = useRouter();
  const [category, setCategory] = useState('All');
  const items =
    category === 'All' ? RESOURCES : RESOURCES.filter((item) => item.category === category);

  return (
    <ScreenContainer>
      <Header title="Resources" showBack />
      <ScrollView horizontal className="px-4 py-2" showsHorizontalScrollIndicator={false}>
        {RESOURCE_CATEGORIES.map((item) => (
          <Chip key={item} label={item} selected={category === item} onPress={() => setCategory(item)} />
        ))}
      </ScrollView>
      {items.length === 0 ? (
        <EmptyState icon={Package} message="No resources in this category." />
      ) : (
        <ScrollView className="flex-1 px-4" contentContainerStyle={{ paddingBottom: 24 }}>
          {items.map((resource) => (
            <ResourceCard
              key={resource.id}
              resource={resource}
              onPress={() => router.push(`/resources/${resource.id}`)}
            />
          ))}
          <View className="mt-2">
            <Button label="Offer a resource" onPress={() => router.push('/resources/offer')} />
          </View>
        </ScrollView>
      )}
    </ScreenContainer>
  );
}
