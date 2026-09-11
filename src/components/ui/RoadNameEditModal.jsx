import { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Modal, Platform, Text, View } from 'react-native';
import { FONT, RADIUS } from '@/theme/tokens';
import { useResilience } from '@/services/resilienceStore';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

const DEFAULT_SEGMENTS = new Set(['Near your location', 'Location unavailable']);

export default function RoadNameEditModal({ visible, onClose, report }) {
  const { updateRoadReport } = useResilience();
  const [roadName, setRoadName] = useState('');
  const [segment, setSegment] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!visible || !report) return;
    setRoadName(report.roadName || '');
    setSegment(DEFAULT_SEGMENTS.has(report.segment) ? '' : report.segment || '');
    setError('');
  }, [visible, report]);

  const onSave = async () => {
    const nextName = roadName.trim();
    if (!nextName) {
      setError('Add a road name so others can find this report');
      return;
    }
    const nextSegment =
      segment.trim() ||
      report.segment ||
      (report.latitude == null ? 'Location unavailable' : 'Near your location');
    setSaving(true);
    try {
      await updateRoadReport(report.id, {
        roadName: nextName,
        segment: nextSegment,
        roadNameSource: 'manual',
      });
      onClose?.();
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View className="flex-1 items-center justify-center bg-ink/50 px-6">
          <View className="w-full bg-paper p-5" style={{ borderRadius: RADIUS.soft }}>
            <Text className="text-[20px] text-ink" style={{ fontFamily: FONT.extrabold }}>
              Edit road name
            </Text>
            <Text className="mt-2 mb-4 text-[14px] text-ink/80" style={{ fontFamily: FONT.regular }}>
              Correct the name so others can find this report.
            </Text>
            <Input
              label="Road name"
              value={roadName}
              onChangeText={(value) => {
                setRoadName(value);
                if (error) setError('');
              }}
              placeholder="Enter the road name or a nearby landmark"
              autoCapitalize="words"
              error={error}
            />
            <Input
              label="Additional detail (optional)"
              value={segment}
              onChangeText={setSegment}
              placeholder="e.g. near the temple junction, before the bridge"
              autoCapitalize="sentences"
            />
            <View style={{ gap: 12 }}>
              <Button label="Save" loading={saving} onPress={onSave} />
              <Button label="Cancel" variant="secondary" disabled={saving} onPress={onClose} />
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
