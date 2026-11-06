import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame} from 'remotion';
import phrases from './phrases.json';
import {Key, cam, clamp, ease, lerp, rnd, seg} from './util';

export const FPS = 30;
export const DURATION = 74;

const RED = '#8e1c1c';
const RED_D = '#5a1010';
const INK = '#07080b';

// ---------- shared pieces ----------

const Shot: React.FC<{a: number; b: number; t: number; fade?: number; children: React.ReactNode}> = ({a, b, t, fade = 0.06, children}) => {
  if (t < a - 0.001 || t > b + 0.001) return null;
  const o = Math.min(clamp((t - a) / fade), clamp((b - t) / fade));
  return <AbsoluteFill style={{opacity: o}}>{children}</AbsoluteFill>;
};

const shake = (t: number, amp: number) => ({
  x: amp * (Math.sin(t * 61.3) + 0.6 * Math.sin(t * 97.1 + 1)),
  y: amp * (Math.sin(t * 53.7 + 2) + 0.6 * Math.sin(t * 83.9)),
});

const Snow: React.FC<{t: number; n?: number; speed?: number; w?: number; h?: number; op?: number}> = ({t, n = 70, speed = 60, w = 1920, h = 1080, op = 0.6}) => (
  <g>
    {Array.from({length: n}).map((_, i) => {
      const x = (rnd(i) * w + t * speed * (0.6 + rnd(i + 9)) + Math.sin(t + i) * 20) % w;
      const y = (rnd(i + 50) * h + t * 25 * (0.5 + rnd(i + 3))) % h;
      return <circle key={i} cx={x} cy={y} r={1 + rnd(i + 7) * 2.2} fill="#dfe9f5" opacity={op * (0.3 + rnd(i + 4) * 0.7)} />;
    })}
  </g>
);

type FaceProps = {look: number; fear: number};

const Head: React.FC<{cx: number; cy: number; r: number} & FaceProps> = ({cx, cy, r, look, fear}) => {
  const sh = look * r * 0.22;
  const eye = (side: number) => {
    const ex = cx + sh + side * r * 0.36;
    const ey = cy - r * 0.02;
    return (
      <g key={side}>
        <ellipse cx={ex} cy={ey} rx={r * 0.19} ry={r * (0.13 + 0.07 * fear)} fill="#f2efe9" stroke="#2a1a14" strokeWidth={1.5} />
        <circle cx={ex + look * r * 0.07} cy={ey} r={r * (0.075 + 0.02 * fear)} fill="#1b120d" />
        <circle cx={ex + look * r * 0.07 - 2} cy={ey - 2} r={r * 0.025} fill="#fff" />
        <path d={`M${ex - r * 0.24} ${ey - r * (0.27 + 0.04 * fear) + side * fear * -r * 0.0} L${ex + r * 0.24} ${ey - r * (0.27 + 0.12 * fear * (side * -1 === -1 ? 1 : 1)) - side * r * 0.0}`} stroke="#1a100c" strokeWidth={r * 0.07} strokeLinecap="round" transform={`rotate(${side * -fear * 10} ${ex} ${ey - r * 0.3})`} />
      </g>
    );
  };
  return (
    <g>
      <circle cx={cx - r * 0.97} cy={cy + r * 0.08} r={r * 0.17} fill="#c28d70" />
      <circle cx={cx + r * 0.97} cy={cy + r * 0.08} r={r * 0.17} fill="#c28d70" />
      <ellipse cx={cx} cy={cy} rx={r * 0.98} ry={r * 1.08} fill="#d9a98a" />
      <ellipse cx={cx + r * 0.45} cy={cy + r * 0.1} rx={r * 0.5} ry={r * 0.95} fill="#9c6a52" opacity={0.28} />
      <path d={`M${cx - r * 1.02} ${cy - r * 0.15} Q${cx - r * 1.1} ${cy - r * 1.25} ${cx} ${cy - r * 1.22} Q${cx + r * 1.1} ${cy - r * 1.25} ${cx + r * 1.02} ${cy - r * 0.15} Q${cx + r * 0.7} ${cy - r * 0.62} ${cx} ${cy - r * 0.58} Q${cx - r * 0.7} ${cy - r * 0.62} ${cx - r * 1.02} ${cy - r * 0.15} Z`} fill="#17100c" />
      {eye(-1)}
      {eye(1)}
      <path d={`M${cx + sh} ${cy + r * 0.02} Q${cx + sh + r * 0.1} ${cy + r * 0.3} ${cx + sh - r * 0.04} ${cy + r * 0.34}`} stroke="#8a5a45" strokeWidth={r * 0.05} fill="none" strokeLinecap="round" />
      <ellipse cx={cx + sh} cy={cy + r * 0.56} rx={r * 0.17} ry={r * (0.035 + 0.16 * fear)} fill="#3a0f0f" stroke="#6a3a30" strokeWidth={2} />
      <path d={`M${cx - r * 0.55} ${cy + r * 0.62} Q${cx} ${cy + r * 0.95} ${cx + r * 0.55} ${cy + r * 0.62}`} stroke="#2a1a14" strokeWidth={r * 0.03} fill="none" opacity={0.18} />
      <ellipse cx={cx - r * 0.5 + sh} cy={cy + r * 0.3} rx={r * 0.17} ry={r * 0.09} fill="#e8f1fb" opacity={0.15} />
      <ellipse cx={cx + r * 0.5 + sh} cy={cy + r * 0.3} rx={r * 0.17} ry={r * 0.09} fill="#e8f1fb" opacity={0.15} />
    </g>
  );
};

const Figure: React.FC<{x: number; y: number; s?: number; sitting?: boolean; face?: FaceProps}> = ({x, y, s = 1, sitting, face}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    {sitting ? (
      <g>
        <ellipse cx={-60} cy={-18} rx={90} ry={22} fill={INK} />
        <path d="M-50 -20 Q-70 -170 -20 -230 Q30 -250 70 -210 Q100 -120 80 -20 Z" fill={RED} />
        <path d="M30 -215 Q90 -150 80 -20 L50 -20 Q60 -140 20 -200 Z" fill={RED_D} />
        {face ? <Head cx={10} cy={-278} r={46} {...face} /> : <circle cx={10} cy={-275} r={44} fill={INK} />}
        <path d="M-60 -40 Q-130 -60 -160 -20" stroke={INK} strokeWidth={36} strokeLinecap="round" fill="none" />
      </g>
    ) : (
      <g>
        <rect x={-48} y={-140} width={34} height={140} rx={14} fill={INK} />
        <rect x={14} y={-140} width={34} height={140} rx={14} fill={INK} />
        <path d="M-70 -150 Q-78 -300 -40 -350 L40 -350 Q78 -300 70 -150 Z" fill={RED} />
        <path d="M20 -345 Q70 -300 70 -150 L45 -150 Q50 -290 12 -340 Z" fill={RED_D} />
        <rect x={-96} y={-340} width={30} height={170} rx={14} fill={RED} transform="rotate(8 -80 -340)" />
        <rect x={66} y={-340} width={30} height={170} rx={14} fill={RED_D} transform="rotate(-8 80 -340)" />
        {face ? <Head cx={0} cy={-395} r={46} {...face} /> : <circle cx={0} cy={-392} r={42} fill={INK} />}
      </g>
    )}
  </g>
);

const Door: React.FC<{t: number; t0: number; t1: number; zoom: number; flipAngle?: number}> = ({t, t0, t1, zoom, flipAngle = -38}) => {
  const ang = flipAngle * seg(t, t0, t1);
  const px = 1180;
  const py = 560;
  return (
    <svg width={1080} height={1920} viewBox="0 0 1080 1920"><g transform="translate(540 960) translate(-960 -540)">
      <defs>
        <linearGradient id="dw" x1="0" x2="1">
          <stop offset="0" stopColor="#1b1612" />
          <stop offset="0.5" stopColor="#2a211a" />
          <stop offset="1" stopColor="#120e0b" />
        </linearGradient>
        <linearGradient id="metal" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#8d8a84" />
          <stop offset="0.5" stopColor="#4a4843" />
          <stop offset="1" stopColor="#1d1c1a" />
        </linearGradient>
      </defs>
      <g transform={`translate(${px} ${py}) scale(${zoom}) translate(${-px} ${-py})`}>
        <rect x={-1500} y={-1500} width={5000} height={5000} fill="url(#dw)" />
        {Array.from({length: 14}).map((_, i) => (
          <rect key={i} x={i * 150 - 40} y={-800} width={4} height={3000} fill="#000" opacity={0.45} />
        ))}
        {Array.from({length: 40}).map((_, i) => (
          <rect key={i} x={rnd(i) * 1900} y={rnd(i + 3) * 1000} width={60 + rnd(i + 2) * 160} height={2} fill="#000" opacity={0.2} />
        ))}
        <rect x={px - 110} y={py - 230} width={220} height={500} rx={30} fill="#15110e" stroke="#35302a" strokeWidth={3} />
        <circle cx={px} cy={py + 150} r={16} fill="#050505" />
        <rect x={px - 6} y={py + 160} width={12} height={50} fill="#050505" />
        <circle cx={px} cy={py} r={78} fill="url(#metal)" stroke="#000" strokeWidth={4} />
        <circle cx={px} cy={py} r={52} fill="#2a2926" />
        <g transform={`rotate(${ang} ${px} ${py})`}>
          <rect x={px - 330} y={py - 22} width={400} height={44} rx={22} fill="url(#metal)" stroke="#000" strokeWidth={3} />
          <rect x={px - 316} y={py - 14} width={360} height={9} rx={5} fill="#d0cdc6" opacity={0.35} />
          <circle cx={px} cy={py} r={34} fill="url(#metal)" stroke="#000" strokeWidth={3} />
        </g>
        <rect x={0} y={1040} width={1920} height={40} fill="#cfe6ff" opacity={0.1 + 0.08 * Math.sin(t * 3)} />
      </g>
    </g></svg>
  );
};

// ---------- scenes ----------

const MediumDoor: React.FC<{t: number}> = ({t}) => {
  const k = seg(t, 2.55, 3.3);
  const slow = (t - 2.45) / 2.6;
  return (
    <svg width={1080} height={1920} viewBox="0 0 1080 1920"><g transform="translate(540 960) translate(-960 -540)">
      <defs>
        <radialGradient id="seam" cx="0.8" cy="0.5" r="0.7">
          <stop offset="0" stopColor="#7aa4d8" stopOpacity={0.35} />
          <stop offset="1" stopColor="#000" stopOpacity={0} />
        </radialGradient>
      </defs>
      <g transform={`translate(960 600) scale(${1 + slow * 0.08}) translate(-960 -600)`}>
        <rect x={-1500} y={-1500} width={5000} height={5000} fill="#0b0a0c" />
        <rect x={1180} y={-800} width={560} height={1820} fill="#17130f" />
        <rect x={1170} y={-800} width={6} height={1830} fill="#9fc3f0" opacity={0.7} />
        <rect x={-1500} y={-1500} width={5000} height={5000} fill="url(#seam)" />
        <rect x={-1000} y={900} width={4000} height={1500} fill="#050506" />
        <g transform={`rotate(${-38 * seg(t, 0.5, 2.3)} 1530 560)`} opacity={0.0} />
        <circle cx={1330} cy={560} r={22} fill="#6f6c66" />
        <rect x={1330 - 100} y={550} width={115} height={22} rx={11} fill="#6f6c66" transform={`rotate(${-38 * seg(t, 0.5, 2.3)} 1330 560)`} />
        <Figure x={lerp(960, 760, k)} y={960} s={lerp(1.9, 2.15, k)} face={{look: 0.8, fear: 0.25 + 0.75 * k}} />
      </g>
    </g></svg>
  );
};

const Mountains: React.FC<{t: number; p: number}> = ({t, p}) => {
  const sk = shake(t, 9 * (1 - seg(t, 5.05, 7.6)));
  const peaks = (seed: number, base: number, amp: number, n: number) => {
    let d = `M-100 2600 L-100 ${base}`;
    for (let i = 0; i <= n; i++) d += ` L${-100 + (i / n) * 2200} ${base - rnd(seed + i) * amp}`;
    return d + ' L2100 2600 Z';
  };
  return (
    <svg width={1080} height={1920} viewBox="0 0 1080 1920"><g transform="translate(540 960) translate(-960 -540)">
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#000003" />
          <stop offset="0.7" stopColor="#050a18" />
          <stop offset="1" stopColor="#0c1830" />
        </linearGradient>
      </defs>
      <g transform={`translate(${sk.x} ${sk.y}) translate(960 700) scale(${1 + p * 0.18}) translate(-960 -700)`}>
        <rect x={-1500} y={-1500} width={5000} height={5000} fill="url(#sky)" />
        {Array.from({length: 120}).map((_, i) => (
          <circle key={i} cx={rnd(i) * 1920} cy={rnd(i + 1) * 520} r={0.6 + rnd(i + 2) * 1.5} fill="#fff" opacity={0.3 + 0.5 * Math.abs(Math.sin(t * 0.8 + i))} />
        ))}
        <path d={peaks(1, 700, 260, 16)} fill="#141f38" />
        <path d={peaks(40, 780, 230, 14)} fill="#1b2a4a" />
        <path d={peaks(80, 860, 190, 12)} fill="#273a60" />
        <path d={peaks(120, 960, 150, 10)} fill="#3b5380" />
        {/* the house */}
        <g transform="translate(960 905)">
          <rect x={-120} y={-80} width={240} height={90} fill="#0c0a09" />
          <path d="M-140 -80 L0 -150 L140 -80 Z" fill="#050404" />
          <rect x={-70} y={-55} width={34} height={30} fill="#e9a24a" opacity={0.55 + 0.25 * Math.sin(t * 9) * Math.sin(t * 3.1)} />
          <rect x={-70} y={-55} width={34} height={30} fill="none" stroke="#000" strokeWidth={3} />
          <rect x={50} y={-65} width={22} height={50} fill="#17120f" />
        </g>
        <Snow t={t} n={90} speed={140} op={0.7} />
      </g>
    </g></svg>
  );
};

const HelmetGlove: React.FC<{t: number; p: number}> = ({t, p}) => (
  <svg width={1080} height={1920} viewBox="0 0 1080 1920"><g transform="translate(540 960) translate(-960 -540)">
    <defs>
      <linearGradient id="planks" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#141010" />
        <stop offset="1" stopColor="#060505" />
      </linearGradient>
      <radialGradient id="helm" cx="0.4" cy="0.3" r="0.8">
        <stop offset="0" stopColor="#f4f6fa" />
        <stop offset="1" stopColor="#7e8794" />
      </radialGradient>
    </defs>
    <g transform={`translate(${-p * 70} 0) translate(960 540) scale(${1.05 + p * 0.12}) translate(-960 -540)`}>
      <rect x={-1500} y={-1500} width={5000} height={5000} fill="url(#planks)" />
      {Array.from({length: 26}).map((_, i) => (
        <rect key={i} x={-600} y={i * 120 - 600} width={1920} height={3} fill="#000" opacity={0.6} />
      ))}
      <path d="M-100 1000 Q300 880 560 960 L520 1100 L-100 1100 Z" fill={RED_D} />
      <g transform="translate(800 420)">
        <path d="M-300 120 Q-320 -220 0 -250 Q320 -220 300 120 Z" fill="url(#helm)" />
        <path d="M-300 120 L300 120 L270 175 L-270 175 Z" fill="#aab2be" />
        <ellipse cx={0} cy={30} rx={190} ry={56} fill="#05060a" />
        <path d="M-20 -240 L10 -170 L-25 -120 L25 -60 L0 -10 L40 40" stroke="#0a0a0c" strokeWidth={6} fill="none" strokeLinejoin="round" />
        <path d="M-20 -240 L10 -170 L-25 -120 L25 -60 L0 -10 L40 40" stroke="#fff" strokeWidth={1.5} fill="none" opacity={0.6} transform="translate(5 0)" />
        <ellipse cx={-140} cy={-110} rx={46} ry={20} fill="#fff" opacity={0.5} transform="rotate(-30 -140 -110)" />
      </g>
      <g transform="translate(1080 900) rotate(-18)">
        <path d="M-120 -50 Q-140 40 -80 90 Q0 120 90 80 Q130 40 120 -40 Q60 -70 -120 -50 Z" fill="#0b0b0d" stroke="#5a5f66" strokeWidth={4} />
        {[0, 1, 2, 3].map((i) => (
          <rect key={i} x={-130 + i * 62} y={-170 + (i === 1 || i === 2 ? -20 : 0) - Math.abs(i - 1.5) * 8} width={50} height={140} rx={25} fill="#0b0b0d" stroke="#5a5f66" strokeWidth={4} />
        ))}
        <rect x={80} y={-10} width={120} height={50} rx={25} fill="#0b0b0d" stroke="#222" strokeWidth={3} transform="rotate(25 100 10)" />
        <rect x={-130} y={50} width={250} height={26} rx={10} fill="#222" opacity={0.7} />
      </g>
      <Snow t={t} n={30} speed={20} op={0.35} />
    </g>
  </g></svg>
);

const World: React.FC<{t: number}> = ({t}) => {
  const fl = 0.75 + 0.25 * Math.sin(t * 17) * Math.sin(t * 5.3) + 0.1 * Math.sin(t * 41);
  const tags: {x: number; y: number}[] = [];
  for (let r = 0; r < 3; r++) for (let c = 0; c < 7; c++) tags.push({x: 3040 + c * 150, y: 300 + r * 140});
  const knock = [70.3, 70.85, 71.4];
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
      <g transform="translate(2300 0)">
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
    </g>
  );
};

const camKeys: Key[] = [
  [22.5, 960, 580, 1.0],
  [26.5, 960, 560, 1.06],
  [27.5, 520, 450, 1.35],
  [30.6, 540, 450, 1.4],
  [31.3, 1100, 560, 1.15],
  [34.6, 1650, 600, 1.3],
  [36.8, 1700, 640, 1.35],
  [37.8, 1960, 800, 1.9],
  [38.7, 2590, 660, 2.3],
  [42.5, 2610, 650, 2.4],
  [44.4, 3300, 520, 1.1],
  [47.0, 3400, 500, 1.5],
  [49.6, 3500, 480, 1.7],
  [52.0, 3720, 480, 2.4],
  [54.9, 3730, 480, 2.5],
  [61.0, 3500, 560, 1.15],
  [67.0, 3600, 540, 1.3],
  [70.0, 3900, 520, 1.5],
  [74.0, 3900, 520, 1.5],
];

const Interior: React.FC<{t: number}> = ({t}) => {
  const c = cam(t, camKeys);
  const knock = [70.3, 70.85, 71.4];
  let sk = {x: 0, y: 0};
  for (const k of knock) if (t >= k && t < k + 0.18) sk = shake(t, 22 * (1 - (t - k) / 0.18));
  if (t >= 70.0 && t < 70.3) sk = {x: 0, y: 0};
  const breathe = 1 + 0.004 * Math.sin(t * 1.3);
  const standing = t >= 54.9;
  return (
    <svg width={1080} height={1920} viewBox="0 0 1080 1920"><g transform="translate(540 960) translate(-960 -540)">
      <g transform={`translate(${960 + sk.x} ${540 + sk.y}) scale(${c.s * breathe * 1.15}) translate(${-c.cx} ${-c.cy})`}>
        <World t={t} />
        {!standing && <Figure x={900} y={880} s={1.15} sitting face={{look: t < 27 ? 0 : t < 31 ? -0.9 : 0.9, fear: t < 31 ? 0.45 : t < 44 ? 0.3 : 0.5}} />}
        {standing && <Figure x={3500} y={900} s={1.25} face={t >= 61 ? {look: t < 67 ? 0 : 0.9, fear: 1} : undefined} />}
      </g>
    </g></svg>
  );
};

const Radio: React.FC<{t: number}> = ({t}) => {
  const p = (t - 54.94) / 6;
  const led = t > 55.1 ? 0.65 + 0.35 * Math.sin(t * 14) : 0;
  const speak = clamp((t - 58.6) / 0.1) * (1 - clamp((t - 60.6) / 0.2));
  const zoomSpk = seg(t, 58.4, 59.2);
  const cx = lerp(960, 760, zoomSpk);
  const cy = lerp(540, 600, zoomSpk);
  const sc = lerp(1 + p * 0.1, 2.0, zoomSpk);
  const flicker = t < 58.6 ? Math.max(0, Math.sin(t * 37) * Math.sin(t * 11)) : 0;
  return (
    <svg width={1080} height={1920} viewBox="0 0 1080 1920"><g transform="translate(540 960) translate(-960 -540)">
      <rect x={-1500} y={-1500} width={5000} height={5000} fill="#050507" />
      <g transform={`translate(960 540) scale(${sc}) translate(${-cx} ${-cy})`}>
        <path d="M900 140 L1180 -120" stroke="#222" strokeWidth={10} />
        <rect x={560} y={260} width={800} height={520} rx={36} fill="#26292b" stroke="#000" strokeWidth={6} />
        <rect x={590} y={290} width={740} height={460} rx={24} fill="#1a1c1e" />
        <circle cx={760} cy={540} r={150} fill="#0b0c0d" stroke="#3a3d40" strokeWidth={6} />
        {Array.from({length: 7}).map((_, i) => (
          <circle key={i} cx={760} cy={540} r={20 + i * 20} fill="none" stroke="#2d3033" strokeWidth={3} />
        ))}
        {[1, 2, 3].map((i) => {
          const ph = ((t * 1.4 + i / 3) % 1);
          return <circle key={i} cx={760} cy={540} r={150 * ph + 10} fill="none" stroke="#a9c8ee" strokeWidth={3} opacity={speak * (1 - ph) * 0.8} />;
        })}
        <rect x={980} y={330} width={280} height={90} rx={10} fill="#0b140f" />
        <rect x={990} y={340} width={260} height={70} rx={6} fill="#9fd9a8" opacity={0.12 + 0.35 * flicker + 0.25 * speak} />
        <circle cx={1220} cy={470} r={22} fill="#3a0a0a" />
        <circle cx={1220} cy={470} r={22} fill="#ff3b30" opacity={led} />
        <circle cx={1220} cy={470} r={80} fill="#ff3b30" opacity={led * 0.12} />
        <circle cx={1060} cy={580} r={46} fill="#101112" stroke="#3a3d40" strokeWidth={5} />
        <rect x={1056} y={540} width={8} height={30} fill="#d8d8d8" transform={`rotate(${30 + seg(t, 56, 56.5) * 40} 1060 580)`} />
        <rect x={980} y={660} width={280} height={14} fill="#0b0c0d" />
        {/* glove holding it */}
        <path d="M520 700 Q500 820 600 880 L760 900 L780 760 Z" fill="#0b0b0d" stroke="#5a5f66" strokeWidth={4} />
        <path d="M1340 700 Q1380 820 1260 900 L1080 900 L1100 760 Z" fill="#0b0b0d" stroke="#5a5f66" strokeWidth={4} />
        <rect x={500} y={880} width={800} height={200} fill={RED_D} />
      </g>
      {Array.from({length: 6}).map((_, i) => (
        <rect key={i} x={0} y={(t * 600 * (i + 1)) % 1700 - 300} width={1920} height={2 + i} fill="#fff" opacity={t < 58.6 ? 0.04 + 0.05 * flicker : 0.02} />
      ))}
    </g></svg>
  );
};

const Overlay: React.FC<{t: number; frame: number}> = ({t, frame}) => {
  const j = frame % 6;
  return (
    <>
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at center, rgba(0,0,0,0) 45%, rgba(0,0,0,0.78) 100%)'}} />
      <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(10,25,50,0.25), rgba(0,0,0,0.05) 50%, rgba(25,10,0,0.12))', mixBlendMode: 'overlay'}} />
      <AbsoluteFill style={{opacity: 0.07, mixBlendMode: 'screen', transform: `translate(${j * 11}px, ${(j % 3) * 17}px)`}}>
        <svg width={2600} height={2600}>
          <filter id="n">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="1" seed={3} />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#n)" />
        </svg>
      </AbsoluteFill>
    </>
  );
};

const Subtitle: React.FC<{t: number}> = ({t}) => {
  const p = (phrases as [number, number, number, string][]).find((x) => t >= x[0] - 0.05 && t <= x[1] + 0.25);
  if (!p) return null;
  const o = Math.min(clamp((t - p[0] + 0.05) / 0.2), clamp((p[1] + 0.25 - t) / 0.25));
  return (
    <AbsoluteFill style={{justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 250}}>
      <div style={{opacity: o, color: '#eef2f7', fontFamily: 'Georgia, "Times New Roman", serif', fontStyle: 'italic', fontSize: 54, textShadow: '0 2px 12px #000, 0 0 3px #000', maxWidth: 900, textAlign: 'center', lineHeight: 1.25}}>{p[3]}</div>
    </AbsoluteFill>
  );
};

// ---------- composition ----------

const KNOCKS = [70.3, 70.85, 71.4];

export const Everest: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;

  // 0.0–2.45 door close-up, 2.45–5.05 silhouette
  const doorZoom = 1 + 0.35 * ease(t / 2.45);
  const endDoorP = clamp((t - 71.6) / 2.3);

  // knock blackouts
  let blackout = 0;
  for (const k of KNOCKS) if (t >= k && t < k + 0.14) blackout = Math.max(blackout, 0.85 * (1 - (t - k) / 0.14));
  // fade to black at 4.9–5.05 and the final hard cut
  const dip = t > 4.85 && t < 5.05 ? clamp((t - 4.85) / 0.15) : t >= 5.05 && t < 5.4 ? 1 - clamp((t - 5.05) / 0.35) : 0;
  const finalBlack = t >= 73.88 ? 1 : 0;
  const black = Math.max(blackout, dip, finalBlack);

  // audio volumes
  const drone = (f: number) => {
    const tt = f / FPS;
    if (tt < 4.5) return lerp(0.2, 0.28, tt / 4.5);
    if (tt < 5.4) return lerp(0.28, 0.1, (tt - 4.5) / 0.9);
    if (tt < 54) return lerp(0.1, 0.42, (tt - 5.4) / 48.6);
    if (tt < 60.4) return 0.42;
    if (tt < 61.5) return lerp(0.42, 0.02, (tt - 60.4) / 1.1);
    if (tt < 71.6) return 0.02;
    return lerp(0.02, 0.35, clamp((tt - 71.6) / 1.8));
  };

  return (
    <AbsoluteFill style={{backgroundColor: '#000'}}>
      <Audio src={staticFile('voice.mp3')} volume={1} />
      <Audio src={staticFile('sfx/drone.mp3')} volume={drone} />
      <Audio src={staticFile('sfx/wind.mp3')} volume={(f) => (f / FPS < 5.2 ? 0.28 : f / FPS < 61 ? 0.2 : 0.05)} />
      <Audio src={staticFile('sfx/fire.mp3')} volume={(f) => { const x = f / FPS; return x < 23 ? 0 : x < 60.4 ? 0.14 + 0.1 * seg(x, 31, 36) : 0; }} />
      <Sequence from={Math.round(0.3 * FPS)} durationInFrames={50}><Audio src={staticFile('sfx/creak.mp3')} volume={0.6} /></Sequence>
      <Sequence from={Math.round(54.94 * FPS)} durationInFrames={Math.round(6.1 * FPS)}><Audio src={staticFile('sfx/static.mp3')} volume={(f) => (f / FPS < 3.7 ? 0.35 : 0.1)} /></Sequence>
      {KNOCKS.map((k) => (
        <Sequence key={k} from={Math.round(k * FPS)} durationInFrames={24}><Audio src={staticFile('sfx/knock.mp3')} volume={1} /></Sequence>
      ))}
      <Sequence from={Math.round(71.7 * FPS)} durationInFrames={Math.round(2.2 * FPS)}><Audio src={staticFile('sfx/creak.mp3')} volume={0.85} /></Sequence>
      <Sequence from={Math.round(45 * FPS)} durationInFrames={70}><Audio src={staticFile('sfx/ping.mp3')} volume={0.08} /></Sequence>
      <Sequence from={Math.round(52.5 * FPS)} durationInFrames={70}><Audio src={staticFile('sfx/ping.mp3')} volume={0.08} /></Sequence>

      <Shot a={0} b={2.45} t={t}>
        <Door t={t} t0={0.5} t1={2.3} zoom={doorZoom} />
      </Shot>
      <Shot a={2.45} b={5.06} t={t}>
        <MediumDoor t={t} />
      </Shot>
      <Shot a={5.05} b={15.7} t={t}>
        <Mountains t={t} p={clamp((t - 5.05) / 10.65)} />
      </Shot>
      <Shot a={15.7} b={22.5} t={t}>
        <HelmetGlove t={t} p={clamp((t - 15.7) / 6.8)} />
      </Shot>
      <Shot a={22.5} b={54.94} t={t} fade={0.2}>
        <Interior t={t} />
      </Shot>
      <Shot a={54.94} b={61.0} t={t}>
        <Radio t={t} />
      </Shot>
      <Shot a={61.0} b={71.62} t={t}>
        <Interior t={t} />
      </Shot>
      <Shot a={71.6} b={74} t={t}>
        <Door t={t} t0={72.0} t1={73.2} zoom={1.1 + 0.55 * ease(endDoorP)} flipAngle={-42} />
      </Shot>

      <Overlay t={t} frame={frame} />
      <Subtitle t={t} />
      <AbsoluteFill style={{background: '#000', opacity: black}} />
    </AbsoluteFill>
  );
};
