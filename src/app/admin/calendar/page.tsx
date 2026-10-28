"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { format, addDays, startOfWeek, eachDayOfInterval } from "date-fns";

const HOURS = Array.from({ length: 10 }, (_, i) => i + 9);

const APPOINTMENTS = [
  { id: 1, client: "Amara Osei", service: "Hydra Facial", therapist: "Fatima H.", room: "Room 1", day: 0, startHour: 9, durationH: 1, status: "completed" },
  { id: 2, client: "Naledi Dlamini", service: "Carbon Laser", therapist: "Naledi D.", room: "Laser Suite", day: 0, startHour: 10, durationH: 1, status: "in_progress" },
  { id: 3, client: "Grace Mutua", service: "Chemical Peel", therapist: "Amara O.", room: "Room 2", day: 0, startHour: 11, durationH: 0.75, status: "confirmed" },
  { id: 4, client: "Keisha Mensah", service: "Laser Hair Removal", therapist: "Naledi D.", room: "Laser Suite", day: 0, startHour: 13, durationH: 1.5, status: "confirmed" },
  { id: 5, client: "Zara Ahmed", service: "Body Contouring", therapist: "Fatima H.", room: "Room 3", day: 1, startHour: 10, durationH: 0.75, status: "confirmed" },
  { id: 6, client: "Priya Nair", service: "Brightening Facial", therapist: "Amara O.", room: "Room 1", day: 2, startHour: 9, durationH: 1, status: "confirmed" },
  { id: 7, client: "Josephine Badu", service: "IPL Photofacial", therapist: "Naledi D.", room: "Laser Suite", day: 2, startHour: 14, durationH: 0.75, status: "confirmed" },
];

const statusColors: Record<string, string> = {
  completed: "#dcfce7",
  in_progress: "#dbeafe",
  confirmed: "#f0f9ff",
  pending: "#fef9c3",
  no_show: "#fee2e2",
};
const statusBorderColors: Record<string, string> = {
  completed: "#16a34a",
  in_progress: "#2563eb",
  confirmed: "#0099ff",
  pending: "#ca8a04",
  no_show: "#dc2626",
};

const navLinks = [
  { label: "Overview", href: "/admin" },
  { label: "Calendar", href: "/admin/calendar", active: true },
  { label: "Clients", href: "/admin/clients" },
  { label: "Services", href: "/admin/services" },
];

const CELL_HEIGHT = 64;

export default function AdminCalendar() {
  const [weekStart, setWeekStart] = useState<Date | null>(null);

  useEffect(() => {
    setWeekStart(startOfWeek(new Date(), { weekStartsOn: 1 }));
  }, []);

  const weekDays = weekStart
    ? eachDayOfInterval({ start: weekStart, end: addDays(weekStart, 4) })
    : [];

  return (
    <div style={{ minHeight: "100vh" }}>
      <header style={{ background: "var(--color-ink)", padding: "0 24px", height: 56, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
          <span style={{ fontFamily: "var(--font-heading)", fontWeight: 600, fontSize: 16, color: "white" }}>Vitapharm Admin</span>
          <nav style={{ display: "flex", gap: 4 }}>
            {navLinks.map((l) => (
              <Link key={l.href} href={l.href} style={{
                padding: "6px 12px", borderRadius: 6, fontSize: "var(--text-body-sm)",
                color: l.active ? "white" : "rgba(255,255,255,0.6)",
                background: l.active ? "rgba(255,255,255,0.12)" : "transparent",
                textDecoration: "none",
              }}>
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
        <Link href="/" style={{ fontSize: "var(--text-body-sm)", color: "rgba(255,255,255,0.6)", textDecoration: "none" }}>← Back to site</Link>
      </header>

      <div className="container" style={{ paddingTop: 24, paddingBottom: 64 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <h1 style={{ fontSize: "var(--text-heading)", fontWeight: 600 }}>
              {weekStart ? `Week of ${format(weekStart, "MMM d")} — ${format(addDays(weekStart, 4), "MMM d, yyyy")}` : "Loading…"}
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
          <button className="btn-primary btn-rect" style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13 }}>
            <Plus size={14} /> Add booking
          </button>
        </div>

        <Card padding="none" style={{ overflow: "auto" }}>
          <div style={{ minWidth: 700 }}>
            {/* Header row */}
            <div style={{ display: "grid", gridTemplateColumns: "60px repeat(5, 1fr)", borderBottom: "1px solid var(--color-silver)" }}>
              <div style={{ padding: 12 }} />
              {weekDays.map((day, i) => (
                <div key={i} style={{ padding: "12px 8px", borderLeft: "1px solid var(--color-silver)", textAlign: "center" }}>
                  <p style={{ fontSize: "var(--text-caption)", color: "var(--color-stone)", textTransform: "uppercase", letterSpacing: "0.5px" }}>{format(day, "EEE")}</p>
                  <p style={{ fontFamily: "var(--font-heading)", fontSize: 20, fontWeight: 600, lineHeight: 1.2 }}>{format(day, "d")}</p>
                </div>
              ))}
            </div>

            {/* Time grid */}
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
              {APPOINTMENTS.map((appt) => {
                const top = (appt.startHour - 9) * CELL_HEIGHT;
                const height = appt.durationH * CELL_HEIGHT - 4;
                const left = `calc(60px + ${appt.day} * (100% - 60px) / 5 + 4px)`;
                const width = `calc((100% - 60px) / 5 - 8px)`;

                return (
                  <div
                    key={appt.id}
                    style={{
                      position: "absolute",
                      top: top + 2,
                      left,
                      width,
                      height,
                      background: statusColors[appt.status] || "#f0f9ff",
                      borderLeft: `3px solid ${statusBorderColors[appt.status] || "#0099ff"}`,
                      borderRadius: "0 6px 6px 0",
                      padding: "4px 8px",
                      cursor: "pointer",
                      overflow: "hidden",
                    }}
                  >
                    <p style={{ fontSize: 11, fontWeight: 600, color: "var(--color-graphite)", marginBottom: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{appt.client}</p>
                    <p style={{ fontSize: 10, color: "var(--color-slate)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{appt.service} · {appt.therapist}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </Card>

        {/* Legend */}
        <div style={{ display: "flex", gap: 16, marginTop: 16, flexWrap: "wrap" }}>
          {[
            { label: "Completed", color: "#16a34a", bg: "#dcfce7" },
            { label: "In progress", color: "#2563eb", bg: "#dbeafe" },
            { label: "Confirmed", color: "#0099ff", bg: "#f0f9ff" },
            { label: "No-show", color: "#dc2626", bg: "#fee2e2" },
          ].map((l) => (
            <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 12, height: 12, borderRadius: 2, background: l.bg, border: `2px solid ${l.color}` }} />
              <span style={{ fontSize: "var(--text-caption)", color: "var(--color-slate)" }}>{l.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
