"use client";

import { useState } from "react";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { Plus, Edit2, ToggleLeft, ToggleRight, Clock, DollarSign } from "lucide-react";
import AdminNav from "@/components/admin/AdminNav";

const SERVICES = [
  { id: 1, name: "Hydra Facial", category: "Facial", duration: 60, price: 4500, active: true, bookings30d: 28 },
  { id: 2, name: "Chemical Peel", category: "Facial", duration: 45, price: 3800, active: true, bookings30d: 19 },
  { id: 3, name: "Microdermabrasion", category: "Facial", duration: 45, price: 3200, active: true, bookings30d: 14 },
  { id: 4, name: "Brightening Facial", category: "Facial", duration: 60, price: 4000, active: true, bookings30d: 11 },
  { id: 5, name: "Laser Hair Removal (Face)", category: "Laser", duration: 30, price: 2500, active: true, bookings30d: 22 },
  { id: 6, name: "Laser Hair Removal (Body)", category: "Laser", duration: 90, price: 6500, active: true, bookings30d: 15 },
  { id: 7, name: "Carbon Laser Facial", category: "Laser", duration: 60, price: 6000, active: true, bookings30d: 18 },
  { id: 8, name: "IPL Photofacial", category: "Laser", duration: 45, price: 5500, active: false, bookings30d: 0 },
  { id: 9, name: "Body Contouring", category: "Body", duration: 45, price: 5500, active: true, bookings30d: 9 },
  { id: 10, name: "Cellulite Treatment", category: "Body", duration: 60, price: 5000, active: true, bookings30d: 7 },
  { id: 11, name: "Initial Skin Consultation", category: "Consultation", duration: 30, price: 1500, active: true, bookings30d: 32 },
  { id: 12, name: "Follow-up Consultation", category: "Consultation", duration: 20, price: 800, active: true, bookings30d: 24 },
];

const CATEGORY_COLORS: Record<string, "default" | "blue" | "green" | "orange"> = {
  Facial: "default",
  Laser: "blue",
  Body: "green",
  Consultation: "orange",
};

export default function AdminServices() {
  const [services, setServices] = useState(SERVICES);
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = ["All", ...Array.from(new Set(SERVICES.map((s) => s.category)))];
  const filtered = services.filter((s) => activeCategory === "All" || s.category === activeCategory);

  const toggleActive = (id: number) => {
    setServices((prev) => prev.map((s) => s.id === id ? { ...s, active: !s.active } : s));
  };

  const totalRevenue30d = services.filter(s => s.active).reduce((sum, s) => sum + s.price * s.bookings30d, 0);

  return (
    <div style={{ minHeight: "100vh" }}>
      <AdminNav active="Services" />

      <div className="container" style={{ paddingTop: 24, paddingBottom: 64 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
          <div>
            <h1 style={{ fontSize: "var(--text-heading)", fontWeight: 600, marginBottom: 4 }}>Services</h1>
            <p style={{ fontSize: "var(--text-body-sm)", color: "var(--color-slate)" }}>
              {services.filter(s => s.active).length} active · KES {totalRevenue30d.toLocaleString()} revenue (30d)
            </p>
          </div>
          <button className="btn-primary btn-rect" style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13 }}>
            <Plus size={14} /> Add service
          </button>
        </div>

        {/* Category filter */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className="tag"
              style={{
                cursor: "pointer", border: "none", fontFamily: "var(--font-body)",
                background: activeCategory === cat ? "var(--color-ink)" : "var(--color-paper)",
                color: activeCategory === cat ? "white" : "var(--color-slate)",
                transition: "all 0.15s ease",
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {filtered.map((service) => (
            <Card key={service.id} padding="md" style={{ opacity: service.active ? 1 : 0.6 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                    <p style={{ fontSize: "var(--text-body-sm)", fontWeight: 600 }}>{service.name}</p>
                    <Badge color={CATEGORY_COLORS[service.category] || "default"}>{service.category}</Badge>
                    {!service.active && <Badge color="default">Inactive</Badge>}
                  </div>
                  <div style={{ display: "flex", gap: 16 }}>
                    <span style={{ fontSize: "var(--text-caption)", color: "var(--color-slate)", display: "flex", alignItems: "center", gap: 4 }}>
                      <Clock size={11} />{service.duration} min
                    </span>
                    <span style={{ fontSize: "var(--text-caption)", color: "var(--color-slate)", display: "flex", alignItems: "center", gap: 4 }}>
                      <DollarSign size={11} />KES {service.price.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div style={{ textAlign: "center", minWidth: 80 }}>
                  <p style={{ fontFamily: "var(--font-heading)", fontSize: 20, fontWeight: 600, lineHeight: 1.1 }}>{service.bookings30d}</p>
                  <p style={{ fontSize: "var(--text-caption)", color: "var(--color-slate)" }}>bookings/30d</p>
                </div>

                <div style={{ textAlign: "right", minWidth: 100 }}>
                  <p style={{ fontSize: "var(--text-body-sm)", fontWeight: 700, marginBottom: 2 }}>
                    KES {(service.price * service.bookings30d).toLocaleString()}
                  </p>
                  <p style={{ fontSize: "var(--text-caption)", color: "var(--color-slate)" }}>30d revenue</p>
                </div>

                <div style={{ display: "flex", gap: 8 }}>
                  <button style={{ width: 32, height: 32, borderRadius: 8, border: "1px solid var(--color-silver)", background: "white", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Edit2 size={13} color="var(--color-slate)" />
                  </button>
                  <button
                    onClick={() => toggleActive(service.id)}
                    style={{ width: 32, height: 32, borderRadius: 8, border: "1px solid var(--color-silver)", background: service.active ? "#f0fdf4" : "white", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                  >
                    {service.active
                      ? <ToggleRight size={16} color="#16a34a" />
                      : <ToggleLeft size={16} color="var(--color-stone)" />}
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
