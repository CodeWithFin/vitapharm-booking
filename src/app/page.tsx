import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Card from "@/components/ui/Card";
import { ArrowRight, Check, Clock, Shield, Sparkles, Star, Zap } from "lucide-react";

const services = [
  { name: "Hydra Facial", category: "Facial", duration: "60 min", price: "KES 4,500", icon: "✨" },
  { name: "Chemical Peel", category: "Facial", duration: "45 min", price: "KES 3,800", icon: "🌿" },
  { name: "Laser Hair Removal", category: "Laser", duration: "30–90 min", price: "From KES 2,500", icon: "⚡" },
  { name: "Carbon Laser Facial", category: "Laser", duration: "60 min", price: "KES 6,000", icon: "🔬" },
  { name: "Body Contouring", category: "Body", duration: "45 min", price: "KES 5,500", icon: "💎" },
  { name: "Skin Consultation", category: "Consultation", duration: "30 min", price: "KES 1,500", icon: "🩺" },
];

const features = [
  {
    icon: Zap,
    title: "Book in under 2 minutes",
    body: "Our cart-style booking lets you select multiple treatments, pick your therapist, and confirm — no accounts needed.",
  },
  {
    icon: Shield,
    title: "Pay on arrival",
    body: "No upfront payment required. We verify your identity via SMS and hold your slot while you come in.",
  },
  {
    icon: Clock,
    title: "No double-booking, ever",
    body: "Our availability engine checks therapist, room, and equipment calendars in real time before surfacing any slot.",
  },
  {
    icon: Sparkles,
    title: "Your full treatment history",
    body: "Log in with your phone number to see past treatments, active package balances, and pre-care instructions.",
  },
];

const stats = [
  { value: "2,000+", label: "Happy clients" },
  { value: "15+", label: "Specialist therapists" },
  { value: "4.9★", label: "Average rating" },
  { value: "Zero", label: "Double-bookings" },
];

export default function HomePage() {
  return (
    <div style={{ minHeight: "100vh" }}>
      <Header />

      {/* Hero */}
      <section style={{ paddingTop: 80, paddingBottom: "var(--section-gap)" }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center" }}>
            <div>
              <div className="tag" style={{ marginBottom: 20 }}>Aesthetic &amp; Clinical Spa</div>
              <h1
                style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: "clamp(40px, 5vw, 64px)",
                  fontWeight: 600,
                  lineHeight: 1.1,
                  letterSpacing: "0.5px",
                  color: "var(--color-graphite)",
                  marginBottom: 24,
                }}
              >
                The smarter way to book your skin treatment
              </h1>
              <p style={{ fontSize: "var(--text-subheading)", color: "var(--color-slate)", lineHeight: 1.5, marginBottom: 40, maxWidth: 480 }}>
                Select your services, choose your therapist, and lock in your slot — all in one seamless flow. Pay when you arrive.
              </p>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <Link href="/book" className="btn-primary" style={{ fontSize: 16, padding: "14px 32px" }}>
                  Book your treatment <ArrowRight size={16} />
                </Link>
                <Link href="/portal" className="btn-secondary" style={{ fontSize: 16, padding: "14px 32px" }}>
                  View my itinerary
                </Link>
              </div>
              <div style={{ marginTop: 32, display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ display: "flex" }}>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} size={14} fill="#101010" color="#101010" />
                  ))}
                </div>
                <span style={{ fontSize: "var(--text-body-sm)", color: "var(--color-slate)" }}>
                  Trusted by 2,000+ clients in Nairobi
                </span>
              </div>
            </div>

            {/* Booking Widget Preview */}
            <div style={{ position: "relative" }}>
              <Card padding="none" style={{ overflow: "hidden" }}>
                <div style={{ padding: "20px 20px 0", background: "var(--color-paper)", borderBottom: "1px solid var(--color-silver)" }}>
                  <p style={{ fontSize: "var(--text-caption)", color: "var(--color-slate)", marginBottom: 12 }}>Popular this week</p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {services.slice(0, 3).map((s) => (
                      <div key={s.name} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 12px", background: "var(--color-white)", borderRadius: 8, border: "1px solid var(--color-silver)" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <span style={{ fontSize: 18 }}>{s.icon}</span>
                          <div>
                            <p style={{ fontSize: "var(--text-body-sm)", fontWeight: 500, color: "var(--color-graphite)", marginBottom: 2 }}>{s.name}</p>
                            <p style={{ fontSize: "var(--text-caption)", color: "var(--color-slate)" }}>{s.duration}</p>
                          </div>
                        </div>
                        <span style={{ fontSize: "var(--text-body-sm)", fontWeight: 500 }}>{s.price}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{ padding: 20 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                    <p style={{ fontSize: "var(--text-body-sm)", fontWeight: 500 }}>Select a date</p>
                    <p style={{ fontSize: "var(--text-caption)", color: "var(--color-slate)" }}>October 2026</p>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4, marginBottom: 16 }}>
                    {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
                      <div key={i} style={{ textAlign: "center", fontSize: 11, color: "var(--color-stone)", fontWeight: 500, padding: "4px 0" }}>{d}</div>
                    ))}
                    {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                      <div
                        key={day}
                        style={{
                          textAlign: "center",
                          fontSize: 13,
                          padding: "6px 4px",
                          borderRadius: 6,
                          cursor: "pointer",
                          background: day === 28 ? "var(--color-ink)" : "transparent",
                          color: day === 28 ? "white" : day < 20 ? "var(--color-stone)" : "var(--color-graphite)",
                          fontWeight: day === 28 ? 600 : 400,
                        }}
                      >
                        {day}
                      </div>
                    ))}
                  </div>
                  <Link href="/book" className="btn-primary" style={{ width: "100%", justifyContent: "center" }}>
                    Book this slot
                  </Link>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section style={{ background: "var(--color-ink)", padding: "48px 0" }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 32 }}>
            {stats.map((s) => (
              <div key={s.label} style={{ textAlign: "center" }}>
                <p style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(28px, 4vw, 40px)", fontWeight: 600, color: "white", lineHeight: 1.1, marginBottom: 6 }}>{s.value}</p>
                <p style={{ fontSize: "var(--text-body-sm)", color: "rgba(255,255,255,0.6)" }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section style={{ paddingTop: "var(--section-gap)", paddingBottom: 48 }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <div className="tag" style={{ marginBottom: 16 }}>What we offer</div>
            <h2 style={{ fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 600, lineHeight: 1.1, letterSpacing: "0.3px", marginBottom: 16 }}>
              Treatments for every skin goal
            </h2>
            <p style={{ fontSize: "var(--text-subheading)", color: "var(--color-slate)", maxWidth: 520, margin: "0 auto" }}>
              From clinical peels to advanced laser — every service is delivered by certified specialists in equipped treatment rooms.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 20 }}>
            {services.map((service) => (
              <Card key={service.name} hover padding="md">
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 16 }}>
                  <span style={{ fontSize: 28 }}>{service.icon}</span>
                  <span className="tag">{service.category}</span>
                </div>
                <h3 style={{ fontSize: "var(--text-heading-sm)", fontWeight: 600, marginBottom: 6, letterSpacing: "0.2px" }}>{service.name}</h3>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 16 }}>
                  <div style={{ display: "flex", gap: 12 }}>
                    <span style={{ fontSize: "var(--text-caption)", color: "var(--color-slate)" }}>
                      <Clock size={11} style={{ display: "inline", marginRight: 4 }} />{service.duration}
                    </span>
                  </div>
                  <span style={{ fontSize: "var(--text-body-sm)", fontWeight: 600, color: "var(--color-graphite)" }}>{service.price}</span>
                </div>
              </Card>
            ))}
          </div>

          <div style={{ textAlign: "center", marginTop: 40 }}>
            <Link href="/book" className="btn-primary" style={{ fontSize: 16, padding: "14px 32px" }}>
              See all services &amp; book <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={{ paddingTop: "var(--section-gap)", paddingBottom: "var(--section-gap)" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <div className="tag" style={{ marginBottom: 16 }}>Why Vitapharm</div>
            <h2 style={{ fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 600, lineHeight: 1.1, letterSpacing: "0.3px" }}>
              Built for your convenience
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 24 }}>
            {features.map((f) => (
              <Card key={f.title} padding="md">
                <div style={{ width: 40, height: 40, background: "var(--color-paper)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                  <f.icon size={20} color="var(--color-graphite)" />
                </div>
                <h3 style={{ fontSize: "var(--text-heading-sm)", fontWeight: 600, marginBottom: 10, letterSpacing: "0.2px" }}>{f.title}</h3>
                <p style={{ fontSize: "var(--text-body-sm)", color: "var(--color-slate)", lineHeight: 1.6 }}>{f.body}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section style={{ background: "var(--color-white)", paddingTop: "var(--section-gap)", paddingBottom: "var(--section-gap)" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <div className="tag" style={{ marginBottom: 16 }}>How it works</div>
            <h2 style={{ fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 600, lineHeight: 1.1, letterSpacing: "0.3px" }}>
              From browse to bed in 3 steps
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 32 }}>
            {[
              { step: "01", title: "Pick your services", body: "Browse our menu, add treatments to your cart, and see your full booking at a glance." },
              { step: "02", title: "Choose your slot", body: "The calendar shows only slots where your chosen therapist, room, and equipment are all free." },
              { step: "03", title: "Verify &amp; confirm", body: "Enter your phone number, receive a 6-digit OTP, and your booking is locked in instantly." },
            ].map((step) => (
              <div key={step.step} style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                <span style={{ fontFamily: "var(--font-heading)", fontSize: 40, fontWeight: 600, color: "var(--color-silver)", letterSpacing: "0.5px", marginBottom: 16 }}>{step.step}</span>
                <h3 style={{ fontSize: "var(--text-heading-sm)", fontWeight: 600, marginBottom: 10, letterSpacing: "0.2px" }}>{step.title}</h3>
                <p style={{ fontSize: "var(--text-body-sm)", color: "var(--color-slate)", lineHeight: 1.6 }} dangerouslySetInnerHTML={{ __html: step.body }} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section style={{ paddingTop: "var(--section-gap)", paddingBottom: "var(--section-gap)" }}>
        <div className="container">
          <Card padding="lg" style={{ textAlign: "center", background: "var(--color-ink)" }}>
            <h2 style={{ fontSize: "clamp(24px, 3.5vw, 40px)", fontWeight: 600, color: "white", lineHeight: 1.2, marginBottom: 16 }}>
              Your skin deserves expert care
            </h2>
            <p style={{ fontSize: "var(--text-subheading)", color: "rgba(255,255,255,0.65)", marginBottom: 32, maxWidth: 480, margin: "0 auto 32px" }}>
              Book today, pay on arrival. No hidden fees, no pressure — just results.
            </p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              <Link href="/book" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "14px 32px", background: "white", color: "var(--color-ink)", borderRadius: "9999px", fontWeight: 500, fontSize: 16, textDecoration: "none" }}>
                Book a treatment <ArrowRight size={16} />
              </Link>
            </div>
            <div style={{ display: "flex", gap: 24, justifyContent: "center", marginTop: 24, flexWrap: "wrap" }}>
              {["Free cancellation 24h before", "No upfront payment", "SMS reminders"].map((t) => (
                <div key={t} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "var(--text-body-sm)", color: "rgba(255,255,255,0.6)" }}>
                  <Check size={14} color="rgba(255,255,255,0.6)" />{t}
                </div>
              ))}
            </div>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
}
