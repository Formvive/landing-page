// utils/cookieHelper.ts

// Get any cookie by name (no localStorage expiry tracking)
export function getCookieRaw(name: string): string | null {
  const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
  return match ? match[2] : null;
}

// For your custom tokens with expiry tracking
export function setCookie(name: string, value: string, maxAgeSeconds: number) {
  const expires = new Date(Date.now() + maxAgeSeconds * 1000).toUTCString();
  document.cookie = `${name}=${value}; path=/; expires=${expires};`;
  localStorage.setItem(`${name}_expires`, (Date.now() + maxAgeSeconds * 1000).toString());
}

export function getCookie(name: string): string | null {
  const expiry = localStorage.getItem(`${name}_expires`);
  if (expiry && Date.now() > parseInt(expiry, 10)) {
    deleteCookie(name);
    return null;
  }
  return getCookieRaw(name);
}

export function deleteCookie(name: string) {
  document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;`;
  localStorage.removeItem(`${name}_expires`);
}
