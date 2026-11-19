import React from 'react';
import {clamp, ease, lerp, rnd, mixc, Tx, Glow, Snow, E, P, Person, Look} from './M60Base';
import {Chars, CharSpec} from './M60Village';
import {DotMap} from './M60City';

export const ANDREI: Look = {jacket: '#1b1e26', jacket2: '#2a2f3a', pants: '#12151c', glove: '#14161c', boot: '#101216', hat: 'none', hair: '#1a1a1e', skin: '#241e22', fat: 1.05};

// ---------------- monitors ----------------
export type MonMode = 'house' | 'map' | 'graph' | 'text' | 'red' | 'off' | 'green' | 'archive' | 'count';
export const Mon: React.FC<{x: number; y: number; w: number; h: number; mode: MonMode; t: number; n?: number; flick?: number}> = ({x, y, w, h, mode, t, n = 0, flick = 1}) => (
  <g transform={`translate(${x} ${y})`} opacity={flick}>
    <rect x={-6} y={-6} width={w + 12} height={h + 12} rx={8} fill="#14171e" stroke="#2a2f3a" strokeWidth={3} />
    <clipPath id={`mc${Math.round(x)}${Math.round(y)}`}><rect x={0} y={0} width={w} height={h} /></clipPath>
    <g clipPath={`url(#mc${Math.round(x)}${Math.round(y)})`}>
      <rect width={w} height={h} fill={mode === 'red' ? '#2a0808' : mode === 'archive' ? '#3a3a34' : '#05110a'} />
      {mode === 'house' && <g><rect width={w} height={h} fill="#0a1220" /><rect x={w * 0.3} y={h * 0.5} width={w * 0.4} height={h * 0.4} fill="#14100c" /><path d={`M${w * 0.26} ${h * 0.5} L${w * 0.5} ${h * 0.3} L${w * 0.74} ${h * 0.5} Z`} fill="#c4d2e6" /><rect x={w * 0.47} y={h * 0.14} width={w * 0.06} height={h * 0.09} fill="#ffd25a" opacity={0.7 + 0.3 * Math.sin(t * 6)} /></g>}
      {mode === 'map' && <g><rect width={w} height={h} fill="#0a1830" />{Array.from({length: 24}).map((_, i) => <rect key={i} x={rnd(i) * w * 0.8 + 6} y={rnd(i + 3) * h * 0.7 + 6} width={w * 0.12} height={h * 0.08} fill="#4a8ad8" opacity={0.5} />)}</g>}
      {mode === 'graph' && <g><path d={`M0 ${h / 2} ${Array.from({length: 30}).map((_, i) => `L${(i / 29) * w} ${h / 2 + Math.sin(i * 0.8 + t * 3) * h * 0.3 * Math.sin(i * 0.2)}`).join(' ')}`} stroke="#3bff7a" strokeWidth={3} fill="none" /></g>}
      {mode === 'text' && Array.from({length: 7}).map((_, i) => <rect key={i} x={8} y={10 + i * (h / 8)} width={w * (0.3 + rnd(i + Math.floor(t * 2)) * 0.6)} height={3} fill="#3bff7a" opacity={0.7} />)}
      {mode === 'red' && <g><Tx x={w / 2} y={h / 2 + 10} size={Math.min(w, h) * 0.3} fill="#ff3b3b" o={0.6 + 0.4 * (Math.sin(t * 10) > 0 ? 1 : 0)}>!</Tx></g>}
      {mode === 'green' && <rect width={w} height={h} fill="#0a4a22" opacity={0.7} />}
      {mode === 'archive' && <g>{[0, 1, 2].map((i) => <g key={i} transform={`translate(${w * (0.25 + i * 0.25)} ${h * 0.9})`}><rect x={-w * 0.06} y={-h * 0.5} width={w * 0.12} height={h * 0.5} rx={10} fill="#1a1a18" /><circle cx={0} cy={-h * 0.58} r={w * 0.045} fill="#1a1a18" /></g>)}{Array.from({length: 14}).map((_, i) => <rect key={i} x={0} y={rnd(i + Math.floor(t * 12)) * h} width={w} height={2} fill="#fff" opacity={0.18} />)}</g>}
      {mode === 'count' && <Tx x={w / 2} y={h * 0.72} size={h * 0.7} fill="#ff3b3b">{n}</Tx>}
      {mode !== 'off' && Array.from({length: Math.floor(h / 6)}).map((_, i) => <rect key={i} y={i * 6} width={w} height={1.5} fill="#000" opacity={0.2} />)}
    </g>
    {mode !== 'off' && <Glow x={w / 2} y={h / 2} r={Math.max(w, h)} c={mode === 'red' ? '#ff3b3b' : mode === 'archive' ? '#cfd0c0' : '#3bff7a'} o={0.22} id={`mg${Math.round(x)}${Math.round(y)}`} />}
  </g>
);

// ---------------- control room ----------------
export const ControlRoom: React.FC<{t: number; lamps?: number; alarm?: number; mainMode?: MonMode; sideMode?: MonMode; half?: number; chars?: CharSpec[]; n?: number; blackout?: number; green?: number; mainN?: number; extra?: React.ReactNode}> = ({t, lamps = 1, alarm = 0, mainMode = 'map', sideMode = 'text', half = 0, chars, n = 0, blackout = 0, green = 0, mainN = 0, extra}) => {
  const L = Math.max(0, lamps - half * 0.5);
  const flick = blackout > 0 ? (Math.sin(t * 35) > -0.2 ? 1 : 0.3) : 1;
  return (
    <g>
      <rect x={-4000} y={-1500} width={9700} height={3400} fill="#0a0e10" />
      <rect x={-4000} y={1500} width={9700} height={600} fill="#161a1c" />
      {Array.from({length: 16}).map((_, i) => <rect key={i} x={-300 + i * 160} y={-200} width={4} height={1700} fill="#000" opacity={0.35} />)}
      {/* monitor wall */}
      {Array.from({length: 3}).map((_, r) => Array.from({length: 6}).map((_, c) => (c === 2 || c === 3) && r === 1 ? null : (
        <Mon key={`${r}${c}`} x={380 + c * 320} y={320 + r * 220} w={290} h={190} mode={half > 0.5 && (r + c) % 2 ? 'off' : (sideMode === 'house' ? 'house' : ((r * 6 + c) % 4 === 0 ? 'graph' : (r + c) % 3 === 0 ? 'map' : 'text'))} t={t} flick={flick} />
      )))}
      <Mon x={1020} y={560} w={620} h={190} mode={mainMode} t={t} n={mainN} flick={flick} />
      {/* desk */}
      <rect x={300} y={1180} width={1800} height={220} rx={14} fill="#2a2f34" stroke="#0e1114" strokeWidth={6} />
      {Array.from({length: 40}).map((_, i) => <rect key={i} x={340 + (i % 20) * 86} y={1200 + Math.floor(i / 20) * 80} width={60} height={50} rx={8} fill={rnd(i + Math.floor(t * 2)) > 0.8 ? '#3bff7a' : '#14181c'} opacity={0.85} />)}
      <circle cx={1200} cy={1150} r={42} fill="#c0392b" stroke="#6a1a14" strokeWidth={8} />
      {/* cabinets */}
      {[0, 1].map((i) => <g key={i} transform={`translate(${i ? 2150 : 40} 700)`}><rect x={0} y={0} width={220} height={800} fill="#1e2428" stroke="#0e1114" strokeWidth={6} />{Array.from({length: 8}).map((_, k) => <rect key={k} x={20} y={30 + k * 90} width={180} height={60} fill="#14181c" />)}{Array.from({length: 8}).map((_, k) => <circle key={k} cx={40} cy={60 + k * 90} r={7} fill={rnd(k + i * 9 + Math.floor(t)) > 0.5 ? '#3bff7a' : '#ff6a3a'} />)}</g>)}
      {/* ceiling lamps */}
      {Array.from({length: 7}).map((_, i) => { const on = (i % 2 === 0 || half < 0.5) ? L : 0; const col = alarm > 0 ? '#ff3b3b' : '#cfe8d8'; return <g key={i}><rect x={300 + i * 330} y={-100} width={120} height={20} fill="#2a3034" /><Glow x={360 + i * 330} y={-60} r={420} c={col} o={0.3 * on * (alarm > 0 ? 0.5 + 0.5 * (Math.sin(t * 8) > 0 ? 1 : 0) : 1)} id={`cl${i}`} /></g>; })}
      {green > 0 && <Glow x={1200} y={900} r={1400} c="#3bff7a" o={0.18 * green} id="cgr" />}
      {/* cables */}
      {Array.from({length: 6}).map((_, i) => <path key={i} d={`M${100 + i * 380} 1500 Q${300 + i * 380} 1560 ${500 + i * 380} 1500`} stroke="#0a0c0e" strokeWidth={14} fill="none" />)}
      <Chars list={chars} />
      {extra}
      <rect x={-4000} y={-1500} width={9700} height={3400} fill="#000" opacity={0.28 * (1 - L) + blackout} />
      {alarm > 0 && <rect x={-4000} y={-1500} width={9700} height={3400} fill="#ff2a2a" opacity={0.08 * alarm * (0.5 + 0.5 * Math.sin(t * 8))} />}
    </g>
  );
};

// ---------------- world map with stations ----------------
export const StationMap: React.FC<{t: number; blue: number; temps?: number; cityN?: number; showCities?: boolean; lines?: number; stations?: number; drop?: number; rise?: number; hot?: number}> = ({t, blue, lines = 0, stations = 0, cityN = 0, rise = 0}) => {
  const cities = [
    {n: 'МОСКВА', x: 560, y: 150, v: -62}, {n: 'БЕРЛИН', x: 520, y: 135, v: -67}, {n: 'НЬЮ-ЙОРК', x: 250, y: 190, v: -64}, {n: 'ТОКИО', x: 880, y: 190, v: -61},
  ];
  const pts: [number, number][] = [[560, 150], [520, 135], [250, 190], [880, 190], [300, 330], [560, 280], [830, 330]];
  return (
    <g>
      <rect x={-4000} y={-1500} width={9700} height={3400} fill="#04080f" />
      <g transform="translate(-100 160) scale(1.3)">
        <DotMap t={t} reveal={1} />
        <g transform="translate(0 560) scale(1.08)">
          <rect x={0} y={0} width={1000} height={500} fill="#2a6ad8" opacity={0.28 * blue} />
          {lines > 0 && pts.map((p, i) => pts.slice(i + 1).map((q, j) => <line key={`${i}${j}`} x1={p[0]} y1={p[1]} x2={q[0]} y2={q[1]} stroke="#7fb8ff" strokeWidth={1.5} opacity={0.5 * lines * clamp((lines * 8 - (i + j) * 0.6))} />))}
          {pts.map((p, i) => <g key={i} opacity={clamp(stations * 8 - i)}><circle cx={p[0]} cy={p[1]} r={9} fill="#ff4a3a" /><circle cx={p[0]} cy={p[1]} r={9 + 14 * (0.5 + 0.5 * Math.sin(t * 4 + i))} fill="none" stroke="#ff4a3a" strokeWidth={2} opacity={0.5} /></g>)}
          {cities.map((c, i) => i < cityN && <g key={i}><circle cx={c.x} cy={c.y} r={7} fill="#fff" /><Tx x={c.x} y={c.y - 20} size={22} fill="#cfe0ff">{c.n}</Tx><Tx x={c.x} y={c.y + 40} size={30} fill="#7fd0ff">{`−${Math.round(lerp(Math.abs(c.v), Math.abs(c.v) - 6 * rise, 1))}`}</Tx></g>)}
        </g>
      </g>
    </g>
  );
};
export const Countdown: React.FC<{t: number; text: string; red?: boolean}> = ({t, text, red = true}) => (
  <g>
    <rect x={-4000} y={-1500} width={9700} height={3400} fill="#080508" />
    <Glow x={960} y={540} r={900} c={red ? '#ff2a2a' : '#3bff7a'} o={0.3} id="cdg" />
    <Tx x={960} y={700} size={430} fill={red ? '#ff3b3b' : '#3bff7a'} o={0.8 + 0.2 * Math.sin(t * 10)}>{text}</Tx>
  </g>
);
export const SpeakerScene: React.FC<{t: number; lvl: number}> = ({t, lvl}) => (
  <g>
    <rect x={-4000} y={-1500} width={9700} height={3400} fill="#12161a" />
    <g transform="translate(540 540)">
      <rect x={-300} y={-300} width={600} height={600} rx={40} fill="#22282c" stroke="#0a0c0e" strokeWidth={10} />
      <circle cx={0} cy={0} r={230} fill="#0a0c0e" />
      <circle cx={0} cy={0} r={190 + lvl * Math.sin(t * 60) * 8} fill="#2a3034" stroke="#444c52" strokeWidth={8} />
      <circle cx={0} cy={0} r={70 + lvl * Math.sin(t * 60) * 4} fill="#14181c" />
      {Array.from({length: 4}).map((_, i) => <circle key={i} cx={[-250, 250, -250, 250][i]} cy={[-250, -250, 250, 250][i]} r={14} fill="#555c62" />)}
      <g transform="translate(0 -360)"><rect x={-180} y={-60} width={360} height={110} rx={14} fill="#05110a" stroke="#2a2f34" strokeWidth={5} /><rect x={-150} y={-30} width={300 * clamp(0.3 + lvl * 0.7 * (0.6 + 0.4 * Math.sin(t * 18)))} height={50} fill="#3bff7a" /></g>
    </g>
    <Glow x={540} y={540} r={900} c="#7fb8ff" o={0.12 * lvl} id="spg" />
  </g>
);
export const LeverCabinet: React.FC<{t: number; throw_: number; ready: number; half: number}> = ({t, throw_, ready, half}) => (
  <g>
    <rect x={-4000} y={-1500} width={9700} height={3400} fill="#0e1214" />
    <g transform="translate(540 540)">
      <rect x={-340} y={-440} width={680} height={880} rx={24} fill="#3a4044" stroke="#1a1e20" strokeWidth={10} />
      <rect x={-260} y={-360} width={520} height={160} fill="#05110a" stroke="#222" strokeWidth={6} /><Tx x={0} y={-250} size={64} fill="#3bff7a" o={ready}>ПЕРЕДАТЧИК ГОТОВ</Tx>
      <rect x={-40} y={-120} width={80} height={380} rx={20} fill="#2a2f32" />
      <g transform={`translate(0 120) rotate(${lerp(-40, 40, throw_)})`}><rect x={-14} y={-260} width={28} height={260} rx={12} fill="#d33a2c" /><circle cx={0} cy={-270} r={38} fill="#d33a2c" stroke="#6a1a14" strokeWidth={6} /></g>
      {[0, 1, 2, 3].map((i) => <circle key={i} cx={-210 + i * 140} cy={330} r={22} fill={i < 4 - Math.round(half * 2) ? '#ff9a3a' : '#2a1a10'} />)}
      <circle cx={260} cy={-300} r={20} fill={ready > 0.5 ? '#3bff7a' : '#14301a'} />
    </g>
    <Glow x={540} y={540} r={800} c="#3bff7a" o={0.12 * ready} id="lcg" />
  </g>
);
export const RedButton: React.FC<{t: number; press: number}> = ({t, press}) => (
  <g>
    <rect x={-4000} y={-1500} width={9700} height={3400} fill="#0c0f10" />
    <g transform="translate(960 600)">
      <rect x={-420} y={-120} width={840} height={560} rx={40} fill="#2a3034" stroke="#0e1114" strokeWidth={10} />
      <circle cx={0} cy={140} r={170} fill="#14181c" stroke="#555c62" strokeWidth={10} />
      <circle cx={0} cy={140 + press * 18} r={140 - press * 6} fill="#d33a2c" stroke="#6a1a14" strokeWidth={10} />
      <ellipse cx={-40} cy={90 + press * 18} rx={60} ry={30} fill="#fff" opacity={0.22} />
      <g transform={`translate(${lerp(260, 20, press)} ${lerp(-60, 60, press) + 140})`}><rect x={-34} y={-30} width={150} height={60} rx={28} fill="#d6a07c" stroke="#8a5a3a" strokeWidth={3} /><rect x={110} y={-34} width={150} height={68} rx={30} fill="#1b1e25" /></g>
    </g>
    <Glow x={960} y={740} r={700} c="#ff2a2a" o={0.3 + 0.3 * press} id="rbg2" />
  </g>
);
// ---------------- perspective corridor & stairs ----------------
export const Corridor: React.FC<{t: number; prog: number; beam?: number}> = ({t, prog, beam = 1}) => {
  const rows = 9;
  return (
    <g>
      <rect x={-4000} y={-1500} width={9700} height={3400} fill="#05070a" />
      {Array.from({length: rows}).map((_, i) => {
        const z = ((i + (prog * 3) % 1) / rows);
        const k = Math.pow(z, 2.2);
        const sc = 0.1 + k * 3.2;
        return (
          <g key={i} transform={`translate(960 520) scale(${sc})`} opacity={0.15 + 0.85 * z}>
            <rect x={-420} y={-300} width={840} height={600} fill="none" stroke="#2a323a" strokeWidth={6 / sc} />
            <rect x={-420} y={-220} width={30} height={420} fill="#1a2024" /><rect x={390} y={-220} width={30} height={420} fill="#1a2024" />
            <path d="M-420 -180 Q0 -120 420 -180" stroke="#0a0c0e" strokeWidth={14 / sc} fill="none" /><path d="M-420 -120 Q0 -60 420 -120" stroke="#14181c" strokeWidth={10 / sc} fill="none" />
          </g>
        );
      })}
      <polygon points="960,520 1700,1080 220,1080" fill="#0c1014" />
      {[0, 1, 2, 3, 4].map((i) => <g key={i} transform={`translate(${960 + (i % 2 ? 90 : -90) * (1 + i * 0.6)} ${600 + i * 90}) scale(${0.4 + i * 0.3})`}><ellipse cx={0} cy={0} rx={20} ry={36} fill="#000" opacity={0.6} /></g>)}
      <polygon points="960,560 1500,100 1500,1100" fill="#fff6c8" opacity={0.1 * beam} />
      <Glow x={960} y={520} r={500} c="#cfe8d8" o={0.2 * beam} id="corg" />
    </g>
  );
};
export const StairsDown: React.FC<{t: number; prog: number}> = ({t, prog}) => (
  <g>
    <rect x={-4000} y={-1500} width={9700} height={3400} fill="#05070a" />
    {Array.from({length: 12}).map((_, i) => {
      const z = ((i - (prog * 4) % 1) / 12);
      const k = clamp(z);
      const y = 1080 - k * 700 - Math.pow(k, 1.6) * 0;
      const w = lerp(1500, 260, k);
      return <g key={i} opacity={0.2 + 0.8 * (1 - k)}><rect x={960 - w / 2} y={y} width={w} height={lerp(70, 12, k)} fill="#1e252b" stroke="#2f3a42" strokeWidth={3} /><rect x={960 - w / 2 - 30} y={y - lerp(90, 16, k)} width={30} height={lerp(160, 30, k)} fill="#12171b" /><rect x={960 + w / 2} y={y - lerp(90, 16, k)} width={30} height={lerp(160, 30, k)} fill="#12171b" /></g>;
    })}
    <Glow x={960} y={380} r={500} c="#3bff7a" o={0.3 * clamp(prog)} id="stg" />
    <polygon points="960,420 1500,100 1500,1100" fill="#fff6c8" opacity={0.08} />
  </g>
);
export const GreenDoor: React.FC<{t: number; open: number}> = ({t, open}) => (
  <g>
    <rect x={-4000} y={-1500} width={9700} height={3400} fill="#0a0e10" />
    <rect x={560} y={140} width={800} height={900} fill="#1a2024" stroke="#0e1214" strokeWidth={10} />
    <rect x={620} y={200} width={680} height={840} fill={mixc('#2a3034', '#3bff7a', open * 0.9)} />
    <g transform={`translate(620 200)`}><path d={`M0 0 L${-380 * open + 340} ${30 * open} L${-380 * open + 340} ${840 - 30 * open} L0 840 Z`} fill="#3a4246" stroke="#14181a" strokeWidth={8} /><circle cx={290 - 330 * open + 0} cy={420} r={70} fill="#2a3034" stroke="#6a727a" strokeWidth={10} /></g>
    {open < 0.2 && <rect x={620} y={1030} width={680} height={14} fill="#3bff7a" opacity={0.8} />}
    <Glow x={960} y={1030} r={900} c="#3bff7a" o={0.35 + 0.5 * open} id="gdg" />
    {open > 0.3 && <rect x={-4000} y={-1500} width={9700} height={3400} fill="#3bff7a" opacity={0.25 * open} />}
  </g>
);
// ---------------- station exterior ----------------
export const StationExt: React.FC<{t: number; dawn?: number; car?: boolean; plaque?: boolean; door?: number}> = ({t, dawn = 0, car = true, door = 0}) => {
  const sky0 = mixc('#0e1728', '#7a8aa8', dawn), sky1 = mixc('#1c2a44', '#e8c8a8', dawn);
  return (
    <g>
      <defs><linearGradient id="stsk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={sky0} /><stop offset="1" stopColor={sky1} /></linearGradient></defs>
      <rect x={-4000} y={-1500} width={9700} height={3400} fill="url(#stsk)" />
      {Array.from({length: 50}).map((_, i) => <g key={i} transform={`translate(${i * 110 - 1800} ${1050 - rnd(i) * 60}) scale(${1.3 + rnd(i + 1) * 0.8})`}><path d="M-60 0 L0 -280 L60 0 Z" fill={mixc('#0a1420', '#2a3a4a', dawn)} /><path d="M-36 -110 L0 -280 L36 -110 Z" fill="#dfe9f7" opacity={0.18} /></g>)}
      <rect x={-4000} y={1220} width={9700} height={900} fill={mixc('#8a9ab4', '#dfe9f7', dawn)} />
      {/* tower */}
      <g transform="translate(1500 1220)"><path d="M-80 0 L0 -1000 L80 0" fill="none" stroke={mixc('#1a2234', '#3a4a5a', dawn)} strokeWidth={12} />{Array.from({length: 9}).map((_, i) => <path key={i} d={`M${-72 + i * 8} ${-i * 110} L${72 - i * 8} ${-i * 110 - 110} M${72 - i * 8} ${-i * 110} L${-72 + i * 8} ${-i * 110 - 110}`} stroke={mixc('#1a2234', '#3a4a5a', dawn)} strokeWidth={5} />)}<circle cx={0} cy={-1010} r={12} fill="#ff3b3b" opacity={0.35 + 0.65 * (Math.sin(t * 3) > 0.4 ? 1 : 0)} /><Glow x={0} y={-1010} r={180} c="#ff3b3b" o={0.5 * (Math.sin(t * 3) > 0.4 ? 1 : 0)} id="tw1" /></g>
      {/* fence + gate */}
      {Array.from({length: 14}).map((_, i) => <rect key={i} x={100 + i * 60} y={1100} width={8} height={160} fill="#3a4250" />)}
      <rect x={100} y={1140} width={760} height={6} fill="#3a4250" /><rect x={100} y={1210} width={760} height={6} fill="#3a4250" />
      <g transform="translate(900 1100)"><path d="M0 0 L-90 -20 L-90 160 L0 160 Z" fill="#4a5260" stroke="#2a3040" strokeWidth={4} opacity={0.9} /></g>
      {/* concrete building */}
      <rect x={1000} y={900} width={380} height={340} fill={mixc('#3a3e44', '#6a6e74', dawn)} stroke="#14161a" strokeWidth={6} />
      <rect x={1000} y={880} width={380} height={30} fill="#2a2e34" />
      <rect x={1120} y={1020} width={140} height={220} fill="#1a1e22" stroke="#4a5260" strokeWidth={6} />
      <g transform="translate(1120 1020)"><path d={`M0 0 L${-90 * door} ${12 * door} L${-90 * door} ${220 - 12 * door} L0 220 Z`} fill="#2a2e34" stroke="#14161a" strokeWidth={4} /></g>
      <rect x={1140} y={950} width={100} height={50} fill="#c9d0d8" stroke="#555c64" strokeWidth={3} />
      {car && <g transform="translate(560 1300)"><ellipse cx={0} cy={6} rx={170} ry={14} fill="#000" opacity={0.3} /><path d="M-150 -34 L-150 -80 Q-146 -100 -120 -102 L-74 -106 L-40 -146 L58 -146 L96 -106 L130 -100 Q150 -96 150 -76 L150 -34 Z" fill="#1c1e26" /><path d="M-58 -106 L-34 -138 L-6 -138 L-6 -106 Z M8 -106 L8 -138 L52 -138 L82 -106 Z" fill="#0a0c12" /><circle cx={-96} cy={-26} r={30} fill="#0a0c12" /><circle cx={96} cy={-26} r={30} fill="#0a0c12" /><path d="M-140 -80 Q-30 -110 140 -92 Q40 -112 -140 -80 Z" fill="#e8f0fb" opacity={0.75} /></g>}
      {/* tracks */}
      {[0, 1].map((i) => <path key={i} d={`M-300 ${1500 + i * 30} Q500 ${1420 + i * 20} 920 ${1310 + i * 6}`} stroke="#6a7a94" strokeWidth={10} fill="none" opacity={0.7} />)}
      <Snow t={t} n={Math.round(110 * (1 - dawn * 0.9))} speed={200} wind={220} op={0.8} w={1900} h={1500} size={1.7} x0={-300} y0={-100} />
    </g>
  );
};
export const Plaque: React.FC<{t: number; key_?: number}> = ({t, key_ = 0}) => (
  <g>
    <rect x={-4000} y={-1500} width={9700} height={3400} fill="#14161a" />
    {Array.from({length: 16}).map((_, i) => <rect key={i} x={-300 + i * 140} y={-1500} width={4} height={3400} fill="#000" opacity={0.3} />)}
    <g transform="translate(960 380)"><rect x={-340} y={-90} width={680} height={180} rx={14} fill="#aab2ba" stroke="#555c64" strokeWidth={10} /><Tx x={0} y={32} size={88} fill="#1a1e22">ОБЪЕКТ 17</Tx>{[-310, 310].map((x) => <circle key={x} cx={x} cy={-60} r={10} fill="#555c64" />)}</g>
    <g transform="translate(960 780)"><rect x={-260} y={-120} width={520} height={560} fill="#2a2e34" stroke="#14161a" strokeWidth={10} /><circle cx={0} cy={80} r={60} fill="#14161a" stroke="#6a727a" strokeWidth={8} /><rect x={-10} y={50} width={20} height={80} fill="#05070a" /><g transform={`translate(${lerp(-340, -4, key_)} 82)`}><rect x={-240} y={-10} width={240} height={20} rx={8} fill="#c9a82a" stroke="#6a4a0a" strokeWidth={4} /><circle cx={-250} cy={0} r={34} fill="none" stroke="#c9a82a" strokeWidth={14} /></g></g>
    <Snow t={t} n={80} speed={200} wind={220} op={0.8} w={1900} h={1500} size={1.6} x0={-300} />
  </g>
);
// ---------------- snowmobile & ride ----------------
export const SnowMobile: React.FC<{x: number; y: number; s?: number; t: number; riders?: boolean; run?: boolean}> = ({x, y, s = 1, t, riders = true, run = true}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse cx={0} cy={8} rx={180} ry={14} fill="#000" opacity={0.3} />
    <path d="M-170 -10 L-170 -50 Q-140 -60 -60 -60 L120 -70 Q190 -80 210 -40 L150 -10 Z" fill="#c9a82a" stroke="#6a4a0a" strokeWidth={5} />
    <path d="M-80 -60 Q-20 -130 60 -118 L110 -70 Z" fill="#14171e" />
    <rect x={-150} y={-6} width={320} height={22} rx={10} fill="#0a0c10" />
    <path d="M150 -6 L240 -30 L255 -18 L160 12 Z" fill="#14171e" />
    <circle cx={190} cy={-52} r={10} fill="#fff6c8" /><Glow x={210} y={-52} r={200} c="#fff6c8" o={run ? 0.7 : 0.2} id={`sm${Math.round(x)}`} />
    {riders && <g><rect x={-40} y={-150} width={60} height={96} rx={26} fill="#33425e" /><circle cx={-8} cy={-176} r={26} fill="#d6a07c" /><path d="M-36 -186 Q-8 -214 22 -186 L22 -172 L-36 -172 Z" fill="#1f2430" /><rect x={-100} y={-140} width={60} height={86} rx={24} fill="#1f4a33" /><circle cx={-70} cy={-164} r={24} fill="#d6a07c" /><path d="M-96 -174 Q-70 -200 -44 -174 L-44 -160 L-96 -160 Z" fill="#7a7f8a" /></g>}
  </g>
);
export const RideScene: React.FC<{t: number; speed: number; dawn?: number; shake?: number}> = ({t, speed, dawn = 0, shake = 0}) => {
  const off = t * speed;
  return (
    <g>
      <rect x={-4000} y={-1500} width={9700} height={3400} fill={mixc('#070b14', '#8a9ab4', dawn)} />
      {[0.15, 0.35, 0.6].map((k, li) => (
        <g key={li}>{Array.from({length: 40}).map((_, i) => { const x = ((i * 150 - off * k * 30 + 99999) % 6000) - 2000; return <g key={i} transform={`translate(${x} ${1000 + li * 90}) scale(${1 + li * 0.7 + rnd(i + li) * 0.4})`}><path d="M-60 0 L0 -300 L60 0 Z" fill={mixc(['#0a1420', '#08101a', '#05080f'][li], ['#4a5a6a', '#3a4a5a', '#2a3a4a'][li], dawn)} /><path d="M-36 -110 L0 -300 L36 -110 Z" fill="#dfe9f7" opacity={0.15 + li * 0.08} /></g>; })}</g>
      ))}
      <rect x={-4000} y={1280} width={9700} height={900} fill={mixc('#9fb0c8', '#e8ecf4', dawn)} />
      {Array.from({length: 14}).map((_, i) => <rect key={i} x={((i * 260 - off * 14 + 99999) % 3600) - 800} y={1420 + (i % 3) * 40} width={160} height={8} fill="#dfe9f7" opacity={0.8} />)}
      <g transform={`translate(0 ${Math.sin(t * 40) * shake})`}><SnowMobile x={760} y={1380} s={1.6} t={t} /></g>
      {Array.from({length: 24}).map((_, i) => { const tau = ((t * 1.6 + rnd(i) * 3) % 1); return <circle key={i} cx={620 - tau * 360} cy={1360 - tau * 40 + rnd(i + 2) * 40} r={6 + rnd(i) * 10} fill="#fff" opacity={0.8 * (1 - tau)} />; })}
      <Snow t={t} n={Math.round(110 * (1 - dawn))} speed={180} wind={Math.max(60, speed * 12)} op={0.8} w={1900} h={1500} size={1.7} x0={-300} y0={-100} />
    </g>
  );
};
export const Garage: React.FC<{t: number; chars?: CharSpec[]; run?: number; gear?: boolean}> = ({t, chars, run = 0, gear}) => (
  <g>
    <rect x={-4000} y={-1500} width={9700} height={3400} fill="#10141a" />
    {Array.from({length: 22}).map((_, i) => <rect key={i} x={-200 + i * 90} y={-300} width={3} height={1800} fill="#000" opacity={0.3} />)}
    <rect x={-4000} y={1500} width={9700} height={700} fill="#1c1c20" />
    <rect x={1300} y={480} width={520} height={14} fill="#4a3220" /><rect x={1300} y={780} width={520} height={14} fill="#4a3220" />
    {[0, 1, 2].map((i) => <rect key={i} x={1330 + i * 150} y={420} width={50} height={60} rx={8} fill="#c9a82a" />)}
    <g transform="translate(1360 740)">{[0, 1, 2].map((i) => <rect key={i} x={i * 70} y={0} width={46} height={40} rx={6} fill="#4a8a4a" />)}</g>
    <g transform="translate(1600 780)"><rect x={0} y={-90} width={60} height={90} rx={14} fill="#8d94a3" /><rect x={8} y={-110} width={44} height={24} rx={8} fill="#c0392b" /></g>
    <SnowMobile x={760} y={1500} s={2.0} t={t} riders={false} run={run > 0} />
    {run > 0 && Array.from({length: 8}).map((_, i) => { const tau = ((t * 0.8 + i * 0.13) % 1); return <circle key={i} cx={430 - tau * 140} cy={1470 - tau * 100} r={12 + tau * 28} fill="#8a8f9a" opacity={0.4 * (1 - tau)} />; })}
    <rect x={-100} y={460} width={380} height={900} fill="#dfe9f7" opacity={0.0} />
    <Chars list={chars} />
    <Glow x={760} y={600} r={900} c="#ffd27a" o={0.18} id="grg" />
  </g>
);
export const GearClose: React.FC<{t: number; item: number}> = ({t, item}) => (
  <g>
    <rect x={-4000} y={-1500} width={9700} height={3400} fill="#1a1612" />
    <rect x={-4000} y={800} width={9700} height={1200} fill="#2a2018" />
    <g transform="translate(960 640)">
      {item === 0 && <g><rect x={-260} y={0} width={380} height={90} rx={26} fill="#c9a82a" stroke="#6a4a0a" strokeWidth={6} /><circle cx={160} cy={45} r={74} fill="#8d94a3" stroke="#555" strokeWidth={6} /><circle cx={160} cy={45} r={46} fill="#fff6c8" /><Glow x={160} y={45} r={520} c="#fff6c8" o={0.55} id="gc0" /></g>}
      {item === 1 && <g>{[0, 1, 2, 3].map((i) => <g key={i} transform={`translate(${-220 + i * 120} 0)`}><rect width={80} height={190} rx={14} fill="#3a6a3a" stroke="#14301a" strokeWidth={5} /><rect x={20} y={-14} width={40} height={20} fill="#c9d0d8" /><rect x={0} y={60} width={80} height={36} fill="#c9a82a" /></g>)}</g>}
      {item === 2 && <g><rect x={-90} y={-120} width={180} height={330} rx={50} fill="#c0392b" stroke="#6a1a14" strokeWidth={6} /><rect x={-70} y={-170} width={140} height={60} rx={14} fill="#14161a" /><rect x={-90} y={0} width={180} height={50} fill="#e8c9c3" opacity={0.5} />{[0, 1, 2].map((i) => <path key={i} d={`M${-30 + i * 30} -190 q-14 -40 0 -80`} stroke="#fff" strokeWidth={6} fill="none" opacity={0.35} />)}</g>}
      {item === 3 && <g><rect x={-300} y={20} width={600} height={180} rx={14} fill="#c0392b" stroke="#6a1a14" strokeWidth={6} /><rect x={-260} y={-30} width={200} height={50} rx={8} fill="#8d94a3" /><path d="M0 -20 L120 -90 L160 -50 L50 20 Z" fill="#8d94a3" stroke="#555" strokeWidth={4} /><rect x={160} y={-40} width={120} height={60} fill="#c9a82a" /></g>}
    </g>
  </g>
);
export const HouseCut: React.FC<{t: number; prog: number; win: number}> = ({t, prog, win}) => (
  <g>
    <rect x={-4000} y={-1500} width={9700} height={3400} fill="#080c14" />
    <rect x={-4000} y={700} width={9700} height={1400} fill="#1a1c20" />
    {Array.from({length: 12}).map((_, i) => <path key={i} d={`M-2000 ${760 + i * 80} Q0 ${770 + i * 80} 2800 ${760 + i * 80}`} stroke="#0e1014" strokeWidth={3} fill="none" opacity={0.7} />)}
    <rect x={-4000} y={690} width={9700} height={20} fill="#dfe9f7" opacity={0.8} />
    {/* house above */}
    <rect x={200} y={400} width={420} height={300} fill="#2a2018" /><path d="M170 400 L410 270 L650 400 Z" fill="#dfe9f7" /><rect x={260} y={500} width={90} height={100} fill="#05080f" stroke="#4a3a2a" strokeWidth={5} /><rect x={470} y={500} width={90} height={100} fill="#05080f" stroke="#4a3a2a" strokeWidth={5} />
    {win > 0 && <g opacity={win}><rect x={374} y={140} width={72} height={90} fill="#ffd25a" stroke="#4a3a2a" strokeWidth={5} /><Glow x={410} y={185} r={300} c="#ffd25a" o={0.8} id="hcw" /></g>}
    {/* tunnel */}
    <path d="M410 700 L410 900 L1600 900 L1600 1020" stroke="#05080a" strokeWidth={90} fill="none" strokeLinejoin="round" />
    <path d="M410 700 L410 900 L1600 900 L1600 1020" stroke="#2a323a" strokeWidth={6} fill="none" strokeLinejoin="round" strokeDasharray="30 20" />
    {/* station */}
    <rect x={1400} y={1020} width={600} height={400} fill="#0a1a10" stroke="#3bff7a" strokeWidth={6} /><Glow x={1700} y={1220} r={500} c="#3bff7a" o={0.3} id="hcs" />
    {Array.from({length: 6}).map((_, i) => <rect key={i} x={1430 + i * 92} y={1060} width={70} height={50} fill="#05110a" stroke="#3bff7a" strokeWidth={2} />)}
    <circle cx={lerp(410, 1600, clamp(prog))} cy={prog < 0.15 ? lerp(700, 900, prog / 0.15) : prog > 0.9 ? lerp(900, 1020, (prog - 0.9) / 0.1) : 900} r={16} fill="#ffd25a" />
    <Tx x={410} y={640} size={34} fill="#9fb4d0">дом</Tx><Tx x={1700} y={1480} size={34} fill="#3bff7a">станция</Tx>
    <Snow t={t} n={50} speed={100} wind={80} op={0.6} w={1900} h={800} size={1.3} x0={-300} y0={-100} />
  </g>
);
export const Diagram: React.FC<{t: number; lock?: number}> = ({t, lock = 0}) => (
  <g>
    <rect x={-4000} y={-1500} width={9700} height={3400} fill="#04100a" />
    <g transform="translate(960 540)">
      <rect x={-760} y={-420} width={1520} height={840} fill="#05150c" stroke="#3bff7a" strokeWidth={6} />
      {Array.from({length: 12}).map((_, i) => <line key={`a${i}`} x1={-760} y1={-420 + i * 70} x2={760} y2={-420 + i * 70} stroke="#3bff7a" strokeWidth={1} opacity={0.2} />)}
      <path d={`M-740 0 ${Array.from({length: 90}).map((_, i) => `L${-740 + i * 16.5} ${Math.sin(i * 0.5 + t * 3) * 160 * Math.sin(i * 0.09) * (1 - lock * 0.9) + Math.sin(i * 1.7) * 30}`).join(' ')}`} stroke="#3bff7a" strokeWidth={5} fill="none" />
      {[0, 1, 2].map((i) => <circle key={i} cx={-300 + i * 300} cy={-300} r={40 + 20 * Math.sin(t * 2 + i)} fill="none" stroke="#7fffa8" strokeWidth={3} opacity={0.7} />)}
      <Tx x={-740} y={-440} anchor="start" size={26} fill="#3bff7a">N 63.4 · E 87.1 · ???</Tx>
    </g>
    <Glow x={960} y={540} r={900} c="#3bff7a" o={0.2} id="dgg" />
  </g>
);
export const ArchiveMon: React.FC<{t: number; flash: number; end: number}> = ({t, flash, end}) => (
  <g>
    <rect x={-4000} y={-1500} width={9700} height={3400} fill="#0a0c0a" />
    <g transform="translate(960 540)">
      <rect x={-720} y={-410} width={1440} height={820} rx={20} fill="#1a1c1a" stroke="#3a3c38" strokeWidth={10} />
      <rect x={-680} y={-370} width={1360} height={740} fill="#4a4a42" />
      <rect x={-680} y={-370} width={1360} height={740} fill="#2a2a20" opacity={0.4} />
      <rect x={-680} y={80} width={1360} height={290} fill="#2a2a24" />
      {[-300, 0, 300].map((x, i) => <g key={i} transform={`translate(${x} 300)`}><rect x={-60} y={-250} width={120} height={250} rx={36} fill="#14140f" /><circle cx={0} cy={-300} r={46} fill="#14140f" /></g>)}
      <g transform="translate(0 -80)">{[0, 1, 2, 3, 4, 5].map((i) => <rect key={i} x={-540 + i * 180} y={-240} width={130} height={90} fill="#0e100c" stroke="#3a3c34" strokeWidth={3} />)}</g>
      {flash > 0 && <rect x={-680} y={-370} width={1360} height={740} fill="#ff2a2a" opacity={0.25 * flash * (0.5 + 0.5 * Math.sin(t * 14))} />}
      {Array.from({length: 24}).map((_, i) => <rect key={i} x={-680} y={-370 + rnd(i + Math.floor(t * 14)) * 740} width={1360} height={2 + rnd(i) * 3} fill="#fff" opacity={0.14} />)}
      {end > 0 && <rect x={-680} y={-370} width={1360} height={740} fill="#000" opacity={end} />}
      <Tx x={-660} y={-380 + 60} anchor="start" size={30} fill="#d9d9c8" o={0.8}>REC · 1997</Tx>
    </g>
  </g>
);
export const PhoneMsg: React.FC<{t: number; mode: 'bar1' | 'alert' | 'photo' | 'msg1' | 'msg2' | 'vib' | 'nosig'; k?: number}> = ({t, mode, k = 1}) => {
  const vib = mode === 'vib' ? Math.sin(t * 60) * 5 : 0;
  return (
    <g>
      <rect x={-4000} y={-1500} width={9700} height={3400} fill="#0a0e18" />
      <Glow x={960} y={540} r={800} c="#5a7aa8" o={0.2} id="pmg" />
      <g transform={`translate(${960 + vib} 540) scale(1.45)`}>
        <rect x={-190} y={-380} width={380} height={760} rx={52} fill="#0a0c12" stroke="#2a2f3a" strokeWidth={8} />
        <clipPath id="pmc"><rect x={-172} y={-356} width={344} height={712} rx={38} /></clipPath>
        <g clipPath="url(#pmc)">
          <rect x={-172} y={-356} width={344} height={712} fill="#0e1424" />
          {[0, 1, 2, 3].map((i) => <rect key={i} x={110 + i * 12} y={-332 + (3 - i) * -4 + 8} width={8} height={8 + i * 5} fill={mode === 'bar1' ? (i < 1 ? '#fff' : '#3a4560') : mode === 'nosig' ? '#3a4560' : (i < 1 ? '#fff' : '#3a4560')} />)}
          <Tx x={-150} y={-322} anchor="start" size={20} fill="#9fb4d0">09:41</Tx>
          {mode === 'alert' && <g><rect x={-150} y={-120} width={300} height={220} rx={18} fill="#14181e" stroke="#ffb02a" strokeWidth={4} /><Tx x={0} y={-76} size={24} fill="#ffb02a">!</Tx><Tx x={0} y={-36} size={20} fill="#fff">Температурная аномалия</Tx><Tx x={0} y={-8} size={20} fill="#fff">ослабевает.</Tx><Tx x={0} y={28} size={18} fill="#cfe0ff">Ожидается восстановление</Tx><Tx x={0} y={52} size={18} fill="#cfe0ff">электроснабжения.</Tx></g>}
          {mode === 'photo' && <g><rect x={-172} y={-300} width={344} height={420} fill="#05110a" />{[0, 1, 2, 3, 4, 5].map((i) => <rect key={i} x={-160 + (i % 3) * 110} y={-290 + Math.floor(i / 3) * 80} width={96} height={64} fill="#0a2a14" stroke="#3bff7a" strokeWidth={1.5} />)}<g transform="translate(-30 100)"><rect x={-26} y={-120} width={52} height={120} rx={20} fill="#14161c" /><circle cx={0} cy={-142} r={22} fill="#241e22" /></g><g transform="translate(70 92) scale(0.88)" opacity={k}><rect x={-26} y={-120} width={52} height={120} rx={20} fill="#2a2a30" /><circle cx={0} cy={-142} r={22} fill="#7a6a5a" /><path d="M-24 -150 Q0 -176 24 -150 L24 -140 L-24 -140 Z" fill="#14120e" /></g></g>}
          {mode === 'msg1' && <g><rect x={-150} y={-160} width={300} height={140} rx={18} fill="#1c2638" /><Tx x={0} y={-100} size={22} fill="#fff">Вы остановили</Tx><Tx x={0} y={-66} size={22} fill="#fff">только первую станцию</Tx><Tx x={-130} y={-190} anchor="start" size={16} fill="#7a8aa8">Неизвестный номер</Tx></g>}
          {mode === 'msg2' && <g><rect x={-150} y={-260} width={300} height={110} rx={18} fill="#1c2638" /><Tx x={0} y={-212} size={20} fill="#fff">Вы остановили</Tx><Tx x={0} y={-184} size={20} fill="#fff">только первую станцию</Tx><rect x={-150} y={-110} width={300} height={140} rx={18} fill="#2a1c26" opacity={k} /><Tx x={0} y={-50} size={30} fill="#ff9a8a" o={k}>Их осталось</Tx><Tx x={0} y={-8} size={30} fill="#ff9a8a" o={k}>ещё шесть</Tx></g>}
          {mode === 'nosig' && <Tx x={0} y={0} size={30} fill="#ff6a5a">Нет сети</Tx>}
        </g>
      </g>
    </g>
  );
};
export const DistantRed: React.FC<{t: number; k: number}> = ({t, k}) => (
  <g>
    <rect x={-4000} y={-1500} width={9700} height={3400} fill="#04070d" />
    {[0.2, 0.4, 0.7].map((q, li) => <g key={li}>{Array.from({length: 40}).map((_, i) => <g key={i} transform={`translate(${i * 120 - 1500} ${1100 + li * 60}) scale(${0.8 + li * 0.5 + rnd(i + li) * 0.4})`}><path d="M-60 0 L0 -300 L60 0 Z" fill={['#070d16', '#050a12', '#03060a'][li]} /></g>)}</g>)}
    <rect x={-4000} y={1260} width={9700} height={900} fill="#10161e" />
    <circle cx={960} cy={880} r={5 + 8 * k} fill="#ff3b3b" opacity={0.3 + 0.7 * (Math.sin(t * 3) > 0 ? 1 : 0.4)} />
    <Glow x={960} y={880} r={60 + 400 * k} c="#ff3b3b" o={0.6 * k} id="drg" />
    <Snow t={t} n={120} speed={90} wind={40} op={0.7} w={1900} h={1500} size={1.6} x0={-300} y0={-100} />
  </g>
);
