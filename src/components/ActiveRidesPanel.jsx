"use client";
import { useQuery } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { Radio } from "lucide-react";
import { statusColors } from "@/utils/deliveryStatus";

export default function ActiveRidesPanel() {
  const { data, isLoading } = useQuery({
    queryKey: ["admin-active-deliveries"],
    queryFn: async () => {
      const res = await fetch("/api/admin/active-deliveries");
      if (!res.ok) throw new Error("Failed to fetch active deliveries");
      return res.json();
    },
    refetchInterval: 15000,
  });

  const deliveries = data?.deliveries || [];

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden mb-8">
      <div
        style={{ background: "linear-gradient(135deg, #F8FAFF 0%, #F5F3FF 100%)" }}
        className="px-6 py-5 border-b border-gray-100 flex items-center justify-between"
      >
        <h3 className="text-xl font-black text-gray-900 flex items-center gap-2">
          <Radio size={18} className="text-[#00C853] animate-pulse" /> Active
          Rides &amp; Bookings
        </h3>
        <span className="text-xs bg-green-50 text-green-600 font-bold px-3 py-1.5 rounded-full">
          {deliveries.length} in progress · updates every 15s
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50/70">
              {["Tracking ID", "Customer", "Rider", "Status", "Placed", "Cost"].map(
                (h) => (
                  <th
                    key={h}
                    className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest"
                  >
                    {h}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {isLoading ? (
              <tr>
                <td colSpan="6" className="px-6 py-16 text-center text-gray-400">
                  Loading active rides...
                </td>
              </tr>
            ) : deliveries.length > 0 ? (
              deliveries.map((d) => {
                const sc = statusColors[d.status] || statusColors.Pending;
                return (
                  <tr key={d.id} className="hover:bg-green-50/20 transition-colors">
                    <td className="px-6 py-4">
                      <span
                        style={{ background: "linear-gradient(135deg, #EFF6FF, #F5F3FF)" }}
                        className="font-black text-[#0A84FF] text-xs px-3 py-1.5 rounded-lg"
                      >
                        {d.tracking_id}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-800">
                      {d.customer_name || "—"}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-500">
                      {d.rider_name || "Unassigned"}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        style={{ backgroundColor: sc.bg, color: sc.text }}
                        className="text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-wide"
                      >
                        {d.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {formatDistanceToNow(new Date(d.created_at), { addSuffix: true })}
                    </td>
                    <td className="px-6 py-4 font-black text-gray-900">
                      ₦{Number(d.cost).toLocaleString()}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="6" className="px-6 py-16 text-center text-gray-400 italic">
                  No active rides right now — all deliveries are complete.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
