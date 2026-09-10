import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { RESOURCES } from '@/mock-data/resources';
import { ROAD_REPORTS } from '@/mock-data/road-reports';
import { VOLUNTEER_TASKS } from '@/mock-data/volunteers';
import { COLORS, FONT, STATUS_HEX } from '@/theme/tokens';
import { useCamps, campPinStatus } from '@/services/campsStore';
import { fetchNearbyHospitals } from '@/services/osm';
import useGuardedAction from '@/hooks/useGuardedAction';
import { KERALA_REGION, requestUserCoords } from '@/hooks/useUserLocation';
import ScreenContainer from '@/components/layout/ScreenContainer';
import ResilioMap from '@/components/map/ResilioMap';
import Chip from '@/components/ui/Chip';
import Card from '@/components/ui/Card';
import StatusBadge from '@/components/ui/StatusBadge';
import CampCard from '@/components/cards/CampCard';
import ResourceCard from '@/components/cards/ResourceCard';
import FacilityCard from '@/components/cards/FacilityCard';

const LAYERS = ['Camps', 'Hospitals', 'Roads', 'Volunteers', 'Resources'];
const HOSPITAL_RADIUS_M = 15000;

export default function MapScreen() {
  const router = useRouter();
  const requireAuth = useGuardedAction();
  const { camps } = useCamps();
  const [layer, setLayer] = useState('Camps');
  const [osmHospitals, setOsmHospitals] = useState([]);
  const [hospitalLoading, setHospitalLoading] = useState(false);

  const hospitals = osmHospitals;

  useEffect(() => {
    if (layer !== 'Hospitals') return undefined;
    let cancelled = false;

    (async () => {
      setHospitalLoading(true);
      try {
        const coords = await requestUserCoords();
        const lat = coords?.latitude ?? KERALA_REGION.latitude;
        const lng = coords?.longitude ?? KERALA_REGION.longitude;
        const nearby = await fetchNearbyHospitals(lat, lng, HOSPITAL_RADIUS_M);
        if (!cancelled) setOsmHospitals(nearby);
      } catch {
        if (!cancelled) setOsmHospitals([]);
      } finally {
        if (!cancelled) setHospitalLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [layer]);

  const markers = useMemo(() => {
    if (layer === 'Camps') {
      return camps
        .filter((camp) => camp.lat != null && camp.lng != null)
        .map((camp) => ({
          id: camp.id,
          title: camp.name,
          coordinate: { latitude: camp.lat, longitude: camp.lng },
          pinColor: STATUS_HEX[campPinStatus(camp)],
          onPress: () => router.push(`/camps/${camp.id}`),
        }));
    }
    if (layer === 'Hospitals') {
      return hospitals
        .filter((facility) => facility.lat != null && facility.lng != null)
        .map((facility) => ({
          id: facility.id,
          title: facility.name,
          coordinate: { latitude: facility.lat, longitude: facility.lng },
          pinColor: facility.needs?.length
            ? STATUS_HEX[facility.urgency] || COLORS.backwater
            : COLORS.backwater,
          onPress: facility.needs?.length
            ? () => router.push(`/facilities/${facility.id}`)
            : undefined,
        }));
    }
    if (layer === 'Roads') {
      return ROAD_REPORTS.filter((report) => report.lat != null && report.lng != null).map((report) => ({
        id: report.id,
        title: report.roadName,
        coordinate: { latitude: report.lat, longitude: report.lng },
        pinColor: STATUS_HEX[report.status],
        onPress: () => router.push(`/reports/${report.id}`),
      }));
    }
    return [];
  }, [camps, hospitals, layer, router]);

  return (
    <ScreenContainer>
      <View className="flex-1">
        <ResilioMap
          initialRegion={KERALA_REGION}
          centerOnUser
          showsUserLocation
          showRecenterButton
          recenterBottom="48%"
          markers={markers}
        />
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
          <View className="mb-3 flex-row items-center">
            <Text className="flex-1 text-[15px] text-ink" style={{ fontFamily: FONT.bold }}>
              Nearby {layer.toLowerCase()}
            </Text>
            {layer === 'Hospitals' && hospitalLoading ? (
              <ActivityIndicator color={COLORS.backwater} />
            ) : null}
          </View>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 16 }}>
            {layer === 'Camps'
              ? camps.slice(0, 4).map((camp) => (
                  <CampCard key={camp.id} camp={camp} onPress={() => router.push(`/camps/${camp.id}`)} />
                ))
              : null}
            {layer === 'Hospitals'
              ? hospitals.length === 0 && !hospitalLoading
                ? (
                  <Text className="mb-3 text-[13px] text-ink/70" style={{ fontFamily: FONT.regular }}>
                    No live hospitals found nearby. Check location permission or try again.
                  </Text>
                )
                : hospitals.map((facility) => (
                  <FacilityCard
                    key={facility.id}
                    facility={facility}
                    onPress={
                      facility.needs?.length
                        ? () => router.push(`/facilities/${facility.id}`)
                        : undefined
                    }
                  />
                ))
              : null}
            {layer === 'Hospitals' ? (
              <Text className="mt-1 text-[11px] text-ink/50" style={{ fontFamily: FONT.medium }}>
                Live hospital data via OpenStreetMap
              </Text>
            ) : null}
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
