"use client";

import Link from "next/link";
import { Leaf, MapPin, Phone, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer style={{ background: "var(--color-ink)", color: "var(--color-white)", marginTop: "var(--section-gap)" }}>
      <div className="container" style={{ padding: "64px 24px 40px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 48, marginBottom: 48 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
              <div style={{ width: 28, height: 28, background: "rgba(255,255,255,0.1)", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Leaf size={14} color="white" />
              </div>
              <span style={{ fontFamily: "var(--font-heading)", fontWeight: 600, fontSize: 16 }}>Vitapharm</span>
            </div>
            <p style={{ fontSize: "var(--text-body-sm)", color: "rgba(255,255,255,0.6)", lineHeight: 1.6, maxWidth: 240 }}>
              Premium aesthetic and clinical spa treatments. Book in minutes, pay on arrival.
            </p>
          </div>

          <div>
            <h4 style={{ fontFamily: "var(--font-heading)", fontSize: 14, fontWeight: 600, marginBottom: 16, color: "rgba(255,255,255,0.9)" }}>Services</h4>
            {["Facials & Peels", "Laser Treatments", "Body Contouring", "Consultations"].map((s) => (
              <Link key={s} href="/book" style={{ display: "block", fontSize: "var(--text-body-sm)", color: "rgba(255,255,255,0.6)", textDecoration: "none", marginBottom: 8 }}>{s}</Link>
            ))}
          </div>

          <div>
            <h4 style={{ fontFamily: "var(--font-heading)", fontSize: 14, fontWeight: 600, marginBottom: 16, color: "rgba(255,255,255,0.9)" }}>Account</h4>
            {[{ label: "Book Appointment", href: "/book" }, { label: "Client Portal", href: "/portal" }, { label: "My Packages", href: "/portal/packages" }].map((l) => (
              <Link key={l.href} href={l.href} style={{ display: "block", fontSize: "var(--text-body-sm)", color: "rgba(255,255,255,0.6)", textDecoration: "none", marginBottom: 8 }}>{l.label}</Link>
            ))}
          </div>

          <div>
            <h4 style={{ fontFamily: "var(--font-heading)", fontSize: 14, fontWeight: 600, marginBottom: 16, color: "rgba(255,255,255,0.9)" }}>Contact</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[
                { icon: MapPin, text: "Nairobi, Kenya" },
                { icon: Phone, text: "+254 700 000 000" },
                { icon: Mail, text: "hello@vitapharm.com" },
              ].map(({ icon: Icon, text }) => (
                <div key={text} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "var(--text-body-sm)", color: "rgba(255,255,255,0.6)" }}>
                  <Icon size={14} style={{ flexShrink: 0 }} />
                  {text}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: 24, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <p style={{ fontSize: "var(--text-caption)", color: "rgba(255,255,255,0.4)" }}>
            © {new Date().getFullYear()} Vitapharm. All rights reserved.
          </p>
          <div style={{ display: "flex", gap: 24 }}>
            {["Privacy Policy", "Terms of Service"].map((t) => (
              <Link key={t} href="#" style={{ fontSize: "var(--text-caption)", color: "rgba(255,255,255,0.4)", textDecoration: "none" }}>{t}</Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
