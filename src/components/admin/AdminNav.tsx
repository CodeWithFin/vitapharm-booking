"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

const navLinks = [
  { label: "Overview", href: "/admin" },
  { label: "Calendar", href: "/admin/calendar" },
  { label: "Clients", href: "/admin/clients" },
  { label: "Services", href: "/admin/services" },
];

export default function AdminNav({ active }: { active: string }) {
  const router = useRouter();

  const signOut = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
  };

  return (
    <header style={{ background: "var(--color-ink)", padding: "0 24px", height: 56, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
        <span style={{ fontFamily: "var(--font-heading)", fontWeight: 600, fontSize: 16, color: "white" }}>Vitapharm Admin</span>
        <nav style={{ display: "flex", gap: 4 }}>
          {navLinks.map((l) => (
            <Link key={l.href} href={l.href} style={{
              padding: "6px 12px", borderRadius: 6, fontSize: "var(--text-body-sm)",
              color: l.label === active ? "white" : "rgba(255,255,255,0.6)",
              background: l.label === active ? "rgba(255,255,255,0.12)" : "transparent",
              textDecoration: "none",
            }}>
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <Link href="/" style={{ fontSize: "var(--text-body-sm)", color: "rgba(255,255,255,0.6)", textDecoration: "none" }}>
          ← Back to site
        </Link>
        <button
          onClick={signOut}
          style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.1)", border: "none", borderRadius: 6, padding: "5px 10px", cursor: "pointer", color: "rgba(255,255,255,0.8)", fontSize: "var(--text-body-sm)", fontFamily: "var(--font-body)" }}
        >
          <LogOut size={13} /> Sign out
        </button>
      </div>
    </header>
  );
}
