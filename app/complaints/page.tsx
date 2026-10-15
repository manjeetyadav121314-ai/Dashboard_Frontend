"use client";

import { useCallback, useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

type Complaint = {
  _id: string;
  user?: {
    name?: string;
    email?: string;
    role?: string;
  };
  property?: {
    title?: string;
    city?: string;
  } | null;
  subject: string;
  description: string;
  status: string;
  adminRemark?: string;
  createdAt?: string;
};

export default function ComplaintsPage() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchComplaints = useCallback(async () => {
    try {
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        setError("Login token nahi mila. Dobara login karo.");
        return;
      }

      const response = await fetch(
        "http://localhost:2000/v1/admin/complaints",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Complaints load nahi hui.");
      }

      setComplaints(data.complaints || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Kuch galat ho gaya.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchComplaints();
  }, [fetchComplaints]);

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "resolved":
        return "bg-green-100 text-green-700";
      case "in_progress":
        return "bg-blue-100 text-blue-700";
      case "rejected":
        return "bg-red-100 text-red-700";
      default:
        return "bg-amber-100 text-amber-700";
    }
  };

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
                  Complaints Management
                </h1>
                <p className="mt-1 text-sm text-slate-500">
                  View complaints submitted by tenants and property owners.
                </p>
              </div>

              <button
                onClick={() => {
                  setLoading(true);
                  fetchComplaints();
                }}
                className="rounded-lg border bg-white px-4 py-2 text-sm hover:bg-slate-50"
              >
                Refresh
              </button>
            </div>

            <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="rounded-xl border bg-white p-5 shadow-sm">
                <p className="text-sm text-slate-500">Total Complaints</p>
                <h2 className="mt-2 text-2xl font-bold text-slate-800">
                  {complaints.length}
                </h2>
              </div>

              <div className="rounded-xl border bg-white p-5 shadow-sm">
                <p className="text-sm text-slate-500">Open</p>
                <h2 className="mt-2 text-2xl font-bold text-amber-600">
                  {complaints.filter((c) => c.status === "open").length}
                </h2>
              </div>

              <div className="rounded-xl border bg-white p-5 shadow-sm">
                <p className="text-sm text-slate-500">Resolved</p>
                <h2 className="mt-2 text-2xl font-bold text-green-600">
                  {complaints.filter((c) => c.status === "resolved").length}
                </h2>
              </div>
            </div>

            {error && (
              <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
              {loading ? (
                <p className="p-8 text-center text-slate-500">
                  Loading complaints...
                </p>
              ) : complaints.length === 0 ? (
                <p className="p-8 text-center text-slate-500">
                  There are no complaints yet.
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 text-slate-600">
                      <tr>
                        <th className="px-4 py-4">Subject</th>
                        <th className="px-4 py-4">Reported By</th>
                        <th className="px-4 py-4">Property</th>
                        <th className="px-4 py-4">Date</th>
                        <th className="px-4 py-4">Status</th>
                      </tr>
                    </thead>

                    <tbody className="divide-y">
                      {complaints.map((complaint) => (
                        <tr key={complaint._id}>
                          <td className="min-w-56 px-4 py-4">
                            <p className="font-medium text-slate-800">
                              {complaint.subject}
                            </p>
                            <p className="mt-1 max-w-sm text-xs text-slate-500">
                              {complaint.description}
                            </p>
                          </td>

                          <td className="px-4 py-4">
                            {complaint.user?.name || "—"}
                            <p className="text-xs text-slate-500">
                              {complaint.user?.email || ""}
                            </p>
                            <p className="text-xs capitalize text-slate-400">
                              {complaint.user?.role || ""}
                            </p>
                          </td>

                          <td className="px-4 py-4">
                            {complaint.property?.title || "—"}
                            <p className="text-xs text-slate-500">
                              {complaint.property?.city || ""}
                            </p>
                          </td>

                          <td className="whitespace-nowrap px-4 py-4">
                            {complaint.createdAt
                              ? new Date(
                                  complaint.createdAt,
                                ).toLocaleDateString("en-IN")
                              : "—"}
                          </td>

                          <td className="whitespace-nowrap px-4 py-4">
                            <span
                              className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(
                                complaint.status,
                              )}`}
                            >
                              {complaint.status.replace("_", " ")}
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
