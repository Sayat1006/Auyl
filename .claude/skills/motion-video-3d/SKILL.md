---
name: motion-video-3d
description: Make vertical 9:16 (TikTok / Instagram Reels / YouTube Shorts) explainer videos in 3D + motion-graphics style with Kazakh voice-over, karaoke subtitles and a talking narrator (from the user's photo or a 3D cartoon head) — researched script, Piper Kazakh TTS, three.js scenes with bloom/grade, kinetic typography, render to MP4. Use this whenever the user asks for a video, reel, рилс, тикток, shorts, видео түсіндірме, motion graphic, «осындай видео жаса», a video review of a book/story («кітапқа пікір видео»), a history/explainer clip, or wants to remake/replicate a reference video — even if they don't say "3D" or "skill". Also use it to fix/iterate an existing project made with it (voice, timing, scenes, sound artifacts).
---

# motion-video-3d

Turns a topic (+ optional photo of the narrator) into a ~40–90 s vertical video:
script → Kazakh voice → 3D scenes + motion-graphics overlay → frame render → MP4.
Everything renders headless (Chromium/SwiftShader WebGL), so it works in a cloud sandbox with no GPU.

Paths below: `S=<this skill>/scripts`, `A=<this skill>/assets`.

## 0. One-time setup
```bash
bash $S/setup.sh        # piper-tts, rembg, three@0.170, Kazakh voices, rembg model -> ~/.cache/motion-video-3d
```
Uses only PyPI, npm and GitHub releases (usually allowed). If something is blocked, say exactly which host.

## 1. Script first — show it to the user before rendering
Read `references/script-guide.md`. In short:
- Research facts (web search); keep only what at least one decent source states; tell the user what you could not verify.
- Structure: hook question → myth-bust / tension → facts (one per scene) → turn → result/legacy → call to action.
- 12–18 scenes of 2–5 s, one short spoken sentence each, 1–3 **keywords** per subtitle.
- Write it as a table for the user; get a yes (or edits) before spending ~30 min on a render.

Then scaffold the project and fill `scenes.json`:
```bash
python3 $S/new_project.py <proj> --tag "@account"     # scenes.json, scenes.js, project.json, .gitignore(build/)
```
`scenes.json` item: `{"id","say","sub"}` + optional `spk`, `speed`, `audio` (user's own recording), `emoji`, `avatar` (`corner`|`hero`|`hidden`), `silentAvatar` (quote read by "someone else": mouth stays still), `noSub`, `cut` (`soft` = no circle wipe), `pad` (extra seconds). JSON gotcha: inner quotes inside strings must be `„…“`/`«…»`, not `"`.

## 2. Narrator
- **Photo given** (the user's own photo, or one they have rights to): 
  ```bash
  python3 $S/cutout.py <proj> <photo> --grid                      # look at build/mouth_grid.jpg
  python3 $S/cutout.py <proj> <photo> --mouth X,Y --face WIDTH    # lip-line centre + cheek-to-cheek width, photo pixels
  ```
  Check `build/avatar_check.jpg`: the red jaw polygon must start exactly at the lip line. The photo stays in `build/` (git-ignored) — don't commit or publish someone's face without asking.
- **No photo**: `project.json` `"narrator":{"type":"cartoon"}` (3D cartoon head) or `"none"`.
- Never put a real person's photo on a quote by someone else: use `"avatar":"hidden","silentAvatar":true` for quotes.

## 3. Voice + timeline
```bash
python3 $S/make_audio.py <proj>       # one WAV per scene; digits auto-converted (prints the TTS text — read it!)
python3 $S/build_timeline.py <proj>   # trims breaths, timing, mouth envelope, master.wav (-14 LUFS, stereo 48k)
bash $S/qa.sh <proj> audio            # spectrogram: gaps between sentences must be dark
```
- Voice: ISSAI `kk-issai-high`, speakers 0/1 male, 2–5 female. Use a different speaker for quotes.
- Numbers: `kk_num.py` turns `1942 жылы` → «мың тоғыз жүз қырық екінші жылы», `47 000+` → «қырық жеті мыңнан астам». Check unusual cases by ear-proxy (read the printed text).
- You cannot hear the audio. Say so honestly and ask the user to listen; offer to swap speaker/text.
- Don't add noise "whoosh" SFX — it sounds like sniffing at every sentence end (user complaint).

## 4. Scenes (the creative part)
Read `references/scene-api.md` (engine API, model library, overlay helpers, layout zones) and look at
`assets/example-onqol/scenes.js` (16 finished scenes) and `assets/template/scenes.js` (train, stamp, counter).
For the look to match, read `references/style.md` (what makes the reference reels work).

Iterate cheaply — previews take seconds, the full render takes minutes:
```bash
bash $S/qa.sh <proj> preview                 # one frame per scene -> build/qa_sheet.jpg (Read it!)
node $S/render.js <proj> at 12.5 13.1        # specific moments -> build/at/
```
Check every preview for: headline vs 3D subject vs avatar vs subtitle overlaps, text cut at edges, objects out of frame, blown-out bloom, unreadable contrast. Fix, re-preview. Only then render.

## 5. Render + deliver
```bash
bash $S/render.sh <proj> 4            # ~1.2 frames/s on 4 cores: 60 s video ≈ 25 min. Resumable.
bash $S/qa.sh <proj> video            # contact sheet of the final MP4
```
- Run `render.sh` in the background (`run_in_background`) and wait for its completion notice; never poll with `pgrep -f` (matches itself → infinite loop).
- After changing timing/scenes: `rm -rf <proj>/build/frames` before re-rendering (frames are cached).
- Output `build/video.mp4`: 1080×1920, 30 fps, H.264 ≤14 Mbps, AAC 192k stereo.
- Send the MP4 to the user, then give: the full spoken text in one block, sources list, and what you could not verify.
- Commit the project's `scenes.json`, `scenes.js`, `project.json` (not `build/`) if the user works in a repo.

## Quality bar (why each matters)
See `references/quality.md` for the checklist and past mistakes. The biggest quality levers, in order: a tight script with a real hook; the user's own voice recording (TTS is OK, a human is better); scene composition that leaves the top 30 % for the headline and bottom 25 % for avatar+subtitles; constant gentle motion (no frozen frames); consistent per-scene accent colour.
