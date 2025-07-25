"use client";
import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import Sidebar from "@/components/Sidebar";
import DashboardHeader from "@/components/DashboardHeader";
import { Menu } from "lucide-react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (!token) {
          router.push('/login');
        }
      }, [router]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="dashboardPage">
      {/* Sidebar: always visible on md+, offcanvas on small */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <main className="dashboardPageContent">
        {/* Show menu button only on small screens */}
        <div className="md:hidden p-4 flex flex-row justify-between">
          <button onClick={() => setIsSidebarOpen(true)}>
            <Menu size={24} />
          </button>
          <h2 className="text-2xl font-bold px-2">FormVive</h2>
        </div>
        <DashboardHeader />
        <div className="dashContent">{children}</div>
      </main>
    </div>
  );
}
