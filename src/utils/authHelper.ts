// utils/authHelper.ts
export function getAuthToken(): string | null {
  // 1. Check localStorage
  const localToken = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
  if (localToken) return localToken;

  // 2. Check URL params (e.g., token in query string after redirect)
  if (typeof window !== "undefined") {
    const urlParams = new URLSearchParams(window.location.search);
    const tokenParam = urlParams.get("access"); // or whatever param name your backend uses
    if (tokenParam) {
      // Save it for future requests
      localStorage.setItem("authToken", tokenParam);
      return tokenParam;
    }
  }

  // 3. Fallback: check cookies (_vercel_jwt for Google login)
  if (typeof document !== "undefined") {
    const match = document.cookie.match(/(^| )_vercel_jwt=([^;]+)/);
    if (match) return match[2];
  }

  return null;
}
