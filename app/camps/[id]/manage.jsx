import { useEffect, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Minus, Plus } from 'lucide-react-native';
import { useAuth } from '@/context/AuthContext';
import { COLORS, FONT, RADIUS } from '@/theme/tokens';
import { canManageCamp, occupancyStatus, useCamps } from '@/services/campsStore';
import ScreenContainer from '@/components/layout/ScreenContainer';
import Header from '@/components/layout/Header';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import StatusPicker from '@/components/forms/StatusPicker';

export default function ManageCamp() {
  const { id } = useLocalSearchParams();
  const campId = Array.isArray(id) ? id[0] : id;
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const { getCamp, updateCamp } = useCamps();
  const camp = getCamp(campId);
  const allowed = camp && isAuthenticated && canManageCamp(user, camp);

  const [occupied, setOccupied] = useState(camp?.occupied ?? 0);
  const [food, setFood] = useState(camp?.food ?? 'available');
  const [water, setWater] = useState(camp?.water ?? 'available');
  const [medical, setMedical] = useState(camp?.medical ?? 'limited');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!camp) return;
    setOccupied(camp.occupied);
    setFood(camp.food);
    setWater(camp.water);
    setMedical(camp.medical);
  }, [camp]);

  if (!camp) {
    return (
      <ScreenContainer>
        <Header title="Manage camp" showBack />
        <View className="flex-1 px-4 pt-6">
          <Text className="text-[15px] text-ink/70" style={{ fontFamily: FONT.medium }}>
            This camp is no longer listed.
          </Text>
        </View>
      </ScreenContainer>
    );
  }

  if (!allowed) {
    return (
      <ScreenContainer>
        <Header title="Manage camp" showBack />
        <View className="flex-1 px-4 pt-6">
          <Card variant="browse">
            <Text className="text-[16px] text-ink" style={{ fontFamily: FONT.bold }}>
              You cannot manage this camp
            </Text>
            <Text className="mt-2 text-[14px] text-ink/80" style={{ fontFamily: FONT.regular }}>
              Only the registering organization can update occupancy and supplies.
            </Text>
          </Card>
        </View>
      </ScreenContainer>
    );
  }

  const clampOccupied = (value) => Math.max(0, Math.min(camp.capacity, value));

  const savePatch = async (patch) => {
    setSaving(true);
    try {
      await updateCamp(camp.id, patch);
    } finally {
      setSaving(false);
    }
  };

  const onOccupiedChange = (value) => {
    const next = clampOccupied(value);
    setOccupied(next);
    savePatch({
      occupied: next,
      status: camp.closed ? 'unavailable' : occupancyStatus(next, camp.capacity),
    });
  };

  const onSupplyChange = (key, value) => {
    if (key === 'food') setFood(value);
    if (key === 'water') setWater(value);
    if (key === 'medical') setMedical(value);
    savePatch({ [key]: value });
  };

  const onCloseCamp = async () => {
    await savePatch({ closed: true, status: 'unavailable' });
    router.replace(`/camps/${camp.id}`);
  };

  return (
    <ScreenContainer>
      <Header title="Manage camp" showBack />
      <ScrollView className="flex-1 px-4" contentContainerStyle={{ paddingBottom: 32 }}>
        <Text className="text-[20px] text-ink" style={{ fontFamily: FONT.extrabold }}>
          {camp.name}
        </Text>
        <Text className="mt-1 mb-5 text-[14px] text-ink/70" style={{ fontFamily: FONT.regular }}>
          {camp.closed ? 'This camp is marked closed. People can still see it so they do not arrive expecting beds.' : camp.location}
        </Text>

        <Text className="mb-1.5 text-[13px] text-ink" style={{ fontFamily: FONT.medium }}>
          Occupied
        </Text>
        <View className="mb-5 flex-row items-center">
          <Pressable
            onPress={() => onOccupiedChange(occupied - 1)}
            className="items-center justify-center bg-paper-dim"
            style={{ width: 44, height: 44, borderRadius: RADIUS.sharp }}
          >
            <Minus color={COLORS.ink} size={18} />
          </Pressable>
          <Text className="mx-4 text-[22px] text-ink" style={{ fontFamily: FONT.extrabold }}>
            {occupied}
          </Text>
          <Pressable
            onPress={() => onOccupiedChange(occupied + 1)}
            className="items-center justify-center bg-paper-dim"
            style={{ width: 44, height: 44, borderRadius: RADIUS.sharp }}
          >
            <Plus color={COLORS.ink} size={18} />
          </Pressable>
          <Text className="ml-3 text-[13px] text-ink/70" style={{ fontFamily: FONT.medium }}>
            of {camp.capacity}
          </Text>
        </View>

        <StatusPicker label="Food" value={food} onChange={(value) => onSupplyChange('food', value)} />
        <StatusPicker label="Water" value={water} onChange={(value) => onSupplyChange('water', value)} />
        <StatusPicker label="Medical" value={medical} onChange={(value) => onSupplyChange('medical', value)} />

        {camp.closed ? (
          <Text className="mt-2 text-[13px] text-ink/70" style={{ fontFamily: FONT.medium }}>
            Closed camps stay on the map in laterite so people do not arrive for help that is gone.
          </Text>
        ) : (
          <Button className="mt-2" label="Mark camp as closed" variant="danger" onPress={onCloseCamp} loading={saving} />
        )}
      </ScrollView>
    </ScreenContainer>
  );
}
