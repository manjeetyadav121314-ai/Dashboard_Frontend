"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const menuItems = [
  { name: "Dashboard", path: "/dashboard", icon: "📊" },
  { name: "Users", path: "/users", icon: "👥" },
  { name: "Properties", path: "/properties", icon: "🏠" },
  { name: "Bookings", path: "/bookings", icon: "📅" },
  { name: "Payments", path: "/payments", icon: "💳" },
  { name: "Complaints", path: "/complaints", icon: "📝" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="min-h-screen w-64 bg-slate-900 p-5 text-white">
      <h1 className="mb-8 text-xl font-bold">RoomRent Admin</h1>

      <nav className="space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            href={item.path}
            className={`block rounded-lg px-4 py-3 ${
              pathname === item.path
                ? "bg-blue-600"
                : "text-slate-300 hover:bg-slate-800"
            }`}
          >
            <span className="mr-3">{item.icon}</span>
            {item.name}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
