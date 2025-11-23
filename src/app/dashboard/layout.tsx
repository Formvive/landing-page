"use client";

import "./page.css";
import { useState, useEffect } from "react";
import { checkAuthState } from "../../auth/authService"; // Ensure this path is correct
import { useRouter } from "next/navigation"; // Import useRouter
import Sidebar from "@/components/Sidebar";
import DashboardHeader from "@/components/DashboardHeader";
import { Menu } from "lucide-react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter(); // Initialize router

  useEffect(() => {
    async function initAuth() {
      const { isAuthenticated, user } = await checkAuthState();
      
      if (isAuthenticated) {
        console.log("User is logged in!", user);
        setIsLoading(false); // Only stop loading if auth is successful
      } else {
        console.log("User is not logged in. Redirecting...");
        router.push("/login"); // Redirect to login
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