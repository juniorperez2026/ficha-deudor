export const AUTH_STORAGE_KEY = 'ficha_deudor_auth_state';
export const AUTH_LOGOUT_EVENT_KEY = 'ficha_deudor_logout_event';

const PUBLIC_AUTH_PATHS = new Set([
  '/',
  '/login',
]);

export function hasStoredAuthState(): boolean {
  return Boolean(localStorage.getItem(AUTH_STORAGE_KEY));
}

export function isPublicAuthPath(pathname: string): boolean {
  return PUBLIC_AUTH_PATHS.has(pathname);
}

export function clearStoredAuthState(): void {
  localStorage.removeItem('auth_token');
  localStorage.removeItem(AUTH_STORAGE_KEY);
}

export function notifyGlobalLogout(): void {
  localStorage.setItem(
    AUTH_LOGOUT_EVENT_KEY,
    `${Date.now()}-${Math.random()}`
  );
}

export function closePopupOrRedirectToLogin(): void {
  const isPopupWindow = Boolean(window.opener);

  if (isPopupWindow) {
    window.close();

    window.setTimeout(() => {
      if (!window.closed) {
        window.location.replace('/login');
      }
    }, 100);

    return;
  }

  window.location.replace('/login');
}

export function logoutSession(): void {
  clearStoredAuthState();
  notifyGlobalLogout();
}