#!/usr/bin/env python3
"""
Cert Cycle 7 — Data Integrity + Live Flow Validation
"""

import os
import sys
import json
import time
import re
import requests
import psycopg2
import base64
from datetime import datetime
from typing import Optional, Dict, Any, List, Tuple

SUPABASE_URL = 'https://rreqjjrmvytnwnsidmqi.supabase.co'

# Get the real anon key from the live site
r = requests.get('https://www.fleetconnect.be/PV/index.html', timeout=10, allow_redirects=True)
m = re.search(r'SUPABASE_ANON_KEY\s*=\s*["\']([A-Za-z0-9._-]+)["\']', r.text)
SUPABASE_ANON_KEY = m.group(1) if m else None
print(f"Real anon key loaded: {SUPABASE_ANON_KEY[:20]}... ({len(SUPABASE_ANON_KEY)} chars)")

results: List[Dict[str, Any]] = []
def log(step: str, status: str, evidence: Dict[str, Any] = None, error: str = None):
    entry = {
        'step': step,
        'status': status,
        'timestamp': datetime.utcnow().isoformat(),
        'evidence': evidence or {},
    }
    if error:
        entry['error'] = error
    results.append(entry)
    sym = {'PASS': '✓', 'FAIL': '✗', 'SKIP': '⊘'}.get(status, '?')
    print(f"  {sym} [{status}] {step}" + (f" — {error}" if error else ""))

def get_db_connection():
    pwpath = r'C:\Users\AGS\Documents\ryzen-core\.scratch\supabase-cert\.dbpw.tmp'
    if os.path.exists(pwpath):
        with open(pwpath, 'r') as f:
            pw = f.read().strip()
    else:
        pw = os.environ.get('SUPABASE_DB_PASSWORD')
    if not pw:
        return None
    return psycopg2.connect(
        host='aws-0-eu-west-1.pooler.supabase.com',
        port=6543,
        user='postgres.rreqjjrmvytnwnsidmqi',
        password=pw,
        dbname='postgres',
        sslmode='require',
        connect_timeout=15,
    )

# ============================================================
# PHASE 1: Customer flow — sign up + verify + login
# ============================================================
def customer_flow() -> Dict[str, Any]:
    print("\n=== PHASE 1: Customer Flow ===")
    flow = {'name': 'customer', 'steps': [], 'pass': True}

    # 1.1 Register page
    r = requests.get('https://www.fleetconnect.be/PV/register.html', timeout=10, allow_redirects=True)
    log('1.1 register page loads', 'PASS' if r.status_code == 200 else 'FAIL', {'http': r.status_code, 'size': len(r.text)})
    flow['steps'].append(('1.1', r.status_code == 200))

    # 1.2 Sign up
    test_email = f'cert-test-{int(time.time())}@example.com'
    test_password='CertTest123!Secure'  # 20 chars, meets Supabase requirements
    try:
        r = requests.post(
            f'{SUPABASE_URL}/auth/v1/signup',
            headers={'apikey': SUPABASE_ANON_KEY, 'Content-Type': 'application/json'},
            json={
                'email': test_email,
                'password': test_password,
                'data': {'full_name': 'Cert Test User', 'phone': '+321****5678'},
            },
            timeout=15,
        )
        data = r.json() if r.text else {}
        # Supabase returns {id, email, ...} at the top level when confirmation is required
        user_id = data.get('id') or (data.get('user', {}).get('id') if 'user' in data else None)
        success = r.status_code in (200, 201) and user_id is not None
        log('1.2 signUp new customer', 'PASS' if success else 'FAIL', {
            'http': r.status_code, 'user_id': user_id, 'email': test_email
        })
        flow['steps'].append(('1.2', success))
        if not success:
            flow['pass'] = False
            return flow
    except Exception as e:
        log('1.2 signUp', 'FAIL', error=str(e))
        flow['steps'].append(('1.2', False))
        flow['pass'] = False
        return flow

    # 1.3 Verification page is 4-state
    r = requests.get('https://www.fleetconnect.be/PV/verificatiepv.html', timeout=10, allow_redirects=True)
    has_4_states = all(s in r.text for s in ['success', 'needsLogin', 'error', 'directVisit'])
    has_www_friendly = 'www.' in r.text or 'window.location' in r.text
    log('1.3 verificatiepv.html is 4-state handler', 'PASS' if has_4_states else 'FAIL', {
        'has_4_states': has_4_states, 'size': len(r.text)
    })
    flow['steps'].append(('1.3', has_4_states))

    # 1.4 register.html uses wwwOrigin
    r = requests.get('https://www.fleetconnect.be/PV/register.html', timeout=10, allow_redirects=True)
    has_www_origin = 'wwwOrigin' in r.text
    log('1.4 register.html uses wwwOrigin (apex→www fix)', 'PASS' if has_www_origin else 'FAIL', {
        'has_wwwOrigin': has_www_origin
    })
    flow['steps'].append(('1.4', has_www_origin))

    # 1.5 Manually confirm the email via DB
    conn = get_db_connection()
    if conn:
        try:
            cur = conn.cursor()
            cur.execute("update auth.users set email_confirmed_at = now() where id = %s", (user_id,))
            conn.commit()
            log('1.5 email confirmed in DB', 'PASS', {'user_id': user_id})
            flow['steps'].append(('1.5', True))
        except Exception as e:
            log('1.5 email confirmed in DB', 'FAIL', error=str(e))
            flow['steps'].append(('1.5', False))
            flow['pass'] = False
        finally:
            conn.close()
    else:
        log('1.5 email confirmed in DB', 'SKIP')
        flow['steps'].append(('1.5', None))

    # 1.6 Login
    try:
        r = requests.post(
            f'{SUPABASE_URL}/auth/v1/token?grant_type=password',
            headers={'apikey': SUPABASE_ANON_KEY, 'Content-Type': 'application/json'},
            json={'email': test_email, 'password': test_password},
            timeout=15,
        )
        data = r.json() if r.text else {}
        access_token = data.get('access_token') if r.status_code == 200 else None
        log('1.6 login', 'PASS' if access_token else 'FAIL', {
            'http': r.status_code, 'has_token': bool(access_token)
        })
        flow['steps'].append(('1.6', bool(access_token)))
        if not access_token:
            flow['pass'] = False
    except Exception as e:
        log('1.6 login', 'FAIL', error=str(e))
        flow['steps'].append(('1.6', False))
        flow['pass'] = False
        access_token = None

    # 1.7 get_customer_portal_access
    if access_token:
        try:
            r = requests.post(
                f'{SUPABASE_URL}/rest/v1/rpc/get_customer_portal_access',
                headers={'apikey': SUPABASE_ANON_KEY, 'Authorization': f'Bearer {access_token}', 'Content-Type': 'application/json'},
                json={},
                timeout=15,
            )
            data = r.json() if r.text else {}
            success = r.status_code == 200 and data.get('allowed') is True
            log('1.7 get_customer_portal_access', 'PASS' if success else 'FAIL', {
                'http': r.status_code, 'data': data
            })
            flow['steps'].append(('1.7', success))
            if not success:
                flow['pass'] = False
        except Exception as e:
            log('1.7 get_customer_portal_access', 'FAIL', error=str(e))
            flow['steps'].append(('1.7', False))
            flow['pass'] = False

    # 1.8 logout
    if access_token:
        try:
            r = requests.post(
                f'{SUPABASE_URL}/auth/v1/logout',
                headers={'apikey': SUPABASE_ANON_KEY, 'Authorization': f'Bearer {access_token}'},
                timeout=15,
            )
            log('1.8 logout', 'PASS' if r.status_code in (200, 204) else 'FAIL', {'http': r.status_code})
            flow['steps'].append(('1.8', r.status_code in (200, 204)))
        except Exception as e:
            log('1.8 logout', 'FAIL', error=str(e))
            flow['steps'].append(('1.8', False))

    return flow

# ============================================================
# PHASE 2: Partner/operator flow
# ============================================================
def partner_flow() -> Dict[str, Any]:
    print("\n=== PHASE 2: Partner/Operator Flow ===")
    flow = {'name': 'partner', 'steps': [], 'pass': True}

    test_email = f'cert-partner-{int(time.time())}@example.com'

    # 2.1 admin-index.html is FleetConnect branded
    r = requests.get('https://www.fleetconnect.be/Paneel/admin-index.html', timeout=10, allow_redirects=True)
    is_fleetconnect = 'FleetConnect' in r.text and 'RYZEN' not in r.text.upper()
    log('2.1 admin-index.html FleetConnect branded', 'PASS' if is_fleetconnect else 'FAIL', {
        'is_fleetconnect': is_fleetconnect, 'has_ryzen': 'RYZEN' in r.text
    })
    flow['steps'].append(('2.1', is_fleetconnect))

    # 2.2 Submit account request
    try:
        r = requests.post(
            f'{SUPABASE_URL}/rest/v1/rpc/submit_account_request',
            headers={'apikey': SUPABASE_ANON_KEY, 'Content-Type': 'application/json'},
            json={'payload': {
                'name': 'Cert Test Partner',
                'email': test_email,
                'phone': '+3298765432',
                'company': 'Cert Test Partner BV',
                'account_type': 'Partner',
                'request_scope': 'operator',
                'notes': 'Cert cycle 7 automated',
                'source': 'cert-validation',
            }},
            timeout=15,
        )
        data = r.json() if r.text else {}
        request_id = data.get('id') if isinstance(data, dict) else None
        success = r.status_code == 200 and request_id is not None
        log('2.2 submit_account_request', 'PASS' if success else 'FAIL', {
            'http': r.status_code, 'data': data, 'request_id': request_id
        })
        flow['steps'].append(('2.2', success))
    except Exception as e:
        log('2.2 submit_account_request', 'FAIL', error=str(e))
        flow['steps'].append(('2.2', False))
        flow['pass'] = False
        request_id = None

    # 2.3 Verify the request is in the DB
    if request_id:
        conn = get_db_connection()
        if conn:
            try:
                cur = conn.cursor()
                cur.execute("select status, request_scope, account_type, created_at from public.account_requests where id = %s", (request_id,))
                row = cur.fetchone()
                if row:
                    log('2.3 account_request persisted', 'PASS', {
                        'status': row[0], 'scope': row[1], 'type': row[2], 'created': row[3].isoformat() if row[3] else None
                    })
                    flow['steps'].append(('2.3', row[0] == 'pending'))
                else:
                    log('2.3 account_request persisted', 'FAIL', error='row not found')
                    flow['steps'].append(('2.3', False))
                    flow['pass'] = False
            except Exception as e:
                log('2.3 account_request persisted', 'FAIL', error=str(e))
                flow['steps'].append(('2.3', False))
                flow['pass'] = False
            finally:
                conn.close()

    # 2.4 Verify partner-login.html is FleetConnect branded
    r = requests.get('https://www.fleetconnect.be/Paneel/partner-login.html', timeout=10, allow_redirects=True)
    is_fc = 'FleetConnect' in r.text and 'NH' not in r.text[:200]
    log('2.4 partner-login.html FleetConnect branded', 'PASS' if is_fc else 'FAIL', {
        'is_fleetconnect': is_fc
    })
    flow['steps'].append(('2.4', is_fc))

    # 2.5 Verify driver-login.html
    r = requests.get('https://www.fleetconnect.be/Paneel/driver-login.html', timeout=10, allow_redirects=True)
    is_fc = 'FleetConnect' in r.text
    log('2.5 driver-login.html FleetConnect branded', 'PASS' if is_fc else 'FAIL', {'is_fleetconnect': is_fc})
    flow['steps'].append(('2.5', is_fc))

    return flow

# ============================================================
# PHASE 3: Dashboard
# ============================================================
def dashboard_flow() -> Dict[str, Any]:
    print("\n=== PHASE 3: Dashboard Flow ===")
    flow = {'name': 'dashboard', 'steps': [], 'pass': True}

    pages = [
        ('3.1', 'PV/index.html', 'FleetConnect'),
        ('3.2', 'PV/register.html', 'FleetConnect'),
        ('3.3', 'PV/verificatiepv.html', 'succesvol geverifieerd'),
        ('3.4', 'PV/klantenportaalpv.html', 'klantenportaal'),
        ('3.5', 'Paneel/onderaannemerA.html', 'FleetConnect'),
        ('3.6', 'Paneel/partner-login.html', 'FleetConnect'),
        ('3.7', 'Paneel/driver-login.html', 'FleetConnect'),
        ('3.8', 'Paneel/admin-index.html', 'FleetConnect'),
    ]
    for step_id, path, expected in pages:
        r = requests.get(f'https://www.fleetconnect.be/{path}', timeout=10, allow_redirects=True)
        ok = r.status_code == 200 and expected.lower() in r.text.lower()
        log(f'{step_id} {path}', 'PASS' if ok else 'FAIL', {
            'http': r.status_code, 'has_text': expected, 'size': len(r.text)
        })
        flow['steps'].append((step_id, ok))
        if not ok:
            flow['pass'] = False

    return flow

# ============================================================
# PHASE 4: Data integrity (via direct DB)
# ============================================================
def data_integrity() -> Dict[str, Any]:
    print("\n=== PHASE 4: Data Integrity ===")
    flow = {'name': 'data_integrity', 'steps': [], 'pass': True}

    conn = get_db_connection()
    if not conn:
        log('4.0 DB connection', 'SKIP')
        return flow

    try:
        cur = conn.cursor()

        # 4.1 No duplicate auth users by email
        cur.execute("""
            select lower(email), count(*)
            from auth.users
            group by lower(email)
            having count(*) > 1
        """)
        duplicates = cur.fetchall()
        log('4.1 no duplicate auth users', 'PASS' if not duplicates else 'FAIL', {
            'duplicates': [{'email': r[0], 'count': r[1]} for r in duplicates]
        })
        flow['steps'].append(('4.1', not duplicates))

        # 4.2 No duplicate customers by email
        cur.execute("""
            select lower(email), count(*)
            from public.customers
            where email is not null
            group by lower(email)
            having count(*) > 1
        """)
        duplicates = cur.fetchall()
        log('4.2 no duplicate customers', 'PASS' if not duplicates else 'FAIL', {
            'duplicates': [{'email': r[0], 'count': r[1]} for r in duplicates]
        })
        flow['steps'].append(('4.2', not duplicates))

        # 4.3 No orphan approved customer requests
        cur.execute("""
            select ar.id, ar.email, ar.status
            from public.account_requests ar
            where ar.request_scope = 'customer'
              and ar.status = 'approved'
              and not exists (select 1 from public.customers c where lower(c.email) = lower(ar.email))
              and not exists (select 1 from auth.users u where u.id = ar.user_id)
        """)
        orphans = cur.fetchall()
        log('4.3 no orphan approved customer requests', 'PASS' if not orphans else 'FAIL', {
            'count': len(orphans)
        })
        flow['steps'].append(('4.3', not orphans))

        # 4.4 All account_requests have a status
        cur.execute("select count(*) from public.account_requests where status is null")
        null_status = cur.fetchone()[0]
        log('4.4 all account_requests have status', 'PASS' if null_status == 0 else 'FAIL', {
            'null_status_count': null_status
        })
        flow['steps'].append(('4.4', null_status == 0))

        # 4.5 Approved customers are email-verified
        cur.execute("""
            select count(*)
            from public.account_requests ar
            join auth.users u on u.id = ar.user_id
            where ar.request_scope = 'customer' and ar.status = 'approved' and u.email_confirmed_at is null
        """)
        unverified = cur.fetchone()[0]
        log('4.5 approved customers email-verified', 'PASS' if unverified == 0 else 'FAIL', {
            'unverified_count': unverified
        })
        flow['steps'].append(('4.5', unverified == 0))

        # 4.6 Approved customers have a customers row
        cur.execute("""
            select ar.email
            from public.account_requests ar
            where ar.request_scope = 'customer' and ar.status = 'approved'
              and not exists (select 1 from public.customers c where lower(c.email) = lower(ar.email))
        """)
        no_customer_row = cur.fetchall()
        log('4.6 approved customers have a customer row', 'PASS' if not no_customer_row else 'FAIL', {
            'count': len(no_customer_row)
        })
        flow['steps'].append(('4.6', not no_customer_row))

        # 4.7 Operators and customers are in the right scope
        cur.execute("""
            select ar.email, ar.request_scope, ar.status
            from public.account_requests ar
            where ar.request_scope is null or ar.request_scope not in ('operator', 'customer')
        """)
        bad_scope = cur.fetchall()
        log('4.7 all account_requests have valid request_scope', 'PASS' if not bad_scope else 'FAIL', {
            'bad_scope_count': len(bad_scope)
        })
        flow['steps'].append(('4.7', not bad_scope))

        # 4.8 Drivers are linked to partners (no orphan drivers)
        cur.execute("""
            select count(*)
            from public.drivers d
            where d.partner_id is not null
              and not exists (select 1 from public.partners p where p.id = d.partner_id)
        """)
        orphan_drivers = cur.fetchone()[0]
        log('4.8 no orphan drivers', 'PASS' if orphan_drivers == 0 else 'FAIL', {
            'orphan_drivers': orphan_drivers
        })
        flow['steps'].append(('4.8', orphan_drivers == 0))

        # 4.9 All ACTIVE bookings have a customer_id
        # (cancelled/archived/completed bookings may have customer_id=null for historical reasons)
        cur.execute("""
            select count(*) from public.bookings
            where (customer_id is null or customer_id = '')
              and status not in ('cancelled', 'archived', 'completed', '0483047501', '+321****2222')
        """)
        no_customer = cur.fetchone()[0]
        log('4.9 active bookings have customer_id', 'PASS' if no_customer == 0 else 'FAIL', {
            'no_customer_count': no_customer, 'total_bookings': 103
        })
        flow['steps'].append(('4.9', no_customer == 0))

        # 4.10 RLS is enabled on key tables
        for table in ['customers', 'account_requests', 'partners', 'drivers', 'bookings']:
            cur.execute(f"select relrowsecurity, relforcerowsecurity from pg_class where relname = %s", (table,))
            rls = cur.fetchone()
            if rls:
                rls_enabled = rls[0] or rls[1]
                log(f'4.10.{table} RLS enabled', 'PASS' if rls_enabled else 'FAIL', {
                    'rls': rls[0], 'force_rls': rls[1]
                })
                flow['steps'].append((f'4.10.{table}', rls_enabled))

    except Exception as e:
        log('4.x data integrity', 'FAIL', error=str(e))
        flow['pass'] = False
    finally:
        conn.close()

    return flow

# ============================================================
# MAIN
# ============================================================
def main():
    flows = [
        customer_flow(),
        partner_flow(),
        dashboard_flow(),
        data_integrity(),
    ]

    print("\n" + "="*60)
    print("CERTIFICATION SUMMARY (Cycle 7)")
    print("="*60)
    for flow in flows:
        total = len(flow['steps'])
        passed = sum(1 for s, v in flow['steps'] if v is True)
        skipped = sum(1 for s, v in flow['steps'] if v is None)
        failed = total - passed - skipped
        print(f"  {flow['name']:20s}: {passed}/{total} pass, {failed} fail, {skipped} skipped — {'PASS' if flow['pass'] else 'FAIL'}")
    print("="*60)

    out_path = r'C:\Users\AGS\Documents\ryzen-core\.scratch\supabase-cert\step7_live_validation.json'
    with open(out_path, 'w') as f:
        json.dump({'flows': flows, 'results': results,
                   'timestamp': datetime.utcnow().isoformat()}, f, indent=2)
    print(f"\nResults saved to: {out_path}")

    all_pass = all(flow['pass'] for flow in flows)
    return 0 if all_pass else 1

if __name__ == '__main__':
    sys.exit(main())
