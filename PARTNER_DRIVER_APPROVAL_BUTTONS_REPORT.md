# Partner/Driver Request Approval Buttons Report

Date: 2026-06-19
Branch: `phase-partner-pwa-registration-install`

## Summary

Added the missing operator dashboard approval layer for Partner PWA partner/driver account requests.

The existing backend approval model is reused:

- `approve_account_request_with_invite(p_request_id, p_redirect_to)`
- `reject_account_request(p_request_id, p_reason)`
- `account_requests`
- existing partner/driver profile creation/linking behavior

No new authentication model was introduced.
No customer approval behavior was changed.
No RLS weakening was added.

## Dashboard Changes

Updated:

- `Paneel/onderaannemerA.html`

Changes:

- Account Requests now clearly describes partner/driver access approval.
- Pending Partner PWA and Driver PWA requests show:
  - approve action
  - reject action
  - account type
  - vehicle type
  - operating area / region
  - preferred language
  - auth/profile linkage state
- Request detail modal now shows Partner PWA metadata.
- Approved partner/driver notification CTA now points to:
  `https://partner.fleetconnect.be/`
- Customer approval routing remains on the customer portal path.

## Backend / RPC Changes

No new RPC was required.

The existing RPCs are intentionally reused:

- Partner/driver approve:
  `approve_account_request_with_invite`
- Reject:
  `reject_account_request`

Important prerequisite:

- The migration from the Partner PWA registration pass must be applied so partner/driver metadata is stored:
  `supabase/migrations/20260619020000_partner_pwa_registration_requests.sql`

## Dashboard Route To Test

- `https://rpk-mu.vercel.app/Paneel/admin-index.html`
- Login as an operator.
- Open the operator dashboard.
- Go to `Accountaanvragen` / `Account Requests`.

## Exact Approval Test Steps

1. Open `https://partner.fleetconnect.be/`.
2. Submit a Partner company registration request.
3. Confirm the applicant cannot see private ride data before approval.
4. Login to the operator dashboard.
5. Open `Account Requests`.
6. Confirm the pending request appears as `Partner PWA`.
7. Click `Approve`.
8. Confirm request status changes to approved.
9. Verify a `partners` row is created or linked.
10. Verify `account_requests.user_id` is linked where an auth user exists.
11. Confirm the approved applicant can login at `https://partner.fleetconnect.be/`.
12. Submit a second test request.
13. Click `Reject`.
14. Confirm request status changes to rejected.
15. Confirm no partner/driver access is created for the rejected request.
16. Confirm existing customer approval behavior still works.

## Validation Performed

- `Paneel/onderaannemerA.html` inline script parse: PASS
- `partner-app/index.html` module script parse: PASS
- `vercel.json` parse: PASS
- `git diff --check`: PASS

## Current Status

READY FOR LIVE RETEST after deploying this branch and ensuring the existing Supabase approval migrations are applied.

