"use client";
import './page.css';
import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import Sidebar from "@/components/Sidebar";
import DashboardHeader from "@/components/DashboardHeader";
import { Menu } from "lucide-react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      router.push('/login');
    } else {
      setIsCheckingAuth(false);
    }
  }, [router]);

  if (isCheckingAuth) {
    // Optional: loading state while checking auth
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
        <div className="dashContent flex-1 p-4 overflow-y-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
