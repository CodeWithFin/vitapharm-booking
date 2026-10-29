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

const updateSchema = z.object({
  firstName: z.string().min(1).max(100).optional(),
  lastName: z.string().max(100).optional(),
  specialty: z.string().max(200).optional(),
  bio: z.string().max(500).optional(),
  isBlocked: z.boolean().optional(),
});

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!isAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const body = await req.json();
  const data = updateSchema.parse(body);

  await db.update(users).set({
    ...(data.firstName !== undefined && { firstName: data.firstName }),
    ...(data.lastName !== undefined && { lastName: data.lastName }),
    ...(data.specialty !== undefined && { allergies: data.specialty }),
    ...(data.bio !== undefined && { medicalNotes: data.bio }),
    ...(data.isBlocked !== undefined && { isBlocked: data.isBlocked }),
  }).where(eq(users.id, Number(id)));

  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!isAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  await db.update(users).set({ isBlocked: true }).where(eq(users.id, Number(id)));
  return NextResponse.json({ success: true });
}
