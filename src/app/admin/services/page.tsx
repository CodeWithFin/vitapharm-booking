"use client";

import { useState } from "react";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { Plus, Edit2, Check, X, Clock, ToggleLeft, ToggleRight } from "lucide-react";
import AdminNav from "@/components/admin/AdminNav";

const SERVICES = [
  { id: 1,  name: "Timeless Facial",          category: "Facial",       duration: 60, price: 6000,  active: true },
  { id: 2,  name: "Hydrafacial Advanced",      category: "Facial",       duration: 90, price: 20000, active: true },
  { id: 27, name: "Hydrafacial Med",           category: "Facial",       duration: 75, price: 15000, active: true },
  { id: 3,  name: "Peptide Facial",            category: "Facial",       duration: 60, price: 15000, active: true },
  { id: 4,  name: "Acne Treatment Facial",     category: "Facial",       duration: 60, price: 15000, active: true },
  { id: 5,  name: "Glow Fusion Facial",        category: "Facial",       duration: 60, price: 10000, active: true },
  { id: 6,  name: "Chemical Peel",             category: "Facial",       duration: 45, price: 10000, active: true },
  { id: 7,  name: "Deep Treatment Facial",     category: "Facial",       duration: 75, price: 15000, active: true },
  { id: 8,  name: "Microneedling",             category: "Facial",       duration: 60, price: 18500, active: true },
  { id: 9,  name: "PRP Microneedling",         category: "Facial",       duration: 90, price: 25000, active: true },
  { id: 10, name: "Dermaplaning",              category: "Facial",       duration: 45, price: 5000,  active: true },
  { id: 11, name: "Mesotherapy",               category: "Facial",       duration: 60, price: 25000, active: true },
  { id: 12, name: "Royal Facial",              category: "Facial",       duration: 90, price: 15000, active: true },
  { id: 13, name: "Teen Acne Treatment",       category: "Facial",       duration: 45, price: 10000, active: true },
  { id: 14, name: "Adult Acne Treatment",      category: "Facial",       duration: 60, price: 15000, active: true },
  { id: 15, name: "Reflexology Massage",       category: "Massage",      duration: 60, price: 6000,  active: true },
  { id: 16, name: "Sports Massage",            category: "Massage",      duration: 60, price: 10000, active: true },
  { id: 17, name: "Deep Tissue Massage",       category: "Massage",      duration: 60, price: 8000,  active: true },
  { id: 18, name: "Swedish Massage",           category: "Massage",      duration: 60, price: 5000,  active: true },
  { id: 19, name: "Underarms Waxing",          category: "Waxing",       duration: 20, price: 700,   active: true },
  { id: 20, name: "Chin Waxing",               category: "Waxing",       duration: 15, price: 700,   active: true },
  { id: 21, name: "Leg Waxing",                category: "Waxing",       duration: 45, price: 2000,  active: true },
  { id: 22, name: "Chest Waxing",              category: "Waxing",       duration: 30, price: 2000,  active: true },
  { id: 23, name: "Back Waxing",               category: "Waxing",       duration: 30, price: 1500,  active: true },
  { id: 24, name: "Manzilian",                 category: "Waxing",       duration: 45, price: 3500,  active: true },
  { id: 25, name: "Bikini Waxing",             category: "Waxing",       duration: 30, price: 2000,  active: true },
  { id: 26, name: "Brazilian Waxing",          category: "Waxing",       duration: 30, price: 2500,  active: true },
  { id: 28, name: "Dermatology Consultation",  category: "Consultation", duration: 30, price: 3500,  active: true },
  { id: 29, name: "Acne Specialist",           category: "Consultation", duration: 30, price: 5000,  active: true },
  { id: 30, name: "Skin Attendant Consultation", category: "Consultation", duration: 20, price: 1000, active: true },
  { id: 31, name: "Aesthetician Consultation", category: "Consultation", duration: 30, price: 2000,  active: true },
  { id: 32, name: "Skin Analysis",             category: "Consultation", duration: 20, price: 1000,  active: true },
];

const CATEGORY_COLORS: Record<string, "default" | "blue" | "green" | "orange"> = {
  Facial: "default",
  Massage: "blue",
  Waxing: "green",
  Consultation: "orange",
};

interface Service { id: number; name: string; category: string; duration: number; price: number; active: boolean; }

export default function AdminServices() {
  const [services, setServices] = useState<Service[]>(SERVICES);
  const [activeCategory, setActiveCategory] = useState("All");
  const [editing, setEditing] = useState<number | null>(null);
  const [draft, setDraft] = useState<{ name: string; price: string }>({ name: "", price: "" });

  const categories = ["All", ...Array.from(new Set(SERVICES.map((s) => s.category)))];
  const filtered = services.filter((s) => activeCategory === "All" || s.category === activeCategory);

  const startEdit = (s: Service) => {
    setEditing(s.id);
    setDraft({ name: s.name, price: String(s.price) });
  };

  const saveEdit = (id: number) => {
    const price = parseInt(draft.price.replace(/\D/g, ""), 10);
    if (!draft.name.trim() || isNaN(price)) return;
    setServices((prev) => prev.map((s) => s.id === id ? { ...s, name: draft.name.trim(), price } : s));
    setEditing(null);
  };

  const cancelEdit = () => setEditing(null);

  const toggleActive = (id: number) => {
    setServices((prev) => prev.map((s) => s.id === id ? { ...s, active: !s.active } : s));
  };

  return (
    <div style={{ minHeight: "100vh" }}>
      <AdminNav active="Services" />

      <div className="container" style={{ paddingTop: 24, paddingBottom: 64 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
          <div>
            <h1 style={{ fontSize: "var(--text-heading)", fontWeight: 600, marginBottom: 4 }}>Services</h1>
            <p style={{ fontSize: "var(--text-body-sm)", color: "var(--color-slate)" }}>
              {services.filter(s => s.active).length} active
            </p>
          </div>
          <button className="btn-primary btn-rect" style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13 }}>
            <Plus size={14} /> Add service
          </button>
        </div>

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
          {categories.map((cat) => (
            <button key={cat} onClick={() => setActiveCategory(cat)} className="tag" style={{
              cursor: "pointer", border: "none", fontFamily: "var(--font-body)",
              background: activeCategory === cat ? "var(--color-ink)" : "var(--color-paper)",
              color: activeCategory === cat ? "white" : "var(--color-slate)",
              transition: "all 0.15s ease",
            }}>
              {cat}
            </button>
          ))}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {filtered.map((service) => (
            <Card key={service.id} padding="md" style={{ opacity: service.active ? 1 : 0.6 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{ flex: 1 }}>
                  {editing === service.id ? (
                    <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                      <input
                        value={draft.name}
                        onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
                        style={{ flex: 1, minWidth: 160, fontSize: "var(--text-body-sm)", fontWeight: 600, padding: "6px 10px", borderRadius: 8, border: "1px solid var(--color-ink)", fontFamily: "var(--font-body)" }}
                        autoFocus
                        onKeyDown={(e) => { if (e.key === "Enter") saveEdit(service.id); if (e.key === "Escape") cancelEdit(); }}
                      />
                      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                        <span style={{ fontSize: "var(--text-caption)", color: "var(--color-slate)", whiteSpace: "nowrap" }}>KES</span>
                        <input
                          value={draft.price}
                          onChange={(e) => setDraft((d) => ({ ...d, price: e.target.value }))}
                          style={{ width: 100, fontSize: "var(--text-body-sm)", padding: "6px 10px", borderRadius: 8, border: "1px solid var(--color-ink)", fontFamily: "var(--font-body)" }}
                          onKeyDown={(e) => { if (e.key === "Enter") saveEdit(service.id); if (e.key === "Escape") cancelEdit(); }}
                        />
                      </div>
                      <button onClick={() => saveEdit(service.id)} style={{ width: 30, height: 30, borderRadius: 8, border: "none", background: "var(--color-ink)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Check size={13} color="white" />
                      </button>
                      <button onClick={cancelEdit} style={{ width: 30, height: 30, borderRadius: 8, border: "1px solid var(--color-silver)", background: "white", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <X size={13} color="var(--color-slate)" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                        <p style={{ fontSize: "var(--text-body-sm)", fontWeight: 600 }}>{service.name}</p>
                        <Badge color={CATEGORY_COLORS[service.category] || "default"}>{service.category}</Badge>
                        {!service.active && <Badge color="default">Inactive</Badge>}
                      </div>
                      <div style={{ display: "flex", gap: 16 }}>
                        <span style={{ fontSize: "var(--text-caption)", color: "var(--color-slate)", display: "flex", alignItems: "center", gap: 4 }}>
                          <Clock size={11} />{service.duration} min
                        </span>
                        <span style={{ fontSize: "var(--text-caption)", color: "var(--color-slate)" }}>
                          KES {service.price.toLocaleString()}
                        </span>
                      </div>
                    </>
                  )}
                </div>

                {editing !== service.id && (
                  <div style={{ display: "flex", gap: 8 }}>
                    <button onClick={() => startEdit(service)} style={{ width: 32, height: 32, borderRadius: 8, border: "1px solid var(--color-silver)", background: "white", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Edit2 size={13} color="var(--color-slate)" />
                    </button>
                    <button onClick={() => toggleActive(service.id)} style={{ width: 32, height: 32, borderRadius: 8, border: "1px solid var(--color-silver)", background: service.active ? "rgba(139,58,0,0.06)" : "white", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {service.active
                        ? <ToggleRight size={16} color="var(--color-ink)" />
                        : <ToggleLeft size={16} color="var(--color-stone)" />}
                    </button>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
