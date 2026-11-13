import React from 'react';
import {clamp, ease, lerp, rnd, mixc, Tx, Glow, Snow, E, P, Person, Look, Pose} from './M60Base';

export type CharSpec = {look: Look; x: number; y: number; pose: Pose; flip?: boolean; s?: number};
export const Chars: React.FC<{list?: CharSpec[]}> = ({list = []}) => (
  <g>{list.map((c, i) => <Person key={i} x={c.x} y={c.y} look={c.look} pose={c.pose} flip={c.flip} s={c.s ?? 1} />)}</g>
);

export const VW = 3500;
const GROUND = 1300;
const HOUSES = [
  {x: 160, w: 300, h: 220, c: '#5a4030'}, {x: 560, w: 340, h: 250, c: '#6a4a34'},
  {x: 1800, w: 340, h: 240, c: '#4f3a2a'}, {x: 2150, w: 300, h: 220, c: '#5f4430'},
];
export const ILYA_HOME_X = 1190;
export const SHED_X = 1480;
export const CAR_X = 1700;
type VP = {t: number; dark: number; others: number; old: number; snowI: number; hood?: boolean; cx?: number; chars?: CharSpec[]; smoke?: number; lampsOn?: number; drifts?: number};
const Window: React.FC<{x: number; y: number; w: number; h: number; lit: number; id: string}> = ({x, y, w, h, lit, id}) => (
  <g>
    <rect x={x} y={y} width={w} height={h} fill={mixc('#0d1420', '#ffc66b', lit)} stroke="#e8f0fb" strokeWidth={5} />
    <rect x={x + w / 2 - 2} y={y} width={4} height={h} fill="#e8f0fb" opacity={0.8} />
    {lit > 0.05 && <Glow x={x + w / 2} y={y + h / 2} r={w * 2} c="#ffc66b" o={0.4 * lit} id={id} />}
  </g>
);
const WoodHouse: React.FC<{x: number; w: number; h: number; c: string; lit: number; id: string; chimney?: boolean; smoke?: number; t: number; y?: number}> = ({x, w, h, c, lit, id, chimney, smoke = 0, t, y = GROUND}) => (
  <g>
    <rect x={x} y={y - h} width={w} height={h} fill={c} />
    {Array.from({length: Math.floor(h / 22)}).map((_, i) => <rect key={i} x={x} y={y - h + i * 22} width={w} height={3} fill="#000" opacity={0.2} />)}
    <path d={`M${x - 30} ${y - h} L${x + w / 2} ${y - h - 110} L${x + w + 30} ${y - h} Z`} fill="#3a2a20" />
    <path d={`M${x - 30} ${y - h} L${x + w / 2} ${y - h - 110} L${x + w + 30} ${y - h} L${x + w + 30} ${y - h - 20} L${x + w / 2} ${y - h - 128} L${x - 30} ${y - h - 20} Z`} fill="#eef4fc" />
    {chimney && <g><rect x={x + w * 0.72} y={y - h - 150} width={32} height={90} fill="#4a3a30" /><rect x={x + w * 0.72 - 4} y={y - h - 160} width={40} height={14} fill="#eef4fc" /></g>}
    {chimney && smoke > 0 && Array.from({length: 7}).map((_, i) => {
      const tau = ((t * 0.5 + i * 0.15) % 1);
      return <circle key={i} cx={x + w * 0.72 + 16 + tau * 50 + Math.sin(tau * 6 + i) * 8} cy={y - h - 170 - tau * 150} r={14 + tau * 26} fill="#b8c4d6" opacity={0.5 * smoke * (1 - tau)} />;
    })}
    <Window x={x + w * 0.14} y={y - h * 0.68} w={w * 0.24} h={h * 0.34} lit={lit} id={`${id}a`} />
    <Window x={x + w * 0.6} y={y - h * 0.68} w={w * 0.24} h={h * 0.34} lit={lit} id={`${id}b`} />
    <rect x={x + w * 0.42} y={y - h * 0.5} width={w * 0.14} height={h * 0.5} fill="#3a2a1c" />
    <path d={`M${x - 20} ${y} Q${x + w / 2} ${y - 40} ${x + w + 20} ${y} Z`} fill="#eef4fc" opacity={0.9} />
  </g>
);
const Fence: React.FC<{x0: number; x1: number}> = ({x0, x1}) => (
  <g>
    {Array.from({length: Math.floor((x1 - x0) / 34)}).map((_, i) => <g key={i}><rect x={x0 + i * 34} y={GROUND - 90} width={12} height={90} fill="#4a3a2c" /><rect x={x0 + i * 34 - 2} y={GROUND - 96} width={16} height={10} fill="#eef4fc" /></g>)}
    <rect x={x0} y={GROUND - 60} width={x1 - x0} height={8} fill="#3a2c20" />
  </g>
);
export const Village: React.FC<VP> = ({t, dark, others, old, snowI, hood, cx = 1750, chars, smoke = 1, lampsOn = 1, drifts = 0}) => {
  const sky0 = mixc('#6c7482', '#0b1120', dark);
  const sky1 = mixc('#a9b2c0', '#1a2336', dark);
  const nightK = dark;
  const L = (k: number) => -(cx - 1750) * k;
  return (
    <g>
      <defs>
        <linearGradient id="vsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={sky0} /><stop offset="1" stopColor={sky1} /></linearGradient>
      </defs>
      <rect x={-400} y={-2400} width={VW + 800} height={4700} fill="url(#vsky)" />
      {/* clouds */}
      <g opacity={0.45 + dark * 0.2}>{Array.from({length: 9}).map((_, i) => <ellipse key={i} cx={i * 420 + ((t * 8 * (1 + rnd(i))) % 420)} cy={200 + rnd(i) * 360} rx={320} ry={80} fill={mixc('#8a93a3', '#0a0f1c', dark)} />)}</g>
      {/* far forest + hills */}
      <g transform={`translate(${L(0.15)} 0)`}>
        <path d={`M-400 ${GROUND - 120} Q600 ${GROUND - 300} 1500 ${GROUND - 160} T3600 ${GROUND - 200} L3600 ${GROUND} L-400 ${GROUND} Z`} fill={mixc('#7f8a9c', '#0f1626', dark)} />
        {Array.from({length: 46}).map((_, i) => <g key={i} transform={`translate(${i * 78 - 200} ${GROUND - 110 - rnd(i) * 70}) scale(${0.5 + rnd(i + 2) * 0.5})`}><path d="M-34 0 L0 -110 L34 0 Z" fill={mixc('#33463f', '#0a1018', dark)} /><path d="M-22 -40 L0 -110 L22 -40 Z" fill="#dde8f6" opacity={0.7 - dark * 0.3} /></g>)}
      </g>
      {/* ground */}
      <rect x={-400} y={GROUND - 10} width={VW + 800} height={800} fill={mixc('#dbe4f2', '#7f93b3', dark * 0.85)} />
      <rect x={-400} y={GROUND + 150} width={VW + 800} height={190} fill={mixc('#c4cfdf', '#667a9c', dark * 0.85)} />
      <path d={`M-400 ${GROUND + 180} Q800 ${GROUND + 130} 1800 ${GROUND + 190} T3600 ${GROUND + 150}`} stroke="#9fb0c8" strokeWidth={5} fill="none" opacity={0.7} />
      {/* poles & wires */}
      {[260, 740, 1240, 1700, 2200, 2700, 3200].map((x, i) => (
        <g key={i}><rect x={x - 7} y={GROUND - 420} width={14} height={440} fill="#2e2a28" /><rect x={x - 50} y={GROUND - 400} width={100} height={8} fill="#2e2a28" /></g>
      ))}
      <path d={`M260 ${GROUND - 396} Q500 ${GROUND - 340} 740 ${GROUND - 396} T1240 ${GROUND - 396} T1700 ${GROUND - 396} T2200 ${GROUND - 396} T2700 ${GROUND - 396} T3200 ${GROUND - 396}`} stroke="#222" strokeWidth={3} fill="none" />
      {/* houses */}
      {HOUSES.map((h, i) => <WoodHouse key={i} {...h} lit={others * (rnd(i + 3) > 0.25 ? 1 : 0)} id={`hv${i}`} chimney smoke={others * smoke * 0.6} t={t} />)}
      <WoodHouse x={ILYA_HOME_X - 150} w={380} h={260} c="#6f4d33" lit={others} id="hil" chimney smoke={smoke} t={t} />
      {/* shop */}
      <g>
        <rect x={2480} y={GROUND - 230} width={420} height={230} fill="#4a5a6a" />
        <path d={`M2460 ${GROUND - 230} L2690 ${GROUND - 300} L2920 ${GROUND - 230} Z`} fill="#eef4fc" />
        <rect x={2500} y={GROUND - 200} width={380} height={46} fill="#c0392b" /><Tx x={2690} y={GROUND - 164} size={34} fill="#fff">МАГАЗИН</Tx>
        <Window x={2520} y={GROUND - 140} w={150} h={90} lit={others} id="shw" />
        <rect x={2720} y={GROUND - 150} width={120} height={150} fill="#2a2018" />
        <path d={`M2460 ${GROUND} Q2690 ${GROUND - 30} 2920 ${GROUND} Z`} fill="#eef4fc" />
      </g>
      {/* garages */}
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <rect x={2960 + i * 130} y={GROUND - 160} width={124} height={160} fill={['#7a8696', '#8a7a6a', '#6a7a86'][i]} stroke="#2a3040" strokeWidth={4} />
          <rect x={2960 + i * 130} y={GROUND - 170} width={124} height={16} fill="#eef4fc" />
          {[0, 1, 2, 3].map((k) => <rect key={k} x={2960 + i * 130 + 10} y={GROUND - 130 + k * 28} width={104} height={4} fill="#000" opacity={0.25} />)}
        </g>
      ))}
      {/* neighbour garage near Ilya */}
      <g><rect x={1560} y={GROUND - 190} width={200} height={190} fill="#7a8696" stroke="#2a3040" strokeWidth={4} /><path d={`M1550 ${GROUND - 190} L1660 ${GROUND - 232} L1770 ${GROUND - 190} Z`} fill="#eef4fc" />{[0, 1, 2, 3, 4].map((k) => <rect key={k} x={1572} y={GROUND - 160 + k * 30} width={176} height={4} fill="#000" opacity={0.25} />)}</g>
      {/* shed + wood */}
      <g>
        <rect x={SHED_X - 110} y={GROUND - 170} width={220} height={170} fill="#4f3a2a" />
        <path d={`M${SHED_X - 130} ${GROUND - 170} L${SHED_X} ${GROUND - 230} L${SHED_X + 130} ${GROUND - 170} Z`} fill="#eef4fc" />
        <rect x={SHED_X - 70} y={GROUND - 130} width={140} height={130} fill="#1a1410" />
      </g>
      <Fence x0={ILYA_HOME_X - 220} x1={ILYA_HOME_X + 240} />
      <Fence x0={700} x1={960} />
      <Fence x0={2100} x1={2460} />
      {/* old car */}
      <g transform={`translate(${CAR_X + 60} ${GROUND + 70})`}>
        <ellipse cx={0} cy={4} rx={130} ry={10} fill="#000" opacity={0.3} />
        <path d="M-120 -30 L-120 -66 Q-118 -82 -98 -84 L-60 -88 L-28 -124 L48 -124 L80 -88 L110 -84 Q122 -80 122 -62 L122 -30 Z" fill="#6a4a2a" />
        <path d="M-52 -88 L-26 -116 L-2 -116 L-2 -88 Z M8 -88 L8 -116 L44 -116 L72 -88 Z" fill="#1a2a3a" />
        {hood && <g transform="translate(100 -66) rotate(-52)"><rect x={0} y={-8} width={92} height={16} fill="#5a3a1a" stroke="#2a1a0a" strokeWidth={3} /></g>}
        <circle cx={-80} cy={-24} r={26} fill="#0c0f16" /><circle cx={80} cy={-24} r={26} fill="#0c0f16" />
        <path d="M-116 -66 Q-30 -96 118 -80 L110 -84 Q40 -100 -110 -72 Z" fill="#eef4fc" opacity={0.8} />
      </g>
      {/* characters */}
      <Chars list={chars} />
      {/* old house far right */}
      <g>
        <rect x={3380} y={GROUND - 140} width={110} height={140} fill="#2a2018" />
        <rect x={3410} y={GROUND - 100} width={26} height={30} fill={mixc('#0d1420', '#ffd25a', old)} />
        {old > 0.02 && <Glow x={3423} y={GROUND - 85} r={170} c="#ffd25a" o={0.55 * old} id="oldfar" />}
      </g>
      {/* night shade */}
      <rect x={-400} y={-400} width={VW + 800} height={2700} fill="#04070f" opacity={nightK * 0.0} />
      {lampsOn > 0 && [520, 1500, 2300].map((x, i) => <g key={i}><rect x={x - 3} y={GROUND - 300} width={6} height={300} fill="#2a2e38" /><Glow x={x} y={GROUND - 300} r={180} c="#ffd27a" o={0.35 * lampsOn * (0.3 + dark)} id={`vl${i}`} /></g>)}
      {drifts > 0 && Array.from({length: 14}).map((_, i) => <ellipse key={i} cx={100 + i * 250} cy={GROUND + 20} rx={150} ry={30 + 55 * drifts} fill="#eef4fc" opacity={0.9} />)}
    </g>
  );
};

// ---------------- old house closeup ----------------
export const OldHouse: React.FC<{t: number; lit: number; top: number; shadow?: number; cx?: number}> = ({t, lit, top, shadow = 0, cx = 540}) => (
  <g>
    <rect x={-300} y={-600} width={1700} height={3200} fill="#080d18" />
    <rect x={-300} y={-600} width={1700} height={1400} fill="#101a2c" />
    {/* forest */}
    <g transform={`translate(${-(cx - 540) * 0.2} 0)`}>
      {Array.from({length: 26}).map((_, i) => <g key={i} transform={`translate(${i * 70 - 300} ${1720 - rnd(i) * 80}) scale(${1 + rnd(i + 1) * 1.2})`}><path d="M-60 0 L0 -260 L60 0 Z" fill="#0a1420" /><path d="M-40 -90 L0 -260 L40 -90 Z" fill="#c9d6e8" opacity={0.25} /></g>)}
    </g>
    {/* ground */}
    <rect x={-300} y={1700} width={1700} height={900} fill="#9fb0c8" />
    <rect x={-300} y={1700} width={1700} height={16} fill="#dfe9f7" />
    {/* house */}
    <rect x={160} y={1060} width={760} height={650} fill="#2a2018" />
    {Array.from({length: 30}).map((_, i) => <rect key={i} x={160 + i * 26} y={1060} width={3} height={650} fill="#000" opacity={0.4} />)}
    <path d="M110 1060 L540 760 L970 1060 Z" fill="#1c1510" />
    <path d="M100 1062 L540 752 L980 1062 L980 1030 L540 722 L100 1030 Z" fill="#dfe9f7" />
    <rect x={720} y={700} width={46} height={150} fill="#2a2018" /><rect x={714} y={690} width={58} height={16} fill="#dfe9f7" />
    {/* windows */}
    {[{x: 230, y: 1230}, {x: 590, y: 1230}].map((w, i) => (
      <g key={i}>
        <rect x={w.x} y={w.y} width={200} height={240} fill={i === 0 ? mixc('#0a0f18', '#ffd25a', lit) : '#05080f'} stroke="#4a3a2a" strokeWidth={10} />
        <rect x={w.x + 96} y={w.y} width={8} height={240} fill="#4a3a2a" />
        {i === 0 && lit > 0.05 && <Glow x={w.x + 100} y={w.y + 120} r={420} c="#ffd25a" o={0.5 * lit} id="ohg" />}
        {i === 0 && lit > 0.05 && <g opacity={lit}><path d={`M${w.x + 10} ${w.y + 10} L${w.x + 70} ${w.y + 10} L${w.x + 50} ${w.y + 230} L${w.x + 10} ${w.y + 230} Z`} fill="#a8723a" opacity={0.5} /><path d={`M${w.x + 190} ${w.y + 10} L${w.x + 130} ${w.y + 10} L${w.x + 150} ${w.y + 230} L${w.x + 190} ${w.y + 230} Z`} fill="#a8723a" opacity={0.5} /></g>}
        {i === 0 && shadow > 0 && <g transform={`translate(${w.x + 40 + shadow * 120} ${w.y + 230})`} opacity={0.85}><rect x={-26} y={-110} width={52} height={110} rx={22} fill="#05080f" /><circle cx={0} cy={-132} r={24} fill="#05080f" /></g>}
      </g>
    ))}
    <rect x={430} y={1400} width={110} height={310} fill="#1a140e" stroke="#4a3a2a" strokeWidth={6} />
    <rect x={410} y={1480} width={150} height={12} fill="#6a5a46" transform="rotate(-12 485 1486)" />
    <path d="M100 1706 Q540 1660 980 1706 Z" fill="#dfe9f7" />
    {/* second-floor window, appears above roof */}
    {top > 0 && (
      <g opacity={ease(clamp(top * 3))} transform={`translate(0 ${-0})`}>
        <rect x={470} y={430} width={140} height={190} fill="#ffd25a" stroke="#4a3a2a" strokeWidth={8} />
        <rect x={536} y={430} width={8} height={190} fill="#4a3a2a" />
        <Glow x={540} y={525} r={440} c="#ffd25a" o={0.6} id="topg" />
      </g>
    )}
    <Snow t={t} n={110} speed={120} wind={90} op={0.8} w={1700} h={2600} size={1.6} x0={-300} y0={-300} />
  </g>
);
