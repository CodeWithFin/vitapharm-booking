"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const navLinks = [
  { label: "Services", href: "/book" },
  { label: "Portal", href: "/portal" },
  { label: "About", href: "#about" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        background: "rgba(244, 244, 244, 0.85)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid var(--color-silver)",
      }}
    >
      <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
          <Image
            src="/logo/vitapharm-logo-removebg-preview.png"
            alt="Vitapharm"
            width={140}
            height={54}
            style={{ objectFit: "contain", height: 40, width: "auto" }}
            priority
          />
        </Link>

        <nav style={{ display: "flex", alignItems: "center", gap: 32 }} className="hidden-mobile">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "var(--text-body-sm)",
                color: "var(--color-graphite)",
                textDecoration: "none",
                letterSpacing: "-0.2px",
                fontWeight: 400,
              }}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Link href="/portal" className="btn-secondary btn-rect hidden-mobile" style={{ fontSize: 13, padding: "7px 14px" }}>
            Sign in
          </Link>
          <Link href="/book" className="btn-primary btn-rect" style={{ fontSize: 13, padding: "7px 14px" }}>
            Book now
          </Link>
          <button
            className="mobile-menu-btn"
            onClick={() => setMenuOpen(!menuOpen)}
            style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div style={{ background: "var(--color-white)", borderTop: "1px solid var(--color-silver)", padding: "16px 24px", display: "flex", flexDirection: "column", gap: 16 }}>
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} style={{ color: "var(--color-graphite)", textDecoration: "none", fontSize: "var(--text-body-sm)" }} onClick={() => setMenuOpen(false)}>
              {link.label}
            </Link>
          ))}
        </div>
      )}

      <style>{`
        @media (min-width: 768px) {
          .hidden-mobile { display: flex !important; }
          .mobile-menu-btn { display: none !important; }
        }
        @media (max-width: 767px) {
          .hidden-mobile { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
      `}</style>
    </header>
  );
}
