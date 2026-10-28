import { NextRequest, NextResponse } from "next/server";
import { verify } from "jsonwebtoken";
import { db } from "@/lib/db";
import { appointments, users, appointmentServices, services } from "@/lib/db/schema";
import { eq, and, gte, lte } from "drizzle-orm";

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

  const { searchParams } = new URL(req.url);
  const from = searchParams.get("from");
  const to = searchParams.get("to");
  if (!from || !to) return NextResponse.json({ error: "from and to required" }, { status: 400 });

  const appts = await db
    .select({
      id: appointments.id,
      scheduledAt: appointments.scheduledAt,
      endsAt: appointments.endsAt,
      status: appointments.status,
      totalAmount: appointments.totalAmount,
      clientFirstName: users.firstName,
      clientLastName: users.lastName,
      clientPhone: users.phone,
    })
    .from(appointments)
    .leftJoin(users, eq(appointments.clientId, users.id))
    .where(and(gte(appointments.scheduledAt, new Date(from)), lte(appointments.scheduledAt, new Date(to))))
    .orderBy(appointments.scheduledAt);

  const withServices = await Promise.all(
    appts.map(async (a) => {
      const rows = await db
        .select({ name: services.name })
        .from(appointmentServices)
        .innerJoin(services, eq(appointmentServices.serviceId, services.id))
        .where(eq(appointmentServices.appointmentId, a.id));
      return {
        id: a.id,
        scheduledAt: a.scheduledAt.toISOString(),
        endsAt: a.endsAt?.toISOString() ?? null,
        status: a.status,
        totalAmount: Number(a.totalAmount),
        clientName: [a.clientFirstName, a.clientLastName].filter(Boolean).join(" ") || a.clientPhone || "Unknown",
        clientPhone: a.clientPhone || null,
        serviceNames: rows.map((r) => r.name),
      };
    })
  );

  return NextResponse.json({ appointments: withServices });
}
