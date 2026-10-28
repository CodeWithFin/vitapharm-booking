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

const CATEGORIES = ["All", "Facial", "Massage", "Waxing", "Consultation"];

const ALL_SERVICES: CartService[] = [
  // Facials
  { id: 1,  name: "Timeless Facial",          category: "Facial",  durationMinutes: 60, price: 6000 },
  { id: 2,  name: "Hydrafacial Advanced",     category: "Facial",  durationMinutes: 90, price: 20000 },
  { id: 27, name: "Hydrafacial Med",          category: "Facial",  durationMinutes: 75, price: 15000 },
  { id: 3,  name: "Peptide Facial",           category: "Facial",  durationMinutes: 60, price: 15000 },
  { id: 4,  name: "Acne Treatment Facial",    category: "Facial",  durationMinutes: 60, price: 15000 },
  { id: 5,  name: "Glow Fusion Facial",       category: "Facial",  durationMinutes: 60, price: 10000 },
  { id: 6,  name: "Chemical Peel",            category: "Facial",  durationMinutes: 45, price: 10000 },
  { id: 7,  name: "Deep Treatment Facial",    category: "Facial",  durationMinutes: 75, price: 15000 },
  { id: 8,  name: "Microneedling",            category: "Facial",  durationMinutes: 60, price: 18500 },
  { id: 9,  name: "PRP Microneedling",        category: "Facial",  durationMinutes: 90, price: 25000 },
  { id: 10, name: "Dermaplaning",             category: "Facial",  durationMinutes: 45, price: 5000 },
  { id: 11, name: "Mesotherapy",              category: "Facial",  durationMinutes: 60, price: 25000 },
  { id: 12, name: "Royal Facial",             category: "Facial",  durationMinutes: 90, price: 15000 },
  { id: 13, name: "Teen Acne Treatment",      category: "Facial",  durationMinutes: 45, price: 10000 },
  { id: 14, name: "Adult Acne Treatment",     category: "Facial",  durationMinutes: 60, price: 15000 },
  // Massages
  { id: 15, name: "Reflexology Massage",      category: "Massage", durationMinutes: 60, price: 6000 },
  { id: 16, name: "Sports Massage",           category: "Massage", durationMinutes: 60, price: 10000 },
  { id: 17, name: "Deep Tissue Massage",      category: "Massage", durationMinutes: 60, price: 8000 },
  { id: 18, name: "Swedish Massage",          category: "Massage", durationMinutes: 60, price: 5000 },
  // Waxing
  { id: 19, name: "Underarms Waxing",         category: "Waxing",  durationMinutes: 20, price: 700 },
  { id: 20, name: "Chin Waxing",              category: "Waxing",  durationMinutes: 15, price: 700 },
  { id: 21, name: "Leg Waxing",               category: "Waxing",  durationMinutes: 45, price: 2000 },
  { id: 22, name: "Chest Waxing",             category: "Waxing",  durationMinutes: 30, price: 2000 },
  { id: 23, name: "Back Waxing",              category: "Waxing",  durationMinutes: 30, price: 1500 },
  { id: 24, name: "Manzilian",                category: "Waxing",  durationMinutes: 45, price: 3500 },
  { id: 25, name: "Bikini Waxing",            category: "Waxing",  durationMinutes: 30, price: 2000 },
  { id: 26, name: "Brazilian Waxing",         category: "Waxing",  durationMinutes: 30, price: 2500 },
  // Consultations
  { id: 28, name: "Dermatology Consultation", category: "Consultation", durationMinutes: 30, price: 3500 },
  { id: 29, name: "Acne Specialist",          category: "Consultation", durationMinutes: 30, price: 5000 },
];

const categoryIcons: Record<string, string> = {
  Facial: "ph:drop-light",
  Massage: "ph:hand-heart-light",
  Waxing: "ph:sparkle-light",
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

      <div className="container" style={{ paddingTop: 48, paddingBottom: cart.length > 0 ? 100 : 64 }}>
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

        <div className="book-layout" style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 32, alignItems: "start" }}>
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
                      background: selected ? "rgba(139, 58, 0, 0.06)" : "var(--color-white)",
                      border: `1px solid ${selected ? "var(--color-ink)" : "var(--color-silver)"}`,
                      borderRadius: 12,
                      cursor: "pointer",
                      transition: "all 0.15s ease",
                      boxShadow: selected ? "0 0 0 1px var(--color-ink)" : "var(--shadow-card)",
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
                          background: "var(--color-ink)",
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

      {/* Floating continue bar — visible on mobile when cart has items */}
      {cart.length > 0 && (
        <div style={{
          position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 50,
          background: "var(--color-ink)", padding: "14px 20px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          boxShadow: "0 -4px 20px rgba(139,58,0,0.25)",
        }}>
          <div>
            <p style={{ fontSize: "var(--text-body-sm)", fontWeight: 600, color: "white", marginBottom: 2 }}>
              {cart.length} service{cart.length > 1 ? "s" : ""} selected
            </p>
            <p style={{ fontSize: "var(--text-caption)", color: "rgba(255,255,255,0.7)" }}>
              KES {totalPrice.toLocaleString()} · {totalDuration} min
            </p>
          </div>
          <button
            onClick={proceed}
            style={{
              display: "flex", alignItems: "center", gap: 8,
              background: "white", color: "var(--color-ink)",
              border: "none", borderRadius: 9999, padding: "10px 20px",
              fontSize: "var(--text-body-sm)", fontWeight: 600,
              fontFamily: "var(--font-body)", cursor: "pointer",
            }}
          >
            Continue <ArrowRight size={14} />
          </button>
        </div>
      )}
    </div>
  );
}
