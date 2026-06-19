-- One-time go-live cleanup for FleetConnect live validation.
-- Apply manually in Supabase SQL Editor after confirming the target project.
--
-- Keeps:
-- - auth/users with email admin@ryzen.be
-- - all partners marked is_hoofd = true
-- - Ryzen sub-partner rows
--
-- Removes:
-- - historical rides and ride-dependent operational records
-- - historical drivers
-- - historical customer records except admin@ryzen.be if present
-- - archived/pending/handled account requests except admin@ryzen.be
-- - auth users not linked to the kept head account or kept partners

begin;

create temp table fc_cleanup_keep_partners on commit drop as
select id, user_id
from public.partners
where coalesce(is_hoofd, false) = true
   or lower(coalesce(name, '')) like '%ryzen%'
   or lower(coalesce(email, '')) = 'admin@ryzen.be'
   or lower(coalesce(contact, '')) like '%ryzen%';

create temp table fc_cleanup_keep_users on commit drop as
select id
from auth.users
where lower(email) = 'admin@ryzen.be'
union
select user_id
from fc_cleanup_keep_partners
where user_id is not null;

do $$
begin
  if to_regclass('public.ride_reviews') is not null then
    delete from public.ride_reviews;
  end if;
  if to_regclass('public.refunds') is not null then
    delete from public.refunds;
  end if;
  if to_regclass('public.payments') is not null then
    delete from public.payments;
  end if;
  if to_regclass('public.invoices') is not null then
    delete from public.invoices;
  end if;
  if to_regclass('public.settlements') is not null then
    delete from public.settlements;
  end if;
  if to_regclass('public.transaction_ledger') is not null then
    delete from public.transaction_ledger;
  end if;
  if to_regclass('public.communication_logs') is not null then
    delete from public.communication_logs;
  end if;
end $$;

delete from public.bookings;
delete from public.drivers;

delete from public.account_requests
where lower(coalesce(email, '')) <> 'admin@ryzen.be';

delete from public.customers
where lower(coalesce(email, '')) <> 'admin@ryzen.be';

delete from public.partners
where id not in (select id from fc_cleanup_keep_partners);

delete from auth.users
where id not in (select id from fc_cleanup_keep_users);

do $$
begin
  raise notice 'Remaining bookings: %', (select count(*) from public.bookings);
  raise notice 'Remaining drivers: %', (select count(*) from public.drivers);
  raise notice 'Remaining account requests: %', (select count(*) from public.account_requests);
  raise notice 'Remaining customers: %', (select count(*) from public.customers);
  raise notice 'Remaining partners: %', (select count(*) from public.partners);
  raise notice 'Remaining auth users: %', (select count(*) from auth.users);
end $$;

commit;
