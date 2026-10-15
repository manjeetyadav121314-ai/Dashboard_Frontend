"use client";

import { useCallback, useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

type Property = {
  _id: string;
  title: string;
  propertyType?: string;
  rent?: number;
  city?: string;
  address?: string;
  status?: string;
  owner?: {
    name?: string;
    email?: string;
  };
};

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState("");

  const fetchProperties = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Admin token nahi mila. Dobara login karo.");
      }

      const response = await fetch(
        "http://localhost:2000/v1/admin/properties",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Properties fetch nahi hui");
      }

      setProperties(data.properties ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchProperties();
  }, [fetchProperties]);

  const deleteProperty = async (property: Property) => {
    const confirmed = window.confirm(
      `Kya "${property.title}" property permanently delete karni hai?`,
    );

    if (!confirmed) return;

    setDeletingId(property._id);
    setError("");

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Admin token nahi mila. Dobara login karo.");
      }

      const response = await fetch(
        `http://localhost:2000/v1/admin/properties/${property._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Property delete nahi hui");
      }

      setProperties((current) =>
        current.filter((item) => item._id !== property._id),
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setDeletingId("");
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />

      <main className="min-w-0 flex-1">
        <Header />

        <div className="p-6">
          <div className="mx-auto max-w-7xl">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h1 className="text-2xl font-bold text-slate-800">
                  Properties
                </h1>
                <p className="mt-1 text-sm text-slate-500">
                  View and manage listed properties
                </p>
              </div>

              <button
                onClick={() => void fetchProperties()}
                className="rounded-lg border bg-white px-4 py-2 text-sm hover:bg-slate-100"
              >
                Refresh
              </button>
            </div>

            <div className="mb-5 rounded-xl border bg-white p-5">
              <p className="text-sm text-slate-500">Total Properties</p>
              <p className="mt-2 text-2xl font-bold">{properties.length}</p>
            </div>

            {error && (
              <p className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
                {error}
              </p>
            )}

            <div className="overflow-x-auto rounded-xl border bg-white">
              {loading ? (
                <p className="p-6 text-slate-500">Loading properties...</p>
              ) : properties.length === 0 ? (
                <p className="p-6 text-slate-500">No properties found.</p>
              ) : (
                <table className="w-full min-w-[850px] text-left text-sm">
                  <thead className="border-b bg-slate-100 text-slate-600">
                    <tr>
                      <th className="p-4">Title</th>
                      <th className="p-4">Type</th>
                      <th className="p-4">Rent</th>
                      <th className="p-4">Location</th>
                      <th className="p-4">Owner</th>
                      <th className="p-4">Status</th>
                      <th className="p-4">Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {properties.map((property) => (
                      <tr key={property._id} className="border-b last:border-0">
                        <td className="p-4 font-medium">{property.title}</td>

                        <td className="p-4 capitalize">
                          {property.propertyType ?? "—"}
                        </td>

                        <td className="p-4">
                          {typeof property.rent === "number"
                            ? `₹${property.rent.toLocaleString("en-IN")}`
                            : "—"}
                        </td>

                        <td className="p-4">
                          {property.city || property.address || "—"}
                        </td>

                        <td className="p-4">
                          {property.owner?.name || property.owner?.email || "—"}
                        </td>

                        <td className="p-4 capitalize">
                          {property.status ?? "—"}
                        </td>

                        <td className="p-4">
                          <button
                            disabled={deletingId === property._id}
                            onClick={() => void deleteProperty(property)}
                            className="rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-700 hover:bg-red-100 disabled:opacity-50"
                          >
                            {deletingId === property._id
                              ? "Deleting..."
                              : "Delete"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
