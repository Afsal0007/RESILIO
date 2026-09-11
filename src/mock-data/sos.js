export const SOS_TYPES = [
  { id: 'flood', label: 'Flooded home' },
  { id: 'landslide', label: 'Landslide / slope' },
  { id: 'medical', label: 'Medical emergency' },
  { id: 'trapped', label: 'People trapped' },
  { id: 'missing', label: 'Missing person' },
];

export const SOS_CASES = [
  {
    id: 'sos-kainakary',
    type: 'Flooded home',
    priority: 'unavailable',
    status: 'limited',
    location: 'Kainakary, Kuttanad',
    requesterId: 'demo-citizen',
    requesterName: 'Demo Citizen',
    acceptedVolunteerId: 'demo-rescue_team',
    createdAt: new Date(Date.now() - 22 * 60 * 1000).toISOString(),
    timeline: [
      { id: 's1', title: 'SOS received', meta: '22 min ago', done: true, status: 'unavailable' },
      { id: 's2', title: 'Assigned to boat crew', meta: '9 min ago', done: true, status: 'limited' },
      { id: 's3', title: 'Crew en route', meta: 'Now', done: true, status: 'limited' },
      { id: 's4', title: 'Reached and evacuated', meta: 'Pending', done: false },
    ],
  },
];

export function getSos(id) {
  return SOS_CASES.find((item) => item.id === id) || SOS_CASES[0];
}
