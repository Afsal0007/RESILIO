import { createElement, useCallback, useEffect, useRef } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Locate } from 'lucide-react-native';
import { COLORS, RADIUS } from '@/theme/tokens';
import {
  KERALA_REGION,
  NEIGHBORHOOD_DELTA,
  regionFromCoords,
  requestUserCoords,
} from '@/hooks/useUserLocation';

const LEAFLET_HTML = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
  <style>
    html, body, #map { height: 100%; margin: 0; padding: 0; background: #dce6e2; }
  </style>
</head>
<body>
  <div id="map"></div>
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <script>
    function zoomFromDelta(delta) {
      if (!delta || delta <= 0) return 8;
      return Math.max(2, Math.min(16, Math.round(Math.log2(360 / delta))));
    }
    function send(payload) {
      parent.postMessage(JSON.stringify(payload), '*');
    }

    const map = L.map('map', { zoomControl: true });
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap'
    }).addTo(map);
    map.setView([10.05, 76.3], 8);

    const pinLayer = L.layerGroup().addTo(map);
    let userMarker = null;
    const pins = {};

    function setView(region) {
      map.setView(
        [region.latitude, region.longitude],
        zoomFromDelta(region.latitudeDelta),
        { animate: true }
      );
    }

    function escapeHtml(value) {
      return String(value || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
    }

    function setMarkers(markers) {
      pinLayer.clearLayers();
      Object.keys(pins).forEach((key) => delete pins[key]);
      (markers || []).forEach((marker) => {
        if (marker.draggable) {
          const drag = L.marker([marker.latitude, marker.longitude], { draggable: true });
          drag.on('dragend', function (event) {
            const point = event.target.getLatLng();
            send({ type: 'dragend', id: marker.id, latitude: point.lat, longitude: point.lng });
          });
          if (marker.title) drag.bindPopup(escapeHtml(marker.title));
          drag.addTo(pinLayer);
          pins[marker.id] = drag;
          return;
        }
        let pin;
        if (marker.glyph) {
          const icon = L.divIcon({
            className: '',
            html: '<div style="width:28px;height:28px;border-radius:14px;background:' +
              (marker.pinColor || '#1F5C57') +
              ';border:2px solid #10262B;display:flex;align-items:center;justify-content:center;color:#F1EDE4;font-size:14px;font-weight:700;line-height:28px;text-align:center;">' +
              escapeHtml(marker.glyph) +
              '</div>',
            iconSize: [28, 28],
            iconAnchor: [14, 14],
          });
          pin = L.marker([marker.latitude, marker.longitude], { icon: icon });
        } else {
          pin = L.circleMarker([marker.latitude, marker.longitude], {
            radius: 9,
            color: '#10262B',
            weight: 1,
            fillColor: marker.pinColor || '#1F5C57',
            fillOpacity: 1
          });
        }
        const popup = [marker.title, marker.description]
          .filter(Boolean)
          .map(escapeHtml)
          .join('<br/>');
        if (popup) pin.bindPopup(popup);
        pin.on('click', function () { send({ type: 'press', id: marker.id }); });
        pin.addTo(pinLayer);
        pins[marker.id] = pin;
      });
    }

    function setUser(coords) {
      if (!coords) {
        if (userMarker) { map.removeLayer(userMarker); userMarker = null; }
        return;
      }
      if (!userMarker) {
        userMarker = L.circleMarker([coords.latitude, coords.longitude], {
          radius: 8,
          color: '#ffffff',
          weight: 2,
          fillColor: '#2B6CFF',
          fillOpacity: 1
        }).addTo(map);
      } else {
        userMarker.setLatLng([coords.latitude, coords.longitude]);
      }
    }

    window.addEventListener('message', function (event) {
      try {
        const message = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
        if (!message || !message.type) return;
        if (message.type === 'setView') setView(message);
        if (message.type === 'setMarkers') setMarkers(message.markers);
        if (message.type === 'setUser') setUser(message.show === false ? null : message);
      } catch (error) {}
    });

    send({ type: 'ready' });
  </script>
</body>
</html>`;

function serializeMarkers(markers) {
  return (markers || []).map((marker) => ({
    id: marker.id,
    title: marker.title,
    description: marker.description,
    pinColor: marker.pinColor,
    glyph: marker.glyph || null,
    draggable: Boolean(marker.draggable),
    latitude: marker.coordinate?.latitude,
    longitude: marker.coordinate?.longitude,
  }));
}

export default function ResilioMap({
  initialRegion = KERALA_REGION,
  centerOnUser = false,
  showRecenterButton = false,
  showsUserLocation = false,
  recenterBottom = 24,
  markers = [],
  style,
}) {
  const frameRef = useRef(null);
  const markersRef = useRef(markers);
  markersRef.current = markers;

  const post = useCallback((payload) => {
    frameRef.current?.contentWindow?.postMessage(JSON.stringify(payload), '*');
  }, []);

  const pushState = useCallback(
    (coords) => {
      post({ type: 'setMarkers', markers: serializeMarkers(markersRef.current) });
      if (coords) {
        post({ type: 'setView', ...regionFromCoords(coords, NEIGHBORHOOD_DELTA) });
        if (showsUserLocation) post({ type: 'setUser', ...coords, show: true });
      } else {
        post({ type: 'setView', ...initialRegion });
      }
    },
    [initialRegion, post, showsUserLocation]
  );

  const animateToUser = useCallback(async () => {
    const coords = await requestUserCoords();
    if (coords) pushState(coords);
    else post({ type: 'setView', ...initialRegion });
    return coords;
  }, [initialRegion, post, pushState]);

  useEffect(() => {
    const onMessage = (event) => {
      if (event.source !== frameRef.current?.contentWindow) return;
      let message = event.data;
      try {
        if (typeof message === 'string') message = JSON.parse(message);
      } catch {
        return;
      }
      if (!message?.type) return;
      if (message.type === 'ready') {
        pushState(null);
        if (centerOnUser) animateToUser();
        return;
      }
      if (message.type === 'press') {
        markersRef.current.find((marker) => marker.id === message.id)?.onPress?.();
      }
      if (message.type === 'dragend') {
        const marker = markersRef.current.find((item) => item.id === message.id);
        marker?.onDragEnd?.({
          nativeEvent: { coordinate: { latitude: message.latitude, longitude: message.longitude } },
        });
      }
    };
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, [animateToUser, centerOnUser, pushState]);

  useEffect(() => {
    post({ type: 'setMarkers', markers: serializeMarkers(markers) });
  }, [markers, post]);

  return (
    <View style={[styles.fill, style]}>
      {createElement('iframe', {
        ref: frameRef,
        title: 'RESILIO map',
        srcDoc: LEAFLET_HTML,
        style: {
          width: '100%',
          height: '100%',
          border: 0,
          display: 'block',
        },
      })}
      {showRecenterButton ? (
        <Pressable
          onPress={animateToUser}
          accessibilityRole="button"
          accessibilityLabel="Recenter on my location"
          style={[styles.recenter, { bottom: recenterBottom, right: 16 }]}
        >
          <Locate color={COLORS.backwater} size={22} />
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  fill: {
    flex: 1,
    width: '100%',
    minHeight: 180,
    overflow: 'hidden',
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
  },
});
