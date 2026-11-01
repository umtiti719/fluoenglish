"""Yarışma kelimelerinin seviyesini CEFR listesine göre düzeltir ve hassas kelimeleri ayıklar.
Gerekenler: pip install cefrpy · önce node ile kelime dökümü (words.json: WORDS, QPOOL, DECKS)
Kullanım: python3 araclar/yarisma_seviye.py <words.json>  → src/data-quiz2.js (QPOOL + QLV)"""
import json,sys
from pathlib import Path
from cefrpy import CEFRAnalyzer
root=Path(__file__).resolve().parent.parent
a=CEFRAnalyzer();X=json.load(open(sys.argv[1]))
M={'A1':'kolay','A2':'kolay','B1':'orta','B2':'zor','C1':'uzman','C2':'uzman'}
# Öğrenme uygulamasında yarışmada çıkmasını istemediğimiz kelimeler
BLOCK=set("""gun guns rifle pistol weapon weapons bomb bombing genocide massacre slaughter murder murderer kill killer killing rape rapist
suicide terror terrorism terrorist drug drugs cocaine heroin overdose sex sexy sexual porn pornography nude naked prostitute
whore slave slavery corpse execution torture abuse abortion damn hell bitch bastard shit fuck racist nazi assault shoot shooting
stab dead death die dying blood bloody""".split())
def lv(w):
    if ' ' in w or '-' in w: return None
    try: l=a.get_average_word_level_CEFR(w.lower())
    except Exception: return None
    return M.get(str(l)) if l else None
pool={k:[] for k in ['kolay','orta','zor','uzman']};seen=set()
for k,ws in X['QPOOL'].items():
    for w in ws:
        if w[0].lower() in BLOCK or w[0].lower() in seen: continue
        seen.add(w[0].lower());pool[lv(w[0]) or k].append(w)
# El ile yazılmış ve deste kelimeleri için seviye düzeltmesi: yalnızca farklı olanlar
qlv={}
DL={"A1–A2":"kolay","A2":"kolay","A2–B1":"orta","B1":"orta","B1–B2":"zor","B2":"zor","B2–C1":"uzman","C1":"uzman"}
items=[(w[0],k) for k,ws in X['WORDS'].items() for w in ws]+[(w,DL.get(d['level'])) for d in X['DECKS'] for w in d['words']]
for w,k in items:
    n=lv(w)
    if w.lower() in BLOCK: qlv[w.lower()]='-'
    elif n and n!=k: qlv[w.lower()]=n
# Deste kelimelerinin zorluğu (1=A1 … 6=C2): yeni başlayana önce kolay kelimeler gelsin
N={'A1':1,'A2':2,'B1':3,'B2':4,'C1':5,'C2':6};wlv={}
for d in X['DECKS']:
    for w in d['words']:
        if ' ' in w or '-' in w: continue
        try: l=a.get_average_word_level_CEFR(w.lower())
        except Exception: l=None
        if l and str(l) in N: wlv[w]=N[str(l)]
js=('/* Yarışma için ek kelime havuzu (Fluo çekirdek sözlüğünden). Seviyeler CEFR listesine göre: araclar/yarisma_seviye.py\n'
    '   QLV: el ile yazılmış/deste kelimelerinden seviyesi farklı olanlar ("-" = yarışmada gösterme) */\n'
    'var QPOOL='+json.dumps(pool,ensure_ascii=False,separators=(',',':'))+';\nvar QLV='+json.dumps(qlv,ensure_ascii=False,separators=(',',':'))+';\nvar WLV='+json.dumps(wlv,ensure_ascii=False,separators=(',',':'))+';\n')
(root/'src/data-quiz2.js').write_text(js,encoding='utf-8')
print({k:len(v) for k,v in pool.items()},'QLV',len(qlv))
