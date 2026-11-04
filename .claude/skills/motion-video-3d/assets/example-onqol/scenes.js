// Example project: «Оң қол» reader review (16 scenes, 3D + motion graphics, photo narrator).
import * as E from '/engine/engine.js';
const {THREE,scene,SC,st,head,chipH,chipAt,pop,exitP,SH,P,eo,eio,eb,bounce,cl,rnd,M,B,mesh,box,cyl,sph,G,canvasTex,ctxText,noiseGround,ext,heartShape,starShape,
  house,person,hand,curl,book,coverTex,spineTex,pageTex,room,dustPoints,SKIN}=E;
const ACC={hook:'#ff4d4d',reader:'#ffd166',born:'#ffb74d',works:'#ffd166',prize:'#ffc107',young:'#ff4d4d',alma:'#4fc3f7',night:'#ff4d4d',tied:'#ff7043',love:'#ff5c8a',end:'#ffd166',op1:'#ff4d4d',op2:'#90caf9',op3:'#ffc107',quote:'#ffd166',cta:'#ffb74d'};
// hand: palm + 4 fingers + thumb, fingers curl with c (0..1)
scene('hook',{env:{bg:[[0,'#07070c'],[.6,'#1a0b10'],[1,'#3a0f16']],fog:['#1a0b10',8,30],hemi:['#552233','#000000',.5],sun:['#ff3b3b',4,[0,4,-8]]},
  build(g){g.add(mesh(new THREE.PlaneGeometry(60,60).rotateX(-Math.PI/2),M('#140a0d'),0,0,0));this.h=hand(SKIN);g.add(this.h);this.d=dustPoints(250,'#ff8a80');g.add(this.d);
    const fill=new THREE.PointLight('#ffc8b8',40,14);fill.position.set(1.5,2.5,4.5);g.add(fill)},
  update(t){const r=eo(P(t,.1,1.6));this.h.position.set(0,-3.2+r*3.4,0);this.h.rotation.set(-.15,Math.sin(t*.6)*.25,.05);curl(this.h,.15+.65*eio(P(t,1.6,3.2)),t);this.d.position.y=t*.15;
    return {cam:[[0,1.6,7-t*.4],[0,1.4,0]],html:head(t,[['Өз қолың',110,'#fff',.1],['жау болса?',132,'#ff4d4d',.7]],780)}}});

scene('reader',{env:{bg:[[0,'#2b1d14'],[1,'#4a3220']],fog:['#2b1d14',14,40],hemi:['#ffe2b8','#2b1d14',.8],sun:['#ffe0b0',2.4,[-5,9,6]],lamp:[2.5,3.2,-.5,40]},
  build(g){g.add(box(16,.4,12,M('#6d4c41',{flatShading:false,roughness:.5}),0,-.2,0));
    const L=mesh(new THREE.PlaneGeometry(2.2,3).rotateX(-Math.PI/2),new THREE.MeshStandardMaterial({map:pageTex(3),roughness:.9}),-1.12,.08,0);L.rotation.z=.06;g.add(L);
    const R=mesh(new THREE.PlaneGeometry(2.2,3).rotateX(-Math.PI/2),new THREE.MeshStandardMaterial({map:pageTex(5),roughness:.9}),1.12,.08,0);g.add(R);
    g.add(box(4.6,.1,3.2,'#7f1d1d',0,.0,0));const piv=new THREE.Group();piv.position.set(0,.1,0);g.add(piv);this.pg=piv;const fp=mesh(new THREE.PlaneGeometry(2.2,3),new THREE.MeshStandardMaterial({map:pageTex(9),side:THREE.DoubleSide,roughness:.9}),1.1,0,0);fp.rotation.x=-Math.PI/2;piv.add(fp);
    g.add(G(cyl(.4,.35,.9,M('#eeeeee',{flatShading:false}),3.4,.45,-1.6),cyl(.36,.36,.05,'#4e342e',3.4,.88,-1.6)));
    const lb=G(cyl(.5,.6,.12,'#333',0,0,0),cyl(.05,.05,2.4,'#333',0,1.2,0),mesh(new THREE.ConeGeometry(.6,.7,20,1,true),M('#7f1d1d',{side:THREE.DoubleSide}),.5,2.3,0));lb.position.set(3.6,0,-2.4);g.add(lb)},
  update(t){const f=(t*.45)%1;this.pg.rotation.z=eio(cl(f*1.6))*Math.PI*.98;const k=eio(P(t,0,5));
    return {cam:[[1.5-k*1.5,5.6-k*.8,5.2-k*.8],[0,0,.2]],html:head(t,[['Оқырман',120,'#fff',.1],['пікірі',120,'#ffd166',.45]],230)+chipH(t,1.4,'📖 Төлен Әбдік · «Оң қол»','#ffd166','#2b1d14',560,'font-size:44px')}}});

scene('born',{env:{bg:[[0,'#3b4b7a'],[.55,'#e7a46b'],[1,'#ffd9a0']],fog:['#f0b98a',15,70],hemi:['#ffe4c2','#8a6d45',1.0],sun:['#ffcf8a',2.6,[-10,6,-12]]},
  build(g){g.add(noiseGround(160,160,50,.5,'#c9a46a'));const s=new THREE.Mesh(new THREE.CircleGeometry(5,48),B('#ffe0a0',{fog:false}));s.position.set(-8,4,-60);g.add(s);
    this.hs=[];[[-2.5,0,-1],[0,0,-2.5],[2.6,0,-.6],[5,0,-3]].forEach(([x,y,z],i)=>{const h=house(['#e8d6b0','#d7c4a0'][i%2],'#8d5b3a');h.position.set(x,y,z);h.rotation.y=(rnd()-.5)*.5;g.add(h);this.hs.push(h)});
    this.pin=G(sph(.6,M('#e53935',{flatShading:false,roughness:.35}),0,1.4,0,24),mesh(new THREE.ConeGeometry(.47,1.1,24).rotateX(Math.PI),M('#e53935',{flatShading:false}),0,.65,0),sph(.25,'#fff',0,1.4,.47,16));g.add(this.pin)},
  update(t){this.hs.forEach((h,i)=>h.scale.setScalar(Math.max(.001,eb(P(t,.2+i*.12,.6+i*.12)))));const pp=P(t,1.0,1.8);this.pin.position.set(0,2.6+(1-bounce(pp))*9,-1.6);this.pin.rotation.y=t*1.4;this.pin.visible=pp>0;
    const k=eio(P(t,0,5.5));
    return {cam:[[-3+k*3,3.5,11-k*2],[0,2.4,-1]],html:head(t,[[String(Math.round(1900+42*eo(P(t,.1,1.3)))),220,'#fff',0]],170)+chipH(t,1.6,'📍 Қостанай облысы, Жангелді ауданы','#fff','#b23a2a',520,'font-size:40px')}}});

const WORKS=[['Парасат майданы','#1f3a5f'],['Ақиқат','#5d1f1f'],['Әке','#2f4a2f'],['Өліара','#4a3a1f']];
scene('works',{env:{bg:[[0,'#1d1712'],[1,'#3b2c20']],fog:['#241b14',14,40],hemi:['#ffe7c4','#1d1712',.9],sun:['#ffe7c4',2.2,[4,8,10]]},
  build(g){g.add(box(12,9,.4,M('#4e342e',{flatShading:false}),0,3,-1.2));[0.2,2.6,5.0].forEach(y=>g.add(box(8.4,.18,2,'#6d4c41',0,y,0)));
    this.bk=[];const cols=['#37474f','#6d4c41','#455a64','#3e2723','#4e342e','#263238','#5d4037'];let x=-3.9;
    for(let r=0;r<3;r++){x=-3.9;while(x<3.8){const w=.25+rnd()*.15,h=1.6+rnd()*.5;const b=book(null,null,cols[(rnd()*7)|0],w,h,1.4);b.position.set(x+w/2,[0.2,2.6,5.0][r]+.09+h/2,0);g.add(b);x+=w+.03}}
    WORKS.forEach(([t,c],i)=>{const b=book(coverTex(t,c),spineTex(t,c),c,.4,2.3,1.6);b.rotation.y=-Math.PI/2;g.add(b);this.bk.push(b)})},
  update(t){this.bk.forEach((b,i)=>{const p=eo(P(t,.3+i*.7,1.0+i*.7));const tx=(i%2?.85:-.85),ty=(i<2?3.75:1.55);b.scale.setScalar(.8);b.position.set(tx,ty+(1-p)*-7,2.2);b.rotation.set(0,Math.PI/2-p*Math.PI,Math.sin(t*1.5+i)*.04*p);b.visible=p>0});
    const k=eio(P(t,0,4.5));
    return {cam:[[0,2.8,11.5-k*.8],[0,2.7,0]],html:head(t,[['Шығармалары',110,'#ffd166',.1]],240)}}});

scene('prize',{env:{bg:[[0,'#1b1530'],[1,'#3b2a5a']],fog:['#2a2045',14,40],hemi:['#fff3d6','#1b1530',1.0],sun:['#fff0c0',3,[3,6,8]]},
  build(g){const mt=canvasTex(512,512,(x,w,h)=>{const gr=x.createRadialGradient(w/2,h/2,40,w/2,h/2,w/2);gr.addColorStop(0,'#ffe082');gr.addColorStop(1,'#c99a1e');x.fillStyle=gr;x.fillRect(0,0,w,h);x.strokeStyle='#8d6e00';x.lineWidth=14;x.beginPath();x.arc(w/2,h/2,220,0,7);x.stroke();
      ctxText(x,'ҚР',90,'#6d4c00',w/2,h/2-70);ctxText(x,'МЕМЛЕКЕТТІК',44,'#6d4c00',w/2,h/2+20);ctxText(x,'СЫЙЛЫҒЫ',52,'#6d4c00',w/2,h/2+80)});
    const gold=M('#d4a62a',{metalness:.85,roughness:.28,flatShading:false});const face=new THREE.MeshStandardMaterial({map:mt,metalness:.6,roughness:.35});
    this.m=G();const d=mesh(new THREE.CylinderGeometry(1.6,1.6,.22,64),gold);d.rotation.x=Math.PI/2;this.m.add(d);const fc=new THREE.Mesh(new THREE.CircleGeometry(1.5,64),face);fc.position.z=.12;this.m.add(fc);
    const rib=G(box(.7,2.4,.05,'#1565c0',-.35,2.4,-.1),box(.7,2.4,.05,'#ffd54f',.35,2.4,-.1));rib.children[0].rotation.z=.25;rib.children[1].rotation.z=-.25;this.m.add(rib);g.add(this.m);
    this.conf=new THREE.InstancedMesh(new THREE.PlaneGeometry(.12,.2),new THREE.MeshStandardMaterial({side:THREE.DoubleSide,roughness:.5}),160);const cc=['#ffd166','#ff5c8a','#4fc3f7','#81c784','#fff'];for(let i=0;i<160;i++)this.conf.setColorAt(i,new THREE.Color(cc[i%5]));g.add(this.conf);this.cd=[...Array(160)].map(()=>[(rnd()-.5)*10,rnd()*10,(rnd()-.5)*4,rnd()*6])},
  update(t){const p=eb(P(t,.2,.9));this.m.scale.setScalar(Math.max(.001,p));this.m.position.set(0,.5+Math.sin(t*1.8)*.12,0);this.m.rotation.y=Math.sin(t*1.1)*.5+(1-p)*3;
    const mm=new THREE.Matrix4(),q=new THREE.Quaternion(),e=new THREE.Euler(),v=new THREE.Vector3(),s=new THREE.Vector3(1,1,1);
    this.cd.forEach(([x,y,z,ph],i)=>{const yy=6-((t*1.4+y)%10);e.set(t*3+ph,t*2+ph,0);q.setFromEuler(e);mm.compose(v.set(x+Math.sin(t+ph)*.4,yy,z),q,s.setScalar(t>.6?1:0));this.conf.setMatrixAt(i,mm)});this.conf.instanceMatrix.needsUpdate=true;
    return {cam:[[0,1.4,10],[0,1.6,0]],html:head(t,[['Мемлекеттік',104,'#fff',.1],['сыйлық',130,'#ffc107',.45]],210)+chipH(t,.9,'«Парасат майданы» · 2004','#ffc107','#1b1530',560,'font-size:44px')+chipH(t,3.0,'🏅 Қазақстанның халық жазушысы','#fff','#3b2a5a',1240,'font-size:44px')}}});

scene('young',{env:{bg:[[0,'#120a0c'],[1,'#3a1218']],fog:['#1d0d10',12,40],hemi:['#ffd6d6','#120a0c',.9],sun:['#ffe0d0',2.6,[3,6,8]]},
  build(g){this.b=book(coverTex('ОҢ ҚОЛ','#7f1d1d','ТӨЛЕН ӘБДІК','✋'),spineTex('ТӨЛЕН ӘБДІК · ОҢ ҚОЛ','#7f1d1d'),'#7f1d1d',.4,3.2,2.3);g.add(this.b);this.d=dustPoints(200,'#ffab91');g.add(this.d)},
  update(t){const p=eo(P(t,.1,1.3));this.b.position.set(0,1.5+Math.sin(t*1.6)*.1,0);this.b.rotation.set(.08,-Math.PI/2+(1-p)*5+Math.sin(t*.9)*.25,0);this.b.scale.setScalar(Math.max(.001,eb(P(t,.1,.7))));this.d.position.y=-t*.2;
    const n=Math.round(25*eo(P(t,1.2,2.4)));
    return {cam:[[0,1.6,8.2],[0,1.4,0]],html:head(t,[['Алғашқы',96,'#fff',.1],['әңгімелерінің бірі',76,'#ff8a80',.4]],230)+(t>1.2?`<div style="position:absolute;right:70px;top:1180px;text-align:center;${pop(t,1.2)}"><div class="hl" style="font-size:150px;color:#ffd166;${SH}">${n}</div><div class="hl" style="font-size:46px;color:#fff;${SH}">жасында</div></div>`:'')}}});

scene('alma',{env:{bg:[[0,'#cfe6f0'],[1,'#eef6f9']],fog:['#e8f1f4',14,40],hemi:['#ffffff','#9eb4bd',1.3],sun:['#fffaf0',2.4,[6,8,6]]},
  build(g){this.r=room(g,false)},
  update(t){const k=eio(P(t,0,5));this.r.girl.children[0].rotation.y=Math.sin(t)*.1;
    return {cam:[[3.5-k*2.5,4.2,6.8-k*.6],[-1,1.6,-1.5]],html:head(t,[['Психиатриялық',90,'#1e2430',.1,'text-shadow:0 5px 0 #fff'],['аурухана',120,'#2f5d8c',.45,'text-shadow:0 5px 0 #fff']],210)+chipH(t,1.2,'🩺 Алма · 17 жас','#2f5d8c','#fff',560,'font-size:46px')+chipH(t,3.0,'сырт көзге — сау','#fff','#2f5d8c',660)}}});

scene('night',{env:{bg:[[0,'#05070f'],[1,'#121a33']],fog:['#0b1022',10,30],hemi:['#3a4f8a','#05070f',.55],sun:['#7aa2ff',1.2,[6,8,-2]]},
  build(g){this.r=room(g,true);this.h=hand(SKIN,'#ff2222');this.h.scale.setScalar(.42);g.add(this.h);
    const sp=new THREE.SpotLight('#ffd0c0',60,20,.5,.4,1.2);sp.position.set(2,2.2,3);sp.castShadow=true;sp.shadow.mapSize.set(1024,1024);sp.target.position.set(-2,3,-4);g.add(sp);g.add(sp.target)},
  update(t){const r=eio(P(t,.4,2.6));this.h.position.set(-1.0-r*1.0,1.8+r*.25,-1.0-r*.3);this.h.rotation.set(-1.2+r*.3,0,Math.PI/2+.4-r*.5);curl(this.h,.1+.7*eio(P(t,2.2,3.4)),t);
    this.h.userData.mat.emissiveIntensity=.15+.25*Math.max(0,Math.sin(t*6));const k=eio(P(t,0,4.4));
    const pulse=(.25+.2*Math.max(0,Math.sin(t*5))).toFixed(2);
    return {cam:[[1.2-k*1.2,3.4-k*.4,4.6-k*1],[-1.8,1.7,-1.5]],html:`<div style="position:absolute;inset:0;background:radial-gradient(ellipse at 50% 50%,transparent 45%,rgba(200,0,0,${pulse}) 100%)"></div>`+head(t,[['Оң қолы',130,'#ff4d4d',.1],['тұншықтырады',92,'#fff',.5]],230)}}});

scene('tied',{env:{bg:[[0,'#0a0d18'],[1,'#1c2440']],fog:['#10162c',10,30],hemi:['#55689e','#0a0d18',.7],sun:['#9ab4ff',1.6,[5,8,4]]},
  build(g){g.add(box(12,.2,10,'#2a3550',0,-.1,0));g.add(box(5,.5,2.4,'#cfd8dc',0,1.0,0));g.add(box(5.2,.12,.12,'#90a4ae',0,1.55,1.25));
    {const wl=new THREE.PointLight('#ffd6c0',14,8);wl.position.set(1.2,3,2);g.add(wl)}this.h=hand(SKIN,'#ff2222');this.h.rotation.set(-Math.PI/2,0,0);this.h.position.set(0,1.45,.6);this.h.scale.setScalar(.8);g.add(this.h);
    this.straps=[0,1,2].map(i=>{const s=mesh(new THREE.TorusGeometry(.42,.07,10,32),M('#8d6e63',{flatShading:false}),0,0,0);g.add(s);return s})},
  update(t){const brk=2.4;const tw=t<brk?Math.sin(t*20)*.05*P(t,.8,brk):0;this.h.rotation.set(-Math.PI/2+tw,tw*2,0);curl(this.h,t<brk?.2+.15*Math.sin(t*9):eio(P(t,brk,brk+.6))*.9,t);this.h.position.y=1.45+(t>brk?eo(P(t,brk,brk+.8))*.9:0);
    this.h.userData.mat.emissiveIntensity=t>brk?.4*Math.max(0,Math.sin(t*8)):0;
    this.straps.forEach((s,i)=>{const fly=P(t,brk,brk+.9);s.position.set(0,1.45+(i-.0)*0+fly*(2+i),-.15+i*.45+fly*(i-1)*2);s.rotation.set(fly*5,Math.PI/2+fly*4,0);s.scale.setScalar(1-fly*.6);s.visible=fly<1});
    const sh=t>brk&&t<brk+.25?Math.sin(t*90)*.05:0;
    return {cam:[[2.5+sh,3.6,4.5],[0,1.4,.3]],html:head(t,[['Байлайды…',110,'#fff',.1],['жаңа айла!',120,'#ff7043',brk-.1]],230)}}});

scene('love',{env:{bg:[[0,'#2a1424'],[1,'#5a2a44']],fog:['#3a1a30',12,40],hemi:['#ffd6e6','#2a1424',1.0],sun:['#ffe0ec',2.4,[4,8,6]]},
  build(g){g.add(noiseGround(80,80,10,0,'#3d1f33'));this.doc=person('#f5f5f5');this.doc.position.set(1.4,0,0);this.doc.rotation.y=-.5;g.add(this.doc);
    this.doc.add(mesh(new THREE.TorusGeometry(.3,.03,8,24,Math.PI),M('#455a64'),0,2.0,.35));this.doc.add(box(.5,.12,.05,'#90caf9',.18,1.7,.42));
    this.al=person('#81d4fa','#e3b38a','#3e2723');this.al.position.set(-1.4,0,0);this.al.rotation.y=.5;this.al.scale.setScalar(.9);g.add(this.al);
    this.ht=ext(heartShape(),.35,'#ff5c8a',{emissive:'#ff1f5a',emissiveIntensity:.35});this.ht.geometry.center();g.add(this.ht)},
  update(t){const hp=eb(P(t,1.0,1.6));const beat=1+Math.max(0,Math.sin(t*7))*.12;this.ht.scale.setScalar(Math.max(.001,hp*.8*beat));this.ht.position.set(0,3.0+Math.sin(t*1.5)*.15,0);this.ht.rotation.y=Math.sin(t)*.4;
    const k=eio(P(t,0,6));
    return {cam:[[0,2.6,11-k*1.2],[0,2.6,0]],html:head(t,[['Дәрігер',110,'#fff',.1],['ғашық болады',100,'#ff5c8a',.5]],220)+chipH(t,3.4,'💉 құтқару керек!','#fff','#5a2a44',1240,'font-size:46px')}}});

scene('end',{env:{bg:[[0,'#0d0d10'],[1,'#26201a']],fog:['#15120f',10,30],hemi:['#ffe6c4','#0d0d10',.7],sun:['#ffe0b0',2.4,[-3,7,5]]},
  build(g){g.add(box(14,.3,10,M('#4e342e',{flatShading:false}),0,-.15,0));this.b=book(coverTex('ОҢ ҚОЛ','#7f1d1d','ТӨЛЕН ӘБДІК','✋'),spineTex('ОҢ ҚОЛ','#7f1d1d'),'#7f1d1d',.4,3.2,2.3);this.b.rotation.set(0,0,Math.PI/2);this.b.position.set(0,.2,0);g.add(this.b);
    const qt=canvasTex(256,256,(x,w,h)=>ctxText(x,'?',230,'#ffd166',w/2,h/2+10));this.q=[0,1,2].map(i=>{const m=new THREE.Mesh(new THREE.PlaneGeometry(1.4,1.4),new THREE.MeshBasicMaterial({map:qt,transparent:true}));g.add(m);return m})},
  update(t){this.b.rotation.y=Math.sin(t*.7)*.2-.3;this.q.forEach((m,i)=>{const p=eb(P(t,.4+i*.35,.9+i*.35));m.scale.setScalar(Math.max(.001,p*(i==1?1.3:.8)));m.position.set((i-1)*1.5,1.6+Math.sin(t*2+i)*.15+(i==1?.3:0),0);m.rotation.z=(i-1)*-.25});
    return {cam:[[0,4.0,7.5],[0,1.6,0]],html:head(t,[['Соңы?',150,'#ffd166',.1]],240)+chipH(t,1.8,'📚 Өзің оқып біл!','#ffd166','#26201a',1240,'font-size:48px')}}});

scene('op1',{env:{bg:[[0,'#06060a'],[1,'#1d0b0e']],fog:['#0d0709',10,30],hemi:['#664455','#000000',.6],sun:['#ff6a6a',3,[-3,5,-6]]},
  build(g){g.add(mesh(new THREE.CircleGeometry(4,48).rotateX(-Math.PI/2),M('#1a0d10'),0,0,0));
    const glass=M('#2b2f3a',{flatShading:false,roughness:.25,metalness:.4});this.p=G(mesh(new THREE.CapsuleGeometry(.6,1.6,8,20),glass,0,1.5,0),sph(.48,glass,0,3.0,0,32),mesh(new THREE.CapsuleGeometry(.17,1.1,6,12),glass,-.8,1.6,0).rotateZ(.15));
    this.arm=mesh(new THREE.CapsuleGeometry(.18,1.1,6,12),M('#ff3030',{flatShading:false,emissive:'#ff1a1a',emissiveIntensity:1.2}),.8,1.6,0);this.arm.rotation.z=-.15;this.p.add(this.arm);g.add(this.p);
    const pl=new THREE.PointLight('#ff3030',12,6);pl.position.set(1.1,1.4,.6);this.p.add(pl);this.d=dustPoints(300,'#ff5252',[6,5,6],.05);g.add(this.d)},
  update(t){this.p.rotation.y=Math.sin(t*.5)*.4;this.arm.material.emissiveIntensity=.8+.6*Math.max(0,Math.sin(t*4));this.arm.rotation.z=-.15-Math.max(0,Math.sin(t*1.2))*.5;this.d.rotation.y=t*.3;
    const w=(txt,a,y,x)=>{const p=eo(P(t,a,a+.4)),q=exitP(t);return p>0?`<div class="hl" style="position:absolute;left:${x}px;top:${y}px;font-size:64px;color:#fff;background:#c62828;padding:6px 26px;border-radius:14px;opacity:${p*(1-q)};transform:translateX(${(1-p)*-60}px) rotate(-3deg)">${txt}</div>`:''};
    return {cam:[[0,2.2,7.5-t*.2],[0,1.9,0]],html:head(t,[['Өзіне қарсы',104,'#fff',.1],['күш',150,'#ff4d4d',.5]],210)+w('ҮРЕЙ',2.9,1000,90)+w('КҮДІК',3.5,1130,640)+w('ІШКІ ЖАРА',4.1,1260,250)}}});

scene('op2',{env:{bg:[[0,'#0b1020'],[1,'#22304f']],fog:['#121a30',12,40],hemi:['#bcd4ff','#0b1020',.9],sun:['#cfe0ff',2.4,[4,7,8]]},
  build(g){g.add(box(14,.2,10,M('#1c2540',{flatShading:false,roughness:.2,metalness:.3}),0,-.1,0));
    g.add(box(.18,4.6,.3,M('#b08d57',{metalness:.6,roughness:.35}),0,2.3,0));const glass=mesh(new THREE.BoxGeometry(.04,4.4,.2),new THREE.MeshStandardMaterial({color:'#9ec5ff',transparent:true,opacity:.25,metalness:.9,roughness:.05}),.16,2.6,0);g.add(glass);
    this.a=person('#37474f');this.a.position.set(1.8,0,0);this.a.rotation.y=-Math.PI/2;g.add(this.a);this.b=person('#37474f');this.b.position.set(-1.8,0,0);this.b.rotation.y=Math.PI/2;g.add(this.b);
    this.ba=mesh(new THREE.CapsuleGeometry(.14,.9,6,12),M('#ff3030',{emissive:'#ff1a1a',emissiveIntensity:1}),0,1.6,.55);this.b.add(this.ba)},
  update(t){const k=eio(P(t,0,4.6));this.a.position.y=Math.sin(t*1.5)*.03;this.b.position.y=this.a.position.y;this.ba.rotation.x=-Math.max(0,Math.sin(t*1.4))*.9;
    return {cam:[[.6-k*.6,2.4,10-k*.8],[0,2.2,0]],html:head(t,[['Ең қауіпті жау',96,'#fff',.1],['— өзің?',140,'#90caf9',2.4]],210)}}});

scene('op3',{env:{bg:[[0,'#2b1d14'],[1,'#4a3220']],fog:['#2b1d14',14,40],hemi:['#ffe2b8','#2b1d14',.9],sun:['#ffe0b0',2.6,[-4,8,6]]},
  build(g){g.add(box(16,.4,12,M('#6d4c41',{flatShading:false,roughness:.5}),0,-.2,0));this.b=book(coverTex('ОҢ ҚОЛ','#7f1d1d','ТӨЛЕН ӘБДІК','✋'),spineTex('ОҢ ҚОЛ','#7f1d1d'),'#7f1d1d',.4,3.2,2.3);this.b.rotation.set(0,Math.PI/2,Math.PI/2);this.b.position.set(0,.2,.5);g.add(this.b);
    this.st=[0,1,2,3,4].map(i=>{const s=ext(starShape(),.25,'#ffc107',{metalness:.5,roughness:.3,emissive:'#ff9800',emissiveIntensity:.25});g.add(s);return s})},
  update(t){this.st.forEach((s,i)=>{const p=eb(P(t,2.9+i*.2,3.3+i*.2));s.scale.setScalar(Math.max(.001,p*.55));s.position.set((i-2)*1.25,2.6+Math.sin(t*2+i)*.1,.5);s.rotation.y=(1-p)*4+Math.sin(t+i)*.2});
    const k=eio(P(t,0,5));
    return {cam:[[0,3.6-k*.4,7.5-k*.5],[0,1.8,0]],html:head(t,[['Менің бағам',104,'#fff',.1]],230)+chipH(t,.8,'қысқа · бірақ ойдан шықпайды','#fff','#4a3220',1250,'font-size:42px')+(t>2.9?`<div class="head" style="top:400px"><div class="hl" style="font-size:150px;color:#ffc107;${SH};${pop(t,2.9)}">5 / 5</div></div>`:'')}}});

scene('quote',{env:{bg:[[0,'#0f0c0a'],[1,'#2a211a']],fog:['#17120e',10,40],hemi:['#ffe6c4','#0f0c0a',.8],sun:['#ffe0b0',2.2,[3,6,6]]},
  build(g){this.pp=[...Array(14)].map((_,i)=>{const m=mesh(new THREE.PlaneGeometry(1.1,1.5),new THREE.MeshStandardMaterial({map:pageTex(i+2),side:THREE.DoubleSide,roughness:.9,transparent:true,opacity:.85}),0,0,0);g.add(m);return [m,(rnd()-.5)*10,rnd()*12,-2-rnd()*6,rnd()*6]})},
  update(t){this.pp.forEach(([m,x,y,z,ph])=>{m.position.set(x+Math.sin(t*.5+ph)*.5,((y+t*.5)%12)-4,z);m.rotation.set(Math.sin(t+ph)*.6,t*.4+ph,Math.cos(t*.7+ph)*.4)});
    const words=['Бәрі','«Оң','қол»,','«Оң','қол»','дей','береді.','Менің','«Оралу»','деген','повесім','бар','екенін','білесіңдер','ме','өзі?'];const tot=words.length;const prog=cl((t-.25)/(st.D-1.0))*tot;
    const txt=words.map((w,i)=>{const p=eo(cl(prog-i));const hl=/Оң|қол|Оралу/.test(w);return `<span style="display:inline-block;opacity:${p.toFixed(2)};transform:translateY(${((1-p)*30).toFixed(1)}px);color:${hl?'#ffd166':'#fff'}">${w}</span>`}).join(' ');
    const c=eo(P(t,0,.5));
    return {cam:[[0,0,8],[0,0,0]],html:`<div style="position:absolute;left:70px;right:70px;top:430px;opacity:${c};transform:translateY(${(1-c)*40}px)">
      <div style="font:700 260px/0.6 'PT Serif',Georgia,serif;color:#ffd166;height:120px">“</div>
      <div style="font-weight:700;font-size:72px;line-height:1.28;color:#fff;${SH}">${txt}</div>
      <div style="margin-top:50px;display:flex;align-items:center;gap:20px;opacity:${eo(P(t,1.2,1.7))}"><div style="width:90px;height:8px;background:#ffd166;border-radius:4px"></div><div style="font-weight:700;font-size:52px;color:#ffd166">Төлен Әбдік</div></div></div>`}}});

scene('cta',{env:{bg:[[0,'#3b2a5a'],[.5,'#e98a5e'],[1,'#ffd59a']],fog:['#f2a67a',15,80],hemi:['#ffe4c2','#7a5a3a',1.1],sun:['#ffcf8a',2.8,[-6,8,-14]]},
  build(g){g.add(noiseGround(200,200,40,.4,'#b88a5a'));g.add(box(4,.06,200,'#6d6560',0,.05,-50));for(let i=0;i<40;i++){const d=box(.16,.07,1.4,'#fff',0,.07,6-i*4);d.castShadow=false;g.add(d)}
    const s=new THREE.Mesh(new THREE.CircleGeometry(8,48),B('#ffe0a0',{fog:false}));s.position.set(0,3,-90);g.add(s);
    this.b=book(coverTex('ОРАЛУ','#1f3a5f','ТӨЛЕН ӘБДІК','🏡'),spineTex('ТӨЛЕН ӘБДІК · ОРАЛУ','#1f3a5f'),'#1f3a5f',.4,3.0,2.1);g.add(this.b);
    const gl=new THREE.PointLight('#ffd166',20,8);this.b.add(gl);gl.position.set(1.5,0,0)},
  update(t){const p=eb(P(t,.6,1.3));this.b.scale.setScalar(Math.max(.001,p));this.b.position.set(0,3.0+Math.sin(t*1.6)*.15,-2);this.b.rotation.set(0,-Math.PI/2+Math.sin(t*.8)*.35+(1-p)*3,0);
    return {cam:[[0,2.2,12-t*.6],[0,2.8,-2]],html:head(t,[['Келесі кітап',96,'#fff',.1],['«Оралу»',150,'#ffd166',.5]],200)+chipH(t,2.6,'Оқып, пікіріңді жаз 👇','#ffd166','#3b2a5a',1240,`font-size:50px;margin-top:${Math.abs(Math.sin(t*4))*-14}px`)}}});


for(const k in ACC)if(SC[k])SC[k].acc=ACC[k];
