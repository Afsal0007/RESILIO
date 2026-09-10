import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Bell, Camera, HeartHandshake, House, Map } from 'lucide-react-native';
import { useAuth } from '@/context/AuthContext';
import { useApp } from '@/context/AppContext';
import { COLORS, FONT, RADIUS } from '@/theme/tokens';

const ICONS = {
  home: House,
  map: Map,
  roadscan: Camera,
  volunteer: HeartHandshake,
  notifications: Bell,
};

const GUARDED_TABS = {
  roadscan: { intendedRoute: '/roadscan', actionLabel: 'scan a road' },
  volunteer: { intendedRoute: '/volunteer/dashboard', actionLabel: 'open the volunteer desk' },
};

export default function BottomNav({ state, descriptors, navigation }) {
  const insets = useSafeAreaInsets();
  const { isAuthenticated } = useAuth();
  const { showLoginPrompt } = useApp();

  return (
    <View
      className="flex-row items-end justify-between bg-paper px-2"
      style={{
        paddingBottom: Math.max(insets.bottom, 8),
        paddingTop: 8,
        borderTopWidth: 1,
        borderTopColor: COLORS.paperDim,
      }}
    >
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label = options.title ?? route.name;
        const isFocused = state.index === index;
        const Icon = ICONS[route.name] || House;
        const isCenter = route.name === 'roadscan';
        const color = isFocused ? COLORS.backwater : COLORS.ink;

        const onPress = () => {
          const guard = GUARDED_TABS[route.name];
          if (guard && !isAuthenticated) {
            showLoginPrompt(guard);
            return;
          }

          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });
          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        if (isCenter) {
          return (
            <Pressable
              key={route.key}
              onPress={onPress}
              className="-mt-5 items-center"
              style={{ minWidth: 64 }}
            >
              <View
                className="items-center justify-center bg-backwater"
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: RADIUS.pill,
                  borderWidth: 4,
                  borderColor: COLORS.paper,
                }}
              >
                <Camera color={COLORS.paper} size={24} />
              </View>
              <Text
                className="mt-1 text-[10px] text-backwater"
                style={{ fontFamily: FONT.semibold }}
              >
                {label}
              </Text>
            </Pressable>
          );
        }

        return (
          <Pressable
            key={route.key}
            onPress={onPress}
            className="flex-1 items-center justify-center"
            style={{ minHeight: 44 }}
          >
            <Icon color={color} size={22} />
            <Text
              className="mt-1 text-[10px]"
              style={{ fontFamily: FONT.semibold, color }}
            >
              {label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
