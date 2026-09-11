import { useCallback, useEffect, useRef, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { COLORS, FONT, RADIUS } from '@/theme/tokens';
import ScreenContainer from '@/components/layout/ScreenContainer';
import Header from '@/components/layout/Header';
import Button from '@/components/ui/Button';

export default function RoadScanCapture() {
  const router = useRouter();
  const cameraRef = useRef(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [isFocused, setIsFocused] = useState(true);
  const [cameraReady, setCameraReady] = useState(false);
  const [capturing, setCapturing] = useState(false);

  useEffect(() => {
    if (permission?.status === 'undetermined') {
      requestPermission();
    }
  }, [permission, requestPermission]);

  useFocusEffect(
    useCallback(() => {
      setIsFocused(true);
      return () => {
        setIsFocused(false);
        setCameraReady(false);
      };
    }, [])
  );

  const onCapture = async () => {
    if (!permission?.granted || !cameraRef.current || !cameraReady || capturing) return;
    setCapturing(true);
    try {
      const result = await cameraRef.current.takePictureAsync();
      if (result?.uri) {
        router.push({ pathname: '/roadscan/review', params: { photoUri: result.uri } });
      }
    } finally {
      setCapturing(false);
    }
  };

  const showCamera = Boolean(permission?.granted && isFocused);

  return (
    <ScreenContainer>
      <Header title="RoadScan" />
      <View className="flex-1 px-4 pb-6">
        <Text className="mt-2 text-[14px] text-ink/80" style={{ fontFamily: FONT.regular }}>
          Stand on the shoulder. Frame the blocked or flooded stretch. Keep the road in the centre of the shot.
        </Text>
        <View
          className="mt-4 flex-1 items-center justify-center bg-ink"
          style={{ borderRadius: RADIUS.soft, overflow: 'hidden' }}
        >
          {permission && !permission.granted ? (
            <View className="items-center px-6">
              <Text className="text-center text-paper" style={{ fontFamily: FONT.medium }}>
                Camera access is needed to scan roads
              </Text>
              <View className="mt-4 w-full">
                <Button label="Allow camera access" onPress={requestPermission} />
              </View>
            </View>
          ) : showCamera ? (
            <CameraView
              ref={cameraRef}
              facing="back"
              style={{ flex: 1, width: '100%', height: '100%' }}
              onCameraReady={() => setCameraReady(true)}
            />
          ) : null}
        </View>
        <Pressable
          onPress={onCapture}
          className="mt-4 self-center items-center justify-center bg-paper"
          style={{
            width: 72,
            height: 72,
            borderRadius: RADIUS.pill,
            borderWidth: 4,
            borderColor: COLORS.backwater,
          }}
        >
          <View className="h-14 w-14 rounded-full bg-backwater" />
        </Pressable>
        <Button className="mt-3" variant="ghost" label="Open scan history" onPress={() => router.push('/roadscan/history')} />
      </View>
    </ScreenContainer>
  );
}
