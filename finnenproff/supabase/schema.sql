create extension if not exists "pgcrypto";
create table customers(id uuid primary key default gen_random_uuid(),name text not null,email text not null,phone text not null,marketing_consent boolean not null default false,created_at timestamptz default now());
create table companies(id uuid primary key default gen_random_uuid(),name text not null,org_number text unique not null,contact_name text,email text,phone text,website_url text,services text[] not null default '{}',coverage text,description text,interests text,status text not null default 'pending' check(status in('pending','approved','active','inactive','rejected')),price_per_request_nok numeric,created_at timestamptz default now());
create table requests(id uuid primary key default gen_random_uuid(),customer_id uuid references customers(id),company_id uuid references companies(id),service text not null,category text,description text not null,postal_code text,city text,address text,timing text,share_consent_at timestamptz not null,status text not null default 'new' check(status in('new','reviewing','awaiting_company','assigned','contacted','completed','rejected')),created_at timestamptz default now());
create table request_notes(id uuid primary key default gen_random_uuid(),request_id uuid references requests(id) on delete cascade,note text not null,author uuid,created_at timestamptz default now());
create table invoices(id uuid primary key default gen_random_uuid(),company_id uuid references companies(id),request_id uuid references requests(id),amount_nok numeric not null,status text default 'outstanding' check(status in('outstanding','paid')),created_at timestamptz default now());
-- RLS on, no public policies: browser clients can read/write nothing. All access goes through server routes (service role) behind admin-role middleware.
alter table customers enable row level security; alter table companies enable row level security; alter table requests enable row level security; alter table request_notes enable row level security; alter table invoices enable row level security;
-- Make a user admin: update auth.users set raw_app_meta_data = raw_app_meta_data || '{"role":"admin"}' where email='you@example.no';
-- v2 additions
alter table requests add column consent_version text;
create table request_events(id uuid primary key default gen_random_uuid(),request_id uuid references requests(id) on delete cascade,kind text not null,detail text,actor text,created_at timestamptz default now());
create table messages(id uuid primary key default gen_random_uuid(),name text not null,email text not null,message text not null,created_at timestamptz default now());
alter table request_events enable row level security; alter table messages enable row level security;
create index requests_status_created on requests(status,created_at desc);
create index requests_postal on requests(postal_code);
create index requests_company on requests(company_id);
create index companies_status on companies(status);
-- v3 additions
alter table requests add column shared_at timestamptz;
create index invoices_status on invoices(status);
-- v4: scale + integrity
alter table companies add column coverage_prefixes text[] not null default '{}';
create index companies_services_gin on companies using gin(services);
create index requests_created on requests(created_at desc);
create index customers_email on customers(email);
create table rate_limits(key text primary key,hits int not null,window_start timestamptz not null);
alter table rate_limits enable row level security;
create or replace function hit_rate_limit(p_key text,p_max int,p_window int) returns boolean language plpgsql security definer set search_path=public as $$
declare h int; begin
 insert into rate_limits(key,hits,window_start) values(p_key,1,now()) on conflict(key) do update set
  hits=case when rate_limits.window_start<now()-make_interval(secs=>p_window) then 1 else rate_limits.hits+1 end,
  window_start=case when rate_limits.window_start<now()-make_interval(secs=>p_window) then now() else rate_limits.window_start end
 returning hits into h; return h>p_max; end $$;
create or replace function submit_request(p jsonb) returns jsonb language plpgsql security definer set search_path=public as $$
declare cid uuid; rid uuid; m int; tok uuid; begin
 insert into customers(name,email,phone,marketing_consent) values(p->>'name',lower(p->>'email'),p->>'phone',coalesce((p->>'marketing')::boolean,false)) returning id into cid;
 insert into requests(customer_id,service,category,description,postal_code,city,address,timing,share_consent_at,consent_version)
  values(cid,p->>'service',p->>'category',p->>'description',p->>'postal',p->>'city',nullif(p->>'address',''),p->>'timing',now(),p->>'consent_version') returning id into rid;
 select count(*) into m from companies where status='active' and services @> array[p->>'service'];
 insert into request_events(request_id,kind,detail,actor) values(rid,'created','Submitted by customer','customer'),(rid,'matching',m||' active companies offer '||(p->>'service'),'system');
 select public_token into tok from requests where id=rid;
 return jsonb_build_object('id',rid,'token',tok); end $$;
revoke all on function hit_rate_limit(text,int,int) from public,anon,authenticated;
revoke all on function submit_request(jsonb) from public,anon,authenticated;
grant execute on function hit_rate_limit(text,int,int) to service_role;
grant execute on function submit_request(jsonb) to service_role;
create view finance_summary with (security_invoker=true) as select
 coalesce(sum(amount_nok) filter(where status='outstanding'),0) outstanding,
 coalesce(sum(amount_nok) filter(where status='paid' and date_trunc('month',created_at)=date_trunc('month',now())),0) paid_month,
 coalesce(sum(amount_nok) filter(where date_trunc('month',created_at)=date_trunc('month',now())),0) invoiced_month,
 count(*) accepted from invoices;
revoke all on finance_summary from anon,authenticated;
-- Housekeeping (schedule with pg_cron): delete from rate_limits where window_start<now()-interval '1 day';
-- v5: company dashboard + customer tracking
alter table requests add column company_response text check(company_response in ('accepted','declined'));
alter table requests add column company_responded_at timestamptz;
alter table requests add column public_token uuid not null default gen_random_uuid();
create unique index requests_public_token on requests(public_token);
create unique index invoices_one_per_request on invoices(request_id);
-- Company login: admin dashboard button creates the auth user with app_metadata {role:"company", company_id}.
-- v6: individual providers (workers), email retry outbox
alter table companies add column kind text not null default 'company' check(kind in('company','individual'));
alter table companies alter column org_number drop not null;
create table email_outbox(id uuid primary key default gen_random_uuid(),to_email text not null,subject text not null,body text not null,attempts int not null default 0,status text not null default 'pending' check(status in('pending','sent','failed')),last_error text,next_attempt_at timestamptz not null default now(),created_at timestamptz default now());
alter table email_outbox enable row level security;
create index outbox_due on email_outbox(next_attempt_at) where status='pending';
-- Housekeeping (pg_cron): delete from email_outbox where status<>'pending' and created_at<now()-interval '30 days';  (bodies contain personal data)
