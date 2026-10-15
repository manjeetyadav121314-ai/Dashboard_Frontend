"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import StatCard from "@/components/StartCard";
import RecentBooking from "@/components/RecentBooking";

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOwners: 0,
    totalTenants: 0,
    totalProperties: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setError("Admin token nahi mila. Dobara login karo.");
          return;
        }

        const response = await fetch(
          "http://localhost:2000/v1/admin/dashboard",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Dashboard data fetch nahi hua");
        }

        const dashboard = data.stats ?? data;

        setStats({
          totalUsers: dashboard.totalUsers ?? 0,
          totalOwners: dashboard.totalOwners ?? 0,
          totalTenants: dashboard.totalTenants ?? 0,
          totalProperties: dashboard.totalProperties ?? 0,
        });
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Something went wrong"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />

      <main className="min-w-0 flex-1">
        <Header />

        <div className="p-6">
          <h2 className="mb-6 text-2xl font-bold text-slate-800">
            Overview
          </h2>

          {error && (
            <p className="mb-4 rounded-lg bg-red-50 p-3 text-red-600">
              {error}
            </p>
          )}

          {loading && (
            <p className="mb-4 text-slate-500">Dashboard loading...</p>
          )}

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              title="Total Users"
              value={loading ? "..." : String(stats.totalUsers)}
              icon="👥"
              description="Registered users"
            />

            <StatCard
              title="Total Owners"
              value={loading ? "..." : String(stats.totalOwners)}
              icon="🏠"
              description="Registered property owners"
            />

            <StatCard
              title="Total Tenants"
              value={loading ? "..." : String(stats.totalTenants)}
              icon="👤"
              description="Registered tenants"
            />

            <StatCard
              title="Properties"
              value={loading ? "..." : String(stats.totalProperties)}
              icon="🏘️"
              description="Listed properties"
            />
          </div>

          <RecentBooking />

          <div className="mt-8 rounded-xl border bg-white p-6">
            <h3 className="text-lg font-semibold text-slate-800">
              Welcome to RoomRent Admin
            </h3>

            <p className="mt-2 text-slate-500">
              Manage users, properties and bookings from one place.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}