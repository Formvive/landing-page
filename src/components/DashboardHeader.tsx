import Image from "next/image";

export default function DashboardHeader() {
  return (
    <header className="DashboardHeader">
      <div className="relative w-full max-w-md">
        <input
          type="text"
          placeholder="Search"
          className="w-full pl-4 pr-10 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
        />
        <span className="absolute right-3 top-2.5 text-gray-400">
          🔍
        </span>
      </div>

      <div className="flex items-center gap-3">
        <Image
          src="/assets/avatars/amaya.png" // Replace with real avatar
          alt="User Avatar"
          width={32}
          height={32}
          className="rounded-full object-cover"
        />
        <div className="text-sm">
          <p className="font-semibold">Somto Obienu</p>
          <p className="text-gray-500 text-xs">Admin</p>
        </div>
      </div>
    </header>
  );
}
