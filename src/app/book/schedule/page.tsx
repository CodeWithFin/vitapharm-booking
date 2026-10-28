"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/layout/Header";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { getBookingState, setBookingState } from "@/lib/booking-store";
import { ChevronLeft, ChevronRight, Clock, ArrowRight, ArrowLeft } from "lucide-react";
import { Icon } from "@iconify/react";
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isBefore, startOfDay } from "date-fns";

const THERAPISTS = [
  { id: 1, name: "Amara Osei", specialties: ["Facial", "Consultation"], avatar: "AO" },
  { id: 2, name: "Naledi Dlamini", specialties: ["Laser", "Body"], avatar: "ND" },
  { id: 3, name: "Fatima Hassan", specialties: ["Facial", "Body", "Laser"], avatar: "FH" },
];

const TIME_SLOTS = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "12:00", "13:00", "13:30", "14:00", "14:30", "15:00",
  "15:30", "16:00", "16:30", "17:00",
];

// Simulate some unavailable slots
const UNAVAILABLE = new Set(["09:00", "10:30", "14:00", "16:00"]);

export default function SchedulePage() {
  const router = useRouter();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedTherapist, setSelectedTherapist] = useState<number | null>(null);
  const [cart, setCart] = useState<ReturnType<typeof getBookingState>["cart"]>([]);

  useEffect(() => {
    const state = getBookingState();
    if (state.cart.length === 0) { router.push("/book"); return; }
    setCart(state.cart);
    if (state.selectedDate) setSelectedDate(new Date(state.selectedDate));
    if (state.selectedTime) setSelectedTime(state.selectedTime);
    if (state.therapistId) setSelectedTherapist(state.therapistId);
  }, [router]);

  const days = eachDayOfInterval({ start: startOfMonth(currentMonth), end: endOfMonth(currentMonth) });
  const today = startOfDay(new Date());
  const firstDayOfWeek = (startOfMonth(currentMonth).getDay() + 6) % 7;

  const totalDuration = cart.reduce((s, i) => s + i.durationMinutes, 0);
  const totalPrice = cart.reduce((s, i) => s + i.price, 0);

  const proceed = () => {
    if (!selectedDate || !selectedTime) return;
    const state = getBookingState();
    setBookingState({
      ...state,
      selectedDate: selectedDate.toISOString(),
      selectedTime,
      therapistId: selectedTherapist,
    });
    router.push("/book/verify");
  };

  return (
    <div style={{ minHeight: "100vh" }}>
      <Header />

      <div className="container" style={{ paddingTop: 48, paddingBottom: 64 }}>
        <div style={{ marginBottom: 40 }}>
          <button onClick={() => router.push("/book")} style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", cursor: "pointer", color: "var(--color-slate)", fontSize: "var(--text-body-sm)", marginBottom: 16 }}>
            <ArrowLeft size={14} /> Back to services
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <span style={{ fontSize: "var(--text-body-sm)", color: "var(--color-slate)" }}>Step 2 of 3</span>
            <span className="tag">Pick a time</span>
          </div>
          <h1 style={{ fontSize: "clamp(28px, 4vw, 40px)", fontWeight: 600, lineHeight: 1.2, letterSpacing: "0.3px" }}>
            When works for you?
          </h1>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 32, alignItems: "start" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>

            {/* Therapist selection */}
            <Card padding="md">
              <h3 style={{ fontSize: "var(--text-heading-sm)", fontWeight: 600, marginBottom: 16 }}>Choose a specialist (optional)</h3>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <button
                  onClick={() => setSelectedTherapist(null)}
                  style={{
                    display: "flex", alignItems: "center", gap: 10, padding: "10px 16px",
                    background: selectedTherapist === null ? "var(--color-ink)" : "var(--color-paper)",
                    color: selectedTherapist === null ? "white" : "var(--color-graphite)",
                    border: "none", borderRadius: 9999, cursor: "pointer", fontSize: "var(--text-body-sm)", fontFamily: "var(--font-body)",
                    transition: "all 0.15s ease",
                  }}
                >
                  Any available
                </button>
                {THERAPISTS.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setSelectedTherapist(t.id)}
                    style={{
                      display: "flex", alignItems: "center", gap: 10, padding: "10px 16px",
                      background: selectedTherapist === t.id ? "var(--color-ink)" : "var(--color-paper)",
                      color: selectedTherapist === t.id ? "white" : "var(--color-graphite)",
                      border: "none", borderRadius: 9999, cursor: "pointer", fontSize: "var(--text-body-sm)", fontFamily: "var(--font-body)",
                      transition: "all 0.15s ease",
                    }}
                  >
                    <div style={{
                      width: 28, height: 28, borderRadius: "50%", background: selectedTherapist === t.id ? "rgba(255,255,255,0.2)" : "var(--color-silver)",
                      display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 600,
                    }}>
                      {t.avatar}
                    </div>
                    {t.name}
                  </button>
                ))}
              </div>
            </Card>

            {/* Calendar */}
            <Card padding="md">
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
                <h3 style={{ fontSize: "var(--text-heading-sm)", fontWeight: 600 }}>{format(currentMonth, "MMMM yyyy")}</h3>
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} style={{ width: 32, height: 32, borderRadius: 8, border: "1px solid var(--color-silver)", background: "white", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <ChevronLeft size={14} />
                  </button>
                  <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} style={{ width: 32, height: 32, borderRadius: 8, border: "1px solid var(--color-silver)", background: "white", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 2, marginBottom: 8 }}>
                {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map((d) => (
                  <div key={d} style={{ textAlign: "center", fontSize: 11, color: "var(--color-stone)", fontWeight: 500, padding: "4px 0" }}>{d}</div>
                ))}
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 2 }}>
                {Array.from({ length: firstDayOfWeek }).map((_, i) => <div key={`empty-${i}`} />)}
                {days.map((day) => {
                  const isPast = isBefore(day, today);
                  const isSelected = selectedDate && isSameDay(day, selectedDate);
                  const isToday = isSameDay(day, today);
                  return (
                    <button
                      key={day.toISOString()}
                      onClick={() => { if (!isPast) { setSelectedDate(day); setSelectedTime(null); } }}
                      disabled={isPast}
                      style={{
                        padding: "8px 4px",
                        borderRadius: 8,
                        border: "none",
                        cursor: isPast ? "default" : "pointer",
                        background: isSelected ? "var(--color-ink)" : isToday ? "var(--color-paper)" : "transparent",
                        color: isSelected ? "white" : isPast ? "var(--color-stone)" : "var(--color-graphite)",
                        fontWeight: isSelected || isToday ? 600 : 400,
                        fontSize: 13,
                        transition: "all 0.15s ease",
                        outline: isToday && !isSelected ? "2px solid var(--color-silver)" : "none",
                        outlineOffset: -1,
                        textAlign: "center",
                      }}
                    >
                      {format(day, "d")}
                    </button>
                  );
                })}
              </div>
            </Card>

            {/* Time slots */}
            {selectedDate && (
              <Card padding="md">
                <h3 style={{ fontSize: "var(--text-heading-sm)", fontWeight: 600, marginBottom: 16 }}>
                  Available times — {format(selectedDate, "EEEE, MMMM d")}
                </h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(80px, 1fr))", gap: 8 }}>
                  {TIME_SLOTS.map((slot) => {
                    const unavail = UNAVAILABLE.has(slot);
                    const isSelected = selectedTime === slot;
                    return (
                      <button
                        key={slot}
                        onClick={() => { if (!unavail) setSelectedTime(slot); }}
                        disabled={unavail}
                        style={{
                          padding: "8px 4px",
                          borderRadius: 8,
                          border: `1px solid ${isSelected ? "var(--color-ink)" : "var(--color-silver)"}`,
                          background: isSelected ? "var(--color-ink)" : unavail ? "var(--color-paper)" : "white",
                          color: isSelected ? "white" : unavail ? "var(--color-stone)" : "var(--color-graphite)",
                          fontSize: 13,
                          fontFamily: "var(--font-body)",
                          cursor: unavail ? "not-allowed" : "pointer",
                          textDecoration: unavail ? "line-through" : "none",
                          transition: "all 0.15s ease",
                        }}
                      >
                        {slot}
                      </button>
                    );
                  })}
                </div>
                <p style={{ fontSize: "var(--text-caption)", color: "var(--color-stone)", marginTop: 12 }}>
                  Crossed-out times are already booked
                </p>
              </Card>
            )}
          </div>

          {/* Sidebar summary */}
          <div style={{ position: "sticky", top: 80 }}>
            <Card padding="md">
              <h3 style={{ fontSize: "var(--text-heading-sm)", fontWeight: 600, marginBottom: 16 }}>Booking summary</h3>

              <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
                {cart.map((item) => (
                  <div key={item.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: 8, borderBottom: "1px solid var(--color-silver)" }}>
                    <div>
                      <p style={{ fontSize: "var(--text-body-sm)", fontWeight: 500 }}>{item.name}</p>
                      <p style={{ fontSize: "var(--text-caption)", color: "var(--color-slate)" }}>{item.durationMinutes} min</p>
                    </div>
                    <span style={{ fontSize: "var(--text-body-sm)", fontWeight: 600 }}>KES {item.price.toLocaleString()}</span>
                  </div>
                ))}
              </div>

              <div style={{ background: "var(--color-paper)", borderRadius: 8, padding: "10px 12px", marginBottom: 16 }}>
                {selectedDate && (
                  <p style={{ fontSize: "var(--text-body-sm)", marginBottom: 4, display: "flex", alignItems: "center", gap: 6 }}>
                    <Icon icon="ph:calendar-blank-light" width={14} height={14} color="var(--color-slate)" />
                    {format(selectedDate, "EEE, MMM d, yyyy")}
                  </p>
                )}
                {selectedTime && (
                  <p style={{ fontSize: "var(--text-body-sm)", marginBottom: 4, display: "flex", alignItems: "center", gap: 6 }}>
                    <Icon icon="ph:clock-light" width={14} height={14} color="var(--color-slate)" />
                    {selectedTime} ({totalDuration} min)
                  </p>
                )}
                <p style={{ fontSize: "var(--text-body-sm)", fontWeight: 700, marginTop: 8 }}>
                  Total: KES {totalPrice.toLocaleString()}
                </p>
              </div>

              <Button
                onClick={proceed}
                disabled={!selectedDate || !selectedTime}
                style={{ width: "100%", justifyContent: "center" }}
              >
                Continue <ArrowRight size={14} />
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
