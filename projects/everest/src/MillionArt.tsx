import React from 'react';
import '@fontsource/montserrat/cyrillic-700.css';
import '@fontsource/montserrat/latin-700.css';
import {clamp, ease, lerp, rnd} from './util';

export const W = 1080;
export const H = 1920;
export const FONT = 'Montserrat, sans-serif';
export const P = (t: number, a: number, b: number) => clamp((t - a) / (b - a));
export const Svg: React.FC<{children: React.ReactNode}> = ({children}) => (
  <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
    {children}
  </svg>
);

// ================= characters =================
export type Look = {skin: string; hair: string; style: 'spiky' | 'curly' | 'bald' | 'slick' | 'short'; top: string; topDark: string; bottom: string; dollar?: boolean; glasses?: boolean; tie?: string; jacket?: string; skirt?: boolean; stache?: boolean; shoes?: string};
export const LOOKS: Record<string, Look> = {
  max: {skin: '#ffc89a', hair: '#7a4720', style: 'spiky', top: '#7b3fd6', topDark: '#5a2aa8', bottom: '#1a1a2a', dollar: true, shoes: '#ffffff'},
  mama: {skin: '#ffc89a', hair: '#b4532c', style: 'curly', top: '#ff7fae', topDark: '#d95a8a', bottom: '#5b4a8a', skirt: true, shoes: '#ffd1e0'},
  danya: {skin: '#f7bf90', hair: '#14141c', style: 'spiky', top: '#2fbf5e', topDark: '#238a44', bottom: '#2a3a6a', shoes: '#ffffff'},
  teacher: {skin: '#f2c29a', hair: '#8a8a94', style: 'bald', top: '#4a5058', topDark: '#33383f', bottom: '#2a2d33', glasses: true, tie: '#d23a30', stache: true, shoes: '#111'},
  seller: {skin: '#f7c49a', hair: '#15151c', style: 'slick', top: '#f6f6f6', topDark: '#d4d4d8', bottom: '#1c1f28', jacket: '#20242f', tie: '#2a6ad0', shoes: '#111'},
};
const OUT = '#1d1830';

export type Face = {eyes?: 'open' | 'wide' | 'blank' | 'closed'; mouth?: 'smile' | 'flat' | 'o' | 'sad' | 'open'; look?: number};
export const Kid: React.FC<{x: number; y: number; s?: number; look: Look; face?: Face; armL?: number; armR?: number; bob?: number; flip?: boolean; sweat?: boolean; hold?: React.ReactNode}> = ({x, y, s = 1, look, face = {}, armL = 8, armR = -8, bob = 0, flip, sweat, hold}) => {
  const {eyes = 'open', mouth = 'smile', look: lk = 0} = face;
  const hy = -405;
  const hr = 90;
  const sw = {stroke: OUT, strokeWidth: 6, strokeLinejoin: 'round' as const, strokeLinecap: 'round' as const};
  return (
    <g transform={`translate(${x} ${y - bob}) scale(${flip ? -s * 0.82 : s * 0.82} ${s * 0.82})`}>
      <ellipse cx={0} cy={6} rx={104} ry={14} fill="#000" opacity={0.2} />
      <rect x={-46} y={-140} width={38} height={132} rx={16} fill={look.bottom} {...sw} />
      <rect x={8} y={-140} width={38} height={132} rx={16} fill={look.bottom} {...sw} />
      <ellipse cx={-30} cy={-2} rx={36} ry={16} fill={look.shoes || '#fff'} {...sw} />
      <ellipse cx={30} cy={-2} rx={36} ry={16} fill={look.shoes || '#fff'} {...sw} />
      {look.skirt && <path d="M-84 -180 L84 -180 L108 -62 L-108 -62 Z" fill={look.bottom} {...sw} />}
      <path d="M-84 -300 Q-90 -330 -50 -334 L50 -334 Q90 -330 84 -300 L78 -140 Q0 -120 -78 -140 Z" fill={look.top} {...sw} />
      <path d="M-78 -170 Q0 -150 78 -170 L78 -140 Q0 -120 -78 -140 Z" fill={look.topDark} opacity={0.4} />
      {look.jacket && (
        <g>
          <path d="M-84 -300 Q-90 -330 -50 -334 L50 -334 Q90 -330 84 -300 L78 -140 Q0 -120 -78 -140 Z" fill={look.jacket} {...sw} />
          <path d="M-26 -334 L0 -240 L26 -334 Z" fill="#f6f6f6" {...sw} />
        </g>
      )}
      {look.tie && <path d="M-12 -332 L12 -332 L18 -250 L0 -222 L-18 -250 Z" fill={look.tie} {...sw} />}
      {look.dollar && <text x={0} y={-188} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={128} fill="#fff" stroke={OUT} strokeWidth={5} paintOrder="stroke">$</text>}
      {[
        {sx: -88, a: armL},
        {sx: 88, a: armR},
      ].map((ar, i) => (
        <g key={i} transform={`translate(${ar.sx} -308) rotate(${ar.a})`}>
          <rect x={-19} y={0} width={38} height={118} rx={19} fill={look.jacket || look.top} {...sw} />
          <circle cx={0} cy={128} r={25} fill={look.skin} {...sw} />
        </g>
      ))}
      {hold}
      <circle cx={-hr + 2} cy={hy + 8} r={22} fill={look.skin} {...sw} />
      <circle cx={hr - 2} cy={hy + 8} r={22} fill={look.skin} {...sw} />
      {look.style === 'curly' && (
        <g fill={look.hair} {...sw}>
          {Array.from({length: 11}).map((_, i) => {
            const a = Math.PI + (i / 10) * Math.PI;
            return <circle key={i} cx={Math.cos(a) * 100} cy={hy - 6 + Math.sin(a) * 96} r={34} />;
          })}
          <circle cx={-98} cy={hy + 40} r={30} />
          <circle cx={98} cy={hy + 40} r={30} />
        </g>
      )}
      <circle cx={0} cy={hy} r={hr} fill={look.skin} {...sw} />
      {look.style === 'spiky' && (
        <path d={`M-92 ${hy - 14} L-84 ${hy - 70} L-66 ${hy - 46} L-58 ${hy - 120} L-34 ${hy - 70} L-14 ${hy - 138} L8 ${hy - 74} L34 ${hy - 130} L46 ${hy - 70} L74 ${hy - 112} L72 ${hy - 54} L92 ${hy - 70} L92 ${hy - 10} Q60 ${hy - 56} 0 ${hy - 58} Q-60 ${hy - 56} -92 ${hy - 14} Z`} fill={look.hair} {...sw} />
      )}
      {look.style === 'short' && <path d={`M-92 ${hy - 10} Q-96 ${hy - 110} 0 ${hy - 112} Q96 ${hy - 110} 92 ${hy - 10} Q60 ${hy - 56} 0 ${hy - 58} Q-60 ${hy - 56} -92 ${hy - 10} Z`} fill={look.hair} {...sw} />}
      {look.style === 'slick' && <path d={`M-90 ${hy - 6} Q-92 ${hy - 112} 10 ${hy - 108} Q96 ${hy - 104} 90 ${hy - 6} Q50 ${hy - 70} -12 ${hy - 66} Q-56 ${hy - 62} -90 ${hy - 6} Z`} fill={look.hair} {...sw} />}
      {look.style === 'bald' && (
        <g fill={look.hair} {...sw}>
          <path d={`M-90 ${hy + 4} Q-100 ${hy - 44} -80 ${hy - 48} L-76 ${hy - 4} Z`} />
          <path d={`M90 ${hy + 4} Q100 ${hy - 44} 80 ${hy - 48} L76 ${hy - 4} Z`} />
        </g>
      )}
      {[-1, 1].map((sd) => {
        const ex = sd * 38 + lk * 6;
        return (
          <g key={sd}>
            {eyes === 'closed' ? (
              <path d={`M${ex - 22} ${hy - 4} Q${ex} ${hy + 12} ${ex + 22} ${hy - 4}`} stroke={OUT} strokeWidth={7} fill="none" strokeLinecap="round" />
            ) : (
              <g>
                <circle cx={ex} cy={hy - 6} r={eyes === 'wide' ? 36 : 31} fill="#fff" {...sw} strokeWidth={5} />
                {eyes !== 'blank' && <circle cx={ex + lk * 11} cy={hy - 4} r={eyes === 'wide' ? 9 : 15} fill={OUT} />}
                {eyes === 'blank' && <circle cx={ex} cy={hy - 6} r={4} fill={OUT} />}
                {eyes !== 'blank' && <circle cx={ex + lk * 11 - 5} cy={hy - 10} r={4.5} fill="#fff" />}
              </g>
            )}
            <path d={`M${ex - 28} ${hy - 50} Q${ex} ${hy - 62} ${ex + 28} ${hy - 50}`} stroke={look.style === 'bald' ? '#555' : look.hair} strokeWidth={9} fill="none" strokeLinecap="round" transform={`rotate(${sd * (mouth === 'sad' ? -12 : mouth === 'flat' ? 9 : -4)} ${ex} ${hy - 52})`} />
          </g>
        );
      })}
      {look.glasses && (
        <g stroke={OUT} strokeWidth={7} fill="none">
          <circle cx={-38 + lk * 6} cy={hy - 6} r={40} />
          <circle cx={38 + lk * 6} cy={hy - 6} r={40} />
          <path d={`M-4 ${hy - 8} L4 ${hy - 8}`} />
        </g>
      )}
      <path d={`M-6 ${hy + 8} Q6 ${hy + 26} -6 ${hy + 32}`} stroke="#b9764a" strokeWidth={6} fill="none" strokeLinecap="round" />
      <circle cx={-60} cy={hy + 32} r={14} fill="#ff7a7a" opacity={0.4} />
      <circle cx={60} cy={hy + 32} r={14} fill="#ff7a7a" opacity={0.4} />
      {look.stache && <path d={`M-32 ${hy + 34} Q0 ${hy + 18} 32 ${hy + 34} Q12 ${hy + 46} 0 ${hy + 40} Q-12 ${hy + 46} -32 ${hy + 34} Z`} fill="#555" {...sw} strokeWidth={4} />}
      {mouth === 'smile' && <path d={`M-30 ${hy + 46} Q0 ${hy + 82} 30 ${hy + 46} Z`} fill="#8a1f2a" {...sw} strokeWidth={5} />}
      {mouth === 'flat' && <path d={`M-22 ${hy + 58} L22 ${hy + 58}`} stroke={OUT} strokeWidth={7} strokeLinecap="round" />}
      {mouth === 'sad' && <path d={`M-28 ${hy + 66} Q0 ${hy + 40} 28 ${hy + 66}`} stroke={OUT} strokeWidth={7} fill="none" strokeLinecap="round" />}
      {mouth === 'o' && <ellipse cx={0} cy={hy + 60} rx={17} ry={22} fill="#6a1a1a" {...sw} strokeWidth={5} />}
      {mouth === 'open' && <path d={`M-32 ${hy + 46} Q0 ${hy + 100} 32 ${hy + 46} Z`} fill="#6a1a1a" {...sw} strokeWidth={5} />}
      {sweat && <path d={`M82 ${hy - 56} Q100 ${hy - 20} 82 ${hy - 10} Q64 ${hy - 20} 82 ${hy - 56} Z`} fill="#7fd0ff" stroke={OUT} strokeWidth={4} />}
    </g>
  );
};

// ================= UI panels =================
export const TopUI: React.FC<{t: number; left: string; leftSub?: string; right: string; fail: number; vanish: number; zeroOnly: boolean}> = ({left, right, fail, vanish, zeroOnly, leftSub}) => {
  if (zeroOnly) {
    return (
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{position: 'absolute', left: 0, top: 0}}>
        <text x={540} y={250} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={150} fill="#ff2f2f" stroke="#000" strokeWidth={10} paintOrder="stroke">$0</text>
      </svg>
    );
  }
  const red = fail > 0.5;
  const mid = (right.length > 14 ? 44 : 52);
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{position: 'absolute', left: 0, top: 0, opacity: 1 - vanish}}>
      <rect x={36} y={130} width={484} height={150} rx={22} fill="#06101f" opacity={0.9} stroke={red ? '#ff4a4a' : '#35d0ff'} strokeWidth={4} />
      <text x={64} y={176} fontFamily={FONT} fontWeight={700} fontSize={26} fill={red ? '#ff9a9a' : '#35d0ff'} letterSpacing={2}>{red ? 'ИСПЫТАНИЕ' : 'ОСТАЛОСЬ МОЛЧАТЬ'}</text>
      <text x={64} y={250} fontFamily={FONT} fontWeight={700} fontSize={left.length > 8 ? 62 : 74} fill="#ffffff">{red ? 'ПРОВАЛ' : left}</text>
      {leftSub && !red && <text x={500} y={268} textAnchor="end" fontFamily={FONT} fontWeight={700} fontSize={14} fill="#5ea8c8">{leftSub}</text>}
      <rect x={560} y={130} width={484} height={150} rx={22} fill="#06101f" opacity={0.9} stroke={red && right === '$0' ? '#ff4a4a' : '#38e07b'} strokeWidth={4} />
      <text x={588} y={176} fontFamily={FONT} fontWeight={700} fontSize={26} fill={red && right === '$0' ? '#ff9a9a' : '#38e07b'} letterSpacing={2}>ВЫИГРЫШ</text>
      <text x={588} y={250} fontFamily={FONT} fontWeight={700} fontSize={right.length > 6 ? mid : 84} fill={red && right === '$0' ? '#ff4a4a' : '#ffffff'}>{right}</text>
    </svg>
  );
};

// ================= small props =================
const Phone: React.FC<{x: number; y: number; s?: number; children?: React.ReactNode; rot?: number}> = ({x, y, s = 1, children, rot = 0}) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <rect x={-190} y={-380} width={380} height={760} rx={52} fill="#14151c" stroke="#3a3d4a" strokeWidth={8} />
    <rect x={-170} y={-352} width={340} height={704} rx={36} fill="#0a0c12" />
    {children}
  </g>
);
const Coin: React.FC<{x: number; y: number; r?: number}> = ({x, y, r = 22}) => (
  <g>
    <circle cx={x} cy={y} r={r} fill="#ffcf3a" stroke="#c28a10" strokeWidth={4} />
    <text x={x} y={y + r * 0.35} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={r * 1.1} fill="#a86a00">$</text>
  </g>
);
const Cloud: React.FC<{x: number; y: number; s?: number}> = ({x, y, s = 1}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} fill="#fff" opacity={0.9}>
    <circle cx={0} cy={0} r={46} />
    <circle cx={56} cy={10} r={36} />
    <circle cx={-58} cy={14} r={34} />
    <rect x={-60} y={10} width={120} height={36} rx={18} />
  </g>
);
const Bg: React.FC<{c1: string; c2: string; id: string}> = ({c1, c2, id}) => (
  <g>
    <defs>
      <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor={c1} />
        <stop offset="1" stopColor={c2} />
      </linearGradient>
    </defs>
    <rect x={-400} y={-400} width={1880} height={2720} fill={`url(#${id})`} />
  </g>
);

// ================= scenes =================
export const PhoneBalance: React.FC<{t: number}> = ({t}) => {
  const k = P(t, 0.1, 0.8);
  const val = Math.round(1000000000 * (1 - ease(k)));
  const txt = '$' + val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return (
    <Svg>
      <Bg c1="#2b1a55" c2="#12081f" id="pb" />
      <g transform={`translate(540 1060) scale(${1.15 + 0.2 * k}) translate(-540 -1060)`}>
        <Phone x={540} y={1060}>
          <text x={0} y={-230} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={34} fill="#9aa3b8">БАЛАНС</text>
          <text x={0} y={-60} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={val > 99999999 ? 46 : 64} fill={k > 0.9 ? '#ff3b3b' : '#38e07b'}>{txt}</text>
          <rect x={-130} y={80} width={260} height={16} rx={8} fill="#232634" />
          <rect x={-130} y={80} width={260 * (1 - ease(k))} height={16} rx={8} fill="#38e07b" />
        </Phone>
      </g>
      <rect width={W} height={H} fill="#ff2a2a" opacity={k > 0.92 ? 0.3 : 0} />
    </Svg>
  );
};

export const EmptyRoom: React.FC<{t: number}> = ({t}) => {
  const sh = Math.sin(t * 40) * 6;
  return (
    <Svg>
      <Bg c1="#cfd6e4" c2="#9aa4ba" id="er" />
      <rect x={0} y={1400} width={W} height={520} fill="#8a7a62" />
      <rect x={0} y={1390} width={W} height={14} fill="#6a5a44" />
      <rect x={330} y={520} width={420} height={420} rx={14} fill="#bfe6ff" stroke="#fff" strokeWidth={14} />
      <rect x={535} y={520} width={10} height={420} fill="#fff" />
      <Kid x={540} y={1640} s={1.9} look={LOOKS.max} face={{eyes: 'wide', mouth: 'sad'}} armL={16} armR={-16} sweat />
      <g transform={`translate(${sh} 0)`}>
        <rect x={110} y={1000} width={860} height={150} rx={30} fill="#e63232" stroke="#fff" strokeWidth={8} />
        <text x={540} y={1105} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={84} fill="#fff">ПОТЕРЯНО ВСЁ</text>
      </g>
    </Svg>
  );
};

export const RewindCal: React.FC<{t: number}> = ({t}) => {
  const k = P(t, 1.6, 2.3);
  const day = Math.max(1, 7 - Math.floor(k * 7));
  return (
    <Svg>
      <Bg c1="#2a2a3a" c2="#0e0e16" id="rw" />
      <g transform={`translate(0 ${Math.sin(t * 60) * 4})`}>
        <rect x={190} y={620} width={700} height={760} rx={30} fill="#f6f6f2" stroke="#d33" strokeWidth={0} />
        <rect x={190} y={620} width={700} height={140} rx={30} fill="#e63232" />
        <text x={540} y={720} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={64} fill="#fff">ДЕНЬ</text>
        <text x={540} y={1160} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={380} fill="#222">{day}</text>
      </g>
      <text x={540} y={1560} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={110} fill="#fff" opacity={0.85}>◀◀</text>
      {Array.from({length: 30}).map((_, i) => (
        <rect key={i} x={0} y={(rnd(i) * 1920 + t * 1500) % 1920} width={W} height={3 + rnd(i + 3) * 8} fill="#fff" opacity={0.16} />
      ))}
    </Svg>
  );
};

export const OfferPhone: React.FC<{t: number}> = ({t}) => {
  const z = 1 + 0.2 * P(t, 0, 3.64);
  return (
    <Svg>
      <Bg c1="#3a2a78" c2="#1a1038" id="op" />
      <g transform={`translate(540 1060) scale(${z}) translate(-540 -1060)`}>
        <Phone x={540} y={1060}>
          <rect x={-140} y={-300} width={280} height={96} rx={20} fill="#ffcf3a" />
          <text x={0} y={-236} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={34} fill="#3a2a00">ПРЕДЛОЖЕНИЕ</text>
          <text x={0} y={-130} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={54} fill="#fff">НЕ ГОВОРИ</text>
          <text x={0} y={-62} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={54} fill="#fff">7 ДНЕЙ</text>
          <text x={0} y={30} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={44} fill="#38e07b">ПОЛУЧИ</text>
          <text x={0} y={90} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={50} fill="#38e07b">МИЛЛИАРД</text>
          <rect x={-120} y={190} width={240} height={90} rx={26} fill="#38e07b" />
          <text x={0} y={252} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={40} fill="#063">СОГЛАСЕН</text>
        </Phone>
      </g>
      {Array.from({length: 8}).map((_, i) => (
        <Coin key={i} x={120 + rnd(i) * 840} y={((rnd(i + 2) * 1920 + t * 120 * (0.5 + rnd(i))) % 1920)} r={20 + rnd(i + 5) * 12} />
      ))}
    </Svg>
  );
};

export const TermsMax: React.FC<{t: number}> = ({t}) => {
  const sh = t > 5.6 ? Math.sin(t * 50) * 4 * (1 - P(t, 5.6, 7.0)) : 0;
  return (
    <Svg>
      <Bg c1="#cfd6e4" c2="#9aa4ba" id="tm" />
      <rect x={0} y={1450} width={W} height={470} fill="#8a7a62" />
      <Kid x={380} y={1720} s={1.8} look={LOOKS.max} face={{eyes: 'wide', mouth: 'o', look: 0.5}} armL={-30} armR={14} />
      <g transform={`translate(${sh} 0)`}>
        <rect x={560} y={640} width={440} height={420} rx={40} fill="#fff" stroke="#222" strokeWidth={6} />
        <path d="M600 1050 L540 1180 L680 1060 Z" fill="#fff" stroke="#222" strokeWidth={6} />
        <text x={780} y={760} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={58} fill="#222">1 СЛОВО</text>
        <text x={780} y={850} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={90} fill="#e63232">= $0</text>
        <text x={780} y={950} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={46} fill="#222">ПОТЕРЯЕШЬ ВСЁ</text>
      </g>
    </Svg>
  );
};

export const AgreePress: React.FC<{t: number}> = ({t}) => {
  const k = ease(P(t, 8.3, 8.9));
  return (
    <Svg>
      <Bg c1="#3a2a78" c2="#1a1038" id="ap" />
      <g transform="translate(540 1000) scale(1.4) translate(-540 -1000)">
        <Phone x={540} y={1000}>
          <text x={0} y={-120} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={46} fill="#fff">7 ДНЕЙ ТИШИНЫ</text>
          <rect x={-150} y={20} width={300} height={110} rx={32} fill={k > 0.9 ? '#1fa85a' : '#38e07b'} />
          <text x={0} y={95} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={48} fill="#063">СОГЛАСЕН</text>
        </Phone>
        <g transform={`translate(${lerp(760, 560, k)} ${lerp(1500, 1090, k)}) rotate(-20)`}>
          <rect x={-30} y={0} width={60} height={260} rx={30} fill="#f7c8a0" />
          <rect x={-70} y={90} width={50} height={140} rx={25} fill="#f7c8a0" />
        </g>
      </g>
    </Svg>
  );
};

export const MoneyIn: React.FC<{t: number}> = ({t}) => {
  const k = P(t, 9.22, 11.6);
  const val = Math.round(1000000000 * ease(k));
  const txt = '$' + val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  const flash = t < 9.7 ? 0.55 * (1 - (t - 9.22) / 0.48) : 0;
  return (
    <Svg>
      <Bg c1="#1fa85a" c2="#0b5a2e" id="mi" />
      <g transform="translate(540 1000) scale(1.15) translate(-540 -1000)">
        <Phone x={540} y={1000}>
          <text x={0} y={-230} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={34} fill="#9aa3b8">СЧЁТ ПОПОЛНЕН</text>
          <text x={0} y={-60} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={46} fill="#38e07b">{txt}</text>
          <circle cx={0} cy={140} r={70} fill="#38e07b" />
          <path d="M-34 140 L-8 168 L38 114" stroke="#063" strokeWidth={16} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </Phone>
      </g>
      {Array.from({length: 26}).map((_, i) => {
        const a = rnd(i) * 6.28;
        const d = ((t - 9.22) * (300 + rnd(i + 3) * 500) + i * 20) % 1300;
        return <Coin key={i} x={540 + Math.cos(a) * d} y={1000 + Math.sin(a) * d} r={16 + rnd(i + 7) * 18} />;
      })}
      <rect width={W} height={H} fill="#7dffb0" opacity={Math.max(0, flash)} />
    </Svg>
  );
};

export const Kitchen: React.FC<{t: number; a: number; b: number; pass: boolean}> = ({t, a, b, pass}) => {
  const k = P(t, a, b);
  const maxX = pass ? lerp(-150, 1250, ease(k)) : lerp(980, 700, ease(k));
  return (
    <Svg>
      <Bg c1="#ffe9b8" c2="#f4c98a" id="kt" />
      <g transform={`translate(${lerp(0, pass ? 0 : -80, k)} 0)`}>
        <rect x={0} y={1420} width={W} height={500} fill="#c9905a" />
        <rect x={0} y={1410} width={W} height={14} fill="#a06a38" />
        <rect x={80} y={700} width={360} height={720} rx={20} fill="#e8e8ee" stroke="#9aa" strokeWidth={6} />
        <circle cx={170} cy={900} r={46} fill="#222" />
        <circle cx={330} cy={900} r={46} fill="#222" />
        <rect x={170} y={640} width={160} height={90} rx={12} fill="#b8bcc6" />
        <ellipse cx={250} cy={620} rx={84} ry={30} fill="#d33" />
        {[0, 1, 2].map((i) => (
          <circle key={i} cx={230 + i * 24 + Math.sin(t * 3 + i) * 10} cy={560 - ((t * 60 + i * 50) % 160)} r={20 + i * 6} fill="#fff" opacity={0.5} />
        ))}
        <rect x={560} y={1180} width={440} height={36} rx={10} fill="#8a5a30" />
        <rect x={590} y={1216} width={26} height={210} fill="#8a5a30" />
        <rect x={940} y={1216} width={26} height={210} fill="#8a5a30" />
        <ellipse cx={680} cy={1170} rx={60} ry={16} fill="#fff" stroke="#bbb" strokeWidth={4} />
        <ellipse cx={680} cy={1162} rx={40} ry={9} fill="#f5c542" />
        <ellipse cx={860} cy={1170} rx={60} ry={16} fill="#fff" stroke="#bbb" strokeWidth={4} />
        <rect x={900} y={1090} width={50} height={70} rx={10} fill="#fff" stroke="#bbb" strokeWidth={4} />
      </g>
      <Kid x={250} y={1700} s={1.7} look={LOOKS.mama} face={{eyes: 'open', mouth: pass && k > 0.2 ? 'o' : 'smile', look: 0.6}} armL={pass ? -150 : 8} />
      {pass && k > 0.18 && <text x={250} y={1000} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={180} fill="#e63232" stroke="#fff" strokeWidth={10} paintOrder="stroke">?</text>}
      <Kid x={maxX} y={1740} s={1.7} look={LOOKS.max} face={{eyes: 'blank', mouth: 'flat', look: pass ? 0.8 : -0.4}} bob={Math.abs(Math.sin(t * 9)) * 10} />
    </Svg>
  );
};

export const Corridor: React.FC<{t: number; mode: 'meet' | 'nod'}> = ({t, mode}) => {
  const k = mode === 'meet' ? ease(P(t, 18.58, 20.6)) : 1;
  const nod = mode === 'nod' ? Math.sin((t - 21.44) * 12) * 12 : 0;
  return (
    <Svg>
      <Bg c1="#cfe8ff" c2="#a8c8ea" id="co" />
      {Array.from({length: 7}).map((_, i) => (
        <g key={i}>
          <rect x={i * 190 - 40} y={560} width={170} height={860} rx={8} fill={['#e26a3a', '#3a8ae2', '#e2b63a'][i % 3]} stroke="#0003" strokeWidth={6} />
          <rect x={i * 190 + 20} y={640} width={50} height={14} fill="#0004" />
          <circle cx={i * 190 + 100} cy={1000} r={10} fill="#fff" />
        </g>
      ))}
      <rect x={0} y={1420} width={W} height={500} fill="#b8a888" />
      <Kid x={lerp(1300, 740, k)} y={1720} s={1.75} look={LOOKS.danya} face={{eyes: 'open', mouth: 'open', look: -0.6}} armL={mode === 'meet' ? -110 : 10} flip bob={Math.abs(Math.sin(t * 9)) * (k < 1 ? 10 : 0)} />
      <Kid x={330} y={1740} s={1.75} look={LOOKS.max} face={{eyes: nod !== 0 ? 'closed' : 'open', mouth: 'flat', look: 0.5}} bob={0} />
      {mode === 'meet' && k > 0.85 && (
        <g>
          <rect x={560} y={640} width={260} height={220} rx={36} fill="#fff" stroke="#222" strokeWidth={6} />
          <rect x={640} y={690} width={110} height={130} rx={8} fill="#3a8ae2" />
          <rect x={650} y={700} width={90} height={12} fill="#fff" />
          <text x={790} y={780} fontFamily={FONT} fontWeight={700} fontSize={110} fill="#e63232">?</text>
        </g>
      )}
      {mode === 'nod' && <text x={330 + Math.sin((t - 21.44) * 12) * 0} y={1000 + nod} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={140} fill="#38b36a">✓</text>}
    </Svg>
  );
};

export const Classroom: React.FC<{t: number; mode: 'call' | 'board'}> = ({t, mode}) => {
  const chalk = mode === 'board' ? P(t, 25.6, 28.4) : 0;
  const k = ease(P(t, 22.87, 24.9));
  return (
    <Svg>
      <Bg c1="#f1e6c8" c2="#d8c89a" id="cl" />
      <rect x={60} y={480} width={960} height={620} rx={14} fill="#2b5a46" stroke="#8a5a30" strokeWidth={22} />
      {mode === 'board' && (
        <g fontFamily={FONT} fontWeight={700} fill="#fff" opacity={0.92}>
          <text x={160} y={700} fontSize={110} opacity={clamp(chalk * 3)}>12 × 3</text>
          <text x={160} y={850} fontSize={110} opacity={clamp(chalk * 3 - 1)}>= 36</text>
          <text x={700} y={850} fontSize={120} fill="#ffd34a" opacity={clamp(chalk * 3 - 2)}>?</text>
        </g>
      )}
      <rect x={0} y={1420} width={W} height={500} fill="#b88a56" />
      <rect x={150} y={1220} width={300} height={36} rx={8} fill="#8a5a30" />
      <rect x={180} y={1256} width={26} height={180} fill="#6a4020" />
      <Kid x={mode === 'call' ? lerp(860, 760, k) : 840} y={1730} s={1.8} look={LOOKS.teacher} face={{eyes: 'open', mouth: 'flat', look: -0.7}} armL={mode === 'call' ? 70 : 4} armR={mode === 'board' ? -60 : -8} flip hold={mode === 'call' ? <rect x={-250} y={-260} width={12} height={240} fill="#8a5a30" transform="rotate(-50)" /> : undefined} />
      <Kid x={mode === 'call' ? 300 : 420} y={1750} s={1.8} look={LOOKS.max} face={{eyes: 'wide', mouth: mode === 'board' ? 'flat' : 'o', look: 0.6}} armL={mode === 'board' ? 150 : 8} sweat={mode === 'board'} />
      {mode === 'board' && (
        <g>
          <circle cx={560} cy={1130} r={14} fill="#222" opacity={0.0} />
          <text x={420} y={1000} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={110} fill="#444">…</text>
        </g>
      )}
    </Svg>
  );
};

export const Diary: React.FC<{t: number}> = ({t}) => {
  const k = ease(P(t, 31.4, 31.9));
  const z = 1 + 0.35 * P(t, 30.96, 33.15);
  return (
    <Svg>
      <Bg c1="#e8f0ff" c2="#bfcdf0" id="dr" />
      <g transform={`translate(540 960) scale(${z}) translate(-540 -960)`}>
        <rect x={180} y={420} width={720} height={1080} rx={30} fill="#fff8e6" stroke="#b89a60" strokeWidth={8} />
        {Array.from({length: 11}).map((_, i) => (
          <rect key={i} x={230} y={560 + i * 80} width={620} height={4} fill="#9ab" opacity={0.7} />
        ))}
        <text x={260} y={520} fontFamily={FONT} fontWeight={700} fontSize={50} fill="#345">Математика</text>
        <text x={620} y={1240} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={560} fill="#e63232" opacity={k} transform={`translate(0 ${(1 - k) * -700}) rotate(${-10 * (1 - k)} 620 1000)`}>2</text>
      </g>
    </Svg>
  );
};

const Car: React.FC<{x: number; y: number; s?: number; color: string; gold?: number}> = ({x, y, s = 1, color, gold = 0}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse cx={0} cy={6} rx={200} ry={16} fill="#000" opacity={0.25} />
    <path d="M-200 -20 L-200 -64 Q-200 -78 -178 -82 L-100 -92 L-50 -138 L70 -138 L124 -92 L188 -84 Q206 -80 206 -62 L206 -20 Z" fill={color} stroke={gold > 0 ? '#ffd23a' : '#0004'} strokeWidth={gold > 0 ? 12 : 4} />
    <path d="M-86 -94 L-44 -128 L-6 -128 L-6 -94 Z M6 -94 L6 -128 L64 -128 L102 -94 Z" fill="#cfeaff" />
    {[-120, 120].map((c) => (
      <g key={c}>
        <circle cx={c} cy={-18} r={36} fill="#1a1a20" />
        <circle cx={c} cy={-18} r={17} fill="#cfd4dc" />
      </g>
    ))}
    <rect x={190} y={-60} width={18} height={14} rx={4} fill="#fff6a0" />
    {gold > 0 && <circle cx={0} cy={-70} r={260 * gold} fill="#ffd23a" opacity={0.0} />}
  </g>
);

export const Dealership: React.FC<{t: number}> = ({t}) => {
  const pan = lerp(120, -120, P(t, 33.15, 37.71));
  const gold = ease(P(t, 35.9, 36.5));
  return (
    <Svg>
      <Bg c1="#dfe9ff" c2="#bccbe8" id="ds" />
      <rect x={0} y={1420} width={W} height={500} fill="#8a92a6" />
      <rect x={0} y={1410} width={W} height={12} fill="#6a7288" />
      <g transform={`translate(${pan} 0)`}>
        <Car x={150} y={1560} s={1.05} color="#3a8ae2" />
        <Car x={620} y={1540} s={1.15} color="#34b35c" />
        <Car x={1130} y={1560} s={1.35} color="#e63232" gold={gold} />
        {[150, 620, 1130].map((cx, i) => (
          <g key={i}>
            <rect x={cx - 90} y={1180} width={180} height={64} rx={10} fill="#fff" stroke="#222" strokeWidth={4} />
            <text x={cx} y={1226} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={36} fill="#222">{['$', '$$', '$$$$$'][i]}</text>
          </g>
        ))}
      </g>
      <Kid x={400} y={1800} s={1.7} look={LOOKS.max} face={{eyes: 'wide', mouth: 'open', look: 0.9}} armR={-100} />
      {gold > 0.1 && Array.from({length: 10}).map((_, i) => <text key={i} x={760 + rnd(i) * 300} y={1100 + rnd(i + 2) * 300 - gold * 60} fontFamily={FONT} fontWeight={700} fontSize={50} fill="#ffd23a">✦</text>)}
    </Svg>
  );
};

export const SellerCounter: React.FC<{t: number; mode: 'talk' | 'passport'}> = ({t, mode}) => {
  const k = ease(P(t, 39.9, 40.8));
  return (
    <Svg>
      <Bg c1="#dfe9ff" c2="#bccbe8" id="sc" />
      <rect x={0} y={1420} width={W} height={500} fill="#8a92a6" />
      {mode === 'talk' ? (
        <g>
          <Kid x={800} y={1720} s={1.8} look={LOOKS.seller} face={{eyes: 'open', mouth: 'open', look: -0.7}} armL={30} flip />
          <Kid x={300} y={1740} s={1.8} look={LOOKS.max} face={{eyes: 'blank', mouth: 'flat', look: 0.6}} />
          <rect x={80} y={1360} width={920} height={60} fill="#5a4630" />
          <rect x={80} y={1420} width={920} height={500} fill="#6a5238" />
          <rect x={470} y={560} width={300} height={200} rx={40} fill="#fff" stroke="#222" strokeWidth={6} />
          <text x={620} y={690} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={120} fill="#222">?</text>
        </g>
      ) : (
        <g transform={`translate(540 ${1000 - 160 * k}) scale(${1 + 0.15 * k}) translate(-540 -1000)`}>
          <rect x={290} y={620} width={500} height={700} rx={26} fill="#1e3a8a" stroke="#ffd23a" strokeWidth={8} />
          <text x={540} y={760} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={64} fill="#ffd23a">ПАСПОРТ</text>
          <circle cx={540} cy={980} r={110} fill="#ffd23a" opacity={0.9} />
          <circle cx={540} cy={980} r={78} fill="#1e3a8a" />
          <g transform={`translate(${lerp(1300, 880, k)} 1400)`}>
            <circle cx={0} cy={0} r={46} fill="none" stroke="#ffd23a" strokeWidth={16} />
            <rect x={36} y={-9} width={160} height={18} fill="#ffd23a" />
            <rect x={150} y={-9} width={18} height={44} fill="#ffd23a" />
            <rect x={178} y={-9} width={18} height={34} fill="#ffd23a" />
          </g>
        </g>
      )}
    </Svg>
  );
};

export const CityDrive: React.FC<{t: number}> = ({t}) => {
  const k = P(t, 41.62, 43.4);
  return (
    <Svg>
      <Bg c1="#8fd0ff" c2="#d8f0ff" id="cd" />
      <Cloud x={((200 - t * 40) % 1400 + 1400) % 1400 - 150} y={600} s={1.4} />
      {Array.from({length: 9}).map((_, i) => (
        <rect key={i} x={((i * 220 - t * 160) % 2000 + 2000) % 2000 - 220} y={900 - rnd(i) * 320} width={170} height={700 + rnd(i) * 320} fill={['#8a9ac4', '#a8b4d4', '#7a88b4'][i % 3]} />
      ))}
      <rect x={0} y={1500} width={W} height={420} fill="#4a4e5a" />
      {Array.from({length: 8}).map((_, i) => (
        <rect key={i} x={((i * 220 - t * 700) % 1760 + 1760) % 1760 - 220} y={1700} width={130} height={14} fill="#f0f0f0" />
      ))}
      <Car x={lerp(-120, 700, ease(k))} y={1650} s={1.5} color="#e63232" gold={1} />
      {Array.from({length: 10}).map((_, i) => <circle key={i} cx={lerp(-300, 520, ease(k)) - i * 40} cy={1640 + Math.sin(i) * 12} r={14 + i * 3} fill="#fff" opacity={0.4 * (1 - i / 10)} />)}
    </Svg>
  );
};

export const Mansion: React.FC<{t: number; vanish?: number}> = ({t, vanish = 0}) => {
  const k = P(t, 43.4, 46.02);
  const gate = ease(P(t, 43.9, 44.8));
  return (
    <Svg>
      <Bg c1="#8fd0ff" c2="#e8f6ff" id="mn" />
      <g transform={`translate(540 1100) scale(${lerp(1.5, 1.0, k)}) translate(-540 -1100)`}>
        <rect x={-300} y={1380} width={1680} height={600} fill="#5ac45a" />
        <g opacity={1 - vanish}>
          <rect x={160} y={820} width={760} height={560} fill="#f4ead2" stroke="#b89a60" strokeWidth={8} />
          <path d="M120 830 L540 520 L960 830 Z" fill="#c0503a" />
          {[0, 1, 2, 3].map((i) => (
            <rect key={i} x={210 + i * 170} y={900} width={110} height={150} rx={10} fill="#8fd0ff" stroke="#fff" strokeWidth={8} />
          ))}
          <rect x={470} y={1120} width={140} height={260} rx={14} fill="#8a5a30" />
          <rect x={160} y={1180} width={300} height={4} fill="#b89a60" />
        </g>
        <g opacity={1 - vanish}>
          <rect x={80} y={1440} width={920} height={300} rx={50} fill="#4ac4ff" stroke="#fff" strokeWidth={12} />
          {Array.from({length: 6}).map((_, i) => (
            <path key={i} d={`M${160 + i * 140} ${1560 + (i % 2) * 40} q40 -30 80 0`} stroke="#fff" strokeWidth={6} fill="none" />
          ))}
        </g>
        <g>
          <rect x={-40} y={1300} width={lerp(300, 40, gate)} height={90} fill="#2a2e38" />
          <rect x={820} y={1300} width={lerp(300, 40, gate)} height={90} fill="#2a2e38" />
        </g>
      </g>
    </Svg>
  );
};

export const Calendar6: React.FC<{t: number}> = ({t}) => {
  const k = P(t, 46.02, 47.4);
  const day = Math.min(6, Math.floor(k * 7));
  return (
    <Svg>
      <Bg c1="#ffe27a" c2="#ffb24a" id="c6" />
      {[0, 1, 2].map((i) => (
        <g key={i} transform={`rotate(${-8 + i * 8} 540 960)`} opacity={i === 2 ? 1 : 0.6}>
          <rect x={210} y={560} width={660} height={800} rx={30} fill="#fff" stroke="#e63232" strokeWidth={8} />
        </g>
      ))}
      <rect x={210} y={560} width={660} height={150} rx={30} fill="#e63232" />
      <text x={540} y={660} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={62} fill="#fff">ПРОШЛО</text>
      <text x={540} y={1130} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={380} fill="#222">{day}</text>
      <text x={540} y={1280} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={80} fill="#e63232">ДНЕЙ</text>
    </Svg>
  );
};

export const Sofa: React.FC<{t: number}> = ({t}) => {
  const items = [
    {x: 200, y: 640, e: '🚁'},
    {x: 470, y: 560, e: '🛥️'},
    {x: 740, y: 640, e: '💎'},
    {x: 330, y: 820, e: '🏝️'},
    {x: 620, y: 800, e: '✈️'},
  ];
  return (
    <Svg>
      <Bg c1="#ffe9d0" c2="#f4c9a0" id="sf" />
      <rect x={0} y={1500} width={W} height={420} fill="#8a6a4a" />
      <rect x={120} y={1260} width={840} height={260} rx={50} fill="#9a4ad6" />
      <rect x={90} y={1180} width={900} height={180} rx={60} fill="#b86af0" />
      <Kid x={540} y={1470} s={1.6} look={LOOKS.max} face={{eyes: 'open', mouth: 'smile', look: Math.sin(t) * 0.6}} armL={-20} armR={20} />
      <g transform={`translate(0 ${Math.sin(t * 1.6) * 8})`}>
        <ellipse cx={470} cy={760} rx={400} ry={250} fill="#fff" stroke="#222" strokeWidth={6} />
        <circle cx={380} cy={1060} r={26} fill="#fff" stroke="#222" strokeWidth={5} />
        <circle cx={330} cy={1130} r={14} fill="#fff" stroke="#222" strokeWidth={5} />
        {items.map((it, i) => (
          <text key={i} x={it.x} y={it.y} fontSize={120} opacity={clamp((t - (47.8 + i * 0.7)) / 0.4)}>{it.e}</text>
        ))}
      </g>
    </Svg>
  );
};

export const TimerBig: React.FC<{t: number}> = ({t}) => {
  const left = Math.max(0, 300 - (t - 52.72) * 14);
  const mm = String(Math.floor(left / 60)).padStart(2, '0');
  const ss = String(Math.floor(left % 60)).padStart(2, '0');
  const sw = Math.sin((t - 52.72) * 6.28 * 1) * 8;
  return (
    <Svg>
      <Bg c1="#2a2a3a" c2="#0e0e16" id="tb" />
      <g transform={`translate(540 800) scale(${1 + 0.06 * P(t, 52.72, 55.82)}) translate(-540 -880)`}>
        <circle cx={540} cy={880} r={380} fill="#f6f6f2" stroke="#e63232" strokeWidth={26} />
        {Array.from({length: 12}).map((_, i) => (
          <rect key={i} x={534} y={520} width={12} height={i % 3 === 0 ? 60 : 34} fill="#222" transform={`rotate(${i * 30} 540 880)`} />
        ))}
        <rect x={534} y={560} width={12} height={320} rx={6} fill="#e63232" transform={`rotate(${(t - 52.72) * 360} 540 880)`} />
        <circle cx={540} cy={880} r={22} fill="#222" />
      </g>
      <text x={540} y={1390} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={170} fill="#ff4a4a" transform={`translate(${sw} 0)`}>{`${mm}:${ss}`}</text>
    </Svg>
  );
};

export const Ringing: React.FC<{t: number}> = ({t}) => {
  const sh = Math.sin(t * 70) * 10;
  return (
    <Svg>
      <Bg c1="#ffe9d0" c2="#f4c9a0" id="rg" />
      <g transform={`translate(${sh} 0)`}>
        <Phone x={540} y={1000} s={1.15}>
          <circle cx={0} cy={-120} r={110} fill="#f27ea4" />
          <circle cx={0} cy={-150} r={40} fill="#f7c8a0" />
          <path d="M-70 -50 Q0 -120 70 -50 Z" fill="#f7c8a0" />
          <text x={0} y={90} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={92} fill="#fff">МАМА</text>
          <circle cx={-90} cy={230} r={52} fill="#e63232" />
          <circle cx={90} cy={230} r={52} fill="#38e07b" />
        </Phone>
      </g>
    </Svg>
  );
};

export const CallMax: React.FC<{t: number; think: boolean}> = ({t, think}) => (
  <Svg>
    <Bg c1="#ffe9d0" c2="#f4c9a0" id="cm" />
    <rect x={0} y={1500} width={W} height={420} fill="#8a6a4a" />
    <g transform={`translate(540 1400) scale(${think ? 1.25 : 1}) translate(-540 -1400)`}>
      <Kid x={540} y={1720} s={2.1} look={LOOKS.max} face={{eyes: think ? 'wide' : 'open', mouth: think ? 'flat' : 'sad', look: think ? 0.5 : 0}} armL={think ? 8 : 8} armR={think ? -8 : -150} sweat={think} hold={!think ? <rect x={60} y={-380} width={44} height={76} rx={10} fill="#14151c" stroke="#3a3d4a" strokeWidth={5} transform="rotate(10)" /> : <rect x={-120} y={-170} width={90} height={150} rx={14} fill="#14151c" stroke="#3a3d4a" strokeWidth={5} transform="rotate(-8)" />} />
    </g>
    {!think && (
      <g>
        <ellipse cx={780} cy={620} rx={230} ry={150} fill="#fff" stroke="#222" strokeWidth={6} />
        <text x={780} y={650} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={80} fill="#f2569a">♥ ?</text>
      </g>
    )}
    {think && <text x={540} y={700} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={150} fill="#444">…</text>}
  </Svg>
);

export const FailStamp: React.FC<{t: number}> = ({t}) => {
  const k = ease(P(t, 63.84, 64.15));
  const sh = t > 63.84 && t < 64.5 ? Math.sin(t * 90) * 14 * (1 - P(t, 63.84, 64.5)) : 0;
  return (
    <Svg>
      <Bg c1="#ff6a6a" c2="#8a0f12" id="fs" />
      <g transform={`translate(${sh} ${sh * 0.4})`}>
        <Phone x={540} y={1000} s={1.15}>
          <text x={0} y={-60} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={150} fill="#fff">ДА</text>
        </Phone>
        <g transform={`translate(540 1000) rotate(-12) scale(${lerp(3, 1, k)})`} opacity={k}>
          <rect x={-440} y={-130} width={880} height={260} rx={30} fill="#e63232" stroke="#fff" strokeWidth={14} />
          <text x={0} y={-10} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={104} fill="#fff">ИСПЫТАНИЕ</text>
          <text x={0} y={90} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={104} fill="#fff">ПРОВАЛЕНО</text>
        </g>
      </g>
    </Svg>
  );
};

export const Vanish: React.FC<{t: number}> = ({t}) => {
  const house = ease(P(t, 65.4, 65.9));
  const car = ease(P(t, 66.6, 67.1));
  const flashA = t > 65.4 && t < 65.7 ? 0.6 : 0;
  const flashB = t > 66.6 && t < 66.9 ? 0.6 : 0;
  const lot = P(t, 67.4, 68.2);
  return (
    <Svg>
      <Bg c1="#8fd0ff" c2="#e8f6ff" id="vn" />
      <rect x={0} y={1380} width={W} height={540} fill="#5ac45a" />
      <g opacity={1 - house}>
        <rect x={160} y={820} width={760} height={560} fill="#f4ead2" stroke="#b89a60" strokeWidth={8} />
        <path d="M120 830 L540 520 L960 830 Z" fill="#c0503a" />
        {[0, 1, 2, 3].map((i) => (
          <rect key={i} x={210 + i * 170} y={900} width={110} height={150} rx={10} fill="#8fd0ff" stroke="#fff" strokeWidth={8} />
        ))}
        <rect x={470} y={1120} width={140} height={260} rx={14} fill="#8a5a30" />
      </g>
      {house > 0 && house < 1 && Array.from({length: 14}).map((_, i) => <circle key={i} cx={540 + (rnd(i) - 0.5) * 760} cy={1000 + (rnd(i + 3) - 0.5) * 520} r={50 + rnd(i + 5) * 70} fill="#fff" opacity={0.85 * (1 - house)} />)}
      <g opacity={1 - car}>
        <Car x={600} y={1640} s={1.5} color="#e63232" gold={1} />
      </g>
      {car > 0 && car < 1 && Array.from({length: 10}).map((_, i) => <circle key={i} cx={600 + (rnd(i) - 0.5) * 380} cy={1590 + (rnd(i + 3) - 0.5) * 160} r={36 + rnd(i + 5) * 40} fill="#fff" opacity={0.85 * (1 - car)} />)}
      <g opacity={lot}>
        <text x={540} y={1180} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={110} fill="#e63232" stroke="#fff" strokeWidth={8} paintOrder="stroke">ПУСТО</text>
      </g>
      <rect width={W} height={H} fill="#fff" opacity={flashA + flashB} />
    </Svg>
  );
};

export const BarrelStreet: React.FC<{t: number}> = ({t}) => {
  const blink = Math.floor(t * 0.9) % 2 === 0 && (t * 0.9) % 1 > 0.85;
  return (
    <Svg>
      <Bg c1="#bfe3ff" c2="#eaf5ff" id="bs" />
      <rect x={0} y={1180} width={W} height={740} fill="#7a7e88" />
      <rect x={0} y={1180} width={W} height={20} fill="#5a5e68" />
      {[0, 1, 2, 3, 4].map((i) => (
        <rect key={i} x={i * 230 - 60} y={1560} width={140} height={12} fill="#eee" opacity={0.8} />
      ))}
      <rect x={60} y={820} width={170} height={360} fill="#9aa4c4" />
      <rect x={850} y={760} width={190} height={420} fill="#aab2cc" />
      <Kid x={540} y={1650} s={2.0} look={{...LOOKS.max, dollar: false}} face={{eyes: blink ? 'closed' : 'blank', mouth: 'flat', look: 0}} armL={20} armR={-20} />
      <g transform="translate(540 1500)">
        <rect x={-190} y={-300} width={380} height={420} rx={26} fill="#b8864e" stroke="#6a4420" strokeWidth={10} />
        {[-120, 0, 120].map((y) => (
          <rect key={y} x={-190} y={y - 150} width={380} height={18} fill="#6a4420" opacity={0.7} />
        ))}
        <rect x={-120} y={-330} width={26} height={90} fill="#6a4420" />
        <rect x={94} y={-330} width={26} height={90} fill="#6a4420" />
        <text x={0} y={-60} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={64} fill="#fff" opacity={0.0}>$0</text>
      </g>
      <g transform="translate(540 1700)">
        <ellipse cx={-70} cy={0} rx={50} ry={16} fill="#222" />
        <ellipse cx={70} cy={0} rx={50} ry={16} fill="#222" />
      </g>
    </Svg>
  );
};
