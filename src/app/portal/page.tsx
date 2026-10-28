"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/layout/Header";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { Phone, ShieldCheck, ArrowRight } from "lucide-react";

export default function PortalLoginPage() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const sendOtp = async () => {
    if (phone.length < 9) { setError("Enter a valid phone number"); return; }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: `+254${phone.replace(/^0/, "")}` }),
      });
      if (!res.ok) throw new Error();
      setStep("otp");
    } catch {
      setError("Failed to send code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const verifyAndLogin = async () => {
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
      if (!res.ok) throw new Error();
      router.push("/portal/dashboard");
    } catch {
      setError("Incorrect code or expired. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpInput = (index: number, value: string) => {
    // Handle paste / iOS auto-fill putting all 6 digits into one input
    const digits = value.replace(/\D/g, "").slice(0, 6);
    if (digits.length > 1) {
      const next = ["", "", "", "", "", ""];
      digits.split("").forEach((d, i) => { next[i] = d; });
      setOtp(next);
      document.getElementById(`otp-${Math.min(digits.length - 1, 5)}`)?.focus();
      return;
    }
    if (!/^\d?$/.test(value)) return;
    const next = [...otp];
    next[index] = value;
    setOtp(next);
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  const handleOtpKey = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  };

  return (
    <div style={{ minHeight: "100vh" }}>
      <Header />

      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "calc(100vh - 64px)", padding: "40px 24px" }}>
        <div style={{ width: "100%", maxWidth: 420 }}>
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <div className="tag" style={{ marginBottom: 16 }}>Client portal</div>
            <h1 style={{ fontSize: "clamp(24px, 4vw, 36px)", fontWeight: 600, lineHeight: 1.2, letterSpacing: "0.3px", marginBottom: 10 }}>
              {step === "phone" ? "Sign in to your account" : "Enter your code"}
            </h1>
            <p style={{ fontSize: "var(--text-body-sm)", color: "var(--color-slate)" }}>
              {step === "phone"
                ? "No password needed. We'll verify you via SMS"
                : `We sent a 6-digit code to +254${phone.replace(/^0/, "")}`}
            </p>
          </div>

          <Card padding="md">
            {step === "phone" ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div>
                  <label style={{ display: "block", fontSize: "var(--text-body-sm)", fontWeight: 500, marginBottom: 6 }}>Phone number</label>
                  <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                    <span style={{ position: "absolute", left: 12, fontSize: "var(--text-body-sm)", color: "var(--color-slate)", fontWeight: 500 }}>+254</span>
                    <input
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                      placeholder="7XX XXX XXX"
                      style={{ paddingLeft: 52 }}
                      maxLength={10}
                      onKeyDown={(e) => e.key === "Enter" && sendOtp()}
                    />
                  </div>
                </div>
                {error && <p style={{ fontSize: "var(--text-body-sm)", color: "#dc2626" }}>{error}</p>}
                <Button onClick={sendOtp} loading={loading} style={{ width: "100%", justifyContent: "center" }}>
                  <Phone size={14} /> Send code
                </Button>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 24 }}>
                <div style={{ width: 56, height: 56, background: "var(--color-paper)", borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <ShieldCheck size={26} color="var(--color-graphite)" />
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  {otp.map((digit, i) => (
                    <input
                      key={i}
                      id={`otp-${i}`}
                      value={digit}
                      onChange={(e) => handleOtpInput(i, e.target.value)}
                      onKeyDown={(e) => handleOtpKey(i, e)}
                      maxLength={6}
                      inputMode="numeric"
                      autoComplete={i === 0 ? "one-time-code" : "off"}
                      style={{
                        width: 52, height: 60,
                        textAlign: "center",
                        fontSize: 24,
                        fontWeight: 600,
                        borderRadius: 10,
                        border: `2px solid ${digit ? "var(--color-ink)" : "var(--color-silver)"}`,
                        outline: "none",
                      }}
                    />
                  ))}
                </div>
                {error && <p style={{ fontSize: "var(--text-body-sm)", color: "#dc2626" }}>{error}</p>}
                <Button onClick={verifyAndLogin} loading={loading} style={{ width: "100%", justifyContent: "center" }}>
                  Sign in <ArrowRight size={14} />
                </Button>
                <button onClick={() => { setStep("phone"); setOtp(["","","","","",""]); }} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "var(--text-body-sm)", color: "var(--color-slate)", fontFamily: "var(--font-body)" }}>
                  Use a different number
                </button>
              </div>
            )}
          </Card>

          <p style={{ textAlign: "center", fontSize: "var(--text-caption)", color: "var(--color-stone)", marginTop: 16 }}>
            Don&apos;t have an account? <a href="/book" style={{ color: "var(--color-action-blue)" }}>Book your first appointment</a>
          </p>
        </div>
      </div>
    </div>
  );
}
