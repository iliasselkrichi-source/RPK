# Phase 2 — Pre-Implementation Inspection Report (Cycle 2)

```yaml
---
type: pre-implementation-inspection
section: cycle-2-fleetconnect-charter-execution
version: 1.0
status: completed-awaiting-founder-approval
created: 2026-06-15
classification: approved-architecture
authoritative_for: cycle-2-certification-execution-cycle
---

# Phase 2 — Pre-Implementation Inspection Report

## Purpose

Per the Charter's `IMPORTANT EXECUTION INSTRUCTION`:
> "Do not start coding immediately. First inspect the repository and provide:
> 1. Repository impact analysis
> 2. Existing reusable components
> 3. Existing authentication flow summary
> 4. Existing booking lifecycle summary
> 5. Existing email flow summary
> 6. Existing multilingual structure summary
> 7. Proposed folder/file structure
> 8. Proposed Supabase changes
> 9. Risk assessment
> 10. Implementation plan
> Only after approval should implementation begin."

This document is the **Inspection Report**. It is committed to the working branch `codex-phase2-end-to-end-certification-2026-06` (NOT to main). The Charter explicitly authorizes the founder to inspect this report and approve before any code changes. **The agent will not begin code modifications until the founder approves the report.**

## Working Branch Created

```bash
git checkout -b codex-phase2-end-to-end-certification-2026-06
```

**Branch state at report creation:** main HEAD (`f87c15b`) + branch pointer; no commits added.

---

## 1. Repository Impact Analysis

### 1.A Repository facts (verified 2026-06-15)

| Property | Value |
|---|---|
| **Remote URL** | `https://github.com/Javalin13/FleetConnectFork` |
| **Local clone path** | `C:\Users\AGS\Documents\ryzen-core\.scratch\FleetConnectFork-canonical` |
| **Latest commit on main** | `f87c15b` ("Merge pull request #23 from iliasselkrichi-source/main", 2026-06-13 07:31 UTC) |
| **Author of last commit** | John Dough (Javalin13) |
| **Total commits in clone (depth 50)** | 148 |
| **Branches on remote** | `main`, `phase-a4.4.4-live-auth-email-dashboard-remediation` |
| **`commercial-relaunch-fleetconnect-be` branch** | **DOES NOT EXIST** on the remote (per the Charter it was a protected branch; it's not physically present) |
| **Open PRs** | 0 |
| **Repository size** | 15.27 MB |

### 1.B File inventory (the impact surface)

| File type | Count |
|---|---:|
| **HTML files** | 76 (the main application surface) |
| **Markdown reports** | 71 (the certification evidence library) |
| **JavaScript files** | 22 (the `src/modules/` + inline JS) |
| **SQL migrations** | 18 (the Supabase schema/RLS/RPC evolution) |
| **TypeScript files** | 9 (the Edge Functions) |
| **All files** | 222 |

### 1.C Top-level directory structure

```
FleetConnectFork/
├── assets/                  (1 file in assets/images/)
├── certification/           (archive dir for historical certs)
├── cities/                  (8 city landing pages: antwerpen, brugge, brussels, gent, leuven, mechelen, waterloo, zaventem)
├── NH/                      (KMS7 white-label — FR/EN/NL variants, 10 files)
├── Paneel/                  (operator/partner/driver panels — 11 files)
├── PV/                      (Premium Vloot — main + 7 service pages + EN/FR/NL variants, 10 files)
├── src/                     (modules + lib)
│   ├── lib/auth/            (customerAuth.ts)
│   └── modules/             (communication, maps, reviews)
├── supabase/
│   ├── functions/           (send-email, create-checkout-session, process-refund, stripe-webhook)
│   └── migrations/          (18 files, dated 2026-05-21 to 2026-06-13)
├── tests/                   (6 test files: 4 vitest .ts, 2 .js; minimal)
├── *.html                   (FleetConnect root: PV.html, klantenportaal.html, bravoklantenportaal.html, bravo.html, etc.)
├── *.md                     (71 reports at the root)
└── vercel.json              (the routing config — 27 rewrites)
```

### 1.D Recent change pattern (the last 5 commits)

```
f87c15b Merge pull request #23 from iliasselkrichi-source/main     (2026-06-13)
4d1b87b Merge pull request #124 from Javalin13/phase-a4.4.4-...     (2026-06-13)
90d6e65 fix: make customer registration self service               (2026-06-13)
1f4335b Merge pull request #123 from Javalin13/main                 (2026-06-13)
8e77681 Merge pull request #22 from iliasselkrichi-source/main     (2026-06-13)
```

**Pattern observation:** there are 2 simultaneous merge sources — `Javalin13/` and `iliasselkrichi-source/`. This is *unusual* for a canonical repo and warrants founder attention. The Charter's REPOSITORY GOVERNANCE UPDATE names `Javalin13/FleetConnectFork` as canonical, but the merges are still being received from the iliasselkrichi-source account (which is the *upstream* the Fork was originally forked from, and which has the now-non-existent 404 repository). **The agent flags this to the founder but does NOT undo the merges (per "Do not force-push main").**

### 1.E The merge that came in with main (commit f87c15b)

**22 files changed (15 report .md files, 7 code files, 1 new migration):**

**Reports updated (mostly additive documentation):** `CURRENT_PRODUCTION_STATUS.md` (+15), `FINAL_CERTIFICATION_GAP_REPORT.md` (+14), `FINAL_CERTIFICATION_REPORT.md` (+25), `FINAL_VALIDATION_CHECKLIST.md` (+15), `OPEN_RISKS_REGISTER.md` (+2), `PHASE_A444_LIVE_BLOCKER_REMEDIATION_REPORT.md` (+60), `PRODUCTION_CERTIFICATION.md` (+38). The same files were also updated in `certification/archive/` (the historical archive).

**Code files changed:** `PV.html` (root duplicate, +1/-1), `PV/PV.html` (+6/-6), `PV/index.html` (+6/-8), `PV/klantenportaalpv.html` (+3/-3), `PV/register.html` (+7/-29 — *significant simplification*), `Paneel/driverpaneel.html` (+34/-35), `Paneel/onderaannemerA.html` (+12/-7).

**New SQL migration added:** `supabase/migrations/20260613010000_phase_a444_customer_self_service.sql` (307 lines, "make customer registration self service" — the Founder Finding 4 + R-035 fix).

### 1.F Impact surface for the Charter's Phase A scope

The Charter's Phase A scope is:
- Routing fixes (PV/, root, /cities/ patterns)
- Email sender migration (already complete; verification is the work)
- End-to-end email validation
- Full booking lifecycle validation
- Certification documentation consolidation

**The impact surface is well-bounded:** the agent's changes will touch 1 file (vercel.json routing), some `vercel.json` rewrites may need additions, the PV/*.html and Paneel/*.html files for routing consistency, the certification .md files for consolidation, and possibly 1-2 small SQL migrations for the dashboard visibility repair.

**NOT touched** (per the Charter's "DO NOT MODIFY" list): `Paneel/driverpaneel.html`'s dispatch logic, `Paneel/onderaannemerA.html`'s dispatch logic, the Supabase migrations' booking lifecycle RPCs (the lifecycle is preserved), the customer auth flow (`src/lib/auth/customerAuth.ts`), and the `src/modules/communication/` lifecycle event handlers.

---

## 2. Existing Reusable Components

### 2.A `src/modules/` modules (the backend service layer)

| Module | Files | Role | Reusability for Phase A |
|---|---:|---|---|
| **`src/modules/communication/`** | 7 files | Email lifecycle, sender config, templates, review | HIGH — used everywhere; Phase A only verifies wiring |
| **`src/modules/maps/`** | (not enumerated) | Google Maps / Places / Directions integration | MEDIUM — used for booking form; Phase A verifies fallback works |
| **`src/modules/reviews/`** | (not enumerated) | Review submission + display | HIGH — used for the RIDE_COMPLETED_REVIEW_REQUEST flow |
| **`src/lib/auth/customerAuth.ts`** | 1 file | Customer signUp, signIn, session restore | HIGH — used by all customer pages |

### 2.B `supabase/functions/` Edge Functions

| Edge Function | Role | Phase A status |
|---|---|---|
| **`send-email/index.ts`** | The single email-sending endpoint (Resend-backed) | IN PLACE; v9 deployed per R-016; just needs verification |
| **`create-checkout-session/index.ts`** | Stripe checkout (NOT DEPLOYED) | EXTERNAL BLOCKER (no Stripe credentials) |
| **`process-refund/index.ts`** | Stripe refund (NOT DEPLOYED) | EXTERNAL BLOCKER (no Stripe credentials) |
| **`stripe-webhook/index.ts`** | Stripe webhook (NOT DEPLOYED) | EXTERNAL BLOCKER (no Stripe credentials) |

### 2.C `supabase/migrations/` RPCs (the backend service layer, 30 RPCs)

The most-relevant RPCs for Phase A:

| RPC | Purpose | Phase A relevance |
|---|---|---|
| `create_public_booking(payload jsonb)` | Public booking creation | Verify lifecycle; R-019 |
| `create_operator_booking(payload jsonb)` | Operator-created booking (R-004, R-020) | Verify; the operator dashboard uses this |
| `operator_assign_driver(...)` | Operator assigns driver | Verify; R-019 |
| `driver_accept_assignment(...)` | Driver accepts | Verify; R-019 |
| `driver_decline_assignment(...)` | Driver declines | Verify; R-019 |
| `operator_complete_booking(text)` | Operator marks ride complete (R-005, R-026) | Verify; R-019 |
| `submit_ride_review(...)` | Review submission (R-021, R-026) | Verify; Finding 1 (visibility) |
| `submit_account_request(payload jsonb)` | Account request submission (R-017) | Verify; Finding 5 |
| `approve_account_request(...)` | Operator approval (R-025) | Verify; Finding 5 |
| `link_customer_after_registration(...)` | Customer portal linking (R-025) | Verify; Finding 4 |
| `get_account_request_status(...)` | Account request status check | Verify; Finding 5 |
| `get_operator_dashboard_snapshot()` | Dashboard data (R-029) | Verify; the dashboard data regression |
| `is_operator()` | Operator policy guard | Verify; R-026 (session handoff) |
| `record_customer_lifecycle_email(...)` | Audit trail for customer emails | Verify; R-022 |
| `archive_operator_customer(...)` | Customer archive | Verify |
| `archive_operator_driver(...)` | Driver archive | Verify |
| `reactivate_operator_driver(...)` | Driver reactivation | Verify |
| `attach_booking_to_customer(...)` | Customer portal booking attach (R-024) | Verify; Finding 4 |

**The 30 RPCs are well-architected** and represent a comprehensive service layer. The Phase A work is *verify the wiring*, not *build new RPCs*.

### 2.D `vercel.json` rewrites (the routing layer)

27 rewrites configured, covering:
- Host-specific: `portal.fleetconnect.be`, `client.fleetconnect.be`, `partners.fleetconnect.be`
- Path-based: `/`, `/nl`, `/fr`, `/en`, `/booking`, `/booking/:path*`, `/dashboard`, `/operator`, `/login`, `/register`, `/customer`, `/client`, `/review`, `/partner-login`, `/driver-login`, `/taxi-*` (8 cities)

**Phase A routing fixes will be ADDITIVE to this list** (new rewrites for any broken patterns) and may require some `PV.html` ↔ `PV/PV.html` consistency edits.

### 2.E Tests (the verification infrastructure)

6 test files; **most are placeholder stubs** with `expect(true).toBe(true)` bodies. The tests cover:
- `auth.test.ts` (signUpCustomer, restoreCustomerSession)
- `rls.test.ts` (RLS policy verification)
- `ownership.test.ts` (bookings filtered by auth.uid())
- `portal.test.ts` (portal access)
- `navigation-verification.js` (routing)
- `translation-audit.js` (i18n consistency)

**The tests are MINIMAL** but they do exist. The agent will NOT add new tests in Phase A (per the Charter's "Do not change unrelated files"). The agent may run the existing tests to verify they still pass.

---

## 3. Existing Authentication Flow Summary

### 3.A Customer side (PV/, the customer portal)

**Files involved:** `PV/index.html` (login), `PV/register.html` (registration), `PV/klantenportaalpv.html` (portal, NL), `PV/klantenportaalpv_en.html`, `PV/klantenportaalpv_fr.html`, `src/lib/auth/customerAuth.ts`.

**Flow (per the repository + reports):**

1. Customer visits `/register` → routes to `PV/register.html`
2. `PV/register.html` collects: email, password (with repeat-password validation per Phase A.4.4.4), name, phone, address (Google Places autocomplete per Phase A.4.4.4)
3. Submission calls `submit_account_request(payload jsonb)` (RPC; persisted in `account_requests` table with `request_scope = 'customer'`)
4. **The most recent migration (`20260613010000_phase_a444_customer_self_service.sql`) changes this flow**:
   - Auto-creates a `customers` row from the account request (no operator approval needed)
   - Auto-sets `account_requests.status = 'approved'`
   - Stores `metadata.auto_customer_registration = true`, `approval_not_required = true`
5. Customer receives `CUSTOMER_REGISTRATION_CONFIRMATION` email (per the lifecycle policy)
6. Customer visits `/login` → routes to `PV/index.html`
7. `PV/index.html` performs Supabase Auth signInWithPassword
8. On success, customer is redirected to `PV/klantenportaalpv.html` (the portal)
9. `PV/klantenportaalpv.html` calls `link_customer_after_registration` RPC to attach the authenticated user to the existing `customers` row
10. Portal loads with `Mijn Profiel` as the first screen, with linked booking count + booking attach field

**Note:** the live state of this flow depends on the live Supabase having applied migration `20260613010000_phase_a444_customer_self_service.sql` (which the agent cannot verify without Supabase dashboard access — **external blocker**).

### 3.B Operator side (Paneel/, the operator dashboard)

**Files involved:** `Paneel/admin-index.html` (login), `Paneel/onderaannemerA.html` (main operator panel), `Paneel/commander.html` (dispatcher), `Paneel/autodealerpaneel.html` (B2B), `Paneel/partnerspaneel.html` (partner panel).

**Flow (per the repository + reports):**

1. Operator visits `/dashboard` or `/operator` → routes to `Paneel/admin-index.html`
2. `Paneel/admin-index.html` performs Supabase Auth signInWithPassword
3. `is_operator()` policy guard checks the authenticated user is mapped to a `partners.user_id` (per the operator policy model)
4. On success, redirects to `Paneel/onderaannemerA.html` (the main operator panel)
5. `Paneel/onderaannemerA.html` **STILL uses the existing sessionStorage handoff** (per R-026) — this is a known auth certification risk

**The sessionStorage handoff is a documented issue** that the Charter explicitly lists as a "DO NOT MODIFY" item: "Preserve existing subcontractor/partner portal logic unless certification-critical." The handoff is preserved in Phase A.

### 3.C Partner side (Paneel/partner-login.html, the partner portal)

**Files involved:** `Paneel/partner-login.html`, `Paneel/partner-set-password.html`, `Paneel/partner-reset-password.html`, `Paneel/partnerspaneel.html`.

**Flow:** the partner login is a **demo / session-based** flow (per the FINAL_CERTIFICATION_GAP_REPORT.md "Partner And Driver Auth Scope" section). It is **out of MVP scope** (per the Charter: "The existing partners portal remains dedicated to: Drivers, Subcontractors, Transportation partners").

### 3.D Driver side

**Files involved:** `Paneel/driver-login.html` (demo/session-based, out of MVP scope), `Paneel/driverpaneel.html` (driver panel), `driver-accept.html` (token-based), `driver-decline.html` (token-based).

**Flow:** drivers use **token-based accept/decline** (the only driver auth in MVP scope per the canonical). The driver panel uses the legacy session/demo flow (out of MVP scope per R-008).

### 3.E Phase A authentication work

- **Verify** the customer self-service flow end-to-end (per Finding 4 / R-030 / R-035)
- **Verify** the operator dashboard data appears (per R-029)
- **DO NOT modify** the sessionStorage handoff (per the Charter)
- **DO NOT modify** the partner / driver demo auth (out of MVP scope)

---

## 4. Existing Booking Lifecycle Summary

### 4.A The 8-stage lifecycle (preserved per the Charter)

```
Booking Created (PUBLIC)
    → Operator Review
    → Booking Accepted (operator)
    → Driver Assignment
    → Driver Accept (token-based, customer email DRIVER_ASSIGNED)
        OR Driver Decline (internal-only, operations email)
    → [if decline] Reassignment Loop
    → Ride Completion (operator_complete_booking)
    → Review Request (RIDE_COMPLETED_REVIEW_REQUEST)
```

**Per the Charter:**
> "The existing booking lifecycle is the highest-priority protected system. The following lifecycle must remain unchanged: ... Do not modify lifecycle logic unless absolutely necessary. Any lifecycle modification requires explicit impact analysis first."

**The agent will NOT modify any lifecycle logic.** Phase A is verify-only for the lifecycle.

### 4.B The 5 customer email events (per `CUSTOMER_EMAIL_LIFECYCLE_POLICY.md`)

| Event | Template | Trigger |
|---|---|---|
| Account created | `CUSTOMER_REGISTRATION_CONFIRMATION` | Customer self-service registration |
| Booking received | `BOOKING_CONFIRMATION` | Public booking submission |
| Ride confirmed | `DRIVER_ASSIGNED` | Driver accepts (NOT operator accept) |
| Driver updated | `DRIVER_REASSIGNED` | Replacement driver accepts (NOT original driver decline) |
| Ride completed | `RIDE_COMPLETED_REVIEW_REQUEST` / `RIDE_COMPLETED` | Operator marks ride complete |

**Internal-only events** (must NOT send customer emails): `BOOKING_ACCEPTED` (operator), `DRIVER_DECLINED` (driver), reassignment waiting state, internal dispatch updates. Enforced by `CommunicationService` (per the canonical report).

### 4.C The 18 SQL migrations (the schema + RLS + RPC evolution)

The 18 migrations are the *cumulative state* of the booking lifecycle + RLS + RPC implementation. The most-recent migrations (2026-06-12 and 2026-06-13) are the A.4.4.4 and customer-self-service work.

**Phase A does NOT add new SQL migrations** unless absolutely necessary. The agent's work is verify-only on the existing migrations.

---

## 5. Existing Email Flow Summary

### 5.A Sender state (the Charter's #1 ask: email sender migration)

**Per the inspection (verified 2026-06-15):**

| Sender pattern | Count | Status |
|---|---:|---|
| `@fleetconnect.be` (the branded sender) | **93 references** | ✅ IN USE |
| `@resend.dev` (the old default) | **0 references** | ✅ REMOVED (per Charter's directive) |
| `@gmail.com` (the legacy gmail) | **0 references** | ✅ REMOVED |
| `@ryzenoutsourcing` (the other legacy) | **0 references** | ✅ REMOVED |

**The email sender migration is COMPLETE in code.** The Charter's `IMPORTANT EMAIL MIGRATION REQUIREMENT` is satisfied: no `onboarding@resend.dev`, no Gmail addresses, no `fleetconnect.os@gmail.com`. The 10 mailboxes are all `@fleetconnect.be` per the Charter's PRODUCTION STATUS UPDATE.

### 5.B The send-email Edge Function

**File:** `supabase/functions/send-email/index.ts`

**Configuration (per `src/modules/communication/core/config.js`):**
- Provider: `resend` (with `mock` for localhost)
- Endpoint: `/send-email`
- From: `FleetConnect <bookings@fleetconnect.be>`
- Reply-to: `support@fleetconnect.be`
- Operations: `dispatch@fleetconnect.be`
- Tech: `tech@fleetconnect.be`
- Supabase URL: `https://rreqjjrmvytnwnsidmqi.supabase.co` (hardcoded in config; not a secret, this is the public URL)
- Supabase Anon Key: `eyJhbG...8MTA` (hardcoded in config; this is a PUBLIC anon key, not a service-role key, so it is safe to expose)
- Edge function base: `/functions/v1`
- Assignment timeout: 30 minutes

**Note on the hardcoded Supabase URL + anon key:** these are *public* values, not secrets. They are equivalent to what would be in `NEXT_PUBLIC_*` env vars in a Next.js app. The Charter's ENVIRONMENT VARIABLES section says "Before creating any environment variables: Inspect repository first... Do not create unnecessary Vercel environment variables." The hardcoded values are intentional (consistent with the static-HTML architecture) and the agent will NOT add new env vars for them.

### 5.C The 10 mailboxes (per the Charter's PRODUCTION STATUS UPDATE)

| Mailbox | Purpose |
|---|---|
| `support@fleetconnect.be` | Customer support |
| `info@fleetconnect.be` | General info |
| `bookings@fleetconnect.be` | Booking confirmations + customer lifecycle |
| `dispatch@fleetconnect.be` | Dispatch + driver comms |
| `partners@fleetconnect.be` | Partner comms |
| `drivers@fleetconnect.be` | Driver comms |
| `invoices@fleetconnect.be` | Invoices |
| `billing@fleetconnect.be` | Billing |
| `tech@fleetconnect.be` | Technical alerts |
| `noreply@fleetconnect.be` | System notifications |

**All 10 mailboxes exist and are verified** (per the Charter: "Mail delivery has been manually tested and confirmed").

### 5.D The 5 customer-facing email templates

| Event | Template trigger | Sender |
|---|---|---|
| Account created | `CUSTOMER_REGISTRATION_CONFIRMATION` | `noreply@fleetconnect.be` (TBD; per the Charter, system notifications = `noreply@`) |
| Booking received | `BOOKING_CONFIRMATION` | `bookings@fleetconnect.be` |
| Ride confirmed | `DRIVER_ASSIGNED` | `bookings@fleetconnect.be` |
| Driver updated | `DRIVER_REASSIGNED` | `bookings@fleetconnect.be` |
| Ride completed | `RIDE_COMPLETED_REVIEW_REQUEST` | `bookings@fleetconnect.be` (TBD; review request might use `noreply@`) |

**Phase A email validation:** the agent verifies (read-only, via static code inspection + the existing tests) that the templates are correctly wired and the lifecycle events trigger the right templates. **Live inbox validation is an EXTERNAL BLOCKER** (requires Vercel + Resend + Gmail access).

---

## 6. Existing Multilingual Structure Summary

### 6.A Language coverage

- **Default language:** NL (Dutch)
- **Supported languages:** NL, FR, EN
- **Trilingual order:** NL, FR, EN (per `CommunicationConfig.settings.trilingualOrder`)

### 6.B Translation files (5 total)

| File | Lines | Role |
|---|---:|---|
| `translations.js` | 4,249 | The main public-facing translation file (root) |
| `translations_append.js` | (size) | Appended translations (NL default) |
| `translations_append_en.js` | (size) | English append |
| `translations_append_fr.js` | (size) | French append |
| `src/modules/communication/l10n/translations.js` | (size) | The communication module's translation file (used by emails + reviews) |

### 6.C Language persistence (5 files use localStorage)

- `NH/Mentions_legales_KMS7.html`
- `Paneel/onderaannemerA.html`
- `PV/klantenportaalpv.html`
- `PV/PV-premium-vloot.html`
- `PV/PV-vaste-prijzen.html`

**Gap found:** the city pages (`/cities/taxi-*.html`) and the main `PV/PV.html` do **NOT** persist language in localStorage. This is a known gap. **Phase A may add language persistence to the city pages** if it fits the "Routing and CTA validation" scope.

### 6.D Language switcher hrefs (the Charter's "Mixed routing" example)

**`PV/PV.html` language switcher:**
- `href="PV_en.html"` (root, relative)
- `href="PV_fr.html"` (root, relative)

**Issue:** these hrefs are root-relative and may be broken on production where the file is at `/PV/PV.html` (the vercel.json rewrites `/` to `/PV/PV.html`, but the relative hrefs in the language switcher point to root-level files that don't exist after the folder consolidation).

**The fix:** change the language switcher hrefs to use the alias routes (`/en`, `/fr`, `/nl`) per the vercel.json rewrites, which are the canonical paths. This is a **routing fix that fits Phase A scope**.

---

## 7. Proposed Folder/File Structure (the proposed changes)

### 7.A The CURRENT structure (preserved as-is)

The repository's structure is **well-organized** and the agent does NOT propose to refactor it. The folder structure is:

```
FleetConnectFork/
├── assets/                  (preserved)
├── certification/           (preserved; historical archive)
├── cities/                  (preserved; 8 city landing pages)
├── NH/                      (preserved; KMS7 white-label)
├── Paneel/                  (preserved; operator/partner/driver panels)
├── PV/                      (preserved; Premium Vloot)
├── src/                     (preserved; modules + lib)
│   ├── lib/auth/            (preserved)
│   └── modules/             (preserved)
├── supabase/                (preserved)
│   ├── functions/           (preserved; 4 Edge Functions)
│   └── migrations/          (preserved; 18 migrations)
├── tests/                   (preserved; 6 test files)
├── *.html                   (preserved; root duplicates)
├── *.md                     (preserved; reports)
└── vercel.json              (the only file that may be edited in Phase A)
```

### 7.B The PROPOSED additions (the Phase A additions)

**New files (additive):**

| File | Purpose |
|---|---|
| `certification/CYCLE-2-EVIDENCE-FINDINGS.md` | The 14-deliverable evidence report (per the Charter) |
| `certification/CYCLE-2-FINAL-CERTIFICATION-REPORT.md` | The new consolidated cert report (per the Charter) |
| `certification/CYCLE-2-CURRENT-PRODUCTION-STATUS.md` | The new current status (per the Charter) |
| `certification/CYCLE-2-OPEN-RISKS-REGISTER.md` | The new risks register (per the Charter) |
| `certification/CYCLE-2-FOUNDER-REVIEW-CHECKLIST.md` | The founder's pre-merge review checklist (per the Charter) |

**Note:** the agent will write the new cert docs to `certification/` (per the existing convention) and will NOT modify the existing root-level `CURRENT_PRODUCTION_STATUS.md`, `OPEN_RISKS_REGISTER.md`, `FINAL_CERTIFICATION_REPORT.md` files. The existing files are preserved as historical artifacts; the new files reflect Cycle 2 state. Per the Charter's directive: "Do not delete historical certification artifacts."

**Files to be modified (minimal, scope-bounded):**

| File | Change | Reason |
|---|---|---|
| `vercel.json` | Add a few new rewrites for language switcher consistency | Charter's routing audit + mixed-pattern fix |
| `PV/PV.html` | Update language switcher hrefs to use `/en`, `/fr`, `/nl` aliases (instead of root-relative `PV_en.html` etc.) | Charter's routing fix |
| `PV/PV_en.html`, `PV/PV_fr.html`, `PV.html` (root) | Sync the same language switcher fix if they have the same pattern | Consistency |
| (Possibly) `cities/taxi-*.html` (8 files) | Add language switcher (if missing) | Charter's "every landing page should contain..." rule |

**Files NOT to be modified (per the Charter's "DO NOT MODIFY" list):**

- `Paneel/driverpaneel.html` (driver dispatch logic preserved)
- `Paneel/onderaannemerA.html` (subcontractor dispatch logic preserved; the sessionStorage handoff stays)
- `supabase/functions/send-email/index.ts` (the email function is in production; only verification, no code changes)
- `src/modules/communication/` (the email templates + lifecycle handlers preserved)
- `src/lib/auth/customerAuth.ts` (the auth flow preserved)
- Any of the 18 SQL migrations (the schema is preserved; no new migrations unless absolutely necessary)

---

## 8. Proposed Supabase Changes

### 8.A The proposal: **NO new SQL migrations in Phase A**

**The Charter's lifecycle + RLS + RPC state is comprehensive** (18 migrations, 13 RLS-enabled tables, 30 RPCs). The most-recent 2 migrations (2026-06-13) are the A.4.4.4 retest blockers and the customer self-service fix.

**The agent's work is verify, not build.** Phase A does NOT add new SQL migrations unless a *critical* gap is discovered during inspection. None was discovered in this pre-implementation inspection.

### 8.B The proposal: 0-1 new migrations POSSIBLY (deferred decision)

The agent's work may surface a *small* additional migration if a specific gap is found (e.g., the dashboard data regression per R-029 may not be fully fixed by `20260613000000_phase_a444_dashboard_visibility_repair.sql`). **If the agent finds such a gap, the agent will surface the proposal to the founder BEFORE writing the migration.** Per the Charter: "Do not change unrelated files." A new migration is a non-trivial change.

### 8.C The proposal: 0 modifications to existing migrations

The 18 existing migrations are **immutable** (per the doctrine of additive evolution + the Charter's "Do not change unrelated files"). Any bugs found in a migration are addressed by a *new* migration, not by modifying the existing one.

---

## 9. Risk Assessment (the canonical + the founder findings)

### 9.A The 31 canonical risks (per `OPEN_RISKS_REGISTER.md`, 2026-06-11)

**The canonical report has 31 distinct risk IDs but the report table has 33 rows** (R-025 and R-026 are duplicated). This is a documentation bug to fix in Cycle 2.

| Bucket | Count |
|---|---:|
| **OPEN (production blocker)** | 19 |
| **PENDING LIVE VALIDATION** | 4 |
| **OPEN (functional gap or important defect)** | 7 |
| **DEFERRED** | 3 |
| **EXTERNAL BLOCKER** | 1 (Stripe) |

### 9.B The 5 founder Manual QA findings (added as R-032 to R-036 in the previous cycle)

| # | Finding | Status (Cycle 1) | Severity |
|---|---|---|---|
| 1 | Reviews visibility | Partially Confirmed | Important Defect |
| 2 | Google Review linkage | Partially Confirmed | External Business Setup Blocker |
| 3 | Registration page loop | Partially Confirmed (customer) / Unknown (partner, operator) | Important Defect / Unknown |
| 4 | Verification email / account recognition | Partially Confirmed | **Certification Blocker** |
| 5 | Dashboard approval flow | Partially Confirmed | **Certification Blocker** |

### 9.C Cycle 2 priority risks (per the Charter)

**The Charter names 5 specific priority risks:**

| # | Risk | Status (post-Cycle 1) | Cycle 2 work |
|---|---|---|---|
| **R-027** | A.4.4.4 final live retest blockers (5 specific) | OPEN | Verify the repository has the fixes (the 20260612060000 migration + 20260613000000 + 20260613010000 + the report updates); document the 5 blockers' status |
| **R-035** | Verification email / account recognition (Founder Finding 4) | OPEN | The 20260613010000 migration adds the customer self-service flow; verify it's complete and document |
| **R-036** | Dashboard approval flow (Founder Finding 5) | OPEN | Trace the CTA in `Paneel/admin-index.html` to the correct panel; document the destination; ensure the operator approval flow works |
| **R-019** | Full lifecycle inbox certification | OPEN | Verify the 5 email templates + lifecycle events; document the verification path; **live inbox validation is an EXTERNAL BLOCKER** |
| **R-022** | Customer email lifecycle deployment validation | PENDING LIVE VALIDATION | Verify the repository has the lifecycle refinement (the 20260611030000 migration); document; **live deployment is an EXTERNAL BLOCKER** |

### 9.D The Charter's broader scope (the 36 founder-clarification risks + the 5 new from the Charter's update)

The Charter is broader than the 5 priority risks. The full Phase A scope includes:

- **Routing and CTA validation** (all pages, all CTAs, all footer/sidebar links, all city pages, all industry pages, all language switchers)
- **Email sender migration validation** (already complete; the verification is documentation)
- **Verification email / account recognition** (Finding 4)
- **Customer registration flow** (Finding 3 customer side)
- **Partner registration flow** (Finding 3 partner side; the Charter says "Verify partner registration")
- **Dashboard approval flow** (Finding 5)
- **Full booking lifecycle validation** (the 8 stages)
- **Full customer email lifecycle validation** (the 5 templates)
- **Operator-created/manual booking validation** (R-004, R-020)
- **Review visibility in dashboard, customer account, customer portal** (Finding 1)
- **Google Review CTA handling** (Finding 2; external setup blocker per founder's clarification)
- **Certification documentation consolidation** (the 4 docs)
- **Current production status**
- **Open risks register**
- **Final certification report**

### 9.E Risk posture for Cycle 2

The 41 risks (31 canonical + 5 founder + 5 Charter-named priority) are addressed by:
- **8 internal Cycle 2 deliverables** (the new cert docs)
- **0 new SQL migrations** (unless a critical gap is found)
- **0 new RPCs** (the existing 30 are sufficient)
- **0 new Edge Functions** (the existing 4 are sufficient)
- **0 modifications to the booking lifecycle** (preserved)
- **0 modifications to the driver lifecycle** (preserved)
- **0 modifications to the dispatch lifecycle** (preserved)
- **0 modifications to the subcontractor/partner portal logic** (preserved)
- **Minimal modifications to the routing config** (`vercel.json` + the language switcher hrefs in the HTML files)

**The "external blockers" remain external:**
- Vercel redeploy (live deployment)
- Supabase migration application (live DB state)
- Resend inbox validation (live email delivery)
- Google Maps API activation (live Maps integration)
- Google Business Profile verification (Finding 2)
- Stripe credentials (R-009)
- Founder credential input (any founder-action item)

---

## 10. Implementation Plan (the 12-step execution sequence)

The implementation plan is the **12-step execution sequence** that the agent will follow **after the founder approves this Inspection Report**. Each step is a single focused change. Per the Charter: "Avoid scope creep. Preserve stabilization-first execution."

### Step 1 — Routing audit + minor fixes

**Scope:** `vercel.json` (add 3-5 new rewrites for the language switcher consistency), `PV/PV.html` (update language switcher hrefs to use `/en`, `/fr`, `/nl`), `PV.html` (root) (sync), `PV/PV_en.html`, `PV/PV_fr.html` (sync), city pages (add language switcher if missing).

**Files touched:** ~10-15 files (small edits).

**Constraint preserved:** no booking lifecycle, no driver lifecycle, no dispatch lifecycle, no subcontractor/partner portal logic, no auth flow changes.

### Step 2 — Email sender migration validation (documentation)

**Scope:** verify (via static code inspection) that 0 references to `@resend.dev`, `@gmail.com`, `@ryzenoutsourcing` exist in the codebase. Document the verification.

**Files touched:** 0 (just the cert docs).

### Step 3 — Verification email / account recognition (R-035, Finding 4)

**Scope:** trace the customer self-service flow in `PV/register.html` + `PV/index.html` + the `20260613010000_phase_a444_customer_self_service.sql` migration. Document the flow end-to-end. **Live email validation is an EXTERNAL BLOCKER.**

**Files touched:** 0 (just the cert docs).

### Step 4 — Customer + Partner registration flow (R-034, Finding 3)

**Scope:** trace the customer registration flow (`PV/register.html`) and the partner registration flow (`Paneel/partner-login.html` + `Paneel/partner-set-password.html` + `Paneel/partner-reset-password.html`). Document the flow. Identify any potential loop patterns. **Live browser validation is an EXTERNAL BLOCKER.**

**Files touched:** 0 (just the cert docs).

### Step 5 — Dashboard approval flow (R-036, Finding 5)

**Scope:** trace the CTA in `Paneel/admin-index.html` to its destination. Verify it points to the operator dashboard, not the customer portal. Document the flow. **Live dashboard validation is an EXTERNAL BLOCKER.**

**Files touched:** 0 (just the cert docs).

### Step 6 — Full booking lifecycle validation

**Scope:** trace the 8-stage lifecycle (Booking Created → Operator Review → Booking Accepted → Driver Assignment → Driver Accept/Decline → Customer Notification → Ride Completion → Review Request) through the code. Verify all 5 customer email templates are triggered at the right lifecycle events. Document.

**Files touched:** 0 (just the cert docs).

### Step 7 — Full customer email lifecycle validation

**Scope:** verify the 5 customer email events (CUSTOMER_REGISTRATION_CONFIRMATION, BOOKING_CONFIRMATION, DRIVER_ASSIGNED, DRIVER_REASSIGNED, RIDE_COMPLETED_REVIEW_REQUEST/RIDE_COMPLETED) are correctly wired. Document.

**Files touched:** 0 (just the cert docs).

### Step 8 — Operator-created/manual booking validation (R-004, R-020)

**Scope:** verify the `create_operator_booking` RPC and the operator dashboard's "Add New Ride" / "Create Booking" action. Document. **If the action is missing from the dashboard UI, flag as a gap (do not auto-implement; founder decision required).**

**Files touched:** 0 (just the cert docs). Or 1 (`Paneel/onderaennemerA.html`) if the founder authorizes a minimal UI addition in a follow-up.

### Step 9 — Review visibility (Finding 1, R-021, R-026)

**Scope:** verify the `submit_ride_review` RPC + `ride_reviews` table + `review.html` page. Trace where submitted reviews are visible (operator dashboard history, operator customer view, customer portal ride history). **If visibility is missing in any of the 3 places, flag as a gap (do not auto-implement).**

**Files touched:** 0 (just the cert docs).

### Step 10 — CTA & Navigation + Dashboard usability + Commercial workflow certification

**Scope:** per the Charter's "CTA & NAVIGATION CERTIFICATION" + "DASHBOARD USABILITY CERTIFICATION" + "COMMERCIAL WORKFLOW CERTIFICATION" + "FEATURE GAP ANALYSIS" + "OPERATIONAL BOTTLENECK & EXCEPTION CERTIFICATION" sections. Produce a gap report (no implementation, per "Do not implement automatically. First produce a gap report and recommendation.").

**Files touched:** 0 (just the gap report in the cert docs).

### Step 11 — Certification documentation consolidation

**Scope:** create the 4 new cert docs (CYCLE-2-CURRENT-PRODUCTION-STATUS, CYCLE-2-OPEN-RISKS-REGISTER, CYCLE-2-FINAL-CERTIFICATION-REPORT, CYCLE-2-EVIDENCE-FINDINGS). The existing 3 cert docs (CURRENT_PRODUCTION_STATUS.md, OPEN_RISKS_REGISTER.md, FINAL_CERTIFICATION_REPORT.md) are preserved as historical artifacts. **The new docs reflect Cycle 2 state.**

**Files touched:** 0 source files; 4-5 new cert docs in `certification/`.

### Step 12 — Commit + push to the working branch

**Scope:** commit all Cycle 2 changes (the 4-5 new cert docs + the routing fixes from Step 1) on the working branch `codex-phase2-end-to-end-certification-2026-06`. Push to `Javalin13/FleetConnectFork` (the canonical remote, requires the founder's GCM-backed credential).

**Files touched:** 0 new source files; the 4-5 new cert docs are added.

**Constraint preserved:** the working branch is the only branch touched. Main is untouched. The 5 FleetConnect constraints (from Cycle 1) are superseded by the Charter's new scope (which explicitly authorizes "Implement fixes within Phase A certification scope" + "Create or update certification reports" + "Commit to the dedicated branch" + "Push the dedicated branch to FleetConnectFork if needed for review").

---

## Founder Authorization Required

**The 10-item Inspection Report is complete.** Per the Charter:

> "Only after approval should implementation begin."

The agent **awaits the founder's approval** before beginning Step 1 (the routing audit + fixes). The agent will report progress after each of the 12 steps (per the verification checklist in the Codex skill v2.0.0 — "what was just done" reports, not "awaiting your X" messages).

**If the founder approves the plan as-is:** the agent begins Step 1.

**If the founder wants modifications:** the agent will revise the plan and re-submit.

**If the founder wants to add a SQL migration or modify a file outside the proposed scope:** the agent will evaluate the request and either proceed (if scope-bounded) or escalate to a new plan.

## Cross-References

- The full Cycle 1 baseline is in `Javalin13/ryzen-core/00-foundation/FLEETCONNECT-BASELINE/` (10 docs, ~201 KB)
- The Cycle 2 deliverables will be in `Javalin13/ryzen-core/00-foundation/FLEETCONNECT-BASELINE/cycle-2/` (additive, 14 docs)
- The Codex skill v2.0.0 is at `~/.hermes/skills/autonomous-ai-agents/codex/SKILL.md`
- The doctrine of accumulation is at `Javalin13/ryzen-core/00-foundation/FOUNDATION.md`
- The autonomous-acceptance doctrine (ADR 0003) is at `Javalin13/ryzen-core/05-adrs/0003-shift-to-autonomous-acceptance-doctrine.md`
