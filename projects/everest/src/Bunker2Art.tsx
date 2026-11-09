import React from 'react';
import {Figure} from './Everest';
import {OUTFITS} from './Characters';
import {FONT, House, P, Svg, Trees} from './BunkerArt';
import {clamp, ease, lerp, rnd} from './util';

const W = 1080;
const H = 1920;

const Dusk: React.FC<{dark?: number}> = ({dark = 0}) => (
  <g>
    <defs>
      <linearGradient id="d2sky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#05060f" />
        <stop offset="0.7" stopColor="#3a2540" />
        <stop offset="1" stopColor="#a8532a" />
      </linearGradient>
    </defs>
    <rect x={-400} y={-400} width={1880} height={2800} fill="url(#d2sky)" />
    <path d="M-100 1130 L140 970 L360 1070 L620 930 L860 1060 L1180 960 L1180 1260 L-100 1260 Z" fill="#150f1e" />
    <rect x={-400} y={1330} width={1880} height={800} fill="#1a1612" />
    <rect x={-400} y={-400} width={1880} height={2800} fill="#02030a" opacity={dark} />
  </g>
);

const Entrance: React.FC<{x: number; y: number; s?: number; lamp?: boolean}> = ({x, y, s = 1, lamp = true}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-170} y={-120} width={340} height={120} fill="#2a2f36" stroke="#59616b" strokeWidth={6} />
    <rect x={-80} y={-92} width={160} height={92} fill="#04060a" />
    <rect x={-124} y={-152} width={248} height={34} fill="#3a4048" />
    <path d="M-124 -152 L0 -210 L124 -152 Z" fill="#232830" />
    <circle cx={0} cy={-130} r={9} fill={lamp ? '#ffd27a' : '#2a2a2a'} />
    {lamp && <ellipse cx={0} cy={-60} rx={170} ry={90} fill="#ffcf7a" opacity={0.12} />}
  </g>
);

// ---------- phone ----------
export const Phone2: React.FC<{t: number; t0: number; mode: 'warn' | 'nosig'}> = ({t, t0, mode}) => {
  const k = t - t0;
  const zoom = mode === 'warn' ? 1 + 1.15 * ease(clamp(k / 0.8)) + 0.04 * k : 1.5 + 0.03 * k;
  const card = ease(clamp((k - 0.5) / 0.35));
  const flash = mode === 'warn' && t > 3.45 && t < 3.95 ? 0.45 * (1 - (t - 3.45) / 0.5) : 0;
  const blink = Math.floor(t * 3) % 2 === 0;
  return (
    <Svg>
      <rect width={W} height={H} fill="#0a0b0f" />
      <g transform={`translate(540 1000) scale(${zoom}) translate(-540 -1080)`}>
        <rect x={200} y={320} width={680} height={1300} rx={80} fill="#0e0f12" stroke="#2a2d33" strokeWidth={10} />
        <rect x={226} y={346} width={628} height={1248} rx={58} fill="#06080c" />
        <text x={540} y={560} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={140} fill="#e8edf3">{mode === 'warn' ? '19:12' : '19:41'}</text>
        <text x={540} y={625} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={32} fill="#8b95a3">Воскресенье, 9 ноября</text>
        {mode === 'warn' ? (
          <g opacity={card} transform={`translate(0 ${(1 - card) * -40})`}>
            <rect x={256} y={760} width={568} height={340} rx={30} fill="#3a0f0d" stroke="#e0261b" strokeWidth={6} />
            <text x={540} y={830} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={32} fill="#ffb4ab">ПРЕДУПРЕЖДЕНИЕ</text>
            <text x={540} y={910} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={42} fill="#ff4a3d">ЗАРАЖЕНИЕ</text>
            <text x={540} y={966} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={36} fill="#ff4a3d">РАСПРОСТРАНЯЕТСЯ</text>
            <text x={540} y={1022} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={42} fill="#ff4a3d">БЫСТРЕЕ ПРОГНОЗА</text>
          </g>
        ) : (
          <g>
            <g transform="translate(540 860)">
              {[0, 1, 2, 3].map((i) => (
                <rect key={i} x={-90 + i * 48} y={-20 - i * 22} width={30} height={20 + i * 22} fill={i === 0 && false ? '#fff' : '#3a3f46'} />
              ))}
              <line x1={-110} y1={30} x2={110} y2={-110} stroke="#e0261b" strokeWidth={14} strokeLinecap="round" />
            </g>
            <text x={540} y={1060} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={110} fill={blink || k < 0.4 ? '#ff4a3d' : '#a8322a'}>НЕТ СЕТИ</text>
          </g>
        )}
        <rect x={226} y={346} width={628} height={1248} rx={58} fill="#ff2a1a" opacity={flash} />
      </g>
      <g>
        <path d="M200 1700 Q150 1560 230 1440 L300 1460 Q250 1560 300 1660 Z" fill="#d9a98a" />
        <path d="M880 1700 Q930 1560 850 1440 L780 1460 Q830 1560 780 1660 Z" fill="#d9a98a" />
        <rect x={180} y={1620} width={720} height={420} fill="#2f5fa8" />
      </g>
    </Svg>
  );
};

// ---------- village at dusk ----------
export const VillageRun: React.FC<{t: number; a: number; b: number}> = ({t, a, b}) => {
  const k = P(t, a, b);
  const x = lerp(-120, 700, k);
  const pan = lerp(0, -120, k);
  return (
    <Svg>
      <g transform={`translate(${pan} 0)`}>
        <Dusk />
        <Trees y={1330} off={-t * 20} n={9} size={210} color="#120d19" gap={200} />
        <House x={150} y={1450} s={1.15} smoke={t} />
        <House x={470} y={1420} s={0.9} />
        <House x={900} y={1460} s={1.1} />
        <Entrance x={1130} y={1500} s={1.1} />
        <rect x={-400} y={1590} width={1880} height={14} fill="#3a2e22" />
        <g transform={`translate(0 ${-Math.abs(Math.sin(t * 13)) * 16})`}>
          <Figure x={x} y={1760} s={1.4} face={{look: 0.9, fear: 0.6}} outfit={OUTFITS.max} />
        </g>
      </g>
    </Svg>
  );
};

export const Gathering: React.FC<{t: number; shout: boolean}> = ({t, shout}) => (
  <Svg>
    <Dusk />
    <Trees y={1330} off={0} n={9} size={210} color="#120d19" gap={200} />
    <House x={170} y={1440} s={1.1} smoke={t} />
    <Entrance x={880} y={1500} s={1.1} />
    <rect x={-400} y={1590} width={1880} height={14} fill="#3a2e22" />
    {[
      {x: 120, y: 1810, o: OUTFITS.neighbor, l: 0.6},
      {x: 330, y: 1840, o: OUTFITS.neighbor_woman, l: 0.3},
      {x: 560, y: 1820, o: OUTFITS.old_man, l: -0.3},
      {x: 880, y: 1830, o: OUTFITS.uncle_vitya, l: -0.6},
    ].map((f, i) => (
      <g key={i}>
        <Figure x={f.x} y={f.y} s={1.0} face={{look: f.l, fear: shout ? 0.7 : 0.3}} outfit={f.o} />
        {shout && <rect x={f.x + 50} y={f.y - 70 + Math.sin(t * 9 + i) * 3} width={50} height={64} rx={10} fill="#6a5a3a" stroke="#2a2010" strokeWidth={3} />}
      </g>
    ))}
    <Figure x={600} y={1860} s={1.5} face={{look: -0.4, fear: shout ? 0.85 : 0.5}} outfit={OUTFITS.max} />
  </Svg>
);

export const VillageNight: React.FC<{t: number}> = ({t}) => {
  const off1 = t > 17.4;
  const off2 = t > 18.0;
  const off3 = t > 18.6;
  const offLamp = t > 19.0;
  const dark = 0.15 + 0.45 * clamp((t - 17.2) / 2.0);
  const sk = t > 17.3 && t < 17.7 ? 10 * Math.sin(t * 90) * (1 - (t - 17.3) / 0.4) : 0;
  return (
    <Svg>
      <g transform={`translate(${sk} 0)`}>
        <Dusk dark={dark} />
        <Trees y={1330} off={0} n={9} size={210} color="#0d0a14" gap={200} />
        <House x={150} y={1450} s={1.15} lit={!off1} />
        <House x={470} y={1420} s={0.9} lit={!off2} />
        <House x={900} y={1460} s={1.1} lit={!off3} />
        <Entrance x={1130} y={1500} s={1.1} lamp={!offLamp} />
        <rect x={-400} y={1590} width={1880} height={14} fill="#2a2018" />
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <circle key={i} cx={100 + i * 190} cy={1250 - (i % 2) * 60} r={3} fill="#ffcf7a" opacity={(i < 2 ? !off1 : i < 4 ? !off2 : !off3) ? 0.9 : 0} />
        ))}
      </g>
    </Svg>
  );
};

// ---------- cloud ----------
const CloudMass: React.FC<{cx: number; cy: number; s: number; t: number; shade?: number}> = ({cx, cy, s, t, shade = 0}) => (
  <g>
    {Array.from({length: 26}).map((_, i) => {
      const a = rnd(i) * Math.PI * 2;
      const d = rnd(i + 5) * 380 * s;
      const r = (110 + rnd(i + 9) * 150) * s;
      const g = Math.floor(78 + rnd(i + 2) * 40 - shade * 30);
      return <circle key={i} cx={cx + Math.cos(a + t * 0.05) * d} cy={cy + Math.sin(a) * d * 0.45 + Math.sin(t * 0.4 + i) * 8} r={r} fill={`rgb(${g},${g + 4},${g + 8})`} opacity={0.82} />;
    })}
  </g>
);

export const CloudForest: React.FC<{t: number; a: number; b: number; p0: number; p1: number}> = ({t, a, b, p0, p1}) => {
  const p = lerp(p0, p1, P(t, a, b));
  return (
    <Svg>
      <g transform={`translate(540 1000) scale(${1 + 0.1 * P(t, a, b)}) translate(-540 -1000)`}>
        <rect x={-300} y={-300} width={1680} height={2400} fill="#241c2e" />
        <rect x={-300} y={-300} width={1680} height={1100} fill="#4a3a52" opacity={0.7} />
        <CloudMass cx={540} cy={lerp(860, 1020, p)} s={lerp(0.9, 2.0, p)} t={t} />
        <path d="M-100 1160 L140 1000 L360 1100 L620 960 L860 1090 L1180 990 L1180 1300 L-100 1300 Z" fill="#150f1e" />
        <Trees y={1360} off={-t * 8} n={9} size={260} color="#0e0a14" gap={200} />
        <rect x={-300} y={1360} width={1680} height={800} fill="#0b0810" />
        <Trees y={1560} off={-t * 22} n={7} size={420} color="#08060c" gap={260} />
        <rect x={-300} y={1560} width={1680} height={600} fill="#06040a" />
      </g>
    </Svg>
  );
};

export const MaxOut: React.FC<{t: number; t0: number}> = ({t, t0}) => {
  const k = ease(P(t, t0, t0 + 1.4));
  return (
    <Svg>
      <Dusk dark={0.1} />
      <rect x={0} y={1180} width={W} height={740} fill="#15120f" />
      <rect x={300} y={1180} width={480} height={50} fill="#2a2f36" />
      <rect x={340} y={1230} width={400} height={700} fill="#04060a" />
      <g transform={`translate(0 ${lerp(300, 0, k)})`}>
        <Figure x={540} y={1720} s={1.6} face={{look: 0.5, fear: 0.5}} outfit={OUTFITS.max} />
      </g>
      <rect x={300} y={1180} width={480} height={50} fill="#2a2f36" />
    </Svg>
  );
};

export const CloudCover: React.FC<{t: number}> = ({t}) => {
  const k = ease(P(t, 55.0, 57.7));
  return (
    <Svg>
      <Dusk dark={0.1 + 0.35 * k} />
      <Trees y={1330} off={0} n={9} size={210} color="#0f0b16" gap={200} />
      <House x={150} y={1450} s={1.15} />
      <House x={470} y={1420} s={0.9} />
      <House x={900} y={1460} s={1.1} />
      <Entrance x={1130} y={1500} s={1.1} />
      <g transform={`translate(0 ${lerp(-900, 380, k)})`}>
        <CloudMass cx={540} cy={420} s={2.4} t={t} shade={k} />
      </g>
      <rect width={W} height={H} fill="#7a7a82" opacity={0.28 * k} />
    </Svg>
  );
};

export const RoofSpots: React.FC<{t: number}> = ({t}) => {
  const k = P(t, 57.9, 60.5);
  return (
    <Svg>
      <rect width={W} height={H} fill="#2a2a30" />
      {Array.from({length: 12}).map((_, r) => (
        <g key={r}>
          <rect x={-100} y={r * 170 - 60} width={1280} height={10} fill="#0e0e12" />
          {Array.from({length: 8}).map((_, c) => (
            <rect key={c} x={c * 160 - ((r % 2) * 80)} y={r * 170 - 60} width={6} height={170} fill="#0e0e12" opacity={0.7} />
          ))}
        </g>
      ))}
      {Array.from({length: 14}).map((_, i) => {
        const vis = clamp(k * 16 - i * 0.9);
        if (vis <= 0) return null;
        const cx = 90 + rnd(i) * 900;
        const cy = 200 + rnd(i + 4) * 1500;
        const r = (40 + rnd(i + 9) * 90) * vis;
        return (
          <g key={i}>
            <circle cx={cx} cy={cy} r={r * 1.4} fill="#000" opacity={0.18} />
            <circle cx={cx} cy={cy} r={r} fill="#0a0a0c" opacity={0.92} />
            <circle cx={cx + r * 0.3} cy={cy - r * 0.2} r={r * 0.4} fill="#1a1a20" />
          </g>
        );
      })}
      <rect width={W} height={H} fill="#8a8a92" opacity={0.2 + 0.12 * Math.sin(t * 1.5)} />
      {Array.from({length: 40}).map((_, i) => (
        <circle key={i} cx={(rnd(i) * 1080 + t * 30) % 1080} cy={((rnd(i + 3) * 1920 + t * 20) % 1920)} r={3 + rnd(i + 5) * 6} fill="#b8b8c0" opacity={0.3} />
      ))}
    </Svg>
  );
};

// ---------- crowd, ladder, pressure door, counter ----------
export const CrowdHatch: React.FC<{t: number}> = ({t}) => {
  const k = P(t, 35.49, 37.6);
  const outfits = [OUTFITS.neighbor, OUTFITS.neighbor_woman, OUTFITS.old_man, OUTFITS.babushka, OUTFITS.neighbor, OUTFITS.neighbor_woman, OUTFITS.old_man];
  return (
    <Svg>
      <Dusk dark={0.12} />
      <Trees y={1330} off={0} n={9} size={210} color="#0f0b16" gap={200} />
      <House x={150} y={1450} s={1.15} />
      <Entrance x={880} y={1500} s={1.3} />
      <rect x={-400} y={1590} width={1880} height={14} fill="#3a2e22" />
      {outfits.map((o, i) => {
        const x = lerp(-200 - i * 150, 860, ease(clamp(k * 1.25 - i * 0.07)));
        const vis = 1 - clamp((x - 780) / 80);
        return (
          <g key={i} opacity={vis} transform={`translate(0 ${-Math.abs(Math.sin(t * 12 + i)) * 14})`}>
            <Figure x={x} y={1790 + (i % 2) * 40} s={1.0} face={{look: 0.9, fear: 0.6}} outfit={o} />
            <rect x={x + 44} y={1790 + (i % 2) * 40 - 70} width={46} height={58} rx={10} fill="#6a5a3a" stroke="#2a2010" strokeWidth={3} />
          </g>
        );
      })}
    </Svg>
  );
};

export const Ladder: React.FC<{t: number}> = ({t}) => {
  const k = P(t, 37.6, 38.85);
  return (
    <Svg>
      <rect width={W} height={H} fill="#0b0e12" />
      <rect x={300} y={0} width={480} height={H} fill="#12161c" />
      {Array.from({length: 14}).map((_, i) => (
        <rect key={i} x={300} y={i * 150} width={480} height={5} fill="#0a0c10" />
      ))}
      <rect x={440} y={0} width={14} height={H} fill="#7c8791" />
      <rect x={626} y={0} width={14} height={H} fill="#7c8791" />
      {Array.from({length: 22}).map((_, i) => (
        <rect key={i} x={440} y={i * 96 + 20} width={200} height={10} fill="#7c8791" />
      ))}
      {[0, 1, 2].map((i) => {
        const y = lerp(-200 - i * 420, 2000, clamp(k * 1.3 - i * 0.12));
        return <Figure key={i} x={540} y={y} s={0.9} outfit={[OUTFITS.neighbor, OUTFITS.neighbor_woman, OUTFITS.old_man][i]} />;
      })}
      <ellipse cx={540} cy={0} rx={300} ry={160} fill="#ffcf7a" opacity={0.1} />
    </Svg>
  );
};

export const PressureDoor: React.FC<{t: number}> = ({t}) => (
  <Svg>
    <rect width={W} height={H} fill="#0c1015" />
    <rect x={0} y={1500} width={W} height={420} fill="#171c22" />
    <circle cx={540} cy={900} r={420} fill="#2a3036" stroke="#59616b" strokeWidth={26} />
    <circle cx={540} cy={900} r={340} fill="#1c2127" stroke="#3a4048" strokeWidth={10} />
    {Array.from({length: 12}).map((_, i) => (
      <circle key={i} cx={540 + Math.cos((i / 12) * 6.28) * 380} cy={900 + Math.sin((i / 12) * 6.28) * 380} r={12} fill="#7c8791" />
    ))}
    <g transform={`translate(540 900) rotate(${Math.max(0, t - 38.8) * 90})`}>
      <circle r={110} fill="none" stroke="#9aa4ad" strokeWidth={16} />
      {[0, 60, 120].map((a) => (
        <rect key={a} x={-8} y={-110} width={16} height={220} fill="#9aa4ad" transform={`rotate(${a})`} />
      ))}
      <circle r={22} fill="#c0392b" />
    </g>
    <Figure x={180} y={1760} s={1.35} face={{look: 0.8, fear: 0.5}} outfit={OUTFITS.max} />
    <Figure x={900} y={1780} s={1.3} face={{look: -0.8, fear: 0.4}} outfit={OUTFITS.uncle_vitya} />
  </Svg>
);

export const Counter: React.FC<{t: number}> = ({t}) => {
  const reveal = ease(P(t, 42.5, 43.4));
  const lack = P(t, 44.2, 45.0);
  const pulse = 1 + 0.06 * Math.sin(t * 9) * lack;
  return (
    <Svg>
      <rect width={W} height={H} fill="#0a0d12" />
      <g transform={`translate(540 560) scale(${pulse}) translate(-540 -560)`}>
        <text x={540} y={640} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={290} fill={lack > 0.3 ? '#ff3b2e' : '#f2f4f8'} opacity={reveal}>49/50</text>
      </g>
      {Array.from({length: 50}).map((_, i) => {
        const col = i % 10;
        const row = Math.floor(i / 10);
        const x = 130 + col * 90;
        const y = 900 + row * 150;
        const missing = i === 49;
        const lit = !missing && clamp(reveal * 60 - i) > 0.5;
        return (
          <g key={i} opacity={missing ? 0.4 + 0.6 * lack : 1}>
            <circle cx={x} cy={y} r={16} fill={missing ? 'none' : lit ? '#cfe2f5' : '#1c222b'} stroke={missing ? '#ff3b2e' : 'none'} strokeWidth={4} />
            <path d={`M${x - 22} ${y + 70} Q${x - 22} ${y + 26} ${x} ${y + 26} Q${x + 22} ${y + 26} ${x + 22} ${y + 70} Z`} fill={missing ? 'none' : lit ? '#cfe2f5' : '#1c222b'} stroke={missing ? '#ff3b2e' : 'none'} strokeWidth={4} />
          </g>
        );
      })}
    </Svg>
  );
};

// ---------- grandma, bag, running ----------
export const GrandmaHouse: React.FC<{t: number}> = ({t}) => {
  const k = ease(P(t, 46.06, 48.6));
  return (
    <Svg>
      <Dusk dark={0.12} />
      <Trees y={1330} off={0} n={9} size={210} color="#0f0b16" gap={200} />
      <g>
        <House x={720} y={1520} s={2.0} />
        <rect x={-400} y={1590} width={1880} height={14} fill="#3a2e22" />
      </g>
      <Figure x={820} y={1800} s={1.35} face={{look: -0.8, fear: 0.6}} outfit={OUTFITS.babushka} />
      <rect x={880} y={1690} width={96} height={80} rx={14} fill="#6a4a2a" stroke="#2a1a0a" strokeWidth={4} />
      <g transform={`translate(0 ${-Math.abs(Math.sin(t * 13)) * 14 * (1 - k)})`}>
        <Figure x={lerp(-150, 330, k)} y={1800} s={1.4} face={{look: 0.9, fear: 0.7}} outfit={OUTFITS.max} />
      </g>
    </Svg>
  );
};

export const BagClose: React.FC<{t: number}> = ({t}) => (
  <Svg>
    <rect width={W} height={H} fill="#1b140e" />
    {Array.from({length: 10}).map((_, i) => (
      <rect key={i} x={0} y={i * 200} width={W} height={8} fill="#0a0704" opacity={0.7} />
    ))}
    <g transform={`translate(540 1000) rotate(${Math.sin(t * 3) * 1.5})`}>
      <rect x={-290} y={-240} width={580} height={480} rx={60} fill="#6a4a2a" stroke="#2a1a0a" strokeWidth={10} />
      <path d="M-200 -240 Q0 -440 200 -240" stroke="#2a1a0a" strokeWidth={24} fill="none" />
      <rect x={-240} y={-150} width={480} height={34} fill="#3a2614" />
      <rect x={-40} y={-160} width={80} height={54} rx={10} fill="#c8a23a" />
      {[0, 1, 2].map((i) => (
        <g key={i} transform={`rotate(${-14 + i * 10} ${-100 + i * 100} -200)`}>
          <rect x={-150 + i * 100} y={-330} width={150} height={190} fill="#efe6cc" stroke="#9a8a62" strokeWidth={4} />
          {[0, 1, 2, 3].map((q) => (
            <rect key={q} x={-130 + i * 100} y={-300 + q * 36} width={110} height={5} fill="#7a7a8a" opacity={0.7} />
          ))}
        </g>
      ))}
    </g>
    <path d="M60 1600 Q200 1380 380 1280 L440 1340 Q300 1440 240 1660 Z" fill="#c9a08a" />
    <path d="M1020 1620 Q880 1400 700 1300 L640 1360 Q780 1450 840 1680 Z" fill="#c9a08a" />
  </Svg>
);

export const RunSide: React.FC<{t: number}> = ({t}) => {
  const k = P(t, 52.08, 54.76);
  const bob = Math.abs(Math.sin(t * 14)) * 18;
  const sk = 5 * Math.sin(t * 60);
  return (
    <Svg>
      <g transform={`translate(${sk} 0)`}>
        <Dusk dark={0.2} />
        <Trees y={1330} off={t * 110} n={9} size={230} color="#0d0913" gap={200} />
        <rect x={-400} y={1620} width={1880} height={14} fill="#3a2e22" />
        {Array.from({length: 7}).map((_, i) => (
          <rect key={i} x={((i * 220 + t * 700) % 1500) - 200} y={1700} width={140} height={10} fill="#4a3e32" opacity={0.7} />
        ))}
        <g transform={`translate(0 ${-bob})`}>
          <Figure x={620} y={1760} s={1.5} face={{look: -0.9, fear: 0.7}} outfit={OUTFITS.max} />
        </g>
        <g transform={`translate(0 ${-bob * 0.9})`}>
          <Figure x={370} y={1760} s={1.3} face={{look: -0.9, fear: 0.8}} outfit={OUTFITS.babushka} />
        </g>
        <rect x={470} y={1480} width={160} height={26} rx={13} fill="#d9a98a" transform={`rotate(${-8} 550 1490)`} />
        <g opacity={0.85} transform={`translate(${lerp(1500, 700, k)} 0)`}>
          <CloudMass cx={0} cy={500} s={2.6} t={t} shade={0.4} />
        </g>
      </g>
    </Svg>
  );
};

// ---------- heavy door, ventilation, monitor, sensor ----------
export const HeavyDoor: React.FC<{t: number}> = ({t}) => {
  const close = ease(P(t, 62.35, 62.88));
  const spin = Math.max(0, t - 62.95) * 220;
  const sk = t > 62.85 && t < 63.3 ? 18 * Math.sin(t * 80) * (1 - (t - 62.85) / 0.45) : 0;
  return (
    <Svg>
      <g transform={`translate(${sk} ${sk * 0.4})`}>
        <rect width={W} height={H} fill="#0c1015" />
        <rect x={0} y={1500} width={W} height={420} fill="#171c22" />
        <rect x={140} y={380} width={800} height={1180} fill="#4a525b" stroke="#2a3036" strokeWidth={30} />
        <rect x={190} y={430} width={700} height={1080} fill={`rgb(${lerp(150, 12, close)},${lerp(150, 14, close)},${lerp(158, 18, close)})`} />
        <rect x={190} y={430} width={lerp(0, 700, close)} height={1080} fill="#39414a" stroke="#59616b" strokeWidth={14} />
        <g transform="translate(540 970)" opacity={close}>
          <g transform={`rotate(${spin})`}>
            <circle r={150} fill="none" stroke="#9aa4ad" strokeWidth={22} />
            {[0, 60, 120].map((a) => (
              <rect key={a} x={-9} y={-150} width={18} height={300} fill="#9aa4ad" transform={`rotate(${a})`} />
            ))}
            <circle r={28} fill="#c0392b" />
          </g>
        </g>
        <Figure x={140} y={1790} s={1.3} face={{look: 0.9, fear: 0.8}} outfit={OUTFITS.max} />
        <Figure x={930} y={1810} s={1.1} face={{look: -0.6, fear: 0.8}} outfit={OUTFITS.babushka} />
        <Figure x={800} y={1840} s={1.2} face={{look: -0.9, fear: 0.6}} outfit={OUTFITS.uncle_vitya} />
      </g>
    </Svg>
  );
};

export const VentMonitor: React.FC<{t: number}> = ({t}) => {
  const warn = P(t, 66.9, 67.5);
  const alert = ease(P(t, 70.02, 70.4));
  const blink = Math.floor(t * 4) % 2 === 0;
  const zoom = 1 + 0.35 * P(t, 64.33, 70.0);
  return (
    <Svg>
      <rect width={W} height={H} fill="#0b0e12" />
      <g transform={`translate(540 960) scale(${zoom}) translate(-540 -960)`}>
        <rect x={0} y={1520} width={W} height={400} fill="#171c22" />
        <rect x={60} y={720} width={400} height={760} rx={16} fill="#3d4349" stroke="#7a8088" strokeWidth={8} />
        <g transform="translate(260 1000)">
          <circle r={140} fill="#1d2126" stroke="#9aa2aa" strokeWidth={8} />
          <g transform={`rotate(${t * 600 * (t < 72 ? 1 : 0.3)})`}>
            {[0, 72, 144, 216, 288].map((a) => (
              <path key={a} d="M-12 0 L-26 -128 Q0 -144 26 -128 L12 0 Z" fill="#aab2ba" transform={`rotate(${a})`} />
            ))}
          </g>
        </g>
        <rect x={520} y={640} width={500} height={620} rx={26} fill="#0e1014" stroke="#59616b" strokeWidth={10} />
        <rect x={548} y={668} width={444} height={564} rx={14} fill="#07110c" />
        <text x={770} y={730} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={30} fill="#7be0a0">ФИЛЬТРАЦИЯ</text>
        {[0, 1, 2, 3, 4].map((i) => (
          <rect key={i} x={580 + i * 78} y={1100 - (140 + Math.abs(Math.sin(t * 2 + i)) * 160) * (1 - warn * 0.6)} width={56} height={(140 + Math.abs(Math.sin(t * 2 + i)) * 160) * (1 - warn * 0.6)} fill={warn > 0.3 ? '#ff4a3d' : '#3ddc84'} />
        ))}
        <g opacity={warn}>
          <rect x={548} y={780} width={444} height={80} fill="#4a0e0b" opacity={blink ? 0.95 : 0.5} />
          <text x={770} y={836} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={40} fill="#ff4a3d">ВНИМАНИЕ</text>
        </g>
        <g opacity={alert}>
          <rect x={548} y={668} width={444} height={564} rx={14} fill="#3a0a08" />
          <text x={770} y={850} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={52} fill="#ff3b2e">НАРУЖНЫЙ</text>
          <text x={770} y={920} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={52} fill="#ff3b2e">ВОЗДУХ</text>
          <text x={770} y={990} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={52} fill="#ff3b2e">ЗАРАЖЁН</text>
        </g>
      </g>
      <rect width={W} height={H} fill="#ff2a1a" opacity={t > 70.02 && blink ? 0.08 : 0} />
    </Svg>
  );
};

export const SensorScreen: React.FC<{t: number}> = ({t}) => {
  const count = Math.floor(P(t, 72.7, 75.3) * 137);
  const alert = ease(P(t, 75.35, 75.6));
  const flash = t > 75.35 && t < 75.8 ? 0.55 * (1 - (t - 75.35) / 0.45) : 0;
  const blink = Math.floor(t * 5) % 2 === 0;
  return (
    <Svg>
      <rect width={W} height={H} fill="#0a0c10" />
      <rect x={100} y={460} width={880} height={980} rx={40} fill="#14181d" stroke="#59616b" strokeWidth={12} />
      <rect x={140} y={500} width={800} height={900} rx={20} fill="#06100b" />
      <text x={540} y={590} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={40} fill="#7be0a0">ДАТЧИК ЧАСТИЦ · БУНКЕР</text>
      <text x={540} y={800} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={180} fill={count > 0 ? '#ff4a3d' : '#3ddc84'}>{String(count).padStart(4, '0')}</text>
      <text x={540} y={860} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={32} fill="#8b95a3">частиц / м³</text>
      <polyline points={Array.from({length: 40}).map((_, i) => `${170 + i * 18},${1250 - (i / 40) * count * 1.4 - Math.abs(Math.sin(i * 1.7 + t * 6)) * 40}`).join(' ')} fill="none" stroke="#ff4a3d" strokeWidth={6} />
      <rect x={170} y={1260} width={720} height={4} fill="#3a4048" />
      <g opacity={alert}>
        <rect x={140} y={900} width={800} height={500} rx={20} fill="#3a0a08" opacity={blink ? 0.98 : 0.85} />
        {['НЕИЗВЕСТНЫЕ', 'ЧАСТИЦЫ', 'ОБНАРУЖЕНЫ', 'ВНУТРИ'].map((l, i) => (
          <text key={l} x={540} y={1010 + i * 100} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={i === 0 ? 76 : 84} fill="#ff3b2e">{l}</text>
        ))}
      </g>
      <rect width={W} height={H} fill="#ff2a1a" opacity={flash} />
    </Svg>
  );
};
