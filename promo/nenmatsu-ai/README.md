# AI年末調整 イメージ動画（10秒）

`nenmatsu-ai.mp4`: 1920×1080 / 60fps / 10秒 / BGM・効果音つき

| 秒 | シーン |
| --- | --- |
| 0.0–2.0 | 「年末調整って、めんどう…💦」書類の山に困る人 |
| 2.0–3.5 | AIロボ登場、書類をぱくぱく →「AIに おまかせ！」 |
| 3.5–7.0 | スマホでパシャッ → AIが自動入力 → AIチェックOK → 提出 |
| 7.0–8.5 | 「提出かんりょう！」たった3分・ミス0件、紙吹雪 |
| 8.5–10.0 | エンドカード「AI年末調整」 |

## 作り直し方

```sh
./fetch-fonts.sh                                   # M PLUS Rounded 1c を fonts/ に取得
NODE_PATH=$(npm root -g) node render.cjs           # frames/ に連番PNG → nenmatsu-ai.mp4
NODE_PATH=$(npm root -g) node render.cjs --stills 2,5.3,9.8   # 指定秒の静止画を stills/ に出力
```

- `index.html`: アニメーション本体。`render(t)` で任意の時刻を描画（ブラウザで開くとループ再生）
- `music.py`: BGM・効果音を Python 標準ライブラリだけで合成
- `render.cjs`: Playwright でフレームを書き出し、ffmpeg で音声と合わせてエンコード
- 必要なもの: Node.js + Playwright（Chromium）、Python 3、ffmpeg
