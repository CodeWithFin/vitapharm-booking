import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { otpSessions } from "@/lib/db/schema";
import { z } from "zod";

const schema = z.object({
  phone: z.string().regex(/^\+254\d{9}$/, "Phone must be a valid Kenyan number (+254XXXXXXXXX)"),
});

function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

async function sendSms(phone: string, message: string) {
  const apiKey = process.env.TILIL_API_KEY;
  if (!apiKey) {
    console.log(`[DEV] SMS to ${phone}: ${message}`);
    return true;
  }

  const endpoint = process.env.SMS_ENDPOINT || "https://api.tililtech.com/sms/v3/sendsms";
  const shortcode = process.env.TILIL_SHORTCODE || "VITAPHARM";

  const res = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      api_key: apiKey,
      mobile: phone,
      message,
      shortcode,
    }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    console.error("Tililtech SMS error:", res.status, text);
    return false;
  }

  const data = await res.json().catch(() => ({}));
  // Tililtech returns { status_code, status_desc } — 1000 is success
  return data.status_code === 1000 || data.status_code === "1000";
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { phone } = schema.parse(body);

    const code = generateOtp();
    const expiresAt = new Date(
      Date.now() + parseInt(process.env.OTP_EXPIRY_MINUTES || "10") * 60 * 1000
    );

    await db.insert(otpSessions).values({ phone, code, expiresAt });

    const sent = await sendSms(
      phone,
      `Your Vitapharm verification code is: ${code}. Valid for 10 minutes. Do not share this code.`
    );
    if (!sent) throw new Error("SMS delivery failed");

    return NextResponse.json({ success: true });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues[0].message }, { status: 400 });
    }
    console.error("send-otp error:", err);
    return NextResponse.json({ error: "Failed to send verification code" }, { status: 500 });
  }
}
