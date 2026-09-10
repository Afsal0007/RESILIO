import { Text, View } from 'react-native';
import { Users } from 'lucide-react-native';
import { FONT, RADIUS } from '@/theme/tokens';
import VerificationBadge from '@/components/ui/VerificationBadge';

const MUTED = '#7A8A86';

export default function CampSourceBadge({ camp }) {
  if (camp?.dataSource === 'registered') {
    return <VerificationBadge verified={Boolean(camp.verified)} />;
  }

  return (
    <View
      className="flex-row items-center self-start bg-paper px-2.5"
      style={{ height: 24, borderRadius: RADIUS.pill }}
    >
      <Users color={MUTED} size={12} />
      <Text className="ml-1 text-[11px] text-ink" style={{ fontFamily: FONT.semibold, color: MUTED }}>
        Community reported
      </Text>
    </View>
  );
}
