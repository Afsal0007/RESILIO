import { ActivityIndicator, Text, View } from 'react-native';
import { COLORS, FONT } from '@/theme/tokens';

export default function SplashView({ showSpinner = true, fontsReady = false }) {
  return (
    <View className="flex-1 items-center justify-center bg-backwater">
      {fontsReady ? (
        <>
          <Text style={{ fontFamily: FONT.extrabold, fontSize: 36, color: COLORS.paper }}>
            RESILIO
          </Text>
          <Text
            className="mt-2"
            style={{ fontFamily: FONT.medium, fontSize: 14, color: COLORS.paper }}
          >
            Kerala climate resilience
          </Text>
        </>
      ) : null}
      {showSpinner ? (
        <ActivityIndicator color={COLORS.paper} style={{ marginTop: fontsReady ? 32 : 0 }} />
      ) : null}
    </View>
  );
}
