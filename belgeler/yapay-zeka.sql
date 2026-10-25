-- Fluo · yapay zekâ çevirisi için günlük kullanım sayacı
-- Supabase panelinde: SQL Editor → New query → bu dosyanın tamamını yapıştır → Run

-- Kişi başı, gün başı istek sayısı (gün Türkiye saatine göre)
create table if not exists public.ai_usage (
  user_id uuid not null references auth.users(id) on delete cascade,
  day     date not null,
  n       int  not null default 0,
  primary key (user_id, day)
);
-- Tabloya doğrudan erişim yok (kural tanımlanmadı); yalnızca aşağıdaki fonksiyon yazar
alter table public.ai_usage enable row level security;

-- Sayacı bir artırır ve yeni değeri döndürür; sınır dolduysa -1 döner
create or replace function public.ai_kullan(sinir int)
returns int
language plpgsql
security definer
set search_path = ''
as $$
declare
  uid  uuid := auth.uid();
  gun  date := (now() at time zone 'Europe/Istanbul')::date;
  yeni int;
begin
  if uid is null then return -1; end if;
  insert into public.ai_usage (user_id, day, n) values (uid, gun, 1)
  on conflict (user_id, day) do update set n = public.ai_usage.n + 1
    where public.ai_usage.n < sinir
  returning n into yeni;
  return coalesce(yeni, -1);
end;
$$;

revoke all on function public.ai_kullan(int) from public, anon;
grant execute on function public.ai_kullan(int) to authenticated;
