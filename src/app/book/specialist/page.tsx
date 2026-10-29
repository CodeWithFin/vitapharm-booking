"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/layout/Header";
import { getBookingState, setBookingState } from "@/lib/booking-store";
import { Check } from "lucide-react";

interface Specialist {
  id: number;
  name: string;
  specialty: string;
  bio: string;
}

const STEP = 3;
const STEPS = ["Branch", "Services", "Specialist", "Schedule", "Verify"];

export default function SpecialistPage() {
  const router = useRouter();
  const [specialists, setSpecialists] = useState<Specialist[]>([]);
  const [selected, setSelected] = useState<number | null>(null); // null = no preference
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const state = getBookingState();
    if (state.cart.length === 0) { router.replace("/book"); return; }
    setSelected(state.therapistId);
    fetch("/api/specialists")
      .then((r) => r.json())
      .then((d) => setSpecialists(d.specialists ?? []))
      .finally(() => setLoading(false));
  }, [router]);

  const proceed = (therapistId: number | null) => {
    setBookingState({ ...getBookingState(), therapistId });
    router.push("/book/schedule");
  };

  const initials = (name: string) => name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);

  return (
    <div style={{ minHeight: "100vh" }}>
      <Header />
      <div className="container" style={{ paddingTop: 32, paddingBottom: 80, maxWidth: 560 }}>

        {/* Progress */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 32 }}>
          {STEPS.map((s, i) => (
            <div key={s} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 22, height: 22, borderRadius: "50%", background: i < STEP ? "var(--color-ink)" : i === STEP ? "var(--color-ink)" : "var(--color-silver)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {i < STEP
                    ? <Check size={11} color="white" />
                    : <span style={{ fontSize: 10, color: i === STEP ? "white" : "var(--color-stone)", fontWeight: 600 }}>{i + 1}</span>}
                </div>
                <span style={{ fontSize: "var(--text-caption)", color: i === STEP ? "var(--color-ink)" : "var(--color-stone)", fontWeight: i === STEP ? 600 : 400 }}>{s}</span>
              </div>
              {i < STEPS.length - 1 && <div style={{ width: 20, height: 1, background: "var(--color-silver)" }} />}
            </div>
          ))}
        </div>

        <h1 style={{ fontSize: "clamp(22px, 3vw, 30px)", fontWeight: 600, marginBottom: 6 }}>Choose your specialist</h1>
        <p style={{ fontSize: "var(--text-body-sm)", color: "var(--color-slate)", marginBottom: 24 }}>Optional — or let us assign the best available.</p>

        {loading ? (
          <p style={{ color: "var(--color-slate)" }}>Loading…</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {/* No preference option */}
            <div onClick={() => proceed(null)} style={{
              display: "flex", alignItems: "center", gap: 14, padding: "14px 16px",
              border: selected === null ? "1.5px solid var(--color-ink)" : "1px solid var(--color-silver)",
              background: selected === null ? "rgba(139,58,0,0.06)" : "white",
              borderRadius: 12, cursor: "pointer", transition: "all 0.12s ease",
            }}>
              <div style={{ width: 44, height: 44, borderRadius: "50%", background: "var(--color-paper)", border: "1px dashed var(--color-stone)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <span style={{ fontSize: 18 }}>✨</span>
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: "var(--text-body-sm)", fontWeight: 600 }}>No preference</p>
                <p style={{ fontSize: "var(--text-caption)", color: "var(--color-slate)" }}>We&apos;ll assign the best available specialist</p>
              </div>
              {selected === null && <Check size={16} color="var(--color-ink)" />}
            </div>

            {specialists.map((sp) => (
              <div key={sp.id} onClick={() => proceed(sp.id)} style={{
                display: "flex", alignItems: "center", gap: 14, padding: "14px 16px",
                border: selected === sp.id ? "1.5px solid var(--color-ink)" : "1px solid var(--color-silver)",
                background: selected === sp.id ? "rgba(139,58,0,0.06)" : "white",
                borderRadius: 12, cursor: "pointer", transition: "all 0.12s ease",
              }}>
                <div style={{ width: 44, height: 44, borderRadius: "50%", background: "var(--color-ink)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontFamily: "var(--font-heading)", fontWeight: 600, fontSize: 15, flexShrink: 0 }}>
                  {initials(sp.name)}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: "var(--text-body-sm)", fontWeight: 600, marginBottom: 2 }}>{sp.name}</p>
                  {sp.specialty && <p style={{ fontSize: "var(--text-caption)", color: "var(--color-ink)", marginBottom: 2 }}>{sp.specialty}</p>}
                  {sp.bio && <p style={{ fontSize: "var(--text-caption)", color: "var(--color-slate)" }}>{sp.bio}</p>}
                </div>
                {selected === sp.id && <Check size={16} color="var(--color-ink)" />}
              </div>
            ))}

            {specialists.length === 0 && (
              <p style={{ fontSize: "var(--text-caption)", color: "var(--color-stone)", textAlign: "center", padding: 20 }}>No specialists listed yet — we&apos;ll assign one for you.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
