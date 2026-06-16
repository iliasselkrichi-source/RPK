# Cycle 2 — Hotfix: Customer Registration/Portal Redirect Loop (FOUND LIVE)

```yaml
---
type: hotfix-investigation-and-implementation
report_id: CYCLE-2-HOTFIX-2026-06-15-REGISTRATION-PORTAL-LOOP
section: cycle-2-fleetconnect-charter-execution
version: 1.0
status: implemented
created: 2026-06-15
classification: certification-blocker
priority: fix-before-final-certification
branch: codex-hotfix-2026-06-15-registration-portal-loop
base_commit: f87c15b (main)
hotfix_commit: c4cff7b
verifier+implementer: Hermes Agent
---

# Cycle 2 — Hotfix: Customer Registration/Portal Redirect Loop (FOUND LIVE)

## 1. ROOT CAUSE

The founder's live validation (post-A.4.4.4) found that the customer registration/auth flow keeps switching between **Klantenportaal** and **index.html**, presenting as a redirect loop or session/account recognition loop. The agent investigated and identified **5 combined root causes** that, when present together, produce the symptom:

### RC-1: Missing vercel.json rewrites for the customer portal

The vercel.json had **no rewrite** for any of the customer portal paths. When the Supabase magic link email's `emailRedirectTo` URL was clicked, the user landed on a 404.

| Route | Status in vercel.json | Effect |
|---|---|---|
| `/klantenportaal` | ❌ NOT MAPPED | 404 |
| `/klantenportaalpv.html` | ❌ NOT MAPPED | 404 |
| `/klantenportaalpv` | ❌ NOT MAPPED | 404 |
| `/verificatie` | ❌ NOT MAPPED | 404 |
| `/verificatiepv.html` | ❌ NOT MAPPED | 404 |
| `/klantenportaalpv_en.html` | ❌ NOT MAPPED | 404 |

### RC-2: BARE path in magic-link `emailRedirectTo`

`PV/verificatiepv.html:325` used `${window.location.origin}/klantenportaalpv.html` — **missing the `/PV/` prefix**. This means even if the user clicked the magic link, they landed on a 404 (per RC-1). The correct path is `/PV/klantenportaalpv.html` (matching the file location).

### RC-3: File-relative redirect targets in verificatiepv.html

`PV/verificatiepv.html` used file-relative paths (`'klantenportaalpv.html'`, `'index.html'`) at 5 places. These resolve correctly when the user is at `https://site/PV/verificatiepv.html`, but break if the verification page is ever served at a different path. Combined with RC-1, the magic link landing is broken.

### RC-4: Auth gate signs out + redirects on missing customer row (THE LOOP)

**This is the primary cause of the loop.**

`PV/klantenportaalpv.html` (the portal) and `PV/index.html` (the login) both check for a linked customer row in the `customers` table. If the customer row was **not created** (because the `create_customer_registration_profile` RPC from migration `20260613010000_phase_a444_customer_self_service.sql` was **not yet applied to live Supabase**), the check fails, the user is **signed out**, and they're **redirected to login with `?reason=profile`**. Then the user signs in again → reaches the portal → same failure → same redirect → **the loop.**

```js
// PV/klantenportaalpv.html (pre-fix, lines 1218-1225)
if (customerCheckError || !linkedCustomers?.length) {
    await supabase.auth.signOut();          // <-- SIGNS OUT
    loginRedirect('profile');                // <-- REDIRECTS to /PV/index.html?reason=profile
    return false;
}
```

```js
// PV/index.html (pre-fix, canOpenPortal)
const { data: customers, error } = await supabase
    .from('customers')
    .select('id,user_id,email')
    .or(`user_id.eq.${user.id},email.eq.${user.email}`)
    .limit(1);
if (error) return { allowed: false, message: '...' };
if (customers?.length) return { allowed: true };
// ... (no retry, no defense-in-depth, no create_customer_registration_profile call)
```

### RC-5: Bare file-relative signOut in EN/FR portal variants

`PV/klantenportaalpv_en.html:403-404` and `PV/klantenportaalpv_fr.html:403-404` used `window.location.href = 'index.html'` (file-relative) for signOut. The main `klantenportaalpv.html` used the correct `/PV/index.html` absolute path. Inconsistent and brittle.

### The End-to-End Loop (before the fix)

```
1. User registers at /register → Supabase sends verification email
2. Email link uses emailRedirectTo = ${origin}/klantenportaalpv.html (RC-2: BARE PATH, NO /PV/)
3. User clicks link → Vercel returns 404 (no rewrite per RC-1)
4. User navigates to /login (PV/index.html) manually
5. PV/index.html signInWithPassword → canOpenPortal() → "allowed"
6. PV/index.html → window.location.href = '/PV/klantenportaalpv.html' (correct path, file exists)
7. PV/klantenportaalpv.html initCustomerSession() → supabase.auth.getUser() → OK
8. get_account_request_status → OK (if approved)
9. link_customer_after_registration → may FAIL if migration not applied
10. SELECT from customers → EMPTY (customer row never created) → SIGNS OUT + redirect to /PV/index.html?reason=profile (RC-4)
11. Back to step 4: user sees "Uw klantprofiel is nog niet gekoppeld. Log opnieuw in na verificatie of contacteer support."
12. User retries login → step 5 → ... infinite loop
```

---

## 2. FILES CHANGED (6 files, 1 commit)

| File | Type | Change | Root Cause |
|---|---|---|---|
| `vercel.json` | Modified | 5 new rewrites added | RC-1 |
| `PV/verificatiepv.html` | Modified | 5 patches: 1× emailRedirectTo, 4× internal redirects | RC-2, RC-3 |
| `PV/klantenportaalpv.html` | Modified | Defense-in-depth: try create_customer_registration_profile before signOut | RC-4 |
| `PV/index.html` | Modified | Defense-in-depth: same retry in canOpenPortal | RC-4 |
| `PV/klantenportaalpv_en.html` | Modified | signOut → /PV/index.html; corrected logout button text from "Déconnexion..." to "Logout..." | RC-5 |
| `PV/klantenportaalpv_fr.html` | Modified | signOut → /PV/index.html | RC-5 |

**Total: 106 insertions, 21 deletions, 6 files modified.**

---

## 3. FIX IMPLEMENTED (per file)

### 3.1 — vercel.json (5 new rewrites)

```json
{ "source": "/klantenportaal",       "destination": "/PV/klantenportaalpv.html" },
{ "source": "/klantenportaalpv",     "destination": "/PV/klantenportaalpv.html" },
{ "source": "/klantenportaalpv.html", "destination": "/PV/klantenportaalpv.html" },
{ "source": "/verificatie",          "destination": "/PV/verificatiepv.html" },
{ "source": "/verificatiepv.html",   "destination": "/PV/verificatiepv.html" },
```

This ensures that any URL the user lands on (whether via magic link, manual visit, or external link) resolves to the correct page.

### 3.2 — PV/verificatiepv.html (5 patches)

**Patch 1: emailRedirectTo uses /PV/ prefix (RC-2):**

```js
// BEFORE
const redirectTo = `${window.location.origin}/klantenportaalpv.html?lang=${currentLang}`;

// AFTER
const redirectTo = `${window.location.origin}/PV/klantenportaalpv.html?lang=${currentLang}`;
```

**Patches 2-5: Internal redirects use /PV/ prefix (RC-3):**

```js
// BEFORE
window.location.href = 'klantenportaalpv.html';
window.location.href = 'index.html';
window.location.href = `index.html?lang=${currentLang}&logout=expired`;
window.location.href = `index.html?lang=${currentLang}&logout=success`;

// AFTER
window.location.href = '/PV/klantenportaalpv.html';
window.location.href = '/PV/index.html';
window.location.href = `/PV/index.html?lang=${currentLang}&logout=expired`;
window.location.href = `/PV/index.html?lang=${currentLang}&logout=success`;
```

### 3.3 — PV/klantenportaalpv.html (defense-in-depth for RC-4)

**Before:**
```js
if (customerCheckError || !linkedCustomers?.length) {
    await supabase.auth.signOut();
    loginRedirect('profile');
    return false;
}
```

**After:**
```js
if (customerCheckError || !linkedCustomers?.length) {
    console.warn('Customer portal profile gate failed:', ...);
    // FIX RC-4: defense-in-depth — try to call the new create_customer_registration_profile RPC
    // (added in supabase migration 20260613010000). If applied, this creates the missing
    // customer row and the next portal load will succeed. If NOT applied, this fails silently
    // and the user sees the diagnostic message below.
    try {
        const fullName = data.user.user_metadata?.full_name || data.user.email.split('@')[0];
        const phone = data.user.user_metadata?.phone || '';
        const { data: created, error: createError } = await supabase.rpc('create_customer_registration_profile', {
            p_full_name: fullName,
            p_email: data.user.email,
            p_phone: phone,
            p_default_pickup_address: ''
        });
        if (createError) {
            console.warn('create_customer_registration_profile failed (migration may not be applied):', createError.message);
        } else if (created) {
            console.info('Customer profile created on portal entry; reloading...');
            window.location.reload();
            return false;
        }
    } catch (createErr) {
        console.warn('create_customer_registration_profile unavailable (migration may not be applied):', createErr.message);
    }
    // Migration likely not applied. Show a clearer diagnostic instead of immediately
    // signing out + redirecting (which causes the loop the founder reported).
    if (customerCheckError) {
        showError('Klantprofiel kon niet worden gecontroleerd. Probeer opnieuw of contacteer support@fleetconnect.be. Fout: ' + customerCheckError.message, true);
    } else {
        showError('Uw klantprofiel is nog niet gekoppeld. Dit kan betekenen dat de registratie nog niet voltooid is, of dat er een configuratiefout is. Log uit en log opnieuw in na verificatie, of contacteer support@fleetconnect.be.', true);
    }
    return false;
}
```

**The key insight:** when the migration IS applied, the customer row is created automatically and the page reloads once to re-run the auth gate. **The loop is broken because the customer row now exists.** When the migration is NOT applied, the user sees a clear diagnostic message (in Dutch) and the session is preserved — the operator can apply the migration and the user can refresh, and the customer row is then created.

### 3.4 — PV/index.html (defense-in-depth in canOpenPortal, same as 3.3)

The same logic was added to the `canOpenPortal` function in `PV/index.html` so that the loop is broken at the login-side check as well.

### 3.5 — PV/klantenportaalpv_en.html + _fr.html (RC-5)

```js
// BEFORE
window.location.href = 'index.html?t=' + Date.now();

// AFTER
window.location.href = '/PV/index.html?t=' + Date.now();
```

Plus a small bonus: the EN page's logout button spinner text was changed from "Déconnexion..." (French) to "Logout..." (English).

---

## 4. VALIDATION STEPS

The fix is on the **hotfix branch** `codex-hotfix-2026-06-15-registration-portal-loop`, commit `c4cff7b`, based on main `f87c15b`. **Not yet pushed to remote, not yet merged to main, not yet deployed to Vercel.**

### 4.1 — Static code validation (already done by the agent)

- ✅ vercel.json is valid JSON (5 new rewrites added)
- ✅ All `window.location.href` calls in the 4 customer-portal files now use absolute `/PV/` paths
- ✅ The `emailRedirectTo` in verificatiepv.html uses `/PV/klantenportaalpv.html`
- ✅ The defense-in-depth in PV/klantenportaalpv.html tries `create_customer_registration_profile` before signOut
- ✅ The defense-in-depth in PV/index.html `canOpenPortal` does the same

### 4.2 — Live browser validation (REQUIRED — founder action)

Per the founder's directive: "Static code trace is not enough." The following live tests must be performed after the hotfix is deployed to Vercel:

| # | Test | Steps | Expected result |
|---|---|---|---|
| 1 | Cold registration → email verify → portal | 1. Open `/register`, fill in form, submit. 2. Check email inbox. 3. Click verification link. 4. Land on portal dashboard. | Portal opens; no 404; no loop. |
| 2 | Magic link flow (existing customer) | 1. Use `sendMagicLink` from verificatiepv.html. 2. Check email. 3. Click magic link. 4. Land on portal dashboard. | Portal opens; no 404. |
| 3 | Direct portal URL (logged-in customer) | 1. Sign in. 2. Open `/klantenportaal` (the alias). 3. Should rewrite to `/PV/klantenportaalpv.html`. | Portal opens. |
| 4 | Direct portal URL (logged-out) | 1. Open `/klantenportaal` without auth. 2. Should rewrite to portal. 3. Portal's auth check fails, redirects to `/PV/index.html?reason=session`. | Login page opens with reason=session message. |
| 5 | Profile-link dead end (the original loop) | 1. Sign in as a customer whose row was NOT created (e.g., created via the old `20260612` migration). 2. Portal's auth check finds no customer. 3. Tries `create_customer_registration_profile`. 4. If migration applied, customer row is created and page reloads once. | Either portal opens (after reload) OR a clear diagnostic message displays (in Dutch). **No loop.** |
| 6 | Sign out from EN portal | 1. Sign in to EN portal. 2. Click sign out. | Redirected to `/PV/index.html?t=...`. |
| 7 | Sign out from FR portal | 1. Sign in to FR portal. 2. Click sign out. | Redirected to `/PV/index.html?t=...`. |
| 8 | Sign out from NL portal | 1. Sign in to NL portal. 2. Click sign out. | Redirected to `/PV/index.html?t=...` (already correct in main portal; verified). |
| 9 | Direct verificatie URL | 1. Open `/verificatie` (the alias). 2. Should rewrite to `/PV/verificatiepv.html`. | Verification page opens. |

### 4.3 — Supabase dashboard validation (REQUIRED — founder action)

In the Supabase dashboard, under **Authentication → URL Configuration → Redirect URLs**, the following must be allow-listed:

- `https://portal.fleetconnect.be/PV/index.html` (and any other host)
- `https://portal.fleetconnect.be/PV/klantenportaalpv.html`
- `https://portal.fleetconnect.be/PV/verificatiepv.html`
- `https://portal.fleetconnect.be/klantenportaal` (the alias)
- `https://portal.fleetconnect.be/verificatie` (the alias)
- `https://client.fleetconnect.be/...` (same set, on the client.fleetconnect.be host)
- `https://www.fleetconnect.be/...` (the main site)

If any of these are missing from the allow-list, the Supabase auth flow will reject the redirect. This is **NOT a code fix** — it's a Supabase dashboard configuration.

### 4.4 — Migration apply validation (REQUIRED — founder action)

Confirm that the following Supabase migrations are applied to the live database:

- ✅ `20260613000000_phase_a444_dashboard_visibility_repair.sql` (R-029)
- ✅ `20260613010000_phase_a444_customer_self_service.sql` (R-030, R-035; the migration that adds `create_customer_registration_profile`)

If `20260613010000` is NOT applied, the defense-in-depth will silently fail and the user will see the diagnostic message. The fix is then: **apply the migration.**

---

## 5. UPDATED CERTIFICATION STATUS

### Before the hotfix (Cycle 2 final cert)

- R-035 (Verification email / account recognition) was **🟡 RESOLVED PENDING LIVE** (code was in place)
- R-030 (Customer self-service lifecycle) was **🟡 RESOLVED PENDING LIVE** (code was in place)
- R-019 (Full lifecycle inbox certification) was **🟡 RESOLVED PENDING LIVE**
- Certification recommendation was **🟡 CONDITIONAL GO** (pending 5 external blockers)

### After the hotfix (current state)

- **R-035, R-030, R-019 statuses are now CORRECTLY** labeled as 🟡 RESOLVED PENDING LIVE — the static code is now complete, including:
  - The new defense-in-depth (try `create_customer_registration_profile` before signing out)
  - The vercel.json rewrites for the customer portal aliases
  - The corrected email redirect URLs
  - The consistent absolute path usage across EN/FR/NL portals
- **The "registration loop" finding** (which was a hidden live bug that static code trace missed) is now **🔴 CERTIFICATION BLOCKER → 🟡 RESOLVED PENDING LIVE** (the static code is correct; live validation is the next step)
- **A new finding is opened:** **Supabase Auth URL Configuration** (RC-1/RC-2's full resolution requires the founder to allow-list the redirect URLs in the Supabase dashboard). This is now an **🟢 EXTERNAL SETUP BLOCKER** item.

### The new R-037 (new risk, opened by this hotfix)

**R-037 — Supabase Auth URL Configuration allow-list**

- **Classification:** External Setup Blocker
- **Evidence:** Hotfix investigation revealed that the Supabase dashboard's "Authentication → URL Configuration → Redirect URLs" must allow-list the customer portal domains (portal.fleetconnect.be, client.fleetconnect.be, www.fleetconnect.be) for all the path variants. Without this, the email link flow will fail at the Supabase layer.
- **Recommendation:** Founder opens Supabase dashboard, adds the URLs to the allow-list, redeploys the hotfix branch to Vercel.
- **Cycle 2 Status:** 🟢 **EXTERNAL SETUP BLOCKER** (founder action)
- **Cycle 2 Severity:** 🔴 Certification Blocker
- **Charter priority:** High (external)

### The certification recommendation after the hotfix

**🟡 CONDITIONAL GO** (unchanged from before the hotfix). The hotfix did NOT make certification green; it **fixed a bug that would have made the live deployment broken.** The certification is still conditional on:

1. The 5 original external blockers (Supabase migration apply + Vercel redeploy + inbox validation + Google Maps activation + Google Business verification)
2. **The NEW external blocker R-037** (Supabase Auth URL Configuration allow-list)
3. Live validation of the 9 test cases in §4.2

**When all 6 are addressed, the loop is fully resolved and certification is "Full Go".**

---

## 6. CROSS-REFERENCES

- `INSPECTION-REPORT.md` — the Cycle 2 pre-implementation inspection (10 items)
- `certification/CYCLE-2-STEP-03-VERIFICATION-EMAIL-ACCOUNT-RECOGNITION.md` — the F4/R-035 verification (now updated to reflect this hotfix)
- `certification/CYCLE-2-STEP-09-REVIEW-VISIBILITY.md` — the review visibility implementation
- `CYCLE-2-OPEN-RISKS-REGISTER.md` — the authoritative risk register (R-035, R-030, R-019 are now in their final post-hotfix state; R-037 is added)
- `CYCLE-2-FINAL-CERTIFICATION-REPORT.md` — the authoritative final cert (Go/No-Go: still CONDITIONAL GO; new blocker added)
- `CYCLE-2-FOUNDER-REVIEW-CHECKLIST.md` — the founder's pre-merge checklist (R-037 added)

## 7. VERIFICATION TIMESTAMP

- **Code snapshot:** commit `c4cff7b` (hotfix branch tip)
- **Investigation + implementation date:** 2026-06-15
- **Verifier + Implementer:** Hermes Agent
- **Branch state:** `codex-hotfix-2026-06-15-registration-portal-loop` (1 commit ahead of main `f87c15b`; not yet pushed to remote, not yet merged)
