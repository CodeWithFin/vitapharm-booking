import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { appointments, users } from "@/lib/db/schema";
import { eq, gte, lte, and, count, sum } from "drizzle-orm";

export async function GET() {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const [todayAppts, totalClients, noShows] = await Promise.all([
      db.select({
        count: count(),
        revenue: sum(appointments.totalAmount),
      }).from(appointments).where(
        and(
          gte(appointments.scheduledAt, today),
          lte(appointments.scheduledAt, tomorrow),
          eq(appointments.status, "completed")
        )
      ),
      db.select({ count: count() }).from(users).where(eq(users.role, "client")),
      db.select({ count: count() }).from(users).where(eq(users.isBlocked, true)),
    ]);

    return NextResponse.json({
      todayRevenue: todayAppts[0]?.revenue ?? 0,
      todayAppointments: todayAppts[0]?.count ?? 0,
      totalClients: totalClients[0]?.count ?? 0,
      blockedClients: noShows[0]?.count ?? 0,
    });
  } catch (err) {
    console.error("dashboard GET error:", err);
    return NextResponse.json({ error: "Failed to load dashboard" }, { status: 500 });
  }
}
