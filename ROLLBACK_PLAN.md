# Rollback Plan

Date: 2026-06-19

## Scope

Rollback applies to the final certification sprint fixes:

- `PV/register.html`
- `Paneel/onderaannemerA.html`
- `supabase/migrations/20260619190000_fix_dashboard_update_rpc_returns.sql`
- Live Supabase RPC replacements applied during this sprint.

## Git Rollback

If the sprint commit causes a frontend regression:

```bash
git revert <sprint_commit_hash>
git push origin final-certification-sprint-2026-06-19
```

If merged to main:

```bash
git checkout main
git pull origin main
git revert <merge_commit_or_sprint_commit>
git push origin main
```

## Supabase Rollback

The live migrations are mostly `create or replace function` and additive `add column if not exists`. A destructive rollback is not recommended.

If a new RPC version causes regression, restore the previous function body from the prior migration file and run it through Supabase SQL Editor or the approved database connection.

Affected live RPCs:

- `create_operator_partner(jsonb)`
- `delete_operator_partner(integer)`
- `operator_bulk_assign_bookings(text[], integer, uuid)`
- `update_account_request(uuid, text, text, text, text, text, text, jsonb)`
- `update_customer(text, text, text, text, boolean, boolean)`
- `update_driver(uuid, text, text, text, text, text, text, boolean, boolean)`
- `update_booking(text, text, text, numeric, text, uuid, integer)`

## Operational Rollback

- Route partner users through canonical `https://partners.fleetconnect.be/` or fallback `https://www.fleetconnect.be/partner-app`. Do not publish deprecated `https://partner.fleetconnect.be/`.
- Keep Stripe in sandbox/test mode until the final deployed browser pass is complete. Before real payments, replace sandbox Stripe keys with live keys and repeat checkout/webhook validation.
- Keep cash/manual booking flow available only if operations accepts manual confirmation.

## Data Cleanup

Test rows created during certification were deleted:

- `cert-rest-test@example.com` booking
- `CUST-cert-profile-test` customer

## Rollback Verdict

Rollback is straightforward for frontend code. Supabase rollback should be function-body restoration only; do not drop columns or tables.
