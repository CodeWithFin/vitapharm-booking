"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { Calendar, ClipboardList, Clock, BookOpen } from "lucide-react";
import { format, parseISO, isPast } from "date-fns";

interface Appointment {
  id: number;
  scheduledAt: string;
  status: string;
  totalAmount: string;
  serviceNames: string[];
}

interface User {
  id: number;
  phone: string;
  firstName: string | null;
  lastName: string | null;
}

export default function PortalDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/me")
      .then((r) => {
        if (r.status === 401) { router.push("/portal"); return null; }
        return r.json();
      })
      .then((data) => {
        if (!data) return;
        setUser(data.user);
        setAppointments(data.appointments);
      })
      .finally(() => setLoading(false));
  }, [router]);

  const upcoming = appointments.filter(
    (a) => !isPast(parseISO(a.scheduledAt)) && a.status !== "cancelled"
  );
  const past = appointments.filter(
    (a) => isPast(parseISO(a.scheduledAt)) || a.status === "completed" || a.status === "no_show"
  );

  const initials = user
    ? `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase() || user.phone.slice(-2)
    : "";

  const displayName = user
    ? [user.firstName, user.lastName].filter(Boolean).join(" ") || user.phone
    : "";

  if (loading) {
    return (
      <div style={{ minHeight: "100vh" }}>
        <Header />
        <div className="container" style={{ paddingTop: 64, textAlign: "center", color: "var(--color-slate)" }}>
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh" }}>
      <Header />

      <div className="container" style={{ paddingTop: 32, paddingBottom: 64 }}>

        {/* Profile strip */}
        <Card padding="md" style={{ marginBottom: 24, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 44, height: 44, background: "var(--color-ink)", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontFamily: "var(--font-heading)", fontWeight: 600, fontSize: 16, flexShrink: 0 }}>
              {initials}
            </div>
            <div>
              <p style={{ fontSize: "var(--text-body-sm)", fontWeight: 600, marginBottom: 2 }}>{displayName}</p>
              <p style={{ fontSize: "var(--text-caption)", color: "var(--color-slate)" }}>{user?.phone}</p>
            </div>
          </div>
          <Link href="/book" className="btn-primary btn-rect" style={{ fontSize: 13 }}>
            Book again
          </Link>
        </Card>

        {/* Upcoming */}
        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: "var(--text-heading-sm)", fontWeight: 600, marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
            <Calendar size={18} color="var(--color-ink)" /> Upcoming
          </h2>
          {upcoming.length === 0 ? (
            <Card padding="md" style={{ textAlign: "center" }}>
              <p style={{ fontSize: "var(--text-body-sm)", color: "var(--color-slate)", marginBottom: 16 }}>No upcoming appointments</p>
              <Link href="/book" className="btn-primary btn-rect" style={{ fontSize: 13 }}>Book now</Link>
            </Card>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {upcoming.map((appt) => (
                <Card key={appt.id} padding="md">
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6, flexWrap: "wrap" }}>
                        <Badge color="green">Confirmed</Badge>
                        <span style={{ fontSize: "var(--text-caption)", color: "var(--color-stone)" }}>VP-{String(appt.id).padStart(6, "0")}</span>
                      </div>
                      <p style={{ fontSize: "var(--text-body-sm)", fontWeight: 600, marginBottom: 4 }}>
                        {format(parseISO(appt.scheduledAt), "EEE, MMM d 'at' h:mm a")}
                      </p>
                      <p style={{ fontSize: "var(--text-caption)", color: "var(--color-slate)" }}>
                        {appt.serviceNames.join(", ")}
                      </p>
                    </div>
                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                      <p style={{ fontSize: "var(--text-body-sm)", fontWeight: 700 }}>KES {Number(appt.totalAmount).toLocaleString()}</p>
                      <p style={{ fontSize: "var(--text-caption)", color: "var(--color-slate)" }}>Pay on arrival</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </section>

        {/* Past */}
        <section>
          <h2 style={{ fontSize: "var(--text-heading-sm)", fontWeight: 600, marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
            <ClipboardList size={18} color="var(--color-ink)" /> History
          </h2>
          {past.length === 0 ? (
            <Card padding="md" style={{ textAlign: "center" }}>
              <p style={{ fontSize: "var(--text-body-sm)", color: "var(--color-slate)" }}>No past appointments yet</p>
            </Card>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {past.map((appt) => (
                <div
                  key={appt.id}
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12,
                    padding: "14px 16px", background: "var(--color-white)", borderRadius: 12,
                    border: "1px solid var(--color-silver)",
                  }}
                >
                  <div style={{ display: "flex", gap: 12, alignItems: "center", minWidth: 0 }}>
                    <div style={{ width: 36, height: 36, background: "var(--color-paper)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <Clock size={15} color="var(--color-slate)" />
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <p style={{ fontSize: "var(--text-body-sm)", fontWeight: 500, marginBottom: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {appt.serviceNames.join(", ")}
                      </p>
                      <p style={{ fontSize: "var(--text-caption)", color: "var(--color-slate)" }}>
                        {format(parseISO(appt.scheduledAt), "EEE, MMM d · h:mm a")}
                      </p>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
                    <Badge color={appt.status === "no_show" ? "red" : "default"}>
                      {appt.status === "no_show" ? "No show" : "Completed"}
                    </Badge>
                    <span style={{ fontSize: "var(--text-body-sm)", fontWeight: 600 }}>
                      KES {Number(appt.totalAmount).toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
