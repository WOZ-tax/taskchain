// Renders index.html frame by frame with headless Chromium, then encodes an MP4 with ffmpeg.
//   node render.cjs                 -> nenmatsu-ai.mp4 (1920x1080, 60fps, with BGM/SFX)
//   node render.cjs --stills 1,2.5  -> preview PNGs at the given seconds
const { chromium } = require('playwright');
const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const FPS = Number(process.env.FPS || 60);
const DIR = __dirname;
const FRAMES = path.join(DIR, 'frames');

(async () => {
  const args = process.argv.slice(2);
  const stillsArg = args.indexOf('--stills');
  const stills = stillsArg >= 0 ? args[stillsArg + 1].split(',').map(Number) : null;

  const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
  await page.goto('file://' + path.join(DIR, 'index.html') + '?render');
  await page.evaluate(async () => {
    await Promise.all(['500', '800', '900'].map(w => document.fonts.load(`${w} 40px MPR`, '年末調整あア')));
    await document.fonts.ready;
  });

  if (stills) {
    fs.mkdirSync(path.join(DIR, 'stills'), { recursive: true });
    for (const t of stills) {
      await page.evaluate(t => window.render(t), t);
      await page.screenshot({ path: path.join(DIR, 'stills', `t${t.toFixed(2)}.png`) });
    }
    await browser.close();
    return;
  }

  fs.rmSync(FRAMES, { recursive: true, force: true });
  fs.mkdirSync(FRAMES, { recursive: true });
  const duration = await page.evaluate(() => window.DURATION);
  const total = Math.round(duration * FPS);
  for (let i = 0; i < total; i++) {
    await page.evaluate(t => window.render(t), i / FPS);
    await page.screenshot({ path: path.join(FRAMES, `${String(i).padStart(5, '0')}.png`) });
    if (i % FPS === 0) process.stdout.write(`frame ${i}/${total}\n`);
  }
  await browser.close();

  execFileSync('python3', [path.join(DIR, 'music.py'), path.join(FRAMES, 'audio.wav')], { stdio: 'inherit' });
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error',
    '-framerate', String(FPS), '-i', path.join(FRAMES, '%05d.png'),
    '-i', path.join(FRAMES, 'audio.wav'),
    '-af', 'aecho=0.8:0.6:45|90:0.18|0.10,loudnorm=I=-15:TP=-1.5:LRA=9',
    '-c:v', 'libx264', '-preset', 'slow', '-crf', '17', '-pix_fmt', 'yuv420p', '-movflags', '+faststart',
    '-c:a', 'aac', '-b:a', '192k', '-ar', '48000', '-shortest',
    path.join(DIR, 'nenmatsu-ai.mp4')], { stdio: 'inherit' });
  console.log('done: nenmatsu-ai.mp4');
})();
