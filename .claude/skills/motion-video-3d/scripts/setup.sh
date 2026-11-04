#!/usr/bin/env bash
# One-time (idempotent) install of everything the pipeline needs into $MV3D_HOME (~/.cache/motion-video-3d).
# Only uses hosts that are usually reachable from sandboxes: pypi, npm registry, github releases.
set -euo pipefail
H="${MV3D_HOME:-$HOME/.cache/motion-video-3d}"; mkdir -p "$H/voices" "$H/u2net"
command -v ffmpeg >/dev/null || { echo "ffmpeg missing: install it (apt-get install -y ffmpeg)"; exit 1; }
python3 -c "import piper" 2>/dev/null || pip install -q --break-system-packages piper-tts
python3 -c "import rembg" 2>/dev/null || pip install -q --break-system-packages "rembg[cpu]"
python3 -c "import numpy, PIL" 2>/dev/null || pip install -q --break-system-packages numpy pillow
[ -d "$H/node_modules/three" ] || (cd "$H" && npm init -y >/dev/null && npm i --silent three@0.170.0)
node -e "require('playwright')" 2>/dev/null || (cd "$H" && npm i --silent playwright && npx playwright install chromium)
# Kazakh voices (ISSAI KazakhTTS via Piper). issai-high has 6 speakers: 0,1 male; 2..5 female.
for v in issai-high iseke-x-low; do
  [ -f "$H/voices/kk-$v.onnx" ] || curl -sSL "https://github.com/rhasspy/piper/releases/download/v0.0.2/voice-kk-$v.tar.gz" | tar xz -C "$H/voices"
done
# background-removal model for the narrator photo
[ -f "$H/u2net/isnet-general-use.onnx" ] || curl -sSL -o "$H/u2net/isnet-general-use.onnx" https://github.com/danielgatis/rembg/releases/download/v0.0.0/isnet-general-use.onnx
echo "ready: $H"
