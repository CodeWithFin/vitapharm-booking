# Vitapharm Booking System

A full-stack aesthetic spa booking platform built with Next.js 16, PostgreSQL, and Drizzle ORM.

## Features

**Client booking flow**
- Cart-style service selection with multiple services per appointment
- Dynamic availability engine (checks therapist + room + equipment)
- SMS OTP verification via Advanta Africa
- Pay-on-arrival model — no upfront payment required
- Booking confirmation with pre-care instructions sent via SMS

**Client portal** (passwordless, SMS OTP login)
- Upcoming appointments with itinerary details
- Treatment history
- Active package session balances (e.g. 3/6 Laser Sessions)

**Admin dashboard**
- Daily overview: revenue, appointment count, therapist commission breakdown
- Weekly drag-drop calendar (staff × room × machine)
- In-store checkout: mark appointments completed or no-show
- Automated strike system: 2 no-shows → account restricted from online booking
- Client CRM: Fitzpatrick skin type, allergies, treatment notes, history

**Automated communications**
- Booking confirmation SMS
- Reminders at 24h and 4h before appointment

## Tech stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router) |
| Database | PostgreSQL 16 (Docker) |
| ORM | Drizzle ORM |
| Auth | SMS OTP + JWT (httpOnly cookie) |
| SMS | Advanta Africa |
| UI | Tailwind v4 + custom design tokens |
| Icons | Lucide React |

## Getting started

### 1. Clone and install

```bash
git clone git@github.com:CodeWithFin/vitapharm-booking.git
cd vitapharm-booking
npm install
```

### 2. Start the database

```bash
docker compose up -d
```

### 3. Configure environment

```bash
cp .env.example .env.local
# Fill in your values — see .env.example for all required variables
```

### 4. Push schema and seed

```bash
npm run db:push
npx tsx src/lib/db/seed.ts
```

### 5. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Routes

| Path | Description |
|---|---|
| `/` | Homepage — services overview |
| `/book` | Step 1: service cart |
| `/book/schedule` | Step 2: date, therapist, time |
| `/book/verify` | Step 3: SMS OTP |
| `/book/confirm` | Booking confirmed |
| `/portal` | Client login (SMS OTP) |
| `/portal/dashboard` | Client portal — appointments, packages |
| `/admin` | Admin overview & daily schedule |
| `/admin/calendar` | Weekly calendar view |
| `/admin/clients` | Client CRM |
| `/admin/services` | Service management |

## API routes

| Method | Path | Description |
|---|---|---|
| POST | `/api/auth/send-otp` | Send SMS verification code |
| POST | `/api/auth/verify-otp` | Verify code and issue JWT |
| GET | `/api/services` | List active services |
| GET | `/api/availability` | Get available time slots |
| POST | `/api/appointments` | Create appointment |
| GET | `/api/appointments` | List client appointments |
| GET | `/api/appointments/[id]` | Get single appointment |
| PATCH | `/api/appointments/[id]` | Update status (complete/no-show) |
| GET | `/api/admin/dashboard` | Dashboard stats |

## Database schema

Core tables: `users`, `service_categories`, `services`, `resources`, `service_requirements`, `therapist_services`, `appointments`, `appointment_services`, `appointment_resources`, `packages`, `intake_waivers`, `otp_sessions`

No-show policy: each no-show increments `users.strike_count`. At 2 strikes, `users.is_blocked = true` restricts online self-booking.

## Deployment

**Frontend:** Vercel (push to `main` auto-deploys)  
**Database:** Any VPS running Docker — set `DATABASE_URL` in environment  
**SMS:** Create an account at [Advanta SMS](https://www.advantasms.com/) and set `ADVANTA_API_KEY`
