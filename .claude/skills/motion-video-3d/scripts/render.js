// Render frames of a motion-video-3d project with headless Chromium.
// usage: node render.js <projectDir> preview            -> build/preview/NN_id.jpg (one frame per scene, at 75%)
//        node render.js <projectDir> at <sec> [sec...]  -> build/at/t<sec>.jpg
//        node render.js <projectDir> frames <w> <n>     -> build/frames/NNNNN.jpg (worker w of n; skips existing = resumable)
const path=require('path'),fs=require('fs'),http=require('http');
const HOME=process.env.MV3D_HOME||path.join(require('os').homedir(),'.cache','motion-video-3d');
let PW;try{PW=require('playwright')}catch(e){PW=require(require.resolve('playwright',{paths:[process.cwd(),HOME,'/usr/lib/node_modules','/usr/local/lib/node_modules']}))}const {chromium}=PW;
const SK=path.resolve(__dirname,'..'),PROJ=path.resolve(process.argv[2]),mode=process.argv[3];
const tl=JSON.parse(fs.readFileSync(path.join(PROJ,'build/timeline.json'),'utf8'));
const ROUTES={'/engine/':path.join(SK,'assets/engine'),'/fonts/':path.join(SK,'assets/fonts'),'/three/':path.join(HOME,'node_modules/three'),'/project/':PROJ};
const MIME={'.html':'text/html','.js':'text/javascript','.woff2':'font/woff2','.json':'application/json','.png':'image/png','.jpg':'image/jpeg'};
const srv=http.createServer((q,r)=>{const u=decodeURIComponent(q.url.split('?')[0]);let f=null;
  if(u==='/'||u==='/index.html')f=path.join(SK,'assets/engine/scene.html');else for(const [k,d] of Object.entries(ROUTES))if(u.startsWith(k)){f=path.join(d,u.slice(k.length));if(!f.startsWith(d))f=null;break}
  if(!f||!fs.existsSync(f)){r.writeHead(404);return r.end('nf '+u)}r.writeHead(200,{'content-type':MIME[path.extname(f)]||'application/octet-stream'});fs.createReadStream(f).pipe(r)});
srv.listen(0,'127.0.0.1',async()=>{
  const b=await chromium.launch({args:['--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
  const p=await b.newPage({viewport:{width:1080,height:1920}});let err=null;
  p.on('pageerror',e=>{err=e;console.error('PAGE ERROR',e.message)});p.on('console',m=>{if(m.type()==='error')console.error('CONSOLE',m.text())});
  await p.goto(`http://127.0.0.1:${srv.address().port}/`);
  await p.waitForFunction(()=>window.READY===true,null,{timeout:60000}).catch(()=>{console.error('page never became READY',err&&err.message);process.exit(1)});
  await p.evaluate(tl=>setup(tl),tl);const stg=await p.$('#stage');
  const shot=async(T,file)=>{await p.evaluate(T=>render(T),T);await stg.screenshot({path:file,type:'jpeg',quality:92})};
  const out=d=>{const o=path.join(PROJ,'build',d);fs.mkdirSync(o,{recursive:true});return o};
  if(mode==='preview'){const o=out('preview');for(const [i,s] of tl.scenes.entries())await shot(s.start+s.dur*.75,path.join(o,`${String(i).padStart(2,'0')}_${s.id}.jpg`))}
  else if(mode==='at'){const o=out('at');for(const a of process.argv.slice(4))await shot(+a,path.join(o,`t${a}.jpg`))}
  else if(mode==='frames'){const w=+process.argv[4],n=+process.argv[5],N=Math.ceil(tl.total*tl.fps),o=out('frames');
    for(let f=w;f<N;f+=n){const fn=path.join(o,String(f).padStart(5,'0')+'.jpg');if(fs.existsSync(fn))continue;const tmp=fn+'.tmp.jpg';await shot(f/tl.fps,tmp);fs.renameSync(tmp,fn)}}
  else{console.error('unknown mode');process.exit(2)}
  await b.close();srv.close();if(err)process.exit(1)});
