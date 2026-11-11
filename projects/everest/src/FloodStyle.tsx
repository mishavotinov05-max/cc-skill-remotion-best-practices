import React from 'react';
import {AbsoluteFill} from 'remotion';
import '@fontsource/montserrat/cyrillic-700.css';
import '@fontsource/montserrat/latin-700.css';
import {rnd} from './util';

export const FONT = 'Montserrat, sans-serif';
const W = 1080;
const H = 1920;

// ---------- HUD pieces (survival-explainer look) ----------
export const HudBar: React.FC<{place: string; time: string}> = ({place, time}) => (
  <text x={540} y={96} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={26} fill="#f2c94c" letterSpacing={3}>{`${place} · ${time}`}</text>
);

export const Chip: React.FC<{x: number; y: number; color: 'red' | 'yellow' | 'green' | 'cyan'; text: string; w?: number}> = ({x, y, color, text, w}) => {
  const c = {red: '#ff4a4a', yellow: '#f2c94c', green: '#38e07b', cyan: '#4ac8ff'}[color];
  const width = w ?? text.length * 17 + 72;
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x={0} y={0} width={width} height={54} rx={14} fill="#0a1224" opacity={0.92} stroke={c} strokeWidth={3} />
      <circle cx={30} cy={27} r={9} fill="none" stroke={c} strokeWidth={3} />
      <circle cx={30} cy={27} r={3.5} fill={c} />
      <text x={54} y={36} fontFamily={FONT} fontWeight={700} fontSize={22} fill={c} letterSpacing={1}>{text}</text>
    </g>
  );
};

export const Tag: React.FC<{x: number; y: number; text: string}> = ({x, y, text}) => (
  <g transform={`translate(${x} ${y})`}>
    <rect x={0} y={0} width={text.length * 22 + 44} height={52} rx={8} fill="#f2c94c" />
    <text x={20} y={37} fontFamily={FONT} fontWeight={700} fontSize={28} fill="#1a1400" letterSpacing={1}>{text}</text>
  </g>
);

export const Stamp: React.FC<{x: number; y: number; text: string; rot?: number; color?: string}> = ({x, y, text, rot = -6, color = '#ff3b3b'}) => (
  <g transform={`translate(${x} ${y}) rotate(${rot})`}>
    <rect x={-text.length * 22 - 30} y={-52} width={text.length * 44 + 60} height={104} rx={8} fill="none" stroke={color} strokeWidth={8} />
    <rect x={-text.length * 22 - 22} y={-44} width={text.length * 44 + 44} height={88} rx={4} fill={color} opacity={0.18} />
    <text x={0} y={22} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={72} fill={color} letterSpacing={2}>{text}</text>
  </g>
);

// ---------- flat figure (no outline, two-tone) ----------
export const FlatHero: React.FC<{x: number; y: number; s?: number; pose?: 'stand' | 'wave'; rot?: number; flip?: boolean; armR?: number; legSwing?: number}> = ({x, y, s = 1, pose = 'stand', rot = 0, flip, armR, legSwing = 0}) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${flip ? -s : s} ${s})`}>
    <ellipse cx={0} cy={4} rx={86} ry={12} fill="#000" opacity={0.3} />
    <rect x={-42} y={-150} width={34} height={150} rx={14} fill="#1b2438" transform={`rotate(${legSwing} -25 -150)`} />
    <rect x={8} y={-150} width={34} height={150} rx={14} fill="#232d45" transform={`rotate(${-legSwing} 25 -150)`} />
    <path d="M-76 -320 Q-80 -350 -44 -354 L44 -354 Q80 -350 76 -320 L70 -150 L-70 -150 Z" fill="#ff7a1a" />
    <path d="M10 -354 L44 -354 Q80 -350 76 -320 L70 -150 L10 -150 Z" fill="#d95f0a" />
    <rect x={-10} y={-350} width={20} height={200} fill="#ffd23f" opacity={0.0} />
    <rect x={-70} y={-250} width={140} height={14} fill="#ffe08a" opacity={0.85} />
    <rect x={-84} y={-326} width={34} height={120} rx={17} fill="#ff7a1a" transform="rotate(8 -66 -326)" />
    <g transform={`translate(66 -326) rotate(${armR ?? (pose === 'wave' ? 150 : -8)})`}>
      <rect x={-17} y={0} width={34} height={120} rx={17} fill="#d95f0a" />
      <circle cx={0} cy={126} r={18} fill="#f2b98a" />
    </g>
    <circle cx={-66} cy={-206} r={18} fill="#f2b98a" />
    <circle cx={0} cy={-396} r={58} fill="#f2b98a" />
    <path d="M-60 -400 Q-62 -466 0 -468 Q62 -466 60 -400 Q40 -430 0 -430 Q-40 -430 -60 -400 Z" fill="#2a2f45" />
    <circle cx={-22} cy={-392} r={7} fill="#1a1a24" />
    <circle cx={22} cy={-392} r={7} fill="#1a1a24" />
    <path d="M-16 -366 Q0 -354 16 -366" stroke="#8a4a2a" strokeWidth={5} fill="none" strokeLinecap="round" />
  </g>
);

export const FloodScene: React.FC<{t: number; level: number}> = ({t, level}) => (
  <g>
    <defs>
      <linearGradient id="fsky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#070b18" />
        <stop offset="1" stopColor="#182340" />
      </linearGradient>
      <linearGradient id="fwater" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#1a4a6a" />
        <stop offset="1" stopColor="#0a1f33" />
      </linearGradient>
    </defs>
    <rect x={-300} y={-300} width={1680} height={2500} fill="url(#fsky)" />
    {Array.from({length: 40}).map((_, i) => (
      <circle key={i} cx={rnd(i) * 1080} cy={rnd(i + 1) * 800} r={1.4} fill="#cfe2ff" opacity={0.35} />
    ))}
    <circle cx={850} cy={330} r={70} fill="#dfe9ff" opacity={0.85} />
    <circle cx={820} cy={310} r={70} fill="#070b18" opacity={0.0} />
    {/* far submerged houses */}
    {[0, 1, 2].map((i) => (
      <g key={i} transform={`translate(${130 + i * 400} ${1040 + (i % 2) * 40})`}>
        <rect x={-90} y={-90} width={180} height={110} fill="#0f1730" />
        <path d="M-110 -88 L0 -150 L110 -88 Z" fill="#0b1226" />
        <rect x={-50} y={-60} width={34} height={28} fill="#f2c94c" opacity={0.7} />
      </g>
    ))}
    {/* house + roof (the hero's refuge) */}
    <g transform="translate(540 1300)">
      <rect x={-420} y={-40} width={840} height={600} fill="#141c33" />
      <path d="M-500 -40 L0 -300 L500 -40 Z" fill="#202b4a" />
      <path d="M-500 -40 L0 -300 L500 -40 L460 -40 L0 -262 L-460 -40 Z" fill="#2b3a64" />
      <rect x={200} y={-300} width={60} height={120} fill="#202b4a" />
    </g>
    {/* water */}
    <rect x={-300} y={lerpY(level)} width={1680} height={1200} fill="url(#fwater)" opacity={0.95} />
    {Array.from({length: 14}).map((_, i) => (
      <rect key={i} x={((i * 150 + t * 40) % 1300) - 100} y={lerpY(level) + 30 + (i % 4) * 46} width={90} height={5} rx={3} fill="#6ab4e0" opacity={0.4} />
    ))}
    {/* rain */}
    {Array.from({length: 70}).map((_, i) => {
      const x = (rnd(i) * 1200 + t * 220) % 1200 - 60;
      const y = (rnd(i + 9) * 1900 + t * 900) % 1900;
      return <line key={i} x1={x} y1={y} x2={x - 16} y2={y + 48} stroke="#9fc2ea" strokeWidth={2.5} opacity={0.35} />;
    })}
  </g>
);
const lerpY = (level: number) => 1500 - level * 360;

export const FloodPreview: React.FC = () => {
  const t = 2.1;
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        <FloodScene t={t} level={0.55} />
        <FlatHero x={420} y={1160} s={1.35} pose="wave" />
        <HudBar place="КРЫША" time="04:12" />
        <Tag x={44} y={140} text="ОШИБКА 1: ПЛЫТЬ" />
        <Chip x={44} y={214} color="red" text="ПОД ВОДОЙ: ПРОВОДА" />
        <Chip x={44} y={282} color="yellow" text="ТЕЧЕНИЕ СБИВАЕТ ЗА 1 СЕК" />
        <Chip x={44} y={350} color="green" text="ЗВОНИ 112" />
        <Stamp x={560} y={560} text="НЕ ПЛЫВИ" rot={-5} />
      </svg>
      <AbsoluteFill style={{justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 330}}>
        <div style={{width: 960, textAlign: 'center', fontFamily: FONT, fontWeight: 700, fontSize: 92, lineHeight: 1.04, color: '#fff', WebkitTextStroke: '10px #05070f', paintOrder: 'stroke fill'}}>
          ОСТАВАЙСЯ <span style={{color: '#ff4a4a'}}>НА КРЫШЕ</span>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
