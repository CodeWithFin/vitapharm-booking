"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { Search, ChevronRight, User, Phone, Calendar } from "lucide-react";
import AdminNav from "@/components/admin/AdminNav";
import { format, parseISO } from "date-fns";

interface Client {
  id: number;
  phone: string;
  name: string;
  isBlocked: boolean;
  visits: number;
  spent: number;
  lastVisit: string | null;
}

export default function AdminClients() {
  const router = useRouter();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "blocked">("all");
  const [selected, setSelected] = useState<Client | null>(null);

  useEffect(() => {
    fetch("/api/admin/clients")
      .then((r) => { if (r.status === 401) { router.push("/admin/login"); return null; } return r.json(); })
      .then((d) => { if (d) setClients(d.clients); })
      .finally(() => setLoading(false));
  }, [router]);

  const filtered = clients.filter((c) => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.phone.includes(search);
    const matchFilter = filter === "all" || (filter === "blocked" && c.isBlocked);
    return matchSearch && matchFilter;
  });

  const initials = (name: string) =>
    name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  return (
    <div style={{ minHeight: "100vh" }}>
      <AdminNav active="clients" />

      <div className="container" style={{ paddingTop: 24, paddingBottom: 64 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
          <h1 style={{ fontSize: "var(--text-heading)", fontWeight: 600 }}>Client CRM</h1>
          <div style={{ display: "flex", gap: 8 }}>
            {([["all", "All"], ["blocked", "Blocked"]] as const).map(([val, label]) => (
              <button key={val} onClick={() => setFilter(val)} className="tag" style={{
                cursor: "pointer", border: "none", fontFamily: "var(--font-body)",
                background: filter === val ? "var(--color-ink)" : "var(--color-paper)",
                color: filter === val ? "white" : "var(--color-slate)",
              }}>{label}</button>
            ))}
          </div>
        </div>

        {loading ? (
          <p style={{ color: "var(--color-slate)", fontSize: "var(--text-body-sm)" }}>Loading clients...</p>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: selected ? "1fr 360px" : "1fr", gap: 24, alignItems: "start" }}>
            <div>
              <div style={{ position: "relative", marginBottom: 16 }}>
                <Search size={15} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--color-stone)" }} />
                <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name or phone…" style={{ paddingLeft: 38 }} />
              </div>

              {filtered.length === 0 ? (
                <Card padding="md" style={{ textAlign: "center" }}>
                  <p style={{ color: "var(--color-slate)", fontSize: "var(--text-body-sm)" }}>
                    {clients.length === 0 ? "No clients yet. Bookings will appear here." : "No clients match your search."}
                  </p>
                </Card>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {filtered.map((client) => (
                    <div key={client.id} onClick={() => setSelected(selected?.id === client.id ? null : client)} style={{
                      display: "flex", alignItems: "center", gap: 16, padding: "14px 18px",
                      background: selected?.id === client.id ? "var(--color-ink)" : "var(--color-white)",
                      border: "1px solid var(--color-silver)", borderRadius: 12,
                      cursor: "pointer", transition: "all 0.15s ease",
                      color: selected?.id === client.id ? "white" : "var(--color-graphite)",
                    }}>
                      <div style={{
                        width: 40, height: 40, borderRadius: "50%",
                        background: selected?.id === client.id ? "rgba(255,255,255,0.15)" : "var(--color-paper)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontFamily: "var(--font-heading)", fontWeight: 600, fontSize: 14, flexShrink: 0,
                      }}>
                        {initials(client.name)}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                          <p style={{ fontSize: "var(--text-body-sm)", fontWeight: 600 }}>{client.name}</p>
                          {client.isBlocked && <Badge color="red">Restricted</Badge>}
                        </div>
                        <p style={{ fontSize: "var(--text-caption)", color: selected?.id === client.id ? "rgba(255,255,255,0.7)" : "var(--color-slate)" }}>
                          {client.phone} · {client.visits} visit{client.visits !== 1 ? "s" : ""}{client.lastVisit ? ` · Last: ${format(parseISO(client.lastVisit), "MMM d, yyyy")}` : ""}
                        </p>
                      </div>
                      <ChevronRight size={14} color={selected?.id === client.id ? "rgba(255,255,255,0.6)" : "var(--color-stone)"} />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {selected && (
              <div style={{ position: "sticky", top: 80 }}>
                <Card padding="md">
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
                    <div style={{ width: 48, height: 48, borderRadius: "50%", background: "var(--color-ink)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-heading)", fontWeight: 600, fontSize: 16, color: "white" }}>
                      {initials(selected.name)}
                    </div>
                    <div>
                      <p style={{ fontSize: "var(--text-body-sm)", fontWeight: 600, marginBottom: 2 }}>{selected.name}</p>
                      <p style={{ fontSize: "var(--text-caption)", color: "var(--color-slate)" }}>{selected.phone}</p>
                    </div>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 16 }}>
                    {[
                      { label: "Total visits", value: String(selected.visits), icon: Calendar },
                      { label: "Last visit", value: selected.lastVisit ? format(parseISO(selected.lastVisit), "MMM d, yyyy") : "None", icon: Phone },
                      { label: "Status", value: selected.isBlocked ? "Restricted" : "Active", icon: User },
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
                </Card>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
