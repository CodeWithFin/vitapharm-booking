"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/layout/Header";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { getBookingState, setBookingState } from "@/lib/booking-store";
import { Phone, ArrowLeft, ArrowRight, ShieldCheck } from "lucide-react";
import { format } from "date-fns";

export default function VerifyPage() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [step, setStep] = useState<"details" | "otp">("details");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resendCountdown, setResendCountdown] = useState(0);
  const [state, setState] = useState(getBookingState());
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    const s = getBookingState();
    if (s.cart.length === 0) { router.push("/book"); return; }
    if (!s.selectedDate || !s.selectedTime) { router.push("/book/schedule"); return; }
    setState(s);
  }, [router]);

  useEffect(() => {
    if (resendCountdown > 0) {
      const t = setTimeout(() => setResendCountdown((c) => c - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [resendCountdown]);

  const sendOtp = async () => {
    if (!phone || phone.length < 9) { setError("Enter a valid phone number"); return; }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: `+254${phone.replace(/^0/, "")}` }),
      });
      if (!res.ok) throw new Error("Failed to send OTP");
      setBookingState({ ...getBookingState(), phone: `+254${phone.replace(/^0/, "")}` });
      setStep("otp");
      setResendCountdown(60);
    } catch {
      setError("Failed to send verification code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpInput = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;
    const next = [...otp];
    next[index] = value;
    setOtp(next);
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) inputRefs.current[index - 1]?.focus();
  };

  const verifyOtp = async () => {
    const code = otp.join("");
    if (code.length !== 6) { setError("Enter the full 6-digit code"); return; }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: `+254${phone.replace(/^0/, "")}`, code }),
      });
      if (!res.ok) throw new Error("Invalid code");
      setBookingState({ ...getBookingState(), otpVerified: true });
      router.push("/book/confirm");
    } catch {
      setError("That code is incorrect or has expired. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const totalPrice = state.cart.reduce((s, i) => s + i.price, 0);

  return (
    <div style={{ minHeight: "100vh" }}>
      <Header />

      <div className="container" style={{ paddingTop: 48, paddingBottom: 64, maxWidth: 720 }}>
        <div style={{ marginBottom: 40 }}>
          <button onClick={() => step === "otp" ? setStep("details") : router.push("/book/schedule")} style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", cursor: "pointer", color: "var(--color-slate)", fontSize: "var(--text-body-sm)", marginBottom: 16 }}>
            <ArrowLeft size={14} /> Back
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <span style={{ fontSize: "var(--text-body-sm)", color: "var(--color-slate)" }}>Step 3 of 3</span>
            <span className="tag">Verify &amp; confirm</span>
          </div>
          <h1 style={{ fontSize: "clamp(28px, 4vw, 40px)", fontWeight: 600, lineHeight: 1.2, letterSpacing: "0.3px" }}>
            {step === "details" ? "Your details" : "Enter your verification code"}
          </h1>
          {step === "otp" && (
            <p style={{ fontSize: "var(--text-subheading)", color: "var(--color-slate)", marginTop: 8 }}>
              We sent a 6-digit code to +254{phone.replace(/^0/, "")}
            </p>
          )}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 32, alignItems: "start" }}>
          <div>
            {step === "details" ? (
              <Card padding="md">
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    <div>
                      <label style={{ display: "block", fontSize: "var(--text-body-sm)", fontWeight: 500, marginBottom: 6, color: "var(--color-graphite)" }}>First name</label>
                      <input value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="Amara" />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "var(--text-body-sm)", fontWeight: 500, marginBottom: 6, color: "var(--color-graphite)" }}>Last name</label>
                      <input value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Osei" />
                    </div>
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "var(--text-body-sm)", fontWeight: 500, marginBottom: 6, color: "var(--color-graphite)" }}>Phone number</label>
                    <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                      <span style={{ position: "absolute", left: 12, fontSize: "var(--text-body-sm)", color: "var(--color-slate)", fontWeight: 500 }}>+254</span>
                      <input
                        value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                        placeholder="7XX XXX XXX"
                        style={{ paddingLeft: 52 }}
                        maxLength={10}
                      />
                    </div>
                    <p style={{ fontSize: "var(--text-caption)", color: "var(--color-stone)", marginTop: 6 }}>
                      We&apos;ll send a verification code to this number
                    </p>
                  </div>

                  {error && <p style={{ fontSize: "var(--text-body-sm)", color: "#dc2626" }}>{error}</p>}

                  <Button onClick={sendOtp} loading={loading} style={{ width: "100%", justifyContent: "center" }}>
                    <Phone size={14} /> Send verification code
                  </Button>
                </div>
              </Card>
            ) : (
              <Card padding="md">
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 24 }}>
                  <div style={{ width: 56, height: 56, background: "var(--color-paper)", borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <ShieldCheck size={26} color="var(--color-graphite)" />
                  </div>

                  <div style={{ display: "flex", gap: 8 }}>
                    {otp.map((digit, i) => (
                      <input
                        key={i}
                        ref={(el) => { inputRefs.current[i] = el; }}
                        value={digit}
                        onChange={(e) => handleOtpInput(i, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(i, e)}
                        maxLength={1}
                        style={{
                          width: 52, height: 60,
                          textAlign: "center",
                          fontSize: 24,
                          fontWeight: 600,
                          borderRadius: 10,
                          border: `2px solid ${digit ? "var(--color-ink)" : "var(--color-silver)"}`,
                          outline: "none",
                          transition: "border-color 0.15s ease",
                        }}
                        inputMode="numeric"
                      />
                    ))}
                  </div>

                  {error && <p style={{ fontSize: "var(--text-body-sm)", color: "#dc2626" }}>{error}</p>}

                  <Button onClick={verifyOtp} loading={loading} style={{ width: "100%", justifyContent: "center" }}>
                    Confirm booking <ArrowRight size={14} />
                  </Button>

                  <div style={{ textAlign: "center" }}>
                    {resendCountdown > 0 ? (
                      <p style={{ fontSize: "var(--text-body-sm)", color: "var(--color-stone)" }}>Resend code in {resendCountdown}s</p>
                    ) : (
                      <button onClick={() => { sendOtp(); }} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "var(--text-body-sm)", color: "var(--color-action-blue)", fontFamily: "var(--font-body)" }}>
                        Resend code
                      </button>
                    )}
                  </div>
                </div>
              </Card>
            )}
          </div>

          {/* Summary */}
          <Card padding="md">
            <h3 style={{ fontSize: "var(--text-heading-sm)", fontWeight: 600, marginBottom: 16 }}>Your booking</h3>
            {state.selectedDate && (
              <div style={{ marginBottom: 12 }}>
                <p style={{ fontSize: "var(--text-body-sm)", fontWeight: 500, marginBottom: 2 }}>
                  {format(new Date(state.selectedDate), "EEEE, MMMM d")}
                </p>
                <p style={{ fontSize: "var(--text-body-sm)", color: "var(--color-slate)" }}>{state.selectedTime}</p>
              </div>
            )}
            <div style={{ borderTop: "1px solid var(--color-silver)", paddingTop: 12, marginBottom: 12 }}>
              {state.cart.map((item) => (
                <div key={item.id} style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <span style={{ fontSize: "var(--text-body-sm)", color: "var(--color-graphite)" }}>{item.name}</span>
                  <span style={{ fontSize: "var(--text-body-sm)", fontWeight: 500 }}>KES {item.price.toLocaleString()}</span>
                </div>
              ))}
            </div>
            <div style={{ background: "var(--color-paper)", borderRadius: 8, padding: "10px 12px" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: "var(--text-body-sm)", fontWeight: 600 }}>Due on arrival</span>
                <span style={{ fontSize: "var(--text-body-sm)", fontWeight: 700 }}>KES {totalPrice.toLocaleString()}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
