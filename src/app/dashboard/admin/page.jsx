"use client";
import { useState } from "react";
import {
  Users,
  Truck,
  Package,
  DollarSign,
  Activity,
  TrendingUp,
  BarChart3,
  Search,
  Filter,
  ShieldCheck,
  Zap,
  Bell,
} from "lucide-react";
import { useUserProfile } from "@/utils/useUserProfile";
import { useQuery } from "@tanstack/react-query";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { motion } from "motion/react";
import { statusColors } from "@/utils/deliveryStatus";
import ActiveRidesPanel from "@/components/ActiveRidesPanel";
import FeedbackInbox from "@/components/FeedbackInbox";
import ManageAdminsPanel from "@/components/ManageAdminsPanel";

export default function AdminDashboard() {
  const { data: user } = useUserProfile();
  const [search, setSearch] = useState("");

  const {
    data: stats,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const res = await fetch("/api/admin/stats");
      if (!res.ok) {
        if (res.status === 403) throw new Error("Forbidden: Admin access only");
        throw new Error("Failed to fetch admin stats");
      }
      return res.json();
    },
  });

  if (error) {
    return (
      <div
        style={{
          background: "linear-gradient(135deg, #FFF1F2 0%, #EFF6FF 100%)",
        }}
        className="min-h-screen flex items-center justify-center p-4 font-poppins"
      >
        <div className="max-w-md w-full bg-white p-12 rounded-3xl shadow-2xl border border-gray-100 text-center">
          <div className="text-6xl mb-6">🔒</div>
          <h1 className="text-2xl font-black text-gray-900 mb-4">
            Access Denied
          </h1>
          <p className="text-gray-500 mb-8 leading-relaxed">
            This dashboard is only accessible to system administrators. If you
            believe this is an error, please contact support.
          </p>
          <a
            href="/dashboard"
            style={{ background: "linear-gradient(135deg, #0A84FF, #7C3AED)" }}
            className="inline-block text-white px-8 py-3 rounded-xl font-black hover:opacity-90 transition-all"
          >
            Return to Dashboard
          </a>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      label: "Total Customers",
      value: stats?.customersCount || 0,
      icon: <Users size={20} className="text-white" />,
      gradient: "linear-gradient(135deg, #0A84FF 0%, #4F46E5 100%)",
      emoji: "👥",
      suffix: "",
    },
    {
      label: "Total Riders",
      value: stats?.ridersCount || 0,
      icon: <Truck size={20} className="text-white" />,
      gradient: "linear-gradient(135deg, #00C853 0%, #0891B2 100%)",
      emoji: "🏍️",
      suffix: "",
    },
    {
      label: "Active Orders",
      value: (stats?.totalDeliveries || 0) - (stats?.completedDeliveries || 0),
      icon: <Package size={20} className="text-white" />,
      gradient: "linear-gradient(135deg, #FF6D00 0%, #DC2626 100%)",
      emoji: "📦",
      suffix: "",
    },
    {
      label: "Total Revenue",
      value: `₦${Number(stats?.totalRevenue || 0).toLocaleString()}`,
      icon: <DollarSign size={20} className="text-white" />,
      gradient: "linear-gradient(135deg, #7C3AED 0%, #DB2777 100%)",
      emoji: "💰",
      suffix: "",
    },
  ];

  const filtered = (stats?.recentDeliveries || []).filter(
    (d) =>
      !search ||
      d.tracking_id?.toLowerCase().includes(search.toLowerCase()) ||
      d.customer_name?.toLowerCase().includes(search.toLowerCase()),
  );

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
          background:
            "linear-gradient(135deg, #0F172A 0%, #1E1B4B 50%, #4F46E5 100%)",
        }}
        className="px-4 md:px-6 pt-8 pb-24 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#0A84FF]/15 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl -translate-x-1/4 translate-y-1/4" />
        <div className="container mx-auto relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="text-white">
              <div className="flex items-center gap-2 mb-1">
                <ShieldCheck size={16} className="text-yellow-300" />
                <span className="text-blue-300 text-sm font-semibold uppercase tracking-widest">
                  Admin Command Center
                </span>
              </div>
              <h1 className="text-3xl font-black">DELIVA Analytics 🚀</h1>
              <p className="text-blue-300 mt-1 text-sm">
                Real-time overview of all logistics operations.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button className="w-10 h-10 bg-white/10 border border-white/20 rounded-xl flex items-center justify-center text-white hover:bg-white/20 transition-all">
                <Bell size={18} />
              </button>
              <button className="flex items-center gap-2 bg-white/10 border border-white/20 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-white/20 transition-all">
                <Activity size={16} /> System Logs
              </button>
              <button
                style={{
                  background: "linear-gradient(135deg, #0A84FF, #7C3AED)",
                }}
                className="text-white px-5 py-2.5 rounded-xl font-black text-sm hover:opacity-90 transition-all"
              >
                📊 Generate Report
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 -mt-16 pb-12 relative z-10">
        {/* ─── STATS CARDS ──────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {statCards.map((stat, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -4, scale: 1.02 }}
              className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100"
            >
              <div
                style={{ background: stat.gradient }}
                className="p-4 flex items-center gap-3"
              >
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  {stat.icon}
                </div>
                <span className="text-3xl">{stat.emoji}</span>
              </div>
              <div className="px-4 py-3">
                <div className="text-2xl font-black text-gray-900">
                  {isLoading ? "—" : stat.value}
                </div>
                <div className="text-xs text-gray-500 font-semibold">
                  {stat.label}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* ─── ACTIVE RIDES (live) ──────────────────────────────────────── */}
        <ActiveRidesPanel />

        {/* ─── CHARTS ─────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Revenue Line Chart */}
          <div className="bg-white p-6 rounded-3xl shadow-xl border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <div
                  style={{
                    background: "linear-gradient(135deg, #0A84FF, #4F46E5)",
                  }}
                  className="w-9 h-9 rounded-xl flex items-center justify-center"
                >
                  <TrendingUp size={18} className="text-white" />
                </div>
                <h3 className="text-lg font-black text-gray-900">
                  Revenue Trends
                </h3>
              </div>
              <span className="text-xs bg-blue-50 text-blue-600 font-bold px-3 py-1.5 rounded-full">
                Last 6 Months
              </span>
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={stats?.revenueTrend || []}>
                  <defs>
                    <linearGradient
                      id="blueGradient"
                      x1="0"
                      y1="0"
                      x2="1"
                      y2="0"
                    >
                      <stop offset="0%" stopColor="#0A84FF" />
                      <stop offset="100%" stopColor="#7C3AED" />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#F1F5F9"
                  />
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: "#94A3B8", fontWeight: 600 }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: "#94A3B8" }}
                    tickFormatter={(v) => `₦${v / 1000}k`}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "16px",
                      border: "none",
                      boxShadow: "0 20px 40px -10px rgba(0,0,0,0.15)",
                      fontFamily: "Poppins",
                    }}
                    formatter={(v) => [`₦${v.toLocaleString()}`, "Revenue"]}
                  />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="url(#blueGradient)"
                    strokeWidth={4}
                    dot={{
                      r: 5,
                      fill: "#0A84FF",
                      strokeWidth: 2,
                      stroke: "#fff",
                    }}
                    activeDot={{ r: 7 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Delivery Volume Bar Chart */}
          <div className="bg-white p-6 rounded-3xl shadow-xl border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <div
                  style={{
                    background: "linear-gradient(135deg, #00C853, #0891B2)",
                  }}
                  className="w-9 h-9 rounded-xl flex items-center justify-center"
                >
                  <BarChart3 size={18} className="text-white" />
                </div>
                <h3 className="text-lg font-black text-gray-900">
                  Delivery Volume
                </h3>
              </div>
              <span className="text-xs bg-green-50 text-green-600 font-bold px-3 py-1.5 rounded-full">
                Last 6 Months
              </span>
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats?.revenueTrend || []}>
                  <defs>
                    <linearGradient
                      id="greenGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="0%" stopColor="#00C853" />
                      <stop offset="100%" stopColor="#0891B2" />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#F1F5F9"
                  />
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: "#94A3B8", fontWeight: 600 }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: "#94A3B8" }}
                  />
                  <Tooltip
                    cursor={{ fill: "#F8FAFC" }}
                    contentStyle={{
                      borderRadius: "16px",
                      border: "none",
                      boxShadow: "0 20px 40px -10px rgba(0,0,0,0.15)",
                      fontFamily: "Poppins",
                    }}
                    formatter={(v) => [v, "Deliveries"]}
                  />
                  <Bar
                    dataKey="volume"
                    fill="url(#greenGradient)"
                    radius={[8, 8, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* ─── RECENT DELIVERIES TABLE ──────────────────────────────────── */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          <div
            style={{
              background: "linear-gradient(135deg, #F8FAFF 0%, #F5F3FF 100%)",
            }}
            className="px-6 py-5 border-b border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          >
            <h3 className="text-xl font-black text-gray-900">
              📋 Recent Deliveries
            </h3>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={15}
                />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search orders..."
                  className="bg-gray-50 border border-gray-100 rounded-xl py-2.5 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-[#0A84FF] font-medium"
                />
              </div>
              <button className="w-10 h-10 bg-gray-50 border border-gray-100 text-gray-500 rounded-xl flex items-center justify-center hover:bg-gray-100 transition-all">
                <Filter size={16} />
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/70">
                  {[
                    "Tracking ID",
                    "Customer",
                    "Rider",
                    "Status",
                    "Date",
                    "Cost",
                  ].map((h) => (
                    <th
                      key={h}
                      className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {isLoading ? (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-6 py-16 text-center text-gray-400"
                    >
                      Loading data...
                    </td>
                  </tr>
                ) : filtered.length > 0 ? (
                  filtered.map((d) => {
                    const sc = statusColors[d.status] || statusColors.Pending;
                    return (
                      <tr
                        key={d.id}
                        className="hover:bg-blue-50/20 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <span
                            style={{
                              background:
                                "linear-gradient(135deg, #EFF6FF, #F5F3FF)",
                            }}
                            className="font-black text-[#0A84FF] text-xs px-3 py-1.5 rounded-lg"
                          >
                            {d.tracking_id}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm font-semibold text-gray-800">
                          {d.customer_name}
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-500">
                          {d.rider_name || "—"}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            style={{ backgroundColor: sc.bg, color: sc.text }}
                            className="text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-wide"
                          >
                            {d.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {new Date(d.created_at).toLocaleDateString("en-NG", {
                            day: "numeric",
                            month: "short",
                          })}
                        </td>
                        <td className="px-6 py-4 font-black text-gray-900">
                          ₦{Number(d.cost).toLocaleString()}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-6 py-16 text-center text-gray-400 italic"
                    >
                      No deliveries found{search ? " matching your search" : ""}
                      .
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div
            style={{
              background: "linear-gradient(135deg, #F8FAFF 0%, #F5F3FF 100%)",
            }}
            className="px-6 py-4 border-t border-gray-100 text-center"
          >
            <button className="text-[#0A84FF] text-sm font-black hover:underline">
              View All Deliveries →
            </button>
          </div>
        </div>

        {/* ─── FEEDBACK & REPORTS INBOX ─────────────────────────────────── */}
        <div className="mt-8">
          <FeedbackInbox />
        </div>

        {/* ─── MANAGE ADMINS (super admin only) ─────────────────────────── */}
        {user?.role === "super_admin" && (
          <div className="mt-8">
            <ManageAdminsPanel currentUserEmail={user?.email} />
          </div>
        )}
      </div>
    </div>
  );
}
