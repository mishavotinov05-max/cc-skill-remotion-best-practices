import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {Shot, ramp, Overlay} from './Everest';
import {clamp, ease, lerp, rnd} from './util';
import {BalanceHud, Card, Finger, FONT, GarageInside, GarageRow, Man, money, P, PEOPLE, PhoneShell, Sofa, Svg, Workshop, Zhiguli, IconCompressor, IconJack, IconLift, IconTools} from './AutoArt';

export const FPSA = 30;
export const DURATIONA = 169.9;
const BOTTOM = 520; // scene shift

const T: React.FC<{x: number; y: number; size?: number; fill?: string; anchor?: 'start' | 'middle' | 'end'; children: React.ReactNode; o?: number; stroke?: string}> = ({x, y, size = 48, fill = '#fff', anchor = 'middle', children, o = 1, stroke}) => (
  <text x={x} y={y} textAnchor={anchor} fontFamily={FONT} fontWeight={700} fontSize={size} fill={fill} opacity={o} stroke={stroke} strokeWidth={stroke ? 8 : 0} paintOrder="stroke">{children}</text>
);
const tw = (t: number, a: number, b: number, from: number, to: number) => lerp(from, to, ease(P(t, a, b)));
const Tag: React.FC<{t: number; a: number; text: string; y?: number; color?: string}> = ({t, a, text, y = 340, color = '#ffd23f'}) => {
  const k = ease(P(t, a, a + 0.25));
  const w = text.length * 32 + 80;
  return (
    <g opacity={k} transform={`translate(540 ${y + (1 - k) * 20})`}>
      <rect x={-w / 2} y={-44} width={w} height={84} rx={42} fill="#0f1b33" stroke={color} strokeWidth={5} />
      <T x={0} y={14} size={40} fill={color}>{text}</T>
    </g>
  );
};
const Big: React.FC<{t: number; a: number; text: string; y?: number; color?: string; size?: number}> = ({t, a, text, y = 360, color = '#fff', size = 130}) => {
  const k = ease(P(t, a, a + 0.3));
  return (
    <g opacity={k} transform={`translate(540 ${y}) scale(${0.8 + 0.2 * k})`}>
      <T x={0} y={0} size={size} fill={color} stroke="#0b1226">{text}</T>
    </g>
  );
};
const Zoom: React.FC<{t: number; a: number; b: number; from?: number; to?: number; cy?: number; children: React.ReactNode}> = ({t, a, b, from = 1, to = 1.07, cy = 960, children}) => {
  const s = lerp(from, to, P(t, a, b));
  return <g transform={`translate(540 ${cy}) scale(${s}) translate(-540 ${-cy})`}>{children}</g>;
};
const World: React.FC<{children: React.ReactNode; fill?: string}> = ({children, fill = '#3a4660'}) => (
  <g>
    <rect width={W_} height={1920} fill={fill} />
    <g transform={`translate(0 ${BOTTOM})`}>{children}</g>
  </g>
);
const W_ = 1080;
const Room: React.FC<{t: number; dark?: boolean}> = ({t, dark = true}) => (
  <g>
    <rect x={-600} y={-900} width={2300} height={2200} fill={dark ? '#4a3d52' : '#c9b79f'} />
    <rect x={-600} y={880} width={2300} height={800} fill={dark ? '#5c4a3a' : '#9b7b5a'} />
    <rect x={-600} y={874} width={2300} height={12} fill="#000" opacity={0.2} />
    <rect x={640} y={320} width={300} height={260} rx={8} fill="#0e1426" stroke="#2a2018" strokeWidth={12} />
    {Array.from({length: 8}).map((_, i) => <circle key={i} cx={670 + rnd(i) * 250} cy={350 + rnd(i + 1) * 200} r={2} fill="#dfe9ff" />)}
    <rect x={90} y={400} width={250} height={170} rx={8} fill="#6a4c38" stroke="#3a2a1c" strokeWidth={8} />
    <rect x={110} y={420} width={210} height={130} fill="#8fb0c8" opacity={0.5} />
    <Sofa x={420} y={900} s={1.7} />
    <circle cx={300} cy={300} r={260} fill="#ffd28a" opacity={0.12} />
  </g>
);

// ---------------------------- phone UIs ----------------------------
const KEYS = ['7', '8', '9', '÷', '4', '5', '6', '×', '1', '2', '3', '−', '0', '.', '=', '+'];
const keyPos = (i: number) => ({x: -118 + (i % 4) * 79, y: 10 + Math.floor(i / 4) * 84});
const Calc: React.FC<{t: number; a: number; b: number; expr: string; res: string; x?: number; y?: number; s?: number; typeUntil?: number; sound?: boolean}> = ({t, a, b, expr, res, x = 540, y = 820, s = 1.55, typeUntil}) => {
  const tu = typeUntil ?? a + (b - a) * 0.6;
  const p = P(t, a + 0.15, tu);
  const shown = expr.slice(0, Math.ceil(expr.length * p));
  const press = (t * 3.6) % 1;
  const ki = Math.floor(t * 3.6 + a * 1.7) % 12;
  const kp = keyPos(p >= 1 ? 14 : ki);
  const done = p >= 1;
  return (
    <g>
      <PhoneShell x={x} y={y} s={s}>
        <rect x={-172} y={-356} width={344} height={712} fill="#1b1d26" />
        <T x={150} y={-250} anchor="end" size={28} fill="#9aa3b8">{shown}</T>
        <T x={150} y={-180} anchor="end" size={done ? 62 : 44} fill={done ? '#6bf29a' : '#fff'}>{done ? res : ''}</T>
        {KEYS.map((k, i) => {
          const q = keyPos(i);
          const on = !done && i === ki && press < 0.3;
          return (
            <g key={i}>
              <rect x={q.x - 34} y={q.y - 32} width={68} height={68} rx={20} fill={on ? '#ffd23f' : i % 4 === 3 || i === 14 ? '#f08a24' : '#323646'} />
              <T x={q.x} y={q.y + 14} size={32}>{k}</T>
            </g>
          );
        })}
      </PhoneShell>
      <Finger x={x + kp.x * s + 40} y={y + kp.y * s + 20} press={press < 0.3 ? 1 : 0} rot={22} />
    </g>
  );
};
const AvitoFeed: React.FC<{t: number; a: number; scroll?: boolean; price?: string}> = ({t, a, scroll = true, price}) => {
  const off = scroll ? ((t - a) * 160) % 1000 : 0;
  return (
    <PhoneShell x={540} y={820} s={1.55}>
      <rect x={-172} y={-356} width={344} height={712} fill="#f6f7fb" />
      <rect x={-172} y={-356} width={344} height={70} fill="#00aaff" />
      <T x={-140} y={-308} anchor="start" size={30}>Авито · Гаражи</T>
      <g transform={`translate(0 ${-off % 340})`}>
        {Array.from({length: 6}).map((_, i) => (
          <g key={i} transform={`translate(0 ${-250 + i * 170})`}>
            <rect x={-156} y={0} width={312} height={150} rx={14} fill="#fff" stroke="#d6dbe6" strokeWidth={3} />
            <rect x={-146} y={10} width={130} height={130} rx={10} fill={['#a9764e', '#9a9aa4', '#7a8aa0', '#b08a5a'][i % 4]} />
            <rect x={-130} y={50} width={98} height={90} fill="#4a4d56" />
            <T x={0} y={50} anchor="start" size={20} fill="#1a2238">Гараж {18 + ((i * 7) % 20)} м²</T>
            <T x={0} y={92} anchor="start" size={28} fill="#0a8a3c">{`${money(30000 + ((i * 17000) % 90000))} ₽`}</T>
          </g>
        ))}
      </g>
    </PhoneShell>
  );
};
const Listing: React.FC<{t: number; a: number; price: string; label: string; note: string; color: string; garage: number}> = ({t, a, price, label, note, color, garage}) => {
  const k = ease(P(t, a, a + 0.4));
  return (
    <g>
      <rect x={-600} y={-900} width={2300} height={2200} fill="#dfe6f2" />
      <g opacity={k} transform={`translate(540 ${700 + (1 - k) * 40})`}>
        <rect x={-420} y={-360} width={840} height={820} rx={46} fill="#fff" stroke="#00aaff" strokeWidth={8} />
        <g transform="translate(0 -120)">
          <rect x={-380} y={-200} width={760} height={330} rx={26} fill={['#a9764e', '#9a9aa4', '#7a8aa0'][garage]} />
          <rect x={-250} y={-170} width={500} height={300} fill="#5f6b78" stroke="#2a2e38" strokeWidth={8} />
          {[0, 1, 2, 3, 4].map((q) => <rect key={q} x={-250} y={-140 + q * 56} width={500} height={5} fill="#000" opacity={0.2} />)}
        </g>
        <T x={0} y={230} size={78} fill="#0a8a3c">{price}</T>
        <T x={0} y={320} size={46} fill="#44506a">{label}</T>
      </g>
      <g opacity={ease(P(t, a + 0.8, a + 1.1))} transform={`translate(540 ${1350})`}>
        <rect x={-300} y={-60} width={600} height={120} rx={60} fill={color} />
        <T x={0} y={18} size={56}>{note}</T>
      </g>
    </g>
  );
};
const Chat: React.FC<{t: number; a: number; lines: {at: number; me?: boolean; text: string}[]; title: string}> = ({t, a, lines, title}) => (
  <PhoneShell x={540} y={820} s={1.55}>
    <rect x={-172} y={-356} width={344} height={712} fill="#e9eef7" />
    <rect x={-172} y={-356} width={344} height={74} fill="#2f6fbb" />
    <T x={0} y={-308} size={30}>{title}</T>
    {lines.map((l, i) => {
      const k = ease(P(t, l.at, l.at + 0.25));
      return (
        <g key={i} opacity={k} transform={`translate(0 ${-250 + i * 140 + (1 - k) * 12})`}>
          <rect x={l.me ? 4 : -160} y={0} width={156} height={118} rx={20} fill={l.me ? '#d6f5c9' : '#fff'} />
          {l.text.split('\n').map((ln, q) => <T key={q} x={(l.me ? 4 : -160) + 78} y={38 + q * 32} size={22} fill="#1a2238">{ln}</T>)}
        </g>
      );
    })}
  </PhoneShell>
);
const RingPhone: React.FC<{t: number; a: number; name: string; accepted?: number}> = ({t, a, name, accepted = 99}) => {
  const shake = t < accepted ? Math.sin(t * 40) * 3 : 0;
  return (
    <PhoneShell x={540} y={820} s={1.55} rot={shake}>
      <rect x={-172} y={-356} width={344} height={712} fill="#14182a" />
      <circle cx={0} cy={-120} r={70} fill="#2f6fbb" />
      <T x={0} y={-105} size={70}>{name[0]}</T>
      <T x={0} y={0} size={34}>{name}</T>
      <T x={0} y={40} size={22} fill="#9aa3b8">{t < accepted ? 'Входящий звонок…' : '00:0' + Math.min(9, Math.floor(t - accepted))}</T>
      {t < accepted ? (
        <g>
          <circle cx={-80} cy={220} r={42} fill="#d33a2c" />
          <circle cx={80} cy={220} r={42 + Math.sin(t * 12) * 3} fill="#2fbf60" />
        </g>
      ) : (
        <circle cx={0} cy={220} r={42} fill="#d33a2c" />
      )}
    </PhoneShell>
  );
};
const Bars: React.FC<{t: number; a: number}> = ({t, a}) => {
  const k1 = ease(P(t, a, a + 0.8));
  const k2 = ease(P(t, a + 0.7, a + 1.8));
  return (
    <g transform="translate(0 0)">
      <rect x={90} y={460} width={900} height={760} rx={40} fill="#0f1b33" opacity={0.92} stroke="#ffd23f" strokeWidth={4} />
      <T x={540} y={540} size={40} fill="#ffd23f">ЗА 5 МЕСЯЦЕВ</T>
      <rect x={150} y={650} width={700 * 0.375 * k1 + 1} height={150} rx={20} fill="#e5483f" />
      <T x={150} y={635} anchor="start" size={34} fill="#fff">Зарплата механика</T>
      <T x={150 + 700 * 0.375 * k1 + 20} y={745} anchor="start" size={50} fill="#fff" o={k1}>{`${money(225000 * k1)} ₽`}</T>
      <rect x={150} y={900} width={700 * k2 + 1} height={150} rx={20} fill="#2fbf60" />
      <T x={150} y={885} anchor="start" size={34} fill="#fff">Автосервис (выручка)</T>
      <T x={150 + Math.min(700 * k2, 480) + 20} y={995} anchor="start" size={50} fill="#fff" o={k2}>{`${money(600000 * k2)} ₽`}</T>
      <T x={540} y={1150} size={34} fill="#9aa3b8">в месяц: 45 000 против 600 000</T>
    </g>
  );
};
const Equip: React.FC<{t: number; a: number; b: number}> = ({t, a, b}) => {
  const items = [
    {at: 97.16, name: 'Подъёмник', price: 150000, Icon: IconLift},
    {at: 99.52, name: 'Инструменты', price: 20000, Icon: IconTools},
    {at: 101.45, name: 'Компрессор', price: 15000, Icon: IconCompressor},
    {at: 103.24, name: 'Домкрат', price: 8000, Icon: IconJack},
  ];
  let total = 0;
  items.forEach((i) => (total += t >= i.at ? i.price : 0));
  const rent = t >= 105.14 ? 35000 : 0;
  return (
    <g>
      <rect x={-600} y={-900} width={2300} height={2200} fill="#1f2d4d" />
      <T x={540} y={290} size={44} fill="#9aa3b8">ОБОРУДОВАНИЕ</T>
      {items.map((it, i) => {
        const k = ease(P(t, it.at, it.at + 0.4));
        const Ic = it.Icon;
        const x = 300 + (i % 2) * 480;
        const y = 600 + Math.floor(i / 2) * 420;
        return (
          <Card key={i} x={x} y={y} w={430} h={360} k={k} accent="#f2f5fb">
            <g transform="translate(0 -40)"><Ic s={0.95} /></g>
            <T x={0} y={110} size={34} fill="#1a2238">{it.name}</T>
            <T x={0} y={160} size={46} fill="#d33a2c">{`${money(it.price)} ₽`}</T>
          </Card>
        );
      })}
      <g transform="translate(540 1500)">
        <rect x={-400} y={-70} width={800} height={rent ? 250 : 140} rx={36} fill="#0f1b33" stroke="#ffd23f" strokeWidth={5} />
        <T x={-360} y={0} anchor="start" size={28} fill="#9aa3b8">Корзина</T>
        <T x={360} y={10} anchor="end" size={58} fill="#fff">{`${money(total)} ₽`}</T>
        {rent > 0 && <T x={-360} y={78} anchor="start" size={34} fill="#9aa3b8">+ аренда гаража</T>}
        {rent > 0 && <T x={360} y={80} anchor="end" size={46} fill="#ff7a6e">{`+ ${money(rent)} ₽`}</T>}
        {t >= 107.5 && <T x={360} y={160} anchor="end" size={70} fill="#ffd23f" o={ease(P(t, 107.5, 108.2))}>{`= ${money(228000)} ₽`}</T>}
      </g>
    </g>
  );
};
const Bank: React.FC<{t: number; a: number}> = ({t, a}) => (
  <g>
    <rect x={-600} y={-900} width={2300} height={2200} fill="#1d3a2e" />
    <PhoneShell x={540} y={940} s={1.55}>
      <rect x={-172} y={-356} width={344} height={712} fill="#0e2a1f" />
      <T x={0} y={-280} size={30} fill="#9fe0b8">Мой банк</T>
      <rect x={-140} y={-230} width={280} height={170} rx={24} fill="#2fbf60" />
      <T x={-110} y={-176} anchor="start" size={20} fill="#0e2a1f">СЧЁТ</T>
      <T x={0} y={-100} size={48} fill="#fff">{`${money(tw(t, a, a + 1.4, 0, 160000))} ₽`}</T>
      <T x={0} y={10} size={26} fill="#9fe0b8">Накопления</T>
      {Array.from({length: 4}).map((_, i) => <rect key={i} x={-140} y={60 + i * 60} width={280} height={40} rx={10} fill="#16402f" />)}
    </PhoneShell>
  </g>
);

// ---------------------------- scenes ----------------------------
const Mech: React.FC<{x: number; y?: number; s?: number; pose?: any; t: number; mood?: any; flip?: boolean; look?: number}> = ({x, y = 900, s = 1.35, pose = 'stand', t, mood = 'neutral', flip, look}) => (
  <Man p={PEOPLE.mech} x={x} y={y} s={s} pose={pose} t={t} mood={mood} flip={flip} look={look} />
);
const Ownr: React.FC<{x: number; y?: number; s?: number; pose?: any; t: number; flip?: boolean; mood?: any}> = ({x, y = 900, s = 1.35, pose = 'stand', t, flip, mood}) => (
  <Man p={PEOPLE.owner} x={x} y={y} s={s} pose={pose} t={t} flip={flip} mood={mood} />
);

const WheelClose: React.FC<{t: number}> = ({t}) => (
  <g>
    <rect x={-600} y={-900} width={2300} height={2200} fill="#4a4f5a" />
    <g transform="translate(540 900)">
      <circle r={430} fill="#17181d" />
      <circle r={300} fill="#b8bcc6" />
      <circle r={290} fill="#9aa0ac" />
      <g transform={`rotate(${t * 40})`}>
        {[0, 72, 144, 216, 288].map((a) => (
          <g key={a} transform={`rotate(${a}) translate(0 -170)`}>
            <circle r={36} fill="#3a3f4a" />
            <path d="M-14 0 L14 0 M0 -14 L0 14" stroke="#8d94a3" strokeWidth={8} />
          </g>
        ))}
      </g>
      <circle r={70} fill="#6a7186" />
      <g transform={`rotate(${Math.sin(t * 5) * 14 - 40}) translate(0 -170)`}>
        <rect x={-18} y={-30} width={36} height={420} rx={12} fill="#c0392b" />
        <rect x={-40} y={-50} width={80} height={60} rx={14} fill="#8d94a3" />
      </g>
    </g>
  </g>
);

const CarsRoad: React.FC<{t: number; pan: number}> = ({t, pan}) => <GarageRow t={t} pan={pan} />;

export const Auto: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPSA;
  // balance
  const bal =
    t < 120.54 ? 160000 : t < 122.57 ? tw(t, 120.54, 121.4, 160000, 117000) : t < 125 ? tw(t, 122.57, 123.5, 117000, 82000) : t < 140.5 ? 82000 : t < 142.41 ? tw(t, 140.5, 141.3, 82000, 77000) : t < 144.27 ? tw(t, 142.41, 143.2, 77000, 73000) : 73000;
  const showHud = t >= 109.75 && t < 169.0;
  const delta =
    t >= 120.54 && t < 122.2 ? {text: '−43 000', color: '#ff5a4d', k: P(t, 120.54, 122.2)} :
    t >= 122.57 && t < 124.2 ? {text: '−35 000', color: '#ff5a4d', k: P(t, 122.57, 124.2)} :
    t >= 140.5 && t < 142 ? {text: '−5 000', color: '#ff5a4d', k: P(t, 140.5, 142)} :
    t >= 142.41 && t < 144 ? {text: '−4 000', color: '#ff5a4d', k: P(t, 142.41, 144)} : null;
  const S = (a: number, d: number, src: string, v: number | ((f: number) => number)) => (
    <Sequence key={`${src}${a}`} from={Math.round(a * FPSA)} durationInFrames={Math.round(d * FPSA)}>
      <Audio src={staticFile(`sfx/${src}.mp3`)} volume={v} />
    </Sequence>
  );
  const fade = ramp([[0, 1], [168.9, 1], [169.85, 0]]);
  void fade;
  const black = clamp((t - 169.45) / 0.4);
  const bedV = ramp([[0, 0.05], [165, 0.05], [169.8, 0]]);
  const hum = ramp([[0, 0.06], [14, 0.06], [16, 0], [127.9, 0], [129, 0.05], [135, 0.05], [137, 0]]);
  const clicks: number[] = [];
  for (let c = 18.6; c < 27.4; c += 0.28) clicks.push(c);
  for (let c = 28.0; c < 33.3; c += 0.28) clicks.push(c);
  for (let c = 33.9; c < 38.0; c += 0.28) clicks.push(c);
  return (
    <AbsoluteFill style={{backgroundColor: '#1d2740'}}>
      <Audio src={staticFile('voice8.mp3')} volume={1} />
      <Audio src={staticFile('sfx/bed.mp3')} volume={bedV} />
      <Audio src={staticFile('sfx/hum.mp3')} volume={hum} />
      {clicks.map((c, i) => S(c, 0.3, 'click', 0.1 + (i % 3) * 0.01))}
      {S(15.7, 0.8, 'notif', 0.1)}
      {S(57.6, 1.8, 'scroll', 0.12)}
      {S(67.5, 6, 'traffic', ramp([[0, 0], [0.8, 0.06], [3, 0.05], [4.2, 0]]))}
      {S(71.7, 3, 'ring', 0.12)}
      {S(77.3, 6, 'traffic', ramp([[0, 0], [0.8, 0.07], [5, 0.06], [6, 0]]))}
      {S(84.0, 1.2, 'creak', 0.18)}
      {S(90.8, 1.0, 'success', 0.1)}
      {S(97.2, 0.6, 'click', 0.14)}
      {S(99.55, 0.6, 'click', 0.14)}
      {S(101.5, 0.6, 'click', 0.14)}
      {S(103.3, 0.6, 'click', 0.14)}
      {S(105.2, 0.6, 'click', 0.14)}
      {S(109.8, 0.8, 'notif', 0.1)}
      {S(114.4, 1.0, 'bad', 0.12)}
      {S(120.6, 0.8, 'bad', 0.1)}
      {S(122.6, 0.8, 'bad', 0.1)}
      {S(125.5, 1.0, 'success', 0.1)}
      {S(130.6, 0.8, 'notif', 0.12)}
      {S(140.5, 0.8, 'bad', 0.1)}
      {S(142.4, 0.8, 'bad', 0.1)}
      {S(147.0, 1.0, 'success', 0.1)}
      {S(149.4, 0.6, 'click', 0.12)}
      {S(151.45, 3, 'ring', 0.12)}
      {S(165.4, 1.0, 'success', 0.08)}

      {/* 1. clock 21:00 */}
      <Shot a={0} b={1.62} t={t}>
        <Svg>
          <World fill="#2a3348">
            <Workshop t={t} />
            <rect x={-600} y={-900} width={2300} height={2200} fill="#0b1226" opacity={0.35} />
          </World>
          <g transform="translate(540 760)">
            <circle r={230} fill="#f6f7fb" stroke="#1a2238" strokeWidth={14} />
            {Array.from({length: 12}).map((_, i) => <rect key={i} x={-4} y={-208} width={8} height={26} fill="#1a2238" transform={`rotate(${i * 30})`} />)}
            <rect x={-8} y={-150} width={16} height={150} rx={8} fill="#1a2238" transform="rotate(270)" />
            <rect x={-6} y={-190} width={12} height={190} rx={6} fill="#d33a2c" transform={`rotate(${(t * 60) % 360})`} />
          </g>
          <Big t={t} a={0.1} text="21:00" y={1230} size={140} />
        </Svg>
      </Shot>
      {/* 2. mechanic */}
      <Shot a={1.62} b={4.02} t={t}>
        <Svg>
          <Zoom t={t} a={1.62} b={4.02} from={1} to={1.08}>
            <World><Workshop t={t} /><Mech x={260} t={t} pose="tired" mood="tired" /></World>
          </Zoom>
          <Tag t={t} a={1.8} text="АВТОМЕХАНИК" y={300} />
        </Svg>
      </Shot>
      {/* 3. wheel */}
      <Shot a={4.02} b={8.02} t={t}>
        <Svg>
          {t < 6.1 ? (
            <Zoom t={t} a={4.02} b={6.1} from={1} to={1.12} cy={1000}>
              <World><Workshop t={t} wheelRot={t * 90} /><Man p={PEOPLE.mech} x={150} y={900} s={1.25} pose="point" t={t} mood="tired" /></World>
            </Zoom>
          ) : (
            <World><WheelClose t={t} /></World>
          )}
          <Tag t={t} a={4.2} text="СТАРЫЕ ЖИГУЛИ" y={300} color="#ff9e4a" />
        </Svg>
      </Shot>
      {/* 4. pay */}
      <Shot a={8.02} b={13.15} t={t}>
        <Svg>
          <World><Workshop t={t} /><Mech x={250} t={t} pose="tired" mood="tired" /></World>
          <Card x={640} y={640} w={640} h={330} k={ease(P(t, 8.3, 8.7))} accent="#f2f5fb">
            <T x={0} y={-60} size={36} fill="#44506a">СМЕНА 12 ЧАСОВ</T>
            <T x={0} y={50} size={100} fill="#1a2238">1 500 ₽</T>
          </Card>
          {t > 12.4 && <Tag t={t} a={12.4} text="ЭТО МАЛО" y={1500} color="#ff7a6e" />}
        </Svg>
      </Shot>
      {/* 5. 125/hour */}
      <Shot a={13.15} b={15.59} t={t}>
        <Svg>
          <World fill="#2a3348"><Workshop t={t} /><Mech x={250} t={t} pose="tired" mood="tired" /></World>
          <rect width={1080} height={1920} fill="#0b1226" opacity={0.35} />
          <Big t={t} a={13.3} text="125 ₽" y={560} color="#ffd23f" size={190} />
          <Big t={t} a={13.9} text="в час" y={680} size={80} />
        </Svg>
      </Shot>
      {/* 6. sofa */}
      <Shot a={15.59} b={18.39} t={t}>
        <Svg>
          <Zoom t={t} a={15.59} b={18.39}>
            <World fill="#4a3d52"><Room t={t} /><Man p={PEOPLE.mech} x={470} y={900} s={1.1} pose="sit" t={t} mood="tired" /></World>
          </Zoom>
          <Tag t={t} a={15.8} text="ДОМА · ДИВАН" y={300} color="#9fd0ff" />
        </Svg>
      </Shot>
      {/* 7. calc open + 8. three services */}
      <Shot a={18.39} b={27.43} t={t}>
        <Svg>
          <rect width={1080} height={1920} fill="#1f2d4d" />
          <Calc t={t} a={18.39} b={27.43} expr="2000 + 1000 + 1500" res="4 500" typeUntil={27.2} />
          {[
            {at: 20.22, text: 'Замена колёс', price: '2 000 ₽', y: 1450},
            {at: 22.78, text: 'Замена масла', price: '1 000 ₽', y: 1450},
            {at: 24.88, text: 'Мелкий ремонт', price: '1 500 ₽', y: 1450},
          ].map((c, i) => t >= c.at && t < c.at + 2.3 && (
            <Card key={i} x={540} y={c.y} w={760} h={160} k={ease(P(t, c.at, c.at + 0.3)) * (1 - ease(P(t, c.at + 2.0, c.at + 2.3)))} accent="#f2f5fb">
              <T x={-330} y={14} anchor="start" size={44} fill="#1a2238">{c.text}</T>
              <T x={330} y={16} anchor="end" size={56} fill="#0a8a3c">{c.price}</T>
            </Card>
          ))}
          <Big t={t} a={18.5} text="ЦЕНЫ НА УСЛУГИ" y={210} size={64} color="#ffd23f" />
        </Svg>
      </Shot>
      {/* 9. 10 clients */}
      <Shot a={27.43} b={33.35} t={t}>
        <Svg>
          <rect width={1080} height={1920} fill="#1f2d4d" />
          <T x={540} y={240} size={60} fill="#ffd23f">10 КЛИЕНТОВ В ДЕНЬ</T>
          {Array.from({length: 10}).map((_, i) => {
            const k = ease(P(t, 27.6 + i * 0.12, 27.9 + i * 0.12));
            return <g key={i} opacity={k} transform={`translate(${130 + (i % 5) * 205} ${440 + Math.floor(i / 5) * 190})`}><circle r={52} fill="#e8b48a" /><rect x={-48} y={50} width={96} height={64} rx={26} fill={['#2f66bb', '#2f8f4c', '#7b5233', '#b04a3a', '#6a4a8a'][i % 5]} /></g>;
          })}
          <T x={540} y={900} size={80}>{`× 2 000 ₽`}</T>
          <Big t={t} a={30.38} text="= 20 000 ₽" y={1100} size={120} color="#6bf29a" />
          <Big t={t} a={33.0} text="В ДЕНЬ" y={1220} size={60} color="#fff" />
        </Svg>
      </Shot>
      {/* 10. x30 */}
      <Shot a={33.35} b={38.0} t={t}>
        <Svg>
          <rect width={1080} height={1920} fill="#1f2d4d" />
          <Big t={t} a={33.4} text="20 000 ₽" y={560} size={130} color="#6bf29a" />
          <Big t={t} a={36.0} text="× 30 дней" y={760} size={96} />
          <g transform="translate(540 1200)">
            {Array.from({length: 30}).map((_, i) => {
              const k = ease(P(t, 36.0 + i * 0.05, 36.3 + i * 0.05));
              return <rect key={i} x={-400 + (i % 10) * 80} y={-160 + Math.floor(i / 10) * 100} width={66} height={80} rx={14} fill="#f2f5fb" opacity={k}><title>{i}</title></rect>;
            })}
          </g>
        </Svg>
      </Shot>
      {/* 11. 600 000 and bars */}
      <Shot a={38.0} b={43.91} t={t}>
        <Svg>
          <rect width={1080} height={1920} fill="#1f2d4d" />
          {t < 40.5 ? <Big t={t} a={38.0} text="600 000 ₽" y={900} size={150} color="#ffd23f" /> : <Bars t={t} a={40.5} />}
          {t < 40.5 && <T x={540} y={1050} size={56}>в месяц</T>}
        </Svg>
      </Shot>
      {/* 12. expenses */}
      <Shot a={43.91} b={51.99} t={t}>
        <Svg>
          <rect width={1080} height={1920} fill="#1f2d4d" />
          <T x={540} y={240} size={52} fill="#ff7a6e">РАСХОДЫ</T>
          {[
            {at: 44.2, text: 'Аренда'},
            {at: 45.0, text: 'Зарплаты'},
            {at: 46.0, text: 'Расходники'},
            {at: 47.0, text: 'Налоги'},
          ].map((c, i) => (
            <Card key={i} x={540} y={430 + i * 190} w={700} h={150} k={ease(P(t, c.at, c.at + 0.3))} accent="#f2f5fb">
              <T x={0} y={18} size={56} fill="#1a2238">{c.text}</T>
            </Card>
          ))}
          <Big t={t} a={48.14} text="≈ 150 000 ₽" y={1380} size={110} color="#6bf29a" />
          <T x={540} y={1470} size={42} fill="#cfd8ea" o={ease(P(t, 48.6, 49))}>чистая прибыль в месяц</T>
        </Svg>
      </Shot>
      {/* 13. idea */}
      <Shot a={51.99} b={57.61} t={t}>
        <Svg>
          <Zoom t={t} a={51.99} b={57.61}>
            <World fill="#4a3d52"><Room t={t} /><Man p={PEOPLE.mech} x={470} y={900} s={1.1} pose="sit" t={t} mood="happy" /></World>
          </Zoom>
          <g transform="translate(540 580)" opacity={ease(P(t, 52.2, 52.6))}>
            <circle r={150} fill="#ffd23f" opacity={0.25} />
            <circle r={78} fill="#ffe27a" />
            <rect x={-30} y={70} width={60} height={46} rx={10} fill="#8d94a3" />
          </g>
          <Tag t={t} a={52.4} text="ИДЕЯ: СВОЙ АВТОСЕРВИС" y={300} />
        </Svg>
      </Shot>
      {/* 14. Avito */}
      <Shot a={57.61} b={59.09} t={t}>
        <Svg><rect width={1080} height={1920} fill="#dfe6f2" /><AvitoFeed t={t} a={57.61} /><Finger x={720} y={1250 - 30 * Math.sin(t * 6)} rot={14} /></Svg>
      </Shot>
      {/* 15-17 garages */}
      <Shot a={59.09} b={63.07} t={t}><Svg><Listing t={t} a={59.09} price="100 000 ₽" label="Гараж · центр" note={t > 61.8 ? 'ДОРОГО' : ''} color="#e5483f" garage={0} /></Svg></Shot>
      <Shot a={63.07} b={66.5} t={t}><Svg><Listing t={t} a={63.07} price="50 000 ₽" label="Гараж · окраина" note={t > 65.0 ? 'ДАЛЕКО' : ''} color="#e5483f" garage={1} /></Svg></Shot>
      <Shot a={66.5} b={71.68} t={t}><Svg><Listing t={t} a={66.5} price="35 000 ₽" label="Гараж · у дороги" note={t > 69.0 ? 'ВОЗЛЕ ДОРОГИ' : 'ВЫГОДНО'} color="#2fbf60" garage={2} /></Svg></Shot>
      {/* 18. call */}
      <Shot a={71.68} b={74.97} t={t}>
        <Svg><rect width={1080} height={1920} fill="#14182a" /><RingPhone t={t} a={71.68} name="Владелец гаража" accepted={73.2} /></Svg>
      </Shot>
      {/* 19-21 next day */}
      <Shot a={74.97} b={77.68} t={t}>
        <Svg>
          <World fill="#9ec6e8"><GarageRow t={t} pan={(t - 74.97) * 60} /></World>
          <Tag t={t} a={75.1} text="НА СЛЕДУЮЩИЙ ДЕНЬ" y={300} color="#fff" />
          <Mech x={300} y={1750} s={1.2} pose="walk" t={t} />
        </Svg>
      </Shot>
      <Shot a={77.68} b={83.86} t={t}>
        <Svg>
          <World fill="#9ec6e8"><GarageRow t={t} pan={120 + (t - 77.68) * 55} /></World>
          {t < 81.88 ? <Tag t={t} a={77.8} text="ЖИЛЫЕ ДОМА РЯДОМ" y={300} color="#fff" /> : <Tag t={t} a={81.9} text="ИДЕАЛЬНОЕ МЕСТО" y={300} color="#6bf29a" />}
          <Mech x={300} y={1750} s={1.2} pose="walk" t={t} />
        </Svg>
      </Shot>
      <Shot a={83.86} b={90.81} t={t}>
        <Svg>
          <World fill="#9ec6e8"><GarageRow t={t} pan={250} gateOpen={P(t, 83.86, 85.6)} />
            <Ownr x={760} y={1340} s={1.05} pose={t > 86.3 ? 'point' : 'stand'} t={t} flip />
          </World>
          <Mech x={300} y={1750} s={1.2} t={t} look={1} />
          {t > 86.6 && t < 90.7 && (
            <g transform="translate(540 1150)" opacity={ease(P(t, 86.6, 86.9))}>
              <rect x={-420} y={-70} width={840} height={140} rx={40} fill="#fff" stroke="#1a2238" strokeWidth={5} />
              <T x={0} y={16} size={44} fill="#1a2238">{t < 88.8 ? '«Заходи, смотри»' : '«Цена — как договорились»'}</T>
            </g>
          )}
        </Svg>
      </Shot>
      {/* 22. decide */}
      <Shot a={90.81} b={94.82} t={t}>
        <Svg>
          <World><GarageInside t={t} /><Mech x={330} t={t} mood="happy" look={1} /><Ownr x={760} t={t} flip /></World>
          <Card x={540} y={380} w={720} h={200} k={ease(P(t, 91.2, 91.6))} accent="#f2f5fb">
            <T x={0} y={-20} size={36} fill="#44506a">АРЕНДА ГАРАЖА</T>
            <T x={0} y={50} size={66} fill="#d33a2c">35 000 ₽ / мес</T>
          </Card>
        </Svg>
      </Shot>
      {/* 23-26 equipment & total */}
      <Shot a={94.82} b={109.75} t={t}><Svg><Equip t={t} a={94.82} b={109.75} /></Svg></Shot>
      {/* 27. bank */}
      <Shot a={109.75} b={114.36} t={t}><Svg><Bank t={t} a={109.75} /></Svg></Shot>
      {/* 28. missing */}
      <Shot a={114.36} b={117.85} t={t}>
        <Svg>
          <rect width={1080} height={1920} fill="#2a2036" />
          <T x={540} y={640} size={60} fill="#cfd8ea">228 000 − 160 000</T>
          <Big t={t} a={114.6} text="НЕ ХВАТАЕТ" y={900} size={90} color="#ff7a6e" />
          <Big t={t} a={115.0} text="68 000 ₽" y={1060} size={140} color="#ff5a4d" />
        </Svg>
      </Shot>
      {/* 29. without lift */}
      <Shot a={117.85} b={120.54} t={t}>
        <Svg>
          <rect width={1080} height={1920} fill="#1f2d4d" />
          <Card x={540} y={760} w={700} h={360} k={ease(P(t, 118.0, 118.4))} accent="#f2f5fb">
            <g transform="translate(0 -20)"><IconLift s={1.0} /></g>
            <T x={0} y={160} size={46} fill="#1a2238">Подъёмник</T>
          </Card>
          {t > 118.4 && <g opacity={ease(P(t, 118.4, 118.8))}><path d="M120 560 L960 960 M960 560 L120 960" stroke="#e5483f" strokeWidth={30} strokeLinecap="round" /></g>}
          <Big t={t} a={119.0} text="БЕЗ ПОДЪЁМНИКА" y={1140} size={68} color="#ffd23f" />
        </Svg>
      </Shot>
      {/* 30. rest of equipment */}
      <Shot a={120.54} b={122.57} t={t}>
        <Svg>
          <rect width={1080} height={1920} fill="#1f2d4d" />
          <T x={540} y={800} size={54} fill="#cfd8ea">остальное оборудование</T>
          <Big t={t} a={120.7} text="43 000 ₽" y={980} size={120} color="#ff7a6e" />
        </Svg>
      </Shot>
      <Shot a={122.57} b={127.95} t={t}>
        <Svg>
          <rect width={1080} height={1920} fill="#1f2d4d" />
          <T x={540} y={800} size={54} fill="#cfd8ea">аренда гаража</T>
          <Big t={t} a={122.7} text="35 000 ₽" y={980} size={120} color="#ff7a6e" />
          {t > 124.8 && <Big t={t} a={124.8} text="Осталось 82 000 ₽" y={1250} size={74} color="#6bf29a" />}
        </Svg>
      </Shot>
      {/* 31. garage ready */}
      <Shot a={127.95} b={130.59} t={t}>
        <Svg>
          <World><GarageInside t={t} lightShaft={1} />
            <Mech x={330} t={t} mood="happy" />
            <g transform="translate(760 880)"><IconLift s={1.5} /></g>
          </World>
          <Tag t={t} a={128.1} text="ГАРАЖ ГОТОВ" y={300} color="#6bf29a" />
        </Svg>
      </Shot>
      {/* 32. chat */}
      <Shot a={130.59} b={137.11} t={t}>
        <Svg>
          <rect width={1080} height={1920} fill="#14182a" />
          <Chat t={t} a={130.59} title="Владелец гаража" lines={[
            {at: 130.8, text: 'Привет!\nКак дела с\nгаражом?'},
            {at: 133.67, text: 'Коммуналку\nза гараж\nпо счётчикам'},
          ]} />
        </Svg>
      </Shot>
      {/* 33. utilities */}
      <Shot a={137.11} b={144.27} t={t}>
        <Svg>
          <World><GarageInside t={t} /><Mech x={330} t={t} mood="worried" /></World>
          <Tag t={t} a={137.3} text="ЗАБЫЛ ПРО КОММУНАЛКУ" y={300} color="#ff7a6e" />
          {t > 140.5 && <Card x={300} y={620} w={460} h={170} k={ease(P(t, 140.5, 140.9))} accent="#f2f5fb"><T x={0} y={-20} size={32} fill="#44506a">Электричество</T><T x={0} y={44} size={52} fill="#d33a2c">−5 000 ₽</T></Card>}
          {t > 142.41 && <Card x={780} y={620} w={460} h={170} k={ease(P(t, 142.41, 142.8))} accent="#f2f5fb"><T x={0} y={-20} size={32} fill="#44506a">Отопление</T><T x={0} y={44} size={52} fill="#d33a2c">−4 000 ₽</T></Card>}
        </Svg>
      </Shot>
      {/* 34. -9000 */}
      <Shot a={144.27} b={149.29} t={t}>
        <Svg>
          <rect width={1080} height={1920} fill="#1f2d4d" />
          <Big t={t} a={144.4} text="−9 000 ₽" y={760} size={140} color="#ff5a4d" />
          <Big t={t} a={147.0} text="Остаток 73 000 ₽" y={1000} size={86} color="#6bf29a" />
        </Svg>
      </Shot>
      {/* 35. ad */}
      <Shot a={149.29} b={151.42} t={t}>
        <Svg>
          <rect width={1080} height={1920} fill="#dfe6f2" />
          <PhoneShell x={540} y={820} s={1.55}>
            <rect x={-172} y={-356} width={344} height={712} fill="#f6f7fb" />
            <rect x={-172} y={-356} width={344} height={70} fill="#00aaff" />
            <T x={-140} y={-308} anchor="start" size={30}>Авито · Новое объявление</T>
            <rect x={-150} y={-260} width={300} height={170} rx={14} fill="#a9764e" />
            <T x={0} y={-30} size={30} fill="#1a2238">АВТОСЕРВИС</T>
            <T x={0} y={20} size={18} fill="#44506a">Колёса · масло · ремонт</T>
            <rect x={-130} y={140} width={260} height={80} rx={40} fill="#00aaff" />
            <T x={0} y={192} size={32}>Опубликовать</T>
          </PhoneShell>
          <Finger x={600} y={820 + 190 * 1.55} press={t > 150.5 ? 1 : 0} rot={20} />
        </Svg>
      </Shot>
      {/* 36. morning call */}
      <Shot a={151.42} b={159.98} t={t}>
        <Svg>
          <Zoom t={t} a={151.42} b={159.98}>
            <World><Workshop t={t} night={false} /><Mech x={260} t={t} mood="neutral" look={1} /></World>
          </Zoom>
          <Tag t={t} a={151.5} text="УТРО" y={300} color="#fff" />
          <g transform="translate(790 640)" opacity={ease(P(t, 151.5, 151.9)) * (1 - ease(P(t, 153.3, 153.6)))}>
            <rect x={-170} y={-80} width={340} height={160} rx={40} fill="#fff" stroke="#1a2238" strokeWidth={5} />
            <T x={0} y={14} size={44} fill="#1a2238">Звонок!</T>
          </g>
          <g transform="translate(540 1250)" opacity={ease(P(t, 154.2, 154.5))}>
            <rect x={-440} y={-70} width={880} height={140} rx={40} fill="#fff" stroke="#1a2238" strokeWidth={5} />
            <T x={0} y={16} size={42} fill="#1a2238">{t < 157 ? '«Сколько стоит замена колодок?»' : '«На Ладе»'}</T>
          </g>
        </Svg>
      </Shot>
      {/* 37. price */}
      <Shot a={159.98} b={165.34} t={t}>
        <Svg>
          <Zoom t={t} a={159.98} b={165.34}>
            <World><Workshop t={t} night={false} /><Mech x={260} t={t} mood="happy" /></World>
          </Zoom>
          <Card x={640} y={620} w={640} h={260} k={ease(P(t, 160.1, 160.5))} accent="#f2f5fb">
            <T x={0} y={-30} size={34} fill="#44506a">РАБОТА</T>
            <T x={0} y={60} size={96} fill="#0a8a3c">1 500 ₽</T>
          </Card>
          {t > 161.87 && <Tag t={t} a={161.9} text="ПРИЕДЕТ ЧЕРЕЗ ЧАС" y={1500} color="#ffd23f" />}
        </Svg>
      </Shot>
      {/* 38. first client */}
      <Shot a={165.34} b={DURATIONA} t={t}>
        <Svg>
          <World fill="#9ec6e8">
            <GarageRow t={t} pan={250} gateOpen={1} />
            <Zhiguli x={300 + P(t, 165.34, 168) * 220} y={1330} s={0.9} wheelRot={t * 300} color="#c0392b" lada />
            <Man p={PEOPLE.client} x={780} y={1360} s={1.05} t={t} flip mood="happy" />
          </World>
          <Mech x={260} y={1750} s={1.25} t={t} mood="happy" look={1} />
          {t > 168.0 && <Big t={t} a={168.0} text="ПЕРВЫЙ КЛИЕНТ" y={420} size={84} color="#ffd23f" />}
        </Svg>
      </Shot>

      {showHud && (
        <AbsoluteFill><Svg>
          <BalanceHud value={bal} delta={delta} />
        </Svg></AbsoluteFill>
      )}
      <Overlay t={t} frame={frame} />
      <AbsoluteFill style={{backgroundColor: '#000', opacity: black}} />
    </AbsoluteFill>
  );
};
