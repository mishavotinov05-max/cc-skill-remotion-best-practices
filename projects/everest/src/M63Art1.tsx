import React from 'react';
import {clamp, ease, lerp, rnd, mixc, Tx, Glow, Person, Look, Pose, poseStand, poseWalk, poseSit, poseReach, E} from './M60Base';

// ================= characters (consistent looks) =================
export const VASYA: Look = {jacket: '#16181e', jacket2: '#2a2e38', arm: '#e6b48f', pants: '#3f444d', glove: '#e6b48f', boot: '#f2f2f2', hair: '#221b18', skin: '#e6b48f', hat: 'none'};
export const MAXL: Look = {jacket: '#2f5fb5', jacket2: '#4a7ad0', arm: '#e9bb95', pants: '#cdb78e', glove: '#e9bb95', boot: '#2a2a30', hair: '#dcb85c', skin: '#e9bb95', hat: 'none', fat: 1.06};
export const NIKL: Look = {old: true, jacket: '#a8453a', jacket2: '#c0594c', plaid: '#3a1a16', arm: '#a8453a', pants: '#6a4a30', glove: '#d6a07c', boot: '#4a3a2a', hair: '#c4c4cc', skin: '#d6a07c', hat: 'none', fat: 1.1};
export const WORKER: Look = {jacket: '#e8862a', jacket2: '#f29a40', pants: '#3a4150', glove: '#2a2f3a', boot: '#2a2a30', hat: 'beanie', hatCol: '#f2f2f2', hair: '#2a2420', skin: '#d9a47e'};
export const MEDIC: Look = {jacket: '#f2f4f7', jacket2: '#ffffff', pants: '#2f6ea8', glove: '#e0b090', boot: '#e8e8ee', hair: '#3a2a22', skin: '#e0b090', hat: 'none'};
export const CROWD: Look = {jacket: '#3a3f4a', jacket2: '#4a505c', pants: '#2a2f38', glove: '#3a3f4a', boot: '#1c1e24', hair: '#1c1816', skin: '#c89a7a', hat: 'none'};

export type CS = {look: Look; x: number; y: number; pose: Pose; flip?: boolean; s?: number; lie?: number};
export const Chars: React.FC<{list: CS[]}> = ({list}) => (
  <g>
    {list.map((c, i) =>
      c.lie ? (
        <g key={i} transform={`rotate(${c.lie} ${c.x} ${c.y})`}><Person x={c.x} y={c.y} look={c.look} pose={c.pose} flip={c.flip} s={c.s ?? 1} /></g>
      ) : (
        <Person key={i} x={c.x} y={c.y} look={c.look} pose={c.pose} flip={c.flip} s={c.s ?? 1} />
      )
    )}
  </g>
);

const W = 9000, H = 4000;
export const Full: React.FC<{c: string; o?: number}> = ({c, o = 1}) => <rect x={-3000} y={-1500} width={W} height={H} fill={c} opacity={o} />;

// ================= city =================
export const CarSvg: React.FC<{x: number; y: number; col: string; s?: number; flip?: boolean; lights?: boolean; smoke?: number}> = ({x, y, col, s = 1, flip, lights, smoke = 0}) => (
  <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
    <ellipse cx={0} cy={4} rx={120} ry={10} fill="#000" opacity={0.28} />
    <path d="M-120 -20 L-120 -52 Q-118 -66 -100 -68 L-56 -72 Q-36 -112 4 -112 L52 -112 Q82 -108 96 -74 L112 -70 Q124 -64 124 -44 L124 -20 Q124 -8 112 -8 L-108 -8 Q-120 -8 -120 -20 Z" fill={col} />
    <path d="M-44 -74 Q-30 -102 2 -102 L22 -102 L22 -74 Z" fill="#cfe6f7" opacity={0.88} />
    <path d="M30 -102 L50 -102 Q72 -100 84 -74 L30 -74 Z" fill="#cfe6f7" opacity={0.88} />
    <rect x={-120} y={-44} width={244} height={5} fill="#000" opacity={0.16} />
    <circle cx={-72} cy={-8} r={22} fill="#15171c" /><circle cx={-72} cy={-8} r={10} fill="#8d939e" />
    <circle cx={72} cy={-8} r={22} fill="#15171c" /><circle cx={72} cy={-8} r={10} fill="#8d939e" />
    <rect x={112} y={-52} width={14} height={14} rx={4} fill={lights ? '#fff3b0' : '#e8e8e8'} />
    <rect x={-126} y={-50} width={10} height={12} rx={3} fill="#c0392b" />
    {smoke > 0 && <g opacity={smoke}>{[0, 1, 2].map((i) => <circle key={i} cx={-40 - i * 26} cy={-134 - i * 22} r={22 + i * 12} fill="#e6e6e6" opacity={0.5 - i * 0.12} />)}</g>}
  </g>
);

const TreeSvg: React.FC<{x: number; y: number; h: number; s?: number; hot: number}> = ({x, y, h, s = 1, hot}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-9} y={-h * 0.5} width={18} height={h * 0.5} fill="#6a4a30" />
    <circle cx={0} cy={-h * 0.75} r={h * 0.34} fill={mixc('#36a24a', '#8a8a44', hot)} />
    <circle cx={-h * 0.2} cy={-h * 0.62} r={h * 0.24} fill={mixc('#2e9442', '#7e7e3e', hot)} />
    <circle cx={h * 0.22} cy={-h * 0.64} r={h * 0.26} fill={mixc('#40b155', '#96964c', hot)} />
  </g>
);

const Tower: React.FC<{x: number; w: number; h: number; y: number; col: string; seed: number; hot: number; lit?: number}> = ({x, w, h, y, col, seed, hot, lit = 0}) => {
  const cols = Math.max(2, Math.floor(w / 36)), rows = Math.floor(h / 46);
  return (
    <g>
      <rect x={x} y={y - h} width={w} height={h} fill={col} />
      <rect x={x} y={y - h} width={w * 0.18} height={h} fill="#fff" opacity={0.1} />
      {Array.from({length: rows}).map((_, r) => Array.from({length: cols}).map((__, c) => {
        const on = rnd(seed + r * 13 + c * 7) > 0.55;
        return <rect key={`${r}-${c}`} x={x + 10 + c * ((w - 20) / cols)} y={y - h + 16 + r * 46} width={(w - 20) / cols - 8} height={26} fill={lit && on ? '#ffe9a0' : mixc('#a9d2f0', '#e6c8a0', hot)} opacity={lit && on ? 0.8 : 0.55} />;
      }))}
    </g>
  );
};

export type CityP = {hot?: number; cars?: number; outage?: number; aband?: number; people?: number; shut?: number; cx?: number; sunY?: number; night?: number; recover?: number};
export const CityScene: React.FC<{t: number; p: CityP}> = ({t, p}) => {
  const hot = p.hot ?? 0, cars = p.cars ?? 1, cx = p.cx ?? 960;
  const skyT = mixc('#3d9bf2', '#e89a58', hot), skyB = mixc('#a9dcff', '#f6cf98', hot);
  const par = (k: number) => `translate(${(cx - 960) * k} 0)`;
  const sunX = 1500 + (cx - 960) * 0.95, sunY = p.sunY ?? 230;
  const asp = '#555a63';
  const lanes = [{y: 960, dir: 1, sp: 190}, {y: 1020, dir: -1, sp: 150}];
  const carCols = ['#c0392b', '#2f6fb5', '#e8e8e8', '#2a2f38', '#e0a22a', '#3a8a5a', '#8a8f9a'];
  return (
    <g>
      <defs>
        <linearGradient id="c63sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={skyT} /><stop offset="1" stopColor={skyB} /></linearGradient>
        <radialGradient id="c63sun" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#fff7c0" stopOpacity={0.9} /><stop offset="0.35" stopColor="#ffd84a" stopOpacity={0.45} /><stop offset="1" stopColor="#ffd84a" stopOpacity={0} /></radialGradient>
      </defs>
      <rect x={-1500} y={-600} width={7200} height={1900} fill="url(#c63sky)" />
      <g transform={`translate(${sunX} ${sunY})`}>
        <circle r={260 + hot * 220} fill="url(#c63sun)" />
        {Array.from({length: 12}).map((_, i) => <rect key={i} x={-4} y={-170 - hot * 20} width={8} height={50 + (i % 2) * 20} rx={4} fill="#ffe27a" opacity={0.5} transform={`rotate(${i * 30 + t * 6})`} />)}
        <circle r={78 + hot * 14} fill={mixc('#ffd23a', '#ffb02a', hot)} />
      </g>
      {hot < 0.5 && [0, 1, 2].map((i) => <ellipse key={i} cx={(i * 900 + t * 8 + (cx - 960) * 0.2) % 3200 - 300} cy={160 + i * 60} rx={150} ry={36} fill="#fff" opacity={0.75 * (1 - hot * 1.6)} />)}
      <g transform={par(0.28)}>
        {Array.from({length: 17}).map((_, i) => <Tower key={i} x={-700 + i * 260} w={150 + rnd(i) * 70} h={300 + rnd(i + 5) * 320} y={830} col={mixc('#7fa9d6', '#c9ab8c', hot)} seed={i * 31} hot={hot} lit={p.night ?? 0} />)}
      </g>
      <g transform={par(0.55)}>
        {Array.from({length: 11}).map((_, i) => <Tower key={i} x={-500 + i * 400} w={230 + rnd(i + 9) * 90} h={230 + rnd(i + 3) * 260} y={850} col={mixc(['#5c8fc6', '#e8eef5', '#6aa0b8', '#d6dde6'][i % 4], '#cdb090', hot * 0.8)} seed={i * 17 + 3} hot={hot} lit={p.night ?? 0} />)}
      </g>
      <rect x={-1500} y={840} width={7200} height={30} fill={mixc('#d8d4c8', '#c8b698', hot)} />
      <g transform={par(0.8)}>
        {Array.from({length: 22}).map((_, i) => <TreeSvg key={i} x={-300 + i * 190 + rnd(i) * 40} y={850} h={150 + rnd(i + 8) * 50} hot={hot} />)}
        {Array.from({length: Math.round(14 * (p.people ?? 0))}).map((_, i) => <g key={i} transform={`translate(${200 + i * 210 + ((t * (14 + rnd(i) * 10)) % 80)} 870)`} opacity={0.9}><rect x={-12} y={-74} width={24} height={52} rx={10} fill={['#d35a4a', '#4a7ad0', '#3aa06a', '#d8b04a'][i % 4]} /><circle cx={0} cy={-88} r={13} fill="#d9a47e" /><rect x={-10} y={-24} width={8} height={24} fill="#2a2f38" /><rect x={2} y={-24} width={8} height={24} fill="#2a2f38" /></g>)}
      </g>
      <rect x={-1500} y={870} width={7200} height={260} fill={mixc('#4a4f58', '#6a6460', hot * 0.7)} />
      {[0, 1, 2, 3].map((i) => <rect key={i} x={-200 + i * 1000 + 0} y={990} width={6000} height={0} />)}
      {Array.from({length: 40}).map((_, i) => <rect key={i} x={-600 + i * 150} y={996} width={70} height={7} fill="#f2e9c0" opacity={0.85} />)}
      {/* traffic lights */}
      {[900, 2300].map((x, i) => {
        const outage = p.outage ?? 0;
        const ph = Math.floor(t / 4 + i) % 2;
        return (
          <g key={x} transform={`translate(${x + (cx - 960) * 0.1} 860)`}>
            <rect x={-6} y={-250} width={12} height={250} fill="#2a2f38" />
            <rect x={-24} y={-340} width={48} height={110} rx={10} fill="#15181e" />
            <circle cx={0} cy={-316} r={11} fill={outage > 0.5 ? '#2a2a2a' : ph ? '#ff4a3a' : '#4a2420'} />
            <circle cx={0} cy={-286} r={11} fill="#3a3820" />
            <circle cx={0} cy={-256} r={11} fill={outage > 0.5 ? '#2a2a2a' : !ph ? '#4aff7a' : '#1f3a26'} />
          </g>
        );
      })}
      {/* cars */}
      {lanes.map((ln, li) => Array.from({length: Math.round(5 * cars)}).map((_, i) => {
        const base = i * 780 + li * 330;
        const x = (((base + t * ln.sp * ln.dir) % 4200) + 4200) % 4200 - 500;
        return <CarSvg key={`${li}-${i}`} x={x} y={ln.y} col={carCols[(i * 3 + li) % carCols.length]} s={1.15 - li * 0.1} flip={ln.dir < 0} lights={p.night ? true : false} />;
      }))}
      {Array.from({length: Math.round(7 * (p.aband ?? 0))}).map((_, i) => <CarSvg key={`a${i}`} x={100 + i * 470 + rnd(i) * 60} y={i % 2 ? 1030 : 970} col={carCols[(i * 2 + 1) % carCols.length]} s={1.1} flip={i % 3 === 0} />)}
      {(p.shut ?? 0) > 0 && <g opacity={p.shut}>{Array.from({length: 6}).map((_, i) => <g key={i} transform={`translate(${200 + i * 560} 760)`}><rect x={-120} y={-10} width={240} height={90} fill="#6a717c" /><rect x={-120} y={-10} width={240} height={10} fill="#4a4f58" />{[0, 1, 2, 3, 4].map((k) => <rect key={k} x={-120} y={4 + k * 15} width={240} height={3} fill="#4a4f58" />)}</g>)}</g>}
      {/* heat shimmer */}
      {hot > 0.15 && Array.from({length: 8}).map((_, i) => <path key={i} d={`M-300 ${900 + i * 24} ${Array.from({length: 22}).map((__, k) => `L${-300 + k * 180} ${900 + i * 24 + Math.sin(t * 3 + k + i) * 7 * hot}`).join(' ')}`} stroke="#fff" strokeOpacity={0.14 * hot} strokeWidth={5} fill="none" />)}
      <rect x={-1500} y={-600} width={7200} height={1900} fill="#ff9a30" opacity={hot * 0.14} />
    </g>
  );
};

export const BusStop: React.FC<{t: number; hot: number; res: number}> = ({t, hot, res}) => {
  const k = E(t, 0, 3);
  return (
    <g>
      <CityScene t={t} p={{hot, cars: 0.25, people: 0.1, cx: 960}} />
      <g transform="translate(1000 880)">
        <rect x={-190} y={-250} width={380} height={12} fill="#3a4250" />
        <rect x={-186} y={-238} width={6} height={238} fill="#3a4250" /><rect x={180} y={-238} width={6} height={238} fill="#3a4250" />
        <rect x={-180} y={-232} width={360} height={150} fill="#bfe0f0" opacity={0.25} />
        <rect x={-150} y={-78} width={300} height={10} fill="#8a6a4a" />
        <rect x={-120} y={-196} width={240} height={90} fill="#2f6ea8" /><Tx x={0} y={-138} size={46} fill="#fff">ОСТАНОВКА</Tx>
      </g>
      <Chars list={[{look: CROWD, x: 960, y: 1000, pose: poseSit({mood: 'scared', lean: 30}), s: 1}, ...(res > 0 ? [{look: {...MEDIC}, x: lerp(1500, 1090, k), y: 1010, pose: poseWalk(t, 3.4, 12), flip: true, s: 1}, {look: {...MEDIC, pants: '#2f6ea8'}, x: lerp(1700, 1190, k), y: 1020, pose: poseWalk(t + 0.3, 3.4, 12), flip: true, s: 1}] : [])]} />
      {res > 0 && <g transform={`translate(${lerp(2300, 1500, E(t, 0, 3))} 960)`}><rect x={-140} y={-130} width={280} height={110} rx={14} fill="#f2f4f7" /><rect x={-140} y={-80} width={280} height={14} fill="#e0322c" /><circle cx={-80} cy={-18} r={22} fill="#15171c" /><circle cx={80} cy={-18} r={22} fill="#15171c" /><circle cx={-60} cy={-146} r={12} fill={Math.sin(t * 14) > 0 ? '#ff3b3b' : '#3b6bff'} /><circle cx={-20} cy={-146} r={12} fill={Math.sin(t * 14) > 0 ? '#3b6bff' : '#ff3b3b'} /></g>}
    </g>
  );
};

export const Supermarket: React.FC<{t: number; crowd: number}> = ({t, crowd}) => (
  <g>
    <Full c="#c9b99a" />
    <rect x={-200} y={820} width={2400} height={400} fill="#6a6460" />
    <g transform="translate(960 560)">
      <rect x={-700} y={-300} width={1400} height={600} fill="#e6dccb" />
      <rect x={-700} y={-300} width={1400} height={110} fill="#d2432f" />
      <Tx x={0} y={-218} size={84} fill="#fff">СУПЕРМАРКЕТ</Tx>
      <rect x={-600} y={-120} width={1200} height={420} fill="#7a828f" />
      {Array.from({length: 12}).map((_, i) => <rect key={i} x={-600} y={-112 + i * 34} width={1200} height={4} fill="#4a5058" />)}
      <rect x={-130} y={-40} width={260} height={90} fill="#fff" /><Tx x={0} y={22} size={50} fill="#c0392b">ЗАКРЫТО</Tx>
    </g>
    {Array.from({length: Math.round(22 * crowd)}).map((_, i) => {
      const x = 240 + (i % 11) * 140 + rnd(i) * 40, y = 940 + Math.floor(i / 11) * 70 + rnd(i + 3) * 20;
      const sway = Math.sin(t * 2 + i) * 4;
      return <g key={i} transform={`translate(${x + sway} ${y})`}><rect x={-30} y={-130} width={60} height={110} rx={26} fill="#1a1d24" /><circle cx={0} cy={-158} r={28} fill="#1a1d24" /><rect x={-24} y={-26} width={18} height={30} fill="#15171c" /><rect x={6} y={-26} width={18} height={30} fill="#15171c" /></g>;
    })}
    <rect x={-1500} y={-600} width={7200} height={1900} fill="#ff9a30" opacity={0.12} />
  </g>
);

export const Jam: React.FC<{t: number; dash: number}> = ({t, dash}) => {
  if (dash) {
    return (
      <g>
        <Full c="#0e1118" />
        <rect x={320} y={300} width={1280} height={520} rx={40} fill="#1a1e27" stroke="#2a303c" strokeWidth={8} />
        <circle cx={620} cy={560} r={190} fill="#0a0c11" stroke="#3a4050" strokeWidth={8} />
        <circle cx={1300} cy={560} r={190} fill="#0a0c11" stroke="#3a4050" strokeWidth={8} />
        <path d="M470 700 A190 190 0 0 1 770 700" stroke="#3aa0ff" strokeWidth={14} fill="none" />
        <path d="M1150 700 A190 190 0 0 1 1450 700" stroke="#ff4a3a" strokeWidth={14} fill="none" />
        <line x1={1300} y1={560} x2={1300 + 150 * Math.cos(lerp(2.4, 5.3, 0.88 + Math.sin(t * 9) * 0.02))} y2={560 + 150 * Math.sin(lerp(2.4, 5.3, 0.88 + Math.sin(t * 9) * 0.02))} stroke="#ff4a3a" strokeWidth={10} strokeLinecap="round" />
        <g transform="translate(960 470)" opacity={0.55 + 0.45 * Math.sin(t * 10)}>
          <rect x={-60} y={-60} width={120} height={120} rx={20} fill="#3a0a08" stroke="#ff3b3b" strokeWidth={6} />
          <path d="M-30 30 L-30 -30 L10 -30 M-30 0 L0 0" stroke="#ff3b3b" strokeWidth={8} fill="none" />
          <path d="M-30 18 q10 -10 20 0 t20 0 t20 0" stroke="#ff3b3b" strokeWidth={6} fill="none" />
        </g>
        <Tx x={960} y={780} size={54} fill="#ff8a7a">ПЕРЕГРЕВ ДВИГАТЕЛЯ</Tx>
        <Glow x={960} y={560} r={900} c="#ff3b3b" o={0.12 + 0.06 * Math.sin(t * 8)} id="jd63" />
      </g>
    );
  }
  const cols = ['#c0392b', '#2f6fb5', '#e8e8e8', '#2a2f38', '#e0a22a', '#3a8a5a'];
  return (
    <g>
      <CityScene t={t} p={{hot: 0.8, cars: 0, aband: 0.0, cx: 960}} />
      {Array.from({length: 12}).map((_, i) => <CarSvg key={i} x={-200 + i * 330 + (i % 2) * 14} y={i % 2 ? 1030 : 965} col={cols[i % cols.length]} s={i % 2 ? 1.25 : 1.1} smoke={i % 4 === 1 ? 0.7 : 0} />)}
      {[0, 1, 2, 3].map((i) => <g key={i} opacity={0.5 + 0.5 * Math.sin(t * 6 + i)}><circle cx={300 + i * 520} cy={830} r={10} fill="#ff3b3b" /></g>)}
      {Array.from({length: 8}).map((_, i) => <path key={i} d={`M${100 + i * 240} 800 q10 -40 0 -80 q-10 -40 0 -80`} stroke="#fff" strokeOpacity={0.3} strokeWidth={6} fill="none" transform={`translate(0 ${Math.sin(t * 3 + i) * 6})`} />)}
    </g>
  );
};

export const CoolCenter: React.FC<{t: number; lit: number; max: number}> = ({t, lit, max}) => (
  <g>
    <CityScene t={t} p={{hot: 0.9, cars: 0, cx: 960}} />
    <rect x={-1500} y={820} width={7200} height={400} fill="#6a6460" />
    <g transform="translate(960 560)">
      <rect x={-640} y={-300} width={1280} height={600} fill="#e3d9c6" />
      <rect x={-640} y={-300} width={1280} height={90} fill="#2f6ea8" /><Tx x={0} y={-236} size={64} fill="#fff">ПУНКТ ОХЛАЖДЕНИЯ</Tx>
      {[-480, -240, 240, 480].map((x) => <g key={x}><rect x={x - 90} y={-150} width={180} height={150} fill="#ffe7a0" opacity={0.95} /><rect x={x - 90} y={-150} width={180} height={150} fill="none" stroke="#7a7a80" strokeWidth={6} /><line x1={x} y1={-150} x2={x} y2={0} stroke="#7a7a80" strokeWidth={4} /></g>)}
      <rect x={-120} y={-150} width={240} height={450} fill="#4a525e" stroke="#2a2f38" strokeWidth={8} />
      <rect x={-120} y={-150} width={240} height={450} fill="#ffe7a0" opacity={lit * 0.3} />
      <circle cx={80} cy={80} r={12} fill="#c0c4cc" />
      <g transform="translate(0 -40)"><rect x={-200} y={-20} width={400} height={60} rx={8} fill="#fff" /><Tx x={0} y={24} size={38} fill="#c0392b">ТОЛЬКО ПЕРСОНАЛ</Tx></g>
    </g>
    {max > 0 && <Chars list={[{look: MAXL, x: 700, y: 1010, pose: poseStand({mood: 'worried', nod: 6, hf: [40, -150], hb: [-12, -126]}), s: 1}]} />}
  </g>
);

export const BusRide: React.FC<{t: number; hot: number; ppl: boolean}> = ({t, hot, ppl}) => {
  const sp = 520;
  const off = (k: number) => -((t * sp * k) % 1800);
  return (
    <g>
      <rect x={-200} y={0} width={2400} height={1080} fill="#2a3340" />
      <g>
        <svg x={150} y={120} width={1620} height={620} viewBox="0 0 1620 620" overflow="hidden">
          <rect width={1620} height={620} fill={mixc('#7fc4ff', '#e8a868', hot)} />
          <g transform={`translate(${off(0.35)} 0)`}>{Array.from({length: 7}).map((_, i) => <rect key={i} x={i * 300} y={160} width={200 + (i % 3) * 40} height={300} fill={mixc('#6a8fb8', '#b49a80', hot)} />)}</g>
          <g transform={`translate(${off(0.8)} 0)`}>{Array.from({length: 8}).map((_, i) => <g key={i}><rect x={i * 260 + 20} y={250} width={200} height={190} fill={mixc('#e0d8c8', '#c0a888', hot)} /><rect x={i * 260 + 36} y={430} width={170} height={10} fill="#6a717c" /></g>)}</g>
          <rect y={440} width={1620} height={180} fill="#555a63" />
          <g transform={`translate(${off(1.5)} 0)`}>{Array.from({length: 10}).map((_, i) => <rect key={i} x={i * 180} y={540} width={90} height={8} fill="#f2e9c0" />)}</g>
          <g transform={`translate(${off(1.1)} 0)`}>{[0, 1, 2, 3].map((i) => <g key={i} transform={`translate(${i * 520 + 140} 470)`}><rect x={-80} y={-50} width={160} height={42} rx={14} fill={['#c0392b', '#2f6fb5', '#8a8f9a', '#e0a22a'][i]} /><rect x={-40} y={-84} width={80} height={36} rx={8} fill="#cfe6f7" /><circle cx={-48} cy={-6} r={16} fill="#15171c" /><circle cx={48} cy={-6} r={16} fill="#15171c" /></g>)}</g>
          <rect width={1620} height={620} fill="#ff9a30" opacity={hot * 0.15} />
          {Array.from({length: 6}).map((_, i) => <path key={i} d={`M0 ${450 + i * 24} ${Array.from({length: 12}).map((__, k) => `L${k * 150} ${450 + i * 24 + Math.sin(t * 3 + k + i) * 6}`).join(' ')}`} stroke="#fff" strokeOpacity={0.12} strokeWidth={4} fill="none" />)}
        </svg>
        <rect x={150} y={120} width={1620} height={620} fill="none" stroke="#1a2028" strokeWidth={22} rx={10} />
        <rect x={150} y={120} width={1620} height={620} fill="#fff" opacity={0.05} />
        <line x1={960} y1={120} x2={960} y2={740} stroke="#1a2028" strokeWidth={18} />
      </g>
      <rect x={-200} y={740} width={2400} height={400} fill="#3a4150" />
      <rect x={-200} y={740} width={2400} height={18} fill="#4a5262" />
      {ppl && <Chars list={[{look: VASYA, x: 520, y: 1010, pose: poseSit({nod: 4}), s: 1.5}, {look: NIKL, x: 900, y: 1010, pose: poseSit({nod: 8, lean: 10}), s: 1.5}]} />}
      {ppl && [320, 1500].map((x, i) => <g key={i} transform={`translate(${x} 1010)`}><rect x={-60} y={-250} width={120} height={150} rx={24} fill="#202530" /><circle cx={0} cy={-282} r={34} fill="#202530" /></g>)}
      <rect x={-200} y={-100} width={2400} height={230} fill="#1d232d" />
      {Array.from({length: 6}).map((_, i) => <rect key={i} x={120 + i * 330} y={30} width={160} height={14} rx={7} fill="#fff6c8" opacity={0.7} />)}
    </g>
  );
};

export const Garage: React.FC<{t: number; car: number; green: number; chars: CS[]; door?: number; bench?: boolean}> = ({t, car, green, chars, door = 0, bench}) => {
  const cols = ['#4a5262', '#7a2a2a', '#2a3a58', '#6a6a70', '#2f4a3a'];
  return (
    <g>
      <defs>
        <radialGradient id="g63g" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#3bff7a" stopOpacity={0.8} /><stop offset="1" stopColor="#3bff7a" stopOpacity={0} /></radialGradient>
      </defs>
      <Full c="#14171d" />
      <rect x={-1500} y={0} width={7200} height={120} fill="#0d0f13" />
      <rect x={-1500} y={880} width={7200} height={400} fill="#262a31" />
      {Array.from({length: 5}).map((_, i) => <rect key={i} x={-700 + i * 700} y={0} width={110} height={900} fill="#323741" />)}
      {Array.from({length: 7}).map((_, i) => <rect key={i} x={-600 + i * 520} y={896} width={70} height={10} fill="#d8b04a" opacity={0.6} />)}
      {Array.from({length: 5}).map((_, i) => <rect key={i} x={-400 + i * 700} y={140} width={160} height={12} fill="#cfd6e0" opacity={Math.sin(t * 7 + i * 2) > -0.6 ? 0.18 : 0.04} />)}
      {[400, 1500, 2300].map((x, i) => <CarSvg key={i} x={x} y={1010} col={cols[i]} s={1.45} flip={i === 1} />)}
      <CarSvg x={900} y={1030} col="#8a8f9a" s={1.6} lights={car > 0.5} smoke={car > 0.5 ? 0.8 : 0} />
      {car > 0.5 && <><circle cx={1040} cy={950} r={90} fill="#fff6c8" opacity={0.18} /></>}
      <g transform="translate(2850 780)">
        <rect x={-160} y={-420} width={320} height={420} fill="#4a525e" stroke="#2a2f38" strokeWidth={10} />
        <rect x={-150 + door * 150} y={-410} width={300 - door * 150} height={400} fill="#5a6270" />
        <rect x={-150} y={-410} width={300} height={400} fill="#ffe7a0" opacity={door * 0.5} />
        <circle cx={100} cy={-210} r={14} fill="#c0c4cc" />
        <circle cx={0} cy={-460} r={16} fill="#3bff7a" opacity={green} />
        <circle cx={0} cy={-460} r={160} fill="url(#g63g)" opacity={green * (0.7 + 0.3 * Math.sin(t * 5))} />
      </g>
      {bench && <g transform="translate(470 905)"><rect x={-260} y={0} width={520} height={20} rx={6} fill="#7a5a3a" /><rect x={-230} y={20} width={16} height={100} fill="#4a3a2a" /><rect x={214} y={20} width={16} height={100} fill="#4a3a2a" /></g>}
      <Chars list={chars} />
    </g>
  );
};

export const FinalCity: React.FC<{t: number; rec: number; cx: number}> = ({t, rec, cx}) => (
  <g>
    <CityScene t={t} p={{hot: lerp(0.35, 0, rec), cars: rec, people: rec, cx, outage: 0}} />
    {/* power pole + repair crew */}
    <g transform="translate(1500 880)">
      <rect x={-12} y={-560} width={24} height={560} fill="#6a4a30" /><rect x={-150} y={-540} width={300} height={14} fill="#6a4a30" />
      <path d={`M-150 -526 Q-400 -440 -700 -520 M150 -526 Q500 -430 900 -520`} stroke="#15171c" strokeWidth={5} fill="none" />
      <g transform="translate(0 -300)"><rect x={-70} y={-20} width={140} height={40} rx={8} fill="#e8862a" /><rect x={-4} y={20} width={8} height={300} fill="#3a4150" /></g>
    </g>
    <g transform="translate(1420 770)"><rect x={-26} y={-60} width={52} height={50} rx={10} fill="#e8862a" /><circle cx={0} cy={-84} r={20} fill="#d9a47e" /><rect x={-24} y={-110} width={48} height={22} rx={10} fill="#f2f2f2" /></g>
    <Chars list={[{look: WORKER, x: 1620, y: 1010, pose: poseReach(70, -140, {lean: 10}), flip: true, s: 1}, {look: WORKER, x: 1760, y: 1020, pose: poseStand(), flip: true, s: 1}]} />
    <g transform="translate(2100 1030)"><rect x={-170} y={-150} width={340} height={120} rx={14} fill="#e8862a" /><rect x={-170} y={-150} width={110} height={90} fill="#bfe0f0" /><circle cx={-100} cy={-26} r={26} fill="#15171c" /><circle cx={100} cy={-26} r={26} fill="#15171c" /></g>
  </g>
);
