"""Üretilen mp3 dosyalarını ses/ klasörüne kopyalar ve ses/index.json dosyasını yazar.
Kullanım: python3 araclar/ses_paketle.py <items.json> <mp3 klasörü>"""
import json,hashlib,shutil,sys
from pathlib import Path
items=json.load(open(sys.argv[1]));src=Path(sys.argv[2]);dst=Path(__file__).parent.parent/'ses';dst.mkdir(exist_ok=True)
idx={};missing=[]
for key,gv in items.items():
    g,_,voice=gv.partition('|')
    f=hashlib.md5((key+('|'+voice if voice and voice!='af_heart' else '')).encode()).hexdigest()[:12]+'.mp3'
    if (src/f).exists():shutil.copy(src/f,dst/f);idx[key]=[g,f]
    else:missing.append(key)
(dst/'index.json').write_text(json.dumps(idx,ensure_ascii=False,indent=0))
print('paketlendi',len(idx),'eksik',len(missing),missing[:5])
