"use client";
import { useState } from "react";
import { CreditCard, X, AlertCircle, CheckCircle2 } from "lucide-react";
import { motion } from "motion/react";

const INPUT_CLS =
  "w-full bg-gray-50 border border-gray-100 rounded-xl py-4 px-5 outline-none focus:ring-2 focus:ring-[#0A84FF] transition-all text-sm font-medium";

// Demo checkout for a delivery that's out for delivery. Card details are
// validated for shape only and never sent anywhere or stored — the "charge"
// is simulated, then /api/deliveries/pay records the method + status.
export default function PaymentModal({ delivery, onClose, onPaid }) {
  const [method, setMethod] = useState("Card");
  const [card, setCard] = useState({ number: "", expiry: "", cvv: "" });
  const [paying, setPaying] = useState(false);
  const [done, setDone] = useState(null);
  const [error, setError] = useState(null);

  const isValidCard =
    /^(\d{4} ?){3}\d{4}$/.test(card.number.trim()) &&
    /^(0[1-9]|1[0-2])\/\d{2}$/.test(card.expiry.trim()) &&
    /^\d{3}$/.test(card.cvv.trim());
  const canPay = method !== "Card" || isValidCard;

  const pay = async () => {
    setPaying(true);
    setError(null);
    try {
      // Simulated gateway round-trip — no real charge is made.
      if (method !== "Cash on Delivery") {
        await new Promise((r) => setTimeout(r, 1400));
      }
      const res = await fetch("/api/deliveries/pay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ delivery_id: delivery.id, payment_method: method }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Payment failed");
      setDone(data.delivery);
      onPaid?.(data.delivery);
    } catch (err) {
      setError(err.message);
    } finally {
      setPaying(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm font-poppins">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
      >
        {done ? (
          <div className="p-10 text-center">
            <div
              style={{ background: "linear-gradient(135deg, #00C853, #0891B2)" }}
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5 shadow-xl"
            >
              <CheckCircle2 size={32} className="text-white" />
            </div>
            <h2 className="text-2xl font-black text-gray-900 mb-2">
              {done.payment_status === "Paid" ? "Payment Successful!" : "Noted!"}
            </h2>
            <p className="text-gray-500 text-sm mb-6">
              {done.payment_status === "Paid"
                ? `${done.tracking_id} is paid via ${done.payment_method}.`
                : `Have the cash ready — you'll pay your rider for ${done.tracking_id} on delivery.`}
            </p>
            <button
              onClick={onClose}
              style={{ background: "linear-gradient(135deg, #0A84FF, #7C3AED)" }}
              className="w-full text-white py-4 rounded-2xl font-black hover:opacity-90 transition-all"
            >
              Done
            </button>
          </div>
        ) : (
          <>
            <div
              style={{
                background: "linear-gradient(135deg, #7C3AED 0%, #DB2777 100%)",
              }}
              className="p-6 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center text-white">
                  <CreditCard size={20} />
                </div>
                <div className="text-white">
                  <div className="font-black text-lg">
                    Pay for {delivery.tracking_id}
                  </div>
                  <div className="text-purple-200 text-xs">
                    Demo checkout — no real charge is made.
                  </div>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-9 h-9 bg-white/10 rounded-xl flex items-center justify-center text-white hover:bg-white/20 transition-all"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 space-y-5">
              <div className="grid grid-cols-3 gap-2">
                {[
                  { val: "Card", label: "💳 Card", color: "#7C3AED" },
                  { val: "Bank Transfer", label: "🏦 Transfer", color: "#0A84FF" },
                  { val: "Cash on Delivery", label: "💵 Cash", color: "#00C853" },
                ].map((m) => (
                  <button
                    key={m.val}
                    type="button"
                    onClick={() => setMethod(m.val)}
                    style={
                      method === m.val
                        ? {
                            background: `linear-gradient(135deg, ${m.color}, ${m.color}CC)`,
                          }
                        : {}
                    }
                    className={`p-3 rounded-2xl border-2 transition-all text-center text-sm font-black ${method === m.val ? "text-white border-transparent shadow-lg" : "bg-gray-50 border-gray-100 text-gray-700 hover:border-gray-300"}`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>

              {method === "Card" && (
                <div className="space-y-4">
                  <input
                    inputMode="numeric"
                    maxLength={19}
                    value={card.number}
                    onChange={(e) =>
                      setCard((c) => ({
                        ...c,
                        number: e.target.value
                          .replace(/[^\d]/g, "")
                          .replace(/(\d{4})(?=\d)/g, "$1 ")
                          .slice(0, 19),
                      }))
                    }
                    className={INPUT_CLS}
                    placeholder="Card number — 0000 0000 0000 0000"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      inputMode="numeric"
                      maxLength={5}
                      value={card.expiry}
                      onChange={(e) =>
                        setCard((c) => ({
                          ...c,
                          expiry: e.target.value
                            .replace(/[^\d]/g, "")
                            .replace(/^(\d{2})(\d)/, "$1/$2")
                            .slice(0, 5),
                        }))
                      }
                      className={INPUT_CLS}
                      placeholder="MM/YY"
                    />
                    <input
                      inputMode="numeric"
                      maxLength={3}
                      type="password"
                      value={card.cvv}
                      onChange={(e) =>
                        setCard((c) => ({
                          ...c,
                          cvv: e.target.value.replace(/[^\d]/g, "").slice(0, 3),
                        }))
                      }
                      className={INPUT_CLS}
                      placeholder="CVV"
                    />
                  </div>
                  <p className="text-xs text-gray-400 font-medium">
                    🔒 Details are only checked for format — nothing is charged
                    or stored.
                  </p>
                </div>
              )}

              {method === "Bank Transfer" && (
                <div
                  style={{
                    background: "linear-gradient(135deg, #EFF6FF, #F5F3FF)",
                  }}
                  className="rounded-2xl p-5 border border-blue-100 text-sm"
                >
                  <div className="font-black text-gray-900">
                    DELIVA Logistics Ltd
                  </div>
                  <div className="text-gray-600 font-semibold">
                    0123456789 · Demo Bank
                  </div>
                  <p className="text-xs text-gray-400 mt-2 font-medium">
                    🔒 Demo — confirming below marks this booking as paid
                    without any real transfer.
                  </p>
                </div>
              )}

              {method === "Cash on Delivery" && (
                <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 text-sm font-bold text-amber-700">
                  💵 Hand ₦{Number(delivery.cost).toLocaleString()} to your
                  rider when the package arrives.
                </div>
              )}

              <div
                style={{
                  background: "linear-gradient(135deg, #0F172A 0%, #1E1B4B 100%)",
                }}
                className="rounded-2xl p-5 text-white flex justify-between items-center"
              >
                <span className="font-black">Total</span>
                <span
                  style={{
                    background: "linear-gradient(135deg, #FBBF24, #F59E0B)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                  className="text-2xl font-black"
                >
                  ₦{Number(delivery.cost).toLocaleString()}
                </span>
              </div>

              {error && (
                <div className="bg-red-50 text-red-500 p-4 rounded-xl flex items-center gap-3 border border-red-100 text-sm font-bold">
                  <AlertCircle size={18} className="shrink-0" /> {error}
                </div>
              )}

              <button
                onClick={pay}
                disabled={paying || !canPay}
                style={{ background: "linear-gradient(135deg, #7C3AED, #DB2777)" }}
                className="w-full text-white py-4 rounded-2xl font-black flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-40 transition-all"
              >
                {paying ? (
                  <>
                    <div
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"
                    />
                    {method === "Cash on Delivery"
                      ? "Saving..."
                      : "Processing payment..."}
                  </>
                ) : method === "Cash on Delivery" ? (
                  <>✅ Confirm Cash on Delivery</>
                ) : (
                  <>🔒 Pay ₦{Number(delivery.cost).toLocaleString()}</>
                )}
              </button>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}
