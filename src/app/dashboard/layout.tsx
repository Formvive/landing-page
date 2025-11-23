"use client";

import "./page.css";
import { useState, useEffect } from "react";
import { checkAuthState } from "../../auth/authService"; 
import { useRouter } from "next/navigation"; 
import Sidebar from "@/components/Sidebar";
import DashboardHeader from "@/components/DashboardHeader";
import { Menu } from "lucide-react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter(); 

  useEffect(() => {
    async function initAuth() {
      // --- STEP 1: Check URL for Token (The "Sweeper") ---
      if (typeof window !== "undefined") {
        const currentUrl = window.location.href;
        // This regex handles both '&access=' (standard) and '?access=' (your backend bug)
        const match = currentUrl.match(/[?&]access=([^&]+)/);
        
        if (match && match[1]) {
          const newToken = match[1];
          console.log("Found token in URL, saving to storage...");
          localStorage.setItem("authToken", newToken);
          
          // Optional: Clean the URL so the user doesn't see the messy token
          // This keeps the current path but removes query params
          const cleanPath = window.location.pathname;
          window.history.replaceState({}, document.title, cleanPath);
        }
      }

      // --- STEP 2: Validate Auth ---
      // Now that we've potentially saved a new token, checkAuthState will pick it up
      const { isAuthenticated, user } = await checkAuthState();
      
      if (isAuthenticated) {
        console.log("User is logged in!", user);
        setIsLoading(false); 
      } else {
        console.log("User is not logged in. Redirecting...");
        localStorage.removeItem("authToken"); // Clean up bad tokens
        router.push("/login"); 
      }
    }

    initAuth();
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="dashboardPage flex min-h-screen">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <main className="flex-1 flex flex-col">
        <div className="md:hidden p-4 flex flex-row justify-between items-center">
          <button onClick={() => setIsSidebarOpen(true)}>
            <Menu size={24} />
          </button>
          <h2 className="text-2xl font-bold">FormVive</h2>
        </div>
        <DashboardHeader />
        <div className="dashContent flex-1 p-4 overflow-y-auto">{children}</div>
      </main>
    </div>
  );
}