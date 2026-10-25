# Fluo sözlüğü — kaynaklar ve lisanslar

`sozluk.js` dosyası iki katmandan üretilir (`python3 -I araclar/sozluk_yap.py <eng-tur.tei>`):

1. **Fluo çekirdek sözlüğü** — `sozluk/cekirdek/*.tsv`. En sık kullanılan İngilizce kelimelerin güncel Türkçe karşılıkları; Fluo için özgün olarak yazıldı. Kelimelerin seçiminde sıklık sırası için [wordfreq](https://github.com/rspeer/wordfreq) (Apache-2.0 kod; veriler CC BY-SA 4.0), kök bulma için [lemminflect](https://github.com/bjascob/LemmInflect) (MIT) ve süzme için [wordlist-english / SCOWL](https://github.com/jacobvosmaer/wordlist-english) (MIT) kullanıldı; bu araçların verileri dağıtılmaz.

2. **FreeDict English–Turkish (eng-tur)** — çekirdekte olmayan kelimeler için temizlenmiş yedek.
   Kaynak: https://github.com/freedict/fd-dictionaries/tree/master/eng-tur
   Telif hakkı © 1999–2017 FreeDict katkıcıları. **GNU General Public License sürüm 2 veya sonrası (GPL-2.0-or-later)** ile lisanslıdır.
   Bu katmandan türetilen maddeler `sozluk.js` içinde `|d` ile işaretlidir ve aynı lisansla dağıtılır. Temizleme betiği: `araclar/sozluk_yap.py`.
