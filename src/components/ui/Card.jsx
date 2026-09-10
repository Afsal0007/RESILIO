import { Platform, Pressable, View } from 'react-native';
import { COLORS, RADIUS, STATUS_HEX } from '@/theme/tokens';

export default function Card({
  children,
  variant = 'browse',
  status,
  onPress,
  className = '',
}) {
  const isAlert = variant === 'alert';
  const borderColor = STATUS_HEX[status] || STATUS_HEX.limited;
  const Wrapper = onPress ? Pressable : View;
  const elevationStyle =
    Platform.OS === 'web'
      ? { boxShadow: isAlert ? 'none' : '0 4px 10px rgba(16, 38, 43, 0.08)' }
      : {
          shadowColor: COLORS.ink,
          shadowOpacity: isAlert ? 0 : 0.08,
          shadowRadius: 10,
          shadowOffset: { width: 0, height: 4 },
          elevation: isAlert ? 0 : 2,
        };

  return (
    <Wrapper
      onPress={onPress}
      className={`${isAlert ? 'bg-white' : 'bg-paper-dim'} ${className}`}
      style={{
        borderRadius: isAlert ? RADIUS.sharp : RADIUS.soft,
        padding: 16,
        borderLeftWidth: isAlert ? 4 : 0,
        borderLeftColor: isAlert ? borderColor : 'transparent',
        minHeight: 44,
        ...elevationStyle,
      }}
    >
      {children}
    </Wrapper>
  );
}
