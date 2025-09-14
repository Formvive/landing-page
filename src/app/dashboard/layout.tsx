"use client";

import "./page.css";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import DashboardHeader from "@/components/DashboardHeader";
import { Menu } from "lucide-react";
import { getCookie, deleteCookie } from "@/utils/cookieHelper";

function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split(".")[1])); // decode the middle part of JWT
    if (!payload.exp) return false;
    return Date.now() >= payload.exp * 1000; // exp is usually in seconds
  } catch {
    return true; // if token is invalid, treat as expired
  }
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = getCookie("authToken");

    // If token is missing or expired → logout
    if (!token || isTokenExpired(token)) {
      deleteCookie("authToken");
      localStorage.removeItem("authToken");
      router.push("/login");
    } else {
      setIsCheckingAuth(false);
    }
  }, [router]);

  if (isCheckingAuth) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span>Loading...</span>
      </div>
    );
  }

  return (
    <div className="dashboardPage flex min-h-screen">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <main className="flex-1 flex flex-col">
        {/* Topbar for small screens */}
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
