import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {ramp} from './Everest';
import {clamp, ease, lerp, rnd, mixc, Tx, Glow, Snow, E, P, TempHud, Look, Pose, poseStand, poseWalk, poseSit, poseCarry, poseShiver, poseReach, ILYA_OUT, ILYA_IN, DED_IN, DED_OUT, MAX_OUT} from './M60Base';
import {ClockArt, OutThermo, Phone, Radio} from './M60Items';
import {Village, OldHouse, CharSpec} from './M60Village';
import {Kitchen, Cellar, Shed, TableTop} from './M60Rooms';
import {NightView2, ValRoom, ShedGen, GenOutside, Canisters, Voltmeter, PhotoArt, ForestRoad, StreetCar, NeighborHouse, FenceScene, FlashWalk, MugHands, OldDoor, VAL_IN, VAL_OUT} from './M61Art';

export const FPS61 = 30;
const SPEED = 0.92;
const END_WORLD = 583.0;
export const DUR61 = END_WORLD / SPEED;
const ILYA_SC: Look = {...ILYA_OUT, scarf: '#8a8f9a'};
const MAX_SC: Look = {...MAX_OUT, scarf: '#c9b080'};
const DED_HOME: Look = DED_IN;
const IL = (x: number, y: number, pose: Pose, flip = false, look: Look = ILYA_IN, s = 1): CharSpec => ({look, x, y, pose, flip, s});

type Cam = [number, number, number, number, number, number];
type Shot = {a: number; b: number; sc: string; cam: Cam; p?: any; shake?: number; hud?: boolean};
const S = (a: number, b: number, sc: string, cam: Cam, p: any = {}, extra: Partial<Shot> = {}): Shot => ({a, b, sc, cam, p, ...extra});
const W = 1; // window cams
const SH: Shot[] = [
  S(0, 3.7, 'kitchen', [300, 700, 1.5, 300, 690, 1.9], {k: 'win', view: {low: 0, top: 0}}),
  S(3.7, 8.5, 'oldhouse', [540, 1100, 1.0, 540, 1080, 1.15], {lit: 0, top: [99, 99]}),
  S(8.5, 11.6, 'oldhouse', [540, 900, 1.15, 540, 650, 1.3], {lit: 0, top: [8.54, 9.3]}),
  S(11.6, 17.1, 'oldhouse', [540, 600, 1.35, 540, 560, 1.7], {lit: 0, top: [0, 0]}),
  S(17.1, 20.4, 'kitchen', [260, 640, 2.0, 260, 640, 3.0], {k: 'wipe', view: {low: 0, top: 1, wipe: [17.1, 19.2]}}),
  S(20.4, 22.64, 'oldhouse', [540, 640, 1.7, 540, 620, 1.9], {lit: 0, top: [0, 0]}),
  S(22.64, 26.7, 'kitchen', [380, 760, 1.5, 330, 720, 1.8], {k: 'maxphone', view: {low: 0, top: 1}}),
  S(26.7, 31.5, 'phone', [540, 540, 1.0, 540, 540, 1.3], {mode: 'blur'}, {hud: false}),
  S(31.5, 33.4, 'kitchen', [700, 1000, 1.3, 800, 1000, 1.5], {k: 'turn'}),
  S(33.4, 37.2, 'kitchen', [900, 1000, 1.3, 950, 1000, 1.6], {k: 'grandmid'}),
  S(37.2, 39.6, 'kitchen', [700, 1000, 1.5, 750, 1000, 1.6], {k: 'ask'}),
  S(39.6, 42.8, 'kitchen', [950, 1000, 1.7, 950, 1000, 2.0], {k: 'grandmid'}),
  S(42.8, 44.7, 'thermo', [540, 540, 0.9, 540, 540, 1.1], {val: -60}, {hud: false}),
  S(44.7, 46.7, 'kitchen', [260, 640, 1.8, 260, 640, 2.2], {k: 'win', frostK: true, view: {low: 0, top: 1, frost: 0.5}}),
  S(46.7, 49.8, 'kitchen', [800, 1000, 1.2, 1000, 1000, 1.2], {k: 'ask'}),
  S(49.8, 52.0, 'kitchen', [700, 1000, 1.5, 700, 1000, 1.6], {k: 'ask'}),
  S(52.0, 56.0, 'kitchen', [1420, 1250, 1.9, 1420, 1250, 2.3], {k: 'stove', crack: true}),
  S(56.0, 58.1, 'kitchen', [1250, 1150, 1.6, 1300, 1150, 1.8], {k: 'stove'}),
  S(58.1, 61.1, 'kitchen', [1450, 1200, 2.6, 1450, 1200, 3.0], {k: 'stove'}),
  S(61.1, 64.1, 'kitchen', [1400, 1300, 3.0, 1380, 1300, 3.4], {k: 'stove'}),
  S(64.1, 70.4, 'kitchen', [1400, 900, 1.8, 1400, 800, 2.1], {k: 'stove'}),
  S(70.4, 73.3, 'hthermo', [540, 540, 1.0, 540, 540, 1.3], {v: 18, v2: 16, at: 73.0}, {hud: false}),
  S(73.3, 77.0, 'hthermo', [540, 540, 1.3, 540, 540, 1.1], {v: 16, v2: 16, at: 0}, {hud: false}),
  S(77.0, 80.6, 'kitchen', [260, 640, 1.9, 260, 640, 2.1], {k: 'win', view: {low: 0, top: 0, frost: 0.4}}),
  S(80.6, 83.9, 'village', [1100, 1050, 1.5, 1180, 1050, 1.7], {dark: 1, drifts: 0.6, chars: 'none', porch: true}),
  S(83.9, 89.9, 'kitchen', [900, 1000, 1.3, 800, 1000, 1.5], {k: 'sled'}),
  S(89.9, 94.99, 'kitchen', [700, 1000, 1.5, 600, 1000, 1.7], {k: 'dress'}),
  S(94.99, 97.6, 'village', [1100, 1100, 1.7, 1250, 1100, 1.8], {dark: 1, drifts: 0.5, chars: 'out2'}, {shake: 2}),
  S(97.6, 100.57, 'village', [1230, 1180, 3.2, 1250, 1180, 3.4], {dark: 1, drifts: 0.5, chars: 'out2'}, {shake: 3}),
  S(100.57, 106.2, 'village', [1250, 1100, 1.7, 1700, 1100, 1.7], {dark: 1, drifts: 0.5, chars: 'walk2'}),
  S(106.2, 108.0, 'shed', [850, 1000, 1.3, 850, 1000, 1.5], {wood: 0.18, chars: 'door', dark: 0.9}),
  S(108.0, 113.3, 'shed', [700, 1100, 1.4, 1200, 1100, 1.4], {wood: 0.18, chars: 'in2', dark: 0.9}),
  S(113.3, 117.0, 'shed', [850, 1250, 1.8, 900, 1250, 2.2], {wood: 0.14, chars: 'sled', dark: 0.9}),
  S(117.0, 121.4, 'fence', [540, 900, 1.2, 600, 1000, 1.4], {hit: [117.0, 118.6]}, {shake: 6}),
  S(121.4, 125.3, 'shed', [850, 1100, 1.5, 850, 1100, 1.7], {wood: 0.14, chars: 'look2', dark: 0.9}),
  S(125.3, 129.9, 'fence', [700, 1200, 1.7, 700, 1250, 2.0], {hit: [0, 0], done: true}),
  S(129.9, 134.1, 'fence', [600, 900, 1.2, 900, 1000, 1.3], {hit: [0, 0], done: true}),
  S(134.1, 141.2, 'neighbor', [600, 850, 1.1, 740, 900, 1.9], {open: [134.5, 136.5]}),
  S(141.2, 143.5, 'neighbor', [760, 920, 2.0, 780, 930, 2.3], {open: [0, 0], opened: true}),
  S(143.5, 145.4, 'village', [1300, 1100, 1.8, 1350, 1100, 1.9], {dark: 1, drifts: 0.5, chars: 'point'}),
  S(145.4, 149.3, 'neighbor', [600, 900, 1.3, 600, 900, 1.5], {open: [0, 0], opened: true}),
  S(149.3, 153.4, 'neighbor', [600, 900, 1.5, 600, 920, 1.6], {open: [0, 0], opened: true, warm: [149.3, 152.6]}),
  S(153.4, 156.4, 'neighbor', [600, 920, 1.6, 600, 960, 1.4], {open: [0, 0], opened: true}),
  S(156.4, 160.2, 'kitchen', [900, 1000, 1.3, 800, 1000, 1.4], {k: 'sled2'}),
  S(160.2, 163.0, 'kitchen', [1100, 1000, 1.5, 1050, 1000, 1.7], {k: 'ask'}),
  S(163.0, 168.8, 'items', [540, 540, 1.0, 540, 540, 1.15], {}, {hud: false}),
  S(168.8, 173.4, 'village', [1100, 1100, 1.6, 1400, 1100, 1.6], {dark: 1, drifts: 0.5, chars: 'walk3'}),
  S(173.4, 179.5, 'flash', [540, 760, 1.2, 640, 800, 1.3], {mode: 'road'}),
  S(179.5, 185.5, 'flash', [700, 900, 1.3, 800, 960, 1.4], {mode: 'car'}),
  S(185.5, 188.5, 'flash', [800, 800, 1.3, 900, 800, 1.5], {mode: 'gate'}),
  S(188.5, 191.8, 'flash', [900, 800, 1.3, 1000, 800, 1.6], {mode: 'door', knock: [188.6, 190.0]}),
  S(191.8, 195.4, 'flash', [1000, 800, 1.3, 1050, 800, 1.5], {mode: 'window'}),
  S(195.4, 199.5, 'flash', [900, 800, 1.5, 1000, 800, 1.7], {mode: 'door', knock: [195.4, 196.5]}, {shake: 2}),
  S(199.5, 201.1, 'flash', [1100, 800, 1.7, 1100, 800, 1.7], {mode: 'door', knock: [0, 0]}),
  S(201.1, 204.3, 'valroom', [1500, 1050, 1.4, 1200, 1050, 1.4], {k: 'enter'}),
  S(204.3, 209.4, 'valroom', [800, 700, 1.4, 700, 760, 1.5], {k: 'cold'}),
  S(209.4, 211.9, 'valroom', [1500, 1300, 2.0, 1450, 1300, 2.0], {k: 'cold'}),
  S(211.9, 215.8, 'valroom', [450, 1150, 1.6, 450, 1150, 1.9], {k: 'sofa'}),
  S(215.8, 222.8, 'valroom', [1200, 1250, 2.0, 1220, 1250, 2.4], {k: 'sofa'}),
  S(222.8, 227.9, 'valroom', [770, 650, 2.2, 770, 650, 2.6], {k: 'sofa'}),
  S(227.9, 234.8, 'valroom', [800, 1000, 1.3, 1300, 1000, 1.3], {k: 'help'}),
  S(234.8, 240.0, 'kitchen', [1000, 1050, 1.4, 1050, 1050, 1.5], {k: 'val'}),
  S(240.0, 243.2, 'kitchen', [850, 1000, 1.1, 850, 1000, 1.2], {k: 'four'}),
  S(243.2, 248.3, 'cellar', [700, 1100, 1.4, 1100, 1100, 1.4], {chars: 'cel'}),
  S(248.3, 254.0, 'village', [1750, 1000, 1.0, 1750, 1000, 1.2], {dark: 1, drifts: 0.5, chars: 'none'}),
  S(254.0, 262.5, 'kitchen', [900, 1000, 1.3, 1000, 1000, 1.5], {k: 'gen'}),
  S(262.5, 265.7, 'village', [2200, 1100, 1.5, 2300, 1100, 1.6], {dark: 1, drifts: 0.8, chars: 'walk4'}),
  S(265.7, 268.7, 'genout', [700, 900, 1.0, 650, 900, 1.15], {run: 0, dig: true}),
  S(268.7, 274.6, 'shedgen', [850, 1000, 1.3, 900, 1000, 1.5], {run: [0, 0, 0, 1], lamp: 0, chars: 'gen2'}),
  S(274.6, 278.0, 'shedgen', [900, 1150, 2.2, 1000, 1150, 2.4], {run: [0, 0, 0, 1], lamp: 0, chars: 'gen2'}),
  S(278.0, 281.4, 'shedgen', [950, 1300, 2.6, 950, 1300, 2.8], {run: [0, 0, 0, 1], lamp: 0, chars: 'gen2', pull: [278.0, 279.3]}),
  S(281.4, 286.2, 'shedgen', [950, 1300, 2.6, 950, 1300, 2.8], {run: [0, 0, 0, 1], lamp: 0, chars: 'gen2', pull: [281.4, 283.0], pull2: [283.8, 284.4]}),
  S(286.2, 291.0, 'clock20', [540, 540, 1.0, 540, 540, 1.2], {}, {hud: false}),
  S(291.0, 296.85, 'shedgen', [850, 1000, 1.4, 900, 1000, 1.7], {run: [0, 1, 290.8, 291.4], lamp: 0.5, chars: 'gen2', smoke: true}),
  S(296.85, 303.57, 'genout', [700, 900, 1.2, 800, 900, 1.4], {run: 1}),
  S(303.57, 309.5, 'volt', [540, 540, 1.0, 540, 540, 1.25], {}, {hud: false}),
  S(309.5, 316.1, 'canisters', [540, 540, 1.0, 540, 540, 1.3], {level: [0.5, 0.2, 309.5, 316]}, {hud: false}),
  S(316.1, 319.4, 'canisters', [540, 540, 1.3, 540, 540, 1.6], {level: [0.2, 0.2, 0, 1]}, {hud: false}),
  S(319.4, 323.1, 'shedgen', [850, 1000, 1.4, 850, 1000, 1.4], {run: [1, 0, 321.3, 322.0], lamp: 0.2, chars: 'gen2'}),
  S(323.1, 327.0, 'clock19', [540, 540, 1.0, 540, 540, 1.2], {}, {hud: false}),
  S(327.0, 329.8, 'kitchen', [260, 640, 1.8, 260, 640, 2.0], {k: 'win', view: {low: 0, top: 0}}),
  S(329.8, 333.7, 'thermo', [540, 540, 0.9, 540, 540, 1.1], {val: -60}, {hud: false}),
  S(333.7, 341.8, 'kitchen', [1000, 1050, 1.4, 1050, 1050, 1.6], {k: 'valtell', radio: true}),
  S(341.8, 347.9, 'kitchen', [750, 1000, 1.7, 750, 1000, 2.0], {k: 'valtell', radio: true}),
  S(347.9, 350.1, 'kitchen', [1000, 1000, 1.3, 1000, 1000, 1.3], {k: 'valtell'}),
  S(350.1, 356.3, 'phone', [540, 540, 1.0, 540, 540, 1.3], {mode: 'nosig', pct: 23}, {hud: false}),
  S(356.3, 362.0, 'map', [540, 540, 1.0, 540, 540, 1.2], {}, {hud: false}),
  S(362.0, 369.2, 'forest', [1000, 1000, 0.9, 1000, 1050, 1.1], {tracks: false}),
  S(369.2, 372.9, 'forest', [980, 1250, 1.3, 980, 1300, 1.6], {car: true}),
  S(372.9, 375.9, 'phone', [540, 540, 1.3, 540, 540, 1.0], {mode: 'off', pct: 23}, {hud: false}),
  S(375.9, 382.2, 'kitchen', [400, 700, 1.4, 330, 700, 1.7], {k: 'maxwin', view: {low: 0, top: 0}}),
  S(382.2, 387.0, 'kitchen', [330, 700, 1.9, 280, 700, 2.4], {k: 'maxwin', view: {low: [383.43, 384.0], top: 0}}),
  S(387.0, 390.3, 'oldhouse', [330, 1340, 1.6, 330, 1340, 2.4], {lit: 1, top: [0, 0]}),
  S(390.3, 396.95, 'kitchen', [400, 700, 1.4, 400, 700, 1.5], {k: 'maxwin', view: {low: 1, top: 0}}),
  S(396.95, 403.99, 'kitchen', [1000, 1000, 1.5, 1100, 1000, 1.8], {k: 'dedtalk'}),
  S(403.99, 409.9, 'kitchen', [1150, 1050, 1.6, 1150, 1050, 1.9], {k: 'dedtalk'}),
  S(409.9, 416.9, 'forest', [1000, 1100, 0.9, 1000, 1150, 1.1], {tracks: true, muted: 0.8}),
  S(416.9, 421.2, 'forest', [980, 1250, 1.3, 980, 1300, 1.6], {car: true, muted: 0.8}),
  S(421.2, 425.95, 'oldhouse', [540, 1100, 1.0, 540, 1100, 1.1], {lit: 0, top: [0, 0], muted: 0.7}),
  S(425.95, 433.0, 'kitchen', [700, 1000, 1.4, 700, 1000, 1.5], {k: 'dedtalk'}),
  S(433.0, 437.58, 'mug', [540, 540, 1.0, 540, 540, 1.2], {}, {hud: false}),
  S(437.58, 442.75, 'kitchen', [330, 700, 1.4, 330, 700, 1.6], {k: 'freeze', view: {low: 0, top: 0}}),
  S(442.75, 447.8, 'car', [600, 1250, 1.1, 700, 1250, 1.2], {p: [442.8, 450.9]}),
  S(447.8, 450.94, 'car', [800, 1250, 1.8, 780, 1250, 2.2], {p: [442.8, 450.9]}),
  S(450.94, 456.93, 'car', [900, 1250, 1.4, 900, 1250, 1.3], {p: [442.8, 450.9], stop: true, people: [453.3, 454.5]}),
  S(456.93, 463.2, 'car', [1000, 1250, 1.5, 1100, 1250, 1.7], {p: [0, 1], stop: true, people: [0, 0.01], flash: true}),
  S(463.2, 466.04, 'car', [1100, 1350, 1.8, 1150, 1350, 2.0], {p: [0, 1], stop: true, people: [0, 0.01], flash: true}),
  S(466.04, 473.4, 'kitchen', [500, 800, 1.5, 450, 800, 1.7], {k: 'maxcurt'}),
  S(473.4, 476.16, 'kitchen', [450, 800, 1.7, 450, 800, 1.9], {k: 'maxcurt', dim: true}),
  S(476.16, 482.2, 'car', [800, 1250, 1.1, 1200, 1250, 1.1], {p: [476.2, 481.7], move: true}),
  S(482.2, 485.22, 'car', [800, 1250, 1.1, 800, 1250, 1.2], {p: [0, 1], stop: true, oldfar: true}),
  S(485.22, 490.4, 'kitchen', [330, 740, 1.7, 330, 740, 2.2], {k: 'maxcurt', view: {low: 0, top: 0}}),
  S(490.4, 492.76, 'olddoor', [680, 1000, 1.0, 680, 1000, 1.15], {open: [0, 0], light: 0, enter: 0}),
  S(492.76, 495.8, 'olddoor', [680, 1000, 1.1, 680, 1000, 1.3], {open: [492.8, 494.0], light: [494.0, 495.8]}),
  S(495.8, 499.05, 'olddoor', [680, 1050, 1.3, 680, 1050, 1.5], {open: [0, 1], light: [0, 1], enter: [499.0, 500.6]}),
  S(499.05, 502.47, 'olddoor', [680, 1050, 1.5, 680, 1050, 1.5], {open: [500.5, 501.3], light: [0, 1], enter: [499.0, 500.6], close: 501.1}),
  S(502.47, 506.55, 'olddoor', [680, 1000, 1.2, 680, 1000, 1.2], {open: [0, 0], light: [0, 1], offAt: 505.3}),
  S(506.55, 513.2, 'kitchen', [1000, 1050, 1.4, 1100, 1050, 1.5], {k: 'dedfloor'}),
  S(513.2, 520.5, 'kitchen', [1000, 1050, 1.7, 1050, 1050, 1.9], {k: 'dedfloor', up: true}),
  S(520.5, 525.0, 'forest', [1400, 700, 0.9, 1400, 800, 1.1], {tower: true}),
  S(525.0, 528.25, 'kitchen', [1050, 1050, 1.8, 1050, 1050, 2.0], {k: 'dedtalk'}),
  S(528.25, 533.7, 'forest', [1400, 900, 1.1, 1400, 700, 1.4], {tower: true}),
  S(533.7, 539.4, 'kitchen', [1000, 1050, 1.6, 1000, 1050, 1.7], {k: 'dedtalk'}),
  S(539.4, 544.5, 'kitchen', [450, 800, 1.5, 330, 760, 1.9], {k: 'maxcurt2', view: {low: 0, top: 0}}),
  S(544.5, 549.2, 'oldhouse', [540, 1100, 1.0, 540, 1100, 1.2], {lit: 0, top: [0, 0]}),
  S(549.2, 554.4, 'tracks', [1000, 1150, 1.0, 1000, 1200, 1.3], {}),
  S(554.4, 560.4, 'kitchen', [800, 1250, 1.6, 700, 1250, 2.4], {k: 'photo'}),
  S(560.4, 564.8, 'photo', [540, 540, 1.0, 540, 540, 1.25], {hl: -1}, {hud: false}),
  S(564.8, 566.5, 'photo', [540, 540, 1.25, 330, 600, 1.8], {hl: 0}, {hud: false}),
  S(566.5, 568.77, 'photo', [330, 600, 1.8, 540, 600, 1.8], {hl: 1}, {hud: false}),
  S(568.77, 571.26, 'photo', [540, 600, 1.8, 700, 620, 2.6], {hl: 2}, {hud: false}),
  S(571.26, 576.76, 'photo', [700, 620, 2.6, 700, 620, 3.4], {hl: 2}, {hud: false, shake: 2}),
  S(576.76, 580.0, 'radiofinal', [540, 540, 1.0, 540, 540, 1.4], {}, {hud: false, shake: 2}),
  S(580.0, END_WORLD, 'black', [540, 540, 1, 540, 540, 1], {}, {hud: false}),
];

const kitchenProps = (t: number, p: any) => {
  const k: string = p.k ?? 'win';
  const flame = 0.8 + 0.1 * Math.sin(t * 3);
  const dedSit = IL(1170, 1500, poseSit({nod: Math.sin(t * 0.8) * 3}), false, DED_HOME);
  const dedStand = (x: number, flip = true) => IL(x, 1500, poseStand({nod: 2}), flip, DED_HOME);
  const iw = (x: number, o: Partial<Pose> = {}) => IL(x, 1500, poseStand({lean: 8, nod: 4, ...o}), true, ILYA_IN);
  const mw = (x: number, o: Partial<Pose> = {}) => IL(x, 1500, poseStand({lean: 6, ...o}), true, {...MAX_OUT, hat: 'none', jacket: '#3a4a44', jacket2: '#4a5a54', hair: '#2a2420'});
  const chars: CharSpec[] = [];
  switch (k) {
    case 'win': chars.push(iw(480), dedStand(1000, true)); break;
    case 'wipe': chars.push(IL(470, 1500, poseReach(60, -300, {lean: 6}), true, ILYA_IN), dedStand(1000)); break;
    case 'maxphone': chars.push(iw(450), mw(600, {hf: [60, -250], hb: [30, -240]})); break;
    case 'turn': chars.push(IL(650, 1500, poseStand({nod: 4}), false, ILYA_IN), dedStand(950)); break;
    case 'grandmid': chars.push(IL(560, 1500, poseStand({nod: 4}), false, ILYA_IN), dedStand(900, true)); break;
    case 'ask': chars.push(IL(620, 1500, poseStand({nod: 4}), false, ILYA_IN), IL(1000, 1500, poseStand(), true, DED_HOME)); break;
    case 'stove': chars.push(IL(1190, 1500, poseReach(70, -150, {lean: 22, hip: [0, -104]}), false, DED_HOME), IL(900, 1500, poseStand({nod: 4}), false, ILYA_IN)); break;
    case 'sled': chars.push(IL(lerp(300, 780, E(t, 84, 87)), 1500, poseCarry(t), false, ILYA_SC), IL(lerp(150, 620, E(t, 84.5, 87.5)), 1500, poseCarry(t), false, MAX_SC), dedSit); break;
    case 'sled2': chars.push(IL(lerp(300, 780, E(t, 156.5, 158.8)), 1500, poseCarry(t), false, ILYA_SC), IL(lerp(150, 620, E(t, 156.7, 159)), 1500, poseCarry(t), false, MAX_SC), dedSit); break;
    case 'dress': chars.push(IL(620, 1500, poseReach(60, -170, {lean: 6}), false, t > 92 ? ILYA_SC : ILYA_OUT), IL(800, 1500, poseReach(60, -170, {lean: 6}), false, t > 92 ? MAX_SC : MAX_OUT), dedSit); break;
    case 'val': chars.push(dedSit, IL(980, 1500, poseSit({nod: 4}), false, {...VAL_IN})); break;
    case 'four': chars.push(dedSit, IL(980, 1500, poseSit({nod: 4}), false, VAL_IN), IL(620, 1500, poseStand({nod: 3}), false, ILYA_IN), IL(780, 1500, poseStand(), false, {...MAX_OUT, hat: 'none', jacket: '#3a4a44', hair: '#2a2420'})); break;
    case 'gen': chars.push(IL(1100, 1500, poseSit({hf: [100, -130], hb: [30, -76]}), false, DED_HOME), IL(640, 1500, poseStand({nod: 4}), false, ILYA_IN), IL(500, 1500, poseStand(), false, {...MAX_OUT, hat: 'none', jacket: '#3a4a44', hair: '#2a2420'}), IL(980, 1500, poseSit(), false, VAL_IN)); break;
    case 'valtell': chars.push(dedSit, IL(1000, 1500, poseSit({nod: 5}), false, VAL_IN), IL(620, 1500, poseStand({nod: 3}), false, ILYA_IN)); break;
    case 'maxwin': chars.push(IL(430, 1500, poseStand({lean: 6, nod: 4}), true, {...MAX_OUT, hat: 'none', jacket: '#3a4a44', jacket2: '#4a5a54', hair: '#2a2420'}), IL(620, 1500, poseStand({nod: 3}), true, ILYA_IN), dedSit); break;
    case 'dedtalk': chars.push(dedSit, IL(760, 1500, poseStand({nod: 4}), false, ILYA_IN), IL(600, 1500, poseStand(), false, {...MAX_OUT, hat: 'none', jacket: '#3a4a44', hair: '#2a2420'}), IL(1000, 1500, poseSit(), false, VAL_IN)); break;
    case 'freeze': chars.push(IL(440, 1500, poseStand({nod: 3}), true, {...MAX_OUT, hat: 'none', jacket: '#3a4a44', hair: '#2a2420'}), IL(600, 1500, poseStand(), true, ILYA_IN)); break;
    case 'maxcurt': case 'maxcurt2': chars.push(IL(460, 1500, poseReach(60, -300, {lean: 6}), true, ILYA_IN), mw(620)); break;
    case 'dedfloor': chars.push(IL(1170, 1500, poseSit({nod: p.up ? -2 : 20}), false, DED_HOME), IL(760, 1500, poseStand({nod: 4}), false, ILYA_IN), IL(980, 1500, poseSit(), false, VAL_IN)); break;
    case 'photo': chars.push(dedSit, IL(760, 1500, poseStand({nod: 12}), false, ILYA_IN)); break;
    default: break;
  }
  let view: React.ReactNode = undefined;
  if (p.view) {
    const v = p.view;
    const low = Array.isArray(v.low) ? lerp(0, 1, E(t, v.low[0], v.low[1])) : v.low ?? 0;
    const wipe = v.wipe ? E(t, v.wipe[0], v.wipe[1]) : 0;
    view = <NightView2 t={t} low={low} top={v.top ?? 0} frost={v.frost !== undefined ? v.frost : v.wipe ? 0.9 * (1 - wipe) : 0} />;
  }
  return {
    t, lamp: 0, bulbFlick: 1, power: 1, flame: p.k === 'stove' ? 1 : flame, curtain: ['win', 'wipe', 'maxphone', 'maxwin', 'maxcurt', 'maxcurt2', 'freeze'].includes(k) ? -0.75 : 0.1, tv: 'off' as const, tvBanner: 0, tvTurn: 0,
    radioOn: p.radio ? 0.7 : 0, needle: 0.5, noise: p.radio ? 0.35 : 0.1, water: 1, chars, outTemp: -60, outRed: 1, shutters: 0, cold: 0, view, knock: 0,
  };
};

const HomeT: React.FC<{x: number; y: number; s: number; v: number}> = ({x, y, s, v}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-60} y={-110} width={120} height={220} rx={24} fill="#d9c7a0" stroke="#5a3a24" strokeWidth={6} />
    <rect x={-46} y={-96} width={92} height={56} rx={10} fill="#05070c" />
    <Tx x={0} y={-52} size={40} fill="#ff9a2a">{`+${v}`}</Tx>
    <rect x={-8} y={-30} width={16} height={110} rx={8} fill="#fff" /><rect x={-5} y={20} width={10} height={60} rx={5} fill="#ff6a4a" /><circle cx={0} cy={84} r={16} fill="#ff6a4a" />
  </g>
);

const Scene: React.FC<{sh: Shot; t: number}> = ({sh, t}) => {
  const p = sh.p ?? {};
  switch (sh.sc) {
    case 'black': return <rect x={-3000} y={-3000} width={9000} height={9000} fill="#000" />;
    case 'kitchen': return <Kitchen {...(kitchenProps(t, p) as any)} />;
    case 'oldhouse': {
      const top = p.top ? (p.top[0] === 99 ? 0 : E(t, p.top[0], p.top[1]) || (p.top[0] === 0 && p.top[1] === 0 ? 0 : 0)) : 0;
      const topFinal = p.top && p.top[0] === 0 && p.top[1] === 0 && sh.a < 20 ? 1 : top;
      const lit = p.lit;
      return <g><OldHouse t={t} lit={lit} top={sh.a >= 8.5 && sh.a < 34 ? (p.top && p.top[0] === 8.54 ? top : 1) : topFinal} shadow={0} cx={540} />{p.muted && <rect x={-3000} y={-1500} width={7000} height={4000} fill="#8a8f98" opacity={p.muted * 0.35} />}</g>;
    }
    case 'phone': {
      const mode = p.mode === 'blur' ? 'blank' : p.mode;
      return (
        <g>
          <rect x={-3000} y={-1500} width={7000} height={4000} fill="#0a0e18" />
          <Glow x={540} y={540} r={700} c="#5a7aa8" o={0.2} id="p61g" />
          <Phone x={540} y={540} s={1.3} mode={mode} t={t} bars={0} />
          {p.mode === 'blur' && <g><Glow x={540} y={520} r={260} c="#ffd25a" o={0.8 + 0.1 * Math.sin(t * 3)} id="p61y" /><ellipse cx={540} cy={520} rx={120 + 10 * Math.sin(t * 2)} ry={90} fill="#ffd25a" opacity={0.7} /></g>}
          {p.pct !== undefined && <g><rect x={430} y={190} width={220} height={52} rx={14} fill="#0a1020" opacity={0.8} /><Tx x={540} y={228} size={36} fill={p.pct < 30 ? '#ff6a4a' : '#fff'}>{`${p.pct}%`}</Tx></g>}
        </g>
      );
    }
    case 'thermo': return <g><rect x={-3000} y={-1500} width={7000} height={4000} fill="#6a7686" /><Snow t={t} n={80} speed={200} wind={160} op={0.8} size={1.6} w={1920} h={1080} x0={-400} y0={-200} /><OutThermo x={540} y={540} s={1.6} value={p.val} red={1} t={t} /></g>;
    case 'hthermo': return <g><rect x={-3000} y={-1500} width={7000} height={4000} fill="#3a2a1e" /><Glow x={540} y={540} r={700} c="#ff9a3a" o={0.3} id="h61g" /><HomeT x={540} y={540} s={3.2} v={t >= p.at && p.at ? p.v2 : p.v} /></g>;
    case 'village': {
      const chars: CharSpec[] = [];
      const gy = 1380;
      if (p.chars === 'out2') chars.push(IL(lerp(1150, 1240, E(t, 95, 98)), gy, poseShiver(t), false, ILYA_SC), IL(lerp(1050, 1160, E(t, 95, 98)), gy, poseShiver(t + 1), false, MAX_SC));
      if (p.chars === 'walk2') { const x = lerp(1250, 1700, E(t, 100.6, 106)); chars.push(IL(x, gy, poseWalk(t, 2.6, 18), false, ILYA_SC), IL(x - 130, gy, poseWalk(t + 0.3, 2.6, 18), false, MAX_SC)); }
      if (p.chars === 'point') chars.push(IL(1280, gy, poseReach(80, -170, {lean: 8}), false, ILYA_SC), IL(1400, gy, poseStand({nod: 4}), true, MAX_SC));
      if (p.chars === 'walk3') { const x = lerp(1180, 1550, E(t, 168.9, 173.4)); chars.push(IL(x, gy, poseWalk(t, 2.6, 18), false, ILYA_SC), IL(x - 140, gy, poseWalk(t + 0.2, 2.6, 18), false, {...MAX_SC})); }
      if (p.chars === 'walk4') { const x = lerp(2150, 2320, E(t, 262.6, 265.5)); chars.push(IL(x, gy, poseWalk(t, 2.6, 18), false, ILYA_SC), IL(x - 140, gy, poseWalk(t + 0.2, 2.6, 18), false, MAX_SC)); }
      return (
        <g>
          <Village t={t} dark={1} others={0} old={0} snowI={1} cx={lerp(sh.cam[0], sh.cam[3], 0.5)} chars={chars} drifts={p.drifts ?? 0.5} smoke={0.5} />
          <rect x={-4000} y={-1500} width={9000} height={4400} fill="#04070f" opacity={0.35} />
        </g>
      );
    }
    case 'shed': {
      const chars: CharSpec[] = [];
      if (p.chars === 'door') chars.push(IL(480, 1500, poseReach(60, -150), false, ILYA_SC));
      if (p.chars === 'in2') chars.push(IL(lerp(480, 800, E(t, 108, 111)), 1500, poseWalk(t, 2.6, 16), false, ILYA_SC), IL(lerp(300, 650, E(t, 108.3, 111.3)), 1500, poseWalk(t + 0.2, 2.6, 16), false, MAX_SC));
      if (p.chars === 'sled') chars.push(IL(700, 1500, poseReach(60, -90, {lean: 30, hip: [0, -96]}), false, ILYA_SC), IL(980, 1500, poseReach(-60, -90, {lean: 30, hip: [0, -96]}), true, MAX_SC));
      if (p.chars === 'look2') chars.push(IL(620, 1500, poseStand({nod: -4}), true, MAX_SC), IL(820, 1500, poseStand({nod: -4}), true, ILYA_SC));
      return <g><Shed t={t} wood={p.wood} chars={chars} dark={0.9} /><rect x={-3000} y={-1500} width={7000} height={4000} fill="#05080f" opacity={0.25} /></g>;
    }
    case 'fence': return <g><FenceScene t={t} hit={p.done ? 1 : E(t, p.hit[0], p.hit[1])} /></g>;
    case 'neighbor': { const op = p.opened ? 1 : E(t, p.open[0], p.open[1]); const wm = p.warm ? 1 - E(t, p.warm[0], p.warm[1]) : 0; return <NeighborHouse t={t} open={op} warm={wm} />; }
    case 'items': return (
      <g>
        <rect x={-3000} y={-1500} width={7000} height={4000} fill="#241a12" />
        <g transform="translate(300 600)"><rect x={0} y={0} width={420} height={80} rx={20} fill="#c9a82a" stroke="#6a4a0a" strokeWidth={6} /><circle cx={440} cy={40} r={64} fill="#8d94a3" stroke="#555" strokeWidth={6} /><circle cx={440} cy={40} r={40} fill="#fff6c8" /><Glow x={440} y={40} r={380} c="#fff6c8" o={0.5} id="fl61" /></g>
        <g transform="translate(300 780) rotate(-6)"><rect x={0} y={0} width={620} height={26} rx={13} fill="#555c6a" stroke="#222" strokeWidth={4} /><path d="M600 0 Q680 -40 700 -100" fill="none" stroke="#555c6a" strokeWidth={26} strokeLinecap="round" /></g>
      </g>
    );
    case 'flash': { const kn = p.knock ? E(t, p.knock[0], p.knock[1]) * (1 - E(t, p.knock[1], p.knock[1] + 0.8)) : 0; return <FlashWalk t={t} mode={p.mode} knock={p.knock && p.knock[1] > 0 ? (t < p.knock[1] + 0.5 && t >= p.knock[0] ? 1 : 0.0) : 0} />; }
    case 'valroom': {
      const chars: CharSpec[] = [];
      const mk = p.k;
      if (mk === 'enter') chars.push(IL(lerp(1550, 1200, E(t, 201.3, 203.6)), 1500, poseWalk(t, 2.6, 14), true, ILYA_SC), IL(lerp(1750, 1380, E(t, 201.6, 203.8)), 1500, poseWalk(t + 0.2, 2.6, 14), true, MAX_SC));
      if (mk === 'cold') chars.push(IL(1250, 1500, poseStand({nod: -3}), true, ILYA_SC), IL(1400, 1500, poseStand(), true, MAX_SC));
      if (mk === 'sofa') chars.push(IL(430, 1500, poseSit({nod: 8, lean: 12}), false, VAL_IN), IL(900, 1500, poseStand({nod: 6}), true, ILYA_SC));
      if (mk === 'help') { const x = lerp(520, 1400, E(t, 230.7, 234.4)); chars.push(IL(x, 1500, poseWalk(t, 2.2, 14), false, VAL_OUT), IL(x - 120, 1500, poseWalk(t + 0.1, 2.2, 14), false, ILYA_SC), IL(x + 120, 1500, poseWalk(t + 0.2, 2.2, 14), false, MAX_SC)); }
      return <ValRoom t={t} chars={chars} beam={0.5} door={mk === 'enter' ? E(t, 201.1, 202.0) : 0.8} />;
    }
    case 'cellar': { const chars: CharSpec[] = [IL(lerp(900, 1150, E(t, 243.5, 246)), 1500, poseStand({nod: 5}), true, ILYA_SC)]; return <Cellar t={t} chars={chars} show={1} />; }
    case 'genout': return <GenOutside t={t} run={p.run} />;
    case 'shedgen': {
      const run = Array.isArray(p.run) ? lerp(p.run[0], p.run[1], E(t, p.run[2] || 0, p.run[3] || 1)) : p.run;
      const rr = sh.a >= 291 ? (sh.a >= 319 ? (t < 321.3 ? 1 : 0) : 1) : 0;
      const pull = p.pull ? E(t, p.pull[0], p.pull[0] + 0.5) * (1 - E(t, p.pull[0] + 0.5, p.pull[1])) : p.pull2 ? E(t, p.pull2[0], p.pull2[0] + 0.3) * (1 - E(t, p.pull2[0] + 0.3, p.pull2[1])) : 0;
      const chars: CharSpec[] = [];
      if (p.chars === 'gen2') chars.push(IL(560, 1500, poseReach(70, -150, {lean: 26, hip: [0, -100]}), false, ILYA_SC), IL(1100, 1500, poseStand({nod: 5}), true, MAX_SC));
      const lamp = rr ? Math.max(0.35, p.lamp) : 0;
      return <ShedGen t={t} run={rr ? 1 : (p.run && p.run[3] === 1 && p.run[1] === 0 ? 0 : run)} lamp={lamp} chars={chars} pull={pull} smoke={rr ? 1 : 0} />;
    }
    case 'clock20': return <g><rect x={-3000} y={-1500} width={7000} height={4000} fill="#1a1410" /><ClockArt x={540} y={540} s={1.6} h={7} m={Math.floor(lerp(0, 20, E(t, 286.2, 290.4)) * 1) + 0} t={t} /><Tx x={540} y={1000} size={50} fill="#9fb4d0" o={0.7}>{`${Math.round(lerp(0, 20, E(t, 286.2, 290.4)))} мин`}</Tx></g>;
    case 'clock19': return <g><rect x={-3000} y={-1500} width={7000} height={4000} fill="#3a2a1e" /><ClockArt x={540} y={540} s={1.6} h={7} m={52} t={t} /></g>;
    case 'volt': return <Voltmeter t={t} on={E(t, 305, 306)} />;
    case 'canisters': return <Canisters t={t} level={Array.isArray(p.level) ? lerp(p.level[0], p.level[1], E(t, p.level[2], p.level[3])) : p.level} />;
    case 'map': return (
      <g>
        <rect x={-3000} y={-1500} width={7000} height={4000} fill="#0d1526" />
        <g transform="translate(540 540)"><rect x={-420} y={-300} width={840} height={600} rx={20} fill="#1e2c48" stroke="#4a6aa0" strokeWidth={6} /><path d="M-300 220 Q-120 80 20 120 T300 -200" stroke="#6a8ac8" strokeWidth={10} fill="none" strokeDasharray="30 16" /><circle cx={-300} cy={220} r={20} fill="#ffd27a" /><circle cx={300} cy={-200} r={20} fill="#fff" /><Tx x={-300} y={270} size={34} fill="#ffd27a">деревня</Tx><Tx x={330} y={-240} size={34} anchor="end" fill="#fff">город</Tx><Tx x={0} y={0} size={80} fill="#fff" o={E(t, 360.2, 361)}>300 км</Tx></g>
      </g>
    );
    case 'forest': return <ForestRoad t={t} car={p.car} tower={p.tower} tracks={p.tracks} muted={p.muted ?? 0} />;
    case 'tracks': return <ForestRoad t={t} tracks />;
    case 'mug': return <MugHands t={t} />;
    case 'car': {
      const pr = p.p ? (p.move ? E(t, p.p[0], p.p[1]) : E(t, p.p[0], p.p[1])) : 1;
      const peo = p.people ? (p.people[1] > 1 ? E(t, p.people[0], p.people[1]) : 1) : 0;
      return <g><StreetCar t={t} p={p.stop ? 1 : pr} stopped={p.stop} people={peo} />{p.flash && <g><polygon points="1500,1000 600,1250 700,1400" fill="#fff6c8" opacity={0.15 + 0.1 * Math.sin(t * 3)} /></g>}{p.oldfar && <g><rect x={1700} y={1000} width={300} height={300} fill="#14100c" /><path d="M1660 1000 L1850 880 L2040 1000 Z" fill="#dfe9f7" /></g>}</g>;
    }
    case 'olddoor': {
      const open = p.open ? (p.open[1] > 1 ? E(t, p.open[0], p.open[1]) * (p.close && t > p.close ? 0 : 1) : p.open[1]) : 0;
      let light = p.light ? (Array.isArray(p.light) ? lerp(p.light[0], p.light[1], E(t, p.light[0] > 1 ? p.light[0] : 0, p.light[0] > 1 ? p.light[1] : 1)) : p.light) : 0;
      if (p.offAt) light = t < p.offAt ? 1 : 0;
      const en = p.enter ? (Array.isArray(p.enter) ? E(t, p.enter[0], p.enter[1]) : p.enter) : 0;
      const op2 = p.close && t > p.close ? 0 : open;
      return <OldDoor t={t} open={t >= 492.8 && t < 501.1 ? Math.max(op2, 0.85) : t >= 501.1 ? 0 : open} light={t >= 494 && t < 505.3 ? Math.min(1, (t - 494) / 1.2) : 0} enter={en} />;
    }
    case 'photo': return <PhotoArt t={t} hl={p.hl} />;
    case 'radiofinal': {
      const on = E(t, 577.2, 577.5);
      const needle = 0.5 + 0.35 * Math.sin(t * 9) * on;
      return <g><rect x={-3000} y={-1500} width={7000} height={4000} fill="#2a1e16" /><Glow x={540} y={540} r={800} c="#ffb04a" o={0.3 * on} id="rf" /><Radio x={540} y={540} s={2.2} t={t} on={on} needle={needle} noise={on * 0.8} /></g>;
    }
    default: return null;
  }
};

const ShotView: React.FC<{sh: Shot; t: number}> = ({sh, t}) => {
  const k = ease(clamp((t - sh.a) / Math.max(0.01, sh.b - sh.a)));
  const c = sh.cam;
  const fx = lerp(c[0], c[3], k), fy = lerp(c[1], c[4], k), s = lerp(c[2], c[5], k);
  const shk = sh.shake ?? 0;
  const outdoor = ['village', 'shed', 'fence', 'neighbor', 'flash', 'genout', 'car', 'forest', 'tracks', 'olddoor'].includes(sh.sc);
  const f = ['kitchen', 'valroom', 'shedgen', 'cellar'].includes(sh.sc) ? 0.7 : ['photo', 'phone', 'thermo', 'hthermo', 'map', 'mug', 'volt', 'canisters', 'clock20', 'clock19', 'items', 'radiofinal'].includes(sh.sc) ? 0.8 : 0.7;
  const ww = 1920, hh = 1080;
  void outdoor; void hh;
  return (
    <AbsoluteFill>
      <svg width={ww} height={1080} viewBox="0 0 1920 1080" style={{position: 'absolute', left: 0, top: 0}}>
        <g transform={`translate(${960 + shk * Math.sin(t * 61)} ${540 + shk * Math.cos(t * 53)}) scale(${s * f}) translate(${-fx} ${-fy})`}>
          <Scene sh={sh} t={t} />
        </g>
        {['village', 'shed'].includes(sh.sc) && <g><Snow t={t} n={140} speed={260} wind={260} op={0.75} size={2.2} w={1920} h={1080} /></g>}
      </svg>
    </AbsoluteFill>
  );
};

export const M61: React.FC = () => {
  const frame = useCurrentFrame();
  const t = (frame / FPS61) * SPEED;
  const idx = SH.findIndex((s) => t >= s.a && t < s.b);
  const sh = SH[Math.max(0, idx)];
  const SFX = (a: number, d: number, src: string, v: number | ((f: number) => number)) => (
    <Sequence key={`${src}${a}`} from={Math.round((a / SPEED) * FPS61)} durationInFrames={Math.round(d * FPS61)}>
      <Audio src={staticFile(`sfx/${src}.mp3`)} volume={v} />
    </Sequence>
  );
  const rampT = (pts: [number, number][]) => ramp(pts.map(([a, v]) => [a / SPEED, v] as [number, number]));
  const music = rampT([[0, 0.05], [198.5, 0.05], [199.5, 0], [203, 0], [205, 0.04], [275, 0.04], [276, 0], [281.5, 0], [283, 0.04], [501.5, 0.04], [502.5, 0], [507, 0], [509, 0.04], [569, 0.04], [571, 0], [583, 0]]);
  const wind = rampT([[0, 0.07], [60, 0.06], [77, 0.08], [94, 0.12], [120, 0.1], [160, 0.06], [168, 0.12], [201, 0.04], [204, 0.02], [244, 0.04], [262, 0.1], [300, 0.04], [325, 0.06], [440, 0.05], [560, 0.04], [576, 0.03], [580, 0]]);
  const hum = rampT([[0, 0.06], [200, 0.06], [260, 0.03], [440, 0.05], [504, 0.05], [506, 0], [560, 0.04], [576, 0.0]]);
  const fire = rampT([[0, 0.03], [94, 0.03], [95, 0], [155, 0], [157, 0.035], [262, 0.035], [263, 0], [323, 0], [325, 0.035], [576, 0.035], [580, 0]]);
  const engine = rampT([[290.6, 0], [291.2, 0.07], [319.5, 0.07], [321.4, 0.0]]);
  const staticN = rampT([[576.8, 0], [577.3, 0.07], [579.9, 0.09], [580, 0]]);
  const ev: React.ReactNode[] = [
    SFX(8.54, 1.6, 'hit', 0.09), SFX(51.99, 0.6, 'crack', 0.12), SFX(58.2, 0.5, 'clank', 0.1), SFX(62, 0.5, 'clank', 0.08),
    SFX(106.4, 0.9, 'creak', 0.08), SFX(113.5, 0.5, 'thud', 0.06), SFX(117.0, 1.0, 'clank', 0.15), SFX(117.1, 0.8, 'crack', 0.08), SFX(130, 0.8, 'whoosh', 0.1),
    SFX(188.6, 0.5, 'knock', 0.12), SFX(189.2, 0.5, 'knock', 0.12), SFX(189.8, 0.5, 'knock', 0.12), SFX(195.5, 0.5, 'knock', 0.12), SFX(196.1, 0.5, 'knock', 0.12),
    SFX(201.2, 1.0, 'creak', 0.08), SFX(265.8, 0.7, 'drag', 0.08), SFX(279.0, 0.6, 'drag', 0.09), SFX(280.3, 0.7, 'diesel', 0.06), SFX(282.8, 0.6, 'drag', 0.09), SFX(283.2, 0.8, 'diesel', 0.06), SFX(284.2, 0.6, 'thud', 0.05),
    SFX(321.4, 1.0, 'tick', 0.1), SFX(437.7, 4.0, 'engine', 0.05), SFX(450.9, 1.0, 'thud', 0.07), SFX(453.6, 0.6, 'thud', 0.07), SFX(454.4, 0.6, 'thud', 0.06), SFX(461.2, 0.6, 'thud', 0.06),
    SFX(476.3, 5.0, 'engine', 0.05), SFX(492.8, 1.2, 'creak', 0.08), SFX(501.2, 0.6, 'thud', 0.09), SFX(505.3, 0.4, 'click', 0.1), SFX(577.2, 0.4, 'click', 0.1),
  ];
  return (
    <AbsoluteFill style={{backgroundColor: '#000'}}>
      <Audio src={staticFile('voice11s.mp3')} volume={1} />
      <Audio src={staticFile('sfx/m60.mp3')} volume={music} loop />
      <Audio src={staticFile('sfx/wind.mp3')} volume={wind} loop />
      <Audio src={staticFile('sfx/drone.mp3')} volume={hum} loop />
      <Audio src={staticFile('sfx/fire.mp3')} volume={fire} loop />
      <Audio src={staticFile('sfx/engine.mp3')} volume={engine} loop />
      <Audio src={staticFile('sfx/static.mp3')} volume={staticN} loop />
      {ev}
      <ShotView sh={sh} t={t} />
      {sh.hud !== false && ['village', 'shed', 'fence', 'neighbor', 'flash', 'genout', 'car', 'forest', 'tracks', 'olddoor', 'oldhouse'].includes(sh.sc) && (
        <AbsoluteFill>
          <svg width={1920} height={1080} viewBox="0 0 1920 1080"><g transform="translate(0 -58)"><TempHud value={-60} t={t} mode="out" red={1} /></g></svg>
        </AbsoluteFill>
      )}
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 55%, rgba(4,8,18,0.5) 100%)'}} />
      <AbsoluteFill style={{backgroundColor: '#000', opacity: t >= 580 ? 1 : 0}} />
    </AbsoluteFill>
  );
};
