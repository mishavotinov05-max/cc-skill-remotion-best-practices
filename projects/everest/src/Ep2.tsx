import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame} from 'remotion';
import subs2 from './subs2.json';
import {World2} from './World2';
import {Figure, Overlay, Shot, Snow, ramp, shake} from './Everest';
import {Key, cam, clamp, ease, lerp, rnd, seg} from './util';

export const FPS2 = 30;
export const DURATION2 = 93.28;
const END = 93.1; // instant darkness
const KN = [81.75, 82.3, 82.85]; // three knocks on the back door
const KEYWORDS = new Set(['дверь', 'двери', 'дверью', 'следы', 'рация', 'рации', 'никого', 'обратно', 'снег', 'голос', 'голосу', 'стол', 'полосы', 'царапины', 'трижды', 'постучал', 'вижу', 'открывай', 'открой', 'замер', 'верь', '«беги»', 'это', 'я»', 'фонарик', 'раньше']);

// ---------- door close-up (continues the last frame of episode 1) ----------
const Door2: React.FC<{t: number; zoom: number; angle: number; o: number; sk?: {x: number; y: number}}> = ({t, zoom, angle, o, sk = {x: 0, y: 0}}) => {
  const px = 1180;
  const py = 560;
  const hx = 900;
  const sx = 1 - 0.8 * o;
  return (
    <svg width={1080} height={1920} viewBox="0 0 1080 1920">
      <defs>
        <linearGradient id="dw2" x1="0" x2="1">
          <stop offset="0" stopColor="#1b1612" />
          <stop offset="0.5" stopColor="#2a211a" />
          <stop offset="1" stopColor="#120e0b" />
        </linearGradient>
        <linearGradient id="metal2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#8d8a84" />
          <stop offset="0.5" stopColor="#4a4843" />
          <stop offset="1" stopColor="#1d1c1a" />
        </linearGradient>
        <linearGradient id="sky2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#04070f" />
          <stop offset="1" stopColor="#18304f" />
        </linearGradient>
      </defs>
      <g transform={`translate(${sk.x} ${sk.y}) translate(540 960) scale(${zoom}) translate(${-px} ${-py})`}>
        {/* outside, seen through the opening */}
        <rect x={-1500} y={-1500} width={5000} height={5000} fill="url(#sky2)" />
        <rect x={-1500} y={700} width={5000} height={2500} fill="#2c4263" />
        <rect x={-1500} y={880} width={5000} height={2500} fill="#2a1d14" />
        {Array.from({length: 7}).map((_, i) => (
          <rect key={i} x={-1500} y={910 + i * 40} width={5000} height={3} fill="#000" opacity={0.5} />
        ))}
        <path d="M800 700 L1000 560 L1150 660 L1300 520 L1500 690 L1700 700 Z" fill="#101c33" />
        <Snow t={t} n={110} speed={420} w={1920} h={1080} op={0.85} />
        {/* the door leaf, hinged on the left */}
        <g transform={`translate(${hx} 0) scale(${sx} 1) translate(${-hx} 0)`}>
          <rect x={-1500} y={-1500} width={5000} height={5000} fill="url(#dw2)" />
          {Array.from({length: 14}).map((_, i) => (
            <rect key={i} x={i * 150 - 40} y={-1500} width={4} height={5000} fill="#000" opacity={0.45} />
          ))}
          {Array.from({length: 40}).map((_, i) => (
            <rect key={i} x={rnd(i) * 1900} y={rnd(i + 3) * 1000} width={60 + rnd(i + 2) * 160} height={2} fill="#000" opacity={0.2} />
          ))}
          <rect x={px - 110} y={py - 230} width={220} height={500} rx={30} fill="#15110e" stroke="#35302a" strokeWidth={3} />
          <circle cx={px} cy={py + 150} r={16} fill="#050505" />
          <rect x={px - 6} y={py + 160} width={12} height={50} fill="#050505" />
          <circle cx={px} cy={py} r={78} fill="url(#metal2)" stroke="#000" strokeWidth={4} />
          <circle cx={px} cy={py} r={52} fill="#2a2926" />
          <g transform={`rotate(${angle} ${px} ${py})`}>
            <rect x={px - 330} y={py - 22} width={400} height={44} rx={22} fill="url(#metal2)" stroke="#000" strokeWidth={3} />
            <rect x={px - 316} y={py - 14} width={360} height={9} rx={5} fill="#d0cdc6" opacity={0.35} />
            <circle cx={px} cy={py} r={34} fill="url(#metal2)" stroke="#000" strokeWidth={3} />
          </g>
          <rect x={0} y={1040} width={1920} height={40} fill="#cfe6ff" opacity={0.1 + 0.08 * Math.sin(t * 3)} />
        </g>
        {o > 0.02 && <rect x={hx + 1020 * sx - 40} y={-1500} width={40} height={5000} fill="#000" opacity={0.35} />}
      </g>
    </svg>
  );
};

// ---------- empty porch seen from the doorway ----------
const Porch: React.FC<{t: number; p: number}> = ({t, p}) => {
  const drift = (t * 40) % 1080;
  return (
    <svg width={1080} height={1920} viewBox="0 0 1080 1920">
      <defs>
        <linearGradient id="pk" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#02040a" />
          <stop offset="1" stopColor="#13243d" />
        </linearGradient>
        <linearGradient id="sn" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1d304d" />
          <stop offset="1" stopColor="#3b557d" />
        </linearGradient>
      </defs>
      <g transform={`translate(540 1000) scale(${1 + p * 0.14}) translate(-540 -1000)`}>
        <rect x={-300} y={-300} width={1680} height={1200} fill="url(#pk)" />
        {Array.from({length: 90}).map((_, i) => (
          <circle key={i} cx={rnd(i) * 1080} cy={rnd(i + 1) * 700} r={0.7 + rnd(i + 2) * 1.5} fill="#fff" opacity={0.35 + 0.4 * Math.abs(Math.sin(t * 0.7 + i))} />
        ))}
        <path d="M-100 930 L120 760 L260 860 L430 700 L620 850 L780 740 L980 860 L1180 780 L1180 960 L-100 960 Z" fill="#0c1730" transform={`translate(${-drift * 0.05} 0)`} />
        <path d="M-100 990 L160 860 L330 940 L520 830 L720 950 L910 880 L1180 960 L1180 1040 L-100 1040 Z" fill="#162645" transform={`translate(${-drift * 0.1} 0)`} />
        <rect x={-300} y={950} width={1680} height={560} fill="url(#sn)" />
        {Array.from({length: 26}).map((_, i) => (
          <ellipse key={i} cx={rnd(i + 20) * 1080} cy={980 + rnd(i + 30) * 480} rx={50 + rnd(i) * 110} ry={6 + rnd(i + 5) * 14} fill="#6a86ae" opacity={0.18} />
        ))}
        <path d="M-100 1010 Q200 960 520 1000 Q800 1030 1180 985" stroke="#02040a" strokeWidth={10} fill="none" opacity={0.7} />
        {/* porch boards */}
        <path d="M-300 1500 L1380 1500 L1380 2300 L-300 2300 Z" fill="#241a12" />
        {Array.from({length: 10}).map((_, i) => (
          <rect key={i} x={-300} y={1500 + i * i * 7 + i * 36} width={1680} height={3 + i * 0.7} fill="#000" opacity={0.6} />
        ))}
        <rect x={-300} y={1490} width={1680} height={16} fill="#3a2a1d" />
        {/* railing */}
        {[90, 990].map((x) => (
          <rect key={x} x={x - 14} y={1180} width={28} height={330} fill="#0d0907" />
        ))}
        <rect x={60} y={1180} width={30} height={18} fill="#0d0907" />
        <Snow t={t} n={170} speed={620} w={1080} h={1920} op={0.9} />
      </g>
      {/* doorway frame (inside the house, warm edge from the stove) */}
      <rect x={-50} y={-50} width={160} height={2100} fill="#080605" />
      <rect x={970} y={-50} width={160} height={2100} fill="#080605" />
      <rect x={-50} y={-50} width={1180} height={190} fill="#080605" />
      <rect x={108} y={140} width={5} height={1800} fill="#e0a05a" opacity={0.3} />
      <rect x={967} y={140} width={5} height={1800} fill="#e0a05a" opacity={0.3} />
      <rect x={110} y={138} width={860} height={5} fill="#e0a05a" opacity={0.2} />
    </svg>
  );
};

// ---------- footprints in the snow, seen from above ----------
const PRINTS = Array.from({length: 17}).map((_, i) => ({y: -1150 + i * 112, x: 540 + Math.sin(i * 0.5) * 70 + (i % 2 ? 36 : -36), rot: (i % 2 ? 8 : -8) + Math.sin(i) * 6}));
const Footprints: React.FC<{t: number; camY: number; zoom: number}> = ({t, camY, zoom}) => (
  <svg width={1080} height={1920} viewBox="0 0 1080 1920">
    <defs>
      <linearGradient id="ground" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#0b1424" />
        <stop offset="1" stopColor="#1f3350" />
      </linearGradient>
      <linearGradient id="void" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#000" />
        <stop offset="1" stopColor="#060b16" />
      </linearGradient>
    </defs>
    <g transform={`translate(540 960) scale(${zoom}) translate(-540 ${-camY})`}>
      <rect x={-600} y={-2600} width={2280} height={1500} fill="url(#void)" />
      {Array.from({length: 12}).map((_, i) => (
        <circle key={i} cx={rnd(i) * 1080} cy={-2500 + rnd(i + 3) * 1200} r={1.5} fill="#fff" opacity={0.15 + 0.2 * Math.abs(Math.sin(t + i))} />
      ))}
      <rect x={-600} y={-1100} width={2280} height={3000} fill="url(#ground)" />
      <path d="M-600 -1100 L-100 -1150 L120 -1090 L330 -1160 L560 -1085 L800 -1150 L1000 -1100 L1250 -1140 L1680 -1100 L1680 -1000 L-600 -1000 Z" fill="#030610" />
      <path d="M-600 -1000 Q300 -1040 1680 -980" stroke="#7da0cc" strokeWidth={5} fill="none" opacity={0.35} />
      {Array.from({length: 44}).map((_, i) => (
        <ellipse key={i} cx={rnd(i) * 1080} cy={-950 + rnd(i + 9) * 1900} rx={50 + rnd(i + 3) * 120} ry={8 + rnd(i + 4) * 22} fill="#5e7ba3" opacity={0.15} />
      ))}
      {PRINTS.map((p, i) => (
        <g key={i} transform={`translate(${p.x} ${p.y}) rotate(${p.rot})`}>
          <ellipse cx={0} cy={0} rx={30} ry={58} fill="#070d19" />
          <ellipse cx={-3} cy={-4} rx={26} ry={52} fill="#0b1425" />
          <ellipse cx={-7} cy={-9} rx={29} ry={55} fill="none" stroke="#7da0cc" strokeWidth={3} opacity={0.5} />
          <rect x={-18} y={-24} width={36} height={4} fill="#1d2f4c" />
          <rect x={-18} y={-4} width={36} height={4} fill="#1d2f4c" />
          <rect x={-18} y={16} width={36} height={4} fill="#1d2f4c" />
        </g>
      ))}
      {/* porch and open doorway */}
      <rect x={-600} y={760} width={2280} height={700} fill="#241a12" />
      {Array.from({length: 7}).map((_, i) => (
        <rect key={i} x={-600} y={800 + i * 62} width={2280} height={4} fill="#000" opacity={0.6} />
      ))}
      <rect x={-600} y={750} width={2280} height={16} fill="#3a2a1d" />
      <rect x={-600} y={1160} width={2280} height={400} fill="#0b0806" />
      <rect x={300} y={1160} width={480} height={400} fill="#1a0f08" />
      <path d="M300 1160 L780 1160 L900 760 L180 760 Z" fill="#ff9a3c" opacity={0.2 + 0.05 * Math.sin(t * 13)} />
      {/* the last print ends right at the step */}
      <circle cx={PRINTS[16].x} cy={PRINTS[16].y} r={78 + 8 * Math.sin(t * 4)} fill="none" stroke="#ffd27a" strokeWidth={3} opacity={t > 31.3 && t < 33.8 ? 0.5 : 0} />
    </g>
    <Snow t={t} n={70} speed={260} w={1080} h={1920} op={0.5} />
  </svg>
);

// ---------- radio close-up ----------
const Radio2: React.FC<{t: number; t0: number; voice: [number, number][]; p: number}> = ({t, t0, voice, p}) => {
  const led = t > t0 + 0.15 ? 0.65 + 0.35 * Math.sin(t * 14) : 0;
  const speak = voice.some(([a, b]) => t >= a && t <= b) ? 1 : 0;
  const flick = Math.max(0, Math.sin(t * 37) * Math.sin(t * 11));
  return (
    <svg width={1080} height={1920} viewBox="0 0 1080 1920">
      <rect width={1080} height={1920} fill="#050507" />
      <g transform={`translate(540 960) scale(${1 + p * 0.14}) translate(-960 -540)`}>
        <path d="M900 140 L1180 -120" stroke="#222" strokeWidth={10} />
        <rect x={560} y={260} width={800} height={520} rx={36} fill="#26292b" stroke="#000" strokeWidth={6} />
        <rect x={590} y={290} width={740} height={460} rx={24} fill="#1a1c1e" />
        <circle cx={760} cy={540} r={150} fill="#0b0c0d" stroke="#3a3d40" strokeWidth={6} />
        {Array.from({length: 7}).map((_, i) => (
          <circle key={i} cx={760} cy={540} r={20 + i * 20} fill="none" stroke="#2d3033" strokeWidth={3} />
        ))}
        {[1, 2, 3].map((i) => {
          const ph = (t * 1.4 + i / 3) % 1;
          return <circle key={i} cx={760} cy={540} r={150 * ph + 10} fill="none" stroke="#a9c8ee" strokeWidth={3} opacity={speak * (1 - ph) * 0.8} />;
        })}
        <rect x={980} y={330} width={280} height={90} rx={10} fill="#0b140f" />
        <rect x={990} y={340} width={260} height={70} rx={6} fill="#9fd9a8" opacity={0.12 + 0.35 * flick * (1 - speak) + 0.25 * speak} />
        <circle cx={1220} cy={470} r={22} fill="#3a0a0a" />
        <circle cx={1220} cy={470} r={22} fill="#ff3b30" opacity={led} />
        <circle cx={1220} cy={470} r={80} fill="#ff3b30" opacity={led * 0.12} />
        <circle cx={1060} cy={580} r={46} fill="#101112" stroke="#3a3d40" strokeWidth={5} />
        <rect x={1056} y={540} width={8} height={30} fill="#d8d8d8" transform="rotate(50 1060 580)" />
        <rect x={980} y={660} width={280} height={14} fill="#0b0c0d" />
        <path d="M520 700 Q500 820 600 880 L760 900 L780 760 Z" fill="#0b0b0d" stroke="#5a5f66" strokeWidth={4} />
        <path d="M1340 700 Q1380 820 1260 900 L1080 900 L1100 760 Z" fill="#0b0b0d" stroke="#5a5f66" strokeWidth={4} />
        <rect x={500} y={880} width={800} height={500} fill="#5a1010" />
      </g>
      {Array.from({length: 6}).map((_, i) => (
        <rect key={i} x={0} y={(t * 600 * (i + 1)) % 1920} width={1080} height={2 + i} fill="#fff" opacity={0.03 + 0.05 * flick * (1 - speak)} />
      ))}
    </svg>
  );
};

// ---------- flashlight beam: darkens everything except a cone ----------
const Flashlight: React.FC<{ox: number; oy: number; ang: number; spread?: number; len?: number; k?: number}> = ({ox, oy, ang, spread = 0.3, len = 1800, k = 1}) => {
  const a1 = ang - spread;
  const a2 = ang + spread;
  const pts = `${ox},${oy} ${ox + Math.cos(a1) * len},${oy + Math.sin(a1) * len} ${ox + Math.cos(a2) * len},${oy + Math.sin(a2) * len}`;
  return (
    <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{position: 'absolute', left: 0, top: 0}}>
      <defs>
        <filter id="fbl" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="34" />
        </filter>
        <mask id="fmk">
          <rect width={1080} height={1920} fill="white" />
          <polygon points={pts} fill="black" filter="url(#fbl)" />
        </mask>
        <radialGradient id="fgr" cx={ox} cy={oy} r={len} gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#ffe9b8" stopOpacity={0.5 * k} />
          <stop offset="0.7" stopColor="#ffd9a0" stopOpacity={0.18 * k} />
          <stop offset="1" stopColor="#ffd9a0" stopOpacity={0} />
        </radialGradient>
      </defs>
      <rect width={1080} height={1920} fill="#000" opacity={0.62 * k} mask="url(#fmk)" />
      <polygon points={pts} fill="url(#fgr)" filter="url(#fbl)" style={{mixBlendMode: 'screen'}} />
    </svg>
  );
};

// ---------- interior (same room as episode 1) ----------
const camKeys2: Key[] = [
  [4.8, 1250, 580, 1.25],
  [10.7, 1250, 570, 1.4],
  [12.3, 1300, 580, 1.35],
  [13.9, 1400, 580, 1.3],
  [34.9, 1230, 560, 1.25],
  [36.2, 1230, 560, 1.2],
  [38.7, 1200, 580, 1.15],
  [39.1, 1200, 580, 1.15],
  [47.4, 360, 420, 1.3],
  [52.5, 340, 440, 1.6],
  [56.8, 310, 500, 2.1],
  [61.4, 300, 500, 2.3],
  [62.5, 500, 560, 1.2],
  [64.6, 1000, 600, 1.15],
  [66.5, 1650, 600, 1.25],
  [67.7, 2000, 430, 1.6],
  [71.9, 2150, 420, 1.7],
  [73.1, 2150, 400, 1.7],
  [75.0, 2145, 370, 2.3],
  [75.7, 2145, 370, 2.4],
  [75.9, 2145, 380, 2.0],
  [76.4, 2300, 500, 1.2],
  [79.0, 3300, 540, 1.1],
  [80.4, 4000, 540, 1.2],
  [83.9, 4150, 540, 1.3],
  [87.8, 1340, 570, 1.1],
  [92.6, 1280, 560, 1.25],
];

const Interior2: React.FC<{t: number}> = ({t}) => {
  const c = cam(t, camKeys2);
  let sk = {x: 0, y: 0};
  for (const k of KN) if (t >= k && t < k + 0.2) sk = shake(t, 20 * (1 - (t - k) / 0.2));
  if (t >= 35.5 && t < 35.9) sk = shake(t, 16 * (1 - (t - 35.5) / 0.4));
  // table: dragged to the door while "придвинул к ней тяжёлый стол"
  const tableX = t < 36.25 ? 2300 : lerp(2300, 860, ease((t - 36.25) / 2.5));
  // front door: closed in the flashback, flung open, slammed at 35.6
  const doorOpen = t < 34.94 ? 0 : 1 - seg(t, 34.94, 35.6);
  const handleAng = t >= 10.75 && t < 11.7 ? 14 * Math.sin((t - 10.75) * 40) * (1 - (t - 10.75) / 0.95) : t >= 91.71 && t < 92.6 ? 9 * Math.sin(t * 50) : 0;
  const backShake = KN.reduce((m, k) => (t >= k && t < k + 0.18 ? Math.max(m, 9 * (1 - (t - k) / 0.18) * Math.sin((t - k) * 90)) : m), 0);
  const streaks = [seg(t, 53.3, 54.6), seg(t, 55.2, 56.2), seg(t, 56.8, 57.8)];
  const scratch = clamp((t - 68.2) / 3.7);
  const letters = clamp((t - 72.9) / 2.7) * 4;

  // Ilya: position / pose / face by scene
  let fig: {x: number; y: number; s: number; face?: {look: number; fear: number}} | null = null;
  if (t < 13.88) fig = {x: lerp(1130, 1430, seg(t, 12.36, 13.4)), y: 880, s: 1.2, face: {look: -0.9, fear: 0.4 + 0.5 * seg(t, 10.7, 12.4)}};
  else if (t >= 34.9 && t < 39.1) fig = {x: lerp(1220, 1150, seg(t, 36.25, 38.7)), y: 880, s: 1.2, face: {look: t < 36 ? -0.9 : 0.8, fear: 0.9}};
  else if (t >= 61.38 && t < 66.6) fig = {x: lerp(560, 1350, seg(t, 61.5, 65.5)), y: 880, s: 1.15, face: {look: -0.7, fear: 0.8}};
  else if (t >= 75.9 && t < 87.7) {
    const fx = lerp(2300, 3980, seg(t, 76.2, 80.2));
    fig = {x: fx, y: 900, s: 1.2, face: t < 80.4 ? {look: 0.9, fear: 0.7} : {look: 0.9, fear: 1}};
  } else if (t >= 87.7) fig = {x: 1560, y: 880, s: 1.2, face: {look: -0.9, fear: 1}};

  return (
    <svg width={1080} height={1920} viewBox="0 0 1080 1920">
      <g transform={`translate(${540 + sk.x} ${960 + sk.y}) scale(${c.s * 1.15}) translate(${-c.cx - Math.sin(t * 0.6) * 5} ${-c.cy})`}>
        <World2 t={t} tableX={tableX} streaks={streaks} scratch={scratch} letters={letters} backShake={backShake} doorOpen={doorOpen} handleAng={handleAng} />
        {fig && <Figure x={fig.x} y={fig.y} s={fig.s} face={fig.face} />}
      </g>
    </svg>
  );
};

// ---------- subtitles ----------
const stripP = (w: string) => w.replace(/[.,:—…?!]+$/g, '').toLowerCase();
const Subtitle2: React.FC<{t: number}> = ({t}) => {
  const list = subs2 as [number, number, string][];
  let p: [number, number, string] | undefined;
  for (const x of list) if (t >= x[0] - 0.04 && t < x[1] + 0.14) p = x;
  if (!p) return null;
  const o = Math.min(clamp((t - p[0] + 0.04) / 0.06), clamp((p[1] + 0.14 - t) / 0.08));
  const words = p[2].split(' ');
  const special = /Это я/.test(p[2]);
  return (
    <AbsoluteFill style={{justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 360}}>
      <div style={{opacity: o, width: 900, textAlign: 'center', fontFamily: '"Arial Black", "Liberation Sans", Arial, sans-serif', fontWeight: 900, fontSize: 70, lineHeight: 1.12, color: '#fff', WebkitTextStroke: '10px #000', paintOrder: 'stroke fill', textShadow: '0 4px 14px rgba(0,0,0,0.7)'}}>
        {words.map((w, i) => {
          const key = stripP(w);
          const hot = KEYWORDS.has(key) && (key !== 'я»' || special) && (key !== 'это' || special);
          return (
            <span key={i} style={{color: hot ? '#ffd400' : '#fff'}}>
              {w}
              {i < words.length - 1 ? ' ' : ''}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ---------- composition ----------
export const Ep2: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS2;

  // door: shot 1 (handle to the end, door starts to open) and shot 3 (door flung open)
  const d1 = t < 4.83;
  const angle1 = lerp(-42, -58, seg(t, 0.0, 2.2));
  const o1 = 0.85 * seg(t, 3.0, 4.83);
  const o3 = lerp(0.85, 1.0, ease(seg(t, 13.88, 14.9)));
  const shk1 = t >= 3.0 && t < 4.83 ? shake(t, 2.2 + 3 * seg(t, 3, 4.8)) : {x: 0, y: 0};
  const shk3 = t >= 13.88 && t < 15.3 ? shake(t, 14 * (1 - seg(t, 13.88, 15.3))) : {x: 0, y: 0};
  const zoom1 = lerp(1.6, 1.9, seg(t, 0, 4.83));
  const zoom3 = lerp(1.6, 1.3, ease(seg(t, 13.88, 15.7)));

  // final door: handle moves the other way
  const endAngle = lerp(0, 14, seg(t, 92.62, 93.1));

  // footprints camera
  const fpY = (() => {
    if (t < 22.3) return lerp(560, 480, seg(t, 19.2, 22.3));
    if (t < 24.4) return lerp(480, -1000, seg(t, 22.77, 24.4));
    if (t < 27.3) return lerp(-1000, 480, seg(t, 24.4, 27.3));
    return 480;
  })();
  const fpZoom = t < 28 ? lerp(1.15, 1.0, seg(t, 19.2, 22.3)) : lerp(1.1, 0.95, seg(t, 28, 34));
  const fpAng = -Math.PI / 2 + (t < 28 ? 0.1 * Math.sin(t * 1.3) : 0.55 * Math.sin((t - 28) * 0.9));

  // blackout on dips/knocks
  let black = 0;
  const dip = t > 4.74 && t < 4.9 ? clamp((t - 4.74) / 0.16) : t >= 4.9 && t < 5.25 ? 1 - clamp((t - 4.9) / 0.35) : 0;
  black = Math.max(black, dip);
  for (const k of KN) if (t >= k && t < k + 0.12) black = Math.max(black, 0.75 * (1 - (t - k) / 0.12));
  if (t >= END) black = 1;

  const drone = ramp([[0, 0.12], [3, 0.2], [14, 0.24], [15.4, 0.24], [15.75, 0.01], [17.4, 0.01], [18.6, 0.2], [42.2, 0.2], [42.5, 0.07], [47.6, 0.07], [48.2, 0.22], [62.5, 0.22], [62.9, 0.07], [66.6, 0.07], [67.2, 0.22], [84.0, 0.22], [84.15, 0.004], [87.7, 0.004], [88.5, 0.2], [END - 0.1, 0.25], [END, 0]]);
  const wind = ramp([[0, 0.12], [3, 0.14], [13.8, 0.14], [14.5, 0.2], [19, 0.17], [34.5, 0.14], [35.0, 0.06], [60, 0.05], [84, 0.05], [84.15, 0.01], [87.7, 0.01], [88.5, 0.05], [END - 0.1, 0.05], [END, 0]]);
  const fire = ramp([[0, 0], [4.8, 0], [5.4, 0.07], [13.5, 0.07], [14.2, 0], [34.7, 0], [35.4, 0.07], [66, 0.09], [84, 0.09], [84.15, 0.01], [87.7, 0.01], [88.5, 0.07], [END - 0.1, 0.07], [END, 0]]);
  const radioBed = (a: number, b: number, v: number) => ramp([[0, 0], [0.15, v], [b - a - 0.3, v], [b - a, 0]]);

  return (
    <AbsoluteFill style={{backgroundColor: '#000'}}>
      <Audio src={staticFile('voice2.mp3')} volume={1} />
      <Audio src={staticFile('sfx/drone.mp3')} volume={drone} />
      <Audio src={staticFile('sfx/wind.mp3')} volume={wind} />
      <Audio src={staticFile('sfx/fire.mp3')} volume={fire} />
      <Sequence from={Math.round(3.0 * FPS2)} durationInFrames={50}><Audio src={staticFile('sfx/creak.mp3')} volume={0.22} /></Sequence>
      <Sequence from={Math.round(10.75 * FPS2)} durationInFrames={50}><Audio src={staticFile('sfx/creak.mp3')} volume={0.18} /></Sequence>
      <Sequence from={Math.round(13.9 * FPS2)} durationInFrames={50}><Audio src={staticFile('sfx/creak.mp3')} volume={0.25} /></Sequence>
      <Sequence from={Math.round(20.0 * FPS2)} durationInFrames={100}><Audio src={staticFile('sfx/crunch.mp3')} volume={0.09} /></Sequence>
      <Sequence from={Math.round(24.0 * FPS2)} durationInFrames={110}><Audio src={staticFile('sfx/crunch.mp3')} volume={0.09} /></Sequence>
      <Sequence from={Math.round(30.0 * FPS2)} durationInFrames={90}><Audio src={staticFile('sfx/crunch.mp3')} volume={0.07} /></Sequence>
      <Sequence from={Math.round(35.55 * FPS2)} durationInFrames={24}><Audio src={staticFile('sfx/knock.mp3')} volume={0.6} /></Sequence>
      <Sequence from={Math.round(36.25 * FPS2)} durationInFrames={Math.round(2.6 * FPS2)}><Audio src={staticFile('sfx/drag.mp3')} volume={0.18} /></Sequence>
      <Sequence from={Math.round(39.0 * FPS2)} durationInFrames={Math.round(8.45 * FPS2)}><Audio src={staticFile('sfx/static.mp3')} volume={radioBed(39.0, 47.45, 0.07)} /></Sequence>
      <Sequence from={Math.round(61.9 * FPS2)} durationInFrames={Math.round(5.0 * FPS2)}><Audio src={staticFile('sfx/static.mp3')} volume={radioBed(61.9, 66.9, 0.06)} /></Sequence>
      <Sequence from={Math.round(83.9 * FPS2)} durationInFrames={Math.round(3.6 * FPS2)}><Audio src={staticFile('sfx/static.mp3')} volume={radioBed(83.9, 87.5, 0.07)} /></Sequence>
      <Sequence from={Math.round(68.2 * FPS2)} durationInFrames={Math.round(4.0 * FPS2)}><Audio src={staticFile('sfx/scratch.mp3')} volume={ramp([[0, 0], [0.2, 0.1], [3.4, 0.1], [4, 0]])} /></Sequence>
      {KN.map((k) => (
        <Sequence key={k} from={Math.round(k * FPS2)} durationInFrames={24}><Audio src={staticFile('sfx/knock.mp3')} volume={0.5} /></Sequence>
      ))}
      <Sequence from={Math.round(92.6 * FPS2)} durationInFrames={Math.round(0.6 * FPS2)}><Audio src={staticFile('sfx/creak.mp3')} volume={0.12} /></Sequence>

      <Shot a={0} b={4.83} t={t}>
        <Door2 t={t} zoom={zoom1} angle={angle1} o={o1} sk={shk1} />
      </Shot>
      <Shot a={4.83} b={13.88} t={t}>
        <Interior2 t={t} />
      </Shot>
      <Shot a={13.88} b={15.73} t={t}>
        <Door2 t={t} zoom={zoom3} angle={-58} o={o3} sk={shk3} />
      </Shot>
      <Shot a={15.73} b={19.2} t={t}>
        <Porch t={t} p={clamp((t - 15.73) / 3.5)} />
      </Shot>
      <Shot a={19.2} b={34.94} t={t}>
        <Footprints t={t} camY={fpY} zoom={fpZoom} />
        <Flashlight ox={540} oy={1950} ang={fpAng} spread={0.34} len={1900} />
      </Shot>
      <Shot a={34.94} b={39.0} t={t}>
        <Interior2 t={t} />
      </Shot>
      <Shot a={39.0} b={47.45} t={t}>
        <Radio2 t={t} t0={39.0} voice={[[42.4, 47.4]]} p={clamp((t - 39) / 8.4)} />
      </Shot>
      <Shot a={47.45} b={66.5} t={t}>
        <Interior2 t={t} />
      </Shot>
      <Shot a={66.5} b={75.9} t={t}>
        <Interior2 t={t} />
        <Flashlight ox={1010} oy={1880} ang={-2.0 + 0.04 * Math.sin(t * 7)} spread={0.32} len={1900} />
      </Shot>
      <Shot a={75.9} b={84.0} t={t}>
        <Interior2 t={t} />
      </Shot>
      <Shot a={84.0} b={87.7} t={t}>
        <Radio2 t={t} t0={84.0} voice={[[84.3, 87.3]]} p={clamp((t - 84) / 3.7)} />
      </Shot>
      <Shot a={87.7} b={92.56} t={t}>
        <Interior2 t={t} />
      </Shot>
      <Shot a={92.56} b={END + 0.2} t={t}>
        <Door2 t={t} zoom={1.7} angle={endAngle} o={0} />
      </Shot>

      <Overlay t={t} frame={frame} />
      <Subtitle2 t={t} />
      <AbsoluteFill style={{background: '#000', opacity: black}} />
    </AbsoluteFill>
  );
};
