"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/layout/Header";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { CartService, getBookingState, setBookingState } from "@/lib/booking-store";
import { Clock, Plus, Minus, ShoppingCart, ArrowRight, Search } from "lucide-react";
import { Icon } from "@iconify/react";

const CATEGORIES = ["All", "Facial", "Laser", "Body", "Consultation"];

const ALL_SERVICES: CartService[] = [
  { id: 1, name: "Hydra Facial", category: "Facial", durationMinutes: 60, price: 4500 },
  { id: 2, name: "Chemical Peel", category: "Facial", durationMinutes: 45, price: 3800 },
  { id: 3, name: "Microdermabrasion", category: "Facial", durationMinutes: 45, price: 3200 },
  { id: 4, name: "Brightening Facial", category: "Facial", durationMinutes: 60, price: 4000 },
  { id: 5, name: "Laser Hair Removal — Face", category: "Laser", durationMinutes: 30, price: 2500 },
  { id: 6, name: "Laser Hair Removal — Body", category: "Laser", durationMinutes: 90, price: 6500 },
  { id: 7, name: "Carbon Laser Facial", category: "Laser", durationMinutes: 60, price: 6000 },
  { id: 8, name: "IPL Photofacial", category: "Laser", durationMinutes: 45, price: 5500 },
  { id: 9, name: "Body Contouring", category: "Body", durationMinutes: 45, price: 5500 },
  { id: 10, name: "Cellulite Treatment", category: "Body", durationMinutes: 60, price: 5000 },
  { id: 11, name: "Initial Skin Consultation", category: "Consultation", durationMinutes: 30, price: 1500 },
  { id: 12, name: "Follow-up Consultation", category: "Consultation", durationMinutes: 20, price: 800 },
];

const categoryIcons: Record<string, string> = {
  Facial: "ph:drop-light",
  Laser: "ph:lightning-light",
  Body: "ph:sparkle-light",
  Consultation: "ph:stethoscope-light",
  All: "ph:squares-four-light",
};

export default function BookPage() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState<CartService[]>([]);

  useEffect(() => {
    const state = getBookingState();
    setCart(state.cart);
  }, []);

  const filtered = ALL_SERVICES.filter((s) => {
    const matchCat = activeCategory === "All" || s.category === activeCategory;
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const inCart = (id: number) => cart.some((s) => s.id === id);

  const toggleCart = (service: CartService) => {
    const next = inCart(service.id)
      ? cart.filter((s) => s.id !== service.id)
      : [...cart, service];
    setCart(next);
    const state = getBookingState();
    setBookingState({ ...state, cart: next });
  };

  const totalPrice = cart.reduce((s, i) => s + i.price, 0);
  const totalDuration = cart.reduce((s, i) => s + i.durationMinutes, 0);

  const proceed = () => {
    if (cart.length === 0) return;
    router.push("/book/schedule");
  };

  return (
    <div style={{ minHeight: "100vh" }}>
      <Header />

      <div className="container" style={{ paddingTop: 48, paddingBottom: 64 }}>
        {/* Page header */}
        <div style={{ marginBottom: 40 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <span style={{ fontSize: "var(--text-body-sm)", color: "var(--color-slate)" }}>Step 1 of 3</span>
            <span className="tag">Choose services</span>
          </div>
          <h1 style={{ fontSize: "clamp(28px, 4vw, 40px)", fontWeight: 600, lineHeight: 1.2, letterSpacing: "0.3px", marginBottom: 12 }}>
            What are you booking today?
          </h1>
          <p style={{ fontSize: "var(--text-subheading)", color: "var(--color-slate)" }}>
            Select one or more treatments. You can combine services into a single appointment.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 32, alignItems: "start" }}>
          {/* Left: service menu */}
          <div>
            {/* Search */}
            <div style={{ position: "relative", marginBottom: 24 }}>
              <Search size={16} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--color-stone)" }} />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search treatments…"
                style={{ paddingLeft: 40 }}
              />
            </div>

            {/* Category filter */}
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 28 }}>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className="tag"
                  style={{
                    cursor: "pointer",
                    background: activeCategory === cat ? "var(--color-ink)" : "var(--color-paper)",
                    color: activeCategory === cat ? "white" : "var(--color-slate)",
                    border: "none",
                    fontSize: "var(--text-caption)",
                    fontFamily: "var(--font-body)",
                    transition: "all 0.15s ease",
                  }}
                >
                  <Icon icon={categoryIcons[cat]} width={13} height={13} />
                  {cat}
                </button>
              ))}
            </div>

            {/* Service cards */}
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {filtered.map((service) => {
                const selected = inCart(service.id);
                return (
                  <div
                    key={service.id}
                    onClick={() => toggleCart(service)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "16px 20px",
                      background: selected ? "#f0fdf4" : "var(--color-white)",
                      border: `1px solid ${selected ? "#16a34a" : "var(--color-silver)"}`,
                      borderRadius: 12,
                      cursor: "pointer",
                      transition: "all 0.15s ease",
                      boxShadow: selected ? "0 0 0 1px #16a34a" : "var(--shadow-card)",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                      <div style={{ width: 44, height: 44, background: "var(--color-paper)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <Icon icon={categoryIcons[service.category]} width={22} height={22} color="var(--color-graphite)" />
                      </div>
                      <div>
                        <p style={{ fontSize: "var(--text-body-sm)", fontWeight: 500, color: "var(--color-graphite)", marginBottom: 4 }}>{service.name}</p>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <Badge>{service.category}</Badge>
                          <span style={{ fontSize: "var(--text-caption)", color: "var(--color-slate)", display: "flex", alignItems: "center", gap: 3 }}>
                            <Clock size={11} />{service.durationMinutes} min
                          </span>
                        </div>
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                      <span style={{ fontSize: "var(--text-body-sm)", fontWeight: 600, color: "var(--color-graphite)" }}>
                        KES {service.price.toLocaleString()}
                      </span>
                      <div
                        style={{
                          width: 28, height: 28,
                          borderRadius: "50%",
                          background: selected ? "#16a34a" : "var(--color-ink)",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          flexShrink: 0,
                          transition: "background 0.15s ease",
                        }}
                      >
                        {selected ? <Minus size={14} color="white" /> : <Plus size={14} color="white" />}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: cart summary */}
          <div style={{ position: "sticky", top: 80 }}>
            <Card padding="md">
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
                <ShoppingCart size={16} />
                <h3 style={{ fontSize: "var(--text-heading-sm)", fontWeight: 600 }}>Your cart</h3>
                {cart.length > 0 && (
                  <span className="tag" style={{ marginLeft: "auto", background: "var(--color-ink)", color: "white" }}>
                    {cart.length}
                  </span>
                )}
              </div>

              {cart.length === 0 ? (
                <div style={{ textAlign: "center", padding: "32px 0" }}>
                  <p style={{ fontSize: "var(--text-body-sm)", color: "var(--color-stone)", marginBottom: 8 }}>No services selected</p>
                  <p style={{ fontSize: "var(--text-caption)", color: "var(--color-stone)" }}>Click any treatment to add it</p>
                </div>
              ) : (
                <>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
                    {cart.map((item) => (
                      <div key={item.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: 10, borderBottom: "1px solid var(--color-silver)" }}>
                        <div>
                          <p style={{ fontSize: "var(--text-body-sm)", fontWeight: 500, marginBottom: 2 }}>{item.name}</p>
                          <p style={{ fontSize: "var(--text-caption)", color: "var(--color-slate)" }}>{item.durationMinutes} min</p>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <span style={{ fontSize: "var(--text-body-sm)", fontWeight: 600 }}>KES {item.price.toLocaleString()}</span>
                          <button onClick={(e) => { e.stopPropagation(); toggleCart(item); }} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--color-stone)" }}>
                            <Minus size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div style={{ background: "var(--color-paper)", borderRadius: 8, padding: "12px 14px", marginBottom: 16 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                      <span style={{ fontSize: "var(--text-body-sm)", color: "var(--color-slate)" }}>Total time</span>
                      <span style={{ fontSize: "var(--text-body-sm)", fontWeight: 500 }}>{totalDuration} min</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ fontSize: "var(--text-body-sm)", color: "var(--color-slate)" }}>Total (pay on arrival)</span>
                      <span style={{ fontSize: "var(--text-body-sm)", fontWeight: 700 }}>KES {totalPrice.toLocaleString()}</span>
                    </div>
                  </div>
                </>
              )}

              <Button onClick={proceed} disabled={cart.length === 0} style={{ width: "100%", justifyContent: "center" }}>
                Continue to schedule <ArrowRight size={14} />
              </Button>
              <p style={{ fontSize: "var(--text-caption)", color: "var(--color-stone)", textAlign: "center", marginTop: 10 }}>No payment required now</p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
