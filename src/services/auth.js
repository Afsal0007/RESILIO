import AsyncStorage from '@react-native-async-storage/async-storage';
import { ROLES, isVerificationRequired } from '../constants/roles';
import { getDemoUsers } from '../mock-data/demo-users';

const SESSION_KEY = '@resilio/session';
const USERS_KEY = '@resilio/users';

let currentUser = null;
const listeners = new Set();
let initialized = false;
let users = [];

function delay(ms = 250) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function notify() {
  const snapshot = toPublicUser(currentUser);
  listeners.forEach((callback) => callback(snapshot));
}

function toPublicUser(user) {
  if (!user) return null;
  const { password, ...publicUser } = user;
  return publicUser;
}

function normalizeEmail(email) {
  return String(email || '').trim().toLowerCase();
}

async function persistUsers() {
  await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
}

async function persistSession(user) {
  if (user) {
    await AsyncStorage.setItem(SESSION_KEY, JSON.stringify({ id: user.id }));
  } else {
    await AsyncStorage.removeItem(SESSION_KEY);
  }
}

function mergeWithDemoUsers(storedUsers) {
  const byEmail = new Map();
  storedUsers.forEach((user) => {
    byEmail.set(normalizeEmail(user.email), user);
  });
  getDemoUsers().forEach((demoUser) => {
    const key = normalizeEmail(demoUser.email);
    if (!byEmail.has(key)) {
      byEmail.set(key, demoUser);
    }
  });
  return Array.from(byEmail.values());
}

async function ensureInit() {
  if (initialized) return;

  try {
    const storedUsers = await AsyncStorage.getItem(USERS_KEY);
    users = storedUsers ? mergeWithDemoUsers(JSON.parse(storedUsers)) : getDemoUsers();
    await persistUsers();

    const session = await AsyncStorage.getItem(SESSION_KEY);
    if (session) {
      const { id } = JSON.parse(session);
      currentUser = users.find((user) => user.id === id) || null;
    }
  } catch {
    users = getDemoUsers();
    currentUser = null;
  }

  initialized = true;
}

export async function signUp({ name, email, password, role }) {
  await ensureInit();
  await delay();

  const trimmedName = String(name || '').trim();
  const normalizedEmail = normalizeEmail(email);

  if (!trimmedName || !normalizedEmail || !password || !role) {
    throw new Error('All fields are required.');
  }

  if (!ROLES[role]) {
    throw new Error('Please choose a valid role.');
  }

  if (users.some((user) => normalizeEmail(user.email) === normalizedEmail)) {
    throw new Error('An account with this email already exists.');
  }

  const user = {
    id: `user-${Date.now()}`,
    name: trimmedName,
    email: normalizedEmail,
    password,
    role,
    verified: !isVerificationRequired(role),
  };

  users.push(user);
  currentUser = user;
  await persistUsers();
  await persistSession(user);
  notify();
  return toPublicUser(user);
}

export async function login({ email, password }) {
  await ensureInit();
  await delay();

  const normalizedEmail = normalizeEmail(email);
  const user = users.find(
    (candidate) =>
      normalizeEmail(candidate.email) === normalizedEmail && candidate.password === password
  );

  if (!user) {
    throw new Error('Invalid email or password.');
  }

  currentUser = user;
  await persistSession(user);
  notify();
  return toPublicUser(user);
}

export async function logout() {
  await ensureInit();
  await delay(150);
  currentUser = null;
  await persistSession(null);
  notify();
}

export async function forgotPassword({ email }) {
  await ensureInit();
  await delay();

  const normalizedEmail = normalizeEmail(email);
  if (!normalizedEmail) {
    throw new Error('Please enter the email for your account.');
  }

  return {
    success: true,
    message: `If an account exists for ${normalizedEmail}, a reset link has been sent.`,
  };
}

export async function demoLogin(role) {
  await ensureInit();
  await delay(150);

  if (!ROLES[role]) {
    throw new Error('Unknown demo role.');
  }

  const user = users.find((candidate) => candidate.id === `demo-${role.toLowerCase()}`);
  if (!user) {
    throw new Error('Demo user is not available for this role.');
  }

  currentUser = user;
  await persistSession(user);
  notify();
  return toPublicUser(user);
}

export async function getCurrentUser() {
  await ensureInit();
  return toPublicUser(currentUser);
}

export function onAuthStateChange(callback) {
  listeners.add(callback);
  callback(toPublicUser(currentUser));
  return () => listeners.delete(callback);
}
