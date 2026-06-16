# FleetConnect Mail Integration Plan

Status: SAFE PLAN ONLY - NO FRONTEND MAILBOX CREDENTIALS

## Decision

Do not connect All-Inkl or other business mailboxes directly from dashboard browser code.

Direct IMAP/SMTP access from `Paneel/onderaannemerA.html` would expose mailbox credentials or long-lived mailbox tokens to every browser session. That is not production-safe.

## Requirements

- IMAP host, port, TLS mode, mailbox username, and mailbox password or app password.
- SMTP host, port, TLS mode, sender username, and sender password or app password.
- Per-mailbox access rules for Operations, support, bookings, and finance.
- Secure secret storage outside frontend code.
- Server-side mailbox sync or proxy function.
- Audit logging for read/send actions.

## Recommended Architecture

1. Store mailbox credentials as Supabase Edge Function secrets or another server-side secret store.
2. Create an authenticated operator-only Edge Function, for example `mailbox-proxy`.
3. Require Supabase Auth JWT and verify `is_operator()` server-side before mailbox access.
4. Expose narrow actions only:
   - list folders
   - list message summaries
   - fetch one message body
   - send reply
   - mark read/archive
5. Never return mailbox credentials to the browser.
6. Log mailbox action metadata to Supabase, excluding message body content unless explicitly required.

## Dashboard Integration

Add a Mail tab only after the server-side proxy exists.

The dashboard should call the proxy with the current Supabase session token. The tab may show message lists, previews, and reply controls, but it must never contain IMAP/SMTP passwords, app passwords, or service-role keys.

## Implementation Steps

1. Confirm All-Inkl IMAP/SMTP endpoints and security settings.
2. Create Edge Function secrets for each mailbox.
3. Implement `mailbox-proxy` with operator authorization.
4. Add a minimal dashboard Mail tab that calls the proxy.
5. Validate mailbox read and send actions with a test mailbox.
6. Add audit logging and operational failure messages.

## Certification Impact

Mail tab implementation is not a current Phase A.4.4.4 certification blocker.

Safe documented plan is complete. Implementation should be scheduled only after registration, review, and Account Requests translation blockers pass live validation.
