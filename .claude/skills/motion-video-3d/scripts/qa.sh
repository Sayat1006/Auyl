#!/usr/bin/env bash
# QA before/after the full render.
#  qa.sh <proj> preview  -> one frame per scene + build/qa_sheet.jpg (look for text/object/avatar/subtitle overlaps)
#  qa.sh <proj> audio    -> build/qa_spec.png spectrogram (gaps between sentences must be dark) + loudness
#  qa.sh <proj> video    -> build/qa_video.jpg contact sheet of the final mp4 every 2.5s
set -euo pipefail; D="$(cd "$1" && pwd)"; S="$(dirname "$0")"
case "$2" in
 preview) rm -rf "$D/build/preview"; node "$S/render.js" "$D" preview; ffmpeg -v error -y -pattern_type glob -i "$D/build/preview/*.jpg" -vf "scale=240:-1,tile=8x3:color=black" -frames:v 1 "$D/build/qa_sheet.jpg"; echo "$D/build/qa_sheet.jpg";;
 audio) ffmpeg -v error -y -i "$D/build/master.wav" -lavfi "showspectrumpic=s=1400x300:legend=0" "$D/build/qa_spec.png"; ffmpeg -i "$D/build/master.wav" -af ebur128 -f null - 2>&1 | grep -A1 "Integrated" | tail -1; echo "$D/build/qa_spec.png";;
 video) ffmpeg -v error -y -i "${3:-$D/build/video.mp4}" -vf "fps=1/2.5,scale=150:-1,tile=10x4:color=black" -frames:v 1 "$D/build/qa_video.jpg"; echo "$D/build/qa_video.jpg";;
esac
