-- Fluo · Supabase veritabanı kurulumu
-- Supabase panelinde: SQL Editor → New query → bu dosyanın tamamını yapıştır → Run

-- Her kullanıcı için tek satır: tüm ilerleme (öğrenilen kelimeler, Defterim, tekrar takvimi, seviye, ayarlar) JSON olarak
create table if not exists public.progress (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  data       jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  constraint progress_boyut check (pg_column_size(data) < 2000000)
);

-- Satır güvenliği: herkes yalnızca kendi satırını görebilir ve değiştirebilir
alter table public.progress enable row level security;

drop policy if exists "kendi ilerlemesini okur" on public.progress;
create policy "kendi ilerlemesini okur" on public.progress
  for select to authenticated using ((select auth.uid()) = user_id);

drop policy if exists "kendi ilerlemesini ekler" on public.progress;
create policy "kendi ilerlemesini ekler" on public.progress
  for insert to authenticated with check ((select auth.uid()) = user_id);

drop policy if exists "kendi ilerlemesini günceller" on public.progress;
create policy "kendi ilerlemesini günceller" on public.progress
  for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
