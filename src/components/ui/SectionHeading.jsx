import { Text } from 'react-native';
import { FONT } from '@/theme/tokens';

export default function SectionHeading({ children, className = '' }) {
  return (
    <Text
      className={`mb-3 text-ink ${className}`}
      style={{ fontFamily: FONT.bold, fontSize: 15 }}
    >
      {children}
    </Text>
  );
}
