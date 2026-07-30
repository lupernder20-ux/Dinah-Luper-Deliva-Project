"use client";
import { useQuery } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { MessageSquare, Star } from "lucide-react";

const TYPE_LABELS = {
  contact: { label: "General", bg: "#EFF6FF", text: "#2563EB" },
  feedback: { label: "Feedback", bg: "#F5F3FF", text: "#7C3AED" },
  report: { label: "Report", bg: "#FFF1F2", text: "#BE123C" },
};

const STATUS_LABELS = {
  open: { label: "Open", bg: "#FFFBEB", text: "#D97706" },
  in_progress: { label: "In Progress", bg: "#EFF6FF", text: "#2563EB" },
  resolved: { label: "Resolved", bg: "#DCFCE7", text: "#15803D" },
};

export default function MyMessagesCard({ userId }) {
  const { data, isLoading } = useQuery({
    queryKey: ["my-messages", userId],
    queryFn: async () => {
      const res = await fetch("/api/messages");
      if (!res.ok) throw new Error("Failed to fetch messages");
      return res.json();
    },
    enabled: !!userId,
    refetchInterval: 60000,
  });

  const messages = data?.messages || [];

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden mb-8">
      <div
        style={{ background: "linear-gradient(135deg, #F8FAFF 0%, #F3F4FF 100%)" }}
        className="px-6 py-5 border-b border-gray-100 flex items-center justify-between"
      >
        <h2 className="text-xl font-black text-gray-900 flex items-center gap-2">
          <MessageSquare size={18} className="text-[#7C3AED]" /> My Messages
          &amp; Support
        </h2>
        <a
          href="/contact"
          className="text-[#0A84FF] text-sm font-bold hover:underline"
        >
          Send us a message →
        </a>
      </div>

      <div className="p-6">
        {isLoading ? (
          <div className="text-center py-10 text-gray-400 text-sm">
            Loading your messages...
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-10">
            <div className="text-4xl mb-3">💬</div>
            <p className="text-gray-500 text-sm">
              No messages yet. Have feedback or a problem to report? Reach out
              any time.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((m) => {
              const typeInfo = TYPE_LABELS[m.type] || TYPE_LABELS.contact;
              const statusInfo = STATUS_LABELS[m.status] || STATUS_LABELS.open;
              return (
                <div
                  key={m.id}
                  className="border border-gray-100 rounded-2xl p-4 bg-gray-50/50"
                >
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span
                      style={{ backgroundColor: typeInfo.bg, color: typeInfo.text }}
                      className="text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wide"
                    >
                      {typeInfo.label}
                    </span>
                    <span
                      style={{ backgroundColor: statusInfo.bg, color: statusInfo.text }}
                      className="text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wide"
                    >
                      {statusInfo.label}
                    </span>
                    {m.tracking_id && (
                      <span className="text-[10px] font-black px-2.5 py-1 rounded-full bg-white border border-gray-100 text-gray-500">
                        {m.tracking_id}
                      </span>
                    )}
                    {m.rating && (
                      <span className="flex items-center gap-0.5 text-amber-500">
                        {Array.from({ length: m.rating }).map((_, i) => (
                          <Star key={i} size={12} fill="currentColor" />
                        ))}
                      </span>
                    )}
                    <span className="text-xs text-gray-400 ml-auto">
                      {formatDistanceToNow(new Date(m.created_at), { addSuffix: true })}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 mb-2">{m.message}</p>
                  {m.admin_reply ? (
                    <div
                      style={{ background: "linear-gradient(135deg, #EFF6FF, #F5F3FF)" }}
                      className="rounded-xl px-4 py-3 border border-blue-100"
                    >
                      <div className="text-[10px] font-black text-[#0A84FF] uppercase tracking-widest mb-1">
                        Deliva Support
                      </div>
                      <p className="text-sm text-gray-700">{m.admin_reply}</p>
                    </div>
                  ) : (
                    <p className="text-xs text-gray-400 italic">
                      Awaiting a reply from our support team.
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
