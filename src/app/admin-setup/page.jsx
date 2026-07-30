"use client";
import { useState } from "react";
import { useUserProfile } from "@/utils/useUserProfile";
import { ShieldAlert, ShieldCheck, AlertCircle, UserCog } from "lucide-react";

const ROLE_OPTIONS = ["customer", "rider", "admin", "super_admin"];

export default function ManageAdminsPage() {
  const { data: user, loading: userLoading } = useUserProfile();
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("admin");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch("/api/admin/promote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, role }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update role");
      setResult(data.user);
      setEmail("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (userLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!user || user.role !== "super_admin") {
    return (
      <div className="container mx-auto px-4 py-20 font-poppins text-center">
        <div className="max-w-md mx-auto bg-white p-12 rounded-3xl shadow-xl border border-gray-100">
          <ShieldAlert className="text-red-500 mx-auto mb-6" size={64} />
          <h1 className="text-2xl font-black mb-3 text-gray-900">
            Restricted
          </h1>
          <p className="text-gray-500">
            This page is only available to super admins.
            {!user && " Sign in with a super admin account to continue."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-20 font-poppins">
      <div className="max-w-md mx-auto bg-white p-10 rounded-3xl shadow-xl border border-gray-100">
        <div className="flex items-center gap-3 mb-6">
          <div
            style={{ background: "linear-gradient(135deg, #0A84FF, #7C3AED)" }}
            className="w-12 h-12 rounded-2xl flex items-center justify-center"
          >
            <UserCog size={22} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-black text-gray-900">Manage Admins</h1>
            <p className="text-gray-500 text-sm">
              Set any account's role by email.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-black text-gray-700 mb-2">
              Account email
            </label>
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="someone@example.com"
              className="w-full bg-gray-50 border border-gray-100 rounded-xl py-3.5 px-5 outline-none focus:ring-2 focus:ring-[#0A84FF] text-sm font-medium"
            />
          </div>
          <div>
            <label className="block text-sm font-black text-gray-700 mb-2">
              New role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full bg-gray-50 border border-gray-100 rounded-xl py-3.5 px-5 outline-none focus:ring-2 focus:ring-[#0A84FF] text-sm font-medium"
            >
              {ROLE_OPTIONS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          {error && (
            <div className="bg-red-50 text-red-500 p-4 rounded-xl flex items-center gap-3 border border-red-100 text-sm font-bold">
              <AlertCircle size={18} className="shrink-0" />
              {error}
            </div>
          )}
          {result && (
            <div className="bg-green-50 text-green-600 p-4 rounded-xl flex items-center gap-3 border border-green-100 text-sm font-bold">
              <ShieldCheck size={18} className="shrink-0" />
              {result.email} is now {result.role}.
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gray-900 text-white py-4 rounded-xl font-black hover:bg-black transition-all disabled:opacity-50"
          >
            {loading ? "Updating..." : "Update Role"}
          </button>
        </form>
        <p className="text-xs text-gray-400 mt-4">
          The target account must already have signed up — this only changes
          the role on an existing account.
        </p>
      </div>
    </div>
  );
}
