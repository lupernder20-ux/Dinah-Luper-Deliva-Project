"use client";
import { useState } from "react";
import {
  Package,
  Truck,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  MapPin,
  User,
  AlertCircle,
  Zap,
  Calendar,
} from "lucide-react";
import { useUserProfile } from "@/utils/useUserProfile";
import { motion } from "motion/react";
import PlaceAutocompleteInput from "@/components/PlaceAutocompleteInput";

const INPUT_CLS =
  "w-full bg-gray-50 border border-gray-100 rounded-xl py-4 px-5 outline-none focus:ring-2 focus:ring-[#0A84FF] transition-all text-sm font-medium";

// Nigerian mobile numbers: 11 digits starting with 0 (e.g. 08031234567),
// or the same number in +234 international format (e.g. +2348031234567).
const NG_PHONE_REGEX = /^(0\d{10}|\+234\d{10})$/;
const NAME_REGEX = /^[A-Za-z'-]+(?:\s+[A-Za-z'-]+)+$/;

const isValidNgPhone = (value) => NG_PHONE_REGEX.test(value.trim());
const isValidFullName = (value) => NAME_REGEX.test(value.trim());

export default function BookingPage() {
  const { data: user } = useUserProfile();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    sender_name: user?.name || "",
    sender_phone: user?.phone || "",
    pickup_address: "",
    pickup_lat: null,
    pickup_lng: null,
    receiver_name: "",
    receiver_phone: "",
    delivery_address: "",
    delivery_lat: null,
    delivery_lng: null,
    package_type: "Parcel",
    weight: 2,
    priority: "Normal",
    notes: "",
    pickup_date: new Date().toISOString().split("T")[0],
  });

  const calculateCost = () => {
    const baseFare = 500;
    const distanceRate = 100 * 10;
    let weightRate = 200;
    if (formData.weight > 10) weightRate = 800;
    else if (formData.weight > 5) weightRate = 400;
    const priorityCharge = formData.priority === "Express" ? 1000 : 0;
    return baseFare + distanceRate + weightRate + priorityCharge;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const cost = calculateCost();
      const res = await fetch("/api/deliveries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, cost }),
      });
      const data = await res.json();
      if (!res.ok)
        throw new Error(data.error || "Failed to create delivery request");
      setSuccess(data.delivery);
      if (typeof window !== "undefined") window.scrollTo(0, 0);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { num: 1, label: "Sender", icon: "👤", color: "#0A84FF" },
    { num: 2, label: "Receiver", icon: "📍", color: "#FF6D00" },
    { num: 3, label: "Package", icon: "📦", color: "#00C853" },
  ];

  if (success) {
    return (
      <div
        style={{
          background: "linear-gradient(135deg, #F0FDF4 0%, #EFF6FF 100%)",
        }}
        className="min-h-screen flex items-center justify-center py-20 px-4 font-poppins"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="max-w-md w-full bg-white p-12 rounded-3xl shadow-2xl border border-gray-100 text-center"
        >
          <div className="text-7xl mb-6">🎉</div>
          <div
            style={{ background: "linear-gradient(135deg, #00C853, #0891B2)" }}
            className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl"
          >
            <CheckCircle2 size={40} className="text-white" />
          </div>
          <h1 className="text-3xl font-black mb-3 text-gray-900">
            Booking Confirmed!
          </h1>
          <p className="text-gray-500 mb-5 leading-relaxed">
            Your delivery has been booked. A dispatch rider will be assigned
            shortly.
          </p>
          {success.tracking_id && (
            <div
              style={{
                background: "linear-gradient(135deg, #EFF6FF, #F5F3FF)",
              }}
              className="rounded-2xl px-6 py-4 mb-8 border border-blue-100"
            >
              <div className="text-xs text-gray-400 font-black uppercase tracking-widest mb-1">
                Your Tracking ID
              </div>
              <div className="text-2xl font-black text-[#0A84FF]">
                {success.tracking_id}
              </div>
              <div className="text-xs text-gray-400 mt-1">
                Save this to track your package
              </div>
            </div>
          )}
          <div className="space-y-3">
            <a
              href="/dashboard"
              style={{
                background: "linear-gradient(135deg, #0A84FF, #7C3AED)",
              }}
              className="block w-full text-white py-4 rounded-2xl font-black hover:opacity-90 transition-all"
            >
              📊 Go to Dashboard
            </a>
            <a
              href={`/track?id=${success.tracking_id}`}
              className="block w-full bg-gray-50 text-gray-800 py-4 rounded-2xl font-black hover:bg-gray-100 transition-all border border-gray-100"
            >
              🔍 Track This Package
            </a>
            <button
              onClick={() => {
                setSuccess(null);
                setStep(1);
                setFormData({
                  sender_name: "",
                  sender_phone: "",
                  pickup_address: "",
                  pickup_lat: null,
                  pickup_lng: null,
                  receiver_name: "",
                  receiver_phone: "",
                  delivery_address: "",
                  delivery_lat: null,
                  delivery_lng: null,
                  package_type: "Parcel",
                  weight: 2,
                  priority: "Normal",
                  notes: "",
                  pickup_date: new Date().toISOString().split("T")[0],
                });
              }}
              className="block w-full text-gray-500 py-3 rounded-2xl font-bold hover:text-gray-700 transition-all text-sm"
            >
              Send Another Package
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div
      style={{
        background: "linear-gradient(135deg, #F0F9FF 0%, #EEF2FF 100%)",
      }}
      className="min-h-screen py-12 font-poppins"
    >
      {/* ─── HERO ────────────────────────────────────────────── */}
      <div
        style={{
          background: "linear-gradient(135deg, #0A84FF 0%, #7C3AED 100%)",
        }}
        className="py-14 text-white text-center mb-12 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3" />
        <div className="relative z-10">
          <span className="inline-flex items-center gap-2 bg-white/10 border border-white/20 px-4 py-2 rounded-full text-sm font-semibold mb-4">
            <Zap size={14} className="text-yellow-300" fill="#FDE047" /> Quick
            Delivery Booking
          </span>
          <h1 className="text-4xl font-black">Book a Delivery 📦</h1>
          <p className="text-blue-100 mt-3 text-lg">
            Fill in the details below to request a dispatch rider.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          {/* ─── STEP PROGRESS ──────────────────────────────────── */}
          <div className="flex items-center justify-center mb-10 gap-3">
            {steps.map((s, i) => (
              <div key={s.num} className="flex items-center gap-3">
                <div className="flex flex-col items-center">
                  <div
                    style={
                      step >= s.num
                        ? {
                            background: `linear-gradient(135deg, ${s.color}, ${s.color}CC)`,
                          }
                        : {}
                    }
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg transition-all shadow-lg ${step >= s.num ? "text-white" : "bg-white border-2 border-gray-200 text-gray-300"}`}
                  >
                    {step > s.num ? "✓" : s.icon}
                  </div>
                  <span
                    className={`text-xs mt-1 font-bold ${step >= s.num ? "text-gray-700" : "text-gray-400"}`}
                  >
                    {s.label}
                  </span>
                </div>
                {i < steps.length - 1 && (
                  <div
                    className={`w-16 h-1 rounded-full mb-5 transition-all ${step > s.num ? "bg-[#0A84FF]" : "bg-gray-200"}`}
                  />
                )}
              </div>
            ))}
          </div>

          {/* ─── FORM CARD ────────────────────────────────────── */}
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100"
          >
            {/* Step 1 */}
            {step === 1 && (
              <div>
                <div
                  style={{
                    background:
                      "linear-gradient(135deg, #0A84FF 0%, #4F46E5 100%)",
                  }}
                  className="p-6 flex items-center gap-3"
                >
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center text-white">
                    <User size={20} />
                  </div>
                  <div className="text-white">
                    <div className="font-black text-lg">Sender Information</div>
                    <div className="text-blue-200 text-xs">
                      Who is sending the package?
                    </div>
                  </div>
                </div>
                <div className="p-8 space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-black text-gray-700 mb-2">
                        Full Name
                      </label>
                      <input
                        required
                        name="sender_name"
                        value={formData.sender_name}
                        onChange={handleInputChange}
                        className={INPUT_CLS}
                        placeholder="e.g. Luper Nder"
                      />
                      {formData.sender_name && !isValidFullName(formData.sender_name) && (
                        <p className="text-xs text-red-500 font-bold mt-1">
                          Enter a first and last name (letters only)
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-black text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <input
                        required
                        type="tel"
                        inputMode="tel"
                        maxLength={14}
                        name="sender_phone"
                        value={formData.sender_phone}
                        onChange={handleInputChange}
                        className={INPUT_CLS}
                        placeholder="e.g. 08031234567"
                      />
                      {formData.sender_phone && !isValidNgPhone(formData.sender_phone) && (
                        <p className="text-xs text-red-500 font-bold mt-1">
                          Enter a valid Nigerian number (11 digits, e.g.
                          08031234567 or +2348031234567)
                        </p>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-black text-gray-700 mb-2">
                      📍 Pickup Address
                    </label>
                    <PlaceAutocompleteInput
                      required
                      name="pickup_address"
                      value={formData.pickup_address}
                      onChange={(text) =>
                        setFormData((f) => ({
                          ...f,
                          pickup_address: text,
                          pickup_lat: null,
                          pickup_lng: null,
                        }))
                      }
                      onSelect={({ address, lat, lng }) =>
                        setFormData((f) => ({
                          ...f,
                          pickup_address: address,
                          pickup_lat: lat,
                          pickup_lng: lng,
                        }))
                      }
                      className={INPUT_CLS}
                      placeholder="Start typing an address..."
                    />
                  </div>
                  <div className="flex justify-end pt-4">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      disabled={
                        !isValidFullName(formData.sender_name) ||
                        !isValidNgPhone(formData.sender_phone) ||
                        !formData.pickup_address
                      }
                      style={{
                        background: "linear-gradient(135deg, #0A84FF, #7C3AED)",
                      }}
                      className="text-white px-10 py-4 rounded-2xl font-black flex items-center gap-2 hover:opacity-90 disabled:opacity-40 transition-all"
                    >
                      Next Step <ArrowRight size={18} />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2 */}
            {step === 2 && (
              <div>
                <div
                  style={{
                    background:
                      "linear-gradient(135deg, #FF6D00 0%, #DC2626 100%)",
                  }}
                  className="p-6 flex items-center gap-3"
                >
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center text-white">
                    <MapPin size={20} />
                  </div>
                  <div className="text-white">
                    <div className="font-black text-lg">
                      Receiver Information
                    </div>
                    <div className="text-orange-200 text-xs">
                      Who is receiving the package?
                    </div>
                  </div>
                </div>
                <div className="p-8 space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-black text-gray-700 mb-2">
                        Recipient Name
                      </label>
                      <input
                        required
                        name="receiver_name"
                        value={formData.receiver_name}
                        onChange={handleInputChange}
                        className={INPUT_CLS}
                        placeholder="e.g. Luper Nder"
                      />
                      {formData.receiver_name && !isValidFullName(formData.receiver_name) && (
                        <p className="text-xs text-red-500 font-bold mt-1">
                          Enter a first and last name (letters only)
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-black text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <input
                        required
                        type="tel"
                        inputMode="tel"
                        maxLength={14}
                        name="receiver_phone"
                        value={formData.receiver_phone}
                        onChange={handleInputChange}
                        className={INPUT_CLS}
                        placeholder="e.g. 08031234567"
                      />
                      {formData.receiver_phone && !isValidNgPhone(formData.receiver_phone) && (
                        <p className="text-xs text-red-500 font-bold mt-1">
                          Enter a valid Nigerian number (11 digits, e.g.
                          08031234567 or +2348031234567)
                        </p>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-black text-gray-700 mb-2">
                      📍 Delivery Address
                    </label>
                    <PlaceAutocompleteInput
                      required
                      name="delivery_address"
                      value={formData.delivery_address}
                      onChange={(text) =>
                        setFormData((f) => ({
                          ...f,
                          delivery_address: text,
                          delivery_lat: null,
                          delivery_lng: null,
                        }))
                      }
                      onSelect={({ address, lat, lng }) =>
                        setFormData((f) => ({
                          ...f,
                          delivery_address: address,
                          delivery_lat: lat,
                          delivery_lng: lng,
                        }))
                      }
                      className={INPUT_CLS}
                      placeholder="Start typing an address..."
                    />
                  </div>
                  <div className="flex justify-between pt-4">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="bg-gray-100 text-gray-700 px-6 py-4 rounded-2xl font-black flex items-center gap-2 hover:bg-gray-200 transition-all"
                    >
                      <ArrowLeft size={18} /> Back
                    </button>
                    <button
                      type="button"
                      onClick={() => setStep(3)}
                      disabled={
                        !isValidFullName(formData.receiver_name) ||
                        !isValidNgPhone(formData.receiver_phone) ||
                        !formData.delivery_address
                      }
                      style={{
                        background: "linear-gradient(135deg, #FF6D00, #DC2626)",
                      }}
                      className="text-white px-10 py-4 rounded-2xl font-black flex items-center gap-2 hover:opacity-90 disabled:opacity-40 transition-all"
                    >
                      Next Step <ArrowRight size={18} />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3 */}
            {step === 3 && (
              <div>
                <div
                  style={{
                    background:
                      "linear-gradient(135deg, #00C853 0%, #0891B2 100%)",
                  }}
                  className="p-6 flex items-center gap-3"
                >
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center text-white">
                    <Package size={20} />
                  </div>
                  <div className="text-white">
                    <div className="font-black text-lg">Package Details</div>
                    <div className="text-green-200 text-xs">
                      Tell us about the package.
                    </div>
                  </div>
                </div>
                <div className="p-8 space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-black text-gray-700 mb-2">
                        Package Type
                      </label>
                      <select
                        name="package_type"
                        value={formData.package_type}
                        onChange={handleInputChange}
                        className={INPUT_CLS}
                      >
                        {["Parcel", "Document", "Food", "Fragile", "Bulk"].map(
                          (t) => (
                            <option key={t}>{t}</option>
                          ),
                        )}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-black text-gray-700 mb-2">
                        Weight (kg)
                      </label>
                      <input
                        type="number"
                        min="0.1"
                        step="0.1"
                        name="weight"
                        value={formData.weight}
                        onChange={handleInputChange}
                        className={INPUT_CLS}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-black text-gray-700 mb-3">
                      ⚡ Delivery Priority
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        {
                          val: "Normal",
                          label: "🚚 Normal",
                          sub: "Standard delivery",
                          color: "#4F46E5",
                        },
                        {
                          val: "Express",
                          label: "⚡ Express",
                          sub: "+₦1,000 surcharge",
                          color: "#FF6D00",
                        },
                      ].map((p) => (
                        <button
                          key={p.val}
                          type="button"
                          onClick={() =>
                            setFormData((f) => ({ ...f, priority: p.val }))
                          }
                          style={
                            formData.priority === p.val
                              ? {
                                  background: `linear-gradient(135deg, ${p.color}, ${p.color}CC)`,
                                }
                              : {}
                          }
                          className={`p-4 rounded-2xl border-2 transition-all text-left ${formData.priority === p.val ? "text-white border-transparent shadow-lg" : "bg-gray-50 border-gray-100 text-gray-700 hover:border-gray-300"}`}
                        >
                          <div className="font-black text-base">{p.label}</div>
                          <div
                            className={`text-xs mt-1 ${formData.priority === p.val ? "text-white/70" : "text-gray-400"}`}
                          >
                            {p.sub}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-black text-gray-700 mb-2">
                      <Calendar size={14} className="inline mr-1" />
                      Pickup Date
                    </label>
                    <input
                      type="date"
                      name="pickup_date"
                      value={formData.pickup_date}
                      onChange={handleInputChange}
                      className={INPUT_CLS}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-black text-gray-700 mb-2">
                      Notes (Optional)
                    </label>
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      rows="2"
                      className={INPUT_CLS}
                      placeholder="e.g. Fragile, handle with care..."
                    />
                  </div>

                  {/* Cost summary */}
                  <div
                    style={{
                      background:
                        "linear-gradient(135deg, #0F172A 0%, #1E1B4B 100%)",
                    }}
                    className="rounded-2xl p-6 text-white"
                  >
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-gray-400 text-sm font-bold">
                        Base Fare
                      </span>
                      <span className="font-bold">₦500</span>
                    </div>
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-gray-400 text-sm font-bold">
                        Distance (10km)
                      </span>
                      <span className="font-bold">₦1,000</span>
                    </div>
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-gray-400 text-sm font-bold">
                        Weight ({formData.weight}kg)
                      </span>
                      <span className="font-bold">
                        ₦
                        {formData.weight > 10
                          ? "800"
                          : formData.weight > 5
                            ? "400"
                            : "200"}
                      </span>
                    </div>
                    {formData.priority === "Express" && (
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-orange-300 text-sm font-bold">
                          ⚡ Express
                        </span>
                        <span className="font-bold text-orange-300">
                          ₦1,000
                        </span>
                      </div>
                    )}
                    <div className="border-t border-white/10 pt-4 mt-2 flex justify-between items-center">
                      <span className="font-black text-lg">Total Estimate</span>
                      <span
                        style={{
                          background:
                            "linear-gradient(135deg, #FBBF24, #F59E0B)",
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                        }}
                        className="text-3xl font-black"
                      >
                        ₦{calculateCost().toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {error && (
                    <div className="bg-red-50 text-red-500 p-4 rounded-xl flex items-center gap-3 border border-red-100">
                      <AlertCircle size={18} />
                      <span className="text-sm font-bold">{error}</span>
                    </div>
                  )}

                  <div className="flex justify-between pt-2">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="bg-gray-100 text-gray-700 px-6 py-4 rounded-2xl font-black flex items-center gap-2 hover:bg-gray-200 transition-all"
                    >
                      <ArrowLeft size={18} /> Back
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      style={{
                        background: "linear-gradient(135deg, #00C853, #0891B2)",
                      }}
                      className="text-white px-10 py-4 rounded-2xl font-black flex items-center gap-2 hover:opacity-90 disabled:opacity-50 transition-all shadow-xl"
                    >
                      {loading ? (
                        <>
                          <div
                            className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                            style={{ animation: "spin 1s linear infinite" }}
                          />{" "}
                          Processing...
                        </>
                      ) : (
                        <>✅ Confirm Booking</>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>

      <style jsx global>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
