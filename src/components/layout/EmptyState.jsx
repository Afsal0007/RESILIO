import { Text, View } from 'react-native';
import { FONT } from '@/theme/tokens';
import Button from '@/components/ui/Button';

export default function EmptyState({ icon: Icon, message, actionLabel, onAction }) {
  return (
    <View className="flex-1 items-center justify-center px-6 py-10">
      {Icon ? <Icon color="#1F5C57" size={36} /> : null}
      <Text
        className="mt-4 text-center text-[16px] text-ink"
        style={{ fontFamily: FONT.semibold }}
      >
        {message}
      </Text>
      {actionLabel && onAction ? (
        <View className="mt-5 w-full max-w-xs">
          <Button label={actionLabel} onPress={onAction} />
        </View>
      ) : null}
    </View>
  );
}
