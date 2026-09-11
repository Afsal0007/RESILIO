import { useMemo, useState } from 'react';
import { ScrollView, Switch, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '@/context/AuthContext';
import { VOLUNTEER_TASKS } from '@/mock-data/volunteers';
import { COLORS, FONT } from '@/theme/tokens';
import { isDutySharingRole, isOrganizationRole } from '@/constants/roles';
import { verificationDisplay } from '@/services/auth';
import { useCamps } from '@/services/campsStore';
import { toInboxItems, useResilience } from '@/services/resilienceStore';
import { useVolunteerPresence } from '@/services/volunteerPresenceStore';
import ScreenContainer from '@/components/layout/ScreenContainer';
import Header from '@/components/layout/Header';
import Card from '@/components/ui/Card';
import StatusBadge from '@/components/ui/StatusBadge';
import SectionHeading from '@/components/ui/SectionHeading';
import Button from '@/components/ui/Button';

const CONSENT_KEY = '@resilio/on-duty-consent';

async function hasConsented(userId) {
  try {
    const raw = await AsyncStorage.getItem(CONSENT_KEY);
    const ids = raw ? JSON.parse(raw) : [];
    return Array.isArray(ids) && ids.includes(userId);
  } catch {
    return false;
  }
}

async function markConsented(userId) {
  try {
    const raw = await AsyncStorage.getItem(CONSENT_KEY);
    const ids = raw ? JSON.parse(raw) : [];
    const next = Array.isArray(ids) ? ids : [];
    if (!next.includes(userId)) {
      await AsyncStorage.setItem(CONSENT_KEY, JSON.stringify([...next, userId]));
    }
  } catch {
    // Consent is optional; location sharing still requires the in-app confirm.
  }
}

export default function VolunteerDashboard() {
  const router = useRouter();
  const { user } = useAuth();
  const { camps } = useCamps();
  const { sosCases, facilityRequests } = useResilience();
  const incoming = useMemo(
    () => toInboxItems(sosCases, facilityRequests).slice(0, 4),
    [sosCases, facilityRequests]
  );
  const { presence, setOnDuty } = useVolunteerPresence();
  const [toggling, setToggling] = useState(false);
  const [showConsent, setShowConsent] = useState(false);
  const canShareDuty = isDutySharingRole(user?.role);
  const verification = verificationDisplay(user);
  const onDuty = Boolean(presence[user?.id]?.onDuty);
  const ownedCamps = isOrganizationRole(user?.role)
    ? camps.filter((camp) => camp.ownerId === user.id)
    : [];

  const goOnDuty = async () => {
    await markConsented(user.id);
    setShowConsent(false);
    setOnDuty(user.id, true, user.role);
  };

  const onToggleDuty = async (nextValue) => {
    if (toggling) return;
    if (!nextValue) {
      setShowConsent(false);
      setOnDuty(user.id, false);
      return;
    }

    setToggling(true);
    try {
      const consented = await hasConsented(user.id);
      if (consented) {
        await goOnDuty();
        return;
      }
      setShowConsent(true);
    } finally {
      setToggling(false);
    }
  };

  return (
    <ScreenContainer>
      <Header title="Volunteer" />
      <ScrollView className="flex-1 px-4" contentContainerStyle={{ paddingBottom: 24 }}>
        <Card variant="browse" className="mt-1">
          <Text className="text-[16px] text-ink" style={{ fontFamily: FONT.bold }}>
            {user.name}
          </Text>
          <Text className="mt-1 text-[13px] text-ink/70" style={{ fontFamily: FONT.regular }}>
            {user.role.replace(/_/g, ' ')}
          </Text>
          <View className="mt-3 flex-row" style={{ gap: 8 }}>
            <StatusBadge status={verification.status} label={verification.label} />
          </View>
        </Card>

        {canShareDuty ? (
          <Card variant="alert" status={onDuty ? 'available' : 'limited'} className="mt-4">
            <View className="flex-row items-center justify-between">
              <View className="flex-1 pr-3">
                <Text className="text-[16px] text-ink" style={{ fontFamily: FONT.bold }}>
                  {onDuty ? 'On Duty — sharing my live location' : 'Off Duty — location hidden'}
                </Text>
                <Text className="mt-1 text-[13px] text-ink/70" style={{ fontFamily: FONT.regular }}>
                  {onDuty
                    ? 'Coordinators can match you to nearby requests. Public maps show an approximate area only.'
                    : 'Turn this on when you are ready to respond. Location stays off until you do.'}
                </Text>
              </View>
              <Switch
                value={onDuty || showConsent}
                onValueChange={onToggleDuty}
                disabled={toggling}
                accessibilityLabel={onDuty ? 'On Duty — sharing my live location' : 'Off Duty — location hidden'}
                trackColor={{ false: COLORS.paperDim, true: COLORS.leafLight }}
                thumbColor={onDuty ? COLORS.leaf : COLORS.ink}
              />
            </View>
            {showConsent ? (
              <View className="mt-4">
                <Text className="text-[14px] text-ink/80" style={{ fontFamily: FONT.regular }}>
                  While on duty, your live location is visible to coordinators matching you to nearby requests,
                  and shown as an approximate area on the public skill map. Turn this off anytime.
                </Text>
                <View className="mt-3" style={{ gap: 8 }}>
                  <Button size="small" label="Go on duty" onPress={goOnDuty} />
                  <Button size="small" variant="secondary" label="Cancel" onPress={() => setShowConsent(false)} />
                </View>
              </View>
            ) : null}
          </Card>
        ) : null}

        {ownedCamps.length > 0 ? (
          <View className="mt-6">
            <SectionHeading>My organization</SectionHeading>
            {ownedCamps.map((camp) => (
              <Card
                key={camp.id}
                variant="browse"
                className="mb-3"
                onPress={() => router.push(`/camps/${camp.id}/manage`)}
              >
                <View className="flex-row items-start justify-between">
                  <View className="flex-1 pr-3">
                    <Text className="text-[15px] text-ink" style={{ fontFamily: FONT.bold }}>
                      {camp.name}
                    </Text>
                    <Text className="mt-1 text-[12px] text-ink/70" style={{ fontFamily: FONT.medium }}>
                      {camp.occupied}/{camp.capacity} people
                    </Text>
                  </View>
                  <StatusBadge status={camp.status} />
                </View>
              </Card>
            ))}
          </View>
        ) : null}

        <View className="mt-6">
          <SectionHeading>Incoming requests</SectionHeading>
          {incoming.length === 0 ? (
            <Card variant="browse" className="mb-3" onPress={() => router.push('/requests')}>
              <Text className="text-[15px] text-ink" style={{ fontFamily: FONT.bold }}>
                Open request inbox
              </Text>
              <Text className="mt-1 text-[12px] text-ink/70" style={{ fontFamily: FONT.medium }}>
                New SOS and facility asks appear here.
              </Text>
            </Card>
          ) : (
            incoming.map((request) => (
              <Card
                key={request.id}
                variant="alert"
                status={request.status}
                className="mb-3"
                onPress={() => router.push(`/requests/${request.id}`)}
              >
                <View className="flex-row items-start justify-between">
                  <View className="flex-1 pr-3">
                    <Text className="text-[15px] text-ink" style={{ fontFamily: FONT.bold }}>
                      {request.title}
                    </Text>
                    <Text className="mt-1 text-[12px] text-ink/70" style={{ fontFamily: FONT.medium }}>
                      {request.type} · {request.location}
                    </Text>
                  </View>
                  <StatusBadge
                    status={request.status}
                    label={request.status === 'accepted' ? 'Volunteer assigned' : undefined}
                  />
                </View>
              </Card>
            ))
          )}
          <Button label="Open full inbox" variant="secondary" onPress={() => router.push('/requests')} />
        </View>

        <View className="mt-6">
          <SectionHeading>Assigned tasks</SectionHeading>
          {VOLUNTEER_TASKS.map((task) => (
            <Card key={task.id} variant="browse" className="mb-3" onPress={() => router.push('/requests')}>
              <View className="flex-row items-start justify-between">
                <View className="flex-1 pr-3">
                  <Text className="text-[15px] text-ink" style={{ fontFamily: FONT.bold }}>
                    {task.title}
                  </Text>
                  <Text className="mt-1 text-[12px] text-ink/70" style={{ fontFamily: FONT.medium }}>
                    {task.when}
                  </Text>
                </View>
                <StatusBadge status={task.status} />
              </View>
            </Card>
          ))}
        </View>

        <Button label="Verify credentials" variant="secondary" onPress={() => router.push('/volunteer/verify')} />
        <Button className="mt-3" label="Update skills" variant="ghost" onPress={() => router.push('/volunteer/join')} />
      </ScrollView>
    </ScreenContainer>
  );
}
