"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Card from "@/components/ui/Card";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { format, addDays, startOfWeek, eachDayOfInterval, parseISO } from "date-fns";
import AdminNav from "@/components/admin/AdminNav";

const HOURS = Array.from({ length: 10 }, (_, i) => i + 9);
const CELL_HEIGHT = 64;

const STATUS_COLORS: Record<string, { bg: string; border: string; label: string }> = {
  pending:     { bg: "rgba(139,58,0,0.06)",  border: "var(--color-ink)",  label: "Pending" },
  confirmed:   { bg: "rgba(139,58,0,0.06)",  border: "var(--color-ink)",  label: "Confirmed" },
  in_progress: { bg: "rgba(139,58,0,0.12)", border: "var(--color-ink)",  label: "Arrived" },
  completed:   { bg: "#f0fdf4",              border: "#16a34a",           label: "Completed" },
  no_show:     { bg: "#fee2e2",              border: "#dc2626",           label: "No-show" },
  cancelled:   { bg: "#f3f4f6",              border: "#9ca3af",           label: "Cancelled" },
};

interface Appt {
  id: number;
  scheduledAt: string;
  endsAt: string | null;
  status: string;
  totalAmount: number;
  clientName: string;
  serviceNames: string[];
}

export default function AdminCalendar() {
  const router = useRouter();
  const [weekStart, setWeekStart] = useState<Date | null>(null);
  const [appts, setAppts] = useState<Appt[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<Appt | null>(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    setWeekStart(startOfWeek(new Date(), { weekStartsOn: 1 }));
  }, []);

  const fetchWeek = useCallback((ws: Date) => {
    setLoading(true);
    const from = ws.toISOString();
    const to = addDays(ws, 7).toISOString();
    fetch(`/api/admin/week?from=${from}&to=${to}`)
      .then((r) => { if (r.status === 401) { router.push("/admin/login"); return null; } return r.json(); })
      .then((d) => { if (d) setAppts(d.appointments); })
      .finally(() => setLoading(false));
  }, [router]);

  useEffect(() => { if (weekStart) fetchWeek(weekStart); }, [weekStart, fetchWeek]);

  const weekDays = weekStart ? eachDayOfInterval({ start: weekStart, end: addDays(weekStart, 4) }) : [];

  const updateStatus = async (id: number, status: string) => {
    setUpdating(true);
    await fetch(`/api/admin/appointments/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (weekStart) fetchWeek(weekStart);
    setSelected(null);
    setUpdating(false);
  };

  return (
    <div style={{ minHeight: "100vh" }}>
      <AdminNav active="calendar" />

      <div className="container" style={{ paddingTop: 24, paddingBottom: 64 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <h1 style={{ fontSize: "var(--text-heading)", fontWeight: 600 }}>
              {weekStart ? `${format(weekStart, "MMM d")} – ${format(addDays(weekStart, 4), "MMM d, yyyy")}` : "Loading..."}
            </h1>
            <div style={{ display: "flex", gap: 4 }}>
              <button onClick={() => weekStart && setWeekStart(addDays(weekStart, -7))} style={{ width: 32, height: 32, borderRadius: 8, border: "1px solid var(--color-silver)", background: "white", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <ChevronLeft size={14} />
              </button>
              <button onClick={() => weekStart && setWeekStart(addDays(weekStart, 7))} style={{ width: 32, height: 32, borderRadius: 8, border: "1px solid var(--color-silver)", background: "white", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
          {loading && <span style={{ fontSize: "var(--text-caption)", color: "var(--color-stone)" }}>Loading...</span>}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: selected ? "1fr 280px" : "1fr", gap: 24, alignItems: "start" }}>
          <Card padding="none" style={{ overflow: "auto" }}>
            <div style={{ minWidth: 600 }}>
              {/* Header */}
              <div style={{ display: "grid", gridTemplateColumns: "60px repeat(5, 1fr)", borderBottom: "1px solid var(--color-silver)" }}>
                <div style={{ padding: 12 }} />
                {weekDays.map((day, i) => (
                  <div key={i} style={{ padding: "12px 8px", borderLeft: "1px solid var(--color-silver)", textAlign: "center" }}>
                    <p style={{ fontSize: "var(--text-caption)", color: "var(--color-stone)", textTransform: "uppercase", letterSpacing: "0.5px" }}>{format(day, "EEE")}</p>
                    <p style={{ fontFamily: "var(--font-heading)", fontSize: 20, fontWeight: 600, lineHeight: 1.2 }}>{format(day, "d")}</p>
                  </div>
                ))}
              </div>

              {/* Grid */}
              <div style={{ position: "relative" }}>
                {HOURS.map((hour) => (
                  <div key={hour} style={{ display: "grid", gridTemplateColumns: "60px repeat(5, 1fr)", height: CELL_HEIGHT }}>
                    <div style={{ padding: "4px 8px", display: "flex", alignItems: "flex-start", justifyContent: "flex-end" }}>
                      <span style={{ fontSize: 11, color: "var(--color-stone)", fontWeight: 500 }}>{hour}:00</span>
                    </div>
                    {weekDays.map((_, di) => (
                      <div key={di} style={{ borderLeft: "1px solid var(--color-silver)", borderBottom: "1px solid var(--color-silver)", position: "relative" }} />
                    ))}
                  </div>
                ))}

                {/* Appointment blocks */}
                {appts.map((appt) => {
                  const start = parseISO(appt.scheduledAt);
                  const end = appt.endsAt ? parseISO(appt.endsAt) : new Date(start.getTime() + 60 * 60000);
                  const dayIndex = weekDays.findIndex((d) => format(d, "yyyy-MM-dd") === format(start, "yyyy-MM-dd"));
                  if (dayIndex < 0) return null;
                  const startH = start.getHours() + start.getMinutes() / 60;
                  const durationH = (end.getTime() - start.getTime()) / 3600000;
                  if (startH < 9 || startH >= 19) return null;
                  const top = (startH - 9) * CELL_HEIGHT;
                  const height = Math.max(durationH * CELL_HEIGHT - 4, 24);
                  const left = `calc(60px + ${dayIndex} * (100% - 60px) / 5 + 4px)`;
                  const width = `calc((100% - 60px) / 5 - 8px)`;
                  const sc = STATUS_COLORS[appt.status] || STATUS_COLORS.pending;
                  return (
                    <div key={appt.id} onClick={() => setSelected(selected?.id === appt.id ? null : appt)} style={{
                      position: "absolute", top: top + 2, left, width, height,
                      background: sc.bg, borderLeft: `3px solid ${sc.border}`,
                      borderRadius: "0 6px 6px 0", padding: "4px 8px",
                      cursor: "pointer", overflow: "hidden",
                    }}>
                      <p style={{ fontSize: 11, fontWeight: 600, color: "var(--color-graphite)", marginBottom: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{appt.clientName}</p>
                      <p style={{ fontSize: 10, color: "var(--color-slate)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{appt.serviceNames.join(", ")}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </Card>

          {/* Detail panel */}
          {selected && (
            <div style={{ position: "sticky", top: 80 }}>
              <Card padding="md">
                <p style={{ fontSize: "var(--text-body-sm)", fontWeight: 600, marginBottom: 4 }}>{selected.clientName}</p>
                <p style={{ fontSize: "var(--text-caption)", color: "var(--color-slate)", marginBottom: 4 }}>
                  {format(parseISO(selected.scheduledAt), "EEE, MMM d 'at' h:mm a")}
                </p>
                <p style={{ fontSize: "var(--text-caption)", color: "var(--color-slate)", marginBottom: 16 }}>
                  {selected.serviceNames.join(", ")}
                </p>
                <p style={{ fontSize: "var(--text-body-sm)", fontWeight: 700, marginBottom: 16 }}>
                  KES {selected.totalAmount.toLocaleString()}
                </p>

                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {selected.status === "pending" && (
                    <button
                      onClick={() => updateStatus(selected.id, "confirmed")}
                      disabled={updating}
                      className="btn-primary btn-rect"
                      style={{ width: "100%", justifyContent: "center", fontSize: 13 }}
                    >
                      Client arrived
                    </button>
                  )}
                  {selected.status === "confirmed" && (
                    <button
                      onClick={() => updateStatus(selected.id, "completed")}
                      disabled={updating}
                      className="btn-primary btn-rect"
                      style={{ width: "100%", justifyContent: "center", fontSize: 13 }}
                    >
                      Mark complete
                    </button>
                  )}
                  {selected.status !== "no_show" && selected.status !== "completed" && selected.status !== "pending" && (
                    <button
                      onClick={() => updateStatus(selected.id, "no_show")}
                      disabled={updating}
                      className="btn-secondary btn-rect"
                      style={{ width: "100%", justifyContent: "center", fontSize: 13, color: "#dc2626", borderColor: "#fca5a5" }}
                    >
                      No-show
                    </button>
                  )}
                </div>
              </Card>
            </div>
          )}
        </div>

        {/* Legend */}
        <div style={{ display: "flex", gap: 16, marginTop: 16, flexWrap: "wrap" }}>
          {Object.entries(STATUS_COLORS).map(([key, val]) => (
            <div key={key} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 12, height: 12, borderRadius: 2, background: val.bg, border: `2px solid ${val.border}` }} />
              <span style={{ fontSize: "var(--text-caption)", color: "var(--color-slate)" }}>{val.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
