"use client";
import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Menu, X, LayoutDashboard, LogOut } from "lucide-react";
import { useUserProfile } from "@/utils/useUserProfile";
import useAuth from "@/utils/useAuth";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      cacheTime: 1000 * 60 * 30,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function Navbar() {
  const [open, setOpen] = useState(false);
  const { data: user, loading } = useUserProfile();
  const { signOut } = useAuth();
  const links = [
    { href: "/", label: "Home" },
    { href: "/services", label: "Services" },
    { href: "/about", label: "About" },
    { href: "/track", label: "Track" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <nav
      style={{
        background: "#0A84FF",
      }}
      className="sticky top-0 z-50 shadow-lg"
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-18 py-3">
          {/* Logo — text only */}
          <a href="/" className="flex items-center">
            <span className="text-2xl font-black text-white tracking-tight">
              DELI<span className="text-yellow-300">VA</span>
            </span>
          </a>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-1">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="text-blue-100 hover:text-white px-4 py-2 rounded-xl font-semibold transition-all hover:bg-white/10 text-sm"
              >
                {l.label}
              </a>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href="/booking"
              className="bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-black text-sm px-5 py-2.5 rounded-xl transition-all shadow-lg"
            >
              Send Package
            </a>
            {!loading && user ? (
              <>
                <a
                  href="/account/profile"
                  title="My profile"
                  className="w-9 h-9 rounded-full overflow-hidden bg-white/15 hover:bg-white/25 flex items-center justify-center transition-all shrink-0"
                >
                  {user.image ? (
                    <img
                      src={user.image}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-white font-black text-sm">
                      {user.name?.[0]?.toUpperCase() || "?"}
                    </span>
                  )}
                </a>
                <a
                  href="/dashboard"
                  className="bg-white/15 hover:bg-white/25 text-white font-bold text-sm px-4 py-2 rounded-xl transition-all flex items-center gap-1.5"
                >
                  <LayoutDashboard size={15} />
                  {user.name?.split(" ")[0] || "Dashboard"}
                </a>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="text-white/80 hover:text-white p-2 rounded-xl hover:bg-white/10 transition-all"
                  title="Sign out"
                >
                  <LogOut size={18} />
                </button>
              </>
            ) : (
              <a
                href="/account/signin"
                className="text-white font-bold text-sm px-4 py-2 rounded-xl hover:bg-white/10 transition-all"
              >
                Sign In
              </a>
            )}
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden text-white p-2 rounded-xl hover:bg-white/10"
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden bg-[#0A70E0] border-t border-white/10 px-4 py-4 space-y-2">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block text-blue-100 hover:text-white font-semibold py-2 px-4 rounded-xl hover:bg-white/10 transition-all"
            >
              {l.label}
            </a>
          ))}
          <div className="pt-3 space-y-2 border-t border-white/10">
            <a
              href="/booking"
              className="block text-center bg-yellow-400 text-gray-900 font-black py-2.5 px-4 rounded-xl"
            >
              Send Package
            </a>
            {!loading && user ? (
              <>
                <a
                  href="/dashboard"
                  className="block text-center bg-white/15 text-white font-bold py-2 px-4 rounded-xl"
                >
                  Dashboard ({user.name?.split(" ")[0] || "Account"})
                </a>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="block w-full text-center text-white/80 font-bold py-2 px-4 rounded-xl hover:bg-white/10"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <a
                href="/account/signin"
                className="block text-center text-white font-bold py-2 px-4 rounded-xl hover:bg-white/10"
              >
                Sign In
              </a>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

function Footer() {
  return (
    <footer
      style={{
        background: "#0F172A",
      }}
      className="text-white pt-16 pb-8 font-poppins"
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          <div>
            <div className="mb-4">
              <span className="text-xl font-black">
                DELI<span className="text-yellow-300">VA</span>
              </span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Fast, reliable & affordable delivery services across urban
              communities.
            </p>
            <div className="flex gap-3 mt-5">
              {[
                { id: "facebook", href: "#" },
                { id: "twitter", href: "#" },
                { id: "instagram", href: "#" },
                { id: "whatsapp", href: "https://wa.me/2348001234567" },
              ].map((s) => (
                <a
                  key={s.id}
                  href={s.href}
                  className="w-9 h-9 bg-white/10 rounded-xl flex items-center justify-center text-gray-300 hover:bg-[#0A84FF] hover:text-white transition-all text-xs font-bold uppercase"
                >
                  {s.id[0]}
                </a>
              ))}
            </div>
          </div>
          <div>
            <div className="font-bold text-sm uppercase tracking-widest text-gray-400 mb-5">
              Company
            </div>
            {[
              { label: "About Us", href: "/about" },
              { label: "Our Services", href: "/services" },
              { label: "Careers", href: "#" },
              { label: "Blog", href: "#" },
            ].map((l) => (
              <a
                key={l.label}
                href={l.href}
                className="block text-gray-400 hover:text-white text-sm py-1.5 transition-colors"
              >
                {l.label}
              </a>
            ))}
          </div>
          <div>
            <div className="font-bold text-sm uppercase tracking-widest text-gray-400 mb-5">
              Services
            </div>
            {[
              "Same-Day Delivery",
              "Business Logistics",
              "Document Delivery",
              "Bulk Transport",
            ].map((l) => (
              <a
                key={l}
                href="/services"
                className="block text-gray-400 hover:text-white text-sm py-1.5 transition-colors"
              >
                {l}
              </a>
            ))}
          </div>
          <div>
            <div className="font-bold text-sm uppercase tracking-widest text-gray-400 mb-5">
              Contact
            </div>
            <div className="space-y-3 text-sm text-gray-400">
              <p>📧 support@deliva.com</p>
              <p>📞 09023021617</p>
              <p>📍 12 Innovation Hub, Makurdi, Benue State</p>
              <p>🕐 24/7 Support Available</p>
            </div>
          </div>
        </div>
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
          <p>© 2026 DELIVA Logistics. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function RootLayout({ children }) {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="font-poppins flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </QueryClientProvider>
  );
}
