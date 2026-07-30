"use client";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  MessageSquare,
  Zap,
  Clock,
  HeadphonesIcon,
  Star,
  AlertCircle,
} from "lucide-react";
import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { useUserProfile } from "@/utils/useUserProfile";

const TYPE_OPTIONS = [
  { value: "contact", label: "General Inquiry" },
  { value: "feedback", label: "Delivery Feedback" },
  { value: "report", label: "Report a Problem" },
];

export default function ContactPage() {
  const { data: user } = useUserProfile();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [messageType, setMessageType] = useState("contact");
  const [deliveryId, setDeliveryId] = useState("");
  const [rating, setRating] = useState(0);
  const [myDeliveries, setMyDeliveries] = useState([]);

  useEffect(() => {
    if (!user?.id) return;
    fetch("/api/deliveries")
      .then((res) => (res.ok ? res.json() : { deliveries: [] }))
      .then((data) => setMyDeliveries(data.deliveries || []))
      .catch(() => setMyDeliveries([]));
  }, [user?.id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: user ? messageType : "contact",
          delivery_id:
            user && messageType !== "contact" && deliveryId
              ? Number(deliveryId)
              : null,
          rating: user && messageType === "feedback" && rating ? rating : null,
          name: form.name,
          email: form.email,
          subject: form.subject,
          message: form.message,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send message");
      setSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const contactCards = [
    {
      icon: <Mail size={24} className="text-white" />,
      label: "Email Us",
      value: "support@deliva.com",
      sub: "We reply within 2 hours",
      gradient: "linear-gradient(135deg, #0A84FF 0%, #4F46E5 100%)",
      href: "mailto:support@deliva.com",
    },
    {
      icon: <Phone size={24} className="text-white" />,
      label: "Call Us",
      value: "09023021617",
      sub: "Mon–Sun, 6am – 10pm",
      gradient: "linear-gradient(135deg, #00C853 0%, #059669 100%)",
      href: "tel:09023021617",
    },
    {
      icon: <MapPin size={24} className="text-white" />,
      label: "Visit Us",
      value: "12 Innovation Hub",
      sub: "Makurdi, Benue State",
      gradient: "linear-gradient(135deg, #F97316 0%, #EA580C 100%)",
      href: "#",
    },
    {
      icon: <MessageSquare size={24} className="text-white" />,
      label: "WhatsApp",
      value: "Chat Instantly",
      sub: "Available 24/7",
      gradient: "linear-gradient(135deg, #00C853 0%, #059669 100%)",
      href: "https://wa.me/2348001234567",
    },
  ];

  return (
    <div className="font-poppins">
      {/* ─── HERO ──────────────────────────────────────────────────────── */}
      <section
        style={{
          background: "linear-gradient(135deg, #1E40AF 0%, #1D4ED8 100%)",
        }}
        className="py-28 text-white relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl -translate-x-1/4 translate-y-1/4" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <span className="inline-flex items-center gap-2 bg-white/10 border border-white/20 px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <Zap size={14} className="text-yellow-300" fill="#FDE047" /> We're
              Here to Help
            </span>
            <h1 className="text-5xl md:text-6xl font-black mb-6">
              Get in <span className="text-yellow-300">Touch</span>
            </h1>
            <p className="text-gray-300 text-xl max-w-xl mx-auto leading-relaxed">
              Have questions, need support, or want to partner with us? Our team
              is ready to assist you 24/7.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ─── CONTACT CARDS ─────────────────────────────────────────────── */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactCards.map((card, i) => (
              <motion.a
                key={i}
                href={card.href}
                whileHover={{ y: -6, scale: 1.02 }}
                className="block rounded-3xl overflow-hidden shadow-xl group cursor-pointer"
              >
                <div
                  style={{ background: card.gradient }}
                  className="p-6 text-center text-white"
                >
                  <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    {card.icon}
                  </div>
                  <div className="text-[10px] font-black uppercase tracking-widest text-white/70 mb-1">
                    {card.label}
                  </div>
                  <div className="font-black text-lg leading-tight">
                    {card.value}
                  </div>
                  <div className="text-white/70 text-xs mt-1">{card.sub}</div>
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FORM + INFO ───────────────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-14">
            {/* Contact Form */}
            <div className="flex-[1.5]">
              <div className="bg-white rounded-3xl border border-gray-100 shadow-2xl p-8 lg:p-12">
                <div className="flex items-center gap-3 mb-8">
                  <div
                    style={{
                      background: "linear-gradient(135deg, #0A84FF, #7C3AED)",
                    }}
                    className="w-12 h-12 rounded-2xl flex items-center justify-center"
                  >
                    <Send size={20} className="text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-gray-900">
                      Send us a Message
                    </h2>
                    <p className="text-gray-500 text-sm">
                      We'll respond within 2 hours
                    </p>
                  </div>
                </div>

                {success ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    style={{
                      background:
                        "linear-gradient(135deg, #F0FDF4 0%, #EFF6FF 100%)",
                    }}
                    className="p-10 rounded-2xl text-center border border-green-100"
                  >
                    <div className="text-6xl mb-4">🎉</div>
                    <h3 className="text-2xl font-black text-gray-900 mb-2">
                      Message Sent!
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Thank you for reaching out. We'll get back to you within 2
                      hours.
                    </p>
                    <button
                      onClick={() => {
                        setSuccess(false);
                        setForm({ name: "", email: "", subject: "", message: "" });
                        setMessageType("contact");
                        setDeliveryId("");
                        setRating(0);
                      }}
                      style={{
                        background: "linear-gradient(135deg, #0A84FF, #7C3AED)",
                      }}
                      className="text-white font-bold px-8 py-3 rounded-xl transition-all hover:opacity-90"
                    >
                      Send another message
                    </button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    {user && (
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                          What's this about?
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                          {TYPE_OPTIONS.map((opt) => (
                            <button
                              key={opt.value}
                              type="button"
                              onClick={() => setMessageType(opt.value)}
                              className={`py-2.5 px-2 rounded-xl text-xs font-black transition-all ${
                                messageType === opt.value
                                  ? "bg-[#0A84FF] text-white"
                                  : "bg-gray-50 text-gray-500 hover:bg-gray-100"
                              }`}
                            >
                              {opt.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                    {user && messageType !== "contact" && (
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                          Which delivery? (optional)
                        </label>
                        <select
                          value={deliveryId}
                          onChange={(e) => setDeliveryId(e.target.value)}
                          className="w-full bg-gray-50 border border-gray-100 rounded-xl py-4 px-5 outline-none focus:ring-2 focus:ring-[#0A84FF] transition-all font-medium text-sm"
                        >
                          <option value="">Not tied to a specific delivery</option>
                          {myDeliveries.map((d) => (
                            <option key={d.id} value={d.id}>
                              {d.tracking_id} — {d.delivery_address?.slice(0, 40)}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                    {user && messageType === "feedback" && (
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                          Rating (optional)
                        </label>
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setRating(star === rating ? 0 : star)}
                              className="text-amber-400"
                            >
                              <Star
                                size={26}
                                fill={star <= rating ? "currentColor" : "none"}
                              />
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                          Full Name
                        </label>
                        <input
                          required
                          type="text"
                          value={form.name}
                          onChange={(e) =>
                            setForm({ ...form, name: e.target.value })
                          }
                          className="w-full bg-gray-50 border border-gray-100 rounded-xl py-4 px-5 outline-none focus:ring-2 focus:ring-[#0A84FF] transition-all font-medium text-sm"
                          placeholder="John Doe"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                          Email Address
                        </label>
                        <input
                          required
                          type="email"
                          value={form.email}
                          onChange={(e) =>
                            setForm({ ...form, email: e.target.value })
                          }
                          className="w-full bg-gray-50 border border-gray-100 rounded-xl py-4 px-5 outline-none focus:ring-2 focus:ring-[#0A84FF] transition-all font-medium text-sm"
                          placeholder="john@example.com"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Subject
                      </label>
                      <input
                        required
                        type="text"
                        value={form.subject}
                        onChange={(e) =>
                          setForm({ ...form, subject: e.target.value })
                        }
                        className="w-full bg-gray-50 border border-gray-100 rounded-xl py-4 px-5 outline-none focus:ring-2 focus:ring-[#0A84FF] transition-all font-medium text-sm"
                        placeholder="How can we help?"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Message
                      </label>
                      <textarea
                        required
                        rows="5"
                        value={form.message}
                        onChange={(e) =>
                          setForm({ ...form, message: e.target.value })
                        }
                        className="w-full bg-gray-50 border border-gray-100 rounded-xl py-4 px-5 outline-none focus:ring-2 focus:ring-[#0A84FF] transition-all font-medium text-sm resize-none"
                        placeholder="Tell us more details..."
                      />
                    </div>
                    {error && (
                      <div className="bg-red-50 text-red-500 p-4 rounded-xl flex items-center gap-3 border border-red-100">
                        <AlertCircle size={18} />
                        <span className="text-sm font-bold">{error}</span>
                      </div>
                    )}
                    <button
                      type="submit"
                      disabled={loading}
                      style={{
                        background:
                          "linear-gradient(135deg, #0A84FF 0%, #7C3AED 100%)",
                      }}
                      className="w-full text-white py-5 rounded-2xl font-black flex items-center justify-center gap-3 hover:opacity-90 transition-all disabled:opacity-50 text-base"
                    >
                      {loading ? (
                        <>
                          <div
                            className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                            style={{ animation: "spin 1s linear infinite" }}
                          />
                          Sending...
                        </>
                      ) : (
                        <>
                          Send Message <Send size={20} />
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>

            {/* Info Panel */}
            <div className="flex-1 space-y-6">
              {/* Live Chat */}
              <div
                style={{
                  background:
                    "linear-gradient(135deg, #0A84FF 0%, #7C3AED 100%)",
                }}
                className="rounded-3xl p-8 text-white relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl translate-x-1/2 -translate-y-1/2" />
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className="w-3 h-3 bg-green-400 rounded-full"
                      style={{ animation: "ping 1.5s ease-in-out infinite" }}
                    />
                    <span className="font-bold text-sm">LIVE SUPPORT</span>
                  </div>
                  <h3 className="text-2xl font-black mb-3">
                    WhatsApp Live Chat
                  </h3>
                  <p className="text-blue-100 text-sm leading-relaxed mb-6">
                    Our support agents are online and ready to assist you
                    instantly via WhatsApp.
                  </p>
                  <a
                    href="https://wa.me/2348001234567"
                    className="inline-flex items-center gap-2 bg-white text-gray-900 px-6 py-3 rounded-xl font-black text-sm hover:bg-gray-100 transition-all"
                  >
                    💬 Start Chat Now
                  </a>
                </div>
              </div>

              {/* FAQ Cards */}
              <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm">
                <h3 className="text-lg font-black mb-6 text-gray-900">
                  Quick Help
                </h3>
                <div className="space-y-4">
                  {[
                    {
                      q: "How do I track my package?",
                      a: "Go to the Track page and enter your Tracking ID.",
                      icon: "📍",
                    },
                    {
                      q: "How long does delivery take?",
                      a: "Same-day delivery within 3 hours for most urban areas.",
                      icon: "⏱️",
                    },
                    {
                      q: "How do I become a rider?",
                      a: "Sign up and select 'Dispatch Rider' as your role.",
                      icon: "🏍️",
                    },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="p-4 bg-gray-50 rounded-2xl border border-gray-100"
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-xl">{item.icon}</span>
                        <div>
                          <div className="font-black text-gray-900 text-sm">
                            {item.q}
                          </div>
                          <div className="text-gray-500 text-xs mt-1">
                            {item.a}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Hours */}
              <div
                style={{
                  background:
                    "linear-gradient(135deg, #F0FDF4 0%, #EFF6FF 100%)",
                }}
                className="rounded-3xl p-8 border border-green-100"
              >
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                    <Clock size={20} className="text-green-600" />
                  </div>
                  <h3 className="font-black text-gray-900">Support Hours</h3>
                </div>
                <div className="space-y-3 text-sm">
                  {[
                    { day: "Monday – Friday", time: "6:00 AM – 11:00 PM" },
                    { day: "Saturday", time: "7:00 AM – 10:00 PM" },
                    { day: "Sunday & Holidays", time: "8:00 AM – 8:00 PM" },
                  ].map((h, i) => (
                    <div key={i} className="flex justify-between items-center">
                      <span className="text-gray-600 font-semibold">
                        {h.day}
                      </span>
                      <span className="bg-green-100 text-green-700 font-bold px-3 py-1 rounded-lg text-xs">
                        {h.time}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style jsx global>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes ping {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.3); }
        }
      `}</style>
    </div>
  );
}
