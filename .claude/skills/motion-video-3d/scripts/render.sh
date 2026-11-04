#!/usr/bin/env bash
# Full render: parallel frame workers -> wait by counting files -> encode MP4 with master audio.
# usage: render.sh <projectDir> [workers=4] [out=build/video.mp4]
# Resumable: existing frames are skipped. Delete build/frames after changing scenes/timing.
# NOTE: waits by counting frames, never with `pgrep -f` (it matches its own shell and loops forever).
set -euo pipefail
D="$(cd "$1" && pwd)"; N="${2:-4}"; OUT="${3:-$D/build/video.mp4}"; S="$(dirname "$0")"
TOTAL=$(python3 -c "import json,math;t=json.load(open('$D/build/timeline.json'));print(math.ceil(t['total']*t['fps']))")
mkdir -p "$D/build/frames"; rm -f "$D"/build/frames/*.tmp.jpg
for w in $(seq 0 $((N-1))); do node "$S/render.js" "$D" frames $w $N > "$D/build/render_$w.log" 2>&1 & done
while :; do C=$(ls "$D/build/frames" | grep -c '^[0-9]*\.jpg$' || true); [ "$C" -ge "$TOTAL" ] && break
  if [ -z "$(jobs -r)" ]; then echo "workers exited early ($C/$TOTAL frames); see build/render_*.log"; grep -h ERROR "$D"/build/render_*.log | head; exit 1; fi; sleep 5; done
wait
ffmpeg -v error -y -framerate 30 -i "$D/build/frames/%05d.jpg" -i "$D/build/master.wav" -c:v libx264 -preset slow -crf 18 -maxrate 14M -bufsize 28M -profile:v high -pix_fmt yuv420p -c:a aac -b:a 192k -ac 2 -ar 48000 -shortest -movflags +faststart "$OUT"
ffprobe -v error -show_entries format=duration,size -of compact "$OUT"; echo "$OUT"
