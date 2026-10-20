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
js='\n'.join((src/f).read_text() for f in ['data-quiz.js','data-examples.js','data-learn.js','data-grammar.js','app.js'])
js=js.replace('/*AIDX*/{}',json.dumps(aidx,separators=(',',':'))).replace('/*SILENT*/""','"'+silent+'"')
out=shell.replace('/*CSS*/',css).replace('/*JS*/',js)
(root/'index.html').write_text(out)
print('index.html',len(out)//1024,'KB · ses:',{g:len(d) for g,d in groups.items()},'· dosyalar:',{g:(root/f"audio-{g}.js").stat().st_size//1024 for g in groups},'KB')
