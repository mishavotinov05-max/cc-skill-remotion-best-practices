import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame} from 'remotion';
import '@fontsource/montserrat/cyrillic-600.css';
import '@fontsource/montserrat/latin-600.css';
import subs3 from './subs_ep3.json';
import {StyledSub} from './Subs';
import {World2} from './World2';
import {Figure, Overlay, Shot, Snow, ramp, shake} from './Everest';
import {Flashlight, Radio2} from './Ep2';
import {Key, cam, clamp, ease, lerp, rnd, seg} from './util';

export const FPS3 = 30;
export const DURATION3 = 91.9;
const CUT = 91.72; // black + thud on "очередь"
const RED = '#8e1c1c';
const RED_D = '#5a1010';
const SKIN = '#d9a98a';

// =============== outdoor slope / blizzard ===============
type SlopeProps = {t: number; p: number; runner?: {x: number; y: number; s: number; bob: number} | null; house?: number; houseScale?: number; glow?: number; door?: boolean; sk?: {x: number; y: number}};
const Slope: React.FC<SlopeProps> = ({t, p, runner, house = 0, houseScale = 1, glow = 0, door = false, sk = {x: 0, y: 0}}) => (
  <svg width={1080} height={1920} viewBox="0 0 1080 1920">
    <defs>
      <linearGradient id="s3sky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#010208" />
        <stop offset="1" stopColor="#10213b" />
      </linearGradient>
      <linearGradient id="s3gr" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#1d2f4d" />
        <stop offset="1" stopColor="#4a658e" />
      </linearGradient>
      <radialGradient id="s3glow" cx="0.5" cy="0.5" r="0.5">
        <stop offset="0" stopColor="#ffb25a" stopOpacity={0.85} />
        <stop offset="1" stopColor="#ff7a1a" stopOpacity={0} />
      </radialGradient>
    </defs>
    <g transform={`translate(${sk.x} ${sk.y}) translate(540 1150) scale(${1 + p * 0.22}) translate(-540 -1150)`}>
      <rect x={-600} y={-600} width={2280} height={1750} fill="url(#s3sky)" />
      {Array.from({length: 40}).map((_, i) => (
        <circle key={i} cx={rnd(i) * 1080} cy={rnd(i + 1) * 800} r={0.8 + rnd(i + 2) * 1.2} fill="#fff" opacity={0.15 + 0.25 * Math.abs(Math.sin(t + i))} />
      ))}
      <path d="M-100 1130 L140 960 L300 1060 L520 930 L760 1070 L940 990 L1180 1100 L1180 1200 L-100 1200 Z" fill="#0b152b" transform={`translate(${-p * 14} 0)`} />
      <path d="M-100 1190 L200 1070 L400 1150 L650 1050 L900 1140 L1180 1090 L1180 1260 L-100 1260 Z" fill="#14233f" transform={`translate(${-p * 30} 0)`} />
      <path d="M-300 1260 Q300 1180 1400 1240 L1400 2300 L-300 2300 Z" fill="url(#s3gr)" />
      {Array.from({length: 26}).map((_, i) => (
        <ellipse key={i} cx={rnd(i + 40) * 1200 - 60} cy={1320 + ((rnd(i + 70) * 700 + p * 260 * (0.4 + rnd(i))) % 700)} rx={70 + rnd(i) * 140} ry={9 + rnd(i + 5) * 22} fill="#7e9bc4" opacity={0.14} />
      ))}
      {glow > 0 && <circle cx={540} cy={1070} r={90 + glow * 380} fill="url(#s3glow)" opacity={glow} />}
      {house > 0 && (
        <g opacity={house} transform={`translate(540 1130) scale(${houseScale}) translate(-540 -1130)`}>
          <rect x={440} y={1040} width={200} height={90} fill="#070605" />
          <path d="M424 1042 L540 984 L656 1042 Z" fill="#cfdcec" />
          <path d="M434 1044 L540 994 L646 1044 Z" fill="#040404" />
          <rect x={470} y={1066} width={34} height={28} fill="#ffb25a" opacity={0.85 + 0.1 * Math.sin(t * 9)} />
          <rect x={578} y={1066} width={26} height={64} fill="#1a120d" />
        </g>
      )}
      {door && (
        <g transform="translate(540 1500)">
          <ellipse cx={0} cy={6} rx={190} ry={26} fill="#02040a" opacity={0.6} />
          <rect x={-130} y={-520} width={260} height={520} fill="#0d0a08" stroke="#2f241a" strokeWidth={14} />
          <rect x={-114} y={-504} width={228} height={490} fill="#2a1f17" />
          {[-60, 0, 60].map((x) => (
            <rect key={x} x={x - 2} y={-504} width={4} height={490} fill="#000" opacity={0.5} />
          ))}
          <circle cx={78} cy={-250} r={14} fill="#77746d" stroke="#000" strokeWidth={2} />
          <path d="M-130 0 Q0 -40 130 0 Z" fill="#cfdcec" opacity={0.85} />
        </g>
      )}
      {runner && (
        <g transform={`translate(0 ${Math.abs(Math.sin(t * 14)) * runner.bob * -1}) rotate(${Math.sin(t * 14) * runner.bob * 0.15} ${runner.x} ${runner.y})`}>
          <Figure x={runner.x} y={runner.y} s={runner.s} />
        </g>
      )}
      <Snow t={t} n={220} speed={720} w={1080} h={1920} op={0.85} />
      <Snow t={t * 0.6} n={60} speed={300} w={1080} h={1920} op={0.5} />
    </g>
  </svg>
);

// =============== house facade ===============
const facadeKeys: Key[] = [
  [41.9, 540, 1100, 0.85], [44.3, 540, 1200, 1.1], [46.4, 540, 1150, 1.5], [46.97, 540, 1120, 1.7], [47.4, 540, 1120, 3.4], [50.8, 540, 1120, 3.8],
  [51.3, 250, 1080, 2.2], [55.0, 250, 1080, 2.6], [57.5, 250, 1080, 2.6], [57.9, 250, 1080, 2.6], [59.9, 250, 1080, 2.8],
  [66.0, 540, 1150, 1.8], [66.9, 540, 1100, 1.1], [67.34, 540, 1100, 1.1], [70.0, 830, 1090, 2.2], [70.6, 830, 1160, 3.0], [73.3, 830, 1160, 3.3],
  [84.5, 540, 1180, 1.6], [86.57, 540, 1230, 2.0], [89.3, 540, 1240, 3.0], [91.8, 540, 1240, 3.6],
];
const Facade: React.FC<{t: number}> = ({t}) => {
  const c = cam(t, facadeKeys);
  const signA = seg(t, 44.61, 45.6);
  const nameA = seg(t, 70.61, 71.2);
  const dateA = seg(t, 71.53, 72.6);
  const doorO = ease(seg(t, 84.6, 86.4));
  const raise = seg(t, 57.9, 59.4);
  const dw = 240 * (1 - 0.88 * doorO);
  const sk = t >= 84.6 && t < 86.4 ? shake(t, 3) : {x: 0, y: 0};
  return (
    <svg width={1080} height={1920} viewBox="0 0 1080 1920">
      <defs>
        <linearGradient id="fsky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#010208" />
          <stop offset="1" stopColor="#10213b" />
        </linearGradient>
        <linearGradient id="fwall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1b140f" />
          <stop offset="1" stopColor="#0d0907" />
        </linearGradient>
        <radialGradient id="fwin" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#ffb25a" stopOpacity={0.6} />
          <stop offset="1" stopColor="#ff7a1a" stopOpacity={0} />
        </radialGradient>
        <clipPath id="winclip">
          <rect x={140} y={960} width={220} height={240} />
        </clipPath>
      </defs>
      <g transform={`translate(${sk.x} ${sk.y}) translate(540 960) scale(${c.s}) translate(${-c.cx} ${-c.cy})`}>
        <rect x={-900} y={-900} width={2880} height={1700} fill="url(#fsky)" />
        {Array.from({length: 30}).map((_, i) => (
          <circle key={i} cx={rnd(i) * 1080} cy={rnd(i + 1) * 520} r={1.2} fill="#fff" opacity={0.3} />
        ))}
        <path d="M-300 700 L100 520 L260 620 L480 480 L720 640 L900 540 L1400 700 L1400 760 L-300 760 Z" fill="#0a1226" />
        {/* ground */}
        <rect x={-900} y={1500} width={2880} height={1500} fill="#2c4263" />
        <ellipse cx={540} cy={1560} rx={620} ry={70} fill="#4f6b95" opacity={0.35} />
        <ellipse cx={260} cy={1230} rx={300} ry={160} fill="url(#fwin)" opacity={0.7} />
        {/* wall */}
        <rect x={80} y={700} width={920} height={800} fill="url(#fwall)" />
        {Array.from({length: 24}).map((_, i) => (
          <rect key={i} x={80 + i * 40} y={700} width={3} height={800} fill="#000" opacity={0.45} />
        ))}
        <path d="M30 706 L540 500 L1050 706 Z" fill="#cfdcec" />
        <path d="M60 706 L540 530 L1020 706 Z" fill="#070605" />
        {/* window with the warm room inside */}
        <rect x={125} y={945} width={250} height={270} fill="#050403" stroke="#2c2520" strokeWidth={16} />
        <g clipPath="url(#winclip)">
          <rect x={140} y={960} width={220} height={240} fill="#3b2411" />
          <ellipse cx={330} cy={1130} rx={90} ry={90} fill="url(#fwin)" />
          <rect x={300} y={1090} width={50} height={80} fill="#1b1b1d" />
          <rect x={308} y={1110} width={34} height={22} fill="#ff8a2a" opacity={0.8 + 0.15 * Math.sin(t * 11)} />
          <rect x={140} y={1170} width={220} height={30} fill="#120c08" />
          <g>
            <Figure x={235} y={1196} s={0.5} sitting />
            <g transform={`translate(262 1092) rotate(${lerp(95, -35, raise)})`}>
              <rect x={-6} y={-8} width={12} height={70} rx={6} fill={RED} />
              <rect x={-12} y={56} width={26} height={22} rx={3} fill="#0e0f10" stroke="#5a5f66" strokeWidth={1.5} />
            </g>
          </g>
          <rect x={140} y={960} width={220} height={240} fill="#ffb25a" opacity={0.06} />
        </g>
        <rect x={250} y={945} width={5} height={270} fill="#2c2520" />
        <rect x={125} y={1070} width={250} height={5} fill="#2c2520" />
        {/* door */}
        <rect x={406} y={986} width={268} height={520} fill="#070605" stroke="#2f241a" strokeWidth={14} />
        <rect x={420} y={1000} width={240} height={500} fill="#000" />
        <g>
          <rect x={420} y={1000} width={dw} height={500} fill="#2a1f17" />
          {[0.3, 0.6, 0.85].map((f) => (
            <rect key={f} x={420 + dw * f} y={1000} width={3} height={500} fill="#000" opacity={0.5} />
          ))}
          <circle cx={420 + dw - 28} cy={1260} r={9} fill="#77746d" stroke="#000" strokeWidth={2} />
          <g opacity={signA} transform={`translate(${420 + dw / 2} 1100) rotate(${Math.sin(t * 2.2) * 1.2 * signA})`}>
            <line x1={-40} y1={-48} x2={-34} y2={-8} stroke="#8d8a84" strokeWidth={2} />
            <line x1={40} y1={-48} x2={34} y2={-8} stroke="#8d8a84" strokeWidth={2} />
            <rect x={-62} y={-14} width={124} height={86} rx={5} fill="#3d4044" stroke="#0a0a0a" strokeWidth={2} />
            <rect x={-56} y={-8} width={112} height={74} rx={3} fill="none" stroke="#9aa0a8" strokeWidth={1} opacity={0.6} />
            <text x={0} y={14} textAnchor="middle" fontFamily="Montserrat, sans-serif" fontWeight={600} fontSize={10} fill="#e6e8ea">СПАСАТЕЛЬНЫЙ</text>
            <text x={0} y={28} textAnchor="middle" fontFamily="Montserrat, sans-serif" fontWeight={600} fontSize={10} fill="#e6e8ea">ПУНКТ</text>
            <text x={0} y={54} textAnchor="middle" fontFamily="Montserrat, sans-serif" fontWeight={600} fontSize={14} fill="#c9ced4">1986 г.</text>
          </g>
        </g>
        {/* name tags on the wall */}
        <rect x={700} y={900} width={290} height={290} fill="#0a0808" opacity={0.6} />
        {Array.from({length: 8}).map((_, i) => {
          const r = Math.floor(i / 3);
          const cI = i % 3;
          return (
            <g key={i} transform={`translate(${718 + cI * 95} ${925 + r * 80})`}>
              <line x1={14} y1={-14} x2={14} y2={0} stroke="#2a2724" strokeWidth={2} />
              <rect x={0} y={0} width={80} height={44} rx={5} fill="#1d1c1b" stroke="#3a3835" strokeWidth={1.5} />
              {[0, 1, 2].map((q) => (
                <rect key={q} x={9} y={9 + q * 11} width={22 + rnd(i * 3 + q) * 44} height={4} rx={2} fill="#6d6a64" opacity={0.7} />
              ))}
            </g>
          );
        })}
        <g transform="translate(908 1085)" opacity={nameA}>
          <line x1={14} y1={-14} x2={14} y2={0} stroke="#2a2724" strokeWidth={2} />
          <rect x={0} y={0} width={80} height={44} rx={5} fill="#262524" stroke="#9aa0a8" strokeWidth={1.5} />
          <text x={40} y={29} textAnchor="middle" fontFamily="Montserrat, sans-serif" fontWeight={600} fontSize={17} fill="#e8edf2">ИЛЬЯ</text>
        </g>
        <text x={948} y={1156} textAnchor="middle" opacity={dateA} fontFamily="Montserrat, sans-serif" fontWeight={600} fontSize={11} fill="#d6dde5">08.11.2026</text>
        <Snow t={t} n={50} speed={160} w={1080} h={1920} op={0.5} />
      </g>
    </svg>
  );
};

// =============== red sleeve close-up ===============
const Sleeve: React.FC<{t: number; variant: 'A' | 'B'; slide?: number}> = ({t, variant, slide = 0}) => {
  const warm = variant === 'B';
  const sway = Math.sin(t * 1.4) * 8;
  return (
    <svg width={1080} height={1920} viewBox="0 0 1080 1920">
      <defs>
        <linearGradient id={`sl${variant}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={warm ? '#a8321f' : '#8e1c1c'} />
          <stop offset="1" stopColor={RED_D} />
        </linearGradient>
      </defs>
      <rect width={1080} height={1920} fill={warm ? '#1c1109' : '#080b12'} />
      <g transform={`translate(${warm ? 1080 : 0} 0) scale(${warm ? -1 : 1} 1) translate(${sway} 0)`}>
        <path d="M-120 1700 L-80 1000 Q300 700 760 640 L900 1040 Q420 1180 220 1760 Z" fill={`url(#sl${variant})`} />
        {[0.2, 0.4, 0.6].map((f) => (
          <path key={f} d={`M${-100 + f * 800} ${1500 - f * 700} Q${200 + f * 600} ${1000 - f * 300} ${700 + f * 100} ${900 - f * 200}`} stroke="#2a0606" strokeWidth={10} fill="none" opacity={0.55} />
        ))}
        <path d="M740 640 L930 1030 L1040 980 L860 590 Z" fill="#2a1b12" />
        <path d="M760 600 Q900 520 1010 600 L1060 900 Q900 980 820 940 Z" fill="#0b0b0d" stroke="#5a5f66" strokeWidth={4} />
        {Array.from({length: 18}).map((_, i) => (
          <circle key={i} cx={120 + rnd(i) * 700} cy={760 + rnd(i + 3) * 700} r={2 + rnd(i + 2) * 3} fill={warm ? '#ffd9a0' : '#cfe2f5'} opacity={0.35} />
        ))}
      </g>
      {slide > 0 && (
        <g transform={`translate(${slide * 1300} ${-slide * 260})`} opacity={1 - slide * 0.4}>
          <path d="M-200 520 Q200 600 520 880" stroke="#020202" strokeWidth={110} strokeLinecap="round" fill="none" />
          <ellipse cx={560} cy={910} rx={120} ry={80} fill="#020202" transform="rotate(35 560 910)" />
          {[-30, -10, 10, 30].map((a, i) => (
            <rect key={i} x={540 + i * 8} y={860 + i * 26} width={170} height={34} rx={17} fill="#020202" transform={`rotate(${a + 20} 560 ${910 + i * 8})`} />
          ))}
        </g>
      )}
    </svg>
  );
};

// =============== first-person hands covered with frost ===============
const Hand: React.FC<{x: number; y: number; flip?: boolean; glove?: boolean; frost: number; seed: number}> = ({x, y, flip, glove, frost, seed}) => {
  const base = glove ? '#0b0b0d' : SKIN;
  const f = flip ? -1 : 1;
  return (
    <g transform={`translate(${x} ${y}) scale(${f} 1)`}>
      <rect x={-110} y={170} width={220} height={900} fill={RED} />
      <rect x={-110} y={170} width={220} height={900} fill="url(#cuff)" opacity={0.5} />
      <rect x={-96} y={130} width={192} height={70} fill="#3a2b24" />
      <path d="M-120 140 Q-150 -30 -110 -80 Q0 -120 120 -80 Q150 -20 120 140 Z" fill={base} stroke={glove ? '#5a5f66' : '#8a5a45'} strokeWidth={4} />
      {[-88, -34, 22, 76].map((fx, i) => (
        <rect key={i} x={fx - 24} y={-300 + Math.abs(i - 1.5) * 24} width={50} height={250} rx={25} fill={base} stroke={glove ? '#5a5f66' : '#8a5a45'} strokeWidth={4} />
      ))}
      <rect x={110} y={-30} width={46} height={150} rx={23} fill={base} stroke={glove ? '#5a5f66' : '#8a5a45'} strokeWidth={4} transform="rotate(-38 120 60)" />
      <path d="M-120 140 Q-150 -30 -110 -80 Q0 -120 120 -80 Q150 -20 120 140 Z" fill="#bcd8f2" opacity={0.5 * frost} />
      {Array.from({length: 60}).map((_, i) => {
        const vis = clamp((frost * 60 - i) / 3);
        if (vis <= 0) return null;
        const cx = -120 + rnd(i + seed) * 240;
        const cy = -290 + rnd(i + seed + 9) * 430;
        const len = 14 + rnd(i + seed + 4) * 34;
        const a = rnd(i + seed + 6) * Math.PI;
        return <line key={i} x1={cx - Math.cos(a) * len} y1={cy - Math.sin(a) * len} x2={cx + Math.cos(a) * len} y2={cy + Math.sin(a) * len} stroke="#e8f4ff" strokeWidth={3 + rnd(i) * 3} strokeLinecap="round" opacity={0.9 * vis} />;
      })}
    </g>
  );
};
const Hands: React.FC<{t: number}> = ({t}) => {
  const frost = ease(seg(t, 82.4, 84.1));
  const sway = Math.sin(t * 1.2) * 6;
  return (
    <svg width={1080} height={1920} viewBox="0 0 1080 1920">
      <defs>
        <linearGradient id="cuff" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#000" stopOpacity={0.5} />
          <stop offset="1" stopColor="#000" stopOpacity={0} />
        </linearGradient>
      </defs>
      <rect width={1080} height={1920} fill="#070a11" />
      <ellipse cx={540} cy={900} rx={520} ry={600} fill="#1a2c48" opacity={0.35} />
      <g transform={`translate(0 ${sway})`}>
        <Hand x={330} y={1000 + (1 - seg(t, 80.4, 81.4)) * 160} frost={frost} seed={3} />
        <Hand x={760} y={1020 + (1 - seg(t, 80.4, 81.4)) * 160} glove frost={frost * 0.9} seed={11} flip />
      </g>
      {Array.from({length: 5}).map((_, i) => {
        const ph = (t * 0.45 + i / 5) % 1;
        return <circle key={i} cx={420 + i * 60 + Math.sin(ph * 6 + i) * 24} cy={640 - ph * 380} r={40 + ph * 70} fill="#cfe2f5" opacity={0.18 * (1 - ph) * (0.4 + frost)} />;
      })}
      <rect width={1080} height={1920} fill="#8fbfef" opacity={0.1 * frost} />
    </svg>
  );
};

// =============== room: hand on the shoulder + window break ===============
const roomKeys: Key[] = [
  [5.07, 4000, 560, 1.25], [6.95, 4000, 550, 1.3], [8.2, 4080, 480, 2.3], [9.8, 4080, 480, 2.3], [10.02, 4040, 520, 1.7], [12.82, 4040, 520, 1.8],
  [20.87, 520, 470, 1.2], [22.2, 360, 400, 1.7], [24.4, 350, 420, 1.5],
];
const HandShadow3: React.FC<{x: number; o: number}> = ({x, o}) => {
  if (o <= 0) return null;
  const slide = (1 - o) * 120;
  return (
    <g opacity={0.92 * o} transform={`translate(${slide} ${-slide * 0.2})`}>
      <path d={`M${x + 760} 300 Q${x + 420} 330 ${x + 130} 500`} stroke="#020202" strokeWidth={46} strokeLinecap="round" fill="none" />
      <ellipse cx={x + 104} cy={512} rx={54} ry={38} fill="#020202" transform={`rotate(35 ${x + 104} 512)`} />
      {[-30, -12, 8, 26].map((a, i) => (
        <rect key={i} x={x + 40 + i * 4} y={500 + i * 14} width={78} height={17} rx={8} fill="#020202" transform={`rotate(${a + 150} ${x + 104} ${512 + i * 6})`} />
      ))}
      <path d={`M${x + 760} 300 Q${x + 420} 330 ${x + 130} 500`} stroke="#8a7a66" strokeWidth={3} strokeLinecap="round" fill="none" opacity={0.35} transform="translate(0 -22)" />
    </g>
  );
};
const IceAxe: React.FC<{ang: number}> = ({ang}) => (
  <g transform={`rotate(${ang})`}>
    <rect x={-9} y={-30} width={18} height={400} rx={6} fill="#0a0a0c" stroke="#8a97a8" strokeWidth={2} />
    <path d="M-110 -30 Q0 -70 130 -20 L130 -2 Q10 -40 -110 -8 Z" fill="#0a0a0c" stroke="#8a97a8" strokeWidth={2.5} />
    <path d="M-110 -8 L-150 12 L-110 -22 Z" fill="#0a0a0c" stroke="#8a97a8" strokeWidth={2} />
  </g>
);
const Room3: React.FC<{t: number}> = ({t}) => {
  const c = cam(t, roomKeys);
  let sk = {x: 0, y: 0};
  if (t >= 8.2 && t < 8.55) sk = shake(t, 14 * (1 - (t - 8.2) / 0.35));
  if (t >= 22.95 && t < 23.35) sk = shake(t, 24 * (1 - (t - 22.95) / 0.4));
  const handO = t < 12.82 ? seg(t, 7.6, 8.4) : 0;
  const axeA = t < 22.6 ? 50 : t < 22.95 ? lerp(50, -8, ease(seg(t, 22.6, 22.95))) : lerp(-8, 18, seg(t, 23.0, 23.6));
  const axeVis = t >= 22.3 && t < 23.7;
  const broken = t >= 22.95;
  const bt = t - 22.95;
  // Ilya leaves through the hole
  const out = seg(t, 23.7, 24.4);
  return (
    <svg width={1080} height={1920} viewBox="0 0 1080 1920">
      <g transform={`translate(${540 + sk.x} ${960 + sk.y}) scale(${c.s * 1.15}) translate(${-c.cx} ${-c.cy})`}>
        <World2 t={t} tableX={860} streaks={[0, 0, 0]} scratch={1} letters={4} backShake={0} doorOpen={0} handleAng={0} />
        {t < 12.82 && (
          <>
            <HandShadow3 x={3980} o={handO} />
            <Figure x={3980} y={900} s={1.2} />
          </>
        )}
        {t >= 20.87 && (
          <>
            <g opacity={1 - out}>
              <Figure x={lerp(520, 355, seg(t, 20.9, 22.0))} y={lerp(880, 800, out)} s={lerp(1.2, 0.8, out)} />
            </g>
            {axeVis && (
              <g transform={`translate(520 560)`}>
                <IceAxe ang={axeA} />
              </g>
            )}
            {broken && (
              <g>
                <rect x={205} y={235} width={300} height={320} fill="#02040a" opacity={clamp(bt / 0.1)} />
                {Array.from({length: 12}).map((_, i) => {
                  const a = (i / 12) * Math.PI * 2;
                  const L = 90 + rnd(i) * 170;
                  return <line key={i} x1={355} y1={395} x2={355 + Math.cos(a) * L} y2={395 + Math.sin(a) * L} stroke="#e8f4ff" strokeWidth={3} opacity={0.85} />;
                })}
                {Array.from({length: 22}).map((_, i) => {
                  const a = rnd(i + 5) * Math.PI * 2;
                  const v = 80 + rnd(i) * 320;
                  const x = 355 + Math.cos(a) * v * bt;
                  const y = 395 + Math.sin(a) * v * bt + 500 * bt * bt;
                  return <polygon key={i} points="0,0 14,3 5,13" transform={`translate(${x} ${y}) rotate(${bt * 400 * rnd(i)})`} fill="#cfe6ff" opacity={clamp(1 - bt / 1.1)} />;
                })}
              </g>
            )}
          </>
        )}
      </g>
    </svg>
  );
};

// =============== composition ===============
export const Ep3: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS3;

  // outdoor scenes
  let slide: SlopeProps = {t, p: 0};
  let flash: {ox: number; oy: number; ang: number; k: number} | null = null;
  if (t < 5.07) {
    const stop = seg(t, 3.6, 4.2);
    slide = {t, p: clamp(t / 5.07), runner: {x: 540, y: 1560 - t * 6, s: 1.0 - t * 0.04, bob: 18 * (1 - stop)}, glow: seg(t, 2.4, 4.4), sk: shake(t, t > 2.4 ? 4 : 1.5)};
    flash = {ox: 600, oy: 1380, ang: -Math.PI / 2 + 0.1 * Math.sin(t * 1.3), k: 0.55};
  } else if (t >= 24.42 && t < 25.95) {
    slide = {t, p: clamp((t - 24.42) / 1.5), runner: {x: 540, y: 1700, s: 1.35, bob: 0}, house: 1, houseScale: 1.0, sk: shake(t, 2)};
  } else if (t >= 25.95 && t < 27.31) {
    slide = {t, p: clamp((t - 25.95) / 1.4), runner: {x: 540, y: 1700, s: 1.35, bob: 0}, house: 0, sk: shake(t, 6 * (1 - seg(t, 25.95, 26.6)))};
  } else if (t >= 27.31 && t < 32.62) {
    slide = {t, p: clamp((t - 27.31) / 5.3), runner: {x: 250, y: 1760, s: 1.05, bob: 0}, door: true};
  } else if (t >= 32.62 && t < 41.96) {
    const sprint = seg(t, 40.4, 41.4);
    slide = {t, p: clamp((t - 32.62) / 9.3) * 0.9, runner: {x: 540, y: 1620 - seg(t, 37.5, 41.5) * 120, s: lerp(1.2, 0.9, seg(t, 37.5, 41.5)), bob: 18 + 10 * sprint}, house: seg(t, 38.2, 41.5), houseScale: lerp(0.5, 1.2, seg(t, 38.2, 41.9)), glow: seg(t, 37.6, 41.6), sk: shake(t, 3 + 3 * sprint)};
    const beam = t < 35.7 ? lerp(1, 0.55, seg(t, 32.7, 35.7)) : lerp(0.55, 0.08, seg(t, 35.7, 37.1)) * (0.55 + 0.45 * Math.abs(Math.sin(t * 24)));
    flash = {ox: 600, oy: 1330, ang: -Math.PI / 2 + 0.08 * Math.sin(t * 1.5), k: t < 37.2 ? beam : 0.08 * (1 - seg(t, 37.2, 37.6))};
  }

  const radioScream = t >= 15.26 && t < 17.9 ? shake(t, 5) : {x: 0, y: 0};
  const slideOff = seg(t, 12.9, 14.9);
  const sleeveV: 'A' | 'B' = t >= 55.91 && t < 57.91 ? (Math.floor((t - 55.91) / 0.4) % 2 === 0 ? 'A' : 'B') : 'A';

  // blackout
  const black = t >= CUT ? 1 : 0;

  // audio
  const drone = ramp([[0, 0.2], [4.9, 0.2], [5.07, 0.02], [6.9, 0.2], [9.9, 0.2], [10.02, 0.01], [11.6, 0.01], [12.0, 0.16], [17.9, 0.06], [20.5, 0.2], [25.7, 0.2], [25.95, 0.02], [27.1, 0.02], [27.4, 0.18], [62.4, 0.18], [62.55, 0.05], [65.7, 0.05], [66.0, 0.18], [75.6, 0.18], [75.7, 0.05], [80.0, 0.05], [80.3, 0.18], [88.2, 0.14], [89.2, 0.0], [92, 0]]);
  const wind = ramp([[0, 0.14], [4.9, 0.14], [5.07, 0.04], [24.3, 0.04], [24.45, 0.16], [41.9, 0.14], [42.0, 0.07], [84.4, 0.05], [86, 0.03], [CUT, 0.03], [CUT + 0.1, 0]]);
  const fire = ramp([[0, 0], [5.0, 0], [5.1, 0.06], [24.3, 0.06], [24.4, 0], [51.3, 0], [51.4, 0.03], [57.8, 0.03], [58.2, 0], [84.4, 0.0], [CUT, 0]]);
  const radioBed = (a: number, b: number, v: number) => ramp([[0, 0], [0.15, v], [b - a - 0.3, v], [b - a, 0]]);

  return (
    <AbsoluteFill style={{backgroundColor: '#000'}}>
      <Audio src={staticFile('voice3.mp3')} volume={1} />
      <Audio src={staticFile('sfx/drone.mp3')} volume={drone} />
      <Audio src={staticFile('sfx/wind.mp3')} volume={wind} />
      <Audio src={staticFile('sfx/fire.mp3')} volume={fire} />
      <Sequence from={Math.round(8.25 * FPS3)} durationInFrames={30}><Audio src={staticFile('sfx/thud.mp3')} volume={0.4} /></Sequence>
      <Sequence from={Math.round(15.26 * FPS3)} durationInFrames={Math.round(5.3 * FPS3)}><Audio src={staticFile('sfx/static.mp3')} volume={radioBed(15.26, 20.56, 0.1)} /></Sequence>
      <Sequence from={Math.round(22.95 * FPS3)} durationInFrames={Math.round(1.4 * FPS3)}><Audio src={staticFile('sfx/glass.mp3')} volume={0.28} /></Sequence>
      <Sequence from={Math.round(22.93 * FPS3)} durationInFrames={30}><Audio src={staticFile('sfx/thud.mp3')} volume={0.3} /></Sequence>
      <Sequence from={Math.round(32.7 * FPS3)} durationInFrames={Math.round(3.0 * FPS3)}><Audio src={staticFile('sfx/crunch.mp3')} volume={0.09} /></Sequence>
      <Sequence from={Math.round(35.6 * FPS3)} durationInFrames={Math.round(1.8 * FPS3)}><Audio src={staticFile('sfx/crunch.mp3')} volume={0.07} /></Sequence>
      <Sequence from={Math.round(40.4 * FPS3)} durationInFrames={Math.round(1.5 * FPS3)}><Audio src={staticFile('sfx/crunch.mp3')} volume={0.09} /></Sequence>
      <Sequence from={Math.round(59.99 * FPS3)} durationInFrames={Math.round(6.0 * FPS3)}><Audio src={staticFile('sfx/static.mp3')} volume={radioBed(59.99, 65.99, 0.07)} /></Sequence>
      <Sequence from={Math.round(73.77 * FPS3)} durationInFrames={Math.round(6.4 * FPS3)}><Audio src={staticFile('sfx/static.mp3')} volume={radioBed(73.77, 80.17, 0.07)} /></Sequence>
      <Sequence from={Math.round(82.3 * FPS3)} durationInFrames={Math.round(2.2 * FPS3)}><Audio src={staticFile('sfx/ice.mp3')} volume={0.1} /></Sequence>
      <Sequence from={Math.round(84.65 * FPS3)} durationInFrames={50}><Audio src={staticFile('sfx/creak.mp3')} volume={0.14} /></Sequence>
      <Sequence from={Math.round(CUT * FPS3)} durationInFrames={30}><Audio src={staticFile('sfx/thud.mp3')} volume={0.6} /></Sequence>

      <Shot a={0} b={5.07} t={t}><Slope {...slide} />{flash && <Flashlight ox={flash.ox} oy={flash.oy} ang={flash.ang} spread={0.2} len={1500} k={flash.k} />}</Shot>
      <Shot a={5.07} b={12.82} t={t}><Room3 t={t} /></Shot>
      <Shot a={12.82} b={15.26} t={t}><Sleeve t={t} variant="A" slide={slideOff} /></Shot>
      <Shot a={15.26} b={20.87} t={t}>
        <AbsoluteFill style={{transform: `translate(${radioScream.x}px, ${radioScream.y}px)`}}>
          <Radio2 t={t} t0={15.26} voice={[[15.4, 17.7], [17.96, 20.5]]} p={clamp((t - 15.26) / 5.6)} />
        </AbsoluteFill>
      </Shot>
      <Shot a={20.87} b={24.42} t={t}><Room3 t={t} /></Shot>
      <Shot a={24.42} b={41.96} t={t}><Slope {...slide} />{flash && <Flashlight ox={flash.ox} oy={flash.oy} ang={flash.ang} spread={0.2} len={1500} k={flash.k} />}</Shot>
      <Shot a={41.96} b={55.91} t={t}><Facade t={t} /></Shot>
      <Shot a={55.91} b={57.5} t={t}><Sleeve t={t} variant={sleeveV} /></Shot>
      <Shot a={57.5} b={59.99} t={t}><Facade t={t} /></Shot>
      <Shot a={59.99} b={66.06} t={t}><Radio2 t={t} t0={59.99} voice={[[62.5, 65.7]]} p={clamp((t - 59.99) / 6)} /></Shot>
      <Shot a={66.06} b={73.77} t={t}><Facade t={t} /></Shot>
      <Shot a={73.77} b={80.4} t={t}><Radio2 t={t} t0={73.77} voice={[[75.68, 77.85], [78.1, 80.0]]} p={clamp((t - 73.77) / 6.6)} /></Shot>
      <Shot a={80.4} b={84.58} t={t}><Hands t={t} /></Shot>
      <Shot a={84.58} b={CUT} t={t}><Facade t={t} /></Shot>

      <Overlay t={t} frame={frame} />
      <StyledSub t={t} subs={subs3 as [number, number, string][]} weight={600} />
      <AbsoluteFill style={{background: '#000', opacity: black}} />
    </AbsoluteFill>
  );
};
