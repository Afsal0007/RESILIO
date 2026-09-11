import { Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

function pickerOptions() {
  const mediaTypes = ImagePicker.MediaTypeOptions?.Images ?? ['images'];
  return {
    mediaTypes,
    quality: 0.7,
    allowsEditing: false,
  };
}

async function launchPicker(launcher) {
  const result = await launcher(pickerOptions());
  if (result.canceled) return null;
  return result.assets?.[0]?.uri || null;
}

export async function pickFromLibrary() {
  try {
    // Web must open the file dialog in the same user-gesture turn. Awaiting
    // a permission prompt first causes the picker to be blocked/cancelled.
    if (Platform.OS !== 'web') {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) return null;
    }
    return await launchPicker(ImagePicker.launchImageLibraryAsync);
  } catch {
    return null;
  }
}

export async function takePhoto() {
  try {
    if (Platform.OS !== 'web') {
      const permission = await ImagePicker.requestCameraPermissionsAsync();
      if (!permission.granted) return null;
    }
    return await launchPicker(ImagePicker.launchCameraAsync);
  } catch {
    return null;
  }
}
