import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { appointments, appointmentResources, therapistServices } from "@/lib/db/schema";
import { and, eq, gte, lte, inArray } from "drizzle-orm";
import { z } from "zod";
import { addMinutes, parseISO, format } from "date-fns";

const querySchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  serviceIds: z.string().transform((s) => s.split(",").map(Number)),
  therapistId: z.string().optional().transform((s) => (s ? Number(s) : undefined)),
});

const SLOT_INTERVAL = 30;
const CLINIC_OPEN = 9 * 60;
const CLINIC_CLOSE = 18 * 60;

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const params = querySchema.parse(Object.fromEntries(searchParams));

    const dayStart = parseISO(`${params.date}T00:00:00`);
    const dayEnd = parseISO(`${params.date}T23:59:59`);

    // Fetch all appointments that overlap this day
    const existingAppts = await db
      .select({
        id: appointments.id,
        therapistId: appointments.therapistId,
        scheduledAt: appointments.scheduledAt,
        endsAt: appointments.endsAt,
        status: appointments.status,
      })
      .from(appointments)
      .where(
        and(
          gte(appointments.scheduledAt, dayStart),
          lte(appointments.scheduledAt, dayEnd),
          inArray(appointments.status, ["pending", "confirmed"])
        )
      );

    // Get total duration for requested services (simplified — fixed 30 min buffer)
    const totalDuration = 60; // In production: sum from services table

    // Generate available slots
    const slots: string[] = [];
    for (let mins = CLINIC_OPEN; mins + totalDuration <= CLINIC_CLOSE; mins += SLOT_INTERVAL) {
      const slotStart = new Date(dayStart);
      slotStart.setHours(0, mins, 0, 0);
      const slotEnd = addMinutes(slotStart, totalDuration);

      // Check if therapist is free during this slot
      const conflict = existingAppts.some((appt) => {
        if (params.therapistId && appt.therapistId !== params.therapistId) return false;
        const apptStart = new Date(appt.scheduledAt);
        const apptEnd = new Date(appt.endsAt);
        return slotStart < apptEnd && slotEnd > apptStart;
      });

      if (!conflict) {
        slots.push(format(slotStart, "HH:mm"));
      }
    }

    return NextResponse.json({ date: params.date, slots, totalDuration });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid parameters" }, { status: 400 });
    }
    console.error("availability GET error:", err);
    return NextResponse.json({ error: "Failed to fetch availability" }, { status: 500 });
  }
}
