# Quality checklist & lessons learned

## Before the full render (qa.sh preview + at)
- [ ] Headline, chips, 3D subject, narrator, subtitle never overlap; nothing important under the subtitle box.
- [ ] Every scene's main object is fully in frame for most of the scene (portrait horizontal FOV is narrow — moving objects leave fast; make them stop in the centre).
- [ ] Text inside 3D (canvas textures) is readable and not mirrored/rotated (cylinder caps rotate textures — use a CircleGeometry face instead).
- [ ] No blown-out whites from bloom on bright scenes (lower `env.bloom`).
- [ ] Kazakh letters render (Ә Ғ Қ Ң Ө Ұ Ү Һ І) — fonts come from assets/fonts.
- [ ] Narrator jaw polygon aligned to the lip line (build/avatar_check.jpg).

## Audio
- [ ] Spectrogram gaps between sentences are dark (no breath/noise tails).
- [ ] −14 LUFS integrated, stereo 48 kHz (some phone players mute or mishandle mono; a user once reported "no sound" — it was the player starting muted; stereo AAC is safest).
- [ ] Printed TTS text checked for numbers and abbreviations.

## After the render
- [ ] qa.sh video contact sheet looks right; duration matches timeline.
- [ ] Tell the user honestly what you could not check (you can't hear audio; facts you couldn't verify).

## Past mistakes (don't repeat)
- Noise-based transition "whoosh" → user: "sounds like sniffing at the end of every sentence". Removed.
- Waiting with `until ! pgrep -f "render.js frames"` matched the waiting shell itself → hung forever. render.sh counts files.
- `pkill -f until` killed our own shell. Don't pkill broad patterns.
- Per-frame film grain made a 13 s clip 111 MB → grain .018 + `-maxrate 14M`.
- ASCII `"` inside JSON strings broke scenes.json → use „…“ or «…».
- ES modules don't load from file:// → render.js serves everything over a local HTTP server.
- Canvas textures built before fonts load show fallback glyphs → engine rebuilds scenes after `document.fonts` is ready.
- Instagram / TikTok links can't be fetched from the sandbox → ask the user to upload the video file.
- The user disliked flat 2D ("видео 2Д") and asked for "motion graphic" → 3D world + kinetic overlay is the default look now.
