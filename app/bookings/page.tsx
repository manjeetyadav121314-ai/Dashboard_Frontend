"use client";

import { useCallback, useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

type Booking = {
  _id: string;
  property?: {
    title?: string;
    city?: string;
    rent?: number;
  };
  tenant?: {
    name?: string;
    email?: string;
  };
  owner?: {
    name?: string;
    email?: string;
  };
  startDate: string;
  endDate: string;
  monthlyRent: number;
  status: string;
  createdAt?: string;
};

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchBookings = useCallback(async () => {
    try {
      setError("");
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Login token nahi mila. Dobara login karo.");
        return;
      }

      const response = await fetch("http://localhost:2000/v1/admin/bookings", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Bookings load nahi hui.");
      }

      setBookings(data.bookings || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Kuch galat ho gaya.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />

      <main className="min-w-0 flex-1">
        <Header />

        <div className="p-4 md:p-6">
          <div className="mx-auto max-w-7xl">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h1 className="text-2xl font-bold text-slate-800">
                  Bookings Management
                </h1>
                <p className="mt-1 text-sm text-slate-500">
                  View all bookings on room rent.
                </p>
              </div>

              <button
                onClick={() => {
                  setLoading(true);
                  fetchBookings();
                }}
                className="rounded-lg border bg-white px-4 py-2 text-sm hover:bg-slate-50"
              >
                Refresh
              </button>
            </div>

            <div className="mb-6 rounded-xl border bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-500">Total Bookings</p>
              <h2 className="mt-2 text-2xl font-bold text-slate-800">
                {bookings.length}
              </h2>
            </div>

            {error && (
              <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
              {loading ? (
                <p className="p-8 text-center text-slate-500">
                  Loading bookings...
                </p>
              ) : bookings.length === 0 ? (
                <p className="p-8 text-center text-slate-500">
                  There are no bookings yet.
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 text-slate-600">
                      <tr>
                        <th className="px-4 py-4">Property</th>
                        <th className="px-4 py-4">Tenant</th>
                        <th className="px-4 py-4">Owner</th>
                        <th className="px-4 py-4">Monthly Rent</th>
                        <th className="px-4 py-4">Start Date</th>
                        <th className="px-4 py-4">Status</th>
                      </tr>
                    </thead>

                    <tbody className="divide-y">
                      {bookings.map((booking) => (
                        <tr key={booking._id}>
                          <td className="px-4 py-4">
                            <p className="font-medium text-slate-800">
                              {booking.property?.title ||
                                "Property unavailable"}
                            </p>
                            <p className="text-xs text-slate-500">
                              {booking.property?.city || "—"}
                            </p>
                          </td>

                          <td className="px-4 py-4">
                            {booking.tenant?.name || "—"}
                            <p className="text-xs text-slate-500">
                              {booking.tenant?.email || ""}
                            </p>
                          </td>

                          <td className="px-4 py-4">
                            {booking.owner?.name || "—"}
                            <p className="text-xs text-slate-500">
                              {booking.owner?.email || ""}
                            </p>
                          </td>

                          <td className="whitespace-nowrap px-4 py-4">
                            ₹
                            {Number(booking.monthlyRent || 0).toLocaleString(
                              "en-IN",
                            )}
                          </td>

                          <td className="whitespace-nowrap px-4 py-4">
                            {booking.startDate
                              ? new Date(booking.startDate).toLocaleDateString(
                                  "en-IN",
                                )
                              : "—"}
                          </td>

                          <td className="px-4 py-4">
                            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold capitalize text-slate-700">
                              {booking.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
