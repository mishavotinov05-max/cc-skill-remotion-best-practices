import React from 'react';
import {ease, lerp, rnd} from './util';
import {FONT, H, IconCompressor, IconJack, IconLift, IconTools, Man, money, P, PEOPLE, PhoneShell, W} from './AutoArt';

export const GREEN = '#39ff88';
export const RED = '#ff3b4e';
export const GOLD = '#ffd23f';
export const CYAN = '#3fd0ff';
const gid = (c: string) => `gl${c.slice(1)}`;

export const T: React.FC<{x: number; y: number; size?: number; fill?: string; anchor?: 'start' | 'middle' | 'end'; children: React.ReactNode; o?: number; stroke?: string; rot?: number}> = ({x, y, size = 48, fill = '#fff', anchor = 'middle', children, o = 1, stroke, rot = 0}) => (
  <text x={x} y={y} textAnchor={anchor} fontFamily={FONT} fontWeight={700} fontSize={size} fill={fill} opacity={o} stroke={stroke} strokeWidth={stroke ? 8 : 0} paintOrder="stroke" transform={rot ? `rotate(${rot} ${x} ${y})` : undefined}>
    {children}
  </text>
);
export const tw = (t: number, a: number, b: number, from: number, to: number) => lerp(from, to, ease(P(t, a, b)));
export const NSvg: React.FC<{children: React.ReactNode}> = ({children}) => (
  <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
    <defs>
      {[GREEN, RED, GOLD, CYAN].map((c) => (
        <filter key={c} id={gid(c)} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="9" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      ))}
    </defs>
    {children}
  </svg>
);
export type CK = [number, number, number, number];
export const Cam: React.FC<{t: number; keys: CK[]; children: React.ReactNode}> = ({t, keys, children}) => {
  let [fx, fy, s] = [keys[0][1], keys[0][2], keys[0][3]];
  if (t >= keys[keys.length - 1][0]) [fx, fy, s] = [keys[keys.length - 1][1], keys[keys.length - 1][2], keys[keys.length - 1][3]];
  else
    for (let i = 0; i < keys.length - 1; i++) {
      if (t >= keys[i][0] && t < keys[i + 1][0]) {
        const k = ease((t - keys[i][0]) / (keys[i + 1][0] - keys[i][0]));
        fx = lerp(keys[i][1], keys[i + 1][1], k);
        fy = lerp(keys[i][2], keys[i + 1][2], k);
        s = lerp(keys[i][3], keys[i + 1][3], k);
        break;
      }
    }
  return <g transform={`translate(540 960) scale(${s}) translate(${-fx} ${-fy})`}>{children}</g>;
};
export const InfoBg: React.FC<{t: number; tint?: string}> = ({t, tint = '#1a2c58'}) => (
  <g>
    <defs>
      <linearGradient id="ibg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor={tint} />
        <stop offset="1" stopColor="#0d1530" />
      </linearGradient>
    </defs>
    <rect x={-300} y={-300} width={1700} height={2500} fill="url(#ibg)" />
    {Array.from({length: 14}).map((_, i) => <rect key={i} x={-200 + i * 110} y={-300} width={2} height={2500} fill="#9fb4ff" opacity={0.06} />)}
    {Array.from({length: 24}).map((_, i) => <rect key={i} x={-300} y={((i * 110 + t * 24) % 2600) - 300} width={1700} height={2} fill="#9fb4ff" opacity={0.06} />)}
    {Array.from({length: 16}).map((_, i) => {
      const y = 2100 - ((t * (30 + rnd(i + 5) * 50) + rnd(i + 9) * 2200) % 2400);
      return <circle key={i} cx={rnd(i) * 1080} cy={y} r={12 + rnd(i + 2) * 16} fill={GOLD} opacity={0.16} />;
    })}
  </g>
);
export const Neon: React.FC<{x: number; y: number; w: number; h: number; c: string; k?: number; t?: number; children?: React.ReactNode; rot?: number}> = ({x, y, w, h, c, k = 1, t = 0, children, rot = 0}) => {
  const pulse = 0.8 + 0.2 * Math.sin(t * 7);
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${0.75 + 0.25 * k})`} opacity={k}>
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={34} fill="#0a1128" stroke={c} strokeWidth={9} filter={`url(#${gid(c)})`} opacity={pulse} />
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={34} fill="none" stroke="#fff" strokeWidth={2.5} opacity={0.8} />
      {children}
    </g>
  );
};
export const Bill: React.FC<{x: number; y: number; s?: number; rot?: number; o?: number; c?: string}> = ({x, y, s = 1, rot = 0, o = 1, c = '#3bbf6a'}) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`} opacity={o}>
    <rect x={-70} y={-36} width={140} height={72} rx={10} fill={c} stroke="#0f4a26" strokeWidth={5} />
    <circle r={22} fill="#0f4a26" opacity={0.35} />
    <T x={0} y={11} size={32}>₽</T>
  </g>
);
export const fp = (t: number, a: number, b: number, x0: number, y0: number, x1: number, y1: number, arc = -140) => {
  const e = ease(P(t, a, b));
  return {x: lerp(x0, x1, e), y: lerp(y0, y1, e) + Math.sin(Math.PI * e) * arc, e, on: t >= a && t < b};
};
export const HeroCorner: React.FC<{t: number; mood?: any; x?: number; flip?: boolean}> = ({t, mood = 'neutral', x = 170, flip}) => (
  <Man p={PEOPLE.mech} x={x} y={1900} s={0.78} t={t} mood={mood} pose="tired" flip={flip} />
);
const Burst: React.FC<{x: number; y: number; t: number; a: number; c: string}> = ({x, y, t, a, c}) => {
  const k = P(t, a, a + 0.9);
  if (k <= 0 || k >= 1) return null;
  return (
    <g transform={`translate(${x} ${y})`} opacity={1 - k}>
      {Array.from({length: 14}).map((_, i) => {
        const an = (i / 14) * Math.PI * 2;
        const r = 40 + ease(k) * 230;
        return <circle key={i} cx={Math.cos(an) * r} cy={Math.sin(an) * r} r={10 * (1 - k) + 3} fill={i % 2 ? c : '#fff'} />;
      })}
    </g>
  );
};
export const Arrow: React.FC<{x0: number; y0: number; x1: number; y1: number; c: string; k: number}> = ({x0, y0, x1, y1, c, k}) => {
  const ex = lerp(x0, x1, k), ey = lerp(y0, y1, k);
  const ang = Math.atan2(y1 - y0, x1 - x0);
  return (
    <g opacity={Math.min(1, k * 3)}>
      <line x1={x0} y1={y0} x2={ex} y2={ey} stroke={c} strokeWidth={10} strokeLinecap="round" strokeDasharray="22 16" filter={`url(#${gid(c)})`} />
      <path d={`M0 0 L-34 -20 L-34 20 Z`} fill={c} transform={`translate(${ex} ${ey}) rotate(${(ang * 180) / Math.PI})`} />
    </g>
  );
};

// ---------------------------- notes app ----------------------------
export const NotesPhone: React.FC<{t: number; a: number}> = ({t, a}) => {
  const rise = ease(P(t, a, a + 0.55));
  const app = ease(P(t, 19.75, 20.15));
  const PS = 2.35;
  const rows: {py: number; at: number; end: number; l: string; r?: string; big?: boolean; green?: boolean}[] = [
    {py: -200, at: 20.22, end: 22.78, l: 'Замена колёс', r: '2 000 ₽'},
    {py: -150, at: 22.78, end: 24.88, l: 'Замена масла', r: '1 000 ₽'},
    {py: -100, at: 24.88, end: 27.43, l: 'Мелкий ремонт', r: '1 500 ₽'},
    {py: -28, at: 27.43, end: 30.38, l: '10 клиентов в день'},
    {py: 22, at: 30.38, end: 33.35, l: '× 2 000 ₽ с клиента'},
    {py: 72, at: 33.35, end: 36.01, l: '= 20 000 ₽ в день', green: true},
    {py: 122, at: 36.01, end: 38.0, l: '× 30 дней'},
  ];
  const fin = ease(P(t, 38.0, 38.6));
  return (
    <g>
      <PhoneShell x={540} y={960 + (1 - rise) * 1100} s={PS}>
        <rect x={-172} y={-356} width={344} height={712} fill="#000" />
        {app < 1 && (
          <g opacity={1 - app}>
            {Array.from({length: 12}).map((_, i) => {
              const gx = -110 + (i % 4) * 74, gy = -220 + Math.floor(i / 4) * 92;
              const notes = i === 5;
              return (
                <g key={i}>
                  <rect x={gx - 28} y={gy - 28} width={56} height={56} rx={14} fill={notes ? '#1fb865' : ['#3a4a6a', '#6a3a5a', '#3a6a5a', '#7a5a2a'][i % 4]} stroke={notes ? GREEN : 'none'} strokeWidth={4} />
                  {notes && <g stroke="#fff" strokeWidth={3} strokeLinecap="round"><path d={`M${gx - 14} ${gy - 8} L${gx + 14} ${gy - 8} M${gx - 14} ${gy + 4} L${gx + 14} ${gy + 4} M${gx - 14} ${gy + 16} L${gx + 4} ${gy + 16}`} /></g>}
                </g>
              );
            })}
            <T x={-110 + 74} y={-220 + 92 + 58} size={14} fill="#fff">Заметки</T>
            <circle cx={-36} cy={-100} r={46 - 16 * P(t, 19.4, 19.75)} fill="none" stroke={GREEN} strokeWidth={4} opacity={0.8} />
          </g>
        )}
        {app > 0 && (
          <g opacity={app} transform={`scale(${0.9 + 0.1 * app})`}>
            <T x={-150} y={-318} anchor="start" size={20} fill={GREEN}>‹ Заметки</T>
            <T x={-150} y={-262} anchor="start" size={34} fill="#fff">Мой автосервис</T>
            <rect x={-150} y={-244} width={110} height={4} rx={2} fill={GREEN} />
            {rows.map((r, i) => {
              const on = t >= r.at && t < r.end;
              const flash = on ? 0.7 + 0.3 * Math.sin(t * 9) : 0;
              return (
                <g key={i}>
                  {on && <rect x={-162} y={r.py - 30} width={324} height={44} rx={10} fill={GREEN} opacity={0.2 * flash + 0.08} stroke={GREEN} strokeWidth={2} />}
                  <T x={-150} y={r.py} anchor="start" size={r.green ? 25 : 22} fill={r.green ? GREEN : '#fff'}>{r.l}</T>
                  {r.r && <T x={150} y={r.py} anchor="end" size={22} fill={GREEN}>{r.r}</T>}
                  {t >= r.end && i < 3 && <T x={-166} y={r.py} anchor="end" size={20} fill={GREEN}>✓</T>}
                </g>
              );
            })}
            <rect x={-150} y={-62} width={300} height={2} fill="#ffffff" opacity={0.25} />
            <rect x={-150} y={152} width={300} height={2} fill="#ffffff" opacity={0.25} />
            <g transform={`translate(0 236)`}>
              <rect x={-158} y={-62} width={316} height={130} rx={22} fill="#06220f" stroke={GREEN} strokeWidth={4 + 2 * fin} filter={fin > 0.5 ? `url(#${gid(GREEN)})` : undefined} opacity={0.5 + 0.5 * fin} />
              <T x={0} y={-24} size={18} fill="#9affc2">ДОХОД В МЕСЯЦ</T>
              <T x={0} y={36} size={54 + 4 * Math.sin(t * 5) * fin} fill={GREEN}>600 000 ₽</T>
            </g>
          </g>
        )}
      </PhoneShell>
      {rows.map((r, i) => {
        const k = P(t, r.at, r.at + 1.1);
        if (k <= 0 || k >= 1) return null;
        const txt = i < 3 ? `+${r.r}` : i === 5 ? '+20 000 ₽' : i === 4 ? '×2 000' : i === 3 ? '×10' : '×30';
        return (
          <g key={i} transform={`translate(${900} ${960 + r.py * 2.35 - k * 90})`} opacity={1 - k}>
            <rect x={-95} y={-34} width={190} height={68} rx={34} fill="#06220f" stroke={GREEN} strokeWidth={5} />
            <T x={0} y={14} size={36} fill={GREEN}>{txt}</T>
          </g>
        );
      })}
      <Burst x={540} y={1500} t={t} a={38.0} c={GREEN} />
    </g>
  );
};
export const notesCam: CK[] = [
  [18.39, 540, 960, 1.0],
  [20.3, 540, 640, 1.25],
  [24.9, 540, 700, 1.3],
  [27.4, 540, 1060, 1.3],
  [30.4, 540, 1120, 1.4],
  [33.3, 540, 1220, 1.45],
  [36.0, 540, 1310, 1.5],
  [37.9, 540, 1380, 1.4],
  [38.8, 540, 1480, 1.3],
  [40.73, 540, 1500, 1.35],
];

// ---------------------------- bars ----------------------------
export const Bars: React.FC<{t: number; a: number}> = ({t, a}) => {
  const k1 = ease(P(t, a + 0.1, a + 1.3));
  const k2 = ease(P(t, a + 1.0, a + 2.0));
  const wmax = 840;
  return (
    <g>
      <T x={540} y={330} size={50} fill={GOLD}>СРАВНИМ</T>
      <Neon x={540} y={780} w={960} h={300} c={RED} k={ease(P(t, a, a + 0.3))} t={t}>
        <T x={-440} y={-80} anchor="start" size={34} fill="#ffb3ba">МЕХАНИК · 5 МЕСЯЦЕВ</T>
        <rect x={-440} y={-40} width={wmax * 0.375 * k1 + 1} height={90} rx={16} fill={RED} />
        <T x={-440 + wmax * 0.375 * k1 + 24} y={30} anchor="start" size={52} o={k1}>{`${money(225000 * k1)} ₽`}</T>
        {[0, 1, 2, 3, 4].map((i) => <T key={i} x={-410 + i * 130} y={110} anchor="start" size={26} fill="#ffb3ba" o={ease(P(t, a + 0.15 + i * 0.2, a + 0.4 + i * 0.2))}>45 000</T>)}
      </Neon>
      <Neon x={540} y={1190} w={960} h={300} c={GREEN} k={ease(P(t, a + 0.8, a + 1.1))} t={t}>
        <T x={-440} y={-80} anchor="start" size={34} fill="#9affc2">АВТОСЕРВИС · 1 МЕСЯЦ</T>
        <rect x={-440} y={-40} width={wmax * k2 + 1} height={90} rx={16} fill={GREEN} />
        <T x={-440 + Math.min(wmax * k2, 560) + 24} y={30} anchor="start" size={52} fill={k2 > 0.7 ? '#04210f' : '#fff'} o={k2}>{`${money(600000 * k2)} ₽`}</T>
      </Neon>
    </g>
  );
};

// ---------------------------- expenses ----------------------------
export const Drain: React.FC<{t: number}> = ({t}) => {
  const steps = [44.2, 45.0, 46.0, 47.0];
  const names = ['Аренда', 'Зарплаты', 'Расходники', 'Налоги'];
  let v = 600000;
  steps.forEach((s) => (v -= 112500 * ease(P(t, s + 0.3, s + 1.2))));
  const lvl = (v / 600000) * 640;
  const col = v > 400000 ? CYAN : v > 200000 ? GOLD : GREEN;
  return (
    <g>
      <T x={540} y={330} size={40} fill="#9aa3b8">ДОХОД</T>
      <T x={540} y={450} size={112} fill={col}>{`${money(v)} ₽`}</T>
      <g>
        <rect x={430} y={560} width={220} height={640} rx={26} fill="#0a1128" stroke={CYAN} strokeWidth={8} filter={`url(#${gid(CYAN)})`} />
        <clipPath id="tankc"><rect x={438} y={568} width={204} height={624} rx={20} /></clipPath>
        <g clipPath="url(#tankc)">
          <rect x={430} y={1192 - lvl} width={220} height={lvl + 8} fill={col} opacity={0.85} />
          <path d={`M430 ${1192 - lvl} Q485 ${1180 - lvl + Math.sin(t * 4) * 8} 540 ${1192 - lvl} T650 ${1192 - lvl}`} stroke="#fff" strokeWidth={4} fill="none" opacity={0.6} />
        </g>
      </g>
      {steps.map((s, i) => {
        const left = i % 2 === 0;
        const cx = left ? 170 : 910;
        const cy = 700 + i * 140;
        const k = ease(P(t, s, s + 0.35));
        const f = fp(t, s + 0.3, s + 1.2, left ? 440 : 640, 1000 - i * 60, cx, cy, -60);
        return (
          <g key={i}>
            <Neon x={cx} y={cy} w={290} h={110} c={RED} k={k} t={t}><T x={0} y={14} size={36}>{names[i]}</T></Neon>
            {f.on && <Bill x={f.x} y={f.y} s={0.6} rot={left ? -20 : 20} o={1 - f.e * 0.3} c="#d94a4a" />}
            <Arrow x0={left ? 430 : 650} y0={cy} x1={left ? 330 : 750} y1={cy} c={RED} k={ease(P(t, s + 0.1, s + 0.6))} />
          </g>
        );
      })}
    </g>
  );
};
export const Profit: React.FC<{t: number; a: number}> = ({t, a}) => {
  const k = ease(P(t, a, a + 0.5));
  const cnt = tw(t, a, a + 1.0, 450000, 150000);
  return (
    <g>
      <Neon x={540} y={820} w={900} h={600} c={GREEN} k={k} t={t}>
        <T x={0} y={-170} size={46} fill="#9affc2">ЧИСТАЯ ПРИБЫЛЬ</T>
        <T x={0} y={0} size={130} fill={GREEN}>{`≈ ${money(150000)}`}</T>
        <T x={0} y={120} size={80}>₽ В МЕСЯЦ</T>
        <T x={0} y={215} size={34} fill="#9aa3b8">после всех расходов</T>
      </Neon>
      {Array.from({length: 8}).map((_, i) => {
        const yy = 1500 - ((t * 120 + i * 190) % 1200);
        return <Bill key={i} x={110 + i * 120} y={yy} s={0.5} rot={Math.sin(t * 2 + i) * 20} o={0.7} />;
      })}
      <Burst x={540} y={820} t={t} a={a + 0.1} c={GREEN} />
      <T x={540} y={1650} size={1} o={0}>{cnt}</T>
    </g>
  );
};

// ---------------------------- equipment ----------------------------
export const ITEMS = [
  {at: 97.16, name: 'Подъёмник', price: 150000, Ic: IconLift},
  {at: 99.52, name: 'Инструменты', price: 20000, Ic: IconTools},
  {at: 101.45, name: 'Компрессор', price: 15000, Ic: IconCompressor},
  {at: 103.24, name: 'Домкрат', price: 8000, Ic: IconJack},
];
export const equipCam: CK[] = [
  [97.16, 540, 800, 1.0],
  ...ITEMS.flatMap((it): CK[] => [[it.at + 0.5, 540, 760, 1.12], [it.at + 1.2, 540, 820, 1.04], [it.at + 1.7, 540, 1300, 1.12]]),
  [105.14, 540, 1300, 1.12],
];
export const EquipFlow: React.FC<{t: number}> = ({t}) => {
  let total = 0;
  const slots = [150, 350, 550, 750];
  return (
    <g>
      {ITEMS.map((it, i) => {
        const fly = ease(P(t, it.at + 1.2, it.at + 1.7));
        total += it.price * fly;
        return null;
      })}
      <Neon x={540} y={1390} w={960} h={330} c={GOLD} t={t}>
        <T x={-430} y={-100} anchor="start" size={32} fill="#9aa3b8">КОРЗИНА ОБОРУДОВАНИЯ</T>
        <T x={430} y={-20} anchor="end" size={92} fill={GOLD}>{`${money(total)} ₽`}</T>
      </Neon>
      {ITEMS.map((it, i) => {
        const pop = ease(P(t, it.at, it.at + 0.35));
        const fly = ease(P(t, it.at + 1.2, it.at + 1.7));
        const Ic = it.Ic;
        const px = lerp(540, slots[i] + 40, fly);
        const py = lerp(700, 1480, fly) - Math.sin(Math.PI * fly) * 120;
        const sc = pop * (1 - 0.72 * fly) * (0.8 + 0.2 * pop);
        const price = Math.round(tw(t, it.at + 0.2, it.at + 0.9, 0, it.price));
        if (t < it.at) return null;
        return (
          <g key={i}>
            <g transform={`translate(${px} ${py}) scale(${sc}) rotate(${(1 - pop) * -12})`}>
              <Neon x={0} y={0} w={640} h={600} c={CYAN} t={t}>
                <g transform="translate(0 -70)"><Ic s={1.7} /></g>
                <T x={0} y={150} size={54}>{it.name}</T>
                <T x={0} y={240} size={80} fill={RED} stroke="#0a1128">{`−${money(price)} ₽`}</T>
              </Neon>
            </g>
            {fly > 0.95 && <Burst x={slots[i] + 40} y={1480} t={t} a={it.at + 1.7} c={GOLD} />}
          </g>
        );
      })}
    </g>
  );
};
export const SumUp: React.FC<{t: number; a: number}> = ({t, a}) => {
  const k1 = ease(P(t, a, a + 0.4));
  const k2 = ease(P(t, a + 0.7, a + 1.1));
  const cnt = tw(t, a + 1.5, a + 2.6, 193000, 228000);
  const kr = ease(P(t, a + 1.4, a + 1.8));
  return (
    <g>
      <Neon x={540} y={560} w={920} h={200} c={CYAN} k={k1} t={t}>
        <T x={-410} y={14} anchor="start" size={42}>Оборудование</T>
        <T x={410} y={18} anchor="end" size={66} fill={CYAN}>{`${money(193000)} ₽`}</T>
      </Neon>
      <T x={540} y={745} size={90} fill={GOLD} o={k2}>+</T>
      <Neon x={540} y={920} w={920} h={200} c={GOLD} k={k2} t={t} rot={(1 - k2) * 6}>
        <T x={-410} y={14} anchor="start" size={42}>Аренда гаража</T>
        <T x={410} y={18} anchor="end" size={66} fill={GOLD}>{`${money(35000)} ₽`}</T>
      </Neon>
      <rect x={90} y={1080} width={900 * kr} height={6} fill="#fff" opacity={0.7} />
      <Neon x={540} y={1280} w={940} h={260} c={GOLD} k={kr} t={t}>
        <T x={0} y={-70} size={34} fill="#9aa3b8">ВСЕГО НУЖНО</T>
        <T x={0} y={50} size={120} fill={GOLD}>{`${money(cnt)} ₽`}</T>
      </Neon>
      <Burst x={540} y={1280} t={t} a={a + 2.6} c={GOLD} />
    </g>
  );
};
export const sumCam = (a: number): CK[] => [[a, 540, 900, 1.0], [a + 1.4, 540, 900, 1.0], [a + 2.4, 540, 1200, 1.1], [a + 4.6, 540, 1200, 1.14]];
export const BankCard: React.FC<{t: number; a: number}> = ({t, a}) => {
  const v = tw(t, a + 0.3, a + 2.0, 0, 160000);
  const k = ease(P(t, a, a + 0.5));
  return (
    <g>
      <g transform={`translate(540 760) rotate(${-8 + Math.sin(t * 2) * 2}) scale(${0.6 + 0.4 * k})`}>
        <rect x={-430} y={-260} width={860} height={520} rx={50} fill="#12803f" stroke={GREEN} strokeWidth={10} filter={`url(#${gid(GREEN)})`} />
        <rect x={-430} y={-260} width={860} height={520} rx={50} fill="none" stroke="#fff" strokeWidth={3} opacity={0.7} />
        <rect x={-380} y={-170} width={110} height={84} rx={14} fill={GOLD} />
        <T x={-380} y={-200} anchor="start" size={36} fill="#c8ffdc">НАКОПЛЕНИЯ</T>
        <T x={0} y={110} size={120}>{`${money(v)} ₽`}</T>
        <T x={380} y={210} anchor="end" size={30} fill="#c8ffdc">БАНК</T>
      </g>
      {Array.from({length: 6}).map((_, i) => {
        const f = ease(P(t, a + 0.4 + i * 0.25, a + 0.9 + i * 0.25));
        return <g key={i} opacity={f}><ellipse cx={150 + i * 156} cy={1280 - f * 20} rx={60} ry={20} fill={GOLD} stroke="#a67a00" strokeWidth={5} /><ellipse cx={150 + i * 156} cy={1262 - f * 20} rx={60} ry={20} fill="#ffe27a" stroke="#a67a00" strokeWidth={5} /></g>;
      })}
    </g>
  );
};
export const Shortage: React.FC<{t: number; a: number}> = ({t, a}) => {
  const k1 = ease(P(t, a + 0.1, a + 0.9));
  const k2 = ease(P(t, a + 0.6, a + 1.5));
  const kg = ease(P(t, a + 1.4, a + 1.9));
  const X0 = 120, WW = 840;
  const w160 = (160 / 228) * WW;
  const shake = kg > 0.99 ? Math.sin(t * 40) * 4 : 0;
  return (
    <g>
      <T x={540} y={340} size={44} fill="#9aa3b8">ОБОРУДОВАНИЕ + АРЕНДА</T>
      <rect x={X0} y={420} width={WW * k1} height={140} rx={20} fill={GOLD} stroke="#fff" strokeWidth={3} />
      <T x={X0 + 20} y={510} anchor="start" size={50} fill="#1a1200" o={k1}>{`${money(228000 * k1)} ₽ нужно`}</T>
      <T x={540} y={700} size={44} fill="#9aa3b8">НАКОПЛЕНИЯ</T>
      <rect x={X0} y={770} width={w160 * k2} height={140} rx={20} fill={GREEN} />
      <T x={X0 + 20} y={860} anchor="start" size={50} fill="#04210f" o={k2}>{`${money(160000 * k2)} ₽`}</T>
      {kg > 0 && (
        <g opacity={kg}>
          <rect x={X0 + w160} y={770} width={WW - w160} height={140} rx={10} fill={RED} opacity={0.35} stroke={RED} strokeWidth={5} strokeDasharray="16 10" />
          <T x={X0 + w160 + (WW - w160) / 2} y={858} size={56} fill={RED}>?</T>
          <Arrow x0={X0 + w160 + (WW - w160) / 2} y0={560} x1={X0 + w160 + (WW - w160) / 2} y1={760} c={RED} k={kg} />
        </g>
      )}
      <g transform={`translate(${shake} 0)`}>
        <Neon x={540} y={1170} w={900} h={380} c={RED} k={kg} t={t}>
          <T x={0} y={-40} size={96} fill={RED}>НЕ ХВАТАЕТ</T>
          <T x={0} y={90} size={110}>{`−${money(68000 * kg)} ₽`}</T>
        </Neon>
      </g>
    </g>
  );
};
export const NoLift: React.FC<{t: number; a: number}> = ({t, a}) => {
  const k = ease(P(t, a, a + 0.4));
  const x = ease(P(t, a + 0.5, a + 0.9));
  const fly = ease(P(t, a + 1.0, a + 1.5));
  const cnt = tw(t, a + 1.0, a + 1.9, 228000, 78000);
  const col = t > a + 1.9 ? GREEN : GOLD;
  return (
    <g>
      <T x={540} y={330} size={44} fill="#9aa3b8">БЕЗ ПОДЪЁМНИКА</T>
      <Neon x={540} y={760} w={640} h={560} c={CYAN} k={k * (1 - fly)} t={t} rot={fly * -18}>
        <g transform="translate(0 -40)"><IconLift s={1.8} /></g>
        <T x={0} y={200} size={64} fill={RED}>−150 000 ₽</T>
        {x > 0 && <g opacity={x}><path d="M-250 -240 L250 240 M250 -240 L-250 240" stroke={RED} strokeWidth={34} strokeLinecap="round" filter={`url(#${gid(RED)})`} /></g>}
      </Neon>
      <Neon x={540} y={1250} w={900} h={300} c={col} t={t}>
        <T x={0} y={-60} size={34} fill="#9aa3b8">ТЕПЕРЬ НУЖНО</T>
        <T x={0} y={60} size={120} fill={col}>{`${money(cnt)} ₽`}</T>
      </Neon>
    </g>
  );
};
export const Rest43: React.FC<{t: number; a: number}> = ({t, a}) => {
  const its = [
    {n: 'Инструменты', p: 20000, Ic: IconTools, at: 0.1},
    {n: 'Компрессор', p: 15000, Ic: IconCompressor, at: 0.6},
    {n: 'Домкрат', p: 8000, Ic: IconJack, at: 1.1},
  ];
  let sum = 0;
  its.forEach((i) => (sum += i.p * ease(P(t, a + i.at + 0.4, a + i.at + 0.9))));
  const kk = ease(P(t, a + 1.4, a + 1.8));
  return (
    <g>
      {its.map((it, i) => {
        const k = ease(P(t, a + it.at, a + it.at + 0.35));
        const Ic = it.Ic;
        return (
          <Neon key={i} x={190 + i * 350} y={600} w={320} h={420} c={CYAN} k={k} t={t}>
            <g transform="translate(0 -60)"><Ic s={0.9} /></g>
            <T x={0} y={90} size={30}>{it.n}</T>
            <T x={0} y={160} size={46} fill={RED}>{`${money(it.p)} ₽`}</T>
          </Neon>
        );
      })}
      {its.map((it, i) => <Arrow key={i} x0={190 + i * 350} y0={830} x1={540} y1={1010} c={CYAN} k={ease(P(t, a + it.at + 0.4, a + it.at + 0.9))} />)}
      <Neon x={540} y={1180} w={820} h={260} c={RED} k={ease(P(t, a + 0.5, a + 0.9))} t={t}>
        <T x={0} y={-50} size={32} fill="#9aa3b8">ОСТАЛЬНОЕ ОБОРУДОВАНИЕ</T>
        <T x={0} y={60} size={110} fill={RED}>{`${money(sum)} ₽`}</T>
      </Neon>
      <Arrow x0={540} y0={1320} x1={240} y1={250} c={RED} k={kk} />
    </g>
  );
};
export const Rent35: React.FC<{t: number; a: number}> = ({t, a}) => {
  const k = ease(P(t, a, a + 0.5));
  const f = ease(P(t, a + 1.0, a + 1.6));
  return (
    <g>
      <Neon x={540} y={820} w={800} h={640} c={GOLD} k={k} t={t}>
        <g transform="translate(0 -130) scale(1.5)">
          <rect x={-120} y={-30} width={240} height={150} fill="#9a9aa4" stroke="#555" strokeWidth={5} />
          <rect x={-130} y={-62} width={260} height={36} fill="#4a4d56" />
          <rect x={-90} y={0} width={180} height={120} fill="#5f6b78" stroke="#2a2e38" strokeWidth={5} />
          {[0, 1, 2, 3].map((q) => <rect key={q} x={-90} y={22 + q * 26} width={180} height={4} fill="#000" opacity={0.25} />)}
        </g>
        <T x={0} y={150} size={52}>АРЕНДА ГАРАЖА</T>
        <T x={0} y={250} size={92} fill={RED} stroke="#0a1128">−35 000 ₽</T>
      </Neon>
      {[0, 1, 2].map((i) => {
        const p = fp(t, a + 1.0 + i * 0.12, a + 1.7 + i * 0.12, 540, 820, 240, 190, -100);
        return p.on ? <Bill key={i} x={p.x} y={p.y} s={0.6} c="#d94a4a" rot={-20} /> : null;
      })}
      {f > 0 && <T x={540} y={1260} size={50} fill="#cfd8ea" o={f}>списывается с баланса</T>}
    </g>
  );
};
export const Equation: React.FC<{t: number; a: number}> = ({t, a}) => {
  const k1 = ease(P(t, a, a + 0.4));
  const k2 = ease(P(t, a + 0.6, a + 1.0));
  const k3 = ease(P(t, a + 1.4, a + 1.9));
  return (
    <g>
      <T x={540} y={360} size={38} fill="#9aa3b8" o={k1}>ВСЕГО НА СЧЕТУ</T>
      <T x={540} y={500} size={110} o={k1}>{`${money(160000)} ₽`}</T>
      <T x={540} y={650} size={110} fill={GOLD} o={k2}>−</T>
      <T x={540} y={790} size={110} fill={RED} o={k2}>{`${money(78000)} ₽`}</T>
      <T x={540} y={860} size={34} fill="#9aa3b8" o={k2}>43 000 + 35 000</T>
      <rect x={90} y={915} width={900 * k3} height={6} fill="#fff" opacity={0.7} />
      <Neon x={540} y={1130} w={900} h={300} c={GREEN} k={k3} t={t}>
        <T x={0} y={-60} size={34} fill="#9affc2">ОСТАНЕТСЯ</T>
        <T x={0} y={60} size={128} fill={GREEN}>{`${money(82000)} ₽`}</T>
      </Neon>
      <Burst x={540} y={1130} t={t} a={a + 1.9} c={GREEN} />
    </g>
  );
};
export const Utilities: React.FC<{t: number}> = ({t}) => {
  const k1 = ease(P(t, 140.5, 140.9));
  const k2 = ease(P(t, 142.41, 142.8));
  const k3 = ease(P(t, 144.5, 144.9));
  const k4 = ease(P(t, 147.0, 147.5));
  return (
    <g>
      <Neon x={300} y={520} w={480} h={380} c={RED} k={k1} t={t} rot={(1 - k1) * -8}>
        <path d="M20 -120 L-50 20 L-5 20 L-30 120 L60 -30 L10 -30 Z" fill={GOLD} stroke="#a67a00" strokeWidth={5} transform="translate(0 -10)" />
        <T x={0} y={150} size={34}>Электричество</T>
      </Neon>
      <T x={300} y={820} size={78} fill={RED} o={k1}>−5 000 ₽</T>
      <Neon x={780} y={520} w={400} h={380} c={RED} k={k2} t={t} rot={(1 - k2) * 8}>
        <g transform="translate(0 -30)">
          {[-90, -30, 30, 90].map((x) => <rect key={x} x={x - 18} y={-100} width={36} height={170} rx={16} fill="#e8edf6" stroke="#8a93a8" strokeWidth={4} />)}
          <path d="M-90 -130 q20 -30 0 -60 M0 -130 q20 -30 0 -60 M90 -130 q20 -30 0 -60" stroke={RED} strokeWidth={6} fill="none" strokeLinecap="round" />
        </g>
        <T x={0} y={150} size={34}>Отопление</T>
      </Neon>
      <T x={780} y={820} size={78} fill={RED} o={k2}>−4 000 ₽</T>
      <g opacity={k3}>
        <T x={540} y={1000} size={50} fill="#cfd8ea">5 000 + 4 000 = 9 000 ₽</T>
        <Neon x={540} y={1180} w={920} h={240} c={RED} k={k3} t={t}>
          <T x={0} y={34} size={96} fill={RED}>82 000 − 9 000</T>
        </Neon>
      </g>
      <Neon x={540} y={1470} w={920} h={280} c={GREEN} k={k4} t={t}>
        <T x={0} y={-60} size={34} fill="#9affc2">ОСТАТОК</T>
        <T x={0} y={60} size={120} fill={GREEN}>{`= ${money(73000)} ₽`}</T>
      </Neon>
      <Burst x={540} y={1470} t={t} a={147.0} c={GREEN} />
    </g>
  );
};
