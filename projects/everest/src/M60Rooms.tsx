import React from 'react';
import {clamp, ease, lerp, rnd, mixc, Tx, Glow, Snow, E, P} from './M60Base';
import {Chars, CharSpec} from './M60Village';
import {Radio, TvSet, TvMode, HomeThermo, OutThermo, ClockArt} from './M60Items';

export const KW = 1700;
const FLOORK = 1500;
type KP = {t: number; lamp: number; power: number; flame: number; curtain: number; tv: TvMode; tvBanner?: number; tvTurn?: number; radioOn: number; needle: number; noise: number; water: number; chars?: CharSpec[]; outTemp: number; outRed?: number; shutters?: number; cold?: number; door?: number; bulbFlick?: number; view?: React.ReactNode; knock?: number};
export const Kitchen: React.FC<KP> = ({t, lamp, power, flame, curtain, tv, tvBanner, tvTurn, radioOn, needle, noise, water, chars, outTemp, outRed = 0, shutters = 0, cold = 0, door = 0, bulbFlick = 1, view, knock = 0}) => {
  const bulb = lamp * bulbFlick;
  const lightK = Math.max(bulb, flame * 0.22);
  const dark = mixc('#7a6a56', '#1b1b26', 1 - lightK);
  return (
    <g>
      <rect x={-200} y={-200} width={KW + 400} height={2400} fill={dark} />
      {Array.from({length: 22}).map((_, i) => <rect key={i} x={-200 + i * 90} y={-200} width={3} height={1750} fill="#000" opacity={0.18} />)}
      <rect x={-200} y={FLOORK} width={KW + 400} height={700} fill={mixc('#6a4a30', '#17120f', 1 - lightK)} />
      {Array.from({length: 10}).map((_, i) => <rect key={i} x={-200} y={FLOORK + i * 60} width={KW + 400} height={3} fill="#000" opacity={0.25} />)}
      {/* window with outdoor blizzard */}
      <g>
        <rect x={110} y={440} width={300} height={400} fill="#8fa8c8" stroke="#3a2a1c" strokeWidth={14} />
        <rect x={110} y={440} width={300} height={400} fill="#cfd8e4" opacity={0.7} />
        {view ? <g><clipPath id="kwin"><rect x={110} y={440} width={300} height={400} /></clipPath><g clipPath="url(#kwin)">{view}</g></g> : <Snow t={t} n={36} speed={220} wind={160} op={0.9} w={300} h={400} size={1.4} x0={110} y0={440} />}
        {knock > 0 && <g transform="translate(260 640)" opacity={knock}><rect x={-46} y={-130} width={92} height={190} rx={40} fill="#05080f" /><circle cx={0} cy={-160} r={34} fill="#05080f" /></g>}
        <g transform="translate(330 760) scale(0.34)"><OutThermo x={0} y={0} value={outTemp} red={outRed} t={t} /></g>
        <rect x={256} y={440} width={8} height={400} fill="#3a2a1c" />
        <rect x={110} y={636} width={300} height={8} fill="#3a2a1c" />
        {/* curtains */}
        <path d={`M${96} 420 L${96 + 130 + curtain * 130} 420 L${96 + 100 + curtain * 150} 880 L96 880 Z`} fill="#8a3a3a" opacity={0.92} />
        <path d={`M${430} 420 L${430 - 130 - curtain * 130} 420 L${430 - 100 - curtain * 150} 880 L430 880 Z`} fill="#8a3a3a" opacity={0.92} />
        <rect x={90} y={410} width={350} height={12} fill="#3a2a1c" />
        {shutters > 0 && <g><rect x={110} y={440} width={150 * shutters} height={400} fill="#4a3220" stroke="#2a1a0e" strokeWidth={6} /><rect x={410 - 150 * shutters} y={440} width={150 * shutters} height={400} fill="#4a3220" stroke="#2a1a0e" strokeWidth={6} /></g>}
        <rect x={100} y={836} width={330} height={20} fill="#5a3a24" />
      </g>
      <HomeThermo x={520} y={620} s={0.8} />
      {/* shelf with TV */}
      <rect x={980} y={950} width={440} height={16} fill="#4a3220" />
      <g transform="translate(1000 560) scale(0.95)"><TvSet x={0} y={0} mode={tv} t={t} banner={tvBanner} turn={tvTurn} s={0.8} /></g>
      {/* table */}
      <rect x={520} y={1130} width={420} height={26} rx={6} fill="#6a4a2a" stroke="#2a1a0e" strokeWidth={4} />
      <rect x={560} y={1156} width={20} height={344} fill="#4a3220" /><rect x={880} y={1156} width={20} height={344} fill="#4a3220" />
      <Radio x={730} y={1000} s={0.55} t={t} on={radioOn} needle={needle} noise={noise} />
      <rect x={560} y={1096} width={40} height={34} rx={6} fill="#c9d6e8" /><rect x={810} y={1104} width={70} height={26} rx={6} fill="#8a3a3a" />
      <g><rect x={1105} y={1430} width={130} height={14} rx={4} fill="#4a3220" /><rect x={1112} y={1444} width={12} height={56} fill="#3a2818" /><rect x={1216} y={1444} width={12} height={56} fill="#3a2818" /></g>
      {/* chairs */}
      <g><rect x={440} y={1260} width={110} height={16} fill="#4a3220" /><rect x={446} y={1276} width={12} height={224} fill="#3a2818" /><rect x={530} y={1276} width={12} height={224} fill="#3a2818" /><rect x={436} y={1100} width={12} height={170} fill="#3a2818" /></g>
      {/* stove */}
      <g transform="translate(1260 0)">
        <rect x={0} y={880} width={360} height={620} rx={14} fill="#8a4a3a" stroke="#3a1a14" strokeWidth={6} />
        {Array.from({length: 10}).map((_, i) => <rect key={i} x={0} y={890 + i * 62} width={360} height={3} fill="#3a1a14" opacity={0.5} />)}
        <rect x={60} y={1160} width={170} height={150} rx={14} fill="#14100e" stroke="#555" strokeWidth={8} />
        <rect x={72} y={1172} width={146} height={126} rx={8} fill={mixc('#1a100a', '#ff8a2a', flame)} />
        {flame > 0.05 && <g opacity={flame}><path d={`M110 1296 Q104 ${1236 + Math.sin(t * 13) * 8} 135 1210 Q150 ${1244 + Math.cos(t * 11) * 8} 176 1296 Z`} fill="#ffd23f" /></g>}
        <rect x={150} y={600} width={46} height={290} fill="#3a3a44" /><rect x={130} y={560} width={86} height={40} fill="#555" />
        <rect x={300} y={1180} width={30} height={90} fill="#555" />
        {/* pots on stove */}
        <rect x={20} y={840} width={120} height={50} rx={8} fill="#8a93a3" />
        {flame > 0.05 && <Glow x={150} y={1230} r={520} c="#ff9a3a" o={0.42 * flame} id="kstove" />}
        <rect x={380} y={1360} width={90} height={140} fill="#5a3a24" /><rect x={392} y={1330} width={20} height={60} fill="#8a5a34" />
      </g>
      {/* water pots on floor */}
      {[0, 1, 2].map((i) => (
        <g key={i} transform={`translate(${1020 + i * 90} ${FLOORK})`}>
          <rect x={-34} y={-70} width={68} height={70} rx={8} fill="#8a93a3" stroke="#3a4048" strokeWidth={3} />
          <rect x={-28} y={-6 - water * 54 * (1 - i * 0.1)} width={56} height={water * 54 * (1 - i * 0.1) + 2} fill="#5aa6e8" opacity={0.85} />
        </g>
      ))}
      {/* bulb */}
      <g>
        <line x1={760} y1={-200} x2={760} y2={310} stroke="#222" strokeWidth={4} />
        <circle cx={760} cy={330} r={26} fill={bulb > 0.1 ? '#fff2b0' : '#4a4a52'} opacity={bulb > 0.1 ? 1 : 0.8} />
        {bulb > 0.05 && <Glow x={760} y={330} r={760} c="#ffe9a0" o={0.5 * bulb} id="kbulb" />}
      </g>
      <Chars list={chars} />
      {cold > 0 && <rect x={-200} y={-200} width={KW + 400} height={2400} fill="#4a7ab8" opacity={0.16 * cold} />}
      <rect x={-200} y={-200} width={KW + 400} height={2400} fill="#06080f" opacity={power * (1 - Math.max(bulb, flame * 0.8)) * 0.35} />
    </g>
  );
};

// ---------------- Ilya's room ----------------
export const Room: React.FC<{t: number; jacket: 'hang' | 'none'; chars?: CharSpec[]; light?: number; boots?: boolean}> = ({t, jacket, chars, light = 0.8, boots = true}) => (
  <g>
    <rect x={-200} y={-200} width={1900} height={2400} fill={mixc('#2a2a3a', '#7a6a58', light)} />
    {Array.from({length: 20}).map((_, i) => <rect key={i} x={-200 + i * 90} y={-200} width={3} height={1700} fill="#000" opacity={0.15} />)}
    <rect x={-200} y={1500} width={1900} height={700} fill={mixc('#1a1a22', '#5a4030', light)} />
    {/* window */}
    <rect x={820} y={400} width={300} height={400} fill="#8fa8c8" stroke="#3a2a1c" strokeWidth={14} />
    <Snow t={t} n={30} speed={220} wind={160} op={0.9} w={300} h={400} size={1.4} x0={820} y0={400} />
    <rect x={966} y={400} width={8} height={400} fill="#3a2a1c" />
    {/* bed */}
    <rect x={40} y={1180} width={560} height={250} rx={14} fill="#5a6a8a" /><rect x={40} y={1100} width={560} height={110} rx={14} fill="#e8e0d4" /><rect x={30} y={1150} width={30} height={350} fill="#3a2818" /><rect x={580} y={1280} width={30} height={220} fill="#3a2818" />
    <rect x={60} y={1210} width={520} height={120} rx={10} fill="#8a3a3a" opacity={0.8} />
    {/* desk */}
    <rect x={1180} y={1180} width={420} height={22} fill="#6a4a2a" /><rect x={1200} y={1202} width={18} height={298} fill="#4a3220" /><rect x={1560} y={1202} width={18} height={298} fill="#4a3220" />
    <rect x={1300} y={1140} width={120} height={40} rx={4} fill="#1a1c22" />
    {/* hooks with clothes */}
    <rect x={1240} y={500} width={300} height={14} fill="#3a2818" />
    {jacket === 'hang' && <g transform="translate(1330 520)"><path d="M-50 0 L50 0 L70 250 L-70 250 Z" fill="#33425e" /><path d="M-30 0 Q0 -22 30 0 Z" fill="#445678" /><rect x={-3} y={0} width={6} height={250} fill="#1f2a40" /><rect x={-72} y={40} width={26} height={210} fill="#33425e" /><rect x={46} y={40} width={26} height={210} fill="#33425e" /></g>}
    <g transform="translate(1470 520)"><rect x={-26} y={0} width={52} height={260} fill="#0f1218" /><rect x={-26} y={0} width={52} height={20} fill="#252a35" /></g>
    {boots && <g transform="translate(900 1500)"><path d="M0 -50 L40 -50 L70 -10 L70 0 L-10 0 Z" fill="#14161b" /><path d="M90 -50 L130 -50 L160 -10 L160 0 L80 0 Z" fill="#14161b" /></g>}
    <Chars list={chars} />
  </g>
);

// ---------------- cellar ----------------
export const Cellar: React.FC<{t: number; show?: number; chars?: CharSpec[]}> = ({t, show = 1, chars}) => (
  <g>
    <rect x={-200} y={-200} width={1900} height={2400} fill="#1c1812" />
    {Array.from({length: 22}).map((_, i) => <rect key={i} x={-200 + i * 90} y={-200} width={4} height={1700} fill="#000" opacity={0.3} />)}
    <rect x={-200} y={1500} width={1900} height={700} fill="#2a1f16" />
    {/* hatch light */}
    <polygon points="1300,-200 1500,-200 1380,1500 1160,1500" fill="#cfd8e4" opacity={0.1} />
    <rect x={1330} y={300} width={22} height={1200} fill="#4a3220" /><rect x={1400} y={300} width={22} height={1200} fill="#4a3220" />
    {Array.from({length: 9}).map((_, i) => <rect key={i} x={1330} y={340 + i * 130} width={92} height={12} fill="#4a3220" />)}
    {/* shelves */}
    {[0, 1].map((s) => (
      <g key={s} transform={`translate(${s * 560 + 60} 0)`}>
        <rect x={0} y={420} width={20} height={1080} fill="#4a3220" /><rect x={480} y={420} width={20} height={1080} fill="#4a3220" />
        {[0, 1, 2, 3].map((r) => <rect key={r} x={0} y={560 + r * 240} width={500} height={16} fill="#6a4a2a" />)}
        {[0, 1, 2, 3].map((r) => Array.from({length: 5}).map((_, k) => {
          const kind = (r + k + s) % 4;
          const x = 30 + k * 90, y = 560 + r * 240;
          if (s === 0 && r === 0 && k > 4 - Math.floor(show * 5)) return null;
          return kind === 0 ? <g key={`${r}${k}`}><rect x={x} y={y - 80} width={64} height={80} rx={8} fill="#8a6a3a" /><rect x={x} y={y - 60} width={64} height={22} fill="#c0392b" /></g>
            : kind === 1 ? <g key={`${r}${k}`}><rect x={x + 8} y={y - 130} width={46} height={130} rx={10} fill="#6aa0d8" opacity={0.85} /><rect x={x + 16} y={y - 146} width={30} height={18} fill="#e8f0fb" /></g>
            : kind === 2 ? <g key={`${r}${k}`}><rect x={x - 6} y={y - 84} width={76} height={84} rx={10} fill="#c9b080" /><rect x={x + 6} y={y - 60} width={52} height={24} fill="#8a6a3a" /></g>
            : <g key={`${r}${k}`}><ellipse cx={x + 30} cy={y - 24} rx={34} ry={26} fill="#8a6a3a" /><ellipse cx={x + 52} cy={y - 30} rx={26} ry={20} fill="#6a4a2a" /></g>;
        }))}
      </g>
    ))}
    <rect x={1180} y={1360} width={120} height={140} fill="#6a4a2a" />
    <Glow x={600} y={420} r={800} c="#ffb04a" o={0.3} id="cellg" />
    <circle cx={600} cy={420} r={14} fill="#ffd27a" />
    <Chars list={chars} />
  </g>
);

// ---------------- shed ----------------
export const Shed: React.FC<{t: number; wood: number; chars?: CharSpec[]; dark?: number}> = ({t, wood, chars, dark = 0.3}) => (
  <g>
    <rect x={-200} y={-200} width={1900} height={2400} fill={mixc('#8a93a3', '#10182a', dark)} />
    <rect x={-200} y={1500} width={1900} height={700} fill={mixc('#dbe4f2', '#7f93b3', dark)} />
    <rect x={100} y={560} width={1100} height={940} fill="#4f3a2a" />
    {Array.from({length: 20}).map((_, i) => <rect key={i} x={100 + i * 58} y={560} width={4} height={940} fill="#000" opacity={0.3} />)}
    <path d="M60 560 L650 400 L1240 560 Z" fill="#eef4fc" />
    <rect x={260} y={760} width={760} height={740} fill="#14100c" />
    {/* wood stacks */}
    {Array.from({length: Math.max(1, Math.round(wood * 40))}).map((_, i) => {
      const row = Math.floor(i / 8), col = i % 8;
      return <circle key={i} cx={300 + col * 76 + (row % 2) * 36} cy={1470 - row * 66} r={32} fill={['#9a6a3a', '#8a5a2a', '#a8743a'][i % 3]} stroke="#3a2210" strokeWidth={4} />;
    })}
    <rect x={1120} y={1380} width={70} height={120} fill="#6a4a2a" /><line x1={1155} y1={1380} x2={1090} y2={1240} stroke="#555" strokeWidth={10} />
    <Chars list={chars} />
    <Snow t={t} n={80} speed={140} wind={100} op={0.8} w={1700} h={1920} size={1.4} />
  </g>
);

// ---------------- top-down table ----------------
export const TableTop: React.FC<{t: number; n: number}> = ({t, n}) => (
  <g>
    <rect x={-200} y={-200} width={1500} height={2400} fill="#3a2818" />
    {Array.from({length: 14}).map((_, i) => <rect key={i} x={-200 + i * 110} y={-200} width={4} height={2400} fill="#000" opacity={0.25} />)}
    <rect x={90} y={250} width={900} height={1400} rx={12} fill="#6a4a2a" stroke="#2a1a0e" strokeWidth={10} />
    {Array.from({length: 22}).map((_, i) => {
      const k = E(n, i * 0.35, i * 0.35 + 0.4);
      if (k <= 0) return null;
      const x = 190 + (i % 5) * 170, y = 360 + Math.floor(i / 5) * 230;
      const kind = i % 4;
      return (
        <g key={i} transform={`translate(${x} ${y}) scale(${0.6 + 0.4 * k})`} opacity={k}>
          {kind === 0 && <g><circle r={60} fill="#8a6a3a" stroke="#3a2210" strokeWidth={4} /><circle r={44} fill="#c0392b" /><circle r={14} fill="#e8d6b0" /></g>}
          {kind === 1 && <g><rect x={-46} y={-60} width={92} height={120} rx={14} fill="#c9b080" stroke="#6a5a3a" strokeWidth={4} /><rect x={-30} y={-20} width={60} height={30} fill="#8a6a3a" /></g>}
          {kind === 2 && <g><ellipse cx={-14} cy={0} rx={50} ry={38} fill="#8a6a3a" /><ellipse cx={22} cy={-8} rx={38} ry={30} fill="#6a4a2a" /></g>}
          {kind === 3 && <g><rect x={-26} y={-70} width={52} height={140} rx={14} fill="#6aa0d8" opacity={0.9} /><rect x={-16} y={-88} width={32} height={20} fill="#e8f0fb" /></g>}
        </g>
      );
    })}
  </g>
);
