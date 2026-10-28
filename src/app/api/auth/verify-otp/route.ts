import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { otpSessions, users } from "@/lib/db/schema";
import { eq, and, gt } from "drizzle-orm";
import { z } from "zod";
import { sign } from "jsonwebtoken";

const schema = z.object({
  phone: z.string().regex(/^\+254\d{9}$/),
  code: z.string().length(6),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { phone, code } = schema.parse(body);

    // Find a valid, unverified OTP
    const [session] = await db
      .select()
      .from(otpSessions)
      .where(
        and(
          eq(otpSessions.phone, phone),
          eq(otpSessions.code, code),
          eq(otpSessions.verified, false),
          gt(otpSessions.expiresAt, new Date())
        )
      )
      .limit(1);

    if (!session) {
      return NextResponse.json({ error: "Invalid or expired code" }, { status: 401 });
    }

    // Mark session as used
    await db.update(otpSessions).set({ verified: true }).where(eq(otpSessions.id, session.id));

    // Upsert user record
    let [user] = await db.select().from(users).where(eq(users.phone, phone)).limit(1);
    if (!user) {
      [user] = await db.insert(users).values({ phone, role: "client" }).returning();
    }

    // Check if blocked
    if (user.isBlocked) {
      return NextResponse.json({ error: "Your account has been restricted. Please contact us." }, { status: 403 });
    }

    const token = sign(
      { sub: user.id, phone: user.phone, role: user.role },
      process.env.JWT_SECRET || "dev-secret",
      { expiresIn: "7d" }
    );

    const response = NextResponse.json({ success: true, userId: user.id });
    response.cookies.set("auth_token", token, {
      httpOnly: true,
      // secure requires HTTPS — disable until SSL is provisioned
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
    });

    return response;
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }
    console.error("verify-otp error:", err);
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}
