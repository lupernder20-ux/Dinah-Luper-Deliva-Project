"use client";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { MessageSquare, Star, CheckCircle2, Send } from "lucide-react";

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

const FILTERS = [
  { value: "all", label: "All" },
  { value: "open", label: "Open" },
  { value: "in_progress", label: "In Progress" },
  { value: "resolved", label: "Resolved" },
];

export default function FeedbackInbox() {
  const [filter, setFilter] = useState("all");
  const [drafts, setDrafts] = useState({});
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["admin-messages", filter],
    queryFn: async () => {
      const url =
        filter === "all" ? "/api/admin/messages" : `/api/admin/messages?status=${filter}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch messages");
      return res.json();
    },
    refetchInterval: 30000,
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, body }) => {
      const res = await fetch(`/api/admin/messages/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error("Failed to update message");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-messages"] });
    },
  });

  const messages = data?.messages || [];

  const sendReply = (id) => {
    const reply = (drafts[id] || "").trim();
    if (!reply) return;
    updateMutation.mutate({
      id,
      body: { admin_reply: reply, status: "in_progress" },
    });
    setDrafts((prev) => ({ ...prev, [id]: "" }));
  };

  const markResolved = (id) => {
    updateMutation.mutate({ id, body: { status: "resolved" } });
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
      <div
        style={{ background: "linear-gradient(135deg, #F8FAFF 0%, #F5F3FF 100%)" }}
        className="px-6 py-5 border-b border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
      >
        <h3 className="text-xl font-black text-gray-900 flex items-center gap-2">
          <MessageSquare size={18} className="text-[#7C3AED]" /> Feedback &amp;
          Reports
        </h3>
        <div className="flex items-center gap-2 flex-wrap">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`text-xs font-black px-3 py-1.5 rounded-full transition-all ${
                filter === f.value
                  ? "bg-[#0A84FF] text-white"
                  : "bg-gray-50 text-gray-500 hover:bg-gray-100"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="divide-y divide-gray-50">
        {isLoading ? (
          <div className="px-6 py-16 text-center text-gray-400">
            Loading messages...
          </div>
        ) : messages.length === 0 ? (
          <div className="px-6 py-16 text-center text-gray-400 italic">
            No messages in this view.
          </div>
        ) : (
          messages.map((m) => {
            const typeInfo = TYPE_LABELS[m.type] || TYPE_LABELS.contact;
            const statusInfo = STATUS_LABELS[m.status] || STATUS_LABELS.open;
            return (
              <div key={m.id} className="px-6 py-5">
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
                    <span className="text-[10px] font-black px-2.5 py-1 rounded-full bg-gray-50 text-gray-500">
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
                <div className="text-sm font-semibold text-gray-800 mb-1">
                  {m.customer_name || m.name || "Anonymous"}{" "}
                  <span className="text-gray-400 font-normal">
                    {m.customer_email || m.email ? `· ${m.customer_email || m.email}` : ""}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-3">{m.message}</p>

                {m.admin_reply && (
                  <div
                    style={{ background: "linear-gradient(135deg, #EFF6FF, #F5F3FF)" }}
                    className="rounded-xl px-4 py-3 mb-3 border border-blue-100"
                  >
                    <div className="text-[10px] font-black text-[#0A84FF] uppercase tracking-widest mb-1">
                      Admin Reply
                    </div>
                    <p className="text-sm text-gray-700">{m.admin_reply}</p>
                  </div>
                )}

                {m.status !== "resolved" && (
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="text"
                      value={drafts[m.id] || ""}
                      onChange={(e) =>
                        setDrafts((prev) => ({ ...prev, [m.id]: e.target.value }))
                      }
                      placeholder="Write a reply..."
                      className="flex-1 bg-gray-50 border border-gray-100 rounded-xl py-2.5 px-4 text-sm outline-none focus:ring-2 focus:ring-[#0A84FF] font-medium"
                    />
                    <button
                      onClick={() => sendReply(m.id)}
                      disabled={updateMutation.isPending || !(drafts[m.id] || "").trim()}
                      className="flex items-center justify-center gap-1.5 bg-[#0A84FF] text-white px-4 py-2.5 rounded-xl font-black text-xs hover:opacity-90 disabled:opacity-40 transition-all"
                    >
                      <Send size={14} /> Reply
                    </button>
                    <button
                      onClick={() => markResolved(m.id)}
                      disabled={updateMutation.isPending}
                      className="flex items-center justify-center gap-1.5 bg-gray-100 text-gray-700 px-4 py-2.5 rounded-xl font-black text-xs hover:bg-gray-200 disabled:opacity-40 transition-all"
                    >
                      <CheckCircle2 size={14} /> Resolve
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
