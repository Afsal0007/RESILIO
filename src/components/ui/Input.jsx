import { Text, TextInput, View } from 'react-native';
import { COLORS, FONT, RADIUS } from '@/theme/tokens';

export default function Input({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'none',
  autoCorrect = false,
  error,
  editable = true,
  multiline = false,
}) {
  return (
    <View className="mb-4">
      {label ? (
        <Text className="mb-1.5 text-[13px] text-ink" style={{ fontFamily: FONT.medium }}>
          {label}
        </Text>
      ) : null}
      <TextInput
        className={`px-3 text-[16px] text-ink ${error ? 'border-laterite' : 'border-backwater/30'}`}
        style={{
          minHeight: multiline ? 96 : 48,
          borderWidth: 1.5,
          borderColor: error ? COLORS.laterite : COLORS.backwater,
          borderRadius: RADIUS.sharp,
          fontFamily: FONT.regular,
          paddingVertical: 12,
          backgroundColor: COLORS.white,
        }}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#7A8A86"
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        autoCorrect={autoCorrect}
        editable={editable}
        multiline={multiline}
        textAlignVertical={multiline ? 'top' : 'center'}
      />
      {error ? (
        <Text className="mt-1 text-[12px] text-laterite" style={{ fontFamily: FONT.medium }}>
          {error}
        </Text>
      ) : null}
    </View>
  );
}
