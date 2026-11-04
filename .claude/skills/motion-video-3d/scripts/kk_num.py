"""Kazakh number -> words, so TTS reads numbers correctly.
  python3 kk_num.py "1942 жылы 25 жасында, 47 000+ адам, 1950–60 жылдары"
Rules: a number directly followed by «жыл…» (year) becomes an ordinal (1942 жылы -> мың тоғыз жүз қырық екінші жылы);
everything else is cardinal. «A–B жыл» ranges make both ordinal. Thousands separators (space/nbsp) are joined.
Always re-read the result: case suffixes written on digits (1500-ге, 20-дан) are converted with the suffix kept."""
import re, sys
U=['', 'бір','екі','үш','төрт','бес','алты','жеті','сегіз','тоғыз']
T=['', 'он','жиырма','отыз','қырық','елу','алпыс','жетпіс','сексен','тоқсан']
def card(n):
    if n==0: return 'нөл'
    out=[]
    for val,name in ((10**9,'миллиард'),(10**6,'миллион'),(1000,'мың')):
        if n>=val:
            q,n=divmod(n,val); out.append(name if (q==1 and val==1000) else card(q)+' '+name)
    if n>=100:
        q,n=divmod(n,100); out.append('жүз' if q==1 else U[q]+' жүз')
    if n>=10: out.append(T[n//10]); n%=10
    if n: out.append(U[n])
    return ' '.join(out)
ORD={'бір':'бірінші','екі':'екінші','үш':'үшінші','төрт':'төртінші','бес':'бесінші','алты':'алтыншы','жеті':'жетінші','сегіз':'сегізінші','тоғыз':'тоғызыншы',
     'он':'оныншы','жиырма':'жиырмасыншы','отыз':'отызыншы','қырық':'қырқыншы','елу':'елуінші','алпыс':'алпысыншы','жетпіс':'жетпісінші','сексен':'сексенінші','тоқсан':'тоқсаныншы',
     'жүз':'жүзінші','мың':'мыңыншы','миллион':'миллионыншы','нөл':'нөлінші'}
def ordinal(n):
    w=card(n).split(' '); w[-1]=ORD[w[-1]]; return ' '.join(w)
def abl(w):
    """ablative suffix (-дан/-ден/-тан/-тен/-нан/-нен) for «N+ = N-нан астам»"""
    last=[c for c in w if c in 'аоұыәөүіеиуэю'][-1:] or ['а']
    back=last[0] in 'аоұыу'
    c=w[-1]
    if c in 'мнң': suf='нан' if back else 'нен'
    elif c in 'кқпстшфхцч': suf='тан' if back else 'тен'
    else: suf='дан' if back else 'ден'
    return w+suf
NUM=r'\d{1,3}(?:[  ]\d{3})+|\d+'
def text(s):
    s=re.sub(rf'({NUM})\s*[–-]\s*({NUM})(?=\s+жыл)',lambda m: ordinal(int(re.sub(r'\D','',m.group(1))))+', '+ordinal(int(re.sub(r'\D','',m.group(2)))),s)
    s=re.sub(rf'({NUM})(?=\s+жыл)',lambda m: ordinal(int(re.sub(r'\D','',m.group(1)))),s)
    s=re.sub(rf'({NUM})(\+)?-?',lambda m: (abl(card(int(re.sub(r'\D','',m.group(1)))))+' астам') if m.group(2) else card(int(re.sub(r'\D','',m.group(1)))),s)
    return s
if __name__=='__main__': print(text(' '.join(sys.argv[1:])))
