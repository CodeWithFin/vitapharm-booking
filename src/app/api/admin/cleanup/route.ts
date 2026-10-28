import { NextRequest, NextResponse } from "next/server";
import { verify } from "jsonwebtoken";
import { db } from "@/lib/db";
import { appointments, appointmentServices, services } from "@/lib/db/schema";
import { eq, inArray, ilike } from "drizzle-orm";

export const dynamic = "force-dynamic";

function isAdmin(req: NextRequest) {
  const token = req.cookies.get("admin_token")?.value;
  if (!token) return false;
  try {
    const p = verify(token, process.env.JWT_SECRET || "dev-secret") as { role?: string };
    return p.role === "admin";
  } catch { return false; }
}

const REAL_NAMES = [
  "Timeless Facial","Hydrafacial Advanced","Hydrafacial Med","Peptide Facial",
  "Acne Treatment Facial","Glow Fusion Facial","Chemical Peel","Deep Treatment Facial",
  "Microneedling","PRP Microneedling","Dermaplaning","Mesotherapy","Royal Facial",
  "Teen Acne Treatment","Adult Acne Treatment","Reflexology Massage","Sports Massage",
  "Deep Tissue Massage","Swedish Massage","Underarms Waxing","Chin Waxing","Leg Waxing",
  "Chest Waxing","Back Waxing","Manzilian","Bikini Waxing","Brazilian Waxing",
  "Dermatology Consultation","Acne Specialist","Skin Attendant Consultation",
  "Aesthetician Consultation","Skin Analysis",
];

export async function POST(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // 1. Cancel Microdermabrasion appointments via subquery
  const microdermSvc = await db.select({ id: services.id })
    .from(services).where(ilike(services.name, "%microdermabrasion%"));
  const microdermIds = microdermSvc.map(s => s.id);

  let cancelledCount = 0;
  if (microdermIds.length > 0) {
    const apptRows = await db.select({ appointmentId: appointmentServices.appointmentId })
      .from(appointmentServices).where(inArray(appointmentServices.serviceId, microdermIds));
    const apptIds = [...new Set(apptRows.map(r => r.appointmentId))];
    if (apptIds.length > 0) {
      await db.update(appointments).set({ status: "cancelled" })
        .where(inArray(appointments.id, apptIds));
      cancelledCount = apptIds.length;
    }
  }

  // 2. Find and delete stale services
  const allServices = await db.select({ id: services.id, name: services.name }).from(services);
  const stale = allServices.filter(
    s => !REAL_NAMES.some(n => n.toLowerCase() === s.name.toLowerCase())
  );
  const staleIds = stale.map(s => s.id);

  let deletedServices = 0;
  if (staleIds.length > 0) {
    await db.delete(appointmentServices).where(inArray(appointmentServices.serviceId, staleIds));
    await db.delete(services).where(inArray(services.id, staleIds));
    deletedServices = staleIds.length;
  }

  return NextResponse.json({
    cancelledAppointments: cancelledCount,
    deletedServices,
    staleServiceNames: stale.map(s => s.name),
  });
}

export async function GET(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const allServices = await db.select({ id: services.id, name: services.name, price: services.price }).from(services);
  const stale = allServices.filter(
    s => !REAL_NAMES.some(n => n.toLowerCase() === s.name.toLowerCase())
  );
  return NextResponse.json({ all: allServices, stale });
}
