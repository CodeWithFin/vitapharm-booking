import { NextRequest, NextResponse } from "next/server";
import { verify } from "jsonwebtoken";
import { db } from "@/lib/db";
import { users, appointments, appointmentServices, services } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";

export const dynamic = "force-dynamic";

function getUser(req: NextRequest) {
  const token = req.cookies.get("auth_token")?.value;
  if (!token) return null;
  try {
    return verify(token, process.env.JWT_SECRET || "dev-secret") as unknown as { sub: number; phone: string; role: string };
  } catch {
    return null;
  }
}

export async function GET(req: NextRequest) {
  const payload = getUser(req);
  if (!payload) return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });

  const [user] = await db.select().from(users).where(eq(users.id, payload.sub)).limit(1);
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  // Fetch appointments with their services
  const appts = await db
    .select()
    .from(appointments)
    .where(eq(appointments.clientId, user.id))
    .orderBy(desc(appointments.scheduledAt));

  // Fetch service names for each appointment
  const apptWithServices = await Promise.all(
    appts.map(async (appt) => {
      const rows = await db
        .select({ name: services.name })
        .from(appointmentServices)
        .innerJoin(services, eq(appointmentServices.serviceId, services.id))
        .where(eq(appointmentServices.appointmentId, appt.id));
      return { ...appt, serviceNames: rows.map((r) => r.name) };
    })
  );

  return NextResponse.json({
    user: {
      id: user.id,
      phone: user.phone,
      firstName: user.firstName,
      lastName: user.lastName,
    },
    appointments: apptWithServices,
  });
}
