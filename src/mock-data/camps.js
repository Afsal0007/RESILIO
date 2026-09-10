function occupancyStatus(occupied, capacity) {
  if (!capacity || capacity <= 0) return 'unavailable';
  const ratio = occupied / capacity;
  if (ratio >= 0.95) return 'unavailable';
  if (ratio >= 0.7) return 'limited';
  return 'available';
}

function reportedCamp({ id, name, location, lat, lng, capacity, occupied }) {
  return {
    id,
    name,
    location,
    district: 'Thrissur',
    capacity,
    occupied,
    status: occupancyStatus(occupied, capacity),
    lat,
    lng,
    food: 'limited',
    water: 'limited',
    medical: 'limited',
    contact: '',
    warden: null,
    dataSource: 'reported',
    verified: false,
  };
}

export const CAMPS = [
  reportedCamp({
    id: 'devamatha-cmi-thrissur',
    name: 'Devamatha CMI Public School',
    location: 'Thrissur town',
    lat: 10.5276,
    lng: 76.2144,
    capacity: 320,
    occupied: 198,
  }),
  reportedCamp({
    id: 'holy-family-school-thrissur',
    name: 'Holy Family School',
    location: 'Thrissur',
    lat: 10.5305,
    lng: 76.217,
    capacity: 240,
    occupied: 142,
  }),
  reportedCamp({
    id: 'ramakrishna-mission-adat',
    name: 'Ramakrishna Mission Higher Secondary School',
    location: 'Adat, Thrissur (opened by Adat Grama Panchayat)',
    lat: 10.5167,
    lng: 76.0667,
    capacity: 400,
    occupied: 265,
  }),
  reportedCamp({
    id: 'bodanandavilasam-school-chavakkad',
    name: 'Bodanandavilasam School',
    location: 'Chavakkad area, Thrissur district',
    lat: 10.53,
    lng: 76.05,
    capacity: 180,
    occupied: 102,
  }),
  reportedCamp({
    id: 'darul-iman-arabic-college',
    name: 'Darul Iman Arabic College',
    location: 'Chavakkad area, Thrissur district',
    lat: 10.535,
    lng: 76.055,
    capacity: 200,
    occupied: 128,
  }),
  reportedCamp({
    id: 'vadanapally-bhagavathy-temple',
    name: 'Vadanapally Bhagavathy Temple dining hall',
    location: 'Vadanappally, Thrissur district',
    lat: 10.4667,
    lng: 76.0833,
    capacity: 150,
    occupied: 91,
  }),
  reportedCamp({
    id: 'glps-cheruthuruthy',
    name: 'Government Lower Primary School',
    location: 'Cheruthuruthy, Thrissur',
    lat: 10.7426,
    lng: 76.2717,
    capacity: 220,
    occupied: 134,
  }),
  reportedCamp({
    id: 'bralam-flood-relief-camp',
    name: 'Brālam Flood Relief Camp',
    location: 'Brālam, Irinjalakuda',
    lat: 10.335,
    lng: 76.23,
    capacity: 280,
    occupied: 196,
  }),
  reportedCamp({
    id: 'karupadanna-flood-relief-camp',
    name: 'Karupadanna Flood Relief Camp',
    location: 'Karupadanna, Irinjalakuda',
    lat: 10.328,
    lng: 76.225,
    capacity: 360,
    occupied: 248,
  }),
];

export function getCamp(id) {
  return CAMPS.find((camp) => camp.id === id);
}
