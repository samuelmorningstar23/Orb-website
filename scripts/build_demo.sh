#!/usr/bin/env bash
# Build the live demo: the Orb front end in demo mode, plus the recordings it replays.
#
#   scripts/build_demo.sh [/path/to/Orb]
#
# 1. In the Orb repo: `vite build --config vite.demo.config.ts` writes public/demo here
#    (the real app, API calls answered by src/demo/shim.ts from recordings).
# 2. The recordings come from `node docs/website-assets/capture.cjs --record` in the
#    Orb repo (backend up, DB reseeded) and land in docs/website-assets/fixtures.
#    They are copied to public/demo-data, outside the build folder, so a rebuild
#    cannot wipe them.
set -euo pipefail
ORB="${1:-$HOME/Documents/Projects/Orb}"
SITE="$(cd "$(dirname "$0")/.." && pwd)"
export PATH="$HOME/.local/bin:$PATH"
( cd "$ORB" && npx vite build --config vite.demo.config.ts --outDir "$SITE/public/demo" )
mkdir -p "$SITE/public/demo-data"
cp "$ORB"/docs/website-assets/fixtures/*.json "$SITE/public/demo-data/"
ls -la "$SITE/public/demo-data" | awk 'NR>3{printf "%s %.2f MB\n",$9,$5/1048576}'
echo "demo built into public/demo, recordings in public/demo-data"
