import { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { CAMPS } from '@/mock-data/camps';
import { FACILITIES } from '@/mock-data/facilities';
import { RESOURCES } from '@/mock-data/resources';
import { ROAD_REPORTS } from '@/mock-data/road-reports';
import { VOLUNTEER_TASKS } from '@/mock-data/volunteers';
import { FONT } from '@/theme/tokens';
import useGuardedAction from '@/hooks/useGuardedAction';
import ScreenContainer from '@/components/layout/ScreenContainer';
import MapPlaceholder from '@/components/map/MapPlaceholder';
import Chip from '@/components/ui/Chip';
import Card from '@/components/ui/Card';
import StatusBadge from '@/components/ui/StatusBadge';
import CampCard from '@/components/cards/CampCard';
import ResourceCard from '@/components/cards/ResourceCard';
import FacilityCard from '@/components/cards/FacilityCard';

const LAYERS = ['Camps', 'Hospitals', 'Roads', 'Volunteers', 'Resources'];

export default function MapScreen() {
  const router = useRouter();
  const requireAuth = useGuardedAction();
  const [layer, setLayer] = useState('Camps');

  return (
    <ScreenContainer>
      <View className="flex-1">
        <MapPlaceholder />
        <ScrollView
          horizontal
          className="absolute left-0 right-0 top-3 px-4"
          showsHorizontalScrollIndicator={false}
        >
          {LAYERS.map((item) => (
            <Chip key={item} label={item} selected={layer === item} onPress={() => setLayer(item)} />
          ))}
        </ScrollView>

        <View className="absolute bottom-0 left-0 right-0 max-h-[46%] rounded-t-soft bg-paper px-4 pt-3">
          <Text className="mb-3 text-[15px] text-ink" style={{ fontFamily: FONT.bold }}>
            Nearby {layer.toLowerCase()}
          </Text>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 16 }}>
            {layer === 'Camps'
              ? CAMPS.slice(0, 4).map((camp) => (
                  <CampCard key={camp.id} camp={camp} onPress={() => router.push(`/camps/${camp.id}`)} />
                ))
              : null}
            {layer === 'Hospitals'
              ? FACILITIES.filter((item) => item.type === 'Hospital').map((facility) => (
                  <FacilityCard
                    key={facility.id}
                    facility={facility}
                    onPress={() => router.push(`/facilities/${facility.id}`)}
                  />
                ))
              : null}
            {layer === 'Resources'
              ? RESOURCES.slice(0, 4).map((resource) => (
                  <ResourceCard
                    key={resource.id}
                    resource={resource}
                    onPress={() => router.push(`/resources/${resource.id}`)}
                  />
                ))
              : null}
            {layer === 'Roads'
              ? ROAD_REPORTS.map((report) => (
                  <Card
                    key={report.id}
                    variant="alert"
                    status={report.status}
                    className="mb-3"
                    onPress={() => router.push(`/reports/${report.id}`)}
                  >
                    <View className="flex-row items-start justify-between">
                      <View className="flex-1 pr-3">
                        <Text className="text-[15px] text-ink" style={{ fontFamily: FONT.bold }}>
                          {report.roadName}
                        </Text>
                        <Text className="mt-0.5 text-[13px] text-ink/70" style={{ fontFamily: FONT.regular }}>
                          {report.segment}
                        </Text>
                      </View>
                      <StatusBadge status={report.status} />
                    </View>
                  </Card>
                ))
              : null}
            {layer === 'Volunteers'
              ? VOLUNTEER_TASKS.map((task) => (
                  <Card key={task.id} variant="browse" className="mb-3" onPress={() => requireAuth('/volunteer/dashboard', 'open the volunteer desk')}>
                    <View className="flex-row items-start justify-between">
                      <Text className="flex-1 pr-3 text-[15px] text-ink" style={{ fontFamily: FONT.bold }}>
                        {task.title}
                      </Text>
                      <StatusBadge status={task.status} />
                    </View>
                    <Text className="mt-1 text-[12px] text-ink/70" style={{ fontFamily: FONT.medium }}>
                      {task.when}
                    </Text>
                  </Card>
                ))
              : null}
          </ScrollView>
        </View>
      </View>
    </ScreenContainer>
  );
}
