"""Replace a talking-head video's background with a clean colour and shrink the speaker so graphics have room.
  python3 white_bg.py <proj> <raw_video> [--scale 0.78] [--bg "#ffffff"] [--workers 3]
-> <proj>/build/base.mp4 (1080x1920, enhanced audio) which edit_talking_head.py then uses as its source.
Segmentation: rembg u2net_human_seg per frame (~0.4 s/frame/worker on CPU), mask smoothed over 3 frames to avoid edge flicker.
The speaker is scaled by --scale and anchored bottom-centre (top ~(1-scale)*1920 px freed for headlines)."""
import argparse, glob, os, subprocess, sys
from concurrent.futures import ProcessPoolExecutor
ap=argparse.ArgumentParser(); ap.add_argument('proj'); ap.add_argument('raw'); ap.add_argument('--scale',type=float,default=.78); ap.add_argument('--bg',default='#ffffff'); ap.add_argument('--workers',type=int,default=3); a=ap.parse_args()
P=os.path.abspath(a.proj); B=f'{P}/build'; SEG=f'{B}/seg'; os.makedirs(f'{SEG}/f',exist_ok=True); os.makedirs(f'{SEG}/m',exist_ok=True)
os.environ.setdefault('U2NET_HOME',os.path.join(os.environ.get('MV3D_HOME',os.path.expanduser('~/.cache/motion-video-3d')),'u2net'))
if not glob.glob(f'{SEG}/f/*.jpg'):
    subprocess.run(['ffmpeg','-v','error','-y','-i',a.raw,'-vf','fps=30','-q:v','2',f'{SEG}/f/%05d.jpg'],check=True)
frames=sorted(glob.glob(f'{SEG}/f/*.jpg'))
def work(chunk):
    from rembg import remove,new_session
    from PIL import Image
    s=new_session('u2net_human_seg')
    for f in chunk:
        out=f'{SEG}/m/'+os.path.basename(f).replace('.jpg','.png')
        if os.path.exists(out): continue
        remove(Image.open(f).convert('RGB'),session=s,only_mask=True).save(out+'.tmp.png'); os.replace(out+'.tmp.png',out)
    return len(chunk)
if __name__=='__main__':
    todo=[f for f in frames if not os.path.exists(f'{SEG}/m/'+os.path.basename(f).replace('.jpg','.png'))]
    print(f'{len(frames)} frames, {len(todo)} to segment with {a.workers} workers', flush=True)
    if todo:
        n=a.workers; chunks=[todo[i::n] for i in range(n)]
        with ProcessPoolExecutor(n) as ex: list(ex.map(work,chunks))
    S=a.scale; w=int(1080*S)//2*2; h=int(1920*S)//2*2
    fg=(f"[0:v]fps=30,scale=1080:1920:force_original_aspect_ratio=increase:flags=lanczos,crop=1080:1920,unsharp=5:5:0.6:5:5:0.0,eq=contrast=1.05:saturation=1.08:gamma=1.02,format=rgba[v];"
        f"[1:v]scale=1080:1920:flags=bicubic,tmix=frames=3,format=gray[m];[v][m]alphamerge,scale={w}:{h}:flags=lanczos[p];"
        f"color=c={a.bg}:s=1080x1920:r=30[bg];[bg][p]overlay=({1080-w})/2:{1920-h}:shortest=1,format=yuv420p[o]")
    subprocess.run(['ffmpeg','-v','error','-y','-i',a.raw,'-framerate','30','-i',f'{SEG}/m/%05d.png','-filter_complex',fg,'-map','[o]','-map','0:a',
        '-af','highpass=f=80,afftdn=nr=12:nf=-40,acompressor=threshold=-22dB:ratio=3:attack=5:release=150,loudnorm=I=-14:TP=-1.5:LRA=9','-ar','48000',
        '-c:v','libx264','-preset','medium','-crf','17','-pix_fmt','yuv420p','-c:a','aac','-b:a','192k','-shortest',f'{B}/base.mp4'],check=True)
    print(f'{B}/base.mp4  (speaker scale {S}, bg {a.bg})')
