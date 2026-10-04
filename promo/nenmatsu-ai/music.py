"""Synthesizes the 10-second pop BGM + sound effects for the video (pure Python, no deps).

usage: python3 music.py out.wav
Timeline matches index.html: 120 BPM (1 beat = 0.5s).
"""
import array
import math
import random
import sys
import wave

SR = 44100
DUR = 10.6
N = int(SR * DUR)
L = array.array('d', bytes(8 * N))
R = array.array('d', bytes(8 * N))
rnd = random.Random(7)
TAU = 2 * math.pi


def hz(m):
    return 440.0 * 2 ** ((m - 69) / 12)


def put(t0, samples, gain=1.0, pan=0.0):
    i0 = int(t0 * SR)
    gl, gr = gain * (1 - max(0, pan)), gain * (1 + min(0, pan))
    for k, v in enumerate(samples):
        i = i0 + k
        if 0 <= i < N:
            L[i] += v * gl
            R[i] += v * gr


def env_adsr(n, a, d, s, rel, total):
    """Generator of envelope values for n samples; note-off at `total` seconds."""
    off = int(total * SR)
    for k in range(n):
        t = k / SR
        if k < off:
            if t < a:
                e = t / a
            elif t < a + d:
                e = 1 - (1 - s) * (t - a) / d
            else:
                e = s
        else:
            e = s * max(0.0, 1 - (k - off) / (rel * SR))
        yield e


# ---------------- instruments ----------------
def lead(m, dur):
    f = hz(m)
    n = int((dur + 0.08) * SR)
    out, ph = [], 0.0
    for k, e in enumerate(env_adsr(n, 0.006, 0.09, 0.65, 0.07, dur)):
        t = k / SR
        vib = 1 + 0.004 * math.sin(TAU * 5.5 * t) * min(1, max(0, (t - 0.12) * 6))
        ph += TAU * f * vib / SR
        v = math.sin(ph) + 0.30 * math.sin(3 * ph) + 0.14 * math.sin(5 * ph) + 0.22 * math.sin(2 * ph)
        out.append(v * e * 0.55)
    return out


def bell(m, decay=0.9):
    f = hz(m)
    n = int(decay * 2.5 * SR)
    return [(math.sin(TAU * f * k / SR) + 0.35 * math.sin(TAU * f * 2.76 * k / SR) * math.exp(-k / SR * 8)
             + 0.18 * math.sin(TAU * f * 5.4 * k / SR) * math.exp(-k / SR * 14))
            * math.exp(-k / SR / decay * 2.2) * min(1, k / 60) for k in range(n)]


def pluck(m, decay=0.22):
    f = hz(m)
    n = int(decay * 4 * SR)
    return [(math.sin(TAU * f * k / SR) + 0.25 * math.sin(TAU * f * 4 * k / SR) * math.exp(-k / SR * 30))
            * math.exp(-k / SR / decay * 2.0) * min(1, k / 40) for k in range(n)]


def bass(m, dur):
    f = hz(m)
    n = int((dur + 0.05) * SR)
    out = []
    for k, e in enumerate(env_adsr(n, 0.004, 0.12, 0.55, 0.05, dur)):
        p = (f * k / SR) % 1.0
        tri = 4 * abs(p - 0.5) - 1
        out.append((0.7 * tri + 0.6 * math.sin(TAU * f * k / SR)) * e)
    return out


def kick():
    n = int(0.28 * SR)
    out, ph = [], 0.0
    for k in range(n):
        t = k / SR
        f = 48 + 110 * math.exp(-t * 28)
        ph += TAU * f / SR
        out.append(math.sin(ph) * math.exp(-t * 11) + (rnd.uniform(-1, 1) * 0.3 * math.exp(-t * 300)))
    return out


def noise_hit(dur, decay, hp=0.0, tone=0.0, tone_f=200):
    n = int(dur * SR)
    out, prev_in, prev_out = [], 0.0, 0.0
    for k in range(n):
        t = k / SR
        x = rnd.uniform(-1, 1)
        if hp:
            y = hp * (prev_out + x - prev_in)  # one-pole high-pass
            prev_in, prev_out = x, y
            x = y
        out.append((x + tone * math.sin(TAU * tone_f * t)) * math.exp(-t * decay))
    return out


def clap():
    s = noise_hit(0.22, 22, hp=0.75, tone=0.35, tone_f=210)
    for burst in (0.0, 0.011, 0.022):  # flam for a hand-clap feel
        i = int(burst * SR)
        for k in range(min(300, len(s) - i)):
            s[i + k] *= 1.4
    return s


def hat():
    return noise_hit(0.05, 90, hp=0.92)


def crash():
    return noise_hit(1.4, 3.2, hp=0.9)


def woodblock(f):
    n = int(0.12 * SR)
    return [math.sin(TAU * f * k / SR) * math.exp(-k / SR * 45) + 0.4 * math.sin(TAU * f * 2.3 * k / SR) * math.exp(-k / SR * 70)
            for k in range(n)]


# ---------------- sound effects ----------------
def sweep(f0, f1, dur, shape='sin', decay=0.0, curve=1.0):
    n = int(dur * SR)
    out, ph = [], 0.0
    for k in range(n):
        x = k / n
        f = f0 * (f1 / f0) ** (x ** curve)
        ph += TAU * f / SR
        v = math.sin(ph) if shape == 'sin' else (1.0 if math.sin(ph) > 0 else -1.0) * 0.6
        e = min(1, k / 80) * (1 - x) ** 1.5 if not decay else min(1, k / 80) * math.exp(-x * decay)
        out.append(v * e)
    return out


def popfx():
    return sweep(500, 1300, 0.07)


def boing():
    n = int(0.45 * SR)
    out, ph = [], 0.0
    for k in range(n):
        t = k / SR
        f = 260 + 380 * min(1, t / 0.06) + 60 * math.sin(TAU * 14 * t) * math.exp(-t * 5)
        ph += TAU * f / SR
        out.append(math.sin(ph) * math.exp(-t * 6) * min(1, k / 60))
    return out


def whoosh(dur, rising=True):
    n = int(dur * SR)
    out, lp = [], 0.0
    for k in range(n):
        x = k / n
        a = 0.02 + 0.25 * (x if rising else 1 - x)
        lp += a * (rnd.uniform(-1, 1) - lp)
        out.append(lp * math.sin(math.pi * x) ** 1.2 * 2.2)
    return out


def shutter():
    s = [0.0] * int(0.16 * SR)
    for t0 in (0.0, 0.07):
        h = noise_hit(0.04, 120, hp=0.6, tone=0.6, tone_f=1800)
        i = int(t0 * SR)
        for k, v in enumerate(h):
            s[i + k] += v
    return s


def blip(f, dur=0.06):
    return sweep(f, f * 1.5, dur, shape='sq', decay=5)


def tick():
    return noise_hit(0.012, 400, hp=0.8)


def thump():
    k = kick()
    nz = noise_hit(0.25, 18, hp=0.3)
    return [a * 1.2 + 0.5 * (nz[i] if i < len(nz) else 0) for i, a in enumerate(k)]


def scan_beep():
    n = int(0.45 * SR)
    return [math.sin(TAU * (1200 + 500 * math.sin(TAU * 9 * k / SR)) * k / SR) * 0.35 * math.sin(math.pi * k / n) for k in range(n)]


# ---------------- arrangement ----------------
NOTE = {'C': 0, 'D': 2, 'E': 4, 'F': 5, 'G': 7, 'A': 9, 'B': 11}


def n(name):
    """'C5' / 'G#4' -> MIDI number."""
    acc = 1 if '#' in name else 0
    return 12 * (int(name[-1]) + 1) + NOTE[name[0]] + acc


# Intro (0-2s): a little "hmm..." in A minor with a ticking woodblock
for i, t in enumerate((0.0, 0.5, 1.0, 1.5)):
    put(t, woodblock(1400 if i % 2 == 0 else 1000), 0.16, pan=0.2)
for t, chord in ((0.0, ('A3', 'C4', 'E4')), (1.0, ('A3', 'D4', 'F4')), (1.5, ('G3', 'B3', 'D4', 'F4'))):
    for j, m in enumerate(chord):
        put(t + j * 0.018, pluck(n(m), 0.35), 0.10, pan=-0.2 + j * 0.13)
for t, m, d in ((0.0, 'A2', 0.9), (1.0, 'D3', 0.45), (1.5, 'G2', 0.45)):
    put(t, bass(n(m), d), 0.16)
for t, m in ((0.0, 'A4'), (0.25, 'C5'), (0.5, 'E5'), (1.0, 'F5'), (1.25, 'D5'), (1.5, 'B4'), (1.75, 'D5'), (1.875, 'F5')):
    put(t, bell(n(m), 0.5), 0.10, pan=0.15)

# Main groove (2.0-8.5s)
chords = [  # (start, voicing, bass root)
    (2.0, ('C4', 'E4', 'G4'), 'C3'), (3.0, ('B3', 'D4', 'G4'), 'G2'), (4.0, ('C4', 'E4', 'A4'), 'A2'),
    (5.0, ('C4', 'F4', 'A4'), 'F2'), (6.0, ('D4', 'F4', 'A4'), 'D3'), (6.5, ('B3', 'D4', 'G4'), 'G2'),
    (7.0, ('C4', 'E4', 'G4'), 'C3'), (8.0, ('C4', 'F4', 'A4'), 'F2'), (8.25, ('B3', 'D4', 'G4'), 'G2'),
]
for idx, (t0, voicing, root) in enumerate(chords):
    t1 = chords[idx + 1][0] if idx + 1 < len(chords) else 8.5
    t = t0
    while t < t1 - 1e-6:
        put(t, bass(n(root), 0.18), 0.24)                              # root on the beat
        put(t + 0.25, bass(n(root) + 12, 0.14), 0.17)                  # octave bounce
        for j, m in enumerate(voicing):                                # off-beat stabs
            put(t + 0.25 + j * 0.01, pluck(n(m), 0.16), 0.075, pan=-0.25 + j * 0.25)
        t += 0.5

melody = [
    (2.0, 'E5', .25), (2.25, 'G5', .25), (2.5, 'C6', .5),
    (3.0, 'B5', .25), (3.25, 'A5', .25), (3.5, 'G5', .25), (3.75, 'D5', .25),
    (4.0, 'E5', .25), (4.25, 'A5', .25), (4.5, 'C6', .25), (4.75, 'A5', .25),
    (5.0, 'A5', .25), (5.25, 'G5', .25), (5.5, 'F5', .25), (5.75, 'A5', .25),
    (6.0, 'F5', .25), (6.25, 'A5', .25), (6.5, 'G5', .25), (6.75, 'B5', .25),
    (7.0, 'C6', .375), (7.375, 'B5', .125), (7.5, 'C6', .25), (7.75, 'E6', .25),
    (8.0, 'C6', .25), (8.25, 'B5', .25), (8.5, 'C6', 1.1),
]
for t, m, d in melody:
    put(t, lead(n(m), d * 0.92), 0.13)
    put(t + 0.0, bell(n(m) + 12, 0.25), 0.025, pan=0.3)  # sparkle doubling

t = 2.0
while t < 8.5 - 1e-6:
    put(t, kick(), 0.42)
    put(t + 0.25, hat(), 0.07, pan=0.35)
    if abs((t - 2.0) % 1.0 - 0.5) < 1e-6:
        put(t, clap(), 0.16, pan=-0.1)
    t += 0.5
put(6.75, clap(), 0.10); put(6.875, clap(), 0.12)                      # fill into the climax
put(7.0, crash(), 0.10, pan=0.25)

# Ending (8.5s~): final chord + bell arpeggio
for j, m in enumerate(('C4', 'E4', 'G4', 'C5')):
    put(8.5 + j * 0.012, pluck(n(m), 0.9), 0.08, pan=-0.3 + j * 0.2)
put(8.5, bass(n('C2'), 1.2), 0.22); put(8.5, kick(), 0.4); put(8.5, crash(), 0.12, pan=-0.25)
for j, m in enumerate(('C6', 'E6', 'G6', 'C7', 'E7', 'G7')):
    put(8.6 + j * 0.07, bell(n(m), 0.8), 0.06, pan=-0.4 + j * 0.16)
for j, m in enumerate(('G6', 'C7', 'E7')):
    put(9.15 + j * 0.06, bell(n(m), 0.7), 0.045, pan=0.3)

# ---------------- SFX (synced with the picture) ----------------
put(0.10, popfx(), 0.22)                                                 # caption pop
for i in range(6):                                                       # papers landing
    tl = 0.22 + i * 0.15 + 0.16
    put(tl, noise_hit(0.06, 70, hp=0.4, tone=0.8, tone_f=180 - i * 8), 0.13, pan=0.35)
put(0.48, sweep(700, 420, 0.18), 0.06)                                   # person appears ("uh..")
put(1.74, popfx(), 0.12)                                                 # caption out
put(1.66, whoosh(0.45), 0.35)                                            # wipe
put(2.0, boing(), 0.28)                                                  # robot pops in
put(2.04, bell(n('E7'), 0.4), 0.05); put(2.1, bell(n('B7'), 0.35), 0.04)
put(2.28, popfx(), 0.2)                                                  # bubble
for i in range(6):                                                       # papers swallowed
    put(2.62 + i * 0.07, sweep(500 + i * 90, 1400 + i * 120, 0.08), 0.07)
put(3.25, sweep(1200, 400, 0.1), 0.08)                                   # bubble out
put(3.38, whoosh(0.4), 0.22)                                             # phone slides in
put(3.62, popfx(), 0.15)                                                 # feature card 1
put(3.58, shutter(), 0.3)                                                # camera
put(3.72, scan_beep(), 0.09, pan=-0.1)                                   # scanning
put(3.95, blip(1600), 0.06); put(4.08, blip(1800), 0.06)                 # detection boxes
put(4.22, bell(n('E6'), 0.5), 0.10); put(4.29, bell(n('B6'), 0.5), 0.09)  # read complete
put(4.45, whoosh(0.25), 0.12)                                            # panel slide
put(4.60, popfx(), 0.13)                                                 # feature card 2
for i in range(5):                                                       # typing + check
    t0 = 4.62 + i * 0.25
    for k in range(4):
        put(t0 + k * 0.05, tick(), 0.12, pan=-0.2)
    put(t0 + 0.22, blip(1300 + i * 120, 0.07), 0.07)
put(6.0, thump(), 0.4)                                                   # stamp
put(6.02, popfx(), 0.13)                                                 # feature card 3
put(6.25, bell(n('G6'), 0.4), 0.06)                                      # button lights up
put(6.62, sweep(900, 300, 0.035), 0.2)                                   # tap
put(6.86, whoosh(0.32, rising=False), 0.18)                              # scene out
put(7.02, noise_hit(0.35, 9, hp=0.85), 0.16, pan=-0.6)                   # party poppers
put(7.02, noise_hit(0.35, 9, hp=0.85), 0.16, pan=0.6)
for i in range(8):                                                       # title letters
    put(7.08 + i * 0.05, pluck(n(('C6', 'D6', 'E6', 'G6', 'A6', 'C7', 'D7', 'E7')[i]), 0.12), 0.06)
put(7.42, popfx(), 0.15); put(7.58, popfx(), 0.15)                       # badges
put(8.36, whoosh(0.42), 0.24)                                            # end wipe
put(9.12, popfx(), 0.14)                                                 # tagline

# fade-out tail + normalize
fade0, fade1 = int(9.75 * SR), int(10.0 * SR)
for i in range(fade0, N):
    g = max(0.0, 1 - (i - fade0) / (fade1 - fade0)) if i < fade1 else 0.0
    L[i] *= g
    R[i] *= g
peak = max(max(abs(v) for v in L), max(abs(v) for v in R)) or 1.0
scale = 0.89 / peak
frames = array.array('h', bytes(4 * N))
for i in range(N):
    frames[2 * i] = int(max(-1, min(1, L[i] * scale)) * 32767)
    frames[2 * i + 1] = int(max(-1, min(1, R[i] * scale)) * 32767)
with wave.open(sys.argv[1] if len(sys.argv) > 1 else 'audio.wav', 'wb') as w:
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes(frames.tobytes())
print('audio written, peak scale %.3f' % scale)
