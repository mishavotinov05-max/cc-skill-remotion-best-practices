import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame} from 'remotion';
import subsB from './subs_bunker.json';
import {Overlay, Shot, ramp, shake} from './Everest';
import {StyledSub} from './Subs';
import {Key, clamp} from './util';
import {Concrete, CarDepart, CityWide, Crates, ExcavatorsMed, Highway, LoadCar, MaxExit, MaxPit, Notebook, Phone, PitTop, SporeWall, StreetMax, SurfaceDusk, TapGlass, TimerCard, TrucksArrive, Underground, UG, Village, Warehouse, BigText} from './BunkerArt';

export const FPSB = 30;
export const DURATIONB = 91.1;
const CUT = 90.95;
const HOTB = new Set(['споры', 'четыре', 'бункер', 'котлован', 'бетонное', 'комнаты', 'сорока', 'тонн', 'грузовиков', 'водой', 'источник', 'трубы', 'насосы', 'фильтры', 'вентиляционные', 'генераторы', 'телефон', 'сообщение', 'заражения', 'апокалипсиса', 'дня', 'экскаваторов']);
const P = (t: number, a: number, b: number) => clamp((t - a) / (b - a));

const ugKeys: Key[] = [
  [30.6, 540, 950, 1.15], [34.47, 540, 950, 1.3],
  [49.38, 540, 700, 1.0], [50.9, 540, 1800, 1.1], [51.18, 540, 1950, 1.3], [54.14, 600, 1950, 1.5],
  [54.15, 620, 1850, 1.6], [56.8, 600, 1700, 1.6], [58.0, 700, 1560, 1.6], [59.43, 700, 1560, 1.6],
  [62.0, 540, 520, 1.0], [63.0, 200, 430, 2.2], [64.5, 880, 430, 2.2], [65.0, 880, 430, 2.2],
  [65.01, 260, 1500, 1.9], [66.5, 260, 1500, 1.9], [68.0, 560, 1100, 1.0], [68.98, 560, 1000, 1.0],
  [68.99, 215, 950, 2.1], [70.6, 215, 950, 2.1], [71.0, 445, 950, 2.1], [72.3, 445, 950, 2.1], [72.6, 675, 950, 2.1], [73.8, 675, 950, 2.1], [74.0, 895, 950, 2.1], [75.52, 895, 950, 2.1],
];

const ugAt = (t: number): UG => ({
  walls: P(t, 30.6, 32.0), parts: P(t, 32.9, 34.1), water: P(t, 51.18, 54.1), pipes: P(t, 54.3, 55.5), pump: P(t, 55.5, 56.4), filters: P(t, 56.8, 57.6), tank: P(t, 58.0, 59.4),
  vent: P(t, 62.0, 62.8), gen: P(t, 65.2, 65.9), lamps: P(t, 66.6, 68.5),
  rooms: [P(t, 69.0, 69.6), P(t, 70.7, 71.3), P(t, 72.4, 73.0), P(t, 73.9, 74.5)],
});

export const Bunker: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPSB;
  const ug = ugAt(t);

  let black = t >= CUT ? 1 : 0;
  const sk = t >= 10.95 && t < 11.3 ? shake(t, 10 * (1 - (t - 10.95) / 0.35)) : {x: 0, y: 0};

  const drone = ramp([[0, 0.14], [30, 0.2], [60, 0.24], [84.45, 0.26], [84.6, 0], [90.0, 0], [CUT, 0]]);
  const wind = ramp([[0, 0.08], [8.4, 0.06], [12, 0.05], [18, 0.07], [30, 0.04], [75, 0.05], [79, 0.07], [84.5, 0.03], [CUT - 0.1, 0.0]]);
  const engine = ramp([[11.0, 0], [11.4, 0.13], [17.5, 0.13], [18.4, 0]]);
  const diesel = ramp([[19.8, 0], [20.4, 0.12], [30.0, 0.13], [34.0, 0.1], [34.6, 0]]);
  const trucks = ramp([[42.3, 0], [42.8, 0.14], [45.2, 0.12], [46.0, 0]]);
  const water1 = ramp([[54.2, 0], [54.8, 0.12], [59.2, 0.12], [59.5, 0]]);
  const water2 = ramp([[59.5, 0], [59.7, 0.1], [61.2, 0.1], [61.6, 0]]);
  const fan = ramp([[62.0, 0], [62.5, 0.12], [65.0, 0.12], [65.3, 0]]);
  const gen = ramp([[65.3, 0], [65.9, 0.12], [69.0, 0.1], [71.0, 0.04], [75.0, 0.03], [75.6, 0]]);
  const clanks = [24.6, 25.4, 26.1, 26.9, 27.5, 31.0];

  return (
    <AbsoluteFill style={{backgroundColor: '#000'}}>
      <Audio src={staticFile('voice4.mp3')} volume={1} />
      <Audio src={staticFile('sfx/drone.mp3')} volume={drone} />
      <Audio src={staticFile('sfx/wind.mp3')} volume={wind} />
      <Sequence from={Math.round(11.0 * FPSB)} durationInFrames={Math.round(7.5 * FPSB)}><Audio src={staticFile('sfx/engine.mp3')} volume={ramp([[0, 0], [0.4, 0.13], [6.5, 0.13], [7.4, 0]])} /></Sequence>
      <Sequence from={Math.round(19.8 * FPSB)} durationInFrames={Math.round(7.9 * FPSB)}><Audio src={staticFile('sfx/diesel.mp3')} volume={ramp([[0, 0], [0.6, 0.12], [7.3, 0.12], [7.9, 0]])} /></Sequence>
      <Sequence from={Math.round(27.7 * FPSB)} durationInFrames={Math.round(7.0 * FPSB)}><Audio src={staticFile('sfx/diesel.mp3')} volume={ramp([[0, 0.12], [2.2, 0.12], [6.4, 0.09], [7.0, 0]])} /></Sequence>
      <Sequence from={Math.round(42.3 * FPSB)} durationInFrames={Math.round(3.7 * FPSB)}><Audio src={staticFile('sfx/diesel.mp3')} volume={ramp([[0, 0], [0.5, 0.14], [2.9, 0.12], [3.7, 0]])} /></Sequence>
      {clanks.map((c) => (
        <Sequence key={c} from={Math.round(c * FPSB)} durationInFrames={26}><Audio src={staticFile('sfx/clank.mp3')} volume={0.16} /></Sequence>
      ))}
      <Sequence from={Math.round(28.8 * FPSB)} durationInFrames={Math.round(2.0 * FPSB)}><Audio src={staticFile('sfx/pour.mp3')} volume={ramp([[0, 0], [0.2, 0.16], [1.5, 0.16], [2.0, 0]])} /></Sequence>
      <Sequence from={Math.round(7.15 * FPSB)} durationInFrames={30}><Audio src={staticFile('sfx/thud.mp3')} volume={0.5} /></Sequence>
      {[8.8, 9.4, 10.0, 10.5].map((c) => (
        <Sequence key={c} from={Math.round(c * FPSB)} durationInFrames={24}><Audio src={staticFile('sfx/thud.mp3')} volume={0.22} /></Sequence>
      ))}
      <Sequence from={Math.round(10.95 * FPSB)} durationInFrames={30}><Audio src={staticFile('sfx/thud.mp3')} volume={0.45} /></Sequence>
      <Sequence from={Math.round(44.9 * FPSB)} durationInFrames={Math.round(2.4 * FPSB)}><Audio src={staticFile('sfx/crunch.mp3')} volume={0.08} /></Sequence>
      {[45.3, 45.9, 46.5].map((c) => (
        <Sequence key={c} from={Math.round(c * FPSB)} durationInFrames={24}><Audio src={staticFile('sfx/thud.mp3')} volume={0.2} /></Sequence>
      ))}
      <Sequence from={Math.round(54.2 * FPSB)} durationInFrames={Math.round(5.4 * FPSB)}><Audio src={staticFile('sfx/water.mp3')} volume={ramp([[0, 0], [0.6, 0.12], [4.9, 0.12], [5.3, 0]])} /></Sequence>
      <Sequence from={Math.round(59.5 * FPSB)} durationInFrames={Math.round(2.2 * FPSB)}><Audio src={staticFile('sfx/water.mp3')} volume={ramp([[0, 0], [0.2, 0.1], [1.7, 0.1], [2.1, 0]])} /></Sequence>
      <Sequence from={Math.round(55.5 * FPSB)} durationInFrames={Math.round(4.0 * FPSB)}><Audio src={staticFile('sfx/gen.mp3')} volume={ramp([[0, 0], [0.5, 0.1], [3.4, 0.1], [4.0, 0]])} /></Sequence>
      <Sequence from={Math.round(62.0 * FPSB)} durationInFrames={Math.round(3.3 * FPSB)}><Audio src={staticFile('sfx/fan.mp3')} volume={ramp([[0, 0], [0.5, 0.12], [2.8, 0.12], [3.3, 0]])} /></Sequence>
      <Sequence from={Math.round(65.3 * FPSB)} durationInFrames={Math.round(7.2 * FPSB)}><Audio src={staticFile('sfx/gen.mp3')} volume={ramp([[0, 0], [0.6, 0.13], [3.7, 0.11], [6.0, 0.04], [7.2, 0]])} /></Sequence>
      {[66.6, 67.2, 67.8, 68.4].map((c) => (
        <Sequence key={c} from={Math.round(c * FPSB)} durationInFrames={60}><Audio src={staticFile('sfx/ping.mp3')} volume={0.05} /></Sequence>
      ))}
      <Sequence from={Math.round(82.0 * FPSB)} durationInFrames={20}><Audio src={staticFile('sfx/beep.mp3')} volume={0.28} /></Sequence>
      <Sequence from={Math.round(83.45 * FPSB)} durationInFrames={20}><Audio src={staticFile('sfx/beep.mp3')} volume={0.42} /></Sequence>
      <Sequence from={Math.round(88.3 * FPSB)} durationInFrames={20}><Audio src={staticFile('sfx/beep.mp3')} volume={0.42} /></Sequence>
      <Sequence from={Math.round(90.1 * FPSB)} durationInFrames={Math.round((CUT - 90.1) * FPSB)}><Audio src={staticFile('sfx/alarm.mp3')} volume={0.4} /></Sequence>

      <Shot a={0} b={3.07} t={t}><CityWide t={t} p={P(t, 0, 3.07)} /></Shot>
      <Shot a={3.07} b={5.21} t={t}><SporeWall t={t} p={P(t, 3.07, 5.21)} /></Shot>
      <Shot a={5.21} b={7.15} t={t}><StreetMax t={t} /></Shot>
      <Shot a={7.15} b={8.41} t={t}><TimerCard t={t} /></Shot>
      <Shot a={8.41} b={11.2} t={t}><div style={{transform: `translate(${sk.x}px, ${sk.y}px)`, width: '100%', height: '100%'}}><LoadCar t={t} /></div></Shot>
      <Shot a={11.2} b={12.53} t={t}><CarDepart t={t} /></Shot>
      <Shot a={12.53} b={18.19} t={t}><Highway t={t} p={P(t, 12.53, 18.19)} /></Shot>
      <Shot a={18.19} b={20.2} t={t}><Village t={t} p={P(t, 18.19, 20.2)} /></Shot>
      <Shot a={20.2} b={22.73} t={t}><ExcavatorsMed t={t} /></Shot>
      <Shot a={22.73} b={28.79} t={t}><PitTop t={t} p={P(t, 22.73, 28.45)} /></Shot>
      <Shot a={28.79} b={30.6} t={t}><Concrete t={t} /></Shot>
      <Shot a={30.6} b={34.47} t={t}><Underground t={t} keys={ugKeys} ug={ug} /></Shot>
      <Shot a={34.47} b={37.0} t={t}><MaxPit t={t} /></Shot>
      <Shot a={37.0} b={40.3} t={t}><Notebook t={t} /></Shot>
      <Shot a={40.3} b={42.44} t={t}><BigText t={t} text="40 ТОНН" t0={40.3} /></Shot>
      <Shot a={42.44} b={44.8} t={t}><TrucksArrive t={t} /></Shot>
      <Shot a={44.8} b={47.2} t={t}><Crates t={t} /></Shot>
      <Shot a={47.2} b={49.38} t={t}><Warehouse t={t} p={P(t, 47.2, 49.2)} /></Shot>
      <Shot a={49.38} b={59.43} t={t}><Underground t={t} keys={ugKeys} ug={ug} /></Shot>
      <Shot a={59.43} b={62.0} t={t}><TapGlass t={t} /></Shot>
      <Shot a={62.0} b={75.52} t={t}><Underground t={t} keys={ugKeys} ug={ug} /></Shot>
      <Shot a={75.52} b={78.93} t={t}><SurfaceDusk t={t} p={P(t, 75.52, 78.93)} /></Shot>
      <Shot a={78.93} b={80.9} t={t}><MaxExit t={t} /></Shot>
      <Shot a={80.9} b={CUT + 0.2} t={t}><Phone t={t} /></Shot>

      <Overlay t={t} frame={frame} />
      <StyledSub t={t} subs={subsB as [number, number, string][]} hot={HOTB} />
      <AbsoluteFill style={{background: '#000', opacity: black}} />
    </AbsoluteFill>
  );
};
