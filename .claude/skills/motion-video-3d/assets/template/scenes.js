// Scenes for this project. One scene() per id in scenes.json. See references/scene-api.md.
import * as E from '/engine/engine.js';
const {THREE,scene,head,chipH,stamp,stampShake,counter,P,eo,eb,eio,M,box,G,noiseGround,sunDisc,train,folk,dustPoints}=E;

scene('hook',{acc:'#ffd166',
  env:{bg:[[0,'#0d1020'],[.6,'#1f2740'],[1,'#3a4466']],fog:['#1f2740',14,60],hemi:['#8fa3d9','#1b1b24',.8],sun:['#ffd9a0',2.2,[-8,6,-10]],bloom:.6},
  build(g){g.add(noiseGround(160,160,30,0,'#2a3048'));g.add(box(80,.15,1.6,'#4e4a48',0,.07,0));
    this.tr=train(7);g.add(this.tr);this.d=dustPoints(250,'#cfd8ff');g.add(this.d);
    const head=new THREE.PointLight('#ffe0a0',20,10);head.position.set(1.8,1.6,0);this.tr.add(head)},
  update(t){this.tr.position.x=-6+t*3.2;this.d.position.x=-t*.6;
    return {cam:[[3,2.6,11],[1,1.4,0]],html:head(t,[['Корейлер',110,'#fff',.4],['Қызылордаға',96,'#ffd166',.8],['қалай жеткен?',90,'#ffd166',1.2]],820)}}});

scene('myth',{acc:'#e53935',
  env:{bg:[[0,'#0b0c14'],[1,'#22283c']],fog:['#151a28',12,50],hemi:['#7f8fbf','#111',.7],sun:['#ffd9a0',2.0,[-6,6,-8]]},
  build(g){g.add(noiseGround(160,160,30,0,'#262b3f'));g.add(box(80,.15,1.6,'#4e4a48',0,.07,0));this.tr=train(7);g.add(this.tr)},
  update(t){this.tr.position.x=12+t*3.2;
    return {cam:[[stampShake(t,1.6),2.4,11],[0,1.6,0]],html:chipH(t,.2,'🎫 «Өз еркімен келді»','#1e2430','#fff',560,'font-size:50px')+stamp(t,1.6,'Қателесесің',660)}}});

scene('count',{acc:'#ffb74d',
  env:{bg:[[0,'#2b2420'],[1,'#4a3a2c']],fog:['#2b2420',14,50],hemi:['#ffe2c0','#2b2420',.9],sun:['#ffd9a0',2.4,[5,8,8]]},
  build(g){g.add(noiseGround(160,160,30,.3,'#b89a6a'));this.ppl=[];const cols=['#455a64','#5d4037','#37474f','#6d4c41'];
    for(let i=0;i<24;i++){const p=folk(cols[i%4],'plain');p.scale.setScalar(.55);p.position.set(-5+(i%8)*1.4+(((i/8)|0)%2)*.7,0,-((i/8)|0)*1.6);g.add(p);this.ppl.push(p)}},
  update(t){this.ppl.forEach((p,i)=>p.scale.setScalar(Math.max(.001,.55*eb(P(t,.6+i*.04,.9+i*.04)))));
    return {cam:[[0,4.2,12-t*.4],[0,1.2,-1]],html:head(t,[['1937',190,'#fff',.1]],200)+(t>1.2?`<div class="head" style="top:470px"><div class="hl" style="font-size:150px;color:#ffb74d;${E.SH};${E.pop(t,1.2)}">${counter(t,1.2,170000,{suffix:'+'})}</div></div>`:'')}}});
