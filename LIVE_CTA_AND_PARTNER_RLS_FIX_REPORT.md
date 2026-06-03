# FleetConnect Live CTA And Partner RLS Fix Report

Phase: 5.10 - Booking accepted CTA fix and partner/driver creation RLS fix
Date: 2026-06-03
Branch: checkpoint/production-baseline-phase-5-4

## Scope

This phase addressed live test findings:

- `BOOKING_ACCEPTED` email was received, but CTA pointed to unavailable `fleetconnect.be`.
- Customer CTA should route to the deployed PV client portal/register flow.
- Client portal should preserve booking ID/reference where RLS allows authenticated access.
- Partner creation from the dashboard failed with an RLS error.
- Driver creation used the same direct table insert pattern and required the same hardening.

No UI redesign, broad RLS weakening, Stripe change, email layout change, or branding change was performed.

## CTA Root Cause

`BOOKING_ACCEPTED` already used the central `RouteBuilder`:

- registered customers: `view-booking`
- unregistered customers: `setup-account-prefilled`

The problem was the central production base URL:

- `CommunicationConfig.brand.website` was `https://fleetconnect.be`.
- `RouteBuilder.getBaseUrl()` returned that configured website for non-localhost production pages.

Therefore emails generated from the deployed dashboard could build CTA links on the unavailable `fleetconnect.be` domain.

## CTA Fix Applied

Files changed:

- `src/modules/communication/core/config.js`
- `src/modules/communication/core/routes.js`
- `PV/register.html`
- `PV/klantenportaalpv.html`

Changes:

- Production fallback base URL is now `https://rpk-mu.vercel.app`, overridable through `window.FLEETCONNECT_BASE_URL`.
- `RouteBuilder.getBaseUrl()` now prefers `window.location.origin`, so deployed Vercel emails use the actual deployment origin.
- Unregistered accepted-booking CTA now routes to:
  - `/PV/register.html?booking=<BOOKING_ID>&email=<EMAIL>`
- Registered/customer-view CTA remains:
  - `/PV/klantenportaalpv.html?id=<BOOKING_ID>`
- Register page preserves `booking`, `booking_id`, or `id` query params.
- Register page email verification redirect now returns to:
  - `/PV/klantenportaalpv.html?id=<BOOKING_ID>`
- Client portal now preserves `?id=`, `?booking=`, and `?booking_id=`.

## Client Portal Booking Lookup

`PV/klantenportaalpv.html` previously loaded bookings by demo/current-user-derived `customer_id`.

Minimal fix:

- Hydrate `currentUser` from the Supabase Auth session when present.
- If a booking ID is present and no authenticated session exists, redirect to registration with the booking ID preserved.
- If authenticated, load normal customer bookings and also attempt a single booking lookup by the requested ID.
- RLS remains the enforcement layer:
  - customer policies allow authenticated access by `user_id` or matching email claim
  - anonymous booking lookup is not introduced

Unauthenticated arbitrary booking lookup remains blocked.

## Partner Creation Root Cause

The dashboard used direct insert:

- `supabase.from('partners').insert(...)`

Live RLS protects `partners` with operator-only policies. The observed error was:

- `new row violates row-level security policy for table "partners"`

Direct browser table writes are brittle for protected operational mutations and expose too much of the table contract to the frontend.

## RLS-Safe Partner Fix

Files changed:

- `Paneel/onderaannemerA.html`
- `supabase/migrations/20260603010000_operator_partner_driver_creation_rpcs.sql`

Added live/repository RPC:

- `public.create_operator_partner(payload jsonb)`

Security:

- `SECURITY DEFINER`
- requires `auth.uid() is not null`
- requires `public.is_operator()`
- inserts only allowed fields:
  - `name`
  - `is_hoofd`
  - `prefix`
  - `contact`
  - `email`
  - `phone`
- grants execute only to `authenticated`
- explicitly revokes execute from `public` and `anon`
- keeps RLS enabled

Dashboard now calls the RPC instead of direct `partners.insert`.

## Driver Creation Fix

Driver creation had the same direct insert pattern:

- `supabase.from('drivers').insert(...)`

Added live/repository RPC:

- `public.create_operator_driver(payload jsonb)`

Security:

- `SECURITY DEFINER`
- requires `auth.uid() is not null`
- requires `public.is_operator()`
- validates `partner_id`
- inserts only allowed fields:
  - `partner_id`
  - `driver_code`
  - `name`
  - `email`
  - `phone`
  - `vehicle`
  - `color`
  - `license_plate`
- grants execute only to `authenticated`
- explicitly revokes execute from `public` and `anon`
- keeps RLS enabled

Dashboard now calls the RPC instead of direct `drivers.insert`.

## Live Validation

Live migration applied successfully.

Function grant verification:

- `create_operator_partner(jsonb)`: `SECURITY DEFINER`, executable by `authenticated` only
- `create_operator_driver(jsonb)`: `SECURITY DEFINER`, executable by `authenticated` only
- `anon` execute was explicitly revoked and verified absent

Rollback validation:

- Simulated mapped hoofd operator UID: `b1b29742-62ab-49a2-a63e-8a4eb47559ba`
- `public.is_operator()` succeeded in the transaction.
- `create_operator_partner` created a rollback-only partner.
- `create_operator_driver` created a rollback-only driver for that partner.
- Transaction was rolled back.
- Post-rollback verification:
  - rollback test partners persisted: `0`
  - rollback test drivers persisted: `0`

Static validation:

- Dashboard no longer uses direct `partners.insert`.
- Dashboard no longer uses direct `drivers.insert`.
- `BOOKING_ACCEPTED`, `BOOKING_CONFIRMATION`, `DRIVER_ASSIGNED`, and payment-refund view-booking CTAs use central `RouteBuilder`.
- Communication route/config/template modules no longer contain `fleetconnect.be`.
- Remaining `fleetconnect.be` references are send-email allowed origins or static legal/contact text, not active CTA generation.

## Remaining Validation

Required live browser tests after Vercel redeploy:

1. Accept a booking and inspect the received `BOOKING_ACCEPTED` CTA.
2. Confirm CTA opens `/PV/register.html?booking=<BOOKING_ID>` or `/PV/klantenportaalpv.html?id=<BOOKING_ID>` on `https://rpk-mu.vercel.app`.
3. Register/login through the CTA.
4. Confirm the portal opens the dashboard and shows the booking where RLS allows the authenticated email/user.
5. From dashboard, create a partner.
6. From dashboard, create a driver with an email address.
7. Confirm driver appears in dashboard list.
8. Assign that driver to an accepted booking.
9. Confirm driver assignment email sends to the driver.

## Status

CTA routing: RESOLVED IN REPOSITORY

Partner creation RLS path: RESOLVED LIVE AND IN REPOSITORY

Driver creation RLS path: RESOLVED LIVE AND IN REPOSITORY

Client portal booking-ID support: RESOLVED IN REPOSITORY, PENDING LIVE BROWSER TEST

Certification status: NOT CERTIFIED
