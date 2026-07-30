"use client";
import { useState } from "react";
import useAuth from "@/utils/useAuth";
import { Truck, User } from "lucide-react";

export default function SignUpPage() {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("customer");
  const { signUpWithCredentials } = useAuth();

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    if (!email || !password || !name) {
      setError("Please fill in all fields");
      setLoading(false);
      return;
    }
    try {
      if (typeof window !== "undefined") {
        localStorage.setItem("pendingRole", role);
        localStorage.setItem("pendingName", name);
      }
      await signUpWithCredentials({
        email,
        password,
        name,
        callbackUrl: "/onboarding",
        redirect: true,
      });
    } catch (err) {
      const msgs = { EmailCreateAccount: "This email is already registered." };
      setError(msgs[err.message] || "Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  const roles = [
    {
      val: "customer",
      label: "Customer",
      icon: <User size={18} />,
      desc: "Send packages",
      gradient: "linear-gradient(135deg, #0A84FF, #7C3AED)",
      emoji: "📦",
    },
    {
      val: "rider",
      label: "Dispatch Rider",
      icon: <Truck size={18} />,
      desc: "Deliver packages & earn",
      gradient: "linear-gradient(135deg, #00C853, #0891B2)",
      emoji: "🏍️",
    },
  ];

  return (
    <div
      style={{
        background:
          "linear-gradient(135deg, #0A84FF 0%, #7C3AED 50%, #DB2777 100%)",
      }}
      className="min-h-screen flex items-center justify-center p-4 font-poppins relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-yellow-400/10 rounded-full blur-3xl -translate-x-1/3 translate-y-1/3" />

      <div className="w-full max-w-md relative z-10">
        {/* Logo — text only */}
        <div className="text-center mb-8">
          <a href="/">
            <span className="text-3xl font-black text-white tracking-tight">
              DELI<span className="text-yellow-300">VA</span>
            </span>
          </a>
          <p className="text-blue-200 mt-3 font-semibold">
            Join thousands of satisfied users!
          </p>
        </div>

        <form
          noValidate
          onSubmit={onSubmit}
          className="bg-white rounded-3xl shadow-2xl p-8"
        >
          <h2 className="text-2xl font-black text-gray-900 mb-6 text-center">
            Create Account 🚀
          </h2>

          <div className="space-y-5">
            {/* Role Selection */}
            <div>
              <label className="block text-sm font-black text-gray-700 mb-3">
                I want to...
              </label>
              <div className="grid grid-cols-2 gap-3">
                {roles.map((r) => (
                  <button
                    key={r.val}
                    type="button"
                    onClick={() => setRole(r.val)}
                    style={role === r.val ? { background: r.gradient } : {}}
                    className={`p-4 rounded-2xl border-2 transition-all text-left ${role === r.val ? "text-white border-transparent shadow-lg" : "bg-gray-50 border-gray-100 text-gray-700 hover:border-gray-200"}`}
                  >
                    <div className="text-2xl mb-1">{r.emoji}</div>
                    <div className="font-black text-sm">{r.label}</div>
                    <div
                      className={`text-xs mt-0.5 ${role === r.val ? "text-white/70" : "text-gray-400"}`}
                    >
                      {r.desc}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-black text-gray-700 mb-2">
                Full Name
              </label>
              <input
                required
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="w-full bg-gray-50 border border-gray-100 rounded-xl px-5 py-4 outline-none focus:ring-2 focus:ring-[#0A84FF] transition-all text-sm font-medium"
              />
            </div>
            <div>
              <label className="block text-sm font-black text-gray-700 mb-2">
                Email Address
              </label>
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john@example.com"
                className="w-full bg-gray-50 border border-gray-100 rounded-xl px-5 py-4 outline-none focus:ring-2 focus:ring-[#0A84FF] transition-all text-sm font-medium"
              />
            </div>
            <div>
              <label className="block text-sm font-black text-gray-700 mb-2">
                Password
              </label>
              <input
                required
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min. 8 characters"
                className="w-full bg-gray-50 border border-gray-100 rounded-xl px-5 py-4 outline-none focus:ring-2 focus:ring-[#0A84FF] transition-all text-sm font-medium"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-100 rounded-xl p-4 text-sm text-red-500 font-semibold text-center">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                background: "linear-gradient(135deg, #0A84FF, #7C3AED)",
              }}
              className="w-full text-white py-4 rounded-2xl font-black text-base hover:opacity-90 transition-all disabled:opacity-50 shadow-xl"
            >
              {loading ? "Creating Account..." : "Create Account →"}
            </button>

            <p className="text-center text-sm text-gray-600">
              Already have an account?{" "}
              <a
                href="/account/signin"
                className="font-black text-[#0A84FF] hover:underline"
              >
                Sign In
              </a>
            </p>
          </div>
        </form>

        <p className="text-center text-blue-200 text-xs mt-6">
          By signing up, you agree to our{" "}
          <a href="#" className="underline text-white">
            Terms
          </a>{" "}
          &{" "}
          <a href="#" className="underline text-white">
            Privacy Policy
          </a>
        </p>
      </div>
    </div>
  );
}
