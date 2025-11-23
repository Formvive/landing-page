// auth/authService.ts

const API_URL = "https://form-vive-server.onrender.com/api/v1"; // Replace with your actual backend URL

export async function checkAuthState() {
  try {
    // We send a request to a "Me" or "Profile" endpoint.
    // IMPORTANT: credentials: 'include' tells the browser to attach
    // the HttpOnly cookie to this request automatically.
    const response = await fetch(`${API_URL}/user/profile`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // <--- THIS IS THE KEY MAGIC
    });

    if (response.status === 200) {
      const userData = await response.json();
      return { isAuthenticated: true, user: userData };
    } else {
      // 401 Unauthorized or 403 Forbidden
      return { isAuthenticated: false, user: null };
    }
  } catch (error) {
    console.error("Auth check failed", error);
    return { isAuthenticated: false, user: null };
  }
}