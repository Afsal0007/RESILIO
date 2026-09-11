import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ROAD_REPORTS } from '@/mock-data/road-reports';
import { RESOURCES } from '@/mock-data/resources';
import { FACILITIES } from '@/mock-data/facilities';
import { SOS_CASES } from '@/mock-data/sos';
import { ZONES } from '@/mock-data/dashboard';
import { occupancyStatus, useCamps } from '@/services/campsStore';

const STORAGE_KEY = '@resilio/resilience-v1';
const ResilienceContext = createContext(null);

const REPORT_ZONE = {
  'nh66-edapally': 'zone-ernakulam',
  'nh766-vythiri': 'zone-wayanad',
  'mc-road-perumbavoor': 'zone-ernakulam',
  'sh8-chalakudy': 'zone-thrissur',
  'punnamada-rd': 'zone-kuttanad',
};

const RAIN_ROAD_PATCHES = {
  'nh66-edapally': { status: 'unavailable', issue: 'Standing water. Carriageway flooding near the bypass.' },
  'sh8-chalakudy': { status: 'unavailable', issue: 'Water over the approach road. High vehicles only, if at all.' },
  'punnamada-rd': { status: 'limited', issue: 'Water returning to the finishing-point stretch.' },
  'mc-road-perumbavoor': { status: 'unavailable', issue: 'Junction flooded. Shoulder collapse plus standing water.' },
};

const SLIDE_ROAD_PATCHES = {
  'nh766-vythiri': { status: 'unavailable', issue: 'Debris and slope crack. Ghat closed both ways.' },
  'mc-road-perumbavoor': { status: 'limited', issue: 'Diversions filling after the ghat closure.' },
};

const SCENARIO_CAMP_IDS = ['devamatha-cmi-thrissur', 'holy-family-school-thrissur'];
const SLIDE_FACILITY_ID = 'fac-thrissur-collectorate';

function nowIso() {
  return new Date().toISOString();
}

function needCategory(name) {
  const value = String(name || '').toLowerCase();
  if (value.includes('generator')) return 'Generator';
  if (value.includes('fuel') || value.includes('transport')) return 'Transport';
  if (value.includes('water')) return 'Water';
  if (value.includes('food') || value.includes('rice')) return 'Food';
  if (value.includes('jacket') || value.includes('tarp') || value.includes('shelter')) return 'Shelter';
  if (value.includes('radio') || value.includes('medical')) return 'Medical';
  return name;
}

function seedFacilityNeeds() {
  return FACILITIES.flatMap((facility) =>
    (facility.needs || []).map((need, index) => ({
      id: `${facility.id}-need-${index}`,
      facilityId: facility.id,
      name: need.name,
      status: need.status,
      category: needCategory(need.name),
      matchStatus: null,
      matchedResourceId: null,
    }))
  );
}

function seedRoadReports() {
  return ROAD_REPORTS.map((report) => ({
    ...report,
    zoneId: REPORT_ZONE[report.id] || null,
    evidenceUri: report.evidenceUri || null,
    detectedIssue: report.detectedIssue || null,
    capturedAt: report.capturedAt || null,
    latitude: report.lat ?? null,
    longitude: report.lng ?? null,
  }));
}

function createInitialState() {
  return {
    roadReports: seedRoadReports(),
    resources: RESOURCES.map((item) => ({ ...item })),
    facilityNeeds: seedFacilityNeeds(),
    sosCases: SOS_CASES.map((item) => ({ ...item })),
    matches: [],
    facilityFlags: {},
    scenarioState: 'normal',
    lastUpdated: nowIso(),
    baselineSnapshot: null,
  };
}

export function statusFromConfidence(confidence) {
  if (confidence >= 0.5) return 'unavailable';
  return 'limited';
}

export function applyConfirmation(report, confirmerName) {
  const already = (report.confirmations || []).some(
    (item) => item.name === confirmerName || item.id === `confirm-${confirmerName}`
  );
  if (already) return report;
  const confidence = Math.min(0.95, Number(report.confidence || 0) + 0.15);
  return {
    ...report,
    confidence,
    status: statusFromConfidence(confidence),
    confirmations: [
      ...(report.confirmations || []),
      {
        id: `confirm-${Date.now()}`,
        name: confirmerName,
        time: 'Just now',
      },
    ],
  };
}

function stamp(state, patch) {
  return { ...state, ...patch, lastUpdated: nowIso() };
}

function snapshotRecords(state, campsSnapshot) {
  return {
    roadReports: state.roadReports.map((item) => ({ ...item })),
    facilityNeeds: state.facilityNeeds.map((item) => ({ ...item })),
    facilityFlags: { ...state.facilityFlags },
    camps: campsSnapshot,
  };
}

function applyRoadPatches(reports, patches) {
  return reports.map((report) =>
    patches[report.id] ? { ...report, ...patches[report.id] } : report
  );
}

function bumpNeeds(needs, names, status) {
  const set = new Set(names.map((name) => name.toLowerCase()));
  return needs.map((need) =>
    set.has(need.name.toLowerCase()) ? { ...need, status } : need
  );
}

function resilienceReducer(state, action) {
  switch (action.type) {
    case 'HYDRATE': {
      const next = { ...createInitialState(), ...action.state, lastUpdated: action.state?.lastUpdated || nowIso() };
      const seedById = Object.fromEntries(RESOURCES.map((item) => [item.id, item]));
      next.resources = (next.resources || []).map((resource) => ({
        ...resource,
        lat: resource.lat ?? seedById[resource.id]?.lat ?? null,
        lng: resource.lng ?? seedById[resource.id]?.lng ?? null,
      }));
      return next;
    }
    case 'ADD_ROAD_REPORT':
      return stamp(state, { roadReports: [action.report, ...state.roadReports] });
    case 'CONFIRM_ROAD_REPORT':
      return stamp(state, {
        roadReports: state.roadReports.map((report) =>
          report.id === action.reportId ? applyConfirmation(report, action.confirmerName) : report
        ),
      });
    case 'ADD_RESOURCE':
      return stamp(state, { resources: [action.resource, ...state.resources] });
    case 'MATCH_RESOURCE': {
      const { resourceId, facilityNeedId, match } = action;
      return stamp(state, {
        resources: state.resources.map((resource) =>
          resource.id === resourceId ? { ...resource, status: 'limited' } : resource
        ),
        facilityNeeds: state.facilityNeeds.map((need) =>
          need.id === facilityNeedId
            ? {
                ...need,
                status: 'limited',
                matchStatus: 'in_progress',
                matchedResourceId: resourceId,
              }
            : need
        ),
        matches: [match, ...state.matches],
      });
    }
    case 'CREATE_SOS':
      return stamp(state, { sosCases: [action.sosCase, ...state.sosCases] });
    case 'UPDATE_SOS':
      return stamp(state, {
        sosCases: state.sosCases.map((item) =>
          item.id === action.id ? { ...item, ...action.patch } : item
        ),
      });
    case 'SET_SCENARIO':
      return stamp(state, {
        scenarioState: action.scenario,
        roadReports: action.roadReports ?? state.roadReports,
        facilityNeeds: action.facilityNeeds ?? state.facilityNeeds,
        facilityFlags: action.facilityFlags ?? state.facilityFlags,
        baselineSnapshot: action.baselineSnapshot ?? state.baselineSnapshot,
      });
    default:
      return state;
  }
}

function worstStatus(statuses) {
  if (statuses.includes('unavailable')) return 'unavailable';
  if (statuses.includes('limited')) return 'limited';
  return 'available';
}

export function mergeFacility(facility, facilityNeeds, facilityFlags = {}) {
  if (!facility) return null;
  const needs = facilityNeeds.filter((need) => need.facilityId === facility.id);
  return {
    ...facility,
    needs,
    urgency: worstStatus([facility.urgency, ...needs.map((need) => need.status)]),
    alternativeRoute: Boolean(facilityFlags[facility.id]?.alternativeRoute),
  };
}

export function ResilienceProvider({ children }) {
  const [state, dispatch] = useReducer(resilienceReducer, null, createInitialState);
  const { updateCamp, getCamp, listCamps } = useCamps();
  const hydratedRef = useRef(false);
  const didReapplyCamps = useRef(false);
  const [hydrated, setHydrated] = useState(false);
  const stateRef = useRef(state);
  stateRef.current = state;

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (!active) return;
        if (raw) {
          const parsed = JSON.parse(raw);
          dispatch({ type: 'HYDRATE', state: parsed });
        }
      } catch {
        // Keep seed state if storage is empty or corrupt.
      } finally {
        if (active) {
          hydratedRef.current = true;
          setHydrated(true);
        }
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!hydrated) return undefined;
    const timer = setTimeout(() => {
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state)).catch(() => {});
    }, 400);
    return () => clearTimeout(timer);
  }, [state, hydrated]);

  const addRoadReport = useCallback(async (payload) => {
    // Stand-in for POST /road-reports
    const report = {
      id: payload.id || `scan-${Date.now()}`,
      roadName: payload.roadName || 'RoadScan report',
      segment: payload.segment || (payload.latitude == null ? 'Location unavailable' : 'Near your location'),
      issue:
        payload.issue ||
        (payload.detectedIssue === 'possible_blockage'
          ? 'Possible blockage detected. Awaiting community verification.'
          : 'Possible flooding detected. Awaiting community verification.'),
      confidence: payload.confidence ?? 0.4,
      status: payload.status || statusFromConfidence(payload.confidence ?? 0.4),
      confirmations: payload.confirmations || [],
      lat: payload.latitude ?? payload.lat ?? null,
      lng: payload.longitude ?? payload.lng ?? null,
      latitude: payload.latitude ?? payload.lat ?? null,
      longitude: payload.longitude ?? payload.lng ?? null,
      scannedAt: payload.scannedAt || 'Just now',
      capturedAt: payload.capturedAt || nowIso(),
      evidenceUri: payload.evidenceUri || null,
      detectedIssue: payload.detectedIssue || 'possible_flooding',
      zoneId: payload.zoneId || null,
      ...payload,
    };
    dispatch({ type: 'ADD_ROAD_REPORT', report });
    return report;
  }, []);

  const confirmRoadReport = useCallback(async (reportId, confirmerName) => {
    // Stand-in for PATCH /road-reports/:id/confirmations
    dispatch({ type: 'CONFIRM_ROAD_REPORT', reportId, confirmerName: confirmerName || 'You' });
  }, []);

  const addResourceOffer = useCallback(async (payload) => {
    // Stand-in for POST /resources
    const resource = {
      id: `res-${Date.now()}`,
      status: 'available',
      unit: 'units',
      provider: 'Community offer',
      contact: '',
      notes: '',
      ...payload,
    };
    dispatch({ type: 'ADD_RESOURCE', resource });
    return resource;
  }, []);

  const matchResourceToNeed = useCallback(async (resourceId, facilityNeedId) => {
    // Stand-in for POST /assistance-requests
    const match = {
      id: `match-${Date.now()}`,
      resourceId,
      facilityNeedId,
      status: 'in_progress',
      createdAt: nowIso(),
    };
    dispatch({ type: 'MATCH_RESOURCE', resourceId, facilityNeedId, match });
    return match;
  }, []);

  const createSosCase = useCallback(async (payload) => {
    // Stand-in for POST /sos
    const sosCase = {
      id: `sos-${Date.now()}`,
      createdAt: 'Just now',
      timeline: [
        { id: 's1', title: 'SOS received', meta: 'Just now', done: true, status: payload.priority || 'unavailable' },
        { id: 's2', title: 'Waiting for a crew', meta: 'Now', done: false },
      ],
      ...payload,
    };
    dispatch({ type: 'CREATE_SOS', sosCase });
    return sosCase;
  }, []);

  const updateSosCase = useCallback(async (id, patch) => {
    // Stand-in for PATCH /sos/:id
    dispatch({ type: 'UPDATE_SOS', id, patch });
  }, []);

  const campApiRef = useRef({ getCamp, updateCamp });
  campApiRef.current = { getCamp, updateCamp };

  const captureCampSnapshot = useCallback(() => {
    const { getCamp: readCamp } = campApiRef.current;
    return SCENARIO_CAMP_IDS.map((id) => {
      const camp = readCamp(id);
      if (!camp) return null;
      return {
        id,
        food: camp.food,
        water: camp.water,
        medical: camp.medical,
        status: camp.status,
        occupied: camp.occupied,
      };
    }).filter(Boolean);
  }, []);

  const restoreCamps = useCallback(async (snapshot) => {
    if (!snapshot?.length) return;
    const { updateCamp: patchCamp } = campApiRef.current;
    await Promise.all(snapshot.map((camp) => patchCamp(camp.id, camp)));
  }, []);

  const applyCampScenario = useCallback(async (kind, campSnapshot = []) => {
    const { getCamp: readCamp, updateCamp: patchCamp } = campApiRef.current;
    const ids = kind === 'landslide' ? SCENARIO_CAMP_IDS.slice(0, 1) : SCENARIO_CAMP_IDS;
    await Promise.all(
      ids.map((id) => {
        const camp = readCamp(id);
        if (!camp) return null;
        const base = campSnapshot.find((item) => item.id === id) || camp;
        const occupied = Math.min(camp.capacity, Math.round((base.occupied || 0) + camp.capacity * 0.15));
        return patchCamp(id, {
          food: 'unavailable',
          water: kind === 'landslide' ? 'limited' : 'unavailable',
          occupied,
          status: occupancyStatus(occupied, camp.capacity),
        });
      })
    );
  }, []);

  useEffect(() => {
    if (!hydrated || didReapplyCamps.current) return;
    didReapplyCamps.current = true;
    const current = stateRef.current;
    if (current.scenarioState === 'heavy_rain' || current.scenarioState === 'landslide') {
      applyCampScenario(current.scenarioState, current.baselineSnapshot?.camps);
    }
  }, [applyCampScenario, hydrated]);

  const setScenario = useCallback(async (scenario) => {
    // Stand-in for POST /simulator/scenario
    const current = stateRef.current;
    if (current.scenarioState === scenario) return;

    if (scenario === 'recovering' || scenario === 'normal') {
      if (current.baselineSnapshot) {
        await restoreCamps(current.baselineSnapshot.camps);
        dispatch({
          type: 'SET_SCENARIO',
          scenario,
          roadReports: current.baselineSnapshot.roadReports,
          facilityNeeds: current.baselineSnapshot.facilityNeeds,
          facilityFlags: current.baselineSnapshot.facilityFlags,
          baselineSnapshot: scenario === 'normal' ? null : current.baselineSnapshot,
        });
      } else {
        dispatch({ type: 'SET_SCENARIO', scenario, baselineSnapshot: null });
      }
      if (scenario === 'recovering') {
        setTimeout(() => {
          dispatch({ type: 'SET_SCENARIO', scenario: 'normal', baselineSnapshot: null });
        }, 1200);
      }
      return;
    }

    const baselineSnapshot = current.baselineSnapshot || snapshotRecords(current, captureCampSnapshot());
    const sourceReports = baselineSnapshot.roadReports;
    const sourceNeeds = baselineSnapshot.facilityNeeds;
    let roadReports = sourceReports;
    let facilityNeeds = sourceNeeds;
    let facilityFlags = { ...baselineSnapshot.facilityFlags };

    if (scenario === 'heavy_rain') {
      roadReports = applyRoadPatches(sourceReports, RAIN_ROAD_PATCHES);
      facilityNeeds = bumpNeeds(sourceNeeds, ['Generator', 'Fuel for pumps', 'Radio operators'], 'unavailable');
      facilityFlags = {};
      await applyCampScenario('heavy_rain', baselineSnapshot.camps);
    }

    if (scenario === 'landslide') {
      roadReports = applyRoadPatches(sourceReports, SLIDE_ROAD_PATCHES);
      facilityNeeds = bumpNeeds(sourceNeeds, ['Radio operators'], 'unavailable');
      facilityFlags = { [SLIDE_FACILITY_ID]: { alternativeRoute: true } };
      await applyCampScenario('landslide', baselineSnapshot.camps);
    }

    dispatch({
      type: 'SET_SCENARIO',
      scenario,
      roadReports,
      facilityNeeds,
      facilityFlags,
      baselineSnapshot,
    });
  }, [applyCampScenario, captureCampSnapshot, restoreCamps]);

  const getRoadReport = useCallback(
    (id) => state.roadReports.find((item) => item.id === id),
    [state.roadReports]
  );
  const getResource = useCallback(
    (id) => state.resources.find((item) => item.id === id),
    [state.resources]
  );
  const getSos = useCallback(
    (id) => state.sosCases.find((item) => item.id === id),
    [state.sosCases]
  );
  const getFacilityNeed = useCallback(
    (id) => state.facilityNeeds.find((item) => item.id === id),
    [state.facilityNeeds]
  );

  const value = useMemo(
    () => ({
      roadReports: state.roadReports,
      resources: state.resources,
      facilityNeeds: state.facilityNeeds,
      sosCases: state.sosCases,
      matches: state.matches,
      facilityFlags: state.facilityFlags,
      scenarioState: state.scenarioState,
      lastUpdated: state.lastUpdated,
      addRoadReport,
      confirmRoadReport,
      addResourceOffer,
      matchResourceToNeed,
      createSosCase,
      updateSosCase,
      setScenario,
      getRoadReport,
      getResource,
      getSos,
      getFacilityNeed,
      listCamps,
    }),
    [
      state,
      addRoadReport,
      confirmRoadReport,
      addResourceOffer,
      matchResourceToNeed,
      createSosCase,
      updateSosCase,
      setScenario,
      getRoadReport,
      getResource,
      getSos,
      getFacilityNeed,
      listCamps,
    ]
  );

  return <ResilienceContext.Provider value={value}>{children}</ResilienceContext.Provider>;
}

export function useResilience() {
  const context = useContext(ResilienceContext);
  if (!context) {
    throw new Error('useResilience must be used within ResilienceProvider');
  }
  return context;
}

export function useDashboardStats() {
  const { roadReports, scenarioState } = useResilience();
  const { camps } = useCamps();

  return useMemo(() => {
    const disrupted = roadReports.filter((report) => report.status !== 'available');
    const floodZones = new Set(disrupted.map((report) => report.zoneId || report.id)).size;
    const campsWithSpace = camps.filter((camp) => {
      if (camp.closed) return false;
      return occupancyStatus(camp.occupied, camp.capacity) !== 'unavailable';
    }).length;
    const stressed = scenarioState === 'heavy_rain' || scenarioState === 'landslide';
    const volunteers = 48 + camps.length * 6 + (stressed ? 24 : 0) + disrupted.length * 2;

    return [
      {
        id: 'zones',
        label: 'Flood zones',
        value: floodZones,
        status: floodZones >= 3 ? 'unavailable' : floodZones > 0 ? 'limited' : 'available',
      },
      {
        id: 'roads',
        label: 'Road disruptions',
        value: disrupted.length,
        status: disrupted.some((item) => item.status === 'unavailable') ? 'unavailable' : disrupted.length ? 'limited' : 'available',
      },
      {
        id: 'camps',
        label: 'Camps with space',
        value: campsWithSpace,
        status: campsWithSpace <= 2 ? 'unavailable' : campsWithSpace <= 5 ? 'limited' : 'available',
      },
      {
        id: 'volunteers',
        label: 'Volunteers on shift',
        value: volunteers,
        status: 'available',
      },
    ];
  }, [roadReports, scenarioState, camps]);
}

export function useDashboardZones() {
  const { roadReports, scenarioState } = useResilience();
  const { camps } = useCamps();

  return useMemo(() => {
    const stressed = scenarioState === 'heavy_rain' || scenarioState === 'landslide';
    return ZONES.map((zone) => {
      const zoneRoads = roadReports.filter((report) => report.zoneId === zone.id);
      const closed = zoneRoads.filter((report) => report.status === 'unavailable').length;
      const disrupted = zoneRoads.filter((report) => report.status !== 'available').length;
      const zoneCamps = camps.filter((camp) => {
        if (zone.id === 'zone-thrissur') return camp.district === 'Thrissur';
        return false;
      });
      return {
        ...zone,
        status: closed > 0 ? 'unavailable' : disrupted > 0 ? 'limited' : 'available',
        roadsClosed: Math.max(closed, disrupted),
        camps: zoneCamps.length || zone.camps,
        volunteers: zone.volunteers + (stressed ? 10 : 0),
      };
    });
  }, [roadReports, scenarioState, camps]);
}

export function useFacilities() {
  const { facilityNeeds, facilityFlags } = useResilience();
  return useMemo(
    () => FACILITIES.map((facility) => mergeFacility(facility, facilityNeeds, facilityFlags)),
    [facilityNeeds, facilityFlags]
  );
}

export function matchingResources(resources, need) {
  if (!need) return [];
  const needle = String(need.category || need.name || '').toLowerCase();
  return resources.filter((resource) => {
    if (resource.status !== 'available') return false;
    const category = String(resource.category || '').toLowerCase();
    const name = String(resource.name || '').toLowerCase();
    return category === needle || name.includes(needle) || category.includes(needle);
  });
}
