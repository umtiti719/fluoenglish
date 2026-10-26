"""Yarışma kelime havuzu: Fluo çekirdek sözlüğünden (sıklık sırasıyla) seviyelere göre kelime seçer.
Kullanım: python3 -I araclar/yarisma_havuz.py  → src/data-quiz2.js"""
import re, json
from pathlib import Path
root=Path(__file__).resolve().parent.parent
rows=[]
for f in sorted((root/'sozluk/cekirdek').glob('p*.tsv')):
    for line in f.read_text(encoding='utf-8').splitlines():
        p=line.split('\t')
        if len(p)>=3: rows.append((p[0].strip(),p[1].strip(),p[2].strip()))
POS={'isim','fiil','sıfat','zarf'}
def short(tr):
    t=tr.split(';')[0]
    t=re.sub(r'\([^)]*\)','',t).strip(' ,')
    parts=[x.strip() for x in t.split(',') if x.strip()]
    if not parts: return ''
    out=parts[0]
    if len(parts)>1 and len(out)+len(parts[1])<22: out+=', '+parts[1]
    return out
lv={'kolay':[],'orta':[],'zor':[],'uzman':[]}
seen=set()
for i,(w,pos,tr) in enumerate(rows):
    if pos not in POS or not re.fullmatch(r"[a-z][a-z\-]{2,}",w) or w in seen: continue
    m=short(tr)
    if not m or m.startswith('-') or len(m)>28 or re.search(r'[A-Za-z]{4,}',m.replace('İ','I')) and not re.search('[çğıöşüÇĞİÖŞÜ]',m) and m.lower()==w: continue
    seen.add(w)
    k='kolay' if i<1500 else 'orta' if i<3000 else 'zor' if i<4500 else 'uzman'
    lv[k].append([w,m,pos])
js='/* Yarışma için ek kelime havuzu — Fluo çekirdek sözlüğünden sıklık sırasına göre (araclar/yarisma_havuz.py ile üretilir) */\nvar QPOOL='+json.dumps(lv,ensure_ascii=False,separators=(',',':'))+';\n'
(root/'src/data-quiz2.js').write_text(js,encoding='utf-8')
print({k:len(v) for k,v in lv.items()})
for k,v in lv.items(): print(k, v[:4], v[-3:])
