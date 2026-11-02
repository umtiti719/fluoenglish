# Supabase e-posta şablonları (Türkçe)

Supabase → **Authentication → Emails → Templates**. Her şablon için sekmeyi seç, **Subject** ve **Body** (Source) alanlarını aşağıdakilerle değiştir, **Save**.
Kaynak dosyalar bu klasörde (`*.html`).

## Confirm signup

**Subject:** `Fluo hesabını onayla`

**Body:** `belgeler/eposta-sablonlari/{f}.html`

## Reset Password

**Subject:** `Fluo şifreni yenile`

**Body:** `belgeler/eposta-sablonlari/{f}.html`

## Magic Link

**Subject:** `Fluo giriş bağlantın`

**Body:** `belgeler/eposta-sablonlari/{f}.html`

## Change Email Address

**Subject:** `Fluo e-posta adresi değişikliğini onayla`

**Body:** `belgeler/eposta-sablonlari/{f}.html`

## Invite user

**Subject:** `Fluo'ya davet edildin`

**Body:** `belgeler/eposta-sablonlari/{f}.html`

## Reauthentication

**Subject:** `Fluo doğrulama kodun`

**Body:**

```html
<div style="font-family:Arial,Helvetica,sans-serif;padding:24px"><h2>Doğrulama kodun</h2><p>İşlemi onaylamak için bu kodu gir:</p><p style="font-size:26px;letter-spacing:6px;font-weight:700">{{ .Token }}</p><p style="color:#6B7080">Bu isteği sen yapmadıysan görmezden gel.</p></div>
```
