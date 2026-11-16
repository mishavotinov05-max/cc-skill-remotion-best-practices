import React from 'react';
import {clamp, ease, lerp, rnd, mixc, Tx, Glow, Person, Look, Pose, poseStand, poseWalk, poseSit, poseReach, E} from './M60Base';

export const Full: React.FC<{c: string; o?: number}> = ({c, o = 1}) => <rect x={-3000} y={-2000} width={14000} height={6000} fill={c} opacity={o} />;

// ===== characters =====
export const MAXIM: Look = {jacket: '#0e0f12', jacket2: '#1a1c22', arm: '#0e0f12', pants: '#1c2028', glove: '#d9a98a', boot: '#07080a', hair: '#1a1512', skin: '#d9a98a', hat: 'none'};
export const GENN: Look = {old: true, jacket: '#6a6e74', jacket2: '#80858c', arm: '#6a6e74', pants: '#2a2d34', glove: '#cfa285', boot: '#15171c', hair: '#c9c9cf', skin: '#cfa285', hat: 'none', fat: 1.1};
export const KID: Look = {jacket: '#14181c', jacket2: '#14181c', arm: '#14181c', pants: '#14181c', glove: '#14181c', boot: '#14181c', hair: '#14181c', skin: '#14181c', hat: 'none'};
export const Man: React.FC<{x: number; y: number; pose: Pose; look?: Look; flip?: boolean; s?: number; shadow?: boolean}> = ({x, y, pose, look = MAXIM, flip, s = 1.4, shadow = true}) => <Person x={x} y={y} look={look} pose={pose} flip={flip} s={s} shadow={shadow} />;

const WALL = '#0f1b24', WALL2 = '#16252e', FLOOR = '#0b1318', LAMP = '#d8e0a8';
const DK = (c: string, k: number) => mixc(c, '#02060a', k);

// ===== bike =====
export const Bike: React.FC<{x: number; y: number; s?: number; flip?: boolean; rot: number}> = ({x, y, s = 1, flip, rot}) => (
  <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
    <ellipse cx={0} cy={4} rx={110} ry={8} fill="#000" opacity={0.4} />
    {[-62, 62].map((cx) => <g key={cx} transform={`translate(${cx} -42) rotate(${rot})`}><circle r={42} fill="none" stroke="#1a1a1a" strokeWidth={9} />{[0, 1, 2, 3, 4, 5].map((k) => <line key={k} x1={0} y1={0} x2={0} y2={-40} stroke="#8a8a8a" strokeWidth={2} transform={`rotate(${k * 60})`} />)}</g>)}
    <path d="M-62 -42 L-20 -100 L36 -100 L62 -42 M-20 -100 L-8 -42 L-62 -42 M36 -100 L48 -128 M36 -128 L64 -128" stroke="#c0201a" strokeWidth={9} strokeLinecap="round" fill="none" />
    <rect x={-40} y={-112} width={34} height={10} rx={4} fill="#1a1a1a" />
  </g>
);

// ===== corridor (long wall elevation) =====
export const Corridor: React.FC<{t: number; lights?: number; dark?: number; bike?: number; bikeDir?: number; fp?: number; kid?: number; figX?: number; flick?: number}> = ({t, lights = 1, dark = 0, bike = -1, bikeDir = 1, fp = 0, kid = 0, figX = 0, flick = 0}) => {
  const fl = (i: number) => (flick ? (Math.sin(t * 23 + i * 3) > -0.2 ? 1 : 0.15) : 1) * lights;
  return (
    <g>
      <Full c={WALL} />
      <rect x={-1000} y={0} width={6400} height={120} fill={WALL2} />
      <rect x={-1000} y={700} width={6400} height={400} fill={FLOOR} />
      <rect x={-1000} y={690} width={6400} height={16} fill="#1e2a30" />
      {/* lockers */}
      {Array.from({length: 40}).map((_, i) => <g key={i} transform={`translate(${-200 + i * 105} 540)`}><rect width={86} height={156} fill={['#27414b', '#4a4326', '#472a2a', '#2c4a3a'][i % 4]} /><rect x={6} y={8} width={74} height={4} fill="#000" opacity={0.3} /><circle cx={70} cy={70} r={4} fill="#aab" opacity={0.5} /></g>)}
      {/* drawings */}
      {Array.from({length: 16}).map((_, i) => <g key={i} transform={`translate(${60 + i * 260} ${270 + (i % 3) * 30}) rotate(${(i % 5) - 2})`}><rect width={120} height={90} fill="#c9c4a8" opacity={0.78} /><circle cx={36} cy={40} r={14} fill="#a33" opacity={0.7} /><rect x={60} y={30} width={40} height={36} fill="#2a5a8a" opacity={0.7} /><path d="M10 80 L110 80" stroke="#444" strokeWidth={3} /></g>)}
      {/* doors */}
      {[[700, '3', 'ИГРОВАЯ'], [1700, '', 'СПАЛЬНЯ'], [2500, '', 'СТОЛОВАЯ'], [3600, '', 'ПОСТ']].map(([x, n, l]) => (
        <g key={String(x)} transform={`translate(${x} 700)`}>
          <rect x={-90} y={-420} width={180} height={420} fill="#2a2418" stroke="#0a0c0e" strokeWidth={6} />
          <rect x={-60} y={-370} width={120} height={150} fill="#101820" opacity={0.7} />
          <circle cx={66} cy={-190} r={8} fill="#a89868" />
          <rect x={-60} y={-460} width={120} height={36} fill="#c9c4a8" opacity={0.7} /><Tx x={0} y={-433} size={22} fill="#222">{l}{n ? ` ${n}` : ''}</Tx>
        </g>
      ))}
      {/* lamps + cones */}
      {Array.from({length: 8}).map((_, i) => (
        <g key={i} transform={`translate(${300 + i * 560} 0)`}>
          <rect x={-60} y={100} width={120} height={14} fill="#1a2228" />
          <rect x={-50} y={110} width={100} height={8} fill={LAMP} opacity={0.9 * fl(i)} />
          <polygon points="-50,118 50,118 230,700 -230,700" fill={LAMP} opacity={0.07 * fl(i)} />
        </g>
      ))}
      {/* wet footprints */}
      {fp > 0 && Array.from({length: 22}).map((_, i) => <g key={i} opacity={clamp(fp * 22 - i) * 0.85}><ellipse cx={780 + i * 80} cy={742 + (i % 2) * 18} rx={20} ry={7} fill="#5a7a8a" /><ellipse cx={780 + i * 80} cy={742 + (i % 2) * 18} rx={20} ry={7} fill="#fff" opacity={0.12} /></g>)}
      {bike > -1 && <Bike x={bike} y={738} s={1.2} flip={bikeDir < 0} rot={bike * 2.4} />}
      {kid > 0 && <g transform={`translate(${figX} 740)`} opacity={kid}><rect x={-22} y={-150} width={44} height={110} rx={20} fill="#06090c" /><circle cx={0} cy={-170} r={26} fill="#06090c" /><rect x={-20} y={-44} width={14} height={44} fill="#06090c" /><rect x={6} y={-44} width={14} height={44} fill="#06090c" /></g>}
      <rect x={-1000} y={-200} width={6400} height={1400} fill="#02060a" opacity={dark} />
    </g>
  );
};

// ===== door close =====
export const DoorClose: React.FC<{t: number; knock?: number; handle?: number; drag?: number; dark?: number}> = ({t, knock = 0, handle = 0, drag = 0, dark = 0}) => (
  <g>
    <Full c="#0a1118" />
    <g transform={`translate(960 540) translate(${Math.sin(knock * 60) * knock * 4} 0)`}>
      <rect x={-380} y={-540} width={760} height={1080} fill="#2a2418" stroke="#080a0c" strokeWidth={10} />
      <rect x={-300} y={-440} width={600} height={300} fill="#18222a" /><rect x={-300} y={-80} width={600} height={400} fill="#1e1c14" />
      {Array.from({length: 6}).map((_, i) => <rect key={i} x={-300} y={-80 + i * 60} width={600} height={3} fill="#000" opacity={0.25} />)}
      <g transform={`translate(240 60) rotate(${handle * 22})`}><rect x={-14} y={-14} width={28} height={28} rx={6} fill="#6a5a38" /><rect x={-70} y={-9} width={80} height={18} rx={9} fill="#b49a58" /></g>
      {drag > 0 && <g><rect x={-60} y={lerp(300, -300, drag)} width={8} height={130} fill="#000" opacity={0.55} /><rect x={-30} y={lerp(310, -290, drag)} width={8} height={130} fill="#000" opacity={0.55} /><rect x={0} y={lerp(300, -300, drag)} width={8} height={130} fill="#000" opacity={0.55} /></g>}
      <rect x={-380} y={460} width={760} height={80} fill="#02060a" opacity={0.6} />
    </g>
    <Glow x={960} y={900} r={700} c="#d8e0a8" o={0.1 * (1 - dark)} id="dc65" />
    <rect x={-100} y={-100} width={2200} height={1300} fill="#02060a" opacity={0.35 + dark * 0.5} />
  </g>
);

// ===== play room =====
export const PlayRoom: React.FC<{t: number; cube?: {x: number; y: number}; beam?: {x: number; y: number}; kid?: number; dark?: number}> = ({t, cube = {x: 960, y: 880}, beam, kid = 0, dark = 0.55}) => (
  <g>
    <Full c={DK('#1a2a30', 0.4)} />
    <rect x={-500} y={760} width={3000} height={500} fill={DK('#2a2218', 0.5)} />
    <rect x={-500} y={752} width={3000} height={12} fill="#10181c" />
    {/* window */}
    <g transform="translate(1500 340)"><rect x={-150} y={-150} width={300} height={300} fill="#0a1626" stroke="#1a2228" strokeWidth={10} /><circle cx={60} cy={-50} r={26} fill="#c8d0c0" opacity={0.55} /><line x1={0} y1={-150} x2={0} y2={150} stroke="#1a2228" strokeWidth={8} /></g>
    {/* shelves with toys */}
    {[0, 1].map((r) => <g key={r} transform={`translate(380 ${300 + r * 190})`}><rect width={620} height={14} fill="#3a2e1c" />{Array.from({length: 7}).map((_, i) => <rect key={i} x={20 + i * 84} y={-62 + (i % 3) * 8} width={56} height={62 - (i % 3) * 8} rx={6} fill={['#4a6a8a', '#8a6a3a', '#5a8a5a', '#8a4a4a', '#6a5a8a'][(i + r) % 5]} opacity={0.8} />)}</g>)}
    {/* tables */}
    {[0, 1, 2].map((i) => <g key={i} transform={`translate(${280 + i * 560} 760)`}><rect x={-120} y={-100} width={240} height={14} fill="#4a3a22" /><rect x={-106} y={-88} width={12} height={88} fill="#3a2c1a" /><rect x={94} y={-88} width={12} height={88} fill="#3a2c1a" />{[-70, 70].map((cx) => <g key={cx} transform={`translate(${cx} 0)`}><rect x={-32} y={-52} width={64} height={8} fill="#6a4a2a" /><rect x={-28} y={-44} width={6} height={44} fill="#5a3a1a" /><rect x={22} y={-44} width={6} height={44} fill="#5a3a1a" /></g>)}</g>)}
    {/* red cube */}
    <g transform={`translate(${cube.x} ${cube.y}) rotate(${(cube.x - 960) * 0.1})`}><rect x={-30} y={-30} width={60} height={60} fill="#b0201a" /><rect x={-30} y={-30} width={60} height={14} fill="#d8453a" /><rect x={-30} y={16} width={60} height={14} fill="#7a1410" /></g>
    {kid > 0 && <g transform="translate(1180 800)" opacity={kid}><rect x={-26} y={-170} width={52} height={130} rx={22} fill="#04070a" /><circle cx={0} cy={-196} r={30} fill="#04070a" /><rect x={-22} y={-44} width={16} height={44} fill="#04070a" /><rect x={6} y={-44} width={16} height={44} fill="#04070a" /></g>}
    {beam && <polygon points={`560,700 ${beam.x - 160},${beam.y - 110} ${beam.x + 160},${beam.y + 110} 560,800`} fill="#fff6c8" opacity={0.2} />}
    <rect x={-500} y={-300} width={3000} height={1700} fill="#02060a" opacity={dark} />
    {beam && <Glow x={beam.x} y={beam.y} r={320} c="#fff6c8" o={0.35} id="pb65" />}
  </g>
);

// ===== canteen =====
export const Canteen: React.FC<{t: number; chairs?: number; thirteenth?: number; scrape?: number; dark?: number}> = ({t, chairs = 12, thirteenth = 0, scrape = 0, dark = 0.5}) => (
  <g>
    <Full c={DK('#1a2a2a', 0.4)} />
    <rect x={-500} y={740} width={3600} height={500} fill={DK('#262014', 0.5)} />
    <rect x={-500} y={730} width={3600} height={14} fill="#10181c" />
    <g transform="translate(1900 300)"><rect x={-110} y={-100} width={220} height={220} fill="#0a1626" stroke="#1a2228" strokeWidth={8} /></g>
    {[0, 1].map((r) => <g key={r} transform={`translate(${200} ${r ? 880 : 700})`}><rect x={0} y={-78} width={1500} height={14} fill="#4a3a22" /><rect x={20} y={-66} width={14} height={66 + r * 30} fill="#3a2c1a" /><rect x={1466} y={-66} width={14} height={66 + r * 30} fill="#3a2c1a" /></g>)}
    {Array.from({length: Math.min(12, chairs)}).map((_, i) => {
      const row = i < 6 ? 0 : 1;
      const x = 280 + (i % 6) * 250 + row * 40, y = row ? 940 : 760;
      const sh = scrape ? Math.sin(t * 30 + i) * scrape * 5 : 0;
      return <g key={i} transform={`translate(${x + sh} ${y})`}><rect x={-30} y={-64} width={60} height={8} fill="#7a5a30" /><rect x={-28} y={-56} width={6} height={56} fill="#5a3a1a" /><rect x={22} y={-56} width={6} height={56} fill="#5a3a1a" /><rect x={-30} y={-120} width={8} height={60} fill="#6a4a28" /></g>;
    })}
    {thirteenth > 0 && <g transform="translate(1860 790)" opacity={clamp(thirteenth * 3)}><rect x={-34} y={-72} width={68} height={9} fill="#8a6a38" /><rect x={-30} y={-62} width={7} height={62} fill="#6a4a20" /><rect x={24} y={-62} width={7} height={62} fill="#6a4a20" /><rect x={-34} y={-150} width={10} height={80} fill="#7a5a30" /></g>}
    <rect x={-500} y={-300} width={3600} height={1700} fill="#02060a" opacity={dark} />
    <Glow x={960} y={110} r={600} c={LAMP} o={0.14} id="cn65" />
  </g>
);

// chair-back carving close-up
export const ChairBack: React.FC<{t: number; k: number}> = ({t, k}) => (
  <g>
    <Full c="#0a0d10" />
    <g transform="translate(960 560)"><rect x={-420} y={-300} width={840} height={560} rx={20} fill="#5a3e20" stroke="#2a1a0a" strokeWidth={10} />
      {Array.from({length: 14}).map((_, i) => <rect key={i} x={-420} y={-290 + i * 40} width={840} height={2} fill="#000" opacity={0.25} />)}
      <Tx x={0} y={36} size={150} fill="#1a0c04" o={0.85 * clamp(k * 2)}>МАКСИМ</Tx>
      {Array.from({length: 9}).map((_, i) => <line key={i} x1={-300 + i * 70} y1={-20 + (i % 2) * 6} x2={-290 + i * 70} y2={60} stroke="#e0c898" strokeWidth={3} opacity={0.35 * clamp(k * 2)} />)}
    </g>
    <Glow x={960} y={400} r={700} c="#d8e0a8" o={0.18} id="cb65" />
    <rect x={-100} y={-100} width={2200} height={1300} fill="#02060a" opacity={0.3} />
  </g>
);

// ===== bedroom =====
export const Bedroom: React.FC<{t: number; light?: number; lump?: number; sit?: number; turn?: number; sign?: number; dark?: number}> = ({t, light = 1, lump = 0, sit = 0, turn = 0, sign = 0, dark = 0.4}) => (
  <g>
    <Full c={DK('#14212a', 0.45)} />
    <rect x={-500} y={760} width={3600} height={500} fill={DK('#20201a', 0.5)} />
    <rect x={-500} y={752} width={3600} height={10} fill="#0e1418" />
    <g transform="translate(300 230)"><rect x={-110} y={-100} width={220} height={220} fill="#0a1626" stroke="#1a2228" strokeWidth={8} /></g>
    {Array.from({length: 12}).map((_, i) => {
      const row = i < 6 ? 0 : 1;
      const x = 340 + (i % 6) * 290 + row * 60, y = row ? 980 : 800;
      const mine = i === 4;
      return (
        <g key={i} transform={`translate(${x} ${y})`}>
          <rect x={-100} y={-70} width={200} height={50} rx={10} fill="#3a4a5a" /><rect x={-104} y={-110} width={14} height={110} fill="#2a3440" /><rect x={90} y={-90} width={14} height={90} fill="#2a3440" />
          <rect x={-96} y={-86} width={70} height={26} rx={12} fill="#c8c8c0" opacity={0.6} />
          {mine && lump > 0 && sit < 0.1 && <path d="M-80 -70 Q-20 -150 40 -100 Q90 -88 96 -70 Z" fill="#242c34" opacity={lump} />}
          {mine && sit > 0 && (
            <g transform={`translate(0 ${-sit * 30})`}>
              <rect x={-50} y={-210} width={90} height={150} rx={30} fill="#0a0b0e" />
              <g transform={`translate(-4 -236) rotate(${turn * -70})`}><circle r={34} fill="#14100e" />{turn > 0.5 && <ellipse cx={-10} cy={4} rx={16} ry={20} fill="#c9a28a" opacity={turn} />}</g>
              {sign > 0 && <g transform={`translate(${lerp(40, 100, clamp(sign))} -270) rotate(8)`} opacity={clamp(sign * 2)}><rect x={-80} y={-60} width={160} height={110} fill="#d8d4b8" /><Tx x={0} y={-30} size={22} fill="#222">НЕ ДОЖИ-</Tx><Tx x={0} y={-4} size={22} fill="#222">ДАЙСЯ</Tx><Tx x={0} y={22} size={22} fill="#a22">ШЕСТИ</Tx></g>}
            </g>
          )}
        </g>
      );
    })}
    {light > 0 && <g transform="translate(1900 640)"><rect x={-18} y={0} width={36} height={22} fill="#2a2418" /><circle cx={0} cy={-10} r={16} fill="#ffd86a" opacity={0.9 * light} /><Glow x={0} y={-10} r={520} c="#ffcc50" o={0.4 * light} id="ng65" /></g>}
    <rect x={-500} y={-300} width={3600} height={1700} fill="#02060a" opacity={dark} />
  </g>
);

// ===== exterior =====
export const KinderExt: React.FC<{t: number; swing?: number; gx?: number; gv?: number; dawn?: number; gate?: number}> = ({t, swing = 1, gx = 1500, gv = 0, dawn = 0, gate = 0}) => {
  const sky = mixc('#050a14', '#c88a58', dawn), sky2 = mixc('#0c1828', '#f2c890', dawn);
  return (
    <g>
      <defs><linearGradient id="ke65" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={sky} /><stop offset="1" stopColor={sky2} /></linearGradient></defs>
      <rect x={-1500} y={-1000} width={6000} height={2000} fill="url(#ke65)" />
      {dawn < 0.6 && <circle cx={1600} cy={170} r={44} fill="#d8dcc8" opacity={0.7 * (1 - dawn * 1.6)} />}
      {dawn > 0.2 && <circle cx={300} cy={700} r={90} fill="#ffd890" opacity={dawn * 0.9} />}
      <rect x={-1500} y={800} width={6000} height={400} fill={mixc('#0a120c', '#2a3a22', dawn)} />
      {/* building */}
      <g transform="translate(1000 810)">
        <rect x={-640} y={-420} width={1280} height={420} fill={mixc('#1a2228', '#4a4a48', dawn)} />
        <polygon points="-680,-420 680,-420 600,-500 -600,-500" fill={mixc('#121a20', '#3a3a38', dawn)} />
        <rect x={-640} y={-210} width={1280} height={6} fill="#0a1014" opacity={0.6} />
        {Array.from({length: 7}).map((_, i) => <rect key={i} x={-590 + i * 170} y={-380} width={90} height={110} fill={dawn > 0.3 ? '#2a3a4a' : '#05080c'} stroke="#2a343a" strokeWidth={6} />)}
        {Array.from({length: 7}).map((_, i) => i !== 3 && <rect key={i} x={-590 + i * 170} y={-170} width={90} height={110} fill={dawn > 0.3 ? '#2a3a4a' : '#05080c'} stroke="#2a343a" strokeWidth={6} />)}
        <rect x={-60} y={-130} width={120} height={130} fill="#0a0f14" stroke="#2a343a" strokeWidth={6} />
        <rect x={-34} y={-410} width={68} height={50} fill="#c9c4a8" opacity={0.5} /><Tx x={0} y={-373} size={28} fill="#222">№ 17</Tx>
      </g>
      {/* fence */}
      {Array.from({length: 46}).map((_, i) => <g key={i} transform={`translate(${-500 + i * 90} 880)`}><rect x={-6} y={-130} width={12} height={130} fill="#1a1e1c" /><polygon points="-8,-130 8,-130 0,-152" fill="#1a1e1c" /></g>)}
      <rect x={-500} y={820} width={4200} height={8} fill="#1a1e1c" /><rect x={-500} y={860} width={4200} height={8} fill="#1a1e1c" />
      {Array.from({length: 40}).map((_, i) => <path key={i} d={`M${-400 + i * 105} 900 q4 -30 10 -50 M${-390 + i * 105} 900 q-4 -24 -10 -44`} stroke={mixc('#1c2a1a', '#4a5a2a', dawn)} strokeWidth={4} fill="none" />)}
      {/* swings */}
      <g transform="translate(2300 900)"><rect x={-160} y={-300} width={14} height={300} fill="#3a2a22" transform="rotate(10 -160 -300)" /><rect x={146} y={-300} width={14} height={300} fill="#3a2a22" transform="rotate(-10 146 -300)" /><rect x={-160} y={-312} width={320} height={14} fill="#3a2a22" />
        {[-70, 70].map((cx, i) => <g key={cx} transform={`translate(${cx} -300) rotate(${Math.sin(t * 1.4 + i) * 8 * swing})`}><line x1={0} y1={0} x2={0} y2={200} stroke="#6a4a3a" strokeWidth={4} /><rect x={-34} y={196} width={68} height={10} fill="#5a3a2a" /></g>)}</g>
      {gv > 0 && <Man x={gx} y={930} pose={poseStand({mood: 'neutral'})} look={GENN} s={1.3} />}
      {gate > 0 && <g transform="translate(900 880)"><rect x={-200} y={-170} width={20} height={170} fill="#242a28" /><rect x={180} y={-170} width={20} height={170} fill="#242a28" /></g>}
      {dawn < 0.4 && <rect x={-1500} y={-1000} width={6000} height={2000} fill="#02060a" opacity={0.3} />}
    </g>
  );
};

// ===== post room =====
export const FeedMini: React.FC<{id: number; t: number; cube?: number; bike?: number; kid?: number; light?: number}> = ({id, t, cube = 0, bike = -1, kid = 0, light = 1}) => (
  <g>
    <rect width={300} height={180} fill="#0a1812" />
    {id === 1 && <g><rect x={30} y={110} width={240} height={14} fill="#2a4a3a" /><rect x={110} y={50} width={80} height={60} fill="#1a3a2a" />{[0, 1, 2].map((i) => <rect key={i} x={120 + i * 22} y={60} width={16} height={12} fill="#4a8a6a" />)}</g>}
    {id === 2 && <g><rect x={0} y={120} width={300} height={60} fill="#143024" opacity={light} />{[0, 1, 2].map((i) => <rect key={i} x={30 + i * 100} y={40} width={44} height={80} fill="#1e4030" opacity={light} />)}</g>}
    {id === 3 && <g><rect x={0} y={120} width={300} height={60} fill="#143024" opacity={light} />{bike > -1 && <g transform={`translate(${bike} 120)`}><circle cx={-10} cy={-8} r={9} fill="none" stroke="#8aff8a" strokeWidth={2} /><circle cx={14} cy={-8} r={9} fill="none" stroke="#8aff8a" strokeWidth={2} /></g>}</g>}
    {id === 4 && <g><rect x={0} y={110} width={300} height={70} fill="#143024" />{[0, 1, 2].map((i) => <rect key={i} x={30 + i * 90} y={90} width={60} height={8} fill="#2a5a40" />)}<rect x={cube} y={150} width={12} height={12} fill="#c8402a" /></g>}
    {id === 5 && <g><rect x={0} y={120} width={300} height={60} fill="#143024" />{Array.from({length: 12}).map((_, i) => <rect key={i} x={20 + (i % 6) * 44} y={100 + Math.floor(i / 6) * 34} width={12} height={20} fill="#2a5a40" />)}</g>}
    {id === 6 && <g><rect x={0} y={120} width={300} height={60} fill="#143024" />{Array.from({length: 6}).map((_, i) => <rect key={i} x={16 + i * 46} y={104} width={38} height={16} fill="#2a5a40" />)}{kid > 0 && <rect x={0} y={0} width={300} height={180} fill="#ffcc50" opacity={0.25} />}</g>}
    <rect width={300} height={180} fill="#4aff9a" opacity={0.07} />
    {Array.from({length: 18}).map((_, i) => <rect key={i} x={0} y={i * 10} width={300} height={2} fill="#000" opacity={0.25} />)}
    <text x={8} y={20} fontFamily="monospace" fontSize={14} fill="#8affb0" opacity={0.85}>{`CAM ${id}`}</text>
  </g>
);

export const PostRoom: React.FC<{t: number; clock?: string; feeds?: Partial<{cube: number; bike: number; kid: number; light: number; off: number}>; chars?: React.ReactNode; dark?: number; glitch?: number; phone?: boolean}> = ({t, clock = '22:00', feeds = {}, chars, dark = 0.35, glitch = 0, phone = true}) => (
  <g>
    <Full c={DK('#14222a', 0.35)} />
    <rect x={-500} y={820} width={3600} height={400} fill={DK('#1a1812', 0.4)} />
    {/* wall monitors */}
    {Array.from({length: 6}).map((_, i) => {
      const x = 330 + (i % 3) * 360, y = 120 + Math.floor(i / 3) * 230;
      return <g key={i} transform={`translate(${x} ${y})`}><rect x={-12} y={-12} width={324} height={204} rx={8} fill="#06080a" stroke="#222a2e" strokeWidth={4} />{feeds.off && i === 0 ? <rect width={300} height={180} fill="#030506" /> : <FeedMini id={i + 1} t={t} cube={feeds.cube ?? 60} bike={feeds.bike ?? -1} kid={feeds.kid ?? 0} light={feeds.light ?? 1} />}</g>;
    })}
    <Glow x={640} y={330} r={800} c="#4aff9a" o={0.1} id="pr65" />
    {/* desk */}
    <rect x={200} y={720} width={1500} height={26} fill="#3a2c1a" /><rect x={240} y={746} width={20} height={200} fill="#2a1e10" /><rect x={1640} y={746} width={20} height={200} fill="#2a1e10" />
    <g transform="translate(560 720)"><rect x={-110} y={-190} width={220} height={150} rx={8} fill="#06080a" stroke="#222a2e" strokeWidth={5} /><rect x={-98} y={-178} width={196} height={126} fill="#10261e" /><rect x={-14} y={-40} width={28} height={40} fill="#1a2024" /><rect x={-70} y={-12} width={140} height={12} rx={4} fill="#1a2024" /></g>
    {phone && <g transform="translate(1100 716)"><rect x={-40} y={-14} width={80} height={14} rx={5} fill="#0b0d12" /><rect x={-30} y={-12} width={60} height={9} rx={3} fill="#1a2a3a" /></g>}
    {/* wall clock */}
    <g transform="translate(1520 220)"><circle r={90} fill="#0a0e10" stroke="#2a3238" strokeWidth={8} /><rect x={-60} y={-18} width={120} height={36} fill="#05100a" /><Tx x={0} y={11} size={34} fill="#6aff9a">{clock}</Tx></g>
    {/* door right */}
    <g transform="translate(1800 790)"><rect x={-110} y={-520} width={220} height={520} fill="#2a2418" stroke="#080a0c" strokeWidth={6} /><circle cx={-70} cy={-250} r={9} fill="#b49a58" /></g>
    {chars}
    <rect x={-500} y={-300} width={3600} height={1700} fill="#02060a" opacity={dark} />
    {glitch > 0 && Array.from({length: 4}).map((_, i) => <rect key={i} x={-100} y={(t * 700 + i * 260) % 1100} width={2200} height={10 + i * 8} fill="#fff" opacity={0.08 * glitch} />)}
  </g>
);

// ===== docs / phone / items =====
export const Paper: React.FC<{kind: string; k?: number; t: number}> = ({kind, k = 0, t}) => {
  const rules = ['22:30 — проверь игровую №3. Игрушку на полу не поднимать.', '23:00+ — детский смех. Не покидай пост, пока не стихнет.', '00:00 — выключи свет во втором коридоре на 2 минуты.', '01:15 — столовая. 12 стульев. Тринадцатый — уходи.', 'После 02:00 — стук. Не открывай, пока не увидишь посетителя на камере.', '03:30 — ночник в спальне. Не заходи, не выключай.', '05:55 — оставайся на посту, даже если откроется главная дверь. Выход — после 06:00.'];
  return (
    <g>
      <Full c="#1a130c" />
      <rect x={-500} y={-300} width={3600} height={1700} fill="#2a1e12" opacity={0.6} />
      <g transform={`translate(960 540) rotate(${kind === 'rules' ? 0 : -3})`}>
        <rect x={-460} y={-480} width={920} height={960} fill="#d8d2b4" /><rect x={-460} y={-480} width={920} height={960} fill="#000" opacity={0.08} />
        {kind === 'invoice' && <g><Tx x={0} y={-360} size={54} fill="#222">СЧЁТ ЗА РЕМОНТ</Tx>{Array.from({length: 5}).map((_, i) => <rect key={i} x={-380} y={-280 + i * 54} width={620 + (i % 2) * 90} height={12} fill="#555" opacity={0.6} />)}<rect x={-380} y={20} width={760} height={4} fill="#333" /><Tx x={-130} y={170} size={64} fill="#222">ИТОГО:</Tx><Tx x={210} y={170} size={92} fill="#b0201a" o={clamp(k * 2)}>180 000 ₽</Tx><Tx x={0} y={330} size={40} fill="#444">СРОК: 5 ДНЕЙ</Tx></g>}
        {kind === 'contract' && <g><Tx x={0} y={-370} size={52} fill="#222">ДОГОВОР</Tx>{Array.from({length: 8}).map((_, i) => <rect key={i} x={-380} y={-290 + i * 44} width={700 + ((i * 53) % 70)} height={10} fill="#555" opacity={0.6} />)}<g opacity={clamp(k * 2)}><path d="M-330 330 q60 -90 100 -10 t90 -10 t100 10" stroke="#1a2a6a" strokeWidth={6} fill="none" /><Tx x={-120} y={400} size={26} fill="#444">подпись</Tx></g></g>}
        {kind === 'contract2' && <g><Tx x={0} y={-390} size={44} fill="#222">ДОГОВОР</Tx>{Array.from({length: 5}).map((_, i) => <rect key={i} x={-380} y={-320 + i * 44} width={700} height={10} fill="#555" opacity={0.5} />)}<rect x={-390} y={-90} width={780} height={110} fill="#b0201a" opacity={0.2 * clamp(k * 3)} /><Tx x={0} y={-30} size={34} fill="#222">Срок действия — до завершения наблюдения</Tx><path d="M-330 110 q60 -90 100 -10 t90 -10 t100 10" stroke="#1a2a6a" strokeWidth={6} fill="none" /><rect x={-390} y={200} width={780} height={150} fill="#b0201a" opacity={0.2 * clamp((k - 0.4) * 3)} /><Tx x={0} y={270} size={30} fill="#222" o={clamp((k - 0.4) * 3)}>Сотрудник обязан находиться на объекте</Tx><Tx x={0} y={314} size={30} fill="#222" o={clamp((k - 0.4) * 3)}>до прибытия замены</Tx></g>}
        {kind === 'rules' && <g><Tx x={0} y={-400} size={44} fill="#222">СЕМЬ ПРАВИЛ НОЧНОЙ СМЕНЫ</Tx>{rules.map((r, i) => <g key={i} opacity={clamp(k * 8 - i) * (Math.floor(k * 8) === i ? 1 : 0.55)}><Tx x={-420} y={-320 + i * 100} size={30} fill="#a22" anchor="start">{`${i + 1}.`}</Tx><foreignObject x={-380} y={-352 + i * 100} width={820} height={90}><div style={{fontFamily: 'Montserrat, sans-serif', fontWeight: 800, fontSize: 25, color: '#222', lineHeight: 1.15}}>{r}</div></foreignObject></g>)}</g>}
      </g>
      <rect x={-500} y={-300} width={3600} height={1700} fill="#02060a" opacity={0.25} />
    </g>
  );
};

export const Phone: React.FC<{t: number; mode: string; k?: number; inner?: React.ReactNode}> = ({t, mode, k = 1, inner}) => {
  const hdr = (c: string, txt: string) => <g><rect x={-250} y={-450} width={500} height={100} fill={c} /><Tx x={0} y={-386} size={32} fill="#fff">{txt}</Tx></g>;
  let body: React.ReactNode = null;
  if (mode === 'jobs') body = <g>{hdr('#2f4a6a', 'ВАКАНСИИ')}{[['Грузчик', '3 000 ₽ / смена'], ['Курьер', '2 500 ₽'], ['Работник склада', '2 000 ₽']].map(([a, b], i) => <g key={i} opacity={clamp(k * 5 - i)} transform={`translate(0 ${-290 + i * 130})`}><rect x={-230} y={0} width={460} height={110} rx={16} fill="#1a2430" /><Tx x={-210} y={48} size={30} fill="#fff" anchor="start">{a}</Tx><Tx x={-210} y={90} size={28} fill="#7ab8ff" anchor="start">{b}</Tx></g>)}</g>;
  if (mode === 'ad') body = <g>{hdr('#6a1a1a', 'НОВОЕ ОБЪЯВЛЕНИЕ')}<Tx x={0} y={-280} size={46} fill="#fff">Ночной охранник</Tx><Tx x={0} y={-150} size={92} fill="#ffd23a">60 000 ₽</Tx><Tx x={0} y={-80} size={34} fill="#fff">за одну ночь</Tx>{['22:00 — 06:00', 'Опыт не требуется', 'Выплата сразу после смены'].map((s, i) => <g key={i} opacity={clamp(k * 6 - 1 - i)}><rect x={-220} y={-10 + i * 96} width={440} height={76} rx={14} fill="#1a2430" /><Tx x={0} y={40 + i * 96} size={30} fill="#cfe">{s}</Tx></g>)}</g>;
  if (mode === 'call') body = <g>{hdr('#2f4a6a', 'ИСХОДЯЩИЙ')}<circle cx={0} cy={-120} r={90} fill="#1a2c40" /><Tx x={0} y={-100} size={70} fill="#fff">Г</Tx><Tx x={0} y={60} size={42} fill="#fff">Геннадий Павлович</Tx><Tx x={0} y={116} size={30} fill="#9fb4d0">{k > 0.2 ? 'вызов… 00:0' + Math.min(9, Math.floor(k * 9)) : 'вызов…'}</Tx><circle cx={0} cy={300} r={46} fill="#c0392b" /></g>;
  if (mode === 'nonet') body = <g>{hdr('#555', 'ВЫЗОВ')}<Tx x={0} y={-130} size={46} fill="#fff">Геннадий Павлович</Tx><g transform="translate(0 40)">{[0, 1, 2, 3].map((i) => <rect key={i} x={-70 + i * 36} y={-10 - i * 16} width={22} height={20 + i * 16} fill="#444" />)}<path d="M-100 -80 L100 60" stroke="#ff4a4a" strokeWidth={10} /></g><Tx x={0} y={220} size={50} fill="#ff6a6a">НЕТ СЕТИ</Tx></g>;
  if (mode === 'bank') body = <g>{hdr('#1f6a4a', 'БАНК')}<circle cx={0} cy={-160} r={70} fill="#1f5a3a" /><path d="M-30 -160 L-8 -134 L36 -190" stroke="#7affb0" strokeWidth={14} fill="none" strokeLinecap="round" /><Tx x={0} y={-30} size={44} fill="#fff">Поступление</Tx><Tx x={0} y={90} size={86} fill="#7affb0">+60 000 ₽</Tx></g>;
  if (mode === 'notif') body = <g>{hdr('#222', 'УВЕДОМЛЕНИЕ')}<g transform="translate(0 -200)"><rect x={-230} y={0} width={460} height={190} rx={22} fill="#1a1a22" stroke="#aa3030" strokeWidth={4} /><Tx x={0} y={70} size={30} fill="#9fb4d0">Неизвестное приложение</Tx><Tx x={0} y={130} size={36} fill="#fff">Трансляция камеры № 1</Tx></g></g>;
  if (mode === 'sms') body = <g>{hdr('#222', 'НОВОЕ СООБЩЕНИЕ')}<Tx x={0} y={-310} size={28} fill="#9fb4d0">Неизвестный номер</Tx><g transform="translate(0 -250)"><rect x={-230} y={0} width={460} height={320} rx={22} fill="#1f2c3c" />{['«Спасибо, что отработал', 'смену, Максим.', 'Теперь он знает,', 'где ты живёшь.»'].map((s, i) => <Tx key={i} x={0} y={64 + i * 60} size={34} fill="#fff" o={clamp(k * 5 - i)}>{s}</Tx>)}</g></g>;
  return (
    <g>
      <Full c="#0a0d12" />
      <Glow x={960} y={540} r={900} c="#6fb8ff" o={0.08} id="ph66" />
      <g transform="translate(960 560) scale(0.95)">
        <rect x={-290} y={-490} width={580} height={980} rx={64} fill="#05070b" stroke="#2a3040" strokeWidth={10} />
        <rect x={-262} y={-462} width={524} height={924} rx={44} fill="#0d1420" />
        <clipPath id="ph66c"><rect x={-262} y={-462} width={524} height={924} rx={44} /></clipPath>
        <g clipPath="url(#ph66c)">{mode === 'cam' ? <g>{inner}</g> : body}</g>
      </g>
    </g>
  );
};

export const ClockBig: React.FC<{t: number; text: string; red?: number; sub?: string}> = ({t, text, red = 0, sub}) => (
  <g>
    <Full c="#04070a" />
    <Glow x={960} y={540} r={900} c={mixc('#4aff9a', '#ff3b3b', red)} o={0.12} id="cl65" />
    <g transform="translate(960 540)"><rect x={-520} y={-220} width={1040} height={440} rx={30} fill="#060c0a" stroke="#1a2a24" strokeWidth={10} /><Tx x={0} y={90} size={300} fill={mixc('#6aff9a', '#ff4a4a', red)}>{text}</Tx>{sub && <Tx x={0} y={-140} size={42} fill="#8ab8a0">{sub}</Tx>}</g>
    {Array.from({length: 20}).map((_, i) => <rect key={i} x={0} y={i * 56} width={1920} height={2} fill="#000" opacity={0.25} />)}
  </g>
);

export const FusePanel: React.FC<{t: number; sw: number; dark?: number}> = ({t, sw, dark = 0}) => (
  <g>
    <Full c="#0a1014" />
    <g transform="translate(960 540)"><rect x={-300} y={-420} width={600} height={840} rx={14} fill="#2a3238" stroke="#0a0e10" strokeWidth={10} />
      {Array.from({length: 6}).map((_, i) => <g key={i} transform={`translate(${-180 + (i % 3) * 180} ${-300 + Math.floor(i / 3) * 180})`}><rect x={-34} y={-44} width={68} height={88} rx={6} fill="#14181c" /><rect x={-14} y={sw && i === 2 ? 6 : -34} width={28} height={36} rx={4} fill={i === 2 ? '#c8a838' : '#6a7078'} /></g>)}
      <Tx x={0} y={100} size={34} fill="#c9c4a8">КОРИДОР 2 · СВЕТ</Tx>
      <g transform="translate(0 260)"><rect x={-80} y={-60} width={160} height={120} rx={14} fill="#10161a" /><g transform={`rotate(${sw ? 28 : -28})`}><rect x={-10} y={-90} width={20} height={90} rx={8} fill="#c0c4c8" /><circle cx={0} cy={-92} r={16} fill="#d8453a" /></g></g></g>
    <Glow x={960} y={700} r={700} c="#d8e0a8" o={0.12 * (1 - dark)} id="fp65" />
    <rect x={-100} y={-100} width={2200} height={1300} fill="#02060a" opacity={0.35 + dark * 0.5} />
  </g>
);

export const HomeRoom: React.FC<{t: number; light?: number; chars?: React.ReactNode; door?: number}> = ({t, light = 1, chars, door = 0}) => (
  <g>
    <Full c={DK('#1a2630', 0.35)} />
    <rect x={-500} y={780} width={3600} height={500} fill={DK('#22201a', 0.45)} />
    <g transform="translate(300 360)"><rect x={-130} y={-170} width={260} height={320} fill="#0a1624" stroke="#1a2228" strokeWidth={10} /><line x1={0} y1={-170} x2={0} y2={150} stroke="#1a2228" strokeWidth={8} /><circle cx={60} cy={-70} r={24} fill="#c8d0c0" opacity={0.4} /></g>
    <g transform="translate(900 840)"><rect x={-190} y={-110} width={380} height={110} rx={12} fill="#3a4a5a" /><rect x={-196} y={-170} width={16} height={170} fill="#2a3440" /><rect x={-170} y={-130} width={110} height={34} rx={14} fill="#c8c8c0" opacity={0.7} /><rect x={-60} y={-124} width={240} height={24} rx={12} fill="#2a4a6a" opacity={0.8} /></g>
    {/* front door */}
    <g transform="translate(1600 840)"><rect x={-130} y={-560} width={260} height={560} fill="#2a2418" stroke="#080a0c" strokeWidth={8} /><circle cx={90} cy={-260} r={11} fill="#b49a58" /><rect x={-60} y={-480} width={120} height={150} fill="#1a1c20" opacity={0.7} /></g>
    {chars}
    <Glow x={900} y={620} r={700} c="#ffcc70" o={0.12 * light} id="hr65" />
    <rect x={-500} y={-300} width={3600} height={1700} fill="#02060a" opacity={0.5 - light * 0.22 + door * 0.2} />
  </g>
);

export const CarWreck: React.FC<{t: number}> = ({t}) => (
  <g>
    <Full c={DK('#18222c', 0.2)} />
    <rect x={-500} y={820} width={3600} height={400} fill="#1a1e22" />
    <rect x={-500} y={900} width={3600} height={6} fill="#c8b858" opacity={0.5} />
    <g transform="translate(900 930)">
      <ellipse cx={0} cy={6} rx={360} ry={18} fill="#000" opacity={0.5} />
      <path d="M-330 -40 L-330 -150 Q-320 -190 -280 -200 L-110 -210 Q-60 -310 20 -310 L180 -310 Q260 -300 300 -210 L340 -190 Q360 -150 360 -40 Z" fill="#4a5a6a" />
      <path d="M-300 -150 Q-340 -160 -350 -100 L-280 -60 L-330 -40 L-330 -150 Z" fill="#2a343c" />
      <path d="M-90 -210 Q-50 -290 20 -290 L60 -290 L60 -210 Z" fill="#1a2a3a" opacity={0.8} /><path d="M80 -290 L170 -290 Q230 -280 262 -210 L80 -210 Z" fill="#1a2a3a" opacity={0.8} />
      <path d="M-200 -250 l60 70 l-30 20 l50 60" stroke="#aab4be" strokeWidth={4} fill="none" opacity={0.5} />
      <circle cx={-200} cy={-10} r={50} fill="#0e1012" /><circle cx={230} cy={-10} r={50} fill="#0e1012" />
      <circle cx={-338} cy={-90} r={16} fill="#ffa030" opacity={Math.sin(t * 6) > 0 ? 0.9 : 0.15} /><circle cx={352} cy={-92} r={16} fill="#ffa030" opacity={Math.sin(t * 6) > 0 ? 0.9 : 0.15} />
      <Glow x={-338} y={-90} r={160} c="#ffa030" o={Math.sin(t * 6) > 0 ? 0.35 : 0.05} id="cw65" />
    </g>
    {Array.from({length: 14}).map((_, i) => <rect key={i} x={((i * 331) % 1800) + 40} y={960 + (i % 3) * 20} width={10} height={4} fill="#aab" opacity={0.2} />)}
  </g>
);
