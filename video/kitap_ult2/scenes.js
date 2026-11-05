// «Кітап оқитын ұлт» — talking-head review of «Ұшқан ұя» (Бауыржан Момышұлы). Overlay mode over real footage.
// White-background version: speaker scaled 0.78, bottom-centre (face ≈ y 960–1430) → headlines y 150–500, chips y 600–820.
import * as E from '/engine/engine.js';
const {THREE,scene,head,chipH,pop,exitP,SH,P,eo,eb,eio,book,coverTex,spineTex,mesh}=E;
const GOLD='#ffc83d',NAVY='#14213d',GREEN='#2f6b3a',ORANGE='#e8790c';
// white background version: dark headline text, everything above the (smaller, lower) speaker
const H=(t,lines,top)=>head(t,lines.map(([s,z,c,a])=>[s,z,c==='#fff'?NAVY:(c===GOLD?ORANGE:c),a,'text-shadow:0 4px 0 rgba(20,33,61,.10)']),top);
const ENV={bg:[[0,'#000'],[1,'#000']],fog:['#000',50,200],hemi:['#ffffff','#445',1.3],sun:['#fff6e0',2.6,[3,5,8]]};
const chip=(t,a,txt,y=700,bg=NAVY,fg='#fff')=>chipH(t,a,txt,bg,fg,y,'font-size:46px;border:3px solid '+GOLD);
const S=(id,html,extra={},acc=GOLD)=>scene(id,{acc,env:ENV,topShade:id==='outro'?true:undefined,build(g){extra.build&&extra.build.call(this,g)},update(t,D){extra.update&&extra.update.call(this,t,D);return {cam:[[0,0,10],[0,0,0]],html:html(t,D)}}});
const nestBook=()=>book(coverTex('ҰШҚАН ҰЯ','#2f4a3a','БАУЫРЖАН МОМЫШҰЛЫ','🏡'),spineTex('БАУЫРЖАН МОМЫШҰЛЫ · ҰШҚАН ҰЯ','#2f4a3a'),'#2f4a3a',.45,3.0,2.1);
const strike=(t,word,a=.4)=>{const p=eio(P(t,a,a+.5)),q=exitP(t);return `<div style="position:absolute;left:0;right:0;top:190px;display:flex;justify-content:center;opacity:${1-q}"><div class="hl" style="position:relative;font-size:70px;color:${NAVY};${pop(t,.05)}">${word}<div style="position:absolute;left:-10px;top:52%;height:13px;width:${(p*105).toFixed(1)}%;background:#ff4d4d;border-radius:7px;transform:rotate(-3deg)"></div></div></div>`};
const lower=(t,name,sub)=>{const p=eo(P(t,.1,.55)),q=exitP(t);return `<div style="position:absolute;left:60px;top:620px;opacity:${1-q};transform:translateX(${((1-p)*-700+q*-300).toFixed(1)}px)">
  <div style="background:${GOLD};color:${NAVY};font-weight:700;font-size:56px;padding:10px 30px;border-radius:14px 14px 0 0;display:inline-block">${name}</div>
  <div style="background:${NAVY};color:#fff;font-weight:700;font-size:40px;padding:10px 30px;border-radius:0 14px 14px 14px">${sub}</div></div>`};

// intro: campaign badge + title + 3D book; c02–c04 three theme chips build up
S('c01',t=>chip(t,.05,'📚 КІТАП ОҚИТЫН ҰЛТ',90,GOLD,NAVY)+H(t,[['Ұшқан ұя',130,'#fff',.25],['Бауыржан Момышұлы',60,GOLD,.55]],170),
  {build(g){this.b=nestBook();g.add(this.b)},update(t){const p=eb(P(t,.4,1.2)),q=exitP(t);this.b.position.set(0+(1-p)*4,1.15-q*6,1);this.b.rotation.set(.1,-Math.PI/2+(1-p)*4+Math.sin(t*1.3)*.2,-.12);this.b.scale.setScalar(Math.max(.001,.36*p))}});
S('c02',t=>chip(t,.1,'📖 Тәрбие'));
S('c03',t=>chip(t,.05,'👨‍👩‍👦 Отбасы'));
S('c04',t=>chip(t,.1,'🇰🇿 Ұлт тағдыры'));
S('c05',t=>lower(t,'БАУЫРЖАН МОМЫШҰЛЫ','жазушы, батыр · 1910–1982'));
S('c07',t=>chip(t,.2,'🏡 Ауыл өмірі'));
S('c08',t=>H(t,[['Негізгі',90,'#fff',.1],['идея',120,GOLD,.35]],150));
S('c09',t=>H(t,[['Болашақ',100,'#fff',.1],['ұядан басталады',84,GOLD,.4]],150));
// family: three name chips
S('c10',t=>chip(t,.3,'👵 Әжесі — Қызтумас'));
S('c11',t=>chip(t,.1,'👴 Атасы — Иманәлі'));
S('c12',t=>chip(t,.1,'👨 Әкесі — Момыш'));
S('c13',t=>chip(t,.2,'📜 Ертегі мен өсиет'));
S('c14',t=>chip(t,.15,'⚖️ Әділ талап'));
S('c15',t=>H(t,[['Отан-',100,'#fff',.15],['сүйгіштік',110,GOLD,.35]],150));
S('c16',t=>chip(t,.3,'💪 Еңбекқорлық',640)+chip(t,1.6,'🪨 Табандылық',750,GREEN));
S('c17',t=>chip(t,.2,'🎎 Салт-дәстүр'));
S('c18',t=>chip(t,.3,'🍵 Қонақжайлылық',640)+chip(t,1.9,'🙏 Үлкенге құрмет',750,GREEN));
S('c20',t=>chip(t,.3,'⛰️ Жайлау'));
S('c21',t=>chip(t,.1,'🎒 Мектеп'));
S('c22',t=>chip(t,.3,'⚡ Алғашқы қиындық',700,'#7a1f1f'));
S('c24',t=>H(t,[['Қазақ ауылының',84,'#fff',.2],['тұрмысы',110,GOLD,.5]],150));
S('c26',t=>chip(t,.4,'👶 Бала тәрбиесінің ерекшелігі'));
S('c27',t=>H(t,[['Тілі —',96,'#fff',.1],['қарапайым',110,GOLD,.3]],150));
S('c28',t=>H(t,[['мағынасы —',84,'#fff',.05],['терең',130,GOLD,.25]],150));
S('c30',t=>chip(t,.2,'💡 Өмірлік сабақ'));
S('c32',t=>H(t,[['Бала',110,'#fff',.1],['тәрбиесі',120,GOLD,.3]],150));
S('c33',t=>H(t,[['=',110,'#fff',.05],['ұлт тәрбиесі',110,GOLD,.25]],150));
S('c35',t=>strike(t,'бір баланың тағдыры',.9));
S('c36',t=>H(t,[['бүкіл',96,'#fff',.1],['ұлттың тағдыры',100,GOLD,.35]],150));
S('c37',t=>chip(t,.3,'🇰🇿 Отансүйгіштік'));
S('c38',t=>chip(t,.3,'🙏 Ата-анаға құрмет'));
S('c39',t=>chip(t,.1,'💪 Қиындыққа мойымау',700,GREEN));
S('c41',t=>H(t,[['Өскен',100,'#fff',.1],['ұя',150,GOLD,.3]],150));
S('c42',t=>chip(t,.1,'❤️ Балалық шақ')+[0,1,2,3,4,5].map(i=>{const k=P(t,.1+i*.12,1.3+i*.12);return k>0&&k<1?`<div style="position:absolute;left:${640+(i%3)*120+Math.sin(t*3+i)*20}px;top:${820-k*600}px;font-size:${60+(i%2)*24}px;opacity:${(1-k).toFixed(2)}">❤️</div>`:''}).join(''),{},'#ff5c8a');
// outro over frozen last frame: 3D veil + rotating book + campaign title + CTA
S('outro',t=>head(t,[['Кітап оқитын',104,'#fff',.15],['ұлт',150,GOLD,.45]],170)+chip(t,1.0,'«Ұшқан ұя» — сіз оқыдыңыз ба?',1440,GOLD,NAVY)+chip(t,1.4,'#КітапОқитынҰлт',1550,'rgba(255,255,255,.12)','#fff'),
  {build(g){this.v=new THREE.Mesh(new THREE.PlaneGeometry(40,60),new THREE.MeshBasicMaterial({color:'#0a1022',transparent:true,opacity:0}));this.v.position.z=-4;g.add(this.v);this.b=nestBook();g.add(this.b)},
   update(t){this.v.material.opacity=.88*eo(P(t,0,.4));const p=eb(P(t,.3,1.0));this.b.position.set(0,-.2+Math.sin(t*1.5)*.08,1);this.b.rotation.set(.08,-Math.PI/2+(1-p)*5+Math.sin(t*.9)*.35,0);this.b.scale.setScalar(Math.max(.001,1.05*p))}});
