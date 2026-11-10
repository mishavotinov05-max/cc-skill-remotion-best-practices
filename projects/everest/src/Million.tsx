import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame} from 'remotion';
import subsM from './subs_million2.json';
import {Shot, ramp, shake} from './Everest';
import {PopSub} from './PopSub';
import {clamp, ease} from './util';
import {AgreePress, BarrelStreet, Calendar6, CallMax, CityDrive, Classroom, Corridor, Dealership, Diary, EmptyRoom, Kitchen, Mansion, MoneyIn, OfferPhone, P, PhoneBalance, Ringing, RewindCal, SellerCounter, Sofa, TermsMax, TimerBig, TopUI, Vanish, FailStamp} from './MillionArt';

export const FPSM = 30;
export const DURATIONM = 74.0;
const VOICE_END = 71.0;
const FINAL_BLACK = 73.8;
const HOT = new Set(['миллиард', 'молчания', 'слово', 'лишусь', 'согласился', 'деньги', 'двойку', 'машину', 'особняк', 'паспорт', 'шесть', 'минуты', 'мама', 'сынок', 'любишь', '«да».', 'дорогое', 'слово,']);

const fmtMoney = (v: number) => '$' + Math.round(v).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
const pad = (n: number) => String(Math.floor(n)).padStart(2, '0');
const hms = (sec: number) => `${pad(sec / 3600)}:${pad((sec % 3600) / 60)}:${pad(sec % 60)}`;
const remaining = (t: number) => Math.max(0, 300 - (t - 52.72) * 14);

const uiState = (t: number) => {
  let left = '7 ДНЕЙ';
  let sub: string | undefined;
  let right = fmtMoney(1000000000);
  if (t >= 46.02 && t < 47.55) left = `${Math.max(1, 7 - Math.floor(P(t, 46.02, 47.3) * 6))} ${Math.max(1, 7 - Math.floor(P(t, 46.02, 47.3) * 6)) === 1 ? 'ДЕНЬ' : 'ДНЕЙ'}`;
  else if (t >= 47.55 && t < 52.72) {
    left = hms(86400 - (86400 - 300) * ease(P(t, 47.55, 52.72)));
    sub = 'ЧАСЫ : МИНУТЫ : СЕКУНДЫ';
  } else if (t >= 52.72) {
    const sec = t < 63.84 ? remaining(t) : remaining(63.84);
    left = hms(sec);
    sub = 'ЧАСЫ : МИНУТЫ : СЕКУНДЫ';
  }
  const fail = t >= 63.9 ? 1 : 0;
  if (t >= 64.3) right = '$0';
  return {left, sub, right, fail};
};

export const Million: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPSM;
  const ui = uiState(t);
  const sk = t >= 31.4 && t < 31.9 ? shake(t, 14) : {x: 0, y: 0};
  const black = t >= FINAL_BLACK ? 1 : 0;
  const zeroOnly = t >= VOICE_END - 0.2;
  const vanish = zeroOnly ? 1 : 0;

  const ticks: number[] = [];
  for (let c = 52.8; c < 63.8; c += 0.5) ticks.push(Math.round(c * 10) / 10);

  return (
    <AbsoluteFill style={{backgroundColor: '#000'}}>
      <Audio src={staticFile('voice6.mp3')} volume={1} />
      <Sequence from={Math.round(9.22 * FPSM)} durationInFrames={40}><Audio src={staticFile('sfx/kaching.mp3')} volume={0.28} /></Sequence>
      <Sequence from={Math.round(9.45 * FPSM)} durationInFrames={Math.round(2.0 * FPSM)}><Audio src={staticFile('sfx/ping.mp3')} volume={0.08} /></Sequence>
      <Sequence from={Math.round(18.55 * FPSM)} durationInFrames={40}><Audio src={staticFile('sfx/bell.mp3')} volume={0.18} /></Sequence>
      <Sequence from={Math.round(25.6 * FPSM)} durationInFrames={Math.round(3.0 * FPSM)}><Audio src={staticFile('sfx/scratch.mp3')} volume={ramp([[0, 0], [0.2, 0.1], [2.5, 0.1], [3.0, 0]])} /></Sequence>
      <Sequence from={Math.round(31.5 * FPSM)} durationInFrames={24}><Audio src={staticFile('sfx/err.mp3')} volume={0.25} /></Sequence>
      <Sequence from={Math.round(31.9 * FPSM)} durationInFrames={30}><Audio src={staticFile('sfx/thud.mp3')} volume={0.4} /></Sequence>
      <Sequence from={Math.round(36.0 * FPSM)} durationInFrames={40}><Audio src={staticFile('sfx/kaching.mp3')} volume={0.22} /></Sequence>
      <Sequence from={Math.round(40.55 * FPSM)} durationInFrames={26}><Audio src={staticFile('sfx/clank.mp3')} volume={0.14} /></Sequence>
      <Sequence from={Math.round(41.62 * FPSM)} durationInFrames={Math.round(1.8 * FPSM)}><Audio src={staticFile('sfx/engine.mp3')} volume={ramp([[0, 0], [0.3, 0.1], [1.4, 0.1], [1.8, 0]])} /></Sequence>
      <Sequence from={Math.round(43.9 * FPSM)} durationInFrames={50}><Audio src={staticFile('sfx/creak.mp3')} volume={0.12} /></Sequence>
      {ticks.map((c) => (
        <Sequence key={c} from={Math.round(c * FPSM)} durationInFrames={10}><Audio src={staticFile('sfx/tick.mp3')} volume={0.1} /></Sequence>
      ))}
      <Sequence from={Math.round(55.85 * FPSM)} durationInFrames={Math.round(2.3 * FPSM)}><Audio src={staticFile('sfx/vib.mp3')} volume={ramp([[0, 0], [0.1, 0.22], [2.0, 0.22], [2.3, 0]])} /></Sequence>
      <Sequence from={Math.round(63.86 * FPSM)} durationInFrames={24}><Audio src={staticFile('sfx/err.mp3')} volume={0.32} /></Sequence>
      <Sequence from={Math.round(63.86 * FPSM)} durationInFrames={30}><Audio src={staticFile('sfx/thud.mp3')} volume={0.4} /></Sequence>
      <Sequence from={Math.round(65.4 * FPSM)} durationInFrames={36}><Audio src={staticFile('sfx/poof.mp3')} volume={ramp([[0, 0.3], [0.8, 0]])} /></Sequence>
      <Sequence from={Math.round(66.6 * FPSM)} durationInFrames={36}><Audio src={staticFile('sfx/poof.mp3')} volume={ramp([[0, 0.3], [0.8, 0]])} /></Sequence>

      <Shot a={0} b={3.64} t={t}><OfferPhone t={t} /></Shot>
      <Shot a={3.64} b={8.04} t={t}><TermsMax t={t} /></Shot>
      <Shot a={8.04} b={9.22} t={t}><AgreePress t={t} /></Shot>
      <Shot a={9.22} b={12.16} t={t}><MoneyIn t={t} /></Shot>
      <Shot a={12.16} b={14.94} t={t}><Kitchen t={t} a={12.16} b={14.94} pass={false} /></Shot>
      <Shot a={14.94} b={18.58} t={t}><Kitchen t={t} a={14.94} b={18.17} pass /></Shot>
      <Shot a={18.58} b={21.44} t={t}><Corridor t={t} mode="meet" /></Shot>
      <Shot a={21.44} b={22.87} t={t}><Corridor t={t} mode="nod" /></Shot>
      <Shot a={22.87} b={25.45} t={t}><Classroom t={t} mode="call" /></Shot>
      <Shot a={25.45} b={30.96} t={t}><Classroom t={t} mode="board" /></Shot>
      <Shot a={30.96} b={33.15} t={t}><div style={{transform: `translate(${sk.x}px, ${sk.y}px)`, width: '100%', height: '100%'}}><Diary t={t} /></div></Shot>
      <Shot a={33.15} b={37.71} t={t}><Dealership t={t} /></Shot>
      <Shot a={37.71} b={39.9} t={t}><SellerCounter t={t} mode="talk" /></Shot>
      <Shot a={39.9} b={41.62} t={t}><SellerCounter t={t} mode="passport" /></Shot>
      <Shot a={41.62} b={43.4} t={t}><CityDrive t={t} /></Shot>
      <Shot a={43.4} b={46.02} t={t}><Mansion t={t} /></Shot>
      <Shot a={46.02} b={47.55} t={t}><Calendar6 t={t} /></Shot>
      <Shot a={47.55} b={52.72} t={t}><Sofa t={t} /></Shot>
      <Shot a={52.72} b={55.82} t={t}><TimerBig t={t} /></Shot>
      <Shot a={55.82} b={58.19} t={t}><Ringing t={t} /></Shot>
      <Shot a={58.19} b={61.35} t={t}><CallMax t={t} think={false} /></Shot>
      <Shot a={61.35} b={63.84} t={t}><CallMax t={t} think /></Shot>
      <Shot a={63.84} b={64.74} t={t}><FailStamp t={t} /></Shot>
      <Shot a={64.74} b={70.8} t={t}><Vanish t={t} /></Shot>
      <Shot a={70.8} b={FINAL_BLACK} t={t}><BarrelStreet t={t} /></Shot>

      <PopSub t={t} subs={subsM as [number, number, string][]} />
      <TopUI t={t} left={ui.left} leftSub={ui.sub} right={ui.right} fail={ui.fail} vanish={vanish} zeroOnly={zeroOnly} />
      <AbsoluteFill style={{background: '#000', opacity: black}} />
    </AbsoluteFill>
  );
};
