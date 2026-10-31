// usage: node render.js preview | node render.js frames <worker> <nworkers>
const {chromium}=require('playwright');const fs=require('fs');const path=require('path');
const tl=JSON.parse(fs.readFileSync('build/timeline.json','utf8'));
(async()=>{
  const mode=process.argv[2];const b=await chromium.launch();
  const p=await b.newPage({viewport:{width:1080,height:1920}});
  await p.goto('file://'+path.resolve('scene.html'));
  await p.evaluate(tl=>setup(tl),tl);
  await p.evaluate(()=>document.fonts.ready);
  const st=await p.$('#stage');
  if(mode==='preview'){
    fs.mkdirSync('build/preview',{recursive:true});
    for(const [i,s] of tl.scenes.entries()){const T=s.start+s.dur*0.75;
      await p.evaluate(T=>render(T),T);await st.screenshot({path:`build/preview/${String(i).padStart(2,'0')}_${s.id}.jpg`,type:'jpeg',quality:80});}
  } else {
    const w=+process.argv[3],n=+process.argv[4];const N=Math.ceil(tl.total*tl.fps);fs.mkdirSync('build/frames',{recursive:true});
    for(let f=w;f<N;f+=n){await p.evaluate(T=>render(T),f/tl.fps);await st.screenshot({path:`build/frames/${String(f).padStart(5,'0')}.jpg`,type:'jpeg',quality:90});}
  }
  await b.close();
})();
