"""Scaffold a project:  python3 new_project.py <dir> [--title "..."] [--tag "@account"]
Creates scenes.json (script), scenes.js (3D scenes), project.json (settings). Fill them, then run the pipeline."""
import argparse, json, os, shutil
ap=argparse.ArgumentParser(); ap.add_argument('dir'); ap.add_argument('--title',default=''); ap.add_argument('--tag',default=''); a=ap.parse_args()
os.makedirs(os.path.join(a.dir,'build'),exist_ok=True); T=os.path.join(os.path.dirname(__file__),'..','assets','template')
for f in ('scenes.json','scenes.js'):
    d=os.path.join(a.dir,f)
    if not os.path.exists(d): shutil.copy(os.path.join(T,f),d)
pj=os.path.join(a.dir,'project.json')
if not os.path.exists(pj): json.dump({'title':a.title,'tag':a.tag,'voice':{'model':'kk-issai-high','spk':'0','speed':0.95},'music':'pad','narrator':{'type':'cartoon'}},open(pj,'w'),ensure_ascii=False,indent=1)
open(os.path.join(a.dir,'.gitignore'),'w').write('build/\n')
print('created',os.path.abspath(a.dir))
