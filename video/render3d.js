// usage: node render3d.js preview | node render3d.js frames <worker> <nworkers> | node render3d.js at <seconds...>
const {chromium}=require('playwright');const fs=require('fs');const path=require('path');const http=require('http');
const ROOT=path.resolve(__dirname,'..');const tl=JSON.parse(fs.readFileSync(path.join(__dirname,'build/timeline.json'),'utf8'));
const MIME={'.html':'text/html','.js':'text/javascript','.woff2':'font/woff2','.json':'application/json'};
const srv=http.createServer((q,r)=>{const f=path.join(ROOT,decodeURIComponent(q.url.split('?')[0]));if(!f.startsWith(ROOT)||!fs.existsSync(f)){r.writeHead(404);return r.end()}r.writeHead(200,{'content-type':MIME[path.extname(f)]||'application/octet-stream'});fs.createReadStream(f).pipe(r)});
srv.listen(0,'127.0.0.1',async()=>{
  const port=srv.address().port;const mode=process.argv[2];
  const b=await chromium.launch({args:['--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
  const p=await b.newPage({viewport:{width:1080,height:1920}});p.on('pageerror',e=>console.error('PAGE',e.message));p.on('console',m=>{if(m.type()==='error')console.error('CONSOLE',m.text())});
  await p.goto(`http://127.0.0.1:${port}/video/scene3d.html`);await p.waitForFunction(()=>window.READY===true);
  await p.evaluate(tl=>setup(tl),tl);const st=await p.$('#stage');
  const shot=async(T,file)=>{await p.evaluate(T=>render(T),T);await st.screenshot({path:file,type:'jpeg',quality:92})};
  if(mode==='preview'){fs.mkdirSync('build/preview3d',{recursive:true});for(const [i,s] of tl.scenes.entries())await shot(s.start+s.dur*.75,`build/preview3d/${String(i).padStart(2,'0')}_${s.id}.jpg`)}
  else if(mode==='at'){fs.mkdirSync('build/at',{recursive:true});for(const a of process.argv.slice(3))await shot(+a,`build/at/t${a}.jpg`)}
  else{const w=+process.argv[3],n=+process.argv[4];const N=Math.ceil(tl.total*tl.fps);fs.mkdirSync('build/frames3d',{recursive:true});const t0=Date.now();
    for(let f=w;f<N;f+=n){const out=`build/frames3d/${String(f).padStart(5,'0')}.jpg`;if(fs.existsSync(out))continue;await shot(f/tl.fps,out);if(w===0&&f%(n*50)===0)console.log('frame',f,'/',N,((Date.now()-t0)/1000).toFixed(0)+'s')}}
  await b.close();srv.close();
});
