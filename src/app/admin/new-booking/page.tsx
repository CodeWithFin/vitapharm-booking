"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AdminNav from "@/components/admin/AdminNav";
import Card from "@/components/ui/Card";
import { Check, ChevronLeft } from "lucide-react";
import Link from "next/link";

const ALL_SERVICES = [
  { id: 1,  name: "Timeless Facial",           category: "Facial",       durationMinutes: 60, price: 6000  },
  { id: 2,  name: "Hydrafacial Advanced",       category: "Facial",       durationMinutes: 90, price: 20000 },
  { id: 27, name: "Hydrafacial Med",            category: "Facial",       durationMinutes: 75, price: 15000 },
  { id: 3,  name: "Peptide Facial",             category: "Facial",       durationMinutes: 60, price: 15000 },
  { id: 4,  name: "Acne Treatment Facial",      category: "Facial",       durationMinutes: 60, price: 15000 },
  { id: 5,  name: "Glow Fusion Facial",         category: "Facial",       durationMinutes: 60, price: 10000 },
  { id: 6,  name: "Chemical Peel",              category: "Facial",       durationMinutes: 45, price: 10000 },
  { id: 7,  name: "Deep Treatment Facial",      category: "Facial",       durationMinutes: 75, price: 15000 },
  { id: 8,  name: "Microneedling",              category: "Facial",       durationMinutes: 60, price: 18500 },
  { id: 9,  name: "PRP Microneedling",          category: "Facial",       durationMinutes: 90, price: 25000 },
  { id: 10, name: "Dermaplaning",               category: "Facial",       durationMinutes: 45, price: 5000  },
  { id: 11, name: "Mesotherapy",                category: "Facial",       durationMinutes: 60, price: 25000 },
  { id: 12, name: "Royal Facial",               category: "Facial",       durationMinutes: 90, price: 15000 },
  { id: 13, name: "Teen Acne Treatment",        category: "Facial",       durationMinutes: 45, price: 10000 },
  { id: 14, name: "Adult Acne Treatment",       category: "Facial",       durationMinutes: 60, price: 15000 },
  { id: 15, name: "Reflexology Massage",        category: "Massage",      durationMinutes: 60, price: 6000  },
  { id: 16, name: "Sports Massage",             category: "Massage",      durationMinutes: 60, price: 10000 },
  { id: 17, name: "Deep Tissue Massage",        category: "Massage",      durationMinutes: 60, price: 8000  },
  { id: 18, name: "Swedish Massage",            category: "Massage",      durationMinutes: 60, price: 5000  },
  { id: 19, name: "Underarms Waxing",           category: "Waxing",       durationMinutes: 20, price: 700   },
  { id: 20, name: "Chin Waxing",                category: "Waxing",       durationMinutes: 15, price: 700   },
  { id: 21, name: "Leg Waxing",                 category: "Waxing",       durationMinutes: 45, price: 2000  },
  { id: 22, name: "Chest Waxing",               category: "Waxing",       durationMinutes: 30, price: 2000  },
  { id: 23, name: "Back Waxing",                category: "Waxing",       durationMinutes: 30, price: 1500  },
  { id: 24, name: "Manzilian",                  category: "Waxing",       durationMinutes: 45, price: 3500  },
  { id: 25, name: "Bikini Waxing",              category: "Waxing",       durationMinutes: 30, price: 2000  },
  { id: 26, name: "Brazilian Waxing",           category: "Waxing",       durationMinutes: 30, price: 2500  },
  { id: 28, name: "Dermatology Consultation",   category: "Consultation", durationMinutes: 30, price: 3500  },
  { id: 29, name: "Acne Specialist",            category: "Consultation", durationMinutes: 30, price: 5000  },
  { id: 30, name: "Skin Attendant Consultation",category: "Consultation", durationMinutes: 20, price: 1000  },
  { id: 31, name: "Aesthetician Consultation",  category: "Consultation", durationMinutes: 30, price: 2000  },
  { id: 32, name: "Skin Analysis",              category: "Consultation", durationMinutes: 20, price: 1000  },
];

const CATEGORIES = ["All", "Facial", "Massage", "Waxing", "Consultation"];

interface CartItem { id: number; name: string; durationMinutes: number; price: number; }

export default function AdminNewBooking() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName]   = useState("");
  const [phone, setPhone]         = useState("");
  const [date, setDate]           = useState("");
  const [time, setTime]           = useState("09:00");
  const [branch, setBranch]       = useState<"kilimani" | "cbd">("kilimani");
  const [cart, setCart]           = useState<CartItem[]>([]);
  const [category, setCategory]   = useState("All");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError]         = useState("");
  const [done, setDone]           = useState(false);

  const filtered = ALL_SERVICES.filter((s) => category === "All" || s.category === category);
  const totalPrice    = cart.reduce((s, i) => s + i.price, 0);
  const totalDuration = cart.reduce((s, i) => s + i.durationMinutes, 0);

  const toggle = (svc: typeof ALL_SERVICES[0]) => {
    setCart((prev) =>
      prev.find((c) => c.id === svc.id)
        ? prev.filter((c) => c.id !== svc.id)
        : [...prev, { id: svc.id, name: svc.name, durationMinutes: svc.durationMinutes, price: svc.price }]
    );
  };

  const submit = async () => {
    setError("");
    const rawPhone = phone.replace(/\s/g, "");
    const normalised = rawPhone.startsWith("+254")
      ? rawPhone
      : rawPhone.startsWith("0")
        ? `+254${rawPhone.slice(1)}`
        : `+254${rawPhone}`;

    if (!/^\+254\d{9}$/.test(normalised)) { setError("Enter a valid Kenyan phone number"); return; }
    if (!date) { setError("Select a date"); return; }
    if (cart.length === 0) { setError("Select at least one service"); return; }

    const scheduledAt = new Date(`${date}T${time}:00`).toISOString();
    setSubmitting(true);
    try {
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: normalised,
          firstName: firstName || undefined,
          lastName: lastName || undefined,
          branch,
          scheduledAt,
          services: cart,
        }),
      });
      const json = await res.json();
      if (!res.ok) { setError(json.error || "Failed to create booking"); return; }
      setDone(true);
    } catch {
      setError("Network error — please try again");
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <div style={{ minHeight: "100vh" }}>
        <AdminNav active="Overview" />
        <div className="container" style={{ paddingTop: 64, textAlign: "center" }}>
          <div style={{ width: 56, height: 56, borderRadius: "50%", background: "rgba(139,58,0,0.1)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
            <Check size={24} color="var(--color-ink)" />
          </div>
          <h2 style={{ fontSize: "var(--text-heading)", fontWeight: 600, marginBottom: 8 }}>Booking created</h2>
          <p style={{ color: "var(--color-slate)", marginBottom: 24 }}>
            {firstName || phone} — {cart.map(c => c.name).join(", ")} · KES {totalPrice.toLocaleString()}
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
            <button onClick={() => { setDone(false); setFirstName(""); setLastName(""); setPhone(""); setDate(""); setTime("09:00"); setCart([]); }} className="btn-primary btn-rect" style={{ fontSize: 14 }}>
              Book another
            </button>
            <Link href="/admin" style={{ textDecoration: "none" }}>
              <button className="btn-secondary btn-rect" style={{ fontSize: 14 }}>Back to overview</button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh" }}>
      <AdminNav active="Overview" />

      <div className="container" style={{ paddingTop: 24, paddingBottom: 80 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
          <Link href="/admin" style={{ color: "var(--color-slate)", display: "flex", alignItems: "center", gap: 4, textDecoration: "none", fontSize: "var(--text-body-sm)" }}>
            <ChevronLeft size={14} /> Overview
          </Link>
          <span style={{ color: "var(--color-stone)" }}>/</span>
          <h1 style={{ fontSize: "var(--text-heading)", fontWeight: 600 }}>New booking</h1>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 24, alignItems: "start" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

            {/* Client details */}
            <Card padding="md">
              <p style={{ fontSize: "var(--text-body-sm)", fontWeight: 600, marginBottom: 14 }}>Client details</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
                <div>
                  <label style={{ fontSize: "var(--text-caption)", color: "var(--color-slate)", display: "block", marginBottom: 4 }}>First name</label>
                  <input value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="e.g. Amara" style={{ width: "100%", fontFamily: "var(--font-body)" }} />
                </div>
                <div>
                  <label style={{ fontSize: "var(--text-caption)", color: "var(--color-slate)", display: "block", marginBottom: 4 }}>Last name</label>
                  <input value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="e.g. Wanjiku" style={{ width: "100%", fontFamily: "var(--font-body)" }} />
                </div>
              </div>
              <div>
                <label style={{ fontSize: "var(--text-caption)", color: "var(--color-slate)", display: "block", marginBottom: 4 }}>Phone number <span style={{ color: "#dc2626" }}>*</span></label>
                <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="07XX XXX XXX" style={{ width: "100%", fontFamily: "var(--font-body)" }} />
              </div>
            </Card>

            {/* Branch */}
            <Card padding="md">
              <p style={{ fontSize: "var(--text-body-sm)", fontWeight: 600, marginBottom: 12 }}>Branch</p>
              <div style={{ display: "flex", gap: 10 }}>
                {([["kilimani", "Vitapharm Kilimani", "Adlife Plaza"], ["cbd", "Vitapharm Superior (CBD)", "Kenyatta Ave"]] as const).map(([id, name, addr]) => (
                  <div key={id} onClick={() => setBranch(id)} style={{
                    flex: 1, padding: "12px 14px", borderRadius: 10, cursor: "pointer",
                    border: `${branch === id ? "1.5" : "1"}px solid ${branch === id ? "var(--color-ink)" : "var(--color-silver)"}`,
                    background: branch === id ? "rgba(139,58,0,0.06)" : "white",
                    transition: "all 0.12s ease",
                  }}>
                    <p style={{ fontSize: "var(--text-body-sm)", fontWeight: 600, marginBottom: 2 }}>{name}</p>
                    <p style={{ fontSize: "var(--text-caption)", color: "var(--color-slate)" }}>{addr}</p>
                  </div>
                ))}
              </div>
            </Card>

            {/* Date & time */}
            <Card padding="md">
              <p style={{ fontSize: "var(--text-body-sm)", fontWeight: 600, marginBottom: 14 }}>Date & time</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={{ fontSize: "var(--text-caption)", color: "var(--color-slate)", display: "block", marginBottom: 4 }}>Date <span style={{ color: "#dc2626" }}>*</span></label>
                  <input type="date" value={date} onChange={(e) => setDate(e.target.value)} style={{ width: "100%", fontFamily: "var(--font-body)" }} />
                </div>
                <div>
                  <label style={{ fontSize: "var(--text-caption)", color: "var(--color-slate)", display: "block", marginBottom: 4 }}>Time</label>
                  <input type="time" value={time} onChange={(e) => setTime(e.target.value)} style={{ width: "100%", fontFamily: "var(--font-body)" }} />
                </div>
              </div>
            </Card>

            {/* Services */}
            <Card padding="md">
              <p style={{ fontSize: "var(--text-body-sm)", fontWeight: 600, marginBottom: 12 }}>Services <span style={{ color: "#dc2626" }}>*</span></p>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 14 }}>
                {CATEGORIES.map((cat) => (
                  <button key={cat} onClick={() => setCategory(cat)} className="tag" style={{
                    cursor: "pointer", border: "none", fontFamily: "var(--font-body)",
                    background: category === cat ? "var(--color-ink)" : "var(--color-paper)",
                    color: category === cat ? "white" : "var(--color-slate)",
                  }}>{cat}</button>
                ))}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {filtered.map((svc) => {
                  const selected = !!cart.find((c) => c.id === svc.id);
                  return (
                    <div key={svc.id} onClick={() => toggle(svc)} style={{
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                      padding: "10px 12px", borderRadius: 10, cursor: "pointer",
                      border: selected ? "1.5px solid var(--color-ink)" : "1px solid var(--color-silver)",
                      background: selected ? "rgba(139,58,0,0.06)" : "white",
                      transition: "all 0.12s ease",
                    }}>
                      <div>
                        <p style={{ fontSize: "var(--text-body-sm)", fontWeight: selected ? 600 : 400 }}>{svc.name}</p>
                        <p style={{ fontSize: "var(--text-caption)", color: "var(--color-slate)" }}>{svc.durationMinutes} min</p>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <span style={{ fontSize: "var(--text-body-sm)", fontWeight: 500 }}>KES {svc.price.toLocaleString()}</span>
                        <div style={{
                          width: 20, height: 20, borderRadius: "50%", flexShrink: 0,
                          background: selected ? "var(--color-ink)" : "var(--color-paper)",
                          border: selected ? "none" : "1px solid var(--color-silver)",
                          display: "flex", alignItems: "center", justifyContent: "center",
                        }}>
                          {selected && <Check size={11} color="white" />}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>

          {/* Summary */}
          <div style={{ position: "sticky", top: 80 }}>
            <Card padding="md">
              <p style={{ fontSize: "var(--text-body-sm)", fontWeight: 600, marginBottom: 14 }}>Summary</p>
              {cart.length === 0 ? (
                <p style={{ fontSize: "var(--text-caption)", color: "var(--color-stone)" }}>No services selected</p>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
                  {cart.map((c) => (
                    <div key={c.id} style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ fontSize: "var(--text-caption)", color: "var(--color-graphite)" }}>{c.name}</span>
                      <span style={{ fontSize: "var(--text-caption)", fontWeight: 500 }}>KES {c.price.toLocaleString()}</span>
                    </div>
                  ))}
                  <div style={{ borderTop: "1px solid var(--color-silver)", paddingTop: 8, display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontSize: "var(--text-body-sm)", fontWeight: 600 }}>Total</span>
                    <span style={{ fontSize: "var(--text-body-sm)", fontWeight: 600 }}>KES {totalPrice.toLocaleString()}</span>
                  </div>
                  <p style={{ fontSize: "var(--text-caption)", color: "var(--color-slate)" }}>{totalDuration} min</p>
                </div>
              )}

              {error && (
                <p style={{ fontSize: "var(--text-caption)", color: "#dc2626", marginBottom: 12 }}>{error}</p>
              )}

              <button
                onClick={submit}
                disabled={submitting}
                className="btn-primary btn-rect"
                style={{ width: "100%", justifyContent: "center", fontSize: 14, opacity: submitting ? 0.6 : 1 }}
              >
                {submitting ? "Creating…" : "Confirm booking"}
              </button>
              <p style={{ fontSize: 11, color: "var(--color-stone)", marginTop: 8, textAlign: "center" }}>
                An SMS confirmation will be sent to the client
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
