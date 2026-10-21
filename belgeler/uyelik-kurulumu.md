# Üyelik kurulumu (Supabase + GitHub Pages)

Uygulamadaki kod hazır. Üye girişinin çalışması için aşağıdaki hesap ve ayar adımlarını senin yapman gerekiyor (hesap açmak ve şifre girmek senin elinde olmalı). Sonunda bana iki bilgi vereceksin: **Project URL** ve **Publishable (anon) key**.

## 1. GitHub Pages (sitenin adresi)
1. GitHub'da depoyu aç → **Settings → General → Repository name** alanına `fluoenglish` yaz → **Rename**.
2. **Settings → Pages** → *Source*: **Deploy from a branch** → Branch: **main**, klasör: **/(root)** → **Save**.
3. Birkaç dakika sonra site şu adreste açılır: `https://umtiti719.github.io/fluoenglish/`

## 2. Supabase projesi
1. supabase.com → GitHub hesabınla giriş → **New project**.
   - Name: `fluoenglish` · Region: **Central EU (Frankfurt)** (Türkiye'ye en yakın) · güçlü bir veritabanı şifresi seç ve sakla.
2. Proje açılınca **SQL Editor → New query** → `belgeler/supabase.sql` dosyasının tamamını yapıştır → **Run**.
3. **Project Settings → API (API Keys)** sayfasından şunları kopyala ve bana gönder:
   - **Project URL** (`https://xxxx.supabase.co`)
   - **Publishable key** (`sb_publishable_...`) ya da eski adıyla **anon public** anahtarı
   - ⚠️ **secret / service_role** anahtarını asla paylaşma ve hiçbir yere yapıştırma.

## 3. Giriş adresleri
**Authentication → URL Configuration**
- **Site URL:** `https://umtiti719.github.io/fluoenglish/`
- **Redirect URLs:** aynı adresi ekle (ileride alan adı alınca `https://fluoenglish.com/` de eklenecek).

## 4. E-posta + şifre ve e-posta bağlantısı
**Authentication → Sign In / Providers → Email**: açık olsun, *Confirm email* açık kalsın.
- Not: Supabase'in hazır e-posta gönderimi saatte birkaç e-postayla sınırlıdır; deneme için yeterli. Yayına çıkmadan önce `fluoenglish.com` alan adıyla kendi e-posta hizmetimizi (SMTP) bağlayacağız; e-posta şablonlarını da Türkçeleştireceğiz.

## 5. Google ile giriş
1. console.cloud.google.com → yeni proje: `Fluo`.
2. **Google Auth Platform → Branding**: uygulama adı *Fluo*, destek e-postası olarak kendi adresin.
3. **Audience**: *External*.
4. **Clients → Create client** → *Web application*
   - **Authorized JavaScript origins:** `https://umtiti719.github.io`
   - **Authorized redirect URIs:** `https://xxxx.supabase.co/auth/v1/callback` (Supabase'deki Google ayar sayfasında bu adres hazır yazılıdır, oradan kopyala)
5. Çıkan **Client ID** ve **Client secret**'ı Supabase'de **Authentication → Sign In / Providers → Google** sayfasına yapıştır → **Enable** → **Save**.
   - Client secret'ı bana gönderme; doğrudan Supabase'e yapıştırman yeterli.

## Uygulamada nasıl çalışıyor
- Anahtarlar `src/config.js` içine yazılır; boşken üye girişi kapalıdır ve uygulama eskisi gibi çalışır.
- Claude önizlemesinde giriş çalışmaz (orada bilgi notu görünür); yalnızca sitede çalışır.
- Giriş yapınca bu cihazdaki ilerleme hesaba eklenir; başka cihazda giriş yapınca ilerlemeler birleşir.
- Çıkış yapınca ilerleme cihazdan silinir, hesapta kalır.
- Giriş yapanlara kişisel karşılama ("İyi akşamlar Ali, bugün ne çalışalım?") ve günlük seri gösterilir.
- Supabase istemcisi `vendor/supabase.js` (supabase-js 2.117.1, MIT lisansı) olarak depoda tutulur; dışarıdan yüklenmez.
