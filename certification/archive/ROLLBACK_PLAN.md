# FleetConnect Rollback Plan

## Executive Summary

This rollback plan supports the certified FleetConnect production baseline. It is intended for controlled operational rollback if a future deployment introduces a regression.

**Current certified state:** FLEETCONNECT PRODUCTION CERTIFIED

## Repositories

| Purpose | Repository |
| --- | --- |
| Primary repository | `Javalin13/FleetConnect` |
| Deployment repository | `iliasselkrichi-source/RPK` |

## Rollback Principles

- Roll back only the smallest affected surface.
- Preserve production data unless a specific data correction is approved.
- Do not disable RLS as a rollback shortcut.
- Do not expose service-role keys or weaken authentication.
- Keep customer, driver, partner, and booking data intact.
- Document every rollback action, operator, timestamp, and verification result.

## Application Rollback

1. Identify the last certified deployment commit.
2. Revert or redeploy to that commit in the deployment repository.
3. Confirm Vercel deployment completion.
4. Smoke test:
   - Public booking route.
   - Customer login route.
   - Operator dashboard route.
   - Partner PWA route.
   - Driver accept/decline route.
5. Confirm no unintended environment variable changes occurred.

## Supabase Rollback

1. Prefer forward-fix migrations over destructive rollback.
2. If a migration must be reverted, prepare an explicit SQL rollback script and review data impact first.
3. Never drop production tables or policies without a verified backup and approval.
4. Validate RPC availability and RLS behavior after any database change.
5. Confirm dashboard, customer portal, partner PWA, and driver workflows after rollback.

## Email Rollback

1. Confirm FleetConnect sender configuration remains active.
2. Verify `send-email` Edge Function deployment and origin policy.
3. Run a controlled test email to an internal FleetConnect mailbox.
4. Confirm customer-facing templates do not point to obsolete domains.

## Stripe Rollback

1. Disable new checkout entry points only if payment regression affects customers.
2. Keep webhook endpoint logs for audit.
3. Do not delete Stripe records.
4. Validate booking workflow remains operational for non-payment paths if payments are temporarily disabled.

## Data Protection

- Preserve bookings, customers, partners, drivers, reviews, invoices, payments, and email logs.
- Archive records rather than hard-delete where ride history exists.
- Use targeted corrections for data inconsistencies.
- Keep an audit note for every manual production data correction.

## Post-Rollback Verification

- Public booking completes.
- Customer can register, verify, sign in, and view portal data.
- Operator can view and manage bookings, customers, partners, drivers, and account requests.
- Partner PWA login and ride display work.
- Driver accept/decline actions work.
- Email lifecycle sends expected messages.
- Review flow remains available.
- Stripe sandbox webhook remains valid for test mode.

## Final Note

Rollback is a controlled operational safety measure. The certified production baseline remains the preferred production state.
