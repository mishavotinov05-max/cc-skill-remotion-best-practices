import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame} from 'remotion';
import subsB2 from './subs_bunker2.json';
import {Overlay, Shot, ramp, shake} from './Everest';
import {StyledSub} from './Subs';
import {Key, clamp} from './util';
import {Underground, UG, Warehouse, P} from './BunkerArt';
import {BagClose, CloudCover, CloudForest, Counter, CrowdHatch, Gathering, GrandmaHouse, HeavyDoor, Ladder, MaxOut, Phone2, PressureDoor, RoofSpots, RunSide, SensorScreen, VentMonitor, VillageNight, VillageRun} from './Bunker2Art';

export const FPSB2 = 30;
export const DURATIONB2 = 78.2;
const CUT = 77.95;
const HOT = new Set(['заражение', 'телефоне', 'генераторы', 'вентиляцию', 'электричество', 'связь', 'облако', 'дядей', 'сорок', 'девять', 'жителя', 'бабушку', 'сумку', 'схватил', 'дверь', 'предупреждение', 'заражён', 'частицы', 'бункера', 'отключилось', 'пятна']);

const FULL: UG = {walls: 1, parts: 1, water: 1, pipes: 1, pump: 1, filters: 1, tank: 1, vent: 1, gen: 1, lamps: 1, rooms: [1, 1, 1, 1]};
const keysGen: Key[] = [[0, 260, 1500, 1.9], [100, 260, 1500, 1.9]];
const keysVent: Key[] = [[0, 200, 430, 2.2], [100, 880, 430, 2.2]];
const keysFlick: Key[] = [[0, 260, 1500, 1.9], [100, 300, 1450, 1.7]];

export const Bunker2: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPSB2;
  const black = t >= CUT ? 1 : 0;
  const flick = t >= 20.26 && t < 22.9 ? (Math.sin(t * 31) * Math.sin(t * 7) > -0.2 ? 1 : 0.1) : 1;
  const ugFlick: UG = {...FULL, lamps: flick, gen: t < 21.0 ? 0.25 : 1};
  const sk = t >= 62.85 && t < 63.3 ? shake(t, 14 * (1 - (t - 62.85) / 0.45)) : {x: 0, y: 0};
  const sk2 = t >= 17.3 && t < 17.7 ? shake(t, 8) : {x: 0, y: 0};

  const drone = ramp([[0, 0.14], [20, 0.2], [40, 0.22], [70, 0.24], [75.25, 0.24], [75.36, 0], [CUT, 0]]);
  const wind = ramp([[0, 0.05], [24, 0.05], [27.9, 0.1], [55, 0.14], [61, 0.15], [61.2, 0.02], [CUT, 0.01]]);
  const steps = (a: number, b: number, v: number) => ramp([[0, 0], [0.3, v], [b - a - 0.4, v], [b - a, 0]]);

  return (
    <AbsoluteFill style={{backgroundColor: '#000'}}>
      <Audio src={staticFile('voice5.mp3')} volume={1} />
      <Audio src={staticFile('sfx/drone.mp3')} volume={drone} />
      <Audio src={staticFile('sfx/wind.mp3')} volume={wind} />
      <Sequence from={Math.round(0.45 * FPS2())} durationInFrames={20}><Audio src={staticFile('sfx/beep.mp3')} volume={0.3} /></Sequence>
      <Sequence from={Math.round(3.45 * FPS2())} durationInFrames={30}><Audio src={staticFile('sfx/thud.mp3')} volume={0.45} /></Sequence>
      <Sequence from={Math.round(6.16 * FPS2())} durationInFrames={Math.round(4.0 * FPS2())}><Audio src={staticFile('sfx/crunch.mp3')} volume={steps(6.16, 10.1, 0.07)} /></Sequence>
      <Sequence from={Math.round(12.36 * FPS2())} durationInFrames={Math.round(1.3 * FPS2())}><Audio src={staticFile('sfx/gen.mp3')} volume={steps(12.36, 13.66, 0.12)} /></Sequence>
      <Sequence from={Math.round(13.55 * FPS2())} durationInFrames={Math.round(1.9 * FPS2())}><Audio src={staticFile('sfx/fan.mp3')} volume={steps(13.55, 15.45, 0.12)} /></Sequence>
      <Sequence from={Math.round(17.3 * FPS2())} durationInFrames={26}><Audio src={staticFile('sfx/clank.mp3')} volume={0.2} /></Sequence>
      <Sequence from={Math.round(17.3 * FPS2())} durationInFrames={30}><Audio src={staticFile('sfx/thud.mp3')} volume={0.3} /></Sequence>
      <Sequence from={Math.round(20.5 * FPS2())} durationInFrames={Math.round(2.5 * FPS2())}><Audio src={staticFile('sfx/diesel.mp3')} volume={steps(20.5, 23.0, 0.12)} /></Sequence>
      <Sequence from={Math.round(22.95 * FPS2())} durationInFrames={20}><Audio src={staticFile('sfx/beep.mp3')} volume={0.3} /></Sequence>
      <Sequence from={Math.round(35.5 * FPS2())} durationInFrames={Math.round(2.1 * FPS2())}><Audio src={staticFile('sfx/crunch.mp3')} volume={steps(35.5, 37.6, 0.1)} /></Sequence>
      {[37.75, 38.05, 38.35, 38.65].map((c) => (
        <Sequence key={c} from={Math.round(c * FPS2())} durationInFrames={26}><Audio src={staticFile('sfx/clank.mp3')} volume={0.12} /></Sequence>
      ))}
      <Sequence from={Math.round(46.3 * FPS2())} durationInFrames={Math.round(2.4 * FPS2())}><Audio src={staticFile('sfx/crunch.mp3')} volume={steps(46.3, 48.7, 0.08)} /></Sequence>
      <Sequence from={Math.round(52.1 * FPS2())} durationInFrames={Math.round(2.7 * FPS2())}><Audio src={staticFile('sfx/crunch.mp3')} volume={steps(52.1, 54.8, 0.1)} /></Sequence>
      <Sequence from={Math.round(62.85 * FPS2())} durationInFrames={30}><Audio src={staticFile('sfx/thud.mp3')} volume={0.55} /></Sequence>
      <Sequence from={Math.round(62.85 * FPS2())} durationInFrames={26}><Audio src={staticFile('sfx/clank.mp3')} volume={0.3} /></Sequence>
      <Sequence from={Math.round(63.3 * FPS2())} durationInFrames={26}><Audio src={staticFile('sfx/clank.mp3')} volume={0.1} /></Sequence>
      <Sequence from={Math.round(64.33 * FPS2())} durationInFrames={Math.round(2.6 * FPS2())}><Audio src={staticFile('sfx/fan.mp3')} volume={steps(64.33, 66.9, 0.1)} /></Sequence>
      <Sequence from={Math.round(66.95 * FPS2())} durationInFrames={20}><Audio src={staticFile('sfx/beep.mp3')} volume={0.25} /></Sequence>
      <Sequence from={Math.round(70.02 * FPS2())} durationInFrames={Math.round(2.35 * FPS2())}><Audio src={staticFile('sfx/siren.mp3')} volume={ramp([[0, 0], [0.1, 0.09], [2.2, 0.09], [2.35, 0]])} /></Sequence>
      {[73.45, 73.9, 74.35, 74.8].map((c) => (
        <Sequence key={c} from={Math.round(c * FPS2())} durationInFrames={20}><Audio src={staticFile('sfx/beep.mp3')} volume={0.14} /></Sequence>
      ))}
      <Sequence from={Math.round(75.35 * FPS2())} durationInFrames={Math.round((CUT - 75.35) * FPS2())}><Audio src={staticFile('sfx/alarm.mp3')} volume={0.16} /></Sequence>

      <Shot a={0} b={6.16} t={t}><Phone2 t={t} t0={0} mode="warn" /></Shot>
      <Shot a={6.16} b={10.23} t={t}><VillageRun t={t} a={6.16} b={10.0} /></Shot>
      <Shot a={10.23} b={12.36} t={t}><Gathering t={t} shout={false} /></Shot>
      <Shot a={12.36} b={13.55} t={t}><Underground t={t} keys={keysGen} ug={FULL} /></Shot>
      <Shot a={13.55} b={15.4} t={t}><Underground t={t} keys={keysVent} ug={FULL} /></Shot>
      <Shot a={15.4} b={16.84} t={t}><Warehouse t={t} p={1} /></Shot>
      <Shot a={16.84} b={20.26} t={t}><div style={{transform: `translate(${sk2.x}px, ${sk2.y}px)`, width: '100%', height: '100%'}}><VillageNight t={t} /></div></Shot>
      <Shot a={20.26} b={22.9} t={t}><Underground t={t} keys={keysFlick} ug={ugFlick} /></Shot>
      <Shot a={22.9} b={25.1} t={t}><Phone2 t={t} t0={22.9} mode="nosig" /></Shot>
      <Shot a={25.1} b={27.95} t={t}><MaxOut t={t} t0={25.1} /></Shot>
      <Shot a={27.95} b={32.78} t={t}><CloudForest t={t} a={27.95} b={32.48} p0={0.1} p1={0.6} /></Shot>
      <Shot a={32.78} b={35.49} t={t}><Gathering t={t} shout /></Shot>
      <Shot a={35.49} b={37.6} t={t}><CrowdHatch t={t} /></Shot>
      <Shot a={37.6} b={38.85} t={t}><Ladder t={t} /></Shot>
      <Shot a={38.85} b={40.51} t={t}><PressureDoor t={t} /></Shot>
      <Shot a={40.51} b={46.06} t={t}><Counter t={t} /></Shot>
      <Shot a={46.06} b={49.12} t={t}><GrandmaHouse t={t} /></Shot>
      <Shot a={49.12} b={52.08} t={t}><BagClose t={t} /></Shot>
      <Shot a={52.08} b={55.01} t={t}><RunSide t={t} /></Shot>
      <Shot a={55.01} b={57.89} t={t}><CloudCover t={t} /></Shot>
      <Shot a={57.89} b={61.04} t={t}><RoofSpots t={t} /></Shot>
      <Shot a={61.04} b={64.33} t={t}><HeavyDoor t={t} /></Shot>
      <Shot a={64.33} b={72.66} t={t}><VentMonitor t={t} /></Shot>
      <Shot a={72.66} b={CUT + 0.25} t={t}><SensorScreen t={t} /></Shot>

      <Overlay t={t} frame={frame} />
      <StyledSub t={t} subs={subsB2 as [number, number, string][]} hot={HOT} />
      <AbsoluteFill style={{background: '#000', opacity: black}} />
    </AbsoluteFill>
  );
};
function FPS2() {
  return FPSB2;
}
