import React from 'react';
import {clamp, ease, lerp, rnd, mixc, Tx, Glow, Snow, E, P, Person, Look} from './M60Base';
import {Chars, CharSpec} from './M60Village';

export const VAL_IN: Look = {jacket: '#6a3a4a', jacket2: '#80505f', pants: '#4a3a48', glove: '#6a3a4a', boot: '#3a2e28', hat: 'kerchief', hatCol: '#b8a888', hair: '#c8c8d0', skin: '#d9a888', fat: 1.05, old: true, blanket: '#7a8aa8'};
export const VAL_OUT: Look = {...VAL_IN, blanket: undefined, jacket: '#2f4a5e', jacket2: '#3f5f78'};

// ---------------- night window view with old house (second-floor window optional) ----------------
export const NightView2: React.FC<{t: number; low?: number; top?: number; frost?: number; wipe?: number; phoneBlur?: number}> = ({t, low = 0, top = 0, frost = 0, wipe = 0}) => (
  <g>
    <rect x={100} y={430} width={320} height={420} fill="#070b14" />
    <path d="M100 760 Q260 730 420 770 L420 860 L100 860 Z" fill="#2a3a58" />
    {[0, 1, 2, 3, 4, 5].map((i) => <rect key={i} x={120 + i * 50} y={720 + (i % 2) * 8} width={10} height={70} fill="#10182a" />)}
    <path d="M300 740 L330 700 L366 740 Z" fill="#0c1220" /><rect x={304} y={740} width={58} height={34} fill="#0c1220" />
    <rect x={324} y={750} width={10} height={12} fill={mixc('#0c1220', '#ffd25a', low)} />
    {low > 0.02 && <Glow x={329} y={756} r={110} c="#ffd25a" o={0.7 * low} id="nv2a" />}
    {top > 0.02 && <g opacity={top}><rect x={326} y={696} width={9} height={12} fill="#ffd25a" /><Glow x={330} y={702} r={150} c="#ffd25a" o={0.85} id="nv2b" /></g>}
    <Snow t={t} n={34} speed={150} wind={110} op={0.8} w={320} h={420} size={1.2} x0={100} y0={430} />
    {frost > 0 && <g opacity={frost}><rect x={100} y={430} width={320} height={420} fill="#cfe0f2" opacity={0.55} />{Array.from({length: 26}).map((_, i) => <path key={i} d={`M${100 + rnd(i) * 320} ${430 + rnd(i + 3) * 420} l${(rnd(i + 5) - 0.5) * 60} ${(rnd(i + 7) - 0.5) * 60}`} stroke="#fff" strokeWidth={3} opacity={0.8} />)}</g>}
  </g>
);

// ---------------- Valentina's cold room ----------------
export const ValRoom: React.FC<{t: number; chars?: CharSpec[]; beam?: number; door?: number}> = ({t, chars, beam = 0.5, door = 0}) => (
  <g>
    <rect x={-4000} y={-300} width={9700} height={2400} fill="#171c28" />
    {Array.from({length: 24}).map((_, i) => <rect key={i} x={-200 + i * 90} y={-300} width={3} height={1800} fill="#000" opacity={0.25} />)}
    <rect x={-4000} y={1500} width={9700} height={700} fill="#1d1a1c" />
    {/* ice window */}
    <rect x={620} y={440} width={300} height={400} fill="#6a8aa8" stroke="#2a2018" strokeWidth={14} />
    <rect x={620} y={440} width={300} height={400} fill="#dfe9f7" opacity={0.78} />
    {Array.from({length: 40}).map((_, i) => <path key={i} d={`M${640 + rnd(i) * 260} ${460 + rnd(i + 3) * 360} l${(rnd(i + 5) - 0.5) * 70} ${(rnd(i + 7) - 0.5) * 70}`} stroke="#fff" strokeWidth={2.5} opacity={0.9} />)}
    <rect x={766} y={440} width={8} height={400} fill="#2a2018" />
    {/* radiator */}
    <g transform="translate(1100 1060)">{Array.from({length: 9}).map((_, i) => <rect key={i} x={i * 34} y={0} width={26} height={380} rx={10} fill="#cfd8e4" stroke="#8a93a3" strokeWidth={3} />)}<rect x={-10} y={380} width={320} height={14} fill="#8a93a3" /><Tx x={150} y={-20} size={32} fill="#7fb8ff">холодный</Tx></g>
    {/* sofa */}
    <g transform="translate(200 0)"><rect x={0} y={1230} width={500} height={270} rx={20} fill="#4a3a30" /><rect x={-20} y={1130} width={120} height={370} rx={20} fill="#5a463a" /><rect x={20} y={1090} width={460} height={140} rx={30} fill="#5a463a" /></g>
    {/* snow at entrance */}
    <path d="M1300 1500 Q1500 1450 1700 1500 Z" fill="#dfe9f7" /><path d="M1250 1500 Q1400 1470 1560 1500 Z" fill="#c4d2e6" />
    <rect x={1500} y={620} width={200} height={880} fill="#2a2018" /><g transform="translate(1500 620)"><path d={`M0 0 L${-120 * door + 10} ${30 * door} L${-120 * door + 10} ${880 - 30 * door} L0 880 Z`} fill="#4a3a28" stroke="#1a1410" strokeWidth={5} /></g>
    {beam > 0 && <g opacity={beam}><polygon points="1700,700 400,1100 400,1500 1700,1000" fill="#fff6c8" opacity={0.18} /><Glow x={500} y={1250} r={500} c="#fff6c8" o={0.35} id="vrb" /></g>}
    <Chars list={chars} />
    <Snow t={t} n={14} speed={40} wind={10} op={0.5} w={1700} h={1500} size={1.0} />
  </g>
);

// ---------------- generator shed (interior) ----------------
export const ShedGen: React.FC<{t: number; run: number; lamp: number; chars?: CharSpec[]; pull?: number; smoke?: number}> = ({t, run, lamp, chars, pull = 0, smoke = 0}) => {
  const vib = run > 0 ? Math.sin(t * 90) * 1.6 * run : 0;
  return (
    <g>
      <rect x={-4000} y={-300} width={9700} height={2400} fill={mixc('#10141c', '#3a2e22', lamp * 0.7)} />
      {Array.from({length: 26}).map((_, i) => <rect key={i} x={-200 + i * 80} y={-300} width={4} height={1800} fill="#000" opacity={0.3} />)}
      <rect x={-4000} y={1500} width={9700} height={700} fill="#1c1814" />
      {/* shelf with tools */}
      <rect x={1180} y={640} width={420} height={16} fill="#4a3220" /><rect x={1180} y={900} width={420} height={16} fill="#4a3220" />
      {[0, 1, 2, 3].map((i) => <rect key={i} x={1210 + i * 90} y={560} width={14} height={80} fill="#8d94a3" />)}
      <rect x={1230} y={780} width={130} height={120} fill="#3a4048" stroke="#14171e" strokeWidth={4} /><rect x={1400} y={800} width={160} height={100} rx={8} fill="#c0392b" />
      {/* crate */}
      <rect x={1240} y={1380} width={240} height={120} fill="#5a3a24" stroke="#2a1a0e" strokeWidth={5} />
      {/* canisters */}
      {[0, 1].map((i) => <g key={i} transform={`translate(${1540 + i * 110} 1500)`}><rect x={-44} y={-170} width={88} height={170} rx={10} fill="#c0392b" stroke="#6a1a14" strokeWidth={5} /><rect x={-24} y={-200} width={36} height={34} rx={6} fill="#8a1f16" /><rect x={-30} y={-110} width={60} height={50} fill="#e8c9c3" opacity={0.5} /></g>)}
      {/* generator */}
      <g transform={`translate(${620 + vib} ${1500 + vib * 0.5})`}>
        <rect x={-30} y={-20} width={500} height={20} fill="#14171e" />
        <rect x={0} y={-330} width={440} height={310} rx={26} fill="#d9a82a" stroke="#6a4a0a" strokeWidth={8} />
        <rect x={20} y={-300} width={250} height={190} rx={14} fill="#2a2f3a" />
        {Array.from({length: 7}).map((_, k) => <rect key={k} x={32} y={-290 + k * 25} width={226} height={6} fill="#14171e" />)}
        <rect x={290} y={-320} width={130} height={90} rx={10} fill="#8a6a1a" /><rect x={300} y={-350} width={50} height={34} rx={8} fill="#222" />
        <circle cx={350} cy={-170} r={50} fill="#14171e" stroke="#8d94a3" strokeWidth={6} />
        <g transform={`translate(350 -170) rotate(${pull * 280})`}><rect x={-6} y={-40} width={12} height={40} fill="#d33a2c" /></g>
        <rect x={290} y={-110} width={110} height={60} rx={8} fill="#c9d6e8" /><circle cx={320} cy={-80} r={10} fill="#3bff7a" opacity={run > 0 ? 1 : 0.2} /><circle cx={360} cy={-80} r={10} fill="#ffb02a" opacity={run > 0 ? 0.6 : 0.2} />
        <path d={`M${440} -250 Q${520} ${-250 + pull * -30} ${560} ${-210}`} stroke="#222" strokeWidth={10} fill="none" />
        <rect x={430} y={-290} width={24} height={60} fill="#555c6a" />
        {smoke > 0 && Array.from({length: 8}).map((_, i) => { const tau = ((t * 0.7 + i * 0.13) % 1); return <circle key={i} cx={470 + tau * 90} cy={-300 - tau * 130} r={12 + tau * 24} fill="#8a8f9a" opacity={0.45 * smoke * (1 - tau)} />; })}
      </g>
      {/* lamp */}
      <g><line x1={900} y1={-300} x2={900} y2={440} stroke="#222" strokeWidth={4} /><circle cx={900} cy={470} r={30} fill={lamp > 0.1 ? '#fff2b0' : '#3a3a44'} />{lamp > 0.05 && <Glow x={900} y={470} r={800} c="#ffe9a0" o={0.55 * lamp} id="sgl" />}</g>
      <Chars list={chars} />
    </g>
  );
};
export const GenOutside: React.FC<{t: number; run: number}> = ({t, run}) => (
  <g>
    <rect x={-4000} y={-1200} width={9700} height={3400} fill="#0c1220" />
    <rect x={-4000} y={1300} width={9700} height={900} fill="#9fb0c8" opacity={0.9} />
    <rect x={500} y={780} width={760} height={520} fill="#2a2018" />
    <path d="M440 800 L880 640 L1320 800 Z" fill="#dfe9f7" />
    <g transform="translate(700 1300)"><rect x={0} y={-180} width={300} height={160} rx={18} fill="#d9a82a" stroke="#6a4a0a" strokeWidth={5} /><rect x={20} y={-160} width={160} height={110} rx={8} fill="#2a2f3a" /><circle cx={235} cy={-100} r={34} fill="#14171e" />{run > 0 && <circle cx={260} cy={-60} r={7} fill="#3bff7a" />}</g>
    {run > 0 && Array.from({length: 10}).map((_, i) => { const tau = ((t * 0.6 + i * 0.1) % 1); return <circle key={i} cx={1010 + tau * 220} cy={1180 - tau * 120} r={10 + tau * 28} fill="#aeb6c4" opacity={0.4 * (1 - tau)} />; })}
    {/* far house */}
    <rect x={-300} y={900} width={380} height={400} fill="#1a1612" /><path d="M-340 900 L-110 780 L120 900 Z" fill="#dfe9f7" /><rect x={-200} y={1020} width={90} height={90} fill="#ffb04a" />
    <Glow x={-155} y={1065} r={260} c="#ffb04a" o={0.5} id="gof" />
    {run > 0 && <Glow x={850} y={1150} r={600} c="#ffd27a" o={0.25} id="gog" />}
    <Snow t={t} n={120} speed={240} wind={260} op={0.8} w={1900} h={1500} size={1.8} x0={-400} y0={-200} />
  </g>
);
export const Canisters: React.FC<{t: number; level: number}> = ({t, level}) => (
  <g>
    <rect x={-4000} y={-300} width={9700} height={2400} fill="#171310" />
    {[0, 1].map((i) => (
      <g key={i} transform={`translate(${380 + i * 340} 1000)`}>
        <rect x={-120} y={-420} width={240} height={440} rx={26} fill="#c0392b" stroke="#6a1a14" strokeWidth={10} />
        <rect x={-60} y={-500} width={90} height={84} rx={14} fill="#8a1f16" />
        <rect x={-70} y={-340} width={140} height={300} rx={10} fill="#e8c9c3" opacity={0.35} />
        <rect x={-70} y={-340 + 300 * (1 - (i ? level * 0.55 : level))} width={140} height={300 * (i ? level * 0.55 : level)} rx={6} fill="#e8d36a" opacity={0.85} />
        {[0, 1, 2, 3, 4].map((k) => <rect key={k} x={50} y={-340 + k * 60} width={30} height={4} fill="#6a1a14" />)}
      </g>
    ))}
    <Glow x={600} y={800} r={700} c="#ffd27a" o={0.18} id="cang" />
  </g>
);
export const Voltmeter: React.FC<{t: number; on: number}> = ({t, on}) => (
  <g>
    <rect x={-4000} y={-300} width={9700} height={2400} fill="#1a1612" />
    <g transform="translate(540 700)">
      <rect x={-230} y={-340} width={460} height={680} rx={46} fill="#e0b72a" stroke="#6a4a0a" strokeWidth={10} />
      <rect x={-180} y={-290} width={360} height={170} rx={14} fill="#a8c8a0" /><Tx x={150} y={-170} anchor="end" size={110} fill="#14301a" o={on}>{on > 0.5 ? '230' : '---'}</Tx><Tx x={-160} y={-146} anchor="start" size={30} fill="#14301a">В ~</Tx>
      <circle cx={0} cy={80} r={120} fill="#14171e" stroke="#8d94a3" strokeWidth={8} />
      {Array.from({length: 12}).map((_, i) => <rect key={i} x={-4} y={-110} width={8} height={26} fill="#fff" transform={`translate(0 80) rotate(${i * 30})`} />)}
      <rect x={-8} y={-30} width={16} height={110} rx={8} fill="#d33a2c" transform={`translate(0 80) rotate(${40})`} />
      <circle cx={-120} cy={290} r={26} fill="#14171e" /><circle cx={0} cy={290} r={26} fill="#14171e" /><circle cx={120} cy={290} r={26} fill="#14171e" />
    </g>
  </g>
);
export const PhotoArt: React.FC<{t: number; hl?: number; flip?: number}> = ({t, hl = -1, flip = 0}) => (
  <g>
    <rect x={-4000} y={-300} width={9700} height={2400} fill="#2a2018" />
    {Array.from({length: 16}).map((_, i) => <rect key={i} x={-200 + i * 120} y={-300} width={4} height={2400} fill="#000" opacity={0.25} />)}
    <g transform={`translate(540 560) rotate(${-3 + flip * 4}) scale(${Math.abs(Math.cos(flip * Math.PI))} 1)`}>
      <rect x={-380} y={-290} width={760} height={560} fill="#d9c79a" stroke="#6a5a3a" strokeWidth={8} />
      <rect x={-340} y={-250} width={680} height={440} fill="#a89868" />
      <rect x={-340} y={-250} width={680} height={440} fill="#5a4a2a" opacity={0.25} />
      {/* tower */}
      <g transform="translate(240 -80)"><path d="M-30 150 L0 -170 L30 150 Z" fill="none" stroke="#3a2e1a" strokeWidth={6} />{[-110, -50, 10, 70].map((y, i) => <path key={i} d={`M${-10 - i * -3} ${y} L${10 + i * -3} ${y + 30} M${10 + i * -3} ${y} L${-10 - i * -3} ${y + 30}`} stroke="#3a2e1a" strokeWidth={4} />)}</g>
      {[{x: -180, c: '#4a3a24', h: 1.0, cap: 'fur'}, {x: -20, c: '#3a3a30', h: 1.05, cap: 'hair'}, {x: 120, c: '#2a2a2a', h: 1.1, cap: 'cap'}].map((p, i) => (
        <g key={i} transform={`translate(${p.x} 130)`}>
          <rect x={-46} y={-170} width={92} height={170} rx={30} fill={p.c} />
          <circle cx={0} cy={-210} r={36} fill="#3a2e1c" />
          {p.cap === 'fur' && <path d="M-40 -222 Q0 -270 40 -222 L40 -208 L-40 -208 Z" fill="#2a1e10" />}
          {p.cap === 'cap' && <path d="M-38 -222 Q0 -262 38 -222 L58 -212 L-38 -212 Z" fill="#14120e" />}
        </g>
      ))}
      {hl >= 0 && <ellipse cx={[-180, -20, 120][hl]} cy={-70} rx={90} ry={140} fill="none" stroke="#ff4a3a" strokeWidth={8} opacity={0.5 + 0.5 * Math.sin(t * 8)} />}
      <rect x={-340} y={-250} width={680} height={440} fill="#000" opacity={0.0} />
    </g>
  </g>
);
export const ForestRoad: React.FC<{t: number; car?: boolean; tower?: boolean; tracks?: boolean; muted?: number}> = ({t, car, tower, tracks, muted = 0}) => {
  const sat = (c: string) => mixc(c, '#8a8f98', muted);
  return (
    <g>
      <rect x={-4000} y={-1500} width={9700} height={3400} fill={sat('#0b121e')} />
      {[0.1, 0.25, 0.45].map((k, li) => (
        <g key={li}>{Array.from({length: 40}).map((_, i) => <g key={i} transform={`translate(${i * 120 - 1400 + li * 40} ${1000 + li * 60}) scale(${1 + li * 0.6 + rnd(i + li) * 0.5})`}><path d="M-60 0 L0 -300 L60 0 Z" fill={sat(['#0a1420', '#08101a', '#050a12'][li])} /><path d="M-36 -110 L0 -300 L36 -110 Z" fill="#c9d6e8" opacity={0.12 + li * 0.05} /></g>)}</g>
      ))}
      <path d="M-4000 1300 L5700 1300 L5700 2000 L-4000 2000 Z" fill={sat('#9fb0c8')} />
      <path d="M300 1900 Q700 1500 900 1300 L1000 1300 Q1100 1500 1500 1900 Z" fill={sat('#8696b0')} />
      {tracks && [0, 1].map((i) => <path key={i} d={`M${700 + i * 60} 1900 Q${760 + i * 40} 1500 ${900 + i * 8} 1310`} stroke="#4a5a74" strokeWidth={10} fill="none" />)}
      {tower && <g transform="translate(1400 1300)"><path d="M-70 0 L0 -900 L70 0" fill="none" stroke={sat('#1a2234')} strokeWidth={10} />{Array.from({length: 9}).map((_, i) => <path key={i} d={`M${-62 + i * 7} ${-i * 100} L${62 - i * 7} ${-i * 100 - 100} M${62 - i * 7} ${-i * 100} L${-62 + i * 7} ${-i * 100 - 100}`} stroke={sat('#1a2234')} strokeWidth={5} />)}<circle cx={0} cy={-910} r={10} fill="#ff3b3b" opacity={0.4 + 0.5 * (Math.sin(t * 3) > 0.7 ? 1 : 0)} /></g>}
      {car && <g transform="translate(980 1560)"><ellipse cx={0} cy={4} rx={150} ry={12} fill="#000" opacity={0.3} /><path d="M-130 -30 L-130 -70 Q-128 -88 -108 -90 L-66 -94 L-32 -130 L52 -130 L86 -94 L116 -90 Q130 -86 130 -66 L130 -30 Z" fill={sat('#3a3a42')} /><path d="M-52 -94 L-28 -122 L-4 -122 L-4 -94 Z" fill="#0c1220" /><g transform="translate(-6 -94) rotate(-34)"><rect x={0} y={0} width={14} height={62} fill={sat('#3a3a42')} /></g><path d="M-120 -70 Q-30 -100 120 -84 Q40 -100 -120 -70 Z" fill="#e8f0fb" opacity={0.8} /><circle cx={-86} cy={-24} r={26} fill="#0c0f16" /><circle cx={86} cy={-24} r={26} fill="#0c0f16" /></g>}
      <Snow t={t} n={80} speed={120} wind={90} op={0.7} w={1900} h={1500} size={1.5} x0={-400} y0={0} />
    </g>
  );
};
export const StreetCar: React.FC<{t: number; p: number; stopped?: boolean; people?: number; flash?: number}> = ({t, p, stopped, people = 0, flash = 0}) => {
  const x = lerp(-500, 780, ease(clamp(p)));
  return (
    <g>
      <rect x={-4000} y={-1200} width={9700} height={3200} fill="#080c16" />
      {[-900, -300, 1500, 2100].map((hx, i) => <g key={i}><rect x={hx} y={900} width={360} height={420} fill="#14100c" /><path d={`M${hx - 30} 900 L${hx + 180} 780 L${hx + 390} 900 Z`} fill="#c4d2e6" /></g>)}
      <rect x={-4000} y={1300} width={9700} height={800} fill="#2a3348" />
      <rect x={-4000} y={1300} width={9700} height={10} fill="#8a9ab4" opacity={0.5} />
      <g transform={`translate(${x} 1560)`}>
        {!stopped && <polygon points="130,-40 900,-250 900,170" fill="#fff6c8" opacity={0.18 * (0.6 + 0.4 * Math.sin(t * 2))} />}
        <ellipse cx={0} cy={6} rx={170} ry={14} fill="#000" opacity={0.35} />
        <path d="M-150 -34 L-150 -80 Q-146 -100 -120 -102 L-74 -106 L-40 -146 L58 -146 L96 -106 L130 -100 Q150 -96 150 -76 L150 -34 Z" fill="#24262e" />
        <path d="M-58 -106 L-34 -138 L-6 -138 L-6 -106 Z M8 -106 L8 -138 L52 -138 L82 -106 Z" fill="#0c1018" />
        <circle cx={-96} cy={-26} r={30} fill="#0a0c12" /><circle cx={96} cy={-26} r={30} fill="#0a0c12" />
        <circle cx={140} cy={-60} r={12} fill="#fff6c8" /><Glow x={150} y={-60} r={240} c="#fff6c8" o={0.8} id="scar" />
        <path d="M-140 -80 Q-30 -110 140 -92 Q40 -112 -140 -80 Z" fill="#e8f0fb" opacity={0.7} />
      </g>
      {people > 0 && [0, 1].map((i) => <g key={i} transform={`translate(${x + 240 + i * 150} 1560)`} opacity={people}><rect x={-34} y={-190} width={68} height={170} rx={30} fill="#050709" /><circle cx={0} cy={-224} r={30} fill="#050709" /></g>)}
      {flash > 0 && <polygon points={`${x + 300},-100 ${x + 900},-200 ${x + 900},1500`} fill="#fff6c8" opacity={0.0} />}
      <Snow t={t} n={140} speed={260} wind={300} op={0.85} w={1900} h={1500} size={1.9} x0={-400} y0={0} />
    </g>
  );
};
export const NeighborHouse: React.FC<{t: number; open: number; warm?: number}> = ({t, open, warm = 0}) => (
  <g>
    <rect x={-4000} y={-1200} width={9700} height={3400} fill="#0a1020" />
    <rect x={-4000} y={1320} width={9700} height={800} fill="#9fb0c8" />
    <rect x={200} y={640} width={800} height={680} fill="#3a2a1e" />
    {Array.from({length: 30}).map((_, i) => <rect key={i} x={200} y={640 + i * 22} width={800} height={3} fill="#000" opacity={0.25} />)}
    <path d="M150 640 L600 420 L1050 640 Z" fill="#dfe9f7" />
    <rect x={320} y={800} width={220} height={260} fill="#070a10" stroke="#e8f0fb" strokeWidth={8} />
    {warm > 0 && <rect x={320} y={800} width={220} height={260} fill="#ffb04a" opacity={warm * 0.8} />}
    <rect x={660} y={800} width={220} height={260} fill="#070a10" stroke="#e8f0fb" strokeWidth={8} />
    <g transform="translate(660 800)"><path d={`M0 0 L${-150 * open + 10} ${-14 * open} L${-150 * open + 10} ${260 + 20 * open} L0 260 Z`} fill="#c4d2e6" opacity={0.85} stroke="#8a9ab4" strokeWidth={5} /></g>
    {open > 0.3 && <path d={`M${700 + Math.sin(t * 6) * 10} 820 Q${760} ${900 + Math.sin(t * 5) * 20} ${700} 1040 L${860} 1040 Q${820} 900 ${860} 820 Z`} fill="#a8723a" opacity={0.6} />}
    <path d="M200 1320 Q600 1260 1000 1320 Z" fill="#eef4fc" />
    {open > 0.3 && Array.from({length: 24}).map((_, i) => { const tau = ((t * 0.9 + rnd(i) * 2) % 1); return <circle key={i} cx={560 + tau * 340 + rnd(i + 2) * 40} cy={900 + rnd(i + 3) * 180 + tau * 40} r={4 + rnd(i) * 6} fill="#fff" opacity={0.85 * (1 - tau * 0.4)} />; })}
    <Snow t={t} n={120} speed={260} wind={280} op={0.8} w={1900} h={1500} size={1.7} x0={-400} y0={0} />
  </g>
);
export const FenceScene: React.FC<{t: number; hit: number}> = ({t, hit}) => (
  <g>
    <rect x={-4000} y={-1200} width={9700} height={3400} fill="#0a1020" />
    <rect x={-4000} y={1320} width={9700} height={800} fill="#9fb0c8" />
    <rect x={800} y={800} width={700} height={520} fill="#2a2018" /><path d="M760 800 L1150 640 L1540 800 Z" fill="#dfe9f7" />
    {[0, 1, 2, 3, 4, 5, 6].map((i) => <rect key={i} x={-200 + i * 70} y={1100} width={10} height={220} fill="#6a727e" />)}
    <rect x={-200} y={1140} width={420} height={8} fill="#6a727e" />
    {/* fallen panel */}
    <g transform={`translate(${lerp(300, 600, hit)} ${lerp(1100, 1290, hit)}) rotate(${lerp(0, 82, hit)})`}>{Array.from({length: 7}).map((_, i) => <rect key={i} x={i * 34} y={0} width={10} height={220} fill="#8a929e" />)}<rect x={0} y={40} width={230} height={8} fill="#8a929e" /></g>
    <Snow t={t} n={140} speed={280} wind={320} op={0.85} w={1900} h={1500} size={1.8} x0={-400} y0={0} />
  </g>
);
export const FlashWalk: React.FC<{t: number; mode: 'road' | 'car' | 'gate' | 'door' | 'window'; knock?: number}> = ({t, mode, knock = 0}) => (
  <g>
    <rect x={-4000} y={-1200} width={9700} height={3400} fill="#05080f" />
    <polygon points="200,780 1500,300 1500,1500" fill="#fff6c8" opacity={0.2} />
    <circle cx={200} cy={780} r={30} fill="#fff6c8" /><Glow x={260} y={780} r={420} c="#fff6c8" o={0.4} id="fwg" />
    {mode === 'car' && <g transform="translate(1000 1050)"><path d="M-240 0 L-240 -120 Q-230 -150 -190 -156 L-90 -170 L-40 -250 L130 -250 L190 -170 L236 -156 Q260 -146 260 -110 L260 0 Z" fill="#9ca8bc" /><path d="M-230 -118 Q-60 -190 250 -150 Q40 -230 -230 -118 Z" fill="#fff" opacity={0.9} /><circle cx={-150} cy={10} r={44} fill="#0c0f16" /><circle cx={160} cy={10} r={44} fill="#0c0f16" /></g>}
    {mode === 'gate' && <g transform="translate(1000 700)"><rect x={-10} y={-80} width={20} height={600} fill="#4a3a2a" /><rect x={300} y={-80} width={20} height={600} fill="#4a3a2a" /><rect x={10} y={60} width={290} height={14} fill="#6a5a46" /><rect x={10} y={260} width={290} height={14} fill="#6a5a46" /><circle cx={60} cy={200} r={14} fill="#8d94a3" /></g>}
    {mode === 'door' && <g transform="translate(1000 520)"><rect x={0} y={0} width={360} height={780} fill="#4a3a28" stroke="#1a1410" strokeWidth={8} /><circle cx={300} cy={400} r={20} fill="#d9d9d9" /><g transform={`translate(${60 + Math.sin(t * 22) * 14 * knock} 340)`}><rect x={-60} y={-30} width={120} height={60} rx={28} fill="#14161c" /></g></g>}
    {mode === 'window' && <g transform="translate(1000 640)"><rect x={0} y={0} width={380} height={300} fill="#05070c" stroke="#e8f0fb" strokeWidth={10} /><rect x={186} y={0} width={8} height={300} fill="#e8f0fb" /></g>}
    <Snow t={t} n={170} speed={280} wind={320} op={0.85} w={1900} h={1500} size={1.9} x0={-400} y0={0} />
  </g>
);
export const MugHands: React.FC<{t: number}> = ({t}) => (
  <g>
    <rect x={-4000} y={-300} width={9700} height={2400} fill="#2a1c12" />
    <Glow x={540} y={600} r={900} c="#ff9a3a" o={0.25} id="mgg" />
    <g transform="translate(540 700)">
      <rect x={-130} y={-120} width={260} height={280} rx={30} fill="#c9d6e8" stroke="#8a93a3" strokeWidth={8} />
      <path d="M130 -60 Q220 -40 220 40 Q220 110 130 100" fill="none" stroke="#c9d6e8" strokeWidth={30} />
      <rect x={-110} y={-100} width={220} height={26} fill="#6a3a1a" />
      {[0, 1].map((i) => <g key={i} transform={`translate(${i ? 110 : -110} 40)`}>{[0, 1, 2, 3].map((k) => <rect key={k} x={-30 + (i ? 0 : 0)} y={-110 + k * 52} width={i ? 120 : -120} height={40} rx={20} fill="#d6a07c" stroke="#8a5a3a" strokeWidth={3} />)}</g>)}
      {[0, 1, 2].map((i) => <path key={i} d={`M${-40 + i * 40} -140 q${-12 + (i % 2) * 24} -40 0 -80`} stroke="#fff" strokeWidth={6} fill="none" opacity={0.3 + 0.2 * Math.sin(t * 3 + i)} />)}
    </g>
  </g>
);
export const OldDoor: React.FC<{t: number; open: number; light: number; enter: number}> = ({t, open, light, enter}) => (
  <g>
    <rect x={-4000} y={-1200} width={9700} height={3400} fill="#080c16" />
    <rect x={-4000} y={1320} width={9700} height={800} fill="#9fb0c8" />
    <rect x={300} y={560} width={760} height={760} fill="#2a2018" />{Array.from({length: 28}).map((_, i) => <rect key={i} x={300 + i * 27} y={560} width={3} height={760} fill="#000" opacity={0.4} />)}
    <path d="M250 560 L680 340 L1110 560 Z" fill="#dfe9f7" />
    <rect x={560} y={780} width={240} height={540} fill={mixc('#1a140e', '#ffd25a', light)} />
    {light > 0.05 && <g opacity={light}><polygon points="560,1320 800,1320 1500,1900 -100,1900" fill="#ffd25a" opacity={0.22} /><Glow x={680} y={1000} r={760} c="#ffd25a" o={0.7} id="odg" /></g>}
    <g transform="translate(560 780)"><path d={`M0 0 L${-110 * open} ${-14 * open} L${-110 * open} ${540 + 18 * open} L0 540 Z`} fill="#3a2a1c" stroke="#14100c" strokeWidth={5} /></g>
    {enter > 0 && <g transform={`translate(${lerp(1200, 690, enter)} 1320)`} opacity={enter < 1 ? 1 : 0}><rect x={-40} y={-210} width={80} height={190} rx={32} fill="#030406" /><circle cx={0} cy={-250} r={34} fill="#030406" /><rect x={-120} y={-140} width={150} height={70} fill="#14100c" /></g>}
    <Snow t={t} n={110} speed={240} wind={260} op={0.8} w={1900} h={1500} size={1.6} x0={-400} y0={0} />
  </g>
);
