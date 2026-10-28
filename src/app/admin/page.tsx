"use client";

import Link from "next/link";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { TrendingUp, Users, Calendar, DollarSign, AlertCircle, ChevronRight, CheckCircle, Clock, XCircle } from "lucide-react";

const stats = [
  { label: "Revenue today", value: "KES 47,500", change: "+12%", icon: DollarSign, color: "#16a34a" },
  { label: "Appointments today", value: "14", change: "+3 vs yesterday", icon: Calendar, color: "var(--color-action-blue)" },
  { label: "Total clients", value: "2,041", change: "+8 this week", icon: Users, color: "var(--color-graphite)" },
  { label: "No-shows (30d)", value: "3", change: "2 restricted", icon: AlertCircle, color: "#ea580c" },
];

const todayAppointments = [
  { id: "VP-001", time: "09:00", client: "Amara Osei", services: "Hydra Facial", therapist: "Fatima H.", status: "completed", amount: 4500 },
  { id: "VP-002", time: "10:00", client: "Naledi Dlamini", services: "Carbon Laser Facial", therapist: "Naledi D.", status: "in_progress", amount: 6000 },
  { id: "VP-003", time: "11:00", client: "Grace Mutua", services: "Chemical Peel + Consultation", therapist: "Amara O.", status: "confirmed", amount: 5300 },
  { id: "VP-004", time: "13:00", client: "Keisha Mensah", services: "Laser Hair Removal", therapist: "Naledi D.", status: "confirmed", amount: 6500 },
  { id: "VP-005", time: "14:30", client: "Zara Ahmed", services: "Body Contouring", therapist: "Fatima H.", status: "pending", amount: 5500 },
];

const statusConfig: Record<string, { label: string; color: "green" | "blue" | "default" | "orange" | "red"; icon: React.ComponentType<{size?: number; color?: string}> }> = {
  completed: { label: "Completed", color: "green", icon: CheckCircle },
  in_progress: { label: "In progress", color: "blue", icon: Clock },
  confirmed: { label: "Confirmed", color: "default", icon: Calendar },
  pending: { label: "Pending", color: "orange", icon: Clock },
  no_show: { label: "No-show", color: "red", icon: XCircle },
};

const navLinks = [
  { label: "Overview", href: "/admin", active: true },
  { label: "Calendar", href: "/admin/calendar" },
  { label: "Clients", href: "/admin/clients" },
  { label: "Services", href: "/admin/services" },
];

export default function AdminDashboard() {
  return (
    <div style={{ minHeight: "100vh" }}>
      {/* Admin Header */}
      <header style={{ background: "var(--color-ink)", padding: "0 24px", height: 56, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
          <span style={{ fontFamily: "var(--font-heading)", fontWeight: 600, fontSize: 16, color: "white" }}>Vitapharm Admin</span>
          <nav style={{ display: "flex", gap: 4 }}>
            {navLinks.map((l) => (
              <Link key={l.href} href={l.href} style={{
                padding: "6px 12px", borderRadius: 6, fontSize: "var(--text-body-sm)",
                color: l.active ? "white" : "rgba(255,255,255,0.6)",
                background: l.active ? "rgba(255,255,255,0.12)" : "transparent",
                textDecoration: "none", transition: "all 0.15s ease",
              }}>
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
        <Link href="/" style={{ fontSize: "var(--text-body-sm)", color: "rgba(255,255,255,0.6)", textDecoration: "none" }}>
          ← Back to site
        </Link>
      </header>

      <div className="container" style={{ paddingTop: 32, paddingBottom: 64 }}>
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: "clamp(24px, 3vw, 36px)", fontWeight: 600, letterSpacing: "0.3px" }}>Good morning, Admin</h1>
          <p style={{ fontSize: "var(--text-body-sm)", color: "var(--color-slate)" }}>Tuesday, 28 October 2026 · 14 appointments today</p>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16, marginBottom: 32 }}>
          {stats.map((s) => (
            <Card key={s.label} padding="md">
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 12 }}>
                <p style={{ fontSize: "var(--text-body-sm)", color: "var(--color-slate)", fontWeight: 400 }}>{s.label}</p>
                <div style={{ width: 32, height: 32, background: "var(--color-paper)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <s.icon size={15} color={s.color} />
                </div>
              </div>
              <p style={{ fontFamily: "var(--font-heading)", fontSize: 28, fontWeight: 600, lineHeight: 1.1, marginBottom: 4 }}>{s.value}</p>
              <p style={{ fontSize: "var(--text-caption)", color: "var(--color-slate)" }}>{s.change}</p>
            </Card>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 24 }}>
          {/* Today's appointments */}
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <h2 style={{ fontSize: "var(--text-heading)", fontWeight: 600 }}>Today&apos;s schedule</h2>
              <Link href="/admin/calendar" style={{ fontSize: "var(--text-body-sm)", color: "var(--color-action-blue)", textDecoration: "none", display: "flex", alignItems: "center", gap: 4 }}>
                Full calendar <ChevronRight size={14} />
              </Link>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {todayAppointments.map((appt) => {
                const s = statusConfig[appt.status];
                return (
                  <Card key={appt.id} padding="md" hover>
                    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                      <div style={{ textAlign: "center", minWidth: 52 }}>
                        <p style={{ fontFamily: "var(--font-heading)", fontSize: 16, fontWeight: 600, lineHeight: 1.1 }}>{appt.time}</p>
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                          <p style={{ fontSize: "var(--text-body-sm)", fontWeight: 600 }}>{appt.client}</p>
                          <Badge color={s.color}>{s.label}</Badge>
                        </div>
                        <p style={{ fontSize: "var(--text-caption)", color: "var(--color-slate)" }}>{appt.services} · {appt.therapist}</p>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <p style={{ fontSize: "var(--text-body-sm)", fontWeight: 600, marginBottom: 6 }}>KES {appt.amount.toLocaleString()}</p>
                        {appt.status === "confirmed" && (
                          <div style={{ display: "flex", gap: 6 }}>
                            <button style={{ padding: "5px 10px", background: "var(--color-ink)", color: "white", border: "none", borderRadius: 6, fontSize: 11, cursor: "pointer", fontFamily: "var(--font-body)" }}>
                              Check in
                            </button>
                            <button style={{ padding: "5px 10px", background: "var(--color-paper)", border: "1px solid var(--color-silver)", borderRadius: 6, fontSize: 11, cursor: "pointer", fontFamily: "var(--font-body)" }}>
                              No-show
                            </button>
                          </div>
                        )}
                        {appt.status === "in_progress" && (
                          <button style={{ padding: "5px 10px", background: "#16a34a", color: "white", border: "none", borderRadius: 6, fontSize: 11, cursor: "pointer", fontFamily: "var(--font-body)" }}>
                            Mark complete
                          </button>
                        )}
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Right sidebar */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {/* Revenue summary */}
            <Card padding="md">
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                <TrendingUp size={16} />
                <h3 style={{ fontSize: "var(--text-body-sm)", fontWeight: 600 }}>Revenue breakdown</h3>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {[
                  { label: "Fatima Hassan", amount: 18000, pct: 38 },
                  { label: "Naledi Dlamini", amount: 16500, pct: 35 },
                  { label: "Amara Osei", amount: 13000, pct: 27 },
                ].map((t) => (
                  <div key={t.label}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                      <span style={{ fontSize: "var(--text-caption)", color: "var(--color-slate)" }}>{t.label}</span>
                      <span style={{ fontSize: "var(--text-caption)", fontWeight: 500 }}>KES {t.amount.toLocaleString()}</span>
                    </div>
                    <div style={{ height: 4, background: "var(--color-silver)", borderRadius: 99 }}>
                      <div style={{ height: "100%", width: `${t.pct}%`, background: "var(--color-ink)", borderRadius: 99 }} />
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Quick actions */}
            <Card padding="md">
              <h3 style={{ fontSize: "var(--text-body-sm)", fontWeight: 600, marginBottom: 12 }}>Quick actions</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {[
                  { label: "Add walk-in booking", href: "/admin/calendar" },
                  { label: "View client CRM", href: "/admin/clients" },
                  { label: "Manage services", href: "/admin/services" },
                  { label: "Blocked accounts (2)", href: "/admin/clients?filter=blocked" },
                ].map((a) => (
                  <Link key={a.href} href={a.href} style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "10px 12px", background: "var(--color-paper)", borderRadius: 8,
                    textDecoration: "none", fontSize: "var(--text-body-sm)", color: "var(--color-graphite)",
                    transition: "background 0.15s ease",
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
