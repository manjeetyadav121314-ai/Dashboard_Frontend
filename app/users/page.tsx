"use client";

import { useCallback, useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

type User = {
  _id: string;
  name: string;
  email: string;
  role: string;
  status: "active" | "suspended";
  createdAt?: string;
};

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState("");

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Admin token nahi mila. Dobara login karo.");
      }

      const response = await fetch("http://localhost:2000/v1/admin/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Users fetch nahi hue");
      }

      setUsers(data.users ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchUsers();
  }, [fetchUsers]);

  const updateStatus = async (user: User) => {
    const newStatus = user.status === "active" ? "suspended" : "active";

    setUpdatingId(user._id);
    setError("");

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Admin token nahi mila. Dobara login karo.");
      }

      const response = await fetch(
        `http://localhost:2000/v1/admin/users/${user._id}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: newStatus }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Status update nahi hua");
      }

      await fetchUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Status update failed");
    } finally {
      setUpdatingId("");
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <main className="min-w-0 flex-1">
        <Header />
        <div className="p-6">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3 ">
            <div>
              <h1 className="text-2xl font-bold text-slate-800">Users</h1>
              <p className="mt-1 text-sm text-slate-500">
                Manage registered users, owners and tenants
              </p>
            </div>

            <button
              onClick={() => void fetchUsers()}
              className="rounded-lg border bg-white px-4 py-2 text-sm font-medium hover:bg-slate-100"
            >
              Refresh
            </button>
          </div>

          <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-xl border bg-white p-5">
              <p className="text-sm text-slate-500">Total Users</p>
              <p className="mt-2 text-2xl font-bold">{users.length}</p>
            </div>
            <div className="rounded-xl border bg-white p-5">
              <p className="text-sm text-slate-500">Owners</p>
              <p className="mt-2 text-2xl font-bold">
                {users.filter((user) => user.role === "owner").length}
              </p>
            </div>
            <div className="rounded-xl border bg-white p-5">
              <p className="text-sm text-slate-500">Tenants</p>
              <p className="mt-2 text-2xl font-bold">
                {users.filter((user) => user.role === "tenant").length}
              </p>
            </div>
          </div>

          {error && (
            <p className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
              {error}
            </p>
          )}

          <div className="overflow-x-auto rounded-xl border bg-white">
            {loading ? (
              <p className="p-6 text-slate-500">Loading users...</p>
            ) : users.length === 0 ? (
              <p className="p-6 text-slate-500">No users found.</p>
            ) : (
              <table className="w-full min-w-[750px] text-left text-sm">
                <thead className="border-b bg-slate-100 text-slate-600">
                  <tr>
                    <th className="p-4">Name</th>
                    <th className="p-4">Email</th>
                    <th className="p-4">Role</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Joined</th>
                    <th className="p-4">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user._id} className="border-b last:border-0">
                      <td className="p-4 font-medium">{user.name}</td>
                      <td className="p-4">{user.email}</td>
                      <td className="p-4 capitalize">{user.role}</td>
                      <td className="p-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-medium ${
                            user.status === "active"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {user.status}
                        </span>
                      </td>
                      <td className="p-4">
                        {user.createdAt
                          ? new Date(user.createdAt).toLocaleDateString()
                          : "—"}
                      </td>
                      <td className="p-4">
                        <button
                          disabled={updatingId === user._id}
                          onClick={() => void updateStatus(user)}
                          className="rounded-lg border px-3 py-2 text-xs font-medium hover:bg-slate-50 disabled:opacity-50"
                        >
                          {updatingId === user._id
                            ? "Updating..."
                            : user.status === "active"
                              ? "Suspend"
                              : "Activate"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
