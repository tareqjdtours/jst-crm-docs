#!/usr/bin/env bash
# Build one PDF per guide, plus the whole handbook, for a role folder under handbooks/.
#   tools/build-handbook.sh accountant
# Needs Google Chrome and uv (for pypdf).
set -euo pipefail
ROLE="${1:-accountant}"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SRC="$ROOT/handbooks/$ROLE"
OUT="$SRC/pdf"
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
mkdir -p "$OUT"
for f in "$SRC"/[0-9][0-9]-*.html; do
  name="$(basename "$f" .html)"
  "$CHROME" --headless=new --disable-gpu --no-pdf-header-footer \
    --print-to-pdf="$OUT/$name.pdf" "file://$f" 2>/dev/null
  echo "built $name.pdf"
done
uvx --with pypdf python - "$OUT" "$ROLE" <<'PY'
import sys, glob, os
from pypdf import PdfWriter
out, role = sys.argv[1], sys.argv[2]
w = PdfWriter()
for p in sorted(glob.glob(os.path.join(out, '[0-9][0-9]-*.pdf'))):
    w.append(p, outline_item=None if os.path.basename(p).startswith('00-') else os.path.basename(p)[3:-4].replace('-', ' ').capitalize())
dest = os.path.join(out, f'{role.capitalize()} handbook.pdf')
w.write(dest)
print('built', os.path.basename(dest))
PY
