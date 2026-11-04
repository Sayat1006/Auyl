// motion-video-3d engine: three.js 3D world + post-processing + HTML motion-graphics overlay
// + narrator + karaoke subtitles. Deterministic: everything is a pure function of time T,
// so frames can be rendered in any order by parallel workers.
import * as THREE from 'three';
import {EffectComposer} from 'three/addons/postprocessing/EffectComposer.js';
import {RenderPass} from 'three/addons/postprocessing/RenderPass.js';
import {UnrealBloomPass} from 'three/addons/postprocessing/UnrealBloomPass.js';
import {ShaderPass} from 'three/addons/postprocessing/ShaderPass.js';
import {OutputPass} from 'three/addons/postprocessing/OutputPass.js';
import {RoomEnvironment} from 'three/addons/environments/RoomEnvironment.js';
export {THREE};
export const W=1080,H=1920;

// ---------------- easing ----------------
export const cl=(x,a=0,b=1)=>Math.max(a,Math.min(b,x));
export const P=(t,a,b)=>cl((t-a)/(b-a));
export const eo=x=>1-Math.pow(1-x,3);
export const eio=x=>x<.5?4*x*x*x:1-Math.pow(-2*x+2,3)/2;
export const eb=x=>{x=cl(x);const c1=1.9,c3=c1+1;return 1+c3*Math.pow(x-1,3)+c1*Math.pow(x-1,2)};
export const bounce=x=>{x=cl(x);const n=7.5625,d=2.75;if(x<1/d)return n*x*x;if(x<2/d)return n*(x-=1.5/d)*x+.75;if(x<2.5/d)return n*(x-=2.25/d)*x+.9375;return n*(x-=2.625/d)*x+.984375};
export const rnd=(s=>()=>(s=(s*16807)%2147483647)/2147483647)(7);

// ---------------- per-frame state (read by overlay helpers) ----------------
export const st={D:5,last:false,T:0,acc:'#ffd166',id:''};
export const exitP=(t,o=0)=>st.last?0:eio(P(t,st.D-.42+o,st.D-.12+o));

// ---------------- overlay (HTML) helpers ----------------
export const SH='text-shadow:0 6px 0 rgba(0,0,0,.3),0 0 30px rgba(0,0,0,.35)';
export const pop=(t,a,d=.38)=>{const p=P(t,a,a+d),q=exitP(t);return `opacity:${(cl(p*3)*(1-q)).toFixed(3)};transform:translateY(${(-q*70).toFixed(1)}px) scale(${(.4+.6*eb(p)).toFixed(3)})`};
export const kin=(s,t,a,step=.032)=>[...s].map((ch,i)=>{const p=P(t,a+i*step,a+i*step+.5),q=exitP(t,i*.012);const y=(1-eb(p))*115-q*120;return `<span style="display:inline-block;transform:translateY(${y.toFixed(1)}%) rotate(${((1-p)*10).toFixed(1)}deg)">${ch===' '?'&nbsp;':ch}</span>`}).join('');
// headline: lines = [[text,sizePx,color,appearAt,extraCss], ...]
export const head=(t,lines,top=200)=>{const last=lines[lines.length-1];const ua=last[3]+.35,u=eo(P(t,ua,ua+.5)),uq=exitP(t);
  return `<div class="head" style="top:${top}px">${lines.map(([s,z,c,a,x=''])=>`<div class="hl" style="font-size:${z}px;color:${c};${SH};${x};overflow:hidden;padding:4px 24px 16px;margin-bottom:-14px">${kin(s,t,a)}</div>`).join('')}
  <div style="height:16px;width:300px;border-radius:8px;background:${st.acc};margin-top:6px;transform-origin:${uq>0?'right':'left'};transform:scaleX(${(u*(1-uq)).toFixed(3)});box-shadow:0 4px 0 rgba(0,0,0,.2)"></div></div>`};
export const chipH=(t,a,txt,bg,fg,y,extra='')=>{const p=eo(P(t,a,a+.45)),q=exitP(t,.05);if(p<=0)return '';return `<div style="position:absolute;left:0;right:0;top:${y}px;display:flex;justify-content:center;opacity:${1-q}"><div class="chip" style="background:${bg};color:${fg};box-shadow:0 10px 24px rgba(0,0,0,.3);clip-path:inset(-20px ${((1-p)*100).toFixed(1)}% -20px -20px round 999px);transform:translateX(${((1-p)*-40+q*80).toFixed(1)}px);${extra}">${txt}</div></div>`};
export const chipAt=(x,y,txt,bg,fg,style='')=>`<div style="position:absolute;left:${x-200}px;top:${y}px;width:400px;display:flex;justify-content:center"><div class="chip" style="background:${bg};color:${fg};font-size:38px;box-shadow:0 8px 20px rgba(0,0,0,.3);${style}">${txt}</div></div>`;
// red rubber stamp that slams in (myth-busting «ҚАТЕЛЕСЕСІҢ», dates «1937»)
export const stamp=(t,a,txt,y=700,color='#e53935',rot=-8,size=110)=>{const p=P(t,a,a+.22);if(p<=0)return '';const s=2.2-1.2*eo(p),q=exitP(t);
  return `<div style="position:absolute;left:0;right:0;top:${y}px;display:flex;justify-content:center;opacity:${(cl(p*2)*(1-q)).toFixed(2)}"><div class="hl" style="font-size:${size}px;color:${color};border:12px solid ${color};border-radius:24px;padding:6px 34px;transform:rotate(${rot}deg) scale(${s.toFixed(3)});background:rgba(255,255,255,.06)">${txt}</div></div>`};
export const stampShake=(t,a)=>t>a&&t<a+.25?Math.sin(t*90)*.05*(1-P(t,a,a+.25)):0; // add to camera x
// big counter «47 000+»
export const counter=(t,a,to,{dur=1.2,prefix='',suffix='',sep=' '}={})=>{const n=Math.round(to*eo(P(t,a,a+dur)));return prefix+String(n).replace(/\B(?=(\d{3})+(?!\d))/g,sep)+suffix};
// row of boxes that fill one by one («БІР АПТА» 1..7)
export const dayBoxes=(t,a,n,y,{step=.18,color='#e57373',size=86}={})=>`<div style="position:absolute;left:0;right:0;top:${y}px;display:flex;justify-content:center;gap:14px">${[...Array(n)].map((_,i)=>{const p=eb(P(t,a+i*step,a+i*step+.3));return `<div class="hl" style="width:${size}px;height:${size}px;border-radius:14px;background:${p>0?color:'rgba(255,255,255,.15)'};color:#fff;font-size:${size*.5}px;display:flex;align-items:center;justify-content:center;transform:scale(${(.6+.4*p).toFixed(3)})">${i+1}</div>`}).join('')}</div>`;
// dotted timeline with two labelled dots
export function timeline(t,a,[l1,s1],[l2,s2],y=830){const p=eio(P(t,a,a+1.0)),q=exitP(t);const x0=170,x1=910,xe=x0+(x1-x0)*p;
  const dot=(x,c,b)=>{const k=eb(P(t,b,b+.35));return `<circle cx="${x}" cy="${y}" r="${(22*k).toFixed(1)}" fill="${c}" stroke="#fff" stroke-width="6"/>`};
  const lab=(x,yy,txt,sz,b,c='#fff')=>{const k=eo(P(t,b,b+.4));return `<text x="${x}" y="${yy+(1-k)*20}" text-anchor="middle" font-family="N" font-weight="700" font-size="${sz}" fill="${c}" opacity="${k}">${txt}</text>`};
  return `<svg style="position:absolute;inset:0;opacity:${1-q}" viewBox="0 0 1080 1920"><line x1="${x0}" y1="${y}" x2="${xe}" y2="${y}" stroke="#fff" stroke-width="8" stroke-linecap="round" stroke-dasharray="2 18"/>
  ${dot(x0,'#c62828',a)}${p>.97?dot(x1,'#ffd166',a+.95):''}${lab(x0,y-50,l1,56,a+.1)}${lab(x0,y+75,s1,38,a+.25,'#ffd166')}${lab(x1,y-50,l2,56,a+1.0)}${lab(x1,y+75,s2,38,a+1.15,'#ffd166')}</svg>`}
// two name chips joined by an arc («ҰСТАЗ → ШӘКІРТ»)
export function linkChips(t,a,left,right,y=700,label=''){const p=eio(P(t,a+.3,a+1.1)),q=exitP(t);const L=Math.PI*330;
  return `<div style="position:absolute;inset:0;opacity:${1-q}">${chipAt(250,y,left,'#1e2430','#fff',pop(t,a))}${chipAt(830,y,right,'#2f5d8c','#fff',pop(t,a+.9))}
  <svg style="position:absolute;inset:0" viewBox="0 0 1080 1920"><path d="M250 ${y-10} Q540 ${y-260} 830 ${y-10}" fill="none" stroke="#ffd166" stroke-width="8" stroke-linecap="round" stroke-dasharray="${L}" stroke-dashoffset="${(L*(1-p)).toFixed(1)}"/></svg>
  ${label?`<div class="hl" style="position:absolute;left:0;right:0;top:${y-240}px;text-align:center;font-size:64px;color:#fff;${SH};${pop(t,a+1.0)}">${label}</div>`:''}</div>`}

// ---------------- three.js core ----------------
const canvas=document.getElementById('c');
export const renderer=new THREE.WebGLRenderer({canvas,antialias:true,preserveDrawingBuffer:true});
renderer.setPixelRatio(1);renderer.setSize(W,H,false);
renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.05;renderer.outputColorSpace=THREE.SRGBColorSpace;
export const world=new THREE.Scene();
export const cam=new THREE.PerspectiveCamera(45,W/H,.1,400);
const pmrem=new THREE.PMREMGenerator(renderer);const envTex=pmrem.fromScene(new RoomEnvironment(),.04).texture;world.environment=envTex;
export const hemi=new THREE.HemisphereLight(0xffffff,0x444444,1.2);world.add(hemi);
export const sun=new THREE.DirectionalLight(0xffffff,2.6);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);
Object.assign(sun.shadow.camera,{left:-22,right:22,top:22,bottom:-22,near:1,far:120});sun.shadow.bias=-.0004;sun.shadow.normalBias=.02;world.add(sun);world.add(sun.target);
export const lamp=new THREE.PointLight(0xffc27a,0,30,1.5);world.add(lamp);

// post-processing: bloom + vignette/grain/chromatic aberration grade
const composer=new EffectComposer(renderer);composer.setPixelRatio(1);composer.setSize(W,H);
composer.addPass(new RenderPass(world,cam));
const bloom=new UnrealBloomPass(new THREE.Vector2(W/2,H/2),.25,.5,.95);composer.addPass(bloom);
const grade=new ShaderPass({uniforms:{tDiffuse:{value:null},uTime:{value:0},uVig:{value:.35},uGrain:{value:.018},uCA:{value:.0012}},
  vertexShader:'varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
  fragmentShader:`uniform sampler2D tDiffuse;uniform float uTime,uVig,uGrain,uCA;varying vec2 vUv;
  float h(vec2 p){return fract(sin(dot(p,vec2(12.9898,78.233))+uTime*37.)*43758.5453);}
  void main(){vec2 d=vUv-.5;float r=dot(d,d);vec2 o=d*uCA*(1.+r*4.);
    vec3 c=vec3(texture2D(tDiffuse,vUv+o).r,texture2D(tDiffuse,vUv).g,texture2D(tDiffuse,vUv-o).b);
    c*=1.-uVig*smoothstep(.15,.75,r*2.);c+=(h(vUv*vec2(1080.,1920.))-.5)*uGrain;gl_FragColor=vec4(c,1.);}`});
composer.addPass(grade);composer.addPass(new OutputPass());
export const post={bloom,grade};

// ---------------- materials & primitives ----------------
export const M=(c,o={})=>new THREE.MeshStandardMaterial({color:c,flatShading:true,roughness:.85,metalness:0,envMapIntensity:.6,...o});
export const B=(c,o={})=>new THREE.MeshBasicMaterial({color:c,...o});
export function mesh(g,m,x=0,y=0,z=0){const o=new THREE.Mesh(g,m);o.position.set(x,y,z);o.castShadow=true;o.receiveShadow=true;return o}
const mm=c=>typeof c==='object'?c:M(c);
export const box=(w,h,d,c,x,y,z)=>mesh(new THREE.BoxGeometry(w,h,d),mm(c),x,y,z);
export const cyl=(rt,rb,h,c,x,y,z,seg=16)=>mesh(new THREE.CylinderGeometry(rt,rb,h,seg),mm(c),x,y,z);
export const sph=(r,c,x,y,z,seg=20)=>mesh(new THREE.SphereGeometry(r,seg,Math.max(8,seg*.6|0)),mm(c),x,y,z);
export const G=(...ch)=>{const g=new THREE.Group();ch.forEach(c=>c&&g.add(c));return g};
export function gradTex(stops){const c=document.createElement('canvas');c.width=4;c.height=512;const x=c.getContext('2d');const gr=x.createLinearGradient(0,0,0,512);stops.forEach(([p,col])=>gr.addColorStop(p,col));x.fillStyle=gr;x.fillRect(0,0,4,512);const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;return t}
export function canvasTex(w,h,draw){const c=document.createElement('canvas');c.width=w;c.height=h;const x=c.getContext('2d');draw(x,w,h);const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;t.anisotropy=8;t.userData={c,x};return t}
// image file -> texture (e.g. '/project/build/cover.jpg'); setup() waits until all are loaded
const PENDING=[];
export function imgTex(url){let ok;PENDING.push(new Promise(r=>ok=r));const t=new THREE.TextureLoader().load(url,()=>ok(),undefined,()=>{console.error('image failed: '+url);ok()});t.colorSpace=THREE.SRGBColorSpace;t.anisotropy=8;return t}
export function ctxText(x,txt,size,col,cx,cy,font=700){x.font=`${font} ${size}px N`;x.fillStyle=col;x.textAlign='center';x.textBaseline='middle';x.fillText(txt,cx,cy)}
export function noiseGround(w,d,seg,amp,col,fn){const g=new THREE.PlaneGeometry(w,d,seg,seg);g.rotateX(-Math.PI/2);const p=g.attributes.position;for(let i=0;i<p.count;i++){const x=p.getX(i),z=p.getZ(i);p.setY(i,fn?fn(x,z):amp*(Math.sin(x*.35)*Math.cos(z*.3)+.5*Math.sin(x*.9+z*.7)))}g.computeVertexNormals();const m=mesh(g,M(col));m.castShadow=false;return m}
export const ext=(shape,depth,col,o={})=>mesh(new THREE.ExtrudeGeometry(shape,{depth,bevelEnabled:true,bevelThickness:.12,bevelSize:.1,bevelSegments:4,curveSegments:24}),M(col,{flatShading:false,roughness:.4,...o}));
export const heartShape=()=>{const s=new THREE.Shape();s.moveTo(0,-.9);s.bezierCurveTo(-1.7,-.1,-1.0,1.3,0,.5);s.bezierCurveTo(1.0,1.3,1.7,-.1,0,-.9);return s};
export const starShape=()=>{const s=new THREE.Shape();for(let i=0;i<10;i++){const r=i%2?.45:1,a=Math.PI/2+i*Math.PI/5;i?s.lineTo(Math.cos(a)*r,Math.sin(a)*r):s.moveTo(Math.cos(a)*r,Math.sin(a)*r)}return s};
export function rrShape(w,h,r,tail){const s=new THREE.Shape(),x=-w/2,y=-h/2;s.moveTo(x+r,y);if(tail){s.lineTo(-w*.25,y);s.lineTo(-w*.38,y-.8);s.lineTo(-w*.08,y)}s.lineTo(x+w-r,y);s.quadraticCurveTo(x+w,y,x+w,y+r);s.lineTo(x+w,y+h-r);s.quadraticCurveTo(x+w,y+h,x+w-r,y+h);s.lineTo(x+r,y+h);s.quadraticCurveTo(x,y+h,x,y+h-r);s.lineTo(x,y+r);s.quadraticCurveTo(x,y,x+r,y);return s}
export function textPlane(txt,{size=1.6,color='#fff',px=220,basic=true}={}){const tx=canvasTex(256,256,(x,w,h)=>ctxText(x,txt,px,color,w/2,h/2+10));return new THREE.Mesh(new THREE.PlaneGeometry(size,size),basic?new THREE.MeshBasicMaterial({map:tx,transparent:true}):new THREE.MeshStandardMaterial({map:tx,transparent:true}))}
export function dustPoints(n,col,spread=[20,8,20],size=.06){const pg=new THREE.BufferGeometry(),pts=[];for(let i=0;i<n;i++)pts.push((rnd()-.5)*spread[0],rnd()*spread[1],(rnd()-.5)*spread[2]);pg.setAttribute('position',new THREE.Float32BufferAttribute(pts,3));return new THREE.Points(pg,new THREE.PointsMaterial({color:col,size,transparent:true,opacity:.75}))}
export function sunDisc(r,col,x,y,z){const a=new THREE.Mesh(new THREE.CircleGeometry(r,64),B(col,{fog:false}));a.position.set(x,y,z);const b=new THREE.Mesh(new THREE.CircleGeometry(r*1.7,64),B(col,{fog:false,transparent:true,opacity:.22}));b.position.set(x,y,z-1);return G(a,b)}

// ---------------- model library ----------------
export const SKIN='#e3b38a';
export const wheel=(r,w=.3)=>{const g=G(cyl(r,r,w,'#222',0,0,0,20),cyl(r*.5,r*.5,w+.02,'#9e9e9e',0,0,0,12),box(r*.15,w+.04,r*1.4,'#666',0,0,0));g.rotation.x=Math.PI/2;const o=G(g);o.userData.spin=g;return o};
export const spinW=(o,a)=>{o.userData.spin.rotation.y=a};
export function house(col,roof){const g=G(box(1.6,1.2,1.4,col,0,.6,0));const r=mesh(new THREE.ConeGeometry(1.3,.85,4),M(roof),0,1.62,0);r.rotation.y=Math.PI/4;r.scale.set(1,1,.85);g.add(r);
  g.add(box(.36,.62,.06,'#5d4037',.35,.31,.71));g.add(box(.36,.3,.06,M('#ffe9a8',{emissive:'#ffcf6a',emissiveIntensity:.35}),-.38,.72,.71));g.add(box(.18,.5,.18,'#8d6e63',.45,1.75,-.2));return g}
export function yurt(col='#efe6d2',band='#b23a2a'){return G(cyl(1.2,1.2,1,col,0,.5,0,24),mesh(new THREE.ConeGeometry(1.3,.8,24),M(col),0,1.4,0),cyl(1.22,1.22,.14,band,0,.85,0,24),box(.5,.7,.06,band,0,.35,1.2))}
export function tree(col='#4caf50'){return G(cyl(.09,.12,.8,'#6d4c41',0,.4,0,6),mesh(new THREE.IcosahedronGeometry(.6,0),M(col),0,1.25,0),mesh(new THREE.IcosahedronGeometry(.42,0),M(col),.15,1.7,.05))}
export function poplar(){return G(cyl(.08,.1,.6,'#5d4037',0,.3,0,6),mesh(new THREE.ConeGeometry(.45,3.2,7),M('#558b2f'),0,2.1,0))}
export function person(coat,headCol=SKIN,hair='#1b1b1b'){return G(mesh(new THREE.CapsuleGeometry(.42,1.3,6,16),M(coat,{flatShading:false}),0,1.25,0),sph(.36,M(headCol,{flatShading:false}),0,2.55,0,24),mesh(new THREE.SphereGeometry(.38,24,12,0,Math.PI*2,0,Math.PI*.45),M(hair,{flatShading:false}),0,2.6,0))}
export function worker(col,hat='#fbc02d'){return G(mesh(new THREE.CapsuleGeometry(.28,.5,4,10),M(col),0,.62,0),sph(.24,SKIN,0,1.32,0,16),mesh(new THREE.SphereGeometry(.27,16,8,0,Math.PI*2,0,Math.PI/2),M(hat),0,1.4,0),cyl(.34,.34,.04,hat,0,1.4,0),sph(.035,'#222',-.08,1.35,.21,8),sph(.035,'#222',.08,1.35,.21,8))}
// national-costume figures: kind 'kalpak' (man), 'saukele' (woman), 'plain'
export function folk(coat,kind='kalpak'){const g=person(coat);if(kind==='kalpak'){g.add(mesh(new THREE.ConeGeometry(.42,.6,4),M('#f5f5f5'),0,3.05,0));g.add(cyl(.44,.44,.08,'#212121',0,2.8,0,4))}
  else if(kind==='saukele'){g.add(mesh(new THREE.ConeGeometry(.3,1.1,16),M('#c62828'),0,3.35,0));g.add(sph(.08,'#ffd54f',0,3.95,0,8))}return g}
export function hand(col=SKIN,emis){const m=M(col,{flatShading:false,roughness:.6,...(emis?{emissive:emis,emissiveIntensity:0}:{})});const g=new THREE.Group();
  const palm=mesh(new THREE.SphereGeometry(1,32,20),m,0,.5,0);palm.scale.set(.5,.58,.2);g.add(palm);g.add(mesh(new THREE.CylinderGeometry(.3,.34,.7,16),m,0,-.3,0));
  const fingers=[];[[-.33,.55],[-.11,.66],[.11,.62],[.33,.5]].forEach(([x,L])=>{const piv=new THREE.Group();piv.position.set(x,1.0,0);g.add(piv);piv.add(mesh(new THREE.CapsuleGeometry(.1,L*.45,4,10),m,0,L*.3,0));const p2=new THREE.Group();p2.position.set(0,L*.55,0);piv.add(p2);p2.add(mesh(new THREE.CapsuleGeometry(.095,L*.35,4,10),m,0,L*.22,0));fingers.push([piv,p2])});
  const tp=new THREE.Group();tp.position.set(.45,.3,0);tp.rotation.z=-.7;g.add(tp);tp.add(mesh(new THREE.CapsuleGeometry(.11,.45,4,10),m,0,.3,0));g.userData={fingers,tp,mat:m};return g}
export function curl(h,c,t=0){h.userData.fingers.forEach(([a,b],i)=>{const k=c+Math.sin(t*3+i)*.04;a.rotation.x=k*1.3;b.rotation.x=k*1.5});h.userData.tp.rotation.x=c*.6}
export function tractor(col){const g=G(box(1.8,.8,1.1,col,.1,.95,0),box(.9,.06,1.2,'#333',-.45,2.43,0),box(.86,1.0,1.06,M('#b3e5fc',{transparent:true,opacity:.6,roughness:.1}),-.45,1.85,0),cyl(.06,.06,.6,'#333',.75,1.6,0,8),box(.2,.3,.9,'#ddd',1.05,.95,0));
  g.userData.wheels=[[-.5,.7,.66,.7],[-.5,.7,-.66,.7],[.75,.4,.56,.4],[.75,.4,-.56,.4]].map(([x,y,z,r])=>{const o=wheel(r,.3);o.position.set(x,y,z);g.add(o);return [o,r]});return g}
export function train(n=6,col='#5d4037'){const g=G(cyl(.7,.7,2.4,'#263238',0,1.3,0,20).rotateZ(Math.PI/2),box(1,1.6,1.5,'#37474f',-1.4,1.5,0),cyl(.18,.25,.8,'#212121',.8,2.4,0,10));g.children[0].position.set(.2,1.3,0);
  for(let i=0;i<n;i++){const w=G(box(2.6,1.6,1.6,col,0,1.4,0),box(2.7,.12,1.7,'#3e2723',0,2.25,0),box(.5,.25,.05,'#ffcc80',.5,1.7,.81));[-.8,.8].forEach(x=>[.7,-.7].forEach(z=>{const wh=wheel(.3,.15);wh.position.set(x,.35,z);w.add(wh)}));w.position.x=-3.4-i*2.9;g.add(w)}return g}
export function pageTex(seed){return canvasTex(512,700,(x,w,h)=>{x.fillStyle='#f4ecd8';x.fillRect(0,0,w,h);x.fillStyle='#b8ab90';for(let i=0;i<20;i++){const L=(i%6==5)?200:360+((i*seed*37)%60);x.fillRect(60,70+i*30,L,9)}})}
export function docTex(title='ҚАУЛЫ · ПОСТАНОВЛЕНИЕ'){return canvasTex(840,1120,(x,w,h)=>{x.fillStyle='#f6edd7';x.fillRect(0,0,w,h);ctxText(x,title,46,'#4a3f30',w/2,120);x.fillStyle='#c8bba0';for(let i=0;i<14;i++)x.fillRect(90,220+i*56,i%4==3?420:660,16)})}
export function coverTex(title,col,sub='',icon=''){return canvasTex(512,720,(x,w,h)=>{x.fillStyle=col;x.fillRect(0,0,w,h);x.strokeStyle='rgba(255,215,140,.8)';x.lineWidth=8;x.strokeRect(28,28,w-56,h-56);
  if(sub)ctxText(x,sub,34,'rgba(255,235,200,.9)',w/2,110);if(icon){x.font='200px serif';x.textAlign='center';x.fillText(icon,w/2,400)}
  const words=title.split(' ');words.forEach((t,i)=>ctxText(x,t,title.length>9?64:96,'#ffe9b0',w/2,560+i*80-(words.length-1)*40))})}
export function spineTex(title,col){return canvasTex(128,900,(x,w,h)=>{x.fillStyle=col;x.fillRect(0,0,w,h);x.fillStyle='rgba(255,215,140,.8)';x.fillRect(0,40,w,6);x.fillRect(0,h-46,w,6);x.save();x.translate(w/2,h/2);x.rotate(-Math.PI/2);ctxText(x,title,title.length>12?44:56,'#ffe9b0',0,4);x.restore()})}
// book: cover on +x face, spine on +z. rotation.y=-PI/2 shows the cover to a camera on +z.
export function book(cover,spine,col,w=.35,h=2.2,d=1.6){const pages=M('#f1e8d0',{flatShading:false});const cm=M(col,{flatShading:false,roughness:.6});
  return mesh(new THREE.BoxGeometry(w,h,d),[cover?new THREE.MeshStandardMaterial({map:cover,roughness:.6}):cm,cm,pages,pages,spine?new THREE.MeshStandardMaterial({map:spine,roughness:.6}):cm,pages])}
export function medal(lines=['ҚР','МЕМЛЕКЕТТІК','СЫЙЛЫҒЫ']){const mt=canvasTex(512,512,(x,w,h)=>{const gr=x.createRadialGradient(w/2,h/2,40,w/2,h/2,w/2);gr.addColorStop(0,'#ffe082');gr.addColorStop(1,'#c99a1e');x.fillStyle=gr;x.fillRect(0,0,w,h);x.strokeStyle='#8d6e00';x.lineWidth=14;x.beginPath();x.arc(w/2,h/2,220,0,7);x.stroke();lines.forEach((l,i)=>ctxText(x,l,i?48:90,'#6d4c00',w/2,h/2-70+i*75))});
  const gold=M('#d4a62a',{metalness:.85,roughness:.28,flatShading:false});const g=G();const d=mesh(new THREE.CylinderGeometry(1.6,1.6,.22,64),gold);d.rotation.x=Math.PI/2;g.add(d);const fc=new THREE.Mesh(new THREE.CircleGeometry(1.5,64),new THREE.MeshStandardMaterial({map:mt,metalness:.6,roughness:.35}));fc.position.z=.12;g.add(fc);
  const r1=box(.7,2.4,.05,'#1565c0',-.35,2.4,-.1),r2=box(.7,2.4,.05,'#ffd54f',.35,2.4,-.1);r1.rotation.z=.25;r2.rotation.z=-.25;g.add(r1,r2);return g}
export function mapPin(col='#e53935'){return G(sph(.6,M(col,{flatShading:false,roughness:.35}),0,1.4,0,24),mesh(new THREE.ConeGeometry(.47,1.1,24).rotateX(Math.PI),M(col,{flatShading:false}),0,.65,0),sph(.25,'#fff',0,1.4,.47,16))}
export function bubble(){const b=ext(rrShape(6,3.4,.8,true),.5,'#ffffff');b.geometry.center();return b}
export function room(g,night){g.add(box(14,.2,12,M(night?'#2a3550':'#cfd8dc',{flatShading:false}),0,-.1,0));g.add(box(14,8,.2,M(night?'#33415e':'#e8eef0',{flatShading:false}),0,4,-4));g.add(box(.2,8,12,M(night?'#2e3b57':'#dfe7ea',{flatShading:false}),-6,4,0));
  const win=box(2.4,2.6,.1,M(night?'#9fc3ff':'#cfeeff',{emissive:night?'#5b84d6':'#bfe6ff',emissiveIntensity:night?.8:.6}),3.2,4.6,-3.88);win.castShadow=false;g.add(win);g.add(box(.12,2.6,.16,'#fff',3.2,4.6,-3.85));g.add(box(2.4,.12,.16,'#fff',3.2,4.6,-3.85));
  const bed=G(box(4.2,.5,2.1,'#eceff1',0,.95,0),box(4.4,.12,2.3,'#90a4ae',0,.66,0),box(.12,1.6,2.3,'#90a4ae',-2.2,1.1,0),box(.12,1.1,2.3,'#90a4ae',2.2,.85,0),box(.9,.25,1.4,M('#ffffff',{flatShading:false}),-1.6,1.32,0));[[-2.1,-1],[2.1,-1],[-2.1,1],[2.1,1]].forEach(([x,z])=>bed.add(box(.12,.7,.12,'#78909c',x,.35,z)));bed.position.set(-.8,0,-1.5);g.add(bed);
  const girl=G(sph(.32,M(SKIN,{flatShading:false}),-2.35,1.62,-1.5,24),mesh(new THREE.SphereGeometry(.36,24,12,0,Math.PI*2,0,Math.PI*.55),M('#3e2723',{flatShading:false}),-2.42,1.68,-1.5));
  const bl=mesh(new THREE.CapsuleGeometry(.62,2.4,6,16),M(night?'#5c6bc0':'#81d4fa',{flatShading:false}),-.3,1.45,-1.5);bl.rotation.z=Math.PI/2;bl.scale.set(1,1,1.3);girl.add(bl);g.add(girl);return {bed,girl}}

// ---------------- scene registry ----------------
export const SC={};
export function scene(id,def){def.group=new THREE.Group();def.group.visible=false;world.add(def.group);def.build(def.group);SC[id]=def}
// project 3D point to overlay pixel coords (for labels that follow objects)
export function toScreen(x,y,z){const v=new THREE.Vector3(x,y,z).project(cam);return [(v.x+1)/2*W,(1-v.y)/2*H]}

// ---------------- motion layer: floaters, circle wipe, progress ----------------
function floaters(t,idx){let h='';for(let i=0;i<7;i++){const sx=((idx*97+i*263)%1000)/1000,sy=((idx*53+i*389)%1000)/1000;const x=40+sx*1000,y=560+sy*700+Math.sin(t*1.3+i)*18,k=eb(P(t,.1+i*.06,.5+i*.06))*(1-exitP(t)),r=(t*40*(i%2?1:-1)+i*30);
  const c=i%3==0?st.acc:'rgba(255,255,255,.9)';const sh=i%3==0?`<div style="width:46px;height:46px;border-radius:50%;border:8px solid ${c}"></div>`:i%3==1?`<div style="width:18px;height:18px;border-radius:50%;background:${c}"></div>`:`<div style="font:700 54px N;color:${c};line-height:1">+</div>`;
  h+=`<div style="position:absolute;left:${x}px;top:${y}px;opacity:${(.55*k).toFixed(2)};transform:translate(-50%,-50%) rotate(${r}deg) scale(${k.toFixed(3)})">${sh}</div>`}return h}
function wipe(T,TL,accOf){const bs=TL.scenes.map(s=>s.start).slice(1);let h='';const cx=540,cy=1050,R=1450;
  for(let j=0;j<bs.length;j++){const b=bs[j],nx=TL.scenes[j+1];if(nx.cut==='soft'||T<b-.36||T>b+.4)continue;const A=accOf(nx.id),Bc='#1e2430';
    if(T<b){const ra=R*eio(P(T,b-.36,b-.08)),rb=R*eio(P(T,b-.26,b));h+=`<div style="position:absolute;inset:0;background:radial-gradient(circle at ${cx}px ${cy}px,${A} ${ra}px,transparent ${ra+1}px)"></div><div style="position:absolute;inset:0;background:radial-gradient(circle at ${cx}px ${cy}px,${Bc} ${rb}px,transparent ${rb+1}px)"></div>`}
    else{const rb=R*eio(P(T,b+.02,b+.3)),ra=R*eio(P(T,b+.1,b+.4));h+=`<div style="position:absolute;inset:0;background:radial-gradient(circle at ${cx}px ${cy}px,transparent ${ra}px,${A} ${ra+1}px)"></div><div style="position:absolute;inset:0;background:radial-gradient(circle at ${cx}px ${cy}px,transparent ${rb}px,${Bc} ${rb+1}px)"></div>`}}
  return h}

// ---------------- narrators ----------------
// photo: cutout PNG + "puppet jaw" (lower face piece drops with the voice envelope)
function photoAvatar(cfg,e,T,mode){const el=document.getElementById('avw');if(mode==='hidden'){el.innerHTML='';return}
  const a=cfg,s=mode==='hero'?a.heroScale:a.scale,x=mode==='hero'?(W-a.w*s)/2:a.x,y=mode==='hero'?a.heroY:a.y;
  const drop=(e*a.mouth.drop).toFixed(1),bob=(Math.sin(T*2.1)*4-e*4).toFixed(1),rot=(Math.sin(T*.9)*1.5).toFixed(2),mw=a.mouth.w;
  el.innerHTML=`<div style="position:absolute;left:${x}px;top:${y}px;width:${a.w}px;height:${a.h}px;transform-origin:0 0;transform:scale(${s}) translateY(${bob}px) rotate(${rot}deg);filter:drop-shadow(6px 0 0 #fff) drop-shadow(-6px 0 0 #fff) drop-shadow(0 6px 0 #fff) drop-shadow(0 -6px 0 #fff) drop-shadow(0 14px 20px rgba(0,0,0,.45))">
   <img src="${a.image}" style="position:absolute;left:0;top:0;width:${a.w}px;height:${a.h}px">
   <div style="position:absolute;left:${a.mouth.x-mw/2}px;top:${a.mouth.y-2}px;width:${mw}px;height:${(+drop+5).toFixed(1)}px;border-radius:0 0 ${mw/2}px ${mw/2}px/0 0 ${(+drop/2+3).toFixed(1)}px ${(+drop/2+3).toFixed(1)}px;background:#3a1010"></div>
   <img src="${a.image}" style="position:absolute;left:0;top:${drop}px;width:${a.w}px;height:${a.h}px;clip-path:polygon(${a.jaw.map(([px,py])=>`${px}px ${py}px`).join(',')})"></div>`}
// cartoon 3D head (fallback when there is no photo)
const av=new THREE.Scene();const avCam=new THREE.PerspectiveCamera(26,1,.1,50);avCam.position.set(0,.15,7.5);avCam.lookAt(0,-.15,0);
av.add(new THREE.HemisphereLight('#ffffff','#556',1.5));{const kl=new THREE.DirectionalLight('#fff',2.2);kl.position.set(2,3,5);av.add(kl)}
const AS=(c,o={})=>new THREE.MeshStandardMaterial({color:c,roughness:.55,...o});const avH=new THREE.Group(),avB=new THREE.Group();av.add(avH,avB);
const SG=new THREE.SphereGeometry(1,40,28);
function part(par,geo,mat,x,y,z,sx=1,sy=1,sz=1,ol=false){const m=new THREE.Mesh(geo,mat);m.position.set(x,y,z);m.scale.set(sx,sy,sz);par.add(m);if(ol){const o=new THREE.Mesh(geo,new THREE.MeshBasicMaterial({color:'#fff',side:THREE.BackSide}));o.position.copy(m.position);o.scale.copy(m.scale).multiplyScalar(1.07);par.add(o)}return m}
part(avB,SG,AS('#2f5d8c'),0,-1.95,0,1.55,.85,.9,true);part(avB,new THREE.CylinderGeometry(.32,.36,.6,20),AS('#e0a96d'),0,-1.15,0,1,1,1,true);
part(avH,SG,AS('#f1c27d'),0,0,0,.92,1.05,.95,true);part(avH,SG,AS('#e9b47c'),-.9,-.05,0,.16,.24,.12,true);part(avH,SG,AS('#e9b47c'),.9,-.05,0,.16,.24,.12,true);
part(avH,new THREE.SphereGeometry(1,40,20,0,Math.PI*2,0,Math.PI*.5),AS('#1b1b1b',{roughness:.8}),0,.12,-.04,.97,.95,.99,true).rotation.x=-.28;
const eyes=[-.32,.32].map(x=>{const e=new THREE.Group();e.position.set(x,.08,.83);avH.add(e);part(e,SG,AS('#fff',{roughness:.2}),0,0,0,.15,.17,.08);part(e,SG,AS('#1b1b1b',{roughness:.2}),0,0,.06,.09,.1,.05);return e});
const brows=[-.32,.32].map(x=>part(avH,new THREE.BoxGeometry(.32,.06,.06),AS('#1b1b1b'),x,.34,.86));part(avH,SG,AS('#e8ad6e'),0,-.12,.94,.09,.12,.09);
const mouth=part(avH,SG,AS('#6b1414',{roughness:.6}),0,-.48,.86,.2,.05,.08);
function cartoonAvatar(e,T,mode){if(mode==='hidden')return;const bl=(T%3.3)<.12?.12:1;eyes.forEach(o=>o.scale.y=bl);avH.rotation.set(-.05+e*.07,Math.sin(T*.8)*.18,0);mouth.scale.set(.2+e*.05,.04+e*.2,.08);brows.forEach(b=>b.position.y=.34+e*.04);
  const s=mode==='hero'?520:360,x=mode==='hero'?(W-s)/2:10,y=mode==='hero'?H-230-s:210; // GL viewport y is from the bottom
  renderer.autoClear=false;renderer.setScissorTest(true);renderer.setViewport(x,y,s,s);renderer.setScissor(x,y,s,s);renderer.clearDepth();renderer.render(av,avCam);renderer.setScissorTest(false);renderer.setViewport(0,0,W,H);renderer.autoClear=true}
// emoji reaction next to the narrator's head
function emojiHTML(sc,lt,mode,cfg){if(!sc.emoji||mode==='hidden')return '';const p=eb(P(lt,.3,.7)),q=exitP(lt);
  let x,y;if(cfg&&cfg.type==='photo'){const s=mode==='hero'?cfg.heroScale:cfg.scale;x=(mode==='hero'?(W-cfg.w*s)/2:cfg.x)+cfg.w*s*.82;y=(mode==='hero'?cfg.heroY:cfg.y)+cfg.h*s*.05}else{x=mode==='hero'?760:290;y=mode==='hero'?230:1360}
  return `<div style="position:absolute;left:${x}px;top:${y}px;font-size:${mode==='hero'?110:80}px;transform:scale(${(p*(1-q)).toFixed(3)}) rotate(${Math.sin(lt*3)*8}deg)">${sc.emoji}</div>`}

// ---------------- karaoke subtitles ----------------
function words(sub){const out=[];let hl=false;sub.split(/(\*\*)/).forEach(p=>{if(p==='**'){hl=!hl;return}p.split(/(\s+)/).forEach(w=>{if(w)out.push({w,hl,sp:/^\s+$/.test(w)})})});return out}
const NEG=/жоқ|өлім|қайғы|үрей|қорқ|ауыр|қатал|суық|тұншық|жау|қате/i;
function subtitle(sc,lt){const ws=words(sc.sub),tot=ws.filter(x=>!x.sp).reduce((a,x)=>a+x.w.length+2,0);const prog=cl((lt-sc.aStart)/sc.aDur)*tot;let acc=0;
  return ws.map(x=>{if(x.sp)return ' ';const st0=acc,on=acc<=prog;acc+=x.w.length+2;const cur=on&&prog<acc&&prog<tot;const hc=NEG.test(x.w)?'#ff6b6b':'#ffd166';
    const c=x.hl?(on?hc:'rgba(255,209,102,.45)'):(on?'#fff':'rgba(255,255,255,.45)');return `<span style="color:${c};border-radius:10px;${cur?'background:rgba(255,209,102,.28);box-shadow:0 0 0 6px rgba(255,209,102,.28)':''}">${x.w}</span>`}).join('')}

// ---------------- frame ----------------
let TL=null,PJ=null,cur=null;const v1=new THREE.Vector3(),v2=new THREE.Vector3();
function applyEnv(def){const e=def.env;world.background=def._bg||(def._bg=gradTex(e.bg));world.fog=new THREE.Fog(e.fog[0],e.fog[1],e.fog[2]);hemi.color.set(e.hemi[0]);hemi.groundColor.set(e.hemi[1]);hemi.intensity=e.hemi[2];
  sun.color.set(e.sun[0]);sun.intensity=e.sun[1];sun.position.set(...e.sun[2]);sun.target.position.set(0,0,0);lamp.intensity=e.lamp?e.lamp[3]:0;if(e.lamp)lamp.position.set(e.lamp[0],e.lamp[1],e.lamp[2]);
  world.environmentIntensity=e.envI??.5;bloom.strength=e.bloom??.25;grade.uniforms.uVig.value=e.vig??.35}
export async function setup(tl,pj){TL=tl;PJ=pj;await document.fonts.load('700 100px N','ҚҰҮҒӘІҢӨҺ');await document.fonts.load('500 100px N');await document.fonts.ready;
  for(const k in SC){SC[k].group.clear();SC[k].build(SC[k].group)} // rebuild canvas textures now that fonts exist
  await Promise.all(PENDING);
  document.getElementById('tag').textContent=pj.tag||'';const miss=TL.scenes.filter(s=>!SC[s.id]).map(s=>s.id);if(miss.length)throw new Error('scenes.js has no scene for: '+miss.join(', '));return true}
export function render(T){const sc=TL.scenes.find(s=>T>=s.start&&T<s.start+s.dur)||TL.scenes[TL.scenes.length-1];const lt=T-sc.start;const def=SC[sc.id];
  if(cur!==def){if(cur)cur.group.visible=false;def.group.visible=true;applyEnv(def);cur=def}
  Object.assign(st,{D:sc.dur,last:sc===TL.scenes[TL.scenes.length-1],T,id:sc.id,acc:def.acc||'#ffd166'});
  let r=def.update(lt,sc.dur);
  const k=eo(P(lt,0,.9));cam.position.set(...r.cam[0]);v1.set(...r.cam[1]);v2.subVectors(cam.position,v1).multiplyScalar(1+(1-k)*.18);cam.position.copy(v1).add(v2);cam.lookAt(v1);cam.rotateZ(Math.sin(T*.7)*.012);cam.fov=(r.fov||45)+(1-k)*6;cam.updateProjectionMatrix();
  r=def.update(lt,sc.dur); // second pass: labels projected with the final camera
  grade.uniforms.uTime.value=Math.floor(T*30)%97;renderer.autoClear=true;composer.render();
  const mode=sc.avatar||(PJ.narrator?.type==='none'?'hidden':'corner');const e=TL.env[Math.min(TL.env.length-1,Math.round(T*TL.fps))]||0;
  if(PJ.narrator?.type==='photo')photoAvatar(PJ.narrator,e,T,mode);else if(PJ.narrator?.type!=='none')cartoonAvatar(e,T,mode);
  document.getElementById('c').style.filter=r.filter||'none';const idx=TL.scenes.indexOf(sc);
  document.getElementById('ov').innerHTML=floaters(lt,idx)+(r.html||'')+emojiHTML(sc,lt,mode,PJ.narrator)+`<div style="position:absolute;left:0;top:0;height:10px;width:${(T/TL.total*W).toFixed(1)}px;background:${st.acc}"></div>`;
  document.getElementById('wp').innerHTML=wipe(T,TL,id=>SC[id]?.acc||'#ffd166')+(sc.cut==='soft'&&idx>0&&lt<.3?`<div style="position:absolute;inset:0;background:#000;opacity:${((1-lt/.3)*.65).toFixed(2)}"></div>`:'');
  const sb=document.getElementById('sub');sb.style.display=sc.noSub?'none':'block';sb.innerHTML=subtitle(sc,lt)}
