import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { and, eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET() {
  const therapists = await db.select({
    id: users.id,
    firstName: users.firstName,
    lastName: users.lastName,
    allergies: users.allergies,
    medicalNotes: users.medicalNotes,
  }).from(users).where(and(eq(users.role, "therapist"), eq(users.isBlocked, false)));

  return NextResponse.json({
    specialists: therapists.map((t) => ({
      id: t.id,
      name: [t.firstName, t.lastName].filter(Boolean).join(" "),
      specialty: t.allergies || "",
      bio: t.medicalNotes || "",
    })),
  });
}
