import { NextRequest, NextResponse } from "next/server";
import { verify } from "jsonwebtoken";
import { db } from "@/lib/db";
import { users, appointments } from "@/lib/db/schema";
import { eq, count, sum, max, desc } from "drizzle-orm";

export const dynamic = "force-dynamic";

function isAdmin(req: NextRequest) {
  const token = req.cookies.get("admin_token")?.value;
  if (!token) return false;
  try {
    const p = verify(token, process.env.JWT_SECRET || "dev-secret") as { role?: string };
    return p.role === "admin";
  } catch { return false; }
}

export async function GET(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const clients = await db
    .select({
      id: users.id,
      phone: users.phone,
      firstName: users.firstName,
      lastName: users.lastName,
      isBlocked: users.isBlocked,
      visits: count(appointments.id),
      spent: sum(appointments.totalAmount),
      lastVisit: max(appointments.scheduledAt),
    })
    .from(users)
    .leftJoin(appointments, eq(appointments.clientId, users.id))
    .where(eq(users.role, "client"))
    .groupBy(users.id)
    .orderBy(desc(max(appointments.scheduledAt)));

  return NextResponse.json({
    clients: clients.map((c) => ({
      id: c.id,
      phone: c.phone,
      name: [c.firstName, c.lastName].filter(Boolean).join(" ") || c.phone,
      isBlocked: c.isBlocked,
      visits: Number(c.visits) || 0,
      spent: Number(c.spent) || 0,
      lastVisit: c.lastVisit ? c.lastVisit.toISOString() : null,
    })),
  });
}
