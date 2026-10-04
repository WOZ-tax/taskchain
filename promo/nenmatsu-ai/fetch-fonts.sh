#!/bin/sh
# M PLUS Rounded 1c (SIL Open Font License) を fonts/ にダウンロードする
set -e
cd "$(dirname "$0")"
mkdir -p fonts
UA="Mozilla/5.0 (Windows NT 6.1) AppleWebKit/534.30 (KHTML, like Gecko) Chrome/12.0.742.122 Safari/534.30"
curl -sS -A "$UA" "https://fonts.googleapis.com/css2?family=M+PLUS+Rounded+1c:wght@500;800;900" \
  | grep -o 'https://[^)]*\.woff' | while read -r url; do
    w=$(curl -sS -A "$UA" "https://fonts.googleapis.com/css2?family=M+PLUS+Rounded+1c:wght@500;800;900" | grep -B4 "$url" | grep -o 'font-weight: [0-9]*' | grep -o '[0-9]*')
    curl -sS -o "fonts/mpr-$w.woff" "$url"
  done
ls fonts
