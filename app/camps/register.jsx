import { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { useApp } from '@/context/AppContext';
import { isOrganizationRole } from '@/constants/roles';
import { occupancyStatus, useCamps } from '@/services/campsStore';
import { KERALA_REGION, requestUserCoords } from '@/hooks/useUserLocation';
import { COLORS, FONT } from '@/theme/tokens';
import ScreenContainer from '@/components/layout/ScreenContainer';
import Header from '@/components/layout/Header';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import ResilioMap from '@/components/map/ResilioMap';
import StatusPicker from '@/components/forms/StatusPicker';

export default function RegisterCamp() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const { showLoginPrompt } = useApp();
  const { addCamp } = useCamps();
  const canRegister = isAuthenticated && isOrganizationRole(user?.role);

  const [name, setName] = useState('');
  const [capacity, setCapacity] = useState('');
  const [contact, setContact] = useState('');
  const [warden, setWarden] = useState('');
  const [food, setFood] = useState('available');
  const [water, setWater] = useState('available');
  const [medical, setMedical] = useState('limited');
  const [pin, setPin] = useState({
    latitude: KERALA_REGION.latitude,
    longitude: KERALA_REGION.longitude,
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let active = true;
    requestUserCoords().then((coords) => {
      if (!active || !coords) return;
      setPin((current) => {
        const stillDefault =
          current.latitude === KERALA_REGION.latitude &&
          current.longitude === KERALA_REGION.longitude;
        return stillDefault ? coords : current;
      });
    });
    return () => {
      active = false;
    };
  }, []);

  const onSubmit = async () => {
    const nextErrors = {};
    if (!name.trim()) nextErrors.name = 'Camp name is required.';
    const capacityValue = Number(capacity);
    if (!capacity || Number.isNaN(capacityValue) || capacityValue < 1) {
      nextErrors.capacity = 'Enter a capacity of at least 1.';
    }
    if (!contact.trim()) nextErrors.contact = 'Contact number is required.';
    if (!warden.trim()) nextErrors.warden = 'Warden name is required.';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    setSubmitting(true);
    try {
      const occupied = 0;
      const camp = await addCamp({
        name: name.trim(),
        capacity: capacityValue,
        occupied,
        status: occupancyStatus(occupied, capacityValue),
        location: `${pin.latitude.toFixed(4)}, ${pin.longitude.toFixed(4)}`,
        district: 'Kerala',
        lat: pin.latitude,
        lng: pin.longitude,
        food,
        water,
        medical,
        contact: contact.trim(),
        warden: warden.trim(),
        distanceKm: 0,
        ownerId: user.id,
        verified: false,
      });
      router.replace(`/camps/${camp.id}`);
    } finally {
      setSubmitting(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <ScreenContainer>
        <Header title="Register a camp" showBack />
        <View className="flex-1 px-4 pt-6">
          <Card variant="browse">
            <Text className="text-[16px] text-ink" style={{ fontFamily: FONT.bold }}>
              Organization accounts only
            </Text>
            <Text className="mt-2 text-[14px] text-ink/80" style={{ fontFamily: FONT.regular }}>
              Sign in as an NGO or resource provider to register a relief camp.
            </Text>
            <Button
              className="mt-4"
              label="Login"
              onPress={() =>
                showLoginPrompt({
                  intendedRoute: '/camps/register',
                  actionLabel: 'register a camp',
                })
              }
            />
          </Card>
        </View>
      </ScreenContainer>
    );
  }

  if (!canRegister) {
    return (
      <ScreenContainer>
        <Header title="Register a camp" showBack />
        <View className="flex-1 px-4 pt-6">
          <Card variant="browse">
            <Text className="text-[16px] text-ink" style={{ fontFamily: FONT.bold }}>
              Only organization accounts can register a camp
            </Text>
            <Text className="mt-2 text-[14px] text-ink/80" style={{ fontFamily: FONT.regular }}>
              Citizen and volunteer accounts can browse camps. Sign up as an NGO or resource provider to add one.
            </Text>
            <Button className="mt-4" label="Sign up as an organization" onPress={() => router.push('/signup')} />
          </Card>
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <Header title="Register a camp" showBack />
      <KeyboardAvoidingView className="flex-1" behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView className="flex-1 px-4" contentContainerStyle={{ paddingBottom: 32 }} keyboardShouldPersistTaps="handled">
          <Text className="mb-4 text-[14px] text-ink/80" style={{ fontFamily: FONT.regular }}>
            Drop a pin on the real site. People nearby will see this camp on the live map as soon as you publish.
          </Text>
          <Input
            label="Camp name"
            value={name}
            onChangeText={setName}
            placeholder="Parish hall, school, municipal ground"
            autoCapitalize="sentences"
            error={errors.name}
          />
          <Input
            label="Capacity"
            value={capacity}
            onChangeText={setCapacity}
            placeholder="How many people can stay"
            keyboardType="number-pad"
            error={errors.capacity}
          />
          <Text className="mb-1.5 text-[13px] text-ink" style={{ fontFamily: FONT.medium }}>
            Camp location
          </Text>
          <Text className="mb-2 text-[13px] text-ink/70" style={{ fontFamily: FONT.regular }}>
            Drag the pin to the camp. Starts at your GPS if permission is granted.
          </Text>
          <View className="mb-4 overflow-hidden" style={{ height: 220, borderRadius: 8 }}>
            <ResilioMap
              style={{ height: 220 }}
              centerOnUser
              showsUserLocation
              initialRegion={{
                latitude: pin.latitude,
                longitude: pin.longitude,
                latitudeDelta: 0.05,
                longitudeDelta: 0.05,
              }}
              markers={[
                {
                  id: 'camp-pin',
                  coordinate: pin,
                  draggable: true,
                  pinColor: COLORS.backwater,
                  onDragEnd: (event) => setPin(event.nativeEvent.coordinate),
                },
              ]}
            />
          </View>
          <Text className="mb-4 text-[12px] text-ink/60" style={{ fontFamily: FONT.medium }}>
            Pin: {pin.latitude.toFixed(5)}, {pin.longitude.toFixed(5)}
          </Text>
          <Input
            label="Contact number"
            value={contact}
            onChangeText={setContact}
            placeholder="Camp phone"
            keyboardType="phone-pad"
            error={errors.contact}
          />
          <Input
            label="Warden / contact name"
            value={warden}
            onChangeText={setWarden}
            placeholder="Who is on the desk"
            autoCapitalize="words"
            error={errors.warden}
          />
          <StatusPicker label="Food" value={food} onChange={setFood} />
          <StatusPicker label="Water" value={water} onChange={setWater} />
          <StatusPicker label="Medical" value={medical} onChange={setMedical} />
          <Button label="Publish camp" onPress={onSubmit} loading={submitting} />
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}
