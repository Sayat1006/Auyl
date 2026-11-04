"""Trim TTS breaths, lay scenes on a timeline, build mouth envelope, mix + master audio.
  python3 build_timeline.py <projectDir>
-> build/timeline.json (scenes with start/dur/aStart/aDur + per-frame mouth envelope), build/master.wav (-14 LUFS stereo 48k)
Scene timing = 0.25s lead + speech + 0.45s tail (+ "pad" seconds from scenes.json; last scene +1.6s).
project.json "music": "pad" (quiet generated chords, default) | "none" (add music later in TikTok/Reels).
Deliberately NO noise 'whoosh' at transitions: filtered noise sounds like sniffing at every sentence end."""
import json, wave, os, sys, subprocess, numpy as np
P=os.path.abspath(sys.argv[1]); FPS=30; SR=44100
pj=json.load(open(f'{P}/project.json')) if os.path.exists(f'{P}/project.json') else {}
sc=json.load(open(f'{P}/scenes.json')); n=len(sc)
def rd(f):
    w=wave.open(f); a=np.frombuffer(w.readframes(w.getnframes()),dtype=np.int16).astype(np.float32)/32768
    if w.getframerate()!=SR: raise SystemExit(f'{f}: expected {SR} Hz')
    win=SR//100; r=np.array([np.sqrt(np.mean(a[i:i+win]**2)) for i in range(0,len(a)-win,win)])
    on=np.where(r>10**(-38/20))[0]
    if len(on)==0: return a
    s0=max(0,on[0]*win-win); s1=min(len(a),(on[-1]+1)*win+4*win); a=a[s0:s1].copy()
    fi=int(.01*SR); fo=int(.08*SR); a[:fi]*=np.linspace(0,1,fi); a[-fo:]*=np.linspace(1,0,fo)**2; return a
LEAD=0.25; PAD=0.45; t=0.0; scenes=[]; clips=[]
KEEP=('id','sub','avatar','emoji','noSub','cut')
for i,s in enumerate(sc):
    a=rd(f'{P}/build/audio/{i:02d}.wav'); d=len(a)/SR
    dur=LEAD+d+PAD+s.get('pad',0)+(1.6 if i==n-1 else 0)
    e={k:s[k] for k in KEEP if k in s}; e.update(start=round(t,3),dur=round(dur,3),aStart=LEAD,aDur=round(d,3),silent=bool(s.get('silentAvatar')))
    scenes.append(e); clips.append((t+LEAD,a,bool(s.get('silentAvatar')))); t+=dur
total=t; N=int(np.ceil(total*SR)); voice=np.zeros(N,np.float32); mouthsrc=np.zeros(N,np.float32)
for st,a,sil in clips:
    k=int(st*SR); voice[k:k+len(a)]+=a
    if not sil: mouthsrc[k:k+len(a)]+=a   # quotes read by "another person" don't move the narrator's mouth
nf=int(np.ceil(total*FPS)); hop=SR//FPS; env=np.zeros(nf)
for f in range(nf):
    seg=mouthsrc[f*SR//FPS:f*SR//FPS+hop]; env[f]=np.sqrt(np.mean(seg**2)) if len(seg) else 0
ref=np.percentile(env[env>0.005],92) if (env>0.005).any() else 1
env=np.clip(env/ref,0,1); env[env<0.12]=0
for f in range(1,nf): env[f]=max(env[f],env[f-1]*0.55)
tt=np.arange(N)/SR; pad=np.zeros(N,np.float32)
if pj.get('music','pad')=='pad':
    chords=[[220,261.63,329.63],[174.61,220,261.63],[130.81,196,261.63],[196,246.94,293.66]]; seg=total/8
    for j in range(8):
        a0=int(j*seg*SR); a1=min(N,int((j+1)*seg*SR)+SR); ts=tt[a0:a1]-tt[a0]
        e=np.minimum(1,ts/1.5)*np.minimum(1,(ts[-1]-ts+1e-3)/1.0)
        for fr in chords[j%4]: pad[a0:a1]+=(np.sin(2*np.pi*fr*ts)+0.3*np.sin(2*np.pi*fr*2*ts))*e*0.018
    pad*=np.minimum(1,np.minimum(tt/1.0,(total-tt)/1.5))
mix=voice+pad; mix/=max(1,np.abs(mix).max()/0.97)
w=wave.open(f'{P}/build/mix.wav','wb'); w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((mix*32767).astype(np.int16).tobytes()); w.close()
subprocess.run(['ffmpeg','-v','error','-y','-i',f'{P}/build/mix.wav','-af','highpass=f=70,acompressor=threshold=-20dB:ratio=3:attack=5:release=120,loudnorm=I=-14:TP=-1.5:LRA=9,aresample=48000','-ac','2','-ar','48000',f'{P}/build/master.wav'],check=True)
json.dump(dict(fps=FPS,total=round(total,3),scenes=scenes,env=[round(float(v),2) for v in env]),open(f'{P}/build/timeline.json','w'),ensure_ascii=False)
print(f'total {total:.2f}s, {nf} frames, {n} scenes')
