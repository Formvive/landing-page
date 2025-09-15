"use client";
import { Home, FileText, FilePlus, FileArchive, Bell, Settings, LifeBuoy, X } from "lucide-react";
import Link from "next/link";
import clsx from "clsx";
import { usePathname } from 'next/navigation';

export default function Sidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const pathname = usePathname();

  const navLinks = [
    { name: "Dashboard", icon: <Home size={18} />, href: "/dashboard" },
    { name: "My Forms", icon: <FileText size={18} />, href: "/dashboard/my-forms" },
    { name: "Drafts", icon: <FilePlus size={18} />, href: "/dashboard/drafts" },
    { name: "Published", icon: <FileArchive size={18} />, href: "/dashboard/published" },
    { name: "Archived", icon: <FileArchive size={18} />, href: "/dashboard/archived" },
  ];

  const utilityLinks = [
    { name: "Notifications", icon: <Bell size={18} />, href: "/dashboard/notifications" },
    { name: "Settings", icon: <Settings size={18} />, href: "/#" },
    { name: "Support", icon: <LifeBuoy size={18} />, href: "/#" },
  ];

  return (
    <>
      {/* Overlay for small screens */}
      <div
        className={clsx(
          "fixed inset-0 bg-grey11 bg-opacity-30 z-40 transition-opacity md:hidden",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />

      <aside
        className={clsx(
          "fixed top-0 left-0 w-64 bg-white border-r z-50 transform transition-transform md:relative md:translate-x-0 md:flex flex-col justify-between h-screen p-4",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Close button on small screens */}
        <div className="flex justify-end md:hidden mb-4">
          <button onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className="flex flex-col gap-6 h-full">
          <div>
            <h2 className="text-2xl font-bold mb-8 px-2 hidden md:flex">FormVive</h2>
            <nav className="space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={clsx(
                    "flex items-center gap-3 text-sm px-3 py-2 rounded-md hover:bg-gray-100 transition",
                    pathname === link.href && "bg-gray-100 font-semibold"
                  )}
                >
                  {link.icon}
                  {link.name}
                </Link>
              ))}
            </nav>

            <div className="mt-8 space-y-2">
              {utilityLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={clsx(
                    "flex items-center gap-3 text-sm px-3 py-2 rounded-md hover:bg-gray-100 transition",
                    pathname === link.href && "bg-gray-100 font-semibold"
                  )}
                >
                  
                  {link.icon}
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="bg-gray-100 p-4 rounded-xl text-sm mt-4">
            <p className="font-medium mb-2">Unlock More Power</p>
            <p className="text-gray-500 mb-3">Access advanced features, unlimited forms, and more.</p>
            <button className="bg-black text-white text-xs px-4 py-2 rounded-md">Upgrade now</button>
          </div>
        </div>
      </aside>
    </>
  );
}
