import { db } from "./index";
import { serviceCategories, services, resources, users } from "./schema";

async function seed() {
  console.log("Seeding database...");

  // Categories
  const [facial, laser, body, consultation] = await db
    .insert(serviceCategories)
    .values([
      { name: "Facial & Peels", slug: "facial", sortOrder: 1 },
      { name: "Laser Treatments", slug: "laser", sortOrder: 2 },
      { name: "Body Treatments", slug: "body", sortOrder: 3 },
      { name: "Consultations", slug: "consultation", sortOrder: 4 },
    ])
    .returning();

  console.log("Created categories");

  // Services
  await db.insert(services).values([
    { categoryId: facial.id, name: "Hydra Facial", slug: "hydra-facial", durationMinutes: 60, price: "4500.00", requiresWaiver: false },
    { categoryId: facial.id, name: "Chemical Peel", slug: "chemical-peel", durationMinutes: 45, price: "3800.00", requiresWaiver: true, waiverContent: "I understand chemical peels may cause temporary redness and peeling..." },
    { categoryId: facial.id, name: "Microdermabrasion", slug: "microdermabrasion", durationMinutes: 45, price: "3200.00", requiresWaiver: false },
    { categoryId: facial.id, name: "Brightening Facial", slug: "brightening-facial", durationMinutes: 60, price: "4000.00", requiresWaiver: false },
    { categoryId: laser.id, name: "Laser Hair Removal — Face", slug: "laser-hair-face", durationMinutes: 30, price: "2500.00", requiresWaiver: true, waiverContent: "I understand laser treatments may cause temporary skin reactions..." },
    { categoryId: laser.id, name: "Laser Hair Removal — Body", slug: "laser-hair-body", durationMinutes: 90, price: "6500.00", requiresWaiver: true, waiverContent: "I understand laser treatments may cause temporary skin reactions..." },
    { categoryId: laser.id, name: "Carbon Laser Facial", slug: "carbon-laser-facial", durationMinutes: 60, price: "6000.00", requiresWaiver: true, waiverContent: "I understand laser treatments may cause temporary skin reactions..." },
    { categoryId: laser.id, name: "IPL Photofacial", slug: "ipl-photofacial", durationMinutes: 45, price: "5500.00", requiresWaiver: true, waiverContent: "I understand IPL treatments may cause temporary skin reactions..." },
    { categoryId: body.id, name: "Body Contouring", slug: "body-contouring", durationMinutes: 45, price: "5500.00", requiresWaiver: false },
    { categoryId: body.id, name: "Cellulite Treatment", slug: "cellulite-treatment", durationMinutes: 60, price: "5000.00", requiresWaiver: false },
    { categoryId: consultation.id, name: "Initial Skin Consultation", slug: "skin-consultation", durationMinutes: 30, price: "1500.00", requiresWaiver: false },
    { categoryId: consultation.id, name: "Follow-up Consultation", slug: "followup-consultation", durationMinutes: 20, price: "800.00", requiresWaiver: false },
  ]);

  console.log("Created services");

  // Resources
  await db.insert(resources).values([
    { name: "Treatment Room 1", type: "room" },
    { name: "Treatment Room 2", type: "room" },
    { name: "Treatment Room 3", type: "room" },
    { name: "Laser Suite", type: "room" },
    { name: "Candela GentleMax Pro (Laser)", type: "machine" },
    { name: "HydraFacial MD Device", type: "machine" },
    { name: "IPL Machine", type: "machine" },
    { name: "Body Contouring Machine", type: "machine" },
  ]);

  console.log("Created resources");

  // Staff users
  await db.insert(users).values([
    { phone: "+254700000001", firstName: "Amara", lastName: "Osei", role: "therapist", commissionRate: "35.00" },
    { phone: "+254700000002", firstName: "Naledi", lastName: "Dlamini", role: "therapist", commissionRate: "35.00" },
    { phone: "+254700000003", firstName: "Fatima", lastName: "Hassan", role: "therapist", commissionRate: "38.00" },
    { phone: "+254700000000", firstName: "Admin", lastName: "User", role: "admin" },
  ]);

  console.log("Created staff");
  console.log("Seed complete!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
