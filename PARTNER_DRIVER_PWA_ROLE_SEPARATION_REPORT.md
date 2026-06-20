# Partner / Driver PWA Role Separation Report

Date: 2026-06-20
Branch: `partner-driver-pwa-role-separation`
Status: Partner / Driver PWA role separation complete for repository implementation.

## Audit Findings

### What Already Existed

- `partners.fleetconnect.be`, `/partner-app`, `/partner-login`, and `/driver-login` already route to the Partner PWA.
- The PWA already supports Supabase Auth login, installable PWA metadata, service worker shell caching, and EN/FR/NL/ES/AR language switching with Arabic RTL.
- Existing backend RPCs already identify `driver`, `partner`, and `driver_partner` roles through `partner_pwa_context()`.
- Existing ride RPCs already scope driver actions to the authenticated assigned driver.
- Existing registration flow already creates pending `account_requests` and does not auto-approve partner/driver accounts.

### What Was Missing Or Partial

- The frontend rendered one shared ride-execution experience instead of a distinct partner/company view and driver execution view.
- Partner users could see scoped rides but did not get a business panel with linked drivers.
- Driver registration did not capture partner assignment or manual partner/company details.
- Account request metadata did not reliably preserve partner-linking details such as selected partner, manual company name, and license plate.
- Partner-side driver edit/archive/request actions were not available in the PWA.

## Implemented Changes

- Added partner/company-only business panel in the PWA:
  - partner profile summary
  - partner ride volume
  - acceptance status summary
  - linked driver list
  - driver request form
  - driver edit action
  - driver archive/deactivate action
- Kept driver users in the execution-focused ride workflow:
  - assigned rides
  - ride detail
  - accept/decline
  - on the way / arrived / completed
  - call, WhatsApp, and maps links
- Added driver registration fields:
  - partner assignment
  - manual partner/company name when not listed
  - license plate
- Preserved language flow:
  - EN/FR/NL/ES/AR supported
  - saved language via `localStorage`
  - browser-language fallback
  - Arabic RTL preserved
  - preferred language stored in account-request metadata where available

## Backend Changes

Migration:

- `supabase/migrations/20260620193000_partner_driver_pwa_role_separation.sql`

New or updated RPC support:

- `partner_pwa_public_partner_options()`
  - safe public list of non-archived partner company names/ids for driver registration
- `partner_pwa_context()`
  - preserves existing role detection and adds preferred-language lookup
- `partner_pwa_partner_drivers()`
  - authenticated partner-scoped linked-driver list
- `partner_pwa_request_driver(payload jsonb)`
  - authenticated partner-only driver request creation
- `partner_pwa_submit_account_request(payload jsonb)`
  - public registration wrapper that preserves partner-linking metadata
- `partner_pwa_update_driver(uuid, jsonb)`
  - authenticated partner-only update of linked driver profile fields
- `partner_pwa_archive_driver(uuid)`
  - authenticated partner-only driver deactivation, blocked when active rides exist

## Security Result

- No service-role key was added client-side.
- Driver ride actions remain server-side scoped to the assigned driver.
- Partner driver list and driver mutation RPCs require authenticated partner context.
- Partner users only receive drivers linked to their own `partner_id`.
- Driver users do not receive partner management UI.
- Pending applicants still receive no ride access before approval/linking.
- Existing RLS posture is preserved; no broad table policy or anonymous private-data access was added.

## Validation

Static validation completed:

- Partner PWA inline module script parses with Node.
- `partner-app/manifest.webmanifest` parses as JSON.
- `vercel.json` parses as JSON.
- Touched files scanned clean for service-role/secret exposure.

Live validation required after deployment:

1. Partner login shows partner profile, linked drivers, partner ride summary, and partner-scoped rides.
2. Partner can submit a driver request.
3. Partner can edit/archive only its own linked drivers.
4. Driver login shows only assigned driver rides and no partner management panel.
5. Driver can accept/decline/progress only assigned rides.
6. Driver registration preserves selected or manually entered partner/company information.
7. Pending driver/partner applicants cannot access ride data.
8. EN/FR/NL/ES/AR language selection persists across login, registration, and PWA views.

## Known Limitations

- Partner-side driver edit uses browser prompts to keep the change minimal and avoid a dashboard redesign.
- Live Supabase migration application and live browser validation must be performed in the deployment environment.

## Final Status

PARTNER / DRIVER PWA ROLE SEPARATION COMPLETE
