"use client";

import Link from "next/link";
import Header from "@/components/layout/Header";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { Calendar, Package, ClipboardList, ArrowRight, Clock, ChevronRight } from "lucide-react";

// Mock data — replace with real API calls
const UPCOMING = [
  { id: "VP-AB1234", date: "Fri, Nov 1", time: "10:00 AM", services: ["Hydra Facial", "Chemical Peel"], total: 8300, status: "confirmed" },
];

const PAST = [
  { id: "VP-CD5678", date: "Tue, Oct 15", time: "2:00 PM", services: ["Carbon Laser Facial"], total: 6000, status: "completed" },
  { id: "VP-EF9012", date: "Mon, Sep 30", time: "11:30 AM", services: ["Body Contouring"], total: 5500, status: "completed" },
];

const PACKAGES = [
  { name: "Laser Hair Removal — Body", used: 3, total: 6, nextDate: "Nov 1, 2026" },
  { name: "Chemical Peel Series", used: 1, total: 4, nextDate: "Nov 15, 2026" },
];

const navItems = [
  { label: "Upcoming", href: "#upcoming", icon: Calendar },
  { label: "History", href: "#history", icon: ClipboardList },
  { label: "Packages", href: "#packages", icon: Package },
];

export default function PortalDashboard() {
  return (
    <div style={{ minHeight: "100vh" }}>
      <Header />

      <div className="container" style={{ paddingTop: 48, paddingBottom: 64 }}>
        <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", gap: 32, alignItems: "start" }}>
          {/* Sidebar */}
          <div style={{ position: "sticky", top: 80 }}>
            <Card padding="sm">
              <div style={{ padding: "12px 12px 16px", borderBottom: "1px solid var(--color-silver)", marginBottom: 8 }}>
                <div style={{ width: 44, height: 44, background: "var(--color-ink)", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 10, color: "white", fontFamily: "var(--font-heading)", fontWeight: 600, fontSize: 16 }}>
                  AO
                </div>
                <p style={{ fontSize: "var(--text-body-sm)", fontWeight: 600 }}>Amara Osei</p>
                <p style={{ fontSize: "var(--text-caption)", color: "var(--color-slate)" }}>+254 712 345 678</p>
              </div>
              <nav style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {navItems.map(({ label, href, icon: Icon }) => (
                  <a
                    key={href}
                    href={href}
                    style={{
                      display: "flex", alignItems: "center", gap: 10, padding: "10px 12px",
                      borderRadius: 8, textDecoration: "none", fontSize: "var(--text-body-sm)",
                      color: "var(--color-graphite)", transition: "background 0.15s ease",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "var(--color-paper)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  >
                    <Icon size={15} color="var(--color-slate)" />
                    {label}
                  </a>
                ))}
              </nav>
              <div style={{ borderTop: "1px solid var(--color-silver)", marginTop: 8, paddingTop: 8 }}>
                <Link href="/book" className="btn-primary btn-rect" style={{ width: "100%", justifyContent: "center", fontSize: 13 }}>
                  Book again
                </Link>
              </div>
            </Card>
          </div>

          {/* Main content */}
          <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
            {/* Upcoming */}
            <section id="upcoming">
              <h2 style={{ fontSize: "var(--text-heading)", fontWeight: 600, marginBottom: 16, letterSpacing: "0.2px" }}>Upcoming appointments</h2>
              {UPCOMING.length === 0 ? (
                <Card padding="md" style={{ textAlign: "center" }}>
                  <Calendar size={32} color="var(--color-stone)" style={{ margin: "0 auto 12px" }} />
                  <p style={{ fontSize: "var(--text-body-sm)", color: "var(--color-slate)", marginBottom: 16 }}>No upcoming appointments</p>
                  <Link href="/book" className="btn-primary btn-rect" style={{ fontSize: 13 }}>Book now</Link>
                </Card>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {UPCOMING.map((appt) => (
                    <Card key={appt.id} padding="md" hover>
                      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                        <div style={{ display: "flex", gap: 16 }}>
                          <div style={{ width: 48, height: 48, background: "var(--color-paper)", borderRadius: 12, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                            <Calendar size={18} color="var(--color-graphite)" />
                          </div>
                          <div>
                            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                              <Badge color="green">Confirmed</Badge>
                              <span style={{ fontSize: "var(--text-caption)", color: "var(--color-stone)" }}>{appt.id}</span>
                            </div>
                            <p style={{ fontSize: "var(--text-body-sm)", fontWeight: 600, marginBottom: 4 }}>{appt.date} at {appt.time}</p>
                            <p style={{ fontSize: "var(--text-caption)", color: "var(--color-slate)" }}>{appt.services.join(" + ")}</p>
                          </div>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <p style={{ fontSize: "var(--text-body-sm)", fontWeight: 700, marginBottom: 4 }}>KES {appt.total.toLocaleString()}</p>
                          <p style={{ fontSize: "var(--text-caption)", color: "var(--color-slate)" }}>Pay on arrival</p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </section>

            {/* Packages */}
            <section id="packages">
              <h2 style={{ fontSize: "var(--text-heading)", fontWeight: 600, marginBottom: 16, letterSpacing: "0.2px" }}>Active packages</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {PACKAGES.map((pkg) => (
                  <Card key={pkg.name} padding="md">
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                      <p style={{ fontSize: "var(--text-body-sm)", fontWeight: 600 }}>{pkg.name}</p>
                      <span className="tag" style={{ background: "var(--color-info-banner-bg)", color: "var(--color-action-blue)" }}>
                        {pkg.used}/{pkg.total} sessions
                      </span>
                    </div>
                    <div style={{ height: 6, background: "var(--color-silver)", borderRadius: 99, marginBottom: 10 }}>
                      <div style={{ height: "100%", width: `${(pkg.used / pkg.total) * 100}%`, background: "var(--color-ink)", borderRadius: 99, transition: "width 0.3s ease" }} />
                    </div>
                    <p style={{ fontSize: "var(--text-caption)", color: "var(--color-slate)" }}>
                      {pkg.total - pkg.used} sessions remaining · Next: {pkg.nextDate}
                    </p>
                  </Card>
                ))}
              </div>
            </section>

            {/* Past appointments */}
            <section id="history">
              <h2 style={{ fontSize: "var(--text-heading)", fontWeight: 600, marginBottom: 16, letterSpacing: "0.2px" }}>Treatment history</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {PAST.map((appt) => (
                  <div
                    key={appt.id}
                    style={{
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                      padding: "14px 18px", background: "var(--color-white)", borderRadius: 12,
                      border: "1px solid var(--color-silver)", cursor: "pointer",
                    }}
                  >
                    <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
                      <div style={{ width: 36, height: 36, background: "var(--color-paper)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Clock size={15} color="var(--color-slate)" />
                      </div>
                      <div>
                        <p style={{ fontSize: "var(--text-body-sm)", fontWeight: 500, marginBottom: 2 }}>{appt.services.join(" + ")}</p>
                        <p style={{ fontSize: "var(--text-caption)", color: "var(--color-slate)" }}>{appt.date} · {appt.time}</p>
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <Badge color="default">Completed</Badge>
                      <span style={{ fontSize: "var(--text-body-sm)", fontWeight: 600 }}>KES {appt.total.toLocaleString()}</span>
                      <ChevronRight size={14} color="var(--color-stone)" />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
