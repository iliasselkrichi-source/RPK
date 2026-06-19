# FleetConnect Partner PWA Registration + Install Report

Date: 2026-06-19
Branch: `phase-partner-pwa-registration-install`

## Summary

Implemented the missing production layer for the existing FleetConnect Partner PWA without rewriting the working ride-management app.

The Partner PWA now includes:

- Partner/driver account request entry point on the PWA login screen.
- French default UI with EN, ES, and AR translations.
- Arabic RTL switching preserved.
- Pending-approval messaging for applicants.
- Supabase Auth signup plus `account_requests` submission.
- Safe backend migration to preserve partner/driver request metadata.
- Install prompt/help text for Android and iPhone users.
- PNG PWA icons and Apple touch icon.
- Singular `partner.fleetconnect.be` root rewrite.

## Frontend Implementation

Updated `partner-app/index.html`:

- Added login/register tab switch.
- Added account request form.
- Added fields:
  - account type
  - full name
  - company name
  - email
  - phone
  - vehicle type
  - operating area / region
  - preferred language
  - password
  - confirm password
  - optional notes
- Company name is required only for partner-company requests.
- Driver requests hide the company field.
- Registration creates a Supabase Auth signup request and then stores the pending request through `submit_account_request`.
- Pending applicants are signed out after request submission.
- Applicant success message:
  - French: `Votre demande a été envoyée. FleetConnect vous contactera après validation.`
- Install help is available from the login screen.

## Backend / Supabase Implementation

Added migration:

`supabase/migrations/20260619020000_partner_pwa_registration_requests.sql`

The migration reuses the existing `account_requests` table and `submit_account_request(payload jsonb)` RPC.

Changes:

- Preserves existing customer/operator request behavior.
- Requires company name for partner-company account requests.
- Stores partner/driver metadata:
  - `vehicle_type`
  - `operating_area`
  - `preferred_language`
  - `requested_portal`
- Keeps requests in `pending` status.
- Grants RPC execution only to `anon` and `authenticated`.
- Does not grant ride access.
- Does not auto-approve unknown partner/driver applicants.
- Does not weaken RLS.

## PWA Install Implementation

Updated:

- `partner-app/manifest.webmanifest`
- `partner-app/service-worker.js`
- `partner-app/index.html`

Added icons:

- `partner-app/icon-192.png`
- `partner-app/icon-512.png`
- `partner-app/apple-touch-icon.png`

Manifest now includes PNG icons for Android and an Apple touch icon for iPhone home-screen install support.

Install help text:

- FR: install app guidance.
- EN: install app guidance.
- ES: install app guidance.
- AR: install app guidance with RTL layout.

## Routing

Updated `vercel.json`:

- Added root rewrite for `partner.fleetconnect.be` to `/partner-app/index.html`.
- Existing `partners.fleetconnect.be` rewrite remains intact.
- Existing `/partner-app`, `/partner-login`, and `/driver-login` routes remain intact.

## Validation Performed

Static checks:

- `partner-app/index.html` module script parse: PASS
- `partner-app/manifest.webmanifest` JSON parse: PASS
- `vercel.json` JSON parse: PASS
- `partner-app/service-worker.js` syntax check: PASS
- `git diff --check`: PASS

Rendered mobile smoke test at `http://127.0.0.1:4173/partner-app/`:

- French default loads: PASS
- Register tab visible: PASS
- Registration form fields present: PASS
- Partner/company requirement enforced in UI: PASS
- Driver request hides company field: PASS
- Language options FR/EN/ES/AR present: PASS
- Arabic switches document to `dir="rtl"`: PASS
- Mobile horizontal overflow absent: PASS
- Manifest available: PASS
- Service worker available: PASS
- PNG icons available: PASS
- Browser console/page errors during smoke test: none observed.

## Live Supabase Status

The migration has been created in the repository but was not applied to the live Supabase project from this workstation.

Reason:

- No `.env` or linked Supabase project ref was present.
- `supabase --version` timed out.
- `npx supabase --version` timed out.

Manual application is required before full live validation:

1. Open Supabase SQL Editor for project `rreqjjrmvytnwnsidmqi`.
2. Run the contents of:
   `supabase/migrations/20260619020000_partner_pwa_registration_requests.sql`
3. Verify:
   ```sql
   select proname
   from pg_proc
   where proname = 'submit_account_request';
   ```
4. Submit a controlled partner/driver request from `/partner-app/`.
5. Verify:
   ```sql
   select
     id,
     email,
     account_type,
     request_scope,
     status,
     metadata->>'vehicle_type' as vehicle_type,
     metadata->>'operating_area' as operating_area,
     metadata->>'preferred_language' as preferred_language,
     metadata->>'requested_portal' as requested_portal
   from public.account_requests
   where metadata->>'source' = 'partner-pwa-registration'
   order by created_at desc
   limit 10;
   ```

## Routes To Test

- `https://partner.fleetconnect.be/`
- `https://partner.fleetconnect.be/partner-app/`
- `https://partner.fleetconnect.be/partner-login`
- `https://partner.fleetconnect.be/driver-login`

## Live Test Checklist

- Open Partner PWA on smartphone.
- Confirm French default.
- Switch to EN, ES, and AR.
- Confirm Arabic RTL layout.
- Submit partner-company request.
- Submit individual-driver request.
- Verify request row in `account_requests`.
- Verify request status is `pending`.
- Verify pending applicant cannot see ride data.
- Approve request through existing operator flow.
- Verify approved partner/driver can log in.
- Verify approved user can see assigned rides only.
- Install on Android via browser install prompt.
- Install on iPhone via Safari share sheet.
- Verify home-screen icon shows FleetConnect Partner branding.

## Known Limitations

- Live Supabase migration still needs to be applied before metadata preservation can be certified.
- Local smoke testing did not submit a real production account request to avoid polluting live data before migration.
- Android/iPhone install behavior was validated structurally; final install confirmation must be performed on real devices after deployment.

## Certification Status

NOT READY FOR FOUNDER LIVE TEST until the Supabase migration is applied and one controlled live partner/driver request is validated end-to-end.

