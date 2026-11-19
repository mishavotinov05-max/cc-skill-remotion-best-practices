import React from 'react';
import {clamp, ease, lerp, rnd, mixc, Tx, Glow, E, P, FONT} from './M60Base';

// ---------------- radio ----------------
export const Radio: React.FC<{x: number; y: number; s?: number; t: number; on?: number; needle?: number; noise?: number}> = ({x, y, s = 1, t, on = 1, needle = 0.5, noise = 0}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-210} y={-130} width={420} height={260} rx={26} fill="#5a3a24" stroke="#2a1a0e" strokeWidth={6} />
    <rect x={-190} y={-112} width={260} height={110} rx={10} fill={mixc('#1a1208', '#ffc86b', on * 0.55)} stroke="#1a1208" strokeWidth={4} />
    {Array.from({length: 24}).map((_, i) => <rect key={i} x={-176 + i * 10.4} y={-100} width={2.5} height={i % 4 === 0 ? 34 : 20} fill="#3a2a14" opacity={0.85} />)}
    {[0, 1, 2, 3].map((i) => <Tx key={i} x={-160 + i * 70} y={-44} size={16} fill="#3a2a14">{['88', '96', '104', '108'][i]}</Tx>)}
    <rect x={-176 + needle * 250 - 2} y={-108} width={4} height={100} fill="#d33a2c" />
    {noise > 0 && Array.from({length: 18}).map((_, i) => <rect key={i} x={-186 + i * 14} y={-108 + rnd(i + Math.floor(t * 15)) * 80} width={8} height={4 + rnd(i + 4) * 14} fill="#fff" opacity={noise * 0.7} />)}
    <circle cx={140} cy={-50} r={34} fill="#d9c7a0" stroke="#2a1a0e" strokeWidth={5} /><rect x={137} y={-82} width={6} height={22} fill="#2a1a0e" transform={`rotate(${needle * 300 - 150} 140 -50)`} />
    <circle cx={140} cy={40} r={26} fill="#d9c7a0" stroke="#2a1a0e" strokeWidth={5} /><rect x={137} y={14} width={6} height={18} fill="#2a1a0e" transform={`rotate(40 140 40)`} />
    <rect x={-190} y={10} width={260} height={100} rx={10} fill="#2a1a0e" />
    {Array.from({length: 7}).map((_, i) => <rect key={i} x={-176} y={22 + i * 12} width={232} height={5} rx={2} fill="#4a3220" />)}
    <rect x={-170} y={-170} width={8} height={60} fill="#999" transform="rotate(-20 -170 -110)" />
    {on > 0.05 && <Glow x={-60} y={-60} r={240} c="#ffc86b" o={0.25 * on} id={`rg${Math.round(x)}`} />}
  </g>
);

// ---------------- TV screen content ----------------
export type TvMode = 'off' | 'city' | 'jam' | 'store' | 'gas' | 'host' | 'static' | 'flicker';
export const TvScreen: React.FC<{mode: TvMode; t: number; w?: number; h?: number; banner?: number; turn?: number}> = ({mode, t, w = 400, h = 300, banner = 0, turn = 0}) => {
  const fl = Math.sin(t * 31) > 0.3 ? 1 : 0.55;
  return (
    <g>
      <clipPath id={`tvc${w}`}><rect x={0} y={0} width={w} height={h} rx={14} /></clipPath>
      <rect x={0} y={0} width={w} height={h} rx={14} fill="#05070c" />
      <g clipPath={`url(#tvc${w})`}>
        {mode === 'city' && (
          <g>
            <rect width={w} height={h} fill="#27406a" />
            {[0, 1, 2, 3, 4, 5].map((i) => <rect key={i} x={20 + i * 62} y={h - 80 - rnd(i) * 130 - (Math.sin(t + i) * 4)} width={50} height={300} fill="#101a30" />)}
            <rect y={h - 40} width={w} height={40} fill="#1a2234" />
          </g>
        )}
        {mode === 'jam' && (
          <g>
            <rect width={w} height={h} fill="#3a4660" />
            {[0, 1, 2, 3].map((i) => <rect key={i} x={10 + i * 98} y={h - 90} width={86} height={44} rx={10} fill={['#7a2a2a', '#2a4a7a', '#6a5a2a', '#4a4a52'][i]} />)}
            {[0, 1, 2, 3].map((i) => <circle key={i} cx={20 + i * 98} cy={h - 64} r={5} fill="#fff6c8" opacity={0.4 + 0.6 * Math.abs(Math.sin(t * 6 + i))} />)}
          </g>
        )}
        {mode === 'store' && (
          <g>
            <rect width={w} height={h} fill="#cfd8e4" />
            {[0, 1, 2].map((i) => <rect key={i} x={20 + i * 125} y={60} width={100} height={200} fill="#6a7690" />)}
            <rect y={h - 40} width={w} height={40} fill="#9aa5b6" />
          </g>
        )}
        {mode === 'gas' && (
          <g>
            <rect width={w} height={h} fill="#34405a" />
            <rect y={50} width={w} height={34} fill="#c0392b" />
            {[0, 1, 2].map((i) => <rect key={i} x={20 + i * 125} y={h - 90} width={100} height={46} rx={10} fill={['#4a4a52', '#7a2a2a', '#2a4a7a'][i]} />)}
          </g>
        )}
        {mode === 'host' && (
          <g transform={`translate(${Math.sin(t * 25) * 1.5 * (turn > 0 ? 1 : 0)} 0)`}>
            <rect width={w} height={h} fill="#1c2a48" />
            <rect y={h * 0.64} width={w} height={h * 0.36} fill="#0e1424" />
            <g transform={`translate(${w / 2 + turn * 26} ${h * 0.62})`}>
              <rect x={-52} y={-60} width={104} height={80} rx={26} fill="#0a0c12" />
              <circle cx={turn * 12} cy={-92} r={26} fill="#0a0c12" />
              <path d="M-12 -62 L0 -30 L12 -62 Z" fill="#9a9aa4" />
            </g>
            {banner > 0 && (
              <g opacity={banner}>
                <rect x={0} y={h - 60} width={w} height={44} fill="#c0392b" />
                <Tx x={w / 2} y={h - 28} size={24} fill="#fff">ЭКСТРЕННОЕ СООБЩЕНИЕ</Tx>
              </g>
            )}
          </g>
        )}
        {(mode === 'static' || mode === 'flicker') && (
          <g>
            <rect width={w} height={h} fill={mode === 'static' ? '#3a3f4a' : '#202838'} />
            {Array.from({length: 40}).map((_, i) => <rect key={i} x={rnd(i + Math.floor(t * 20)) * w} y={rnd(i + 50 + Math.floor(t * 20)) * h} width={40 + rnd(i) * 120} height={3 + rnd(i + 2) * 8} fill="#fff" opacity={0.5} />)}
          </g>
        )}
        {mode !== 'off' && <rect width={w} height={h} fill="#000" opacity={mode === 'flicker' ? 0.25 + (1 - fl) * 0.5 : 0.12} />}
        {mode !== 'off' && Array.from({length: 20}).map((_, i) => <rect key={i} y={i * (h / 20)} width={w} height={1.5} fill="#000" opacity={0.18} />)}
      </g>
      {mode !== 'off' && <rect width={w} height={h} rx={14} fill="none" stroke="#9fc4ff" strokeWidth={3} opacity={0.25} />}
    </g>
  );
};
export const TvSet: React.FC<{x: number; y: number; s?: number; mode: TvMode; t: number; banner?: number; turn?: number}> = ({x, y, s = 1, mode, t, banner, turn}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-30} y={-30} width={460} height={360} rx={26} fill="#2a2f3a" stroke="#14171e" strokeWidth={6} />
    <g transform="translate(0 0)"><TvScreen mode={mode} t={t} banner={banner} turn={turn} /></g>
    {mode !== 'off' && <Glow x={200} y={150} r={420} c="#9fc4ff" o={0.22} id={`tvg${Math.round(x)}`} />}
    <circle cx={410} cy={330} r={6} fill={mode === 'off' ? '#3a1a1a' : '#3bff7a'} />
    <rect x={150} y={330} width={100} height={26} fill="#14171e" />
  </g>
);

// ---------------- phone ----------------
export type PhoneMode = 'moscow' | 'alert' | 'loading' | 'msg' | 'nosig' | 'off' | 'blank';
export const Phone: React.FC<{x: number; y: number; s?: number; mode: PhoneMode; t: number; bars?: number; rot?: number}> = ({x, y, s = 1, mode, t, bars = 4, rot = 0}) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <rect x={-190} y={-380} width={380} height={760} rx={52} fill="#0a0c12" stroke="#2a2f3a" strokeWidth={8} />
    <clipPath id="phc"><rect x={-172} y={-356} width={344} height={712} rx={38} /></clipPath>
    <g clipPath="url(#phc)">
      <rect x={-172} y={-356} width={344} height={712} fill="#0e1424" />
      {/* status */}
      <Tx x={-150} y={-322} anchor="start" size={20} fill="#9fb4d0">12:41</Tx>
      {[0, 1, 2, 3].map((i) => <rect key={i} x={110 + i * 12} y={-338 + (3 - i) * -4 + 12} width={8} height={8 + i * 5} fill={i < bars ? '#fff' : '#3a4560'} transform="translate(0 -4)" />)}
      {mode === 'moscow' && (
        <g>
          <rect x={-172} y={-300} width={344} height={460} fill="#1c2a48" />
          {[0, 1, 2, 3, 4].map((i) => <rect key={i} x={-160 + i * 66} y={-80 - rnd(i) * 150} width={54} height={300} fill="#0e1830" />)}
          {[0, 1, 2, 3, 4].map((i) => Array.from({length: 4}).map((_, k) => <rect key={`${i}${k}`} x={-148 + i * 66} y={-40 - rnd(i) * 150 + k * 36} width={10} height={14} fill="#ffd27a" opacity={0.8} />))}
          <rect x={-172} y={60} width={344} height={100} fill="#222a3c" />
          {[0, 1, 2, 3, 4, 5].map((i) => <g key={i}><rect x={-166 + i * 58} y={96} width={48} height={26} rx={7} fill={['#7a2a2a', '#2a4a7a', '#6a5a2a', '#4a4a52'][i % 4]} /><circle cx={-122 + i * 58} cy={112} r={4} fill="#fff6c8" opacity={0.3 + 0.7 * Math.abs(Math.sin(t * 7 + i))} /></g>)}
          <rect x={-150} y={190} width={300} height={16} rx={8} fill="#c0392b" />
          <Tx x={-150} y={240} anchor="start" size={26} fill="#e8eef7">ПРЯМОЙ ЭФИР · МОСКВА</Tx>
          <rect x={-150} y={262} width={140} height={10} rx={5} fill="#3a4560" />
        </g>
      )}
      {mode === 'alert' && (
        <g>
          <rect x={-172} y={-356} width={344} height={712} fill="#2a0a0a" />
          <rect x={-172} y={-120} width={344} height={44} fill="#c0392b" opacity={0.6 + 0.4 * Math.sin(t * 14) ** 2} />
          <Tx x={0} y={-90} size={30} fill="#fff">ВНИМАНИЕ!</Tx>
          <rect x={-150} y={-50} width={300} height={170} rx={18} fill="#14181e" stroke="#c0392b" strokeWidth={4} />
          <Tx x={0} y={0} size={22} fill="#fff">Ожидается резкое</Tx>
          <Tx x={0} y={32} size={22} fill="#fff">понижение температуры.</Tx>
          <Tx x={0} y={70} size={20} fill="#ffb3a8">Оставайтесь дома.</Tx>
        </g>
      )}
      {mode === 'loading' && (
        <g>
          <rect x={-172} y={-300} width={344} height={60} fill="#1c2a48" />
          <Tx x={0} y={-262} size={24} fill="#cfe0ff">Новости</Tx>
          <g transform="translate(0 0)">
            <circle r={44} fill="none" stroke="#3a4560" strokeWidth={8} />
            <path d="M0 -44 A44 44 0 0 1 44 0" fill="none" stroke="#9fc4ff" strokeWidth={8} strokeLinecap="round" transform={`rotate(${t * 360})`} />
          </g>
          {[0, 1, 2].map((i) => <rect key={i} x={-150} y={100 + i * 60} width={300 - i * 70} height={16} rx={8} fill="#1c2638" />)}
        </g>
      )}
      {mode === 'msg' && (
        <g>
          <rect x={-172} y={-300} width={344} height={60} fill="#1c2a48" />
          <Tx x={0} y={-262} size={24} fill="#cfe0ff">Новости</Tx>
          <rect x={-150} y={-190} width={300} height={260} rx={18} fill="#14181e" stroke="#ffb02a" strokeWidth={4} />
          <Tx x={0} y={-140} size={24} fill="#ffb02a">!</Tx>
          <Tx x={0} y={-96} size={22} fill="#fff">Массовые отключения</Tx>
          <Tx x={0} y={-64} size={22} fill="#fff">электроэнергии</Tx>
          <Tx x={0} y={-32} size={22} fill="#fff">по всему миру</Tx>
        </g>
      )}
      {mode === 'nosig' && (
        <g>
          <Tx x={0} y={-60} size={34} fill="#ff6a5a">Нет сети</Tx>
          <g transform="translate(0 40)" stroke="#9fb4d0" strokeWidth={8} strokeLinecap="round" fill="none">
            {[0, 1, 2, 3].map((i) => <line key={i} x1={-60 + i * 30} y1={50} x2={-60 + i * 30} y2={50 - 20 - i * 18} />)}
            <line x1={-80} y1={70} x2={80} y2={-70} stroke="#ff4a3a" />
          </g>
        </g>
      )}
      {mode === 'off' && <rect x={-172} y={-356} width={344} height={712} fill="#05060a" />}
    </g>
  </g>
);

// ---------------- thermometers & clock ----------------
export const OutThermo: React.FC<{x: number; y: number; s?: number; value: number; red?: number; t: number}> = ({x, y, s = 1, value, red = 0, t}) => {
  const lvl = clamp((value + 70) / 80);
  const col = mixc('#e8f0fb', '#ff4a4a', red);
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x={-110} y={-330} width={220} height={660} rx={40} fill="#2a2f3a" stroke="#14171e" strokeWidth={8} />
      <rect x={-96} y={-316} width={192} height={120} rx={18} fill="#05070c" />
      <Tx x={0} y={-226} size={74} fill={col}>{`${Math.round(value) < 0 ? '−' : '+'}${Math.abs(Math.round(value))}`}</Tx>
      <rect x={-18} y={-170} width={36} height={400} rx={18} fill="#e8f0fb" />
      <rect x={-12} y={230 - lvl * 390} width={24} height={lvl * 390 + 4} rx={12} fill={mixc('#ff6a4a', '#ff2a2a', red)} />
      <circle cx={0} cy={250} r={34} fill={mixc('#ff6a4a', '#ff2a2a', red)} />
      {Array.from({length: 15}).map((_, i) => <g key={i}><rect x={28} y={-150 + i * 26} width={i % 5 === 0 ? 40 : 22} height={3} fill="#c9d6e8" /></g>)}
      {[-60, -40, -20, 0, 20].map((v, i) => <Tx key={v} x={-44} y={230 - ((v + 70) / 80) * 390 + 8} size={20} fill="#9fb4d0" anchor="end">{v}</Tx>)}
    </g>
  );
};
export const HomeThermo: React.FC<{x: number; y: number; s?: number}> = ({x, y, s = 1}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-60} y={-110} width={120} height={220} rx={24} fill="#d9c7a0" stroke="#5a3a24" strokeWidth={6} />
    <rect x={-46} y={-96} width={92} height={56} rx={10} fill="#05070c" />
    <Tx x={0} y={-52} size={40} fill="#ff9a2a">+18</Tx>
    <rect x={-8} y={-30} width={16} height={110} rx={8} fill="#fff" />
    <rect x={-5} y={10} width={10} height={70} rx={5} fill="#ff6a4a" />
    <circle cx={0} cy={84} r={16} fill="#ff6a4a" />
  </g>
);
export const ClockArt: React.FC<{x: number; y: number; s?: number; h: number; m: number; t: number}> = ({x, y, s = 1, h, m, t}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <circle r={220} fill="#e8e0cc" stroke="#3a2a1a" strokeWidth={14} />
    {Array.from({length: 12}).map((_, i) => <rect key={i} x={-4} y={-196} width={8} height={30} fill="#2a1a0e" transform={`rotate(${i * 30})`} />)}
    {[12, 3, 6, 9].map((n, i) => <Tx key={n} x={Math.sin((i * Math.PI) / 2) * 150} y={-Math.cos((i * Math.PI) / 2) * 150 + 16} size={44} fill="#2a1a0e">{n}</Tx>)}
    <rect x={-7} y={-120} width={14} height={120} rx={7} fill="#2a1a0e" transform={`rotate(${(h % 12) * 30 + m * 0.5})`} />
    <rect x={-5} y={-170} width={10} height={170} rx={5} fill="#2a1a0e" transform={`rotate(${m * 6})`} />
    <circle r={12} fill="#c0392b" />
  </g>
);
