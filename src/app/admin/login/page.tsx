"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { Lock } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const signIn = async () => {
    if (!password) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) throw new Error();
      router.push("/admin");
    } catch {
      setError("Incorrect password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 24px" }}>
      <div style={{ width: "100%", maxWidth: 380 }}>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ width: 48, height: 48, background: "var(--color-ink)", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
            <Lock size={20} color="white" />
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 600, letterSpacing: "0.3px", marginBottom: 6 }}>Admin access</h1>
          <p style={{ fontSize: "var(--text-body-sm)", color: "var(--color-slate)" }}>Enter the admin password to continue</p>
        </div>
        <Card padding="md">
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <label style={{ display: "block", fontSize: "var(--text-body-sm)", fontWeight: 500, marginBottom: 6 }}>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && signIn()}
                placeholder="••••••••"
                autoFocus
              />
            </div>
            {error && <p style={{ fontSize: "var(--text-body-sm)", color: "#dc2626" }}>{error}</p>}
            <Button onClick={signIn} loading={loading} style={{ width: "100%", justifyContent: "center" }}>
              Sign in
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
