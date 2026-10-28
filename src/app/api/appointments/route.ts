import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { appointments, appointmentServices, users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { parseISO, addMinutes, format } from "date-fns";

async function sendSms(phone: string, message: string) {
  const apiKey = process.env.TILIL_API_KEY;
  if (!apiKey) { console.log(`[DEV] SMS to ${phone}: ${message}`); return; }
  const endpoint = process.env.SMS_ENDPOINT || "https://api.tililtech.com/sms/v3/sendsms";
  const shortcode = process.env.TILIL_SHORTCODE || "VITAPHARM";
  try {
    await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ api_key: apiKey, mobile: phone, message, shortcode }),
    });
  } catch (e) {
    console.error("Confirmation SMS failed:", e);
  }
}

const createSchema = z.object({
  phone: z.string().regex(/^\+254\d{9}$/),
  firstName: z.string().min(1).max(100).optional(),
  lastName: z.string().min(1).max(100).optional(),
  therapistId: z.number().optional(),
  scheduledAt: z.string().datetime(),
  services: z.array(z.object({
    id: z.number(),
    name: z.string(),
    durationMinutes: z.number(),
    price: z.number(),
  })).min(1),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = createSchema.parse(body);

    // Find or create client
    let [client] = await db.select().from(users).where(eq(users.phone, data.phone)).limit(1);
    if (!client) {
      [client] = await db.insert(users).values({
        phone: data.phone,
        firstName: data.firstName,
        lastName: data.lastName,
        role: "client",
      }).returning();
    } else if (data.firstName || data.lastName) {
      await db.update(users).set({ firstName: data.firstName, lastName: data.lastName }).where(eq(users.id, client.id));
    }

    if (client.isBlocked) {
      return NextResponse.json({ error: "Account restricted from online booking" }, { status: 403 });
    }

    const totalDuration = data.services.reduce((s, i) => s + i.durationMinutes, 0);
    const totalAmount = data.services.reduce((s, i) => s + i.price, 0);
    const scheduledAt = parseISO(data.scheduledAt);
    const endsAt = addMinutes(scheduledAt, totalDuration);

    const [appointment] = await db.insert(appointments).values({
      clientId: client.id,
      therapistId: data.therapistId,
      scheduledAt,
      endsAt,
      totalAmount: totalAmount.toFixed(2),
      status: "pending",
    }).returning();

    // Insert line items
    await db.insert(appointmentServices).values(
      data.services.map((s) => ({
        appointmentId: appointment.id,
        serviceId: s.id,
        price: s.price.toFixed(2),
      }))
    );

    // Send confirmation SMS
    const serviceNames = data.services.map((s) => s.name).join(", ");
    const dateStr = format(scheduledAt, "EEEE, MMM d 'at' h:mm a");
    const confirmMsg = `Hi ${data.firstName || "there"}, your Vitapharm booking is confirmed!\n\n${serviceNames}\n${dateStr}\n\nPayment of KES ${totalAmount.toLocaleString()} is due on arrival. See you soon!`;
    sendSms(data.phone, confirmMsg);

    return NextResponse.json({ success: true, appointmentId: appointment.id }, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues[0].message }, { status: 400 });
    }
    console.error("appointments POST error:", err);
    return NextResponse.json({ error: "Failed to create appointment" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const clientPhone = searchParams.get("phone");

    if (!clientPhone) {
      return NextResponse.json({ error: "phone is required" }, { status: 400 });
    }

    const [client] = await db.select().from(users).where(eq(users.phone, clientPhone)).limit(1);
    if (!client) {
      return NextResponse.json({ appointments: [] });
    }

    const rows = await db
      .select()
      .from(appointments)
      .where(eq(appointments.clientId, client.id))
      .orderBy(appointments.scheduledAt);

    return NextResponse.json({ appointments: rows });
  } catch (err) {
    console.error("appointments GET error:", err);
    return NextResponse.json({ error: "Failed to fetch appointments" }, { status: 500 });
  }
}
