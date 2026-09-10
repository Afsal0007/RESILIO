import { SafeAreaView } from 'react-native-safe-area-context';

export default function ScreenContainer({ children, className = '', edges = ['top', 'left', 'right'] }) {
  return (
    <SafeAreaView className={`flex-1 bg-paper ${className}`} edges={edges}>
      {children}
    </SafeAreaView>
  );
}
