import React from 'react';
import {clamp, ease, lerp, Tx, E, poseStand, poseWalk} from './M60Base';
import {Full, Bear, Vasya, poseLie, poseCover, G} from './M64Art';
const TT: React.FC<React.ComponentProps<typeof Tx>> = (p) => <Tx {...p} size={(p.size ?? 48) * 1.3} />;

const BG = '#10241f', GRN = '#3bff8a', RED = '#ff3b3b', WHT = '#f4f6f2', YEL = '#ffd23a';
const Panel: React.FC<{title?: string; children: React.ReactNode}> = ({title, children}) => (
  <g>
    <Full c={BG} />
    <rect x={-2000} y={-1000} width={14000} height={2400} fill="#1a3a30" opacity={0.35} />
    {Array.from({length: 24}).map((_, i) => <line key={i} x1={i * 90} y1={0} x2={i * 90} y2={1080} stroke="#fff" strokeOpacity={0.04} />)}
    {children}
  </g>
);
const Cross: React.FC<{x: number; y: number; s?: number; o?: number}> = ({x, y, s = 1, o = 1}) => <g transform={`translate(${x} ${y}) scale(${s})`} opacity={o}><circle r={46} fill={RED} /><path d="M-22 -22 L22 22 M22 -22 L-22 22" stroke="#fff" strokeWidth={11} strokeLinecap="round" /></g>;
const Check: React.FC<{x: number; y: number; s?: number; o?: number}> = ({x, y, s = 1, o = 1}) => <g transform={`translate(${x} ${y}) scale(${s})`} opacity={o}><circle r={46} fill="#1f9a55" /><path d="M-24 2 L-6 20 L26 -18" stroke="#fff" strokeWidth={11} fill="none" strokeLinecap="round" strokeLinejoin="round" /></g>;
const Arrow: React.FC<{x1: number; y1: number; x2: number; y2: number; c?: string; w?: number; o?: number}> = ({x1, y1, x2, y2, c = GRN, w = 12, o = 1}) => {
  const a = Math.atan2(y2 - y1, x2 - x1);
  return <g opacity={o}><line x1={x1} y1={y1} x2={x2 - Math.cos(a) * 18} y2={y2 - Math.sin(a) * 18} stroke={c} strokeWidth={w} strokeLinecap="round" /><polygon points="0,0 -34,-18 -34,18" fill={c} transform={`translate(${x2} ${y2}) rotate(${(a * 180) / Math.PI})`} /></g>;
};
const Dot: React.FC<{x: number; y: number; c: string; r?: number; label?: string; dir?: number}> = ({x, y, c, r = 34, label, dir}) => (
  <g>
    <circle cx={x} cy={y} r={r} fill={c} stroke="#fff" strokeWidth={5} />
    {dir !== undefined && <polygon points="0,-10 38,0 0,10" fill="#fff" transform={`translate(${x} ${y}) rotate(${dir}) translate(${r - 8} 0)`} />}
    {label && <TT x={x} y={y + r + 46} size={36} fill={WHT}>{label}</TT>}
  </g>
);

export const D1: React.FC<{t: number}> = ({t}) => {
  const u = (t % 6) / 6;
  const hx = 240 + ease(clamp(u * 1.0)) * 420, bx = 240 + clamp(u * 1.0) * 1300;
  return (
    <Panel title="СКОРОСТЬ: ЧЕЛОВЕК И МЕДВЕДЬ">
      {[0, 1].map((i) => <g key={i}><rect x={160} y={350 + i * 260} width={1600} height={120} rx={20} fill="#0a1a15" stroke="#2a5a48" strokeWidth={4} />{Array.from({length: 17}).map((_, k) => <line key={k} x1={200 + k * 94} y1={350 + i * 260} x2={200 + k * 94} y2={470 + i * 260} stroke="#2a5a48" strokeWidth={3} />)}</g>)}
      <Vasya v={{x: lerp(240, 660, u), y: -430, pose: poseWalk(t, 4.2, 18), s: 0.5}} />
      <g transform="translate(0 -170)"><Bear b={{x: lerp(240, 1540, u), y: 0, s: 0.62, face: 1, mode: 'run', t}} /></g>
      <TT x={330} y={320} size={46} fill={YEL}>ЧЕЛОВЕК</TT>
      <TT x={760} y={540} size={40} fill={WHT}>примерно в 3 раза медленнее</TT>
      <TT x={760} y={810} size={46} fill={RED}>МЕДВЕДЬ · 50+ КМ/Ч</TT>
    </Panel>
  );
};

export const D2: React.FC<{t: number}> = ({t}) => (
  <Panel title="ГОВОРИ СПОКОЙНО">
    <Vasya v={{x: 420, y: -120, pose: poseStand({mood: 'neutral', hf: [60, -160]}), s: 0.8}} />
    <Bear b={{x: 1500, y: -120, s: 0.9, mode: 'idle', t}} />
    {[0, 1, 2, 3].map((i) => <path key={i} d={`M${560 + i * 70} ${560 - i * 4} q40 ${-50 + (i % 2) * 20} 80 0 t80 0`} stroke={GRN} strokeWidth={8} fill="none" opacity={0.5 + 0.4 * Math.sin(t * 4 - i)} transform={`translate(${((t * 80 + i * 40) % 160)} 0)`} />)}
    <TT x={800} y={470} size={44} fill={GRN}>«Спокойно. Я человек.»</TT>
    <g opacity={0.9}><path d={`M300 800 ${Array.from({length: 14}).map((_, k) => `L${300 + k * 40} ${k % 2 ? 760 : 840}`).join(' ')}`} stroke={RED} strokeWidth={8} fill="none" /><Cross x={900} y={800} /><TT x={1250} y={820} size={44} fill={RED}>КРИК и резкие звуки</TT></g>
  </Panel>
);

export const D3: React.FC<{t: number}> = ({t}) => {
  const u = ease(clamp(t / 3));
  return (
    <Panel title="ВИД СВЕРХУ">
      <polygon points={`1400,540 ${520},${320} ${520},${760}`} fill="#ffd23a" opacity={0.1} />
      <Dot x={1400} y={540} c="#7a4a2a" r={52} label="МЕДВЕДЬ" dir={180} />
      <Dot x={lerp(700, 460, u)} y={540} c="#2a6ac0" label="ВАСЯ" dir={0} />
      <Arrow x1={lerp(700, 460, u)} y1={640} x2={380} y2={640} />
      <Check x={300} y={640} s={0.8} />
      <TT x={560} y={740} size={42} fill={GRN}>ЛИЦОМ К МЕДВЕДЮ, ШАГ НАЗАД</TT>
      <g transform="translate(960 900)"><Cross x={-380} y={0} s={0.8} /><TT x={80} y={14} size={42} fill={RED}>НЕ ПОВОРАЧИВАЙСЯ СПИНОЙ</TT></g>
    </Panel>
  );
};

export const D4: React.FC<{t: number}> = ({t}) => (
  <Panel title="ДЕРЕВО — НЕ СПАСЕНИЕ">
    <g transform="translate(960 1000)"><rect x={-40} y={-720} width={80} height={720} fill="#5a3a22" />{[0, 1, 2, 3, 4].map((i) => <polygon key={i} points={`${-260 + i * 30},${-250 - i * 120} ${260 - i * 30},${-250 - i * 120} 0,${-460 - i * 120}`} fill={i % 2 ? '#2f7a34' : '#256a2c'} />)}</g>
    <Vasya v={{x: 960 + 70, y: -430 + Math.sin(t * 3) * 4, pose: poseStand({mood: 'scared', hf: [40, -250], hb: [10, -240]}), s: 0.8}} />
    <g transform={`translate(0 ${Math.max(0, 90 - t * 25)})`}><Bear b={{x: 860, y: -130 - clamp(t / 4) * 120, s: 0.5, face: 1, mode: 'idle', t, rise: clamp(t / 3)}} /></g>
    <TT x={640} y={440} size={44} fill={YEL}>Молодые медведи лазают хорошо</TT>
    <TT x={1440} y={420} size={44} fill={RED}>Он окажется под тобой</TT>
    <Cross x={1440} y={520} s={0.8} />
  </Panel>
);

export const D5: React.FC<{t: number}> = ({t}) => (
  <Panel title="НЕ РАДИ ФОТО">
    {[1, 2, 3].map((i) => <circle key={i} cx={1300} cy={560} r={i * 150 + Math.sin(t * 2) * 6} fill="none" stroke={RED} strokeWidth={4} strokeDasharray="14 12" opacity={0.7 - i * 0.15} />)}
    <Dot x={1300} y={560} c="#7a4a2a" r={52} label="МЕДВЕДЬ" />
    <Dot x={lerp(300, 560, E(t, 0, 4))} y={560} c="#2a6ac0" label="ВАСЯ" />
    <g transform="translate(300 330)"><rect x={-60} y={-44} width={120} height={88} rx={16} fill={WHT} /><circle cx={0} cy={0} r={26} fill="#2a3a50" stroke="#9fb4d0" strokeWidth={5} /><Cross x={70} y={-50} s={0.55} /></g>
    <TT x={960} y={900} size={44} fill={WHT}>Несколько десятков метров — несколько секунд</TT>
    <Arrow x1={1250} y1={760} x2={660} y2={760} c={RED} o={0.5 + 0.5 * Math.abs(Math.sin(t * 3))} />
  </Panel>
);

export const D6: React.FC<{t: number}> = ({t}) => (
  <Panel title="ОТСТУПАЙ ПОДАЛЬШЕ">
    <Dot x={1500} y={560} c="#7a4a2a" r={52} label="МЕДВЕДЬ" dir={180} />
    {[0, 1, 2, 3, 4].map((i) => <g key={i} opacity={clamp((t - i * 0.7) / 0.5)}><ellipse cx={1000 - i * 140} cy={560 + (i % 2) * 40 - 20} rx={30} ry={14} fill="#9fd8c0" /></g>)}
    <Dot x={lerp(1100, 700, E(t, 0, 4))} y={560} c="#2a6ac0" label="ВАСЯ" dir={0} />
    <TT x={700} y={780} size={44} fill={GRN}>Спокойно, глаза на медведе</TT>
    <Cross x={420} y={420} s={0.7} /><TT x={700} y={430} size={40} fill={RED}>не разворачиваться и не бежать</TT>
  </Panel>
);

export const D7: React.FC<{t: number}> = ({t}) => (
  <Panel title="МЕДВЕДИЦА РЯДОМ">
    <circle cx={960} cy={560} r={300 + Math.sin(t * 3) * 14} fill={RED} opacity={0.1} /><circle cx={960} cy={560} r={300} fill="none" stroke={RED} strokeWidth={6} strokeDasharray="16 12" />
    <g transform="translate(0 -40)"><Bear b={{x: 1180, y: 20, s: 1.0, face: -1, mode: 'idle', t}} /><Bear b={{x: 700, y: 30, s: 0.5, face: 1, mode: 'idle', t, col: '#8a6440', sn: '#b08a60'}} /></g>
    <TT x={960} y={880} size={46} fill={WHT}>Рядом с медвежонком мать — всегда</TT>
    <Cross x={1700} y={360} s={0.9} />
  </Panel>
);

export const D8: React.FC<{t: number}> = ({t}) => {
  const k = E(t, 2, 6);
  return (
    <Panel title="НЕ МЕЖДУ МАТЕРЬЮ И ДЕТЁНЫШЕМ">
      <Dot x={1500} y={540} c="#7a4a2a" r={56} label="МЕДВЕДИЦА" />
      <Dot x={420} y={540} c="#b08a60" r={34} label="МЕДВЕЖОНОК" />
      <line x1={460} y1={540} x2={1440} y2={540} stroke={k < 0.5 ? RED : GRN} strokeWidth={10} strokeDasharray="24 14" opacity={0.8} />
      <Dot x={960} y={lerp(540, 800, k)} c="#2a6ac0" label="ВАСЯ" />
      {k > 0.3 && <Arrow x1={960} y1={600} x2={960} y2={lerp(600, 760, k)} c={GRN} />}
      <TT x={960} y={330} size={44} fill={k < 0.5 ? RED : GRN}>{k < 0.5 ? 'Ты — на их линии' : 'Освободи им путь друг к другу'}</TT>
    </Panel>
  );
};

export const D9: React.FC<{t: number}> = ({t}) => (
  <Panel title="НЕ ПУГАЙ">
    <g transform="translate(560 540)"><polygon points="-120,-40 40,-110 40,110 -120,40" fill={WHT} /><rect x={-170} y={-40} width={50} height={80} fill={WHT} /><path d="M80 -70 q50 70 0 140 M120 -110 q90 110 0 220" stroke={WHT} strokeWidth={10} fill="none" /><Cross x={50} y={-110} s={0.8} /></g>
    <g transform="translate(1160 540)"><ellipse cx={0} cy={0} rx={90} ry={60} fill="#8a8a8a" /><path d="M-160 -90 L-60 -20" stroke={WHT} strokeWidth={8} /><Cross x={30} y={-90} s={0.8} /></g>
    <TT x={560} y={760} size={42} fill={WHT}>КРИКИ</TT><TT x={1160} y={760} size={42} fill={WHT}>БРОСКИ</TT>
    <rect x={460} y={860} width={1000} height={36} rx={18} fill="#2a1a18" /><rect x={460} y={860} width={1000 * (0.4 + 0.5 * E(t, 0, 5))} height={36} rx={18} fill={RED} /><TT x={960} y={950} size={40} fill="#ff9a8a">защитная реакция усиливается</TT>
  </Panel>
);

export const D10: React.FC<{t: number}> = ({t}) => {
  const k = E(t, 0, 4);
  return (
    <Panel title="НЕ СОРЕВНУЙСЯ В СКОРОСТИ">
      <rect x={560} y={820 - 120} width={200} height={120} fill="#2a6ac0" /><rect x={1160} y={820 - 120 * 3.2 * k} width={200} height={120 * 3.2 * k} fill="#7a4a2a" />
      <line x1={460} y1={820} x2={1460} y2={820} stroke={WHT} strokeWidth={6} />
      <TT x={660} y={880} size={44} fill={WHT}>ЧЕЛОВЕК</TT><TT x={1260} y={880} size={44} fill={WHT}>МЕДВЕДЬ</TT>
      <TT x={1260} y={420} size={90} fill={RED} o={k}>×3</TT>
      <TT x={960} y={290} size={42} fill={YEL}>Побег почти наверняка не поможет</TT>
    </Panel>
  );
};

export const D11: React.FC<{t: number}> = ({t}) => {
  const k = E(t, 0, 3);
  return (
    <Panel title="ЗАЩИТНАЯ ПОЗА">
      <Vasya v={{x: 760, y: -120, pose: poseCover(), lie: 86, s: 1.1}} />
      <g opacity={k}>
        <Arrow x1={1500} y1={640} x2={1000} y2={760} c={YEL} w={8} /><TT x={1500} y={620} size={40} fill={YEL}>ЛИЦОМ ВНИЗ</TT>
        <Arrow x1={1500} y1={520} x2={1040} y2={700} c={YEL} w={8} /><TT x={1520} y={500} size={40} fill={YEL}>РУКИ НА ШЕЮ</TT>
        <Arrow x1={300} y1={560} x2={620} y2={760} c={YEL} w={8} /><TT x={300} y={540} size={40} fill={YEL}>НОГИ ШИРОКО</TT>
        <Arrow x1={900} y1={450} x2={850} y2={690} c={YEL} w={8} /><TT x={900} y={430} size={40} fill={YEL}>РЮКЗАК НА СПИНЕ</TT>
      </g>
    </Panel>
  );
};

export const D12: React.FC<{t: number}> = ({t}) => {
  const a = (t * 0.6) % (Math.PI * 2);
  return (
    <Panel title="НЕ ВСТАВАЙ СЛИШКОМ РАНО">
      <g transform="translate(560 580)"><circle r={200} fill="#0a1a15" stroke={WHT} strokeWidth={10} /><line x1={0} y1={0} x2={Math.sin(a) * 160} y2={-Math.cos(a) * 160} stroke={RED} strokeWidth={12} strokeLinecap="round" /><circle r={14} fill={WHT} /></g>
      <Bear b={{x: 1400 + Math.min(t, 6) * 36, y: -100, s: 0.7, face: 1, mode: 'walk', t}} />
      <Dot x={1100} y={800} c="#2a6ac0" r={26} />
      <TT x={1300} y={430} size={42} fill={YEL}>Он может вернуться</TT>
      <TT x={960} y={930} size={42} fill={WHT}>Лежи, пока опасность не минует</TT>
    </Panel>
  );
};

export const D13: React.FC<{t: number}> = ({t}) => (
  <Panel title="НЕ ПОДНИМАЙСЯ">
    <Vasya v={{x: 700, y: -120, pose: poseCover(), lie: 86, s: 1.0}} />
    {Array.from({length: 7}).map((_, i) => <g key={i} opacity={clamp((t - i * 0.5) / 0.4)} transform={`translate(${1000 + i * 120} ${660 + (i % 2) * 36})`}><ellipse rx={26} ry={14} fill="#9fd8c0" /><circle cx={-18} cy={-18} r={5} fill="#9fd8c0" /><circle cx={0} cy={-22} r={5} fill="#9fd8c0" /><circle cx={18} cy={-18} r={5} fill="#9fd8c0" /></g>)}
    <TT x={1300} y={500} size={42} fill={WHT}>шаги удаляются</TT>
    <TT x={960} y={900} size={44} fill={YEL}>Пока он рядом — не двигайся</TT>
  </Panel>
);

export const D14: React.FC<{t: number}> = ({t}) => {
  const k = E(t, 0, 5);
  return (
    <Panel title="УХОДИ СПОКОЙНО">
      <circle cx={1300} cy={480} r={150} fill={RED} opacity={0.12} /><circle cx={1300} cy={480} r={150} fill="none" stroke={RED} strokeWidth={5} strokeDasharray="14 10" />
      <TT x={1300} y={490} size={36} fill={RED}>ВСТРЕЧА</TT>
      <path d="M1180 560 Q700 760 340 700" stroke={GRN} strokeWidth={12} fill="none" strokeDasharray="24 14" strokeDashoffset={-t * 40} />
      <Arrow x1={420} y1={706} x2={300} y2={690} c={GRN} />
      <Check x={300} y={820} s={0.7} /><TT x={640} y={830} size={40} fill={GRN}>к безопасному месту</TT>
      <Cross x={1700} y={300} s={0.6} /><TT x={1550} y={380} size={36} fill={RED}>не преследовать · не возвращаться</TT>
      <Dot x={lerp(1180, 440, k)} y={lerp(560, 705, k)} c="#2a6ac0" r={26} />
    </Panel>
  );
};

export const D15: React.FC<{t: number}> = ({t}) => {
  const k = E(t, 0, 2);
  return (
    <g>
      <Full c={BG} />
      <rect x={0} y={0} width={960} height={1080} fill="#1a4a38" opacity={0.55} /><rect x={960} y={0} width={960} height={1080} fill="#4a1a1a" opacity={0.55} />
      <line x1={960} y1={140} x2={960} y2={1000} stroke={WHT} strokeWidth={5} opacity={0.6} />
      <g opacity={k}>
        <TT x={480} y={220} size={44} fill={GRN}>ЗАЩИТНОЕ</TT>
        <TT x={480} y={290} size={25} fill={WHT}>медведица с медвежонком, внезапная встреча</TT>
        <Vasya v={{x: 380, y: -80, pose: poseCover(), lie: 86, s: 0.95}} />
        <TT x={480} y={760} size={32} fill={GRN}>ЛЕЖИ · ЗАЩИЩАЙ ГОЛОВУ И ШЕЮ</TT>
        <TT x={1440} y={220} size={44} fill={RED}>ХИЩНИЧЕСКОЕ</TT>
        <TT x={1440} y={290} size={25} fill={WHT}>выслеживает как добычу, нападает дальше</TT>
        <Vasya v={{x: 1300, y: -80, pose: poseStand({mood: 'scared', hf: [70, -150], hb: [40, -140]}), s: 0.95}} />
        <Bear b={{x: 1640, y: -80, s: 0.85, face: -1, mode: 'charge', t}} />
        <TT x={1440} y={760} size={32} fill={RED}>СОПРОТИВЛЯЙСЯ · БЕЙ ПО МОРДЕ</TT>
      </g>
      <Cross x={1790} y={820} s={0.8} /><TT x={1440} y={830} size={25} fill="#ff9a8a">нельзя притворяться мертвым</TT>
    </g>
  );
};

export const DIAGS: Record<string, React.FC<{t: number}>> = {D1, D2, D3, D4, D5, D6, D7, D8, D9, D10, D11, D12, D13, D14, D15};
