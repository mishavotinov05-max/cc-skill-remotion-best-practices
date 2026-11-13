import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {ramp} from './Everest';
import {clamp, ease, lerp, rnd, mixc, Tx, Glow, Snow, E, P, TempHud, Look, Pose, poseStand, poseWalk, poseSit, poseCarry, poseReach, ILYA_OUT, ILYA_IN, DED_IN, DED_OUT, MAX_OUT} from './M60Base';
import {Radio, OutThermo} from './M60Items';
import {Village, OldHouse, CharSpec} from './M60Village';
import {Kitchen} from './M60Rooms';
import {NightView2, PhotoArt, ForestRoad, VAL_IN} from './M61Art';
import {ANDREI, Mon, ControlRoom, StationMap, Countdown, SpeakerScene, LeverCabinet, RedButton, Corridor, StairsDown, GreenDoor, StationExt, Plaque, SnowMobile, RideScene, Garage, GearClose, HouseCut, Diagram, ArchiveMon, PhoneMsg, DistantRed} from './M62Art';

export const FPS62 = 30;
const SPEED = 0.92;
const END_WORLD = 664.9;
export const DUR62 = END_WORLD / SPEED;
const ILYA_SC: Look = {...ILYA_OUT, scarf: '#8a8f9a'};
const MAX_SC: Look = {...MAX_OUT, scarf: '#c9b080'};
const MAX_IN: Look = {...MAX_OUT, hat: 'none', jacket: '#3a4a44', jacket2: '#4a5a54', hair: '#2a2420'};
const DED_SC: Look = {...DED_OUT, scarf: '#6a6a70'};
const IL = (x: number, y: number, pose: Pose, flip = false, look: Look = ILYA_IN, s = 1): CharSpec => ({look, x, y, pose, flip, s});

type Cam = [number, number, number, number, number, number];
type Shot = {a: number; b: number; sc: string; cam: Cam; p?: any; shake?: number; hud?: boolean; f?: number};
const S = (a: number, b: number, sc: string, cam: Cam, p: any = {}, extra: Partial<Shot> = {}): Shot => ({a, b, sc, cam, p, ...extra});
const C: Cam = [540, 540, 1, 540, 540, 1];

const SH: Shot[] = [
  // ---- hook ----
  S(0, 2.47, 'station', [1500, 400, 1.6, 1500, 150, 2.4], {dawn: 0, car: false, tower: true}),
  S(2.47, 5.45, 'map', [600, 1240, 1.53, 600, 1240, 2.04], {blue: [1, 0.55, 2.5, 5.4], rise: [0, 1, 2.5, 5.4], cityN: 4, st: 1}),
  S(5.45, 7.3, 'redbutton', [960, 700, 1.5, 960, 700, 1.0], {press: [6.0, 6.6]}, {shake: 3}),
  S(7.3, 8.3, 'countdown', [960, 540, 0.9, 960, 540, 1.3], {text: '8'}, {shake: 4}),
  S(8.3, 10.7, 'control', [1200, 800, 1.1, 1060, 800, 1.6], {k: 'andrei', alarm: 0.0, lamps: 0.6}),
  S(10.7, 13.0, 'oldhouse', [540, 1000, 1.0, 540, 700, 1.3], {lit: 0, top: 1}),
  S(13.0, 15.3, 'housecut', [900, 800, 0.9, 900, 800, 1.0], {prog: [0, 1, 13.0, 15.0], win: [13.0, 14.5]}),
  S(15.3, 17.2, 'oldhouse', [540, 600, 1.5, 540, 580, 1.9], {lit: 0, top: 1}),
  S(17.2, 19.1, 'kitchen', [1150, 1050, 1.2, 1100, 1050, 1.5], {k: 'ded'}),
  S(19.1, 22.4, 'kitchen', [1150, 1050, 1.8, 1150, 1050, 2.2], {k: 'ded'}),
  S(22.4, 24.9, 'black', C),
  // ---- kitchen / photo ----
  S(24.9, 28.8, 'kitchen', [900, 1000, 1.2, 1000, 1000, 1.4], {k: 'sit'}),
  S(28.8, 31.5, 'radio', [540, 540, 1.1, 540, 540, 1.4], {needle: 0.5, noise: 0.2}),
  S(31.5, 36.6, 'radio', [540, 540, 1.4, 540, 540, 1.7], {needle: 0.5, noise: 0.15}),
  S(37.1, 39.4, 'kitchen', [1150, 1050, 1.5, 1150, 1050, 1.9], {k: 'ded'}),
  S(39.4, 41.5, 'photo', [540, 540, 1.0, 540, 540, 1.1], {hl: -1}),
  S(41.5, 42.4, 'photo', [330, 600, 1.6, 330, 600, 1.7], {hl: 0}),
  S(42.4, 44.0, 'photo', [540, 600, 1.7, 540, 600, 1.8], {hl: 1}),
  S(44.0, 48.1, 'photo', [700, 620, 1.8, 700, 620, 2.6], {hl: 2}),
  S(48.1, 50.3, 'kitchen', [800, 1000, 1.4, 750, 1000, 1.6], {k: 'ask'}),
  S(50.3, 52.9, 'kitchen', [1100, 1050, 1.6, 1100, 1050, 1.9], {k: 'ask'}),
  S(52.9, 57.9, 'station', [1500, 700, 1.0, 1450, 600, 1.3], {dawn: 0.6, car: false, tower: true, muted: 0.6}),
  S(57.9, 60.3, 'diagram', [960, 540, 0.9, 960, 540, 1.1], {lock: 0}),
  S(60.3, 65.1, 'control', [1200, 800, 1.0, 1200, 800, 1.2], {k: 'empty', lamps: 0.6, muted: 0.5}),
  S(65.1, 68.3, 'map', [600, 1240, 1.53, 600, 1240, 1.87], {blue: [0.2, 0.2, 0, 1], lines: [0, 1, 65.1, 67.6], st: [0, 1, 65.1, 66.0], cityN: 0}),
  S(68.3, 71.3, 'kitchen', [800, 1000, 1.3, 800, 1000, 1.5], {k: 'ask'}),
  S(71.3, 76.2, 'kitchen', [1100, 1050, 1.7, 1100, 1050, 2.1], {k: 'ded'}),
  S(76.2, 78.5, 'kitchen', [1000, 1000, 1.4, 1000, 1000, 1.7], {k: 'ded'}),
  // ---- radio ----
  S(78.5, 81.7, 'radio', [540, 540, 1.0, 540, 540, 1.3], {needle: 0.3, noise: 0.5, glow: [78.6, 79.2]}),
  S(81.7, 84.5, 'radio', [540, 540, 1.3, 540, 540, 1.4], {needle: 0.5, noise: 0.1, beep: [82.0, 82.8, 83.6]}),
  S(84.5, 91.5, 'radio', [540, 540, 1.4, 540, 540, 1.8], {needle: 0.5, noise: 0.3}),
  S(91.5, 94.3, 'kitchen', [1100, 1050, 1.6, 1100, 1050, 2.0], {k: 'rise'}),
  S(94.3, 98.3, 'radio', [540, 540, 1.7, 540, 540, 1.9], {needle: 0.5, noise: 0.7}),
  S(98.3, 100.5, 'speaker', [540, 540, 1.0, 540, 540, 1.3], {lvl: 0.7}),
  S(100.5, 102.2, 'radio', [540, 540, 1.5, 540, 540, 1.5], {needle: 0.5, noise: 0, dead: true}),
  S(102.2, 107.1, 'kitchen', [800, 1000, 1.4, 900, 1000, 1.5], {k: 'ask2'}),
  S(107.1, 112.3, 'kitchen', [1000, 1000, 1.5, 1000, 1000, 1.8], {k: 'coat'}),
  S(112.3, 115.4, 'kitchen', [900, 1000, 1.2, 800, 1000, 1.3], {k: 'coat2'}),
  S(115.4, 117.6, 'garage', [850, 1000, 1.2, 850, 1000, 1.5], {run: 0, chars: 'max'}),
  S(117.6, 118.7, 'gear', [540, 540, 1, 540, 540, 1.1], {item: 0}),
  S(118.7, 119.6, 'gear', [540, 540, 1, 540, 540, 1.1], {item: 1}),
  S(119.6, 120.4, 'gear', [540, 540, 1, 540, 540, 1.1], {item: 2}),
  S(120.4, 121.4, 'gear', [540, 540, 1, 540, 540, 1.1], {item: 3}),
  S(121.4, 124.1, 'kitchen', [1000, 1050, 1.5, 1000, 1050, 1.8], {k: 'val'}),
  S(124.1, 126.6, 'village', [1100, 1100, 1.4, 1300, 1100, 1.4], {dark: 1, chars: 'go'}),
  S(126.6, 129.5, 'village', [1300, 1100, 1.5, 1450, 1100, 1.5], {dark: 1, chars: 'go', blizz: 1}, {shake: 2}),
  S(129.5, 132.7, 'garage', [850, 1100, 1.5, 800, 1100, 1.8], {run: [129.5, 132.1], chars: 'ride', attempts: true}),
  S(132.7, 135.4, 'ride', [760, 1100, 1.3, 760, 1100, 1.2], {speed: 16}),
  S(135.4, 138.4, 'ride', [760, 1100, 1.2, 760, 1100, 1.5], {speed: 22}, {shake: 2}),
  S(138.4, 143.9, 'forest', [1000, 1050, 1.0, 1000, 1100, 1.3], {tracks: true}),
  S(143.9, 148.4, 'ride', [800, 1100, 1.2, 800, 1100, 1.1], {speed: 22}),
  S(148.4, 151.2, 'station', [1500, 500, 1.8, 1500, 250, 2.6], {dawn: 0, car: false, tower: true}),
  S(151.2, 153.7, 'station', [1400, 800, 1.2, 1300, 900, 1.4], {dawn: 0, car: true, tower: true}),
  S(153.7, 157.3, 'station', [900, 1150, 1.6, 880, 1200, 2.0], {dawn: 0, car: true, tower: true}),
  S(157.3, 160.9, 'station', [600, 1350, 2.0, 800, 1330, 2.2], {dawn: 0, car: true, tower: true}),
  S(160.9, 166.0, 'station', [560, 1150, 2.0, 560, 1150, 2.5], {dawn: 0, car: true, tower: true}),
  S(166.0, 168.1, 'plaque', [960, 780, 1.6, 960, 780, 2.2], {key: [166.4, 167.8]}),
  S(168.1, 171.8, 'plaque', [960, 400, 1.6, 960, 400, 2.0], {key: [0, 1]}),
  S(171.8, 173.3, 'station', [1250, 1100, 1.8, 1250, 1100, 2.4], {dawn: 0, car: true, tower: true, door: [171.9, 172.8]}),
  // ---- underground ----
  S(173.3, 178.4, 'corridor', [960, 540, 1.0, 960, 540, 1.3], {p: [173.3, 178.4]}),
  S(178.4, 182.2, 'corridor', [960, 540, 1.3, 960, 540, 1.8], {p: [178.4, 182.2], hum: true}),
  S(182.2, 185.5, 'corridor', [960, 800, 1.8, 960, 800, 2.4], {p: [182.2, 185.5]}),
  S(185.5, 188.9, 'stairs', [960, 540, 1.0, 960, 540, 1.3], {p: [185.5, 188.9]}),
  S(188.9, 192.2, 'greendoor', [960, 540, 1.0, 960, 540, 1.2], {open: 0}),
  S(192.2, 194.8, 'greendoor', [960, 540, 1.2, 960, 540, 1.4], {open: 0, glow: true}),
  S(194.8, 196.5, 'greendoor', [960, 540, 1.4, 960, 540, 1.1], {open: [194.9, 196.2]}, {shake: 1}),
  S(196.5, 200.5, 'control', [1200, 800, 0.9, 1200, 800, 1.1], {k: 'wide', lamps: 1, green: 1}),
  S(200.5, 206.8, 'control', [700, 700, 1.2, 1700, 700, 1.2], {k: 'wide', lamps: 1, green: 1}),
  S(206.8, 210.9, 'control', [1200, 900, 1.3, 1200, 900, 1.5], {k: 'andrei', lamps: 1}),
  S(210.9, 213.8, 'control', [1200, 900, 1.5, 1200, 900, 1.9], {k: 'andrei', lamps: 1}),
  S(213.8, 216.1, 'control', [1250, 900, 1.9, 1250, 900, 2.3], {k: 'andrei', lamps: 1}),
  S(216.1, 218.6, 'control', [1000, 900, 1.4, 1000, 900, 1.6], {k: 'wide', lamps: 1}),
  S(218.6, 225.4, 'map', [600, 1240, 1.7, 600, 1240, 1.95], {blue: [0.2, 1, 218.6, 224.0], cityN: 0, st: 0}),
  S(225.4, 228.2, 'map', [686, 1110, 2.2, 686, 1110, 2.5], {blue: [1, 1, 0, 1], cityN: 1}),
  S(228.2, 231.0, 'map', [630, 1090, 2.2, 630, 1090, 2.5], {blue: [1, 1, 0, 1], cityN: 2}),
  S(231.0, 233.9, 'map', [251, 1165, 2.2, 251, 1165, 2.5], {blue: [1, 1, 0, 1], cityN: 3}),
  S(233.9, 236.5, 'map', [1136, 1165, 2.2, 1136, 1165, 2.5], {blue: [1, 1, 0, 1], cityN: 4}),
  S(236.5, 241.0, 'control', [1100, 800, 1.2, 1200, 800, 1.5], {k: 'andrei2', lamps: 1}),
  S(241.0, 244.95, 'map', [600, 1240, 2.04, 600, 1240, 1.7], {blue: [1, 1, 0, 1], lines: [0, 1, 241.0, 244.0], st: [0, 1, 241.0, 242.5], cityN: 0}),
  S(244.95, 250.1, 'map', [600, 1240, 1.7, 600, 1240, 1.95], {blue: [0.2, 0.2, 0, 1], lines: [1, 1, 0, 1], st: [1, 1, 0, 1], cityN: 0}),
  S(250.1, 255.2, 'map', [600, 1240, 1.95, 600, 1240, 2.21], {blue: [0.2, 0.5, 250.1, 254.0], lines: [1, 1, 0, 1], st: [1, 1, 0, 1], cityN: 0, flash: true}),
  S(255.2, 261.8, 'map', [600, 1240, 2.21, 600, 1240, 1.7], {blue: [0.5, 1, 255.2, 260.5], lines: [1, 1, 0, 1], st: [1, 1, 0, 1], cityN: 4}),
  S(261.8, 266.2, 'control', [1000, 900, 1.3, 1000, 900, 1.5], {k: 'ask', lamps: 1}),
  S(266.2, 269.3, 'control', [1250, 900, 1.5, 1250, 900, 1.8], {k: 'andrei2', lamps: 1}),
  S(269.3, 273.3, 'redbutton', [960, 700, 1.0, 960, 700, 1.1], {press: [0, 0]}),
  S(273.3, 277.3, 'control', [1000, 900, 1.6, 1000, 900, 1.9], {k: 'dedtalk', lamps: 1}),
  S(277.3, 282.1, 'diagram', [960, 540, 1.0, 960, 540, 1.2], {lock: 0}),
  // ---- archive ----
  S(282.1, 287.3, 'archive', [960, 540, 1.0, 960, 540, 1.2], {flash: 0, end: 0}),
  S(287.3, 290.8, 'archive', [960, 540, 1.2, 960, 540, 1.5], {flash: 0, end: 0}),
  S(290.8, 294.5, 'archive', [960, 540, 1.5, 960, 540, 1.7], {flash: [291.0, 292.5], end: 0}, {shake: 2}),
  S(294.5, 298.2, 'archive', [960, 540, 1.7, 960, 540, 1.9], {flash: [294.5, 295.0], end: 0}, {shake: 3}),
  S(298.2, 299.9, 'archive', [960, 540, 1.9, 960, 540, 1.9], {flash: [0, 0.1], end: [298.2, 298.6]}),
  S(299.9, 304.0, 'control', [1150, 900, 1.5, 1250, 900, 1.7], {k: 'andrei2', lamps: 1}),
  S(304.0, 309.3, 'control', [800, 900, 1.4, 800, 900, 1.6], {k: 'ask', lamps: 1}),
  S(309.3, 313.4, 'control', [1250, 900, 1.6, 1250, 900, 1.8], {k: 'andrei2', lamps: 1}),
  S(313.4, 320.2, 'control', [1000, 900, 1.7, 1000, 900, 2.0], {k: 'dedtalk', lamps: 1}),
  // ---- critical ----
  S(320.2, 324.2, 'alert', [960, 540, 1.0, 960, 540, 1.2], {text: 0}, {shake: 3}),
  S(324.2, 328.9, 'alert', [960, 540, 1.2, 960, 540, 1.4], {text: 1}, {shake: 2}),
  S(328.9, 333.8, 'countdown', [960, 540, 0.8, 960, 540, 1.1], {text: '10:00'}),
  S(333.8, 341.5, 'map', [600, 1240, 1.7, 1136, 1165, 2.2], {blue: [1, 1, 0, 1], lines: [1, 1, 0, 1], st: [1, 1, 0, 1], cityN: 4, minus70: true}),
  S(341.5, 347.8, 'control', [900, 900, 1.3, 1100, 900, 1.3], {k: 'dedpanel', lamps: 1, alarm: 1}),
  S(347.8, 355.5, 'housecut', [900, 800, 0.9, 1000, 900, 1.0], {prog: [0, 1, 347.8, 354.8], win: [0, 0]}),
  S(355.5, 360.3, 'housecut', [450, 400, 1.3, 450, 400, 1.6], {prog: [1, 1, 0, 1], win: [358.0, 359.0]}),
  S(360.3, 367.6, 'control', [1250, 900, 1.5, 1250, 900, 1.8], {k: 'andrei2', lamps: 1, alarm: 1}),
  S(367.6, 372.8, 'control', [1000, 900, 1.8, 1000, 900, 2.1], {k: 'dedtalk', lamps: 1, alarm: 1}),
  // ---- restart ----
  S(372.8, 376.4, 'control', [700, 1200, 1.7, 900, 1250, 1.9], {k: 'max', lamps: 1}),
  S(376.4, 378.65, 'control', [1250, 900, 1.6, 1250, 900, 1.8], {k: 'andrei2', lamps: 1.2}),
  S(378.65, 382.8, 'lever', [540, 540, 1.0, 540, 540, 1.2], {throw: [379.0, 381.5], ready: 0, half: 0}),
  S(382.8, 384.5, 'control', [1200, 800, 1.0, 1200, 800, 1.1], {k: 'wide', lamps: 1, half: 1}),
  S(384.5, 388.15, 'lever', [540, 540, 1.2, 540, 540, 1.4], {throw: [0, 1], ready: [385.5, 386.0], half: 1}),
  S(388.15, 390.6, 'redbutton', [960, 700, 1.0, 960, 700, 1.4], {press: [0, 0]}),
  S(390.6, 397.7, 'speaker', [540, 540, 1.0, 540, 540, 1.5], {lvl: 0.9}),
  S(397.7, 401.3, 'control', [1250, 900, 1.2, 1250, 900, 1.7], {k: 'andrei2', lamps: 1, half: 0.6}),
  S(401.3, 406.3, 'control', [1100, 900, 1.5, 1250, 900, 1.8], {k: 'stop', lamps: 1, half: 0.6}),
  S(406.3, 410.1, 'speaker', [540, 540, 1.3, 540, 540, 1.5], {lvl: 0.9}),
  S(410.1, 417.8, 'diagram', [960, 540, 1.0, 960, 540, 1.25], {lock: 0}),
  S(417.8, 420.7, 'diagram', [960, 540, 1.25, 960, 540, 1.4], {lock: 0}),
  S(420.7, 428.9, 'diagram', [960, 540, 1.4, 960, 540, 1.1], {lock: [420.7, 428]}),
  S(428.9, 435.0, 'speaker', [540, 540, 1.3, 540, 540, 1.6], {lvl: 0.5}),
  S(435.0, 441.5, 'speaker', [540, 540, 1.6, 540, 540, 1.8], {lvl: 0.7}),
  S(441.5, 444.2, 'countdown', [960, 540, 1.2, 960, 540, 0.9], {text: '5:00'}),
  S(444.2, 447.9, 'countdown', [960, 540, 0.9, 960, 540, 1.1], {text: '4:59'}),
  S(447.9, 451.7, 'control', [1250, 900, 1.5, 1250, 900, 1.8], {k: 'andrei2', lamps: 1, alarm: 1, half: 0.6}),
  S(451.7, 455.0, 'control', [800, 900, 1.5, 800, 900, 1.7], {k: 'ask', lamps: 1, alarm: 1, half: 0.6}),
  S(455.0, 460.7, 'map', [600, 1240, 1.7, 1136, 1165, 2.0], {blue: [1, 1, 0, 1], lines: [1, 1, 0, 1], st: [1, 1, 0, 1], cityN: 4, minus70: true}),
  S(460.7, 464.2, 'countdown', [960, 540, 1.1, 960, 540, 1.3], {text: '3:40'}),
  S(464.2, 467.0, 'control', [1150, 1000, 1.6, 1200, 1050, 1.9], {k: 'ilya_panel', lamps: 1, alarm: 1, half: 0.6}),
  S(467.0, 468.6, 'control', [1000, 900, 1.9, 1000, 900, 2.3], {k: 'dedtalk', lamps: 1, alarm: 1, half: 0.6}),
  S(468.6, 470.5, 'redbutton', [960, 700, 1.2, 960, 700, 1.0], {press: [468.7, 469.1]}, {shake: 3}),
  // ---- launch ----
  S(470.5, 477.1, 'control', [1200, 800, 1.0, 1200, 800, 1.2], {k: 'wide', lamps: 1, alarm: 1, flick: true}, {shake: 6}),
  S(477.1, 479.7, 'countdown', [960, 540, 1.0, 960, 540, 1.2], {text: '10'}, {shake: 4}),
  S(479.7, 480.5, 'countdown', [960, 540, 1.2, 960, 540, 1.3], {text: '10'}, {shake: 5}),
  S(480.5, 481.4, 'countdown', [960, 540, 1.3, 960, 540, 1.4], {text: '9'}, {shake: 5}),
  S(481.4, 482.3, 'countdown', [960, 540, 1.4, 960, 540, 1.5], {text: '8'}, {shake: 5}),
  S(482.3, 484.3, 'control', [1200, 800, 1.1, 1200, 800, 1.4], {k: 'wide', lamps: 1, alarm: 1, flick: true}, {shake: 8}),
  S(484.3, 485.9, 'countdown', [960, 540, 1.5, 960, 540, 1.6], {text: '7'}, {shake: 6}),
  S(485.9, 486.7, 'countdown', [960, 540, 1.6, 960, 540, 1.7], {text: '5'}, {shake: 6}),
  S(486.7, 490.3, 'control', [1100, 800, 1.1, 1100, 750, 1.3], {k: 'wide', lamps: 1, alarm: 0.6, sideMode: 'house', flick: true}, {shake: 6}),
  S(490.3, 494.5, 'control', [1030, 560, 1.7, 1030, 560, 2.1], {k: 'wide', lamps: 1, mainMode: 'house', sideMode: 'house', flick: true}, {shake: 5}),
  S(494.5, 497.9, 'monitor', [960, 540, 1.0, 960, 540, 1.5], {mode: 'house'}, {shake: 4}),
  S(497.9, 498.8, 'countdown', [960, 540, 1.6, 960, 540, 1.7], {text: '4'}, {shake: 6}),
  S(498.8, 499.5, 'countdown', [960, 540, 1.7, 960, 540, 1.8], {text: '3'}, {shake: 6}),
  S(499.5, 500.3, 'countdown', [960, 540, 1.8, 960, 540, 1.9], {text: '2'}, {shake: 6}),
  S(500.3, 501.34, 'countdown', [960, 540, 1.9, 960, 540, 2.0], {text: '1'}, {shake: 6}),
  S(501.34, 504.9, 'black', C),
  S(504.9, 508.3, 'darkbeam', [700, 700, 1.1, 1000, 700, 1.2], {}),
  S(508.3, 510.5, 'darkbeam', [1000, 700, 1.2, 1200, 650, 1.4], {}),
  S(510.5, 514.6, 'map', [600, 1240, 1.7, 600, 1240, 1.95], {blue: [0.9, 0.9, 0, 1], lines: [0.3, 0.3, 0, 1], st: [1, 1, 0, 1], cityN: 0}),
  S(514.6, 517.3, 'map', [600, 1240, 1.95, 600, 1240, 2.04], {blue: [0.9, 0.9, 0, 1], lines: [0.2, 0.2, 0, 1], st: [0, 0, 0, 1], cityN: 4}),
  S(517.3, 525.7, 'bigtemp', [960, 540, 1.0, 960, 540, 1.1], {}),
  S(525.7, 528.0, 'bigtemp', [960, 540, 1.1, 960, 540, 1.3], {}),
  S(528.0, 531.5, 'control', [1000, 900, 1.4, 1100, 900, 1.5], {k: 'relief', lamps: 0.7}),
  S(531.5, 535.3, 'control', [1200, 800, 1.2, 1200, 800, 1.0], {k: 'relief', lamps: 0.7}),
  // ---- return ----
  S(535.3, 537.3, 'station', [1250, 1100, 1.8, 1250, 1100, 1.3], {dawn: 0.3, car: true, tower: true, door: [535.3, 536.2]}),
  S(537.3, 541.9, 'station', [1100, 800, 1.0, 1100, 700, 1.1], {dawn: [0.3, 0.9, 537.3, 541.5], car: true, tower: true, door: [0, 1]}),
  S(541.9, 545.4, 'thermo', C, {val: -54}),
  S(545.4, 547.8, 'thermo', [540, 540, 1.1, 540, 540, 1.3], {val: -54}),
  S(547.8, 550.8, 'ride', [760, 1100, 1.2, 760, 1100, 1.3], {speed: 18, dawn: 0.9}),
  S(550.8, 555.4, 'station', [1250, 1000, 1.6, 1250, 1000, 1.3], {dawn: 0.9, car: true, tower: true, door: [0, 0.4], andrei: true}),
  S(555.4, 559.1, 'kitchen', [1000, 1050, 1.4, 1000, 1050, 1.6], {k: 'val2'}),
  S(559.1, 562.8, 'kitchen', [1050, 1050, 1.6, 1050, 1050, 1.8], {k: 'val2'}),
  S(562.8, 567.9, 'phone', [960, 540, 1.0, 960, 540, 1.2], {mode: 'bar1'}),
  S(567.9, 571.3, 'phone', [960, 540, 1.2, 960, 540, 1.4], {mode: 'alert'}, {shake: 1}),
  S(571.3, 576.7, 'phone', [960, 440, 1.4, 960, 440, 1.7], {mode: 'alert'}),
  S(576.7, 581.9, 'kitchen', [1150, 1050, 1.5, 1150, 1050, 1.9], {k: 'smile'}),
  S(581.9, 583.6, 'village', [1750, 1000, 1.0, 1750, 1000, 1.1], {dark: 0.55, chars: 'none', others: 0}),
  S(583.6, 588.4, 'village', [1100, 1000, 1.2, 1700, 1000, 1.2], {dark: 0.5, chars: 'clean', others: [0, 0.8, 584.0, 588.0]}),
  S(588.4, 593.1, 'village', [1700, 1000, 1.2, 2500, 1000, 1.2], {dark: 0.4, chars: 'clean2', others: [0.8, 1, 588.4, 592.0]}),
  S(593.1, 596.1, 'village', [1750, 900, 1.0, 1750, 800, 0.8], {dark: 0.35, chars: 'none', others: 1}),
  // ---- the photo ----
  S(596.1, 600.2, 'kitchen', [300, 700, 1.4, 300, 700, 1.7], {k: 'window', view: {low: 0, top: 0}}),
  S(600.2, 606.9, 'kitchen', [260, 640, 2.0, 260, 640, 3.0], {k: 'window', view: {low: 0, top: 0}}),
  S(606.9, 613.2, 'phone', [960, 540, 1.0, 960, 540, 1.2], {mode: 'vib'}, {shake: 2}),
  S(613.2, 619.3, 'phone', [960, 540, 1.2, 960, 540, 1.3], {mode: 'photo', k: 0}),
  S(619.3, 622.5, 'phone', [1000, 600, 1.4, 1000, 600, 1.6], {mode: 'photo', k: 0}),
  S(622.5, 626.9, 'phone', [1050, 640, 1.8, 1050, 640, 2.4], {mode: 'photo', k: [622.5, 624.5]}, {shake: 1}),
  S(626.9, 633.3, 'compare', [600, 620, 1.5, 600, 620, 1.6], {hl: 0}),
  S(633.3, 637.9, 'compare', [600, 620, 1.6, 600, 620, 1.8], {hl: 1}),
  S(637.9, 643.3, 'phone', [960, 540, 1.0, 960, 540, 1.3], {mode: 'msg1'}),
  S(643.3, 646.3, 'phone', [960, 500, 1.3, 960, 500, 1.5], {mode: 'msg1'}),
  S(646.3, 650.7, 'phone', [960, 540, 1.2, 960, 540, 1.5], {mode: 'msg2', k: [648.0, 648.6]}, {shake: 1}),
  S(650.7, 653.1, 'kitchen', [300, 700, 1.5, 300, 700, 1.7], {k: 'window', view: {low: 0, top: 0}}),
  S(653.1, 656.1, 'kitchen', [270, 650, 2.0, 270, 650, 2.6], {k: 'window', view: {low: 0, top: 0}}),
  S(656.1, 658.4, 'distant', [960, 540, 1.0, 960, 540, 1.2], {k: [0, 0, 0, 1]}),
  S(658.4, 659.74, 'distant', [960, 800, 1.2, 960, 830, 1.8], {k: [658.5, 659.5]}),
  S(659.74, END_WORLD, 'black', C),
];

const kitchen = (t: number, p: any) => {
  const k: string = p.k ?? 'sit';
  const dedSit = (look: Look = DED_IN, o: Partial<Pose> = {}) => IL(1170, 1500, poseSit({nod: Math.sin(t * 0.8) * 3, ...o}), false, look);
  const ilyaIn = (x: number, o: Partial<Pose> = {}, flip = false, look: Look = ILYA_IN) => IL(x, 1500, poseStand({nod: 4, ...o}), flip, look);
  const chars: CharSpec[] = [];
  switch (k) {
    case 'sit': chars.push(dedSit(), IL(930, 1500, poseSit({nod: 4}), true, ILYA_IN)); break;
    case 'ded': chars.push(dedSit(DED_IN, {hf: [60, -90]})); break;
    case 'ask': chars.push(dedSit(), ilyaIn(700)); break;
    case 'ask2': chars.push(IL(1000, 1500, poseStand({nod: 4}), true, DED_IN), ilyaIn(720)); break;
    case 'rise': chars.push(IL(1100, 1500, poseStand({nod: 2}), true, DED_IN), ilyaIn(700)); break;
    case 'coat': chars.push(IL(1100, 1500, poseReach(60, -180, {lean: 6}), true, DED_IN), ilyaIn(720)); break;
    case 'coat2': chars.push(IL(lerp(1100, 700, E(t, 112.5, 114.8)), 1500, poseWalk(t, 3, 8), true, DED_OUT), ilyaIn(720)); break;
    case 'val': chars.push(dedSit(), IL(1000, 1500, poseSit({nod: 4}), false, VAL_IN), ilyaIn(700)); break;
    case 'val2': chars.push(dedSit(), IL(1000, 1500, poseSit({nod: 5}), false, VAL_IN), IL(620, 1500, poseStand({nod: 3}), false, ILYA_SC), IL(760, 1500, poseStand(), false, MAX_SC)); break;
    case 'smile': chars.push(dedSit(DED_IN, {mood: 'happy'} as any), IL(1000, 1500, poseSit(), false, VAL_IN), ilyaIn(700, {hf: [70, -140]})); break;
    case 'window': chars.push(IL(480, 1500, poseStand({lean: 6, nod: 3}), true, ILYA_IN)); break;
    default: break;
  }
  if (k === 'coat2') chars.splice(1, 1, IL(lerp(720, 400, E(t, 112.7, 115)), 1500, poseWalk(t, 3, 8), true, ILYA_SC));
  let view: React.ReactNode = undefined;
  if (p.view) view = <NightView2 t={t} low={p.view.low ?? 0} top={p.view.top ?? 0} frost={0} />;
  return {
    t, lamp: 0, bulbFlick: 1, power: 1, flame: 0.85, curtain: k === 'window' ? -0.75 : 0.1, tv: 'off' as const, tvBanner: 0, tvTurn: 0,
    radioOn: k === 'sit' ? 0.5 : 0, needle: 0.5, noise: 0.1, water: 1, chars, outTemp: -60, outRed: 1, shutters: 0, cold: 0, view, knock: 0,
  };
};

const controlChars = (t: number, k: string): CharSpec[] => {
  const ded = (x: number, flip = true, o: Partial<Pose> = {}) => IL(x, 1500, poseStand({nod: 3, ...o}), flip, DED_OUT);
  const il = (x: number, flip = true, o: Partial<Pose> = {}) => IL(x, 1500, poseStand({nod: 3, ...o}), flip, ILYA_OUT);
  const mx = (x: number, flip = true, o: Partial<Pose> = {}) => IL(x, 1500, poseStand(o), flip, MAX_OUT);
  const an = (x: number, flip = false, o: Partial<Pose> = {}) => IL(x, 1500, poseStand({nod: 2, ...o}), flip, ANDREI);
  switch (k) {
    case 'andrei': case 'andrei2': return [an(1200, false), ded(900, false), il(750, false), mx(600, false)];
    case 'wide': return [an(1250, true), ded(950, false), il(800, false), mx(640, false)];
    case 'ask': return [an(1300, true), ded(1000, false), il(840, false, {nod: 4}), mx(680, false)];
    case 'dedtalk': return [ded(1000, false, {hf: [70, -140]}), an(1320, true), il(840, false), mx(680, false)];
    case 'dedpanel': return [ded(1100, false, {hf: [80, -150], lean: 14}), an(1360, true), il(900, false), mx(720, false)];
    case 'max': return [IL(700, 1500, poseReach(60, -90, {lean: 30, hip: [0, -96]}), false, MAX_OUT), il(950, false), ded(1100, false), an(1330, true)];
    case 'stop': return [an(1200, false, {hf: [80, -160]}), ded(1050, true, {hf: [60, -150]}), il(840, false), mx(680, false)];
    case 'ilya_panel': return [IL(1150, 1500, poseReach(70, -150, {lean: 18}), false, ILYA_OUT), ded(950, false), mx(740, false), an(1360, true)];
    case 'relief': return [mx(700, false, {mood: 'happy'} as any), IL(1000, 1500, poseSit({nod: 6}), true, DED_OUT), il(850, false), an(1350, true)].slice(0, 3);
    case 'empty': return [];
    default: return [];
  }
};

const Scene: React.FC<{sh: Shot; t: number}> = ({sh, t}) => {
  const p = sh.p ?? {};
  const tw = (a: any, def = 0) => (Array.isArray(a) ? lerp(a[0], a[1], E(t, a[2], a[3])) : a ?? def);
  switch (sh.sc) {
    case 'black': return <rect x={-3000} y={-3000} width={9000} height={9000} fill="#000" />;
    case 'kitchen': return <Kitchen {...(kitchen(t, p) as any)} />;
    case 'radio': {
      const dead = p.dead;
      const glow = p.glow ? E(t, p.glow[0], p.glow[1]) : 1;
      const bp = p.beep ? (p.beep as number[]).some((b) => t >= b && t < b + 0.25) : false;
      const needle = bp ? 0.9 : p.needle;
      return <g><rect x={-3000} y={-1500} width={9000} height={4000} fill="#2a1e16" /><Glow x={540} y={540} r={800} c="#ffb04a" o={dead ? 0 : 0.3 * glow} id="r62" /><Radio x={540} y={540} s={2.2} t={t} on={dead ? 0 : glow} needle={needle} noise={dead ? 0 : p.noise + (bp ? 0.5 : 0)} /></g>;
    }
    case 'speaker': return <SpeakerScene t={t} lvl={p.lvl} />;
    case 'photo': return <PhotoArt t={t} hl={p.hl} />;
    case 'station': {
      const dawn = tw(p.dawn);
      const door = p.door ? (Array.isArray(p.door) ? E(t, p.door[0], p.door[1]) : p.door) : 0;
      return <g><StationExt t={t} dawn={dawn} car={p.car} door={door} />{p.muted && <rect x={-3000} y={-1500} width={9000} height={4000} fill="#8a8f98" opacity={p.muted * 0.35} />}{p.andrei && <g transform="translate(1180 1240)"><rect x={-30} y={-170} width={60} height={170} rx={26} fill="#05070a" /><circle cx={0} cy={-200} r={28} fill="#05070a" /></g>}</g>;
    }
    case 'map': {
      const blue = tw(p.blue);
      const rise = tw(p.rise);
      return <g><StationMap t={t} blue={blue} lines={tw(p.lines)} stations={tw(p.st)} cityN={p.cityN ?? 0} rise={p.minus70 ? -0.4 : rise} />{p.flash && <rect x={-3000} y={-1500} width={9000} height={4000} fill="#ff2a2a" opacity={0.08 + 0.06 * Math.sin(t * 10)} />}</g>;
    }
    case 'redbutton': return <RedButton t={t} press={p.press && p.press[1] > 0 ? E(t, p.press[0], p.press[1]) : 0} />;
    case 'countdown': return <Countdown t={t} text={p.text} />;
    case 'control': {
      const lamps = p.lamps ?? 1;
      const flick = p.flick ? (Math.sin(t * 30) > -0.3 ? 1 : 0.3) : 1;
      return (
        <g>
          <ControlRoom t={t} lamps={lamps * flick} alarm={p.alarm ?? 0} mainMode={p.mainMode ?? 'map'} sideMode={p.sideMode ?? 'text'} half={p.half ?? 0} chars={controlChars(t, p.k ?? 'wide')} blackout={0} green={p.green ?? 0} />
          {p.muted && <rect x={-3000} y={-1500} width={9000} height={4000} fill="#8a8f98" opacity={p.muted * 0.35} />}
        </g>
      );
    }
    case 'garage': {
      const chars: CharSpec[] = [];
      if (p.chars === 'max') chars.push(IL(540, 1500, poseReach(70, -150, {lean: 22}), false, MAX_IN), IL(1100, 1500, poseStand({nod: 4}), true, ILYA_SC));
      if (p.chars === 'ride') chars.push(IL(560, 1500, poseReach(70, -150, {lean: 22}), false, MAX_SC));
      const run = Array.isArray(p.run) ? (t > 132.0 ? 1 : 0) : p.run;
      return <Garage t={t} chars={chars} run={run} />;
    }
    case 'gear': return <GearClose t={t} item={p.item} />;
    case 'village': {
      const chars: CharSpec[] = [];
      const gy = 1380;
      if (p.chars === 'go') { const x = lerp(1180, 1450, E(t, 124.5, 129)); chars.push(IL(x, gy, poseWalk(t, 2.6, 18), false, ILYA_SC), IL(x - 140, gy, poseWalk(t + 0.3, 2.6, 18), false, MAX_SC), IL(x - 280, gy, poseWalk(t + 0.5, 2.6, 18), false, DED_SC)); }
      if (p.chars === 'clean') chars.push(IL(1250, gy, poseReach(80, -120, {lean: 28, hip: [0, -96]}), false, {...ILYA_OUT, scarf: undefined}), IL(1500, gy, poseReach(80, -120, {lean: 28, hip: [0, -96]}), true, {...MAX_OUT, hat: 'beanie'}));
      if (p.chars === 'clean2') chars.push(IL(1900, gy, poseReach(80, -120, {lean: 28, hip: [0, -96]}), false, DED_OUT), IL(2200, gy, poseWalk(t, 2.4, 10), true, MAX_OUT));
      const oth = Array.isArray(p.others) ? lerp(p.others[0], p.others[1], E(t, p.others[2], p.others[3])) : p.others ?? 0;
      return <g><Village t={t} dark={p.dark ?? 1} others={oth} old={0} snowI={p.blizz ?? 0.5} cx={lerp(sh.cam[0], sh.cam[3], 0.5)} chars={chars} drifts={0.4} smoke={0.6} /><rect x={-4000} y={-1500} width={9000} height={4400} fill="#04070f" opacity={0.3 * (p.dark ?? 1)} /></g>;
    }
    case 'ride': return <RideScene t={t} speed={p.speed} dawn={p.dawn ?? 0} shake={2} />;
    case 'forest': return <ForestRoad t={t} tracks={p.tracks} />;
    case 'plaque': return <Plaque t={t} key_={p.key ? E(t, p.key[0], p.key[1]) : 0} />;
    case 'corridor': return <Corridor t={t} prog={E(t, p.p[0], p.p[1]) * 3} />;
    case 'stairs': return <StairsDown t={t} prog={E(t, p.p[0], p.p[1]) * 3} />;
    case 'greendoor': return <GreenDoor t={t} open={p.open && Array.isArray(p.open) ? E(t, p.open[0], p.open[1]) : p.glow ? 0 : 0} />;
    case 'diagram': return <Diagram t={t} lock={Array.isArray(p.lock) ? E(t, p.lock[0], p.lock[1]) : p.lock} />;
    case 'archive': return <ArchiveMon t={t} flash={Array.isArray(p.flash) ? 1 : 0} end={Array.isArray(p.end) ? E(t, p.end[0], p.end[1]) : 0} />;
    case 'alert': return (
      <g>
        <rect x={-3000} y={-1500} width={9000} height={4000} fill="#1a0606" />
        <rect x={-3000} y={-1500} width={9000} height={4000} fill="#ff2a2a" opacity={0.08 + 0.08 * Math.sin(t * 9)} />
        <g transform="translate(960 540)"><rect x={-760} y={-300} width={1520} height={600} rx={20} fill="#0a0404" stroke="#ff3b3b" strokeWidth={10} /><Tx x={0} y={-130} size={110} fill="#ff3b3b">КРИТИЧЕСКАЯ</Tx><Tx x={0} y={-10} size={110} fill="#ff3b3b">ТЕМПЕРАТУРА</Tx>{p.text >= 1 && <><Tx x={0} y={110} size={54} fill="#ffb3a8">ДО НЕОБРАТИМОГО ПЕРЕХОДА</Tx><Tx x={0} y={190} size={80} fill="#fff">10 МИНУТ</Tx></>}</g>
      </g>
    );
    case 'housecut': return <HouseCut t={t} prog={Array.isArray(p.prog) ? E(t, p.prog[2], p.prog[3]) * (p.prog[1] - p.prog[0]) + p.prog[0] : p.prog} win={Array.isArray(p.win) ? (p.win[0] === p.win[1] ? 0 : E(t, p.win[0], p.win[1])) : p.win ?? 0} />;
    case 'lever': return <LeverCabinet t={t} throw_={Array.isArray(p.throw) ? E(t, p.throw[0], p.throw[1]) : p.throw} ready={Array.isArray(p.ready) ? E(t, p.ready[0], p.ready[1]) : p.ready} half={p.half} />;
    case 'monitor': return <g><rect x={-3000} y={-1500} width={9000} height={4000} fill="#050a08" /><g transform="translate(960 540) scale(2.1) translate(-310 -95)"><Mon x={0} y={0} w={620} h={190} mode="house" t={t} /></g></g>;
    case 'darkbeam': return (
      <g>
        <rect x={-3000} y={-1500} width={9000} height={4000} fill="#030506" />
        <polygon points="560,860 1700,300 1700,1300" fill="#fff6c8" opacity={0.14} />
        <circle cx={560} cy={860} r={26} fill="#fff6c8" /><Glow x={620} y={860} r={500} c="#fff6c8" o={0.35} id="db62" />
        <g transform="translate(1300 900)"><rect x={-700} y={-280} width={1400} height={380} rx={14} fill="#10161a" opacity={0.7} />{Array.from({length: 5}).map((_, i) => <rect key={i} x={-660 + i * 270} y={-250} width={220} height={160} fill="#05110a" stroke="#1a2a22" strokeWidth={3} />)}<circle cx={0} cy={30} r={20} fill="#c0392b" opacity={0.5} /></g>
        <Chars62 list={[IL(900, 1300, poseStand({nod: 4}), false, MAX_OUT), IL(1100, 1300, poseStand(), false, ILYA_OUT), IL(1250, 1300, poseStand(), false, DED_OUT)]} />
      </g>
    );
    case 'bigtemp': {
      const v = t < 520.7 ? 69 : t < 522.2 ? lerp(69, 67, E(t, 519.2, 520.8)) : t < 524 ? lerp(67, 64, E(t, 521.7, 523.2)) : lerp(64, 62, E(t, 525.7, 530));
      const val = t < 519.1 ? 70 : t < 521 ? lerp(70, 67, E(t, 519.1, 520.8)) : t < 524.3 ? lerp(67, 64, E(t, 521.9, 523.4)) : lerp(64, 60, E(t, 525.7, 531));
      void v;
      return (
        <g>
          <rect x={-3000} y={-1500} width={9000} height={4000} fill="#05090f" />
          <Glow x={960} y={540} r={900} c="#7fd0ff" o={0.22} id="bt62" />
          <Tx x={960} y={720} size={380} fill={t > 525.7 ? '#7fffa8' : '#7fd0ff'} stroke="#05090f">{`−${Math.round(val)}`}</Tx>
          <Tx x={960} y={860} size={70} fill="#9fb4d0">°C</Tx>
        </g>
      );
    }
    case 'thermo': return <g><rect x={-3000} y={-1500} width={9000} height={4000} fill="#8a96aa" /><Snow t={t} n={30} speed={90} wind={40} op={0.7} size={1.4} w={1920} h={1080} x0={-400} y0={-200} /><OutThermo x={960} y={540} s={1.5} value={p.val} red={0} t={t} /></g>;
    case 'phone': {
      const kk = Array.isArray(p.k) ? E(t, p.k[0], p.k[1]) : p.k ?? 1;
      return <PhoneMsg t={t} mode={p.mode} k={kk} />;
    }
    case 'compare': return (
      <g>
        <rect x={-3000} y={-1500} width={9000} height={4000} fill="#10121a" />
        <g transform="translate(-130 150) scale(0.75)"><PhotoArt t={t} hl={-1} /></g>
        <g transform="translate(900 120) scale(0.9)"><g transform="translate(540 440)"><rect x={-340} y={-300} width={680} height={560} fill="#05110a" stroke="#3bff7a" strokeWidth={6} />{[0, 1, 2, 3, 4, 5].map((i) => <rect key={i} x={-320 + (i % 3) * 220} y={-280 + Math.floor(i / 3) * 130} width={200} height={110} fill="#0a2a14" stroke="#3bff7a" strokeWidth={2} />)}<g transform="translate(-60 240)"><rect x={-40} y={-200} width={80} height={200} rx={30} fill="#14161c" /><circle cx={0} cy={-236} r={36} fill="#241e22" /></g><g transform="translate(110 232)"><rect x={-40} y={-196} width={80} height={196} rx={30} fill="#2a2a30" /><circle cx={0} cy={-232} r={36} fill="#7a6a5a" /><path d="M-36 -246 Q0 -286 36 -246 L36 -232 L-36 -232 Z" fill="#14120e" /></g></g></g>
        <rect x={20} y={20} width={0} height={0} />
        {p.hl >= 1 && <g><ellipse cx={500} cy={380} rx={90} ry={150} fill="none" stroke="#ff4a3a" strokeWidth={8} opacity={0.5 + 0.5 * Math.sin(t * 8)} /><ellipse cx={1090} cy={560} rx={90} ry={150} fill="none" stroke="#ff4a3a" strokeWidth={8} opacity={0.5 + 0.5 * Math.sin(t * 8)} /></g>}
      </g>
    );
    case 'distant': return <DistantRed t={t} k={Array.isArray(p.k) ? E(t, p.k[0], p.k[1]) : 0} />;
    case 'oldhouse': return <g><OldHouse t={t} lit={p.lit} top={p.top === 1 ? 1 : 0} shadow={0} cx={540} /></g>;
    default: return null;
  }
};
const Chars62: React.FC<{list: CharSpec[]}> = ({list}) => <g>{list.map((c, i) => <Person62 key={i} c={c} />)}</g>;
import {Person} from './M60Base';
const Person62: React.FC<{c: CharSpec}> = ({c}) => <Person x={c.x} y={c.y} look={c.look} pose={c.pose} flip={c.flip} s={c.s ?? 1} />;

const SCENE_F: Record<string, number> = {kitchen: 0.7, control: 0.7, village: 0.7, garage: 0.7, station: 0.7, forest: 0.7, oldhouse: 0.7, radio: 0.8, phone: 0.8, photo: 0.8};
const ShotView: React.FC<{sh: Shot; t: number}> = ({sh, t}) => {
  const k = ease(clamp((t - sh.a) / Math.max(0.01, sh.b - sh.a)));
  const c = sh.cam;
  const fx = lerp(c[0], c[3], k), fy = lerp(c[1], c[4], k), s = lerp(c[2], c[5], k);
  const shk = sh.shake ?? 0;
  const f = SCENE_F[sh.sc] ?? 0.8;
  const mid = ['corridor', 'stairs', 'greendoor', 'countdown', 'redbutton', 'speaker', 'lever', 'diagram', 'archive', 'alert', 'monitor', 'darkbeam', 'bigtemp', 'thermo', 'plaque', 'ride', 'map', 'housecut', 'compare', 'distant', 'gear'].includes(sh.sc);
  void mid;
  return (
    <AbsoluteFill>
      <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{position: 'absolute', left: 0, top: 0}}>
        <g transform={`translate(${960 + shk * Math.sin(t * 61)} ${540 + shk * Math.cos(t * 53)}) scale(${s * f}) translate(${-fx} ${-fy})`}>
          <Scene sh={sh} t={t} />
        </g>
        {sh.sc === 'village' && <Snow t={t} n={110} speed={240} wind={220} op={0.7} size={2.0} w={1920} h={1080} />}
      </svg>
    </AbsoluteFill>
  );
};

export const M62: React.FC = () => {
  const frame = useCurrentFrame();
  const t = (frame / FPS62) * SPEED;
  const idx = SH.findIndex((s) => t >= s.a && t < s.b);
  const sh = SH[Math.max(0, idx)];
  const SFX = (a: number, d: number, src: string, v: number | ((f: number) => number)) => (
    <Sequence key={`${src}${a}`} from={Math.round((a / SPEED) * FPS62)} durationInFrames={Math.round(d * FPS62)}>
      <Audio src={staticFile(`sfx/${src}.mp3`)} volume={v} />
    </Sequence>
  );
  const rampT = (pts: [number, number][]) => ramp(pts.map(([a, v]) => [a / SPEED, v] as [number, number]));
  const music = rampT([[0, 0.05], [21.8, 0.05], [22.6, 0], [26, 0], [28, 0.04], [97.5, 0.04], [98.3, 0], [102.5, 0], [104, 0.04], [172, 0.04], [173.5, 0.025], [441.0, 0.025], [441.8, 0.0], [446, 0.0], [448, 0.03], [467.5, 0.03], [468.6, 0], [507.5, 0], [509, 0.045], [535, 0.05], [655, 0.05], [657.5, 0], [665, 0]]);
  const wind = rampT([[0, 0.06], [22, 0.06], [24, 0.03], [110, 0.03], [124, 0.12], [135, 0.1], [143, 0.07], [172, 0.06], [174, 0], [535, 0], [537, 0.04], [550, 0.06], [555, 0.02], [583, 0.03], [596, 0.01], [650, 0.03], [656, 0.06], [660, 0]]);
  const hum = rampT([[0, 0.06], [22, 0.06], [24, 0], [173, 0], [175, 0.07], [500.5, 0.12], [501.4, 0], [508, 0.05], [534, 0.04], [536, 0], [655, 0], [657.4, 0.06], [659.7, 0.0]]);
  const fire = rampT([[24, 0.035], [112, 0.03], [114, 0], [555, 0], [556, 0.03], [596, 0.02], [660, 0]]);
  const engine = rampT([[132.0, 0], [132.6, 0.06], [172, 0.06], [172.8, 0], [547.5, 0], [548, 0.06], [554.5, 0.05], [555.2, 0]]);
  const alarm = rampT([[320, 0], [320.5, 0.04], [334, 0.04], [334.5, 0], [447.5, 0], [448, 0.035], [470, 0.045], [501, 0.0]]);
  const rumble = rampT([[470, 0], [472, 0.07], [500.5, 0.12], [501.3, 0]]);
  const staticN = rampT([[28.8, 0], [29, 0.04], [36.6, 0.03], [37, 0], [78.4, 0], [78.6, 0.05], [102, 0.04], [102.2, 0], [390.6, 0.02], [391, 0.05], [441.6, 0.04], [441.7, 0]]);
  const ev: React.ReactNode[] = [
    SFX(6.2, 1.0, 'hit', 0.1), SFX(7.5, 0.5, 'beep', 0.07), SFX(22.4, 1.0, 'click', 0.06),
    SFX(78.6, 0.6, 'click', 0.1), SFX(82.0, 0.3, 'beep', 0.09), SFX(82.8, 0.3, 'beep', 0.09), SFX(83.6, 0.3, 'beep', 0.09), SFX(100.5, 0.4, 'click', 0.08),
    SFX(109, 1.0, 'creak', 0.07), SFX(115, 0.8, 'creak', 0.07), SFX(129.9, 0.7, 'diesel', 0.07), SFX(130.7, 0.7, 'diesel', 0.07), SFX(131.4, 0.7, 'diesel', 0.07),
    SFX(167.2, 0.5, 'clank', 0.1), SFX(172.2, 0.8, 'click', 0.1), SFX(172.5, 1.2, 'creak', 0.09),
    SFX(194.9, 1.2, 'creak', 0.1), SFX(196.3, 1.2, 'whoosh', 0.08),
    SFX(291.0, 1.0, 'click', 0.06), SFX(294.6, 0.8, 'beep', 0.07), SFX(298.2, 0.6, 'static', 0.06),
    SFX(320.2, 0.8, 'beep', 0.08), SFX(379.2, 0.6, 'clank', 0.12), SFX(382.8, 0.8, 'click', 0.12), SFX(386.4, 0.6, 'ping', 0.08), SFX(468.8, 0.9, 'hit', 0.2),
    SFX(477.1, 1.0, 'beep', 0.08), SFX(479.7, 0.4, 'beep', 0.08), SFX(480.5, 0.4, 'beep', 0.08), SFX(481.4, 0.4, 'beep', 0.08), SFX(484.3, 0.4, 'beep', 0.08), SFX(485.0, 0.4, 'beep', 0.08), SFX(485.9, 0.4, 'beep', 0.08),
    SFX(497.9, 0.4, 'beep', 0.09), SFX(498.8, 0.4, 'beep', 0.09), SFX(499.5, 0.4, 'beep', 0.09), SFX(500.3, 0.4, 'beep', 0.09), SFX(501.34, 1.4, 'hit', 0.22),
    SFX(504.9, 0.3, 'click', 0.1), SFX(510.5, 1.0, 'success', 0.07), SFX(536.0, 1.0, 'creak', 0.09), SFX(567.9, 0.8, 'notif', 0.09), SFX(606.9, 1.2, 'vib', 0.1), SFX(648.0, 0.8, 'vib', 0.1), SFX(637.9, 0.8, 'notif', 0.08),
    SFX(658.5, 3.5, 'rumble', ramp([[0, 0], [1.0, 0.04], [2.5, 0.07], [3.5, 0.0]])),
  ];
  return (
    <AbsoluteFill style={{backgroundColor: '#000'}}>
      <Audio src={staticFile('voice12s.mp3')} volume={1} />
      <Audio src={staticFile('sfx/m60.mp3')} volume={music} loop />
      <Audio src={staticFile('sfx/wind.mp3')} volume={wind} loop />
      <Audio src={staticFile('sfx/drone.mp3')} volume={hum} loop />
      <Audio src={staticFile('sfx/fire.mp3')} volume={fire} loop />
      <Audio src={staticFile('sfx/engine.mp3')} volume={engine} loop />
      <Audio src={staticFile('sfx/siren.mp3')} volume={alarm} loop />
      <Audio src={staticFile('sfx/rumble.mp3')} volume={rumble} loop />
      <Audio src={staticFile('sfx/static.mp3')} volume={staticN} loop />
      {ev}
      <ShotView sh={sh} t={t} />
      {['village'].includes(sh.sc) && sh.p?.chars === 'go' && (
        <AbsoluteFill><svg width={1920} height={1080} viewBox="0 0 1920 1080"><g transform="translate(0 -58)"><TempHud value={-60} t={t} mode="out" red={1} /></g></svg></AbsoluteFill>
      )}
      {(sh.sc === 'garage' && sh.p?.attempts) && (
        <AbsoluteFill><svg width={1920} height={1080} viewBox="0 0 1920 1080"><g transform="translate(0 -58)"><TempHud value={-60} t={t} mode="out" red={1} /></g></svg></AbsoluteFill>
      )}
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 55%, rgba(4,8,18,0.5) 100%)'}} />
      <AbsoluteFill style={{backgroundColor: '#000', opacity: t >= 659.74 ? 1 : 0}} />
    </AbsoluteFill>
  );
};
