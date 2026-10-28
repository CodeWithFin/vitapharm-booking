import { NextRequest, NextResponse } from "next/server";
import { verify } from "jsonwebtoken";
import { db } from "@/lib/db";
import { appointments, users, appointmentServices, services } from "@/lib/db/schema";
import { eq, and, gte, lte, inArray } from "drizzle-orm";

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

  const rows = await db
    .select({
      id: appointments.id,
      scheduledAt: appointments.scheduledAt,
      status: appointments.status,
      totalAmount: appointments.totalAmount,
      firstName: users.firstName,
      lastName: users.lastName,
      phone: users.phone,
    })
    .from(appointments)
    .innerJoin(users, eq(appointments.clientId, users.id))
    .where(and(gte(appointments.scheduledAt, todayStart), lte(appointments.scheduledAt, todayEnd)))
    .orderBy(appointments.scheduledAt);

  // Fetch service names for each appointment
  const apptIds = rows.map((r) => r.id);
  const svcRows = apptIds.length > 0
    ? await db
        .select({ appointmentId: appointmentServices.appointmentId, name: services.name })
        .from(appointmentServices)
        .innerJoin(services, eq(appointmentServices.serviceId, services.id))
        .where(inArray(appointmentServices.appointmentId, apptIds))
    : [];

  const svcMap: Record<number, string[]> = {};
  for (const s of svcRows) {
    if (!svcMap[s.appointmentId]) svcMap[s.appointmentId] = [];
    svcMap[s.appointmentId].push(s.name);
  }

  const result = rows.map((r) => ({
    id: r.id,
    scheduledAt: r.scheduledAt,
    status: r.status,
    totalAmount: Number(r.totalAmount),
    clientName: [r.firstName, r.lastName].filter(Boolean).join(" ") || r.phone,
    serviceNames: svcMap[r.id] ?? [],
  }));

  return NextResponse.json({ appointments: result });
}
