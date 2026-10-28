import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { services, serviceCategories } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const categorySlug = searchParams.get("category");

    const query = db
      .select({
        id: services.id,
        name: services.name,
        slug: services.slug,
        description: services.description,
        durationMinutes: services.durationMinutes,
        price: services.price,
        requiresWaiver: services.requiresWaiver,
        imageUrl: services.imageUrl,
        category: { id: serviceCategories.id, name: serviceCategories.name, slug: serviceCategories.slug },
      })
      .from(services)
      .innerJoin(serviceCategories, eq(services.categoryId, serviceCategories.id))
      .where(eq(services.isActive, true));

    const rows = await query;

    const filtered = categorySlug
      ? rows.filter((r) => r.category.slug === categorySlug)
      : rows;

    return NextResponse.json({ services: filtered });
  } catch (err) {
    console.error("services GET error:", err);
    return NextResponse.json({ error: "Failed to fetch services" }, { status: 500 });
  }
}
