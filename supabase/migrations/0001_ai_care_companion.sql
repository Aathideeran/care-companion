-- AI Care Companion schema blueprint (apply only after connecting Supabase).
create extension if not exists pgcrypto;
create type public.app_role as enum ('patient','doctor','admin');
create type public.plan_status as enum ('draft','pending_approval','active','completed','archived');
create type public.appointment_status as enum ('requested','confirmed','completed','cancelled','no_show');

create table if not exists public.profiles (id uuid primary key references auth.users(id) on delete cascade, full_name text not null, phone text, role public.app_role not null default 'patient', preferred_language text not null default 'en', created_at timestamptz not null default now(), updated_at timestamptz not null default now());
create table if not exists public.doctor_profiles (user_id uuid primary key references public.profiles(id) on delete cascade, registration_number text not null unique, specialization text not null, clinic text, experience_years integer, is_verified boolean not null default false, created_at timestamptz not null default now());
create table if not exists public.patient_doctor_relationships (id uuid primary key default gen_random_uuid(), patient_id uuid not null references public.profiles(id) on delete cascade, doctor_id uuid not null references public.profiles(id) on delete cascade, status text not null default 'active', created_at timestamptz not null default now(), unique(patient_id, doctor_id));
create table if not exists public.treatment_plans (id uuid primary key default gen_random_uuid(), patient_id uuid not null references public.profiles(id) on delete cascade, doctor_id uuid not null references public.profiles(id), title text not null, clinical_notes text, follow_up_interval_days integer, start_date date not null, end_date date, status public.plan_status not null default 'draft', approved_at timestamptz, approved_by uuid references public.profiles(id), created_at timestamptz not null default now(), updated_at timestamptz not null default now());
create table if not exists public.medications (id uuid primary key default gen_random_uuid(), treatment_plan_id uuid not null references public.treatment_plans(id) on delete cascade, name text not null, instructions text not null, schedule text not null, created_at timestamptz not null default now());
create table if not exists public.symptom_entries (id uuid primary key default gen_random_uuid(), patient_id uuid not null references public.profiles(id) on delete cascade, symptom text not null, severity integer not null check (severity between 1 and 10), duration_minutes integer, notes text, created_at timestamptz not null default now());
create table if not exists public.health_measurements (id uuid primary key default gen_random_uuid(), patient_id uuid not null references public.profiles(id) on delete cascade, measurement_type text not null, value numeric not null, unit text not null, confirmed boolean not null default false, measured_at timestamptz not null default now());
create table if not exists public.appointments (id uuid primary key default gen_random_uuid(), patient_id uuid not null references public.profiles(id) on delete cascade, doctor_id uuid not null references public.profiles(id), starts_at timestamptz not null, ends_at timestamptz not null, status public.appointment_status not null default 'requested', notes text, created_at timestamptz not null default now(), constraint appointments_valid_window check (ends_at > starts_at));
create table if not exists public.reminders (id uuid primary key default gen_random_uuid(), patient_id uuid not null references public.profiles(id) on delete cascade, kind text not null, title text not null, due_at timestamptz not null, status text not null default 'pending', completed_at timestamptz, created_at timestamptz not null default now());
create table if not exists public.audit_logs (id uuid primary key default gen_random_uuid(), actor_id uuid references public.profiles(id), action text not null, entity_type text not null, entity_id uuid, metadata jsonb not null default '{}'::jsonb, created_at timestamptz not null default now());

create index if not exists symptom_entries_patient_created_idx on public.symptom_entries(patient_id, created_at desc);
create index if not exists health_measurements_patient_type_idx on public.health_measurements(patient_id, measurement_type, measured_at desc);
create index if not exists appointments_doctor_time_idx on public.appointments(doctor_id, starts_at);

alter table public.profiles enable row level security;

create policy "profiles_select_own" on public.profiles for select to authenticated using ((select auth.uid()) = id);
create policy "profiles_insert_own" on public.profiles for insert to authenticated with check ((select auth.uid()) = id);
create policy "profiles_update_own" on public.profiles for update to authenticated using ((select auth.uid()) = id) with check ((select auth.uid()) = id);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name, role, preferred_language)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'full_name', 'New member'), 'patient', coalesce(new.raw_user_meta_data ->> 'preferred_language', 'en'))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();

alter table public.doctor_profiles enable row level security;
alter table public.patient_doctor_relationships enable row level security;
alter table public.treatment_plans enable row level security;
alter table public.medications enable row level security;
alter table public.symptom_entries enable row level security;
alter table public.health_measurements enable row level security;
alter table public.appointments enable row level security;
alter table public.reminders enable row level security;
alter table public.audit_logs enable row level security;

-- Production policy work should be completed with the project's Supabase auth helper functions.
-- Never use user-editable raw_user_meta_data for authorization. Role changes belong to an audited admin workflow.
