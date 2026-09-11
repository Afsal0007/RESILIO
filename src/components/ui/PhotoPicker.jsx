import { Image, Pressable, Text, View } from 'react-native';
import { Upload } from 'lucide-react-native';
import { COLORS, FONT, RADIUS } from '@/theme/tokens';
import { pickFromLibrary, takePhoto } from '@/utils/media';
import Button from '@/components/ui/Button';

export default function PhotoPicker({ value, onChange }) {
  const onTake = async () => {
    const uri = await takePhoto();
    if (uri) onChange(uri);
  };

  const onLibrary = async () => {
    const uri = await pickFromLibrary();
    if (uri) onChange(uri);
  };

  return (
    <View>
      {value ? (
        <Image
          source={{ uri: value }}
          className="w-full"
          style={{ height: 180, borderRadius: RADIUS.soft }}
          resizeMode="cover"
        />
      ) : (
        <Pressable
          onPress={onLibrary}
          accessibilityRole="button"
          accessibilityLabel="Tap to add ID or licence"
          className="items-center justify-center bg-paper py-8"
          style={{
            minHeight: 140,
            borderRadius: RADIUS.sharp,
            borderWidth: 1.5,
            borderStyle: 'dashed',
            borderColor: COLORS.backwater,
          }}
        >
          <Upload color={COLORS.backwater} size={28} />
          <Text className="mt-3 text-[14px] text-ink" style={{ fontFamily: FONT.semibold }}>
            Tap to add ID or licence
          </Text>
        </Pressable>
      )}
      <View className="mt-3" style={{ gap: 8 }}>
        <Button size="small" label="Take Photo" onPress={onTake} />
        <Button size="small" variant="secondary" label="Choose from Library" onPress={onLibrary} />
        {value ? (
          <Button size="small" variant="ghost" label="Remove" onPress={() => onChange(null)} />
        ) : null}
      </View>
    </View>
  );
}
