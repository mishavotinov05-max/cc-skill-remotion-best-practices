import React from 'react';
import {clamp, lerp, rnd, Tx, Glow, E, Pose} from './M60Base';
import {Defs, Dust, P, Full, FaceMini} from './M67Art';
import {PersonV} from './M67Fig';
import {ARTEM, GRAN, BROTHER} from './M67Art';

// ===================== running pose with long, lively strides =====================
export const poseRun = (t: number, mood: Pose['mood'] = 'scared'): Pose => {
  const ph = t * 4.4 * Math.PI * 2;
  const sn = Math.sin(ph), cs = Math.cos(ph);
  const bob = Math.abs(cs) * 12;
  return {
    hip: [0, -98 + bob * 0.5],
    lean: 24 + sn * 2,
    lf: [58 * sn, -Math.max(0, 52 * cs)],
    lb: [-58 * sn, -Math.max(0, -52 * cs)],
    hf: [24 + 52 * sn, -128 - 24 * Math.abs(sn) + 14 * cs],
    hb: [-8 - 52 * sn, -124 + 24 * Math.abs(sn) - 14 * cs],
    nod: -6 + sn * 3,
    mood,
  };
};

export const PhotoWall: React.FC<{photoK: number}> = ({photoK}) => (
  <g transform="translate(2090 320)">
    {/* side frames */}
    <g transform="translate(-230 20)"><rect x={-80} y={-100} width={160} height={200} fill="#2a1a10" /><rect x={-68} y={-88} width={136} height={176} fill="#b8b090" /><rect x={-68} y={10} width={136} height={78} fill="#4a5a3a" /><polygon points="-40,10 0,-50 40,10" fill="#6a4a30" /><rect x={-14} y={-10} width={28} height={20} fill="#e8d890" opacity={0.8} /></g>
    <g transform="translate(240 30)"><rect x={-80} y={-100} width={160} height={200} fill="#2a1a10" /><rect x={-68} y={-88} width={136} height={176} fill="#c0b898" /><FaceMini x={0} y={4} k={0.9} kind="boy" /></g>
    {/* main family photo */}
    <g>
      <rect x={-168} y={-150} width={336} height={300} fill="#2a1a10" stroke="#120a06" strokeWidth={6} />
      <rect x={-152} y={-134} width={304} height={268} fill="#d0c6a8" />
      <rect x={-152} y={-134} width={304} height={268} fill="#6a4a20" opacity={0.15} />
      <FaceMini x={0} y={-6} k={1.0} kind="maniac" dim={0.18} />
      <FaceMini x={-86} y={32} k={1.1} kind="gran" />
      <FaceMini x={86} y={32} k={1.1} kind="man" />
      <rect x={-152} y={-134} width={304} height={268} fill="url(#ph-vig)" opacity={0.5} />
      <rect x={-168} y={150} width={336} height={46} fill="#e8e0c8" /><text x={0} y={182} textAnchor="middle" fontFamily="Caveat, cursive" fontWeight={700} fontSize={34} fill="#2a1a10">Наша семья</text>
      <Glow x={0} y={-10} r={240} c="#ff4a3a" o={0.2 * photoK} id="ph1" />
    </g>
    <defs><radialGradient id="ph-vig" cx="0.5" cy="0.5" r="0.7"><stop offset="0.6" stopColor="#000" stopOpacity={0} /><stop offset="1" stopColor="#1a0e04" stopOpacity={1} /></radialGradient></defs>
  </g>
);

// ===================== house with a proper doorway =====================
export const HouseExt2: React.FC<{t: number; lit?: number; open?: number; inDoor?: React.ReactNode}> = ({t, lit = 1, open = 0, inDoor}) => (
  <g>
    <Defs />
    <defs>
      <linearGradient id="hsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#050a18" /><stop offset="1" stopColor="#1a2438" /></linearGradient>
      <clipPath id="hdoor"><rect x={-90} y={-390} width={180} height={390} /></clipPath>
    </defs>
    <rect x={-300} y={-200} width={3600} height={1100} fill="url(#hsky)" />
    {Array.from({length: 40}).map((_, i) => <circle key={i} cx={rnd(i) * 3000} cy={rnd(i + 2) * 380} r={1.5} fill="#cfe0ff" opacity={0.55} />)}
    <circle cx={420} cy={150} r={46} fill="#e8eef8" opacity={0.9} /><circle cx={440} cy={140} r={44} fill="#1a2438" opacity={0.0} />
    {/* back trees */}
    {[200, 520, 1950, 2300, 2700].map((x, i) => <g key={i} transform={`translate(${x} 800)`}><rect x={-12} y={-340} width={24} height={340} fill="#0a1218" />{[0, 1, 2, 3].map((k) => <polygon key={k} points={`${-110 + k * 14},${-120 - k * 80} ${110 - k * 14},${-120 - k * 80} 0,${-230 - k * 80}`} fill="#0c1a16" />)}</g>)}
    {/* ground */}
    <rect x={-300} y={780} width={3600} height={440} fill={P('dirt')} /><rect x={-300} y={780} width={3600} height={440} fill="#000" opacity={0.45} />
    <path d="M1100 780 L1400 780 L1560 1100 L940 1100 Z" fill="#6a5a46" opacity={0.35} />
    {/* house */}
    <g transform="translate(1250 800)">
      <rect x={-460} y={-440} width={920} height={440} fill={P('wood')} /><rect x={-460} y={-440} width={920} height={440} fill="#000" opacity={0.35} />
      {Array.from({length: 15}).map((_, i) => <rect key={i} x={-460} y={-440 + i * 30} width={920} height={3} fill="#0a0604" opacity={0.55} />)}
      {/* roof */}
      <polygon points="-520,-430 520,-430 380,-600 -380,-600" fill="#2a1a16" /><polygon points="-520,-430 520,-430 500,-410 -500,-410" fill="#120a08" />
      {Array.from({length: 9}).map((_, i) => <line key={i} x1={-440 + i * 110} y1={-430} x2={-340 + i * 85} y2={-600} stroke="#0a0604" strokeOpacity={0.5} strokeWidth={3} />)}
      <rect x={250} y={-690} width={60} height={110} fill="#3a2a22" /><rect x={244} y={-700} width={72} height={14} fill="#1a100c" />
      {/* windows with frames + curtains */}
      {[-310, 190].map((wx, i) => <g key={i} transform={`translate(${wx} -300)`}>
        <rect x={-10} y={-10} width={180} height={160} fill="#1a100a" /><rect x={0} y={0} width={160} height={140} fill="#ffd890" opacity={0.92 * lit} />
        <rect x={0} y={0} width={160} height={140} fill="#ffb060" opacity={0.2 * lit} />
        <path d="M0 0 Q30 70 0 140 L30 140 Q50 70 30 0 Z" fill="#a8483a" opacity={0.85} /><path d="M160 0 Q130 70 160 140 L130 140 Q110 70 130 0 Z" fill="#a8483a" opacity={0.85} />
        <rect x={78} y={0} width={6} height={140} fill="#2a1a10" /><rect x={0} y={66} width={160} height={6} fill="#2a1a10" />
        <rect x={-16} y={146} width={192} height={14} fill="#3a2418" /></g>)}
      {/* door in frame */}
      <rect x={-104} y={-404} width={208} height={404} fill="#1a100a" />
      <g transform="translate(0 0)">
        <g clipPath="url(#hdoor)">
          <rect x={-90} y={-390} width={180} height={390} fill="#ffcf80" opacity={open > 0 ? 0.95 * lit : 0} />
          <rect x={-90} y={-390} width={180} height={390} fill="#3a2a1c" opacity={open > 0 ? 0.0 : 1} />
          {open > 0 && <rect x={-90} y={-390} width={180} height={390} fill="#8a5a30" opacity={0.25} />}
          {open > 0 && inDoor}
        </g>
        {open <= 0 && <g><rect x={-90} y={-390} width={180} height={390} fill={P('wood')} /><rect x={-90} y={-390} width={180} height={390} fill="#000" opacity={0.35} /><rect x={-66} y={-360} width={132} height={150} fill="#000" opacity={0.18} /><rect x={-66} y={-190} width={132} height={150} fill="#000" opacity={0.18} /><circle cx={64} cy={-190} r={9} fill="#c8a85a" /></g>}
        {open > 0 && <polygon points="-90,-390 -150,-370 -150,10 -90,0" fill="#2a1a10" />}
      </g>
      {/* porch */}
      <rect x={-150} y={0} width={300} height={22} fill={P('wood')} /><rect x={-190} y={22} width={380} height={24} fill={P('wood')} /><rect x={-190} y={22} width={380} height={24} fill="#000" opacity={0.3} />
      <rect x={-130} y={-440} width={10} height={440} fill="#1a100a" opacity={0.0} />
      <rect x={-8} y={-460} width={16} height={30} fill="#2a1a10" /><circle cx={0} cy={-440} r={20} fill="#ffe0a0" opacity={0.9 * lit} /><Glow x={0} y={-440} r={220} c="#ffd890" o={0.5 * lit} id="hporch" />
    </g>
    {/* fence */}
    {Array.from({length: 26}).map((_, i) => <g key={i} transform={`translate(${-200 + i * 120} 880)`}><rect x={-7} y={-100} width={14} height={100} fill="#2a1a10" /><polygon points="-9,-100 9,-100 0,-120" fill="#2a1a10" /></g>)}
    <rect x={-300} y={820} width={3600} height={10} fill="#2a1a10" /><rect x={-300} y={852} width={3600} height={10} fill="#2a1a10" />
    <Glow x={1000} y={560} r={600} c="#ffc070" o={0.4 * lit} id="he1" /><Glow x={1500} y={560} r={600} c="#ffc070" o={0.4 * lit} id="he2" />
    <Dust t={t} x={0} y={100} w={2400} h={700} n={18} />
    <rect x={-300} y={-200} width={3600} height={1400} fill="#010308" opacity={0.15} />
  </g>
);

// ===================== profile heads (for the car) =====================
const ProfileHead: React.FC<{x: number; y: number; k: number; who: 'oleg' | 'lera'; flip?: boolean}> = ({x, y, k, who, flip}) => {
  const skin = who === 'lera' ? '#e0b898' : '#b88a6a';
  const hair = who === 'lera' ? '#6a2a1a' : '#2a2018';
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -k : k} ${k})`}>
      {who === 'lera' && <path d="M-26 -10 Q-40 40 -30 90 Q-6 100 6 80 Q-4 30 6 -4 Z" fill={hair} />}
      <rect x={-12} y={26} width={26} height={30} fill={skin} />
      <ellipse cx={-4} cy={0} rx={30} ry={34} fill={skin} />
      <path d="M26 -2 Q40 8 28 14 Q24 14 25 8 Z" fill={skin} />
      <path d={who === 'lera' ? 'M-36 4 Q-40 -40 0 -42 Q30 -40 30 -16 Q10 -28 -14 -22 Q-30 -18 -36 4 Z' : 'M-34 0 Q-36 -36 0 -38 Q30 -36 30 -14 Q8 -24 -14 -20 Q-30 -16 -34 0 Z'} fill={hair} />
      <ellipse cx={14} cy={-4} rx={6} ry={5.5} fill="#fff" /><circle cx={16} cy={-4} r={3} fill="#1a1010" />
      <path d="M8 -12 L24 -12" stroke={hair} strokeWidth={3} strokeLinecap="round" />
      <path d={who === 'lera' ? 'M14 20 Q22 24 28 20' : 'M12 20 Q22 22 26 18'} stroke={who === 'lera' ? '#b04a4a' : '#5a2a20'} strokeWidth={3} fill="none" strokeLinecap="round" />
      {who === 'oleg' && Array.from({length: 12}).map((_, i) => <circle key={i} cx={4 + (i % 6) * 4} cy={14 + Math.floor(i / 6) * 6} r={1.3} fill="#1a1410" opacity={0.6} />)}
      <ellipse cx={-10} cy={6} rx={5} ry={8} fill="#000" opacity={0.12} />
    </g>
  );
};

// ===================== detailed car, side view, facing right =====================
export const CarSide: React.FC<{t: number; x: number; y: number; k?: number; doorOpen?: number; lights?: number; people?: boolean; leraIn?: boolean; flip?: boolean; body?: string}> = ({t, x, y, k = 1, doorOpen = 0, lights = 1, people = true, leraIn = true, flip = false, body = '#3e4a56'}) => (
  <g transform={`translate(${x} ${y}) scale(${flip ? -k : k} ${k})`}>
    <ellipse cx={20} cy={10} rx={300} ry={20} fill="#000" opacity={0.55} />
    {/* headlight cone */}
    {lights > 0 && <polygon points="262,-92 760,-170 760,-6 262,-70" fill="#fff3b0" opacity={0.14 * lights} />}
    {/* body */}
    <path d="M-270 -26 L-270 -104 Q-268 -128 -240 -134 L-150 -142 Q-120 -212 -40 -222 L120 -222 Q190 -218 226 -148 L262 -136 Q286 -126 288 -92 L288 -26 Z" fill={body} />
    <path d="M-270 -26 L-270 -104 Q-268 -128 -240 -134 L-150 -142 L288 -92 L288 -26 Z" fill="#000" opacity={0.22} />
    <path d="M-250 -80 L282 -72" stroke="#fff" strokeOpacity={0.12} strokeWidth={4} />
    {/* roof highlight */}
    <path d="M-110 -218 Q-30 -226 120 -224" stroke="#fff" strokeOpacity={0.25} strokeWidth={4} fill="none" />
    <defs><clipPath id="cwin"><path d="M0 -212 L116 -212 Q168 -208 200 -148 L0 -148 Z" /></clipPath></defs>
    {/* windows */}
    <path d="M-132 -146 Q-110 -206 -46 -212 L-20 -212 L-20 -146 Z" fill="#0c1218" />
    <path d="M0 -212 L116 -212 Q168 -208 200 -148 L0 -148 Z" fill="#0c1218" />
    <path d="M-132 -146 Q-110 -206 -46 -212 L-20 -212 L-20 -146 Z" fill="#6a8ab0" opacity={0.18} /><path d="M0 -212 L116 -212 Q168 -208 200 -148 L0 -148 Z" fill="#6a8ab0" opacity={0.18} />
    {people && <g clipPath="url(#cwin)">
      {/* far occupant (driver), dimmer and a bit behind */}
      <g opacity={0.9}>
        <rect x={104} y={-196} width={46} height={60} rx={14} fill="#1a1c20" />
        <ellipse cx={128} cy={-150} rx={30} ry={16} fill="#3a3226" />
        <ProfileHead x={128} y={-176} k={0.52} who="oleg" />
      </g>
      {/* near occupant */}
      {leraIn && <g>
        <rect x={32} y={-198} width={44} height={64} rx={14} fill="#24272c" />
        <ellipse cx={86} cy={-148} rx={34} ry={17} fill="#6a2a3a" />
        <ProfileHead x={88} y={-177} k={0.56} who="lera" />
      </g>}
    </g>}
    <path d="M0 -212 L116 -212 Q168 -208 200 -148 L0 -148 Z" fill="#6a8ab0" opacity={0.16} />
    {/* pillar + door lines + handles */}
    <rect x={-22} y={-214} width={22} height={150} fill={body} /><path d="M-22 -214 L-22 -30 M154 -150 L154 -30 M-168 -140 L-168 -30" stroke="#000" strokeOpacity={0.5} strokeWidth={3} />
    <rect x={-10} y={-106} width={34} height={8} rx={4} fill="#aab2ba" /><rect x={116} y={-108} width={34} height={8} rx={4} fill="#aab2ba" />
    {/* rear door ajar */}
    {doorOpen > 0 && <g transform={`translate(-22 0)`}><polygon points={`0,-214 ${-70 * doorOpen},-196 ${-70 * doorOpen},-34 0,-30`} fill="#2a343e" stroke="#000" strokeOpacity={0.5} strokeWidth={3} /><polygon points={`0,-214 ${-70 * doorOpen},-196 ${-70 * doorOpen},-150 0,-148`} fill="#0c1218" /></g>}
    {/* bumpers, grille, lights */}
    <rect x={-290} y={-52} width={34} height={26} rx={8} fill="#14181c" /><rect x={266} y={-52} width={34} height={26} rx={8} fill="#14181c" />
    <rect x={284} y={-90} width={12} height={22} rx={4} fill="#fff3b0" /><Glow x={290} y={-80} r={90} c="#fff3b0" o={0.6 * lights} id="cl1" />
    <rect x={-274} y={-96} width={10} height={22} rx={3} fill="#c02020" /><Glow x={-274} y={-84} r={50} c="#ff2a2a" o={0.4} id="cl2" />
    <rect x={-168} y={-44} width={308} height={18} fill="#000" opacity={0.18} />
    <rect x={230} y={-134} width={44} height={28} rx={8} fill={body} stroke="#000" strokeOpacity={0.4} strokeWidth={2} />
    {/* wheels */}
    {[-150, 170].map((wx, i) => <g key={i} transform={`translate(${wx} -22)`}><circle r={50} fill="#08090b" /><circle r={31} fill="#8a929a" /><circle r={27} fill="#30363c" />{[0, 1, 2, 3, 4].map((s) => <rect key={s} x={-3} y={-26} width={6} height={22} fill="#8a929a" transform={`rotate(${s * 72 + t * 20})`} />)}<circle r={7} fill="#aab2ba" /></g>)}
    <rect x={-80} y={-34} width={72} height={20} rx={4} fill="#d8d8c8" /><text transform={flip ? "translate(-44 -18) scale(-1 1)" : undefined} x={flip ? 0 : -44} y={flip ? 0 : -18} textAnchor="middle" fontFamily="Montserrat, sans-serif" fontWeight={800} fontSize={13} fill="#222">А 417 ВР</text>
  </g>
);

// ===================== detailed car interior (view from back seat) =====================
export const CarInside2: React.FC<{t: number; eyes?: number; note?: number; apron?: number; dark?: number; smoke?: number; speed?: number; leraTurn?: number; olegTurn?: number}> = ({t, eyes = 0, note = 0, apron = 0, dark = 0.3, smoke = 0, speed = 300, leraTurn = 0, olegTurn = 0}) => {
  const sway = Math.sin(t * 1.3) * 3;
  return (
    <g>
      <Defs />
      <defs>
        <linearGradient id="dash" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#2a2e34" /><stop offset="1" stopColor="#0a0c10" /></linearGradient>
        <linearGradient id="roof" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#3a3e44" /><stop offset="1" stopColor="#14171b" /></linearGradient>
        <linearGradient id="glass" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#fff" stopOpacity={0.12} /><stop offset="0.4" stopColor="#fff" stopOpacity={0} /></linearGradient>
      </defs>
      <rect x={-300} y={-100} width={3600} height={1300} fill="#04060a" />
      {/* windshield view */}
      <svg x={380} y={90} width={1160} height={500} viewBox="0 0 1160 500" overflow="hidden">
        <rect width={1160} height={500} fill="#34425e" /><rect y={0} width={1160} height={230} fill="#4a5a76" opacity={0.6} />
        <rect y={280} width={1160} height={220} fill="#12100c" />
        {Array.from({length: 16}).map((_, i) => { const xx = ((i * 190 - t * speed * (0.4 + rnd(i))) % 2400 + 2400) % 2400 - 400; return <g key={i} transform={`translate(${xx} 300)`}><rect x={-6} y={-220} width={12} height={220} fill="#05080a" />{[0, 1, 2].map((k) => <polygon key={k} points={`${-80 + k * 12},${-60 - k * 60} ${80 - k * 12},${-60 - k * 60} 0,${-170 - k * 60}`} fill="#060a0c" />)}</g>; })}
        <path d="M0 500 L440 310 L720 310 L1160 500 Z" fill="#2a251c" /><path d="M570 310 L590 310 L640 500 L540 500 Z" fill="#bba458" opacity={0.55} />
        <path d="M580 300 L580 312" stroke="#fff" opacity={0} />
      </svg>
      <rect x={380} y={90} width={1160} height={500} fill="url(#glass)" />
      <rect x={380} y={90} width={1160} height={500} fill="none" stroke="#06080b" strokeWidth={30} />
      {/* A pillars + roof */}
      <polygon points="300,0 520,0 400,110 380,600 300,700" fill="#0c0e12" /><polygon points="1620,0 1400,0 1520,110 1540,600 1620,700" fill="#0c0e12" />
      <rect x={300} y={-60} width={1320} height={110} fill="url(#roof)" />
      <rect x={880} y={50} width={160} height={30} fill="#0a0c10" />
      {/* dashboard */}
      <path d="M240 700 Q960 560 1680 700 L1680 760 L240 760 Z" fill="url(#dash)" />
      <path d="M260 610 Q960 530 1660 610 L1660 700 Q960 600 260 700 Z" fill="#0a0c10" />
      <g transform="translate(560 690)"><circle r={74} fill="#0c0e12" stroke="#3a3e44" strokeWidth={4} /><circle r={52} fill="#14161a" /><circle cx={-22} cy={4} r={14} fill="#2a8a5a" opacity={0.5} /><circle cx={22} cy={4} r={14} fill="#c8803a" opacity={0.5} /><line x1={-22} y1={4} x2={-12 + Math.sin(t) * 3} y2={-6} stroke="#e8e0c8" strokeWidth={2} /></g>
      <g transform="translate(960 690)"><rect x={-60} y={-28} width={120} height={56} rx={8} fill="#0a0c10" /><rect x={-52} y={-20} width={104} height={40} fill="#1a2a2a" opacity={0.9} /><text x={0} y={7} textAnchor="middle" fontFamily="Montserrat, sans-serif" fontWeight={800} fontSize={20} fill="#6adab0" opacity={0.7}>FM 101.2</text></g>
      <rect x={360} y={750} width={1200} height={30} fill="#06070a" />
      {/* steering wheel (driver, left) with hands */}
      <g transform={`translate(560 840) rotate(${sway})`}><ellipse cx={0} cy={0} rx={190} ry={78} fill="none" stroke="#0a0b0e" strokeWidth={26} /><ellipse cx={0} cy={0} rx={190} ry={78} fill="none" stroke="#2a2d32" strokeWidth={4} opacity={0.6} /><rect x={-26} y={-16} width={52} height={30} rx={12} fill="#14161a" /></g>
      {/* front seats */}
      <g transform={`translate(540 1090)`}>
        <path d="M-230 0 L-210 -440 Q-80 -500 110 -440 L130 0 Z" fill={P('leather')} /><path d="M-230 0 L-210 -440 Q-80 -500 110 -440 L130 0 Z" fill="#000" opacity={0.5} />
        <rect x={-170} y={-520} width={190} height={110} rx={40} fill="#14161a" />
        {/* Oleg: short dark hair, thick neck, brown jacket collar */}
        <g transform={`translate(${-60 + olegTurn * 40} -${540 - olegTurn * 4}) `}>
          <rect x={-46} y={30} width={92} height={90} rx={26} fill="#4a4030" />
          <rect x={-30} y={-10} width={60} height={50} rx={14} fill="#a87a5a" />
          {olegTurn < 0.4 ? <ellipse cx={0} cy={-46} rx={50} ry={58} fill="#2a2018" /> : <g>
            <ellipse cx={0} cy={-44} rx={50} ry={58} fill="#b88a6a" /><path d="M-52 -50 Q-52 -108 0 -108 Q52 -108 52 -50 Q20 -80 -52 -50 Z" fill="#2a2018" />
            <path d="M-34 -60 L-10 -50 M34 -60 L10 -50" stroke="#1a1410" strokeWidth={7} strokeLinecap="round" />
            <ellipse cx={-22} cy={-44} rx={9} ry={6} fill="#e8e0d0" /><ellipse cx={22} cy={-44} rx={9} ry={6} fill="#e8e0d0" /><circle cx={-20} cy={-44} r={3.4} fill="#1a1010" /><circle cx={24} cy={-44} r={3.4} fill="#1a1010" />
            <path d="M-12 -18 Q0 -6 12 -18" stroke="#000" strokeOpacity={0.3} strokeWidth={3} fill="none" /><path d="M-22 -4 Q0 4 22 -4" stroke="#4a2a20" strokeWidth={4} fill="none" strokeLinecap="round" />
            {Array.from({length: 28}).map((_, i) => <circle key={i} cx={-26 + (i % 9) * 6} cy={-8 + Math.floor(i / 9) * 7} r={1.4} fill="#1a1410" opacity={0.6} />)}
          </g>}
          {olegTurn < 0.4 && <ellipse cx={46} cy={-46} rx={9} ry={14} fill="#a87a5a" />}
        </g>
      </g>
      <g transform={`translate(1380 1090)`}>
        <path d="M-230 0 L-210 -440 Q-80 -500 110 -440 L130 0 Z" fill={P('leather')} /><path d="M-230 0 L-210 -440 Q-80 -500 110 -440 L130 0 Z" fill="#000" opacity={0.5} />
        <rect x={-170} y={-520} width={190} height={110} rx={40} fill="#14161a" />
        {/* Lera: long auburn hair, red jacket */}
        <g transform={`translate(${-50 - leraTurn * 20} -${540}) `}>
          <rect x={-42} y={34} width={84} height={86} rx={26} fill="#6a2a3a" />
          <path d="M-46 -20 Q-56 60 -40 130 L40 130 Q58 60 46 -20 Z" fill="#6a2a1a" />
          {leraTurn < 0.4 ? <ellipse cx={0} cy={-44} rx={46} ry={56} fill="#6a2a1a" /> : <g>
            <ellipse cx={0} cy={-44} rx={42} ry={54} fill="#e0b898" /><path d="M-46 -40 Q-48 -104 0 -104 Q48 -104 46 -40 Q30 -78 8 -76 Q-20 -76 -46 -40 Z" fill="#6a2a1a" /><path d="M-46 -40 Q-52 20 -40 60 L-32 20 Q-34 -20 -40 -50 Z" fill="#6a2a1a" /><path d="M46 -40 Q52 20 40 60 L32 20 Q34 -20 40 -50 Z" fill="#6a2a1a" />
            <path d="M-32 -60 L-10 -56 M32 -60 L10 -56" stroke="#4a1a10" strokeWidth={4} strokeLinecap="round" />
            <ellipse cx={-17} cy={-44} rx={10} ry={8} fill="#fff" /><ellipse cx={17} cy={-44} rx={10} ry={8} fill="#fff" /><circle cx={-16} cy={-44} r={5} fill="#3a6a5a" /><circle cx={18} cy={-44} r={5} fill="#3a6a5a" /><circle cx={-16} cy={-44} r={2.4} fill="#0a0a0a" /><circle cx={18} cy={-44} r={2.4} fill="#0a0a0a" />
            <path d="M-3 -34 Q-6 -18 2 -16" stroke="#000" strokeOpacity={0.25} strokeWidth={2.4} fill="none" /><path d="M-10 -4 Q0 4 10 -4" stroke="#b04a4a" strokeWidth={5} fill="none" strokeLinecap="round" />
            <circle cx={-26} cy={-22} r={1.6} fill="#a8785a" /><circle cx={22} cy={-24} r={1.6} fill="#a8785a" /><circle cx={0} cy={-24} r={1.6} fill="#a8785a" />
          </g>}
        </g>
      </g>
      {/* rear mirror */}
      <g transform="translate(960 150)"><rect x={-150} y={-30} width={300} height={70} rx={14} fill="#0a0c10" stroke="#1a1c22" strokeWidth={6} /><rect x={-140} y={-22} width={280} height={54} rx={10} fill="#1a2430" />
        {eyes > 0 && <g opacity={eyes}><ellipse cx={-30} cy={10} rx={18} ry={7} fill="#e8e8e0" /><circle cx={-30} cy={10} r={5} fill="#0a0a0a" /><ellipse cx={30} cy={10} rx={18} ry={7} fill="#e8e8e0" /><circle cx={30} cy={10} r={5} fill="#0a0a0a" /><path d="M-52 -4 L-8 0 M8 0 L52 -4" stroke={olegTurn > 0 ? '#1a1410' : '#3a1a10'} strokeWidth={5} /><path d="M-6 38 L6 38" stroke="#000" strokeWidth={0} /></g>}</g>
      {/* note / napkins */}
      {note > 0 && <g transform="translate(960 800) rotate(-5)" opacity={note}><rect x={-190} y={-110} width={380} height={220} fill={P('paper')} /><rect x={-190} y={-110} width={380} height={220} fill="#000" opacity={0.12} /><text x={0} y={-30} textAnchor="middle" fontFamily="Caveat, cursive" fontWeight={700} fontSize={50} fill="#1a1a1a">Не рассказывай ему</text><text x={0} y={30} textAnchor="middle" fontFamily="Caveat, cursive" fontWeight={700} fontSize={50} fill="#1a1a1a">ничего! Он один из них</text></g>}
      {apron > 0 && <g transform="translate(960 880)" opacity={apron}><path d="M-220 0 L-180 -160 Q0 -210 190 -160 L230 0 Z" fill={P('leather')} /><path d="M-220 0 L-180 -160 Q0 -210 190 -160 L230 0 Z" fill="#000" opacity={0.35} /><rect x={20} y={-120} width={110} height={90} fill="#000" opacity={0.3} /><Tx x={75} y={-62} size={50} fill="#c8a868">12</Tx></g>}
      {smoke > 0 && Array.from({length: 7}).map((_, i) => <ellipse key={i} cx={720 + i * 30 + Math.sin(t + i) * 30} cy={560 - ((t * 30 + i * 60) % 320)} rx={60 + i * 16} ry={30 + i * 6} fill="#b8b8c0" opacity={0.1 * smoke} />)}
      <Dust t={t} x={300} y={100} w={1300} h={700} n={14} />
      <rect x={-300} y={-100} width={3600} height={1300} fill="#010308" opacity={dark} />
    </g>
  );
};

// ===================== first-person running =====================
export const PovRun: React.FC<{t: number; a: number; b: number; env: 'basement' | 'kitchen' | 'door'}> = ({t, a, b, env}) => {
  const k = clamp((t - a) / Math.max(0.01, b - a));
  const ph = t * 4.2 * Math.PI * 2;
  const sn = Math.sin(ph), cs = Math.cos(ph);
  const bobY = Math.abs(cs) * 22 + Math.sin(t * 3) * 3, bobX = sn * 14;
  const vpx = 960 + bobX + Math.sin(t * 1.7) * 10, vpy = 470 + bobY * 0.4;
  const col = env === 'basement' ? {wall: '#2c343e', floor: '#222830', ceil: '#12161c', seam: '#0a0e12', end: '#ffcf80'}
    : env === 'kitchen' ? {wall: '#4a5a5c', floor: '#4a3a2a', ceil: '#2a3234', seam: '#1a2224', end: '#a8d890'} : {wall: '#3a3a30', floor: '#3a2e22', ceil: '#202428', seam: '#14161a', end: '#cfe0ff'};
  const endK = env === 'door' ? 0.9 + k * 0.1 : k;
  const endW = 130 + endK * endK * 900, endH = endW * 1.5;
  const spd = 3.2 + k * 1.5;
  const lines = Array.from({length: 14}).map((_, i) => ((i - t * spd) % 14 + 14) % 14 + 0.25);
  const H = 520;
  const kick = 8 * Math.abs(cs);
  return (
    <g>
      <Defs />
      <Full c="#04060a" />
      <g transform={`translate(${-bobX * 0.5} ${-bobY * 0.3}) rotate(${sn * 1.2} 960 540)`}>
        {/* ceiling, walls, floor as perspective quads */}
        <polygon points={`-200,-200 2120,-200 ${vpx + endW / 2},${vpy - endH / 2} ${vpx - endW / 2},${vpy - endH / 2}`} fill={col.ceil} />
        <polygon points={`-200,-200 ${vpx - endW / 2},${vpy - endH / 2} ${vpx - endW / 2},${vpy + endH / 2} -200,1300`} fill={col.wall} />
        <polygon points={`2120,-200 ${vpx + endW / 2},${vpy - endH / 2} ${vpx + endW / 2},${vpy + endH / 2} 2120,1300`} fill={col.wall} />
        <polygon points={`-200,1300 ${vpx - endW / 2},${vpy + endH / 2} ${vpx + endW / 2},${vpy + endH / 2} 2120,1300`} fill={col.floor} />
        {/* depth lines: floor planks / ceiling lamps / wall seams */}
        {lines.map((d, i) => {
          const f = 1 / d;
          const y = vpy + endH / 2 + (1300 - vpy - endH / 2) * Math.pow(f, 1.1) * 1.0;
          const yc = vpy - endH / 2 - (vpy - endH / 2 + 200) * Math.pow(f, 1.1);
          const xl = vpx - endW / 2 - (vpx - endW / 2 + 200) * Math.pow(f, 1.1), xr = vpx + endW / 2 + (2120 - vpx - endW / 2) * Math.pow(f, 1.1);
          const op = clamp(1.4 - d / 10);
          return (
            <g key={i} opacity={op}>
              <line x1={vpx - endW / 2 - (vpx - endW / 2 + 200) * Math.pow(f, 1.1)} y1={y} x2={xr} y2={y} stroke={col.seam} strokeWidth={4 + 10 * f} />
              <line x1={xl} y1={yc} x2={xl} y2={y} stroke={col.seam} strokeWidth={3 + 8 * f} />
              <line x1={xr} y1={yc} x2={xr} y2={y} stroke={col.seam} strokeWidth={3 + 8 * f} />
              {env !== 'door' && <ellipse cx={vpx} cy={yc + 10} rx={26 + 120 * f} ry={6 + 18 * f} fill="#fff3c0" opacity={0.5} />}
              {env === 'basement' && i % 3 === 0 && <rect x={xl} y={yc + (y - yc) * 0.3} width={8 + 40 * f} height={(y - yc) * 0.08 + 4} fill="#6a3a24" />}
              {env === 'kitchen' && i % 2 === 0 && <rect x={xr - 30 * f - 6} y={yc + (y - yc) * 0.25} width={30 * f + 6} height={(y - yc) * 0.5} fill="#8a6a46" opacity={0.7} />}
            </g>
          );
        })}
        {/* the end of the passage: stairs door / front door / outside */}
        <g transform={`translate(${vpx} ${vpy})`}>
          <rect x={-endW / 2} y={-endH / 2} width={endW} height={endH} fill={col.end} />
          <Glow x={0} y={0} r={endW * 1.3} c={col.end} o={0.7} id={`pe${env}`} />
          {env === 'door' && <g>
            <rect x={-endW / 2} y={endH * 0.18} width={endW} height={endH * 0.32} fill="#2a2e24" />
            {Array.from({length: 9}).map((_, q) => { const tx = (-0.44 + q * 0.11) * endW, th = endH * (0.34 + 0.12 * ((q * 7) % 3) / 2); return <g key={q}><rect x={tx - endW * 0.008} y={endH * 0.2 - th} width={endW * 0.016} height={th} fill="#0a1218" />{[0, 1, 2].map((z) => <polygon key={z} points={`${tx - endW * (0.06 - z * 0.012)},${endH * 0.2 - th * (0.2 + z * 0.22)} ${tx + endW * (0.06 - z * 0.012)},${endH * 0.2 - th * (0.2 + z * 0.22)} ${tx},${endH * 0.2 - th * (0.5 + z * 0.24)}`} fill="#0c1a18" />)}</g>; })}
          </g>}
          {env === 'basement' && <g>{[0, 1, 2, 3, 4].map((s) => <rect key={s} x={-endW / 2} y={endH / 2 - 30 - s * 34 * (endW / 200)} width={endW} height={6} fill="#000" opacity={0.35} />)}</g>}
          {env === 'kitchen' && <rect x={-endW / 2} y={-endH / 2} width={endW} height={endH} fill="none" stroke="#2a1a10" strokeWidth={14} />}
        </g>
      </g>
      {/* hands pumping at bottom corners */}
      <g transform={`translate(0 ${kick})`}>
        {[-1, 1].map((sd) => {
          const sw = (sd === 1 ? sn : -sn);
          const hx = 960 + sd * (320 - sw * 40), hy = 1010 - Math.max(0, sw) * 150 + 40;
          return (
            <g key={sd}>
              <path d={`M${960 + sd * 520} 1160 Q${960 + sd * 440} ${hy + 120} ${hx} ${hy}`} stroke="#0b0c10" strokeWidth={96} strokeLinecap="round" fill="none" />
              <path d={`M${960 + sd * 520} 1160 Q${960 + sd * 440} ${hy + 120} ${hx} ${hy}`} stroke="#16181e" strokeWidth={30} strokeLinecap="round" fill="none" opacity={0.7} />
              <ellipse cx={hx} cy={hy - 26} rx={46} ry={54} fill="#cda080" />
              <ellipse cx={hx - sd * 8} cy={hy - 40} rx={30} ry={34} fill="#e2b894" opacity={0.6} />
              {[0, 1, 2].map((f) => <rect key={f} x={hx - 36 + f * 26} y={hy - 82} width={18} height={30} rx={9} fill="#cda080" />)}
            </g>
          );
        })}
      </g>
      {/* motion blur streaks + breath vignette */}
      {Array.from({length: 14}).map((_, i) => { const ang = (i / 14) * 6.28; return <line key={i} x1={vpx + Math.cos(ang) * 420} y1={vpy + Math.sin(ang) * 280} x2={vpx + Math.cos(ang) * 1100} y2={vpy + Math.sin(ang) * 800} stroke="#fff" strokeOpacity={0.05 + 0.04 * rnd(i)} strokeWidth={6} />; })}
      <rect x={-100} y={-100} width={2200} height={1300} fill="url(#vgrad)" opacity={0.35} />
      <ellipse cx={960} cy={540} rx={1100} ry={720} fill="none" stroke="#7a0a0a" strokeWidth={160} opacity={0.12 + 0.1 * Math.abs(cs)} />
      {/* looking back: pursuer silhouette flickers in the first moments */}
      {env === 'basement' && k < 0.4 && <g opacity={0.5 * (1 - k / 0.4) * (Math.sin(t * 9) > 0 ? 1 : 0.4)}><ellipse cx={960} cy={1000} rx={300} ry={40} fill="#000" /></g>}
      <Dust t={t} x={0} y={100} w={1900} h={900} n={20} />
    </g>
  );
};

void lerp; void E;

// ===================== investigator's photos =====================
export const DeskPhoto = (i: number): React.ReactNode => (
  <g>
    <clipPath id={`dpc${i}`}><rect x={-158} y={-108} width={316} height={216} /></clipPath>
    <g clipPath={`url(#dpc${i})`}>
      {i === 0 && <g>
        <rect x={-158} y={-108} width={316} height={216} fill="#2a3444" />
        <rect x={-158} y={52} width={316} height={56} fill="#3a3a38" />
        <rect x={-150} y={-108} width={300} height={170} fill={P('concrete')} opacity={0.5} />
        {[-110, 110].map((wx) => <g key={wx}>{[0, 1].map((r) => <rect key={r} x={wx - 22} y={-90 + r * 60} width={44} height={40} fill="#e8d890" opacity={0.7} stroke="#1a1a1a" strokeWidth={3} />)}</g>)}
        <rect x={-52} y={-30} width={104} height={92} fill="#1a1612" stroke="#0a0a0a" strokeWidth={5} /><rect x={-44} y={-22} width={88} height={84} fill="#3a2a1a" />
        <rect x={-52} y={-48} width={104} height={14} fill="#5a4a3a" /><circle cx={0} cy={-62} r={8} fill="#ffe0a0" />
        <PersonV x={0} y={104} look={ARTEM} view="front" mode="stand" t={0} s={0.3} mood="neutral" shadow={false} />
      </g>}
      {i === 1 && <g>
        <rect x={-158} y={-108} width={316} height={216} fill="#3a4a5c" /><rect x={-158} y={-108} width={316} height={80} fill="#6a7a8c" opacity={0.5} />
        <rect x={-158} y={40} width={316} height={68} fill="#3a3a38" /><rect x={-158} y={36} width={316} height={8} fill="#6a6a64" />
        <rect x={-130} y={-70} width={150} height={100} fill="#0a121c" opacity={0.5} stroke="#1a2228" strokeWidth={5} /><polygon points="-142,-70 32,-70 32,-86 -142,-86" fill="#2a3440" />
        <rect x={-120} y={6} width={130} height={10} fill="#5a4a3a" /><rect x={-114} y={16} width={6} height={22} fill="#3a2a1a" /><rect x={-20} y={16} width={6} height={22} fill="#3a2a1a" />
        <rect x={70} y={-70} width={8} height={110} fill="#2a2a2a" /><rect x={46} y={-90} width={56} height={34} fill="#c8a838" /><text x={74} y={-66} textAnchor="middle" fontFamily="Montserrat, sans-serif" fontWeight={800} fontSize={22} fill="#222">12</text>
        <PersonV x={-50} y={100} look={ARTEM} view="front" mode="stand" t={0} s={0.3} mood="neutral" shadow={false} />
      </g>}
      {i === 2 && <g>
        <rect x={-158} y={-108} width={316} height={216} fill="#1e2838" /><rect x={-158} y={56} width={316} height={52} fill="#3a3a38" />
        <rect x={-148} y={-60} width={296} height={116} fill={P('concrete')} opacity={0.7} /><rect x={-154} y={-76} width={308} height={20} fill="#7a1a1a" />
        <rect x={-130} y={-40} width={110} height={80} fill="#ffe8b0" opacity={0.85} /><rect x={30} y={-40} width={100} height={80} fill="#ffe8b0" opacity={0.85} /><rect x={-14} y={-40} width={36} height={96} fill="#2a2018" />
        <PersonV x={-40} y={102} look={ARTEM} view="front" mode="walk" t={0.15} s={0.3} mood="neutral" shadow={false} />
        <rect x={-12} y={66} width={20} height={24} fill="#8a6a3a" />
      </g>}
      {i === 3 && <g>
        <rect x={-158} y={-108} width={316} height={216} fill="#323a46" /><rect x={-158} y={60} width={316} height={48} fill="#3a3a38" />
        <rect x={-148} y={-100} width={296} height={160} fill={P('concrete')} opacity={0.7} />
        {[-100, 100].map((wx) => <rect key={wx} x={wx - 26} y={-80} width={52} height={46} fill="#e8d890" opacity={0.6} stroke="#1a1a1a" strokeWidth={3} />)}
        <FaceMini x={-62} y={8} k={0.95} kind="gran" />
        <FaceMini x={62} y={8} k={0.95} kind="man" skinC="#c8a080" hairC="#4a4a50" coat="#3a4a5a" />
      </g>}
      <rect x={-158} y={-108} width={316} height={216} fill="#d8c890" opacity={0.12} />
    </g>
  </g>
);
void GRAN; void BROTHER;
