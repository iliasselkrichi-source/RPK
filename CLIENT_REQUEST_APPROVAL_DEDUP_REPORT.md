# Client Request Approval + Account Dedup Report

Date: 2026-06-19
Branch: `phase-partner-pwa-registration-install`

## Summary

Added the same approval/rejection visibility for client/customer account requests that partner/driver requests already have.

Also added a unified duplicate detection path so registration flows can detect existing accounts or open requests before creating new auth/account-request entries.

## Dashboard Changes

Updated `Paneel/onderaannemerA.html`.

Changes:

- Customers tab now shows `Client account requests` above the customer list.
- Pending client requests have:
  - `Goedkeuren`
  - `Afwijzen`
  - details button
- Client request cards show:
  - status
  - email
  - phone
  - default pickup address
  - created date and timestamp
  - auth linkage state
- Existing customer cards now show formatted date and timestamp.
- Existing customer archive behavior is preserved.
- Partner/driver request cards still show date and timestamp.

## Duplicate Protection

Updated `partner-app/index.html`.

Before partner/driver signup, the PWA now calls:

`check_duplicate_registration(p_email)`

If an existing customer, partner, driver, verified auth user, unverified auth user, or pending/approved account request exists, the user gets a clean message instead of creating another request.

## Database Migration

Added:

`supabase/migrations/20260619040000_unified_account_duplicate_check.sql`

This replaces `check_duplicate_registration(p_email)` with a unified check across:

- `auth.users`
- `customers`
- `partners`
- `drivers`
- `account_requests`

It does not weaken RLS and does not auto-approve anyone.

## Manual Supabase Step

Apply this migration to live Supabase:

`supabase/migrations/20260619040000_unified_account_duplicate_check.sql`

## Routes To Test

- Dashboard: `/Paneel/admin-index.html`
- Customers tab: `Klanten`
- Partner PWA: `https://partner.fleetconnect.be/`
- Customer registration: `/PV/register.html`

## Test Checklist

1. Submit a new client registration.
2. Open dashboard `Klanten`.
3. Confirm client request appears with date and timestamp.
4. Approve the client request.
5. Confirm customer/profile linkage remains intact.
6. Submit another client request with the same email.
7. Confirm duplicate message appears.
8. Submit a partner/driver request with an existing email.
9. Confirm duplicate message appears.
10. Submit a fresh partner/driver request.
11. Confirm partner/driver request still appears under Account Requests with date and timestamp.

