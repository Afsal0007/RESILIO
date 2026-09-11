export const FACILITIES = [
  {
    id: 'fac-alpy-fire',
    name: 'Alappuzha Fire Station',
    type: 'Rescue base',
    status: 'limited',
    urgency: 'limited',
    location: 'Alappuzha',
    district: 'Alappuzha',
    contact: '0477-2250101',
    needs: [
      { name: 'Generator', status: 'unavailable' },
      { name: 'Fuel for pumps', status: 'limited' },
      { name: 'Life jackets', status: 'available' },
    ],
  },
  {
    id: 'fac-thrissur-collectorate',
    name: 'Thrissur Collectorate Control Room',
    type: 'Coordination',
    status: 'available',
    urgency: 'available',
    location: 'Thrissur',
    district: 'Thrissur',
    contact: '0487-2361020',
    needs: [{ name: 'Radio operators', status: 'limited' }],
  },
];

export function getFacility(id) {
  return FACILITIES.find((item) => item.id === id);
}
