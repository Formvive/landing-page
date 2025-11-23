// auth/authService.ts
const API_URL = "https://form-vive-server.onrender.com/api/v1"; 

export async function checkAuthState() {
  const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;

  if (!token) return { isAuthenticated: false, user: null };

  try {
    // Make sure '/user/profile' exists, or use '/user/get-forms'
    const response = await fetch(`${API_URL}/user/profile`, { 
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`, // <--- Sending token manually
      },
    });

    if (response.ok) {
      const userData = await response.json();
      return { isAuthenticated: true, user: userData };
    } else {
      return { isAuthenticated: false, user: null };
    }
  } catch (error) {
    return { isAuthenticated: false, user: null , error: error  };
  }
}