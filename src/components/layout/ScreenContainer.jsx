import { SafeAreaView } from 'react-native-safe-area-context';

export default function ScreenContainer({ children, className = '' }) {
  return (
    <SafeAreaView className={`flex-1 bg-white ${className}`} edges={['top', 'left', 'right']}>
      {children}
    </SafeAreaView>
  );
}
