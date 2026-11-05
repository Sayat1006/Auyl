#!/usr/bin/env bash
# Overlay-mode preview: render overlay PNGs at given times and composite them on the edited footage.
# usage: overlay_preview.sh <proj> <sec> [sec...]  -> build/qa_overlay.jpg
set -euo pipefail; D="$(cd "$1" && pwd)"; shift; S="$(dirname "$0")"; rm -rf "$D/build/at"
node "$S/render.js" "$D" at "$@" >/dev/null; mkdir -p "$D/build/at"; i=0; L=""
for t in "$@"; do ffmpeg -v error -y -ss "$t" -i "$D/build/base_edit.mp4" -i "$D/build/at/t$t.png" -frames:v 1 -filter_complex "[0:v][1:v]overlay,scale=270:480" "$D/build/at/c$i.jpg"; L="$L -i $D/build/at/c$i.jpg"; i=$((i+1)); done
ffmpeg -v error -y $L -filter_complex "$(for j in $(seq 0 $((i-1))); do printf "[$j:v]"; done)hstack=$i" "$D/build/qa_overlay.jpg"; echo "$D/build/qa_overlay.jpg"
