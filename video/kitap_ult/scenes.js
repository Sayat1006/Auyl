// «Кітап оқитын ұлт» — talking-head review of «Абай жолы» (Мұхтар Әуезов). Overlay mode: graphics over real footage.
// Layout: speaker's face is y≈420–1100 → headlines in the top band (y 100–380), chips in the lower band (y 1240–1460).
import * as E from '/engine/engine.js';
const {THREE,scene,head,chipH,pop,exitP,SH,P,eo,eb,eio,G,book,coverTex,spineTex,st,mesh}=E;
const GOLD='#ffc83d',NAVY='#14213d';
const ENV={bg:[[0,'#000'],[1,'#000']],fog:['#000',50,200],hemi:['#ffffff','#445',1.3],sun:['#fff6e0',2.6,[3,5,8]]};
const chip=(t,a,txt,y=1290,bg=NAVY,fg='#fff')=>chipH(t,a,txt,bg,fg,y,'font-size:44px;border:3px solid '+GOLD);
const S=(id,acc,html,extra={})=>scene(id,{acc,env:ENV,build(g){extra.build&&extra.build.call(this,g)},update(t,D){extra.update&&extra.update.call(this,t,D);return {cam:[[0,0,10],[0,0,0]],html:html(t,D)}}});
const abaiBook=()=>book(coverTex('АБАЙ ЖОЛЫ','#5a1e1e','МҰХТАР ӘУЕЗОВ','📜'),spineTex('МҰХТАР ӘУЕЗОВ · АБАЙ ЖОЛЫ','#5a1e1e'),'#5a1e1e',.45,3.0,2.1);

// 1. intro: campaign badge + title + 3D book flying in over the lower right
S('c01',GOLD,t=>chip(t,.05,'📚 КІТАП ОҚИТЫН ҰЛТ',110,GOLD,NAVY)+head(t,[['Абай жолы',124,'#fff',.25],['Мұхтар Әуезов',62,GOLD,.55]],200),
  {build(g){this.b=abaiBook();g.add(this.b)},update(t){const p=eb(P(t,.4,1.2)),q=exitP(t);this.b.position.set(1.25+(1-p)*4,-2.05-q*6,1);this.b.rotation.set(.1,-Math.PI/2+(1-p)*4+Math.sin(t*1.3)*.2,-.12);this.b.scale.setScalar(Math.max(.001,.52*p))}});
S('c02',GOLD,t=>chip(t,.15,'⭐ Қазақ әдебиетінің шедеврі'));
S('c03',GOLD,t=>chip(t,.15,'📜 Халықтың тарихы мен жаны'));
// 4. lower-third name card for Abai
S('c04',GOLD,t=>{const p=eo(P(t,.1,.55)),q=exitP(t);return `<div style="position:absolute;left:60px;top:1230px;opacity:${1-q};transform:translateX(${((1-p)*-700+q*-300).toFixed(1)}px)">
  <div style="background:${GOLD};color:${NAVY};font-weight:700;font-size:58px;padding:10px 30px;border-radius:14px 14px 0 0;display:inline-block">АБАЙ ҚҰНАНБАЙҰЛЫ</div>
  <div style="background:${NAVY};color:#fff;font-weight:700;font-size:40px;padding:10px 30px;border-radius:0 14px 14px 14px">ақын, ойшыл · 1845–1904</div></div>`});
S('c05',GOLD,t=>chip(t,.1,'📖 4 томдық роман-эпопея',120,GOLD,NAVY)+chip(t,.6,'1-том: жас Абайдың қалыптасуы'));
S('c06',GOLD,t=>chip(t,.15,'🏡 Туған ауылға оралу'));
S('c07',GOLD,t=>chip(t,.1,'🌱 Есею'));
S('c08','#ff7b54',t=>chip(t,.15,'⛰️ Дала өмірінің қатал шындығы'));
S('c09',GOLD,t=>head(t,[['Кең тынысты',92,'#fff',.15],['көрініс',112,GOLD,.45]],140));
S('c10',GOLD,t=>chip(t,.1,'👥 Қазақ қоғамы'));
S('c11',GOLD,t=>head(t,[['XIX',190,GOLD,.05],['ғасыр · дәстүр',72,'#fff',.4]],110));
S('c12','#ff6b6b',t=>chip(t,.2,'⚔️ Ішкі қақтығыстар',1250)+chip(t,1.6,'⚖️ Әділетсіздік',1360,'#7a1f1f'));
S('c13',GOLD,t=>head(t,[['Абай',130,GOLD,.1],['мінезінің тереңдігі',66,'#fff',.4]],130));
S('c14',GOLD,t=>chip(t,.2,'🔎 Ақиқат іздеген · халқына қызмет еткен'));
S('c15',GOLD,t=>`<div style="position:absolute;left:70px;top:70px;font:700 230px/1 'PT Serif',serif;color:${GOLD};${SH};${pop(t,.05)}">“</div>`+head(t,[['Тілі —',96,'#fff',.15],['поэзия',124,GOLD,.4]],150));
// 16. "not just a biography": word gets struck through
S('c16','#ff6b6b',t=>{const p=eio(P(t,.5,1.0)),q=exitP(t);return `<div style="position:absolute;left:0;right:0;top:170px;display:flex;justify-content:center;opacity:${1-q}"><div class="hl" style="position:relative;font-size:104px;color:#fff;${SH};${pop(t,.05)}">өмірбаян<div style="position:absolute;left:-10px;top:52%;height:14px;width:${(p*105).toFixed(1)}%;background:#ff4d4d;border-radius:7px;transform:rotate(-4deg)"></div></div></div>`+chip(t,.9,'…ғана емес!',330,'#ff4d4d','#fff')});
S('c17',GOLD,t=>head(t,[['Дала өмірінің',84,'#fff',.1],['энциклопедиясы',96,GOLD,.4]],140));
S('c18',GOLD,t=>chip(t,.15,'💫 Жүректе терең із қалдырады'));
S('c19','#ff5c8a',t=>chip(t,.1,'❤️ Әр оқырманның жүрегінде')+[0,1,2,3,4,5].map(i=>{const k=P(t,.2+i*.18,1.6+i*.18);return k>0&&k<1?`<div style="position:absolute;left:${640+(i%3)*120+Math.sin(t*3+i)*20}px;top:${1230-k*700}px;font-size:${60+(i%2)*24}px;opacity:${(1-k).toFixed(2)}">❤️</div>`:''}).join(''));
// outro over a frozen last frame: dark veil, rotating book, campaign title, CTA
S('outro',GOLD,t=>{return head(t,[['Кітап оқитын',104,'#fff',.15],['ұлт',150,GOLD,.45]],170)
   +chip(t,1.0,'«Абай жолы» — сіз оқыдыңыз ба?',1440,GOLD,NAVY)+chip(t,1.4,'#КітапОқитынҰлт',1550,'rgba(255,255,255,.12)','#fff')},
  {build(g){this.v=new THREE.Mesh(new THREE.PlaneGeometry(40,60),new THREE.MeshBasicMaterial({color:'#0a1022',transparent:true,opacity:0}));this.v.position.z=-4;g.add(this.v);this.b=abaiBook();g.add(this.b)},update(t){this.v.material.opacity=.88*eo(P(t,0,.4));const p=eb(P(t,.3,1.0));this.b.position.set(0,-.2+Math.sin(t*1.5)*.08,1);this.b.rotation.set(.08,-Math.PI/2+(1-p)*5+Math.sin(t*.9)*.35,0);this.b.scale.setScalar(Math.max(.001,1.05*p))}});
