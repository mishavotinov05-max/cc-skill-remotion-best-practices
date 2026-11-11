import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame} from 'remotion';
import subsF from './subs_flood.json';
import {Shot, ramp, shake} from './Everest';
import {clamp} from './util';
import {Bedroom, Boat, Container, Countdown, Cracks, Current, EdgeIntro, HouseSection, Jump, P, PhoneCall, Approach, S1, S2, S3, S4, SafeZone, Shouts, Slip, WindowView, Xray, Roof} from './FloodScenes';
import {FloodSub} from './FloodSub';

export const FPSF = 30;
export const DURATIONF = 115.15;
const CUT = 114.95;

export const Flood: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPSF;
  const black = t >= CUT ? 1 : 0;
  const rumbleSk = t > 12.9 && t < 14.4 ? shake(t, 12 * (1 - P(t, 12.9, 14.4))) : t > 28.6 && t < 30 ? shake(t, 6) : t > 87.6 && t < 88.6 ? shake(t, 9 * (1 - P(t, 87.6, 88.6))) : {x: 0, y: 0};
  const rain = ramp([[0, 0.12], [30, 0.14], [110, 0.14], [CUT - 0.1, 0.14], [CUT, 0]]);
  const drone = ramp([[0, 0.1], [11.8, 0.1], [11.9, 0.03], [28, 0.06], [28.6, 0.14], [60, 0.1], [100, 0.12], [105.9, 0.14], [CUT - 0.2, 0.2], [CUT, 0]]);
  const water = ramp([[0, 0.04], [20, 0.06], [43, 0.06], [43.6, 0.14], [47.2, 0.14], [47.5, 0.06], [100, 0.08], [CUT - 0.2, 0.1], [CUT, 0]]);
  const wind = ramp([[0, 0.06], [90, 0.07], [105, 0.11], [CUT, 0]]);
  const S = (a: number, d: number, src: string, v: number | ((f: number) => number)) => (
    <Sequence key={`${src}${a}`} from={Math.round(a * FPSF)} durationInFrames={Math.round(d * FPSF)}><Audio src={staticFile(`sfx/${src}.mp3`)} volume={v} /></Sequence>
  );
  return (
    <AbsoluteFill style={{backgroundColor: '#000'}}>
      <Audio src={staticFile('voice7.mp3')} volume={1} />
      <Audio src={staticFile('sfx/rain.mp3')} volume={rain} />
      <Audio src={staticFile('sfx/drone.mp3')} volume={drone} />
      <Audio src={staticFile('sfx/water.mp3')} volume={water} />
      <Audio src={staticFile('sfx/wind.mp3')} volume={wind} />
      {S(12.85, 2.2, 'rumble', ramp([[0, 0], [0.2, 0.3], [1.4, 0.2], [2.2, 0]]))}
      {S(12.85, 1.0, 'thud', 0.5)}
      {S(28.6, 3.0, 'rumble', ramp([[0, 0], [0.3, 0.2], [2.2, 0.15], [3.0, 0]]))}
      {S(28.6, 1.2, 'alarm', ramp([[0, 0], [0.05, 0.12], [0.9, 0.12], [1.2, 0]]))}
      {S(47.4, 1.0, 'splash', 0.25)}
      {S(53.9, 1.0, 'beep', 0.22)}
      {S(54.8, 1.0, 'beep', 0.22)}
      {S(55.5, 1.0, 'beep', 0.22)}
      {S(71.0, 1.0, 'splash', 0.22)}
      {S(87.64, 0.8, 'crack', 0.4)}
      {S(87.7, 1.0, 'thud', 0.4)}
      {S(90.7, 2.0, 'creak', 0.18)}
      {S(96.3, 1.0, 'beep', 0.2)}
      {S(97.5, 1.0, 'beep', 0.2)}
      {S(106.0, 8.9, 'rumble', ramp([[0, 0], [3, 0.1], [7.5, 0.28], [8.9, 0.34]]))}
      {S(111.7, 0.6, 'tick', 0.2)}
      {S(112.7, 0.6, 'tick', 0.2)}
      {S(113.7, 0.6, 'tick', 0.2)}

      <Shot a={0} b={3.89} t={t}><S1 t={t} /></Shot>
      <Shot a={3.89} b={8.3} t={t}><S2 t={t} /></Shot>
      <Shot a={8.3} b={11.88} t={t}><S3 t={t} /></Shot>
      <Shot a={11.88} b={12.82} t={t}><S4 t={t} /></Shot>
      <Shot a={12.82} b={15.41} t={t}><div style={{transform: `translate(${rumbleSk.x}px, ${rumbleSk.y}px)`, width: '100%', height: '100%'}}><Bedroom t={t} /></div></Shot>
      <Shot a={15.41} b={19.46} t={t}><WindowView t={t} /></Shot>
      <Shot a={19.46} b={21.95} t={t}><HouseSection t={t} water={0.1 + 0.3 * P(t, 19.46, 21.95)} hero={{x: 360, y: 940}} place="1 ЭТАЖ" tag="ПРЕДСТАВЬ" chips={[{c: 'cyan', text: 'ВОДА В ДОМЕ'}]} /></Shot>
      <Shot a={21.95} b={24.72} t={t}><HouseSection t={t} water={0.4 + 0.1 * P(t, 21.95, 24.72)} hero={{x: 360 + 160 * P(t, 21.95, 24.72), y: 940 - 330 * P(t, 21.95, 24.72)}} place="ЛЕСТНИЦА" tag="ПРЕДСТАВЬ" chips={[{c: 'green', text: 'ТЕЛЕФОН — С СОБОЙ'}]} phone /></Shot>
      <Shot a={24.72} b={28.61} t={t}><Roof t={t} level={0.35 + 0.25 * P(t, 24.72, 28.61)} hero={{x: 440}} tag="ПРЕДСТАВЬ" chips={[{c: 'cyan', text: '1 ЭТАЖ ПОД ВОДОЙ'}]} /></Shot>
      <Shot a={28.61} b={32.24} t={t}><div style={{transform: `translate(${rumbleSk.x}px, ${rumbleSk.y}px)`, width: '100%', height: '100%'}}><Roof t={t} cam={{cx: 440, cy: 1000, s: 1.3}} hero={{x: 440}} tag="ОПАСНОСТЬ" chips={[{c: 'red', text: 'САМОЕ ОПАСНОЕ'}]} hudOverlay={<rect width={1080} height={1920} fill="#ff3b3b" opacity={t < 29.0 ? 0.3 : 0} />} /></div></Shot>
      <Shot a={32.24} b={36.51} t={t}><Roof t={t} cam={{cx: 440, cy: 1100, s: 1.15}} hero={{x: 420}} place="КРЫША" tag="ОШИБКА 1: ПЛЫТЬ" chips={[{c: 'red', text: 'УПЛЫТЬ САМОМУ'}]} /></Shot>
      <Shot a={36.51} b={43.57} t={t}><Boat t={t} /></Shot>
      <Shot a={43.57} b={47.36} t={t}><Xray t={t} /></Shot>
      <Shot a={47.36} b={50.49} t={t}><Current t={t} /></Shot>
      <Shot a={50.49} b={53.58} t={t}><Roof t={t} cam={{cx: 540, cy: 1060, s: 1.1}} hero={{x: 560}} place="КРЫША" tag="ПРАВИЛЬНО" chips={[{c: 'green', text: 'УСТОЙЧИВАЯ ЧАСТЬ'}]} /></Shot>
      <Shot a={53.58} b={56.78} t={t}><PhoneCall t={t} a={53.58} b={56.78} label="112" sub="СПАСАТЕЛИ" tag="ПРАВИЛЬНО" place="ЗВОНОК" /></Shot>
      <Shot a={56.78} b={60.94} t={t}><EdgeIntro t={t} /></Shot>
      <Shot a={60.94} b={65.88} t={t}><Shouts t={t} /></Shot>
      <Shot a={65.88} b={70.44} t={t}><Approach t={t} /></Shot>
      <Shot a={70.44} b={74.8} t={t}><Slip t={t} /></Shot>
      <Shot a={74.8} b={80.7} t={t}><SafeZone t={t} /></Shot>
      <Shot a={80.7} b={85.57} t={t}><HouseSection t={t} water={0.45} hero={{x: 540, y: 600}} place="ДОМ" tag="ОШИБКА 3: ДОМ" chips={[{c: 'yellow', text: 'ДОМ ПОД НАГРУЗКОЙ'}]} /></Shot>
      <Shot a={85.57} b={92.67} t={t}><Cracks t={t} /></Shot>
      <Shot a={92.67} b={96.06} t={t}><Jump t={t} /></Shot>
      <Shot a={96.06} b={101.44} t={t}><PhoneCall t={t} a={96.06} b={101.44} label="112" sub="ДОМ ПОВРЕЖДЁН" tag="ПРАВИЛЬНО" place="ЗВОНОК" /></Shot>
      <Shot a={101.44} b={105.98} t={t}><Roof t={t} cam={{cx: 540, cy: 1060, s: 1.08}} hero={{x: 600}} place="КРЫША" tag="ЖДЁШЬ ПОМОЩЬ" chips={[{c: 'green', text: 'ГЕОПОЗИЦИЯ ОТПРАВЛЕНА'}]} /></Shot>
      <Shot a={105.98} b={111.61} t={t}><Container t={t} /></Shot>
      <Shot a={111.61} b={CUT + 0.2} t={t}><Countdown t={t} /></Shot>

      <FloodSub t={t} subs={subsF as [number, number, string][]} />
      <AbsoluteFill style={{background: '#000', opacity: black}} />
    </AbsoluteFill>
  );
};
