import { View } from 'react-native';
import { COLORS } from '@/theme/tokens';

export default function MapPlaceholder({ children }) {
  return (
    <View className="flex-1 overflow-hidden bg-monsoon">
      <View className="absolute inset-0 opacity-30">
        {[0, 1, 2, 3, 4, 5, 6].map((row) => (
          <View key={`h-${row}`} className="absolute left-0 right-0 h-px bg-paper" style={{ top: `${row * 16}%` }} />
        ))}
        {[0, 1, 2, 3, 4].map((col) => (
          <View key={`v-${col}`} className="absolute top-0 bottom-0 w-px bg-paper" style={{ left: `${col * 22}%` }} />
        ))}
        <View
          className="absolute rounded-full bg-backwater-light"
          style={{ width: 90, height: 70, top: '28%', left: '18%', opacity: 0.5 }}
        />
        <View
          className="absolute rounded-full bg-monsoon-light"
          style={{ width: 120, height: 80, top: '48%', left: '42%', opacity: 0.45 }}
        />
      </View>
      <View className="absolute bottom-6 left-5">
        {['Camps', 'Roads', 'Aid'].map((label, i) => (
          <View key={label} className="mb-1.5 flex-row items-center">
            <View
              className="mr-2 h-2 w-2 rounded-full"
              style={{ backgroundColor: [COLORS.leaf, COLORS.marigold, COLORS.monsoonLight][i] }}
            />
          </View>
        ))}
      </View>
      {children}
    </View>
  );
}
