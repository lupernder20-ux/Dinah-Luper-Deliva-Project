"use client";
import { useState } from "react";
import {
  Truck,
  MapPin,
  Phone,
  Package,
  History,
  DollarSign,
  List,
  Briefcase,
  Clock,
  Zap,
  CheckCircle,
  Bell,
} from "lucide-react";
import { useUserProfile } from "@/utils/useUserProfile";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "motion/react";

export default function RiderDashboard() {
  const { data: user } = useUserProfile();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("my-jobs");

  const { data: jobsData, isLoading } = useQuery({
    queryKey: ["rider-jobs", user?.id],
    queryFn: async () => {
      const res = await fetch("/api/riders/jobs");
      if (!res.ok) throw new Error("Failed to fetch jobs");
      return res.json();
    },
    enabled: !!user?.id,
  });

  const acceptJobMutation = useMutation({
    mutationFn: async (id) => {
      const res = await fetch(`/api/riders/jobs/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "accept" }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to accept job");
      }
      return res.json();
    },
    onSuccess: () => queryClient.invalidateQueries(["rider-jobs"]),
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }) => {
      const res = await fetch(`/api/riders/jobs/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Failed to update status");
      return res.json();
    },
    onSuccess: () => queryClient.invalidateQueries(["rider-jobs"]),
  });

  const myJobs = jobsData?.myJobs || [];
  const availableJobs = jobsData?.availableJobs || [];
  const completedJobs = jobsData?.completedJobs || [];
  const profile = jobsData?.profile || {};

  const handleUpdateStatus = (id, currentStatus) => {
    const map = {
      Accepted: "Picked Up",
      "Picked Up": "In Transit",
      "In Transit": "Delivered",
    };
    const next = map[currentStatus];
    if (next) updateStatusMutation.mutate({ id, status: next });
  };

  const nextStatusLabel = (s) =>
    ({
      Accepted: "📦 Mark Picked Up",
      "Picked Up": "🚴 Start Transit",
      "In Transit": "✅ Complete Delivery",
    })[s] || "Update";

  const tabs = [
    {
      id: "my-jobs",
      label: "My Jobs",
      icon: <Briefcase size={16} />,
      count: myJobs.length,
      gradient: "linear-gradient(135deg, #0A84FF, #4F46E5)",
    },
    {
      id: "available",
      label: "Available",
      icon: <List size={16} />,
      count: availableJobs.length,
      gradient: "linear-gradient(135deg, #00C853, #0891B2)",
    },
    {
      id: "history",
      label: "Earnings",
      icon: <History size={16} />,
      count: completedJobs.length,
      gradient: "linear-gradient(135deg, #7C3AED, #DB2777)",
    },
  ];

  return (
    <div
      style={{
        background: "linear-gradient(135deg, #F0F9FF 0%, #F5F3FF 100%)",
      }}
      className="min-h-screen font-poppins"
    >
      {/* ─── HEADER ─────────────────────────────────────────────────────── */}
      <div
        style={{
          background: "linear-gradient(135deg, #00C853 0%, #0891B2 100%)",
        }}
        className="px-4 md:px-6 pt-8 pb-24 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3" />
        <div className="container mx-auto relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="text-white">
              <div className="flex items-center gap-2 mb-1">
                <Truck size={16} className="text-green-200" />
                <span className="text-green-200 text-sm font-semibold uppercase tracking-widest">
                  Rider Portal
                </span>
              </div>
              <h1 className="text-3xl font-black">Rider Dashboard 🏍️</h1>
              <div className="flex items-center gap-3 mt-2">
                <div className="flex items-center gap-1.5">
                  <div
                    className="w-2 h-2 bg-green-300 rounded-full"
                    style={{ animation: "pulse 2s infinite" }}
                  />
                  <span className="text-green-200 text-sm font-bold">
                    ONLINE
                  </span>
                </div>
                {profile.vehicle_type && (
                  <span className="bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full">
                    {profile.vehicle_type}
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="w-10 h-10 bg-white/10 border border-white/20 rounded-xl flex items-center justify-center text-white hover:bg-white/20 transition-all">
                <Bell size={18} />
              </button>
              <div className="bg-white/15 backdrop-blur border border-white/20 rounded-2xl px-5 py-3 text-white">
                <div className="text-xs text-green-200 font-bold uppercase tracking-widest">
                  Total Earnings
                </div>
                <div className="text-2xl font-black">
                  ₦{Number(profile.earnings || 0).toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 -mt-16 pb-12 relative z-10">
        {/* ─── QUICK STATS ────────────────────────────────────────────── */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            {
              label: "My Jobs",
              value: myJobs.length,
              gradient: "linear-gradient(135deg, #0A84FF, #4F46E5)",
              emoji: "📋",
            },
            {
              label: "Available",
              value: availableJobs.length,
              gradient: "linear-gradient(135deg, #00C853, #0891B2)",
              emoji: "🔔",
            },
            {
              label: "Completed",
              value: completedJobs.length,
              gradient: "linear-gradient(135deg, #7C3AED, #DB2777)",
              emoji: "✅",
            },
          ].map((s, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
            >
              <div
                style={{ background: s.gradient }}
                className="p-3 flex items-center gap-2"
              >
                <span className="text-2xl">{s.emoji}</span>
              </div>
              <div className="px-4 py-3">
                <div className="text-2xl font-black text-gray-900">
                  {s.value}
                </div>
                <div className="text-xs text-gray-500 font-semibold">
                  {s.label}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ─── TAB NAV ────────────────────────────────────────────────── */}
        <div className="flex gap-3 mb-6 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={activeTab === tab.id ? { background: tab.gradient } : {}}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl font-black text-sm whitespace-nowrap transition-all ${activeTab === tab.id ? "text-white shadow-lg" : "bg-white text-gray-600 border border-gray-100 hover:border-gray-300"}`}
            >
              {tab.icon} {tab.label}
              <span
                className={`text-xs px-2 py-0.5 rounded-full ${activeTab === tab.id ? "bg-white/25" : "bg-gray-100"}`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-64 bg-white rounded-3xl shadow-xl">
            <div className="text-center">
              <div
                style={{
                  background: "linear-gradient(135deg, #00C853, #0891B2)",
                }}
                className="w-14 h-14 rounded-full mx-auto mb-4 flex items-center justify-center"
              >
                <div
                  className="w-7 h-7 border-3 border-white border-t-transparent rounded-full"
                  style={{ animation: "spin 1s linear infinite" }}
                />
              </div>
              <p className="text-gray-400 font-semibold">Loading jobs...</p>
            </div>
          </div>
        ) : (
          <>
            {/* MY JOBS */}
            {activeTab === "my-jobs" && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {myJobs.length > 0 ? (
                  myJobs.map((job) => (
                    <motion.div
                      key={job.id}
                      whileHover={{ y: -4 }}
                      className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden"
                    >
                      <div
                        style={{
                          background:
                            "linear-gradient(135deg, #0A84FF 0%, #7C3AED 100%)",
                        }}
                        className="p-5"
                      >
                        <div className="flex justify-between items-start">
                          <div className="text-white">
                            <div className="text-xs text-blue-200 font-bold uppercase tracking-widest mb-1">
                              Customer
                            </div>
                            <div className="text-xl font-black">
                              {job.sender_name}
                            </div>
                          </div>
                          <span className="bg-yellow-400 text-gray-900 text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest">
                            {job.status}
                          </span>
                        </div>
                      </div>

                      <div className="p-6">
                        <div className="space-y-4 relative mb-6">
                          <div className="absolute left-2.5 top-3 bottom-3 w-0.5 border-l-2 border-dashed border-gray-200" />
                          <div className="flex gap-3 relative z-10">
                            <div className="w-5 h-5 rounded-full bg-[#0A84FF] border-4 border-blue-100 shrink-0" />
                            <div>
                              <div className="text-[10px] text-gray-400 font-black uppercase">
                                Pickup
                              </div>
                              <div className="text-sm font-semibold text-gray-800">
                                {job.pickup_address}
                              </div>
                              <div className="text-xs text-[#0A84FF] font-bold mt-0.5">
                                {job.sender_phone}
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-3 relative z-10">
                            <div className="w-5 h-5 rounded-full bg-[#FF6D00] border-4 border-orange-100 shrink-0" />
                            <div>
                              <div className="text-[10px] text-gray-400 font-black uppercase">
                                Delivery
                              </div>
                              <div className="text-sm font-semibold text-gray-800">
                                {job.delivery_address}
                              </div>
                              <div className="text-xs text-[#FF6D00] font-bold mt-0.5">
                                {job.receiver_phone}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-3">
                          <button
                            onClick={() =>
                              handleUpdateStatus(job.id, job.status)
                            }
                            style={{
                              background:
                                "linear-gradient(135deg, #0A84FF, #7C3AED)",
                            }}
                            className="flex-1 text-white py-3.5 rounded-xl font-black text-sm hover:opacity-90 transition-all"
                          >
                            {nextStatusLabel(job.status)}
                          </button>
                          <a
                            href={`tel:${job.sender_phone}`}
                            className="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center hover:bg-green-100 transition-all"
                          >
                            <Phone size={20} />
                          </a>
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="col-span-full bg-white rounded-3xl shadow-xl p-16 text-center border border-gray-100">
                    <div className="text-6xl mb-4">📭</div>
                    <h3 className="text-xl font-black text-gray-900 mb-2">
                      No Active Jobs
                    </h3>
                    <p className="text-gray-500 text-sm">
                      Check the Available tab to find new delivery requests.
                    </p>
                    <button
                      onClick={() => setActiveTab("available")}
                      style={{
                        background: "linear-gradient(135deg, #00C853, #0891B2)",
                      }}
                      className="mt-6 inline-flex items-center gap-2 text-white px-8 py-3 rounded-xl font-black text-sm hover:opacity-90 transition-all"
                    >
                      View Available Jobs
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* AVAILABLE JOBS */}
            {activeTab === "available" && (
              <div className="space-y-5">
                {availableJobs.length > 0 ? (
                  availableJobs.map((job) => (
                    <motion.div
                      key={job.id}
                      whileHover={{ x: 4 }}
                      className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden"
                    >
                      <div className="flex flex-col md:flex-row items-stretch">
                        <div
                          style={{
                            background:
                              "linear-gradient(135deg, #00C853, #0891B2)",
                          }}
                          className="p-6 md:w-24 flex items-center justify-center"
                        >
                          <span className="text-4xl">📦</span>
                        </div>
                        <div className="flex-1 p-6 flex flex-col md:flex-row items-start md:items-center gap-6">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-xs bg-orange-100 text-orange-600 font-black px-2.5 py-1 rounded-full uppercase">
                                {job.priority}
                              </span>
                              <span className="text-xs bg-blue-100 text-blue-600 font-black px-2.5 py-1 rounded-full">
                                {job.package_type}
                              </span>
                            </div>
                            <div className="font-black text-gray-900 text-base">
                              {job.sender_name} → {job.receiver_name}
                            </div>
                            <div className="text-gray-500 text-sm mt-1 flex items-center gap-3">
                              <span className="flex items-center gap-1">
                                <MapPin size={14} /> ~5.2 km
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock size={14} /> Just now
                              </span>
                            </div>
                          </div>
                          <div className="text-center md:text-right">
                            <div className="text-2xl font-black text-[#00C853]">
                              ₦{Number(job.cost * 0.8).toLocaleString()}
                            </div>
                            <div className="text-xs text-gray-400 font-semibold">
                              Your Cut (80%)
                            </div>
                          </div>
                          <button
                            onClick={() => acceptJobMutation.mutate(job.id)}
                            disabled={acceptJobMutation.isPending}
                            style={{
                              background:
                                "linear-gradient(135deg, #00C853, #0891B2)",
                            }}
                            className="w-full md:w-auto text-white px-8 py-3.5 rounded-xl font-black text-sm hover:opacity-90 transition-all disabled:opacity-50"
                          >
                            Accept Job ✓
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="bg-white rounded-3xl shadow-xl p-16 text-center border border-gray-100">
                    <div className="text-6xl mb-4">⏳</div>
                    <h3 className="text-xl font-black text-gray-900 mb-2">
                      Queue is Empty
                    </h3>
                    <p className="text-gray-500 text-sm">
                      No delivery requests available right now. Check back
                      shortly.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* EARNINGS HISTORY */}
            {activeTab === "history" && (
              <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
                <div
                  style={{
                    background:
                      "linear-gradient(135deg, #F5F3FF 0%, #EFF6FF 100%)",
                  }}
                  className="px-6 py-5 border-b border-gray-100 flex items-center justify-between"
                >
                  <h3 className="text-xl font-black text-gray-900">
                    💰 Earnings History
                  </h3>
                  <div
                    style={{
                      background: "linear-gradient(135deg, #7C3AED, #DB2777)",
                    }}
                    className="text-white text-sm font-black px-4 py-2 rounded-xl"
                  >
                    Total: ₦
                    {completedJobs
                      .reduce((s, j) => s + Number(j.cost || 0) * 0.8, 0)
                      .toLocaleString()}
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-gray-50">
                        {["Tracking ID", "Date", "Route", "Earning"].map(
                          (h) => (
                            <th
                              key={h}
                              className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest"
                            >
                              {h}
                            </th>
                          ),
                        )}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {completedJobs.length > 0 ? (
                        completedJobs.map((job) => (
                          <tr
                            key={job.id}
                            className="hover:bg-purple-50/30 transition-colors"
                          >
                            <td className="px-6 py-4">
                              <span
                                style={{
                                  background:
                                    "linear-gradient(135deg, #F5F3FF, #EFF6FF)",
                                }}
                                className="font-black text-[#7C3AED] text-sm px-3 py-1 rounded-lg"
                              >
                                {job.tracking_id}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500">
                              {new Date(job.created_at).toLocaleDateString(
                                "en-NG",
                                { day: "numeric", month: "short" },
                              )}
                            </td>
                            <td className="px-6 py-4 text-sm font-semibold text-gray-700">
                              {job.pickup_address?.split(",")[0]} →{" "}
                              {job.delivery_address?.split(",")[0]}
                            </td>
                            <td className="px-6 py-4">
                              <span className="font-black text-[#00C853] text-base">
                                +₦{Number(job.cost * 0.8).toLocaleString()}
                              </span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan="4"
                            className="px-6 py-16 text-center text-gray-400 italic"
                          >
                            No completed deliveries yet.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <style jsx global>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
      `}</style>
    </div>
  );
}
