// utils/authHelper.ts
export function getAuthToken(): string | null {
    // 1. Try localStorage first
    const localToken = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
    if (localToken) return localToken;
  
    // 2. Fallback to cookies (_vercel_jwt for Google login)
    if (typeof document !== "undefined") {
      const match = document.cookie.match(/(^| )_vercel_jwt=([^;]+)/);
      if (match) return match[2];
    }
  
    return null; // no token anywhere
  }
  