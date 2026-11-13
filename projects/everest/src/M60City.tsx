import React from 'react';
import {clamp, ease, lerp, rnd, mixc, Tx, Glow, Snow, E, P} from './M60Base';

export const WORLD_W = 2400;
// ---------------- skyline with blackout waves ----------------
type B = {x: number; w: number; h: number; col: string};
const layer = (n: number, seed: number, wmin: number, wr: number, hmin: number, hr: number, col: string): B[] => {
  const out: B[] = [];
  const step = WORLD_W / n;
  for (let i = -Math.round(n * 0.6); i < n + Math.round(n * 0.6); i++) out.push({x: i * step + (rnd(i + seed + 100) - 0.5) * step * 0.3, w: wmin + rnd(i + seed + 10) * wr, h: hmin + rnd(i + seed + 20) * hr, col});
  return out;
};
const LAYERS = [
  {bs: layer(16, 1, 130, 90, 600, 420, '#121a2a'), k: 0.08, ww: 28, wh: 40, lit: 0.45},
  {bs: layer(11, 40, 200, 80, 900, 500, '#0d1422'), k: 0.18, ww: 34, wh: 48, lit: 0.55},
  {bs: layer(7, 80, 300, 70, 1200, 520, '#080d18'), k: 0.32, ww: 42, wh: 60, lit: 0.62},
];
export const Skyline: React.FC<{t: number; bo: number; cx?: number; ground?: number}> = ({t, bo, cx = 1200, ground = 1700}) => (
  <g>
    <defs>
      <linearGradient id="skyc" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#0b1120" />
        <stop offset="1" stopColor="#223149" />
      </linearGradient>
    </defs>
    <rect x={-4000} y={-300} width={WORLD_W + 8000} height={2400} fill="url(#skyc)" />
    {LAYERS.map((L, li) => (
      <g key={li} transform={`translate(${-(cx - 1200) * L.k} 0)`}>
        {L.bs.map((b, bi) => {
          const th = clamp(b.x / WORLD_W, -0.2, 1.2) * 0.78 + rnd(bi + li * 50) * 0.14 + 0.06;
          const cols = Math.floor(b.w / (L.ww + 10));
          const rows = Math.floor(b.h / (L.wh + 12));
          return (
            <g key={bi}>
              <rect x={b.x} y={ground - b.h} width={b.w} height={b.h + 400} fill={b.col} />
              <rect x={b.x} y={ground - b.h} width={b.w} height={6} fill="#2a3a56" />
              {Array.from({length: rows}).map((_, r) => Array.from({length: cols}).map((_, c) => {
                const id = bi * 1000 + r * 31 + c + li * 7;
                const base = rnd(id) < L.lit;
                const flick = bo > th - 0.07 && bo < th ? (Math.sin(t * 30 + id) > 0 ? 1 : 0.1) : 1;
                const on = base && bo < th;
                const o = on ? flick : base && bo >= th ? Math.max(0, 0.9 - (bo - th) * 40) * 0 : 0;
                const warm = rnd(id + 5) < 0.7;
                return (
                  <g key={`${r}-${c}`}>
                    <rect x={b.x + 14 + c * (L.ww + 10)} y={ground - b.h + 22 + r * (L.wh + 12)} width={L.ww} height={L.wh} fill="#0a1020" />
                    {o > 0.01 && <rect x={b.x + 14 + c * (L.ww + 10)} y={ground - b.h + 22 + r * (L.wh + 12)} width={L.ww} height={L.wh} fill={warm ? '#ffd27a' : '#bfe0ff'} opacity={o * 0.95} />}
                  </g>
                );
              }))}
            </g>
          );
        })}
      </g>
    ))}
    <rect x={-4000} y={ground} width={WORLD_W + 8000} height={500} fill="#101726" />
    <rect x={-4000} y={ground} width={WORLD_W + 8000} height={12} fill="#2c3a55" />
    {/* street lamps */}
    {Array.from({length: 26}).map((_, i) => {
      const x = -1300 + i * 200;
      const th = (x / WORLD_W) * 0.78 + 0.12;
      const on = bo < th ? 1 : 0;
      return (
        <g key={i}>
          <rect x={x - 3} y={ground - 150} width={6} height={150} fill="#1a2234" />
          {on > 0 && <Glow x={x} y={ground - 150} r={120} c="#ffd27a" o={0.5} id={`sl${i}`} />}
          <circle cx={x} cy={ground - 152} r={7} fill={on ? '#ffe9a8' : '#2a3246'} />
        </g>
      );
    })}
    {/* cars with headlights always on */}
    {Array.from({length: 14}).map((_, i) => {
      const x = ((i * 380 + t * (30 + i * 6)) % (WORLD_W + 2800)) - 1400;
      return (
        <g key={i} transform={`translate(${x} ${ground + 70 + (i % 2) * 50})`}>
          <rect x={-60} y={-34} width={120} height={34} rx={10} fill="#1c2434" />
          <rect x={-36} y={-56} width={72} height={26} rx={9} fill="#232c40" />
          <circle cx={58} cy={-18} r={6} fill="#fff2b0" />
          <Glow x={80} y={-18} r={80} c="#fff2b0" o={0.35} id={`hl${i}`} />
        </g>
      );
    })}
    <Snow t={t} n={80} speed={120} wind={80} op={0.7} w={WORLD_W} h={1920} size={1.2} />
  </g>
);

// ---------------- traffic light closeup ----------------
export const TrafficLight: React.FC<{t: number; green: number; red: number; yellow?: number}> = ({t, green, red, yellow = 0}) => (
  <g>
    <rect x={-4000} y={-100} width={9300} height={2200} fill="#0e1524" />
    {Array.from({length: 14}).map((_, i) => <circle key={i} cx={rnd(i) * 1080} cy={300 + rnd(i + 3) * 1000} r={30 + rnd(i + 5) * 60} fill={['#ffd27a', '#bfe0ff', '#ff6a4a'][i % 3]} opacity={0.08 + 0.1 * ((green + red) > 0 ? 1 : 0.3)} />)}
    <rect x={500} y={900} width={80} height={1100} fill="#1a2234" />
    <rect x={380} y={200} width={320} height={780} rx={40} fill="#0a0d14" stroke="#2a3246" strokeWidth={10} />
    {[
      {y: 360, c: '#ff3b3b', v: red},
      {y: 590, c: '#ffc83b', v: yellow},
      {y: 820, c: '#3bff7a', v: green},
    ].map((l, i) => (
      <g key={i}>
        <circle cx={540} cy={l.y - 120 + (i === 0 ? 0 : 0)} r={86} fill="#141a26" />
        <circle cx={540} cy={l.y - 120} r={78} fill={l.c} opacity={0.12 + 0.88 * l.v} />
        {l.v > 0.05 && <Glow x={540} y={l.y - 120} r={260} c={l.c} o={0.5 * l.v} id={`tl${i}`} />}
      </g>
    ))}
    <rect x={380} y={200} width={320} height={780} rx={40} fill="none" stroke="#3a4560" strokeWidth={3} opacity={0.5} />
    <Snow t={t} n={90} speed={160} wind={120} op={0.8} size={1.6} />
  </g>
);

// ---------------- top-down city, lamps going out ----------------
export const CityTop: React.FC<{t: number; prog: number}> = ({t, prog}) => (
  <g>
    <rect x={-4000} y={-300} width={9700} height={2500} fill="#0b1120" />
    {Array.from({length: 4}).map((_, r) => Array.from({length: 3}).map((_, c) => (
      <g key={`${r}${c}`}>
        <rect x={c * 380 + 70} y={r * 540 + 60} width={290} height={430} fill={['#141c2e', '#101728', '#18213a'][(r + c) % 3]} />
        {Array.from({length: 6}).map((_, k) => <rect key={k} x={c * 380 + 100 + (k % 3) * 80} y={r * 540 + 100 + Math.floor(k / 3) * 170} width={60} height={120} fill="#1c2640" />)}
      </g>
    )))}
    {/* roads */}
    {[0, 1, 2, 3, 4].map((r) => <rect key={`h${r}`} x={-300} y={r * 540 - 20} width={1700} height={70} fill="#06080f" />)}
    {[0, 1, 2, 3].map((c) => <rect key={`v${c}`} x={c * 380 + 10} y={-300} width={60} height={2500} fill="#06080f" />)}
    {/* lamps */}
    {Array.from({length: 40}).map((_, i) => {
      const r = Math.floor(i / 8), c = i % 8;
      const x = 40 + c * 140, y = 30 + r * 540 + (c % 2) * 30;
      const th = ((x + y * 0.4) / 1700) * 0.85 + rnd(i) * 0.1;
      const on = prog < th ? 1 : 0;
      const flick = prog > th - 0.05 && prog < th ? (Math.sin(t * 40 + i) > 0 ? 1 : 0.2) : on;
      return (
        <g key={i}>
          <Glow x={x} y={y} r={90} c="#ffd27a" o={0.55 * flick} id={`ct${i}`} />
          <circle cx={x} cy={y} r={7} fill={on ? '#fff0b8' : '#1c2334'} />
        </g>
      );
    })}
    {/* car lights remain */}
    {Array.from({length: 10}).map((_, i) => {
      const x = ((i * 170 + t * 60) % 1500) - 100;
      const y = 30 + Math.floor(i / 2) * 540 + 20;
      return <g key={i}><circle cx={x} cy={y} r={5} fill="#fff6c8" /><circle cx={x + 14} cy={y} r={5} fill="#fff6c8" /><Glow x={x + 40} y={y} r={60} c="#fff6c8" o={0.3} id={`cl${i}`} /></g>;
    })}
    <Snow t={t} n={70} speed={120} wind={60} op={0.7} size={1.3} />
  </g>
);

// ---------------- street scenes ----------------
const Car: React.FC<{x: number; y: number; col: string; door?: boolean; s?: number; lights?: boolean; flash?: number; snow?: boolean}> = ({x, y, col, door, s = 1, lights, flash = 0, snow = true}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse cx={0} cy={4} rx={130} ry={12} fill="#000" opacity={0.3} />
    <path d="M-120 -30 L-120 -70 Q-120 -86 -100 -88 L-60 -92 L-30 -130 L50 -130 L84 -92 L112 -88 Q124 -84 124 -66 L124 -30 Z" fill={col} />
    <path d="M-52 -92 L-28 -122 L-4 -122 L-4 -92 Z M8 -92 L8 -122 L46 -122 L74 -92 Z" fill="#20304a" opacity={0.9} />
    {door && <g transform="translate(-6 -92) rotate(-24)"><rect x={0} y={0} width={14} height={60} fill={col} stroke="#00000055" strokeWidth={2} /></g>}
    {snow && <path d="M-110 -72 Q-60 -96 -30 -134 L50 -134 Q80 -96 118 -86 Q60 -100 -110 -72 Z" fill="#e8f0fb" opacity={0.85} />}
    <circle cx={-84} cy={-24} r={26} fill="#0c0f16" /><circle cx={84} cy={-24} r={26} fill="#0c0f16" />
    <circle cx={-84} cy={-24} r={12} fill="#555c6a" /><circle cx={84} cy={-24} r={12} fill="#555c6a" />
    {(lights || flash > 0) && <g><circle cx={118} cy={-52} r={7} fill="#fff6c8" opacity={lights ? 1 : flash} /><Glow x={170} y={-52} r={110} c="#fff6c8" o={0.4 * (lights ? 1 : flash)} id={`cg${Math.round(x)}`} /></g>}
  </g>
);
export const StreetBase: React.FC<{t: number; sky?: string; ground?: number; children?: React.ReactNode}> = ({t, sky = '#3a4660', ground = 1450, children}) => (
  <g>
    <rect x={-4000} y={-300} width={10000} height={2500} fill={sky} />
    {[-4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6].map((i) => (
      <g key={i}>
        <rect x={-100 + i * 420} y={ground - 900 - (i % 2) * 160} width={380} height={900 + (i % 2) * 160 + 400} fill={['#232c42', '#2b354e', '#1f283c', '#27304a'][((i % 4) + 4) % 4]} />
        {Array.from({length: 18}).map((_, k) => <rect key={k} x={-80 + i * 420 + (k % 3) * 120} y={ground - 860 - (i % 2) * 160 + Math.floor(k / 3) * 130} width={70} height={90} fill={rnd(k + i * 9) > 0.7 ? '#ffd27a' : '#141a2a'} opacity={0.85} />)}
      </g>
    ))}
    <rect x={-4000} y={ground} width={10000} height={600} fill="#2e3548" />
    <rect x={-4000} y={ground} width={10000} height={10} fill="#c9d6e8" opacity={0.6} />
    {Array.from({length: 8}).map((_, i) => <rect key={i} x={i * 240 - 40} y={ground + 140} width={130} height={10} fill="#d9d9d9" opacity={0.6} />)}
    {children}
    <Snow t={t} n={70} speed={110} wind={70} op={0.75} w={1700} h={1920} size={1.3} />
  </g>
);
export const Jam: React.FC<{t: number}> = ({t}) => (
  <StreetBase t={t}>
    {[0, 1, 2, 3, 4].map((i) => <Car key={i} x={160 + i * 330} y={1560 + (i % 2) * 40} col={['#7a2a2a', '#2a4a7a', '#4a4a52', '#6a5a2a', '#2a6a5a'][i]} door={i === 1 || i === 3} lights flash={0.5 + 0.5 * Math.sin(t * 8 + i)} />)}
    <g transform="translate(1500 1450)">
      <rect x={-6} y={-420} width={12} height={420} fill="#1a2234" />
      <rect x={-34} y={-520} width={68} height={120} rx={12} fill="#0a0d14" />
      <circle cx={0} cy={-490} r={14} fill="#ff3b3b" /><circle cx={0} cy={-460} r={14} fill="#251414" /><circle cx={0} cy={-430} r={14} fill="#142514" />
    </g>
  </StreetBase>
);
export const Supermarket: React.FC<{t: number}> = ({t}) => {
  const fl = Math.sin(t * 13) > 0.85 ? 0.6 : 1;
  return (
    <g>
      <rect x={-4000} y={-200} width={9800} height={2400} fill="#cfd8e4" />
      <rect x={-4000} y={1400} width={9800} height={700} fill="#9aa5b6" />
      {[0, 1, 2].map((r) => <rect key={r} x={-200} y={1400 + r * 90} width={1800} height={3} fill="#8794a8" />)}
      {[0, 1, 2].map((i) => (
        <g key={i} transform={`translate(${60 + i * 520} 0)`}>
          <rect x={0} y={640} width={440} height={760} fill="#6a7690" />
          {[0, 1, 2, 3].map((s) => <rect key={s} x={10} y={700 + s * 170} width={420} height={10} fill="#3a4258" />)}
          {[0, 1, 2, 3].map((s) => Array.from({length: 3}).map((_, k) => (rnd(i * 20 + s * 5 + k) > 0.8 ? <rect key={`${s}${k}`} x={30 + k * 130} y={620 + s * 170 + 60} width={80} height={70} rx={8} fill={['#c0392b', '#2a6ad0', '#d9a82a'][k]} /> : null)))}
        </g>
      ))}
      {/* overturned basket */}
      <g transform="translate(760 1560) rotate(-18)">
        <rect x={-70} y={-40} width={140} height={80} rx={8} fill="#c0392b" />
        {Array.from({length: 6}).map((_, k) => <line key={k} x1={-60 + k * 24} y1={-36} x2={-60 + k * 24} y2={36} stroke="#7a1f16" strokeWidth={4} />)}
      </g>
      {[0, 1, 2].map((i) => <rect key={i} x={120 + i * 520} y={160} width={380} height={24} rx={8} fill="#fff" opacity={0.9 * fl} />)}
      <rect x={-4000} y={-200} width={9800} height={2400} fill="#000" opacity={0.18 + (1 - fl) * 0.4} />
    </g>
  );
};
export const GasStation: React.FC<{t: number}> = ({t}) => (
  <StreetBase t={t} sky="#34405a" ground={1480}>
    <rect x={-4000} y={560} width={9500} height={90} fill="#c0392b" />
    <rect x={-4000} y={650} width={9500} height={24} fill="#fff" opacity={0.85} />
    {[300, 800, 1200].map((x) => <rect key={x} x={x - 14} y={674} width={28} height={806} fill="#8794a8" />)}
    {[420, 960].map((x) => (
      <g key={x} transform={`translate(${x} 1480)`}>
        <rect x={-40} y={-260} width={80} height={260} rx={10} fill="#d9d9d9" />
        <rect x={-30} y={-230} width={60} height={60} fill="#1a2234" /><rect x={-30} y={-150} width={60} height={20} fill="#c0392b" />
        <path d="M40 -150 Q80 -140 70 -60" stroke="#222" strokeWidth={8} fill="none" />
      </g>
    ))}
    {[0, 1, 2, 3].map((i) => <Car key={i} x={-60 + i * 380} y={1560 + 70} col={['#4a4a52', '#7a2a2a', '#2a4a7a', '#6a5a2a'][i]} s={0.9} lights />)}
  </StreetBase>
);
export const StreetDE: React.FC<{t: number}> = ({t}) => (
  <g>
    <rect x={-4000} y={-300} width={10000} height={2500} fill="#56637d" />
    {[0, 1, 2].map((i) => (
      <g key={i} transform={`translate(${-60 + i * 480} 0)`}>
        <rect x={0} y={420 + (i % 2) * 90} width={440} height={1100} fill={['#8a6a5a', '#6a7a8a', '#9a8a6a'][i]} />
        <path d={`M-20 ${420 + (i % 2) * 90} L220 ${300 + (i % 2) * 90} L460 ${420 + (i % 2) * 90} Z`} fill="#e8f0fb" />
        {[0, 1, 2, 3].map((r) => [0, 1].map((c) => <rect key={`${r}${c}`} x={50 + c * 200} y={520 + (i % 2) * 90 + r * 220} width={130} height={150} fill="#2a3448" stroke="#e8f0fb" strokeWidth={8} />))}
      </g>
    ))}
    <rect x={-4000} y={1500} width={10000} height={600} fill="#aebbd0" />
    {[0, 1].map((i) => <Car key={i} x={280 + i * 600} y={1640} col={['#5a6a7a', '#7a4a4a'][i]} />)}
    {[160, 760, 1300].map((x) => <g key={x}><rect x={x - 4} y={1000} width={8} height={500} fill="#2a3246" /><circle cx={x} cy={990} r={12} fill="#ffe9a8" /><Glow x={x} y={990} r={140} c="#ffe9a8" o={0.35} id={`de${x}`} /></g>)}
    <Snow t={t} n={90} speed={110} wind={70} op={0.8} w={1700} size={1.5} />
  </g>
);
export const Airport: React.FC<{t: number}> = ({t}) => (
  <g>
    <rect x={-4000} y={-200} width={9800} height={2400} fill="#26324a" />
    <rect x={-4000} y={1100} width={9800} height={900} fill="#3a4660" />
    {/* glass terminal */}
    <rect x={0} y={460} width={1400} height={640} fill="#3a4a68" opacity={0.85} />
    {Array.from({length: 8}).map((_, i) => <rect key={i} x={i * 175} y={460} width={6} height={640} fill="#1a2234" />)}
    {/* plane */}
    <g transform="translate(700 1250)">
      <ellipse cx={0} cy={-40} rx={430} ry={70} fill="#e8eef7" />
      <path d="M-200 -40 L-300 -200 L-240 -200 L-120 -50 Z" fill="#cfd8e4" />
      <path d="M-40 -20 L90 80 L150 80 L100 -20 Z" fill="#b8c4d8" />
      <rect x={-420} y={-70} width={80} height={30} rx={10} fill="#8aa0c8" />
      {Array.from({length: 14}).map((_, i) => <rect key={i} x={-340 + i * 42} y={-62} width={16} height={14} rx={4} fill="#26324a" />)}
      <circle cx={-80} cy={50} r={20} fill="#11151f" /><circle cx={90} cy={50} r={20} fill="#11151f" />
    </g>
    {/* board */}
    <g transform="translate(70 120)">
      <rect x={0} y={0} width={940} height={330} rx={16} fill="#0a0e18" stroke="#3a4560" strokeWidth={6} />
      {[0, 1, 2, 3].map((r) => (
        <g key={r}>
          <Tx x={30} y={70 + r * 70} anchor="start" size={34} fill="#cfd8e4">{['CA 932', 'HU 701', 'LH 417', 'AF 1204'][r]}</Tx>
          <Tx x={910} y={70 + r * 70} anchor="end" size={34} fill="#ff4a4a" o={0.55 + 0.45 * Math.sin(t * 5 + r) ** 2}>ОТМЕНЁН</Tx>
        </g>
      ))}
    </g>
    <Snow t={t} n={50} speed={100} wind={60} op={0.7} w={1500} size={1.4} />
  </g>
);

// ---------------- maps ----------------
const POLY: V2[][] = [
  [[60, 70], [200, 40], [300, 70], [330, 140], [300, 200], [250, 250], [200, 250], [150, 200], [100, 150], [60, 120]],
  [[330, 40], [400, 30], [420, 70], [370, 90]],
  [[240, 270], [300, 260], [340, 300], [330, 360], [290, 440], [260, 400], [240, 330]],
  [[470, 90], [540, 70], [570, 100], [560, 140], [510, 150], [470, 130]],
  [[470, 160], [560, 160], [600, 220], [580, 320], [540, 380], [500, 340], [470, 250]],
  [[560, 60], [700, 40], [840, 70], [900, 120], [880, 180], [800, 230], [740, 210], [690, 170], [640, 160], [590, 130]],
  [[800, 300], [890, 290], [920, 340], [860, 370], [810, 350]],
];
type V2 = [number, number];
export const DotMap: React.FC<{t: number; reveal: number}> = ({t, reveal}) => (
  <g transform="translate(0 560) scale(1.08)">
    <defs>
      <clipPath id="worldc">{POLY.map((p, i) => <polygon key={i} points={p.map((q) => q.join(',')).join(' ')} />)}</clipPath>
    </defs>
    <g clipPath="url(#worldc)">
      {Array.from({length: 70}).map((_, r) => Array.from({length: 66}).map((_, c) => {
        const x = c * 15, y = r * 7.2 + (c % 2) * 3;
        const d = Math.abs(x - 500) / 500 + Math.abs(y - 200) / 250;
        const k = clamp(reveal * 2.2 - d * 0.6);
        return <circle key={`${r}-${c}`} cx={x} cy={y} r={3.2} fill="#8fb4e8" opacity={0.15 + 0.7 * k} />;
      }))}
    </g>
  </g>
);
export const EuropeMap: React.FC<{t: number; drop: number}> = ({t, drop}) => {
  const cities: {n: string; x: number; y: number; t0: number; t1: number}[] = [
    {n: 'BER', x: 540, y: 700, t0: -2, t1: -20}, {n: 'PAR', x: 400, y: 840, t0: 1, t1: -14}, {n: 'MAD', x: 300, y: 1090, t0: 8, t1: -9},
    {n: 'ROM', x: 590, y: 1050, t0: 6, t1: -11}, {n: 'WAW', x: 700, y: 640, t0: -4, t1: -23}, {n: 'OSL', x: 520, y: 470, t0: -9, t1: -31},
    {n: 'KYIV', x: 840, y: 760, t0: -5, t1: -25},
  ];
  return (
    <g>
      <rect x={-4000} y={-200} width={9700} height={2400} fill="#0d1526" />
      <path d="M200 1180 L220 1000 L290 920 L330 780 L410 760 L430 680 L360 560 L420 440 L520 380 L610 420 L700 540 L800 560 L940 620 L980 760 L900 880 L760 920 L690 1020 L600 1140 L480 1120 L360 1200 Z" fill="#1e2c48" stroke="#4a6aa0" strokeWidth={5} />
      {cities.map((c, i) => {
        const v = lerp(c.t0, c.t1, drop);
        const col = mixc('#ffd27a', '#7fd0ff', drop);
        return (
          <g key={i}>
            <circle cx={c.x} cy={c.y} r={12} fill={col} />
            <circle cx={c.x} cy={c.y} r={12 + 16 * (0.5 + 0.5 * Math.sin(t * 4 + i))} fill="none" stroke={col} strokeWidth={3} opacity={0.5} />
            <Tx x={c.x + 22} y={c.y - 12} anchor="start" size={32} fill="#9fb4d0">{c.n}</Tx>
            <Tx x={c.x + 22} y={c.y + 34} anchor="start" size={52} fill={col}>{`${Math.round(v) < 0 ? '−' : '+'}${Math.abs(Math.round(v))}°`}</Tx>
          </g>
        );
      })}
    </g>
  );
};
