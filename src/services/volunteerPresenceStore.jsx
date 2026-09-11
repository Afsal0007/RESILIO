import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useRef } from 'react';
import { COLORS } from '@/theme/tokens';
import { ROLES, ROLE_MAP_GLYPH, getRoleIcon, skillCategoryForRole } from '@/constants/roles';
import { useAuth } from '@/context/AuthContext';

const PresenceContext = createContext(null);

const JITTER_MIN_DEG = 0.005;
const JITTER_MAX_DEG = 0.01;
const jitterByUser = new Map();

export const ROLE_PIN_COLOR = {
  VOLUNTEER: COLORS.leaf,
  MEDICAL_TEAM: COLORS.laterite,
  RESCUE_TEAM: COLORS.monsoon,
  DRIVER: COLORS.marigold,
  ELECTRICIAN: COLORS.marigold,
  TECHNICIAN: COLORS.backwater,
};

const SEEDED_ACCEPTANCES = {
  'sos:sos-kainakary': 'demo-rescue_team',
  'request:req-insulin': 'demo-medical_team',
};

function nowIso() {
  return new Date().toISOString();
}

function jitterOffsetFor(userId) {
  if (jitterByUser.has(userId)) return jitterByUser.get(userId);
  const magnitude = JITTER_MIN_DEG + Math.random() * (JITTER_MAX_DEG - JITTER_MIN_DEG);
  const angle = Math.random() * Math.PI * 2;
  const offset = {
    dLat: Math.cos(angle) * magnitude,
    dLng: Math.sin(angle) * magnitude,
  };
  jitterByUser.set(userId, offset);
  return offset;
}

export function jitteredCoordinate(userId, lat, lng) {
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
  const { dLat, dLng } = jitterOffsetFor(userId);
  return { latitude: lat + dLat, longitude: lng + dLng };
}

export function publicVolunteerTitle(roleId) {
  const role = ROLES[roleId];
  const label = role?.label || 'Volunteer';
  return `${label} · Available nearby`;
}

export function listOnDutyVolunteers(presence) {
  return Object.entries(presence || {})
    .filter(([, item]) => item?.onDuty && Number.isFinite(item.lat) && Number.isFinite(item.lng))
    .map(([userId, item]) => ({ userId, ...item }));
}

export function toPublicVolunteerMarker(entry) {
  const coordinate = jitteredCoordinate(entry.userId, entry.lat, entry.lng);
  if (!coordinate) return null;
  const roleId = entry.role;
  return {
    id: `volunteer-${entry.userId}`,
    userId: entry.userId,
    role: roleId,
    category: skillCategoryForRole(roleId),
    title: publicVolunteerTitle(roleId),
    description: 'Approximate area — exact location is hidden',
    coordinate,
    pinColor: ROLE_PIN_COLOR[roleId] || COLORS.leaf,
    Icon: getRoleIcon(ROLES[roleId]?.icon),
    glyph: ROLE_MAP_GLYPH[roleId] || '♥',
  };
}

function presenceReducer(state, action) {
  switch (action.type) {
    case 'SET_PRESENCE': {
      const { userId, lat, lng, role } = action;
      return {
        ...state,
        presence: {
          ...state.presence,
          [userId]: {
            lat,
            lng,
            role: role || state.presence[userId]?.role || 'VOLUNTEER',
            onDuty: true,
            updatedAt: nowIso(),
          },
        },
      };
    }
    case 'SET_ON_DUTY': {
      const { userId, onDuty, role } = action;
      if (!onDuty) {
        const nextPresence = { ...state.presence };
        delete nextPresence[userId];
        return { ...state, presence: nextPresence };
      }
      return {
        ...state,
        presence: {
          ...state.presence,
          [userId]: {
            lat: state.presence[userId]?.lat ?? null,
            lng: state.presence[userId]?.lng ?? null,
            role: role || state.presence[userId]?.role || 'VOLUNTEER',
            onDuty: true,
            updatedAt: nowIso(),
          },
        },
      };
    }
    case 'CLEAR_PRESENCE': {
      const current = state.presence[action.userId];
      if (!current) return state;
      if (current.onDuty) {
        return {
          ...state,
          presence: {
            ...state.presence,
            [action.userId]: {
              ...current,
              lat: null,
              lng: null,
              updatedAt: nowIso(),
            },
          },
        };
      }
      const nextPresence = { ...state.presence };
      delete nextPresence[action.userId];
      return { ...state, presence: nextPresence };
    }
    case 'ACCEPT_TASK': {
      return {
        ...state,
        acceptances: {
          ...state.acceptances,
          [action.taskKey]: action.volunteerId,
        },
      };
    }
    default:
      return state;
  }
}

export function VolunteerPresenceProvider({ children }) {
  const { user } = useAuth();
  const [state, dispatch] = useReducer(presenceReducer, {
    presence: {},
    acceptances: { ...SEEDED_ACCEPTANCES },
  });
  const lastUserIdRef = useRef(user?.id || null);

  const setPresence = useCallback((userId, { lat, lng, role }) => {
    if (!userId) return;
    dispatch({ type: 'SET_PRESENCE', userId, lat, lng, role });
  }, []);

  const setOnDuty = useCallback((userId, onDuty, role) => {
    if (!userId) return;
    dispatch({ type: 'SET_ON_DUTY', userId, onDuty: Boolean(onDuty), role });
  }, []);

  const clearPresence = useCallback((userId) => {
    if (!userId) return;
    dispatch({ type: 'CLEAR_PRESENCE', userId });
  }, []);

  const acceptTask = useCallback((taskKey, volunteerId) => {
    if (!taskKey || !volunteerId) return;
    dispatch({ type: 'ACCEPT_TASK', taskKey, volunteerId });
  }, []);

  const getPresence = useCallback((userId) => state.presence[userId] || null, [state.presence]);

  const getAcceptedVolunteerId = useCallback(
    (taskKey) => state.acceptances[taskKey] || null,
    [state.acceptances]
  );

  useEffect(() => {
    const previousId = lastUserIdRef.current;
    if (previousId && previousId !== user?.id) {
      dispatch({ type: 'SET_ON_DUTY', userId: previousId, onDuty: false });
    }
    lastUserIdRef.current = user?.id || null;
  }, [user?.id]);

  const value = useMemo(
    () => ({
      presence: state.presence,
      acceptances: state.acceptances,
      setPresence,
      setOnDuty,
      clearPresence,
      acceptTask,
      getPresence,
      getAcceptedVolunteerId,
    }),
    [
      state.presence,
      state.acceptances,
      setPresence,
      setOnDuty,
      clearPresence,
      acceptTask,
      getPresence,
      getAcceptedVolunteerId,
    ]
  );

  return <PresenceContext.Provider value={value}>{children}</PresenceContext.Provider>;
}

export function useVolunteerPresence() {
  const context = useContext(PresenceContext);
  if (!context) {
    throw new Error('useVolunteerPresence must be used within VolunteerPresenceProvider');
  }
  return context;
}
