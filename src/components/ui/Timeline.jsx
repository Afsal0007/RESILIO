import { Text, View } from 'react-native';
import { COLORS, FONT, STATUS_HEX } from '@/theme/tokens';

export default function Timeline({ steps = [] }) {
  return (
    <View>
      {steps.map((step, index) => {
        const isLast = index === steps.length - 1;
        const color = step.status ? STATUS_HEX[step.status] : COLORS.backwater;
        return (
          <View key={step.id || step.title} className="flex-row">
            <View className="items-center mr-3">
              <View className="h-3 w-3 rounded-full" style={{ backgroundColor: step.done ? color : COLORS.paperDim }} />
              {isLast ? null : <View className="w-0.5 flex-1 bg-paper-dim my-1" />}
            </View>
            <View className={`flex-1 ${isLast ? 'pb-0' : 'pb-4'}`}>
              <Text className="text-[14px] text-ink" style={{ fontFamily: FONT.semibold }}>
                {step.title}
              </Text>
              {step.meta ? (
                <Text className="mt-0.5 text-[12px] text-ink/70" style={{ fontFamily: FONT.regular }}>
                  {step.meta}
                </Text>
              ) : null}
            </View>
          </View>
        );
      })}
    </View>
  );
}
