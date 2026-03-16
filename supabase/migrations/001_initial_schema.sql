-- ================================================================
-- Silent Signal — Initial Schema
-- Run this in the Supabase SQL editor or via `supabase db push`
-- ================================================================

-- ── Profiles ─────────────────────────────────────────────────────
create table if not exists public.profiles (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade unique,
  display_name text,
  created_at  timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Users can view their own profile"
  on public.profiles for select
  using (auth.uid() = user_id);

create policy "Users can insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = user_id);

-- Automatically create profile on new user signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public
as $$
begin
  insert into public.profiles (user_id)
  values (new.id);
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- ── Contacts ──────────────────────────────────────────────────────
create table if not exists public.contacts (
  id            uuid primary key default gen_random_uuid(),
  owner_id      uuid not null references auth.users(id) on delete cascade,
  contact_email text not null,
  contact_name  text,
  created_at    timestamptz not null default now()
);

alter table public.contacts enable row level security;

create policy "Users can manage their own contacts"
  on public.contacts for all
  using (auth.uid() = owner_id)
  with check (auth.uid() = owner_id);


-- ── Signals ───────────────────────────────────────────────────────
create table if not exists public.signals (
  id              uuid primary key default gen_random_uuid(),
  sender_id       uuid not null references auth.users(id) on delete cascade,
  type            text not null check (type in ('danger', 'scared', 'distress', 'safe')),
  sent_at         timestamptz not null default now(),
  latitude        double precision,
  longitude       double precision,
  acknowledged_at timestamptz
);

alter table public.signals enable row level security;

-- Sender can insert and read their own signals
create policy "Senders can insert their own signals"
  on public.signals for insert
  with check (auth.uid() = sender_id);

create policy "Senders can read their own signals"
  on public.signals for select
  using (auth.uid() = sender_id);

-- Trusted contacts can read signals addressed to them
-- (a signal is "for" user X if X is listed as a contact of the sender)
create policy "Contacts can read signals sent to them"
  on public.signals for select
  using (
    exists (
      select 1
      from public.contacts c
      join auth.users u on u.email = c.contact_email
      where c.owner_id = signals.sender_id
        and u.id = auth.uid()
    )
  );

-- Contacts can acknowledge a signal
create policy "Contacts can acknowledge signals"
  on public.signals for update
  using (
    exists (
      select 1
      from public.contacts c
      join auth.users u on u.email = c.contact_email
      where c.owner_id = signals.sender_id
        and u.id = auth.uid()
    )
  );

-- Enable realtime for live receiver updates
alter publication supabase_realtime add table public.signals;
