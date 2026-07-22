-- Execute este arquivo no SQL Editor do projeto Supabase "Sistema Contabilidade".
create extension if not exists "pgcrypto";

create type public.company_size as enum ('MEI', 'ME', 'EPP');
create type public.company_form as enum ('EI', 'SLU', 'LTDA', 'SOCIEDADE_SIMPLES');
create type public.company_status as enum ('REGULAR', 'ATENCAO', 'PENDENTE', 'IRREGULAR');
create type public.obligation_status as enum ('ABERTA', 'EM_REVISAO', 'CONCLUIDA', 'ATRASADA');
create type public.priority_level as enum ('INFORMATIVA', 'MEDIA', 'ALTA', 'CRITICA');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  email text not null,
  role text not null check (role in ('ADMIN', 'CONTADOR', 'COLABORADOR', 'EMPRESARIO')) default 'EMPRESARIO',
  created_at timestamptz not null default now()
);

create table public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  owner_id uuid not null references public.profiles(id),
  created_at timestamptz not null default now()
);

create table public.organization_members (
  organization_id uuid not null references public.organizations(id) on delete cascade,
  profile_id uuid not null references public.profiles(id) on delete cascade,
  role text not null check (role in ('ADMIN', 'CONTADOR', 'COLABORADOR')),
  primary key (organization_id, profile_id)
);

create table public.companies (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  legal_name text not null,
  trade_name text,
  cnpj text not null unique,
  size public.company_size not null,
  legal_form public.company_form,
  tax_regime text not null default 'SIMPLES_NACIONAL',
  state_registration text,
  municipal_registration text,
  city text,
  state text,
  status public.company_status not null default 'ATENCAO',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.obligations (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  title text not null,
  description text,
  category text not null,
  due_date date not null,
  status public.obligation_status not null default 'ABERTA',
  priority public.priority_level not null default 'MEDIA',
  responsible_id uuid references public.profiles(id),
  completed_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.documents (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  obligation_id uuid references public.obligations(id) on delete set null,
  file_name text not null,
  storage_path text not null,
  document_type text not null,
  competence date,
  uploaded_by uuid references public.profiles(id),
  created_at timestamptz not null default now()
);

create table public.audit_logs (
  id bigint generated always as identity primary key,
  organization_id uuid not null references public.organizations(id) on delete cascade,
  actor_id uuid references public.profiles(id),
  entity_type text not null,
  entity_id uuid,
  action text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

-- Cria o perfil e a associação inicial sem expor permissões administrativas ao navegador.
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name, email)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1)), new.email);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

create or replace function public.add_organization_owner()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.organization_members (organization_id, profile_id, role)
  values (new.id, new.owner_id, 'ADMIN');
  return new;
end;
$$;

create trigger on_organization_created
  after insert on public.organizations
  for each row execute procedure public.add_organization_owner();

alter table public.profiles enable row level security;
alter table public.organizations enable row level security;
alter table public.organization_members enable row level security;
alter table public.companies enable row level security;
alter table public.obligations enable row level security;
alter table public.documents enable row level security;
alter table public.audit_logs enable row level security;

create or replace function public.is_org_member(target_org uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.organization_members where organization_id = target_org and profile_id = auth.uid())
  or exists (select 1 from public.organizations where id = target_org and owner_id = auth.uid());
$$;

create policy "Profiles are visible to the signed-in user" on public.profiles for select using (id = auth.uid());
create policy "Users can update their profile" on public.profiles for update using (id = auth.uid()) with check (id = auth.uid());
create policy "Members can view their organizations" on public.organizations for select using (public.is_org_member(id));
create policy "Users can create their organization" on public.organizations for insert with check (owner_id = auth.uid());
create policy "Members can view membership" on public.organization_members for select using (public.is_org_member(organization_id));
create policy "Members can manage companies" on public.companies for all using (public.is_org_member(organization_id)) with check (public.is_org_member(organization_id));
create policy "Members can manage obligations" on public.obligations for all using (exists (select 1 from public.companies c where c.id = company_id and public.is_org_member(c.organization_id))) with check (exists (select 1 from public.companies c where c.id = company_id and public.is_org_member(c.organization_id)));
create policy "Members can manage documents" on public.documents for all using (exists (select 1 from public.companies c where c.id = company_id and public.is_org_member(c.organization_id))) with check (exists (select 1 from public.companies c where c.id = company_id and public.is_org_member(c.organization_id)));
create policy "Members can view audit log" on public.audit_logs for select using (public.is_org_member(organization_id));
