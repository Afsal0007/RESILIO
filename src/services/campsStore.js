import { createContext, useCallback, useContext, useMemo, useReducer } from 'react';
import { CAMPS } from '@/mock-data/camps';
import { NGO_ORGANIZATION, isOrganizationRole } from '@/constants/roles';

const CampsContext = createContext(null);

const STATUS_RANK = {
  available: 1,
  limited: 2,
  unavailable: 3,
};

export function occupancyStatus(occupied, capacity) {
  if (!capacity || capacity <= 0) return 'unavailable';
  const ratio = occupied / capacity;
  if (ratio >= 0.95) return 'unavailable';
  if (ratio >= 0.7) return 'limited';
  return 'available';
}

export function campPinStatus(camp) {
  return [camp.status, camp.food, camp.water, camp.medical].reduce((worst, status) => {
    if ((STATUS_RANK[status] || 0) > (STATUS_RANK[worst] || 0)) return status;
    return worst;
  }, 'available');
}

export function canManageCamp(user, camp) {
  if (!user || !camp || !isOrganizationRole(user.role)) return false;
  if (camp.ownerId && camp.ownerId === user.id) return true;
  return user.role === NGO_ORGANIZATION.id;
}

function campsReducer(state, action) {
  switch (action.type) {
    case 'ADD':
      return { camps: [action.camp, ...state.camps] };
    case 'UPDATE':
      return {
        camps: state.camps.map((camp) =>
          camp.id === action.id ? { ...camp, ...action.patch } : camp
        ),
      };
    default:
      return state;
  }
}

export function CampsProvider({ children }) {
  const [state, dispatch] = useReducer(campsReducer, {
    camps: CAMPS.map((camp) => ({
      ...camp,
      dataSource: camp.dataSource ?? 'reported',
      verified: camp.dataSource === 'registered' ? Boolean(camp.verified) : false,
    })),
  });

  const addCamp = useCallback(async (payload) => {
    // Stand-in for POST /camps
    const camp = {
      id: `camp-${Date.now()}`,
      occupied: 0,
      closed: false,
      verified: false,
      ...payload,
      dataSource: payload.dataSource ?? 'registered',
    };
    dispatch({ type: 'ADD', camp });
    return camp;
  }, []);

  const updateCamp = useCallback(async (id, patch) => {
    // Stand-in for PATCH /camps/:id
    dispatch({ type: 'UPDATE', id, patch });
  }, []);

  const getCamp = useCallback(
    (id) => state.camps.find((camp) => camp.id === id),
    [state.camps]
  );

  const listCamps = useCallback(() => state.camps, [state.camps]);

  const value = useMemo(
    () => ({
      camps: state.camps,
      addCamp,
      updateCamp,
      getCamp,
      listCamps,
    }),
    [state.camps, addCamp, updateCamp, getCamp, listCamps]
  );

  return <CampsContext.Provider value={value}>{children}</CampsContext.Provider>;
}

export function useCamps() {
  const context = useContext(CampsContext);
  if (!context) {
    throw new Error('useCamps must be used within CampsProvider');
  }
  return context;
}
