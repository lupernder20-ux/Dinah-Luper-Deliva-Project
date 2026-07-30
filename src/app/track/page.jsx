"use client";
import { useState, useEffect } from "react";
import {
  Search,
  MapPin,
  Truck,
  CheckCircle,
  Clock,
  Package,
  Phone,
  User,
  AlertCircle,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";

const STATUSES = [
  {
    label: "Pending",
    icon: "⏳",
    gradient: "linear-gradient(135deg, #F59E0B, #D97706)",
    desc: "Your request has been placed and awaiting pickup.",
  },
  {
    label: "Accepted",
    icon: "✅",
    gradient: "linear-gradient(135deg, #0A84FF, #4F46E5)",
    desc: "A dispatch rider has been assigned to your package.",
  },
  {
    label: "Picked Up",
    icon: "📦",
    gradient: "linear-gradient(135deg, #FF6D00, #DC2626)",
    desc: "Your package has been collected from the sender.",
  },
  {
    label: "In Transit",
    icon: "🚴",
    gradient: "linear-gradient(135deg, #7C3AED, #DB2777)",
    desc: "Your package is on the way to the destination.",
  },
  {
    label: "Delivered",
    icon: "🎉",
    gradient: "linear-gradient(135deg, #00C853, #0891B2)",
    desc: "Your package has been successfully delivered!",
  },
];

export default function TrackPage() {
  const [trackingId, setTrackingId] = useState("");
  const [delivery, setDelivery] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const id = new URLSearchParams(window.location.search).get("id");
      if (id) {
        setTrackingId(id);
        handleTrack(id);
      }
    }
  }, []);

  const handleTrack = async (id) => {
    const searchId = id || trackingId;
    if (!searchId) return;
    setLoading(true);
    setError(null);
    setDelivery(null);
    try {
      const res = await fetch(`/api/deliveries/track?id=${searchId}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Delivery not found");
      setDelivery(data.delivery);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const currentStatusIndex = delivery
    ? STATUSES.findIndex((s) => s.label === delivery.status)
    : -1;

  return (
    <div className="font-poppins">
      {/* ─── HERO ──────────────────────────────────────────────────── */}
      <section
        style={{
          background:
            "linear-gradient(135deg, #0F172A 0%, #1E1B4B 50%, #4F46E5 100%)",
        }}
        className="py-24 text-white relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#0A84FF]/15 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/15 rounded-full blur-3xl -translate-x-1/4 translate-y-1/4" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <span className="inline-flex items-center gap-2 bg-white/10 border border-white/20 px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <Zap size={14} className="text-yellow-300" fill="#FDE047" />{" "}
              Real-Time Tracking
            </span>
            <h1 className="text-5xl md:text-6xl font-black mb-5">
              Track Your <span className="text-yellow-300">Package</span>
            </h1>
            <p className="text-blue-200 text-lg max-w-xl mx-auto mb-10">
              Enter your tracking ID for live updates on your delivery status.
            </p>

            {/* Search Box */}
            <div className="max-w-2xl mx-auto bg-white/10 backdrop-blur border border-white/20 rounded-2xl p-3 flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <Search
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-300"
                  size={20}
                />
                <input
                  type="text"
                  value={trackingId}
                  onChange={(e) => setTrackingId(e.target.value.toUpperCase())}
                  onKeyDown={(e) => e.key === "Enter" && handleTrack()}
                  placeholder="Enter Tracking ID (e.g. DL-123-ABC)"
                  className="w-full bg-white/10 text-white placeholder-blue-300 rounded-xl py-4 pl-12 pr-4 outline-none focus:bg-white/20 transition-all font-medium text-sm border border-white/10"
                />
              </div>
              <button
                onClick={() => handleTrack()}
                disabled={loading}
                style={{
                  background: "linear-gradient(135deg, #FBBF24, #F59E0B)",
                }}
                className="text-gray-900 font-black px-10 py-4 rounded-xl hover:opacity-90 transition-all disabled:opacity-50 whitespace-nowrap text-sm"
              >
                {loading ? "Searching..." : "🔍 Track Now"}
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── RESULTS ───────────────────────────────────────────────── */}
      <section
        style={{
          background: "linear-gradient(135deg, #F0F9FF 0%, #F5F3FF 100%)",
        }}
        className="py-16 min-h-[40vh]"
      >
        <div className="container mx-auto px-4">
          {loading && (
            <div className="flex flex-col items-center justify-center py-20">
              <div
                style={{
                  background: "linear-gradient(135deg, #0A84FF, #7C3AED)",
                }}
                className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 shadow-2xl"
              >
                <div
                  className="w-8 h-8 border-3 border-white border-t-transparent rounded-full"
                  style={{ animation: "spin 1s linear infinite" }}
                />
              </div>
              <p className="text-gray-500 font-bold">
                Searching for your package...
              </p>
            </div>
          )}

          {error && !loading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-md mx-auto"
            >
              <div className="bg-white rounded-3xl shadow-2xl p-10 text-center border border-red-100">
                <div className="text-6xl mb-4">😕</div>
                <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <AlertCircle size={28} className="text-red-500" />
                </div>
                <h3 className="text-xl font-black text-gray-900 mb-2">
                  Delivery Not Found
                </h3>
                <p className="text-gray-500 text-sm">{error}</p>
                <p className="text-gray-400 text-xs mt-3">
                  Double-check your tracking ID and try again.
                </p>
              </div>
            </motion.div>
          )}

          {!loading && !error && !delivery && (
            <div className="text-center py-16">
              <div className="text-7xl mb-6">📦</div>
              <h3 className="text-2xl font-black text-gray-700 mb-2">
                Enter a Tracking ID
              </h3>
              <p className="text-gray-400 text-sm">
                Your tracking ID looks like:{" "}
                <span className="font-black text-[#0A84FF]">DL-XXXXXX</span>
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 max-w-lg mx-auto mt-10">
                {[
                  {
                    icon: "🔍",
                    title: "Search",
                    desc: "Enter your tracking ID above",
                  },
                  {
                    icon: "📊",
                    title: "Live Status",
                    desc: "See real-time delivery progress",
                  },
                  {
                    icon: "📞",
                    title: "Contact Rider",
                    desc: "Call your assigned rider directly",
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 text-center"
                  >
                    <div className="text-3xl mb-2">{item.icon}</div>
                    <div className="font-black text-gray-800 text-sm">
                      {item.title}
                    </div>
                    <div className="text-gray-400 text-xs mt-1">
                      {item.desc}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {delivery && !loading && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="max-w-5xl mx-auto">
                {/* Header card */}
                <div
                  style={{
                    background:
                      "linear-gradient(135deg, #0A84FF 0%, #7C3AED 100%)",
                  }}
                  className="rounded-3xl p-6 mb-6 text-white relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl translate-x-1/2 -translate-y-1/2" />
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative z-10">
                    <div>
                      <div className="text-blue-200 text-xs font-black uppercase tracking-widest mb-1">
                        Tracking ID
                      </div>
                      <div className="text-2xl font-black">
                        {delivery.tracking_id}
                      </div>
                    </div>
                    <div className="bg-white/15 border border-white/20 backdrop-blur px-5 py-3 rounded-2xl">
                      <div className="text-blue-200 text-xs font-black uppercase tracking-widest mb-1">
                        Current Status
                      </div>
                      <div className="text-xl font-black">
                        {STATUSES[currentStatusIndex]?.icon} {delivery.status}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-blue-200 text-xs font-black uppercase tracking-widest mb-1">
                        Cost
                      </div>
                      <div className="text-xl font-black">
                        ₦{Number(delivery.cost).toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Timeline */}
                  <div className="lg:col-span-2 bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
                    <div
                      style={{
                        background:
                          "linear-gradient(135deg, #F8FAFF 0%, #F5F3FF 100%)",
                      }}
                      className="px-6 py-5 border-b border-gray-100"
                    >
                      <h3 className="font-black text-gray-900 text-lg">
                        🗺️ Delivery Timeline
                      </h3>
                    </div>
                    <div className="p-6 space-y-4">
                      {STATUSES.map((status, index) => {
                        const isCompleted = index <= currentStatusIndex;
                        const isCurrent = index === currentStatusIndex;
                        return (
                          <div
                            key={index}
                            className={`flex gap-4 p-4 rounded-2xl transition-all ${isCurrent ? "bg-blue-50 border-2 border-blue-200" : isCompleted ? "bg-gray-50" : "opacity-40"}`}
                          >
                            <div
                              style={
                                isCompleted
                                  ? { background: status.gradient }
                                  : {}
                              }
                              className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0 transition-all ${isCompleted ? "shadow-lg" : "bg-gray-100"}`}
                            >
                              {isCompleted ? status.icon : "○"}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <h4
                                  className={`font-black text-base ${isCompleted ? "text-gray-900" : "text-gray-400"}`}
                                >
                                  {status.label}
                                </h4>
                                {isCurrent && (
                                  <span className="text-[10px] bg-blue-500 text-white font-black px-2.5 py-0.5 rounded-full uppercase tracking-wide">
                                    CURRENT
                                  </span>
                                )}
                                {isCompleted && !isCurrent && (
                                  <span className="text-[10px] bg-green-100 text-green-600 font-black px-2.5 py-0.5 rounded-full uppercase tracking-wide">
                                    DONE ✓
                                  </span>
                                )}
                              </div>
                              <p
                                className={`text-sm mt-1 ${isCompleted ? "text-gray-500" : "text-gray-300"}`}
                              >
                                {status.desc}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Pickup → Delivery */}
                    <div className="border-t border-gray-100 p-6">
                      <div className="grid grid-cols-2 gap-6">
                        <div className="bg-blue-50 rounded-2xl p-4">
                          <div className="text-xs text-[#0A84FF] font-black uppercase tracking-widest mb-2">
                            📤 From
                          </div>
                          <div className="font-black text-gray-900">
                            {delivery.sender_name}
                          </div>
                          <div className="text-sm text-gray-500 mt-1 leading-relaxed">
                            {delivery.pickup_address}
                          </div>
                        </div>
                        <div className="bg-orange-50 rounded-2xl p-4">
                          <div className="text-xs text-[#FF6D00] font-black uppercase tracking-widest mb-2">
                            📥 To
                          </div>
                          <div className="font-black text-gray-900">
                            {delivery.receiver_name}
                          </div>
                          <div className="text-sm text-gray-500 mt-1 leading-relaxed">
                            {delivery.delivery_address}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Sidebar */}
                  <div className="space-y-5">
                    {/* Map sim */}
                    <div
                      style={{
                        background:
                          "linear-gradient(135deg, #0A84FF10, #7C3AED10)",
                      }}
                      className="rounded-3xl h-52 relative overflow-hidden border border-blue-100 shadow-lg"
                    >
                      <div className="absolute inset-0 flex items-center justify-center">
                        <motion.div
                          animate={{ y: [-8, 8, -8] }}
                          transition={{
                            repeat: Infinity,
                            duration: 2.5,
                            ease: "easeInOut",
                          }}
                        >
                          <div
                            style={{
                              background:
                                "linear-gradient(135deg, #0A84FF, #7C3AED)",
                            }}
                            className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-2xl"
                          >
                            <Truck size={28} className="text-white" />
                          </div>
                        </motion.div>
                      </div>
                      <div className="absolute bottom-3 left-3 right-3">
                        <div className="bg-white/90 backdrop-blur rounded-xl p-3 flex items-center gap-2 border border-white/50">
                          <div
                            className="w-2 h-2 bg-green-500 rounded-full"
                            style={{
                              animation: "blink 1s ease-in-out infinite",
                            }}
                          />
                          <span className="text-xs font-black text-gray-700">
                            Rider Live Location
                          </span>
                          <span className="ml-auto text-xs font-bold text-[#0A84FF]">
                            ~12 mins
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Rider */}
                    <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-5">
                      <div className="text-xs text-gray-400 font-black uppercase tracking-widest mb-4">
                        🏍️ Assigned Rider
                      </div>
                      {delivery.rider_name ? (
                        <div className="flex items-center gap-3">
                          <div
                            style={{
                              background:
                                "linear-gradient(135deg, #00C853, #0891B2)",
                            }}
                            className="w-12 h-12 rounded-2xl flex items-center justify-center text-white"
                          >
                            <User size={20} />
                          </div>
                          <div className="flex-1">
                            <div className="font-black text-gray-900">
                              {delivery.rider_name}
                            </div>
                            <div className="text-xs text-gray-500 mt-0.5">
                              {delivery.rider_phone}
                            </div>
                          </div>
                          <a
                            href={`tel:${delivery.rider_phone}`}
                            style={{
                              background:
                                "linear-gradient(135deg, #00C853, #0891B2)",
                            }}
                            className="w-10 h-10 text-white rounded-xl flex items-center justify-center hover:opacity-90 transition-all"
                          >
                            <Phone size={16} />
                          </a>
                        </div>
                      ) : (
                        <div className="text-center py-4">
                          <div className="text-3xl mb-2">⏳</div>
                          <div className="text-sm text-gray-400 italic">
                            Waiting for rider assignment...
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Package Info */}
                    <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-5">
                      <div className="text-xs text-gray-400 font-black uppercase tracking-widest mb-4">
                        📦 Package Info
                      </div>
                      <div className="space-y-3">
                        {[
                          { label: "Type", value: delivery.package_type },
                          { label: "Weight", value: `${delivery.weight} kg` },
                          {
                            label: "Priority",
                            value: delivery.priority,
                            special: delivery.priority === "Express",
                          },
                        ].map((item, i) => (
                          <div
                            key={i}
                            className="flex justify-between items-center text-sm"
                          >
                            <span className="text-gray-500 font-semibold">
                              {item.label}
                            </span>
                            <span
                              style={
                                item.special
                                  ? {
                                      background:
                                        "linear-gradient(135deg, #FF6D00, #DC2626)",
                                      WebkitBackgroundClip: "text",
                                      WebkitTextFillColor: "transparent",
                                    }
                                  : {}
                              }
                              className="font-black text-gray-900"
                            >
                              {item.value}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      <style jsx global>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
      `}</style>
    </div>
  );
}
