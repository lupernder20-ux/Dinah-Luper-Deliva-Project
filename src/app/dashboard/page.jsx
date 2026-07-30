import { useEffect } from "react";
import { useUserProfile } from "@/utils/useUserProfile";

export default function DashboardPage() {
  const { data: user, loading } = useUserProfile();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      window.location.href = "/account/signin";
      return;
    }

    if (!user.role) {
      window.location.href = "/onboarding";
      return;
    }

    // Redirect based on role
    window.location.href = `/dashboard/${user.role}`;
  }, [user, loading]);

  return (
    <div className="flex min-h-screen items-center justify-center font-poppins">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-[#0A84FF] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <h1 className="text-xl font-bold text-gray-800">
          Setting up your dashboard...
        </h1>
      </div>
    </div>
  );
}
