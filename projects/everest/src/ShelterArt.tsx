import React from 'react';
import '@fontsource/montserrat/cyrillic-700.css';
import '@fontsource/montserrat/latin-700.css';
import {clamp, ease, lerp, rnd} from './util';

export const FONT = 'Montserrat, sans-serif';
export type V = [number, number];
export const P = (t: number, a: number, b: number) => clamp((t - a) / (b - a));
export const E = (t: number, a: number, b: number) => ease(P(t, a, b));
export const mixc = (c1: string, c2: string, k: number) => {
  const p = (c: string) => [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16));
  const a = p(c1), b = p(c2);
  return '#' + a.map((v, i) => Math.round(lerp(v, b[i], clamp(k))).toString(16).padStart(2, '0')).join('');
};

// ============================ skier rig (IK) ============================
export type Pose = {hip: V; lean: number; lf: V; lb: V; hf: V; hb: V; nod?: number; ski?: boolean; shovel?: {hb: V; th: number} | null; hold?: React.ReactNode; pack?: boolean};
type Pref = (a: V, b: V) => boolean;
const ik2 = (s: V, t: V, l1: number, l2: number, pref: Pref) => {
  let dx = t[0] - s[0], dy = t[1] - s[1];
  let d = Math.hypot(dx, dy);
  const mx = l1 + l2 - 0.5;
  let tx = t[0], ty = t[1];
  if (d > mx) { tx = s[0] + (dx / d) * mx; ty = s[1] + (dy / d) * mx; d = mx; }
  if (d < 1) d = 1;
  const a = Math.atan2(ty - s[1], tx - s[0]);
  const ang = Math.acos(clamp((l1 * l1 + d * d - l2 * l2) / (2 * l1 * d), -1, 1));
  const j1: V = [s[0] + l1 * Math.cos(a + ang), s[1] + l1 * Math.sin(a + ang)];
  const j2: V = [s[0] + l1 * Math.cos(a - ang), s[1] + l1 * Math.sin(a - ang)];
  return {j: pref(j1, j2) ? j1 : j2, e: [tx, ty] as V};
};
const JK = '#1b1e25', JK2 = '#2b2f39', PT = '#0f1218', PT2 = '#1d222c', GL = '#08090b', BT = '#14161b';
const Seg: React.FC<{a: V; b: V; c: V; w1: number; w2: number; col: string; hi: string}> = ({a, b, c, w1, w2, col, hi}) => (
  <g strokeLinecap="round" strokeLinejoin="round" fill="none">
    <polyline points={`${a} ${b} ${c}`} stroke={col} strokeWidth={Math.max(w1, w2)} />
    <polyline points={`${a[0] + 2},${a[1]} ${b[0] + 2},${b[1]} ${c[0] + 2},${c[1]}`} stroke={hi} strokeWidth={Math.max(w1, w2) * 0.35} opacity={0.55} />
  </g>
);
export const Skier: React.FC<{x: number; y: number; flip?: boolean; pose: Pose; s?: number}> = ({x, y, flip, pose, s = 1}) => {
  const {hip, lean, lf, lb, hf, hb, nod = 0, ski, shovel, hold} = pose;
  const pack = pose.pack !== false;
  const la = (lean * Math.PI) / 180;
  const sh: V = [hip[0] + Math.sin(la) * 105, hip[1] - Math.cos(la) * 105];
  const hd: V = [sh[0] + Math.sin(la + (nod * Math.PI) / 180) * 42, sh[1] - Math.cos(la + (nod * Math.PI) / 180) * 42];
  const legPref: Pref = (a, b) => a[0] > b[0];
  const armPref: Pref = (a, b) => a[1] > b[1];
  const lgF = ik2([hip[0] + 6, hip[1]], lf, 60, 60, legPref);
  const lgB = ik2([hip[0] - 6, hip[1]], lb, 60, 60, legPref);
  let HF = hf, HB = hb;
  if (shovel) {
    const d: V = [Math.cos((shovel.th * Math.PI) / 180), Math.sin((shovel.th * Math.PI) / 180)];
    HB = shovel.hb; HF = [HB[0] + d[0] * 56, HB[1] + d[1] * 56];
  }
  const ar1 = ik2([sh[0] + 4, sh[1] + 6], HF, 46, 46, armPref);
  const ar2 = ik2([sh[0] - 4, sh[1] + 6], HB, 46, 46, armPref);
  const shovelEl = shovel ? (() => {
    const d: V = [Math.cos((shovel.th * Math.PI) / 180), Math.sin((shovel.th * Math.PI) / 180)];
    const e: V = [HB[0] + d[0] * 150, HB[1] + d[1] * 150];
    return (
      <g>
        <line x1={HB[0] - d[0] * 14} y1={HB[1] - d[1] * 14} x2={e[0]} y2={e[1]} stroke="#8a6a3a" strokeWidth={7} strokeLinecap="round" />
        <g transform={`translate(${e[0]} ${e[1]}) rotate(${shovel.th})`}>
          <path d="M-6 -17 L40 -14 Q52 0 40 14 L-6 17 Z" fill="#b8c0cc" stroke="#6b7482" strokeWidth={3} />
        </g>
      </g>
    );
  })() : null;
  const foot = (p: V, ground: boolean) => (
    <g transform={`translate(${p[0]} ${p[1]})`}>
      {ski && <path d="M-110 8 L120 8 Q150 8 160 -6 L120 -2 L-110 0 Z" fill="#0c0d10" stroke="#2a2d34" strokeWidth={2} />}
      <path d="M-16 -16 L10 -16 L30 2 Q34 12 22 12 L-14 12 Q-22 10 -16 -16 Z" fill={BT} stroke="#2a2d34" strokeWidth={2} />
      <rect x={-18} y={9} width={52} height={5} rx={2} fill="#050506" />
    </g>
  );
  const poleBack = ski ? <line x1={HB[0]} y1={HB[1]} x2={HB[0] - 60} y2={8} stroke="#3a3f4a" strokeWidth={4} strokeLinecap="round" /> : null;
  const poleFront = ski ? <line x1={HF[0]} y1={HF[1]} x2={HF[0] - 70} y2={8} stroke="#4a505c" strokeWidth={4} strokeLinecap="round" /> : null;
  return (
    <g transform={flip ? `translate(${x} ${y}) scale(${-s} ${s})` : `translate(${x} ${y}) scale(${s})`}>
      <ellipse cx={0} cy={4} rx={70} ry={8} fill="#1b2a44" opacity={0.25} />
      {poleBack}
      <Seg a={[hip[0] - 6, hip[1]]} b={lgB.j} c={lgB.e} w1={34} w2={30} col={PT} hi={PT2} />
      {foot(lgB.e, true)}
      <Seg a={[sh[0] - 4, sh[1] + 6]} b={ar2.j} c={ar2.e} w1={24} w2={22} col={JK} hi={JK2} />
      <circle cx={ar2.e[0]} cy={ar2.e[1]} r={12} fill={GL} />
      <g transform={`translate(${hip[0]} ${hip[1]}) rotate(${lean})`}>
        {pack && <rect x={-54} y={-92} width={30} height={74} rx={12} fill="#2a303b" stroke="#12151b" strokeWidth={3} />}
        {pack && <rect x={-50} y={-70} width={22} height={6} rx={3} fill="#444c5c" />}
        <rect x={-27} y={-108} width={54} height={112} rx={24} fill={JK} />
        <rect x={-27} y={-108} width={20} height={112} rx={10} fill={JK2} opacity={0.35} />
        <rect x={-3} y={-100} width={5} height={92} rx={2} fill="#3a3f4b" opacity={0.7} />
        <rect x={-27} y={-24} width={54} height={10} fill="#0c0e12" />
      </g>
      <Seg a={[hip[0] + 6, hip[1]]} b={lgF.j} c={lgF.e} w1={36} w2={32} col={PT} hi={PT2} />
      {foot(lgF.e, true)}
      <g transform={`translate(${hd[0]} ${hd[1]}) rotate(${lean + nod})`}>
        <rect x={-14} y={16} width={28} height={22} rx={8} fill="#101218" />
        <circle cx={0} cy={0} r={32} fill="#15181e" />
        <path d="M-32 0 Q-30 -30 4 -34 Q30 -34 34 -6 Q22 -22 4 -20 Q-14 -20 -24 6 Z" fill="#232831" />
        <ellipse cx={8} cy={4} rx={24} ry={24} fill="#0d0f13" />
        <rect x={-2} y={-12} width={40} height={22} rx={9} fill="#0a0c10" stroke="#3a4050" strokeWidth={2} />
        <rect x={0} y={-10} width={36} height={18} rx={8} fill="url(#lens)" />
        <path d="M6 -8 L18 -8 L10 6 L2 6 Z" fill="#fff" opacity={0.28} />
        <path d="M-6 8 Q12 28 34 12" stroke="#050607" strokeWidth={10} fill="none" strokeLinecap="round" opacity={0.7} />
      </g>
      <Seg a={[sh[0] + 4, sh[1] + 6]} b={ar1.j} c={ar1.e} w1={26} w2={24} col={JK} hi={JK2} />
      <circle cx={ar1.e[0]} cy={ar1.e[1]} r={13} fill={GL} />
      {poleFront}
      {shovelEl}
      {hold}
    </g>
  );
};
export const SkierDefs: React.FC = () => (
  <defs>
    <linearGradient id="lens" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stopColor="#1a2230" />
      <stop offset="0.6" stopColor="#4a86b8" />
      <stop offset="1" stopColor="#1a2230" />
    </linearGradient>
  </defs>
);

// ---------- pose helpers ----------
export const standPose = (t = 0): Pose => ({hip: [0, -118], lean: 5, lf: [18, 0], lb: [-16, 0], hf: [34, -128], hb: [-12, -126], nod: 0});
export const walkPose = (t: number, sp = 3.2, lean = 8, carry: 'none' | 'log' | 'box' | 'pipe' = 'none'): Pose => {
  const ph = t * sp * Math.PI * 2;
  const sn = Math.sin(ph), cs = Math.cos(ph);
  const hip: V = [0, -118 + Math.abs(cs) * 4];
  const lf: V = [26 * sn, -Math.max(0, 18 * cs)];
  const lb: V = [-26 * sn, -Math.max(0, -18 * cs)];
  const base: Pose = {hip, lean, lf, lb, hf: [30 + 14 * sn, -118], hb: [-10 - 14 * sn, -118], nod: 0};
  if (carry === 'log') return {...base, hf: [46, -228], hb: [4, -236]};
  if (carry === 'box') return {...base, hf: [62, -150], hb: [30, -140], lean: 6};
  if (carry === 'pipe') return {...base, hf: [40, -250], hb: [0, -240]};
  return base;
};
// keyframed shovel cycle: returns pose for phase 0..1
type K = {hx: number; hy: number; lean: number; bx: number; by: number; th: number};
const DIG: K[] = [
  {hx: 0, hy: -104, lean: 34, bx: 18, by: -172, th: 62},
  {hx: 0, hy: -104, lean: 38, bx: 28, by: -150, th: 70},
  {hx: -4, hy: -112, lean: 14, bx: -4, by: -166, th: -22},
  {hx: 0, hy: -118, lean: -4, bx: 14, by: -214, th: -58},
  {hx: 0, hy: -108, lean: 22, bx: 18, by: -190, th: 40},
];
const DIGT = [0, 0.25, 0.55, 0.78, 1.0];
export const digPose = (ph: number, scale = 1): Pose => {
  let i = 0;
  while (i < DIGT.length - 2 && ph >= DIGT[i + 1]) i++;
  const k = ease(clamp((ph - DIGT[i]) / (DIGT[i + 1] - DIGT[i])));
  const a = DIG[i], b = DIG[i + 1];
  const L = (p: number, q: number) => lerp(p, q, k);
  return {hip: [L(a.hx, b.hx), L(a.hy, b.hy)], lean: L(a.lean, b.lean), lf: [24, 0], lb: [-24, 0], hf: [0, 0], hb: [0, 0], shovel: {hb: [L(a.bx, b.bx), L(a.by, b.by)], th: L(a.th, b.th)}};
};
// shovel tip release point (relative coords) at ph=0.78
export const DIG_TIP: V = [14 + Math.cos((-58 * Math.PI) / 180) * 150, -214 + Math.sin((-58 * Math.PI) / 180) * 150];
export const shivPose = (t: number): Pose => ({hip: [Math.sin(t * 38) * 1.6, -112], lean: 14, lf: [12, 0], lb: [-14, 0], hf: [28, -186 + Math.sin(t * 41)], hb: [8, -176], nod: 8});

// ============================ world props ============================
export const Log: React.FC<{x: number; y: number; w?: number; r?: number; rot?: number}> = ({x, y, w = 170, r = 15, rot = 0}) => (
  <g transform={`translate(${x} ${y}) rotate(${rot})`}>
    <rect x={-w / 2} y={-r} width={w} height={r * 2} rx={r * 0.6} fill="#8a5a30" stroke="#4a2f16" strokeWidth={3} />
    <rect x={-w / 2} y={-r} width={w} height={r * 0.7} rx={r * 0.5} fill="#a8733f" opacity={0.7} />
    <ellipse cx={w / 2 - 3} cy={0} rx={r * 0.55} ry={r} fill="#d9a468" stroke="#4a2f16" strokeWidth={2} />
  </g>
);
export const LogEnd: React.FC<{x: number; y: number; r?: number}> = ({x, y, r = 30}) => (
  <g transform={`translate(${x} ${y})`}>
    <circle r={r} fill="#8a5a30" stroke="#4a2f16" strokeWidth={4} />
    <circle r={r * 0.72} fill="#d9a468" />
    <circle r={r * 0.45} fill="none" stroke="#a8733f" strokeWidth={3} />
    <circle r={r * 0.2} fill="none" stroke="#a8733f" strokeWidth={3} />
  </g>
);
export const StoveArt: React.FC<{x: number; y: number; glow: number; t: number}> = ({x, y, glow, t}) => (
  <g transform={`translate(${x} ${y})`}>
    <rect x={-36} y={-18} width={8} height={18} fill="#2a2d34" />
    <rect x={28} y={-18} width={8} height={18} fill="#2a2d34" />
    <rect x={-44} y={-84} width={88} height={68} rx={8} fill="#3a3f4a" stroke="#14161b" strokeWidth={4} />
    <rect x={-44} y={-84} width={88} height={14} rx={6} fill="#555c6a" />
    <rect x={-26} y={-62} width={42} height={36} rx={6} fill="#14161b" />
    <rect x={-22} y={-58} width={34} height={28} rx={4} fill={mixc('#1a1412', '#ff9a2a', glow)} />
    {glow > 0.05 && (
      <g opacity={glow}>
        <path d={`M-14 -34 Q-12 ${-58 + Math.sin(t * 14) * 4} -4 -40 Q4 ${-62 + Math.cos(t * 12) * 4} 6 -34 Z`} fill="#ffd23f" />
        <path d={`M-8 -34 Q-6 ${-50 + Math.sin(t * 17) * 3} 0 -36 Z`} fill="#fff2a0" />
      </g>
    )}
    <rect x={28} y={-70} width={6} height={30} rx={3} fill="#8d94a3" />
    <rect x={-12} y={-100} width={24} height={18} fill="#4a505c" />
  </g>
);
export const Pine: React.FC<{x: number; y: number; s?: number; snow?: boolean}> = ({x, y, s = 1, snow = true}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-5} y={-18} width={10} height={20} fill="#4a3220" />
    {[0, 1, 2].map((i) => (
      <g key={i}>
        <path d={`M${-44 + i * 8} ${-18 - i * 40} L0 ${-70 - i * 40} L${44 - i * 8} ${-18 - i * 40} Z`} fill="#1f4a3a" />
        {snow && <path d={`M${-30 + i * 6} ${-30 - i * 40} L0 ${-70 - i * 40} L${30 - i * 6} ${-30 - i * 40} L${10} ${-40 - i * 40} L-6 ${-34 - i * 40} Z`} fill="#eaf4ff" opacity={0.9} />}
      </g>
    ))}
  </g>
);
export const SnowParticles: React.FC<{t: number; n?: number; speed?: number; wind?: number; op?: number; w?: number; h?: number; size?: number}> = ({t, n = 70, speed = 90, wind = 30, op = 0.8, w = 1080, h = 1920, size = 1}) => (
  <g>
    {Array.from({length: n}).map((_, i) => {
      const sp = speed * (0.6 + rnd(i + 1) * 0.8);
      const y = ((rnd(i) * (h + 200) + t * sp) % (h + 200)) - 100;
      const x = (((rnd(i + 7) * w + t * wind * (0.5 + rnd(i + 2)) + Math.sin(t * 1.3 + i) * 14) % (w + 100)) + w + 100) % (w + 100) - 50;
      return <circle key={i} cx={x} cy={y} r={(2 + rnd(i + 3) * 4) * size} fill="#fff" opacity={op * (0.5 + rnd(i + 4) * 0.5)} />;
    })}
  </g>
);
export const Mountains: React.FC<{cx: number; top?: number}> = ({cx, top = 0}) => {
  const L = (k: number) => -(cx - 540) * k;
  return (
    <g>
      <defs>
        <linearGradient id="sky1" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#5fa6e6" />
          <stop offset="0.7" stopColor="#cfe6fb" />
          <stop offset="1" stopColor="#f2f8ff" />
        </linearGradient>
      </defs>
      <rect x={-1200} y={-1200} width={4000} height={2400} fill="url(#sky1)" />
      <circle cx={860 + L(0.02)} cy={260} r={90} fill="#fff7d6" opacity={0.85} />
      <g transform={`translate(${L(0.1)} 0)`}>
        <path d="M-500 900 L-60 420 L180 640 L420 300 L760 760 L1060 440 L1500 900 Z" fill="#a9c2df" />
        <path d="M420 300 L330 470 L400 440 L440 520 L500 430 L560 520 L760 760 L600 500 Z" fill="#eef6ff" opacity={0.85} />
        <path d="M-60 420 L-150 560 L-90 540 L-40 600 L40 520 L180 640 Z" fill="#eef6ff" opacity={0.85} />
      </g>
      <g transform={`translate(${L(0.2)} 0)`}>
        <path d="M-600 960 L-200 640 L40 800 L300 560 L640 900 L900 640 L1300 960 L1500 960 Z" fill="#7d9cc2" />
        <path d="M300 560 L240 680 L310 650 L360 730 L420 650 L500 740 L640 900 L460 620 Z" fill="#e6f0fc" opacity={0.9} />
        <path d="M900 640 L840 740 L900 720 L950 790 L1010 720 L1300 960 L1080 700 Z" fill="#e6f0fc" opacity={0.9} />
      </g>
      <g transform={`translate(${L(0.35)} 0)`}>
        <path d="M-700 1000 L-300 840 L100 960 L560 800 L900 980 L1400 840 L1800 1000 Z" fill="#6a89b0" />
        {[-120, 60, 230, 700, 860, 1160, 1280].map((x, i) => <Pine key={i} x={x} y={980 + (i % 3) * 6} s={0.45 + (i % 3) * 0.1} />)}
        <path d="M-60 960 Q300 920 640 970 L-60 1000 Z" fill="#dbe8f6" opacity={0.7} />
      </g>
    </g>
  );
};
export const Squirrel: React.FC<{x: number; y: number; t: number; s?: number; squeak?: number}> = ({x, y, t, s = 1, squeak = 0}) => {
  const bob = Math.sin(t * 3) * 1.5;
  const tw = Math.sin(t * 9) * 2;
  return (
    <g transform={`translate(${x} ${y + bob}) scale(${s})`}>
      <ellipse cx={0} cy={4} rx={44} ry={7} fill="#1b2a44" opacity={0.25} />
      <path d="M-34 -6 Q-70 -10 -66 -42 Q-64 -26 -40 -28 Z" fill="#a88a58" stroke="#6a5230" strokeWidth={3} />
      <ellipse cx={-4} cy={-34} rx={32} ry={38} fill="#c4a468" stroke="#6a5230" strokeWidth={3} />
      <ellipse cx={4} cy={-28} rx={19} ry={26} fill="#ecd9b0" />
      <circle cx={10} cy={-82} r={26} fill="#c4a468" stroke="#6a5230" strokeWidth={3} />
      <circle cx={-6} cy={-104} r={9} fill="#a88a58" stroke="#6a5230" strokeWidth={3} />
      <circle cx={24} cy={-104} r={9} fill="#a88a58" stroke="#6a5230" strokeWidth={3} />
      <ellipse cx={26} cy={-74} rx={16} ry={13} fill="#ecd9b0" />
      <circle cx={18} cy={-88} r={4.5} fill="#111" />
      <circle cx={19.5} cy={-89.5} r={1.5} fill="#fff" />
      <ellipse cx={37} cy={-80 + tw * 0.3} rx={5} ry={4} fill="#3a2a20" />
      {squeak > 0 && <path d={`M30 -68 Q40 ${-60 + squeak * 4} 32 -58 Z`} fill="#7a3030" />}
      <rect x={14} y={-40} width={30} height={12} rx={6} fill="#c4a468" stroke="#6a5230" strokeWidth={3} transform={`rotate(${-18 + tw} 14 -34)`} />
      <rect x={10} y={-26} width={32} height={12} rx={6} fill="#c4a468" stroke="#6a5230" strokeWidth={3} transform={`rotate(${-10 - tw} 10 -20)`} />
      <ellipse cx={-6} cy={0} rx={22} ry={8} fill="#a88a58" stroke="#6a5230" strokeWidth={3} />
    </g>
  );
};

// ============================ HUD ============================
const Snowflake: React.FC<{c: string}> = ({c}) => (
  <g stroke={c} strokeWidth={4} strokeLinecap="round">
    {[0, 60, 120].map((a) => <line key={a} x1={-14} y1={0} x2={14} y2={0} transform={`rotate(${a})`} />)}
  </g>
);
const Flame: React.FC<{t: number}> = ({t}) => (
  <g transform={`scale(${1 + Math.sin(t * 9) * 0.05})`}>
    <path d="M0 -16 Q12 -4 10 8 Q8 16 0 16 Q-8 16 -10 8 Q-12 -2 -4 -8 Q-2 -2 2 -4 Q4 -10 0 -16 Z" fill="#ff8a2a" />
    <path d="M0 -2 Q6 4 4 10 Q2 14 0 14 Q-4 12 -4 8 Q-4 4 0 -2 Z" fill="#ffd23f" />
  </g>
);
export const TempHUD: React.FC<{t: number; mode: 'out' | 'in' | 'both'; inside: number; fade?: number}> = ({t, mode, inside, fade = 1}) => {
  const Pill = ({x, big, cold, val}: {x: number; big: boolean; cold: boolean; val: number}) => {
    const c = cold ? '#7fd4ff' : '#ff9a3a';
    const w = big ? 380 : 300;
    const h = big ? 112 : 84;
    return (
      <g transform={`translate(${x} ${big ? 112 : 104})`} opacity={fade}>
        <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={h / 2} fill="#0b1830" opacity={0.86} stroke={c} strokeWidth={4} />
        <g transform={`translate(${-w / 2 + h / 2 + 4} 0) scale(${big ? 1.7 : 1.3})`}>{cold ? <Snowflake c={c} /> : <Flame t={t} />}</g>
        <text x={w / 2 - 36} y={big ? 22 : 16} textAnchor="end" fontFamily={FONT} fontWeight={700} fontSize={big ? 62 : 44} fill={c}>{`${val > 0 ? '+' : val < 0 ? '−' : ''}${Math.abs(Math.round(val))}°C`}</text>
        {!big && <text x={-w / 2 + h + 14} y={-26} fontFamily={FONT} fontWeight={700} fontSize={16} fill="#9fb4d0">{cold ? 'СНАРУЖИ' : 'ВНУТРИ'}</text>}
      </g>
    );
  };
  if (mode === 'both') {
    return (
      <g>
        <Pill x={300} big={false} cold val={-40} />
        <Pill x={780} big={false} cold={false} val={inside} />
      </g>
    );
  }
  return mode === 'out' ? <Pill x={540} big cold val={-40} /> : <Pill x={540} big cold={inside < 0} val={inside} />;
};

// ============================ avalanche ============================
export const Avalanche: React.FC<{t: number; a: number; b: number}> = ({t, a, b}) => {
  const p = P(t, a, b);
  const front = ease(p);
  return (
    <g>
      <Mountains cx={540} />
      <g>
        <path d="M-200 1250 L120 900 L480 1100 L780 560 L1100 980 L1400 800 L1400 1920 L-200 1920 Z" fill="#8aa6c8" />
        <path d="M780 560 L700 700 L760 690 L820 780 L900 700 L1100 980 L920 700 Z" fill="#f0f7ff" />
        <path d="M-200 1250 L120 900 L260 990 L180 1100 Z" fill="#e6f0fc" opacity={0.8} />
        <defs>
          <linearGradient id="avg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#fff" /><stop offset="1" stopColor="#d6e6f8" /></linearGradient>
        </defs>
        {[0, 1, 2, 3, 4, 5].map((i) => {
          const k = clamp(front * 1.3 - i * 0.07);
          const x0 = 760 - k * 200 + i * 16, y0 = 600 + k * 1100 + i * 10;
          const r = 110 + k * 260 + i * 20;
          return (
            <g key={i} opacity={Math.min(1, k * 3)}>
              <ellipse cx={x0} cy={y0} rx={r * 1.15} ry={r * 0.62} fill="url(#avg)" opacity={0.92 - i * 0.05} />
              {Array.from({length: 7}).map((_, q) => <circle key={q} cx={x0 + (rnd(q + i * 7) - 0.5) * r * 2} cy={y0 - r * 0.3 - rnd(q + 3 + i) * r * 0.5} r={r * (0.25 + rnd(q + 9 + i) * 0.25)} fill="#fff" opacity={0.85} />)}
            </g>
          );
        })}
        {Array.from({length: 14}).map((_, i) => {
          const k = clamp(front * 1.5 - rnd(i) * 0.3);
          return <path key={i} d={`M${700 + rnd(i + 1) * 500 - k * 520} ${560 + k * 1200 + rnd(i + 2) * 200} l-160 90 l30 -30 Z`} stroke="#fff" strokeWidth={14 + rnd(i) * 16} fill="none" strokeLinecap="round" opacity={0.75 * Math.min(1, k * 4)} />;
        })}
        <rect x={-100} y={1700 - front * 2000 + 2000 * 0} width={1400} height={Math.max(0, front * 1500 - 400)} fill="#fff" opacity={front > 0.75 ? (front - 0.75) * 4 : 0} />
      </g>
      {Array.from({length: 60}).map((_, i) => <circle key={i} cx={rnd(i) * 1080} cy={((rnd(i + 5) * 1920 + t * 400 * (0.5 + rnd(i + 8))) % 2000) - 50} r={3 + rnd(i + 2) * 6} fill="#fff" opacity={0.6 * front} />)}
    </g>
  );
};

// avalanche as pure sweeping snow (no mountains)
export const SnowRush: React.FC<{t: number; a: number; b: number}> = ({t, a, b}) => {
  const p = P(t, a, b);
  const f = ease(p);
  return (
    <g>
      <defs>
        <linearGradient id="rushbg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#c7d9ee" />
          <stop offset="1" stopColor="#f2f8ff" />
        </linearGradient>
      </defs>
      <rect width={1080} height={1920} fill="url(#rushbg)" />
      {Array.from({length: 26}).map((_, i) => {
        const sp = 1400 + rnd(i) * 1800;
        const y = ((rnd(i + 3) * 2300 + (t - a) * sp) % 2300) - 200;
        const x = rnd(i + 9) * 1200 - 60 - (t - a) * 120;
        return <path key={i} d={`M${x} ${y} l-120 60`} stroke="#fff" strokeWidth={10 + rnd(i + 1) * 26} strokeLinecap="round" opacity={0.45 + 0.4 * f} />;
      })}
      {[0, 1, 2, 3, 4, 5, 6].map((i) => {
        const k = clamp(f * 1.4 - i * 0.1);
        const x = 100 + i * 150 + Math.sin(t * 3 + i) * 40;
        const y = -200 + k * 2300;
        const r = 170 + (i % 3) * 60;
        return (
          <g key={i} opacity={Math.min(1, k * 4)}>
            <ellipse cx={x} cy={y} rx={r * 1.3} ry={r * 0.8} fill="#fff" opacity={0.92} />
            {Array.from({length: 6}).map((_, q) => <circle key={q} cx={x + (rnd(q + i * 5) - 0.5) * r * 2} cy={y - r * 0.4 - rnd(q + 2 + i) * r * 0.5} r={r * (0.3 + rnd(q + 7 + i) * 0.3)} fill="#fff" />)}
          </g>
        );
      })}
      {Array.from({length: 90}).map((_, i) => <circle key={i} cx={rnd(i) * 1080} cy={((rnd(i + 5) * 1920 + (t - a) * 900 * (0.5 + rnd(i + 8))) % 2000) - 40} r={3 + rnd(i + 2) * 8} fill="#fff" opacity={0.7} />)}
      <rect width={1080} height={1920} fill="#fff" opacity={Math.max(0, (f - 0.7) * 3)} />
    </g>
  );
};
