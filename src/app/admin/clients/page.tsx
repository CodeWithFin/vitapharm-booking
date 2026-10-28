"use client";

import { useState } from "react";
import Link from "next/link";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { Search, ChevronRight, AlertTriangle, User, Phone, Calendar } from "lucide-react";

const CLIENTS = [
  { id: 1, name: "Amara Osei", phone: "+254712345678", visits: 12, lastVisit: "Oct 15, 2026", spent: 58400, strikes: 0, isBlocked: false, fitzpatrick: "IV", notes: "Sensitive to retinoids. Prefers morning slots." },
  { id: 2, name: "Naledi Dlamini", phone: "+254723456789", visits: 8, lastVisit: "Oct 20, 2026", spent: 41200, strikes: 1, isBlocked: false, fitzpatrick: "V", notes: "" },
  { id: 3, name: "Grace Mutua", phone: "+254734567890", visits: 3, lastVisit: "Oct 22, 2026", spent: 14700, strikes: 0, isBlocked: false, fitzpatrick: "III", notes: "" },
  { id: 4, name: "Keisha Mensah", phone: "+254745678901", visits: 1, lastVisit: "Oct 1, 2026", spent: 4500, strikes: 2, isBlocked: true, fitzpatrick: "VI", notes: "2 no-shows — auto-restricted." },
  { id: 5, name: "Zara Ahmed", phone: "+254756789012", visits: 5, lastVisit: "Sep 30, 2026", spent: 27500, strikes: 0, isBlocked: false, fitzpatrick: "II", notes: "Keloid risk — avoid ablative treatments." },
  { id: 6, name: "Priya Nair", phone: "+254767890123", visits: 7, lastVisit: "Oct 18, 2026", spent: 33200, strikes: 0, isBlocked: false, fitzpatrick: "IV", notes: "" },
];

const navLinks = [
  { label: "Overview", href: "/admin" },
  { label: "Calendar", href: "/admin/calendar" },
  { label: "Clients", href: "/admin/clients", active: true },
  { label: "Services", href: "/admin/services" },
];

export default function AdminClients() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "blocked" | "at_risk">("all");
  const [selected, setSelected] = useState<(typeof CLIENTS)[0] | null>(null);

  const filtered = CLIENTS.filter((c) => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.phone.includes(search);
    const matchFilter =
      filter === "all" ||
      (filter === "blocked" && c.isBlocked) ||
      (filter === "at_risk" && c.strikes > 0 && !c.isBlocked);
    return matchSearch && matchFilter;
  });

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
          <h1 style={{ fontSize: "var(--text-heading)", fontWeight: 600 }}>Client CRM</h1>
          <div style={{ display: "flex", gap: 8 }}>
            {([["all", "All"], ["at_risk", "1 strike"], ["blocked", "Blocked"]] as const).map(([val, label]) => (
              <button
                key={val}
                onClick={() => setFilter(val)}
                className="tag"
                style={{
                  cursor: "pointer", border: "none", fontFamily: "var(--font-body)",
                  background: filter === val ? "var(--color-ink)" : "var(--color-paper)",
                  color: filter === val ? "white" : "var(--color-slate)",
                  transition: "all 0.15s ease",
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: selected ? "1fr 360px" : "1fr", gap: 24, alignItems: "start" }}>
          <div>
            <div style={{ position: "relative", marginBottom: 16 }}>
              <Search size={15} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--color-stone)" }} />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name or phone…" style={{ paddingLeft: 38 }} />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {filtered.map((client) => (
                <div
                  key={client.id}
                  onClick={() => setSelected(selected?.id === client.id ? null : client)}
                  style={{
                    display: "flex", alignItems: "center", gap: 16, padding: "14px 18px",
                    background: selected?.id === client.id ? "var(--color-ink)" : "var(--color-white)",
                    border: "1px solid var(--color-silver)", borderRadius: 12,
                    cursor: "pointer", transition: "all 0.15s ease",
                    color: selected?.id === client.id ? "white" : "var(--color-graphite)",
                  }}
                >
                  <div style={{
                    width: 40, height: 40, borderRadius: "50%",
                    background: selected?.id === client.id ? "rgba(255,255,255,0.15)" : "var(--color-paper)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontFamily: "var(--font-heading)", fontWeight: 600, fontSize: 14, flexShrink: 0,
                  }}>
                    {client.name.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                      <p style={{ fontSize: "var(--text-body-sm)", fontWeight: 600 }}>{client.name}</p>
                      {client.isBlocked && <Badge color="red">Restricted</Badge>}
                      {client.strikes === 1 && !client.isBlocked && <Badge color="orange">1 strike</Badge>}
                    </div>
                    <p style={{ fontSize: "var(--text-caption)", color: selected?.id === client.id ? "rgba(255,255,255,0.7)" : "var(--color-slate)" }}>
                      {client.phone} · {client.visits} visits · Last: {client.lastVisit}
                    </p>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <p style={{ fontSize: "var(--text-body-sm)", fontWeight: 600 }}>KES {client.spent.toLocaleString()}</p>
                    <p style={{ fontSize: "var(--text-caption)", color: selected?.id === client.id ? "rgba(255,255,255,0.7)" : "var(--color-slate)" }}>lifetime</p>
                  </div>
                  <ChevronRight size={14} color={selected?.id === client.id ? "rgba(255,255,255,0.6)" : "var(--color-stone)"} />
                </div>
              ))}
            </div>
          </div>

          {/* Client detail panel */}
          {selected && (
            <div style={{ position: "sticky", top: 80 }}>
              <Card padding="md">
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
                  <div style={{ width: 48, height: 48, borderRadius: "50%", background: "var(--color-ink)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-heading)", fontWeight: 600, fontSize: 16, color: "white" }}>
                    {selected.name.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div>
                    <p style={{ fontSize: "var(--text-body-sm)", fontWeight: 600, marginBottom: 2 }}>{selected.name}</p>
                    <p style={{ fontSize: "var(--text-caption)", color: "var(--color-slate)" }}>{selected.phone}</p>
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 16 }}>
                  {[
                    { label: "Total visits", value: selected.visits.toString(), icon: Calendar },
                    { label: "Lifetime spend", value: `KES ${selected.spent.toLocaleString()}`, icon: User },
                    { label: "Fitzpatrick type", value: selected.fitzpatrick || "Not recorded", icon: User },
                    { label: "Strike count", value: `${selected.strikes}/2${selected.isBlocked ? " — RESTRICTED" : ""}`, icon: AlertTriangle },
                  ].map(({ label, value, icon: Icon }) => (
                    <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: 10, borderBottom: "1px solid var(--color-silver)" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <Icon size={13} color="var(--color-stone)" />
                        <span style={{ fontSize: "var(--text-caption)", color: "var(--color-slate)" }}>{label}</span>
                      </div>
                      <span style={{ fontSize: "var(--text-body-sm)", fontWeight: 500 }}>{value}</span>
                    </div>
                  ))}
                </div>

                {selected.notes && (
                  <div style={{ background: "var(--color-info-banner-bg)", borderRadius: 8, padding: 12, marginBottom: 16 }}>
                    <p style={{ fontSize: "var(--text-caption)", color: "var(--color-slate)", fontWeight: 500, marginBottom: 4 }}>Treatment notes</p>
                    <p style={{ fontSize: "var(--text-body-sm)", lineHeight: 1.5 }}>{selected.notes}</p>
                  </div>
                )}

                {selected.isBlocked ? (
                  <button className="btn-secondary" style={{ width: "100%", justifyContent: "center", fontSize: 13 }}>
                    Lift restriction
                  </button>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    <button className="btn-primary btn-rect" style={{ width: "100%", justifyContent: "center", fontSize: 13 }}>
                      Book appointment
                    </button>
                    <button className="btn-secondary btn-rect" style={{ width: "100%", justifyContent: "center", fontSize: 13, color: "#dc2626", borderColor: "#fca5a5" }}>
                      Issue strike
                    </button>
                  </div>
                )}
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
