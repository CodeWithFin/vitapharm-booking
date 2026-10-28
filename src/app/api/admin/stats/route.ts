import { NextRequest, NextResponse } from "next/server";
import { verify } from "jsonwebtoken";
import { db } from "@/lib/db";
import { appointments, users } from "@/lib/db/schema";
import { eq, and, gte, lte, ne, count, sum } from "drizzle-orm";

export const dynamic = "force-dynamic";

function requireAdmin(req: NextRequest) {
  const token = req.cookies.get("admin_token")?.value;
  if (!token) return false;
  try {
    const p = verify(token, process.env.JWT_SECRET || "dev-secret") as { role: string };
    return p.role === "admin";
  } catch {
    return false;
  }
}

export async function GET(req: NextRequest) {
  if (!requireAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  const [todayStats, clientCount, noShowCount] = await Promise.all([
    db.select({ apptCount: count(), revenue: sum(appointments.totalAmount) })
      .from(appointments)
      .where(and(
        gte(appointments.scheduledAt, todayStart),
        lte(appointments.scheduledAt, todayEnd),
        ne(appointments.status, "cancelled"),
      )),
    db.select({ c: count() }).from(users).where(eq(users.role, "client")),
    db.select({ c: count() }).from(appointments)
      .where(and(eq(appointments.status, "no_show"), gte(appointments.scheduledAt, thirtyDaysAgo))),
  ]);

  return NextResponse.json({
    todayCount: todayStats[0]?.apptCount ?? 0,
    todayRevenue: Number(todayStats[0]?.revenue ?? 0),
    totalClients: clientCount[0]?.c ?? 0,
    noShows30d: noShowCount[0]?.c ?? 0,
  });
}
