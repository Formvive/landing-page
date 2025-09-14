// utils/cookieHelper.ts

// Set a cookie with explicit expiry date (maxAgeSeconds = seconds)
export function setCookie(name: string, value: string, maxAgeSeconds: number) {
    const expires = new Date(Date.now() + maxAgeSeconds * 1000).toUTCString();
    document.cookie = `${name}=${value}; path=/; expires=${expires};`;
    // Also store expiry separately for automatic cleanup
    localStorage.setItem(`${name}_expires`, (Date.now() + maxAgeSeconds * 1000).toString());
  }
  
  // Get a cookie by name with automatic expiry check
  export function getCookie(name: string): string | null {
    const expiry = localStorage.getItem(`${name}_expires`);
    if (expiry && Date.now() > parseInt(expiry, 10)) {
      // Token expired, clear cookie
      deleteCookie(name);
      return null;
    }
  
    const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
    return match ? match[2] : null;
  }
  
  // Delete a cookie and its expiry key
  export function deleteCookie(name: string) {
    document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;`;
    localStorage.removeItem(`${name}_expires`);
  }
  