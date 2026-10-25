"""src/ klasöründeki parçaları index.html olarak birleştirir ve ses dosyalarını paketler: python3 build.py

Ses: ses/index.json  {metin_anahtarı: [grup, dosya]}  ·  ses/*.mp3
Çıktı: index.html, audio-w.js (kelimeler), audio-s.js (cümleler), audio-t.js (metinler)"""
from pathlib import Path
import json, base64
root=Path(__file__).parent; src=root/'src'; ses=root/'ses'
def fnv(s):
    h=0x811c9dc5
    for ch in s:
        h^=ord(ch); h=(h*0x01000193)&0xffffffff
    n,d=h,'0123456789abcdefghijklmnopqrstuvwxyz'; out=''
    while True:
        out=d[n%36]+out; n//=36
        if n==0: break
    return out
aidx={}; groups={'w':{},'s':{},'t':{}}
if (ses/'index.json').exists():
    for key,(g,f) in json.loads((ses/'index.json').read_text()).items():
        p=ses/f
        if p.exists():
            h=fnv(key); aidx[h]=g; groups[g][h]=base64.b64encode(p.read_bytes()).decode()
for g,d in groups.items():
    (root/f'audio-{g}.js').write_text('Object.assign(window.FLUO_AUDIO=window.FLUO_AUDIO||{},'+json.dumps(d,separators=(',',':'))+');\n')
silent=base64.b64encode((ses/'silent.mp3').read_bytes()).decode() if (ses/'silent.mp3').exists() else ''
shell=(src/'shell.html').read_text(); css=(src/'style.css').read_text()
js='\n'.join((src/f).read_text() for f in ['config.js','data-quiz.js','data-examples.js','data-learn.js','data-grammar.js','data-test.js','support.js','cumle.js','app.js','auth.js'])
js=js.replace('/*AIDX*/{}',json.dumps(aidx,separators=(',',':'))).replace('/*SILENT*/""','"'+silent+'"')
out=shell.replace('/*CSS*/',css).replace('/*JS*/',js)
# artifact.html: Claude yayını için (yayın sistemi sayfa iskeletini kendisi ekler)
(root/'artifact.html').write_text(out)
FAVICON="%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 120'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='1' x2='1' y2='0'%3E%3Cstop offset='0' stop-color='%234F80EC'/%3E%3Cstop offset='.5' stop-color='%238A5CF0'/%3E%3Cstop offset='1' stop-color='%23EB6D9F'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='120' height='120' rx='28' fill='url(%23g)'/%3E%3Cg fill='none' stroke='%23fff' stroke-width='11' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M24 82c6-10 12-10 18 0s12 10 18 0V46c0-13 9-19 22-16'/%3E%3Cpath d='M48 57H76'/%3E%3C/g%3E%3C/svg%3E"
# index.html: tek başına açılan tam sayfa (GitHub, dosyadan açma) — telefon için viewport ayarı dahil
full=('<!doctype html>\n<html lang="tr">\n<head>\n<meta charset="utf-8">\n'
      '<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">\n'
      '<meta name="theme-color" content="#FAFAFB">\n'
      '<link rel="icon" href="data:image/svg+xml,'+FAVICON+'">\n</head>\n<body>\n'+out+'\n</body>\n</html>\n')
(root/'index.html').write_text(full)
print('index.html',len(out)//1024,'KB · ses:',{g:len(d) for g,d in groups.items()},'· dosyalar:',{g:(root/f"audio-{g}.js").stat().st_size//1024 for g in groups},'KB')
