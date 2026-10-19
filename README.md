# Kelime Atölyesi

Türkçe arayüzlü, genel İngilizce öğrenme uygulaması.

## Bölümler
- **Ana Sayfa:** Günün kelimesi, ilerleme özeti, günlük çalışma serisi ve "kaldığın yerden devam et".
- **Kelime Öğren:** 11 konu destesi (132 kelime). Çevrilebilen kartlar, örnek cümleler ve Türkçeleri, telaffuz, "Biliyorum / Tekrar et" takibi, desteyle yarışma.
- **Kelime Yarışması:** 4 seviye (A1–A2, B1, B2, C1–C2), süreli 10 soruluk turlar, hız bonusu, seri çarpanı, 50:50 ve Pas jokerleri, rekorlar.
- **Dil Bilgisi:** A1'den B2'ye 23 konu. Her konuda Türkçe anlatım, kullanım alanları, cümle yapısı, özet tablo, sesli örnek cümleler, ipucu kelimeler, sık yapılan hatalar ve alıştırma.
- **Metin Çevirisi:** Seviyeye göre metinler, kelimeye dokununca anlamı, çeviri puanlama.

İlerleme kullanılan tarayıcıda saklanır.

## Dosyalar
- `index.html` — çalışan uygulama (tek dosya, tarayıcıda açılır). **Doğrudan düzenleme; `src/` içinden üretilir.**
- `src/shell.html` — sayfa iskeleti
- `src/style.css` — tasarım
- `src/app.js` — uygulama mantığı
- `src/data-learn.js` — kelime desteleri
- `src/data-grammar.js` — dil bilgisi konuları ve alıştırmalar
- `src/data-quiz.js` — yarışma kelimeleri, çeviri metinleri ve metin sözlüğü
- `build.py` — `src/` dosyalarını `index.html` olarak birleştirir: `python3 build.py`
- `kelime_atolyesi.xlsx` — ilk sürümdeki kelime ve metin listesi

## Not
Yapay zekâ ile çeviri değerlendirmesi yalnızca claude.ai üzerinde yayınlanan sürümde çalışır; dosya doğrudan açıldığında anahtar kelimeye dayalı puanlama kullanılır.
