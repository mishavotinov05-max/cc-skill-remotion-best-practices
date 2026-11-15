import React from 'react';
import {clamp, ease, lerp, rnd, mixc, Tx, Glow, Person, Look, Pose, poseStand, poseWalk, poseReach, E} from './M60Base';
import {ik2} from './ShelterArt';

export const G = 900; // ground line
export const Full: React.FC<{c: string; o?: number}> = ({c, o = 1}) => <rect x={-3000} y={-2000} width={14000} height={6000} fill={c} opacity={o} />;

// ================= characters =================
export const VAS: Look = {jacket: '#15171c', jacket2: '#262a33', arm: '#15171c', pants: '#6a6f78', glove: '#e6b48f', boot: '#2a2420', hair: '#201a16', skin: '#e6b48f', hat: 'none', pack: true};
export const RANGER: Look = {jacket: '#3d6a3a', jacket2: '#4f8049', arm: '#3d6a3a', pants: '#4a4636', glove: '#d9a47e', boot: '#2a2420', hair: '#6a6a70', skin: '#d9a47e', hat: 'fur', hatCol: '#3a4a30', beard: true};

export const poseLie = (): Pose => ({hip: [0, -60], lean: 0, lf: [34, 0], lb: [-34, 0], hf: [12, -168], hb: [-4, -162], nod: 6});
export const poseCover = (): Pose => ({hip: [0, -60], lean: 0, lf: [40, 0], lb: [-40, 0], hf: [10, -170], hb: [-6, -164], nod: 12, mood: 'scared'});
export const poseKneel = (): Pose => ({hip: [0, -66], lean: 12, lf: [56, 0], lb: [-30, 0], hf: [40, -80], hb: [20, -76], nod: 8, mood: 'scared'});

export type VSpec = {x: number; y?: number; pose: Pose; flip?: boolean; lie?: number; s?: number};
export const Vasya: React.FC<{v: VSpec; look?: Look}> = ({v, look = VAS}) => {
  const y = G + (v.y ?? 0);
  const s = (v.s ?? 0.95) * (1 + (v.y ?? 0) / 700);
  const body = <Person x={v.x} y={y} look={look} pose={v.pose} flip={v.flip} s={s} />;
  return v.lie ? <g transform={`rotate(${v.lie} ${v.x} ${y})`}>{body}</g> : body;
};

// ================= bear =================
const FUR = '#4a2f1d', FUR2 = '#5e3d27', SNOUT = '#8a6040';
export const BearHead: React.FC<{t: number; mood: string; col?: string; sn?: string; k?: number}> = ({t, mood, col = FUR, sn = SNOUT, k = 1}) => {
  const sniff = mood === 'sniff' ? Math.sin(t * 14) * 3 : 0;
  const huff = mood === 'huff' ? Math.max(0, Math.sin(t * 5)) : 0;
  const earBack = mood === 'alert' ? 1 : 0;
  return (
    <g transform={`scale(${k})`}>
      <ellipse cx={-22} cy={-34} rx={21} ry={22} fill={col} transform={`rotate(${earBack * -30} -22 -34)`} /><ellipse cx={-22} cy={-34} rx={11} ry={12} fill="#7a5a44" transform={`rotate(${earBack * -30} -22 -34)`} />
      <ellipse cx={0} cy={0} rx={66} ry={54} fill={col} />
      <ellipse cx={64} cy={14 + sniff * 0.3} rx={52} ry={31} fill={sn} />
      <ellipse cx={104} cy={4 + sniff} rx={15} ry={11} fill="#1a1210" />
      <ellipse cx={100} cy={0 + sniff} rx={5} ry={3} fill="#fff" opacity={0.25} />
      {huff > 0.3 ? <path d="M70 30 Q95 44 112 30" stroke="#2a1410" strokeWidth={4} fill="#5a2a2a" /> : <path d="M66 34 Q90 40 108 30" stroke="#2a1410" strokeWidth={4} fill="none" strokeLinecap="round" />}
      <ellipse cx={34} cy={-12} rx={8} ry={7} fill="#fff" /><circle cx={36} cy={-11} r={4.5} fill="#1a1210" />
      <path d={`M24 ${-26 + earBack * 4} L48 ${-20 + earBack * 8}`} stroke="#2a1a10" strokeWidth={5} strokeLinecap="round" />
      {huff > 0.3 && [0, 1, 2].map((i) => <circle key={i} cx={124 + i * 16} cy={4 - i * 6} r={8 + i * 5} fill="#fff" opacity={0.35 - i * 0.1} />)}
    </g>
  );
};

export type BearP = {x: number; y?: number; s?: number; face?: number; mode: string; t: number; col?: string; sn?: string; rise?: number; sc?: number};
export const Bear: React.FC<{b: BearP}> = ({b}) => {
  const {x, y = 0, face = -1, mode, t, col = FUR, sn = SNOUT, rise = 0} = b;
  const sc = (b.s ?? 1) * 0.8 * (1 + y / 700);
  const run = mode === 'run', walk = mode === 'walk' || mode === 'sniffwalk' || mode === 'circle';
  const hz = run ? 2.6 : walk ? 1.05 : 0;
  const g = t * hz * Math.PI * 2;
  const bounce = run ? Math.abs(Math.sin(g)) * 14 : walk ? Math.abs(Math.sin(g)) * 4 : Math.sin(t * 2) * 1.5;
  const amp = run ? 74 : walk ? 36 : 2;
  const lift = run ? 38 : walk ? 16 : 0;
  const leg = (hx: number, ph: number, front: boolean, shade: string) => {
    const fx = hx + Math.sin(g + ph) * amp, fy = -Math.max(0, Math.cos(g + ph)) * lift;
    const j = ik2([hx, -130 - bounce], [fx, fy], 78, 74, (a, c) => a[0] < c[0] === front);
    return (
      <g>
        <polyline points={`${hx},${-130 - bounce} ${j.j} ${j.e}`} stroke={shade} strokeWidth={front ? 44 : 50} strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <ellipse cx={j.e[0] + 8} cy={j.e[1] - 4} rx={24} ry={12} fill="#2a1a10" />
      </g>
    );
  };
  const pitch = mode === 'sniff' || mode === 'sniffwalk' ? 28 + Math.sin(t * 3) * 4 : mode === 'alert' || mode === 'charge' || mode === 'run' ? 26 : mode === 'huff' ? -12 + Math.sin(t * 5) * 8 : mode === 'sway' ? 20 + Math.sin(t * 4) * 12 : mode === 'up' ? -16 : Math.sin(t * 1.2) * 3;
  const mood = mode === 'sniff' || mode === 'sniffwalk' ? 'sniff' : mode === 'alert' || mode === 'charge' || mode === 'run' ? 'alert' : mode === 'huff' || mode === 'sway' ? 'huff' : 'calm';
  const bodyRot = rise * -52;
  return (
    <g transform={`translate(${x} ${G + y}) scale(${face * -sc} ${sc})`}>
      <ellipse cx={0} cy={2} rx={190} ry={14} fill="#000" opacity={0.3} />
      <g transform={`rotate(${bodyRot} -110 0)`}>
        {leg(-110, Math.PI, false, FUR2)}
        {leg(110, 0, true, FUR2)}
        <g transform={`translate(0 ${-bounce}) rotate(${run ? Math.sin(g) * 2 : 0})`}>
          <path d="M-176 -140 C-180 -236 -60 -238 -10 -226 C30 -276 120 -270 156 -216 C196 -196 200 -140 174 -104 L-150 -92 C-188 -96 -184 -122 -176 -140 Z" fill={col} />
          <path d="M-170 -112 C-120 -100 100 -100 170 -118 L174 -104 L-150 -92 Z" fill="#000" opacity={0.18} />
          <path d="M-20 -224 C30 -274 120 -268 154 -214 C100 -240 20 -236 -20 -224 Z" fill="#7a5238" opacity={0.7} />
          <ellipse cx={-178} cy={-150} rx={18} ry={14} fill={col} />
          <g transform={`translate(172 ${-174}) rotate(${pitch}) scale(0.92)`}><BearHead t={t} mood={mood} col={col} sn={sn} /></g>
        </g>
        {leg(-80, 0, false, col)}
        {leg(140, Math.PI, true, col)}
      </g>
    </g>
  );
};

export const BearFront: React.FC<{t: number; s: number}> = ({t, s}) => {
  const sw = Math.sin(t * 3.2);
  return (
    <g transform={`translate(960 ${G + 140}) scale(${s})`}>
      <ellipse cx={0} cy={4} rx={260} ry={22} fill="#000" opacity={0.3} />
      <rect x={-170} y={-150 + (sw > 0 ? 0 : 14)} width={80} height={152} rx={36} fill={FUR2} />
      <rect x={90} y={-150 + (sw > 0 ? 14 : 0)} width={80} height={152} rx={36} fill={FUR2} />
      <ellipse cx={0} cy={-210 + sw * 5} rx={250} ry={200} fill={FUR} />
      <ellipse cx={0} cy={-300} rx={160} ry={90} fill="#7a5238" opacity={0.5} />
      <g transform={`translate(${sw * 10} ${-330 + Math.abs(sw) * -6})`}>
        <circle cx={-92} cy={-72} r={36} fill={FUR} /><circle cx={-92} cy={-72} r={19} fill="#7a5a44" /><circle cx={92} cy={-72} r={36} fill={FUR} /><circle cx={92} cy={-72} r={19} fill="#7a5a44" />
        <ellipse cx={0} cy={0} rx={116} ry={98} fill={FUR} />
        <ellipse cx={0} cy={36} rx={62} ry={46} fill={SNOUT} />
        <ellipse cx={0} cy={18} rx={24} ry={16} fill="#1a1210" />
        <path d="M-22 56 Q0 70 22 56" stroke="#2a1410" strokeWidth={5} fill="none" strokeLinecap="round" />
        <ellipse cx={-48} cy={-18} rx={12} ry={10} fill="#fff" /><circle cx={-48} cy={-16} r={6} fill="#1a1210" /><ellipse cx={48} cy={-18} rx={12} ry={10} fill="#fff" /><circle cx={48} cy={-16} r={6} fill="#1a1210" />
        <path d="M-70 -42 L-28 -32 M70 -42 L28 -32" stroke="#2a1a10" strokeWidth={8} strokeLinecap="round" />
      </g>
    </g>
  );
};

// ================= forest =================
const tods = (tod: number) => {
  const day = ['#6cbcf4', '#e6f6ff'], gold = ['#8ab8e0', '#ffe3a8'], eve = ['#d9805a', '#ffc47a'], dusk = ['#4a4468', '#f08a58'];
  const pick = (a: string[], b: string[], k: number) => [mixc(a[0], b[0], k), mixc(a[1], b[1], k)];
  if (tod < 0.5) return pick(day, gold, tod / 0.5);
  if (tod < 0.8) return pick(gold, eve, (tod - 0.5) / 0.3);
  return pick(eve, dusk, (tod - 0.8) / 0.2);
};
const Pine: React.FC<{x: number; y: number; h: number; c1: string; c2: string}> = ({x, y, h, c1, c2}) => (
  <g transform={`translate(${x} ${y})`}>
    <rect x={-h * 0.04} y={-h * 0.25} width={h * 0.08} height={h * 0.25} fill="#4a3220" />
    {[0, 1, 2, 3].map((i) => <polygon key={i} points={`${-h * (0.3 - i * 0.05)},${-h * (0.2 + i * 0.2)} ${h * (0.3 - i * 0.05)},${-h * (0.2 + i * 0.2)} 0,${-h * (0.52 + i * 0.2)}`} fill={i % 2 ? c1 : c2} />)}
  </g>
);
const Oak: React.FC<{x: number; y: number; h: number; c1: string; c2: string}> = ({x, y, h, c1, c2}) => (
  <g transform={`translate(${x} ${y})`}>
    <rect x={-h * 0.05} y={-h * 0.5} width={h * 0.1} height={h * 0.5} fill="#5a4030" />
    <circle cx={0} cy={-h * 0.72} r={h * 0.3} fill={c1} /><circle cx={-h * 0.2} cy={-h * 0.58} r={h * 0.22} fill={c2} /><circle cx={h * 0.22} cy={-h * 0.6} r={h * 0.24} fill={c1} />
  </g>
);

export type FP = {tod: number; cx: number; loc?: string; t: number; sway?: number};
export const Forest: React.FC<FP> = ({tod, cx, loc = 'clearing', t}) => {
  const [top, bot] = tods(tod);
  const warm = clamp((tod - 0.45) / 0.55);
  const gr1 = mixc('#3f8a3a', '#7a8a3a', warm * 0.6), gr2 = mixc('#2e6e30', '#4a6a30', warm * 0.6), dk = mixc('#1f4a28', '#2a3a28', warm), dk2 = mixc('#2a5a2c', '#3a4a2c', warm);
  const par = (k: number) => `translate(${(cx - 960) * k} 0)`;
  const sunX = 1500 + (cx - 960) * 0.9, sunY = 220 + tod * 330;
  const shade = tod > 0.8 ? 0.35 : 0;
  return (
    <g>
      <defs>
        <linearGradient id="f64sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={top} /><stop offset="1" stopColor={bot} /></linearGradient>
        <radialGradient id="f64sun" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#fff6c0" stopOpacity={0.9} /><stop offset="0.4" stopColor="#ffd860" stopOpacity={0.4} /><stop offset="1" stopColor="#ffd860" stopOpacity={0} /></radialGradient>
        <linearGradient id="f64gr" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={mixc('#5a9a44', '#8a8a44', warm * 0.5)} /><stop offset="1" stopColor={mixc('#2e5a2a', '#4a4a2a', warm * 0.5)} /></linearGradient>
      </defs>
      <rect x={-2000} y={-1200} width={9000} height={2300} fill="url(#f64sky)" />
      <g transform={`translate(${sunX} ${sunY})`}><circle r={330} fill="url(#f64sun)" /><circle r={64} fill={mixc('#fff2a0', '#ff9a3a', warm)} /></g>
      <g transform={par(0.15)}>
        <path d="M-1500 760 Q-600 560 200 700 Q900 560 1700 720 Q2500 580 3300 700 Q4200 560 5200 740 L5200 1000 L-1500 1000 Z" fill={mixc('#8ab4a8', '#a8908a', warm)} opacity={0.9} />
      </g>
      <g transform={par(0.3)}>
        {Array.from({length: 46}).map((_, i) => <Pine key={i} x={-1500 + i * 150 + rnd(i) * 60} y={820} h={260 + rnd(i + 3) * 200} c1={mixc(dk2, '#a8c0b0', 0.35)} c2={mixc(dk, '#a8c0b0', 0.35)} />)}
      </g>
      <g transform={par(0.55)}>
        {Array.from({length: 30}).map((_, i) => (i % 3 === 0 ? <Oak key={i} x={-1400 + i * 230 + rnd(i + 20) * 80} y={880} h={340 + rnd(i + 5) * 160} c1={gr1} c2={gr2} /> : <Pine key={i} x={-1400 + i * 230 + rnd(i + 20) * 80} y={880} h={380 + rnd(i + 5) * 220} c1={gr1} c2={gr2} />))}
      </g>
      <rect x={-2000} y={G - 20} width={9000} height={800} fill="url(#f64gr)" />
      {loc === 'road' && <polygon points="-2000,950 7000,930 7000,1200 -2000,1200" fill="#9a7a58" />}
      {loc === 'road' && <polygon points="-2000,950 7000,930 7000,950 -2000,970" fill="#b8956a" opacity={0.7} />}
      {loc !== 'road' && <path d="M-2000 990 Q1000 960 2400 975 T7000 985 L7000 1060 L-2000 1060 Z" fill={mixc('#b59a6a', '#9a8460', warm)} opacity={0.75} />}
      {Array.from({length: 60}).map((_, i) => <g key={i} transform={`translate(${-800 + i * 120 + rnd(i + 9) * 60} ${G + 20 + rnd(i + 2) * 120})`}><path d={`M0 0 Q${4 + Math.sin(t * 1.5 + i) * 3} -18 ${8 + Math.sin(t * 1.5 + i) * 5} -34`} stroke={mixc('#4a9a3a', '#8a9a3a', warm)} strokeWidth={4} fill="none" /><path d={`M8 0 Q${12 + Math.sin(t * 1.7 + i) * 3} -14 ${16 + Math.sin(t * 1.7 + i) * 4} -26`} stroke={mixc('#5aaa44', '#9aa44a', warm)} strokeWidth={3} fill="none" /></g>)}
      {/* light shafts */}
      {Array.from({length: 7}).map((_, i) => <polygon key={i} points={`${sunX - 300 + i * 230},-100 ${sunX - 220 + i * 230},-100 ${sunX - 700 + i * 360},${G} ${sunX - 900 + i * 360},${G}`} fill="#fff3b0" opacity={(0.05 + 0.03 * Math.sin(t * 0.6 + i)) * (1 - warm * 0.4)} transform={`translate(${(cx - 960) * 0.1} 0)`} />)}
      {loc === 'clearing' && <g>
        <g transform="translate(1750 920)"><Pine x={0} y={0} h={720} c1="#2f7a34" c2="#256a2c" /></g>
        <g transform="translate(2560 930)"><rect x={-190} y={-52} width={380} height={52} rx={24} fill="#4a3220" /><ellipse cx={190} cy={-26} rx={14} ry={26} fill="#8a6a44" /><rect x={-190} y={-52} width={380} height={14} rx={7} fill="#5e422a" /><path d="M-150 -52 q10 -22 28 -8" stroke="#2a4a28" strokeWidth={6} fill="none" /></g>
      </g>}
      {loc === 'cabin' && <g transform="translate(3300 940)"><rect x={-260} y={-250} width={520} height={250} fill="#6a4a2e" /><polygon points="-290,-250 290,-250 0,-400" fill="#4a3220" /><rect x={-60} y={-170} width={120} height={170} fill="#3a2a1a" /><rect x={120} y={-190} width={90} height={80} fill="#ffe7a0" opacity={0.9} />{Array.from({length: 8}).map((_, i) => <rect key={i} x={-260} y={-244 + i * 31} width={520} height={3} fill="#4a3220" />)}<g transform="translate(-420 0)"><rect x={-130} y={-100} width={260} height={80} rx={16} fill="#3a6a8a" /><rect x={-80} y={-150} width={160} height={55} rx={10} fill="#bfe0f0" /><circle cx={-80} cy={-14} r={26} fill="#15171c" /><circle cx={80} cy={-14} r={26} fill="#15171c" /></g></g>}
      {Array.from({length: 18}).map((_, i) => <circle key={i} cx={((i * 331 + t * (8 + rnd(i) * 10)) % 2400) - 200 + (cx - 960)} cy={180 + (i * 97) % 600} r={2.5} fill="#fff7c0" opacity={0.45 * (1 - warm * 0.5)} />)}
      <rect x={-2000} y={-1200} width={9000} height={2400} fill="#1a1030" opacity={shade * (tod - 0.8) * 3} />
      <rect x={-2000} y={-1200} width={9000} height={2400} fill="#ff9a30" opacity={warm * 0.12} />
    </g>
  );
};

export const BearHeadClose: React.FC<{t: number; mood: string; tod: number}> = ({t, mood, tod}) => (
  <g>
    <Forest tod={tod} cx={960} loc="clearing" t={t} />
    <rect x={-2000} y={-1200} width={9000} height={2400} fill="#1a2a18" opacity={0.55} />
    <g transform={`translate(1000 ${600 + Math.sin(t * 1.4) * 6}) scale(3.3)`}><BearHead t={t} mood={mood} /></g>
  </g>
);

export const PawsClose: React.FC<{t: number; speed: number; tod: number}> = ({t, speed, tod}) => (
  <g>
    <Forest tod={tod} cx={960} loc="clearing" t={t} />
    <rect x={-2000} y={600} width={9000} height={800} fill="#3a2a1a" opacity={0.0} />
    {[0, 1, 2, 3].map((i) => {
      const ph = (t * speed + i * 0.25) % 1;
      const x = 300 + i * 420 - ph * 120;
      const lift = Math.max(0, Math.sin(ph * Math.PI)) * 90;
      return (
        <g key={i} transform={`translate(${x} ${980 - lift})`}>
          <ellipse cx={0} cy={lift} rx={120} ry={20} fill="#000" opacity={0.25} />
          <rect x={-70} y={-300} width={140} height={300} rx={60} fill={i % 2 ? FUR2 : FUR} />
          <ellipse cx={0} cy={-6} rx={110} ry={46} fill="#2a1a10" />
          {[-60, -30, 0, 30, 60].map((cxk) => <ellipse key={cxk} cx={cxk} cy={22} rx={9} ry={17} fill="#e8dcc4" />)}
        </g>
      );
    })}
    {ease(clamp(t % 1)) > 0.0 && [0, 1, 2].map((i) => <circle key={i} cx={300 + i * 600} cy={1010} r={8 + ((t * 40 + i * 20) % 30)} fill="#6a5238" opacity={0.3} />)}
  </g>
);

export const PhoneGround: React.FC<{t: number; ring: boolean}> = ({t, ring}) => (
  <g>
    <Full c="#3a2c1c" />
    <rect x={-2000} y={640} width={9000} height={800} fill="#4a3a24" />
    {Array.from({length: 40}).map((_, i) => <path key={i} d={`M${rnd(i) * 3600 - 800} ${700 + rnd(i + 4) * 380} q10 -30 20 -50`} stroke="#3f6a2c" strokeWidth={5} fill="none" />)}
    <g transform={`translate(960 ${620}) rotate(-8)`}>
      <rect x={-130} y={-240} width={260} height={480} rx={36} fill="#0b0d12" stroke="#2a303c" strokeWidth={8} />
      <rect x={-114} y={-224} width={228} height={448} rx={26} fill={ring ? '#1f3a58' : '#0b0d12'} />
      {ring && <g><circle cx={0} cy={-60} r={52 + Math.sin(t * 12) * 6} fill="#3bff7a" opacity={0.25} /><circle cx={0} cy={-60} r={40} fill="#2a7a4a" /><Tx x={0} y={-48} size={40} fill="#fff">☎</Tx><Tx x={0} y={90} size={34} fill="#fff">Мама</Tx><Tx x={0} y={140} size={24} fill="#9fb4d0">входящий вызов</Tx></g>}
      {ring && <Glow x={0} y={0} r={360} c="#6fb8ff" o={0.22 + 0.1 * Math.sin(t * 12)} id="pg64" />}
    </g>
  </g>
);

export const BackpackClose: React.FC<{t: number; paw: number}> = ({t, paw}) => (
  <g>
    <Full c="#2a2418" />
    <rect x={-2000} y={760} width={9000} height={700} fill="#3a2e1c" />
    <g transform="translate(900 780)">
      <rect x={-280} y={-300} width={560} height={320} rx={80} fill="#15171c" stroke="#262a33" strokeWidth={8} />
      <rect x={-220} y={-230} width={440} height={110} rx={30} fill="#1d2027" /><path d="M-60 -170 L40 -150" stroke="#3a4050" strokeWidth={8} />
      <path d="M120 -300 l40 90 l-30 20" stroke="#0a0b0e" strokeWidth={12} fill="none" />
    </g>
    <g transform={`translate(${lerp(2200, 1050, E(paw, 0, 1))} ${520 + (1 - E(paw, 0, 1)) * 60}) rotate(${lerp(8, -4, E(paw, 0, 1))})`}>
      <rect x={-60} y={-60} width={700} height={180} rx={80} fill={FUR} /><rect x={-70} y={-40} width={130} height={140} rx={60} fill="#2a1a10" />
      {[-30, 0, 30, 60].map((yk) => <ellipse key={yk} cx={-70} cy={30 + yk * 0.4} rx={16} ry={8} fill="#e8dcc4" transform={`translate(${-yk * 0.1} ${yk * 0.6 - 30})`} />)}
    </g>
  </g>
);

export const Lesnik: React.FC<{x: number; t: number; flip?: boolean}> = ({x, t, flip}) => <Person x={x} y={G + 20} look={RANGER} pose={poseWalk(t, 2.2, 6)} flip={flip} s={0.86} />;
