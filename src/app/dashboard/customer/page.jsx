"use client";
import { useState } from "react";
import {
  Package,
  Plus,
  Clock,
  CheckCircle,
  ChevronRight,
  MapPin,
  Truck,
  History,
  User,
  Bell,
  Star,
  Zap,
} from "lucide-react";
import { useUserProfile } from "@/utils/useUserProfile";
import { useQuery } from "@tanstack/react-query";
import { motion } from "motion/react";
import MyMessagesCard from "@/components/MyMessagesCard";
import PaymentModal from "@/components/PaymentModal";

const statusColors = {
  Pending: { bg: "#FFFBEB", text: "#D97706", dot: "#FBBF24" },
  Accepted: { bg: "#EFF6FF", text: "#2563EB", dot: "#60A5FA" },
  "Picked Up": { bg: "#F5F3FF", text: "#7C3AED", dot: "#A78BFA" },
  "In Transit": { bg: "#F0FDF4", text: "#059669", dot: "#34D399" },
  Delivered: { bg: "#F0FDF4", text: "#15803D", dot: "#22C55E" },
  Cancelled: { bg: "#FFF1F2", text: "#BE123C", dot: "#F87171" },
};

function StatusBadge({ status }) {
  const c = statusColors[status] || statusColors.Pending;
  return (
    <span
      style={{ backgroundColor: c.bg, color: c.text }}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-wide"
    >
      <span
        style={{ backgroundColor: c.dot }}
        className="w-1.5 h-1.5 rounded-full"
      />
      {status}
    </span>
  );
}

export default function CustomerDashboard() {
  const { data: user } = useUserProfile();
  const [activeTab, setActiveTab] = useState("active");
  const [payingDelivery, setPayingDelivery] = useState(null);

  const { data: deliveriesData, isLoading, refetch } = useQuery({
    queryKey: ["deliveries", user?.id],
    queryFn: async () => {
      const res = await fetch("/api/deliveries");
      if (!res.ok) throw new Error("Failed to fetch deliveries");
      return res.json();
    },
    enabled: !!user?.id,
  });

  const deliveries = deliveriesData?.deliveries || [];
  const activeDeliveries = deliveries.filter(
    (d) => d.status !== "Delivered" && d.status !== "Cancelled",
  );
  const completedDeliveries = deliveries.filter(
    (d) => d.status === "Delivered",
  );

  const stats = [
    {
      label: "Active Deliveries",
      value: activeDeliveries.length,
      icon: <Truck size={20} className="text-white" />,
      gradient: "linear-gradient(135deg, #0A84FF 0%, #4F46E5 100%)",
      emoji: "🚚",
    },
    {
      label: "Completed",
      value: completedDeliveries.length,
      icon: <CheckCircle size={20} className="text-white" />,
      gradient: "linear-gradient(135deg, #00C853 0%, #0891B2 100%)",
      emoji: "✅",
    },
    {
      label: "Total Spent",
      value: `₦${deliveries.reduce((s, d) => s + Number(d.cost || 0), 0).toLocaleString()}`,
      icon: <Package size={20} className="text-white" />,
      gradient: "linear-gradient(135deg, #FF6D00 0%, #DC2626 100%)",
      emoji: "💰",
    },
    {
      label: "Avg. Rating",
      value: "4.9 ⭐",
      icon: <Star size={20} className="text-white" />,
      gradient: "linear-gradient(135deg, #7C3AED 0%, #DB2777 100%)",
      emoji: "⭐",
    },
  ];

  const listToShow =
    activeTab === "active" ? activeDeliveries : completedDeliveries;

  return (
    <div
      style={{
        background: "linear-gradient(135deg, #F0F9FF 0%, #EEF2FF 100%)",
      }}
      className="min-h-screen font-poppins"
    >
      {/* ─── HEADER ─────────────────────────────────────────────────────── */}
      <div
        style={{
          background: "linear-gradient(135deg, #0A84FF 0%, #7C3AED 100%)",
        }}
        className="px-4 md:px-6 pt-8 pb-24 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3" />
        <div className="container mx-auto relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="text-white">
              <div className="flex items-center gap-2 mb-1">
                <Zap size={16} className="text-yellow-300" fill="#FDE047" />
                <span className="text-blue-200 text-sm font-semibold uppercase tracking-widest">
                  Customer Portal
                </span>
              </div>
              <h1 className="text-3xl font-black">
                Hello, {user?.name?.split(" ")[0] || "there"} 👋
              </h1>
              <p className="text-blue-200 mt-1">
                Manage your deliveries and track packages in real-time.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button className="w-10 h-10 bg-white/10 border border-white/20 rounded-xl flex items-center justify-center text-white hover:bg-white/20 transition-all">
                <Bell size={18} />
              </button>
              <a
                href="/booking"
                className="bg-yellow-400 hover:bg-yellow-300 text-gray-900 px-6 py-3 rounded-xl font-black flex items-center gap-2 transition-all shadow-lg text-sm"
              >
                <Plus size={18} /> New Delivery
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 -mt-16 pb-12 relative z-10">
        {/* ─── STATS CARDS ──────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, i) => (
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
                <div className="text-4xl">{stat.emoji}</div>
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

        {/* ─── DELIVERIES ───────────────────────────────────────────────── */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden mb-8">
          {/* Tabs */}
          <div
            style={{
              background: "linear-gradient(135deg, #F8FAFF 0%, #F3F4FF 100%)",
            }}
            className="px-6 pt-6 border-b border-gray-100"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-black text-gray-900">
                📦 My Deliveries
              </h2>
              <a
                href="/track"
                className="text-[#0A84FF] text-sm font-bold flex items-center gap-1 hover:underline"
              >
                Track All <ChevronRight size={16} />
              </a>
            </div>
            <div className="flex gap-2">
              {[
                { id: "active", label: `Active (${activeDeliveries.length})` },
                {
                  id: "completed",
                  label: `Completed (${completedDeliveries.length})`,
                },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={
                    activeTab === tab.id
                      ? {
                          background:
                            "linear-gradient(135deg, #0A84FF, #7C3AED)",
                          color: "white",
                        }
                      : {}
                  }
                  className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === tab.id ? "shadow-lg" : "text-gray-500 hover:text-gray-700 hover:bg-white"}`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="p-6">
            {isLoading ? (
              <div className="flex items-center justify-center h-40">
                <div className="text-center">
                  <div
                    style={{
                      background: "linear-gradient(135deg, #0A84FF, #7C3AED)",
                    }}
                    className="w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center"
                  >
                    <div
                      className="w-6 h-6 border-2 border-white border-t-transparent rounded-full"
                      style={{ animation: "spin 1s linear infinite" }}
                    />
                  </div>
                  <p className="text-gray-400 text-sm font-semibold">
                    Loading deliveries...
                  </p>
                </div>
              </div>
            ) : listToShow.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {listToShow.map((delivery) => (
                  <motion.div
                    key={delivery.id}
                    whileHover={{ scale: 1.01 }}
                    className="border border-gray-100 rounded-2xl p-5 hover:shadow-lg transition-all bg-gray-50/50"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <div className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">
                          Tracking ID
                        </div>
                        <div className="text-base font-black text-gray-900">
                          {delivery.tracking_id}
                        </div>
                      </div>
                      <StatusBadge status={delivery.status} />
                    </div>

                    <div className="space-y-3 relative mb-4">
                      <div className="absolute left-2.5 top-3 bottom-3 w-0.5 border-l-2 border-dashed border-gray-200" />
                      <div className="flex gap-3 relative z-10">
                        <div className="w-5 h-5 rounded-full bg-[#0A84FF] border-4 border-blue-100 shrink-0" />
                        <div>
                          <div className="text-[10px] text-gray-400 font-black">
                            Pickup
                          </div>
                          <p className="text-sm font-semibold text-gray-800 line-clamp-1">
                            {delivery.pickup_address}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-3 relative z-10">
                        <div className="w-5 h-5 rounded-full bg-[#FF6D00] border-4 border-orange-100 shrink-0" />
                        <div>
                          <div className="text-[10px] text-gray-400 font-black">
                            Delivery
                          </div>
                          <p className="text-sm font-semibold text-gray-800 line-clamp-1">
                            {delivery.delivery_address}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div>
                        <div className="text-[10px] text-gray-400 font-bold">
                          Cost
                        </div>
                        <div className="font-black text-gray-900">
                          ₦{Number(delivery.cost).toLocaleString()}
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] text-gray-400 font-bold">
                          Recipient
                        </div>
                        <div className="font-semibold text-gray-700 text-sm">
                          {delivery.receiver_name}
                        </div>
                      </div>
                      <a
                        href={`/track?id=${delivery.tracking_id}`}
                        style={{
                          background:
                            "linear-gradient(135deg, #0A84FF, #7C3AED)",
                        }}
                        className="text-white text-xs font-black px-4 py-2 rounded-xl hover:opacity-90 transition-all flex items-center gap-1.5"
                      >
                        <MapPin size={12} /> Track
                      </a>
                    </div>

                    {/* Payment — collected once the package is out for delivery */}
                    {delivery.payment_status === "Paid" ? (
                      <div className="mt-3 text-center text-xs font-black text-green-600 bg-green-50 border border-green-100 rounded-xl py-2.5">
                        ✅ Paid
                        {delivery.payment_method
                          ? ` via ${delivery.payment_method}`
                          : ""}
                      </div>
                    ) : delivery.payment_status === "Pay on Delivery" ? (
                      <div className="mt-3 text-center text-xs font-black text-amber-600 bg-amber-50 border border-amber-100 rounded-xl py-2.5">
                        💵 Pay rider ₦
                        {Number(delivery.cost).toLocaleString()} on delivery
                      </div>
                    ) : delivery.status === "In Transit" ||
                      delivery.status === "Delivered" ? (
                      <button
                        onClick={() => setPayingDelivery(delivery)}
                        style={{
                          background:
                            "linear-gradient(135deg, #7C3AED, #DB2777)",
                        }}
                        className="mt-3 w-full text-white text-sm font-black py-3 rounded-xl hover:opacity-90 transition-all"
                      >
                        💳 Your package is almost there — Pay ₦
                        {Number(delivery.cost).toLocaleString()} now
                      </button>
                    ) : (
                      <div className="mt-3 text-center text-[11px] font-bold text-gray-400 bg-gray-50 border border-gray-100 rounded-xl py-2.5">
                        💳 Payment unlocks once your package is out for
                        delivery
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">📭</div>
                <h3 className="text-xl font-black text-gray-900 mb-2">
                  {activeTab === "active"
                    ? "No Active Deliveries"
                    : "No Completed Deliveries Yet"}
                </h3>
                <p className="text-gray-500 mb-8 max-w-xs mx-auto text-sm">
                  {activeTab === "active"
                    ? "You don't have any packages in transit at the moment."
                    : "Your completed deliveries will appear here."}
                </p>
                {activeTab === "active" && (
                  <a
                    href="/booking"
                    style={{
                      background: "linear-gradient(135deg, #0A84FF, #7C3AED)",
                    }}
                    className="inline-flex items-center gap-2 text-white px-8 py-3 rounded-xl font-black hover:opacity-90 transition-all text-sm"
                  >
                    <Plus size={16} /> Book Your First Delivery
                  </a>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ─── MESSAGES & SUPPORT ───────────────────────────────────────── */}
        <MyMessagesCard userId={user?.id} />

        {/* ─── HISTORY TABLE ────────────────────────────────────────────── */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          <div
            style={{
              background: "linear-gradient(135deg, #F8FAFF 0%, #F3F4FF 100%)",
            }}
            className="px-6 py-5 border-b border-gray-100"
          >
            <h2 className="text-xl font-black text-gray-900">
              📋 Delivery History
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/70">
                  {["Tracking ID", "Date", "Recipient", "Status", "Cost"].map(
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
                {deliveries.length > 0 ? (
                  deliveries.slice(0, 7).map((d) => (
                    <tr
                      key={d.id}
                      className="hover:bg-blue-50/30 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <span
                          style={{
                            background:
                              "linear-gradient(135deg, #EFF6FF, #F5F3FF)",
                          }}
                          className="font-black text-[#0A84FF] text-sm px-3 py-1 rounded-lg"
                        >
                          {d.tracking_id}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(d.created_at).toLocaleDateString("en-NG", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-gray-800">
                        {d.receiver_name}
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={d.status} />
                      </td>
                      <td className="px-6 py-4 font-black text-gray-900">
                        ₦{Number(d.cost).toLocaleString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-6 py-16 text-center text-gray-400 italic"
                    >
                      No delivery history yet. Book your first delivery!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {payingDelivery && (
        <PaymentModal
          delivery={payingDelivery}
          onClose={() => setPayingDelivery(null)}
          onPaid={() => refetch()}
        />
      )}

      <style jsx global>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
