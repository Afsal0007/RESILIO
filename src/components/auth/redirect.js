export function getSafeRedirect(redirect, fallback = '/home') {
  const value = Array.isArray(redirect) ? redirect[0] : redirect;
  if (
    typeof value === 'string' &&
    value.startsWith('/') &&
    !value.startsWith('//') &&
    !value.startsWith('/login')
  ) {
    return value;
  }
  return fallback;
}
