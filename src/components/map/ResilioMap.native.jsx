import { useEffect, useRef } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { Locate } from 'lucide-react-native';
import { COLORS, RADIUS } from '@/theme/tokens';
import {
  KERALA_REGION,
  NEIGHBORHOOD_DELTA,
  regionFromCoords,
  requestUserCoords,
} from '@/hooks/useUserLocation';

export default function ResilioMap({
  initialRegion = KERALA_REGION,
  centerOnUser = false,
  showRecenterButton = false,
  showsUserLocation = false,
  recenterBottom = 24,
  markers = [],
  children,
  style,
  ...mapProps
}) {
  const mapRef = useRef(null);

  const animateToUser = async () => {
    const coords = await requestUserCoords();
    if (!coords || !mapRef.current) return null;
    mapRef.current.animateToRegion(regionFromCoords(coords, NEIGHBORHOOD_DELTA), 600);
    return coords;
  };

  useEffect(() => {
    if (!centerOnUser) return undefined;
    animateToUser();
    return undefined;
  }, [centerOnUser]);

  return (
    <View style={[styles.fill, style]}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={initialRegion}
        showsUserLocation={showsUserLocation}
        showsMyLocationButton={false}
        toolbarEnabled={false}
        rotateEnabled={false}
        {...mapProps}
      >
        {markers.map((marker) => (
          <Marker
            key={marker.id}
            coordinate={marker.coordinate}
            pinColor={marker.pinColor}
            title={marker.title}
            description={marker.description}
            draggable={Boolean(marker.draggable)}
            onPress={marker.onPress}
            onDragEnd={marker.onDragEnd}
          />
        ))}
        {children}
      </MapView>
      {showRecenterButton ? (
        <RecenterButton bottom={recenterBottom} onPress={animateToUser} />
      ) : null}
    </View>
  );
}

function RecenterButton({ bottom, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel="Recenter on my location"
      style={[styles.recenter, { bottom, right: 16 }]}
    >
      <Locate color={COLORS.backwater} size={22} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  fill: {
    flex: 1,
    width: '100%',
    minHeight: 180,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  recenter: {
    position: 'absolute',
    width: 48,
    height: 48,
    borderRadius: RADIUS.pill,
    backgroundColor: COLORS.paper,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 20,
    elevation: 4,
  },
});
