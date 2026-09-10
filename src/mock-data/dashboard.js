export const DASHBOARD_STATS = [
  { id: 'zones', label: 'Flood zones', value: 7, status: 'unavailable' },
  { id: 'roads', label: 'Road disruptions', value: 14, status: 'limited' },
  { id: 'camps', label: 'Camps with space', value: 9, status: 'available' },
  { id: 'volunteers', label: 'Volunteers on shift', value: 126, status: 'available' },
];

export const ZONES = [
  {
    id: 'zone-ernakulam',
    name: 'Ernakulam river belt',
    status: 'unavailable',
    camps: 3,
    roadsClosed: 5,
    volunteers: 42,
  },
  {
    id: 'zone-wayanad',
    name: 'Wayanad ghat',
    status: 'limited',
    camps: 2,
    roadsClosed: 3,
    volunteers: 18,
  },
  {
    id: 'zone-kuttanad',
    name: 'Kuttanad low land',
    status: 'unavailable',
    camps: 2,
    roadsClosed: 4,
    volunteers: 27,
  },
  {
    id: 'zone-thrissur',
    name: 'Chalakudy basin',
    status: 'limited',
    camps: 2,
    roadsClosed: 2,
    volunteers: 21,
  },
];

export function getZone(id) {
  return ZONES.find((item) => item.id === id) || ZONES[0];
}
