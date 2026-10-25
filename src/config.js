/* ================= AYARLAR (dışa bağlantılar) =================
   Supabase projesinin adresi ve "anon public" anahtarı. Bu anahtar herkese açık olacak şekilde tasarlanmıştır;
   verileri veritabanındaki satır güvenliği kuralları (RLS) korur. Boş kalırsa üye girişi kapalı çalışır.
   Kurulum: belgeler/uyelik-kurulumu.md */
const FLUO_CONFIG={
  supabaseUrl:"https://wppbmuxkwijwtmvbkhdp.supabase.co",
  supabaseAnonKey:"sb_publishable_xDhvsAqW753Wm7SqB2w8Yw_F-n9vIk-",
  // Sitede yapay zekâ çevirisi: Supabase'de "ceviri" fonksiyonu ve ANTHROPIC_API_KEY kurulunca true yapılacak
  // (kurulum: belgeler/yapay-zeka.sql + supabase/functions/ceviri). Kapalıyken sözlük çevirisi çalışır.
  aiOn:false
};

/* Üyelik durumu (auth.js doldurur; diğer bölümler okur) */
const AUTH={
  configured:!!(FLUO_CONFIG.supabaseUrl&&FLUO_CONFIG.supabaseAnonKey),
  on:false,        // giriş bu ortamda gerçekten çalışıyor mu (Claude önizlemesinde ve dosyadan açılınca kapalı)
  ready:false,     // oturum durumu öğrenildi mi
  user:null,       // giriş yapan kullanıcı
  sb:null,         // Supabase istemcisi
  mode:"login",    // giriş ekranının hâli: login | signup | magic | forgot | recover | sent
  sentTo:"",sentKind:"",
  msg:null,        // {t:"err"|"ok", s:"metin"}
  busy:false,
  sync:{state:"idle",at:null,dirty:false,timer:null,pulledAt:0}
};
const signedIn=()=>!!AUTH.user;
