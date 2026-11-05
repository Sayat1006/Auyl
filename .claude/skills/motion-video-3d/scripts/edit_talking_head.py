"""Talking-head edit: real footage + motion-graphics overlay (project.json "mode":"overlay").
  python3 edit_talking_head.py <proj> <raw_video>
Needs <proj>/captions.json: [{"t":1.0,"sub":"роман Мухтара Ауэзова **«Путь Абая»**","id":"c01"?}, ...]
  t = caption start in the RAW video (seconds; CapCut/YouTube/Whisper timestamps are fine, ±0.5 s is OK),
  sub = subtitle text with **keywords**. Optional "id" lets scenes.js attach graphics to that caption.
Does:
  1. enhance: upscale to 1080x1920, light sharpen/colour; audio: highpass, denoise, compress, -14 LUFS
  2. tighten pauses (> PAUSE s) to ~0.3 s -> jump cuts, alternating punch-in zoom (1.00 / 1.10) + slow push
  3. snap caption starts to real micro-pauses, map them through the cuts
  4. append an outro of OUTRO s (frozen last frame) for an end card (scene id "outro")
  -> build/base_edit.mp4 (edited footage + audio) and build/timeline.json for render.js / render.sh
Env knobs: PAUSE=0.45 KEEP=0.14 ZOOM=1.10 OUTRO=3.0 FACE_Y=0.35 (vertical face position 0..1 for crop centring)"""
import json, os, re, subprocess, sys
P=os.path.abspath(sys.argv[1]); RAW=os.path.abspath(sys.argv[2]); B=f'{P}/build'; os.makedirs(B,exist_ok=True)
PAUSE=float(os.environ.get('PAUSE',.45)); KEEP=float(os.environ.get('KEEP',.14)); ZOOM=float(os.environ.get('ZOOM',1.10))
OUTRO=float(os.environ.get('OUTRO',3.0)); FACE_Y=float(os.environ.get('FACE_Y',.35)); FPS=30
def run(*a): return subprocess.run(a,check=True,capture_output=True,text=True)
def dur(f): return float(run('ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0',f).stdout)
def silences(f,noise,d):
    err=subprocess.run(['ffmpeg','-i',f,'-af',f'silencedetect=noise={noise}dB:d={d}','-f','null','-'],capture_output=True,text=True).stderr
    st=[float(x) for x in re.findall(r'silence_start: ([-0-9.]+)',err)]; en=[float(x) for x in re.findall(r'silence_end: ([0-9.]+)',err)]
    if len(en)<len(st): en.append(dur(f))
    return list(zip(st,en))
# 1. enhance
base=f'{B}/base.mp4'
if not os.path.exists(base):
    run('ffmpeg','-v','error','-y','-i',RAW,'-vf','scale=1080:1920:force_original_aspect_ratio=increase:flags=lanczos,crop=1080:1920,unsharp=5:5:0.6:5:5:0.0,eq=contrast=1.05:saturation=1.08:gamma=1.02,fps=30',
        '-af','highpass=f=80,afftdn=nr=12:nf=-40,acompressor=threshold=-22dB:ratio=3:attack=5:release=150,loudnorm=I=-14:TP=-1.5:LRA=9','-ar','48000',
        '-c:v','libx264','-preset','medium','-crf','17','-pix_fmt','yuv420p','-c:a','aac','-b:a','192k',base)
D=dur(base)
# 2. keep-segments
sil=[(max(0,s),e) for s,e in silences(base,-40,PAUSE)]
keep=[]; cur=0.0
for s,e in sil:
    if s<=0.05: cur=max(0,e-KEEP); continue                    # leading silence
    if e>=D-0.05: keep.append((cur,min(D,s+KEEP+.1))); cur=None; break  # trailing silence
    keep.append((cur,s+KEEP)); cur=e-KEEP
if cur is not None: keep.append((cur,D))
keep=[(a,b) for a,b in keep if b-a>.4]  # drop tiny blips (breaths, clicks)
def to_edit(t):
    acc=0
    for a,b in keep:
        if t<a: return acc
        if t<=b: return acc+(t-a)
        acc+=b-a
    return acc
edit_len=sum(b-a for a,b in keep)
# 3. captions
caps=json.load(open(f'{P}/captions.json'))
micro=[(e,e-s) for s,e in silences(base,-34,0.12)]   # (pause end, pause length): a phrase usually starts right after one
starts=[]; plain=lambda x: re.sub(r'\*\*','',x)
for i,c in enumerate(caps):
    t=c['t']; lo=starts[-1]+0.05*len(plain(caps[i-1]['sub'])) if starts else 0   # previous caption needs ~50 ms per character
    near=[(m,l) for m,l in micro if max(lo,t-1.2)<=m<=t+1.0]
    st=min(near,key=lambda ml:abs(ml[0]-(t+.3))-0.8*ml[1])[0] if near else max(lo,t+.3)  # prefer long pauses near the timestamp
    if i==0: st=keep[0][0]+KEEP
    starts.append(st)
ends=starts[1:]+[keep[-1][1]-KEEP]
scenes=[]
for i,c in enumerate(caps):
    a,b=to_edit(starts[i]),to_edit(ends[i])
    scenes.append(dict(id=c.get('id',f'c{i+1:02d}'),sub=c['sub'],start=round(a,3),dur=round(max(.4,b-a),3),aStart=0,aDur=round(max(.3,(b-a)*.94),3),cut='soft',avatar='hidden'))
scenes[0]['dur']=round(scenes[0]['dur']+scenes[0]['start'],3); scenes[0]['aDur']=round(scenes[0]['aDur']+scenes[0]['start'],3); scenes[0]['start']=0
last=scenes[-1]; last['dur']=round(edit_len-last['start'],3)
scenes.append(dict(id='outro',sub='',start=round(edit_len,3),dur=OUTRO,aStart=0,aDur=OUTRO,cut='soft',avatar='hidden',noSub=True))
total=edit_len+OUTRO
json.dump(dict(fps=FPS,total=round(total,3),scenes=scenes,env=[0]*int(total*FPS+2),cuts=[[round(a,3),round(b,3)] for a,b in keep]),open(f'{B}/timeline.json','w'),ensure_ascii=False)
# 4. render edited footage: jump cuts with alternating punch-in + slow push, short audio fades (no clicks)
fv=[];fa=[]
for k,(a,b) in enumerate(keep):
    z0=1.0 if k%2==0 else ZOOM; L=b-a
    zx=f'({z0}+0.035*t/{L:.3f})'
    # scale up per frame (scale supports eval=frame + t), then crop a fixed 1080x1920 window (crop x/y may use t)
    fv.append(f"[0:v]trim={a:.3f}:{b:.3f},setpts=PTS-STARTPTS,scale=w='2*trunc(540*{zx})':h='2*trunc(960*{zx})':eval=frame:flags=bicubic,crop=1080:1920:x='(iw-1080)/2':y='(ih-1920)*{FACE_Y}',setsar=1[v{k}]")
    fa.append(f"[0:a]atrim={a:.3f}:{b:.3f},asetpts=PTS-STARTPTS,afade=t=in:d=0.015,afade=t=out:st={max(0,L-0.02):.3f}:d=0.02[a{k}]")
n=len(keep); cat=''.join(f'[v{k}][a{k}]' for k in range(n))
fg=';'.join(fv+fa)+f';{cat}concat=n={n}:v=1:a=1[cv][ca];[cv]tpad=stop_mode=clone:stop_duration={OUTRO}[vo];[ca]apad=pad_dur={OUTRO}[ao]'
open(f'{B}/edit_filter.txt','w').write(fg)
run('ffmpeg','-v','error','-y','-i',base,'-filter_complex_script',f'{B}/edit_filter.txt','-map','[vo]','-map','[ao]','-r','30','-c:v','libx264','-preset','medium','-crf','17','-pix_fmt','yuv420p','-c:a','aac','-b:a','192k',f'{B}/base_edit.mp4')
print(f'raw {D:.1f}s -> edit {edit_len:.1f}s (+{OUTRO}s outro) in {n} cuts; {len(caps)} captions')
for s in scenes: print(f"  {s['id']:<6} {s['start']:6.2f} +{s['dur']:5.2f}  {s['sub'][:60]}")
