import {
  pgTable,
  serial,
  text,
  varchar,
  integer,
  decimal,
  boolean,
  timestamp,
  pgEnum,
  primaryKey,
  index,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ─── Enums ───────────────────────────────────────────────────────────────────

export const userRoleEnum = pgEnum("user_role", ["client", "therapist", "admin"]);
export const appointmentStatusEnum = pgEnum("appointment_status", [
  "pending",
  "confirmed",
  "completed",
  "no_show",
  "cancelled",
]);
export const resourceTypeEnum = pgEnum("resource_type", ["room", "machine"]);
export const fitzpatrickEnum = pgEnum("fitzpatrick_type", ["I", "II", "III", "IV", "V", "VI"]);

// ─── Users ───────────────────────────────────────────────────────────────────

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  phone: varchar("phone", { length: 20 }).unique().notNull(),
  email: varchar("email", { length: 255 }).unique(),
  firstName: varchar("first_name", { length: 100 }),
  lastName: varchar("last_name", { length: 100 }),
  role: userRoleEnum("role").notNull().default("client"),
  strikeCount: integer("strike_count").notNull().default(0),
  isBlocked: boolean("is_blocked").notNull().default(false),
  fitzpatrickType: fitzpatrickEnum("fitzpatrick_type"),
  allergies: text("allergies"),
  medicalNotes: text("medical_notes"),
  commissionRate: decimal("commission_rate", { precision: 5, scale: 2 }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// ─── OTP Sessions ─────────────────────────────────────────────────────────────

export const otpSessions = pgTable("otp_sessions", {
  id: serial("id").primaryKey(),
  phone: varchar("phone", { length: 20 }).notNull(),
  code: varchar("code", { length: 6 }).notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  verified: boolean("verified").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// ─── Service Categories ───────────────────────────────────────────────────────

export const serviceCategories = pgTable("service_categories", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  slug: varchar("slug", { length: 100 }).unique().notNull(),
  description: text("description"),
  sortOrder: integer("sort_order").notNull().default(0),
});

// ─── Services ─────────────────────────────────────────────────────────────────

export const services = pgTable("services", {
  id: serial("id").primaryKey(),
  categoryId: integer("category_id").notNull().references(() => serviceCategories.id),
  name: varchar("name", { length: 200 }).notNull(),
  slug: varchar("slug", { length: 200 }).unique().notNull(),
  description: text("description"),
  durationMinutes: integer("duration_minutes").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  isActive: boolean("is_active").notNull().default(true),
  requiresWaiver: boolean("requires_waiver").notNull().default(false),
  waiverContent: text("waiver_content"),
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// ─── Resources (Rooms & Machines) ─────────────────────────────────────────────

export const resources = pgTable("resources", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  type: resourceTypeEnum("type").notNull(),
  description: text("description"),
  isActive: boolean("is_active").notNull().default(true),
});

// ─── Service Requirements (which resources a service needs) ──────────────────

export const serviceRequirements = pgTable(
  "service_requirements",
  {
    serviceId: integer("service_id").notNull().references(() => services.id),
    resourceId: integer("resource_id").notNull().references(() => resources.id),
  },
  (table) => [primaryKey({ columns: [table.serviceId, table.resourceId] })]
);

// ─── Therapist Services (which therapist can perform which services) ──────────

export const therapistServices = pgTable(
  "therapist_services",
  {
    therapistId: integer("therapist_id").notNull().references(() => users.id),
    serviceId: integer("service_id").notNull().references(() => services.id),
  },
  (table) => [primaryKey({ columns: [table.therapistId, table.serviceId] })]
);

// ─── Packages ─────────────────────────────────────────────────────────────────

export const packages = pgTable("packages", {
  id: serial("id").primaryKey(),
  clientId: integer("client_id").notNull().references(() => users.id),
  serviceId: integer("service_id").notNull().references(() => services.id),
  totalSessions: integer("total_sessions").notNull(),
  usedSessions: integer("used_sessions").notNull().default(0),
  purchaseDate: timestamp("purchase_date").notNull().defaultNow(),
  expiryDate: timestamp("expiry_date"),
  notes: text("notes"),
});

// ─── Appointments ─────────────────────────────────────────────────────────────

export const appointments = pgTable(
  "appointments",
  {
    id: serial("id").primaryKey(),
    clientId: integer("client_id").notNull().references(() => users.id),
    therapistId: integer("therapist_id").references(() => users.id),
    status: appointmentStatusEnum("status").notNull().default("pending"),
    scheduledAt: timestamp("scheduled_at").notNull(),
    endsAt: timestamp("ends_at").notNull(),
    totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
    commissionAmount: decimal("commission_amount", { precision: 10, scale: 2 }),
    notes: text("notes"),
    internalNotes: text("internal_notes"),
    reminderSent24h: boolean("reminder_sent_24h").notNull().default(false),
    reminderSent4h: boolean("reminder_sent_4h").notNull().default(false),
    checkedInAt: timestamp("checked_in_at"),
    completedAt: timestamp("completed_at"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => [index("idx_appointments_scheduled_at").on(table.scheduledAt)]
);

// ─── Appointment Services (line items) ────────────────────────────────────────

export const appointmentServices = pgTable(
  "appointment_services",
  {
    appointmentId: integer("appointment_id").notNull().references(() => appointments.id),
    serviceId: integer("service_id").notNull().references(() => services.id),
    price: decimal("price", { precision: 10, scale: 2 }).notNull(),
    packageId: integer("package_id").references(() => packages.id),
  },
  (table) => [primaryKey({ columns: [table.appointmentId, table.serviceId] })]
);

// ─── Appointment Resources (rooms/machines used) ───────────────────────────────

export const appointmentResources = pgTable(
  "appointment_resources",
  {
    appointmentId: integer("appointment_id").notNull().references(() => appointments.id),
    resourceId: integer("resource_id").notNull().references(() => resources.id),
  },
  (table) => [primaryKey({ columns: [table.appointmentId, table.resourceId] })]
);

// ─── Intake Waivers ────────────────────────────────────────────────────────────

export const intakeWaivers = pgTable("intake_waivers", {
  id: serial("id").primaryKey(),
  appointmentId: integer("appointment_id").notNull().references(() => appointments.id),
  serviceId: integer("service_id").notNull().references(() => services.id),
  responses: text("responses").notNull(),
  signedAt: timestamp("signed_at").notNull().defaultNow(),
});

// ─── Relations ────────────────────────────────────────────────────────────────

export const usersRelations = relations(users, ({ many }) => ({
  appointments: many(appointments, { relationName: "client_appointments" }),
  therapistAppointments: many(appointments, { relationName: "therapist_appointments" }),
  packages: many(packages),
  therapistServices: many(therapistServices),
}));

export const servicesRelations = relations(services, ({ one, many }) => ({
  category: one(serviceCategories, {
    fields: [services.categoryId],
    references: [serviceCategories.id],
  }),
  requirements: many(serviceRequirements),
  therapists: many(therapistServices),
  appointmentServices: many(appointmentServices),
}));

export const appointmentsRelations = relations(appointments, ({ one, many }) => ({
  client: one(users, {
    fields: [appointments.clientId],
    references: [users.id],
    relationName: "client_appointments",
  }),
  therapist: one(users, {
    fields: [appointments.therapistId],
    references: [users.id],
    relationName: "therapist_appointments",
  }),
  services: many(appointmentServices),
  resources: many(appointmentResources),
  waivers: many(intakeWaivers),
}));
