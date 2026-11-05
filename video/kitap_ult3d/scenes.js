// «Кітап оқитын ұлт» — «Абай жолы» review in the «Оң қол» style: full 3D scenes per caption,
// the speaker's real video is composited as a sticker head (hero in c01, corner after) by speaker_inset.py.
import * as E from '/engine/engine.js';
const {THREE,scene,SC,st,head,chipH,chipAt,pop,exitP,SH,stamp,stampShake,timeline,P,eo,eio,eb,bounce,cl,rnd,M,B,mesh,box,cyl,sph,G,ext,heartShape,starShape,
  noiseGround,dustPoints,sunDisc,yurt,folk,person,tree,book,spineTex,pageTex,imgTex,mapPin,SKIN}=E;
const GOLD='#ffc83d',NAVY='#14213d';
const COVER=()=>imgTex('/project/build/abai_cover.jpg');
const abai=(s=1)=>{const b=book(COVER(),spineTex('МҰХТАР ӘУЕЗОВ · АБАЙ ЖОЛЫ','#8b6b3d'),'#8b6b3d',.4,3.0,2.0);b.scale.setScalar(s);return b};
const W=(c=SKIN)=>M(c,{flatShading:false});
const STEPPE={bg:[[0,'#2c3e6b'],[.55,'#e59a63'],[1,'#ffd9a0']],fog:['#efb486',18,80],hemi:['#ffe4c2','#8a6d45',1.0],sun:['#ffcf8a',2.6,[-8,6,-12]]};
const STUDY={bg:[[0,'#1d1712'],[1,'#3b2c20']],fog:['#241b14',14,40],hemi:['#ffe7c4','#1d1712',.8],sun:['#ffe7c4',2.0,[4,7,8]],bloom:.15,envI:.3};
function aul(g,n=6,r=6){const ys=[];for(let i=0;i<n;i++){const a=i/n*Math.PI*1.2+Math.PI*.9,y=yurt(i%2?'#efe6d2':'#e6dcc4',['#b23a2a','#1f4e8c','#2f6b3a'][i%3]);y.position.set(Math.cos(a)*r,0,Math.sin(a)*r-4);y.rotation.y=-a;g.add(y);ys.push(y)}return ys}
function abaiFigure(){const g=folk('#3e4a3a','plain');g.add(mesh(new THREE.SphereGeometry(.4,20,10,0,Math.PI*2,0,Math.PI*.5),M('#1b1b1b'),0,2.62,0));g.add(mesh(new THREE.ConeGeometry(.22,.5,12).rotateX(Math.PI),M('#5d4a3a'),0,2.15,.28));return g}
function dombra(){const wood=M('#8d5524',{flatShading:false,roughness:.45}),dark=M('#4e2c12',{flatShading:false});
  const g=G(sph(1,wood,0,0,0,32),box(.26,3.4,.14,dark,0,2.2,.05),box(.34,.5,.16,dark,0,4.0,.05),sph(.12,'#222',0,.1,.36,12));g.children[0].scale.set(.85,1.1,.32);
  [-.05,.05].forEach(x=>g.add(cyl(.012,.012,4.2,'#eee',x,1.9,.16,4)));return g}
const S=(id,def)=>scene(id,{acc:GOLD,env:STEPPE,...def});

// c01 hook: the speaker is big at the top (hero) → headline low, book rises under it
S('c01',{acc:GOLD,env:STUDY,build(g){this.b=abai(.9);g.add(this.b);this.d=dustPoints(220,'#ffd59a');g.add(this.d)},
  update(t){const p=eb(P(t,.4,1.2));this.b.position.set(0,-2.35+Math.sin(t*1.6)*.06,0);this.b.rotation.set(.06,-Math.PI/2+(1-p)*4+Math.sin(t)*.2,0);this.b.scale.setScalar(Math.max(.001,.6*p));this.d.position.y=-t*.2;
    return {cam:[[0,0,10],[0,0,0]],html:head(t,[['Абай жолы',120,'#fff',.15],['Мұхтар Әуезов',60,GOLD,.45]],880)+chipH(t,.1,'📚 КІТАП ОҚИТЫН ҰЛТ',100,GOLD,NAVY,'font-size:42px')}}});
// c02 masterpiece: book on a pedestal, golden stars orbit
S('c02',{env:STUDY,build(g){g.add(cyl(1.6,1.8,1.2,M('#3a2c22',{flatShading:false}),0,-1.6,0,48));this.b=abai(1);g.add(this.b);this.s=[0,1,2,3,4].map(i=>{const s=ext(starShape(),.2,GOLD,{metalness:.5,roughness:.3,emissive:'#ff9800',emissiveIntensity:.4});s.scale.setScalar(.35);g.add(s);return s})},
  update(t){this.b.position.set(0,.6+Math.sin(t*1.5)*.1,0);this.b.rotation.set(0,-Math.PI/2+Math.sin(t*.8)*.4,0);this.s.forEach((s,i)=>{const a=t*.9+i*1.257,k=eb(P(t,.3+i*.12,.7+i*.12));s.position.set(Math.cos(a)*2.6,.8+Math.sin(a*2)*.6,Math.sin(a)*1.4);s.rotation.y=a*2;s.scale.setScalar(Math.max(.001,.35*k))});
    return {cam:[[0,1.4,9.5],[0,.5,0]],html:head(t,[['Шедевр',130,GOLD,.1]],200)+chipH(t,.6,'⭐ Қазақ әдебиетінің шедеврі','#fff',NAVY,470,'font-size:44px')}}});
// c03 history & soul of the people: aul at sunset
S('c03',{build(g){g.add(noiseGround(160,160,50,.4,'#c9a46a'));g.add(sunDisc(6,'#ffe0a0',-6,5,-60));this.y=aul(g,7,6.5);this.p=[0,1,2].map(i=>{const f=folk(['#8e2430','#1f3a5f','#3e4a3a'][i],i==1?'saukele':'kalpak');f.scale.setScalar(.7);f.position.set(-1.2+i*1.2,0,1);g.add(f);return f})},
  update(t){this.y.forEach((y,i)=>y.scale.setScalar(Math.max(.001,eb(P(t,.1+i*.08,.5+i*.08)))));const k=eio(P(t,0,4.5));
    return {cam:[[-3+k*3,3.4,12-k*1.5],[0,1.6,-2]],html:head(t,[['Халықтың',96,'#fff',.1],['тарихы мен жаны',80,GOLD,.4]],190)}}});
// c04 the great poet: framed portrait of Abai on an easel
S('c04',{env:STUDY,build(g){const fr=G(box(3.2,4.0,.2,M('#8d6e2f',{metalness:.6,roughness:.35}),0,0,0),box(2.9,3.7,.22,M('#f3ead8',{flatShading:false}),0,0,0));const ph=mesh(new THREE.PlaneGeometry(2.7,3.45),new THREE.MeshStandardMaterial({map:imgTex('/project/build/abai_portrait.jpg'),roughness:.7,envMapIntensity:.2}),0,0,.12);ph.castShadow=false;fr.add(ph);this.f=fr;g.add(fr);this.d=dustPoints(200,'#ffd59a',[8,8,6]);g.add(this.d)},
  update(t){const p=eb(P(t,.05,.7));this.f.position.set(0,1.0,0);this.f.scale.setScalar(Math.max(.001,.9*p));this.f.rotation.set(0,(1-p)*1.3+Math.sin(t*.7)*.06,0);this.d.position.y=t*.15;
    return {cam:[[0,1.0,9.5-t*.3],[0,1.0,0]],html:head(t,[['Ұлы ақын',110,'#fff',.1]],140)+chipH(t,.5,'АБАЙ ҚҰНАНБАЙҰЛЫ · 1845–1904',GOLD,NAVY,1250,'font-size:42px')}}});
// c05 first volume: four volumes, #1 slides out
S('c05',{env:STUDY,build(g){g.add(box(8,.2,2.4,'#6d4c41',0,-1.3,0));this.v=[0,1,2,3].map(i=>{const b=abai(.8);b.rotation.y=0;b.position.set(-1.2+i*.8,0,0);g.add(b);return b})},
  update(t){const p=eo(P(t,.4,1.3));this.v.forEach((b,i)=>{if(i==0){b.position.set(-1.2+p*.9,p*.8,p*2.2);b.rotation.set(0,-p*Math.PI/2,0)}});
    return {cam:[[0,.8,8.5],[0,.2,0]],html:head(t,[['1-том',140,GOLD,.1],['жас Абайдың қалыптасуы',62,'#fff',.4]],170)+chipH(t,1.4,'📖 4 томдық роман-эпопея','#fff',NAVY,1250,'font-size:42px')}}});
// c06 return to the native aul: rider figure walks towards yurts
S('c06',{build(g){g.add(noiseGround(160,160,50,.3,'#c9a46a'));this.y=aul(g,5,5);this.a=abaiFigure();this.a.scale.setScalar(.8);g.add(this.a)},
  update(t){this.a.position.set(0,0,6-t*1.1);this.a.rotation.y=Math.PI;
    return {cam:[[0,2.4,12],[0,1.6,-2]],html:chipH(t,.2,'🏡 Туған ауылға оралу',GOLD,NAVY,160,'font-size:50px')}}});
// c07 growing up: a boy grows into a young man
S('c07',{acc:'#81c784',build(g){g.add(noiseGround(160,160,30,.2,'#b9a06a'));this.p=[.55,.78,1].map((k,i)=>{const f=abaiFigure();f.position.set(-2.4+i*2.4,0,0);g.add(f);return [f,k]})},
  update(t){this.p.forEach(([f,k],i)=>{f.scale.setScalar(Math.max(.001,k*eb(P(t,.15+i*.45,.55+i*.45))));f.rotation.y=Math.sin(t+i)*.25});
    return {cam:[[0,2.6,11],[0,1.6,0]],html:head(t,[['Есею',150,'#fff',.1]],190)}}});
// c08 harsh reality of steppe life: night blizzard
S('c08',{acc:'#90caf9',env:{bg:[[0,'#05070f'],[1,'#1b2440']],fog:['#121a30',8,40],hemi:['#3a4f8a','#05070f',.6],sun:['#9ab4ff',1.4,[5,8,-4]]},
  build(g){g.add(noiseGround(160,160,40,.5,'#dfe7f2'));this.y=aul(g,3,4);this.s=dustPoints(900,'#ffffff',[24,10,20],.07);g.add(this.s)},
  update(t){this.s.position.set(-t*2.5,-((t*1.2)%3),0);return {cam:[[stampShake(t,.4)*0,2.2,10],[0,1.4,-2]],html:head(t,[['Дала өмірінің',84,'#fff',.1],['қатал шындығы',100,'#90caf9',.4]],180)}}});
// c09 grand picture: crane shot over a wide aul
S('c09',{build(g){g.add(noiseGround(200,200,60,.6,'#c9a46a'));g.add(sunDisc(7,'#ffe0a0',0,6,-80));for(let i=0;i<18;i++){const y=yurt();y.position.set((rnd()-.5)*30,0,-rnd()*30);g.add(y)}},
  update(t,D){const k=eio(P(t,0,D));return {cam:[[0,2+k*9,14+k*4],[0,1,-8]],html:head(t,[['Кең тынысты',92,'#fff',.15],['көрініс',112,GOLD,.45]],170)}}});
// c10 Kazakh society: crowd in national dress
S('c10',{build(g){g.add(noiseGround(160,160,30,.2,'#c9a46a'));this.c=[];const cols=['#8e2430','#1f3a5f','#3e4a3a','#6d4c41','#2f5d8c'];
  for(let i=0;i<20;i++){const f=folk(cols[i%5],['kalpak','saukele','plain'][i%3]);f.scale.setScalar(.55);f.position.set(-4+(i%7)*1.3+((i/7|0)%2)*.6,0,-(i/7|0)*1.4);g.add(f);this.c.push(f)}},
  update(t){this.c.forEach((f,i)=>f.scale.setScalar(Math.max(.001,.55*eb(P(t,.1+i*.05,.4+i*.05)))));return {cam:[[0,3.2,10],[0,1,-1.5]],html:chipH(t,.2,'👥 Қазақ қоғамы',GOLD,NAVY,180,'font-size:54px')}}});
// c11 19th century with its traditions
S('c11',{env:STUDY,build(g){this.d=dombra();this.d.position.set(1.6,-1.2,0);this.d.rotation.z=-.5;this.d.scale.setScalar(.8);g.add(this.d);this.y=yurt();this.y.position.set(-1.8,-2.5,-1);g.add(this.y)},
  update(t){this.d.rotation.y=Math.sin(t*.8)*.3;return {cam:[[0,0,10],[0,0,0]],html:head(t,[['XIX',200,GOLD,.05],['ғасыр · дәстүр',72,'#fff',.4]],120)+timeline(t,1.0,['1845','Абай туды'],['1904','дүние салды'],720)}}});
// c12 inner conflicts and injustice: two groups facing, red light
S('c12',{acc:'#ff6b6b',env:{bg:[[0,'#1a0606'],[1,'#3d1010']],fog:['#2a0b0b',10,40],hemi:['#ff8a80','#1a0606',.7],sun:['#ff5252',2.6,[0,6,-6]]},
  build(g){g.add(noiseGround(80,80,10,0,'#3a1a1a'));this.a=[];this.b=[];for(let i=0;i<3;i++){const f=folk('#3e2723','kalpak');f.position.set(-1.5-i*.8,0,i*.6-.6);f.rotation.y=Math.PI/2;f.scale.setScalar(.8);g.add(f);this.a.push(f);const h=folk('#1f3a5f','kalpak');h.position.set(1.5+i*.8,0,i*.6-.6);h.rotation.y=-Math.PI/2;h.scale.setScalar(.8);g.add(h);this.b.push(h)}},
  update(t){const k=Math.sin(t*3)*.08;this.a.forEach(f=>f.position.x+=0);return {cam:[[stampShake(t,1.5),2.6,13],[0,1.4,0]],html:chipH(t,.2,'⚔️ Ішкі қақтығыстар','#fff','#7a1f1f',160,'font-size:52px')+stamp(t,1.5,'Әділетсіздік',300,'#ff4d4d',-6,92)}}});
// c13 depth of Abai's character: portrait closer, warm glow
S('c13',{env:STUDY,build(g){const ph=mesh(new THREE.PlaneGeometry(3.4,4.35),new THREE.MeshStandardMaterial({map:imgTex('/project/build/abai_portrait.jpg'),roughness:.7,envMapIntensity:.2}),0,0,0);this.p=ph;g.add(ph);this.d=dustPoints(300,'#ffd59a',[8,9,6]);g.add(this.d)},
  update(t,D){this.p.scale.setScalar(1+.08*t/D);this.d.position.y=t*.2;return {cam:[[0,.6,8],[0,.6,0]],html:head(t,[['Абай',130,GOLD,.1],['мінезінің тереңдігі',66,'#fff',.4]],120)}}});
// c14 seeks truth, serves his people: walks toward the sunrise
S('c14',{env:{bg:[[0,'#3b2a5a'],[.5,'#e98a5e'],[1,'#ffd59a']],fog:['#f2a67a',15,80],hemi:['#ffe4c2','#7a5a3a',1.1],sun:['#ffcf8a',2.8,[-2,6,-14]]},
  build(g){g.add(noiseGround(200,200,40,.4,'#b88a5a'));g.add(sunDisc(8,'#ffe9b0',0,3,-80));this.a=abaiFigure();g.add(this.a)},
  update(t){this.a.position.set(0,0,2-t*.6);this.a.rotation.y=Math.PI;return {cam:[[1.5,2,8],[0,1.6,-6]],html:head(t,[['Ақиқат',120,'#fff',.1],['іздеген',96,GOLD,.4]],160)+chipH(t,1.6,'халқына қызмет еткен',GOLD,NAVY,1250,'font-size:44px')}}});
// c15 poetic language: dombra + floating letters
S('c15',{env:STUDY,build(g){this.d=dombra();g.add(this.d);this.l=['А','Б','Ә','Қ','Ө','Ү','Ң','Ұ'].map((ch,i)=>{const m=E.textPlane(ch,{color:'#ffd166'});m.scale.setScalar(.6);g.add(m);return [m,i]})},
  update(t){this.d.position.set(0,-1.5,0);this.d.rotation.set(0,Math.sin(t*.6)*.5,-.35);this.l.forEach(([m,i])=>{const a=t*.6+i*.785;m.position.set(Math.cos(a)*2.6,1.2+Math.sin(a*1.3)*1.2,Math.sin(a)*1.5);m.lookAt(0,1,10)});
    return {cam:[[0,.6,10],[0,.4,0]],html:`<div style="position:absolute;left:70px;top:70px;font:700 230px/1 'PT Serif',serif;color:${GOLD};${SH};${pop(t,.05)}">“</div>`+head(t,[['Тілі —',96,'#fff',.15],['поэзия',124,GOLD,.4]],150)}}});
// c16 not just a biography
S('c16',{acc:'#ff6b6b',env:STUDY,build(g){this.b=abai(1);g.add(this.b)},update(t){this.b.position.set(0,.2,0);this.b.rotation.set(.05,-Math.PI/2+Math.sin(t)*.2,0);const p=eio(P(t,.4,.9)),q=exitP(t);
  return {cam:[[0,.4,9],[0,.2,0]],html:`<div style="position:absolute;left:0;right:0;top:170px;display:flex;justify-content:center;opacity:${1-q}"><div class="hl" style="position:relative;font-size:104px;color:#fff;${SH};${pop(t,.05)}">өмірбаян<div style="position:absolute;left:-10px;top:52%;height:14px;width:${(p*105).toFixed(1)}%;background:#ff4d4d;border-radius:7px;transform:rotate(-4deg)"></div></div></div>`+chipH(t,.8,'…ғана емес!','#ff4d4d','#fff',330,'font-size:50px')}}});
// c17 encyclopedia of steppe life: open book with a little aul on its pages
S('c17',{env:STUDY,build(g){const L=mesh(new THREE.PlaneGeometry(2.6,3.4).rotateX(-Math.PI/2),new THREE.MeshStandardMaterial({map:pageTex(3),roughness:.9}),-1.32,0,0),R=mesh(new THREE.PlaneGeometry(2.6,3.4).rotateX(-Math.PI/2),new THREE.MeshStandardMaterial({map:pageTex(7),roughness:.9}),1.32,0,0);L.rotation.z=.08;R.rotation.z=-.08;g.add(L,R,box(5.4,.12,3.6,'#8b6b3d',0,-.08,0));
  this.it=[yurt(),yurt('#e6dcc4','#1f4e8c'),folk('#8e2430','saukele'),folk('#1f3a5f','kalpak'),tree('#7cb342')];this.it.forEach((o,i)=>{o.position.set(-1.8+i*.9,0,.2-(i%2)*.8);g.add(o)})},
  update(t){this.it.forEach((o,i)=>o.scale.setScalar(Math.max(.001,.4*eb(P(t,.4+i*.18,.8+i*.18)))));return {cam:[[0,4.2,6.4],[0,.4,0]],html:head(t,[['Дала өмірінің',84,'#fff',.1],['энциклопедиясы',96,GOLD,.4]],140)}}});
// c18 leaves a strong mark
S('c18',{acc:'#ff5c8a',env:{bg:[[0,'#2a1424'],[1,'#5a2a44']],fog:['#3a1a30',12,40],hemi:['#ffd6e6','#2a1424',1.0],sun:['#ffe0ec',2.4,[4,8,6]]},
  build(g){this.h=ext(heartShape(),.35,'#ff5c8a',{emissive:'#ff1f5a',emissiveIntensity:.5});this.h.geometry.center();g.add(this.h);this.b=abai(.55);g.add(this.b)},
  update(t){const beat=1+Math.max(0,Math.sin(t*6))*.1,p=eb(P(t,.1,.6));this.h.scale.setScalar(Math.max(.001,1.1*p*beat));this.h.position.set(0,1.2,0);this.h.rotation.y=Math.sin(t)*.4;this.b.position.set(0,-1.8,1);this.b.rotation.set(0,-Math.PI/2+Math.sin(t)*.2,0);
    return {cam:[[0,0,9],[0,0,0]],html:chipH(t,.2,'💫 Жүректе терең із қалдырады','#fff','#5a2a44',170,'font-size:48px')}}});
// c19 every reader: readers holding the book, hearts rise
S('c19',{acc:'#ff5c8a',build(g){g.add(noiseGround(80,80,10,0,'#c9a46a'));this.r=[];for(let i=0;i<5;i++){const p=person(['#2f5d8c','#8e2430','#3e4a3a','#6d4c41','#1f3a5f'][i]);const b=abai(.3);b.position.set(0,1.5,.5);b.rotation.y=-Math.PI/2;p.add(b);p.position.set(-3+i*1.5,0,-(i%2));g.add(p);this.r.push(p)}},
  update(t){this.r.forEach((p,i)=>p.scale.setScalar(Math.max(.001,.8*eb(P(t,.1+i*.1,.5+i*.1)))));
    return {cam:[[0,2.4,10],[0,1.4,0]],html:chipH(t,.1,'❤️ Әр оқырманның жүрегінде','#fff','#5a2a44',170,'font-size:48px')+[0,1,2,3,4,5].map(i=>{const k=P(t,.3+i*.2,1.8+i*.2);return k>0&&k<1?`<div style="position:absolute;left:${200+i*130+Math.sin(t*3+i)*20}px;top:${1150-k*700}px;font-size:${60+(i%2)*24}px;opacity:${(1-k).toFixed(2)}">❤️</div>`:''}).join('')}}});
// outro
S('outro',{env:STUDY,build(g){this.b=abai(1.1);g.add(this.b);this.d=dustPoints(250,'#ffd59a');g.add(this.d)},
  update(t){const p=eb(P(t,.2,.9));this.b.position.set(0,-.2+Math.sin(t*1.5)*.08,0);this.b.rotation.set(.06,-Math.PI/2+(1-p)*5+Math.sin(t*.9)*.3,0);this.b.scale.setScalar(Math.max(.001,1.1*p));
    return {cam:[[0,0,10],[0,0,0]],html:head(t,[['Кітап оқитын',104,'#fff',.15],['ұлт',150,GOLD,.45]],150)+chipH(t,1.0,'«Абай жолы» — сіз оқыдыңыз ба?',GOLD,NAVY,1440,'font-size:44px')+chipH(t,1.4,'#КітапОқитынҰлт','rgba(255,255,255,.14)','#fff',1550,'font-size:40px')}}});
