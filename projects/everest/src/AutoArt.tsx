import React from 'react';
import '@fontsource/montserrat/cyrillic-700.css';
import '@fontsource/montserrat/latin-700.css';
import {clamp, ease, lerp, rnd} from './util';

export const W = 1080;
export const H = 1920;
export const FONT = 'Montserrat, sans-serif';
export const P = (t: number, a: number, b: number) => clamp((t - a) / (b - a));
export const Svg: React.FC<{children: React.ReactNode}> = ({children}) => (
  <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
    {children}
  </svg>
);
export const money = (v: number) => Math.round(v).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

// ======================= people (new, flat, varied) =======================
export type Person = {skin: string; skinDark: string; hair: string; style: 'short' | 'grey' | 'buzz'; jacket: string; jacketDark: string; pants: string; build: number; stubble?: boolean; brow?: number; beltLine?: string};
export const PEOPLE: Record<string, Person> = {
  mech: {skin: '#e8b48a', skinDark: '#c98f66', hair: '#2a2420', style: 'short', jacket: '#2f66bb', jacketDark: '#224c8f', pants: '#1c1f26', build: 0.92, brow: 0},
  owner: {skin: '#d9a47c', skinDark: '#b5805a', hair: '#8d8a85', style: 'grey', jacket: '#7b5233', jacketDark: '#5a3a22', pants: '#3a3d46', build: 1.2, stubble: true, brow: 3},
  client: {skin: '#ecbd96', skinDark: '#c8946c', hair: '#4a3a30', style: 'buzz', jacket: '#2f8f4c', jacketDark: '#1f6a37', pants: '#2b3342', build: 1.02, stubble: true, brow: 1},
};
type Pose = 'stand' | 'walk' | 'crouch' | 'sit' | 'point' | 'tired' | 'wave';
const Limb: React.FC<{pts: [number, number][]; w: number; c: string}> = ({pts, w, c}) => (
  <polyline points={pts.map((p) => p.join(',')).join(' ')} stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" fill="none" />
);
export const Man: React.FC<{p: Person; x: number; y: number; s?: number; pose?: Pose; t?: number; flip?: boolean; look?: number; mood?: 'neutral' | 'tired' | 'happy' | 'worried'; hold?: React.ReactNode}> = ({p, x, y, s = 1, pose = 'stand', t = 0, flip, look = 0, mood = 'neutral', hold}) => {
  const b = p.build;
  const sw = Math.sin(t * 8);
  let hipX = 0, hipY = -230, shY = -430, shX = 0, headX = 0, headY = -492;
  let legL: [number, number][] = [[-26 * b, -230], [-28 * b, -118], [-30 * b, -4]];
  let legR: [number, number][] = [[26 * b, -230], [28 * b, -118], [30 * b, -4]];
  let armL: [number, number][] = [[-58 * b, -420], [-72 * b, -330], [-70 * b, -246]];
  let armR: [number, number][] = [[58 * b, -420], [72 * b, -330], [70 * b, -246]];
  let torsoRot = 0;
  if (pose === 'walk') {
    legL = [[-24 * b, -230], [-20 * b + sw * 30, -118], [-18 * b + sw * 62, -6]];
    legR = [[24 * b, -230], [20 * b - sw * 30, -118], [18 * b - sw * 62, -6]];
    armL = [[-58 * b, -420], [-64 * b - sw * 28, -330], [-60 * b - sw * 50, -250]];
    armR = [[58 * b, -420], [64 * b + sw * 28, -330], [60 * b + sw * 50, -250]];
  } else if (pose === 'crouch') {
    hipX = -20; hipY = -120; torsoRot = 38; shX = 30; shY = -300; headX = 120; headY = -330;
    legL = [[-20, -120], [70, -160], [40, -4]];
    legR = [[-6, -120], [96, -140], [64, -4]];
    armL = [[70, -300], [150, -250], [215 + sw * 6, -190]];
    armR = [[80, -310], [160, -270], [225 - sw * 6, -200]];
  } else if (pose === 'sit') {
    hipY = -118; shY = -318; headY = -380;
    legL = [[-20 * b, -118], [150, -118], [160, -4]];
    legR = [[10 * b, -118], [170, -118], [180, -4]];
    armL = [[-48 * b, -308], [-30, -220], [60, -150]];
    armR = [[48 * b, -308], [70, -220], [140, -140]];
  } else if (pose === 'point') {
    armR = [[58 * b, -420], [150, -420], [250, -410]];
  } else if (pose === 'tired') {
    headX = 14; headY = -482;
    armL = [[-58 * b, -418], [-76 * b, -320], [-60 * b, -236]];
    armR = [[58 * b, -418], [86 * b, -330], [74 * b, -250]];
  } else if (pose === 'wave') {
    armR = [[58 * b, -420], [110, -500], [120 + sw * 20, -590]];
  }
  const eyeY = headY - 6;
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
      <ellipse cx={30} cy={4} rx={130} ry={14} fill="#000" opacity={0.18} />
      <Limb pts={legL} w={46 * b} c={p.pants} />
      <Limb pts={legR} w={46 * b} c={p.pants} />
      <ellipse cx={legL[2][0] - 6} cy={legL[2][1] + 2} rx={36} ry={16} fill="#17181d" />
      <ellipse cx={legR[2][0] + 6} cy={legR[2][1] + 2} rx={36} ry={16} fill="#17181d" />
      <g transform={`rotate(${torsoRot} ${hipX} ${hipY})`}>
        <path d={`M${hipX - 74 * b} ${hipY} Q${shX - 86 * b} ${(hipY + shY) / 2} ${shX - 64 * b} ${shY} L${shX + 64 * b} ${shY} Q${shX + 86 * b} ${(hipY + shY) / 2} ${hipX + 74 * b} ${hipY} Z`} fill={p.jacket} />
        <path d={`M${shX + 10 * b} ${shY} L${shX + 64 * b} ${shY} Q${shX + 86 * b} ${(hipY + shY) / 2} ${hipX + 74 * b} ${hipY} L${hipX + 20 * b} ${hipY} Z`} fill={p.jacketDark} opacity={0.55} />
        <rect x={shX - 4} y={shY + 8} width={8} height={hipY - shY - 10} fill={p.jacketDark} opacity={0.6} />
      </g>
      {pose !== 'crouch' && <Limb pts={armL} w={34 * b} c={p.jacket} />}
      {pose !== 'crouch' && <Limb pts={armR} w={34 * b} c={p.jacketDark} />}
      <rect x={headX - 14} y={headY + 26} width={28} height={34} fill={p.skinDark} />
      <ellipse cx={headX} cy={headY} rx={42 * (0.96 + b * 0.04)} ry={52} fill={p.skin} />
      <ellipse cx={headX + 22} cy={headY + 10} rx={18} ry={38} fill={p.skinDark} opacity={0.25} />
      <ellipse cx={headX - 42} cy={headY + 8} rx={8} ry={14} fill={p.skinDark} />
      <ellipse cx={headX + 42} cy={headY + 8} rx={8} ry={14} fill={p.skinDark} />
      {p.style === 'short' && <path d={`M${headX - 44} ${headY - 8} Q${headX - 46} ${headY - 66} ${headX} ${headY - 62} Q${headX + 48} ${headY - 62} ${headX + 44} ${headY - 8} Q${headX + 20} ${headY - 36} ${headX - 16} ${headY - 32} Q${headX - 34} ${headY - 28} ${headX - 44} ${headY - 8} Z`} fill={p.hair} />}
      {p.style === 'grey' && (
        <g fill={p.hair}>
          <path d={`M${headX - 44} ${headY + 4} Q${headX - 52} ${headY - 36} ${headX - 24} ${headY - 52} Q${headX - 10} ${headY - 30} ${headX - 30} ${headY - 8} Z`} />
          <path d={`M${headX + 44} ${headY + 4} Q${headX + 52} ${headY - 36} ${headX + 24} ${headY - 52} Q${headX + 10} ${headY - 30} ${headX + 30} ${headY - 8} Z`} />
          <path d={`M${headX - 20} ${headY - 54} Q${headX} ${headY - 62} ${headX + 20} ${headY - 54} Q${headX} ${headY - 48} ${headX - 20} ${headY - 54} Z`} />
        </g>
      )}
      {p.style === 'buzz' && <path d={`M${headX - 43} ${headY - 10} Q${headX - 46} ${headY - 58} ${headX} ${headY - 56} Q${headX + 46} ${headY - 58} ${headX + 43} ${headY - 10} Q${headX + 22} ${headY - 34} ${headX} ${headY - 36} Q${headX - 22} ${headY - 34} ${headX - 43} ${headY - 10} Z`} fill={p.hair} opacity={0.9} />}
      {[-1, 1].map((sd) => (
        <g key={sd}>
          <ellipse cx={headX + sd * 18} cy={eyeY} rx={7} ry={mood === 'tired' ? 4 : 8} fill="#fff" />
          <circle cx={headX + sd * 18 + look * 3} cy={eyeY + 1} r={4} fill="#1b1b22" />
          <path d={`M${headX + sd * 18 - 11} ${eyeY - 15 - (p.brow ?? 0) * (sd === 1 ? 0 : 0)} L${headX + sd * 18 + 11} ${eyeY - 15 - (mood === 'worried' ? sd * -4 : 0)}`} stroke={p.style === 'grey' ? '#55524e' : p.hair} strokeWidth={5} strokeLinecap="round" />
        </g>
      ))}
      <path d={`M${headX + 2} ${eyeY + 6} Q${headX + 10} ${eyeY + 24} ${headX} ${eyeY + 28}`} stroke={p.skinDark} strokeWidth={4} fill="none" strokeLinecap="round" />
      {p.stubble && Array.from({length: 22}).map((_, i) => <circle key={i} cx={headX + (rnd(i) - 0.5) * 60} cy={headY + 22 + rnd(i + 3) * 30} r={1.6} fill="#4a4540" opacity={0.7} />)}
      {mood === 'happy' && <path d={`M${headX - 16} ${headY + 30} Q${headX} ${headY + 48} ${headX + 16} ${headY + 30}`} stroke="#8a3a30" strokeWidth={5} fill="none" strokeLinecap="round" />}
      {mood === 'neutral' && <path d={`M${headX - 12} ${headY + 34} L${headX + 12} ${headY + 34}`} stroke="#8a3a30" strokeWidth={5} strokeLinecap="round" />}
      {mood === 'tired' && <path d={`M${headX - 12} ${headY + 38} Q${headX} ${headY + 30} ${headX + 12} ${headY + 38}`} stroke="#8a3a30" strokeWidth={5} fill="none" strokeLinecap="round" />}
      {mood === 'worried' && <path d={`M${headX - 14} ${headY + 40} Q${headX} ${headY + 28} ${headX + 14} ${headY + 40}`} stroke="#8a3a30" strokeWidth={5} fill="none" strokeLinecap="round" />}
      {pose === 'crouch' && (
        <g>
          <Limb pts={armL} w={34 * b} c={p.jacket} />
          <Limb pts={armR} w={34 * b} c={p.jacketDark} />
          <circle cx={armR[2][0]} cy={armR[2][1]} r={17} fill={p.skin} />
        </g>
      )}
      {pose !== 'crouch' && (
        <g>
          <circle cx={armL[2][0]} cy={armL[2][1]} r={17} fill={p.skin} />
          <circle cx={armR[2][0]} cy={armR[2][1]} r={17} fill={p.skin} />
        </g>
      )}
      {hold}
    </g>
  );
};

// ======================= phone, finger, cards =======================
export const PhoneShell: React.FC<{x: number; y: number; s?: number; rot?: number; children?: React.ReactNode}> = ({x, y, s = 1, rot = 0, children}) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <rect x={-190} y={-380} width={380} height={760} rx={52} fill="#101218" stroke="#30343f" strokeWidth={8} />
    <rect x={-172} y={-356} width={344} height={712} rx={38} fill="#f6f7fb" />
    <rect x={-48} y={-370} width={96} height={16} rx={8} fill="#101218" />
    <g clipPath="url(#scr)">
      <defs>
        <clipPath id="scr">
          <rect x={-172} y={-356} width={344} height={712} rx={38} />
        </clipPath>
      </defs>
      {children}
    </g>
  </g>
);
export const Finger: React.FC<{x: number; y: number; press?: number; rot?: number}> = ({x, y, press = 0, rot = 20}) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${1 - 0.08 * press})`}>
    <rect x={-22} y={0} width={44} height={420} rx={22} fill="#e8b48a" />
    <rect x={-22} y={0} width={20} height={420} rx={10} fill="#c98f66" opacity={0.35} />
    <ellipse cx={0} cy={6} rx={21} ry={14} fill="#f1c4a0" />
    <rect x={-80} y={250} width={150} height={320} rx={50} fill="#e8b48a" />
    <rect x={20} y={270} width={44} height={150} rx={22} fill="#e8b48a" transform="rotate(8 40 270)" />
  </g>
);
export const Card: React.FC<{x: number; y: number; w: number; h: number; k?: number; accent?: string; children?: React.ReactNode}> = ({x, y, w, h, k = 1, accent = '#ffffff', children}) => (
  <g transform={`translate(${x} ${y}) scale(${0.85 + 0.15 * k})`} opacity={k}>
    <rect x={-w / 2 + 6} y={-h / 2 + 10} width={w} height={h} rx={28} fill="#000" opacity={0.18} />
    <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={28} fill={accent} stroke="#1f2a44" strokeWidth={5} />
    {children}
  </g>
);

// ======================= HUD balance =======================
export const BalanceHud: React.FC<{value: number; delta?: {text: string; color: string; k: number} | null}> = ({value, delta}) => (
  <g>
    <rect x={36} y={130} width={420} height={116} rx={26} fill="#0f1b33" opacity={0.92} stroke="#ffd23f" strokeWidth={4} />
    <text x={64} y={172} fontFamily={FONT} fontWeight={700} fontSize={24} fill="#ffd23f" letterSpacing={2}>БАЛАНС</text>
    <text x={64} y={224} fontFamily={FONT} fontWeight={700} fontSize={54} fill="#ffffff">{`${money(value)} ₽`}</text>
    {delta && (
      <text x={470} y={210 - delta.k * 30} fontFamily={FONT} fontWeight={700} fontSize={54} fill={delta.color} opacity={1 - delta.k * 0.4}>{delta.text}</text>
    )}
  </g>
);

// ======================= places =======================
const Lamp: React.FC<{x: number; y: number; r?: number; o?: number}> = ({x, y, r = 300, o = 0.35}) => (
  <g>
    <defs>
      <radialGradient id={`lg${Math.round(x)}`} cx="0.5" cy="0.5" r="0.5">
        <stop offset="0" stopColor="#ffd28a" stopOpacity={o} />
        <stop offset="1" stopColor="#ffd28a" stopOpacity={0} />
      </radialGradient>
    </defs>
    <circle cx={x} cy={y} r={r} fill={`url(#lg${Math.round(x)})`} />
    <rect x={x - 3} y={y - 160} width={6} height={110} fill="#3a3f4a" />
    <path d={`M${x - 50} ${y - 50} L${x + 50} ${y - 50} L${x + 30} ${y - 10} L${x - 30} ${y - 10} Z`} fill="#4a505c" />
    <ellipse cx={x} cy={y - 8} rx={26} ry={8} fill="#fff1c0" />
  </g>
);

export const Zhiguli: React.FC<{x: number; y: number; s?: number; wheelRot?: number; color?: string; lada?: boolean}> = ({x, y, s = 1, wheelRot = 0, color = '#d9c9a2', lada}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse cx={0} cy={8} rx={300} ry={20} fill="#000" opacity={0.25} />
    <path d="M-290 -40 L-290 -118 Q-290 -136 -268 -140 L-170 -148 L-110 -214 L70 -214 L140 -150 L262 -140 Q290 -136 290 -112 L290 -40 Z" fill={color} />
    <path d="M-168 -148 L-112 -204 L-6 -204 L-6 -148 Z M10 -148 L10 -204 L66 -204 L126 -148 Z" fill="#7fa9c6" opacity={0.85} />
    <rect x={-290} y={-70} width={580} height={10} fill="#000" opacity={0.12} />
    <rect x={260} y={-110} width={34} height={22} rx={4} fill="#fff2b0" />
    <rect x={-294} y={-110} width={22} height={22} rx={4} fill="#c0392b" />
    {[-170, 170].map((c, i) => (
      <g key={i}>
        <circle cx={c} cy={-34} r={54} fill="#17181d" />
        <circle cx={c} cy={-34} r={30} fill="#b8bcc6" />
        <g transform={`rotate(${wheelRot} ${c} -34)`}>
          {[0, 72, 144, 216, 288].map((a) => <circle key={a} cx={c + Math.cos((a * Math.PI) / 180) * 18} cy={-34 + Math.sin((a * Math.PI) / 180) * 18} r={5} fill="#555a66" />)}
        </g>
      </g>
    ))}
    {lada && <rect x={-40} y={-100} width={80} height={14} fill="#fff" opacity={0.5} />}
  </g>
);

export const Workshop: React.FC<{t: number; wheelRot?: number; night?: boolean}> = ({t, wheelRot = 0, night = true}) => (
  <g>
    <defs>
      <linearGradient id="wsw" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor={night ? '#3a4660' : '#9fb1c8'} />
        <stop offset="1" stopColor={night ? '#2a3348' : '#7e90a8'} />
      </linearGradient>
    </defs>
    <rect x={-500} y={-900} width={2080} height={2200} fill="url(#wsw)" />
    {Array.from({length: 10}).map((_, i) => <rect key={i} x={-400 + i * 220} y={-900} width={4} height={2200} fill="#000" opacity={0.08} />)}
    <rect x={-500} y={900} width={2080} height={600} fill={night ? '#4a4f5a' : '#8a909c'} />
    <rect x={-500} y={894} width={2080} height={12} fill="#2a2e38" opacity={0.5} />
    {Array.from({length: 6}).map((_, i) => <ellipse key={i} cx={100 + rnd(i) * 900} cy={980 + rnd(i + 3) * 300} rx={60 + rnd(i) * 80} ry={10} fill="#2f333c" opacity={0.35} />)}
    {/* pegboard with tools */}
    <rect x={60} y={380} width={380} height={300} rx={8} fill="#c9a36a" stroke="#6a4a22" strokeWidth={8} />
    {Array.from({length: 7}).map((_, i) => <rect key={i} x={86 + i * 52} y={420} width={10} height={220} fill="#7a5a2a" opacity={0.6} />)}
    {[0, 1, 2, 3, 4].map((i) => <rect key={i} x={92 + i * 68} y={440 + (i % 2) * 40} width={20} height={150} rx={6} fill={['#b33', '#37a', '#888', '#c90', '#2a7'][i]} />)}
    {/* window */}
    <rect x={640} y={330} width={320} height={240} rx={8} fill={night ? '#0e1426' : '#bfe3ff'} stroke="#2a2e38" strokeWidth={12} />
    <rect x={796} y={330} width={8} height={240} fill="#2a2e38" />
    {night && Array.from({length: 8}).map((_, i) => <circle key={i} cx={670 + rnd(i) * 270} cy={350 + rnd(i + 1) * 100} r={2} fill="#dfe9ff" />)}
    <Lamp x={300} y={360} />
    <Lamp x={800} y={340} o={0.3} />
    {/* tire stack */}
    {[0, 1, 2].map((i) => <ellipse key={i} cx={960} cy={880 - i * 40} rx={70} ry={24} fill="#1c1d22" stroke="#33353d" strokeWidth={6} />)}
    <Zhiguli x={560} y={900} s={1.5} wheelRot={wheelRot} />
  </g>
);

export const Sofa: React.FC<{x: number; y: number; s?: number}> = ({x, y, s = 1}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse cx={0} cy={6} rx={260} ry={16} fill="#000" opacity={0.2} />
    <rect x={-250} y={-150} width={500} height={150} rx={30} fill="#7a5a44" />
    <rect x={-270} y={-230} width={540} height={110} rx={40} fill="#8d6a52" />
    <rect x={-270} y={-110} width={60} height={110} rx={26} fill="#6a4c38" />
    <rect x={210} y={-110} width={60} height={110} rx={26} fill="#6a4c38" />
    {Array.from({length: 6}).map((_, i) => <circle key={i} cx={-200 + i * 80} cy={-176} r={4} fill="#5a3f2e" />)}
    <rect x={150} y={-168} width={70} height={30} rx={14} fill="#e9a23a" transform="rotate(-8 185 -150)" />
  </g>
);

export const GarageRow: React.FC<{t: number; pan?: number; gateOpen?: number}> = ({t, pan = 0, gateOpen = 0}) => (
  <g>
    <defs>
      <linearGradient id="gsky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#9ec6e8" />
        <stop offset="1" stopColor="#e4eef6" />
      </linearGradient>
    </defs>
    <rect x={-600} y={-900} width={2300} height={2200} fill="url(#gsky)" />
    {/* panel buildings behind */}
    {[0, 1, 2].map((i) => (
      <g key={i} transform={`translate(${-100 + i * 480 - pan * 0.3} 300)`}>
        <rect x={0} y={0} width={420} height={640} fill="#b9bfc9" />
        {Array.from({length: 6}).map((_, r) => Array.from({length: 4}).map((_, c) => <rect key={`${r}${c}`} x={30 + c * 92} y={30 + r * 100} width={60} height={70} fill={rnd(i * 24 + r * 4 + c) > 0.7 ? '#ffe9a0' : '#7d95b5'} />))}
      </g>
    ))}
    <rect x={-600} y={900} width={2300} height={500} fill="#6d7078" />
    {Array.from({length: 9}).map((_, i) => <ellipse key={i} cx={-200 + i * 280 - pan * 0.2} cy={1130 + (i % 3) * 60} rx={90} ry={10} fill="#5a8fb0" opacity={0.45} />)}
    <g transform={`translate(${-pan} 0)`}>
      {Array.from({length: 8}).map((_, i) => {
        const cols = ['#4a7a9a', '#b04a3a', '#5a8a4a', '#8a6a3a', '#7a7f8a', '#3a6a8a', '#a06a3a', '#6a4a8a'];
        return (
          <g key={i} transform={`translate(${-100 + i * 300} 640)`}>
            <rect x={0} y={0} width={290} height={290} fill={i % 2 ? '#a9764e' : '#9a9aa4'} stroke="#555" strokeWidth={4} />
            <rect x={0} y={-30} width={290} height={34} fill="#4a4d56" />
            <rect x={20} y={40} width={250} height={250} fill={cols[i]} stroke="#2a2e38" strokeWidth={6} />
            {i === 3 ? (
              <g>
                <rect x={20} y={40} width={lerp(250, 14, gateOpen) / 2} height={250} fill={cols[i]} stroke="#2a2e38" strokeWidth={6} />
                <rect x={270 - lerp(250, 14, gateOpen) / 2} y={40} width={lerp(250, 14, gateOpen) / 2} height={250} fill={cols[i]} stroke="#2a2e38" strokeWidth={6} />
                {gateOpen > 0 && <rect x={20 + lerp(250, 14, gateOpen) / 2} y={40} width={250 - lerp(250, 14, gateOpen)} height={250} fill="#2a2e38" />}
              </g>
            ) : (
              <g>
                {[0, 1, 2, 3].map((q) => <rect key={q} x={20} y={90 + q * 50} width={250} height={5} fill="#000" opacity={0.2} />)}
                <rect x={130} y={140} width={30} height={14} rx={4} fill="#333" />
              </g>
            )}
            <text x={145} y={25} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={22} fill="#fff">{`№${12 + i}`}</text>
          </g>
        );
      })}
      {[100, 700, 1300].map((x) => (
        <g key={x} transform={`translate(${x} 900)`}>
          <rect x={-6} y={-460} width={12} height={460} fill="#3a3f4a" />
          <rect x={-6} y={-460} width={110} height={10} fill="#3a3f4a" />
          <ellipse cx={100} cy={-448} rx={22} ry={8} fill="#fff1c0" />
        </g>
      ))}
      <path d="M-200 480 Q300 540 800 470 T1800 500" stroke="#2a2e38" strokeWidth={4} fill="none" />
      <path d="M-200 520 Q400 580 900 500 T1800 540" stroke="#2a2e38" strokeWidth={4} fill="none" />
    </g>
    <rect x={-600} y={1240} width={2300} height={420} fill="#4a4d56" />
    {Array.from({length: 8}).map((_, i) => <rect key={i} x={((i * 230 - t * 520) % 1840) - 200} y={1440} width={130} height={12} fill="#f0f0f0" />)}
    {[0, 1].map((i) => (
      <g key={i} transform={`translate(${((i * 900 + t * 380 * (i ? -1 : 1) + 600) % 1900) - 300} ${1360 + i * 150})`}>
        <rect x={-110} y={-70} width={220} height={60} rx={20} fill={['#c0392b', '#2a6ad0'][i]} />
        <rect x={-70} y={-110} width={120} height={50} rx={14} fill={['#a03024', '#1f52a8'][i]} />
        <circle cx={-60} cy={-6} r={22} fill="#17181d" />
        <circle cx={60} cy={-6} r={22} fill="#17181d" />
      </g>
    ))}
  </g>
);

export const GarageInside: React.FC<{t: number; lightShaft?: number}> = ({t, lightShaft = 0.5}) => (
  <g>
    <rect x={-500} y={-900} width={2080} height={2200} fill="#59606c" />
    {Array.from({length: 12}).map((_, i) => <rect key={i} x={-400 + i * 200} y={-900} width={5} height={2200} fill="#000" opacity={0.12} />)}
    <rect x={-500} y={880} width={2080} height={600} fill="#7d828c" />
    <rect x={-500} y={874} width={2080} height={12} fill="#2f3340" opacity={0.5} />
    <polygon points="800,-300 1100,-300 800,1100 300,1100" fill="#fff6c8" opacity={0.14 * lightShaft} />
    {Array.from({length: 7}).map((_, i) => <rect key={i} x={100 + i * 130} y={920 + (i % 3) * 40} width={80} height={5} fill="#000" opacity={0.15} />)}
    <rect x={40} y={420} width={230} height={400} fill="#2e323c" opacity={0.6} />
    <rect x={40} y={410} width={230} height={14} fill="#4a4f5a" />
    <rect x={40} y={620} width={230} height={14} fill="#4a4f5a" />
    <ellipse cx={540} cy={290} rx={160} ry={14} fill="#fff1c0" opacity={0.6} />
    <rect x={536} y={-120} width={8} height={400} fill="#3a3f4a" />
  </g>
);

// ======================= product illustrations =======================
export const IconLift: React.FC<{s?: number}> = ({s = 1}) => (
  <g transform={`scale(${s})`}>
    <rect x={-160} y={60} width={320} height={26} rx={8} fill="#3a4156" />
    <rect x={-130} y={-150} width={34} height={220} rx={8} fill="#f2c200" />
    <rect x={96} y={-150} width={34} height={220} rx={8} fill="#f2c200" />
    <rect x={-130} y={-150} width={260} height={24} rx={8} fill="#c89b00" />
    <rect x={-110} y={-20} width={220} height={18} rx={6} fill="#6a7186" />
    <path d="M-100 -60 L-60 -100 L60 -100 L100 -60 L100 -22 L-100 -22 Z" fill="#b8c4d8" />
  </g>
);
export const IconTools: React.FC<{s?: number}> = ({s = 1}) => (
  <g transform={`scale(${s})`}>
    <rect x={-120} y={-20} width={240} height={110} rx={16} fill="#d33a2c" stroke="#7a1f16" strokeWidth={6} />
    <rect x={-120} y={-20} width={240} height={28} fill="#a82a1e" />
    <rect x={-30} y={-60} width={60} height={46} rx={10} fill="none" stroke="#333" strokeWidth={10} />
    <rect x={-100} y={20} width={200} height={10} fill="#fff" opacity={0.4} />
  </g>
);
export const IconCompressor: React.FC<{s?: number}> = ({s = 1}) => (
  <g transform={`scale(${s})`}>
    <rect x={-130} y={-40} width={260} height={96} rx={48} fill="#2f6fbb" stroke="#1d467a" strokeWidth={6} />
    <rect x={-100} y={-100} width={90} height={62} rx={10} fill="#4a4f5a" />
    <circle cx={60} cy={-80} r={30} fill="#fff" stroke="#333" strokeWidth={6} />
    <path d="M60 -80 L76 -96" stroke="#d33" strokeWidth={6} />
    <circle cx={-90} cy={70} r={16} fill="#222" />
    <circle cx={90} cy={70} r={16} fill="#222" />
  </g>
);
export const IconJack: React.FC<{s?: number}> = ({s = 1}) => (
  <g transform={`scale(${s})`}>
    <rect x={-130} y={30} width={240} height={40} rx={14} fill="#c0392b" />
    <rect x={30} y={-60} width={44} height={96} rx={10} fill="#7a1f16" />
    <rect x={10} y={-80} width={84} height={26} rx={10} fill="#333" />
    <path d="M-130 50 L-190 20" stroke="#333" strokeWidth={14} strokeLinecap="round" />
    <circle cx={-70} cy={80} r={18} fill="#222" />
    <circle cx={90} cy={80} r={18} fill="#222" />
  </g>
);
