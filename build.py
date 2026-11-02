"""src/ klasöründeki parçaları index.html olarak birleştirir ve ses dosyalarını paketler: python3 build.py

Ses: ses/index.json  {metin_anahtarı: [grup, dosya]}  ·  ses/*.mp3
Çıktı: index.html, audio-w.js (kelimeler), audio-s.js (cümleler), audio-t.js (metinler)"""
from pathlib import Path
import json, base64, re
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
aidx={}; groups={}
if (ses/'index.json').exists():
    for key,(g,f) in json.loads((ses/'index.json').read_text()).items():
        p=ses/f
        if p.exists(): groups.setdefault(g,[]).append((fnv(key),base64.b64encode(p.read_bytes()).decode()))
# Sesler küçük parçalara bölünür (~400 KB): bir kelimeyi dinlemek için yalnızca onun parçası iner.
# Kayıtlar üretim sırasıyla (deste/konu sırası) dizildiği için aynı destenin sesleri çoğunlukla aynı parçalardadır.
CHUNK=400_000; adir=root/'ses-js'; adir.mkdir(exist_ok=True)
for old in adir.glob('*.js'): old.unlink()
for f in root.glob('audio-*.js'): f.unlink()
chunks=[]
for g,items in groups.items():
    n=0; cur={}; size=0
    def flush():
        global n,cur,size
        if cur:
            name=f'{g}-{n}'; (adir/f'{name}.js').write_text('Object.assign(window.FLUO_AUDIO=window.FLUO_AUDIO||{},'+json.dumps(cur,separators=(',',':'))+');\n')
            chunks.append(name); n+=1; cur={}; size=0
    for h,b in items:
        cur[h]=b; size+=len(b); aidx[h]=f'{g}-{n}'
        if size>=CHUNK: flush()
    flush()
silent=base64.b64encode((ses/'silent.mp3').read_bytes()).decode() if (ses/'silent.mp3').exists() else ''
shell=(src/'shell.html').read_text(); css=(src/'style.css').read_text()
# Dokunmatik ekranlarda :hover "yapışıp" kalmasın: üst düzeydeki :hover kuralları yalnızca fareli cihazlarda geçerli
def _hov(line):
    if not line or line[0] in ' @\t' or ':hover' not in line: return line
    return re.sub(r'([^{}]+)\{([^{}]*)\}',lambda m:('@media (hover:hover){'+m.group(0)+'}') if ':hover' in m.group(1) else m.group(0),line)
css='\n'.join(_hov(l) for l in css.split('\n'))
js='\n'.join((src/f).read_text() for f in ['config.js','data-quiz.js','data-quiz2.js','data-texts2.js','data-examples.js','data-learn.js','data-learn2.js','data-learn2b.js','data-learn2c.js','data-learn2d.js','data-grammar.js','data-test.js','data-reading.js','data-exam.js','data-grammar-c1.js','data-dialog.js','data-hatalar.js','data-aile.js','support.js','yasal.js','hedef.js','calismam.js','sinav.js','konutest.js','cumle.js','gunun.js','okuma.js','telaffuz.js','diyalog.js','hatalar.js','buyuksozluk.js','pwa.js','pomodoro.js','yarisma2.js','app.js','auth.js'])
js=js.replace('/*AIDX*/{}',json.dumps(aidx,separators=(',',':'))).replace('/*SILENT*/""','"'+silent+'"')
out=shell.replace('/*CSS*/',css).replace('/*JS*/',js)
# artifact.html: Claude yayını için (yayın sistemi sayfa iskeletini kendisi ekler)
(root/'artifact.html').write_text(out)
FAVICON="%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 120'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='1' x2='1' y2='0'%3E%3Cstop offset='0' stop-color='%234F80EC'/%3E%3Cstop offset='.5' stop-color='%238A5CF0'/%3E%3Cstop offset='1' stop-color='%23EB6D9F'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='120' height='120' rx='28' fill='url(%23g)'/%3E%3Cg fill='none' stroke='%23fff' stroke-width='11' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M24 82c6-10 12-10 18 0s12 10 18 0V46c0-13 9-19 22-16'/%3E%3Cpath d='M48 57H76'/%3E%3C/g%3E%3C/svg%3E"
# Google ve paylaşım önizlemesi (yalnızca index.html; Claude önizlemesi etkilenmez)
SITE='https://fluo-english.com/'
TITLE='Fluo · Türkçe anlatımlı ücretsiz İngilizce: kelime, gramer, okuma'
DESC='Türkçe anlatımlı ücretsiz İngilizce çalışma alanı: 1.400+ örnekli kelime, A1–C1 dil bilgisi, seviye testi, okuma, dinleme, diyaloglar ve kelime yarışmaları.'
OG=SITE+'icons/og-image.png'
UMAMI='<script defer src="https://cloud.umami.is/script.js" data-website-id="4d5c94d2-f55d-4985-a1c7-fed7a95657f6" data-domains="fluo-english.com,www.fluo-english.com" data-auto-track="false" data-do-not-track="true"></script>\n'
SEO=(UMAMI+'<meta name="description" content="'+DESC+'">\n'
     '<link rel="canonical" href="'+SITE+'">\n'
     '<meta property="og:type" content="website">\n<meta property="og:site_name" content="Fluo">\n<meta property="og:locale" content="tr_TR">\n'
     '<meta property="og:url" content="'+SITE+'">\n<meta property="og:title" content="Fluo · İngilizceni Türkçe anlatımla geliştir">\n'
     '<meta property="og:description" content="'+DESC+'">\n'
     '<meta property="og:image" content="'+OG+'">\n<meta property="og:image:width" content="1200">\n<meta property="og:image:height" content="630">\n'
     '<meta property="og:image:alt" content="Fluo: İngilizceni Türkçe anlatımla adım adım geliştir">\n'
     '<meta name="twitter:card" content="summary_large_image">\n<meta name="twitter:title" content="Fluo · İngilizceni Türkçe anlatımla geliştir">\n'
     '<meta name="twitter:description" content="'+DESC+'">\n<meta name="twitter:image" content="'+OG+'">\n'
     '<script type="application/ld+json">'+json.dumps({"@context":"https://schema.org","@type":"WebApplication","name":"Fluo","url":SITE,
        "description":DESC,"inLanguage":"tr","applicationCategory":"EducationalApplication","operatingSystem":"Web",
        "offers":{"@type":"Offer","price":"0","priceCurrency":"TRY"},"author":{"@type":"Person","name":"Ümit Erdoğan"},
        "educationalLevel":"A1–C1","teaches":"İngilizce (English as a foreign language)"},ensure_ascii=False)+'</script>\n')
NOSCRIPT=('<noscript><h1>Fluo · Türkçe anlatımlı ücretsiz İngilizce</h1><p>'+DESC+'</p>'
          '<p>Fluo\'yu kullanmak için tarayıcında JavaScript\'i aç.</p></noscript>')
(root/'robots.txt').write_text('User-agent: *\nAllow: /\n\nSitemap: '+SITE+'sitemap.xml\n')
import datetime
# Konu sayfaları (gramer/, kelime/, okuma/): Google'ın okuyabileceği gerçek adresler
import subprocess, sys, tempfile
sys.path.insert(0,str(root/'araclar'))
import seo_sayfalar
with tempfile.TemporaryDirectory() as td:
    subprocess.run(['node',str(root/'araclar'/'icerik_dok.js'),td+'/icerik.json'],check=True,stdout=subprocess.DEVNULL)
    seo_urls=seo_sayfalar.build(root,json.load(open(td+'/icerik.json')))
today=datetime.date.today().isoformat()
(root/'sitemap.xml').write_text('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
  '  <url><loc>'+SITE+'</loc><lastmod>'+today+'</lastmod><changefreq>weekly</changefreq><priority>1.0</priority></url>\n'
  +''.join('  <url><loc>'+SITE+u+'</loc><lastmod>'+today+'</lastmod><priority>'+('0.8' if u.count('/')==1 else '0.6')+'</priority></url>\n' for u in seo_urls)+'</urlset>\n')
SEOLINKS='<a href="/gramer/">Gramer konu anlatımları</a><a href="/kelime/">Kelime listeleri</a><a href="/okuma/">Okuma metinleri</a>'
# index.html: tek başına açılan tam sayfa (GitHub, dosyadan açma) — telefon için viewport ayarı dahil
full=('<!doctype html>\n<html lang="tr">\n<head>\n<meta charset="utf-8">\n'
      '<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">\n'
      '<meta name="theme-color" content="#FAFAFB">\n'
      '<link rel="manifest" href="manifest.webmanifest">\n'
      '<link rel="apple-touch-icon" href="icons/apple-180.png">\n'
      '<meta name="apple-mobile-web-app-capable" content="yes">\n'
      '<meta name="apple-mobile-web-app-title" content="Fluo">\n'
      '<link rel="icon" href="data:image/svg+xml,'+FAVICON+'">\n'+SEO+'</head>\n<body>\n'+out.replace('<title>Fluo</title>','<title>'+TITLE+'</title>',1).replace('<a href="#yasal">KVKK',SEOLINKS+'<a href="#yasal">KVKK',1)+NOSCRIPT+'\n</body>\n</html>\n')
(root/'index.html').write_text(full)
# Service worker: sürüm = sayfanın özeti; büyük dosyalar kendi içerik özetiyle (yalnızca değişen yeniden indirilir)
import hashlib
big={f:hashlib.md5((root/f).read_bytes()).hexdigest()[:10] for f in ['ses-js/'+c+'.js' for c in chunks]+['sozluk.js'] if (root/f).exists()}
sw=(src/'sw-template.js').read_text().replace('__VERSION__',hashlib.md5(full.encode()).hexdigest()[:10]).replace('__BIG__',json.dumps(big))
(root/'sw.js').write_text(sw)
print('index.html',len(out)//1024,'KB · ses:',{g:len(d) for g,d in groups.items()},'· parça:',len(chunks))
