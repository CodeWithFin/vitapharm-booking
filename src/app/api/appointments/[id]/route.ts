import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { appointments, users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";

const updateSchema = z.object({
  status: z.enum(["confirmed", "completed", "no_show", "cancelled"]),
  internalNotes: z.string().optional(),
});

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const appointmentId = parseInt(id);
    if (isNaN(appointmentId)) return NextResponse.json({ error: "Invalid ID" }, { status: 400 });

    const body = await req.json();
    const { status, internalNotes } = updateSchema.parse(body);

    const [appointment] = await db.select().from(appointments).where(eq(appointments.id, appointmentId)).limit(1);
    if (!appointment) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const updateData: Record<string, unknown> = { status, updatedAt: new Date() };
    if (status === "completed") updateData.completedAt = new Date();
    if (internalNotes) updateData.internalNotes = internalNotes;

    // Handle no-show strike system
    if (status === "no_show") {
      const [client] = await db.select().from(users).where(eq(users.id, appointment.clientId)).limit(1);
      if (client) {
        const newStrikeCount = client.strikeCount + 1;
        await db.update(users).set({
          strikeCount: newStrikeCount,
          isBlocked: newStrikeCount >= 2,
        }).where(eq(users.id, client.id));
      }
    }

    const [updated] = await db
      .update(appointments)
      .set(updateData)
      .where(eq(appointments.id, appointmentId))
      .returning();

    return NextResponse.json({ appointment: updated });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }
    console.error("appointment PATCH error:", err);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const appointmentId = parseInt(id);
    if (isNaN(appointmentId)) return NextResponse.json({ error: "Invalid ID" }, { status: 400 });

    const [appointment] = await db.select().from(appointments).where(eq(appointments.id, appointmentId)).limit(1);
    if (!appointment) return NextResponse.json({ error: "Not found" }, { status: 404 });

    return NextResponse.json({ appointment });
  } catch (err) {
    console.error("appointment GET error:", err);
    return NextResponse.json({ error: "Fetch failed" }, { status: 500 });
  }
}
