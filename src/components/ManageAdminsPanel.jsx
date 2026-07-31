"use client";
import { useState } from "react";
import {
  UserCog,
  ShieldCheck,
  ShieldAlert,
  AlertCircle,
  Trash2,
  Plus,
  Crown,
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// Super-admin-only panel on the admin dashboard: shows every admin /
// super admin account, lets the super admin appoint a new admin by email
// (the account must already exist) and remove an admin (which sets their
// role back to customer). Uses the same /api/admin/promote endpoint as the
// standalone /admin-setup page.
export default function ManageAdminsPanel({ currentUserEmail }) {
  const queryClient = useQueryClient();
  const [email, setEmail] = useState("");
  const [feedback, setFeedback] = useState(null); // { kind: 'ok'|'err', text }

  const { data, isLoading } = useQuery({
    queryKey: ["admin-list"],
    queryFn: async () => {
      const res = await fetch("/api/admin/promote");
      if (!res.ok) throw new Error("Failed to load admins");
      return res.json();
    },
  });

  const setRole = useMutation({
    mutationFn: async ({ email, role }) => {
      const res = await fetch("/api/admin/promote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, role }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update role");
      return data.user;
    },
    onSuccess: (user) => {
      setFeedback({
        kind: "ok",
        text:
          user.role === "admin"
            ? `${user.email} is now an admin.`
            : `${user.email} is no longer an admin.`,
      });
      setEmail("");
      queryClient.invalidateQueries({ queryKey: ["admin-list"] });
    },
    onError: (err) => setFeedback({ kind: "err", text: err.message }),
  });

  const admins = data?.admins || [];

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
      <div
        style={{
          background: "linear-gradient(135deg, #F8FAFF 0%, #F5F3FF 100%)",
        }}
        className="px-6 py-5 border-b border-gray-100 flex items-center gap-3"
      >
        <div
          style={{ background: "linear-gradient(135deg, #0A84FF, #7C3AED)" }}
          className="w-10 h-10 rounded-xl flex items-center justify-center"
        >
          <UserCog size={20} className="text-white" />
        </div>
        <div>
          <h3 className="text-xl font-black text-gray-900">
            👑 Manage Admins
          </h3>
          <p className="text-xs text-gray-500 font-semibold">
            Super admin only — appoint or remove dashboard admins.
          </p>
        </div>
      </div>

      <div className="p-6">
        {/* Add admin */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setFeedback(null);
            if (email) setRole.mutate({ email, role: "admin" });
          }}
          className="flex flex-col sm:flex-row gap-3 mb-6"
        >
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email of an existing account, e.g. someone@example.com"
            className="flex-1 bg-gray-50 border border-gray-100 rounded-xl py-3.5 px-5 outline-none focus:ring-2 focus:ring-[#0A84FF] text-sm font-medium"
          />
          <button
            type="submit"
            disabled={setRole.isPending}
            style={{ background: "linear-gradient(135deg, #0A84FF, #7C3AED)" }}
            className="text-white px-6 py-3.5 rounded-xl font-black text-sm flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-50 transition-all"
          >
            <Plus size={16} />
            {setRole.isPending ? "Saving..." : "Make Admin"}
          </button>
        </form>

        {feedback && (
          <div
            className={`p-4 rounded-xl flex items-center gap-3 border text-sm font-bold mb-6 ${
              feedback.kind === "ok"
                ? "bg-green-50 text-green-600 border-green-100"
                : "bg-red-50 text-red-500 border-red-100"
            }`}
          >
            {feedback.kind === "ok" ? (
              <ShieldCheck size={18} className="shrink-0" />
            ) : (
              <AlertCircle size={18} className="shrink-0" />
            )}
            {feedback.text}
          </div>
        )}

        {/* Current admins */}
        <div className="divide-y divide-gray-50 border border-gray-100 rounded-2xl overflow-hidden">
          {isLoading ? (
            <div className="px-5 py-10 text-center text-gray-400 text-sm">
              Loading admins...
            </div>
          ) : admins.length === 0 ? (
            <div className="px-5 py-10 text-center text-gray-400 text-sm italic">
              No admins yet.
            </div>
          ) : (
            admins.map((a) => {
              const isSuper = a.role === "super_admin";
              const isSelf =
                a.email?.toLowerCase() === currentUserEmail?.toLowerCase();
              return (
                <div
                  key={a.id}
                  className="px-5 py-4 flex items-center justify-between gap-4 hover:bg-blue-50/20 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      style={{
                        background: isSuper
                          ? "linear-gradient(135deg, #FBBF24, #F59E0B)"
                          : "linear-gradient(135deg, #0A84FF, #4F46E5)",
                      }}
                      className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                    >
                      {isSuper ? (
                        <Crown size={18} className="text-white" />
                      ) : (
                        <ShieldCheck size={18} className="text-white" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="font-black text-gray-900 text-sm truncate">
                        {a.name || a.email}
                        {isSelf && (
                          <span className="text-gray-400 font-bold"> (you)</span>
                        )}
                      </div>
                      <div className="text-xs text-gray-400 font-medium truncate">
                        {a.email}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span
                      className={`text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-wide ${
                        isSuper
                          ? "bg-yellow-50 text-yellow-600"
                          : "bg-blue-50 text-blue-600"
                      }`}
                    >
                      {isSuper ? "Super Admin" : "Admin"}
                    </span>
                    {!isSuper && (
                      <button
                        onClick={() => {
                          setFeedback(null);
                          if (
                            window.confirm(
                              `Remove ${a.email} as admin? They'll become a regular customer account.`,
                            )
                          ) {
                            setRole.mutate({ email: a.email, role: "customer" });
                          }
                        }}
                        disabled={setRole.isPending}
                        className="w-9 h-9 bg-red-50 text-red-500 rounded-xl flex items-center justify-center hover:bg-red-100 disabled:opacity-50 transition-all"
                        title="Remove admin"
                      >
                        <Trash2 size={15} />
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        <p className="text-xs text-gray-400 mt-4 flex items-center gap-1.5">
          <ShieldAlert size={13} className="shrink-0" />
          An account must already exist (signed up) before it can be made an
          admin. Removing an admin turns them back into a customer.
        </p>
      </div>
    </div>
  );
}
