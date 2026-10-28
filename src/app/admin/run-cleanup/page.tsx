"use client";

import { useEffect, useState } from "react";
import AdminNav from "@/components/admin/AdminNav";
import Link from "next/link";

export default function RunCleanup() {
  const [result, setResult] = useState<{ cancelledAppointments: number; deletedServices: number; staleServiceNames: string[] } | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/admin/cleanup", { method: "POST" })
      .then((r) => r.json())
      .then((d) => {
        if (d.error) setError(d.error);
        else setResult(d);
      })
      .catch(() => setError("Request failed"));
  }, []);

  return (
    <div style={{ minHeight: "100vh" }}>
      <AdminNav active="Overview" />
      <div className="container" style={{ paddingTop: 48, maxWidth: 560 }}>
        <h1 style={{ fontSize: "var(--text-heading)", fontWeight: 600, marginBottom: 24 }}>DB Cleanup</h1>

        {!result && !error && (
          <p style={{ color: "var(--color-slate)" }}>Running…</p>
        )}

        {error && (
          <p style={{ color: "#dc2626" }}>Error: {error}</p>
        )}

        {result && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ padding: "16px 20px", background: "rgba(139,58,0,0.06)", borderRadius: 12, border: "1px solid rgba(139,58,0,0.15)" }}>
              <p style={{ fontWeight: 600, marginBottom: 8 }}>Done ✓</p>
              <p style={{ fontSize: "var(--text-body-sm)", marginBottom: 4 }}>Appointments cancelled: <strong>{result.cancelledAppointments}</strong></p>
              <p style={{ fontSize: "var(--text-body-sm)", marginBottom: 12 }}>Stale services deleted: <strong>{result.deletedServices}</strong></p>
              {result.staleServiceNames.length > 0 && (
                <>
                  <p style={{ fontSize: "var(--text-caption)", color: "var(--color-slate)", marginBottom: 4 }}>Removed:</p>
                  <ul style={{ margin: 0, paddingLeft: 20 }}>
                    {result.staleServiceNames.map((n) => (
                      <li key={n} style={{ fontSize: "var(--text-caption)", color: "var(--color-slate)" }}>{n}</li>
                    ))}
                  </ul>
                </>
              )}
            </div>
            <Link href="/admin" style={{ fontSize: "var(--text-body-sm)", color: "var(--color-ink)" }}>← Back to overview</Link>
          </div>
        )}
      </div>
    </div>
  );
}
