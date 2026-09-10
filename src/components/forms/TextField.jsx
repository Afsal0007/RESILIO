import { Text, TextInput, View } from 'react-native';

export default function TextField({
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
}) {
  return (
    <View className="mb-4">
      {label ? <Text className="mb-1 text-sm font-medium text-gray-700">{label}</Text> : null}
      <TextInput
        className={`rounded-lg border px-3 py-3 text-base text-gray-900 ${
          error ? 'border-status-red' : 'border-gray-300'
        }`}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#9ca3af"
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        autoCorrect={autoCorrect}
        editable={editable}
      />
      {error ? <Text className="mt-1 text-xs text-status-red">{error}</Text> : null}
    </View>
  );
}
