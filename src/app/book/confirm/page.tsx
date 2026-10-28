"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Card from "@/components/ui/Card";
import { getBookingState, clearBookingState } from "@/lib/booking-store";
import { CheckCircle, Calendar, Clock, MapPin, MessageSquare } from "lucide-react";
import { format } from "date-fns";

export default function ConfirmPage() {
  const router = useRouter();
  const [bookingRef, setBookingRef] = useState("");
  const [state, setState] = useState(getBookingState());
  const [apptError, setApptError] = useState("");

  useEffect(() => {
    setBookingRef(`VP-${Math.random().toString(36).slice(2, 8).toUpperCase()}`);
    const s = getBookingState();
    if (s.cart.length === 0 || !s.otpVerified) { router.push("/book"); return; }
    setState(s);

    // Create the appointment and trigger confirmation SMS
    const scheduledAt = s.selectedDate && s.selectedTime
      ? new Date(`${s.selectedDate.slice(0, 10)}T${s.selectedTime}:00`).toISOString()
      : null;

    if (scheduledAt && s.phone) {
      fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: s.phone,
          firstName: s.firstName,
          lastName: s.lastName,
          therapistId: s.therapistId ?? undefined,
          scheduledAt,
          services: s.cart.map((c) => ({
            id: c.id,
            name: c.name,
            durationMinutes: c.durationMinutes,
            price: c.price,
          })),
        }),
      }).catch(() => setApptError("Booking saved locally but confirmation SMS may be delayed."));
    }

    clearBookingState();
  }, [router]);

  const totalPrice = state.cart.reduce((s, i) => s + i.price, 0);
  const totalDuration = state.cart.reduce((s, i) => s + i.durationMinutes, 0);

  return (
    <div style={{ minHeight: "100vh" }}>
      <Header />

      <div className="container" style={{ paddingTop: 64, paddingBottom: 80, maxWidth: 640, textAlign: "center" }}>
        <div style={{ marginBottom: 32 }}>
          <div style={{ width: 72, height: 72, background: "rgba(139, 58, 0, 0.08)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
            <CheckCircle size={36} color="var(--color-ink)" />
          </div>
          <div className="tag" style={{ marginBottom: 16 }}>Booking confirmed</div>
          <h1 style={{ fontSize: "clamp(28px, 4vw, 40px)", fontWeight: 600, lineHeight: 1.2, letterSpacing: "0.3px", marginBottom: 12 }}>
            You&apos;re all set!
          </h1>
          <p style={{ fontSize: "var(--text-subheading)", color: "var(--color-slate)", maxWidth: 440, margin: "0 auto" }}>
            Your booking has been confirmed. We&apos;ve sent a confirmation SMS with your details and pre-care instructions.
          </p>
        </div>

        <Card padding="md" style={{ textAlign: "left", marginBottom: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <h3 style={{ fontSize: "var(--text-heading-sm)", fontWeight: 600 }}>Booking details</h3>
            <span className="tag" style={{ background: "rgba(139, 58, 0, 0.08)", color: "var(--color-ink)" }}>{bookingRef}</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {state.selectedDate && (
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 36, height: 36, background: "var(--color-paper)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Calendar size={16} color="var(--color-graphite)" />
                </div>
                <div>
                  <p style={{ fontSize: "var(--text-body-sm)", fontWeight: 500 }}>{format(new Date(state.selectedDate), "EEEE, MMMM d, yyyy")}</p>
                  <p style={{ fontSize: "var(--text-caption)", color: "var(--color-slate)" }}>Date</p>
                </div>
              </div>
            )}
            {state.selectedTime && (
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 36, height: 36, background: "var(--color-paper)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Clock size={16} color="var(--color-graphite)" />
                </div>
                <div>
                  <p style={{ fontSize: "var(--text-body-sm)", fontWeight: 500 }}>{state.selectedTime}, {totalDuration} min total</p>
                  <p style={{ fontSize: "var(--text-caption)", color: "var(--color-slate)" }}>Time</p>
                </div>
              </div>
            )}
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 36, height: 36, background: "var(--color-paper)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <MapPin size={16} color="var(--color-graphite)" />
              </div>
              <div>
                <p style={{ fontSize: "var(--text-body-sm)", fontWeight: 500 }}>Vitapharm Clinic, Nairobi</p>
                <p style={{ fontSize: "var(--text-caption)", color: "var(--color-slate)" }}>Location: full address in your SMS</p>
              </div>
            </div>
          </div>

          <div style={{ borderTop: "1px solid var(--color-silver)", marginTop: 20, paddingTop: 16 }}>
            <p style={{ fontSize: "var(--text-body-sm)", fontWeight: 600, marginBottom: 10 }}>Services booked</p>
            {state.cart.map((item) => (
              <div key={item.id} style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ fontSize: "var(--text-body-sm)", color: "var(--color-graphite)" }}>{item.name}</span>
                <span style={{ fontSize: "var(--text-body-sm)", fontWeight: 500 }}>KES {item.price.toLocaleString()}</span>
              </div>
            ))}
            <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid var(--color-silver)", paddingTop: 10, marginTop: 8 }}>
              <span style={{ fontSize: "var(--text-body-sm)", fontWeight: 600 }}>Total due on arrival</span>
              <span style={{ fontSize: "var(--text-body-sm)", fontWeight: 700 }}>KES {totalPrice.toLocaleString()}</span>
            </div>
          </div>
        </Card>

        <Card padding="md" style={{ background: "rgba(139, 58, 0, 0.05)", border: "1px solid rgba(139, 58, 0, 0.15)", marginBottom: 32, textAlign: "left" }}>
          <div style={{ display: "flex", gap: 12 }}>
            <MessageSquare size={18} color="var(--color-ink)" style={{ flexShrink: 0, marginTop: 2 }} />
            <div>
              <p style={{ fontSize: "var(--text-body-sm)", fontWeight: 600, color: "var(--color-graphite)", marginBottom: 4 }}>Reminder &amp; pre-care sent via SMS</p>
              <p style={{ fontSize: "var(--text-body-sm)", color: "var(--color-slate)", lineHeight: 1.5 }}>
                You&apos;ll receive a reminder 24 hours and 4 hours before your appointment. Please follow the pre-care instructions in your confirmation SMS.
              </p>
            </div>
          </div>
        </Card>

        {apptError && (
          <p style={{ fontSize: "var(--text-caption)", color: "var(--color-stone)", marginBottom: 16 }}>{apptError}</p>
        )}

        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/portal" className="btn-primary" style={{ fontSize: 15, padding: "12px 28px" }}>
            View in my portal
          </Link>
          <Link href="/book" className="btn-secondary" style={{ fontSize: 15, padding: "12px 28px" }}>
            Book another service
          </Link>
        </div>
      </div>
    </div>
  );
}
