"use client";

import { useCallback, useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

type Payment = {
  _id: string;
  booking?: {
    _id?: string;
  };
  tenant?: {
    name?: string;
    email?: string;
  };
  owner?: {
    name?: string;
    email?: string;
  };
  amount: number;
  paymentMethod: string;
  transactionId?: string;
  status: string;
  paymentDate?: string;
};

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchPayments = useCallback(async () => {
    try {
      setError("");
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Login token nahi mila. Dobara login karo.");
        return;
      }

      const response = await fetch("http://localhost:2000/v1/admin/payments", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Payments load nahi hui.");
      }

      setPayments(data.payments || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Kuch galat ho gaya.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

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
                  Payments Management
                </h1>
                <p className="mt-1 text-sm text-slate-500">
                  View roon rent payment records.
                </p>
              </div>

              <button
                onClick={() => {
                  setLoading(true);
                  fetchPayments();
                }}
                className="rounded-lg border bg-white px-4 py-2 text-sm hover:bg-slate-50"
              >
                Refresh
              </button>
            </div>

            <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="rounded-xl border bg-white p-5 shadow-sm">
                <p className="text-sm text-slate-500">Total Payments</p>
                <h2 className="mt-2 text-2xl font-bold text-slate-800">
                  {payments.length}
                </h2>
              </div>

              <div className="rounded-xl border bg-white p-5 shadow-sm">
                <p className="text-sm text-slate-500">Completed</p>
                <h2 className="mt-2 text-2xl font-bold text-green-600">
                  {payments.filter((p) => p.status === "completed").length}
                </h2>
              </div>

              <div className="rounded-xl border bg-white p-5 shadow-sm">
                <p className="text-sm text-slate-500">Pending</p>
                <h2 className="mt-2 text-2xl font-bold text-amber-600">
                  {payments.filter((p) => p.status === "pending").length}
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
                  Loading payments...
                </p>
              ) : payments.length === 0 ? (
                <p className="p-8 text-center text-slate-500">
                  There are no payment records yet.
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 text-slate-600">
                      <tr>
                        <th className="px-4 py-4">Tenant</th>
                        <th className="px-4 py-4">Owner</th>
                        <th className="px-4 py-4">Amount</th>
                        <th className="px-4 py-4">Method</th>
                        <th className="px-4 py-4">Transaction ID</th>
                        <th className="px-4 py-4">Date</th>
                        <th className="px-4 py-4">Status</th>
                      </tr>
                    </thead>

                    <tbody className="divide-y">
                      {payments.map((payment) => (
                        <tr key={payment._id}>
                          <td className="px-4 py-4">
                            {payment.tenant?.name || "—"}
                            <p className="text-xs text-slate-500">
                              {payment.tenant?.email || ""}
                            </p>
                          </td>

                          <td className="px-4 py-4">
                            {payment.owner?.name || "—"}
                          </td>

                          <td className="whitespace-nowrap px-4 py-4 font-medium">
                            ₹
                            {Number(payment.amount || 0).toLocaleString(
                              "en-IN",
                            )}
                          </td>

                          <td className="whitespace-nowrap px-4 py-4 capitalize">
                            {payment.paymentMethod?.replace("_", " ") || "—"}
                          </td>

                          <td className="px-4 py-4">
                            {payment.transactionId || "—"}
                          </td>

                          <td className="whitespace-nowrap px-4 py-4">
                            {payment.paymentDate
                              ? new Date(
                                  payment.paymentDate,
                                ).toLocaleDateString("en-IN")
                              : "—"}
                          </td>

                          <td className="px-4 py-4">
                            <span
                              className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                                payment.status === "completed"
                                  ? "bg-green-100 text-green-700"
                                  : payment.status === "failed"
                                    ? "bg-red-100 text-red-700"
                                    : payment.status === "refunded"
                                      ? "bg-purple-100 text-purple-700"
                                      : "bg-amber-100 text-amber-700"
                              }`}
                            >
                              {payment.status}
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
