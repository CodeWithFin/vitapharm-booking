import { NextRequest, NextResponse } from "next/server";
import { verify } from "jsonwebtoken";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";

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
  const therapists = await db.select({
    id: users.id,
    firstName: users.firstName,
    lastName: users.lastName,
    phone: users.phone,
    allergies: users.allergies,   // used as "specialty"
    medicalNotes: users.medicalNotes, // used as "bio"
    isBlocked: users.isBlocked,
  }).from(users).where(eq(users.role, "therapist"));

  return NextResponse.json({
    specialists: therapists.map((t) => ({
      id: t.id,
      firstName: t.firstName,
      lastName: t.lastName,
      name: [t.firstName, t.lastName].filter(Boolean).join(" ") || "Unnamed",
      phone: t.phone,
      specialty: t.allergies || "",
      bio: t.medicalNotes || "",
      isBlocked: t.isBlocked,
    })),
  });
}

const createSchema = z.object({
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100).optional(),
  phone: z.string().min(6).max(20),
  specialty: z.string().max(200).optional(),
  bio: z.string().max(500).optional(),
});

export async function POST(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const data = createSchema.parse(body);

  const [specialist] = await db.insert(users).values({
    firstName: data.firstName,
    lastName: data.lastName,
    phone: data.phone,
    role: "therapist",
    allergies: data.specialty || null,
    medicalNotes: data.bio || null,
  }).returning({ id: users.id });

  return NextResponse.json({ success: true, id: specialist.id }, { status: 201 });
}
