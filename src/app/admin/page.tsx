"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import AdminNav from "@/components/admin/AdminNav";
import { TrendingUp, Users, Calendar, DollarSign, AlertCircle, ChevronRight, CheckCircle, Clock, XCircle } from "lucide-react";
import { format, parseISO } from "date-fns";

interface Stats {
  todayCount: number;
  todayRevenue: number;
  totalClients: number;
  noShows30d: number;
}

interface Appointment {
  id: number;
  scheduledAt: string;
  status: string;
  totalAmount: number;
  clientName: string;
  serviceNames: string[];
}

const statusConfig: Record<string, { label: string; color: "green" | "blue" | "default" | "orange" | "red"; icon: React.ComponentType<{ size?: number; color?: string }> }> = {
  completed: { label: "Completed", color: "green", icon: CheckCircle },
  in_progress: { label: "In progress", color: "blue", icon: Clock },
  confirmed: { label: "Confirmed", color: "default", icon: Calendar },
  pending: { label: "Pending", color: "orange", icon: Clock },
  no_show: { label: "No-show", color: "red", icon: XCircle },
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<number | null>(null);

  const loadData = () => {
    Promise.all([
      fetch("/api/admin/stats").then((r) => r.json()),
      fetch("/api/admin/today").then((r) => r.json()),
    ]).then(([s, t]) => {
      setStats(s);
      setAppointments(t.appointments ?? []);
      setLoading(false);
    }).catch(() => setLoading(false));
  };

  useEffect(() => { loadData(); }, []);

  const updateStatus = async (id: number, status: string) => {
    setUpdating(id);
    await fetch(`/api/admin/appointments/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    loadData();
    setUpdating(null);
  };

  const today = new Date();
  const greeting = today.getHours() < 12 ? "Good morning" : today.getHours() < 17 ? "Good afternoon" : "Good evening";

  return (
    <div style={{ minHeight: "100vh" }}>
      <AdminNav active="Overview" />

      <div className="container" style={{ paddingTop: 32, paddingBottom: 64 }}>
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: "clamp(24px, 3vw, 36px)", fontWeight: 600, letterSpacing: "0.3px" }}>{greeting}, Admin</h1>
          <p style={{ fontSize: "var(--text-body-sm)", color: "var(--color-slate)" }}>
            {format(today, "EEEE, d MMMM yyyy")} · {loading ? "…" : `${stats?.todayCount ?? 0} appointments today`}
          </p>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16, marginBottom: 32 }}>
          {[
            { label: "Revenue today", value: loading ? "…" : `KES ${(stats?.todayRevenue ?? 0).toLocaleString()}`, icon: DollarSign, color: "#16a34a" },
            { label: "Appointments today", value: loading ? "…" : String(stats?.todayCount ?? 0), icon: Calendar, color: "var(--color-ink)" },
            { label: "Total clients", value: loading ? "…" : (stats?.totalClients ?? 0).toLocaleString(), icon: Users, color: "var(--color-graphite)" },
            { label: "No-shows (30d)", value: loading ? "…" : String(stats?.noShows30d ?? 0), icon: AlertCircle, color: "#ea580c" },
          ].map((s) => (
            <Card key={s.label} padding="md">
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 12 }}>
                <p style={{ fontSize: "var(--text-body-sm)", color: "var(--color-slate)", fontWeight: 400 }}>{s.label}</p>
                <div style={{ width: 32, height: 32, background: "var(--color-paper)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <s.icon size={15} color={s.color} />
                </div>
              </div>
              <p style={{ fontFamily: "var(--font-heading)", fontSize: 28, fontWeight: 600, lineHeight: 1.1 }}>{s.value}</p>
            </Card>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 24 }}>
          {/* Today's schedule */}
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <h2 style={{ fontSize: "var(--text-heading)", fontWeight: 600 }}>Today&apos;s schedule</h2>
              <Link href="/admin/calendar" style={{ fontSize: "var(--text-body-sm)", color: "var(--color-ink)", textDecoration: "none", display: "flex", alignItems: "center", gap: 4 }}>
                Full calendar <ChevronRight size={14} />
              </Link>
            </div>

            {loading ? (
              <Card padding="md"><p style={{ fontSize: "var(--text-body-sm)", color: "var(--color-slate)" }}>Loading…</p></Card>
            ) : appointments.length === 0 ? (
              <Card padding="md"><p style={{ fontSize: "var(--text-body-sm)", color: "var(--color-slate)" }}>No appointments scheduled for today.</p></Card>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {appointments.map((appt) => {
                  const sc = statusConfig[appt.status] ?? statusConfig.pending;
                  const time = (() => { try { return format(parseISO(appt.scheduledAt), "HH:mm"); } catch { return "—"; } })();
                  return (
                    <Card key={appt.id} padding="md" hover>
                      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                        <div style={{ textAlign: "center", minWidth: 52 }}>
                          <p style={{ fontFamily: "var(--font-heading)", fontSize: 16, fontWeight: 600, lineHeight: 1.1 }}>{time}</p>
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                            <p style={{ fontSize: "var(--text-body-sm)", fontWeight: 600 }}>{appt.clientName}</p>
                            <Badge color={sc.color}>{sc.label}</Badge>
                          </div>
                          <p style={{ fontSize: "var(--text-caption)", color: "var(--color-slate)" }}>
                            {appt.serviceNames.join(", ") || "—"}
                          </p>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                          <p style={{ fontSize: "var(--text-body-sm)", fontWeight: 600 }}>
                            KES {appt.totalAmount.toLocaleString()}
                          </p>
                          {appt.status === "confirmed" || appt.status === "pending" ? (
                            <div style={{ display: "flex", gap: 6 }}>
                              <button
                                onClick={() => updateStatus(appt.id, "in_progress")}
                                disabled={updating === appt.id}
                                style={{ fontSize: 12, padding: "5px 10px", background: "var(--color-ink)", color: "white", border: "none", borderRadius: 6, cursor: "pointer", fontFamily: "var(--font-body)", whiteSpace: "nowrap" }}
                              >
                                Arrived
                              </button>
                              <button
                                onClick={() => updateStatus(appt.id, "no_show")}
                                disabled={updating === appt.id}
                                style={{ fontSize: 12, padding: "5px 10px", background: "white", color: "#dc2626", border: "1px solid #fca5a5", borderRadius: 6, cursor: "pointer", fontFamily: "var(--font-body)" }}
                              >
                                No-show
                              </button>
                            </div>
                          ) : appt.status === "in_progress" ? (
                            <button
                              onClick={() => updateStatus(appt.id, "completed")}
                              disabled={updating === appt.id}
                              style={{ fontSize: 12, padding: "5px 10px", background: "var(--color-ink)", color: "white", border: "none", borderRadius: 6, cursor: "pointer", fontFamily: "var(--font-body)", whiteSpace: "nowrap" }}
                            >
                              Complete
                            </button>
                          ) : null}
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>

          {/* Quick actions */}
          <div>
            <Card padding="md">
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                <TrendingUp size={16} />
                <h3 style={{ fontSize: "var(--text-body-sm)", fontWeight: 600 }}>Quick actions</h3>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {[
                  { label: "View calendar", href: "/admin/calendar" },
                  { label: "Client list", href: "/admin/clients" },
                  { label: "Manage services", href: "/admin/services" },
                ].map((a) => (
                  <Link key={a.href} href={a.href} style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "10px 12px", background: "var(--color-paper)", borderRadius: 8,
                    textDecoration: "none", fontSize: "var(--text-body-sm)", color: "var(--color-graphite)",
                  }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "var(--color-silver)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "var(--color-paper)")}
                  >
                    {a.label} <ChevronRight size={14} color="var(--color-stone)" />
                  </Link>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
