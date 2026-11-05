"""Put the speaker's REAL video on top of a rendered 3D video as a sticker head (oval cut, white outline),
like the photo narrator but with real lip movement. Used for «talking-head → full 3D» remakes.
  python3 speaker_inset.py <proj> [in=build/video.mp4] [out=build/final.mp4]
Reads project.json "speakerVideo" (the edited talking-head clip, same timeline as build/timeline.json, e.g. build/base_edit.mp4)
and optional "speakerFace": {"cx":540,"cy":700,"w":620,"h":740} = face box in that clip (1080x1920 pixels).
Scene "avatar" in timeline.json decides placement: hero (big, top centre), corner (bottom left), hidden.
Audio is taken from the speaker video."""
import json, os, subprocess, sys
from PIL import Image, ImageDraw, ImageFilter
P=os.path.abspath(sys.argv[1]); IN=sys.argv[2] if len(sys.argv)>2 else f'{P}/build/video.mp4'; OUT=sys.argv[3] if len(sys.argv)>3 else f'{P}/build/final.mp4'
pj=json.load(open(f'{P}/project.json')); tl=json.load(open(f'{P}/build/timeline.json'))
F=pj.get('speakerFace',{'cx':540,'cy':700,'w':620,'h':740}); SV=os.path.join(P,pj['speakerVideo'])
w,h=F['w'],F['h']; x0,y0=F['cx']-w//2,F['cy']-h//2; B=12  # white outline thickness (px at crop scale)
mask=Image.new('L',(w,h),0); ImageDraw.Draw(mask).ellipse((B,B,w-B,h-B),fill=255); mask=mask.filter(ImageFilter.GaussianBlur(1.2)); mask.save(f'{P}/build/sp_mask.png')
ring=Image.new('RGBA',(w,h),(0,0,0,0)); ImageDraw.Draw(ring).ellipse((2,2,w-2,h-2),outline=(255,255,255,255),width=B+2); ring.save(f'{P}/build/sp_ring.png')
def spans(mode):
    out=[]
    for s in tl['scenes']:
        if s.get('avatar','corner')==mode: out.append((s['start'],s['start']+s['dur']))
    return '+'.join(f'between(t,{a:.3f},{b:.3f})' for a,b in out) or '0'
CW=420; HW=560; ch=int(CW*h/w); hh=int(HW*h/w)
fg=(f"[1:v]crop={w}:{h}:{x0}:{y0},format=rgba[c];[2:v]format=gray[m];[c][m]alphamerge[cm];[cm][3:v]overlay=0:0[st];[st]split[s1][s2];"
    f"[s1]scale={CW}:{ch}[sc];[s2]scale={HW}:{hh}[sh];"
    f"[0:v][sh]overlay={(1080-HW)//2}:150:enable='{spans('hero')}'[v1];[v1][sc]overlay=14:{1690-ch}:enable='{spans('corner')}',format=yuv420p[v]")
subprocess.run(['ffmpeg','-v','error','-y','-i',IN,'-i',SV,'-loop','1','-i',f'{P}/build/sp_mask.png','-loop','1','-i',f'{P}/build/sp_ring.png','-filter_complex',fg,
  '-map','[v]','-map','1:a','-shortest','-c:v','libx264','-preset','slow','-crf','18','-maxrate','12M','-bufsize','24M','-c:a','aac','-b:a','192k','-movflags','+faststart',OUT],check=True)
print(OUT)
