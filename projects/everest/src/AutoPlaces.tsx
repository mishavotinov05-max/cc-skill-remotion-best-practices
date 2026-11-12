import React from 'react';
import {ease, lerp, rnd} from './util';
import {FONT, GarageInside, GarageRow, IconLift, P, Zhiguli} from './AutoArt';
import {T} from './AutoInfo';

export const Sport: React.FC<{x: number; y: number; s?: number; color?: string; flip?: boolean}> = ({x, y, s = 1, color = '#d6302b', flip}) => (
  <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
    <ellipse cx={0} cy={6} rx={320} ry={18} fill="#000" opacity={0.3} />
    <path d="M-310 -30 L-310 -66 Q-300 -96 -240 -104 L-120 -114 L-40 -168 Q40 -182 120 -168 L200 -120 L290 -100 Q312 -80 312 -30 Z" fill={color} />
    <path d="M-100 -120 L-30 -160 Q40 -168 100 -158 L150 -120 Z" fill="#9fd4f0" opacity={0.9} />
    <path d="M-300 -60 L300 -62" stroke="#fff" strokeWidth={6} opacity={0.35} />
    <rect x={250} y={-92} width={54} height={18} rx={8} fill="#fff6b0" />
    {[-190, 190].map((c) => (
      <g key={c}>
        <circle cx={c} cy={-26} r={46} fill="#14151a" />
        <circle cx={c} cy={-26} r={28} fill="#d9dde6" />
        <circle cx={c} cy={-26} r={8} fill="#555a66" />
      </g>
    ))}
  </g>
);

// ---------- 1. luxury showroom ----------
export const ShowroomOut: React.FC<{t: number}> = ({t}) => (
  <g>
    <defs>
      <linearGradient id="srsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#5fb4ff" /><stop offset="1" stopColor="#eaf6ff" /></linearGradient>
      <linearGradient id="srglass" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#bfe6ff" /><stop offset="1" stopColor="#ffe9b8" /></linearGradient>
    </defs>
    <rect x={-400} y={-300} width={1900} height={1700} fill="url(#srsky)" />
    <circle cx={900} cy={380} r={140} fill="#fff7d0" opacity={0.8} />
    {[0, 1, 2, 3, 4, 5].map((i) => <rect key={i} x={-300 + i * 300} y={640 - (i % 3) * 90} width={200} height={600 + (i % 3) * 90} fill="#8fa9c6" opacity={0.7} />)}
    <rect x={-300} y={720} width={1800} height={520} fill="#1d2029" />
    <rect x={-300} y={640} width={1800} height={110} fill="#14161d" />
    <rect x={-300} y={740} width={1800} height={8} fill={'#ffd23f'} />
    <T x={600} y={722} size={78} fill="#ffd23f" stroke="#14161d">ПРЕМИУМ АВТО</T>
    {Array.from({length: 7}).map((_, i) => (
      <g key={i}>
        <rect x={-260 + i * 250} y={770} width={236} height={440} fill="url(#srglass)" />
        <path d={`M${-230 + i * 250} 1200 L${-150 + i * 250} 770 L${-120 + i * 250} 770 L${-200 + i * 250} 1200 Z`} fill="#fff" opacity={0.35} />
        <rect x={-266 + i * 250} y={770} width={10} height={440} fill="#c9a23a" />
      </g>
    ))}
    {[0, 1, 2].map((i) => <Sport key={i} x={50 + i * 480} y={1195} s={0.55} color={['#2b66d6', '#e8e8ee', '#d6302b'][i]} />)}
    {[0, 1, 2, 3].map((i) => <circle key={i} cx={80 + i * 400} cy={820} r={14} fill="#fff6b0" opacity={0.9 - (Math.sin(t * 3 + i) + 1) * 0.1} />)}
    <rect x={-300} y={1240} width={1800} height={700} fill="#2a2e38" />
    {Array.from({length: 8}).map((_, i) => <rect key={i} x={-300 + i * 260} y={1240} width={3} height={700} fill="#fff" opacity={0.1} />)}
    {Array.from({length: 5}).map((_, i) => <ellipse key={i} cx={100 + i * 280} cy={1400 + (i % 2) * 120} rx={120} ry={10} fill="#fff" opacity={0.1} />)}
    <rect x={480} y={1010} width={260} height={200} fill="#9fd4f0" opacity={0.9} stroke="#c9a23a" strokeWidth={8} />
    <rect x={600} y={1010} width={4} height={200} fill="#c9a23a" />
    <Sport x={260} y={1560} s={1.25} color="#d6302b" />
    {[60, 1020].map((x) => <g key={x}><rect x={x - 5} y={1100} width={10} height={420} fill="#c9a23a" /><circle cx={x} cy={1090} r={30} fill="#fff6b0" /></g>)}
  </g>
);
export const ShowroomIn: React.FC<{t: number}> = ({t}) => (
  <g>
    <defs>
      <linearGradient id="srfl" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#e9ecf2" /><stop offset="1" stopColor="#aeb6c6" /></linearGradient>
      <radialGradient id="srspot" cx="0.5" cy="0" r="1"><stop offset="0" stopColor="#fff6c8" stopOpacity={0.55} /><stop offset="1" stopColor="#fff6c8" stopOpacity={0} /></radialGradient>
    </defs>
    <rect x={-300} y={-300} width={1700} height={1450} fill="#cfd8e6" />
    <rect x={-300} y={150} width={1700} height={820} fill="#8fc4ee" />
    {[0, 1, 2, 3, 4, 5].map((i) => <rect key={i} x={-260 + i * 300} y={620 - (i % 3) * 120} width={200} height={360 + (i % 3) * 120} fill="#6f8fb4" opacity={0.7} />)}
    {[0, 1, 2, 3, 4, 5].map((i) => <rect key={i} x={-300 + i * 300} y={150} width={10} height={820} fill="#c9a23a" />)}
    <rect x={-300} y={970} width={1700} height={950} fill="url(#srfl)" />
    {Array.from({length: 9}).map((_, i) => <path key={i} d={`M${540 + (i - 4) * 40} 970 L${540 + (i - 4) * 420} 1920`} stroke="#fff" strokeWidth={3} opacity={0.5} />)}
    {[0, 1, 2].map((i) => <rect key={i} x={-300} y={1100 + i * 260} width={1700} height={3} fill="#fff" opacity={0.5} />)}
    {[180, 540, 900].map((x, i) => (
      <g key={x}>
        <polygon points={`${x - 40},40 ${x + 40},40 ${x + 330},1300 ${x - 330},1300`} fill="url(#srspot)" opacity={0.5} />
        <ellipse cx={x} cy={1250} rx={300} ry={46} fill="#2a2e38" />
        <ellipse cx={x} cy={1236} rx={300} ry={46} fill="#d9dde6" stroke="#c9a23a" strokeWidth={6} />
        <Sport x={x + Math.sin(t * 0.6 + i) * 8} y={1226} s={0.7} color={['#2b66d6', '#d6302b', '#e8e8ee'][i]} />
        <rect x={x - 130} y={1290} width={260} height={64} rx={10} fill="#14161d" stroke="#ffd23f" strokeWidth={4} />
        <T x={x} y={1334} size={28} fill="#ffd23f">ЭЛИТ-КЛАСС</T>
      </g>
    ))}
    <g transform="translate(540 -20)">
      <rect x={-6} y={-300} width={12} height={300} fill="#c9a23a" />
      {Array.from({length: 9}).map((_, i) => <g key={i} transform={`rotate(${(i - 4) * 18}) translate(0 160)`}><rect x={-3} y={-160} width={6} height={160} fill="#c9a23a" /><circle r={14} fill="#fff6b0" /></g>)}
      <circle r={44} fill="#ffe27a" stroke="#c9a23a" strokeWidth={6} />
    </g>
  </g>
);

// ---------- 2. mid-class service ----------
export const ServiceOut: React.FC<{t: number}> = ({t}) => (
  <g>
    <defs>
      <linearGradient id="svsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#9ed2ff" /><stop offset="1" stopColor="#f4fbff" /></linearGradient>
    </defs>
    <rect x={-400} y={-300} width={1900} height={1700} fill="url(#svsky)" />
    {[0, 1, 2, 3, 4].map((i) => <g key={i}><rect x={-100 + i * 300} y={820} width={26} height={260} fill="#6b4a2a" /><circle cx={-87 + i * 300} cy={760} r={130} fill={['#4f9a4a', '#5aab52', '#3f8a44'][i % 3]} /></g>)}
    <rect x={-300} y={900} width={1800} height={380} fill="#eef1f6" />
    <rect x={-300} y={820} width={1800} height={100} fill="#2f6fbb" />
    <T x={380} y={895} size={76}>АВТОСЕРВИС</T>
    <rect x={-300} y={918} width={1800} height={10} fill="#ffd23f" />
    <rect x={60} y={980} width={380} height={300} fill="#3a3f4a" />
    <rect x={60} y={980} width={380} height={80} fill="#9aa3b0" />
    {[0, 1, 2, 3].map((q) => <rect key={q} x={60} y={990 + q * 18} width={380} height={4} fill="#000" opacity={0.2} />)}
    <rect x={90} y={1070} width={320} height={210} fill="#fff2c8" />
    <g transform="translate(250 1280) scale(0.6)"><IconLift s={1} /></g>
    <rect x={560} y={980} width={380} height={300} fill="#a9b2c0" stroke="#6b7482" strokeWidth={6} />
    {[0, 1, 2, 3, 4, 5, 6, 7].map((q) => <rect key={q} x={560} y={992 + q * 36} width={380} height={5} fill="#000" opacity={0.2} />)}
    <rect x={990} y={1020} width={130} height={260} fill="#fff" stroke="#6b7482" strokeWidth={6} />
    <rect x={-300} y={1280} width={1800} height={640} fill="#555a66" />
    {Array.from({length: 6}).map((_, i) => <rect key={i} x={((i * 300 - t * 0) % 1800) - 200} y={1560} width={170} height={12} fill="#f0f0f0" />)}
    <Zhiguli x={760} y={1500} s={1.0} color="#4a7fd6" />
    <Zhiguli x={200} y={1640} s={0.8} color="#e8e8ee" />
    {[0, 1, 2].map((i) => <ellipse key={i} cx={1000} cy={1300 - i * 36} rx={60} ry={20} fill="#17181d" stroke="#33353d" strokeWidth={5} />)}
    {[0, 1].map((i) => <g key={i}><path d={`M${420 + i * 70} 1300 l20 -70 l20 70 Z`} fill="#ff7a2a" /><rect x={416 + i * 70} y={1296} width={48} height={8} fill="#ff7a2a" /></g>)}
  </g>
);
export const ServiceIn: React.FC<{t: number}> = ({t}) => (
  <g>
    <rect x={-300} y={-300} width={1700} height={1500} fill="#dde5ee" />
    <rect x={-300} y={-300} width={1700} height={500} fill="#c5d0de" />
    {[0, 1, 2].map((i) => <g key={i}><rect x={80 + i * 340} y={110} width={280} height={18} rx={9} fill="#fff" /><polygon points={`${100 + i * 340},128 ${340 + i * 340},128 ${440 + i * 340},900 ${0 + i * 340},900`} fill="#fff" opacity={0.12} /></g>)}
    <rect x={720} y={330} width={300} height={300} rx={8} fill="#bfe3ff" stroke="#6b7482" strokeWidth={10} />
    <rect x={40} y={300} width={400} height={420} fill="#9aa3b0" />
    {[0, 1, 2].map((r) => <g key={r}>{[0, 1, 2, 3, 4].map((c) => <rect key={c} x={70 + c * 72} y={330 + r * 120} width={50} height={90} rx={6} fill={['#d33a2c', '#2f6fbb', '#f2c200', '#2fbf60', '#888'][(r + c) % 5]} />)}</g>)}
    <rect x={-300} y={900} width={1700} height={1020} fill="#c9d0da" />
    {Array.from({length: 9}).map((_, i) => <rect key={i} x={-300 + i * 220} y={900} width={3} height={1020} fill="#fff" opacity={0.5} />)}
    {Array.from({length: 7}).map((_, i) => <rect key={i} x={-300} y={950 + i * 150} width={1700} height={3} fill="#fff" opacity={0.5} />)}
    <rect x={-300} y={1500} width={1700} height={16} fill="#ffd23f" />
    <g transform={`translate(330 1400) scale(1.7)`}>
      <IconLift s={1} />
    </g>
    <Zhiguli x={330} y={1010 - Math.sin(t * 0.4) * 6} s={0.9} color="#d9c9a2" />
    <g transform={`translate(820 1450) scale(1.4)`}><IconLift s={1} /></g>
    <g transform="translate(960 1740) scale(1.3)"><rect x={-90} y={-170} width={180} height={190} rx={10} fill="#d33a2c" stroke="#7a1f16" strokeWidth={6} />{[0, 1, 2].map((q) => <rect key={q} x={-76} y={-150 + q * 56} width={152} height={42} rx={6} fill="#a82a1e" />)}</g>
  </g>
);

// ---------- 3. co-op garage ----------
export const CoopOut: React.FC<{t: number; open?: number}> = ({t, open = 0}) => (
  <g>
    <rect x={-300} y={-300} width={1700} height={900} fill="#b8cadf" />
    <GarageRow t={t} pan={405} gateOpen={open} />
  </g>
);
export const CoopIn: React.FC<{t: number}> = ({t}) => (
  <g>
    <GarageInside t={t} lightShaft={0.8} />
    {[0, 1].map((i) => <g key={i}><rect x={640 + i * 160} y={820 - i * 60} width={140} height={90 + i * 60} fill="#a9764e" stroke="#6a4a22" strokeWidth={5} /><rect x={640 + i * 160} y={820 - i * 60} width={140} height={14} fill="#c89a62" /></g>)}
    {[0, 1, 2].map((i) => <ellipse key={i} cx={920} cy={870 - i * 38} rx={64} ry={20} fill="#17181d" stroke="#33353d" strokeWidth={5} />)}
    <path d="M330 1030 L930 1030" stroke="#ffd23f" strokeWidth={6} strokeDasharray="30 18" />
    <path d="M330 1010 L330 1050 M930 1010 L930 1050" stroke="#ffd23f" strokeWidth={6} />
  </g>
);
export {lerp, ease, rnd, P, FONT};
