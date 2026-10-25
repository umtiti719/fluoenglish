"""Fluo sözlüğünü üretir: sozluk.js (window.FLUO_DICT)
Kullanım: python3 -I araclar/sozluk_yap.py <eng-tur.tei yolu>

Katmanlar:
  1) Fluo çekirdek sözlüğü — sozluk/cekirdek/*.tsv (kelime<TAB>tür<TAB>anlamlar), Fluo için yazıldı.
  2) FreeDict eng-tur (GPL-2.0+) — çekirdekte olmayan kelimeler için temizlenmiş yedek.
     Kaynak: https://github.com/freedict/fd-dictionaries/tree/master/eng-tur
Çıktı biçimi: FLUO_DICT={v:sürüm, e:{kelime:"tür|anlamlar|kaynak(f/d)"}}"""
import sys, re, json, glob
import xml.etree.ElementTree as ET
from pathlib import Path

root = Path(__file__).resolve().parent.parent
T = '{http://www.tei-c.org/ns/1.0}'

core = {}
for f in sorted(glob.glob(str(root / 'sozluk' / 'cekirdek' / '*.tsv'))):
    for line in open(f, encoding='utf-8'):
        line = line.rstrip('\n')
        if not line or line.startswith('#'): continue
        parts = line.split('\t')
        if len(parts) < 3: continue
        w, pos, tr = parts[0].strip().lower(), parts[1].strip(), parts[2].strip()
        if w and tr and w not in core: core[w] = (pos, tr)

OLD = {'mamafih': 'bununla birlikte', 'muvaffakiyet': 'başarı', 'terketmek': 'terk etmek'}
def tidy(q):
    q = re.sub(r'\s+', ' ', q.replace('\n', ' ')).strip()
    q = re.sub(r'^\(+[^)]*\)+\s*', '', q)              # baştaki (ran, run …) gibi çekim notları
    q = re.sub(r'^-\w+\s+', '', q)                      # baştaki -ical gibi ekler
    q = re.sub(r'\bk\.? dili\b', '', q)
    q = re.sub(r'\((kıs|bağlaç|isim|fiil|sıfat|zarf|edat|A\.B\.D\.?)\.?\)', '', q)
    return re.sub(r'\s+', ' ', q).strip(' .;,:-')

def entry_senses(w, quotes):
    stem = re.escape(w[:5]) if len(w) >= 5 else None
    out = []
    for raw in quotes:
        parts = raw.split('. ')
        q = tidy(parts[0]); stop = len(parts) > 1
        if stem:
            m = re.search(r'\b' + stem + r'[a-z]*', q, re.I)   # türetilmiş İngilizce madde başladı
            if m: q = tidy(q[:m.start()]); stop = True
        if q and len(q) <= 60:
            q = OLD.get(q, q)
            if q not in out: out.append(q)
        if stop or len(out) >= 5: break
    return out

fd = {}
if len(sys.argv) > 1:
    for e in ET.parse(sys.argv[1]).getroot().iter(T + 'entry'):
        o = e.find(f'.//{T}form/{T}orth')
        if o is None or not o.text: continue
        w = o.text.strip().lower()
        if not re.fullmatch(r"[a-z][a-z' \-]*", w) or w in core: continue
        qs = [q.text for q in e.findall(f'.//{T}sense//{T}cit[@type="trans"]/{T}quote') if q.text]
        sv = entry_senses(w, qs)
        if sv and w not in fd: fd[w] = sv

entries = {}
for w, (pos, tr) in core.items(): entries[w] = f'{pos}|{tr}|f'
for w, v in fd.items():
    if w not in entries: entries[w] = f'|{", ".join(v)}|d'

js = ('/* Fluo sözlüğü — çekirdek: Fluo (özgün), yedek: FreeDict eng-tur (GPL-2.0-or-later). Ayrıntı: sozluk/LISANS.md */\n'
      'window.FLUO_DICT=' + json.dumps({'v': 1, 'e': entries}, ensure_ascii=False, separators=(',', ':')) + ';\n')
(root / 'sozluk.js').write_text(js, encoding='utf-8')
print('çekirdek', len(core), 'yedek', len(fd), 'toplam', len(entries), 'boyut KB', len(js.encode()) // 1024)
