# Scene API (assets/engine/engine.js)

`scenes.js` is an ES module loaded after the engine:
```js
import * as E from '/engine/engine.js';
const {THREE,scene,head,chipH,stamp,counter,P,eo,eb,M,box,G,house,train}=E;
scene('id-from-scenes.json',{
  acc:'#ffd166',                       // accent: headline underline, wipe colour, floaters, progress bar
  env:{bg:[[0,'#0d1020'],[1,'#3a4466']],  // vertical sky gradient stops
       fog:['#1f2740',14,60], hemi:[sky,ground,intensity], sun:[color,intensity,[x,y,z]],
       lamp:[x,y,z,intensity]?, bloom:.25?, vig:.35?, envI:.5?},
  build(g){ /* create meshes once, add to g, keep refs on this */ },
  update(t,D){ /* t = seconds since scene start, D = scene duration; animate refs */
    return {cam:[[px,py,pz],[lookX,lookY,lookZ]], fov?:45, filter?:'sepia(.5)', html:'overlay HTML'} }
});
```
- `update` must be a pure function of `t` (no Math.random, no accumulated state): frames render out of order in parallel workers. Use `E.rnd()` only inside `build`.
- `update` is called twice per frame (second call uses the final camera, so `toScreen()` labels line up).
- The engine adds: camera push-in at scene start, slight roll drift, circle wipe between scenes (unless `cut:"soft"`), floaters, progress bar, narrator, emoji, karaoke subtitles.
- Units ≈ metres; ground at y=0; camera typically 8–16 m away, fov 45 (portrait: only ~27° horizontal → keep subjects within ±3–4 m of centre).

## Layout zones (1080×1920 overlay pixels)
- Headline: top 170–620 (`head(t,lines,top)`), chips under it 520–700.
- 3D subject: middle 650–1350. Aim the camera so the subject's centre projects ~y 1000.
- Narrator corner + tag: 1290–1690 left; subtitle box: bottom 64 px margin, ~200 px tall.
- `avatar:"hero"` puts the narrator large at top (y 150–700) → put headlines at top ≥ 760 in that scene.

## Overlay helpers (return HTML strings; concatenate into `html`)
- `head(t,[[text,sizePx,color,appearAt,extraCss],...],top)` — kinetic per-letter headline + accent underline; auto exit at scene end.
- `chipH(t,at,text,bg,fg,y,extraCss)` — pill chip with clip reveal. `chipAt(x,y,text,bg,fg)` — chip at pixel (use with `toScreen`).
- `stamp(t,at,text,y,color,rot,size)` + `stampShake(t,at)` (add to camera x) — rubber-stamp slam.
- `counter(t,at,to,{dur,prefix,suffix,sep})` → string «170 000+».
- `dayBoxes(t,at,n,y,{color})` — boxes 1..n filling («БІР АПТА»).
- `timeline(t,at,[label1,sub1],[label2,sub2],y)` — dotted line with two dates.
- `linkChips(t,at,left,right,y,label)` — two name chips joined by an arc («ҰСТАЗ → ШӘКІРТ»).
- `pop(t,at)` CSS for pop-in/exit; `kin(text,t,at)` per-letter animation; `SH` text shadow; `exitP(t)` exit progress; `st.D` scene duration.

## Easing
`P(t,a,b)` 0→1 progress, `eo` ease-out, `eio` ease-in-out, `eb` back/overshoot, `bounce`, `cl` clamp.

## 3D helpers
Primitives: `M(color,opts)` flat-shaded standard material, `B` basic, `mesh, box, cyl, sph, G(...children)`, `ext(shape,depth,color)`, shapes `heartShape, starShape, rrShape`, `canvasTex(w,h,draw)` + `ctxText`, `imgTex('/project/build/file.jpg')` (photo/cover texture; keep user images in the project's build/), `textPlane(txt)`, `gradTex`, `noiseGround(w,d,seg,amp,color)`, `dustPoints(n,color)`, `sunDisc(r,color,x,y,z)`, `toScreen(x,y,z)`.

Models (all low-poly, shadows on):
`house(wall,roof)`, `yurt()`, `tree()`, `poplar()`, `person(coat)`, `folk(coat,'kalpak'|'saukele'|'plain')`, `worker(color)`, `hand()` + `curl(hand,0..1,t)`, `tractor(color)`, `wheel(r)`+`spinW`, `train(nWagons)`, `book(coverTex,spineTex,color,w,h,d)` (+ `coverTex(title,color,sub,icon)`, `spineTex`, `pageTex`, `docTex(title)`), `medal(lines)`, `mapPin()`, `bubble()`, `room(g,night)` (hospital room with bed+girl).

Need something else? Compose from primitives (see example-onqol: shelf, mirror, stamp tool, desk). Keep silhouettes readable at phone size: big simple shapes, strong rim/key light, contrasting background.

## Post-processing
Bloom (threshold .95), vignette, subtle grain + chromatic aberration, ACES tone mapping, RoomEnvironment reflections. Per scene: `env.bloom`, `env.vig`, `env.envI`. Emissive materials (`emissive`, `emissiveIntensity` ≥ .8) glow.
