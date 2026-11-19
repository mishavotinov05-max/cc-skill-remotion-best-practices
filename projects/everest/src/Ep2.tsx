import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame} from 'remotion';
import subs2 from './subs3.json';
import {World2} from './World2';
import {Figure, Overlay, Shot, Snow, ramp, shake} from './Everest';
import {StyledSub} from './Subs';
import {Key, cam, clamp, ease, lerp, rnd, seg} from './util';

export const FPS2 = 30;
export const DURATION2 = 93.28;
const END = 93.1; // instant darkness
const KN = [69.45, 70.0, 70.6]; // three knocks on the back door
const KEYWORDS = new Set(['дверь', 'двери', 'дверью', 'следы', 'рация', 'никого', 'исчез', 'стол', 'царапины', 'удара', 'голос', 'умрём', 'плечо', 'рюкзак', 'замер', 'вижу', 'открывай', 'открой', 'фонарик', 'распахнулась', 'беги', 'обрывались']);

// ---------- door close-up (continues the last frame of episode 1) ----------
export const Door2: React.FC<{t: number; zoom: number; angle: number; o: number; sk?: {x: number; y: number}; dark?: boolean}> = ({t, zoom, angle, o, sk = {x: 0, y: 0}, dark = false}) => {
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
          <rect x={-1500} y={-1500} width={3420} height={5000} fill="url(#dw2)" />
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
      <g transform={`translate(540 1000) scale(${1 + p * 0.2}) translate(-540 -1000)`}>
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
export const Radio2: React.FC<{t: number; t0: number; voice: [number, number][]; p: number}> = ({t, t0, voice, p}) => {
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
export const Flashlight: React.FC<{ox: number; oy: number; ang: number; spread?: number; len?: number; k?: number}> = ({ox, oy, ang, spread = 0.3, len = 1800, k = 1}) => {
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
  [2.5, 1250, 580, 1.25], [4.5, 1250, 570, 1.3], [8.4, 1250, 560, 1.35], [10.05, 1250, 560, 1.35],
  [28.0, 1230, 560, 1.25], [29.3, 1230, 560, 1.2], [31.3, 1200, 580, 1.15],
  [38.9, 360, 420, 1.3], [43.0, 340, 440, 1.6], [46.0, 310, 500, 2.1], [46.4, 300, 500, 2.3], [47.5, 700, 560, 1.2], [47.8, 700, 560, 1.2],
  [49.7, 800, 580, 1.2], [52.1, 1500, 600, 1.2], [52.66, 1700, 520, 1.4], [54.9, 1950, 430, 1.6], [57.0, 2100, 400, 1.9],
  [61.0, 2145, 370, 2.1], [61.58, 2145, 370, 2.2], [62.1, 2145, 370, 2.2], [62.8, 2145, 380, 2.0], [63.1, 2400, 520, 1.2],
  [66.0, 3800, 540, 1.15], [66.6, 4000, 540, 1.25], [68.0, 4150, 540, 1.3], [71.3, 4150, 540, 1.3], [79.4, 4200, 540, 1.7],
  [79.5, 4300, 520, 2.6], [87.7, 4300, 520, 3.0], [87.75, 4000, 560, 1.3], [91.6, 4050, 560, 1.4],
];

type FigState = {x: number; y: number; s: number; face: {look: number; fear: number}} | null;
const figAt = (t: number): FigState => {
  if (t >= 2.5 && t < 10.05) return {x: lerp(1130, 1430, seg(t, 2.8, 3.9)), y: 880, s: 1.2, face: {look: -0.9, fear: t < 8.45 ? 0.5 + 0.4 * seg(t, 2.8, 8.4) : 1}};
  if (t >= 28.0 && t < 31.3) return {x: lerp(1220, 1150, seg(t, 29.35, 30.9)), y: 880, s: 1.2, face: {look: t < 28.9 ? -0.9 : 0.8, fear: 0.9}};
  if (t >= 46.36 && t < 47.8) return {x: lerp(480, 900, seg(t, 46.4, 47.3)), y: 880, s: 1.2, face: {look: -0.9, fear: 1}};
  if (t >= 49.7 && t < 62.8) return {x: lerp(900, 1350, seg(t, 49.8, 52.5)), y: 880, s: 1.2, face: {look: t < 52.66 ? -0.7 : 0.9, fear: 0.9}};
  if (t >= 62.8 && t < 91.67) return {x: lerp(1350, 3980, ease(seg(t, 62.9, 66.3))), y: 900, s: 1.2, face: {look: 0.9, fear: t < 66.4 ? 0.8 : 1}};
  return null;
};

const toScreen = (t: number, wx: number, wy: number) => {
  const c = cam(t, camKeys2);
  return {x: 540 + (wx - c.cx) * c.s * 1.15, y: 960 + (wy - c.cy) * c.s * 1.15};
};

const HandShadow: React.FC<{x: number; t: number}> = ({x, t}) => {
  const o = seg(t, 88.8, 89.9);
  if (o <= 0) return null;
  const slide = (1 - o) * 120;
  return (
    <g opacity={0.9 * o} transform={`translate(${slide} ${-slide * 0.2})`}>
      <path d={`M${x + 760} 300 Q${x + 420} 330 ${x + 130} 500`} stroke="#020202" strokeWidth={46} strokeLinecap="round" fill="none" />
      <ellipse cx={x + 104} cy={512} rx={54} ry={38} fill="#020202" transform={`rotate(35 ${x + 104} 512)`} />
      {[-30, -12, 8, 26].map((a, i) => (
        <rect key={i} x={x + 40 + i * 4} y={500 + i * 14} width={78} height={17} rx={8} fill="#020202" transform={`rotate(${a + 150} ${x + 104} ${512 + i * 6})`} />
      ))}
      <path d={`M${x + 760} 300 Q${x + 420} 330 ${x + 130} 500`} stroke="#8a7a66" strokeWidth={3} strokeLinecap="round" fill="none" opacity={0.35} transform="translate(0 -22)" />
    </g>
  );
};

const Interior2: React.FC<{t: number}> = ({t}) => {
  const c = cam(t, camKeys2);
  let sk = {x: 0, y: 0};
  for (const k of KN) if (t >= k && t < k + 0.2) sk = shake(t, 20 * (1 - (t - k) / 0.2));
  if (t >= 28.5 && t < 28.95) sk = shake(t, 16 * (1 - (t - 28.5) / 0.45));
  if (t >= 8.45 && t < 9.2) sk = shake(t, 12 * (1 - (t - 8.45) / 0.75));
  if (t >= 61.58 && t < 62.1) sk = shake(t, 9);
  const tableX = t < 29.35 ? 2300 : lerp(2300, 860, ease((t - 29.35) / 1.7));
  const doorOpen = t < 8.45 ? 0 : t < 28.45 ? lerp(0, 1, ease(seg(t, 8.45, 8.95))) : 1 - seg(t, 28.45, 28.95);
  const handleAng = t < 2.5 ? -58 : t < 8.45 ? -58 + (t > 5 ? 3 * Math.sin(t * 17) : 0) : t < 28.45 ? lerp(-58, 0, seg(t, 8.45, 8.7)) : 0;
  const tremor = t >= 71.3 && t < 79.5 ? (t >= 75.1 && t < 77.2 ? 2.4 : 1.1) * Math.sin(t * 43) : t >= 79.5 && t < 87.7 ? (t >= 84.3 ? 3.4 : 1.8) * Math.sin(t * 47) : 0;
  const knockShake = KN.reduce((m, k) => (t >= k && t < k + 0.18 ? Math.max(m, 9 * (1 - (t - k) / 0.18) * Math.sin((t - k) * 90)) : m), 0);
  const backShake = knockShake + tremor;
  const streaks = [seg(t, 42.6, 43.7), seg(t, 44.0, 45.0), seg(t, 45.3, 46.2)];
  const scratch = clamp((t - 54.9) / 2.2);
  const letters = clamp((t - 57.2) / 3.9) * 4;
  const fig = figAt(t);
  const standing = t >= 87.75 && t < 91.67 ? figAt(t) : null;

  return (
    <svg width={1080} height={1920} viewBox="0 0 1080 1920">
      <g transform={`translate(${540 + sk.x} ${960 + sk.y}) scale(${c.s * 1.15}) translate(${-c.cx - Math.sin(t * 0.6) * 5} ${-c.cy})`}>
        <World2 t={t} tableX={tableX} streaks={streaks} scratch={scratch} letters={letters} backShake={backShake} doorOpen={doorOpen} handleAng={handleAng} />
        {t >= 87.75 && <HandShadow x={3980} t={t} />}
        {fig && <Figure x={fig.x} y={fig.y} s={fig.s} face={fig.face} />}
      </g>
    </svg>
  );
};

// flashlight in the room: from Ilya's hand toward the door / the wall
const roomFlash = (t: number) => {
  const f = figAt(t);
  if (t >= 4.4 && t < 10.05 && f) {
    const o = toScreen(t, f.x + 70, 720);
    const tgt = toScreen(t, 1175, 520);
    return {ox: o.x, oy: o.y, ang: Math.atan2(tgt.y - o.y, tgt.x - o.x) + 0.02 * Math.sin(t * 9), spread: 0.3, len: 1800, k: Math.min(clamp((t - 4.4) / 0.25), clamp((10.05 - t) / 0.2))};
  }
  if (t >= 53.3 && t < 62.8 && f) {
    const o = toScreen(t, 1420, 720);
    const tgt = toScreen(t, 2145, 380);
    return {ox: o.x, oy: o.y, ang: Math.atan2(tgt.y - o.y, tgt.x - o.x) + 0.015 * Math.sin(t * 9), spread: 0.16, len: 4200, k: Math.min(clamp((t - 53.3) / 0.3), clamp((62.8 - t) / 0.3))};
  }
  return null;
};

// ---------- subtitles ----------
const stripP = (w: string) => w.replace(/[.,:—…?!»«]+/g, '').toLowerCase();
const Subtitle2: React.FC<{t: number}> = ({t}) => {
  const list = subs2 as [number, number, string][];
  let p: [number, number, string] | undefined;
  for (const x of list) if (t >= x[0] - 0.03 && t < x[1] + 0.12) p = x;
  if (!p) return null;
  const o = Math.min(clamp((t - p[0] + 0.03) / 0.05), clamp((p[1] + 0.12 - t) / 0.07));
  const words = p[2].split(' ');
  return (
    <AbsoluteFill style={{justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 360}}>
      <div style={{opacity: o, width: 900, textAlign: 'center', fontFamily: '"Arial Black", "Liberation Sans", Arial, sans-serif', fontWeight: 900, fontSize: 70, lineHeight: 1.12, color: '#fff', WebkitTextStroke: '10px #000', paintOrder: 'stroke fill', textShadow: '0 4px 14px rgba(0,0,0,0.7)'}}>
        {words.map((w, i) => (
          <span key={i} style={{color: KEYWORDS.has(stripP(w)) ? '#ffd400' : '#fff'}}>
            {w}
            {i < words.length - 1 ? ' ' : ''}
          </span>
        ))}
      </div>
    </AbsoluteFill>
  );
};

// ---------- composition ----------
export const Ep2: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS2;

  const angle1 = lerp(-42, -58, seg(t, 0.0, 2.2));
  const zoom1 = lerp(1.6, 1.75, seg(t, 0, 2.52));
  const endAngle = lerp(0, 14, seg(t, 92.0, 93.1));

  // footprints camera
  const fpY = (() => {
    if (t < 18.5) return 520;
    if (t < 19.16) return lerp(520, -1000, seg(t, 18.5, 19.16));
    if (t < 22.5) return lerp(-1000, 480, seg(t, 19.16, 22.5));
    return 480;
  })();
  const fpZoom = t < 22.7 ? lerp(1.15, 1.0, seg(t, 15.7, 22.5)) : lerp(1.1, 0.95, seg(t, 22.7, 28));
  const fpAng = -Math.PI / 2 + (t < 22.7 ? 0.2 * Math.sin(t * 1.1) : 0.55 * Math.sin((t - 22.7) * 0.8));

  const rf = roomFlash(t);

  // blackouts
  const dip = 0;
  let black = dip;
  for (const k of KN) if (t >= k && t < k + 0.12) black = Math.max(black, 0.75 * (1 - (t - k) / 0.12));
  if (t >= END) black = 1;

  const drone = ramp([[0, 0.12], [2.5, 0.2], [6.9, 0.22], [9.9, 0.22], [10.05, 0.01], [12.2, 0.01], [12.6, 0.2], [33.8, 0.2], [34.0, 0.06], [37.2, 0.06], [37.5, 0.2], [49.5, 0.2], [49.7, 0.06], [52.3, 0.06], [52.7, 0.2], [61.3, 0.26], [61.45, 0.01], [62.5, 0.01], [62.9, 0.22], [69.3, 0.22], [71.2, 0.01], [79.3, 0.01], [79.5, 0.14], [84.15, 0.14], [84.3, 0.004], [87.6, 0.004], [88.0, 0.2], [END - 0.1, 0.25], [END, 0]]);
  const wind = ramp([[0, 0.08], [3, 0.09], [8.4, 0.1], [8.9, 0.2], [15.7, 0.14], [28.0, 0.12], [28.6, 0.05], [60, 0.05], [71.2, 0.03], [79.3, 0.02], [84.3, 0.01], [87.6, 0.01], [88.2, 0.05], [END - 0.1, 0.05], [END, 0]]);
  const fire = ramp([[0, 0], [2.4, 0], [3.0, 0.07], [8.4, 0.07], [9.0, 0], [28.0, 0], [28.6, 0.07], [60, 0.09], [71.2, 0.02], [84.3, 0.01], [87.6, 0.01], [88.2, 0.07], [END - 0.1, 0.07], [END, 0]]);
  const radioBed = (a: number, b: number, v: number) => ramp([[0, 0], [0.15, v], [b - a - 0.3, v], [b - a, 0]]);

  return (
    <AbsoluteFill style={{backgroundColor: '#000'}}>
      <Audio src={staticFile('voice2.mp3')} volume={1} />
      <Audio src={staticFile('sfx/drone.mp3')} volume={drone} />
      <Audio src={staticFile('sfx/wind.mp3')} volume={wind} />
      <Audio src={staticFile('sfx/fire.mp3')} volume={fire} />
      <Sequence from={Math.round(1.0 * FPS2)} durationInFrames={50}><Audio src={staticFile('sfx/creak.mp3')} volume={0.1} /></Sequence>
      <Sequence from={Math.round(5.6 * FPS2)} durationInFrames={50}><Audio src={staticFile('sfx/creak.mp3')} volume={0.08} /></Sequence>
      <Sequence from={Math.round(8.45 * FPS2)} durationInFrames={24}><Audio src={staticFile('sfx/knock.mp3')} volume={0.35} /></Sequence>
      <Sequence from={Math.round(8.5 * FPS2)} durationInFrames={50}><Audio src={staticFile('sfx/creak.mp3')} volume={0.12} /></Sequence>
      <Sequence from={Math.round(16.0 * FPS2)} durationInFrames={100}><Audio src={staticFile('sfx/crunch.mp3')} volume={0.08} /></Sequence>
      <Sequence from={Math.round(19.5 * FPS2)} durationInFrames={110}><Audio src={staticFile('sfx/crunch.mp3')} volume={0.08} /></Sequence>
      <Sequence from={Math.round(23.0 * FPS2)} durationInFrames={90}><Audio src={staticFile('sfx/crunch.mp3')} volume={0.06} /></Sequence>
      <Sequence from={Math.round(28.55 * FPS2)} durationInFrames={24}><Audio src={staticFile('sfx/knock.mp3')} volume={0.4} /></Sequence>
      <Sequence from={Math.round(29.35 * FPS2)} durationInFrames={Math.round(1.8 * FPS2)}><Audio src={staticFile('sfx/drag.mp3')} volume={0.12} /></Sequence>
      <Sequence from={Math.round(31.3 * FPS2)} durationInFrames={Math.round(7.65 * FPS2)}><Audio src={staticFile('sfx/static.mp3')} volume={radioBed(31.3, 38.95, 0.07)} /></Sequence>
      <Sequence from={Math.round(47.8 * FPS2)} durationInFrames={Math.round(1.9 * FPS2)}><Audio src={staticFile('sfx/static.mp3')} volume={radioBed(47.8, 49.7, 0.07)} /></Sequence>
      <Sequence from={Math.round(54.9 * FPS2)} durationInFrames={Math.round(4.0 * FPS2)}><Audio src={staticFile('sfx/scratch.mp3')} volume={ramp([[0, 0], [0.2, 0.1], [3.4, 0.1], [4, 0]])} /></Sequence>
      <Sequence from={Math.round(58.0 * FPS2)} durationInFrames={Math.round(3.3 * FPS2)}><Audio src={staticFile('sfx/scratch.mp3')} volume={ramp([[0, 0], [0.2, 0.1], [2.8, 0.1], [3.3, 0]])} /></Sequence>
      {KN.map((k) => (
        <Sequence key={k} from={Math.round(k * FPS2)} durationInFrames={24}><Audio src={staticFile('sfx/knock.mp3')} volume={0.32} /></Sequence>
      ))}
      <Sequence from={Math.round(92.0 * FPS2)} durationInFrames={Math.round(1.0 * FPS2)}><Audio src={staticFile('sfx/creak.mp3')} volume={0.12} /></Sequence>

      <Shot a={0} b={2.52} t={t}>
        <Door2 t={t} zoom={zoom1} angle={angle1} o={0} />
      </Shot>
      <Shot a={2.52} b={10.05} t={t}>
        <Interior2 t={t} />
        {rf && <Flashlight ox={rf.ox} oy={rf.oy} ang={rf.ang} spread={rf.spread} len={rf.len} k={rf.k} />}
      </Shot>
      <Shot a={10.05} b={15.72} t={t}>
        <Porch t={t} p={clamp((t - 10.05) / 5.67)} />
      </Shot>
      <Shot a={15.72} b={28.0} t={t}>
        <Footprints t={t} camY={fpY} zoom={fpZoom} />
        <Flashlight ox={540} oy={1950} ang={fpAng} spread={0.34} len={1900} />
      </Shot>
      <Shot a={28.0} b={31.3} t={t}>
        <Interior2 t={t} />
      </Shot>
      <Shot a={31.3} b={38.95} t={t}>
        <Radio2 t={t} t0={31.3} voice={[[34.0, 34.55], [34.9, 35.95], [36.25, 37.15]]} p={clamp((t - 31.3) / 7.6)} />
      </Shot>
      <Shot a={38.95} b={46.36} t={t}>
        <Interior2 t={t} />
      </Shot>
      <Shot a={46.36} b={47.8} t={t}>
        <Interior2 t={t} />
      </Shot>
      <Shot a={47.8} b={49.7} t={t}>
        <Radio2 t={t} t0={47.8} voice={[[47.85, 49.4]]} p={clamp((t - 47.8) / 1.9)} />
      </Shot>
      <Shot a={49.7} b={62.8} t={t}>
        <Interior2 t={t} />
        {rf && <Flashlight ox={rf.ox} oy={rf.oy} ang={rf.ang} spread={rf.spread} len={rf.len} k={rf.k} />}
      </Shot>
      <Shot a={62.8} b={91.67} t={t}>
        <Interior2 t={t} />
      </Shot>
      <Shot a={91.67} b={END + 0.2} t={t}>
        <Door2 t={t} zoom={1.7} angle={endAngle} o={0} />
      </Shot>

      <Overlay t={t} frame={frame} />
      <StyledSub t={t} subs={subs2 as [number, number, string][]} hot={KEYWORDS} />
      <AbsoluteFill style={{background: '#000', opacity: black}} />
    </AbsoluteFill>
  );
};
