import { ActivityIndicator, Pressable, Text } from 'react-native';
import { COLORS, FONT, RADIUS, TOUCH_MIN } from '@/theme/tokens';

const VARIANT_STYLES = {
  primary: {
    container: 'bg-backwater',
    text: 'text-paper',
    spinner: COLORS.paper,
  },
  secondary: {
    container: 'border-2 border-backwater bg-transparent',
    text: 'text-backwater',
    spinner: COLORS.backwater,
  },
  danger: {
    container: 'bg-laterite',
    text: 'text-paper',
    spinner: COLORS.paper,
  },
  ghost: {
    container: 'bg-transparent',
    text: 'text-backwater',
    spinner: COLORS.backwater,
  },
};

export default function Button({
  label,
  onPress,
  variant = 'primary',
  size = 'default',
  disabled = false,
  loading = false,
  className = '',
  fullWidth = true,
}) {
  const styles = VARIANT_STYLES[variant] || VARIANT_STYLES.primary;
  const height = size === 'small' ? TOUCH_MIN : 48;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      className={`items-center justify-center px-4 ${styles.container} ${
        fullWidth ? 'w-full' : 'self-start'
      } ${disabled ? 'opacity-50' : ''} ${className}`}
      style={{
        minHeight: height,
        height,
        borderRadius: RADIUS.sharp,
      }}
    >
      {loading ? (
        <ActivityIndicator color={styles.spinner} />
      ) : (
        <Text
          className={`text-[15px] ${styles.text}`}
          style={{ fontFamily: FONT.semibold }}
        >
          {label}
        </Text>
      )}
    </Pressable>
  );
}
