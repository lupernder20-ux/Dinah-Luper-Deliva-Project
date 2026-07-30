"use client";
import { useState } from "react";
import {
  Package,
  Truck,
  Shield,
  Clock,
  MapPin,
  Search,
  ArrowRight,
  Star,
  CheckCircle2,
  Zap,
  Users,
  Globe,
  TrendingUp,
} from "lucide-react";
import { motion } from "motion/react";

export default function HomePage() {
  const [trackingId, setTrackingId] = useState("");
  const [weight, setWeight] = useState(2);
  const [priority, setPriority] = useState("Normal");
  const [distance, setDistance] = useState(5);

  const calculateCost = () => {
    const baseFare = 500;
    const distanceRate = 100 * distance;
    let weightRate = 200;
    if (weight > 10) weightRate = 800;
    else if (weight > 5) weightRate = 400;
    const priorityCharge = priority === "Express" ? 1000 : 0;
    return baseFare + distanceRate + weightRate + priorityCharge;
  };

  const services = [
    {
      icon: <Clock size={28} className="text-white" />,
      title: "Same-Day Delivery",
      desc: "Fast package delivery within hours across the city.",
      gradient: "linear-gradient(160deg, #0A84FF 0%, #1D4ED8 100%)",
      badge: "Most Popular",
    },
    {
      icon: <Truck size={28} className="text-white" />,
      title: "Business Logistics",
      desc: "Scale your business with our reliable delivery support.",
      gradient: "linear-gradient(160deg, #059669 0%, #0891B2 100%)",
      badge: null,
    },
    {
      icon: <Shield size={28} className="text-white" />,
      title: "Secure Documents",
      desc: "Safe and confidential transport for sensitive papers.",
      gradient: "linear-gradient(160deg, #EA580C 0%, #B91C1C 100%)",
      badge: null,
    },
    {
      icon: <Package size={28} className="text-white" />,
      title: "Bulk Delivery",
      desc: "Move multiple packages efficiently at great rates.",
      gradient: "linear-gradient(160deg, #6D28D9 0%, #4338CA 100%)",
      badge: null,
    },
  ];

  const stats = [
    {
      value: "1,200+",
      label: "Happy Customers",
      icon: <Users size={22} />,
      color: "#0A84FF",
    },
    {
      value: "500+",
      label: "Active Riders",
      icon: <Truck size={22} />,
      color: "#00C853",
    },
    {
      value: "10k+",
      label: "Deliveries Done",
      icon: <Package size={22} />,
      color: "#FF6D00",
    },
    {
      value: "4.9★",
      label: "Average Rating",
      icon: <Star size={22} />,
      color: "#7C3AED",
    },
  ];

  return (
    <div className="font-poppins">
      {/* ─── HERO ─────────────────────────────────────────────────────── */}
      <section
        style={{
          background: "linear-gradient(160deg, #0A84FF 0%, #1D4ED8 100%)",
        }}
        className="relative overflow-hidden py-24 lg:py-36 text-white"
      >
        {/* Decorative blobs */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-3xl translate-x-1/3 translate-y-1/3 pointer-events-none" />

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            {/* Left */}
            <div className="flex-1 space-y-8 text-center lg:text-left">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
              >
                <span className="inline-flex items-center gap-2 bg-white/15 border border-white/20 px-4 py-2 rounded-full text-sm font-semibold mb-6 backdrop-blur-sm">
                  <Zap size={14} className="text-yellow-300" fill="#FDE047" />{" "}
                  #1 Delivery Platform in Your City
                </span>
                <h1 className="text-5xl lg:text-7xl font-black leading-tight">
                  Fast, Reliable &{" "}
                  <span className="text-yellow-300">Affordable</span> <br />
                  Deliveries
                </h1>
                <p className="mt-6 text-xl text-blue-100 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                  Connecting businesses and individuals to trusted dispatch
                  riders across urban communities. Your package, our priority.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start"
              >
                <a
                  href="/booking"
                  className="w-full sm:w-auto bg-yellow-400 hover:bg-yellow-300 text-gray-900 px-8 py-4 rounded-2xl font-black text-lg transition-all shadow-2xl flex items-center justify-center gap-2"
                >
                  Send Package <ArrowRight size={20} />
                </a>
                <a
                  href="/account/signup"
                  className="w-full sm:w-auto bg-white/10 hover:bg-white/20 backdrop-blur border border-white/30 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-2"
                >
                  Become a Rider
                </a>
              </motion.div>

              <div className="flex items-center gap-6 justify-center lg:justify-start">
                <div className="flex -space-x-3">
                  {["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4"].map((c, i) => (
                    <div
                      key={i}
                      style={{ backgroundColor: c }}
                      className="w-10 h-10 rounded-full border-2 border-white flex items-center justify-center text-xs font-black text-white"
                    >
                      {String.fromCharCode(65 + i)}
                    </div>
                  ))}
                </div>
                <div className="text-sm text-blue-100">
                  <span className="font-black text-white">1,200+</span> happy
                  customers this month
                </div>
              </div>
            </div>

            {/* Right – Mock delivery card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="flex-1 w-full max-w-md mx-auto lg:mx-0"
            >
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-2xl">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-yellow-400 rounded-xl flex items-center justify-center">
                      <Truck size={20} className="text-gray-900" />
                    </div>
                    <div>
                      <div className="font-black text-white">
                        Rider: James K.
                      </div>
                      <div className="text-xs text-green-300 font-bold flex items-center gap-1">
                        <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />{" "}
                        IN TRANSIT
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-blue-200">ETA</div>
                    <div className="font-black text-white text-lg">12 mins</div>
                  </div>
                </div>

                <div className="space-y-4 relative mb-6">
                  <div className="absolute left-3 top-4 bottom-4 w-0.5 bg-white/20 border-l-2 border-dashed border-white/30" />
                  <div className="flex gap-4 relative z-10">
                    <div className="w-6 h-6 rounded-full bg-yellow-400 border-4 border-yellow-200/30 shrink-0" />
                    <div>
                      <div className="text-[10px] text-blue-200 font-bold uppercase tracking-widest">
                        Pickup
                      </div>
                      <div className="text-sm font-semibold text-white">
                        12 Main Street, City Center
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-4 relative z-10">
                    <div className="w-6 h-6 rounded-full bg-green-400 border-4 border-green-200/30 shrink-0" />
                    <div>
                      <div className="text-[10px] text-blue-200 font-bold uppercase tracking-widest">
                        Delivery
                      </div>
                      <div className="text-sm font-semibold text-white">
                        88 Park Avenue, Heights
                      </div>
                    </div>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-xs text-blue-200 mb-2 font-semibold">
                    <span>Progress</span>
                    <span>65%</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div
                      style={{
                        width: "65%",
                        background: "linear-gradient(90deg, #FBBF24, #34D399)",
                      }}
                      className="h-2 rounded-full"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 mt-4">
                  {[
                    { label: "Tracking", value: "DL-882", color: "#FBBF24" },
                    { label: "Weight", value: "2.3kg", color: "#34D399" },
                    { label: "Cost", value: "₦1,200", color: "#A78BFA" },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="bg-white/10 rounded-xl p-3 text-center"
                    >
                      <div
                        style={{ color: item.color }}
                        className="font-black text-sm"
                      >
                        {item.value}
                      </div>
                      <div className="text-[10px] text-blue-200 mt-0.5">
                        {item.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── STATS STRIP ────────────────────────────────────────────────── */}
      <section className="py-10 bg-white border-b border-gray-100">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((s, i) => (
              <div
                key={i}
                className="flex items-center gap-4 justify-center md:justify-start"
              >
                <div
                  style={{ backgroundColor: s.color + "18", color: s.color }}
                  className="w-12 h-12 rounded-2xl flex items-center justify-center"
                >
                  {s.icon}
                </div>
                <div>
                  <div
                    style={{ color: s.color }}
                    className="text-2xl font-black"
                  >
                    {s.value}
                  </div>
                  <div className="text-xs text-gray-500 font-semibold">
                    {s.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── QUICK TRACKING ──────────────────────────────────────────────── */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center mb-8">
            <h2 className="text-2xl font-black text-gray-900">
              Track Your Package
            </h2>
            <p className="text-gray-500 mt-2">
              Enter your tracking ID below for real-time status updates
            </p>
          </div>
          <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-3 flex flex-col sm:flex-row gap-3 border border-gray-100">
            <div className="flex-1 relative">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                value={trackingId}
                onChange={(e) => setTrackingId(e.target.value)}
                placeholder="Enter Tracking ID e.g. DL-123-ABC"
                className="w-full bg-gray-50 rounded-xl py-4 pl-12 pr-4 outline-none focus:ring-2 focus:ring-[#0A84FF] transition-all text-sm font-medium border border-transparent"
              />
            </div>
            <a
              href={`/track?id=${trackingId}`}
              className="text-white px-8 py-4 rounded-xl font-black hover:opacity-90 transition-all text-center text-sm whitespace-nowrap bg-[#0A84FF]"
            >
              Track Package
            </a>
          </div>
        </div>
      </section>

      {/* ─── SERVICES ────────────────────────────────────────────────────── */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <div className="max-w-2xl mx-auto mb-14">
            <span className="inline-block bg-blue-50 text-[#0A84FF] font-bold text-xs px-4 py-2 rounded-full uppercase tracking-widest mb-4">
              Our Services
            </span>
            <h2 className="text-4xl font-black text-gray-900 mb-4">
              Logistics Solutions for Everyone
            </h2>
            <p className="text-gray-500 text-lg">
              Comprehensive delivery services tailored to individuals and
              businesses.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="relative rounded-3xl overflow-hidden shadow-lg cursor-pointer group"
              >
                <div
                  style={{ background: service.gradient }}
                  className="p-8 text-left h-full"
                >
                  {service.badge && (
                    <span className="absolute top-4 right-4 bg-yellow-400 text-gray-900 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest">
                      {service.badge}
                    </span>
                  )}
                  <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mb-6">
                    {service.icon}
                  </div>
                  <h3 className="text-xl font-black text-white mb-3">
                    {service.title}
                  </h3>
                  <p className="text-white/80 text-sm leading-relaxed">
                    {service.desc}
                  </p>
                  <div className="mt-6 flex items-center gap-2 text-white/70 text-sm font-bold group-hover:text-white transition-colors">
                    Learn more <ArrowRight size={14} />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ────────────────────────────────────────────────── */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-14">
            <span className="inline-block bg-indigo-100 text-indigo-600 font-bold text-xs px-4 py-2 rounded-full uppercase tracking-widest mb-4">
              How It Works
            </span>
            <h2 className="text-4xl font-black text-gray-900">
              Ship in 3 Simple Steps
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto relative">
            <div className="hidden md:block absolute top-10 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-blue-300 to-purple-300 -z-0" />
            {[
              {
                step: "01",
                title: "Book a Delivery",
                desc: "Fill in the pickup & delivery details online in under 2 minutes.",
                color: "#0A84FF",
                bg: "#EFF6FF",
              },
              {
                step: "02",
                title: "Rider Picks Up",
                desc: "A verified dispatch rider is assigned and heads to your location.",
                color: "#7C3AED",
                bg: "#F5F3FF",
              },
              {
                step: "03",
                title: "Package Delivered",
                desc: "Track in real-time and get notified once your package is delivered.",
                color: "#00C853",
                bg: "#F0FDF4",
              },
            ].map((step, i) => (
              <div
                key={i}
                className="relative z-10 bg-white rounded-3xl p-8 shadow-xl border border-gray-100 text-center"
              >
                <div
                  style={{ backgroundColor: step.bg, color: step.color }}
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 text-2xl font-black"
                >
                  {step.step}
                </div>
                <h3 className="text-xl font-black mb-3 text-gray-900">
                  {step.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PRICING CALCULATOR ──────────────────────────────────────────── */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="flex-1">
              <span className="inline-block bg-orange-50 text-[#FF6D00] font-bold text-xs px-4 py-2 rounded-full uppercase tracking-widest mb-6">
                Pricing
              </span>
              <h2 className="text-4xl font-black mb-6 text-gray-900">
                Transparent{" "}
                <span
                  style={{
                    background: "linear-gradient(135deg, #FF6D00, #DC2626)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  Pricing
                </span>
              </h2>
              <p className="text-gray-600 text-lg mb-10 leading-relaxed">
                No hidden fees. Calculate your delivery cost instantly based on
                distance, weight, and priority.
              </p>
              <div className="space-y-4">
                {[
                  { label: "Base Fare: ₦500", color: "#0A84FF" },
                  { label: "Distance: ₦100 per km", color: "#7C3AED" },
                  { label: "Professional verified riders", color: "#00C853" },
                  {
                    label: "Real-time GPS tracking included",
                    color: "#FF6D00",
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 text-gray-700 font-semibold"
                  >
                    <div
                      style={{ backgroundColor: item.color }}
                      className="w-6 h-6 rounded-full flex items-center justify-center"
                    >
                      <CheckCircle2 size={14} className="text-white" />
                    </div>
                    {item.label}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex-1 w-full">
              <div
                style={{
                  background:
                    "linear-gradient(135deg, #1E1B4B 0%, #0F172A 100%)",
                }}
                className="rounded-3xl p-8 lg:p-10 shadow-2xl text-white"
              >
                <h3 className="text-2xl font-black mb-8 text-center">
                  💰 Cost Estimator
                </h3>
                <div className="space-y-7">
                  <div>
                    <label className="block text-sm font-bold text-blue-200 mb-2">
                      Distance (km)
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="100"
                      value={distance}
                      onChange={(e) => setDistance(parseInt(e.target.value))}
                      className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-yellow-400"
                    />
                    <div className="flex justify-between text-xs text-gray-400 mt-2">
                      <span>1km</span>
                      <span className="font-black text-yellow-400">
                        {distance} km
                      </span>
                      <span>100km</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-blue-200 mb-3">
                      Weight (kg)
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { val: 2, label: "0–5 kg" },
                        { val: 7, label: "6–10 kg" },
                        { val: 15, label: "10+ kg" },
                      ].map((w) => {
                        const active =
                          (w.val === 2 && weight <= 5) ||
                          (w.val === 7 && weight > 5 && weight <= 10) ||
                          (w.val === 15 && weight > 10);
                        return (
                          <button
                            key={w.val}
                            onClick={() => setWeight(w.val)}
                            className={`py-3 rounded-xl text-sm font-black transition-all ${active ? "bg-yellow-400 text-gray-900" : "bg-white/10 text-gray-300 hover:bg-white/20"}`}
                          >
                            {w.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-blue-200 mb-3">
                      Priority
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {["Normal", "Express"].map((p) => (
                        <button
                          key={p}
                          onClick={() => setPriority(p)}
                          className={`py-3 rounded-xl text-sm font-black transition-all ${priority === p ? "bg-gradient-to-r from-[#0A84FF] to-[#7C3AED] text-white" : "bg-white/10 text-gray-300 hover:bg-white/20"}`}
                        >
                          {p === "Express" ? "⚡ " : "🚚 "}
                          {p}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="pt-6 border-t border-white/10 text-center">
                    <div className="text-xs text-gray-400 uppercase tracking-widest font-bold mb-3">
                      Estimated Total
                    </div>
                    <div
                      style={{
                        background: "linear-gradient(135deg, #FBBF24, #F59E0B)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                      }}
                      className="text-6xl font-black"
                    >
                      ₦{calculateCost().toLocaleString()}
                    </div>
                    <a
                      href="/booking"
                      style={{
                        background: "linear-gradient(135deg, #0A84FF, #7C3AED)",
                      }}
                      className="inline-flex items-center gap-2 mt-6 text-white px-8 py-3 rounded-xl font-black hover:opacity-90 transition-all text-sm"
                    >
                      Book This Delivery <ArrowRight size={16} />
                    </a>
                    <p className="text-xs text-gray-500 mt-4">
                      *Final cost may vary based on actual distance & traffic.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS ────────────────────────────────────────────────── */}
      <section
        style={{
          background: "linear-gradient(160deg, #0F172A 0%, #1E293B 100%)",
        }}
        className="py-24 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-72 h-72 bg-white/3 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="text-center mb-14">
            <span className="inline-block bg-white/10 border border-white/20 text-white font-bold text-xs px-4 py-2 rounded-full uppercase tracking-widest mb-4">
              Testimonials
            </span>
            <h2 className="text-4xl font-black text-white mb-4">
              Trusted by Thousands
            </h2>
            <p className="text-gray-400">
              See what our customers are saying about DELIVA
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: "Sarah J.",
                role: "Online Vendor",
                emoji: "👩🏽‍💼",
                text: "DELIVA has completely transformed how I deliver my products. Same-day delivery is a total game changer for my business!",
              },
              {
                name: "Michael O.",
                role: "Small Business Owner",
                emoji: "👨🏾‍💻",
                text: "Reliable riders and easy tracking. The pricing is also very transparent. I recommend DELIVA to all my business partners.",
              },
              {
                name: "Amaka E.",
                role: "Individual User",
                emoji: "👩🏾‍🎓",
                text: "Sent a document across town and it arrived in under 45 minutes. Super fast, professional, and affordable. 10/10!",
              },
            ].map((test, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -6 }}
                className="bg-white/10 backdrop-blur-md p-8 rounded-3xl border border-white/20"
              >
                <div className="flex gap-1 text-yellow-400 mb-5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} size={16} fill="currentColor" />
                  ))}
                </div>
                <p className="text-white text-base leading-relaxed mb-6 italic">
                  "{test.text}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-lg">
                    {test.emoji}
                  </div>
                  <div>
                    <div className="font-black text-white text-sm">
                      {test.name}
                    </div>
                    <div className="text-xs text-blue-200">{test.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FINAL CTA ───────────────────────────────────────────────────── */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="relative rounded-3xl overflow-hidden shadow-2xl">
            <div
              style={{
                background: "linear-gradient(160deg, #1D4ED8 0%, #0A84FF 100%)",
              }}
              className="p-12 lg:p-20 text-center text-white"
            >
              <div
                className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage:
                    "radial-gradient(circle, white 1px, transparent 1px)",
                  backgroundSize: "30px 30px",
                }}
              />
              <div className="relative z-10">
                <span className="inline-block bg-white/20 border border-white/30 px-4 py-2 rounded-full text-sm font-bold mb-6">
                  🚀 Ready to Get Started?
                </span>
                <h2 className="text-4xl lg:text-6xl font-black mb-6">
                  Send Your First Package <br />
                  with DELIVA Today!
                </h2>
                <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
                  Join thousands of satisfied users and experience the fastest,
                  most reliable delivery service in your city.
                </p>
                <div className="flex flex-col sm:flex-row items-center gap-4 justify-center">
                  <a
                    href="/booking"
                    className="w-full sm:w-auto bg-white text-gray-900 px-10 py-5 rounded-2xl font-black text-lg hover:bg-gray-100 transition-all"
                  >
                    📦 Book a Delivery
                  </a>
                  <a
                    href="/contact"
                    className="w-full sm:w-auto bg-white/15 border border-white/30 text-white px-10 py-5 rounded-2xl font-black text-lg hover:bg-white/25 transition-all"
                  >
                    💬 Contact Us
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
