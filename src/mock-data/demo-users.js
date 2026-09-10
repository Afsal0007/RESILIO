import { ROLE_LIST } from '../constants/roles';

export function getDemoUsers() {
  return ROLE_LIST.map((role) => ({
    id: `demo-${role.id.toLowerCase()}`,
    name: `Demo ${role.label}`,
    email: `${role.id.toLowerCase()}@demo.resilio.app`,
    password: 'demo123',
    role: role.id,
    verified: true,
  }));
}
