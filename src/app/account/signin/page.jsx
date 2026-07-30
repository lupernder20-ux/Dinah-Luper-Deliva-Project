"use client";
import { useState } from "react";
import useAuth from "@/utils/useAuth";
import { Zap } from "lucide-react";

export default function SignInPage() {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signInWithCredentials } = useAuth();

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    if (!email || !password) {
      setError("Please fill in all fields");
      setLoading(false);
      return;
    }
    try {
      await signInWithCredentials({
        email,
        password,
        callbackUrl: "/dashboard",
        redirect: true,
      });
    } catch (err) {
      setError("Invalid credentials. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        background:
          "linear-gradient(135deg, #0A84FF 0%, #4F46E5 50%, #7C3AED 100%)",
      }}
      className="min-h-screen flex items-center justify-center p-4 font-poppins relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -translate-x-1/3 -translate-y-1/3" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-yellow-400/10 rounded-full blur-3xl translate-x-1/4 translate-y-1/4" />

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <a href="/" className="inline-flex items-center gap-2 group">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-xl">
              <Zap size={24} className="text-[#0A84FF]" fill="#0A84FF" />
            </div>
            <span className="text-3xl font-black text-white">
              DELI<span className="text-yellow-300">VA</span>
            </span>
          </a>
          <p className="text-blue-200 mt-3 font-semibold">
            Welcome back! Sign in to continue.
          </p>
        </div>

        <form
          noValidate
          onSubmit={onSubmit}
          className="bg-white rounded-3xl shadow-2xl p-8 border border-white/20"
        >
          <h2 className="text-2xl font-black text-gray-900 mb-6 text-center">
            Sign In 👋
          </h2>

          <div className="space-y-5">
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
                placeholder="••••••••"
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
              {loading ? "Signing In..." : "Sign In →"}
            </button>

            <div className="relative my-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-100" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-white px-4 text-xs text-gray-400 font-semibold">
                  OR
                </span>
              </div>
            </div>

            <p className="text-center text-sm text-gray-600">
              Don't have an account?{" "}
              <a
                href="/account/signup"
                className="font-black text-[#0A84FF] hover:underline"
              >
                Create Account
              </a>
            </p>
          </div>
        </form>

        <p className="text-center text-blue-200 text-xs mt-6">
          By signing in, you agree to our{" "}
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
