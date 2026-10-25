-- Fluo · Destek mesajları tablosu
-- Supabase panelinde: SQL Editor → New query → bu dosyanın tamamını yapıştır → Run
-- Mesajları okumak için: Table Editor → feedback

create table if not exists public.feedback (
  id         bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  user_id    uuid default auth.uid() references auth.users(id) on delete set null,
  kind       text not null check (kind in ('sorun','icerik','oneri','soru')),
  message    text not null check (char_length(message) between 5 and 3000),
  email      text check (email is null or char_length(email) <= 200),
  context    jsonb not null default '{}'::jsonb check (pg_column_size(context) < 20000),
  status     text not null default 'yeni'
);

-- Herkes (giriş yapmış ya da misafir) mesaj gönderebilir; kimse okuyamaz, değiştiremez
grant insert on public.feedback to anon, authenticated;

alter table public.feedback enable row level security;

drop policy if exists "herkes mesaj gönderebilir" on public.feedback;
create policy "herkes mesaj gönderebilir" on public.feedback
  for insert to anon, authenticated
  with check (user_id is null or user_id = (select auth.uid()));
