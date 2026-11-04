"""Narrator photo -> transparent head-and-shoulders PNG + jaw config in project.json.
Step 1 (find the mouth):  python3 cutout.py <proj> <photo> --grid
   writes build/mouth_grid.jpg: a zoomed face crop with pixel rulers. Look at it and read off
   the lip line (x of mouth centre, y between the lips) and the face width (cheek to cheek at that height).
Step 2 (cut):             python3 cutout.py <proj> <photo> --mouth X,Y --face W
   writes build/avatar.png (background removed with rembg isnet-general-use) and narrator config into project.json."""
import argparse, json, os, sys
from PIL import Image, ImageDraw
ap=argparse.ArgumentParser(); ap.add_argument('proj'); ap.add_argument('photo'); ap.add_argument('--grid',action='store_true')
ap.add_argument('--mouth'); ap.add_argument('--face',type=float); a=ap.parse_args()
P=os.path.abspath(a.proj); os.makedirs(f'{P}/build',exist_ok=True); im=Image.open(a.photo).convert('RGB')
if a.grid:
    W,H=im.size; x0,y0,x1,y1=int(W*.2),int(H*.2),int(W*.8),int(H*.6); z=im.crop((x0,y0,x1,y1)); sc=900/z.width; z=z.resize((900,int(z.height*sc))); d=ImageDraw.Draw(z)
    step=max(10,int(round((x1-x0)/18/10))*10)
    for v in range(x0 - x0%step + step, x1, step): X=(v-x0)*sc; d.line([(X,0),(X,z.height)],fill=(0,90,255)); d.text((X+2,2),str(v),fill=(0,90,255))
    for v in range(y0 - y0%step + step, y1, step): Y=(v-y0)*sc; d.line([(0,Y),(900,Y)],fill=(255,0,0)); d.text((2,Y+1),str(v),fill=(255,0,0))
    z.save(f'{P}/build/mouth_grid.jpg'); print(f'{P}/build/mouth_grid.jpg  (coords are original photo pixels)'); sys.exit()
mx,my=map(float,a.mouth.split(',')); fw=a.face
os.environ.setdefault('U2NET_HOME',os.path.join(os.environ.get('MV3D_HOME',os.path.expanduser('~/.cache/motion-video-3d')),'u2net'))
from rembg import remove, new_session
cut=remove(im,session=new_session('isnet-general-use'),alpha_matting=True,alpha_matting_foreground_threshold=240,alpha_matting_background_threshold=15,alpha_matting_erode_size=8)
L,T=int(mx-1.25*fw),int(my-1.5*fw); R,B=int(mx+1.25*fw),int(my+1.4*fw)
crop=Image.new('RGBA',(R-L,B-T),(0,0,0,0)); crop.alpha_composite(cut.crop((max(0,L),max(0,T),min(cut.width,R),min(cut.height,B))),(max(0,-L),max(0,-T)))
crop.save(f'{P}/build/avatar.png'); cx,cy=mx-L,my-T
jaw=[(-.55,0),(.55,0),(.52,.16),(.36,.31),(.14,.38),(-.14,.38),(-.36,.31),(-.52,.16)]
cfg=dict(type='photo',image='/project/build/avatar.png',w=crop.width,h=crop.height,mouth=dict(x=round(cx),y=round(cy),w=round(.36*fw),drop=round(.065*fw)),
         jaw=[[round(cx+u*fw),round(cy+v*fw)] for u,v in jaw])
cfg['scale']=round(330/crop.width,3); cfg['x']=14; cfg['y']=round(1690-crop.height*cfg['scale'])
cfg['heroScale']=round(540/crop.height,3)  # hero head spans y 150-690; put that scene's headline at top>=760; cfg['heroY']=150
pjf=f'{P}/project.json'; pj=json.load(open(pjf)) if os.path.exists(pjf) else {}; pj['narrator']=cfg; json.dump(pj,open(pjf,'w'),ensure_ascii=False,indent=1)
prev=Image.new('RGBA',crop.size,(40,160,90,255)); prev.alpha_composite(crop); d=ImageDraw.Draw(prev); d.polygon(cfg['jaw'],outline=(255,0,0)); prev.convert('RGB').save(f'{P}/build/avatar_check.jpg')
print('wrote build/avatar.png, build/avatar_check.jpg (red = moving jaw piece; it should cover chin from the lip line down) and project.json narrator')
