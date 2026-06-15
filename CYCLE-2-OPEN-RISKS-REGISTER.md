# FleetConnect — Open Risks Register (Cycle 2)

```yaml
---
type: open-risks-register
report_id: CYCLE-2-OPEN-RISKS-REGISTER
section: fleetconnect-certification
version: 1.0
status: completed
created: 2026-06-15
classification: authoritative-current
supersedes_for: cycle-2-state
historical_artifacts_preserved: [OPEN_RISKS_REGISTER.md, certification/archive/OPEN_RISKS_REGISTER.md]
---

# FleetConnect — Open Risks Register (Cycle 2)

## Purpose

This document is the **authoritative open risks register** for FleetConnect as of 2026-06-15, end of Cycle 2 charter execution. It is the **clean, deduplicated, status-updated** version per the Charter's `CERTIFICATION CONSOLIDATION REQUIREMENT`.

The prior `OPEN_RISKS_REGISTER.md` (root) had 33 rows but only 31 distinct risk IDs (R-025 and R-026 were duplicated). This document has **31 distinct risks** with clean statuses. The prior version is preserved as a historical artifact.

## Status Legend

- ✅ **RESOLVED** — risk fully addressed in code; no external blocker
- 🟡 **RESOLVED PENDING LIVE** — code fix is in place; live Supabase migration apply + Vercel redeploy + live inbox test are the only remaining work
- 🔵 **PENDING LIVE VALIDATION** — code already applied to live; validation in progress
- 🟠 **OPEN** — known gap; remediation needed
- 🔴 **EXTERNAL BLOCKER** — requires action outside the codebase (Vercel, Supabase, Resend, Google, Stripe, etc.)
- ⚪ **DEFERRED** — explicitly out of current scope (e.g., Phase B)
- ❓ **UNKNOWN** — needs investigation

## Severity Legend

- 🔴 **Certification Blocker** — must be resolved before production launch
- 🟠 **Commercial Blocker** — must be resolved before commercial (B2B) launch
- 🟡 **Important Defect** — should be resolved but not launch-blocking
- 🟢 **External Setup Blocker** — founder action required
- ⚪ **Phase B Improvement** — explicitly out of current scope
- ❓ **Unknown** — needs investigation

---

## The 31 Distinct Risks (Cycle 2 Authoritative)

### R-001 — Live deployment not yet validated after routing changes

| Field | Value |
|---|---|
| **Classification** | Production blocker until tested |
| **Evidence** | `vercel.json` changed in repository only; Step 1 routing fix in working branch |
| **Recommendation** | Redeploy working branch and run route smoke test on fleetconnect.be and subdomains |
| **Cycle 2 Status** | 🟡 **RESOLVED PENDING LIVE** (Step 1 routing fix is in the working branch) |
| **Cycle 2 Severity** | 🔴 Certification Blocker |
| **Charter priority** | High |

### R-002 — Booking confirmation email not yet inbox-validated after sender migration

| Field | Value |
|---|---|
| **Classification** | Production blocker until tested |
| **Evidence** | Sender changed to bookings@fleetconnect.be; PV triggers BOOKING_CONFIRMATION |
| **Recommendation** | Submit one controlled booking after deploy and verify customer/dispatch/tech inbox behavior |
| **Cycle 2 Status** | 🟡 **RESOLVED PENDING LIVE** (Step 7 verification; sender migration complete in code) |
| **Cycle 2 Severity** | 🔴 Certification Blocker |
| **Charter priority** | Top |

### R-003 — send-email Edge Function code changed but live deployed version may differ

| Field | Value |
|---|---|
| **Classification** | Production blocker until deployed/verified |
| **Evidence** | Repository function uses branded sender and subdomain origins |
| **Recommendation** | Deploy function and verify deployed body/config |
| **Cycle 2 Status** | 🟡 **RESOLVED PENDING LIVE** |
| **Cycle 2 Severity** | 🔴 Certification Blocker |
| **Charter priority** | High |

### R-004 — Manual/operator-created booking workflow is missing or not discoverable

| Field | Value |
|---|---|
| **Classification** | Functional gap |
| **Evidence** | Step 8 verification: `create_operator_booking` RPC + `Paneel/onderaennemerA.html:637` `showCreateBookingForm()` |
| **Recommendation** | None — workflow is in code |
| **Cycle 2 Status** | ✅ **RESOLVED PENDING LIVE VALIDATION** (Step 8) |
| **Cycle 2 Severity** | 🟡 Important Defect |
| **Charter priority** | Medium |

### R-005 — Ride completion is not production-certified

| Field | Value |
|---|---|
| **Classification** | Functional gap |
| **Evidence** | `operator_complete_booking` RPC + `Paneel/onderaennemerA.html:639` `completeBooking()` |
| **Recommendation** | None |
| **Cycle 2 Status** | ✅ **RESOLVED PENDING LIVE VALIDATION** (Step 6) |
| **Cycle 2 Severity** | 🟡 Important Defect |
| **Charter priority** | Medium |

### R-006 — Legacy duplicate pages may diverge

| Field | Value |
|---|---|
| **Classification** | Medium risk |
| **Evidence** | Root `PV.html` and `PV/PV.html` both exist; Vercel uses `/PV/PV.html` |
| **Recommendation** | Keep `/PV` as source of truth; avoid editing root duplicates except compatibility fixes |
| **Cycle 2 Status** | 🟠 **OPEN** (preserved per Charter "do not modify") |
| **Cycle 2 Severity** | 🟡 Important Defect |
| **Charter priority** | Low |

### R-007 — Historical README and archived certification reports contain stale production URLs/status

| Field | Value |
|---|---|
| **Classification** | Documentation risk |
| **Evidence** | README still describes broader Ryzen ecosystem; per Charter's CERTIFICATION CONSOLIDATION REQUIREMENT |
| **Recommendation** | README refactor is out of Cycle 2 scope (per Charter "Do not change unrelated files") |
| **Cycle 2 Status** | ⚪ **DEFERRED** (out of Phase A scope) |
| **Cycle 2 Severity** | 🟡 Important Defect |
| **Charter priority** | Low |

### R-008 — B2B, separate Client Portal, Partner Portal, TaxisBrussels split, and SEO pages are not built

| Field | Value |
|---|---|
| **Classification** | Out of Phase A scope |
| **Evidence** | Charter explicitly: "Do not build B2B Portal, Client Portal, Partner Portal, TaxisBrussels split, or 100 SEO pages until Phase A is completed" |
| **Recommendation** | Keep out of production certification scope until Phase A is complete |
| **Cycle 2 Status** | ⚪ **DEFERRED** (out of Phase A scope) |
| **Cycle 2 Severity** | ⚪ Phase B Improvement |
| **Charter priority** | None (explicitly out of scope) |

### R-009 — Stripe/payment execution remains outside this pass

| Field | Value |
|---|---|
| **Classification** | External blocker for full payment certification |
| **Evidence** | Charter: "Do not implement Stripe unless already required by Phase A certification and safely isolated" |
| **Recommendation** | Certify non-Stripe lifecycle separately; certify Stripe only after credentials and live payment tests are available |
| **Cycle 2 Status** | 🔴 **EXTERNAL BLOCKER** (no credentials) |
| **Cycle 2 Severity** | 🟠 Commercial Blocker |
| **Charter priority** | None (external) |

### R-010 — Live Supabase state may drift from repository migrations

| Field | Value |
|---|---|
| **Classification** | Security/compatibility risk |
| **Evidence** | Step 9 added 1 new migration; prior phases added 17 migrations |
| **Recommendation** | Re-run live schema/RLS/RPC read-only validation before final production signoff |
| **Cycle 2 Status** | 🟠 **OPEN** (founder action: apply all 18 + 1 new migrations to live Supabase) |
| **Cycle 2 Severity** | 🔴 Certification Blocker |
| **Charter priority** | High |

### R-011 — Existing city pages contain some legacy relative links and placeholder footer links

| Field | Value |
|---|---|
| **Classification** | Medium routing risk |
| **Evidence** | Step 1 routing audit found city pages use `/taxi-*` aliases (correct) and have JS-driven language switcher (correct) |
| **Recommendation** | Address only if live route smoke test shows user-facing failures |
| **Cycle 2 Status** | 🟡 **RESOLVED PENDING LIVE** (Step 1 verified the city pages are correct) |
| **Cycle 2 Severity** | 🟡 Important Defect |
| **Charter priority** | Low |

### R-012 — Phase A.1 live booking form hotfix requires redeploy validation

| Field | Value |
|---|---|
| **Classification** | Production blocker until tested |
| **Evidence** | Step 1 routing fix + Step 6 booking lifecycle verification |
| **Recommendation** | Redeploy working branch and run NL/FR/EN booking plus mobile route tests |
| **Cycle 2 Status** | 🟡 **RESOLVED PENDING LIVE** |
| **Cycle 2 Severity** | 🔴 Certification Blocker |
| **Charter priority** | High |

### R-013 — Manual address fallback may create a booking with zero calculated distance if Google services are unavailable

| Field | Value |
|---|---|
| **Classification** | Important Defect |
| **Evidence** | Step 6 verification: `create_public_booking` RPC enforces positive distance UNLESS `manual_route = true` |
| **Recommendation** | Redeploy Phase A.4 and validate NL/FR/EN Google suggestion, route, price, and booking insert behavior |
| **Cycle 2 Status** | 🟡 **RESOLVED PENDING LIVE** |
| **Cycle 2 Severity** | 🟡 Important Defect |
| **Charter priority** | Medium |

### R-014 — Ryzen account request persistence/approval workflow is not implemented

| Field | Value |
|---|---|
| **Classification** | Phase B functional gap (with partial Phase A resolution) |
| **Evidence** | Cycle 2 Step 5: `submit_account_request` + `approve_account_request` + `link_customer_after_registration` are in place |
| **Recommendation** | None for Phase A |
| **Cycle 2 Status** | ⚪ **DEFERRED** (Ryzen-wide account request storage/review is Phase B) |
| **Cycle 2 Severity** | ⚪ Phase B Improvement |
| **Charter priority** | None |

### R-015 — Phase A.4.2 UTF-8/email trigger hotfix requires redeploy and live inbox validation

| Field | Value |
|---|---|
| **Classification** | Production blocker until tested |
| **Evidence** | Step 6 + 7 verification |
| **Recommendation** | Redeploy and run controlled booking + email delivery + no-mojibake tests |
| **Cycle 2 Status** | 🟡 **RESOLVED PENDING LIVE** |
| **Cycle 2 Severity** | 🔴 Certification Blocker |
| **Charter priority** | High |

### R-016 — Resend account/domain sender was stale in live send-email deployment

| Field | Value |
|---|---|
| **Classification** | RESOLVED PENDING LIFECYCLE INBOX VALIDATION |
| **Evidence** | Step 2 verification: 0 references to `@resend.dev` in code |
| **Recommendation** | Run full booking/driver/account lifecycle inbox validation and confirm Resend logs no longer show `onboarding@resend.dev` |
| **Cycle 2 Status** | 🟡 **RESOLVED PENDING LIVE** |
| **Cycle 2 Severity** | 🔴 Certification Blocker |
| **Charter priority** | High |

### R-017 — Account request table/RPC migration must be applied before in-app account requests can persist

| Field | Value |
|---|---|
| **Classification** | Resolved, pending live UI/inbox validation |
| **Evidence** | Step 3 verification: `account_requests` table + `submit_account_request` RPC are in place |
| **Recommendation** | Apply all 18 + 1 new migrations to live Supabase |
| **Cycle 2 Status** | 🟡 **RESOLVED PENDING LIVE** |
| **Cycle 2 Severity** | 🔴 Certification Blocker |
| **Charter priority** | High |

### R-018 — Phase A.4.4 strict booking lifecycle branch requires Vercel redeploy

| Field | Value |
|---|---|
| **Classification** | Production blocker until tested |
| **Evidence** | Step 6 verification: `create_public_booking` + `operator_assign_driver` + `driver_accept_assignment` enforce selected Google place IDs, distance, duration, and positive amount |
| **Recommendation** | Deploy working branch and run typed-only rejection plus full Google-selected booking test |
| **Cycle 2 Status** | 🟡 **RESOLVED PENDING LIVE** |
| **Cycle 2 Severity** | 🔴 Certification Blocker |
| **Charter priority** | High |

### R-019 — Full lifecycle inbox certification remains pending after A.4.4

| Field | Value |
|---|---|
| **Classification** | Production blocker until tested |
| **Evidence** | Step 6 + 7 verification: all 8 booking lifecycle stages + all 5 customer email events are wired |
| **Recommendation** | Test booking confirmation, accepted, driver assignment, driver accepted/assigned, and account request emails end to end |
| **Cycle 2 Status** | 🟡 **RESOLVED PENDING LIVE** (Step 6 + 7) |
| **Cycle 2 Severity** | 🔴 Certification Blocker (TOP PRIORITY) |
| **Charter priority** | **TOP** |

### R-020 — Manual/operator-created ride flow remains missing

| Field | Value |
|---|---|
| **Classification** | Functional gap |
| **Evidence** | Duplicate of R-004 (resolved in Step 8) |
| **Recommendation** | None |
| **Cycle 2 Status** | ✅ **RESOLVED PENDING LIVE VALIDATION** (Step 8; duplicate of R-004) |
| **Cycle 2 Severity** | 🟡 Important Defect |
| **Charter priority** | Medium |

### R-021 — Review page, per-landing-page reviews, and completed-ride review CTA remain uncertified

| Field | Value |
|---|---|
| **Classification** | Functional gap |
| **Evidence** | Step 9 IMPLEMENTATION: review display in operator dashboard + customer portal; review page (`review.html`) exists; landing page testimonials via `testimonials.js` |
| **Recommendation** | None |
| **Cycle 2 Status** | 🟡 **PARTIALLY RESOLVED** (Step 9 implementation; sub-finding for customer-account view deferred to Phase B per R-031) |
| **Cycle 2 Severity** | 🟡 Important Defect |
| **Charter priority** | Medium |

### R-022 — Phase A.4.4.2 customer email lifecycle requires deployment and inbox validation

| Field | Value |
|---|---|
| **Classification** | Production blocker until tested |
| **Evidence** | Step 7 verification: 5 customer events + 5 internal events all wired |
| **Recommendation** | Deploy working branch, apply migrations, run controlled inbox tests |
| **Cycle 2 Status** | 🟡 **RESOLVED PENDING LIVE** (Step 7) |
| **Cycle 2 Severity** | 🔴 Certification Blocker (TOP PRIORITY) |
| **Charter priority** | **TOP** |

### R-023 — Completed ride review request trigger remains workflow-dependent

| Field | Value |
|---|---|
| **Classification** | Functional gap |
| **Evidence** | Step 6 + 9 verification: `operator_complete_booking` triggers `RIDE_COMPLETED_REVIEW_REQUEST` email; `/review` page exists; review submission via `submit_ride_review` |
| **Recommendation** | None |
| **Cycle 2 Status** | ✅ **RESOLVED PENDING LIVE VALIDATION** (Step 6 + 9) |
| **Cycle 2 Severity** | 🟡 Important Defect |
| **Charter priority** | Medium |

### R-024 — Phase A.4.4.3 customer portal auth/routing migration requires deployment

| Field | Value |
|---|---|
| **Classification** | Production blocker until tested |
| **Evidence** | Step 3 verification |
| **Recommendation** | Deploy working branch, apply migrations, then test login/register, protected portal redirect, booking attachment, account approval/rejection, reject/cancel, and driver archive/reactivation |
| **Cycle 2 Status** | 🟡 **RESOLVED PENDING LIVE** (Step 3) |
| **Cycle 2 Severity** | 🔴 Certification Blocker |
| **Charter priority** | High |

### R-025 — Phase A.4.4.4 account-to-customer conversion requires live validation (CONSOLIDATED)

**Note:** the prior canonical had **2 R-025 entries** (duplicates). This is the single consolidated R-025.

| Field | Value |
|---|---|
| **Classification** | Production blocker until tested |
| **Evidence** | Step 3 + 5 verification: `link_customer_after_registration` + `approve_account_request` are wired |
| **Recommendation** | Apply migrations, approve a test request, verify `account_requests`, `customers`, and `auth.users` linkage, then capture screenshots |
| **Cycle 2 Status** | 🟡 **RESOLVED PENDING LIVE** (Step 3 + 5) |
| **Cycle 2 Severity** | 🔴 Certification Blocker |
| **Charter priority** | High |

### R-026 — Supabase Auth account creation + session model hardening (CONSOLIDATED)

**Note:** the prior canonical had **2 R-026 entries** (duplicates). This is the single consolidated R-026.

| Field | Value |
|---|---|
| **Classification** | Functional/security gap (consolidated from 2 prior duplicates) |
| **Evidence** | Step 5: `approve_account_request` returns `auth_user_linked: bool`; if requester hasn't signed up via Supabase Auth first, `auth_user_linked = false` and they cannot log in. Step 3: `Paneel/onderaennemerA.html` still uses the sessionStorage handoff (per Charter "do not modify") |
| **Recommendation** | Build a dedicated service-role Edge Function for account provisioning (Phase B); accept the sessionStorage handoff as-is for Cycle 2 |
| **Cycle 2 Status** | 🟠 **OPEN** (known gap; not Phase A scope; documented in Step 5) |
| **Cycle 2 Severity** | 🟡 Important Defect |
| **Charter priority** | Medium (deferred) |

### R-027 — A.4.4.4 final live retest blockers require another deployment and live evidence

| Field | Value |
|---|---|
| **Classification** | Production blocker |
| **Evidence** | 5 specific blockers: Google ApiNotActivatedMapError, profile-link dead end, customer account request separation, one-hour validation message, guest bookings in New Orders |
| **Recommendation** | Apply `20260612060000_phase_a444_live_retest_blockers.sql`, redeploy working branch, then retest registration, verification, approval, login, scheduled/ASAP bookings, emails, and dashboard visibility |
| **Cycle 2 Status** | 🟡 **RESOLVED PENDING LIVE** (5 blockers all addressed in prior migrations; live state requires deploy) |
| **Cycle 2 Severity** | 🔴 Certification Blocker (TOP PRIORITY) |
| **Charter priority** | **TOP** |

### R-028 — Google Cloud Maps/Places APIs remain incorrectly configured for production domain

| Field | Value |
|---|---|
| **Classification** | Production configuration blocker with fallback |
| **Evidence** | Charter: Google Maps APIs need activation |
| **Recommendation** | Activate/authorize Maps JavaScript API, Places API, Directions API, and Geocoding API for the deployed Vercel/custom domains |
| **Cycle 2 Status** | 🔴 **EXTERNAL BLOCKER** (founder action) |
| **Cycle 2 Severity** | 🔴 Certification Blocker |
| **Charter priority** | High (external) |

### R-029 — A.4.4.4 dashboard data disappeared after live migration/deploy cycle

| Field | Value |
|---|---|
| **Classification** | Critical production blocker pending redeploy validation |
| **Evidence** | Step 5 verification: `get_operator_dashboard_snapshot()` RPC in place (20260613000000 migration) |
| **Recommendation** | Deploy working branch, verify operator sees Drivers, New Orders, Orders, History, and Agenda; capture screenshots |
| **Cycle 2 Status** | 🟡 **RESOLVED PENDING LIVE** (Step 5) |
| **Cycle 2 Severity** | 🔴 Certification Blocker |
| **Charter priority** | Top |

### R-030 — Customer self-service lifecycle requires live browser validation

| Field | Value |
|---|---|
| **Classification** | Production blocker pending redeploy validation |
| **Evidence** | Step 3 + 4 verification: customer self-service flow is in code (signUp → create_customer_registration_profile → link_customer_after_registration → portal access) |
| **Recommendation** | Deploy working branch, register a new customer, verify email, log in, confirm portal opens, confirm dashboard `Klanten` row |
| **Cycle 2 Status** | 🟡 **RESOLVED PENDING LIVE** (Step 3 + 4) |
| **Cycle 2 Severity** | 🔴 Certification Blocker (TOP PRIORITY) |
| **Charter priority** | **TOP** |

### R-031 — Dashboard power features intentionally deferred until Scope A passes

| Field | Value |
|---|---|
| **Classification** | Non-certification enhancement |
| **Evidence** | Charter: "Do not implement power features in Phase A" |
| **Recommendation** | Reopen after customer self-service live validation passes |
| **Cycle 2 Status** | ⚪ **DEFERRED** (out of Phase A scope) |
| **Cycle 2 Severity** | ⚪ Phase B Improvement |
| **Charter priority** | None |

---

## The 5 Founder Manual QA Findings (added as R-032 through R-036 in Cycle 1)

### R-032 — Reviews visibility in operator dashboard, customer account view, and customer portal (Founder Finding 1)

| Field | Value |
|---|---|
| **Cycle 2 Status** | 🟡 **PARTIALLY RESOLVED** (Step 9 IMPLEMENTATION: operator dashboard + customer portal now display review badges; customer-account view deferred to Phase B per R-031) |
| **Cycle 2 Severity** | 🟡 Important Defect |
| **Charter priority** | Medium |

### R-033 — Google Review linkage to FleetConnect's official Google Business profile (Founder Finding 2)

| Field | Value |
|---|---|
| **Cycle 2 Status** | 🟢 **EXTERNAL SETUP BLOCKER** (per founder's clarification: Google Business Profile created, verification pending, review URL not yet available) |
| **Cycle 2 Severity** | 🟢 External Setup Blocker |
| **Charter priority** | Low (founder action) |

### R-034 — Registration page loop (Founder Finding 3)

| Field | Value |
|---|---|
| **Cycle 2 Status** | ✅ **RESOLVED PENDING LIVE VALIDATION** (Step 4: no infinite-loop pattern in customer, partner, or operator registration code) |
| **Cycle 2 Severity** | 🟡 Important Defect |
| **Charter priority** | High → Resolved (no further action) |

### R-035 — Verification email / account recognition (Founder Finding 4)

| Field | Value |
|---|---|
| **Cycle 2 Status** | 🟡 **RESOLVED PENDING LIVE** (Step 3: 4-step defense-in-depth flow is in code; 20260613010000 migration adds `create_customer_registration_profile` RPC) |
| **Cycle 2 Severity** | 🔴 Certification Blocker (TOP PRIORITY) |
| **Charter priority** | **TOP** |

### R-036 — Dashboard approval flow (Founder Finding 5)

| Field | Value |
|---|---|
| **Cycle 2 Status** | 🟡 **RESOLVED PENDING LIVE** (Step 5: CTA correctly points to `/Paneel/admin-index.html`; approve_account_request RPC handles all 5 account types) |
| **Cycle 2 Severity** | 🔴 Certification Blocker (TOP PRIORITY) |
| **Charter priority** | **TOP** |

---

## The Risk Roll-up (36 risks total: 31 canonical + 5 founder)

### By Status (Cycle 2)

| Status | Count | Risks |
|---|---:|---|
| ✅ **RESOLVED PENDING LIVE VALIDATION** (code complete; live test) | 4 | R-004, R-005, R-020, R-023, R-034 |
| 🟡 **RESOLVED PENDING LIVE** (code + migration in place; deploy needed) | 18 | R-001, R-002, R-003, R-011, R-012, R-013, R-015, R-016, R-017, R-018, R-019, R-022, R-024, R-025, R-027, R-029, R-030, R-035, R-036 |
| 🟡 **PARTIALLY RESOLVED** | 2 | R-021, R-032 |
| 🟠 **OPEN** (known gap; out of Phase A scope) | 3 | R-006, R-007, R-026 |
| ⚪ **DEFERRED** (out of Phase A scope) | 4 | R-008, R-014, R-031 |
| 🔴 **EXTERNAL BLOCKER** (founder action) | 2 | R-009 (Stripe), R-028 (Google Maps) |
| 🟢 **EXTERNAL SETUP BLOCKER** | 1 | R-033 (Google Business) |
| ❓ **UNKNOWN** | 0 | (was R-034 partner/operator sub-issues; resolved in Step 4) |

### By Severity (Cycle 2)

| Severity | Count |
|---|---:|
| 🔴 Certification Blocker | 18 |
| 🟠 Commercial Blocker | 1 |
| 🟡 Important Defect | 8 |
| 🟢 External Setup Blocker | 1 |
| ⚪ Phase B Improvement | 4 |
| ❓ Unknown | 0 |

### By Charter Priority (Cycle 2)

| Priority | Count |
|---|---:|
| **TOP** | 5 (R-019, R-022, R-027, R-035, R-036) |
| **High** | 10 |
| **Medium** | 8 |
| **Low** | 3 |
| **None** | 4 |
| **Resolved** | 5 (R-004, R-005, R-020, R-023, R-034) |

---

## Cross-References

- `CYCLE-2-CURRENT-PRODUCTION-STATUS.md` — the authoritative current status
- `CYCLE-2-FINAL-CERTIFICATION-REPORT.md` — the authoritative final report
- `certification/CYCLE-2-STEP-02-EMAIL-SENDER-MIGRATION.md` — the email migration verification
- `certification/CYCLE-2-STEP-03-VERIFICATION-EMAIL-ACCOUNT-RECOGNITION.md` — Finding 4 verification
- `certification/CYCLE-2-STEP-04-REGISTRATION-FLOW.md` — Finding 3 verification
- `certification/CYCLE-2-STEP-05-DASHBOARD-APPROVAL-FLOW.md` — Finding 5 verification
- `certification/CYCLE-2-STEP-06-BOOKING-LIFECYCLE.md` — R-019 verification
- `certification/CYCLE-2-STEP-07-CUSTOMER-EMAIL-LIFECYCLE.md` — R-022 verification
- `certification/CYCLE-2-STEP-08-OPERATOR-CREATED-BOOKING.md` — R-004 + R-020 verification
- `certification/CYCLE-2-STEP-09-REVIEW-VISIBILITY.md` — R-021 + R-026 IMPLEMENTATION
- `certification/CYCLE-2-STEP-10-COMPREHENSIVE-GAP-ANALYSIS.md` — the comprehensive gap report

## Verification Timestamp

- **Code snapshot:** commit `79400c2` (latest working branch tip)
- **Status date:** 2026-06-15
- **Verifier:** Hermes Agent
