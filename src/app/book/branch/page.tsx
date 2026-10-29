"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/layout/Header";
import { getBookingState, setBookingState } from "@/lib/booking-store";
import { MapPin, Check } from "lucide-react";

const BRANCHES = [
  {
    id: "kilimani" as const,
    name: "Vitapharm Kilimani",
    address: "Adlife Plaza, Kilimani",
    description: "Our flagship branch in the heart of Kilimani",
  },
  {
    id: "cbd" as const,
    name: "Vitapharm Superior (CBD)",
    address: "Superior Centre, Kenyatta Avenue",
    description: "Centrally located in Nairobi CBD",
  },
];

export default function BranchPage() {
  const router = useRouter();
  const [selected, setSelected] = useState<"kilimani" | "cbd" | null>(null);

  useEffect(() => {
    const state = getBookingState();
    setSelected(state.branch);
  }, []);

  const proceed = (branch: "kilimani" | "cbd") => {
    setBookingState({ ...getBookingState(), branch });
    router.push("/book");
  };

  return (
    <div style={{ minHeight: "100vh" }}>
      <Header />
      <div className="container" style={{ paddingTop: 48, paddingBottom: 80, maxWidth: 560 }}>
        <div style={{ marginBottom: 40 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <span style={{ fontSize: "var(--text-body-sm)", color: "var(--color-slate)" }}>Step 1 of 5</span>
            <span className="tag">Choose branch</span>
          </div>
          <h1 style={{ fontSize: "clamp(28px, 4vw, 40px)", fontWeight: 600, lineHeight: 1.2, letterSpacing: "0.3px", marginBottom: 12 }}>
            Which location will you visit?
          </h1>
          <p style={{ fontSize: "var(--text-subheading)", color: "var(--color-slate)" }}>
            We have two branches in Nairobi. Pick the most convenient for you.
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {BRANCHES.map((branch) => {
            const isSelected = selected === branch.id;
            return (
              <div
                key={branch.id}
                onClick={() => proceed(branch.id)}
                style={{
                  display: "flex", alignItems: "center", gap: 18,
                  padding: "20px 22px",
                  background: isSelected ? "rgba(139,58,0,0.06)" : "var(--color-white)",
                  border: `${isSelected ? "1.5" : "1"}px solid ${isSelected ? "var(--color-ink)" : "var(--color-silver)"}`,
                  borderRadius: 14,
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                  boxShadow: isSelected ? "0 0 0 1px var(--color-ink)" : "var(--shadow-card)",
                }}
              >
                <div style={{
                  width: 48, height: 48, borderRadius: 12, flexShrink: 0,
                  background: isSelected ? "var(--color-ink)" : "var(--color-paper)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "background 0.15s ease",
                }}>
                  <MapPin size={20} color={isSelected ? "white" : "var(--color-graphite)"} />
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: "var(--text-body-sm)", fontWeight: 600, marginBottom: 3, color: "var(--color-graphite)" }}>
                    {branch.name}
                  </p>
                  <p style={{ fontSize: "var(--text-caption)", color: "var(--color-ink)", fontWeight: 500, marginBottom: 2 }}>
                    {branch.address}
                  </p>
                  <p style={{ fontSize: "var(--text-caption)", color: "var(--color-slate)" }}>
                    {branch.description}
                  </p>
                </div>
                {isSelected && <Check size={18} color="var(--color-ink)" />}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
