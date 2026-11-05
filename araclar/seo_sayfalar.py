"""Google'ın okuyabileceği konu sayfaları: her gramer konusu, kelime destesi ve okuma metni için ayrı, tam içerikli HTML.
Uygulama tek sayfa (#adresler) olduğu için arama motorları içerikleri göremez; bu sayfalar o içeriği gerçek adreslerde sunar
ve "Fluo'da çalış" düğmesiyle uygulamadaki ilgili bölüme götürür.
build.py tarafından çağrılır: node araclar/icerik_dok.js → JSON → bu betik → gramer/ kelime/ okuma/ klasörleri.
Döndürdüğü liste sitemap.xml'e eklenir."""
import json, re, html, shutil
from pathlib import Path

SITE = 'https://fluo-english.com/'
UMAMI = ('<script defer src="https://cloud.umami.is/script.js" data-website-id="4d5c94d2-f55d-4985-a1c7-fed7a95657f6" '
         'data-domains="fluo-english.com,www.fluo-english.com" data-do-not-track="true"></script>')
LOGO = ('<svg viewBox="0 0 120 120" aria-hidden="true"><defs><linearGradient id="lg" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stop-color="#4F80EC"/>'
        '<stop offset=".5" stop-color="#8A5CF0"/><stop offset="1" stop-color="#EB6D9F"/></linearGradient></defs><rect width="120" height="120" rx="28" fill="url(#lg)"/>'
        '<g fill="none" stroke="#fff" stroke-width="11" stroke-linecap="round" stroke-linejoin="round"><path d="M24 82c6-10 12-10 18 0s12 10 18 0V46c0-13 9-19 22-16"/>'
        '<path d="M48 57H76"/></g></svg>')
LV_NAME = {'kolay': 'A1–A2', 'orta': 'B1', 'zor': 'B2', 'uzman': 'C1–C2'}


def e(s):
    return html.escape(str(s), quote=True)


def bold(s):
    return re.sub(r'\*\*(.+?)\*\*', r'<strong>\1</strong>', e(s))


def plain(s):
    return re.sub(r'\*\*', '', str(s))


def short(s, n=155):
    s = re.sub(r'\s+', ' ', plain(s)).strip()
    return s if len(s) <= n else s[:n].rsplit(' ', 1)[0] + '…'


def page(path, title, desc, crumbs, body, app_href, app_label):
    url = SITE + path
    ld = [{"@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": [
        {"@type": "ListItem", "position": i + 1, "name": n, "item": SITE + u} for i, (n, u) in enumerate(crumbs)]}]
    nav = ' <span>›</span> '.join(f'<a href="/{u}">{e(n)}</a>' if i < len(crumbs) - 1 else f'<span aria-current="page">{e(n)}</span>'
                                 for i, (n, u) in enumerate(crumbs))
    return f'''<!doctype html>
<html lang="tr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>{e(title)}</title>
<meta name="description" content="{e(desc)}">
<link rel="canonical" href="{url}">
<meta name="theme-color" content="#FAFAFB">
<link rel="icon" href="/icons/icon-192.png">
<meta property="og:type" content="article"><meta property="og:site_name" content="Fluo"><meta property="og:locale" content="tr_TR">
<meta property="og:url" content="{url}"><meta property="og:title" content="{e(title)}"><meta property="og:description" content="{e(desc)}">
<meta property="og:image" content="{SITE}icons/og-image.png"><meta name="twitter:card" content="summary_large_image">
<link rel="stylesheet" href="/sayfa.css">
<script type="application/ld+json">{json.dumps(ld, ensure_ascii=False)}</script>
{UMAMI}
</head>
<body>
<header class="top"><a class="brand" href="/">{LOGO}<b>Fluo</b><span class="beta">Beta</span></a>
<nav class="tnav"><a href="/gramer/">Gramer</a><a href="/kelime/">Kelimeler</a><a href="/okuma/">Okuma</a><a href="/seviye/">Seviyeler</a></nav>
<a class="cta-s" href="/">Uygulamayı aç</a></header>
<main>
<p class="crumbs">{nav}</p>
{body}
<aside class="cta"><div><b>Fluo'da çalış</b><span>Ücretsiz · kayıt gerekmez · sesli telaffuz, alıştırmalar ve ilerleme takibi</span></div>
<a class="btn" href="{app_href}">{e(app_label)} →</a></aside>
</main>
<footer class="foot"><span>Fluo · Türkçe anlatımlı ücretsiz İngilizce</span><a href="/ingilizce-ogren/">Ücretsiz İngilizce öğren</a><a href="/ingilizce-seviye-testi/">Seviye testi</a><a href="/gramer/">Gramer konuları</a><a href="/kelime/">Kelime listeleri</a><a href="/ingilizce-kelime-ezberleme/">Kelime ezberleme</a><a href="/okuma/">Okuma metinleri</a><a href="/seviye/">Seviyeler</a><a href="/#yasal">KVKK</a><a href="/#yasal-gizlilik">Gizlilik</a><a href="/#destek">İletişim</a></footer>
</body>
</html>
'''


CSS = '''@font-face{font-family:Onest;src:url(/fonts/onest-latin-wght-normal.woff2) format("woff2");font-weight:100 900;font-display:swap;unicode-range:U+0000-00FF,U+2000-206F}
@font-face{font-family:Onest;src:url(/fonts/onest-latin-ext-wght-normal.woff2) format("woff2");font-weight:100 900;font-display:swap;unicode-range:U+0100-024F}
:root{--bg:#FAFAFB;--s:#fff;--s2:#F4F4F7;--ink:#1B1F25;--mut:#6B7080;--line:#E9E9EF;--br:#8A5CF0;--ok:#1E9E6A;--no:#D64545}
@media (prefers-color-scheme:dark){:root{--bg:#0E1015;--s:#16181F;--s2:#1D2029;--ink:#F2F3F7;--mut:#9AA0AE;--line:#282B35;--br:#A98BFF}}
*{box-sizing:border-box}
body{margin:0;background:var(--bg);color:var(--ink);font:16px/1.65 Onest,system-ui,sans-serif}
a{color:var(--br)}
.top{position:sticky;top:0;z-index:5;display:flex;align-items:center;gap:16px;padding:12px 20px;background:color-mix(in srgb,var(--bg) 88%,transparent);backdrop-filter:blur(10px);border-bottom:1px solid var(--line)}
.brand{display:flex;align-items:center;gap:8px;color:var(--ink);text-decoration:none;font-size:1.15rem}
.brand svg{width:30px;height:30px}
.beta{font-size:.6rem;font-weight:700;letter-spacing:.06em;text-transform:uppercase;padding:3px 6px;border-radius:99px;color:#fff;background:linear-gradient(110deg,#4F80EC,#8A5CF0 55%,#EB6D9F)}
.tnav{display:flex;gap:14px;margin-right:auto}
.tnav a{color:var(--mut);text-decoration:none;font-weight:600;font-size:.95rem}
.tnav a:hover{color:var(--ink)}
.cta-s{background:var(--ink);color:var(--bg);text-decoration:none;font-weight:700;font-size:.9rem;padding:8px 14px;border-radius:999px;white-space:nowrap}
main{max-width:860px;margin:0 auto;padding:20px 20px 40px}
.crumbs{font-size:.85rem;color:var(--mut);margin:4px 0 18px}
.crumbs a{color:var(--mut)}
.crumbs span{margin:0 2px}
h1{font-size:clamp(1.8rem,5vw,2.6rem);line-height:1.15;margin:0 0 8px;letter-spacing:-.5px}
.sub{color:var(--mut);font-size:1.05rem;margin:0 0 18px}
.pill{display:inline-block;background:var(--s2);border:1px solid var(--line);border-radius:999px;padding:2px 10px;font-size:.8rem;font-weight:700;margin-right:6px}
h2{font-size:1.3rem;margin:32px 0 12px}
.lead{font-size:1.08rem}
ul.uses{padding-left:20px}
ul.uses li{margin:6px 0}
.card{background:var(--s);border:1px solid var(--line);border-radius:16px;padding:14px 16px;margin:10px 0}
.form b{display:block;color:var(--br);font-size:.85rem;text-transform:uppercase;letter-spacing:.04em}
.form code{font-family:inherit;font-weight:600}
.form i{display:block;color:var(--mut)}
table{width:100%;border-collapse:collapse;background:var(--s);border:1px solid var(--line);border-radius:12px;overflow:hidden;font-size:.95rem}
th,td{text-align:left;padding:9px 12px;border-bottom:1px solid var(--line);vertical-align:top}
th{background:var(--s2);font-size:.85rem}
.ex p{margin:0}
.ex small,.tr{color:var(--mut);display:block;font-size:.92rem}
.mis .no{color:var(--no);text-decoration:line-through}
.mis .ok{color:var(--ok);font-weight:600}
.mis small{display:block;color:var(--mut)}
.tags{display:flex;flex-wrap:wrap;gap:8px}
.tags a.pill{text-decoration:none;color:var(--ink)}
.tags span{background:var(--s2);border-radius:999px;padding:4px 12px;font-weight:600}
.words td:first-child{font-weight:700;white-space:nowrap}
.words small{color:var(--mut);display:block}
.text p{font-size:1.08rem}
details{background:var(--s);border:1px solid var(--line);border-radius:14px;padding:10px 16px;margin:10px 0}
summary{cursor:pointer;font-weight:700}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:10px}
.grid a{display:block;background:var(--s);border:1px solid var(--line);border-radius:14px;padding:12px 14px;text-decoration:none;color:var(--ink)}
.grid a:hover{border-color:var(--br)}
.grid small{display:block;color:var(--mut)}
.pn{display:flex;justify-content:space-between;gap:10px;margin-top:28px}
.pn a{max-width:48%;text-decoration:none;font-weight:600}
.cta{display:flex;align-items:center;justify-content:space-between;gap:14px;flex-wrap:wrap;margin-top:36px;padding:18px 20px;border-radius:20px;color:#fff;background:linear-gradient(110deg,#4F80EC,#8A5CF0 55%,#EB6D9F)}
.cta b{display:block;font-size:1.15rem}
.cta span{opacity:.9;font-size:.92rem}
.btn{background:#fff;color:#1B1F25;text-decoration:none;font-weight:700;padding:11px 18px;border-radius:999px;white-space:nowrap}
.foot{display:flex;flex-wrap:wrap;gap:8px 16px;justify-content:center;padding:24px 20px 40px;color:var(--mut);font-size:.85rem}
.foot a{color:var(--mut)}
@media (max-width:560px){.cta-s{display:none}.tnav{gap:12px;margin-left:auto;margin-right:0}th,td{padding:8px}
 table.words thead{display:none}table.words,table.words tbody,table.words tr{display:block}table.words tr{padding:10px 12px;border-bottom:1px solid var(--line)}
 table.words td{display:block;border:0;padding:1px 0}.words td:first-child{white-space:normal}}
'''


def grammar_page(g, lv_name, prev, nxt, T=None):
    T = T or {}
    tr = lambda k: f'<small class="tr">{e(T[k])}</small>' if k in T else ''
    b = [f'<p><span class="pill">{e(g["level"])} · {e(lv_name)}</span></p>',
         f'<h1>{e(g["title"])} konu anlatımı</h1>',
         f'<p class="sub">{e(g["sub"])} · {e(g["tr"])}</p>',
         f'<p class="lead">{bold(g["intro"])}</p>']
    if g.get('uses'):
        b.append('<h2>Ne zaman kullanılır?</h2><ul class="uses">' + ''.join(
            '<li>' + (f'<strong>{e(u.split(":", 1)[0])}</strong>:{bold(u.split(":", 1)[1])}' if ':' in u else bold(u)) + tr(u) + '</li>' for u in g['uses']) + '</ul>')
    if g.get('forms'):
        b.append('<h2>Cümle yapısı</h2>' + ''.join(
            f'<div class="card form"><b>{e(f[0])}</b><code>{e(f[1])}</code><i>{bold(f[2]) if len(f) > 2 else ""}</i>{tr(f[2]) if len(f) > 2 else ""}</div>' for f in g['forms']))
    if g.get('table'):
        t = g['table']
        b.append('<h2>Özet tablo</h2><table><thead><tr>' + ''.join(f'<th>{e(h)}</th>' for h in t['head']) + '</tr></thead><tbody>' +
                 ''.join('<tr>' + ''.join(f'<td>{bold(c)}</td>' for c in r) + '</tr>' for r in t['rows']) + '</tbody></table>')
    if g.get('examples'):
        b.append('<h2>Örnek cümleler</h2>' + ''.join(f'<div class="card ex"><p>{bold(x[0])}</p><small>{e(x[1])}</small></div>' for x in g['examples']))
    if g.get('signals'):
        b.append('<h2>İpucu kelimeler</h2><div class="tags">' + ''.join(f'<span>{e(s)}</span>' for s in g['signals']) + '</div>')
    if g.get('mistakes'):
        b.append('<h2>Sık yapılan hatalar</h2>' + ''.join(
            f'<div class="card mis"><span class="no">{e(plain(m[0]))}</span> → <span class="ok">{bold(m[1])}</span><small>{e(m[2]) if len(m) > 2 else ""}</small></div>' for m in g['mistakes']))
    if g.get('quiz'):
        qs = g['quiz'][:5]
        b.append(f'<h2>Kendini dene</h2><p>Bu konudan {len(qs)} örnek soru. Cevabı görmek için soruya dokun; tüm alıştırmalar ve bölüm testi uygulamada.</p>' + ''.join(
            f'<details><summary>{i + 1}. {e(q[0])} <small>({" / ".join(e(o) for o in q[1])})</small></summary><p><strong>Cevap: {e(q[1][q[2]])}</strong> — {e(q[3]) if len(q) > 3 else ""}</p></details>'
            for i, q in enumerate(qs)))
    b.append('<div class="pn">' + (f'<a href="/gramer/{prev["id"]}/">← {e(prev["title"])}</a>' if prev else '<span></span>') +
             (f'<a href="/gramer/{nxt["id"]}/">{e(nxt["title"])} →</a>' if nxt else '') + '</div>')
    return '\n'.join(b)


def deck_page(d, prev, nxt):
    ws = d['words']
    b = [f'<p><span class="pill">{e(d["level"])}</span></p>',
         f'<h1>{e(d["name"])}: İngilizce kelimeler</h1>',
         f'<p class="sub">{e(d["en"])} · {len(ws)} kelime, Türkçe anlamları ve örnek cümleleriyle</p>',
         f'<p class="lead">{e(d["desc"])} Aşağıdaki listede her kelimenin Türkçesi, türü ve gerçek hayattan bir örnek cümle var.</p>',
         '<h2>Kelime listesi</h2><table class="words"><thead><tr><th>İngilizce</th><th>Türkçe</th><th>Örnek</th></tr></thead><tbody>' +
         ''.join(f'<tr><td>{e(w[0])}</td><td>{e(w[1])}<small>{e(w[2])}</small></td><td>{bold(w[3]) if len(w) > 3 else ""}<small>{e(w[4]) if len(w) > 4 else ""}</small></td></tr>' for w in ws) +
         '</tbody></table>',
         '<div class="pn">' + (f'<a href="/kelime/{prev["id"]}/">← {e(prev["name"])}</a>' if prev else '<span></span>') +
         (f'<a href="/kelime/{nxt["id"]}/">{e(nxt["name"])} →</a>' if nxt else '') + '</div>']
    return '\n'.join(b)


def reading_page(r, prev, nxt):
    paras = lambda t: ''.join(f'<p>{e(p.strip())}</p>' for p in t.split('\n\n') if p.strip())
    b = [f'<p><span class="pill">{LV_NAME.get(r["lv"], r["lv"])}</span></p>',
         f'<h1>{e(r["title"])}</h1>',
         f'<p class="sub">İngilizce okuma metni · {e(r["tt"])} · {len(r["en"].split())} kelime</p>',
         f'<div class="text">{paras(r["en"])}</div>',
         f'<details><summary>Türkçe çevirisi</summary><div class="text">{paras(r["tr"])}</div></details>']
    if r.get('vocab'):
        b.append('<h2>Anahtar kelimeler</h2><table class="words"><tbody>' + ''.join(f'<tr><td>{e(v[0])}</td><td>{e(v[1])}</td></tr>' for v in r['vocab']) + '</tbody></table>')
    if r.get('qs'):
        b.append('<h2>Anlama soruları</h2>' + ''.join(
            f'<details><summary>{i + 1}. {e(q[0])}</summary><p><strong>Cevap: {e(q[1][0])}</strong>{" — " + e(q[2]) if len(q) > 2 and q[2] else ""}</p></details>'
            for i, q in enumerate(r['qs'])))
    b.append('<div class="pn">' + (f'<a href="/okuma/{prev["id"]}/">← {e(prev["title"])}</a>' if prev else '<span></span>') +
             (f'<a href="/okuma/{nxt["id"]}/">{e(nxt["title"])} →</a>' if nxt else '') + '</div>')
    return '\n'.join(b)


def build(root, data):
    root = Path(root)
    for d in ['gramer', 'kelime', 'okuma']:
        shutil.rmtree(root / d, ignore_errors=True)
    (root / 'sayfa.css').write_text(CSS)
    urls = []

    def write(rel, content):
        p = root / rel / 'index.html'
        p.parent.mkdir(parents=True, exist_ok=True)
        p.write_text(content)
        urls.append(rel + '/')

    G, GL = data['GRAMMAR'], data['GRAMMAR_LEVELS']
    for i, g in enumerate(G):
        L = GL.get(g['level'], {})
        write(f'gramer/{g["id"]}', page(f'gramer/{g["id"]}/', f'{g["title"]} konu anlatımı ({g["sub"]}) · İngilizce gramer | Fluo',
                                        short(f'{g["title"]} ({g["tr"]}): {g["intro"]}'),
                                        [('Fluo', ''), ('Gramer', 'gramer/'), (g['title'], f'gramer/{g["id"]}/')],
                                        grammar_page(g, L.get('name', ''), G[i - 1] if i else None, G[i + 1] if i + 1 < len(G) else None, data.get('GTR')),
                                        f'/#g-{g["id"]}', 'Alıştırmaları çöz'))
    lst = ''.join(f'<h2>{e(k)} · {e(v["name"])}</h2><p class="sub">{e(v["desc"])}</p><div class="grid">' +
                  ''.join(f'<a href="/gramer/{g["id"]}/"><b>{e(g["title"])}</b><small>{e(g["sub"])} · {e(g["tr"])}</small></a>' for g in G if g['level'] == k) + '</div>'
                  for k, v in GL.items())
    write('gramer', page('gramer/', 'İngilizce gramer konu anlatımları (A1–C2) · Türkçe | Fluo',
                         f'A1\'den C2\'ye {len(G)} İngilizce dil bilgisi konusu Türkçe anlatım, cümle yapıları, örnek cümleler ve sık yapılan hatalarla.',
                         [('Fluo', ''), ('Gramer', 'gramer/')],
                         f'<h1>İngilizce gramer konu anlatımları</h1><p class="sub">A1\'den C2\'ye {len(G)} konu, Türkçe anlatım ve örneklerle</p>' + lst,
                         '/#gramer', 'Gramer bölümünü aç'))

    D = data['DECKS']
    for i, d in enumerate(D):
        write(f'kelime/{d["id"]}', page(f'kelime/{d["id"]}/', f'{d["name"]} ile ilgili İngilizce kelimeler ({d["level"]}) · Türkçe anlamları | Fluo',
                                        short(f'{d["name"]} ({d["en"]}) konusunda {len(d["words"])} İngilizce kelime, Türkçe anlamları ve örnek cümleleriyle: ' +
                                              ', '.join(w[0] for w in d['words'][:8]) + '…'),
                                        [('Fluo', ''), ('Kelimeler', 'kelime/'), (d['name'], f'kelime/{d["id"]}/')],
                                        deck_page(d, D[i - 1] if i else None, D[i + 1] if i + 1 < len(D) else None),
                                        f'/#ogren-{d["id"]}', 'Kartlarla çalış'))
    write('kelime', page('kelime/', 'Konu konu İngilizce kelime listeleri · Türkçe anlamları | Fluo',
                         f'{len(D)} konuda {sum(len(d["words"]) for d in D)} İngilizce kelime: günlük hayat, iş, seyahat, deyimler, phrasal verbs ve daha fazlası; Türkçe anlamları ve örnek cümleleriyle.',
                         [('Fluo', ''), ('Kelimeler', 'kelime/')],
                         f'<h1>Konu konu İngilizce kelime listeleri</h1><p class="sub">{len(D)} deste · {sum(len(d["words"]) for d in D)} kelime, Türkçe anlam ve örnek cümlelerle</p><div class="grid">' +
                         ''.join(f'<a href="/kelime/{d["id"]}/"><b>{e(d["name"])}</b><small>{e(d["level"])} · {len(d["words"])} kelime · {e(d["desc"])}</small></a>' for d in D) + '</div>',
                         '/#ogren', 'Kelime öğrenmeye başla'))

    R = data['READING']
    for i, r in enumerate(R):
        write(f'okuma/{r["id"]}', page(f'okuma/{r["id"]}/', f'{r["title"]} · {LV_NAME.get(r["lv"], "")} İngilizce okuma metni ve Türkçe çevirisi | Fluo',
                                       short(f'{LV_NAME.get(r["lv"], "")} seviye İngilizce okuma metni: {r["title"]} ({r["tt"]}). Türkçe çevirisi, anahtar kelimeleri ve anlama sorularıyla. ' + r['en']),
                                       [('Fluo', ''), ('Okuma', 'okuma/'), (r['title'], f'okuma/{r["id"]}/')],
                                       reading_page(r, R[i - 1] if i else None, R[i + 1] if i + 1 < len(R) else None),
                                       f'/#okuma-{r["id"]}', 'Sesli dinle ve soruları çöz'))
    write('okuma', page('okuma/', 'Seviyeli İngilizce okuma metinleri ve Türkçe çevirileri (A1–C2) | Fluo',
                        f'{len(R)} özgün İngilizce okuma metni: A1\'den C2\'ye seviyelere göre, Türkçe çevirisi, anahtar kelimeleri ve anlama sorularıyla.',
                        [('Fluo', ''), ('Okuma', 'okuma/')],
                        '<h1>Seviyeli İngilizce okuma metinleri</h1><p class="sub">Türkçe çevirisi, anahtar kelimeler ve anlama sorularıyla</p>' +
                        ''.join(f'<h2>{LV_NAME[lv]}</h2><div class="grid">' + ''.join(
                            f'<a href="/okuma/{r["id"]}/"><b>{e(r["title"])}</b><small>{e(r["tt"])} · {len(r["en"].split())} kelime</small></a>' for r in R if r['lv'] == lv) + '</div>'
                                for lv in LV_NAME),
                        '/#okuma', 'Okuma bölümünü aç'))
    from seo_rehber import build_guides
    build_guides(write, data)
    return urls


if __name__ == '__main__':
    import sys
    print(len(build(sys.argv[1], json.load(open(sys.argv[2])))), 'sayfa')
