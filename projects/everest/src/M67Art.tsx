import React from 'react';
import '@fontsource/caveat/cyrillic-700.css';
import '@fontsource/caveat/latin-700.css';
import {staticFile} from 'remotion';
import {clamp, ease, lerp, rnd, mixc, Tx, Glow, Person, Look, Pose, poseStand, poseWalk, poseSit, poseReach, E} from './M60Base';

export const Full: React.FC<{c: string; o?: number}> = ({c, o = 1}) => <rect x={-3000} y={-2000} width={14000} height={6000} fill={c} opacity={o} />;
const TEXS = ['concrete', 'rust', 'wood', 'dirt', 'leather', 'wallpaper', 'tile', 'asphalt', 'paper', 'metal', 'fog'];
export const Defs: React.FC = () => (
  <defs>
    {TEXS.map((n) => <pattern key={n} id={`t-${n}`} patternUnits="userSpaceOnUse" width={512} height={512}><image href={staticFile(`tex/${n}.png`)} width={512} height={512} /></pattern>)}
    <linearGradient id="vgrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#000" stopOpacity={0.85} /><stop offset="0.5" stopColor="#000" stopOpacity={0} /><stop offset="1" stopColor="#000" stopOpacity={0.7} /></linearGradient>
  </defs>
);
const P = (n: string) => `url(#t-${n})`;

// ===== looks =====
export const ARTEM: Look = {jacket: '#0b0c10', jacket2: '#16181e', arm: '#0b0c10', pants: '#1c2230', glove: '#cda080', boot: '#e8e8ea', hair: '#1a1512', skin: '#cda080', hat: 'none'};
export const OLEG: Look = {jacket: '#3a3226', jacket2: '#4a4030', arm: '#3a3226', pants: '#1c1e24', glove: '#b88a6a', boot: '#0a0b0e', hair: '#2a2420', skin: '#b88a6a', hat: 'none', stubble: true};
export const BROTHER: Look = {jacket: '#2a3a30', jacket2: '#364a3c', arm: '#2a3a30', pants: '#222a38', glove: '#b88a6a', boot: '#0a0b0e', hair: '#3a2e24', skin: '#b88a6a', hat: 'none', stubble: true};
export const GRAN: Look = {old: true, jacket: '#5a4a5a', jacket2: '#6a5a6a', arm: '#5a4a5a', pants: '#3a3438', glove: '#c9a088', boot: '#1a1a1e', hair: '#c0c0c8', skin: '#c9a088', hat: 'none', fat: 1.1};
export const LERA: Look = {jacket: '#6a2a3a', jacket2: '#7a3a4a', arm: '#6a2a3a', pants: '#242a3a', glove: '#d9b090', boot: '#1a1a1e', hair: '#4a3020', skin: '#d9b090', hat: 'none'};
export const SELLER: Look = {jacket: '#2a5a6a', jacket2: '#3a6a7a', arm: '#2a5a6a', pants: '#2a2a32', glove: '#d9b090', boot: '#1a1a1e', hair: '#5a4030', skin: '#d9b090', hat: 'none'};
export const COP: Look = {jacket: '#1f2f4a', jacket2: '#2a3d5a', arm: '#1f2f4a', pants: '#1a2236', glove: '#c9a088', boot: '#0a0b0e', hair: '#2a2420', skin: '#c9a088', hat: 'beanie', hatCol: '#1f2f4a'};
export const Man: React.FC<{x: number; y: number; pose: Pose; look?: Look; flip?: boolean; s?: number; dark?: number}> = ({x, y, pose, look = ARTEM, flip, s = 1.45, dark = 0}) => (
  <g><Person x={x} y={y} look={look} pose={pose} flip={flip} s={s} />{dark > 0 && <g transform={flip ? `translate(${x} ${y}) scale(${-s} ${s})` : `translate(${x} ${y}) scale(${s})`} opacity={dark}><rect x={-70} y={-340} width={140} height={340} fill="#02040a" opacity={0.0} /></g>}</g>
);

// ===== the kidnapper: tall, thin, hunched, leather apron, face in shadow =====
export const Maniac: React.FC<{x: number; y: number; s?: number; flip?: boolean; t: number; step?: number; arm?: number}> = ({x, y, s = 1, flip, t, step = 0, arm = 0}) => {
  const sw = Math.sin(step * 6.28) * 22;
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
      <g transform="scale(1.28 1)">
      <ellipse cx={0} cy={6} rx={90} ry={10} fill="#000" opacity={0.45} />
      {/* legs */}
      <path d={`M-22 -250 L${-26 + sw} -10 L${6 + sw} -10 L-4 -250 Z`} fill="#0a0b0f" /><path d={`M6 -250 L${22 - sw} -10 L${52 - sw} -10 L28 -250 Z`} fill="#0e1015" />
      <ellipse cx={-10 + sw} cy={-6} rx={30} ry={11} fill="#050608" /><ellipse cx={36 - sw} cy={-6} rx={30} ry={11} fill="#050608" />
      {/* hunched torso */}
      <g transform="rotate(12 0 -250)">
        <path d="M-44 -250 L-58 -470 Q-40 -540 10 -535 Q58 -525 66 -460 L46 -250 Z" fill="#14161c" />
        <path d="M-36 -250 L-46 -430 Q-14 -455 30 -440 L40 -250 Z" fill={P('leather')} />
        <path d="M-36 -250 L-46 -430 Q-14 -455 30 -440 L40 -250 Z" fill="#000" opacity={0.28} />
        <rect x={-30} y={-340} width={46} height={44} rx={5} fill="#000" opacity={0.35} />
        <path d="M-24 -300 L-24 -255 M10 -300 L10 -255" stroke="#5a4a30" strokeWidth={4} opacity={0.6} />
        {/* long arms */}
        <path d={`M-52 -480 Q-96 -380 ${-70 + arm * 40} ${-230 - arm * 110}`} stroke="#14161c" strokeWidth={40} strokeLinecap="round" fill="none" />
        <path d={`M60 -480 Q108 -380 ${86 + arm * 60} ${-250 - arm * 120}`} stroke="#14161c" strokeWidth={40} strokeLinecap="round" fill="none" />
        <circle cx={-70 + arm * 40} cy={-228 - arm * 110} r={16} fill="#2a2420" /><circle cx={86 + arm * 60} cy={-248 - arm * 120} r={16} fill="#2a2420" />
        {/* gaunt head, bowed, face half in shadow */}
        <g transform="translate(14 -566) rotate(14)">
          <path d="M-30 -20 Q-34 -58 2 -60 Q38 -58 34 -18 Q36 14 22 36 Q4 58 -14 36 Q-30 12 -30 -20 Z" fill="#8e7c6c" />
          <path d="M-30 -20 Q-34 -58 2 -60 Q38 -58 34 -18 Q36 14 22 36 Q4 58 -14 36 Q-30 12 -30 -20 Z" fill="#000" opacity={0.28} />
          <ellipse cx={-14} cy={-10} rx={11} ry={9} fill="#14100e" /><ellipse cx={16} cy={-10} rx={11} ry={9} fill="#14100e" />
          <circle cx={-13} cy={-8} r={3.4} fill="#e8e0cc" /><circle cx={17} cy={-8} r={3.4} fill="#e8e0cc" /><circle cx={-13} cy={-8} r={1.4} fill="#0a0a0a" /><circle cx={17} cy={-8} r={1.4} fill="#0a0a0a" />
          <path d="M-26 -22 L-6 -17 M28 -22 L8 -17" stroke="#1a1410" strokeWidth={5} strokeLinecap="round" />
          <path d="M2 -6 L-2 14 L6 16" stroke="#3a2a20" strokeWidth={3} fill="none" />
          <path d="M-12 30 Q2 34 14 28" stroke="#2a1610" strokeWidth={3} fill="none" strokeLinecap="round" />
          <path d="M-20 12 Q-24 26 -10 40 M26 10 Q30 26 14 42" stroke="#000" strokeWidth={8} opacity={0.3} fill="none" />
          <path d="M-32 -46 Q-8 -78 30 -52 Q4 -60 -32 -46 Z" fill="#1a1410" />
        </g>
      </g>
      </g>
    </g>
  );
};


// ===== big face close-up (scary but not supernatural) =====
export const ManiacFace: React.FC<{t: number; light?: number; look?: number; smoke?: number}> = ({t, light = 1, look = 0, smoke = 0}) => {
  const breathe = 1 + Math.sin(t * 1.6) * 0.006;
  const blink = (Math.sin(t * 0.9) > 0.985) ? 0.15 : 1;
  const ey = -40 - look * 6;
  return (
    <g>
      <Defs />
      <defs>
        <radialGradient id="mfskin" cx="0.42" cy="0.35" r="0.75"><stop offset="0" stopColor="#c0a994" /><stop offset="0.6" stopColor="#8a7664" /><stop offset="1" stopColor="#3a2e26" /></radialGradient>
        <clipPath id="mfclip"><path d="M-190 -110 Q-196 -250 0 -262 Q196 -250 190 -110 Q198 60 120 160 Q60 230 0 232 Q-60 230 -120 160 Q-198 60 -190 -110 Z" /></clipPath>
        <linearGradient id="mfshade" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#000" stopOpacity={0.0} /><stop offset="0.55" stopColor="#000" stopOpacity={0.25} /><stop offset="1" stopColor="#000" stopOpacity={0.88} /></linearGradient>
      </defs>
      <rect x={-100} y={-100} width={2200} height={1300} fill="#07090c" /><rect x={-100} y={-100} width={2200} height={1300} fill={P('concrete')} opacity={0.35} />
      <Glow x={700} y={200} r={900} c="#ffc880" o={0.35 * light} id="mf1" />
      <g transform={`translate(960 600) scale(${breathe * 1.62} ${breathe * 1.5})`}>
        {/* neck + apron strap */}
        <path d="M-130 300 L-110 140 L110 140 L140 300 Z" fill="#6a5a4c" /><path d="M-130 300 L-110 140 L-60 140 L-80 300 Z" fill="#000" opacity={0.4} />
        <path d="M-120 330 L-60 150 L-30 150 L-70 330 Z" fill={P('leather')} /><path d="M120 330 L60 150 L30 150 L70 330 Z" fill={P('leather')} />
        <path d="M-70 150 L-60 250 M-40 150 L-36 260 M30 150 L34 270 M62 150 L70 250" stroke="#2a1e16" strokeWidth={8} opacity={0.6} />
        {/* ears */}
        <ellipse cx={-205} cy={-10} rx={26} ry={44} fill="#7e6a5a" /><ellipse cx={205} cy={-10} rx={26} ry={44} fill="#6a5848" />
        {/* skull / gaunt face */}
        <path d="M-190 -110 Q-196 -250 0 -262 Q196 -250 190 -110 Q198 60 120 160 Q60 230 0 232 Q-60 230 -120 160 Q-198 60 -190 -110 Z" fill="url(#mfskin)" />
        {/* hair (thin, greasy) */}
        <path d="M-196 -120 Q-200 -280 0 -290 Q200 -280 196 -120 Q150 -200 90 -214 Q0 -230 -90 -214 Q-150 -200 -196 -120 Z" fill="#17120e" />
        {Array.from({length: 14}).map((_, k) => <path key={k} d={`M${-170 + k * 26} -200 Q${-160 + k * 26} -170 ${-150 + k * 26} -140`} stroke="#0a0806" strokeWidth={5} fill="none" opacity={0.8} />)}
        {/* sunken cheeks and temples */}
        <ellipse cx={-120} cy={70} rx={40} ry={70} fill="#000" opacity={0.2} /><ellipse cx={120} cy={70} rx={40} ry={70} fill="#000" opacity={0.26} />
        <ellipse cx={-120} cy={-70} rx={50} ry={46} fill="#000" opacity={0.18} />
        {/* brow ridge */}
        <path d="M-150 -84 Q-80 -92 -16 -36 L-16 -18 Q-80 -62 -150 -56 Z" fill="#1c1510" /><path d="M150 -84 Q80 -92 16 -36 L16 -18 Q80 -62 150 -56 Z" fill="#1c1510" />
        {/* eyes sunken */}
        {[-82, 82].map((cx, i) => (
          <g key={i} transform={`translate(${cx} ${ey})`}>
            <ellipse cx={0} cy={4} rx={48} ry={32} fill="#1a120e" opacity={0.85} />
            <ellipse cx={0} cy={0} rx={34} ry={15 * blink} fill="#d8cfba" />
            <ellipse cx={0} cy={0} rx={34} ry={15 * blink} fill="#c04a3a" opacity={0.25} />
            <circle cx={look * 8} cy={-2 - look * 4} r={13 * blink} fill="#3a2a18" /><circle cx={look * 8} cy={-2 - look * 4} r={5.5 * blink} fill="#050505" />
            <path d="M-36 6 Q0 30 36 6" stroke="#2a1a14" strokeWidth={4} fill="none" opacity={0.8} />
          </g>
        ))}
        {/* scar through left brow and cheek */}
        <path d="M-130 -78 Q-100 -20 -118 50" stroke="#7a3a34" strokeWidth={6} fill="none" opacity={0.85} /><path d="M-138 -60 l16 6 M-128 -30 l16 6 M-122 4 l16 6 M-122 30 l16 4" stroke="#6a2a26" strokeWidth={3} opacity={0.7} />
        {/* long nose */}
        <path d="M-6 -30 Q-18 60 -34 100 Q0 124 36 100 Q24 60 10 -30" fill="#7a6858" opacity={0.7} />
        <path d="M6 -10 Q22 70 30 98" stroke="#2a1e16" strokeWidth={6} fill="none" opacity={0.6} />
        <ellipse cx={-14} cy={104} rx={9} ry={5} fill="#0a0604" /><ellipse cx={20} cy={104} rx={9} ry={5} fill="#0a0604" />
        {/* thin cruel mouth, stubble */}
        <path d="M-64 150 Q-6 164 64 146" stroke="#1a0c08" strokeWidth={9} fill="none" strokeLinecap="round" /><path d="M-60 150 Q-6 138 60 144" stroke="#4a2a20" strokeWidth={4} fill="none" opacity={0.7} />
        <path d="M-64 150 Q-76 166 -72 182 M64 146 Q76 160 72 176" stroke="#2a1a14" strokeWidth={5} fill="none" opacity={0.7} />
        {Array.from({length: 120}).map((_, k) => { const r1 = rnd(k), r2 = rnd(k + 9); const x = (r1 - 0.5) * 250, y = 100 + r2 * 120 - Math.abs(x) * 0.25; return <circle key={k} cx={x} cy={y} r={1.6} fill="#1a1410" opacity={0.6} />; })}
        {/* forehead creases */}
        <path d="M-90 -140 Q0 -156 90 -140 M-70 -116 Q0 -128 70 -116" stroke="#3a2a20" strokeWidth={5} fill="none" opacity={0.55} />
        {/* lighting: half face in shadow */}
        <g clipPath="url(#mfclip)"><rect x={-210} y={-300} width={420} height={560} fill="url(#mfshade)" opacity={0.95} /><ellipse cx={0} cy={-20} rx={230} ry={300} fill="none" stroke="#000" strokeWidth={90} opacity={0.35} /></g>
      </g>
      {smoke > 0 && Array.from({length: 7}).map((_, i) => <ellipse key={i} cx={1250 + Math.sin(t + i) * 30 + i * 14} cy={880 - ((t * 36 + i * 70) % 500)} rx={50 + i * 16} ry={28 + i * 6} fill="#c8c8d0" opacity={0.1 * smoke} />)}
      <Dust t={t} x={0} y={100} w={1900} h={900} n={26} />
      <rect x={-100} y={-100} width={2200} height={1300} fill="url(#vgrad)" opacity={0.5} />
    </g>
  );
};

// ===== scene helpers =====
const Dust: React.FC<{t: number; x: number; y: number; w: number; h: number; n?: number}> = ({t, x, y, w, h, n = 22}) => (
  <g>{Array.from({length: n}).map((_, i) => <circle key={i} cx={x + ((rnd(i) * w + t * (6 + rnd(i + 2) * 10) + Math.sin(t * 0.6 + i) * 22) % w)} cy={y + ((rnd(i + 7) * h + t * (3 + rnd(i + 5) * 6)) % h)} r={1.4 + rnd(i + 3) * 2.2} fill="#e8e0c8" opacity={0.18 + 0.2 * rnd(i + 9)} />)}</g>
);

// ===== BASEMENT =====
export type BaseP = {door?: number; lamp?: number; water?: number; pipeShake?: number; dark?: number; mattress?: boolean; photos?: number; crossed?: number; bucket?: number; chars?: React.ReactNode; fgChars?: React.ReactNode; plankGlow?: number; token?: boolean; stairLit?: number};
export const Basement: React.FC<{t: number; p: BaseP}> = ({t, p}) => {
  const door = p.door ?? 0, lampSw = Math.sin(t * 0.9) * (p.lamp ?? 1) * 7;
  const dark = p.dark ?? 0.35, shake = (p.pipeShake ?? 0) * Math.sin(t * 40) * 1.5;
  const nPhotos = 7;
  return (
    <g>
      <Defs />
      {/* back wall */}
      <rect x={-300} y={-100} width={3600} height={880} fill={P('concrete')} />
      <rect x={-300} y={-100} width={3600} height={880} fill="#0a1218" opacity={0.35} />
      {Array.from({length: 7}).map((_, i) => <rect key={i} x={120 + i * 430 + rnd(i) * 60} y={0} width={46 + rnd(i + 3) * 50} height={780} fill="#05080c" opacity={0.18 + 0.1 * rnd(i + 8)} />)}
      <rect x={-300} y={-100} width={3600} height={880} fill="url(#vgrad)" />
      {/* floor */}
      <rect x={-300} y={770} width={3600} height={420} fill={P('concrete')} />
      <rect x={-300} y={770} width={3600} height={420} fill="#05080c" opacity={0.5} />
      <rect x={-300} y={766} width={3600} height={10} fill="#02050a" opacity={0.7} />
      {Array.from({length: 14}).map((_, i) => <line key={i} x1={-300 + i * 290} y1={776} x2={-420 + i * 340} y2={1100} stroke="#000" strokeOpacity={0.22} strokeWidth={3} />)}
      {/* wooden plank near the door */}
      <g transform="translate(560 842)"><rect x={-130} y={-12} width={260} height={46} fill={P('wood')} stroke="#0a0604" strokeWidth={3} /><rect x={-130} y={-12} width={260} height={46} fill="#000" opacity={0.25} />{p.plankGlow ? <rect x={-130} y={-12} width={260} height={46} fill="#ffb04a" opacity={0.4 * p.plankGlow} /> : null}</g>
      {/* pipes (right) */}
      <g transform={`translate(0 ${shake})`}>
        {[260, 340, 430].map((y, i) => (
          <g key={y}>
            <rect x={1700} y={y} width={1500} height={36 + (i === 1 ? 10 : 0)} fill={P('rust')} /><rect x={1700} y={y} width={1500} height={12} fill="#fff" opacity={0.1} /><rect x={1700} y={y + 24} width={1500} height={14} fill="#000" opacity={0.35} />
            {[1900, 2350, 2800].map((fx) => <rect key={fx} x={fx} y={y - 8} width={26} height={52 + (i === 1 ? 10 : 0)} fill="#2a1a10" />)}
            {(p.water ?? 0) > 0 && <rect x={1700 + ((t * 300 * (p.water ?? 0) + i * 200) % 1500) - 200} y={y + 8} width={220} height={8} fill="#8ac8ff" opacity={0.25 * (p.water ?? 0)} />}
            <circle cx={2450 + i * 90} cy={y + 52 + ((t * 70 + i * 30) % 120)} r={5} fill="#7aa8c8" opacity={0.6} />
          </g>
        ))}
        <rect x={1650} y={240} width={40} height={300} fill={P('rust')} />
        <path d="M1700 300 L1500 300 L1500 700" stroke="#3a2a1a" strokeWidth={26} fill="none" opacity={0.7} />
      </g>
      {/* small barred window */}
      <g transform="translate(1250 150)"><rect x={-90} y={-50} width={180} height={100} fill="#05090f" stroke="#1a2228" strokeWidth={10} />
        <rect x={-80} y={-40} width={160} height={80} fill="#2a4060" opacity={0.55} />{[-40, 0, 40].map((bx) => <rect key={bx} x={bx - 4} y={-50} width={8} height={100} fill="#0a0e12" />)}</g>
      <polygon points="1160,200 1340,200 1520,760 1060,760" fill="#9ab4d8" opacity={0.06} />
      {/* photos wall */}
      {(p.photos ?? 1) > 0 && <g transform="translate(1050 330)">
        {Array.from({length: nPhotos}).map((_, i) => {
          const row = Math.floor(i / 4), col = i % 4, x = col * 190 + (row ? 95 : 0), y = row * 230;
          const crossed = i < 6 && (p.crossed ?? 1) > i / 6;
          return (
            <g key={i} transform={`translate(${x} ${y}) rotate(${(i % 3) * 2 - 2})`} opacity={clamp((p.photos ?? 1) * 8 - i)}>
              <rect x={-70} y={-86} width={140} height={172} fill={P('paper')} /><rect x={-70} y={-86} width={140} height={172} fill="#000" opacity={0.18} />
              <rect x={-60} y={-76} width={120} height={130} fill="#2a2e34" /><circle cx={0} cy={-26} r={24} fill="#12151a" /><path d="M-40 54 Q0 -8 40 54 Z" fill="#12151a" />
              {crossed && <g stroke="#050505" strokeWidth={7} strokeLinecap="round"><line x1={-52} y1={-68} x2={52} y2={46} /><line x1={52} y1={-68} x2={-52} y2={46} /></g>}
              <circle cx={0} cy={-90} r={6} fill="#6a1a1a" />
              {i === 0 && <Tx x={0} y={78} size={26} fill="#2a1a10">2 дня</Tx>}{i === 1 && <Tx x={0} y={78} size={26} fill="#2a1a10">4 дня</Tx>}{i === 2 && <Tx x={0} y={78} size={26} fill="#2a1a10">7 дней</Tx>}
            </g>
          );
        })}
      </g>}
      {/* crates + bucket */}
      <g transform="translate(2050 880)">{[0, 1].map((i) => <rect key={i} x={-120 + i * 130} y={-110 + i * 20} width={120} height={110 - i * 20} fill={P('wood')} stroke="#0a0604" strokeWidth={4} />)}<rect x={-110} y={-210} width={110} height={100} fill={P('wood')} stroke="#0a0604" strokeWidth={4} /><rect x={-120} y={-110} width={250} height={110} fill="#000" opacity={0.28} /></g>
      <g transform={`translate(2450 920) rotate(${(p.bucket ?? 0) * 78})`}><path d="M-44 -90 L44 -90 L34 0 L-34 0 Z" fill={P('metal')} /><ellipse cx={0} cy={-90} rx={44} ry={10} fill="#05080c" /></g>
      {/* mattress */}
      {(p.mattress ?? true) && <g transform="translate(1200 940)"><ellipse cx={20} cy={20} rx={320} ry={20} fill="#000" opacity={0.4} /><path d="M-300 0 L-280 -70 L280 -70 L310 0 Z" fill="#46463c" /><path d="M-300 0 L310 0 L310 28 L-300 28 Z" fill="#2a2a24" /><path d="M-200 -40 q60 -30 120 0 t140 10" stroke="#222" strokeWidth={5} fill="none" opacity={0.5} /><circle cx={140} cy={-36} r={30} fill="#322a20" opacity={0.6} /></g>}
      {p.chars}
      {/* door + stairs */}
      <g transform="translate(300 770)">
        <rect x={-150} y={-470} width={300} height={470} fill="#0a0e12" />
        {door > 0 && <g opacity={clamp(door * 3)}><rect x={-140} y={-460} width={280} height={460} fill="#d8a860" opacity={0.65 * (p.stairLit ?? 1)} /><polygon points="-140,0 140,-130 140,0" fill="#4a3220" /><polygon points="-140,-120 140,-250 140,-130 -140,0" fill="#5a4028" opacity={0.9} /><polygon points="-140,-240 140,-370 140,-250 -140,-120" fill="#6a4a30" opacity={0.8} /><Glow x={0} y={-230} r={420} c="#ffc880" o={0.35 * (p.stairLit ?? 1)} id="stl" /></g>}
        <g transform={`translate(-140 0) scale(${1 - door * 0.85} 1)`}><rect x={0} y={-460} width={280} height={460} fill={P('metal')} stroke="#050608" strokeWidth={8} /><rect x={0} y={-460} width={280} height={460} fill="#000" opacity={0.25} />
          <rect x={20} y={-420} width={240} height={150} fill="#000" opacity={0.15} /><circle cx={240} cy={-210} r={14} fill="#8a8a92" /><rect x={226} y={-190} width={30} height={46} rx={6} fill="#1a1a1e" /><circle cx={241} cy={-174} r={5} fill="#000" />
          {Array.from({length: 8}).map((_, i) => <circle key={i} cx={14} cy={-440 + i * 58} r={4} fill="#050608" />)}<path d="M120 -460 q8 120 -6 300" stroke="#3a1a0a" strokeWidth={10} opacity={0.35} fill="none" /></g>
      </g>
      {p.fgChars}
      {/* hanging bulb */}
      <g transform={`translate(560 0) rotate(${lampSw * 0.6} 0 0)`}><line x1={0} y1={0} x2={0} y2={150 + 40} stroke="#0a0a0a" strokeWidth={4} /><circle cx={0} cy={200} r={14} fill="#ffe8b0" opacity={0.95} /><rect x={-9} y={176} width={18} height={14} fill="#2a2a2a" /></g>
      <Glow x={560 + lampSw * 2} y={260} r={900} c="#ffd890" o={0.34} id="bg1" />
      <polygon points={`${540 + lampSw * 2},210 ${600 + lampSw * 2},210 900,770 160,770`} fill="#ffe0a0" opacity={0.09} />
      <Dust t={t} x={0} y={120} w={1500} h={640} />
      <rect x={-300} y={-100} width={3600} height={1300} fill="#010206" opacity={dark} />
    </g>
  );
};

// ===== alley =====
export const Alley: React.FC<{t: number; man?: number}> = ({t, man = 0}) => (
  <g>
    <Defs />
    <rect x={-300} y={-100} width={3600} height={1300} fill="#04070d" />
    {Array.from({length: 22}).map((_, r) => Array.from({length: 14}).map((__, c) => <rect key={`${r}-${c}`} x={-100 + c * 230 + (r % 2) * 115} y={r * 40} width={220} height={34} fill={['#2a1a18', '#32201c', '#241614'][(r + c) % 3]} opacity={0.9} />))}
    <rect x={-300} y={-100} width={3600} height={1000} fill="#000" opacity={0.45} />
    <rect x={-300} y={760} width={3600} height={420} fill={P('asphalt')} /><rect x={-300} y={760} width={3600} height={420} fill="#02040a" opacity={0.5} />
    <ellipse cx={1100} cy={900} rx={380} ry={34} fill="#1a2a3a" opacity={0.55} /><ellipse cx={1100} cy={896} rx={260} ry={16} fill="#ffe8b0" opacity={0.15} />
    <g transform="translate(1050 0)"><rect x={-8} y={200} width={16} height={570} fill="#0a0c10" /><rect x={-60} y={180} width={120} height={30} rx={10} fill="#0a0c10" /><circle cx={0} cy={216} r={16} fill="#ffe8b0" /></g>
    <Glow x={1050} y={230} r={800} c="#ffd890" o={0.5} id="al1" />
    <polygon points="1000,230 1100,230 1400,780 700,780" fill="#ffe0a0" opacity={0.1} />
    {man > 0 && <g opacity={man}><Maniac x={1900 - E(t, 0, 5) * 80} y={820} s={1.15} t={t} /><circle cx={1830 - E(t, 0, 5) * 80} cy={480} r={5} fill="#ff6a2a" /><Glow x={1830 - E(t, 0, 5) * 80} y={480} r={60} c="#ff6a2a" o={0.7} id="cig" />{[0, 1, 2, 3].map((i) => <ellipse key={i} cx={1830 - i * 14 + Math.sin(t * 2 + i) * 8} cy={440 - i * 40 - ((t * 20) % 40)} rx={20 + i * 6} ry={10 + i * 3} fill="#c8c8d0" opacity={0.2 - i * 0.04} />)}</g>}
    <Dust t={t} x={0} y={100} w={2000} h={700} n={30} />
    <rect x={-300} y={-100} width={3600} height={1300} fill="#02040a" opacity={0.2} />
  </g>
);

// ===== close-ups =====
export const TokenClose: React.FC<{t: number; side: number}> = ({t, side}) => (
  <g>
    <Defs /><Full c="#0a0806" /><rect x={-300} y={-100} width={3600} height={1300} fill={P('wood')} opacity={0.6} />
    <g transform="translate(960 560) rotate(-6)"><ellipse cx={14} cy={170} rx={250} ry={26} fill="#000" opacity={0.5} />
      <circle r={210} fill={P('rust')} stroke="#2a1a10" strokeWidth={14} /><circle r={210} fill="#000" opacity={0.25} /><circle r={170} fill="none" stroke="#8a6a3a" strokeWidth={6} opacity={0.6} />
      {side < 0.5 ? <Tx x={0} y={60} size={190} fill="#d8c8a0">12</Tx> : <Tx x={0} y={30} size={70} fill="#d8c8a0">ГАРАЖ</Tx>}
      <path d="M-160 -80 Q-60 -170 120 -150" stroke="#fff" strokeWidth={10} opacity={0.14} fill="none" />
    </g>
    <Glow x={960} y={400} r={700} c="#ffe0a0" o={0.3} id="tk1" /><rect x={-100} y={-100} width={2200} height={1300} fill="#010206" opacity={0.3} />
  </g>
);

export const LockClose: React.FC<{t: number; k: number}> = ({t, k}) => (
  <g>
    <Defs /><Full c="#06080b" /><rect x={-100} y={-100} width={2200} height={1300} fill={P('metal')} opacity={0.9} /><rect x={-100} y={-100} width={2200} height={1300} fill="#000" opacity={0.45} />
    <g transform="translate(960 560)"><rect x={-170} y={-230} width={340} height={460} rx={30} fill="#1a1a1e" stroke="#050608" strokeWidth={10} /><circle cx={0} cy={-60} r={60} fill="#050507" stroke="#4a4a52" strokeWidth={10} /><rect x={-12} y={-60} width={24} height={110} rx={8} fill="#000" />
      <g transform={`translate(${(1 - clamp(k * 2)) * 220} -60) rotate(${k > 0.5 ? (k - 0.5) * 140 : 0})`}><rect x={-20} y={-14} width={240} height={28} rx={8} fill="#a0a0aa" /><circle cx={240} cy={0} r={46} fill="none" stroke="#a0a0aa" strokeWidth={18} /></g></g>
    <Glow x={960} y={480} r={600} c="#ffe0a0" o={0.18} id="lk1" />
  </g>
);

export const StepClose: React.FC<{t: number; k: number}> = ({t, k}) => {
  const press = Math.sin(clamp(k) * Math.PI);
  return (
    <g>
      <Defs /><Full c="#060504" />
      {[0, 1, 2, 3].map((i) => <g key={i} transform={`translate(${300 + i * 330} ${400 + i * 150})`}><rect x={0} y={0} width={900} height={42} fill={P('wood')} /><rect x={0} y={42} width={900} height={110} fill="#1a0e08" /><rect x={0} y={0} width={900} height={42} fill="#000" opacity={i === 2 ? 0.05 : 0.4} /></g>)}
      <g transform={`translate(1080 ${620 + press * 12})`}><path d="M0 0 L240 0 L260 -30 L200 -60 L40 -60 Z" fill="#050507" /><path d="M-8 0 L260 0 L260 14 L-8 14 Z" fill="#111" /></g>
      {press > 0.2 && [0, 1, 2].map((i) => <path key={i} d={`M${1000 - i * 40} ${590 - i * 24} q-40 -20 -80 0`} stroke="#ffd890" strokeWidth={4} opacity={0.5 * press} fill="none" />)}
      <Glow x={1100} y={560} r={700} c="#ffc880" o={0.3} id="st1" /><rect x={-100} y={-100} width={2200} height={1300} fill="#010206" opacity={0.35} />
    </g>
  );
};

export const RulesSheet: React.FC<{t: number; k: number; hl?: number}> = ({t, k, hl = 0}) => {
  const rules = ['Никогда не доверяй словам маньяка', 'Запоминай каждую деталь помещения', 'Не раскрывай своих намерений'];
  return (
    <g>
      <Defs /><Full c="#0a0806" /><rect x={-100} y={-100} width={2200} height={1300} fill={P('concrete')} opacity={0.55} /><rect x={-100} y={-100} width={2200} height={1300} fill="#000" opacity={0.5} />
      <g transform="translate(960 560) rotate(-2.5)"><rect x={-430} y={-470} width={880} height={950} fill="#000" opacity={0.4} transform="translate(14 18)" /><rect x={-430} y={-470} width={860} height={940} fill={P('paper')} /><rect x={-430} y={-470} width={860} height={940} fill="#000" opacity={0.1} />
        {Array.from({length: 12}).map((_, i) => <line key={i} x1={-420} y1={-370 + i * 72} x2={420} y2={-370 + i * 72} stroke="#4a6a8a" strokeWidth={2} opacity={0.35} />)}
        <text x={0} y={-370} textAnchor="middle" fontFamily="Caveat, cursive" fontWeight={700} fontSize={104} fill="#1a1a1a">Три правила</text>
        <rect x={-260} y={-350} width={520 * clamp(k * 2)} height={6} fill="#a01818" opacity={0.7} />
        {rules.map((r, i) => {
          const a = clamp(k * 3 - i - 0.2), on = hl === i + 1;
          return (
            <g key={i} opacity={a}>
              <text x={-360} y={-200 + i * 190} fontFamily="Caveat, cursive" fontWeight={700} fontSize={110} fill={on ? '#a01818' : '#222'}>{`${i + 1}.`}</text>
              <foreignObject x={-270} y={-262 + i * 190} width={680} height={170}><div style={{fontFamily: 'Caveat, cursive', fontWeight: 700, fontSize: 70, lineHeight: 0.95, color: on ? '#a01818' : '#1c1c1c'}}>{r}</div></foreignObject>
              {on && <path d={`M-370 ${-120 + i * 190} q420 14 760 -6`} stroke="#a01818" strokeWidth={6} fill="none" opacity={0.7} />}
            </g>
          );
        })}
        <circle cx={-380} cy={-440} r={16} fill="#3a3a3a" /><path d="M300 330 q40 -30 90 -10" stroke="#555" strokeWidth={4} fill="none" opacity={0.5} /></g>
      <Glow x={960} y={500} r={900} c="#ffe0a0" o={0.18} id="rs1" />
    </g>
  );
};

// ===== kitchen =====
export const Kitchen: React.FC<{t: number; door?: number; dark?: number; chars?: React.ReactNode}> = ({t, door = 1, dark = 0.4, chars}) => (
  <g>
    <Defs />
    <rect x={-300} y={-100} width={3600} height={880} fill={P('tile')} /><rect x={-300} y={-100} width={3600} height={880} fill="#0a1014" opacity={0.55} />
    <rect x={-300} y={770} width={3600} height={420} fill={P('wood')} /><rect x={-300} y={770} width={3600} height={420} fill="#000" opacity={0.5} />
    <g transform="translate(500 770)"><rect x={-160} y={-520} width={320} height={520} fill="#c8ccc8" opacity={0.7} stroke="#0a0c0e" strokeWidth={6} /><rect x={-160} y={-520} width={320} height={520} fill="#000" opacity={0.45} /><rect x={-140} y={-500} width={8} height={160} fill="#6a6e72" /></g>
    <g transform="translate(1250 780)"><rect x={-320} y={-130} width={640} height={22} fill={P('wood')} /><rect x={-300} y={-110} width={20} height={110} fill="#2a1a10" /><rect x={280} y={-110} width={20} height={110} fill="#2a1a10" />
      {[-200, -60, 90, 210].map((px, i) => <g key={i} transform={`translate(${px} -130)`}><ellipse cx={0} cy={0} rx={60} ry={12} fill="#c8c4b8" opacity={0.8} /><ellipse cx={0} cy={-4} rx={44} ry={7} fill={['#3a2a1a', '#5a4a2a', '#2a3a1a', '#4a2a1a'][i]} opacity={0.7} /></g>)}</g>
    <g transform="translate(2150 0)"><rect x={-180} y={140} width={360} height={620} fill="#0a0e12" />{door > 0 && <><rect x={-170} y={150} width={340} height={600} fill="#6a8a58" opacity={0.55 * door} /><Glow x={0} y={450} r={700} c="#9ac878" o={0.3 * door} id="kd1" /></>}<rect x={-180} y={140} width={30} height={620} fill={P('wood')} /></g>
    <g transform="translate(1000 140)"><rect x={-130} y={-60} width={260} height={180} fill="#101c28" stroke="#0a0c10" strokeWidth={10} /><rect x={-120} y={-50} width={240} height={160} fill="#3a5a40" opacity={0.4} /></g>
    {chars}
    <Glow x={1000} y={130} r={800} c="#ffd890" o={0.25} id="kt1" /><Dust t={t} x={0} y={100} w={2000} h={650} />
    <rect x={-300} y={-100} width={3600} height={1300} fill="#010206" opacity={dark} />
  </g>
);

// ===== dark forest / road =====
export const ForestDark: React.FC<{t: number; cx: number; road?: boolean; dusk?: number; fog?: number; suv?: boolean; house?: boolean}> = ({t, cx, road = false, dusk = 0.5, fog = 0.5, suv = false, house = false}) => {
  const par = (k: number) => `translate(${(cx - 960) * k} 0)`;
  const sky = mixc('#2a3a52', '#080c16', dusk), sky2 = mixc('#a09a80', '#1a2230', dusk);
  const tree = (x: number, h: number, c: string, i: number) => (
    <g key={i} transform={`translate(${x} 800)`}><rect x={-h * 0.04} y={-h} width={h * 0.08} height={h} fill={c} />{Array.from({length: 6}).map((_, k) => <path key={k} d={`M0 ${-h * (0.3 + k * 0.12)} L${-h * (0.3 - k * 0.04) - rnd(i + k) * 20} ${-h * (0.24 + k * 0.12)} M0 ${-h * (0.34 + k * 0.12)} L${h * (0.3 - k * 0.04) + rnd(i + k + 3) * 20} ${-h * (0.27 + k * 0.12)}`} stroke={c} strokeWidth={h * 0.025} />)}</g>
  );
  return (
    <g>
      <Defs />
      <defs><linearGradient id="fsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={sky} /><stop offset="1" stopColor={sky2} /></linearGradient></defs>
      <rect x={-1500} y={-800} width={7000} height={1700} fill="url(#fsky)" />
      <g transform={par(0.2)}>{Array.from({length: 40}).map((_, i) => tree(-800 + i * 140 + rnd(i) * 60, 380 + rnd(i + 2) * 200, mixc('#1a2630', '#05080c', dusk * 0.6), i))}</g>
      <rect x={-1500} y={560} width={7000} height={300} fill={P('fog')} opacity={fog * 0.35} style={{mixBlendMode: 'screen'} as any} />
      <g transform={par(0.5)}>{Array.from({length: 26}).map((_, i) => tree(-700 + i * 230 + rnd(i + 20) * 80, 560 + rnd(i + 5) * 260, mixc('#0e161c', '#020406', dusk * 0.5), i + 100))}</g>
      <rect x={-1500} y={790} width={7000} height={500} fill={P('dirt')} /><rect x={-1500} y={790} width={7000} height={500} fill="#000" opacity={0.45} />
      {road && <path d="M-1500 940 Q1000 900 2500 930 T5500 940 L5500 1100 L-1500 1100 Z" fill={P('dirt')} opacity={0.95} />}
      {road && <path d="M-1500 940 Q1000 900 2500 930 T5500 940 L5500 960 Q2500 950 1000 920 T-1500 960 Z" fill="#000" opacity={0.3} />}
      {suv && <g transform="translate(1900 960)"><ellipse cx={0} cy={6} rx={260} ry={16} fill="#000" opacity={0.5} /><path d="M-240 -30 L-240 -150 Q-230 -190 -190 -200 L-60 -216 Q-20 -290 60 -290 L170 -290 Q240 -280 262 -200 L290 -190 Q304 -170 304 -100 L304 -30 Z" fill="#2a3426" /><path d="M-240 -30 L304 -30 L304 -50 L-240 -50 Z" fill="#000" opacity={0.3} /><path d="M-10 -210 Q10 -268 62 -268 L100 -268 L100 -210 Z M120 -268 L172 -268 Q224 -262 240 -210 L120 -210 Z" fill="#0a1220" opacity={0.85} /><circle cx={-130} cy={-10} r={46} fill="#0a0b0d" /><circle cx={190} cy={-10} r={46} fill="#0a0b0d" />
        <path d="M-60 -30 q30 -30 60 0 t80 10" stroke="#05060a" strokeWidth={14} opacity={0.5} fill="none" /></g>}
      {Array.from({length: 4}).map((_, i) => <ellipse key={i} cx={((i * 700 + t * 20) % 3000) - 300 + (cx - 960) * 0.3} cy={720 + i * 20} rx={500} ry={50} fill="#9aa4b0" opacity={fog * 0.09} />)}
      <g transform={par(-0.35)}>{[-100, 1900, 3800].map((x, i) => <rect key={i} x={x} y={-100} width={90} height={1300} fill="#02040a" opacity={0.85} />)}</g>
      <rect x={-1500} y={-800} width={7000} height={2000} fill="#010308" opacity={0.2 + dusk * 0.2} />
    </g>
  );
};

// ===== wooden house exterior / living room =====
export const HouseExt: React.FC<{t: number; lit?: number}> = ({t, lit = 1}) => (
  <g>
    <Defs />
    <rect x={-300} y={-100} width={3600} height={1300} fill="#050912" />
    {Array.from({length: 30}).map((_, i) => <circle key={i} cx={rnd(i) * 3000} cy={rnd(i + 2) * 380} r={1.5} fill="#cfe0ff" opacity={0.5} />)}
    <rect x={-300} y={760} width={3600} height={440} fill={P('dirt')} /><rect x={-300} y={760} width={3600} height={440} fill="#000" opacity={0.5} />
    <g transform="translate(1250 780)"><rect x={-420} y={-420} width={840} height={420} fill={P('wood')} /><rect x={-420} y={-420} width={840} height={420} fill="#000" opacity={0.4} />{Array.from({length: 14}).map((_, i) => <rect key={i} x={-420} y={-420 + i * 30} width={840} height={3} fill="#0a0604" opacity={0.5} />)}
      <polygon points="-470,-420 470,-420 330,-560 -330,-560" fill="#1a1210" /><rect x={-60} y={-250} width={120} height={250} fill="#1a0e08" /><rect x={-300} y={-300} width={150} height={130} fill="#ffd890" opacity={0.9 * lit} /><rect x={150} y={-300} width={150} height={130} fill="#ffd890" opacity={0.9 * lit} />
      <rect x={-130} y={0} width={260} height={30} fill={P('wood')} /><rect x={-170} y={30} width={340} height={26} fill={P('wood')} /></g>
    <Glow x={1000} y={560} r={600} c="#ffc070" o={0.45 * lit} id="he1" /><Glow x={1500} y={560} r={600} c="#ffc070" o={0.45 * lit} id="he2" />
    {Array.from({length: 22}).map((_, i) => <path key={i} d={`M${-200 + i * 150} 820 q6 -40 12 -60`} stroke="#1a2a14" strokeWidth={5} fill="none" />)}
    <rect x={-300} y={-100} width={3600} height={1300} fill="#010308" opacity={0.2} />
  </g>
);

export const LivingRoom: React.FC<{t: number; photoK?: number; chars?: React.ReactNode; dark?: number; windowOpen?: number; doorLocked?: boolean}> = ({t, photoK = 0, chars, dark = 0.3, windowOpen = 0}) => (
  <g>
    <Defs />
    <rect x={-300} y={-100} width={3600} height={880} fill={P('wallpaper')} /><rect x={-300} y={-100} width={3600} height={880} fill="#0a0c10" opacity={0.3} />
    <rect x={-300} y={770} width={3600} height={420} fill={P('wood')} /><rect x={-300} y={770} width={3600} height={420} fill="#000" opacity={0.4} />
    {/* couch */}
    <g transform="translate(900 800)"><rect x={-300} y={-190} width={600} height={190} rx={30} fill="#3a2a2a" /><rect x={-320} y={-240} width={640} height={90} rx={30} fill="#46322e" /><rect x={-300} y={-190} width={600} height={190} rx={30} fill="#000" opacity={0.25} /></g>
    {/* clock */}
    <g transform="translate(1500 280)"><circle r={74} fill="#d8d2b8" stroke="#2a1a10" strokeWidth={10} /><line x1={0} y1={0} x2={Math.sin(t * 0.1) * 40} y2={-Math.cos(t * 0.1) * 40} stroke="#222" strokeWidth={6} /><line x1={0} y1={0} x2={Math.sin(t * 1.2) * 56} y2={-Math.cos(t * 1.2) * 56} stroke="#222" strokeWidth={3} /></g>
    {/* photos on wall */}
    <g transform="translate(1900 300)">{[0, 1, 2].map((i) => <g key={i} transform={`translate(${i * 190} ${(i % 2) * 30})`}><rect x={-80} y={-100} width={160} height={200} fill="#2a1a10" /><rect x={-68} y={-88} width={136} height={176} fill="#c8c0a8" />{i === 1 && <><circle cx={4} cy={-34} r={18} fill="#0a0a0c" /><path d="M-24 60 Q4 -8 32 60 Z" fill="#0a0a0c" /><circle cx={-42} cy={-12} r={20} fill="#3a3430" /><path d="M-76 70 Q-42 8 -8 70 Z" fill="#3a3430" /><circle cx={50} cy={-8} r={20} fill="#2e3a30" /><path d="M16 70 Q50 8 84 70 Z" fill="#2e3a30" /><Glow x={0} y={0} r={160} c="#ff4a3a" o={0.25 * photoK} id="ph1" /></>}</g>)}</g>
    {/* boots by the door */}
    <g transform="translate(2500 860)"><path d="M-70 0 L-70 -50 Q-60 -90 -20 -86 L0 -30 L40 -20 L40 0 Z" fill="#14100c" /><path d="M20 0 L20 -50 Q30 -90 70 -86 L90 -30 L130 -20 L130 0 Z" fill="#14100c" /><ellipse cx={20} cy={8} rx={110} ry={10} fill="#3a2a10" opacity={0.6} /></g>
    {/* door and window */}
    <g transform="translate(2750 770)"><rect x={-130} y={-480} width={260} height={480} fill={P('wood')} /><rect x={-130} y={-480} width={260} height={480} fill="#000" opacity={0.45} /><circle cx={90} cy={-230} r={12} fill="#b49a58" /></g>
    <g transform="translate(250 380)"><rect x={-130} y={-180} width={260} height={320} fill="#0a121c" stroke="#2a1a10" strokeWidth={14} /><rect x={-120} y={-170} width={240} height={300} fill="#1a2a3a" opacity={0.7} /><line x1={0} y1={-180} x2={0} y2={140} stroke="#2a1a10" strokeWidth={8} />{windowOpen > 0 && <rect x={-120} y={-170} width={120 * windowOpen} height={300} fill="#0a1218" />}</g>
    {chars}
    <Glow x={900} y={160} r={900} c="#ffc880" o={0.3} id="lr1" /><Dust t={t} x={0} y={100} w={2200} h={650} />
    <rect x={-300} y={-100} width={3600} height={1300} fill="#010206" opacity={dark} />
  </g>
);

export const Garden: React.FC<{t: number}> = ({t}) => (
  <g>
    <Defs /><rect x={-300} y={-100} width={3600} height={1300} fill="#04080e" />
    <rect x={-300} y={720} width={3600} height={480} fill={P('dirt')} /><rect x={-300} y={720} width={3600} height={480} fill="#000" opacity={0.45} />
    {Array.from({length: 30}).map((_, i) => <g key={i} transform={`translate(${-100 + i * 110} 720)`}><rect x={-8} y={-190} width={16} height={190} fill="#2a1a10" /><polygon points="-10,-190 10,-190 0,-215" fill="#2a1a10" /></g>)}
    <rect x={-300} y={560} width={3600} height={14} fill="#2a1a10" /><rect x={-300} y={640} width={3600} height={14} fill="#2a1a10" />
    {Array.from({length: 10}).map((_, i) => <ellipse key={i} cx={100 + i * 300} cy={800 + (i % 3) * 30} rx={110 + rnd(i) * 40} ry={70} fill="#0e1e12" />)}
    <g transform="translate(1100 700)"><rect x={-300} y={-360} width={600} height={360} fill={P('wood')} /><rect x={-300} y={-360} width={600} height={360} fill="#000" opacity={0.45} /><rect x={-60} y={-280} width={120} height={120} fill="#ffd890" opacity={0.85} /></g>
    <Glow x={1100} y={500} r={600} c="#ffc070" o={0.4} id="ga1" /><rect x={-300} y={-100} width={3600} height={1300} fill="#010308" opacity={0.2} />
  </g>
);

// ===== car interior (back seat, looking forward) =====
export const CarInside: React.FC<{t: number; eyes?: number; note?: number; apron?: number; dark?: number; smoke?: number; speed?: number}> = ({t, eyes = 0, note = 0, apron = 0, dark = 0.3, smoke = 0, speed = 300}) => (
  <g>
    <Defs />
    <rect x={-300} y={-100} width={3600} height={1300} fill="#04060a" />
    {/* windshield view */}
    <svg x={420} y={60} width={1080} height={520} viewBox="0 0 1080 520" overflow="hidden">
      <rect width={1080} height={520} fill="#303c52" /><rect y={300} width={1080} height={220} fill="#14110c" />
      {Array.from({length: 14}).map((_, i) => { const x = ((i * 190 - t * speed * (0.4 + rnd(i))) % 2200 + 2200) % 2200 - 300; return <g key={i} transform={`translate(${x} 320)`}><rect x={-6} y={-220} width={12} height={220} fill="#05080a" /><polygon points="-70,-80 70,-80 0,-300" fill="#060a0c" /></g>; })}
      <path d="M0 520 L420 330 L660 330 L1080 520 Z" fill="#26211a" /><path d="M520 330 L540 330 L580 520 L500 520 Z" fill="#bba458" opacity={0.5} />
    </svg>
    <rect x={420} y={60} width={1080} height={520} fill="none" stroke="#02030a" strokeWidth={26} />
    <path d="M300 640 Q960 560 1620 640 L1620 700 L300 700 Z" fill="#06070a" />
    {/* front seats */}
    <g transform="translate(560 1080)"><path d="M-220 0 L-200 -420 Q-60 -480 100 -420 L120 0 Z" fill={P('leather')} /><path d="M-220 0 L-200 -420 Q-60 -480 100 -420 L120 0 Z" fill="#000" opacity={0.5} /><ellipse cx={-50} cy={-480} rx={80} ry={100} fill="#06070a" /></g>
    <g transform="translate(1360 1080)"><path d="M-220 0 L-200 -420 Q-60 -480 100 -420 L120 0 Z" fill={P('leather')} /><path d="M-220 0 L-200 -420 Q-60 -480 100 -420 L120 0 Z" fill="#000" opacity={0.5} /><ellipse cx={-50} cy={-500} rx={72} ry={90} fill="#0a0809" /><path d="M-110 -540 Q-50 -620 20 -540" fill="#3a2418" opacity={0.7} /></g>
    {/* rear mirror */}
    <g transform="translate(960 150)"><rect x={-150} y={-30} width={300} height={70} rx={14} fill="#0a0c10" stroke="#1a1c22" strokeWidth={6} /><rect x={-140} y={-22} width={280} height={54} rx={10} fill="#1a2430" />
      {eyes > 0 && <g opacity={eyes}><ellipse cx={-30} cy={10} rx={18} ry={7} fill="#e8e8e0" /><circle cx={-30} cy={10} r={5} fill="#0a0a0a" /><ellipse cx={30} cy={10} rx={18} ry={7} fill="#e8e8e0" /><circle cx={30} cy={10} r={5} fill="#0a0a0a" /></g>}</g>
    {/* note / napkins */}
    {note > 0 && <g transform="translate(960 800) rotate(-5)" opacity={note}><rect x={-190} y={-110} width={380} height={220} fill={P('paper')} /><rect x={-190} y={-110} width={380} height={220} fill="#000" opacity={0.12} /><text x={0} y={-30} textAnchor="middle" fontFamily="Caveat, cursive" fontWeight={700} fontSize={50} fill="#1a1a1a">Не рассказывай ему</text><text x={0} y={30} textAnchor="middle" fontFamily="Caveat, cursive" fontWeight={700} fontSize={50} fill="#a01818">ничего. Он один из них</text></g>}
    {apron > 0 && <g transform="translate(960 880)" opacity={apron}><path d="M-220 0 L-180 -160 Q0 -210 190 -160 L230 0 Z" fill={P('leather')} /><path d="M-220 0 L-180 -160 Q0 -210 190 -160 L230 0 Z" fill="#000" opacity={0.35} /><rect x={20} y={-120} width={110} height={90} fill="#000" opacity={0.3} /><Tx x={75} y={-62} size={50} fill="#c8a868">12</Tx></g>}
    {smoke > 0 && Array.from({length: 7}).map((_, i) => <ellipse key={i} cx={1100 + i * 40 + Math.sin(t + i) * 30} cy={500 - ((t * 30 + i * 60) % 320)} rx={60 + i * 16} ry={30 + i * 6} fill="#b8b8c0" opacity={0.1 * smoke} />)}
    <rect x={-300} y={-100} width={3600} height={1300} fill="#010308" opacity={dark} />
  </g>
);

// ===== roadside shop =====
export const ShopExt: React.FC<{t: number; car?: boolean; cops?: number}> = ({t, car = true, cops = 0}) => (
  <g>
    <Defs />
    <rect x={-300} y={-100} width={3600} height={1300} fill="#050a14" />
    <rect x={-300} y={780} width={3600} height={420} fill={P('asphalt')} /><rect x={-300} y={780} width={3600} height={420} fill="#000" opacity={0.4} />
    <g transform="translate(1300 790)"><rect x={-420} y={-420} width={840} height={420} fill={P('concrete')} /><rect x={-420} y={-420} width={840} height={420} fill="#101820" opacity={0.4} /><rect x={-440} y={-450} width={880} height={50} fill="#7a1a1a" /><Tx x={0} y={-412} size={34} fill="#e8e0d0">МАГАЗИН · 24</Tx>
      <rect x={-340} y={-320} width={300} height={220} fill="#ffe8b0" opacity={0.85} /><rect x={40} y={-320} width={300} height={220} fill="#ffe8b0" opacity={0.85} /><rect x={-60} y={-320} width={120} height={320} fill="#2a2018" stroke="#0a0806" strokeWidth={6} /><rect x={-50} y={-310} width={100} height={220} fill="#ffe8b0" opacity={0.7} /></g>
    <Glow x={1300} y={560} r={800} c="#ffe0a0" o={0.35} id="sh1" />
    {car && <g transform="translate(2300 930)"><ellipse cx={0} cy={8} rx={240} ry={16} fill="#000" opacity={0.5} /><path d="M-220 -30 L-220 -110 Q-210 -140 -170 -146 L-80 -156 Q-40 -220 40 -220 L130 -220 Q190 -212 210 -146 L236 -136 Q250 -120 250 -60 L250 -30 Z" fill="#3a2a22" /><circle cx={-120} cy={-10} r={42} fill="#0a0b0d" /><circle cx={150} cy={-10} r={42} fill="#0a0b0d" /><rect x={236} y={-96} width={14} height={20} fill="#fff3b0" /><polygon points="250,-86 560,-130 560,-20 250,-70" fill="#fff3b0" opacity={0.1} /></g>}
    {cops > 0 && [0, 1].map((i) => <g key={i} transform={`translate(${i ? 1850 : 600} ${i ? 960 : 930})`} opacity={cops}><ellipse cx={0} cy={8} rx={240} ry={16} fill="#000" opacity={0.5} /><path d="M-220 -30 L-220 -110 Q-210 -140 -170 -146 L-80 -156 Q-40 -220 40 -220 L130 -220 Q190 -212 210 -146 L236 -136 Q250 -120 250 -60 L250 -30 Z" fill="#d8dce0" /><rect x={-220} y={-70} width={470} height={26} fill="#1f3a6a" /><circle cx={-120} cy={-10} r={42} fill="#0a0b0d" /><circle cx={150} cy={-10} r={42} fill="#0a0b0d" />
      <rect x={-40} y={-244} width={40} height={18} fill={Math.sin(t * 12 + i * 3) > 0 ? '#ff2a2a' : '#401010'} /><rect x={4} y={-244} width={40} height={18} fill={Math.sin(t * 12 + i * 3) > 0 ? '#401010' : '#2a5aff'} /><Glow x={0} y={-230} r={700} c={Math.sin(t * 12 + i * 3) > 0 ? '#ff2a2a' : '#2a5aff'} o={0.25} id={`cp${i}`} /></g>)}
    <rect x={-300} y={-100} width={3600} height={1300} fill="#010308" opacity={0.2} />
  </g>
);

export const ShopInt: React.FC<{t: number; chars?: React.ReactNode; storeroom?: number; photo?: number; dark?: number}> = ({t, chars, storeroom = 0, photo = 0, dark = 0.25}) => (
  <g>
    <Defs />
    <rect x={-300} y={-100} width={3600} height={880} fill={P('wallpaper')} /><rect x={-300} y={-100} width={3600} height={880} fill="#0a0c10" opacity={0.2} />
    <rect x={-300} y={770} width={3600} height={420} fill={P('tile')} /><rect x={-300} y={770} width={3600} height={420} fill="#000" opacity={0.45} />
    {[0, 1, 2].map((i) => <g key={i} transform={`translate(${400 + i * 520} 400)`}><rect x={-200} y={0} width={400} height={14} fill="#3a2a1a" /><rect x={-200} y={180} width={400} height={14} fill="#3a2a1a" />{Array.from({length: 8}).map((_, k) => <rect key={k} x={-190 + k * 48} y={-60 + (k % 2) * 8} width={36} height={60 - (k % 2) * 8} fill={['#8a3a2a', '#2a6a8a', '#c8a838', '#4a8a4a'][k % 4]} opacity={0.85} />)}</g>)}
    <g transform="translate(2150 780)"><rect x={-260} y={-190} width={520} height={190} fill={P('wood')} /><rect x={-260} y={-190} width={520} height={190} fill="#000" opacity={0.3} /><rect x={-260} y={-206} width={520} height={20} fill="#2a1a10" /></g>
    <g transform="translate(2760 780)"><rect x={-100} y={-480} width={200} height={480} fill={P('metal')} stroke="#050608" strokeWidth={8} /><rect x={-100} y={-480} width={200} height={480} fill="#000" opacity={0.3} /><rect x={20} y={-250} width={46} height={30} fill="#1a1a1e" />{storeroom > 0 && <rect x={-100 + Math.sin(t * 40) * 4 * storeroom} y={-480} width={200} height={480} fill="none" stroke="#fff" strokeWidth={2} opacity={0.1} />}</g>
    {chars}
    {photo > 0 && <g transform="translate(960 540) rotate(-4)" opacity={photo}><rect x={-230} y={-160} width={460} height={320} fill={P('paper')} /><rect x={-220} y={-150} width={440} height={300} fill="#2a2e36" /><circle cx={-60} cy={-30} r={40} fill="#0e1014" /><path d="M-130 150 Q-60 20 10 150 Z" fill="#0e1014" /><circle cx={90} cy={-30} r={40} fill="#14161a" /><path d="M20 150 Q90 20 160 150 Z" fill="#14161a" /><path d="M-30 90 Q30 70 80 100" stroke="#14161a" strokeWidth={34} fill="none" /></g>}
    <Glow x={1000} y={130} r={900} c="#ffe8b0" o={0.3} id="si1" />
    <rect x={-300} y={-100} width={3600} height={1300} fill="#010308" opacity={dark} />
  </g>
);

// ===== investigation desk + apartment corridor =====
export const Desk: React.FC<{t: number; shown: number; flip?: number; dark?: number}> = ({t, shown, flip = 0, dark = 0.3}) => {
  const photos = [
    {x: 560, y: 470, r: -4, kind: 'door'}, {x: 960, y: 520, r: 3, kind: 'stop'}, {x: 1360, y: 470, r: -2, kind: 'shop'}, {x: 960, y: 760, r: 2, kind: 'pair'},
  ];
  return (
    <g>
      <Defs /><Full c="#0a0806" /><rect x={-100} y={-100} width={2200} height={1300} fill={P('wood')} /><rect x={-100} y={-100} width={2200} height={1300} fill="#000" opacity={0.55} />
      {photos.map((p, i) => (
        <g key={i} transform={`translate(${p.x} ${p.y}) rotate(${p.r})`} opacity={clamp(shown * 5 - i)}>
          <rect x={-170} y={-120} width={340} height={240} fill="#000" opacity={0.4} transform="translate(8 10)" /><rect x={-170} y={-120} width={340} height={240} fill={P('paper')} />
          <rect x={-158} y={-108} width={316} height={216} fill={['#3a4a58', '#4a5a46', '#4a4458', '#3a3a30'][i]} />
          {i === 3 ? <><circle cx={-30} cy={-10} r={30} fill="#0e1014" /><path d="M-90 108 Q-30 10 30 108 Z" fill="#0e1014" /><circle cx={70} cy={-14} r={28} fill="#1a1a20" /><path d="M20 108 Q70 14 120 108 Z" fill="#1a1a20" /></> : <><rect x={-60} y={-40} width={120} height={148} fill="#16181e" opacity={0.8} /><circle cx={0} cy={-62} r={26} fill="#0e1014" /></>}
        </g>
      ))}
      {flip > 0 && <g transform="translate(960 560) rotate(-2)" opacity={flip}><rect x={-300} y={-200} width={600} height={400} fill="#000" opacity={0.45} transform="translate(10 14)" /><rect x={-300} y={-200} width={600} height={400} fill={P('paper')} /><text x={0} y={-30} textAnchor="middle" fontFamily="Caveat, cursive" fontWeight={700} fontSize={110} fill="#1a1a1a">Артём.</text><text x={0} y={90} textAnchor="middle" fontFamily="Caveat, cursive" fontWeight={700} fontSize={120} fill="#a01818">Следующий</text></g>}
      <Glow x={960} y={300} r={900} c="#ffe0a0" o={0.3} id="dk1" /><rect x={-100} y={-100} width={2200} height={1300} fill="#010206" opacity={dark} />
    </g>
  );
};

export const AptHall: React.FC<{t: number; door?: number; dark?: number}> = ({t, door = 0, dark = 0.5}) => (
  <g>
    <Defs />
    <rect x={-300} y={-100} width={3600} height={880} fill={P('wallpaper')} /><rect x={-300} y={-100} width={3600} height={880} fill="#05070c" opacity={0.6} />
    <rect x={-300} y={770} width={3600} height={420} fill={P('tile')} /><rect x={-300} y={770} width={3600} height={420} fill="#000" opacity={0.6} />
    <g transform="translate(1500 770)"><rect x={-170} y={-520} width={340} height={520} fill="#02040a" />{door > 0 && <rect x={-160} y={-510} width={320 * door} height={500} fill="#1a2438" opacity={0.7} />}<g transform={`translate(-160 0) scale(${1 - door * 0.7} 1)`}><rect x={0} y={-510} width={320} height={510} fill={P('wood')} /><rect x={0} y={-510} width={320} height={510} fill="#000" opacity={0.5} /><circle cx={280} cy={-240} r={14} fill="#b49a58" /></g></g>
    <Glow x={1500} y={300} r={700} c="#9ab4d8" o={0.15} id="ap1" /><Dust t={t} x={0} y={100} w={2200} h={650} n={14} />
    <rect x={-300} y={-100} width={3600} height={1300} fill="#010206" opacity={dark} />
  </g>
);

export const PoliceDesk = Desk;
