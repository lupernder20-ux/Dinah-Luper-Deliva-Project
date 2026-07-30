"use client";
import {
  Clock,
  Truck,
  Shield,
  Package,
  Utensils,
  FileText,
  CheckCircle2,
  ArrowRight,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";

export default function ServicesPage() {
  const services = [
    {
      icon: <Clock size={36} className="text-white" />,
      title: "Same-Day Delivery",
      desc: "Fast and reliable delivery within hours. Perfect for urgent packages that need to get across town quickly.",
      features: [
        "3-hour delivery window",
        "Real-time tracking",
        "Dedicated riders",
      ],
      gradient: "linear-gradient(135deg, #0A84FF 0%, #4F46E5 100%)",
      lightBg: "#EFF6FF",
      lightText: "#0A84FF",
      badge: "⚡ Most Popular",
    },
    {
      icon: <Truck size={36} className="text-white" />,
      title: "Business Logistics",
      desc: "Comprehensive delivery solutions for small businesses and e-commerce vendors looking to scale operations.",
      features: [
        "Bulk discounts available",
        "Scheduled pickups",
        "Priority support",
      ],
      gradient: "linear-gradient(135deg, #00C853 0%, #0891B2 100%)",
      lightBg: "#F0FDF4",
      lightText: "#00C853",
      badge: null,
    },
    {
      icon: <FileText size={36} className="text-white" />,
      title: "Document Delivery",
      desc: "Secure transport for sensitive and confidential documents. We handle your legal and financial papers with care.",
      features: [
        "Tamper-proof packaging",
        "Direct hand delivery",
        "Signed proof of delivery",
      ],
      gradient: "linear-gradient(135deg, #FF6D00 0%, #DC2626 100%)",
      lightBg: "#FFF7ED",
      lightText: "#FF6D00",
      badge: null,
    },
    {
      icon: <Utensils size={36} className="text-white" />,
      title: "Food Delivery",
      desc: "Connecting restaurants and grocery stores to hungry customers. Keep food fresh and hot with our carriers.",
      features: [
        "Insulated thermal bags",
        "Hygienic handling",
        "Fast turnaround",
      ],
      gradient: "linear-gradient(135deg, #DC2626 0%, #DB2777 100%)",
      lightBg: "#FFF1F2",
      lightText: "#DC2626",
      badge: "🔥 Hot",
    },
    {
      icon: <Package size={36} className="text-white" />,
      title: "Bulk Transportation",
      desc: "Moving multiple packages or large items? Our van and car fleet can handle your bulk distribution needs.",
      features: [
        "Large load capacity",
        "Route optimization",
        "Cost-effective pricing",
      ],
      gradient: "linear-gradient(135deg, #7C3AED 0%, #4F46E5 100%)",
      lightBg: "#F5F3FF",
      lightText: "#7C3AED",
      badge: null,
    },
    {
      icon: <Shield size={36} className="text-white" />,
      title: "Express Overnight",
      desc: "When morning matters — schedule your delivery today and have it arrive first thing tomorrow morning.",
      features: [
        "Next-morning delivery",
        "Live SMS alerts",
        "Insurance included",
      ],
      gradient: "linear-gradient(135deg, #0891B2 0%, #0A84FF 100%)",
      lightBg: "#F0F9FF",
      lightText: "#0891B2",
      badge: "🌙 New",
    },
  ];

  return (
    <div className="font-poppins">
      {/* ─── HERO ──────────────────────────────────────────────────────── */}
      <section
        style={{
          background: "linear-gradient(135deg, #0A84FF 0%, #7C3AED 100%)",
        }}
        className="py-24 text-white relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-yellow-400/10 rounded-full blur-3xl -translate-x-1/4 translate-y-1/4" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <span className="inline-flex items-center gap-2 bg-white/10 border border-white/20 px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <Zap size={14} className="text-yellow-300" fill="#FDE047" /> What
              We Offer
            </span>
            <h1 className="text-5xl md:text-6xl font-black mb-6">
              Our Logistics <span className="text-yellow-300">Solutions</span>
            </h1>
            <p className="text-blue-100 text-xl max-w-2xl mx-auto leading-relaxed">
              Explore how DELIVA can help you move packages across urban
              communities with speed, security, and style.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ─── SERVICES GRID ─────────────────────────────────────────────── */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 group"
              >
                {/* Card top gradient */}
                <div
                  style={{ background: service.gradient }}
                  className="p-8 relative"
                >
                  {service.badge && (
                    <span className="absolute top-4 right-4 bg-yellow-400 text-gray-900 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest">
                      {service.badge}
                    </span>
                  )}
                  <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-4">
                    {service.icon}
                  </div>
                  <h3 className="text-2xl font-black text-white">
                    {service.title}
                  </h3>
                </div>

                {/* Card body */}
                <div className="p-8">
                  <p
                    style={{ color: "#64748B" }}
                    className="leading-relaxed mb-8 text-sm"
                  >
                    {service.desc}
                  </p>
                  <div className="space-y-3 mb-8">
                    {service.features.map((feature, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-3 text-sm font-semibold text-gray-700"
                      >
                        <div
                          style={{
                            backgroundColor: service.lightBg,
                            color: service.lightText,
                          }}
                          className="w-6 h-6 rounded-full flex items-center justify-center shrink-0"
                        >
                          <CheckCircle2 size={14} />
                        </div>
                        {feature}
                      </div>
                    ))}
                  </div>
                  <a
                    href="/booking"
                    style={{ background: service.gradient }}
                    className="flex items-center justify-center gap-2 w-full text-white py-3 rounded-xl font-bold text-sm hover:opacity-90 transition-all"
                  >
                    Book This Service <ArrowRight size={16} />
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PRICING STRIP ─────────────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <span className="inline-block bg-orange-50 text-[#FF6D00] font-bold text-xs px-4 py-2 rounded-full uppercase tracking-widest mb-4">
              Pricing
            </span>
            <h2 className="text-4xl font-black text-gray-900">
              Simple, Transparent Pricing
            </h2>
            <p className="text-gray-500 mt-3 max-w-xl mx-auto">
              No hidden charges. What you see is what you pay.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {[
              {
                label: "Base Fare",
                value: "₦500",
                icon: "🚀",
                gradient: "linear-gradient(135deg, #0A84FF, #4F46E5)",
              },
              {
                label: "Per KM",
                value: "₦100",
                icon: "📍",
                gradient: "linear-gradient(135deg, #7C3AED, #DB2777)",
              },
              {
                label: "Express Surcharge",
                value: "₦1,000",
                icon: "⚡",
                gradient: "linear-gradient(135deg, #FF6D00, #DC2626)",
              },
              {
                label: "Max Weight (0–5kg)",
                value: "₦200",
                icon: "⚖️",
                gradient: "linear-gradient(135deg, #00C853, #0891B2)",
              },
            ].map((item, i) => (
              <div key={i} className="rounded-3xl overflow-hidden shadow-lg">
                <div
                  style={{ background: item.gradient }}
                  className="p-6 text-center text-white"
                >
                  <div className="text-4xl mb-3">{item.icon}</div>
                  <div className="text-3xl font-black">{item.value}</div>
                  <div className="text-white/80 text-sm mt-1 font-semibold">
                    {item.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ────────────────────────────────────────────────────────── */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div
            style={{
              background: "linear-gradient(135deg, #0F172A 0%, #1E1B4B 100%)",
            }}
            className="rounded-3xl p-12 lg:p-20 text-center text-white relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#0A84FF]/20 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl -translate-x-1/4 translate-y-1/4" />
            <div className="relative z-10">
              <div className="text-5xl mb-6">🤝</div>
              <h2 className="text-4xl font-black mb-6">
                Need a Custom Solution?
              </h2>
              <p className="text-gray-400 mb-10 max-w-xl mx-auto text-lg">
                For large businesses or unique logistics requirements, contact
                our corporate team for a tailored plan.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/contact"
                  style={{
                    background: "linear-gradient(135deg, #0A84FF, #7C3AED)",
                  }}
                  className="inline-flex items-center gap-2 text-white px-10 py-4 rounded-2xl font-black hover:opacity-90 transition-all"
                >
                  💬 Talk to Our Team
                </a>
                <a
                  href="/booking"
                  className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white px-10 py-4 rounded-2xl font-black hover:bg-white/20 transition-all"
                >
                  📦 Book Now
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
