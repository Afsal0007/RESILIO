import { Platform } from 'react-native';

const ANALYZE_TIMEOUT_MS = 15_000;
const FALLBACK_CONFIDENCE = 0.35;
const FALLBACK_LABEL = 'possible_disruption';
const FALLBACK_SOURCE = 'fallback-local';
const FALLBACK_ISSUE =
  'Uncertain observation from this photo. Community confirmation is needed before treating this stretch as closed or clear.';

const KNOWN_LABELS = {
  possible_flooding: 'Possible flooding on the road',
  possible_landslide: 'Possible landslide near the road',
  possible_debris: 'Possible debris on the road',
  possible_blockage: 'Possible blockage on the road',
  fallen_tree: 'Possible fallen tree on the road',
  road_damage: 'Possible road damage',
  no_clear_disruption: 'No clear disruption in this frame. Community confirmation is still needed.',
  possible_disruption: 'Possible disruption on the road',
};

export function clampConfidence(value) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return null;
  return Math.min(1, Math.max(0, numeric));
}

export function statusFromRoadConfidence(confidence, label) {
  if (label === 'no_clear_disruption') return 'limited';
  return confidence >= 0.5 ? 'unavailable' : 'limited';
}

export function fallbackRoadAnalysis(reason = 'unavailable') {
  return {
    label: FALLBACK_LABEL,
    issue: FALLBACK_ISSUE,
    confidence: FALLBACK_CONFIDENCE,
    source: FALLBACK_SOURCE,
    status: 'limited',
    raw: null,
    fallback: true,
    reason,
  };
}

function isPrivateHost(host) {
  const value = String(host || '').toLowerCase();
  if (value === 'localhost' || value === '127.0.0.1' || value === '10.0.2.2') return true;
  if (/^10\.\d+\.\d+\.\d+$/.test(value)) return true;
  if (/^192\.168\.\d+\.\d+$/.test(value)) return true;
  if (/^172\.(1[6-9]|2\d|3[0-1])\.\d+\.\d+$/.test(value)) return true;
  return false;
}

function analyzeEndpoint() {
  let base = String(process.env.EXPO_PUBLIC_RESILIO_AI_URL || '')
    .trim()
    .replace(/\/+$/, '');
  if (!base || /YOUR_COMPUTER_LAN_IP/i.test(base)) return null;

  try {
    const parsed = new URL(base);
    // Uvicorn is HTTP. HTTPS to that port is a TLS handshake, which the
    // server logs as "Invalid HTTP request received" and the app falls back.
    if (parsed.protocol === 'https:' && isPrivateHost(parsed.hostname)) {
      parsed.protocol = 'http:';
      base = parsed.origin;
    }
  } catch {
    return null;
  }

  return `${base}/analyze/road`;
}

function guessMime(uri) {
  const value = String(uri || '').toLowerCase();
  if (value.includes('.png') || value.startsWith('data:image/png')) return 'image/png';
  if (value.includes('.webp') || value.startsWith('data:image/webp')) return 'image/webp';
  if (value.includes('.heic') || value.startsWith('data:image/heic')) return 'image/heic';
  return 'image/jpeg';
}

function filenameFromUri(uri, mime) {
  const extFromMime = String(mime || guessMime(uri)).split('/')[1] || 'jpg';
  const ext = extFromMime === 'jpeg' ? 'jpg' : extFromMime;
  const base = String(uri || '').split('?')[0].split('#')[0].split('/').pop();
  if (base && /\.[a-z0-9]+$/i.test(base) && !base.startsWith('data:')) return base;
  return `roadscan.${ext}`;
}

function nativeFileObject(uri) {
  const type = guessMime(uri);
  return {
    uri,
    name: filenameFromUri(uri, type),
    type,
  };
}

async function toMultipartFile(uri) {
  const rnFile = nativeFileObject(uri);

  if (Platform.OS === 'web') {
    const response = await fetch(uri);
    const blob = await response.blob();
    const type = blob.type || rnFile.type;
    if (typeof File === 'function') {
      return new File([blob], rnFile.name, { type });
    }
    return blob;
  }

  try {
    const response = await fetch(uri);
    const blob = await response.blob();
    if (blob && (blob.size > 0 || blob.type)) return blob;
  } catch {
    // file:// URIs can fail blob conversion; RN FormData accepts { uri, name, type }.
  }

  return rnFile;
}

function safeIssue(value, label) {
  const text = String(value || '').trim();
  if (text) return text.slice(0, 240);
  return KNOWN_LABELS[label] || KNOWN_LABELS[FALLBACK_LABEL];
}

function safeLabel(value) {
  const label = String(value || '').trim();
  if (KNOWN_LABELS[label]) return label;
  if (label && /^[a-z0-9_]{3,64}$/i.test(label)) return label;
  return FALLBACK_LABEL;
}

function normalizeRoadAnalysis(payload) {
  if (!payload || typeof payload !== 'object') return null;
  const confidence = clampConfidence(payload.confidence);
  if (confidence == null) return null;

  const label = safeLabel(payload.label);
  const issue = safeIssue(payload.issue, label);
  const source = String(payload.source || '').trim() || 'unknown';

  return {
    label,
    issue,
    confidence,
    source,
    status: statusFromRoadConfidence(confidence, label),
    raw: payload,
    fallback: false,
    reason: null,
  };
}

async function postAnalyze(url, form) {
  const controller = typeof AbortController === 'function' ? new AbortController() : null;
  const timer = controller ? setTimeout(() => controller.abort(), ANALYZE_TIMEOUT_MS) : null;
  try {
    const response = await fetch(url, {
      method: 'POST',
      body: form,
      signal: controller?.signal,
    });
    return response;
  } finally {
    if (timer) clearTimeout(timer);
  }
}

export async function analyzeRoadEvidence(uri, coords = {}) {
  const url = analyzeEndpoint();
  if (!url || !uri) {
    return fallbackRoadAnalysis(!uri ? 'missing_image' : 'missing_url');
  }

  try {
    const form = new FormData();
    form.append('file', await toMultipartFile(uri));
    if (Number.isFinite(coords.latitude)) form.append('latitude', String(coords.latitude));
    if (Number.isFinite(coords.longitude)) form.append('longitude', String(coords.longitude));

    const response = await postAnalyze(url, form);
    if (!response.ok) return fallbackRoadAnalysis('unreachable');

    let payload = null;
    try {
      payload = await response.json();
    } catch {
      return fallbackRoadAnalysis('invalid');
    }

    return normalizeRoadAnalysis(payload) || fallbackRoadAnalysis('invalid');
  } catch (error) {
    const timedOut = error?.name === 'AbortError';
    return fallbackRoadAnalysis(timedOut ? 'timeout' : 'unreachable');
  }
}
