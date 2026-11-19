import React from 'react';
import {clamp, ease, lerp, rnd, mixc, Tx, Glow, Person, Look, Pose, poseStand, poseWalk, poseSit, poseReach, E} from './M60Base';
import {Radio} from './M60Items';

export const Full: React.FC<{c: string; o?: number}> = ({c, o = 1}) => <rect x={-3000} y={-2000} width={14000} height={6000} fill={c} opacity={o} />;

// ===== characters =====
export const VASYA: Look = {jacket: '#0d0e12', jacket2: '#1a1c22', arm: '#0d0e12', pants: '#2a2e36', glove: '#d9a98a', boot: '#08090c', hair: '#1a1512', skin: '#d9a98a', hat: 'none'};
export const VASYA_PK: Look = {...VASYA, pack: true};
export const ANDREY: Look = {old: true, jacket: '#1f4a34', jacket2: '#2b6045', arm: '#1f4a34', pants: '#24407a', glove: '#c9987a', boot: '#0a0b0e', hair: '#bcbcc4', skin: '#c9987a', hat: 'none', fat: 1.12};
export const NEIGH: Look = {jacket: '#5a3a4a', jacket2: '#6a4a5a', arm: '#5a3a4a', pants: '#2a2a32', glove: '#d9a98a', boot: '#15171c', hair: '#8a6a50', skin: '#d9a98a', hat: 'none'};
export const WOMAN: Look = {jacket: '#6a4a3a', jacket2: '#7a5a4a', arm: '#6a4a3a', pants: '#3a3040', glove: '#d9a98a', boot: '#15171c', hair: '#3a2a22', skin: '#d9a98a', hat: 'none'};
export const FIREMAN: Look = {jacket: '#c9a02a', jacket2: '#e0b83a', arm: '#c9a02a', pants: '#2a2a30', glove: '#2a2a30', boot: '#15171c', hair: '#2a2420', skin: '#d9a98a', hat: 'beanie', hatCol: '#c9a02a'};
export const WORKER: Look = {jacket: '#c9822a', jacket2: '#e0963a', arm: '#c9822a', pants: '#2a3040', glove: '#2a2f3a', boot: '#15171c', hair: '#3a2a22', skin: '#d9a98a', hat: 'beanie', hatCol: '#f2f2f2'};
export const Man: React.FC<{x: number; y: number; pose: Pose; look?: Look; flip?: boolean; s?: number}> = ({x, y, pose, look = VASYA, flip, s = 1.4}) => <Person x={x} y={y} look={look} pose={pose} flip={flip} s={s} />;

const DK = (c: string, k: number) => mixc(c, '#010308', k);

// ===== props =====
export const Jar: React.FC<{x: number; y: number; s?: number}> = ({x, y, s = 1}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse cx={0} cy={4} rx={44} ry={8} fill="#000" opacity={0.4} />
    <rect x={-38} y={-100} width={76} height={100} rx={8} fill="#7a7e84" />
    <rect x={-38} y={-76} width={76} height={50} fill="#b0301c" /><rect x={-38} y={-100} width={76} height={10} fill="#a0a4aa" /><rect x={-38} y={-10} width={76} height={10} fill="#6a6e74" />
    <Tx x={0} y={-44} size={16} fill="#f4ead0">ТУШЁНКА</Tx>
    <rect x={-8} y={-108} width={16} height={8} rx={3} fill="#c0c4ca" />
  </g>
);

// ===== night city =====
export type CityP = {L?: number; jam?: number; crowd?: number; trucks?: number; queue?: number; lit?: number; cx?: number; dead?: number};
export const CityNight: React.FC<{t: number; p: CityP}> = ({t, p}) => {
  const L = p.L ?? 1, cx = p.cx ?? 960, day = (p as any).day ?? 0;
  const sky = mixc(mixc('#0a1226', '#020409', 1 - L), '#3a4654', day), sky2 = mixc(mixc('#1c2c4a', '#04070e', 1 - L), '#6a7886', day);
  const par = (k: number) => `translate(${(cx - 960) * k} 0)`;
  const tower = (x: number, w: number, h: number, seed: number, col: string, y = 800) => {
    const cols = Math.floor(w / 34), rows = Math.floor(h / 44);
    return (
      <g key={seed}>
        <rect x={x} y={y - h} width={w} height={h} fill={col} />
        {Array.from({length: rows}).map((_, r) => Array.from({length: cols}).map((__, c) => {
          const on = rnd(seed * 17 + r * 7 + c * 3) < L * 0.75;
          return <rect key={`${r}-${c}`} x={x + 8 + c * ((w - 16) / cols)} y={y - h + 14 + r * 44} width={(w - 16) / cols - 8} height={24} fill={on ? '#ffd890' : '#05080e'} opacity={on ? 0.8 : 0.9} />;
        }))}
      </g>
    );
  };
  const carCols = ['#2a3140', '#402a2a', '#2a403a', '#3a3a44'];
  const dark = 1 - L;
  return (
    <g>
      <defs><linearGradient id="cn66" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={sky} /><stop offset="1" stopColor={sky2} /></linearGradient></defs>
      <rect x={-1500} y={-800} width={7200} height={2000} fill="url(#cn66)" />
      {dark > 0.4 && day < 0.3 && Array.from({length: 40}).map((_, i) => <circle key={i} cx={rnd(i) * 3800 - 400} cy={rnd(i + 3) * 500} r={1.2 + rnd(i + 8) * 1.6} fill="#c8d4f0" opacity={dark * 0.6 * (0.5 + 0.5 * Math.sin(t * 2 + i))} />)}
      {dark > 0.4 && day < 0.3 && <circle cx={1500 + (cx - 960) * 0.9} cy={150} r={36} fill="#c8d0e0" opacity={dark * 0.7} />}
      <g transform={par(0.25)}>{Array.from({length: 16}).map((_, i) => tower(-700 + i * 270, 150 + rnd(i) * 80, 260 + rnd(i + 5) * 340, i + 1, mixc(mixc('#18233a', '#05080f', dark), '#2a343e', day)))}</g>
      <g transform={par(0.55)}>{Array.from({length: 11}).map((_, i) => tower(-500 + i * 400, 240 + rnd(i + 9) * 100, 220 + rnd(i + 3) * 250, i + 31, mixc(mixc('#1e2a40', '#06090f', dark), '#323c48', day), 860))}</g>
      {p.lit !== undefined && p.lit > 0 && <g transform={par(0.55)}>{/* lit building */}<rect x={3900 - 3200 + 0} y={560} width={0} height={0} /></g>}
      <rect x={-1500} y={850} width={7200} height={400} fill={mixc(DK('#1a1e26', dark * 0.8), '#2e343c', day)} />
      <rect x={-1500} y={846} width={7200} height={10} fill="#2a3040" opacity={0.7} />
      <rect x={-1500} y={960} width={7200} height={6} fill="#c8b858" opacity={0.3 * L + 0.08} />
      {/* traffic lights */}
      {[700, 1900, 3100].map((x, i) => (
        <g key={x} transform={`translate(${x + (cx - 960) * 0.1} 850)`}>
          <rect x={-6} y={-240} width={12} height={240} fill="#1a1e24" /><rect x={-24} y={-330} width={48} height={110} rx={10} fill="#0a0c10" />
          <circle cx={0} cy={-306} r={11} fill={L > 0.5 ? (Math.floor(t / 4 + i) % 2 ? '#ff4a3a' : '#4a2420') : '#1c1e22'} />
          <circle cx={0} cy={-246} r={11} fill={L > 0.5 ? (Math.floor(t / 4 + i) % 2 ? '#1f3a26' : '#4aff7a') : '#1c1e22'} />
        </g>
      ))}
      {/* street lamps */}
      {Array.from({length: 8}).map((_, i) => <g key={i} transform={`translate(${200 + i * 480} 850)`}><rect x={-4} y={-280} width={8} height={280} fill="#1a1e24" /><circle cx={0} cy={-288} r={12} fill="#ffe0a0" opacity={L} /><Glow x={0} y={-280} r={170} c="#ffd890" o={0.28 * L} id={`sl${i}`} /></g>)}
      {/* cars */}
      {Array.from({length: p.jam ? 9 : 4}).map((_, i) => {
        const jam = p.jam ?? 0;
        const x = jam ? 100 + i * 330 : (((i * 900 + t * 120) % 4200) - 300);
        const y = i % 2 ? 1010 : 950;
        const hl = L > 0.3 || jam;
        return (
          <g key={i} transform={`translate(${x} ${y}) scale(${i % 2 ? 1.2 : 1.05})`}>
            <ellipse cx={0} cy={4} rx={110} ry={8} fill="#000" opacity={0.4} />
            <path d="M-110 -20 L-110 -52 Q-108 -64 -92 -66 L-52 -70 Q-34 -104 2 -104 L48 -104 Q76 -100 90 -70 L104 -66 Q114 -60 114 -44 L114 -20 Q114 -8 104 -8 L-100 -8 Q-110 -8 -110 -20 Z" fill={carCols[i % 4]} />
            <path d="M-40 -68 Q-28 -94 2 -94 L20 -94 L20 -68 Z M28 -94 L46 -94 Q68 -92 78 -68 L28 -68 Z" fill="#0a1220" opacity={0.85} />
            <circle cx={-66} cy={-8} r={20} fill="#0a0b0e" /><circle cx={66} cy={-8} r={20} fill="#0a0b0e" />
            <rect x={104} y={-50} width={12} height={12} rx={3} fill={hl ? '#fff3b0' : '#222'} />
            {hl && <polygon points="116,-46 330,-86 330,10 116,-30" fill="#fff3b0" opacity={0.08} />}
            <rect x={-116} y={-48} width={10} height={12} rx={3} fill={jam ? '#ff3a2a' : '#401010'} opacity={jam ? 0.9 : 0.6} />
          </g>
        );
      })}
      {/* shop + crowd */}
      {(p.crowd ?? 0) > 0 && <g transform="translate(2200 850)"><rect x={-260} y={-300} width={520} height={300} fill="#101620" /><rect x={-240} y={-250} width={480} height={150} fill={L > 0.5 ? '#ffe9b0' : '#05080e'} opacity={L > 0.5 ? 0.6 : 1} /><rect x={-260} y={-300} width={520} height={44} fill="#7a1a1a" /><Tx x={0} y={-266} size={30} fill="#e8e0d0">ПРОДУКТЫ</Tx>
        {Array.from({length: 22}).map((_, i) => { const x = -330 + (i % 11) * 60 + rnd(i) * 20, y = 96 + Math.floor(i / 11) * 40; return <g key={i} transform={`translate(${x + Math.sin(t * 3 + i) * 4} ${y - 60})`} opacity={p.crowd}><rect x={-14} y={-70} width={28} height={64} rx={12} fill="#06090e" /><circle cx={0} cy={-84} r={14} fill="#06090e" /></g>; })}
      </g>}
      {(p.trucks ?? 0) > 0 && [0, 1].map((i) => <g key={i} transform={`translate(${1300 + i * 520} 960)`}><rect x={-150} y={-170} width={300} height={140} rx={12} fill="#a01c18" /><rect x={-150} y={-170} width={90} height={80} fill="#10161e" /><rect x={-40} y={-120} width={170} height={14} fill="#e0d0a0" opacity={0.7} /><circle cx={-90} cy={-14} r={30} fill="#0a0b0e" /><circle cx={90} cy={-14} r={30} fill="#0a0b0e" />
        <circle cx={-110} cy={-188} r={12} fill={Math.sin(t * 12 + i * 3) > 0 ? '#ff2a2a' : '#401010'} /><circle cx={-70} cy={-188} r={12} fill={Math.sin(t * 12 + i * 3) > 0 ? '#401010' : '#ff2a2a'} /><Glow x={-90} y={-188} r={420} c="#ff2a2a" o={0.2 * (Math.sin(t * 12 + i * 3) > 0 ? 1 : 0.3)} id={`tr${i}`} /></g>)}
      {(p.trucks ?? 0) < 0 && null}
      {(p.queue ?? 0) > 0 && <g transform="translate(1500 900)">{Array.from({length: 26}).map((_, i) => <g key={i} transform={`translate(${-500 + i * 46} ${(i % 2) * 14})`}><rect x={-13} y={-84} width={26} height={74} rx={11} fill="#06090e" /><circle cx={0} cy={-98} r={13} fill="#06090e" /><rect x={14} y={-40} width={8} height={26} rx={3} fill="#9ab" opacity={0.5} /></g>)}</g>}
      {(p.lit ?? 0) > 0 && <g transform="translate(2700 0)"><rect x={0} y={300} width={300} height={560} fill="#0a0f18" />{Array.from({length: 5}).map((_, r) => Array.from({length: 4}).map((__, c) => <rect key={`${r}${c}`} x={22 + c * 70} y={330 + r * 100} width={48} height={64} fill="#ffd890" opacity={p.lit! * (0.7 + 0.3 * Math.sin(t * 3 + r * c))} />))}<Glow x={150} y={560} r={520} c="#ffcc70" o={0.3 * p.lit!} id="litb" /></g>}
      <rect x={-1500} y={-800} width={7200} height={2000} fill="#000" opacity={0.18} />
    </g>
  );
};

// ===== kitchen / living =====
export const Flat: React.FC<{t: number; jars?: number; dark?: number; lamp?: number; fridge?: number; table?: string[]; beam?: boolean; stove?: number; window?: number; chars?: React.ReactNode; L?: number}> = ({t, jars = 0, dark = 0.4, lamp = 1, fridge = 0, table = [], beam, stove = 0, window = 1, chars, L = 0}) => (
  <g>
    <Full c={DK('#1a2230', 0.35)} />
    <rect x={-500} y={800} width={3600} height={500} fill={DK('#22201a', 0.5)} />
    <rect x={-500} y={792} width={3600} height={12} fill="#10161c" />
    {/* window */}
    <g transform="translate(1560 400)"><rect x={-190} y={-200} width={380} height={400} fill={mixc('#0a1226', '#020409', 1 - L)} stroke="#1a2028" strokeWidth={12} />
      {Array.from({length: 14}).map((_, i) => <rect key={i} x={-170 + (i % 7) * 50} y={-120 + Math.floor(i / 7) * 80} width={26} height={34} fill={rnd(i + 4) < L * 0.8 ? '#ffd890' : '#05080e'} opacity={0.8} />)}
      <line x1={0} y1={-200} x2={0} y2={200} stroke="#1a2028" strokeWidth={8} />{window > 0 && <circle cx={100} cy={-130} r={22} fill="#c8d0e0" opacity={(1 - L) * 0.6} />}</g>
    {/* cabinet */}
    <g transform="translate(330 560)"><rect x={-210} y={-300} width={420} height={560} fill="#2a2418" stroke="#0a0c0e" strokeWidth={6} /><rect x={-190} y={-280} width={180} height={250} fill="#1e1a12" /><rect x={10} y={-280} width={180} height={250} fill="#1e1a12" /><rect x={-190} y={-10} width={380} height={250} fill="#241e14" /></g>
    {/* fridge */}
    <g transform="translate(900 800)"><rect x={-130} y={-440} width={260} height={440} rx={12} fill="#2a3038" stroke="#080a0c" strokeWidth={6} />
      {fridge > 0 ? <g><rect x={-120} y={-430} width={240} height={420} fill="#0e1620" /><rect x={-110} y={-300} width={220} height={6} fill="#4a5a6a" />{['МЯСО', 'МОЛОКО', 'СЫР', 'ЯЙЦА'].map((s, i) => <g key={s} opacity={clamp(fridge * 5 - i)} transform={`translate(${-80 + (i % 2) * 110} ${-340 + Math.floor(i / 2) * 120})`}><rect x={-34} y={-30} width={68} height={58} rx={8} fill={['#8a2a2a', '#c8d4e0', '#c8a838', '#d8cca8'][i]} opacity={0.85} /><Tx x={0} y={52} size={20} fill="#cfd8e0">{s}</Tx></g>)}</g> : <rect x={-14} y={-300} width={12} height={110} rx={5} fill="#7a828a" />}</g>
    {/* table */}
    <g transform="translate(1180 820)"><rect x={-280} y={-120} width={560} height={20} fill="#4a3a22" /><rect x={-260} y={-100} width={16} height={100} fill="#3a2c1a" /><rect x={244} y={-100} width={16} height={100} fill="#3a2c1a" />
      {Array.from({length: jars}).map((_, i) => <Jar key={i} x={-200 + i * 96} y={-120} />)}
      {table.map((s, i) => <g key={s} transform={`translate(${20 + i * 66} -120)`}>{s === 'pasta' && <><rect x={-24} y={-70} width={48} height={70} fill="#c8a838" /><Tx x={0} y={-30} size={14} fill="#222">МАК.</Tx></>}{s === 'rice' && <><rect x={-24} y={-64} width={48} height={64} fill="#e0d8c0" /><Tx x={0} y={-26} size={14} fill="#222">РИС</Tx></>}{s === 'cookie' && <><rect x={-28} y={-40} width={56} height={40} fill="#a86a3a" /><Tx x={0} y={-12} size={12} fill="#f0e0c0">ПЕЧ.</Tx></>}{s === 'beans' && <><rect x={-24} y={-70} width={48} height={70} rx={6} fill="#8a3a2a" /><Tx x={0} y={-30} size={13} fill="#f0e0c0">ФАС.</Tx></>}{s === 'buck' && <><rect x={-26} y={-66} width={52} height={66} fill="#8a6a3a" /><Tx x={0} y={-28} size={13} fill="#f0e0c0">ГРЕЧ.</Tx></>}</g>)}</g>
    {/* stove */}
    <g transform="translate(1900 800)"><rect x={-130} y={-200} width={260} height={200} fill="#2a2e34" stroke="#080a0c" strokeWidth={5} /><rect x={-100} y={-215} width={200} height={14} fill="#1a1e22" />{[-50, 50].map((cx) => <circle key={cx} cx={cx} cy={-208} r={30} fill="#0a0c10" stroke={stove ? '#d84a2a' : '#3a4048'} strokeWidth={5} />)}{stove > 0 && <Tx x={0} y={-100} size={34} fill="#ff6a5a">НЕТ ТОКА</Tx>}</g>
    {chars}
    {beam && <polygon points="900,640 2400,380 2400,1060" fill="#fff6c8" opacity={0.1} />}
    <Glow x={1000} y={160} r={900} c="#ffd890" o={0.22 * lamp} id="fl66" />
    <Glow x={1180} y={700} r={760} c="#ffe0a8" o={0.34 * (1 - lamp * 0.6)} id="fs66" />
    <Glow x={1560} y={380} r={520} c="#6a86c0" o={0.12 * (1 - L)} id="fm66" />
    <rect x={-500} y={-300} width={3600} height={1700} fill="#010308" opacity={dark + (1 - lamp) * 0.3} />
  </g>
);

// ===== bathroom =====
export const Bath: React.FC<{t: number; level: number; flow: number; bottles: number; dark?: number}> = ({t, level, flow, bottles, dark = 0.35}) => (
  <g>
    <Full c={DK('#1a2a30', 0.4)} />
    <rect x={-500} y={780} width={3600} height={500} fill={DK('#20262a', 0.5)} />
    <g transform="translate(760 800)"><rect x={-420} y={-210} width={840} height={210} rx={30} fill="#9aa4ac" /><rect x={-400} y={-196} width={800} height={160} rx={20} fill="#2a3640" /><rect x={-390} y={-30 - level * 150} width={780} height={level * 150} fill="#4a8ab8" opacity={0.85} />
      <rect x={-420} y={-210} width={840} height={16} rx={8} fill="#c0c8d0" /></g>
    <g transform="translate(560 420)"><path d="M0 -140 L0 -40 Q0 0 40 0 L140 0" stroke="#aab4be" strokeWidth={30} fill="none" strokeLinecap="round" />
      {flow > 0.02 && <rect x={128 - flow * 3} y={10} width={4 + flow * 8} height={290} fill="#8ac8f0" opacity={0.85} />}
      {flow <= 0.02 && <circle cx={134} cy={20 + ((t * 90) % 200)} r={6} fill="#8ac8f0" opacity={0.7} />}</g>
    {Array.from({length: bottles}).map((_, i) => <g key={i} transform={`translate(${1500 + (i % 4) * 100} ${800 - Math.floor(i / 4) * 150})`}><rect x={-30} y={-130} width={60} height={130} rx={14} fill="#bcd8f0" opacity={0.55} stroke="#8aa8c0" strokeWidth={3} /><rect x={-26} y={-90} width={52} height={86} rx={10} fill="#4a8ab8" opacity={0.85} /><rect x={-14} y={-148} width={28} height={20} rx={5} fill="#2a5a8a" /></g>)}
    <Glow x={900} y={140} r={800} c="#ffd890" o={0.1} id="bt66" />
    <rect x={-500} y={-300} width={3600} height={1700} fill="#010308" opacity={dark} />
  </g>
);

// ===== stairwell with elevator =====
export const Stairs: React.FC<{t: number; smoke?: number; dark?: number; floor?: string; beam?: {x: number; y: number}; chars?: React.ReactNode; elev?: number; door42?: boolean}> = ({t, smoke = 0, dark = 0.55, floor = '9', beam, chars, elev = 0}) => (
  <g>
    <Full c={DK('#1e2830', 0.4)} />
    <rect x={-500} y={800} width={4200} height={500} fill={DK('#262a2e', 0.5)} />
    <rect x={-500} y={792} width={4200} height={10} fill="#10161a" />
    {Array.from({length: 4}).map((_, i) => <g key={i} transform={`translate(${300 + i * 520} 800)`}><rect x={-100} y={-440} width={200} height={440} fill="#2a2418" stroke="#0a0c0e" strokeWidth={6} /><circle cx={70} cy={-210} r={9} fill="#b49a58" /><rect x={-50} y={-390} width={100} height={46} fill="#c9c4a8" opacity={0.7} /><Tx x={0} y={-356} size={28} fill="#222">{`${parseInt(floor) * 10 - 36 + i * 2}`}</Tx></g>)}
    {/* elevator */}
    <g transform="translate(2500 800)"><rect x={-200} y={-500} width={400} height={500} fill="#5a626a" stroke="#0a0c0e" strokeWidth={8} /><rect x={-4} y={-490} width={8} height={480} fill="#0a0c0e" /><rect x={-60} y={-560} width={120} height={44} fill="#06080a" /><Tx x={0} y={-526} size={26} fill={elev ? '#ff4a3a' : '#2a2e32'}>{elev ? floor : '--'}</Tx>
      {elev > 0 && <rect x={-180} y={-470} width={360} height={440} fill="#02050a" opacity={0.3} />}</g>
    <g transform="translate(3100 800)"><rect x={-18} y={-300} width={36} height={300} fill="#3a2a22" /><rect x={-70} y={-340} width={140} height={14} fill="#5a4030" /></g>
    {chars}
    {beam && <polygon points={`${beam.x},${beam.y} ${beam.x + 900},${beam.y - 260} ${beam.x + 900},${beam.y + 360}`} fill="#fff6c8" opacity={0.14} />}
    {smoke > 0 && Array.from({length: 18}).map((_, i) => <ellipse key={i} cx={((i * 331 + t * 40) % 3600) - 100} cy={820 - (smoke * (200 + rnd(i) * 500)) + Math.sin(t + i) * 30} rx={180 + rnd(i + 3) * 140} ry={110 + rnd(i + 5) * 80} fill="#7a7e84" opacity={0.12 * smoke} />)}
    {smoke > 0 && <rect x={-500} y={-300} width={4200} height={1700} fill="#6a6e74" opacity={0.15 * smoke} />}
    <rect x={-500} y={-300} width={4200} height={1700} fill="#010308" opacity={dark} />
    {beam && <Glow x={beam.x + 200} y={beam.y} r={420} c="#fff6c8" o={0.22} id="sb66" />}
  </g>
);

export const DoorFlat: React.FC<{t: number; num: string; tv?: number; ajar?: number; sil?: number; dark?: number}> = ({t, num, tv = 0, ajar = 0, sil = 0, dark = 0.5}) => (
  <g>
    <Full c={DK('#161e26', 0.4)} />
    <g transform="translate(960 560)"><rect x={-300} y={-540} width={600} height={1080} fill="#02050a" />
      {tv > 0 && <rect x={-300 + ajar * 150} y={-500} width={600 - ajar * 150} height={1000} fill={`rgba(120,170,255,${0.1 * tv})`} />}
      {ajar > 0 && <g><rect x={-290 + ajar * 50} y={-520} width={80 + ajar * 70} height={1040} fill="#8ab4ff" opacity={0.25 * tv * (0.7 + 0.3 * Math.sin(t * 14))} />{sil > 0 && <g opacity={sil}><rect x={-230} y={-360} width={90} height={400} rx={40} fill="#010204" /><circle cx={-185} cy={-390} r={40} fill="#010204" /></g>}</g>}
      <g transform={`translate(${-290} 0)`}><path d={`M0 -520 L${600 - ajar * 130} ${-520 + ajar * 20} L${600 - ajar * 130} ${520 - ajar * 20} L0 520 Z`} fill="#2a2418" stroke="#0a0c0e" strokeWidth={8} /><rect x={80} y={-420} width={300} height={100} fill="#c9c4a8" opacity={0.75} /><Tx x={230} y={-346} size={84} fill="#222">{num}</Tx>
        <circle cx={500 - ajar * 120} cy={0} r={20} fill="#b49a58" /><circle cx={300} cy={-180} r={14} fill="#06080a" /></g>
      {tv > 0 && ajar <= 0 && <rect x={-290} y={480} width={600} height={30} fill="#8ab4ff" opacity={0.3 * tv * (0.6 + 0.4 * Math.sin(t * 13))} />}
    </g>
    <rect x={-100} y={-100} width={2200} height={1300} fill="#010308" opacity={dark} />
  </g>
);

// ===== phone screens =====
export const PhoneScr: React.FC<{t: number; mode: string; k?: number}> = ({t, mode, k = 1}) => {
  const hdr = (c: string, txt: string) => <g><rect x={-250} y={-450} width={500} height={100} fill={c} /><Tx x={0} y={-386} size={30} fill="#fff">{txt}</Tx></g>;
  let body: React.ReactNode = null;
  if (mode === 'noinet') body = <g>{hdr('#444', 'БРАУЗЕР')}<Tx x={0} y={-160} size={120} fill="#778">⚠</Tx><Tx x={0} y={-20} size={44} fill="#fff">Нет подключения</Tx><Tx x={0} y={44} size={34} fill="#9fb4d0">к интернету</Tx></g>;
  if (mode === 'emerg') body = <g>{hdr('#a02020', 'ЭКСТРЕННОЕ ОПОВЕЩЕНИЕ')}<Tx x={0} y={-280} size={40} fill="#ff8a7a">ВНИМАНИЕ</Tx>{['Масштабное отключение', 'электроэнергии.', 'Возможны перебои с', 'водоснабжением и связью.'].map((s, i) => <Tx key={i} x={0} y={-190 + i * 62} size={32} fill="#fff" o={clamp(k * 5 - i)}>{s}</Tx>)}</g>;
  if (mode === 'nosig') body = <g>{hdr('#555', 'ВЫЗОВ · АВАРИЙНАЯ СЛУЖБА')}<g transform="translate(0 -80)">{[0, 1, 2, 3].map((i) => <rect key={i} x={-70 + i * 36} y={-10 - i * 16} width={22} height={20 + i * 16} fill="#444" />)}<path d="M-100 -80 L100 60" stroke="#ff4a4a" strokeWidth={10} /></g><Tx x={0} y={140} size={50} fill="#ff6a6a">НЕТ СЕТИ</Tx></g>;
  if (mode === 'battery') body = <g>{hdr('#222', 'ПИТАНИЕ')}<g transform="translate(0 -80)"><rect x={-110} y={-60} width={210} height={120} rx={16} fill="none" stroke="#e8e8e8" strokeWidth={10} /><rect x={100} y={-26} width={20} height={52} rx={6} fill="#e8e8e8" /><rect x={-98} y={-48} width={28} height={96} rx={6} fill="#ff4a3a" /></g><Tx x={0} y={120} size={130} fill="#ff6a5a">9%</Tx></g>;
  if (mode === 'dial') body = <g>{hdr('#2f4a6a', 'ПОЖАРНАЯ ОХРАНА')}<circle cx={0} cy={-120} r={90} fill="#1a2c40" /><Tx x={0} y={-90} size={70} fill="#fff">101</Tx><Tx x={0} y={60} size={40} fill="#7affb0">{k > 0.5 ? 'Соединено' : 'вызов…'}</Tx></g>;
  return (
    <g>
      <Full c="#04060a" />
      <Glow x={960} y={540} r={900} c="#6fb8ff" o={0.08} id="pp66" />
      <g transform="translate(960 560) scale(0.95)"><rect x={-290} y={-490} width={580} height={980} rx={64} fill="#05070b" stroke="#2a3040" strokeWidth={10} /><rect x={-262} y={-462} width={524} height={924} rx={44} fill="#0d1420" />
        <clipPath id="pp66c"><rect x={-262} y={-462} width={524} height={924} rx={44} /></clipPath><g clipPath="url(#pp66c)">{body}</g></g>
    </g>
  );
};

// ===== list paper / backpack / icons / map / earth =====
export const ListPaper: React.FC<{t: number; lines: string[]; k: number; title?: string}> = ({t, lines, k, title = 'ЗАПАСЫ'}) => (
  <g>
    <Full c="#0e0c0a" />
    <g transform="translate(960 560) rotate(-2)"><rect x={-400} y={-470} width={800} height={940} fill="#d8d2b4" /><Tx x={0} y={-390} size={54} fill="#222">{title}</Tx>
      {lines.map((l, i) => <g key={i} opacity={clamp(k * lines.length - i)}><Tx x={-340} y={-300 + i * 78} size={40} fill="#2a2a2a" anchor="start">{l}</Tx><rect x={-340} y={-288 + i * 78} width={680 * clamp(k * lines.length - i)} height={4} fill="#2a2a2a" opacity={0.3} /></g>)}</g>
    <rect x={-100} y={-100} width={2200} height={1300} fill="#010308" opacity={0.3} />
  </g>
);

export const PackClose: React.FC<{t: number; k: number}> = ({t, k}) => {
  const items = ['ДОКУМЕНТЫ', 'ВОДА', 'АПТЕЧКА', 'ФОНАРИК', 'БАТАРЕЙКИ', 'ЛЕКАРСТВА'];
  return (
    <g>
      <Full c="#0e0c0a" />
      <rect x={-500} y={520} width={3600} height={800} fill="#2a2218" />
      <g transform="translate(600 640)"><rect x={-200} y={-320} width={400} height={440} rx={60} fill="#16181e" stroke="#2a2e38" strokeWidth={8} /><rect x={-150} y={-220} width={300} height={120} rx={26} fill="#1e2128" /></g>
      {items.map((s, i) => {
        const a = clamp(k * items.length - i), x = 1000 + (i % 3) * 300, y = 400 + Math.floor(i / 3) * 280;
        return (
          <g key={s} transform={`translate(${x} ${y + (1 - a) * 80})`} opacity={a}>
            {i === 0 && <><rect x={-90} y={-70} width={180} height={140} fill="#2f4a8a" /><Tx x={0} y={8} size={28} fill="#fff">ПАСПОРТ</Tx></>}
            {i === 1 && <><rect x={-34} y={-130} width={68} height={140} rx={14} fill="#bcd8f0" opacity={0.6} /><rect x={-30} y={-90} width={60} height={96} rx={10} fill="#4a8ab8" /></>}
            {i === 2 && <><rect x={-90} y={-60} width={180} height={120} rx={14} fill="#c0392b" /><rect x={-14} y={-36} width={28} height={72} fill="#fff" /><rect x={-36} y={-14} width={72} height={28} fill="#fff" /></>}
            {i === 3 && <><rect x={-80} y={-26} width={120} height={52} rx={10} fill="#2a2f38" /><rect x={40} y={-34} width={44} height={68} rx={8} fill="#e0a22a" /></>}
            {i === 4 && <><rect x={-70} y={-30} width={36} height={80} rx={6} fill="#c8a838" /><rect x={-24} y={-30} width={36} height={80} rx={6} fill="#c8a838" /><rect x={22} y={-30} width={36} height={80} rx={6} fill="#c8a838" /></>}
            {i === 5 && <><rect x={-50} y={-70} width={100} height={130} rx={14} fill="#e8e0d0" /><rect x={-40} y={-30} width={80} height={36} fill="#8a3a3a" /></>}
            <Tx x={0} y={120} size={26} fill="#e0d8c0">{s}</Tx>
          </g>
        );
      })}
      <rect x={-100} y={-100} width={2200} height={1300} fill="#010308" opacity={0.32} />
    </g>
  );
};

export const FireIcons: React.FC<{t: number; k: number}> = ({t, k}) => (
  <g>
    <Full c="#0c0c10" />
    {[['ГОРЕЛКА', 0], ['МАНГАЛ', 1], ['ГЕНЕРАТОР', 2]].map(([n, i]) => {
      const a = clamp(k * 3 - (i as number)), x = 420 + (i as number) * 540;
      return (
        <g key={n as string} transform={`translate(${x} 520)`} opacity={a}>
          {i === 0 && <><rect x={-70} y={-20} width={140} height={90} rx={12} fill="#6a6e74" /><circle cx={0} cy={-40} r={34} fill="#222" /><path d="M-16 -40 q16 -50 0 -70 q36 20 24 60 q16 -10 6 -30" fill="#e8742a" /></>}
          {i === 1 && <><path d="M-110 0 Q0 130 110 0 Z" fill="#3a3a40" /><rect x={-100} y={-8} width={200} height={8} fill="#6a6e74" />{[-60, -20, 20, 60].map((c) => <path key={c} d={`M${c} -10 q10 -50 0 -70`} stroke="#8a8a8a" strokeWidth={8} fill="none" opacity={0.6} />)}</>}
          {i === 2 && <><rect x={-110} y={-60} width={220} height={130} rx={12} fill="#2f6a4a" /><rect x={-80} y={-40} width={80} height={46} fill="#1a2a20" /><circle cx={70} cy={-10} r={16} fill="#c8a838" /></>}
          <circle cx={0} cy={10} r={150} fill="none" stroke="#ff3b3b" strokeWidth={16} opacity={a} /><line x1={-106} y1={-96} x2={106} y2={116} stroke="#ff3b3b" strokeWidth={16} opacity={a} />
          <Tx x={0} y={250} size={42} fill="#e8e0d0">{n as string}</Tx>
        </g>
      );
    })}
    <g opacity={clamp(k * 3 - 2.2)}><Tx x={960} y={880} size={46} fill="#ff6a5a">ТОЛЬКО СНАРУЖИ · УГАРНЫЙ ГАЗ</Tx></g>
    <rect x={-100} y={-100} width={2200} height={1300} fill="#010308" opacity={0.2} />
  </g>
);

export const MapTop: React.FC<{t: number; k: number}> = ({t, k}) => (
  <g>
    <Full c="#0e1620" />
    {Array.from({length: 17}).map((_, i) => <line key={'h' + i} x1={100} y1={80 + i * 60} x2={1820} y2={80 + i * 60} stroke="#1e2c3c" strokeWidth={4} />)}
    {Array.from({length: 29}).map((_, i) => <line key={'v' + i} x1={100 + i * 60} y1={80} x2={100 + i * 60} y2={1040} stroke="#1e2c3c" strokeWidth={4} />)}
    <path d="M100 760 Q600 700 900 800 T1820 700" stroke="#1a4a7a" strokeWidth={40} fill="none" opacity={0.6} />
    {Array.from({length: 38}).map((_, i) => <rect key={i} x={160 + (i % 10) * 160 + rnd(i) * 20} y={140 + Math.floor(i / 10) * 150 + rnd(i + 5) * 20} width={80 + rnd(i + 2) * 50} height={70 + rnd(i + 9) * 40} fill="#16222e" stroke="#243446" strokeWidth={2} />)}
    <g transform="translate(460 360)"><circle r={22} fill="#4a8aff" /><circle r={22 + ((t * 40) % 40)} fill="none" stroke="#4a8aff" opacity={0.5} strokeWidth={4} /><Tx x={0} y={-40} size={32} fill="#cfe0ff">ДОМ</Tx></g>
    <path d="M460 360 L460 600 L1000 600 L1000 440 L1420 440" stroke="#ffd23a" strokeWidth={10} fill="none" strokeDasharray="26 16" strokeDashoffset={-t * 40} opacity={clamp(k * 2)} />
    <g transform="translate(1420 440)" opacity={clamp(k * 3)}><rect x={-56} y={-40} width={112} height={80} fill="#1f6a4a" /><circle r={80 + ((t * 50) % 60)} fill="none" stroke="#7affb0" strokeWidth={5} opacity={0.5} /><circle r={80} fill="none" stroke="#7affb0" strokeWidth={4} /><Tx x={0} y={-100} size={34} fill="#bfffd8">НАСОСНАЯ СТАНЦИЯ</Tx></g>
    <rect x={-100} y={-100} width={2200} height={1300} fill="#010308" opacity={0.2} />
  </g>
);

export const EarthStorm: React.FC<{t: number}> = ({t}) => (
  <g>
    <Full c="#02040a" />
    {Array.from({length: 70}).map((_, i) => <circle key={i} cx={rnd(i) * 1920} cy={rnd(i + 3) * 1080} r={1 + rnd(i + 5) * 1.6} fill="#c8d4f0" opacity={0.5} />)}
    {/* sun */}
    <g transform="translate(250 330)"><circle r={200} fill="#ffb02a" opacity={0.18} /><circle r={120} fill="#ffd23a" /><Glow x={0} y={0} r={560} c="#ff9a2a" o={0.4} id="es66" />
      {Array.from({length: 5}).map((_, i) => <path key={i} d={`M130 ${(i - 2) * 30} Q600 ${(i - 2) * 80 + Math.sin(t * 3 + i) * 40} 1050 ${(i - 2) * 40 + 260}`} stroke="#ffb02a" strokeWidth={6 + i} fill="none" opacity={0.35 + 0.25 * Math.sin(t * 4 + i)} strokeDasharray="30 18" strokeDashoffset={-t * 200} />)}</g>
    {/* earth */}
    <g transform="translate(1350 600)"><circle r={260} fill="#12304a" /><circle r={260} fill="none" stroke="#3a7ab8" strokeWidth={8} opacity={0.6} />
      <path d="M-120 -80 q60 -60 130 -20 q40 60 -40 90 q-60 20 -90 -70z M60 40 q70 -30 100 30 q-20 70 -90 60z" fill="#1e5a3a" />
      {Array.from({length: 40}).map((_, i) => { const a = rnd(i) * 6.28, r = 60 + rnd(i + 4) * 180; return <rect key={i} x={Math.cos(a) * r} y={Math.sin(a) * r} width={6} height={6} fill="#ffd890" opacity={clamp(1 - (t % 9) / 7 - rnd(i + 7) * 0.2) * 0.9} />; })}
      {[1, 2, 3].map((i) => <ellipse key={i} cx={0} cy={0} rx={300 + i * 40} ry={300 + i * 40 - 20} fill="none" stroke="#5aaaff" strokeWidth={3} opacity={0.35 - i * 0.07 + 0.1 * Math.sin(t * 3 + i)} />)}</g>
    <Tx x={960} y={970} size={42} fill="#9fb8e0">ГЕОМАГНИТНАЯ БУРЯ</Tx>
    <rect x={-100} y={-100} width={2200} height={1300} fill="#010308" opacity={0.15} />
  </g>
);

export const Gym: React.FC<{t: number}> = ({t}) => (
  <g>
    <Full c={DK('#1c2630', 0.4)} />
    <rect x={-500} y={740} width={4200} height={500} fill={DK('#3a2e1c', 0.55)} />
    {[300, 1100, 1900].map((x) => <rect key={x} x={x} y={120} width={160} height={14} fill="#c8d0c8" opacity={0.5} />)}
    {/* queue */}
    {Array.from({length: 24}).map((_, i) => <g key={i} transform={`translate(${300 + i * 74} ${880 + (i % 2) * 14})`}><rect x={-18} y={-120} width={36} height={100} rx={16} fill="#080b10" /><circle cx={0} cy={-142} r={18} fill="#080b10" /></g>)}
    {/* table + volunteers + bottles/boxes */}
    <g transform="translate(2300 780)"><rect x={-300} y={-110} width={600} height={16} fill="#5a4a30" />{Array.from({length: 8}).map((_, i) => <g key={i} transform={`translate(${-250 + i * 70} -110)`}><rect x={-14} y={-60} width={28} height={60} rx={8} fill="#bcd8f0" opacity={0.6} /><rect x={-12} y={-38} width={24} height={34} fill="#4a8ab8" /></g>)}
      {[0, 1, 2].map((i) => <rect key={i} x={-240 + i * 110} y={-170} width={90} height={60} fill="#8a6a3a" />)}
      <Man x={-100} y={140} pose={poseStand()} look={{...WORKER, hat: 'none'}} s={1.35} /><Man x={140} y={140} pose={poseStand()} look={{...WORKER, hat: 'none', jacket: '#2a6a8a'}} s={1.35} /></g>
    <Glow x={1000} y={200} r={900} c="#ffe0a0" o={0.14} id="gy66" />
    <rect x={-500} y={-300} width={4200} height={1700} fill="#010308" opacity={0.45} />
  </g>
);

export const Pump: React.FC<{t: number; gen?: number; room?: boolean}> = ({t, gen = 0, room = false}) => (
  <g>
    <Full c={mixc('#0a1020', '#02040a', 0.4)} />
    <rect x={-500} y={820} width={4200} height={500} fill="#141820" />
    {Array.from({length: 7}).map((_, i) => <rect key={i} x={-200 + i * 420} y={820 - 140 - (i % 3) * 60} width={160} height={140 + (i % 3) * 60} fill="#0c1018" />)}
    {room ? (
      <g><rect x={-500} y={0} width={4200} height={820} fill="#1a1e24" /><rect x={-500} y={800} width={4200} height={500} fill="#10141a" />
        <g transform="translate(1100 800)"><rect x={-260} y={-110} width={520} height={110} fill="#3a2e1c" /><rect x={-260} y={-120} width={520} height={14} fill="#5a4630" /></g>
        <g transform="translate(1100 690)"><Radio x={0} y={-60} s={1.1} t={t} on={1} needle={0.55} noise={0.3} /></g>
        <Glow x={1100} y={600} r={700} c="#ffb04a" o={0.25} id="rr66" /></g>
    ) : (
      <g>
        <g transform="translate(1500 820)"><rect x={-300} y={-380} width={600} height={380} fill="#2a2e34" stroke="#0a0c0e" strokeWidth={6} /><rect x={-300} y={-400} width={600} height={30} fill="#1e2226" />
          <rect x={-90} y={-250} width={180} height={250} fill="#0a0c10" /><rect x={-240} y={-320} width={100} height={110} fill={gen ? '#ffd890' : '#06080c'} opacity={0.8} />
          <rect x={-260} y={-540} width={520} height={90} fill="#c9c4a8" opacity={0.85} /><Tx x={0} y={-480} size={30} fill="#222">РЕЗЕРВНАЯ НАСОСНАЯ СТАНЦИЯ</Tx></g>
        <g transform="translate(900 820)"><rect x={-60} y={-250} width={14} height={250} fill="#1a1e22" /><rect x={360} y={-250} width={14} height={250} fill="#1a1e22" />{Array.from({length: 12}).map((_, i) => <rect key={i} x={-46 + i * 34} y={-220} width={4} height={220} fill="#1a1e22" />)}<rect x={-60} y={-250} width={434} height={8} fill="#1a1e22" /></g>
        <g transform="translate(2300 820)"><rect x={-110} y={-130} width={220} height={130} rx={8} fill="#2f5a3a" /><rect x={-90} y={-110} width={90} height={60} fill="#1a2a20" /><Glow x={0} y={-60} r={260} c="#7affb0" o={0.12 * gen} id="gn66" />
          {gen > 0 && [0, 1, 2].map((i) => <ellipse key={i} cx={30 + i * 20} cy={-160 - i * 30 - ((t * 40) % 60)} rx={20 + i * 8} ry={14 + i * 4} fill="#7a7e84" opacity={0.22} />)}</g>
      </g>
    )}
    <rect x={-500} y={-300} width={4200} height={1700} fill="#010308" opacity={room ? 0.35 : 0.4} />
  </g>
);

export const BigText: React.FC<{lines: string[]; k: number}> = ({lines, k}) => (
  <g>
    <Full c="#010206" />
    {lines.map((l, i) => <Tx key={i} x={960} y={500 + i * 160} size={i === 0 ? 150 : 110} fill={i === 0 ? '#ff4a3a' : '#fff'} o={clamp(k * 3 - i)}>{l}</Tx>)}
  </g>
);
