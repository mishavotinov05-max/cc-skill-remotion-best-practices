import React from 'react';
import '@fontsource/montserrat/cyrillic-700.css';
import '@fontsource/montserrat/latin-700.css';
import {Figure} from './Everest';
import {OUTFITS} from './Characters';
import {Key, cam, clamp, ease, lerp, rnd, seg} from './util';

const W = 1080;
const H = 1920;
export const FONT = 'Montserrat, sans-serif';
export const Svg: React.FC<{children: React.ReactNode}> = ({children}) => (
  <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
    {children}
  </svg>
);
export const P = (t: number, a: number, b: number) => clamp((t - a) / (b - a));

// ---------- small reusable props ----------
export const Excavator: React.FC<{x: number; y: number; s?: number; a1?: number; a2?: number; a3?: number; flip?: boolean}> = ({x, y, s = 1, a1 = -35, a2 = 60, a3 = 40, flip}) => (
  <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
    <rect x={-120} y={-44} width={240} height={44} rx={22} fill="#141414" />
    {[-80, -30, 30, 80].map((c) => (
      <circle key={c} cx={c} cy={-22} r={14} fill="#2a2a2a" />
    ))}
    <rect x={-90} y={-112} width={150} height={70} rx={8} fill="#d9a21b" />
    <rect x={-90} y={-60} width={150} height={10} fill="#8a6410" />
    <path d="M10 -112 L10 -170 L82 -170 L100 -112 Z" fill="#d9a21b" />
    <path d="M24 -118 L24 -160 L74 -160 L88 -118 Z" fill="#8fb7d6" opacity={0.65} />
    <g transform={`translate(52 -100) rotate(${a1})`}>
      <rect x={0} y={-14} width={170} height={28} rx={10} fill="#d9a21b" />
      <g transform={`translate(170 0) rotate(${a2})`}>
        <rect x={0} y={-10} width={130} height={20} rx={8} fill="#b8860f" />
        <g transform={`translate(130 0) rotate(${a3})`}>
          <path d="M-6 -12 L46 -8 L40 30 L-4 22 Z" fill="#2f2f2f" />
        </g>
      </g>
    </g>
  </g>
);

export const Truck: React.FC<{x: number; y: number; s?: number; color?: string; load?: boolean}> = ({x, y, s = 1, color = '#c0392b', load = true}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-170} y={-170} width={250} height={150} rx={6} fill="#2b2f36" />
    {load && <rect x={-160} y={-160} width={230} height={130} fill="#3a2f22" opacity={0.0} />}
    <path d="M90 -20 L90 -140 L170 -140 L210 -90 L210 -20 Z" fill={color} />
    <path d="M104 -128 L160 -128 L188 -94 L104 -94 Z" fill="#8fb7d6" opacity={0.7} />
    <rect x={-170} y={-24} width={380} height={16} fill="#101010" />
    {[-120, -60, 120, 170].map((c) => (
      <g key={c}>
        <circle cx={c} cy={-12} r={30} fill="#0e0e0e" />
        <circle cx={c} cy={-12} r={13} fill="#555" />
      </g>
    ))}
    <rect x={198} y={-52} width={14} height={14} fill="#ffd27a" />
  </g>
);

export const Car: React.FC<{x: number; y: number; s?: number; trunk?: number; bob?: number}> = ({x, y, s = 1, trunk = 0, bob = 0}) => (
  <g transform={`translate(${x} ${y + bob}) scale(${s})`}>
    <ellipse cx={0} cy={6} rx={190} ry={14} fill="#000" opacity={0.45} />
    <path d="M-190 -20 L-190 -86 Q-190 -100 -170 -102 L-95 -106 L-40 -160 L70 -160 L120 -108 L180 -98 Q196 -96 196 -80 L196 -20 Z" fill="#3b4250" />
    <path d="M-80 -110 L-36 -152 L-6 -152 L-6 -110 Z M6 -110 L6 -152 L66 -152 L104 -110 Z" fill="#9fc3df" opacity={0.65} />
    <g transform={`translate(-186 -100) rotate(${-trunk * 62})`}>
      <path d="M0 0 L100 -4 L100 10 L0 14 Z" fill="#2f3541" />
    </g>
    {[-110, 110].map((c) => (
      <g key={c}>
        <circle cx={c} cy={-18} r={34} fill="#0c0c0c" />
        <circle cx={c} cy={-18} r={16} fill="#888" />
      </g>
    ))}
    <rect x={186} y={-70} width={14} height={14} rx={3} fill="#ffe29a" />
  </g>
);

export const Trees: React.FC<{y: number; off: number; n: number; size: number; color: string; gap?: number}> = ({y, off, n, size, color, gap = 190}) => (
  <g>
    {Array.from({length: n}).map((_, i) => {
      const x = (((i * gap + off) % (n * gap)) + n * gap) % (n * gap) - gap;
      const h = size * (0.8 + rnd(i + 3) * 0.5);
      return (
        <g key={i} transform={`translate(${x} ${y})`}>
          <rect x={-5} y={-12} width={10} height={14} fill="#1a120d" />
          <path d={`M0 ${-h} L${h * 0.32} ${-h * 0.45} L${h * 0.18} ${-h * 0.45} L${h * 0.42} 0 L${-h * 0.42} 0 L${-h * 0.18} ${-h * 0.45} L${-h * 0.32} ${-h * 0.45} Z`} fill={color} />
        </g>
      );
    })}
  </g>
);

export const Box: React.FC<{x: number; y: number; w?: number; h?: number; color?: string}> = ({x, y, w = 70, h = 56, color = '#b08a52'}) => (
  <g transform={`translate(${x} ${y})`}>
    <rect x={-w / 2} y={-h} width={w} height={h} fill={color} stroke="#5a431f" strokeWidth={3} />
    <rect x={-w / 2} y={-h * 0.62} width={w} height={6} fill="#5a431f" opacity={0.6} />
  </g>
);

// ---------- city and spores ----------
export const CityWide: React.FC<{t: number; p: number}> = ({t, p}) => (
  <Svg>
    <defs>
      <linearGradient id="bsky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#1a0d12" />
        <stop offset="0.6" stopColor="#7a3318" />
        <stop offset="1" stopColor="#d4691f" />
      </linearGradient>
    </defs>
    <g transform={`translate(540 1200) scale(${1 + p * 0.14}) translate(-540 -1200)`}>
      <rect x={-300} y={-300} width={1680} height={2400} fill="url(#bsky)" />
      <circle cx={760} cy={1180} r={170} fill="#ff9a3c" opacity={0.35} />
      {Array.from({length: 11}).map((_, i) => {
        const bw = 90 + rnd(i) * 70;
        const bh = 520 + rnd(i + 5) * 700;
        const bx = -40 + i * 108;
        return (
          <g key={i}>
            <rect x={bx} y={1500 - bh} width={bw} height={bh} fill={i % 2 ? '#2a2326' : '#1e191c'} />
            {Array.from({length: 26}).map((_, k) => (
              <rect key={k} x={bx + 10 + (k % 4) * (bw / 4.4)} y={1500 - bh + 24 + Math.floor(k / 4) * 62} width={bw / 6} height={26} fill={rnd(i * 31 + k) > 0.8 ? '#ffb55a' : '#0e0b0d'} opacity={rnd(i * 31 + k) > 0.8 ? 0.85 : 0.9} />
            ))}
          </g>
        );
      })}
      <rect x={-300} y={1500} width={1680} height={700} fill="#0f0c0e" />
      <rect x={-300} y={1500} width={1680} height={8} fill="#3a2a26" />
      {Array.from({length: 40}).map((_, i) => (
        <circle key={i} cx={(rnd(i) * 1080 + t * 10 * (0.4 + rnd(i + 2))) % 1080} cy={500 + rnd(i + 8) * 1000 + Math.sin(t + i) * 12} r={1.5 + rnd(i + 4) * 2.5} fill="#a9b98c" opacity={0.45} />
      ))}
    </g>
  </Svg>
);

const sporeBlob = (cx: number, cy: number, r: number, seed: number, t: number) => (
  <g key={`${cx}-${cy}`}>
    <circle cx={cx} cy={cy} r={r * 1.25} fill="#7a8f5a" opacity={0.16 + 0.05 * Math.sin(t * 2 + seed)} />
    {Array.from({length: 14}).map((_, i) => {
      const a = rnd(seed + i) * Math.PI * 2;
      const d = rnd(seed + i + 9) * r;
      return <circle key={i} cx={cx + Math.cos(a) * d} cy={cy + Math.sin(a) * d} r={r * (0.12 + rnd(seed + i + 3) * 0.28)} fill={i % 3 ? '#5c7040' : '#3a4a28'} opacity={0.9} />;
    })}
  </g>
);

export const SporeWall: React.FC<{t: number; p: number}> = ({t, p}) => (
  <Svg>
    <g transform={`translate(540 900) scale(${1 + p * 0.7}) translate(-540 -900)`}>
      <rect x={-400} y={-400} width={1880} height={2800} fill="#2b2a2d" />
      {Array.from({length: 9}).map((_, r) => (
        <g key={r}>
          <rect x={-400} y={r * 220 - 200} width={1880} height={6} fill="#141316" />
          {Array.from({length: 7}).map((_, c) => (
            <rect key={c} x={c * 200 - ((r % 2) * 100) - 100} y={r * 220 - 200} width={6} height={220} fill="#141316" />
          ))}
        </g>
      ))}
      {Array.from({length: 22}).map((_, i) => (
        <rect key={i} x={rnd(i) * 1080} y={rnd(i + 4) * 1920} width={50 + rnd(i + 2) * 120} height={4} fill="#000" opacity={0.25} />
      ))}
      {sporeBlob(380, 780, 150, 3, t)}
      {sporeBlob(700, 1050, 110, 21, t)}
      {sporeBlob(300, 1200, 80, 33, t)}
      {sporeBlob(760, 640, 70, 41, t)}
      {Array.from({length: 60}).map((_, i) => (
        <circle key={i} cx={(rnd(i) * 1080 + t * 25 * (0.3 + rnd(i + 1))) % 1080} cy={((rnd(i + 7) * 1920 - t * 14 * (0.3 + rnd(i + 3))) % 1920 + 1920) % 1920} r={1.5 + rnd(i + 5) * 3.5} fill="#b4c796" opacity={0.55} />
      ))}
    </g>
  </Svg>
);

export const StreetMax: React.FC<{t: number}> = ({t}) => (
  <Svg>
    <defs>
      <linearGradient id="bsky2" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#1a0d12" />
        <stop offset="1" stopColor="#8a3d19" />
      </linearGradient>
    </defs>
    <rect width={W} height={H} fill="url(#bsky2)" />
    <rect x={380} y={200} width={760} height={1300} fill="#26242a" />
    {Array.from({length: 7}).map((_, r) => (
      <rect key={r} x={380} y={200 + r * 190} width={760} height={5} fill="#131216" />
    ))}
    {sporeBlob(760, 760, 150, 5, t)}
    {sporeBlob(900, 1060, 90, 17, t)}
    <rect x={0} y={1500} width={W} height={420} fill="#0e0b0d" />
    <Figure x={250} y={1620} s={1.55} face={{look: 0.9, fear: 0.55}} outfit={OUTFITS.max} />
    {Array.from({length: 40}).map((_, i) => (
      <circle key={i} cx={(rnd(i) * 1080 + t * 18 * (0.4 + rnd(i + 2))) % 1080} cy={400 + rnd(i + 8) * 1100} r={1.5 + rnd(i + 4) * 2.5} fill="#b4c796" opacity={0.5} />
    ))}
  </Svg>
);

export const TimerCard: React.FC<{t: number}> = ({t}) => {
  const k = t - 7.15;
  const flash = clamp(1 - k / 0.35);
  const secs = Math.max(0, 96 * 3600 - Math.floor(k * 14) * 1000);
  const hh = String(Math.floor(secs / 3600)).padStart(2, '0');
  const mm = String(Math.floor((secs % 3600) / 60)).padStart(2, '0');
  const ss = String(secs % 60).padStart(2, '0');
  return (
    <Svg>
      <rect width={W} height={H} fill="#050304" />
      <text x={540} y={760} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={150} fill="#e0261b">ДЕНЬ 3.</text>
      <text x={540} y={900} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={64} fill="#e0261b">ДО ЗАРАЖЕНИЯ — 4 ДНЯ</text>
      <rect x={150} y={1010} width={780} height={190} rx={22} fill="#120808" stroke="#7a1812" strokeWidth={4} />
      <text x={540} y={1148} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={128} fill="#ff3b2e" letterSpacing={6}>{`${hh}:${mm}:${ss}`}</text>
      <rect width={W} height={H} fill="#ff2a1a" opacity={flash * 0.75} />
    </Svg>
  );
};

// ---------- loading the car, driving ----------
export const LoadCar: React.FC<{t: number}> = ({t}) => {
  const trunk = ease(P(t, 8.5, 8.9)) * (1 - ease(P(t, 10.85, 11.0)));
  const loads = [8.7, 9.3, 9.9, 10.4];
  return (
    <Svg>
      <defs>
        <linearGradient id="bsky3" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1a0d12" />
          <stop offset="1" stopColor="#9a4a1c" />
        </linearGradient>
      </defs>
      <rect width={W} height={H} fill="url(#bsky3)" />
      {Array.from({length: 7}).map((_, i) => (
        <rect key={i} x={-40 + i * 170} y={760 - rnd(i) * 300} width={130} height={900 - 0} fill="#201a1e" />
      ))}
      <rect x={0} y={1400} width={W} height={520} fill="#0f0c0e" />
      <Car x={760} y={1500} s={1.55} trunk={trunk} />
      <g>
        {loads.map((l, i) => {
          const k = P(t, l, l + 0.55);
          if (k <= 0 || k >= 1) return null;
          const x = lerp(300, 520, k);
          const y = 1370 - Math.sin(k * Math.PI) * 120 + k * 60;
          return i % 2 ? <Box key={i} x={x} y={y} /> : <g key={i} transform={`translate(${x} ${y})`}><rect x={-26} y={-60} width={52} height={60} rx={8} fill="#b5321f" stroke="#5a1410" strokeWidth={3} /><rect x={-10} y={-74} width={20} height={14} fill="#5a1410" /></g>;
        })}
      </g>
      <Figure x={260} y={1580} s={1.6} face={{look: 0.9, fear: 0.3}} outfit={OUTFITS.max} />
      {[0, 1, 2].map((i) => (
        <Box key={i} x={140 + i * 80} y={1590 - Math.floor(i / 2) * 56} />
      ))}
    </Svg>
  );
};

export const CarDepart: React.FC<{t: number}> = ({t}) => {
  const k = P(t, 11.2, 12.53);
  return (
    <Svg>
      <defs>
        <linearGradient id="bsky4" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1a0d12" />
          <stop offset="1" stopColor="#a04e1d" />
        </linearGradient>
      </defs>
      <rect width={W} height={H} fill="url(#bsky4)" />
      {Array.from({length: 8}).map((_, i) => (
        <rect key={i} x={((-40 + i * 170 - k * 300) % 1360 + 1360) % 1360 - 200} y={720 - rnd(i) * 300} width={130} height={880} fill="#201a1e" />
      ))}
      <rect x={0} y={1400} width={W} height={520} fill="#0f0c0e" />
      {Array.from({length: 6}).map((_, i) => (
        <rect key={i} x={((i * 260 - k * 900) % 1560 + 1560) % 1560 - 240} y={1640} width={130} height={10} fill="#8a8a8a" opacity={0.7} />
      ))}
      <Car x={lerp(420, 1320, ease(k))} y={1500} s={1.55} bob={Math.sin(t * 22) * 2} />
      {Array.from({length: 14}).map((_, i) => (
        <circle key={i} cx={lerp(380, 1200, ease(k)) - i * 26 - k * 80} cy={1500 + Math.sin(i) * 10} r={10 + i * 3} fill="#6a5a4a" opacity={0.25 * (1 - i / 14)} />
      ))}
    </Svg>
  );
};

export const Highway: React.FC<{t: number; p: number}> = ({t, p}) => (
  <Svg>
    <defs>
      <linearGradient id="hsky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#0d0a1a" />
        <stop offset="0.7" stopColor="#6a3a2a" />
        <stop offset="1" stopColor="#d17a2c" />
      </linearGradient>
    </defs>
    <rect width={W} height={H} fill="url(#hsky)" />
    <circle cx={820} cy={1060} r={150} fill="#ffb25a" opacity={0.45} />
    <path d={`M-100 1180 L120 1000 L320 1120 L560 960 L800 1100 L1180 1010 L1180 1300 L-100 1300 Z`} fill="#1c1420" transform={`translate(${-p * 80} 0)`} />
    <Trees y={1300} off={-t * 60} n={9} size={220} color="#16121a" gap={200} />
    <rect x={0} y={1300} width={W} height={620} fill="#171216" />
    <Trees y={1380} off={-t * 160} n={8} size={300} color="#0f0b10" gap={260} />
    <rect x={0} y={1520} width={W} height={400} fill="#0c0a0d" />
    {Array.from({length: 7}).map((_, i) => (
      <rect key={i} x={((i * 260 - t * 700) % 1820 + 1820) % 1820 - 260} y={1720} width={150} height={12} fill="#c8c8c0" opacity={0.7} />
    ))}
    <Car x={540} y={1690} s={1.5} bob={Math.sin(t * 20) * 2.2} />
    {Array.from({length: 4}).map((_, i) => (
      <g key={i} transform={`translate(${((i * 420 - t * 520) % 1680 + 1680) % 1680 - 300} 1440)`}>
        <rect x={-6} y={-420} width={12} height={440} fill="#0a080b" />
        <rect x={-70} y={-410} width={140} height={10} fill="#0a080b" />
      </g>
    ))}
  </Svg>
);

// ---------- village and excavation ----------
export const House: React.FC<{x: number; y: number; s?: number; lit?: boolean; smoke?: number}> = ({x, y, s = 1, lit = true, smoke = 0}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-110} y={-130} width={220} height={130} fill="#3b2a1e" />
    {[-70, -30, 10, 50, 90].map((c) => (
      <rect key={c} x={c} y={-130} width={3} height={130} fill="#000" opacity={0.4} />
    ))}
    <path d="M-130 -128 L0 -210 L130 -128 Z" fill="#241811" />
    <rect x={-80} y={-100} width={50} height={46} fill={lit ? '#ffb55a' : '#1a1410'} opacity={0.9} />
    <rect x={20} y={-90} width={40} height={90} fill="#1e140d" />
    <rect x={70} y={-200} width={22} height={50} fill="#2a1c13" />
    {smoke > 0 && [0, 1, 2].map((i) => <circle key={i} cx={81 + Math.sin(smoke * 3 + i) * 10} cy={-215 - i * 34 - ((smoke * 40) % 34)} r={16 + i * 8} fill="#bbb" opacity={0.22 - i * 0.05} />)}
  </g>
);

export const Village: React.FC<{t: number; p: number}> = ({t, p}) => (
  <Svg>
    <defs>
      <linearGradient id="vsky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#0d0a1a" />
        <stop offset="1" stopColor="#c8742c" />
      </linearGradient>
    </defs>
    <g transform={`translate(540 1250) scale(${lerp(1.35, 1.0, p)}) translate(-540 -1250)`}>
      <rect x={-300} y={-300} width={1680} height={2400} fill="url(#vsky)" />
      <path d="M-100 1220 L140 1060 L360 1160 L620 1010 L860 1150 L1180 1050 L1180 1300 L-100 1300 Z" fill="#1c1420" />
      <Trees y={1330} off={0} n={8} size={200} color="#15101a" gap={190} />
      <rect x={-300} y={1330} width={1680} height={800} fill="#2a2018" />
      <House x={170} y={1420} s={1.15} smoke={t} />
      <House x={560} y={1400} s={0.95} smoke={t + 1} />
      <House x={900} y={1430} s={1.1} lit={false} />
      <rect x={-300} y={1560} width={1680} height={14} fill="#3a2e22" />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <rect key={i} x={-20 + i * 190} y={1500} width={8} height={70} fill="#1a120c" />
      ))}
      <Car x={lerp(1300, 500, ease(P(t, 18.2, 19.8)))} y={1760} s={1.2} />
    </g>
  </Svg>
);

export const ExcavatorsMed: React.FC<{t: number}> = ({t}) => (
  <Svg>
    <defs>
      <linearGradient id="esky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#0d0a1a" />
        <stop offset="1" stopColor="#b86a2a" />
      </linearGradient>
    </defs>
    <rect width={W} height={H} fill="url(#esky)" />
    <path d="M-100 1080 L160 900 L380 1010 L640 850 L880 980 L1180 890 L1180 1200 L-100 1200 Z" fill="#1c1420" />
    <rect x={0} y={1200} width={W} height={720} fill="#2c2118" />
    <Excavator x={230} y={1430} s={1.0} a1={-28 + Math.sin(t * 1.4) * 6} a2={50} a3={30} />
    <Excavator x={600} y={1500} s={1.15} a1={-34 + Math.sin(t * 1.2 + 1) * 6} a2={58} a3={36} />
    <Excavator x={930} y={1440} s={1.0} flip a1={-30 + Math.sin(t * 1.3 + 2) * 6} a2={52} a3={32} />
    <Figure x={150} y={1760} s={0.95} face={{look: 0.6, fear: 0.1}} outfit={OUTFITS.neighbor} />
    <Figure x={380} y={1790} s={0.9} face={{look: 0.2, fear: 0.1}} outfit={OUTFITS.neighbor_woman} />
    <Figure x={640} y={1770} s={0.95} face={{look: -0.5, fear: 0.1}} outfit={OUTFITS.old_man} />
    <Figure x={860} y={1800} s={1.0} face={{look: -0.8, fear: 0.2}} outfit={OUTFITS.max} />
    <Figure x={970} y={1780} s={0.85} face={{look: -0.7, fear: 0.1}} outfit={OUTFITS.babushka} />
  </Svg>
);

export const PitTop: React.FC<{t: number; p: number}> = ({t, p}) => {
  const rx = lerp(120, 400, ease(p));
  const ry = lerp(160, 560, ease(p));
  return (
    <Svg>
      <rect width={W} height={H} fill="#3a2d20" />
      {Array.from({length: 60}).map((_, i) => (
        <ellipse key={i} cx={rnd(i) * 1080} cy={rnd(i + 5) * 1920} rx={30 + rnd(i + 2) * 70} ry={8 + rnd(i + 4) * 14} fill="#4a3a29" opacity={0.6} />
      ))}
      {[1.0, 0.82, 0.64, 0.46, 0.28].map((f, i) => (
        <ellipse key={i} cx={540} cy={960} rx={rx * f + 40 * f} ry={ry * f + 40 * f} fill={['#5a4630', '#4a3924', '#392b1b', '#2a1f13', '#160f09'][i]} />
      ))}
      <ellipse cx={540} cy={960} rx={rx * 0.28} ry={ry * 0.28} fill="#0a0603" />
      {[0, 1, 2].map((i) => {
        const a = (i / 3) * Math.PI * 2 + t * 0.35 + p * 2;
        const ex = 540 + Math.cos(a) * (rx + 120);
        const ey = 960 + Math.sin(a) * (ry + 120);
        return (
          <g key={i} transform={`translate(${ex} ${ey}) rotate(${(a * 180) / Math.PI + 180})`}>
            <rect x={-70} y={-48} width={140} height={96} rx={10} fill="#d9a21b" />
            <rect x={-70} y={-60} width={140} height={14} rx={7} fill="#141414" />
            <rect x={-70} y={46} width={140} height={14} rx={7} fill="#141414" />
            <rect x={60} y={-14} width={160 + Math.sin(t * 3 + i) * 24} height={28} rx={10} fill="#b8860f" />
            <rect x={-20} y={-30} width={60} height={60} rx={8} fill="#8fb7d6" opacity={0.6} />
          </g>
        );
      })}
      {Array.from({length: 40}).map((_, i) => (
        <circle key={i} cx={540 + Math.cos(rnd(i) * 6.28 + t) * (rx + rnd(i + 3) * 200)} cy={960 + Math.sin(rnd(i) * 6.28 + t) * (ry + rnd(i + 4) * 200)} r={6 + rnd(i + 2) * 14} fill="#8a735a" opacity={0.18} />
      ))}
    </Svg>
  );
};

export const Concrete: React.FC<{t: number}> = ({t}) => {
  const level = P(t, 28.9, 30.4);
  return (
    <Svg>
      <rect width={W} height={H} fill="#1b1815" />
      {Array.from({length: 9}).map((_, i) => (
        <rect key={i} x={0} y={i * 230} width={W} height={10} fill="#0a0806" />
      ))}
      <rect x={90} y={1000} width={900} height={620} fill="#2a2f35" />
      {Array.from({length: 7}).map((_, i) => (
        <rect key={i} x={120 + i * 130} y={1010} width={9} height={600} fill="#7a8088" />
      ))}
      {Array.from({length: 5}).map((_, i) => (
        <rect key={i} x={110} y={1060 + i * 110} width={860} height={9} fill="#7a8088" />
      ))}
      <rect x={90} y={lerp(1600, 1180, ease(level))} width={900} height={lerp(20, 440, ease(level))} fill="#7c8189" />
      <rect x={90} y={lerp(1600, 1180, ease(level))} width={900} height={12} fill="#a0a6ae" />
      <g transform="translate(760 320) rotate(24)">
        <rect x={-40} y={-30} width={420} height={70} rx={14} fill="#c9a21a" />
        <rect x={380} y={-24} width={50} height={60} fill="#8a6f10" />
      </g>
      <path d={`M${1010} 480 Q${1030} ${900} ${700 + Math.sin(t * 6) * 20} ${lerp(1600, 1180, ease(level))}`} stroke="#8a9098" strokeWidth={90} fill="none" opacity={level > 0.02 ? 0.95 : 0} />
      {Array.from({length: 18}).map((_, i) => (
        <circle key={i} cx={650 + rnd(i) * 240} cy={((t * 600 * (0.5 + rnd(i + 1)) + rnd(i) * 900) % 900) + 500} r={6 + rnd(i + 3) * 8} fill="#9aa0a8" opacity={0.7} />
      ))}
    </Svg>
  );
};

// ---------- the underground world (build, water, vents, generators, rooms) ----------
export type UG = {walls: number; parts: number; water: number; pipes: number; pump: number; filters: number; tank: number; vent: number; gen: number; lamps: number; rooms: [number, number, number, number]};
export const Underground: React.FC<{t: number; keys: Key[]; ug: UG}> = ({t, keys, ug}) => {
  const c = cam(t, keys);
  const room = (x: number, i: number, children: React.ReactNode) => (
    <g opacity={ug.rooms[i]} transform={`translate(0 ${(1 - ug.rooms[i]) * 40})`}>
      <rect x={x + 10} y={640} width={210} height={620} fill="#171b21" />
      {children}
      <rect x={x + 10} y={1240} width={210} height={20} fill="#0d0f12" />
      <ellipse cx={x + 115} cy={680} rx={90} ry={50} fill="#ffcf7a" opacity={0.0 + 0.5 * ug.lamps * ug.rooms[i]} />
      <rect x={x + 100} y={640} width={30} height={14} fill={ug.lamps > 0.5 ? '#ffe9a8' : '#555'} />
    </g>
  );
  return (
    <Svg>
      <defs>
        <linearGradient id="soil" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#4a3622" />
          <stop offset="0.5" stopColor="#35261a" />
          <stop offset="1" stopColor="#1f160f" />
        </linearGradient>
        <linearGradient id="wat" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#1f6fb5" />
          <stop offset="1" stopColor="#3aa0e0" />
        </linearGradient>
      </defs>
      <g transform={`translate(540 960) scale(${c.s}) translate(${-c.cx} ${-c.cy})`}>
        <rect x={-600} y={-600} width={2280} height={900} fill="#10111c" />
        <House x={170} y={296} s={0.8} />
        <House x={700} y={296} s={0.7} lit={false} />
        <rect x={-600} y={300} width={2280} height={2600} fill="url(#soil)" />
        <rect x={-600} y={296} width={2280} height={10} fill="#5a8a3a" opacity={0.7} />
        {Array.from({length: 70}).map((_, i) => (
          <circle key={i} cx={rnd(i) * 1080} cy={330 + rnd(i + 9) * 2300} r={3 + rnd(i + 5) * 8} fill="#241a12" opacity={0.7} />
        ))}
        {/* ventilation shafts + fans + filters */}
        {[200, 880].map((x, i) => (
          <g key={x} opacity={ug.vent}>
            <rect x={x - 22} y={310} width={44} height={330} fill="#5a6068" />
            <rect x={x - 60} y={520} width={120} height={70} rx={8} fill="#3d4349" stroke="#7a8088" strokeWidth={4} />
            {[0, 1, 2, 3].map((k) => (
              <rect key={k} x={x - 50 + k * 28} y={528} width={12} height={54} fill="#232830" />
            ))}
            <g transform={`translate(${x} 330)`}>
              <circle r={44} fill="#2a2f35" stroke="#7a8088" strokeWidth={4} />
              <g transform={`rotate(${t * 720 * (i ? -1 : 1)})`}>
                {[0, 120, 240].map((a) => (
                  <rect key={a} x={-6} y={-40} width={12} height={40} fill="#aab2ba" transform={`rotate(${a})`} />
                ))}
              </g>
            </g>
          </g>
        ))}
        {/* the bunker box */}
        <rect x={80} y={600} width={Math.max(1, 920 * ug.walls)} height={700} fill="#0c0e12" stroke="#5b6168" strokeWidth={26} />
        <rect x={80} y={600} width={Math.max(1, 920 * ug.walls)} height={26} fill="#7a8088" />
        {[330, 560, 790].map((x, i) => (
          <rect key={x} x={x - 8} y={620} width={16} height={Math.max(0.01, 660 * clamp(ug.parts * 3 - i))} fill="#5b6168" />
        ))}
        {room(100, 0, (
          <g>
            {[0, 1].map((k) => (
              <g key={k} transform={`translate(${130} ${1020 - k * 150})`}>
                <rect x={-30} y={0} width={150} height={16} fill="#8a6a44" />
                <rect x={-30} y={-26} width={150} height={26} fill="#3a4f7a" />
                <rect x={-30} y={-34} width={36} height={14} rx={6} fill="#dcdcdc" />
              </g>
            ))}
            <rect x={128} y={1226} width={150} height={16} fill="#8a6a44" />
          </g>
        ))}
        {room(330, 1, (
          <g>
            <rect x={370} y={1080} width={140} height={150} fill="#3b4048" />
            <rect x={380} y={1100} width={120} height={60} fill="#1d2025" />
            <circle cx={410} cy={1090} r={14} fill="#c8c8c8" />
            <rect x={360} y={920} width={180} height={12} fill="#6a5a44" />
            <rect x={380} y={880} width={34} height={40} fill="#b0623a" />
            <rect x={430} y={886} width={30} height={34} fill="#d8d0c0" />
          </g>
        ))}
        {room(560, 2, (
          <g>
            {[0, 1, 2].map((k) => (
              <g key={k}>
                <rect x={590} y={800 + k * 140} width={150} height={10} fill="#6a5a44" />
                {[0, 1, 2].map((q) => (
                  <rect key={q} x={596 + q * 48} y={760 + k * 140} width={40} height={40} fill={['#b08a52', '#7a8a52', '#a0522d'][(k + q) % 3]} />
                ))}
              </g>
            ))}
          </g>
        ))}
        {room(790, 3, (
          <g>
            <rect x={820} y={1130} width={140} height={22} fill="#dfe6ea" />
            <rect x={820} y={1152} width={140} height={78} fill="#546068" />
            <rect x={868} y={800} width={44} height={44} fill="#e0261b" />
            <rect x={880} y={790} width={20} height={64} fill="#fff" />
            <rect x={858} y={812} width={64} height={20} fill="#fff" />
            <rect x={830} y={900} width={120} height={150} fill="#c8d0d4" opacity={0.85} />
          </g>
        ))}
        {/* mechanical room: generator + cables */}
        <g opacity={clamp(ug.gen * 4)}>
          <rect x={90} y={1340} width={340} height={300} fill="#0c0e12" stroke="#5b6168" strokeWidth={18} />
          <rect x={150} y={1450} width={220} height={130} rx={10} fill="#c0392b" />
          <rect x={170} y={1424} width={70} height={30} fill="#3a3f46" />
          <g transform="translate(330 1515)">
            <circle r={36} fill="#2a2f35" />
            <g transform={`rotate(${ug.gen > 0.2 ? t * 900 : 0})`}>
              {[0, 90].map((a) => (
                <rect key={a} x={-4} y={-30} width={8} height={60} fill="#9aa2aa" transform={`rotate(${a})`} />
              ))}
            </g>
          </g>
          <rect x={150} y={1590} width={220} height={12} fill="#232830" />
          {ug.gen > 0.2 && <circle cx={260} cy={1500} r={110 + Math.sin(t * 30) * 4} fill="#ffcf7a" opacity={0.12} />}
          <path d="M260 1340 L260 1300 M215 1300 L215 1260 M445 1300 L445 1260 M675 1300 L675 1260 M895 1300 L895 1260" stroke="#c2a23a" strokeWidth={6} opacity={ug.lamps} />
          <rect x={230} y={1300} width={680} height={6} fill="#c2a23a" opacity={ug.lamps} />
        </g>
        {/* aquifer */}
        <rect x={-600} y={1900} width={2280} height={220} fill="url(#wat)" opacity={0.55 + 0.4 * ug.water} />
        {Array.from({length: 24}).map((_, i) => (
          <rect key={i} x={((i * 120 + t * 90) % 1400) - 150} y={1930 + (i % 4) * 44} width={70} height={5} fill="#cfeaff" opacity={0.5} />
        ))}
        {/* pipes, pump, filters, tank */}
        <g>
          <rect x={604} y={Math.max(1660, 1900 - 240 * ug.pipes)} width={22} height={Math.min(240, 240 * ug.pipes)} fill="#7c8791" />
          <g opacity={ug.pump}>
            <rect x={560} y={1760} width={110} height={80} rx={10} fill="#3d4a55" stroke="#8a97a3" strokeWidth={4} />
            <g transform="translate(615 1800)">
              <g transform={`rotate(${t * 520 * ug.pump})`}>
                {[0, 90, 180, 270].map((a) => (
                  <rect key={a} x={-4} y={-26} width={8} height={26} fill="#cfd8de" transform={`rotate(${a})`} />
                ))}
              </g>
            </g>
          </g>
          <g opacity={ug.filters}>
            {[0, 1, 2].map((k) => (
              <rect key={k} x={470 + k * 62} y={1580} width={46} height={110} rx={14} fill="#46606d" stroke="#8fb0c0" strokeWidth={3} />
            ))}
            <rect x={470} y={1650} width={170} height={10} fill="#7c8791" />
          </g>
          <g opacity={ug.tank}>
            <rect x={690} y={1420} width={250} height={250} rx={26} fill="#2a343c" stroke="#7c8791" strokeWidth={6} />
            <rect x={700} y={lerp(1660, 1440, ease(ug.tank))} width={230} height={lerp(8, 220, ease(ug.tank))} fill="#2f8fd0" opacity={0.85} />
            <rect x={620} y={1620} width={74} height={12} fill="#7c8791" />
          </g>
          {ug.pipes > 0.5 &&
            Array.from({length: 7}).map((_, i) => (
              <circle key={i} cx={615} cy={1900 - ((t * 140 + i * 36) % 240)} r={5} fill="#7fd0ff" opacity={0.85 * ug.pump} />
            ))}
        </g>
      </g>
    </Svg>
  );
};

export const TapGlass: React.FC<{t: number}> = ({t}) => {
  const fill = P(t, 59.9, 61.2);
  return (
    <Svg>
      <rect width={W} height={H} fill="#141920" />
      <rect x={0} y={1280} width={W} height={640} fill="#2a2f36" />
      <rect x={0} y={1280} width={W} height={14} fill="#4a525b" />
      <path d="M420 120 L420 560 Q420 640 500 640 L700 640 L700 700 L760 700 L760 600 Q760 560 700 560 L520 560 L520 120 Z" fill="#aab4bc" stroke="#6a747c" strokeWidth={6} />
      <rect x={700} y={700} width={60} height={30} fill="#8a949c" />
      <rect x={722} y={730} width={18} height={lerp(0, 440, ease(P(t, 59.6, 59.9)))} fill="#5fb6f0" opacity={t < 61.3 ? 0.9 : 0} />
      <path d="M640 1040 L850 1040 L825 1280 L665 1280 Z" fill="#cfe4f2" opacity={0.28} />
      <path d={`M${650 + (1 - fill) * 6} ${1280 - 230 * ease(fill)} L${840 - (1 - fill) * 6} ${1280 - 230 * ease(fill)} L825 1280 L665 1280 Z`} fill="#3fa0e0" opacity={0.75} />
      {Array.from({length: 10}).map((_, i) => (
        <circle key={i} cx={700 + rnd(i) * 80} cy={1280 - ((t * 120 + i * 40) % 220)} r={4 + rnd(i + 1) * 4} fill="#cfeaff" opacity={0.4 * fill} />
      ))}
    </Svg>
  );
};

// ---------- trucks, crates, warehouse ----------
export const TrucksArrive: React.FC<{t: number}> = ({t}) => {
  const k = P(t, 42.44, 44.8);
  return (
    <Svg>
      <defs>
        <linearGradient id="tsky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0d0a1a" />
          <stop offset="1" stopColor="#c8742c" />
        </linearGradient>
      </defs>
      <rect width={W} height={H} fill="url(#tsky)" />
      <path d="M-100 1100 L140 940 L360 1040 L620 900 L860 1010 L1180 930 L1180 1250 L-100 1250 Z" fill="#1c1420" />
      <Trees y={1280} off={-t * 30} n={9} size={210} color="#15101a" gap={200} />
      <rect x={0} y={1280} width={W} height={640} fill="#2a2018" />
      <rect x={0} y={1600} width={W} height={220} fill="#1a1410" />
      <Truck x={lerp(1350, 640, ease(k))} y={1520} s={1.35} color="#c0392b" />
      <Truck x={lerp(1650, 880, ease(P(t, 42.6, 44.9)))} y={1650} s={1.15} color="#2c6aa0" />
      <Truck x={lerp(2000, 1100, ease(P(t, 42.8, 45.1)))} y={1760} s={1.0} color="#3a8a4a" />
      {Array.from({length: 16}).map((_, i) => (
        <circle key={i} cx={lerp(1500, 600, ease(k)) + i * 40} cy={1600 + Math.sin(i + t * 4) * 12} r={16 + i * 2} fill="#7a6a58" opacity={0.2 * (1 - i / 16)} />
      ))}
    </Svg>
  );
};

export const Crates: React.FC<{t: number}> = ({t}) => {
  const k = P(t, 44.8, 47.0);
  const stack = (x: number, y: number, n: number, kind: number) =>
    Array.from({length: n}).map((_, i) => {
      const vis = clamp(k * 14 - (kind * 4 + i) * 0.7);
      const col = Math.floor(i / 2);
      const row = i % 2;
      const px = x + col * 170;
      const py = y - row * 120 + (1 - vis) * -200;
      if (vis <= 0) return null;
      if (kind === 0)
        return (
          <g key={`${kind}${i}`} opacity={vis}>
            <rect x={px - 60} y={py - 110} width={120} height={110} fill="#b08a52" stroke="#5a431f" strokeWidth={4} />
            {[0, 1, 2].map((q) => (
              <g key={q}>
                <rect x={px - 48 + q * 34} y={py - 94} width={26} height={70} rx={5} fill="#c0392b" />
                <rect x={px - 48 + q * 34} y={py - 70} width={26} height={14} fill="#f2e6c8" />
              </g>
            ))}
          </g>
        );
      if (kind === 1)
        return (
          <g key={`${kind}${i}`} opacity={vis}>
            <path d={`M${px - 64} ${py} Q${px - 74} ${py - 70} ${px - 50} ${py - 120} L${px + 50} ${py - 120} Q${px + 74} ${py - 70} ${px + 64} ${py} Z`} fill="#d8c8a0" stroke="#7a6a44" strokeWidth={4} />
            <text x={px} y={py - 50} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={26} fill="#7a4a1a">КРУПА</text>
          </g>
        );
      return (
        <g key={`${kind}${i}`} opacity={vis}>
          <rect x={px - 64} y={py - 100} width={128} height={100} fill="#e0b04a" stroke="#8a6a1a" strokeWidth={4} />
          <rect x={px - 50} y={py - 74} width={100} height={30} fill="#c0392b" />
          <text x={px} y={py - 52} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={20} fill="#fff">МАКАРОНЫ</text>
        </g>
      );
    });
  return (
    <Svg>
      <rect width={W} height={H} fill="#1a1612" />
      <rect x={0} y={1500} width={W} height={420} fill="#2a2218" />
      {Array.from({length: 8}).map((_, i) => (
        <rect key={i} x={0} y={1500 + i * 54} width={W} height={4} fill="#0e0a07" opacity={0.6} />
      ))}
      <g transform={`translate(0 ${-Math.sin(t * 8) * 1.5})`}>
        {stack(190, 700, 4, 0)}
        {stack(190, 1100, 4, 1)}
        {stack(190, 1500, 4, 2)}
      </g>
    </Svg>
  );
};

export const Warehouse: React.FC<{t: number; p: number}> = ({t, p}) => (
  <Svg>
    <rect width={W} height={H} fill="#12151a" />
    <rect x={0} y={1500} width={W} height={420} fill="#20252b" />
    <path d="M0 1500 L540 900 L1080 1500 Z" fill="#171b21" />
    {[0, 1, 2].map((row) => (
      <g key={row} transform={`translate(0 ${row * 0})`}>
        {[0, 1].map((side) => {
          const x0 = side ? 690 : 40;
          return (
            <g key={side}>
              <rect x={x0} y={460} width={350} height={1050} fill="#1a1f26" stroke="#59616b" strokeWidth={8} />
              {[0, 1, 2, 3, 4].map((lv) => (
                <g key={lv}>
                  <rect x={x0} y={560 + lv * 190} width={350} height={12} fill="#7a8088" />
                  {[0, 1, 2].map((q) => {
                    const vis = clamp(p * 18 - (side * 15 + lv * 3 + q) * 0.55);
                    return vis > 0 ? <rect key={q} x={x0 + 18 + q * 108} y={560 + lv * 190 - 96} width={96} height={96} fill={['#b08a52', '#7a8a52', '#a0522d', '#c0392b'][(lv + q + side) % 4]} opacity={vis} /> : null;
                  })}
                </g>
              ))}
            </g>
          );
        })}
      </g>
    ))}
    <rect x={430} y={1160} width={220} height={340} fill="#0a0c10" opacity={0.7} />
    <ellipse cx={540} cy={560} rx={420} ry={90} fill="#ffe0a0" opacity={0.08 + 0.02 * Math.sin(t * 7)} />
  </Svg>
);

// ---------- Max at the pit, notebook, big numbers ----------
export const MaxPit: React.FC<{t: number}> = ({t}) => (
  <Svg>
    <defs>
      <linearGradient id="msky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#0d0a1a" />
        <stop offset="1" stopColor="#a8532a" />
      </linearGradient>
    </defs>
    <rect width={W} height={H} fill="url(#msky)" />
    <path d="M-100 1000 L150 840 L380 940 L640 790 L880 920 L1180 840 L1180 1150 L-100 1150 Z" fill="#1c1420" />
    <rect x={0} y={1150} width={W} height={770} fill="#2c2118" />
    <ellipse cx={780} cy={1500} rx={460} ry={170} fill="#0b0705" />
    <ellipse cx={780} cy={1500} rx={460} ry={170} fill="none" stroke="#5a4630" strokeWidth={14} />
    <Excavator x={900} y={1370} s={0.9} flip a1={-30 + Math.sin(t) * 5} a2={55} a3={34} />
    <Figure x={260} y={1760} s={1.5} face={{look: 0.8, fear: 0.2 + 0.25 * Math.sin(t * 0.8)}} outfit={OUTFITS.max} />
    <rect x={350} y={1450} width={80} height={106} rx={6} fill="#e8e0c8" stroke="#3a3020" strokeWidth={4} transform="rotate(-12 390 1500)" />
  </Svg>
);

export const Notebook: React.FC<{t: number}> = ({t}) => {
  const lines = ['50 человек', '× 3 года', '× 365 дней', '≈ 40 т еды'];
  return (
    <Svg>
      <rect width={W} height={H} fill="#16130f" />
      <g transform="translate(540 960) rotate(-4) scale(1.05) translate(-540 -960)">
        <rect x={110} y={330} width={860} height={1260} rx={14} fill="#efe6cc" stroke="#9a8a62" strokeWidth={6} />
        {Array.from({length: 14}).map((_, i) => (
          <rect key={i} x={140} y={420 + i * 84} width={800} height={3} fill="#9ab0c4" opacity={0.7} />
        ))}
        <rect x={190} y={330} width={4} height={1260} fill="#c0392b" opacity={0.6} />
        {lines.map((l, i) => {
          const k = clamp((t - (37.4 + i * 0.7)) / 0.5);
          return (
            <text key={i} x={230} y={560 + i * 170} fontFamily={FONT} fontWeight={700} fontSize={92} fill="#243a5e" opacity={k} transform={`rotate(${(i % 2 ? 1 : -1) * 0.8} 230 ${560 + i * 170})`}>
              {l}
            </text>
          );
        })}
        <path d="M230 1170 L900 1170" stroke="#243a5e" strokeWidth={8} opacity={clamp((t - 39.4) / 0.4)} />
      </g>
    </Svg>
  );
};

export const BigText: React.FC<{t: number; text: string; t0: number}> = ({t, text, t0}) => {
  const k = ease(clamp((t - t0) / 0.35));
  return (
    <Svg>
      <rect width={W} height={H} fill="#0a0806" />
      <text x={540} y={1010} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={lerp(130, 190, k)} fill="#f2c230" opacity={k}>{text}</text>
      <rect x={140} y={1090} width={800} height={10} fill="#f2c230" opacity={k * 0.6} />
    </Svg>
  );
};

// ---------- surface at dusk, Max exits, phone ----------
export const SurfaceDusk: React.FC<{t: number; p: number}> = ({t, p}) => (
  <Svg>
    <defs>
      <linearGradient id="dsky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#05060f" />
        <stop offset="1" stopColor="#3a2a4a" />
      </linearGradient>
    </defs>
    <g transform={`translate(540 1300) scale(${lerp(1.0, 1.15, p)}) translate(-540 -1300)`}>
      <rect x={-300} y={-300} width={1680} height={2400} fill="url(#dsky)" />
      {Array.from({length: 40}).map((_, i) => (
        <circle key={i} cx={rnd(i) * 1080} cy={rnd(i + 1) * 800} r={1.3} fill="#fff" opacity={0.3 + 0.3 * Math.abs(Math.sin(t + i))} />
      ))}
      <path d="M-100 1220 L140 1060 L360 1160 L620 1010 L860 1150 L1180 1050 L1180 1300 L-100 1300 Z" fill="#0f0c18" />
      <rect x={-300} y={1330} width={1680} height={800} fill="#1a1612" />
      <House x={170} y={1420} s={1.1} smoke={t} />
      <House x={900} y={1430} s={1.05} />
      <g transform="translate(540 1480)">
        <rect x={-150} y={-110} width={300} height={110} fill="#2a2f36" stroke="#59616b" strokeWidth={6} />
        <rect x={-70} y={-80} width={140} height={80} fill="#05070a" />
        <rect x={-110} y={-140} width={220} height={30} fill="#3a4048" />
        <path d="M-110 -140 L0 -190 L110 -140 Z" fill="#232830" />
      </g>
      <Figure x={330} y={1700} s={0.8} outfit={OUTFITS.neighbor} />
      <Figure x={760} y={1720} s={0.78} outfit={OUTFITS.old_man} />
      <rect x={-300} y={-300} width={1680} height={2400} fill="#06070f" opacity={0.25 * p} />
    </g>
  </Svg>
);

export const MaxExit: React.FC<{t: number}> = ({t}) => {
  const k = ease(P(t, 79.0, 80.6));
  return (
    <Svg>
      <defs>
        <linearGradient id="xsky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#04050c" />
          <stop offset="1" stopColor="#2a2038" />
        </linearGradient>
      </defs>
      <rect width={W} height={H} fill="url(#xsky)" />
      {Array.from({length: 50}).map((_, i) => (
        <circle key={i} cx={rnd(i) * 1080} cy={rnd(i + 1) * 900} r={1.4} fill="#fff" opacity={0.35} />
      ))}
      <rect x={0} y={1180} width={W} height={740} fill="#15120f" />
      <rect x={300} y={1180} width={480} height={50} fill="#2a2f36" />
      <rect x={340} y={1230} width={400} height={700} fill="#04060a" />
      <g transform={`translate(0 ${lerp(300, 0, k)})`}>
        <Figure x={540} y={1720} s={1.6} face={{look: 0, fear: 0.35}} outfit={OUTFITS.max} />
      </g>
      <rect x={300} y={1180} width={480} height={50} fill="#2a2f36" />
      <ellipse cx={540} cy={1260} rx={260} ry={60} fill="#ffcf7a" opacity={0.12} />
    </Svg>
  );
};

export const Phone: React.FC<{t: number}> = ({t}) => {
  const n1 = ease(P(t, 82.0, 82.35));
  const a1 = ease(P(t, 83.45, 83.8));
  const a2 = ease(P(t, 88.3, 88.65));
  const zoom = 1 + 0.4 * P(t, 80.9, 88.2);
  const cy = 1080;
  const fin = ease(P(t, 90.0, 90.45));
  const flash = t > 83.45 && t < 83.85 ? 0.35 * (1 - (t - 83.45) / 0.4) : 0;
  return (
    <Svg>
      <rect width={W} height={H} fill="#0a0b0f" />
      <g transform={`translate(540 ${cy}) scale(${zoom}) translate(-540 -1080)`}>
        <rect x={200} y={320} width={680} height={1300} rx={80} fill="#0e0f12" stroke="#2a2d33" strokeWidth={10} />
        <rect x={226} y={346} width={628} height={1248} rx={58} fill="#06080c" />
        <text x={540} y={560} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={140} fill="#e8edf3">20:47</text>
        <text x={540} y={625} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={32} fill="#8b95a3">Суббота, 8 ноября</text>
        <g opacity={n1} transform={`translate(0 ${(1 - n1) * -40})`}>
          <rect x={256} y={720} width={568} height={150} rx={30} fill="#1c2128" />
          <circle cx={316} cy={795} r={26} fill="#f2c230" />
          <text x={300} y={808} fontFamily={FONT} fontWeight={700} fontSize={36} fill="#111">!</text>
          <text x={364} y={780} fontFamily={FONT} fontWeight={700} fontSize={26} fill="#8b95a3">СРОЧНОЕ СООБЩЕНИЕ</text>
          <text x={364} y={826} fontFamily={FONT} fontWeight={700} fontSize={32} fill="#e8edf3">Новости</text>
        </g>
        <g opacity={a1} transform={`translate(0 ${(1 - a1) * -40})`}>
          <rect x={256} y={900} width={568} height={210} rx={30} fill="#3a0f0d" stroke="#e0261b" strokeWidth={5} />
          <text x={540} y={990} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={44} fill="#ff4a3d">ПЕРВЫЕ СЛУЧАИ</text>
          <text x={540} y={1050} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={44} fill="#ff4a3d">ЗАРАЖЕНИЯ</text>
        </g>
        <g opacity={a2} transform={`translate(0 ${(1 - a2) * -40})`}>
          <rect x={256} y={1140} width={568} height={300} rx={30} fill="#4a0e0b" stroke="#ff2a1a" strokeWidth={6} />
          <text x={540} y={1224} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={42} fill="#ff3b2e">ЗАРАЖЕНИЕ</text>
          <text x={540} y={1290} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={40} fill="#ff3b2e">РАСПРОСТРАНЯЕТСЯ</text>
          <text x={540} y={1356} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={42} fill="#ff3b2e">БЫСТРЕЕ</text>
          <text x={540} y={1422} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={42} fill="#ff3b2e">ПРОГНОЗА</text>
        </g>
        <rect x={226} y={346} width={628} height={1248} rx={58} fill="#ff2a1a" opacity={flash} />
      </g>
      <g opacity={fin}>
        <rect width={W} height={H} fill="#3a0a08" />
        {['ЗАРАЖЕНИЕ', 'РАСПРОСТРАНЯЕТСЯ', 'БЫСТРЕЕ', 'ПРОГНОЗА'].map((l, i) => (
          <text key={l} x={540} y={720 + i * 150} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={i === 1 ? 80 : 132} fill="#ff3b2e">{l}</text>
        ))}
      </g>
      {/* Max's hand holding the phone */}
      <g opacity={(1 - fin) * (1 - ease(P(t, 88.2, 88.9)))}>
        <rect x={180} y={1560} width={720} height={420} fill="#2f5fa8" />
        <path d="M200 1640 Q150 1500 230 1380 L300 1400 Q250 1500 300 1600 Z" fill="#d9a98a" />
        <path d="M880 1640 Q930 1500 850 1380 L780 1400 Q830 1500 780 1600 Z" fill="#d9a98a" />
      </g>
    </Svg>
  );
};
