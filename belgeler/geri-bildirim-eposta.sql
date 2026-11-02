-- Fluo · "Bize yaz" / "Bildir" ile gelen her geri bildirimi iletisim@fluo-english.com adresine e-posta olarak gönderir.
-- Gönderim Resend ile yapılır; API anahtarı kodda değil, Supabase Vault'ta (şifreli kasa) durur.
--
-- KURULUM (Supabase → SQL Editor):
--   1) Önce TEK BAŞINA şunu çalıştır (re_... yerine Resend'den yeni aldığın anahtarı yapıştır; anahtarı kimseyle paylaşma):
--        select vault.create_secret('re_BURAYA_ANAHTAR', 'resend_api_key');
--   2) Sonra bu dosyanın tamamını çalıştır.
--   3) Denemek için sitede "Bize yaz" formundan bir mesaj gönder.
--
-- Not: Gönderim arka planda yapılır (pg_net); e-posta gitmese bile mesaj veritabanına kaydedilir.
-- Kötüye kullanıma karşı: son 1 saatte 30'dan fazla mesaj gelirse fazlası için e-posta gönderilmez (mesajlar yine kaydedilir).

create extension if not exists pg_net with schema extensions;

create or replace function public.feedback_eposta()
returns trigger
language plpgsql
security definer
set search_path = public, extensions, vault, net
as $$
declare
  anahtar  text;
  tur      text;
  kullanici text;
  son_saat int;
  metin    text;
begin
  select count(*) into son_saat from public.feedback where created_at > now() - interval '1 hour';
  if son_saat > 30 then
    return new;
  end if;

  select decrypted_secret into anahtar from vault.decrypted_secrets where name = 'resend_api_key' limit 1;
  if anahtar is null then
    return new;
  end if;

  tur := case new.kind
    when 'sorun'  then 'Sorun bildirimi'
    when 'icerik' then 'İçerik hatası'
    when 'oneri'  then 'Öneri'
    when 'soru'   then 'Soru'
    else new.kind end;

  if new.user_id is not null then
    select email into kullanici from auth.users where id = new.user_id;
  end if;

  metin := 'Fluo''ya yeni bir mesaj geldi.' || E'\n\n'
    || 'Tür: ' || tur || E'\n'
    || 'Tarih: ' || to_char(new.created_at at time zone 'Europe/Istanbul', 'DD.MM.YYYY HH24:MI') || E'\n'
    || 'Hesap: ' || coalesce(kullanici, 'giriş yapılmamış') || E'\n'
    || 'Yanıt adresi: ' || coalesce(new.email, kullanici, 'yazılmamış') || E'\n\n'
    || '--- Mesaj ---' || E'\n' || new.message || E'\n\n'
    || '--- Ayrıntılar ---' || E'\n' || jsonb_pretty(new.context) || E'\n\n'
    || 'Kayıt no: ' || new.id;

  perform net.http_post(
    url     := 'https://api.resend.com/emails',
    headers := jsonb_build_object('Authorization', 'Bearer ' || anahtar, 'Content-Type', 'application/json'),
    body    := jsonb_strip_nulls(jsonb_build_object(
      'from',     'Fluo <noreply@fluo-english.com>',
      'to',       jsonb_build_array('iletisim@fluo-english.com'),
      'subject',  'Fluo · ' || tur || ': ' || left(regexp_replace(new.message, '\s+', ' ', 'g'), 60),
      'text',     metin,
      'reply_to', coalesce(new.email, kullanici)
    ))
  );
  return new;
exception when others then
  -- E-posta gönderilemese bile mesajın kaydı bozulmasın
  return new;
end;
$$;

revoke all on function public.feedback_eposta() from public, anon, authenticated;

drop trigger if exists feedback_eposta on public.feedback;
create trigger feedback_eposta
  after insert on public.feedback
  for each row execute function public.feedback_eposta();
