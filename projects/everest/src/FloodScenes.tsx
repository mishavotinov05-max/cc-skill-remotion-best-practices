import React from 'react';
import {FONT, FlatHero, FloodScene, HudBar, Chip, Stamp, Tag} from './FloodStyle';
import {clamp, ease, lerp, rnd} from './util';

const W = 1080;
const H = 1920;
export const P = (t: number, a: number, b: number) => clamp((t - a) / (b - a));
export const Svg: React.FC<{children: React.ReactNode}> = ({children}) => (
  <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
    {children}
  </svg>
);
export const clock = (t: number) => {
  let m = t < 11.88 ? 4 * 60 + 22 : t < 28.6 ? lerp(4 * 60 + 7, 4 * 60 + 14, P(t, 11.88, 28.6)) : lerp(4 * 60 + 14, 5 * 60 + 2, P(t, 28.6, 115));
  m = Math.floor(m);
  return `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;
};
export const roofY = (x: number) => (x < 540 ? 1260 - 0.52 * (x - 40) : 1260 - 0.52 * (1040 - x));
export const lvAt = (t: number) => 0.42 + 0.4 * P(t, 0, 115);

type Cam = {cx: number; cy: number; s: number};
const View: React.FC<{cam: Cam; children: React.ReactNode}> = ({cam, children}) => (
  <g transform={`translate(540 960) scale(${cam.s}) translate(${-cam.cx} ${-cam.cy})`}>{children}</g>
);
const Hud: React.FC<{t: number; place: string; tag?: string; chips?: {c: 'red' | 'yellow' | 'green' | 'cyan'; text: string}[]}> = ({t, place, tag, chips = []}) => (
  <g>
    <HudBar place={place} time={clock(t)} />
    {tag && <Tag x={44} y={140} text={tag} />}
    {chips.map((c, i) => (
      <Chip key={i} x={44} y={tag ? 214 + i * 68 : 140 + i * 68} color={c.c} text={c.text} />
    ))}
  </g>
);
const Rain: React.FC<{t: number; n?: number}> = ({t, n = 60}) => (
  <g>
    {Array.from({length: n}).map((_, i) => {
      const x = ((rnd(i) * 1200 + t * 220) % 1200) - 60;
      const y = (rnd(i + 9) * 1900 + t * 900) % 1900;
      return <line key={i} x1={x} y1={y} x2={x - 16} y2={y + 48} stroke="#9fc2ea" strokeWidth={2.5} opacity={0.3} />;
    })}
  </g>
);

// ---------- generic roof exterior ----------
export const Roof: React.FC<{t: number; level?: number; cam?: Cam; hero?: {x: number; pose?: 'stand' | 'wave'; rot?: number; flip?: boolean; armR?: number; dy?: number; legSwing?: number} | null; world?: React.ReactNode; place?: string; tag?: string; chips?: {c: 'red' | 'yellow' | 'green' | 'cyan'; text: string}[]; hudOverlay?: React.ReactNode}> = ({t, level, cam = {cx: 540, cy: 960, s: 1}, hero = {x: 420}, world, place = 'КРЫША', tag, chips, hudOverlay}) => (
  <Svg>
    <View cam={cam}>
      <FloodScene t={t} level={level ?? lvAt(t)} />
      {world}
      {hero && <FlatHero x={hero.x} y={roofY(hero.x) + 40 + (hero.dy ?? 0)} s={1.05} pose={hero.pose} rot={hero.rot} flip={hero.flip} armR={hero.armR} legSwing={hero.legSwing} />}
    </View>
    <Rain t={t} />
    <Hud t={t} place={place} tag={tag} chips={chips} />
    {hudOverlay}
  </Svg>
);

export const S1: React.FC<{t: number}> = ({t}) => <Roof t={t} cam={{cx: 540, cy: 960, s: 1 + 0.12 * P(t, 0, 3.9)}} hero={{x: 440, pose: 'wave'}} place="КРЫША" tag="НАВОДНЕНИЕ" chips={[{c: 'cyan', text: 'ВОДА ПРИБЫВАЕТ'}]} />;
export const S2: React.FC<{t: number}> = ({t}) => {
  const k = ease(P(t, 4.2, 5.0));
  return (
    <Roof t={t} cam={{cx: 540, cy: 1010, s: 1.12}} hero={{x: 440}} place="КРЫША" tag="БЕЗОПАСНО?" chips={[{c: 'green', text: 'КРЫША — ВЫШЕ ВОДЫ'}]}
      world={
        <g opacity={k} transform={`translate(540 ${960 + (1 - k) * -40})`}>
          <path d="M0 -150 L120 -110 L120 10 Q120 90 0 130 Q-120 90 -120 10 L-120 -110 Z" fill="#38e07b" opacity={0.22} stroke="#38e07b" strokeWidth={8} />
          <path d="M-46 -4 L-12 34 L52 -42" stroke="#38e07b" strokeWidth={14} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      }
    />
  );
};
export const S3: React.FC<{t: number}> = ({t}) => (
  <Svg>
    <rect width={W} height={H} fill="#111b38" />
    <HudBar place="ВНИМАНИЕ" time={clock(t)} />
    {[0, 1, 2].map((i) => {
      const k = ease(P(t, 8.3 + i * 0.9, 8.7 + i * 0.9));
      return (
        <g key={i} transform={`translate(540 ${640 + i * 260}) scale(${0.6 + 0.4 * k})`} opacity={k}>
          <rect x={-380} y={-100} width={760} height={200} rx={26} fill="#2a0c10" stroke="#ff3b3b" strokeWidth={8} />
          <path d="M-330 -50 L-230 50 M-230 -50 L-330 50" stroke="#ff3b3b" strokeWidth={20} strokeLinecap="round" />
          <text x={-170} y={26} fontFamily={FONT} fontWeight={700} fontSize={84} fill="#fff">{`ОШИБКА ${i + 1}`}</text>
        </g>
      );
    })}
  </Svg>
);
export const S4: React.FC<{t: number}> = ({t}) => {
  const k = ease(P(t, 11.88, 12.2));
  return (
    <Svg>
      <rect width={W} height={H} fill="#111b38" />
      <g transform={`translate(540 940) scale(${0.8 + 0.2 * k})`} opacity={k}>
        <rect x={-420} y={-90} width={840} height={180} rx={14} fill="#f2c94c" />
        <text x={0} y={36} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={100} fill="#1a1400" letterSpacing={4}>ПРЕДСТАВЬ</text>
      </g>
    </Svg>
  );
};

// ---------- bedroom, window ----------
export const Bedroom: React.FC<{t: number}> = ({t}) => {
  const bang = t > 12.9 && t < 14.4;
  const sx = bang ? Math.sin(t * 90) * 14 * (1 - P(t, 12.9, 14.4)) : 0;
  return (
    <Svg>
      <g transform={`translate(${sx} ${sx * 0.5})`}>
        <rect width={W} height={H} fill="#0c1226" />
        <rect x={0} y={1400} width={W} height={520} fill="#151c33" />
        <rect x={560} y={420} width={380} height={460} rx={10} fill="#162a52" stroke="#2b3a64" strokeWidth={14} />
        <rect x={744} y={420} width={10} height={460} fill="#2b3a64" />
        <circle cx={860} cy={520} r={28} fill="#dfe9ff" opacity={0.7} />
        <rect x={120} y={1180} width={560} height={240} rx={26} fill="#2b3a64" />
        <rect x={120} y={1120} width={560} height={90} rx={26} fill="#3b4c80" />
        <rect x={140} y={1100} width={200} height={70} rx={30} fill="#dfe9ff" />
        <rect x={250} y={1150} width={420} height={110} rx={20} fill="#ff7a1a" />
        <circle cx={230} cy={1090} r={46} fill="#f2b98a" />
        <text x={430} y={1050} fontFamily={FONT} fontWeight={700} fontSize={72} fill="#9fc2ea" opacity={bang ? 0 : 0.8}>z z</text>
        {bang && Array.from({length: 3}).map((_, i) => <circle key={i} cx={540} cy={900} r={(t - 12.9) * 700 - i * 140} fill="none" stroke="#ff4a4a" strokeWidth={8} opacity={clamp(1 - ((t - 12.9) * 700 - i * 140) / 800)} />)}
      </g>
      <Hud t={t} place="СПАЛЬНЯ" tag="ПРЕДСТАВЬ" chips={[{c: 'red', text: 'ГРОХОТ'}]} />
      <rect width={W} height={H} fill="#ff3b3b" opacity={bang && t < 13.2 ? 0.25 : 0} />
    </Svg>
  );
};

export const WindowView: React.FC<{t: number}> = ({t}) => {
  const k = P(t, 15.41, 19.46);
  return (
    <Svg>
      <rect width={W} height={H} fill="#0a0f1e" />
      <rect x={150} y={360} width={780} height={1000} rx={18} fill="#10264a" />
      <g clipPath="url(#wv)">
        <defs>
          <clipPath id="wv">
            <rect x={160} y={370} width={760} height={980} rx={10} />
          </clipPath>
        </defs>
        <rect x={160} y={370} width={760} height={980} fill="#1a2c58" />
        <rect x={160} y={lerp(1050, 760, ease(k))} width={760} height={600} fill="#1d5a80" />
        {Array.from({length: 10}).map((_, i) => <rect key={i} x={((i * 120 + t * 180) % 900) + 100} y={lerp(1050, 760, ease(k)) + 30 + (i % 4) * 50} width={90} height={6} rx={3} fill="#8fd0f0" opacity={0.5} />)}
        {[0, 1, 2].map((i) => <rect key={i} x={200 + i * 260} y={lerp(1050, 760, ease(k)) - 60} width={90} height={80} fill="#7a5a30" opacity={0.0} />)}
        <rect x={240} y={lerp(1010, 720, ease(k))} width={110} height={16} rx={6} fill="#8a6a40" transform={`rotate(${Math.sin(t * 3) * 6} 295 ${lerp(1010, 720, ease(k))})`} />
        <circle cx={800} cy={470} r={44} fill="#dfe9ff" opacity={0.8} />
      </g>
      <rect x={530} y={360} width={20} height={1000} fill="#2b3a64" />
      <rect x={150} y={840} width={780} height={20} fill="#2b3a64" />
      <FlatHero x={200} y={1740} s={1.2} />
      <Hud t={t} place="ОКНО" tag="ПРЕДСТАВЬ" chips={[{c: 'cyan', text: 'УЛИЦА = РЕКА'}, {c: 'yellow', text: 'ВОДА ПОДНИМАЕТСЯ'}]} />
      <Rain t={t} n={30} />
    </Svg>
  );
};

// ---------- house cross-section ----------
export const HouseSection: React.FC<{t: number; water: number; hero?: {x: number; y: number; rot?: number} | null; cracks?: number; sag?: number; place: string; tag?: string; chips?: {c: 'red' | 'yellow' | 'green' | 'cyan'; text: string}[]; phone?: boolean; roofHero?: boolean}> = ({t, water, hero, cracks = 0, sag = 0, place, tag, chips, phone}) => {
  const wl = lerp(1500, 760, water);
  return (
    <Svg>
      <defs>
        <linearGradient id="hsw" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1a4a6a" />
          <stop offset="1" stopColor="#0a1f33" />
        </linearGradient>
      </defs>
      <rect width={W} height={H} fill="#080d1c" />
      <g>
        <rect x={150} y={1000} width={780} height={500} fill="#10182e" stroke="#2b3a64" strokeWidth={10} />
        <rect x={150} y={640} width={780} height={360} fill="#0e1527" stroke="#2b3a64" strokeWidth={10} />
        <path d={`M110 640 L540 ${300 + sag * 70} L970 640 Z`} fill="#202b4a" stroke="#2b3a64" strokeWidth={10} />
        <rect x={230} y={1330} width={620} height={16} fill="#2b3a64" opacity={0.5} />
        <rect x={680} y={1020} width={150} height={190} rx={8} fill="#162a52" />
        <rect x={720} y={680} width={120} height={150} rx={8} fill="#162a52" />
        <path d="M200 1500 L200 1340 L360 1340 L360 1180 L520 1180 L520 1000 M200 1000 L360 1000 L360 820 L520 820 L520 640" stroke="#4a5a8a" strokeWidth={10} fill="none" opacity={0.7} />
        {cracks > 0 && <path d={`M540 ${360 + sag * 70} L520 ${440} L560 ${520} L530 ${600}`} stroke="#ff4a4a" strokeWidth={10} fill="none" opacity={cracks} strokeLinecap="round" />}
      </g>
      <rect x={-100} y={wl} width={1280} height={1300} fill="url(#hsw)" opacity={0.88} />
      {Array.from({length: 12}).map((_, i) => <rect key={i} x={((i * 130 + t * 40) % 1300) - 100} y={wl + 20 + (i % 3) * 40} width={80} height={5} rx={3} fill="#6ab4e0" opacity={0.4} />)}
      {hero && <FlatHero x={hero.x} y={hero.y} s={0.62} rot={hero.rot} />}
      {phone && (
        <g transform="translate(850 360)">
          <rect x={-60} y={-110} width={120} height={220} rx={20} fill="#0a1224" stroke="#38e07b" strokeWidth={6} />
          <text x={0} y={10} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={44} fill="#38e07b">112</text>
        </g>
      )}
      <Hud t={t} place={place} tag={tag} chips={chips} />
    </Svg>
  );
};

// ---------- mistake 1 ----------
export const Boat: React.FC<{t: number}> = ({t}) => (
  <Roof t={t} cam={{cx: 440, cy: 1100, s: 1.15}} hero={{x: 640, flip: true}} place="ДВОР" tag="ОШИБКА 1: ПЛЫТЬ" chips={[{c: 'yellow', text: 'ДО ЛОДКИ: 20 М'}]}
    world={
      <g>
        <g transform={`translate(120 ${1340 + Math.sin(t * 2) * 6}) rotate(${Math.sin(t * 1.6) * 3})`}>
          <path d="M-110 -30 L110 -30 L74 30 L-74 30 Z" fill="#c0392b" />
          <rect x={-110} y={-36} width={220} height={10} fill="#ffd23f" />
        </g>
        <path d="M600 1240 Q380 1330 160 1330" stroke="#f2c94c" strokeWidth={6} strokeDasharray="14 14" fill="none" opacity={P(t, 39.0, 41.0)} />
      </g>
    }
  />
);
export const Xray: React.FC<{t: number}> = ({t}) => {
  const k = P(t, 43.57, 47.1);
  return (
    <Svg>
      <defs>
        <linearGradient id="xr" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1a4a6a" />
          <stop offset="1" stopColor="#05101c" />
        </linearGradient>
      </defs>
      <rect width={W} height={H} fill="#111b38" />
      <rect y={620} width={W} height={1300} fill="url(#xr)" />
      <rect y={610} width={W} height={12} fill="#6ab4e0" opacity={0.7} />
      <FlatHero x={540} y={640} s={0.5} rot={0} />
      {[0, 1, 2, 3, 4].map((i) => {
        const vis = clamp(k * 6 - i * 0.8);
        return (
          <g key={i} opacity={vis}>
            <rect x={80 + i * 210} y={1100} width={26} height={460} fill="#6a5a3a" />
            <rect x={80 + i * 210} y={1140} width={240} height={10} fill="#6a5a3a" />
          </g>
        );
      })}
      <g opacity={clamp(k * 4 - 1.2)}>
        <path d="M0 980 Q270 1060 540 960 T1080 1020" stroke="#ff4a4a" strokeWidth={8} fill="none" />
        {[200, 560, 880].map((x, i) => <circle key={i} cx={x} cy={1000 + (i % 2) * 30} r={10} fill="#ffd23f" />)}
      </g>
      <g opacity={clamp(k * 4 - 2)}>
        <rect x={300} y={1420} width={180} height={70} fill="#5a6a7a" transform="rotate(-12 390 1455)" />
        <rect x={680} y={1380} width={120} height={120} fill="#7a5a30" transform="rotate(20 740 1440)" />
        <polygon points="860,1500 960,1420 980,1500" fill="#4a5a6a" />
      </g>
      <Hud t={t} place="ПОД ВОДОЙ" tag="ОШИБКА 1: ПЛЫТЬ" chips={[{c: 'red', text: 'ЗАБОРЫ'}, {c: 'red', text: 'ПРОВОДА'}, {c: 'red', text: 'ОБЛОМКИ'}]} />
    </Svg>
  );
};
export const Current: React.FC<{t: number}> = ({t}) => {
  const k = ease(P(t, 47.4, 48.4));
  const k2 = P(t, 47.4, 50.2);
  return (
    <Roof t={t} cam={{cx: 540, cy: 1180, s: 1.05}} hero={{x: lerp(260, 120, k), rot: lerp(0, 70, k), dy: k * 40, legSwing: Math.sin(t * 12) * 20 * k}} place="ПОТОК" tag="ОШИБКА 1: ПЛЫТЬ" chips={[{c: 'red', text: 'ТЕЧЕНИЕ СБИВАЕТ ЗА 1 СЕК'}]}
      world={
        <g opacity={0.9}>
          {[0, 1, 2, 3].map((i) => <path key={i} d={`M${200 + i * 240} ${1330 + (i % 2) * 40} l140 0 l-26 -22 m26 22 l-26 22`} stroke="#ff4a4a" strokeWidth={9} fill="none" strokeLinecap="round" strokeLinejoin="round" />)}
        </g>
      }
      hudOverlay={<Stamp x={600} y={640} text={`${Math.max(0, 1 - k2).toFixed(0)} СЕК`} color="#ff4a4a" rot={4} />}
    />
  );
};
export const PhoneCall: React.FC<{t: number; a: number; b: number; label: string; sub: string; tag: string; place: string}> = ({t, a, b, label, sub, tag, place}) => {
  const k = ease(P(t, a, a + 0.5));
  const digits = label.split('');
  return (
    <Svg>
      <rect width={W} height={H} fill="#111b38" />
      <g transform="translate(540 980) scale(1.25)" opacity={k}>
        <rect x={-190} y={-380} width={380} height={760} rx={52} fill="#14151c" stroke="#38e07b" strokeWidth={8} />
        <rect x={-170} y={-352} width={340} height={704} rx={36} fill="#06101f" />
        <text x={0} y={-230} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={34} fill="#9aa3b8">ВЫЗОВ</text>
        <text x={0} y={-90} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={140} fill="#38e07b" letterSpacing={6}>{digits.map((d, i) => (P(t, a + 0.3 + i * 0.3, a + 0.6 + i * 0.3) > 0.5 ? d : '')).join('')}</text>
        <rect x={-130} y={30} width={260} height={90} rx={26} fill="#38e07b" />
        <text x={0} y={92} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={sub.length > 10 ? 26 : 38} fill="#063">{sub}</text>
        <circle cx={0} cy={250} r={46} fill="#e63232" />
        {[0, 1, 2].map((i) => <circle key={i} cx={0} cy={250} r={46 + ((t * 40 + i * 20) % 60)} fill="none" stroke="#38e07b" strokeWidth={3} opacity={0.4} />)}
      </g>
      <Hud t={t} place={place} tag={tag} chips={[{c: 'green', text: 'НАЗОВИ АДРЕС'}]} />
    </Svg>
  );
};

// ---------- mistake 2 ----------
export const EdgeIntro: React.FC<{t: number}> = ({t}) => (
  <Roof t={t} cam={{cx: 280, cy: 1160, s: 1.35}} hero={{x: lerp(420, 220, P(t, 58.4, 60.9))}} place="КРАЙ КРЫШИ" tag="ОШИБКА 2: КРАЙ" chips={[{c: 'yellow', text: 'ВНИЗУ — ПОТОК'}]}
    world={<path d="M40 1260 L190 1180" stroke="#ff4a4a" strokeWidth={10} strokeDasharray="12 12" />}
  />
);
export const Shouts: React.FC<{t: number}> = ({t}) => (
  <Roof t={t} cam={{cx: 760, cy: 1100, s: 1.1}} hero={{x: 620, flip: false}} place="СОСЕДНЯЯ КРЫША" tag="ОШИБКА 2: КРАЙ" chips={[{c: 'yellow', text: 'КТО-ТО КРИЧИТ'}]}
    world={
      <g>
        <g transform="translate(1010 1090)">
          <path d="M-190 130 L0 0 L190 130 Z" fill="#202b4a" />
          <FlatHero x={0} y={30} s={0.85} pose="wave" armR={160} />
        </g>
        {[0, 1, 2].map((i) => <circle key={i} cx={1010} cy={780} r={((t * 140 + i * 50) % 160)} fill="none" stroke="#f2c94c" strokeWidth={5} opacity={0.6 - ((t * 140 + i * 50) % 160) / 280} />)}
      </g>
    }
  />
);
export const Approach: React.FC<{t: number}> = ({t}) => {
  const k = P(t, 65.88, 68.3);
  return (
    <Roof t={t} cam={{cx: 460, cy: 1150, s: 1.2}} hero={{x: lerp(520, 240, ease(k)), legSwing: Math.sin(t * 8) * 14}} place="КРЫША" tag="ОШИБКА 2: КРАЙ" chips={[{c: 'cyan', text: 'ХОЧЕТ РАССМОТРЕТЬ'}, {c: 'yellow', text: 'КРЫША МОКРАЯ'}]}
      world={Array.from({length: 8}).map((_, i) => <path key={i} d={`M${120 + i * 110} ${1230 - i * 22} l50 -14`} stroke="#9fc2ea" strokeWidth={5} opacity={0.5} />)}
    />
  );
};
export const Slip: React.FC<{t: number}> = ({t}) => {
  const k = ease(P(t, 70.6, 72.4));
  return (
    <Roof t={t} cam={{cx: 220, cy: 1200, s: 1.4}} hero={{x: lerp(210, 110, k), rot: lerp(0, 50, k), dy: k * 30, legSwing: 24 * k}} place="КРАЙ КРЫШИ" tag="ОШИБКА 2: КРАЙ" chips={[{c: 'red', text: 'СКОЛЬЗКО'}, {c: 'red', text: 'ПОТОК ВНИЗУ'}]}
      world={<path d="M130 1240 L40 1310" stroke="#ff4a4a" strokeWidth={14} strokeLinecap="round" opacity={k} />}
      hudOverlay={<Stamp x={600} y={600} text="ПОТОК" color="#ff4a4a" rot={-6} />}
    />
  );
};
export const SafeZone: React.FC<{t: number}> = ({t}) => {
  const beam = 0.5 + 0.5 * Math.sin(t * 5);
  return (
    <Roof t={t} cam={{cx: 540, cy: 1060, s: 1.1}} hero={{x: 560, pose: 'wave'}} place="КРЫША" tag="ПРАВИЛЬНО" chips={[{c: 'green', text: 'ДАЛЬШЕ ОТ КРАЯ'}, {c: 'green', text: 'ЯРКАЯ ОДЕЖДА'}, {c: 'green', text: 'ФОНАРИК'}]}
      world={
        <g>
          <path d="M120 1250 L120 1050" stroke="#38e07b" strokeWidth={8} strokeDasharray="14 12" />
          <polygon points="620,900 1240,640 1240,1140" fill="#fff6a0" opacity={0.12 + 0.1 * beam} />
          <circle cx={1010} cy={720} r={26} fill="#fff6a0" opacity={0.5 + 0.4 * beam} />
        </g>
      }
    />
  );
};

// ---------- mistake 3 ----------
export const Cracks: React.FC<{t: number}> = ({t}) => {
  const k = P(t, 85.57, 90.3);
  return <HouseSection t={t} water={lerp(0.42, 0.62, k)} hero={{x: 540, y: 600 - (k > 0.5 ? 0 : 0)}} cracks={clamp((t - 87.64) / 0.4)} sag={ease(P(t, 90.63, 92.3))} place="ДОМ" tag="ОШИБКА 3: ДОМ" chips={[{c: 'cyan', text: 'ВОДА ПРИБЫВАЕТ'}, ...(t > 87.6 ? [{c: 'red' as const, text: 'ТРЕСК'}] : []), ...(t > 90.6 ? [{c: 'red' as const, text: 'КРЫША ПРОСЕДАЕТ'}] : [])]} />;
};
export const Jump: React.FC<{t: number}> = ({t}) => {
  const k = ease(P(t, 93.0, 94.2));
  return (
    <Roof t={t} cam={{cx: 700, cy: 1100, s: 1.15}} hero={{x: 520}} place="КРЫША" tag="ОШИБКА 3: ДОМ" chips={[{c: 'red', text: 'НЕ ПРЫГАТЬ'}]}
      world={
        <g>
          <g transform="translate(1100 1180)">
            <path d="M-200 100 L0 -40 L200 100 Z" fill="#202b4a" />
          </g>
          <path d="M600 1100 Q820 900 1000 1100" stroke="#f2c94c" strokeWidth={8} strokeDasharray="14 12" fill="none" />
          <g opacity={k} transform="translate(820 1000)">
            <path d="M-70 -70 L70 70 M70 -70 L-70 70" stroke="#ff3b3b" strokeWidth={26} strokeLinecap="round" />
          </g>
        </g>
      }
    />
  );
};
export const Container: React.FC<{t: number}> = ({t}) => {
  const k = P(t, 105.98, 114.9);
  const x = lerp(-320, 520, Math.pow(k, 1.3));
  const s = lerp(0.6, 2.4, Math.pow(k, 2));
  const left = Math.max(0, 114.9 - t);
  return (
    <Roof t={t} cam={{cx: 540, cy: 1060, s: 1.05}} hero={{x: 600}} place="КРЫША" tag="ВНИМАНИЕ" chips={[{c: 'red', text: 'ГРУЗОВОЙ КОНТЕЙНЕР'}, {c: 'yellow', text: `ДО УДАРА: ${left.toFixed(0)} СЕК`}]}
      world={
        <g transform={`translate(${x} ${1360}) scale(${s})`}>
          <rect x={-190} y={-170} width={380} height={170} fill="#c0392b" stroke="#7a1f16" strokeWidth={6} />
          {Array.from({length: 8}).map((_, i) => <rect key={i} x={-176 + i * 46} y={-160} width={10} height={150} fill="#9a2a20" />)}
          <rect x={-190} y={-12} width={380} height={12} fill="#7a1f16" />
        </g>
      }
    />
  );
};
export const Countdown: React.FC<{t: number}> = ({t}) => {
  const n = Math.max(1, Math.ceil(114.95 - t));
  const k = P(t, 111.61, 114.95);
  return (
    <Roof t={t} cam={{cx: 540, cy: 1060, s: lerp(1.05, 1.3, k)}} hero={{x: 600}} place="КРЫША" tag="ВНИМАНИЕ" chips={[{c: 'red', text: 'КОНТЕЙНЕР РЯДОМ'}]}
      world={
        <g transform={`translate(${lerp(300, 620, k)} 1360) scale(${lerp(2, 3.6, k)})`}>
          <rect x={-190} y={-170} width={380} height={170} fill="#c0392b" stroke="#7a1f16" strokeWidth={6} />
          {Array.from({length: 8}).map((_, i) => <rect key={i} x={-176 + i * 46} y={-160} width={10} height={150} fill="#9a2a20" />)}
        </g>
      }
      hudOverlay={<text x={540} y={520} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={260} fill="#ff3b3b" stroke="#05070f" strokeWidth={14} paintOrder="stroke">{n}</text>}
    />
  );
};
