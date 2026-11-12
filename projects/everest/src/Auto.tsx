import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {ramp, Overlay} from './Everest';
import {AutoSub} from './AutoSub';
import subsA from './subs_auto.json';
import {Arrow, Bars, BankCard, Cam, CK, Drain, Equation, EquipFlow, equipCam, GREEN, GOLD, RED, CYAN, HeroCorner, InfoBg, NSvg, NoLift, NotesPhone, notesCam, Profit, Rent35, Rest43, Shortage, SumUp, sumCam, T, tw, Utilities, Neon} from './AutoInfo';
import {CoopIn, CoopOut, ServiceIn, ServiceOut, ShowroomIn, ShowroomOut, Sport} from './AutoPlaces';
import {clamp, ease, lerp, rnd} from './util';
import {BalanceHud, Card, Finger, FONT, GarageInside, GarageRow, Man, money, P, PEOPLE, PhoneShell, Sofa, Svg, Workshop, Zhiguli, IconCompressor, IconJack, IconLift, IconTools} from './AutoArt';

export const FPSA = 30;
export const DURATIONA = 169.9;
const BOTTOM = 520; // scene shift

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

const Sh: React.FC<{a: number; b: number; t: number; x?: number; children: React.ReactNode}> = ({a, b, t, x = 0.2, children}) => {
  if (t < a || t >= b + x) return null;
  const o = x > 0 ? Math.min(1, Math.max(0, (t - a) / x)) : 1;
  return <AbsoluteFill style={{opacity: o}}>{children}</AbsoluteFill>;
};
const PriceTag: React.FC<{t: number; a: number; text: string; c: string; y?: number}> = ({t, a, text, c, y = 1700}) => {
  const k = ease(P(t, a, a + 0.35));
  return <Neon x={700} y={y} w={520} h={150} c={c} k={k} t={t}><T x={0} y={24} size={70} fill={c}>{text}</T></Neon>;
};
const Stamp: React.FC<{t: number; a: number; text: string; c: string; y: number; size?: number}> = ({t, a, text, c, y, size = 64}) => {
  const k = ease(P(t, a, a + 0.25));
  if (t < a) return null;
  return <Neon x={540} y={y} w={text.length * size * 0.72 + 90} h={size + 70} c={c} k={k} t={t} rot={-6}><T x={0} y={size * 0.36} size={size} fill={c}>{text}</T></Neon>;
};
const IS: React.FC<{t: number; a: number; b: number; keys?: CK[]; hero?: any; heroX?: number; tint?: string; children: React.ReactNode}> = ({t, a, b, keys, hero, heroX, tint, children}) => (
  <NSvg>
    <InfoBg t={t} tint={tint} />
    <Cam t={t} keys={keys ?? [[a, 540, 960, 1.0], [b, 540, 930, 1.08]]}>{children}</Cam>
    {hero && <HeroCorner t={t} mood={hero} x={heroX ?? 170} />}
  </NSvg>
);
const WalkIn: React.FC<{t: number; a: number; b: number; x0: number; x1: number; y?: number; s?: number; mood?: any; flip?: boolean}> = ({t, a, b, x0, x1, y = 1800, s = 1.1, mood = 'neutral', flip}) => {
  const e = ease(P(t, a, b));
  return <Mech x={lerp(x0, x1, e)} y={y} s={s} pose={e < 1 ? 'walk' : 'stand'} t={t} mood={mood} flip={flip} />;
};

export const Auto: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPSA;
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
  const black = clamp((t - 169.45) / 0.4);
  const bedV = ramp([[0, 0.05], [165, 0.05], [169.8, 0]]);
  const hum = ramp([[0, 0.06], [14, 0.06], [16, 0], [127.9, 0], [129, 0.05], [135, 0.05], [137, 0]]);
  const whooshes = [20.2, 27.4, 33.35, 38.0, 40.75, 43.9, 48.14, 59.09, 61.0, 63.07, 64.9, 66.5, 69.2, 94.9, 97.16, 99.52, 101.45, 103.24, 105.14, 105.8, 109.75, 114.4, 118.4, 120.6, 122.6, 124.8, 140.5, 142.41, 144.5];
  return (
    <AbsoluteFill style={{backgroundColor: '#1d2740'}}>
      <Audio src={staticFile('voice8.mp3')} volume={1} />
      <Audio src={staticFile('sfx/bed.mp3')} volume={bedV} />
      <Audio src={staticFile('sfx/hum.mp3')} volume={hum} />
      {whooshes.map((w) => S(w, 0.8, 'whoosh', 0.09))}
      {S(15.7, 0.8, 'notif', 0.1)}
      {S(38.1, 1.0, 'success', 0.1)}
      {S(48.3, 1.0, 'kaching', 0.1)}
      {S(57.6, 1.8, 'scroll', 0.12)}
      {S(67.5, 6, 'traffic', ramp([[0, 0], [0.8, 0.04], [3, 0.035], [4.2, 0]]))}
      {S(71.7, 3, 'ring', 0.06)}
      {S(77.3, 6, 'traffic', ramp([[0, 0], [0.8, 0.045], [5, 0.04], [6, 0]]))}
      {S(84.0, 1.2, 'creak', 0.08)}
      {S(90.8, 1.0, 'success', 0.1)}
      {S(108.2, 1.0, 'ping', 0.1)}
      {S(109.8, 0.8, 'notif', 0.1)}
      {S(114.9, 1.0, 'bad', 0.12)}
      {S(118.5, 0.8, 'bad', 0.1)}
      {S(120.6, 0.8, 'bad', 0.1)}
      {S(122.6, 0.8, 'bad', 0.1)}
      {S(125.5, 1.0, 'success', 0.1)}
      {S(130.6, 0.8, 'notif', 0.12)}
      {S(140.5, 0.8, 'bad', 0.1)}
      {S(142.4, 0.8, 'bad', 0.1)}
      {S(147.0, 1.0, 'success', 0.1)}
      {S(149.4, 0.6, 'click', 0.12)}
      {S(151.45, 3, 'ring', 0.06)}
      {S(165.4, 1.0, 'success', 0.08)}

      {/* 1. clock */}
      <Sh a={0} b={1.62} t={t} x={0}>
        <Svg>
          <Zoom t={t} a={0} b={1.62} from={1} to={1.1} cy={760}>
            <World fill="#2a3348"><Workshop t={t} /><rect x={-600} y={-900} width={2300} height={2200} fill="#0b1226" opacity={0.35} /></World>
            <g transform="translate(540 760)">
              <circle r={230} fill="#f6f7fb" stroke="#1a2238" strokeWidth={14} />
              {Array.from({length: 12}).map((_, i) => <rect key={i} x={-4} y={-208} width={8} height={26} fill="#1a2238" transform={`rotate(${i * 30})`} />)}
              <rect x={-8} y={-150} width={16} height={150} rx={8} fill="#1a2238" transform="rotate(270)" />
              <rect x={-6} y={-190} width={12} height={190} rx={6} fill="#d33a2c" transform={`rotate(${(t * 60) % 360})`} />
            </g>
          </Zoom>
          <Big t={t} a={0.1} text="21:00" y={1230} size={140} />
        </Svg>
      </Sh>
      <Sh a={1.62} b={4.02} t={t}>
        <Svg>
          <Zoom t={t} a={1.62} b={4.02} from={1} to={1.1}>
            <World><Workshop t={t} /><Mech x={260} t={t} pose="tired" mood="tired" /></World>
          </Zoom>
          <Tag t={t} a={1.8} text="АВТОМЕХАНИК" y={300} />
        </Svg>
      </Sh>
      <Sh a={4.02} b={8.02} t={t}>
        <Svg>
          {t < 6.1 ? (
            <Zoom t={t} a={4.02} b={6.1} from={1} to={1.15} cy={1000}>
              <World><Workshop t={t} wheelRot={t * 90} /><Man p={PEOPLE.mech} x={150} y={900} s={1.25} pose="point" t={t} mood="tired" /></World>
            </Zoom>
          ) : (
            <Zoom t={t} a={6.1} b={8.02} from={1.05} to={1}><World><WheelClose t={t} /></World></Zoom>
          )}
          <Tag t={t} a={4.2} text="СТАРЫЕ ЖИГУЛИ" y={300} color="#ff9e4a" />
        </Svg>
      </Sh>
      <Sh a={8.02} b={10.6} t={t}>
        <Svg>
          <Zoom t={t} a={8.02} b={10.6} from={1} to={1.12}>
            <World><Workshop t={t} /><Mech x={250} t={t} pose="tired" mood="tired" /></World>
          </Zoom>
          <Card x={640} y={640} w={640} h={330} k={ease(P(t, 8.3, 8.7))} accent="#f2f5fb">
            <T x={0} y={-60} size={36} fill="#44506a">СМЕНА 12 ЧАСОВ</T>
            <T x={0} y={50} size={100} fill="#1a2238">1 500 ₽</T>
          </Card>
        </Svg>
      </Sh>
      <Sh a={10.6} b={13.15} t={t}>
        <NSvg>
          <InfoBg t={t} />
          <Cam t={t} keys={[[10.6, 540, 900, 1.0], [13.15, 540, 860, 1.2]]}>
            <g transform="translate(540 760)">
              <circle r={250} fill="#0a1128" stroke={GOLD} strokeWidth={9} filter="url(#glffd23f)" />
              {Array.from({length: 12}).map((_, i) => <rect key={i} x={-4} y={-232} width={8} height={30} fill="#fff" transform={`rotate(${i * 30})`} />)}
              <path d={`M0 0 L0 -210`} stroke={GOLD} strokeWidth={10} strokeLinecap="round" transform={`rotate(${P(t, 10.6, 13.15) * 360})`} />
              <T x={0} y={-60} size={44} fill="#9aa3b8">12 ЧАСОВ</T>
              <T x={0} y={80} size={78} fill="#fff">1 500 ₽</T>
            </g>
            <Neon x={540} y={1180} w={760} h={190} c={RED} k={ease(P(t, 11.6, 12.0))} t={t}><T x={0} y={26} size={72} fill={RED}>ЭТО МАЛО</T></Neon>
          </Cam>
          <HeroCorner t={t} mood="tired" />
        </NSvg>
      </Sh>
      <Sh a={13.15} b={15.59} t={t}>
        <NSvg>
          <InfoBg t={t} />
          <Cam t={t} keys={[[13.15, 540, 900, 1.0], [15.59, 540, 880, 1.15]]}>
            <Neon x={540} y={800} w={800} h={520} c={GOLD} t={t} k={ease(P(t, 13.2, 13.6))}>
              <T x={0} y={40} size={190} fill={GOLD}>125 ₽</T>
              <T x={0} y={150} size={80}>в час</T>
            </Neon>
          </Cam>
          <HeroCorner t={t} mood="tired" />
        </NSvg>
      </Sh>
      <Sh a={15.59} b={18.39} t={t}>
        <Svg>
          <Zoom t={t} a={15.59} b={18.39} from={1} to={1.12}>
            <World fill="#4a3d52"><Room t={t} /><Man p={PEOPLE.mech} x={470} y={900} s={1.1} pose="sit" t={t} mood="tired" /></World>
          </Zoom>
          <Tag t={t} a={15.8} text="ДОМА · ДИВАН" y={300} color="#9fd0ff" />
        </Svg>
      </Sh>
      {/* 3. notes */}
      <Sh a={18.39} b={40.73} t={t}>
        <NSvg>
          <InfoBg t={t} tint="#0f2a1c" />
          <Cam t={t} keys={notesCam}><NotesPhone t={t} a={18.39} /></Cam>
        </NSvg>
      </Sh>
      <Sh a={40.73} b={43.91} t={t}>
        <IS t={t} a={40.73} b={43.91} keys={[[40.73, 540, 960, 1.0], [42.3, 540, 900, 1.06], [43.91, 540, 1000, 1.22]]}><Bars t={t} a={40.73} /></IS>
      </Sh>
      <Sh a={43.91} b={48.14} t={t}>
        <IS t={t} a={43.91} b={48.14} keys={[[43.91, 540, 900, 1.0], [46.0, 540, 880, 1.1], [48.14, 540, 800, 1.0]]} hero="worried" heroX={170}><Drain t={t} /></IS>
      </Sh>
      <Sh a={48.14} b={51.99} t={t}>
        <IS t={t} a={48.14} b={51.99} tint="#0f2a1c" keys={[[48.14, 540, 900, 1.0], [51.99, 540, 820, 1.2]]} hero="happy" heroX={170}><Profit t={t} a={48.14} /></IS>
      </Sh>
      <Sh a={51.99} b={55.0} t={t}>
        <Svg>
          <Zoom t={t} a={51.99} b={55.0} from={1} to={1.14}>
            <World fill="#4a3d52"><Room t={t} /><Man p={PEOPLE.mech} x={470} y={900} s={1.1} pose="sit" t={t} mood="happy" /></World>
          </Zoom>
          <g transform="translate(540 580)" opacity={ease(P(t, 52.2, 52.6))}>
            <circle r={150} fill="#ffd23f" opacity={0.25} /><circle r={78} fill="#ffe27a" /><rect x={-30} y={70} width={60} height={46} rx={10} fill="#8d94a3" />
          </g>
          <Tag t={t} a={52.4} text="ИДЕЯ: СВОЙ АВТОСЕРВИС" y={300} />
        </Svg>
      </Sh>
      <Sh a={55.0} b={57.61} t={t}>
        <Svg>
          <World fill="#4a3d52"><Cam t={t} keys={[[55.0, 540, 700, 1.3], [57.61, 540, 760, 1.0]]}><Room t={t} /><Man p={PEOPLE.mech} x={470} y={900} s={1.1} pose="sit" t={t} mood="happy" /></Cam></World>
          <Tag t={t} a={55.2} text="ЗАЙМУСЬ СВОИМ ДЕЛОМ" y={300} color="#6bf29a" />
        </Svg>
      </Sh>
      <Sh a={57.61} b={59.09} t={t}>
        <Svg><rect width={1080} height={1920} fill="#dfe6f2" /><AvitoFeed t={t} a={57.61} /><Finger x={720} y={1250 - 30 * Math.sin(t * 6)} rot={14} /></Svg>
      </Sh>
      {/* 4. garages */}
      <Sh a={59.09} b={61.0} t={t}>
        <Svg>
          <Cam t={t} keys={[[59.09, 280, 1000, 1.0], [60.2, 540, 1000, 1.15], [61.0, 610, 1110, 2.3]]}>
            <ShowroomOut t={t} />
            <WalkIn t={t} a={59.09} b={60.6} x0={-120} x1={380} y={1760} s={1.1} mood="worried" />
          </Cam>
          <Tag t={t} a={59.2} text="ВАРИАНТ 1 · САЛОН" y={300} color="#ffd23f" />
        </Svg>
      </Sh>
      <Sh a={61.0} b={63.07} t={t}>
        <NSvg>
          <Cam t={t} keys={[[61.0, 540, 1000, 1.25], [63.07, 540, 980, 1.0]]}>
            <ShowroomIn t={t} />
            <WalkIn t={t} a={61.0} b={62.2} x0={150} x1={540} y={1800} s={1.2} mood="worried" />
          </Cam>
          <PriceTag t={t} a={61.1} text="100 000 ₽" c={RED} y={560} />
          {t > 61.89 && <Stamp t={t} a={61.89} text="ДОРОГО" c={RED} y={800} size={92} />}
          {t > 62.4 && <Stamp t={t} a={62.4} text="НЕ ПО КАРМАНУ" c={RED} y={1000} size={52} />}
        </NSvg>
      </Sh>
      <Sh a={63.07} b={64.9} t={t}>
        <Svg>
          <Cam t={t} keys={[[63.07, 200, 1120, 1.0], [64.2, 540, 1120, 1.12], [64.9, 250, 1200, 2.2]]}>
            <ServiceOut t={t} />
            <WalkIn t={t} a={63.07} b={64.5} x0={-120} x1={420} y={1780} s={1.1} mood="worried" />
          </Cam>
          <Tag t={t} a={63.2} text="ВАРИАНТ 2 · АВТОСЕРВИС" y={300} color="#ffd23f" />
        </Svg>
      </Sh>
      <Sh a={64.9} b={66.5} t={t}>
        <NSvg>
          <Cam t={t} keys={[[64.9, 400, 1000, 1.3], [66.5, 540, 1000, 1.0]]}>
            <ServiceIn t={t} />
            <WalkIn t={t} a={64.9} b={65.8} x0={100} x1={600} y={1800} s={1.2} mood="worried" />
          </Cam>
          <PriceTag t={t} a={65.0} text="50 000 ₽" c={GOLD} y={560} />
          {t > 65.0 && <Stamp t={t} a={65.0} text="ДАЛЕКО" c={GOLD} y={800} size={80} />}
          {t > 65.7 && <Stamp t={t} a={65.7} text="ВСЁ ЕЩЁ ДОРОГО" c={RED} y={1000} size={50} />}
        </NSvg>
      </Sh>
      <Sh a={66.5} b={69.2} t={t}>
        <Svg>
          <World fill="#b8cadf">
            <Cam t={t} keys={[[66.5, 540, 780, 1.0], [68.0, 540, 790, 1.2], [69.2, 540, 810, 2.0]]}>
              <CoopOut t={t} />
              <WalkIn t={t} a={66.5} b={67.8} x0={-100} x1={380} y={1250} s={1.0} mood="happy" />
            </Cam>
          </World>
          <Tag t={t} a={66.6} text="ВАРИАНТ 3 · ГАРАЖ" y={300} color="#ffd23f" />
          <PriceTag t={t} a={67.26} text="35 000 ₽" c={GREEN} y={560} />
          <Stamp t={t} a={67.6} text="ВЫГОДНО" c={GREEN} y={800} size={92} />
          {t > 69.0 && <Tag t={t} a={69.0} text="ВОЗЛЕ ДОРОГИ" y={1000} color="#9fd0ff" />}
        </Svg>
      </Sh>
      <Sh a={69.2} b={71.68} t={t}>
        <Svg>
          <World>
            <Cam t={t} keys={[[69.2, 540, 800, 1.3], [71.68, 540, 780, 1.0]]}>
              <CoopIn t={t} />
              <Mech x={330} y={900} t={t} mood="happy" look={1} />
            </Cam>
          </World>
          <Stamp t={t} a={69.4} text="ВЫГОДНО" c={GREEN} y={420} size={92} />
        </Svg>
      </Sh>
      {/* 5. call */}
      <Sh a={71.68} b={74.97} t={t}>
        <Svg><rect width={1080} height={1920} fill="#14182a" /><Zoom t={t} a={71.68} b={74.97} from={1} to={1.1}><RingPhone t={t} a={71.68} name="Владелец гаража" accepted={73.2} /></Zoom></Svg>
      </Sh>
      <Sh a={74.97} b={77.68} t={t}>
        <Svg>
          <World fill="#9ec6e8"><GarageRow t={t} pan={(t - 74.97) * 60} /></World>
          <Tag t={t} a={75.1} text="НА СЛЕДУЮЩИЙ ДЕНЬ" y={300} color="#fff" />
          <Mech x={300} y={1750} s={1.2} pose="walk" t={t} />
        </Svg>
      </Sh>
      <Sh a={77.68} b={81.88} t={t}>
        <Svg>
          <World fill="#9ec6e8"><GarageRow t={t} pan={120 + (t - 77.68) * 55} /></World>
          <Tag t={t} a={77.8} text="ЖИЛЫЕ ДОМА РЯДОМ" y={300} color="#fff" />
          <Mech x={300} y={1750} s={1.2} pose="walk" t={t} />
        </Svg>
      </Sh>
      <Sh a={81.88} b={83.86} t={t}>
        <Svg>
          <World fill="#9ec6e8"><Cam t={t} keys={[[81.88, 540, 780, 1.0], [83.86, 700, 780, 1.4]]}><GarageRow t={t} pan={250} /></Cam></World>
          <Tag t={t} a={81.9} text="ИДЕАЛЬНОЕ МЕСТО" y={300} color="#6bf29a" />
        </Svg>
      </Sh>
      <Sh a={83.86} b={86.3} t={t}>
        <Svg>
          <World fill="#9ec6e8"><GarageRow t={t} pan={250} gateOpen={P(t, 83.86, 85.6)} />
            <Ownr x={760} y={1340} s={1.05} t={t} flip />
          </World>
          <Mech x={300} y={1750} s={1.2} t={t} look={1} />
        </Svg>
      </Sh>
      <Sh a={86.3} b={90.81} t={t}>
        <Svg>
          <World><Cam t={t} keys={[[86.3, 540, 760, 1.15], [90.81, 600, 760, 1.4]]}><GarageInside t={t} /><Mech x={300} t={t} look={1} /><Ownr x={760} t={t} flip pose="point" /></Cam></World>
          <g transform="translate(540 330)" opacity={ease(P(t, 86.6, 86.9))}>
            <rect x={-420} y={-70} width={840} height={140} rx={40} fill="#fff" stroke="#1a2238" strokeWidth={5} />
            <T x={0} y={16} size={44} fill="#1a2238">{t < 88.8 ? '«Заходи, смотри»' : '«Цена — как договорились»'}</T>
          </g>
        </Svg>
      </Sh>
      <Sh a={90.81} b={94.82} t={t}>
        <NSvg>
          <World><Cam t={t} keys={[[90.81, 540, 760, 1.0], [94.82, 540, 740, 1.2]]}><GarageInside t={t} /><Mech x={330} t={t} mood="happy" look={1} /><Ownr x={760} t={t} flip /></Cam></World>
          <Neon x={540} y={380} w={820} h={230} c={GOLD} k={ease(P(t, 91.2, 91.6))} t={t}>
            <T x={0} y={-30} size={36} fill="#9aa3b8">АРЕНДА ГАРАЖА</T>
            <T x={0} y={56} size={72} fill={GOLD}>35 000 ₽ / мес</T>
          </Neon>
        </NSvg>
      </Sh>
      {/* 6. equipment */}
      <Sh a={94.82} b={97.16} t={t}>
        <NSvg>
          <World><Cam t={t} keys={[[94.82, 540, 800, 1.0], [97.16, 540, 800, 1.2]]}>
            <GarageInside t={t} />
            <Man p={PEOPLE.mech} x={300} y={900} s={1.35} pose="point" t={t} mood="neutral" look={1} />
            {[{x: 600, y: 880, k: 95.2, Ic: IconLift}, {x: 800, y: 880, k: 95.7, Ic: IconTools}, {x: 700, y: 760, k: 96.2, Ic: IconCompressor}].map((o, i) => (
              <g key={i} transform={`translate(${o.x} ${o.y}) scale(${0.9 * ease(P(t, o.k, o.k + 0.3))})`} opacity={0.55}><o.Ic s={1} /></g>
            ))}
          </Cam></World>
          <Tag t={t} a={94.9} text="НУЖНО ОБОРУДОВАНИЕ" y={300} color="#ffd23f" />
        </NSvg>
      </Sh>
      <Sh a={97.16} b={105.14} t={t}>
        <IS t={t} a={97.16} b={105.14} keys={equipCam}><EquipFlow t={t} /></IS>
      </Sh>
      <Sh a={105.14} b={109.75} t={t}>
        <IS t={t} a={105.14} b={109.75} keys={sumCam(105.14)}><SumUp t={t} a={105.14} /></IS>
      </Sh>
      <Sh a={109.75} b={114.36} t={t}>
        <IS t={t} a={109.75} b={114.36} tint="#0f2a1c" keys={[[109.75, 540, 900, 1.0], [114.36, 540, 800, 1.14]]} hero="happy" heroX={900}><BankCard t={t} a={109.75} /></IS>
      </Sh>
      <Sh a={114.36} b={117.85} t={t}>
        <IS t={t} a={114.36} b={117.85} tint="#3a1424" keys={[[114.36, 540, 900, 1.0], [116.0, 540, 1100, 1.05], [117.85, 540, 1170, 1.22]]} hero="worried" heroX={170}><Shortage t={t} a={114.36} /></IS>
      </Sh>
      <Sh a={117.85} b={120.54} t={t}>
        <IS t={t} a={117.85} b={120.54} keys={[[117.85, 540, 800, 1.0], [119.2, 540, 1000, 1.08], [120.54, 540, 1250, 1.25]]} hero="neutral" heroX={170}><NoLift t={t} a={117.85} /></IS>
      </Sh>
      <Sh a={120.54} b={122.57} t={t}>
        <IS t={t} a={120.54} b={122.57} keys={[[120.54, 540, 760, 1.0], [122.57, 540, 1000, 1.06]]} hero="worried" heroX={170}><Rest43 t={t} a={120.54} /></IS>
      </Sh>
      <Sh a={122.57} b={124.8} t={t}>
        <IS t={t} a={122.57} b={124.8} keys={[[122.57, 540, 900, 1.0], [124.8, 540, 820, 1.14]]} hero="worried" heroX={170}><Rent35 t={t} a={122.57} /></IS>
      </Sh>
      <Sh a={124.8} b={127.95} t={t}>
        <IS t={t} a={124.8} b={127.95} tint="#0f2a1c" keys={[[124.8, 540, 800, 1.0], [126.6, 540, 1000, 1.12], [127.95, 540, 1000, 1.16]]} hero="happy" heroX={170}><Equation t={t} a={124.8} /></IS>
      </Sh>
      <Sh a={127.95} b={130.59} t={t}>
        <Svg>
          <World><Cam t={t} keys={[[127.95, 540, 780, 1.0], [130.59, 560, 780, 1.2]]}><GarageInside t={t} lightShaft={1} />
            <Mech x={330} t={t} mood="happy" />
            <g transform="translate(760 880)"><IconLift s={1.5} /></g>
          </Cam></World>
          <Tag t={t} a={128.1} text="ГАРАЖ ГОТОВ" y={300} color="#6bf29a" />
        </Svg>
      </Sh>
      <Sh a={130.59} b={137.11} t={t}>
        <Svg>
          <rect width={1080} height={1920} fill="#14182a" />
          <Zoom t={t} a={130.59} b={137.11} from={1} to={1.12}>
            <Chat t={t} a={130.59} title="Владелец гаража" lines={[
              {at: 130.8, text: 'Привет!\nКак дела с\nгаражом?'},
              {at: 133.67, text: 'Коммуналку\nза гараж\nпо счётчикам'},
            ]} />
          </Zoom>
        </Svg>
      </Sh>
      <Sh a={137.11} b={140.5} t={t}>
        <Svg>
          <World><Cam t={t} keys={[[137.11, 540, 780, 1.0], [140.5, 400, 740, 1.3]]}><GarageInside t={t} /><Mech x={330} t={t} mood="worried" /></Cam></World>
          <Tag t={t} a={137.3} text="ЗАБЫЛ ПРО КОММУНАЛКУ" y={300} color="#ff7a6e" />
          <Stamp t={t} a={138.2} text="?!" c={RED} y={560} size={120} />
        </Svg>
      </Sh>
      <Sh a={140.5} b={149.29} t={t}>
        <IS t={t} a={140.5} b={149.29} tint="#2a1a2a" keys={[[140.5, 540, 700, 1.0], [142.4, 540, 700, 1.05], [144.3, 540, 1050, 1.1], [146.8, 540, 1250, 1.1], [147.6, 540, 1400, 1.12], [149.29, 540, 1400, 1.16]]} hero="worried" heroX={170}><Utilities t={t} /></IS>
      </Sh>
      {/* 7. ad + client */}
      <Sh a={149.29} b={151.42} t={t}>
        <Svg>
          <rect width={1080} height={1920} fill="#dfe6f2" />
          <PhoneShell x={540} y={820} s={1.55}>
            <rect x={-172} y={-356} width={344} height={712} fill="#f6f7fb" />
            <rect x={-172} y={-356} width={344} height={70} fill="#00aaff" />
            <T x={-140} y={-308} anchor="start" size={26}>Авито · Новое</T>
            <rect x={-150} y={-260} width={300} height={170} rx={14} fill="#a9764e" />
            <T x={0} y={-30} size={30} fill="#1a2238">АВТОСЕРВИС</T>
            <T x={0} y={20} size={18} fill="#44506a">Колёса · масло · ремонт</T>
            <rect x={-130} y={140} width={260} height={80} rx={40} fill="#00aaff" />
            <T x={0} y={192} size={28}>Опубликовать</T>
          </PhoneShell>
          <Finger x={600} y={820 + 190 * 1.55} press={t > 150.5 ? 1 : 0} rot={20} />
        </Svg>
      </Sh>
      <Sh a={151.42} b={154.15} t={t}>
        <Svg>
          <rect width={1080} height={1920} fill="#14182a" />
          <Zoom t={t} a={151.42} b={154.15} from={1} to={1.12}><RingPhone t={t} a={151.42} name="Новый клиент" accepted={152.6} /></Zoom>
          <Tag t={t} a={151.5} text="УТРО" y={300} color="#fff" />
        </Svg>
      </Sh>
      <Sh a={154.15} b={159.98} t={t}>
        <Svg>
          <Zoom t={t} a={154.15} b={159.98} from={1} to={1.12}>
            <World><Workshop t={t} night={false} /><Mech x={260} t={t} mood="neutral" look={1} /></World>
          </Zoom>
          <g transform="translate(540 1250)" opacity={ease(P(t, 154.2, 154.5))}>
            <rect x={-440} y={-70} width={880} height={140} rx={40} fill="#fff" stroke="#1a2238" strokeWidth={5} />
            <T x={0} y={16} size={42} fill="#1a2238">{t < 157 ? '«Сколько стоит замена колодок?»' : '«На Ладе»'}</T>
          </g>
        </Svg>
      </Sh>
      <Sh a={159.98} b={165.34} t={t}>
        <NSvg>
          <Zoom t={t} a={159.98} b={165.34} from={1} to={1.12}>
            <World><Workshop t={t} night={false} /><Mech x={260} t={t} mood="happy" /></World>
          </Zoom>
          <Neon x={660} y={600} w={640} h={270} c={GREEN} k={ease(P(t, 160.1, 160.5))} t={t}>
            <T x={0} y={-40} size={34} fill="#9affc2">РАБОТА</T>
            <T x={0} y={66} size={100} fill={GREEN}>1 500 ₽</T>
          </Neon>
          {t > 161.87 && <Tag t={t} a={161.9} text="ПРИЕДЕТ ЧЕРЕЗ ЧАС" y={1500} color="#ffd23f" />}
        </NSvg>
      </Sh>
      <Sh a={165.34} b={DURATIONA} t={t}>
        <Svg>
          <World fill="#9ec6e8">
            <GarageRow t={t} pan={250} gateOpen={1} />
            <Zhiguli x={300 + P(t, 165.34, 168) * 220} y={1330} s={0.9} wheelRot={t * 300} color="#c0392b" lada />
            <Man p={PEOPLE.client} x={780} y={1360} s={1.05} t={t} flip mood="happy" />
          </World>
          <Mech x={260} y={1750} s={1.25} t={t} mood="happy" look={1} />
          {t > 168.0 && <Big t={t} a={168.0} text="ПЕРВЫЙ КЛИЕНТ" y={420} size={84} color="#ffd23f" />}
        </Svg>
      </Sh>

      {showHud && (
        <AbsoluteFill><Svg>
          <BalanceHud value={bal} delta={delta} />
        </Svg></AbsoluteFill>
      )}
      <AutoSub t={t} subs={subsA as any} />
      <Overlay t={t} frame={frame} />
      <AbsoluteFill style={{backgroundColor: '#000', opacity: black}} />
    </AbsoluteFill>
  );
};
