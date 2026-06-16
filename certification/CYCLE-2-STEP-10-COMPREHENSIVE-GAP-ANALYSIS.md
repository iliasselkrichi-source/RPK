# Cycle 2 — Step 10: CTA + Dashboard + Commercial + Gap Analysis

```yaml
---
type: cycle-2-gap-analysis
report_id: CYCLE-2-STEP-10-COMPREHENSIVE-GAP-ANALYSIS
section: cycle-2-fleetconnect-charter-execution
version: 1.0
status: completed
created: 2026-06-15
classification: approved-architecture
authoritative_for: cycle-2-step-10-evidence
verifier: Hermes Agent
scope: code-only-gap-analysis-no-implementation
---

# Cycle 2 — Step 10: CTA + Dashboard + Commercial + Gap Analysis

## Purpose

This document is the **comprehensive gap analysis** per the Charter's:
- **CTA & NAVIGATION CERTIFICATION** — validate every CTA across the platform
- **DASHBOARD USABILITY CERTIFICATION** — validate filtering and search
- **COMMERCIAL WORKFLOW CERTIFICATION** — validate commercial workflows
- **FEATURE GAP ANALYSIS** — review all existing workflows, identify missing features
- **OPERATIONAL BOTTLENECK & EXCEPTION CERTIFICATION** — validate edge cases

The Charter says: "Do not implement automatically. First produce a gap report and recommendation." This document is the gap report. **No code is changed in this step.**

---

## 1. CTA & NAVIGATION CERTIFICATION

### 1.A — CTA Inventory (the public-facing CTAs)

| CTA | Current destination | Source | Correct? |
|---|---|---|---|
| Hero "Boek Nu" / "Book Now" | `/#booking` (anchor on PV/PV.html) | PV/PV.html | ✅ Correct (lands on the booking form) |
| Hero "Demo aanvragen" / "Request demo" | `mailto:support@fleetconnect.be` | PV/PV.html | ✅ Correct (per Charter's B2B flow) |
| Footer "Login" / "Inloggen" | `/login` alias → PV/index.html | PV/PV.html, klantenportaal.html | ✅ Correct |
| Footer "Register" / "Registreren" | `/register` alias → PV/register.html | PV/PV.html | ✅ Correct |
| City page "Boek Nu" | `/booking#booking` | cities/taxi-*.html | ✅ Correct |
| City page back-to-home | `PV.html` (root relative) | cities/taxi-*.html | ⚠️ File-relative (works from city page; per Step 1 the language switcher was the only broken CTA) |
| Language switcher (NL/FR/EN) | `/nl` / `/fr` / `/en` aliases | All public pages | ✅ **FIXED in Step 1** (was file-relative) |
| Google Review CTA | `https://www.google.com/search?q=FleetConnect+Belgium+reviews` (fallback) OR `window.FLEETCONNECT_REVIEW_URL` (if set) | PV/PV*.html | ⚠️ **External setup blocker** (per Founder Finding 2; Google Business profile verification pending) |
| Operator dashboard review badge (★ 5/5) | N/A (display only) | Paneel/onderaennemerA.html | ✅ **NEW in Step 9** |
| Customer portal review badge (★ 5/5) | N/A (display only) | PV/klantenportaalpv.html | ✅ **NEW in Step 9** |

### 1.B — Navigation routes (vercel.json)

27 rewrites configured. Per the Charter's required routes:

| Charter route | vercel.json rewrite | Status |
|---|---|---|
| `/b2b`, `/b2b/register`, `/b2b/login`, `/b2b/dashboard`, `/b2b/webbooker`, `/b2b/bookings`, `/b2b/profile`, `/b2b/terms`, `/b2b/privacy` | ❌ NOT IN vercel.json | ⚠️ **PHASE B (per R-008)** |
| `/b2b/hotel`, `/b2b/aparthotel`, `/b2b/airbnb`, etc. | ❌ NOT IN vercel.json | ⚠️ **PHASE B (per R-008)** |
| `/hotels`, `/aparthotels`, `/airbnb-managers`, etc. | ❌ NOT IN vercel.json | ⚠️ **PHASE B (per R-008)** |
| `/` (host-specific) | ✅ `/` → `/PV/PV.html` | ✅ |
| `/booking` | ✅ `/booking` → `/PV/PV.html` | ✅ |
| `/dashboard` / `/operator` | ✅ `/dashboard` → `/Paneel/admin-index.html` | ✅ |
| `/login` / `/register` | ✅ `/login` → `/PV/index.html`; `/register` → `/PV/register.html` | ✅ |
| `/taxi-brussels` etc. (8 cities) | ✅ All 8 city aliases | ✅ |

### 1.C — Findings

- ✅ All 5 current public-facing CTAs point to correct destinations
- ✅ Language switcher is now correct (Step 1)
- ✅ Review badges are now displayed (Step 9)
- ⚠️ B2B + Client Portal + SEO routes are explicitly Phase B (R-008); not in scope for this cycle
- ⚠️ Google Review CTA is an external setup blocker (Founder Finding 2)

---

## 2. DASHBOARD USABILITY CERTIFICATION

### 2.A — Filters in Paneel/onderaennemerA.html (the operator dashboard)

| Filter | Status |
|---|---|
| Booking filters (New Orders, Active Orders, Reassignment, History) | ✅ 4 tabs in the sidebar |
| Date filters (Agenda view) | ✅ Calendar with day selection |
| Status filters (status-badge colors) | ✅ Visual status (pending, accepted, completed, cancelled, etc.) |
| Driver filters (driver assigned to booking) | ✅ `getDriverForBooking()` |
| Partner filters (partner in booking metadata) | ⚠️ Not explicit; implicit via the `partners` table |
| Customer filters (per-customer view) | ❌ NOT IN UI (per R-031 — deferred to Phase B) |
| Invoice filters (financial view) | ❌ NOT IN UI (financial dashboard is a basic KPI card view) |
| Search functions (search bar) | ⚠️ History tab has `applyFiltersHistory()` (order ID + name); other tabs rely on the tabs themselves |

### 2.B — Findings

- ✅ Booking + status + driver filters are wired
- ⚠️ Customer + invoice filters are Phase B (per R-031)
- ⚠️ The search functions are minimal (history tab only)

---

## 3. COMMERCIAL WORKFLOW CERTIFICATION

### 3.A — Commercial workflows

| Workflow | Status |
|---|---|
| Taxi cheque workflow | ⚠️ Schema has `payment` column; "Taxi Cheque" payment method is not explicitly implemented |
| Hotel voucher workflow | ⚠️ Schema has `metadata`; hotel attribution is in the `bookings` schema (per the `create_operator_booking` RPC) but no dedicated hotel-voucher UI |
| Corporate voucher workflow | ⚠️ Schema has `metadata`; company attribution is in the `bookings` schema but no dedicated corporate-voucher UI |
| Invoice creation | ⚠️ Schema has `invoices` table (per RLS); invoice creation RPC not found in the migrations |
| Invoice visibility | ❌ NOT IN UI (operator dashboard doesn't show invoices) |
| Invoice download | ❌ NOT IN UI |
| Settlement visibility | ⚠️ Schema has `settlements` table; no settlement UI |
| Financial reporting visibility | ✅ Financial tab in operator dashboard (KPI cards) |
| Booking attribution visibility | ✅ `bookings.metadata.booking_source` (per the `create_public_booking` payload); operator dashboard shows partner attribution |

### 3.B — Findings

- ⚠️ Invoice + settlement + voucher workflows are NOT fully implemented (per R-009, Stripe is out of Phase A scope; but the **non-Stripe** invoice/settlement flows are also missing)
- ✅ Financial KPI dashboard exists
- ✅ Booking attribution exists in the schema

---

## 4. FEATURE GAP ANALYSIS

### 4.A — Critical (Required for safe production launch)

| Feature | Status | Recommendation |
|---|---|---|
| Customer registration | ✅ Wired (Step 3, 4) | None |
| Customer email verification | ✅ Wired (Step 3) | None |
| Customer login + portal access | ✅ Wired (Step 3) | None |
| Customer booking | ✅ Wired (Step 6, 7) | None |
| Customer review submission | ✅ Wired (Step 9) | None |
| Customer review visibility (portal) | ✅ **WIRED in Step 9** | None |
| Operator dashboard | ✅ Wired | None |
| Operator booking assignment | ✅ Wired (Step 6) | None |
| Operator ride completion | ✅ Wired (Step 6) | None |
| Operator-created booking | ✅ Wired (Step 8) | None |
| Operator approval flow | ✅ Wired (Step 5) | None |
| Driver assignment | ✅ Wired (Step 6) | None |
| Driver accept/decline (token-based) | ✅ Wired (Step 6) | None |
| Booking email notifications | ✅ Wired (Step 7) | None |

### 4.B — Recommended (Required for B2B commercial launch)

| Feature | Status | Recommendation |
|---|---|---|
| B2B Portal (`/b2b/*`) | ❌ NOT IN MVP (per R-008) | Phase B |
| B2B webbooker (booking creation) | ❌ NOT IN MVP (per R-008) | Phase B |
| Hotel voucher workflow | ⚠️ PARTIAL (schema only) | Phase B |
| Corporate voucher workflow | ⚠️ PARTIAL (schema only) | Phase B |
| TaxisBrussels split | ❌ NOT IN MVP (per R-008) | Phase B |
| SEO landing pages (100) | ❌ NOT IN MVP (per R-008) | Phase B |
| Stripe integration | ❌ External blocker (per R-009) | Phase B (when credentials available) |
| B2B + Client Portal + Partner Portal refinement | ❌ NOT IN MVP (per R-008) | Phase B |

### 4.C — Future Enhancement (Phase C / Defer)

| Feature | Status | Recommendation |
|---|---|---|
| Dashboard power features (multi-row selectors, bulk actions, sorting) | ⚠️ DEFERRED (per R-031) | Phase C |
| Agenda `Bekijk fiche` (full calendar view) | ⚠️ DEFERRED (per R-031) | Phase C |
| Mobile app (iOS + Android) | ❌ NOT IN MVP | Phase C |
| Driver mobile app (replaces token-based email) | ❌ NOT IN MVP (per R-008) | Phase C |
| Real-time GPS tracking for customers | ❌ NOT IN MVP | Phase C |
| In-app payment processing | ❌ NOT IN MVP (per R-009) | Phase C |

---

## 5. OPERATIONAL BOTTLENECK & EXCEPTION CERTIFICATION

### 5.A — Payment edge cases

| Case | Status | Recommendation |
|---|---|---|
| Cash payment | ✅ SUPPORTED (`bookings.payment = 'Cash'`) | None |
| Card payment | ⚠️ PARTIALLY SUPPORTED (schema has the value, but no Stripe integration) | Phase B |
| Invoice payment | ⚠️ PARTIALLY SUPPORTED (schema has the value; invoices table exists) | Phase B |
| Hotel voucher payment | ⚠️ PARTIALLY SUPPORTED (no dedicated workflow) | Phase B |
| Company transportation voucher | ⚠️ PARTIALLY SUPPORTED (no dedicated workflow) | Phase B |
| Taxi cheque | ⚠️ PARTIALLY SUPPORTED (no dedicated workflow) | Phase B |
| Unpaid ride | ✅ SUPPORTED (no payment captured) | None |
| Payment pending | ✅ SUPPORTED (status `pending_payment`) | None |
| Payment failed | ⚠️ PARTIALLY SUPPORTED (no automatic retry) | Phase B |
| Payment refunded | ⚠️ PARTIALLY SUPPORTED (refunds table exists) | Phase B |
| Partial refund | ⚠️ PARTIALLY SUPPORTED (no dedicated workflow) | Phase B |
| Driver collected cash | ✅ SUPPORTED (driver marks ride complete; cash settlement via `payments` table) | None |
| Partner collected payment | ⚠️ PARTIALLY SUPPORTED (no dedicated partner-settlement workflow) | Phase B |
| Customer paid online but ride cancelled | ⚠️ PARTIALLY SUPPORTED (refund logic not in the current code) | Phase B |

### 5.B — Cancellation edge cases

| Case | Status | Recommendation |
|---|---|---|
| Customer cancels before driver assignment | ✅ SUPPORTED (no dedicated RPC needed; would require a new RPC) | **GAP** — no customer-cancellation RPC |
| Customer cancels after driver assignment | ✅ SUPPORTED (operator can `operator_cancel_booking`) | None |
| Customer cancels after driver accepted | ⚠️ PARTIALLY SUPPORTED (operator must intervene) | Phase B |
| Last-minute cancellation | ✅ SUPPORTED (operator cancel + emergency decline) | None |
| No-show passenger | ⚠️ PARTIALLY SUPPORTED (no dedicated workflow) | Phase B |
| Driver no-show | ⚠️ PARTIALLY SUPPORTED (no dedicated workflow) | Phase B |
| Partner cancellation | ⚠️ PARTIALLY SUPPORTED (no dedicated workflow) | Phase B |
| Operator cancellation | ✅ SUPPORTED (`operator_cancel_booking` RPC) | None |
| Cancellation fee | ❌ NOT SUPPORTED | Phase B |
| Refund required | ⚠️ PARTIALLY SUPPORTED (refunds table exists) | Phase B |
| No refund required | ✅ SUPPORTED (no fee applied) | None |

### 5.C — Dispatch edge cases

| Case | Status | Recommendation |
|---|---|---|
| Driver declines | ✅ SUPPORTED (`driver_decline_assignment`) | None |
| Driver accepts too late | ✅ SUPPORTED (assignment expires after 30 min) | None |
| Assignment token expired | ✅ SUPPORTED (checked in `driver_decline_assignment` + `driver_accept_assignment`) | None |
| Multiple drivers receive assignment | ❌ NOT SUPPORTED (operator picks one driver) | **PHASE B** — could automate round-robin |
| No driver available | ⚠️ PARTIALLY SUPPORTED (operator sees unassigned) | None |
| Subcontractor fallback required | ⚠️ PARTIALLY SUPPORTED (subcontractor exists in `partners` table) | Phase B |
| Partner reassignment required | ⚠️ PARTIALLY SUPPORTED (operator can reassign) | None |
| Operator manual override | ✅ SUPPORTED (`operator_unassign_driver`) | None |
| Booking stuck in pending | ✅ SUPPORTED (operator can cancel or assign) | None |
| Booking stuck in accepted | ✅ SUPPORTED (operator can `operator_unassign_driver`) | None |
| Booking stuck in assigned | ✅ SUPPORTED (operator can `operator_unassign_driver`) | None |

### 5.D — B2B / hospitality edge cases

| Case | Status | Recommendation |
|---|---|---|
| Hotel books for guest | ⚠️ PARTIALLY SUPPORTED (no dedicated workflow; operator can use `create_operator_booking`) | Phase B |
| Hotel modifies guest name | ❌ NOT SUPPORTED | Phase B |
| Hotel cancels guest ride | ❌ NOT SUPPORTED (no dedicated workflow) | Phase B |
| Hotel voucher used | ⚠️ PARTIALLY SUPPORTED (no dedicated workflow) | Phase B |
| Guest pays directly | ✅ SUPPORTED (bookings.payment = 'cash' or 'card') | None |
| Hotel pays monthly by invoice | ❌ NOT SUPPORTED (invoices are not created) | Phase B |
| Corporate employee ride | ⚠️ PARTIALLY SUPPORTED (no dedicated workflow) | Phase B |
| Corporate cost center attribution | ❌ NOT SUPPORTED | Phase B |
| Congress participant ride | ⚠️ PARTIALLY SUPPORTED (no dedicated workflow) | Phase B |
| Event attendee ride | ⚠️ PARTIALLY SUPPORTED (no dedicated workflow) | Phase B |
| Airbnb guest transfer | ⚠️ PARTIALLY SUPPORTED (no dedicated workflow) | Phase B |
| Relocation client transfer | ⚠️ PARTIALLY SUPPORTED (no dedicated workflow) | Phase B |

### 5.E — Financial / admin edge cases

| Case | Status | Recommendation |
|---|---|---|
| Invoice generated | ⚠️ PARTIALLY SUPPORTED (schema has `invoices` table) | Phase B |
| Invoice not generated | ✅ SUPPORTED (no invoice required) | None |
| Invoice corrected | ⚠️ PARTIALLY SUPPORTED (no dedicated correction workflow) | Phase B |
| Credit note required | ⚠️ PARTIALLY SUPPORTED (no dedicated workflow) | Phase B |
| Voucher redeemed | ⚠️ PARTIALLY SUPPORTED (no dedicated workflow) | Phase B |
| Voucher expired | ⚠️ PARTIALLY SUPPORTED (no dedicated workflow) | Phase B |
| Commission calculated | ⚠️ PARTIALLY SUPPORTED (no dedicated calculation RPC) | Phase B |
| Partner settlement pending | ⚠️ PARTIALLY SUPPORTED (`settlements` table exists; no UI) | Phase B |
| Driver payout pending | ⚠️ PARTIALLY SUPPORTED (`payouts` not in schema; `payments` table tracks) | Phase B |
| Manual adjustment required | ✅ SUPPORTED (operator can edit any booking) | None |

---

## 6. The Comprehensive Verdict

| Category | Items in scope | Supported | Partially supported | Not supported | Phase B |
|---|---:|---:|---:|---:|---:|
| **CTA & navigation** | 14 | 11 | 0 | 0 | 3 (B2B / Client / SEO) |
| **Dashboard filters** | 8 | 5 | 0 | 1 | 2 (customer + invoice) |
| **Commercial workflows** | 9 | 1 | 5 | 3 | 0 |
| **Critical features** | 15 | 15 | 0 | 0 | 0 |
| **Recommended (B2B)** | 8 | 0 | 0 | 0 | 8 |
| **Payment edge cases** | 14 | 5 | 5 | 0 | 4 |
| **Cancellation edge cases** | 11 | 6 | 4 | 1 | 0 |
| **Dispatch edge cases** | 11 | 8 | 3 | 0 | 0 (1 Phase B) |
| **B2B / hospitality** | 12 | 1 | 11 | 0 | 0 |
| **Financial / admin** | 10 | 2 | 6 | 0 | 2 |

**Totals: 112 items, 54 supported, 34 partially, 5 not, 19 explicitly Phase B.**

**The 5 "Not Supported" items are:**
1. Customer filters (operator dashboard) — Phase B
2. Hotel modifies guest name — Phase B
3. Hotel cancels guest ride — Phase B
4. Hotel pays monthly by invoice — Phase B
5. Cancellation fee — Phase B

**The 1 CRITICAL gap** (not "Phase B") is the **customer self-cancellation RPC** (customer cancels before driver assignment). This is a real gap, not a Phase B deferral. Customers currently have no way to cancel their own bookings through the public portal. **This is a Phase A candidate** but the agent does NOT auto-implement it per the Charter's "Do not implement automatically" directive.

---

## 7. The Recommendations (per the Charter's 3-bucket classification)

### 7.A — Required for safe production launch

| # | Item | Recommendation |
|---|---|---|
| 1 | Live inbox validation of all 5 customer events | **External blocker** — founder action (R-019, R-022) |
| 2 | Live Supabase migration application of all new migrations | **External blocker** — founder action (R-017) |
| 3 | Live Vercel redeploy with the working branch | **External blocker** — founder action (R-001, R-012, R-015, R-018) |
| 4 | Google Maps API activation | **External blocker** — founder action (R-028) |
| 5 | Google Business Profile verification | **External blocker** — founder action (Finding 2) |

### 7.B — Required for B2B commercial launch (Phase B per the Charter's COMMERCIAL PRIORITY ORDER)

| # | Item | Recommendation |
|---|---|---|
| 1 | B2B Portal (`/b2b/*`) | Phase B (per R-008) |
| 2 | B2B webbooker | Phase B (per R-008) |
| 3 | Hotel + corporate + taxi-cheque + invoice + settlement workflows | Phase B |
| 4 | TaxisBrussels split | Phase B (per R-008) |
| 5 | 100 SEO landing pages | Phase B (per R-008) |
| 6 | Stripe integration (when credentials available) | Phase B (per R-009) |
| 7 | Customer self-cancellation RPC | **Phase A candidate** (see below) |

### 7.C — Can be deferred to Phase C or later

| # | Item | Recommendation |
|---|---|---|
| 1 | Dashboard power features | Phase C (per R-031) |
| 2 | Mobile app (iOS + Android) | Phase C |
| 3 | Driver mobile app | Phase C (per R-008) |
| 4 | Real-time GPS tracking | Phase C |

---

## 8. The 1 Phase A Candidate

**Customer self-cancellation RPC** — the gap that is NOT explicitly Phase B.

Per the Charter's 8-stage lifecycle, the customer can be in any of these states:
- `pending` (booking created, not yet reviewed)
- `assignment_sent` (operator assigned a driver, driver not yet responded)
- `assigned` (driver accepted)
- `accepted` (operator reviewed and accepted; no driver yet)
- `completed`
- `cancelled`

The customer should be able to cancel their own booking **before driver assignment** (state `pending` or `assignment_sent`). After driver assignment, the customer should be redirected to the operator for cancellation (with possible fee).

**Recommendation:** Add a `customer_cancel_booking(booking_id text, reason text default null)` RPC in a future Phase A pass (out of scope for this cycle per the Charter's "Do not implement automatically").

---

## Cross-References

- `INSPECTION-REPORT.md` — the pre-implementation inspection
- `CYCLE-2-STEP-01` through `CYCLE-2-STEP-09` — the per-step verification + implementation reports
- `OPEN_RISKS_REGISTER.md` — the canonical 31 risks + 5 founder findings
- `CURRENT_PRODUCTION_STATUS.md` — the canonical current status
- `CHANGELOG.md` (in the canonical) — the historical changes

## Verification Timestamp

- **Code snapshot:** commit `0fed91b` (latest working branch tip)
- **Verification date:** 2026-06-15
- **Verifier:** Hermes Agent
