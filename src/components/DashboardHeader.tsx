"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Search } from "lucide-react";
import "./components.css";
import { getAuthToken } from "@/utils/authHelper";

interface UserProfile {
  firstName: string;
  lastName: string;
  role: string;
  email: string;
}

export default function DashboardHeader() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      const token = getAuthToken();
      console.log(token);
      if (!token) {
        console.log("missing token");
        router.push("/login");
        return;
      }

      try {
        const res = await fetch("https://form-vive-server.onrender.com/api/v1/user/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error("Failed to fetch user profile");

        const data = await res.json();
        setUser(data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  return (
    <header className="DashboardHeader flex items-center justify-between p-4 border-b border-gray-200 bg-white shadow-sm">
      {/* Search Box */}
      <div className="relative w-full max-w-sm">
        <input
          type="text"
          placeholder="Search..."
          className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black transition duration-200"
        />
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
      </div>

      {/* User Info */}
      <div className="flex items-center gap-3 px-2 py-1 rounded-xl hover:bg-gray-50 transition duration-200 cursor-pointer">
        <Image
          src="/assets/avatars/amaya.png" // Replace with user avatar if available in API
          alt="User Avatar"
          width={36}
          height={36}
          className="rounded-full object-cover border border-gray-200"
        />
        <div className="text-sm leading-tight">
          {loading ? (
            <p className="text-gray-400 animate-pulse">Loading...</p>
          ) : user ? (
            <>
              <p className="font-semibold text-gray-800">
                {user.firstName} {user.lastName}
              </p>
              <p className="text-gray-500 text-xs">{user.role}</p>
            </>
          ) : (
            <p className="text-red-500 text-xs">Failed to load user</p>
          )}
        </div>
      </div>
    </header>
  );
}
