# Builds build/timeline.json (scene timing + mouth envelope) and build/mix.wav (voice + whooshes + soft pad)
import json, wave, numpy as np
FPS=30; SR=22050
sc=json.load(open("scenes.json")); n=len(sc)
def rd(f):
    w=wave.open(f); a=np.frombuffer(w.readframes(w.getnframes()),dtype=np.int16).astype(np.float32)/32768
    # trim TTS head/tail breaths: keep from first to last 10 ms window above -38 dBFS, add short fades
    win=SR//100; r=np.array([np.sqrt(np.mean(a[i:i+win]**2)) for i in range(0,len(a)-win,win)])
    on=np.where(r>10**(-38/20))[0]; s0=max(0,on[0]*win-win); s1=min(len(a),(on[-1]+1)*win+4*win)
    a=a[s0:s1].copy(); fi=int(.01*SR); fo=int(.08*SR)
    a[:fi]*=np.linspace(0,1,fi); a[-fo:]*=np.linspace(1,0,fo)**2; return a
LEAD=0.25; PAD=0.45
t=0.0; scenes=[]; clips=[]
for i,s in enumerate(sc):
    a=rd(f"build/audio/{i:02d}.wav"); d=len(a)/SR
    dur=LEAD+d+PAD+(1.4 if i==n-1 else 0)
    scenes.append(dict(id=s["id"],sub=s["sub"],start=round(t,3),dur=round(dur,3),aStart=LEAD,aDur=round(d,3)))
    clips.append((t+LEAD,a)); t+=dur
total=t; N=int(np.ceil(total*SR))
voice=np.zeros(N,np.float32)
for st,a in clips:
    k=int(st*SR); voice[k:k+len(a)]+=a
# mouth envelope per frame
nf=int(np.ceil(total*FPS)); env=np.zeros(nf)
hop=SR//FPS
for f in range(nf):
    seg=voice[f*SR//FPS:f*SR//FPS+hop]
    env[f]=np.sqrt(np.mean(seg**2)) if len(seg) else 0
ref=np.percentile(env[env>0.005],92) if (env>0.005).any() else 1
env=np.clip(env/ref,0,1); env[env<0.12]=0
sm=np.copy(env)
for f in range(1,nf): sm[f]=max(env[f],sm[f-1]*0.55)
# sfx: whoosh at each scene start
rng=np.random.default_rng(7); sfx=np.zeros(N,np.float32)
# (transition whoosh removed: it sounded like sniffing)
# soft pad (Am - F - C - G), slow attack, low volume
tt=np.arange(N)/SR; pad=np.zeros(N,np.float32)
chords=[[220,261.63,329.63],[174.61,220,261.63],[130.81,196,261.63],[196,246.94,293.66]]
seg=total/ (len(chords)*2)
for j in range(len(chords)*2):
    a0=int(j*seg*SR); a1=min(N,int((j+1)*seg*SR)+SR); ts=tt[a0:a1]-tt[a0]
    e=np.minimum(1,ts/1.5)*np.minimum(1,(ts[-1]-ts+1e-3)/1.0)
    for fr in chords[j%len(chords)]:
        pad[a0:a1]+=(np.sin(2*np.pi*fr*ts)+0.3*np.sin(2*np.pi*fr*2*ts))*e*0.018
fade=np.minimum(1,np.minimum(tt/1.0,(total-tt)/1.5)); pad*=fade
mix=voice*1.0+sfx+pad
mix/=max(1,np.abs(mix).max()/0.97)
w=wave.open("build/mix.wav","wb"); w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
w.writeframes((mix*32767).astype(np.int16).tobytes()); w.close()
json.dump(dict(fps=FPS,total=round(total,3),scenes=scenes,env=[round(float(v),2) for v in sm]),open("build/timeline.json","w"),ensure_ascii=False)
print("total",round(total,2),"frames",nf)
