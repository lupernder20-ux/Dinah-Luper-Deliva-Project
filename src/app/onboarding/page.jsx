import { useState, useEffect } from "react";
import useUser from "@/utils/useUser";

function MainComponent() {
  const { data: user, loading: userLoading } = useUser();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("customer");
  const [vehicleType, setVehicleType] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const pendingRole = localStorage.getItem("pendingRole");
      if (pendingRole) setRole(pendingRole);
    }
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!phone) {
      setError("Phone number is required");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role,
          phone,
          vehicle_type: role === "rider" ? vehicleType : null,
          license_number: role === "rider" ? licenseNumber : null,
        }),
      });

      if (!res.ok) throw new Error("Failed to complete onboarding");

      // Clear pending data
      localStorage.removeItem("pendingRole");
      localStorage.removeItem("pendingName");

      window.location.href = "/dashboard";
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  if (userLoading)
    return (
      <div className="flex h-screen items-center justify-center">
        Loading...
      </div>
    );

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-[#F8FAFC] p-4 font-poppins">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl border border-gray-100"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#0A84FF]">
            Welcome to DELIVA
          </h1>
          <p className="text-gray-500 mt-2">
            Just a few more details to set up your profile
          </p>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Phone Number
            </label>
            <input
              required
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g. +234 800 000 0000"
              className="w-full rounded-lg border border-gray-200 px-4 py-3 outline-none focus:border-[#0A84FF] focus:ring-1 focus:ring-[#0A84FF]"
            />
          </div>

          {role === "rider" && (
            <>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Vehicle Type
                </label>
                <select
                  required
                  value={vehicleType}
                  onChange={(e) => setVehicleType(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 px-4 py-3 outline-none focus:border-[#0A84FF] focus:ring-1 focus:ring-[#0A84FF]"
                >
                  <option value="">Select vehicle</option>
                  <option value="Motorcycle">Motorcycle</option>
                  <option value="Bicycle">Bicycle</option>
                  <option value="Car">Car</option>
                  <option value="Van">Van</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  License Number
                </label>
                <input
                  required
                  type="text"
                  value={licenseNumber}
                  onChange={(e) => setLicenseNumber(e.target.value)}
                  placeholder="ABC-123-XYZ"
                  className="w-full rounded-lg border border-gray-200 px-4 py-3 outline-none focus:border-[#0A84FF] focus:ring-1 focus:ring-[#0A84FF]"
                />
              </div>
            </>
          )}

          {error && (
            <div className="rounded-lg bg-red-50 p-3 text-sm text-red-500">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-[#0A84FF] px-4 py-3 text-base font-semibold text-white transition-all hover:bg-[#0070E0] focus:outline-none disabled:opacity-50"
          >
            {loading ? "Completing Profile..." : "Complete Setup"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default MainComponent;
