import {
  Building2,
  HeartHandshake,
  LifeBuoy,
  Package,
  Stethoscope,
  Truck,
  User,
  Wrench,
  Zap,
} from 'lucide-react-native';

export const CITIZEN = {
  id: 'CITIZEN',
  label: 'Citizen',
  icon: 'User',
  description: 'Residents seeking alerts, shelters, and emergency help.',
};

export const VOLUNTEER = {
  id: 'VOLUNTEER',
  label: 'Volunteer',
  icon: 'HeartHandshake',
  description: 'Community volunteers who can join response efforts.',
};

export const MEDICAL_TEAM = {
  id: 'MEDICAL_TEAM',
  label: 'Medical Team',
  icon: 'Stethoscope',
  description: 'Doctors, nurses, and medical responders.',
};

export const RESCUE_TEAM = {
  id: 'RESCUE_TEAM',
  label: 'Rescue Team',
  icon: 'LifeBuoy',
  description: 'Search and rescue personnel in the field.',
};

export const DRIVER = {
  id: 'DRIVER',
  label: 'Driver',
  icon: 'Truck',
  description: 'Vehicle owners who can transport people or supplies.',
};

export const ELECTRICIAN = {
  id: 'ELECTRICIAN',
  label: 'Electrician',
  icon: 'Zap',
  description: 'Electrical workers restoring power and safety.',
};

export const TECHNICIAN = {
  id: 'TECHNICIAN',
  label: 'Technician',
  icon: 'Wrench',
  description: 'Technical specialists for infrastructure repair.',
};

export const NGO_ORGANIZATION = {
  id: 'NGO_ORGANIZATION',
  label: 'NGO',
  icon: 'Building2',
  description: 'Organizations coordinating relief and resources.',
};

export const RESOURCE_PROVIDER = {
  id: 'RESOURCE_PROVIDER',
  label: 'Resource Provider',
  icon: 'Package',
  description: 'People or businesses offering supplies and services.',
};

export const ROLES = {
  CITIZEN,
  VOLUNTEER,
  MEDICAL_TEAM,
  RESCUE_TEAM,
  DRIVER,
  ELECTRICIAN,
  TECHNICIAN,
  NGO_ORGANIZATION,
  RESOURCE_PROVIDER,
};

export const ROLE_LIST = Object.values(ROLES);

export const VERIFICATION_REQUIRED_ROLES = [
  MEDICAL_TEAM.id,
  RESCUE_TEAM.id,
  ELECTRICIAN.id,
  TECHNICIAN.id,
];

const ROLE_ICONS = {
  User,
  HeartHandshake,
  Stethoscope,
  LifeBuoy,
  Truck,
  Zap,
  Wrench,
  Building2,
  Package,
};

export function getRoleIcon(iconName) {
  return ROLE_ICONS[iconName] || User;
}

export function isVerificationRequired(roleId) {
  return VERIFICATION_REQUIRED_ROLES.includes(roleId);
}

export function isOrganizationRole(roleId) {
  return roleId === NGO_ORGANIZATION.id || roleId === RESOURCE_PROVIDER.id;
}

export const DUTY_SHARING_ROLES = [
  VOLUNTEER.id,
  MEDICAL_TEAM.id,
  RESCUE_TEAM.id,
  DRIVER.id,
  ELECTRICIAN.id,
  TECHNICIAN.id,
];

export function isDutySharingRole(roleId) {
  return DUTY_SHARING_ROLES.includes(roleId);
}

export function skillCategoryForRole(roleId) {
  if (roleId === MEDICAL_TEAM.id) return 'medical';
  if (roleId === ELECTRICIAN.id || roleId === TECHNICIAN.id) return 'technical';
  if (roleId === RESCUE_TEAM.id) return 'rescue';
  if (roleId === DRIVER.id) return 'relief';
  return 'community';
}

export const ROLE_MAP_GLYPH = {
  VOLUNTEER: '♥',
  MEDICAL_TEAM: '+',
  RESCUE_TEAM: '◉',
  DRIVER: '▸',
  ELECTRICIAN: '⚡',
  TECHNICIAN: '⚙',
};
