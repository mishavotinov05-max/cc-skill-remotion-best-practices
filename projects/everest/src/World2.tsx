import React from 'react';
import {clamp, rnd} from './util';

export const World2: React.FC<{t: number; tableX: number; streaks: number[]; scratch: number; letters: number; backShake: number; doorOpen: number; handleAng: number}> = ({t, tableX, streaks, scratch, letters, backShake, doorOpen, handleAng}) => {
  const fl = 0.75 + 0.25 * Math.sin(t * 17) * Math.sin(t * 5.3) + 0.1 * Math.sin(t * 41);
  const tags: {x: number; y: number}[] = [];
  for (let r = 0; r < 3; r++) for (let c = 0; c < 7; c++) tags.push({x: 3040 + c * 150, y: 300 + r * 140});
  const knock: number[] = [];
  return (
    <g>
      <defs>
        <linearGradient id="wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0e0b0a" />
          <stop offset="1" stopColor="#1a1410" />
        </linearGradient>
        <radialGradient id="fireGlow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#ff9a3c" stopOpacity={0.55} />
          <stop offset="1" stopColor="#ff6a00" stopOpacity={0} />
        </radialGradient>
        <linearGradient id="mugFrost" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#dbe9f7" />
          <stop offset="1" stopColor="#7e97b3" />
        </linearGradient>
        <linearGradient id="mugHot" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#8a8f96" />
          <stop offset="1" stopColor="#3a3d42" />
        </linearGradient>
      </defs>
      <rect x={-200} y={-1500} width={4900} height={2360} fill="url(#wall)" />
      {Array.from({length: 52}).map((_, i) => (
        <rect key={i} x={i * 90} y={0} width={3} height={860} fill="#000" opacity={0.5} />
      ))}
      <rect x={-200} y={820} width={4900} height={1500} fill="#0a0807" />
      {Array.from({length: 8}).map((_, i) => (
        <rect key={i} x={-200} y={850 + i * 36} width={4900} height={2} fill="#000" opacity={0.6} />
      ))}
      {/* window */}
      <rect x={130} y={160} width={450} height={470} fill="#02040a" stroke="#2c2520" strokeWidth={18} />
      <path d="M148 520 L260 430 L330 480 L420 380 L520 470 L562 440 L562 612 L148 612 Z" fill="#26405f" />
      <path d="M148 560 L300 520 L420 560 L562 520 L562 612 L148 612 Z" fill="#0d1626" />
      <rect x={353} y={160} width={14} height={470} fill="#2c2520" />
      <rect x={130} y={380} width={450} height={14} fill="#2c2520" />
      {Array.from({length: 18}).map((_, i) => (
        <circle key={i} cx={160 + rnd(i) * 390} cy={180 + rnd(i + 5) * 190} r={1.4} fill="#fff" opacity={0.7} />
      ))}
      <rect x={130} y={160} width={450} height={470} fill="#9fc3f0" opacity={0.05} />
      {[0, 1, 2].map((k) => (
        <path key={k} d={`M${200 + k * 48} 410 Q${210 + k * 48} 480 ${196 + k * 48} 565`} pathLength={1} stroke="#d4e6f8" strokeWidth={9} strokeLinecap="round" fill="none" opacity={0.75} strokeDasharray={1} strokeDashoffset={1 - (streaks[k] || 0)} />
      ))}
      {/* front door */}
      <g>
        <rect x={1000} y={150} width={350} height={690} fill="#0b0908" stroke="#2c2520" strokeWidth={14} />
        {doorOpen > 0.01 && (
          <g>
            <rect x={1014} y={164} width={322} height={662} fill="#0d1a2e" />
            <rect x={1014} y={640} width={322} height={186} fill="#2a3f5e" />
            {Array.from({length: 18}).map((_, i) => (
              <circle key={i} cx={1020 + ((rnd(i) * 320 + t * 160 * (0.5 + rnd(i + 2))) % 320)} cy={180 + rnd(i + 8) * 620} r={1.5 + rnd(i + 4) * 2.5} fill="#e8f1fb" opacity={0.75} />
            ))}
            <path d="M1000 826 L1350 826 L1560 1010 L800 1010 Z" fill="#9fc3f0" opacity={0.22 * doorOpen} />
          </g>
        )}
        <g>
          <rect x={1014} y={164} width={322 * (1 - 0.8 * doorOpen)} height={662} fill="#241b15" />
          {[0.3, 0.6, 0.85].map((f) => (
            <rect key={f} x={1014 + 322 * (1 - 0.8 * doorOpen) * f} y={164} width={3} height={662} fill="#000" opacity={0.45} />
          ))}
          <g transform={`translate(${1014 + 322 * (1 - 0.8 * doorOpen) - 44} 560)`}>
            <circle r={20} fill="#5e5c57" stroke="#000" strokeWidth={2} />
            <rect x={-96} y={-8} width={110} height={16} rx={8} fill="#77746d" stroke="#000" strokeWidth={2} transform={`rotate(${handleAng})`} />
            <circle r={9} fill="#8d8a84" />
          </g>
        </g>
      </g>
      {/* stove */}
      <g transform="translate(1500 0)">
        <rect x={110} y={-40} width={50} height={560} fill="#14110f" />
        <ellipse cx={135} cy={720} rx={420} ry={260} fill="url(#fireGlow)" opacity={fl} />
        <rect x={0} y={510} width={270} height={290} rx={12} fill="#1b1b1d" stroke="#050505" strokeWidth={4} />
        <rect x={20} y={500} width={230} height={26} rx={6} fill="#0b0b0c" />
        <rect x={50} y={590} width={170} height={110} rx={8} fill="#050505" />
        <rect x={60} y={610} width={150} height={70} rx={6} fill="#ff8a2a" opacity={0.65 + 0.3 * fl} />
        <path d={`M80 680 Q100 ${600 - 18 * fl} 125 660 Q140 ${590 - 22 * fl} 160 650 Q185 ${610 - 14 * fl} 195 680 Z`} fill="#ffd27a" opacity={0.9} />
        <rect x={10} y={800} width={24} height={40} fill="#050505" />
        <rect x={236} y={800} width={24} height={40} fill="#050505" />
      </g>
      {/* empty firewood place */}
      <g transform="translate(1860 0)">
        <rect x={0} y={700} width={190} height={140} fill="#0b0908" stroke="#2a2018" strokeWidth={5} />
        <path d="M0 700 L190 840 M190 700 L0 840" stroke="#1a130d" strokeWidth={3} />
        <rect x={10} y={790} width={170} height={50} fill="#030303" />
      </g>
      {/* table + mugs */}
      <g transform={`translate(${tableX} 0)`}>
        <rect x={0} y={700} width={640} height={26} fill="#2a1e14" />
        <rect x={30} y={726} width={26} height={150} fill="#1d150e" />
        <rect x={584} y={726} width={26} height={150} fill="#1d150e" />
        <g transform="translate(180 0)">
          <rect x={0} y={590} width={110} height={112} rx={14} fill="url(#mugFrost)" />
          <path d="M110 615 Q165 625 110 675" stroke="#cfe0f2" strokeWidth={14} fill="none" />
          {Array.from({length: 14}).map((_, i) => (
            <circle key={i} cx={10 + rnd(i) * 90} cy={600 + rnd(i + 2) * 95} r={3 + rnd(i + 4) * 7} fill="#fff" opacity={0.7} />
          ))}
        </g>
        <g transform="translate(380 0)">
          <rect x={0} y={590} width={110} height={112} rx={14} fill="url(#mugHot)" />
          <path d="M110 615 Q165 625 110 675" stroke="#5a5e65" strokeWidth={14} fill="none" />
          <ellipse cx={55} cy={594} rx={44} ry={8} fill="#1a0e08" />
          {Array.from({length: 7}).map((_, i) => {
            const ph = (t * 0.55 + i / 7) % 1;
            return <circle key={i} cx={55 + Math.sin(ph * 8 + i) * 16} cy={580 - ph * 190} r={14 + ph * 28} fill="#e8eef5" opacity={0.28 * (1 - ph)} />;
          })}
        </g>
      </g>
      {/* name tags wall */}
      <rect x={2960} y={230} width={1120} height={520} fill="#0a0808" opacity={0.6} />
      {tags.map((g, i) => (
        <g key={i} transform={`translate(${g.x} ${g.y}) rotate(${(rnd(i) - 0.5) * 4})`} opacity={0.9}>
          <line x1={20} y1={-30} x2={20} y2={0} stroke="#2a2724" strokeWidth={3} />
          <rect x={0} y={0} width={110} height={56} rx={6} fill="#1d1c1b" stroke="#3a3835" strokeWidth={2} />
          {[0, 1, 2].map((r) => (
            <rect key={r} x={12} y={12 + r * 14} width={30 + rnd(i * 3 + r) * 60} height={5} rx={2} fill="#6d6a64" opacity={0.7} />
          ))}
        </g>
      ))}
      {/* the fresh scratch */}
      <g>
        <path d="M3690 390 L3770 520 L3745 585" stroke="#d9e4f0" strokeWidth={5} fill="none" strokeLinecap="round" opacity={0.85} />
        <path d="M3700 392 L3782 526" stroke="#ffffff" strokeWidth={2} fill="none" opacity={0.7} />
      </g>
      {/* back door */}
      <g>
        <rect x={4190} y={170} width={330} height={670} fill="#0b0908" stroke="#2c2520" strokeWidth={14} />
        <g transform={`translate(${backShake} 0)`}>
          <rect x={4204} y={184} width={302} height={642} fill="#1f1813" />
          {[4260, 4330, 4400, 4460].map((x) => (
            <rect key={x} x={x} y={184} width={3} height={642} fill="#000" opacity={0.45} />
          ))}
          <circle cx={4240} cy={560} r={14} fill="#5e5c57" stroke="#000" strokeWidth={2} />
        </g>
        <rect x={4204} y={822} width={302} height={5} fill="#9fc3f0" opacity={0.45} />
      </g>
      {/* frost on the right wall + falling frost on knocks */}
      <rect x={4120} y={150} width={420} height={640} fill="#bcd4ec" opacity={0.07} />
      {knock.map((k, ki) =>
        t >= k
          ? Array.from({length: 22}).map((_, i) => {
              const d = t - k;
              if (d > 1.6) return null;
              const x = 4130 + rnd(i + ki * 40) * 360;
              const y = 200 + rnd(i + 3 + ki * 40) * 200 + d * (140 + rnd(i) * 160);
              return <circle key={`${ki}-${i}`} cx={x} cy={y} r={1.5 + rnd(i + 9) * 3.5} fill="#e8f1fb" opacity={0.85 * (1 - d / 1.6)} />;
            })
          : null
      )}
      {/* fresh scratches and the word */}
      <g>
        {Array.from({length: 16}).map((_, i) => {
          const x0 = 1930 + rnd(i * 3) * 440;
          const y0 = 200 + rnd(i * 3 + 1) * 340;
          const ln = 90 + rnd(i * 3 + 2) * 150;
          const vis = clamp((scratch * 16 - i) / 1);
          return <path key={i} d={`M${x0} ${y0} l${ln * 0.55} ${ln * 0.85}`} pathLength={1} stroke="#cdbb9f" strokeWidth={3 + rnd(i) * 3} strokeLinecap="round" opacity={0.8} strokeDasharray={1} strokeDashoffset={1 - vis} />;
        })}
        {[
          'M2018 300 L1960 300 L1960 430 L1995 430 Q2028 430 2028 395 Q2028 360 1995 360 L1960 360',
          'M2112 300 L2050 300 L2050 430 L2112 430 M2050 365 L2100 365',
          'M2150 430 L2150 300 L2210 300',
          'M2250 300 L2250 430 L2316 300 L2316 430',
        ].map((d, i) => (
          <path key={i} d={d} pathLength={1} stroke="#e6d6bb" strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" fill="none" strokeDasharray={1} strokeDashoffset={1 - clamp(letters - i)} />
        ))}
      </g>
    </g>
  );
};

