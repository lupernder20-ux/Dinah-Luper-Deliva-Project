"use client";
import {
  Target,
  Eye,
  ShieldCheck,
  Users,
  Globe,
  Truck,
  Package,
  Star,
  ArrowRight,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";

export default function AboutPage() {
  const values = [
    {
      icon: <Target size={28} className="text-white" />,
      title: "Our Mission",
      text: "To provide the most efficient, transparent, and reliable logistics network for urban communities — making deliveries accessible to all.",
      gradient: "linear-gradient(135deg, #0A84FF 0%, #4F46E5 100%)",
      emoji: "🎯",
    },
    {
      icon: <Eye size={28} className="text-white" />,
      title: "Our Vision",
      text: "To become the leading logistics platform connecting every business and individual to reliable, tech-driven delivery services across Africa.",
      gradient: "linear-gradient(135deg, #00C853 0%, #0891B2 100%)",
      emoji: "🔭",
    },
    {
      icon: <ShieldCheck size={28} className="text-white" />,
      title: "Our Values",
      text: "Integrity, speed, and safety are at the core of everything we do at DELIVA. We treat every package like it's our own.",
      gradient: "linear-gradient(135deg, #FF6D00 0%, #DC2626 100%)",
      emoji: "💎",
    },
  ];

  const team = [
    {
      name: "Adebayo C.",
      role: "CEO & Founder",
      emoji: "👨🏾‍💼",
      color: "#0A84FF",
    },
    {
      name: "Ngozi M.",
      role: "Head of Operations",
      emoji: "👩🏽‍💼",
      color: "#7C3AED",
    },
    {
      name: "Emeka O.",
      role: "Lead Engineer",
      emoji: "👨🏿‍💻",
      color: "#00C853",
    },
    {
      name: "Fatima A.",
      role: "Head of Marketing",
      emoji: "👩🏾‍🎨",
      color: "#FF6D00",
    },
  ];

  return (
    <div className="font-poppins">
      {/* ─── HERO ──────────────────────────────────────────────────────── */}
      <section
        style={{
          background:
            "linear-gradient(135deg, #0A84FF 0%, #4F46E5 50%, #7C3AED 100%)",
        }}
        className="py-28 text-white relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -translate-x-1/3 -translate-y-1/3" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-pink-400/15 rounded-full blur-3xl translate-x-1/4 translate-y-1/4" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <span className="inline-flex items-center gap-2 bg-white/10 border border-white/20 px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <Zap size={14} className="text-yellow-300" fill="#FDE047" /> Who
              We Are
            </span>
            <h1 className="text-5xl md:text-7xl font-black mb-6">
              About <span className="text-yellow-300">DELIVA</span>
            </h1>
            <p className="text-blue-100 text-xl max-w-2xl mx-auto leading-relaxed">
              Connecting urban communities through a modern, efficient, and
              technology-driven logistics network — one package at a time.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ─── OUR STORY ─────────────────────────────────────────────────── */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              className="flex-1 space-y-6"
            >
              <span className="inline-block bg-blue-50 text-[#0A84FF] font-bold text-xs px-4 py-2 rounded-full uppercase tracking-widest">
                Our Story
              </span>
              <h2 className="text-4xl font-black text-gray-900 leading-tight">
                Empowering Communities <br />
                <span
                  style={{
                    background: "linear-gradient(135deg, #0A84FF, #7C3AED)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  Through Logistics
                </span>
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed">
                Founded in 2024, DELIVA started with a simple goal: to solve the
                "last-mile" delivery challenge in semi-urban and urban
                communities. We noticed that many small businesses and
                individuals struggled with unreliable dispatch riders and high
                costs.
              </p>
              <p className="text-gray-600 text-lg leading-relaxed">
                Today, DELIVA is a full-featured platform bridging the gap
                between senders and professional riders. We leverage
                cutting-edge technology to ensure every package is tracked and
                every delivery is successful.
              </p>
              <div className="flex flex-wrap gap-3 pt-4">
                {[
                  "Real-time Tracking",
                  "Verified Riders",
                  "Affordable Rates",
                  "24/7 Support",
                ].map((tag) => (
                  <span
                    key={tag}
                    className="bg-gray-100 text-gray-700 text-sm font-bold px-4 py-2 rounded-xl"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="flex-1 relative"
            >
              <div className="rounded-3xl overflow-hidden shadow-2xl aspect-video">
                <img
                  src="https://images.unsplash.com/photo-1580674684081-7617fbf3d745?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
                  alt="DELIVA Delivery"
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Floating stat card */}
              <div
                style={{
                  background: "linear-gradient(135deg, #0A84FF, #7C3AED)",
                }}
                className="absolute -bottom-6 -left-6 text-white p-5 rounded-2xl shadow-2xl"
              >
                <div className="text-3xl font-black">10k+</div>
                <div className="text-blue-200 text-sm font-semibold">
                  Deliveries Completed
                </div>
              </div>
              <div className="absolute -top-6 -right-6 bg-yellow-400 text-gray-900 p-5 rounded-2xl shadow-2xl">
                <div className="text-3xl font-black">4.9⭐</div>
                <div className="text-yellow-900 text-sm font-semibold">
                  Average Rating
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── VALUES ────────────────────────────────────────────────────── */}
      <section
        style={{
          background: "linear-gradient(135deg, #F0F9FF 0%, #EEF2FF 100%)",
        }}
        className="py-24"
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <span className="inline-block bg-indigo-100 text-indigo-600 font-bold text-xs px-4 py-2 rounded-full uppercase tracking-widest mb-4">
              Our Foundation
            </span>
            <h2 className="text-4xl font-black text-gray-900">
              Mission, Vision & Values
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((val, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -8, scale: 1.02 }}
                className="bg-white rounded-3xl overflow-hidden shadow-xl border border-gray-100"
              >
                <div style={{ background: val.gradient }} className="p-8">
                  <div className="text-4xl mb-3">{val.emoji}</div>
                  <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-4">
                    {val.icon}
                  </div>
                  <h3 className="text-2xl font-black text-white">
                    {val.title}
                  </h3>
                </div>
                <div className="p-8">
                  <p className="text-gray-600 leading-relaxed">{val.text}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── STATS ─────────────────────────────────────────────────────── */}
      <section
        style={{
          background: "linear-gradient(135deg, #0F172A 0%, #1E1B4B 100%)",
        }}
        className="py-24 text-white"
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-black mb-4">Our Growing Network</h2>
            <p className="text-gray-400 text-lg">
              Expanding rapidly across major urban centers
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              {
                value: "500+",
                label: "Active Riders",
                icon: "🏍️",
                color: "#0A84FF",
              },
              {
                value: "10k+",
                label: "Deliveries Done",
                icon: "📦",
                color: "#00C853",
              },
              {
                value: "50+",
                label: "Communities",
                icon: "🌍",
                color: "#FF6D00",
              },
              {
                value: "4.9/5",
                label: "Avg. Rating",
                icon: "⭐",
                color: "#7C3AED",
              },
            ].map((stat, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.05 }}
                className="text-center p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm"
              >
                <div className="text-5xl mb-4">{stat.icon}</div>
                <div
                  style={{ color: stat.color }}
                  className="text-4xl font-black mb-2"
                >
                  {stat.value}
                </div>
                <div className="text-gray-400 font-semibold text-sm uppercase tracking-widest">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TEAM ──────────────────────────────────────────────────────── */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <span className="inline-block bg-purple-50 text-purple-600 font-bold text-xs px-4 py-2 rounded-full uppercase tracking-widest mb-4">
              The Team
            </span>
            <h2 className="text-4xl font-black text-gray-900">
              Meet the People Behind DELIVA
            </h2>
            <p className="text-gray-500 mt-3">
              A passionate team committed to transforming logistics in Africa.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto">
            {team.map((member, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -8 }}
                className="text-center"
              >
                <div
                  style={{ backgroundColor: member.color + "18" }}
                  className="w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-4 text-5xl"
                >
                  {member.emoji}
                </div>
                <div style={{ color: member.color }} className="font-black">
                  {member.name}
                </div>
                <div className="text-gray-500 text-sm">{member.role}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ────────────────────────────────────────────────────────── */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div
            style={{
              background: "linear-gradient(135deg, #0A84FF 0%, #7C3AED 100%)",
            }}
            className="rounded-3xl p-12 text-center text-white relative overflow-hidden"
          >
            <div
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage:
                  "radial-gradient(circle, white 1px, transparent 1px)",
                backgroundSize: "28px 28px",
              }}
            />
            <div className="relative z-10">
              <h2 className="text-4xl font-black mb-4">
                Ready to Experience DELIVA?
              </h2>
              <p className="text-blue-100 text-lg mb-8 max-w-xl mx-auto">
                Book your first delivery today and see why thousands trust us
                with their packages.
              </p>
              <a
                href="/booking"
                className="inline-flex items-center gap-2 bg-yellow-400 hover:bg-yellow-300 text-gray-900 px-10 py-4 rounded-2xl font-black transition-all text-lg"
              >
                📦 Send a Package <ArrowRight size={20} />
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
