export const VOLUNTEER_CATEGORIES = [
  { id: 'medical', label: 'Medical', description: 'Doctors, nurses, first aid' },
  { id: 'technical', label: 'Technical', description: 'Electric, plumbing, repair' },
  { id: 'rescue', label: 'Rescue', description: 'Boats, climbing, search' },
  { id: 'relief', label: 'Relief', description: 'Food, shelter, supplies' },
  { id: 'community', label: 'Community', description: 'Translation, care, coordination' },
];

export const VOLUNTEER_SKILLS = {
  medical: ['First aid', 'Nursing', 'Pharmacy', 'Mental health'],
  technical: ['Electrician', 'Generator', 'Plumbing', 'Radio / comms'],
  rescue: ['Boat handling', 'Swift water', 'Search', 'Heavy vehicle'],
  relief: ['Cooking', 'Inventory', 'Camp setup', 'Logistics'],
  community: ['Malayalam / English', 'Child care', 'Elder care', 'Data entry'],
};

export const VOLUNTEER_TASKS = [
  {
    id: 'task-1',
    title: 'Night desk at Devamatha CMI camp',
    status: 'limited',
    when: 'Tonight, 8pm–2am',
  },
  {
    id: 'task-2',
    title: 'Confirm NH 66 water depth',
    status: 'unavailable',
    when: 'Open now',
  },
  {
    id: 'task-3',
    title: 'Unload grocery kits, Irinjalakuda',
    status: 'available',
    when: 'Tomorrow, 7am',
  },
];
