"use client";

import { useCallback, useEffect, useState } from "react";

type Booking = {
  _id: string;
  tenant?: {
    name?: string;
  };
  property?: {
    title?: string;
  };
  monthlyRent?: number;
  status: string;
  createdAt?: string;
};

export default function RecentBooking() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchBookings = useCallback(async () => {
    try {
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        setError("Admin token nahi mila. Dobara login karo.");
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

      setBookings((data.bookings || []).slice(0, 5));
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Bookings fetch nahi ho paayi.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  return (
    <div className="mt-8 overflow-hidden rounded-xl border border-slate-300 bg-white">
      <div className="flex items-center justify-between border-b border-slate-300 p-5">
        <h3 className="text-lg font-semibold text-slate-900">
          Recent Bookings
        </h3>

        <button
          onClick={() => {
            setLoading(true);
            fetchBookings();
          }}
          className="text-sm text-blue-600 hover:underline"
        >
          Refresh
        </button>
      </div>

      {error && <p className="p-5 text-sm text-red-600">{error}</p>}

      {loading ? (
        <p className="p-5 text-slate-500">Loading bookings...</p>
      ) : !error && bookings.length === 0 ? (
        <p className="p-5 text-slate-500">
          There are no bookings in the database yet.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-300 bg-slate-50 text-slate-600">
              <tr>
                <th className="px-4 py-4">Booking ID</th>
                <th className="px-4 py-4">Tenant</th>
                <th className="px-4 py-4">Property</th>
                <th className="px-4 py-4">Rent</th>
                <th className="px-4 py-4">Status</th>
              </tr>
            </thead>

            <tbody>
              {bookings.map((booking) => (
                <tr
                  key={booking._id}
                  className="border-b border-slate-200 last:border-b-0"
                >
                  <td className="px-4 py-4 font-medium">
                    {booking._id.slice(-6).toUpperCase()}
                  </td>

                  <td className="px-4 py-4">{booking.tenant?.name || "—"}</td>

                  <td className="px-4 py-4">
                    {booking.property?.title || "—"}
                  </td>

                  <td className="whitespace-nowrap px-4 py-4">
                    ₹{Number(booking.monthlyRent || 0).toLocaleString("en-IN")}
                  </td>

                  <td className="px-4 py-4">
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium capitalize text-slate-700">
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
  );
}
