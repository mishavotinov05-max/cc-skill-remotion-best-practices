import React from 'react';
import '@fontsource/montserrat/cyrillic-800.css';
import '@fontsource/montserrat/latin-800.css';
import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {ramp} from './Everest';
import {clamp, ease, lerp, Tx, E, Pose, poseStand, poseWalk, poseReach} from './M60Base';
import {Full, G, Forest, Bear, BearFront, Vasya, VSpec, Lesnik, poseLie, poseCover, poseKneel, BearHeadClose, PawsClose, PhoneGround, BackpackClose} from './M64Art';
import {DIAGS} from './M64Diag';
import subs from './subs_s5.json';

export const FPS64 = 30;
export const DUR64 = 1324.2;

type Cam = [number, number, number, number, number, number];
type Shot = {a: number; b: number; sc: string; cam: Cam; p?: any; shake?: number};
const C = (x: number, y: number, z0: number, z1 = z0, x1 = x, y1 = y): Cam => [x, y, z0, x1, y1, z1];
const S = (a: number, b: number, sc: string, cam: Cam, p: any = {}, shake = 0): Shot => ({a, b, sc, cam, p, shake});
const vxT = (t: number) => 300 + (t - 13) * 29.3;
const CUB = {col: '#8a6440', sn: '#b08a60'};

// ---------- timeline ----------
const SH: Shot[] = [
  // ===== PART 1: hook + walk + meeting =====
  S(0, 3.3, 'front', C(960, 600, 1), {s: [0.5, 0.95]}, 3),
  S(3.3, 6.84, 'front', C(960, 560, 1.1, 1.3), {s: [0.95, 1.6]}, 6),
  S(6.84, 10.4, 'bearhead', C(960, 540, 1, 1.1), {mood: 'alert', tod: 0.55}, 2),
  S(10.4, 13.3, 'w', C(500, 640, 1.2, 1.3), {v: {x: [300, 300], pose: 'stand'}, tod: 0.02, loc: 'trail', flash: 1}),
  S(13.3, 16.0, 'w', C(vxT(13.3) + 200, 650, 1.1, 1.15, vxT(16) + 200, 650), {v: {x: [vxT(13.3), vxT(16)], pose: 'walk'}, tod: 0.02, loc: 'trail', birds: 1}),
  S(16.0, 19.2, 'w', C(vxT(16) + 600, 380, 1.3, 1.6, vxT(19.2) + 700, 300), {v: {x: [vxT(16), vxT(19.2)], pose: 'walk'}, tod: 0.02, loc: 'trail', birds: 1}),
  S(19.2, 22.2, 'w', C(vxT(19.2) + 40, 800, 2.3, 2.5, vxT(22.2) + 40, 800), {v: {x: [vxT(19.2), vxT(22.2)], pose: 'walk'}, tod: 0.02, loc: 'trail', steps: 1}),
  S(22.2, 25.0, 'w', C(vxT(22.2) + 100, 700, 1.3, 1.2, vxT(25) + 100, 680), {v: {x: [vxT(22.2), vxT(25)], pose: 'walk'}, tod: 0.03, loc: 'trail', birds: 1}),
  S(25.0, 30.0, 'w', C(vxT(25) + 300, 650, 0.95, 0.9, vxT(30) + 300, 650), {v: {x: [vxT(25), vxT(30)], pose: 'walk'}, tod: 0.03, loc: 'trail', birds: 1}),
  S(30.0, 34.2, 'w', C(vxT(30) + 20, 700, 2.1, 2.3, vxT(34.2) + 20, 700), {v: {x: [vxT(30), vxT(34.2)], pose: 'walk', flip: false}, tod: 0.04, loc: 'trail'}),
  S(34.2, 40.0, 'w', C(vxT(34.2) + 300, 640, 1.0, 1.15, vxT(40) + 300, 640), {v: {x: [vxT(34.2), vxT(40)], pose: 'walk'}, tod: 0.05, loc: 'trail', still: 1}),
  S(40.0, 42.3, 'w', C(vxT(40) + 200, 560, 1.2, 1.3), {v: {x: [vxT(40), vxT(40)], pose: 'stand'}, tod: 0.05, loc: 'trail', still: 1}),
  S(42.3, 45.0, 'w', C(vxT(42.3) + 500, 700, 1.3, 1.5, vxT(42.3) + 900, 700), {v: {x: [vxT(40), vxT(40)], pose: 'stand'}, tod: 0.05, loc: 'trail', bush: [42.3, 44.5], still: 1}, 1),
  S(45.0, 49.5, 'w', C(vxT(45) + 60, 660, 1.6, 1.8), {v: {x: [1237, 1237], pose: 'stand'}, tod: 0.06, loc: 'clearing'}),
  S(49.5, 54.0, 'w', C(1300, 560, 1.7, 2.6, 1450, 520), {v: {x: [1380, 1500], pose: 'frozen'}, tod: 0.06, loc: 'clearing'}, 2),
  S(54.0, 59.2, 'w', C(1500, 640, 0.75, 0.8, 2400, 640), {v: {x: [1500, 1500], pose: 'frozen'}, e: {x: [2900, 2900], mode: 'sniff'}, tod: 0.06, loc: 'clearing'}),
  S(59.2, 61.3, 'bearhead', C(960, 540, 1, 1.1), {mood: 'calm', tod: 0.06}),
  S(61.3, 63.5, 'paws', C(960, 540, 1), {speed: 0.45, tod: 0.06}),
  S(63.5, 66.5, 'bearhead', C(900, 540, 1, 1.15), {mood: 'calm', tod: 0.06}),
  S(66.5, 71.0, 'w', C(2500, 680, 1.4, 1.5, 2800, 680), {v: {x: [1500, 1500], pose: 'frozen'}, e: {x: [2900, 2900], mode: 'sniff'}, tod: 0.06, loc: 'clearing'}),
  S(71.0, 74.5, 'w', C(2800, 600, 1.5, 1.9, 2800, 560), {e: {x: [2900, 2900], mode: 'up'}, tod: 0.06, loc: 'clearing'}),
  S(74.5, 77.5, 'w', C(1700, 650, 0.9, 0.95, 1900, 650), {v: {x: [1500, 1500], pose: 'frozen'}, e: {x: [2900, 2880], mode: 'idle'}, tod: 0.06, loc: 'clearing'}),
  S(77.5, 80.0, 'w', C(1500, 620, 1.9, 2.1), {v: {x: [1500, 1500], pose: 'frozen'}, tod: 0.06, loc: 'clearing'}, 1),
  S(80.0, 84.5, 'w', C(2300, 650, 0.85, 0.95, 2500, 650), {v: {x: [1500, 1500], pose: 'frozen'}, e: {x: [2880, 2760], mode: 'walk'}, tod: 0.06, loc: 'clearing'}),
  S(84.5, 89.0, 'w', C(1500, 560, 2.2, 2.6, 1500, 520), {v: {x: [1500, 1500], pose: 'scared'}, tod: 0.06, loc: 'clearing'}, 2),
  S(89.0, 94.9, 'w', C(1500, 780, 2.2, 2.0), {v: {x: [1500, 1500], pose: 'legs'}, tod: 0.06, loc: 'clearing'}, 1),
  // ===== PART 2: rules 1-3 =====
  S(94.9, 100.0, 'w', C(1500, 600, 1.1, 1.0, 1700, 600), {v: {x: [1500, 1500], pose: 'frozen'}, e: {x: [2760, 2760], mode: 'idle'}, tod: 0.07, loc: 'clearing'}),
  S(100.0, 112.0, 'diag', C(960, 540, 1), {k: 'D1'}),
  S(112.0, 117.5, 'w', C(1500, 640, 1.0, 0.85, 1900, 640), {v: {x: [1500, 1500], pose: 'frozen'}, e: {x: [2760, 2700], mode: 'walk'}, tod: 0.07, loc: 'clearing'}),
  S(117.5, 121.5, 'w', C(1700, 630, 1.1, 1.0), {v: {x: [1500, 1500], pose: 'frozen'}, e: {x: [2700, 2680], mode: 'walk'}, tod: 0.07, loc: 'clearing'}),
  S(121.5, 124.5, 'w', C(1500, 640, 1.9, 2.1), {v: {x: [1500, 1500], pose: 'frozen'}, tod: 0.07, loc: 'clearing'}),
  S(124.5, 131.0, 'w', C(2100, 650, 0.75, 0.85, 2150, 650), {v: {x: [1500, 1500], pose: 'frozen'}, e: {x: [2760, 2600], mode: 'walk'}, tod: 0.07, loc: 'clearing'}),
  S(131.0, 136.0, 'paws', C(960, 540, 1), {speed: 0.5, tod: 0.07}),
  S(136.0, 141.0, 'w', C(1500, 640, 1.4, 1.6), {v: {x: [1500, 1500], pose: 'talk'}, e: {x: [2600, 2560], mode: 'walk'}, tod: 0.07, loc: 'clearing'}),
  S(141.0, 150.0, 'diag', C(960, 540, 1), {k: 'D2'}),
  S(150.0, 153.5, 'w', C(1500, 640, 2.2, 2.3), {v: {x: [1500, 1500], pose: 'talk'}, tod: 0.07, loc: 'clearing'}),
  S(153.5, 158.0, 'w', C(2000, 640, 1.0, 1.1, 2100, 640), {v: {x: [1500, 1500], pose: 'talk'}, e: {x: [2560, 2530], mode: 'walk'}, tod: 0.07, loc: 'clearing'}),
  S(158.0, 163.0, 'w', C(1550, 650, 1.5, 1.6), {v: {x: [1500, 1500], pose: 'talk'}, tod: 0.07, loc: 'clearing'}),
  S(163.0, 166.0, 'w', C(2500, 650, 1.6, 1.7), {e: {x: [2530, 2520], mode: 'idle'}, tod: 0.07, loc: 'clearing'}),
  S(166.0, 168.6, 'bearhead', C(960, 540, 1, 1.15), {mood: 'sniff', tod: 0.07}),
  S(168.6, 172.5, 'w', C(2000, 650, 0.95, 1.0, 2000, 650), {v: {x: [1500, 1500], pose: 'frozen'}, e: {x: [2520, 2480], mode: 'sniff'}, tod: 0.07, loc: 'clearing'}),
  S(172.5, 178.0, 'w', C(2400, 640, 1.5, 1.7), {e: {x: [2480, 2440], mode: 'walk'}, tod: 0.07, loc: 'clearing'}),
  S(178.0, 183.5, 'bearhead', C(900, 540, 1, 1.2), {mood: 'alert', tod: 0.07}, 1),
  S(183.5, 190.0, 'w', C(1500, 640, 1.4, 1.5), {v: {x: [1500, 1500], pose: 'frozen'}, e: {x: [2440, 2440], mode: 'alert'}, tod: 0.07, loc: 'clearing'}),
  S(190.0, 196.0, 'diag', C(960, 540, 1), {k: 'D3'}),
  S(196.0, 204.0, 'w', C(1900, 650, 1.0, 1.05, 1950, 650), {v: {x: [1500, 1400], pose: 'back'}, e: {x: [2440, 2420], mode: 'alert'}, tod: 0.07, loc: 'clearing'}),
  S(204.0, 209.5, 'w', C(1900, 650, 1.3, 1.4), {v: {x: [1400, 1400], pose: 'frozen'}, e: {x: [2420, 2420], mode: 'idle'}, tod: 0.08, loc: 'clearing'}),
  S(209.5, 215.5, 'bearhead', C(900, 540, 1, 1.15), {mood: 'huff', tod: 0.08}, 3),
  S(215.5, 219.5, 'w', C(2350, 650, 1.5, 1.6), {e: {x: [2420, 2420], mode: 'sway'}, tod: 0.08, loc: 'clearing'}, 2),
  S(219.5, 222.0, 'paws', C(960, 540, 1), {speed: 0.3, tod: 0.08}, 4),
  S(222.0, 228.0, 'w', C(1900, 650, 1.0, 1.1, 1900, 650), {v: {x: [1400, 1400], pose: 'frozen'}, e: {x: [2420, 2260], mode: 'walk'}, tod: 0.08, loc: 'clearing'}),
  S(228.0, 231.5, 'w', C(1500, 640, 2.0, 2.2), {v: {x: [1400, 1400], pose: 'scared'}, tod: 0.08, loc: 'clearing'}, 2),
  S(231.5, 235.2, 'bearhead', C(900, 540, 1, 1.2), {mood: 'alert', tod: 0.08}, 3),
  S(235.2, 242.0, 'w', C(1900, 650, 0.95, 1.0), {v: {x: [1400, 1400], pose: 'frozen'}, e: {x: [2260, 2020], mode: 'run'}, tod: 0.08, loc: 'clearing'}, 5),
  S(242.0, 246.0, 'w', C(1500, 650, 2.0, 2.2), {v: {x: [1400, 1400], pose: 'frozen'}, tod: 0.08, loc: 'clearing'}, 2),
  S(246.0, 251.0, 'w', C(1700, 650, 1.0, 1.0), {v: {x: [1400, 1400], pose: 'frozen'}, e: {x: [2020, 2020], mode: 'alert'}, tod: 0.08, loc: 'clearing'}),
  // ===== PART 3: tree, phone, retreat =====
  S(251.0, 258.0, 'w', C(1700, 650, 1.0, 1.1), {v: {x: [1400, 1400], pose: 'frozen'}, e: {x: [2020, 1860], mode: 'run'}, tod: 0.09, loc: 'clearing'}, 6),
  S(258.0, 263.5, 'w', C(1700, 500, 1.4, 1.7, 1750, 420), {v: {x: [1400, 1440], pose: 'frozen'}, tod: 0.09, loc: 'clearing'}),
  S(263.5, 267.0, 'w', C(1750, 300, 1.2, 1.6, 1750, 360), {tod: 0.09, loc: 'clearing'}),
  S(267.0, 273.0, 'w', C(1550, 640, 1.3, 1.5), {v: {x: [1440, 1450], pose: 'tree'}, tod: 0.09, loc: 'clearing'}),
  S(273.0, 277.0, 'w', C(1700, 650, 1.0, 1.05), {v: {x: [1450, 1400], pose: 'frozen'}, e: {x: [1860, 1800], mode: 'run'}, tod: 0.09, loc: 'clearing'}, 4),
  S(277.0, 283.0, 'bearhead', C(900, 540, 1, 1.1), {mood: 'huff', tod: 0.09}, 2),
  S(283.0, 289.0, 'w', C(1800, 650, 1.0, 1.1), {v: {x: [1400, 1400], pose: 'frozen'}, e: {x: [1800, 1930], mode: 'walk', face: -1}, tod: 0.09, loc: 'clearing'}),
  S(289.0, 295.0, 'w', C(1400, 640, 2.0, 2.3), {v: {x: [1400, 1400], pose: 'scared'}, tod: 0.09, loc: 'clearing'}, 1),
  S(295.0, 303.0, 'diag', C(960, 540, 1), {k: 'D4', t0: 296}),
  S(303.0, 310.0, 'diag', C(960, 540, 1), {k: 'D4', t0: 303}),
  S(310.0, 319.0, 'w', C(1750, 480, 1.1, 1.2), {v: {x: [1400, 1400], pose: 'frozen'}, e: {x: [1930, 1980], mode: 'idle'}, tod: 0.09, loc: 'clearing'}),
  S(319.0, 325.0, 'w', C(1550, 620, 1.4, 1.6), {v: {x: [1400, 1400], pose: 'tree'}, tod: 0.09, loc: 'clearing'}),
  S(325.0, 330.0, 'w', C(1700, 650, 1.0, 1.05), {v: {x: [1400, 1400], pose: 'frozen'}, e: {x: [1980, 2010], mode: 'walk', face: 1}, tod: 0.1, loc: 'clearing'}),
  S(330.0, 336.5, 'w', C(2000, 700, 1.5, 1.7), {e: {x: [2010, 2010], mode: 'sniff', face: -1}, tod: 0.1, loc: 'clearing'}),
  S(336.5, 340.0, 'w', C(1700, 650, 0.95, 1.0), {v: {x: [1400, 1400], pose: 'frozen'}, e: {x: [2010, 2010], mode: 'sniff'}, tod: 0.1, loc: 'clearing'}),
  S(340.0, 345.0, 'w', C(1400, 640, 2.0, 2.2), {v: {x: [1400, 1400], pose: 'frozen'}, tod: 0.1, loc: 'clearing'}),
  S(345.0, 350.0, 'w', C(1400, 700, 2.6, 2.8), {v: {x: [1400, 1400], pose: 'phone'}, tod: 0.1, loc: 'clearing'}, 1),
  S(350.0, 360.0, 'diag', C(960, 540, 1), {k: 'D5'}),
  S(360.0, 368.5, 'w', C(1700, 650, 1.0, 1.0), {v: {x: [1400, 1400], pose: 'frozen'}, e: {x: [2010, 2010], mode: 'sniff'}, tod: 0.1, loc: 'clearing'}),
  S(368.5, 371.0, 'w', C(1400, 700, 2.4, 2.4), {v: {x: [1400, 1400], pose: 'frozen'}, tod: 0.1, loc: 'clearing'}),
  S(371.0, 377.5, 'w', C(1800, 600, 1.0, 1.4, 1800, 560), {v: {x: [1400, 1400], pose: 'frozen'}, tod: 0.1, loc: 'clearing', windleaf: 1}),
  S(377.5, 383.0, 'bearhead', C(900, 540, 1, 1.15), {mood: 'sniff', tod: 0.1}),
  S(383.0, 389.0, 'w', C(1700, 650, 0.95, 1.0), {v: {x: [1400, 1400], pose: 'frozen'}, e: {x: [2010, 1990], mode: 'alert', face: -1}, tod: 0.1, loc: 'clearing'}),
  S(389.0, 396.0, 'diag', C(960, 540, 1), {k: 'D6'}),
  S(396.0, 402.0, 'w', C(1500, 650, 1.4, 1.5), {v: {x: [1400, 1400], pose: 'frozen'}, e: {x: [1990, 1990], mode: 'idle'}, tod: 0.11, loc: 'clearing'}),
  S(402.0, 408.0, 'w', C(1700, 650, 1.0, 1.05), {v: {x: [1400, 1400], pose: 'frozen'}, e: {x: [1990, 1990], mode: 'idle'}, tod: 0.11, loc: 'clearing'}),
  S(408.0, 413.0, 'w', C(1650, 660, 1.0, 1.1), {v: {x: [1400, 1280], pose: 'back'}, e: {x: [1990, 1990], mode: 'idle'}, tod: 0.11, loc: 'clearing'}),
  S(413.0, 419.0, 'w', C(1700, 650, 0.95, 1.0), {v: {x: [1280, 1230], pose: 'back'}, e: {x: [1990, 1990], mode: 'idle'}, tod: 0.11, loc: 'clearing'}),
  S(419.0, 425.0, 'w', C(1500, 640, 1.2, 1.1), {v: {x: [1230, 1230], pose: 'frozen'}, e: {x: [1990, 1990], mode: 'idle'}, tod: 0.11, loc: 'clearing'}),
  S(425.0, 431.0, 'w', C(1450, 640, 1.6, 1.7), {v: {x: [1230, 1230], pose: 'hope'}, tod: 0.11, loc: 'clearing'}),
  S(431.0, 437.0, 'w', C(1000, 700, 1.4, 1.5, 950, 700), {v: {x: [1230, 1230], pose: 'frozen'}, tod: 0.11, loc: 'clearing', bush: [431.5, 438]}, 1),
  S(437.0, 444.0, 'w', C(1000, 760, 1.8, 2.0, 950, 780), {tod: 0.11, loc: 'clearing', bush: [437, 444]}, 1),
  S(444.0, 450.0, 'w', C(1250, 640, 1.8, 2.0), {v: {x: [1230, 1230], pose: 'lookback'}, tod: 0.11, loc: 'clearing', bush: [444, 450]}),
  S(450.0, 457.0, 'w', C(960, 760, 2.4, 2.6, 920, 760), {tod: 0.11, loc: 'clearing', bush: [450, 457], cubpeek: 1}),
  S(457.0, 461.0, 'w', C(1000, 640, 1.2, 1.4), {v: {x: [1230, 1230], pose: 'frozen'}, c: {x: [900, 930], mode: 'idle', face: 1}, tod: 0.11, loc: 'clearing'}),
  S(461.0, 467.0, 'w', C(1700, 650, 0.8, 0.85, 1500, 650), {v: {x: [1230, 1230], pose: 'frozen'}, e: {x: [1990, 1990], mode: 'idle'}, c: {x: [930, 940], mode: 'idle', face: 1}, tod: 0.12, loc: 'clearing'}),
  S(467.0, 473.0, 'w', C(1150, 700, 1.4, 1.5), {v: {x: [1230, 1230], pose: 'frozen'}, c: {x: [940, 1020], mode: 'walk', face: 1}, tod: 0.12, loc: 'clearing'}),
  S(473.0, 480.0, 'w', C(1100, 760, 1.8, 2.0), {c: {x: [1020, 1020], mode: 'idle', face: 1}, tod: 0.12, loc: 'clearing'}),
  S(480.0, 484.5, 'w', C(1120, 700, 1.6, 1.5), {v: {x: [1230, 1230], pose: 'frozen'}, c: {x: [1020, 1070], mode: 'walk', face: 1}, tod: 0.12, loc: 'clearing'}),
  S(484.5, 489.5, 'w', C(1700, 650, 0.9, 1.0, 1750, 650), {v: {x: [1230, 1230], pose: 'lookright'}, e: {x: [1990, 1990], mode: 'idle'}, c: {x: [1070, 1070], mode: 'idle', face: 1}, tod: 0.12, loc: 'clearing'}),
  S(489.5, 496.0, 'w', C(1550, 600, 0.78, 0.82, 1550, 640), {v: {x: [1230, 1230], pose: 'frozen'}, e: {x: [1990, 1990], mode: 'idle'}, c: {x: [1070, 1070], mode: 'idle', face: 1}, tod: 0.12, loc: 'clearing'}),
  // ===== PART 4: cub & mother, rules 7-9, charge =====
  S(496.0, 504.0, 'w', C(1500, 620, 0.8, 0.85), {v: {x: [1230, 1230], pose: 'frozen'}, e: {x: [1990, 1990], mode: 'idle'}, c: {x: [1070, 1070], mode: 'idle', face: 1}, tod: 0.12, loc: 'clearing'}),
  S(504.0, 512.0, 'diag', C(960, 540, 1), {k: 'D7'}),
  S(512.0, 520.0, 'diag', C(960, 540, 1), {k: 'D7', t0: 8}),
  S(520.0, 525.0, 'w', C(1500, 640, 0.9, 1.0), {v: {x: [1230, 1230], pose: 'frozen'}, e: {x: [1990, 1990], mode: 'idle'}, c: {x: [1070, 1070], mode: 'idle', face: 1}, tod: 0.12, loc: 'clearing'}),
  S(525.0, 531.5, 'w', C(1080, 720, 1.8, 2.0), {c: {x: [1070, 1070], mode: 'idle', face: 1, rise: [0, 1, 526, 528]}, v: {x: [1230, 1230], pose: 'frozen'}, tod: 0.12, loc: 'clearing'}),
  S(531.5, 536.0, 'w', C(1500, 650, 0.8, 0.85), {v: {x: [1230, 1230], pose: 'frozen'}, e: {x: [1990, 1990], mode: 'idle'}, c: {x: [1070, 1070], mode: 'idle', face: 1, rise: 1}, tod: 0.12, loc: 'clearing'}),
  S(536.0, 542.0, 'w', C(1500, 640, 0.75, 0.75), {v: {x: [1230, 1230], pose: 'frozen'}, e: {x: [1990, 1990], mode: 'idle'}, c: {x: [1070, 1070], mode: 'idle', face: 1, rise: 1}, tod: 0.12, loc: 'clearing'}),
  S(542.0, 551.0, 'diag', C(960, 540, 1), {k: 'D8'}),
  S(551.0, 558.5, 'diag', C(960, 540, 1), {k: 'D8', t0: 5}),
  S(558.5, 563.0, 'w', C(1230, 700, 1.5, 1.6), {v: {x: [1230, 1230], y: [0, 40], pose: 'back'}, c: {x: [1070, 1070], mode: 'idle', face: 1, rise: 1}, tod: 0.12, loc: 'clearing'}),
  S(563.0, 568.0, 'w', C(1300, 700, 1.4, 1.5), {v: {x: [1230, 1230], y: [40, 100], pose: 'back'}, c: {x: [1070, 1070], mode: 'idle', face: 1}, tod: 0.12, loc: 'clearing'}),
  S(568.0, 578.0, 'w', C(1700, 650, 0.78, 0.8, 1700, 650), {v: {x: [1230, 1230], y: [100, 100], pose: 'frozen'}, e: {x: [1990, 1990], mode: 'idle'}, c: {x: [1070, 1070], mode: 'idle', face: 1}, tod: 0.12, loc: 'clearing'}),
  S(578.0, 582.0, 'bearhead', C(900, 540, 1, 1.1), {mood: 'huff', tod: 0.12}, 3),
  S(582.0, 589.0, 'w', C(1150, 700, 1.4, 1.6), {v: {x: [1230, 1230], y: [100, 100], pose: 'frozen'}, c: {x: [1070, 1150], mode: 'walk', face: 1}, tod: 0.12, loc: 'clearing'}),
  S(589.0, 594.0, 'w', C(1200, 720, 2.0, 2.2), {v: {x: [1230, 1230], y: [100, 100], pose: 'scared'}, c: {x: [1150, 1150], mode: 'idle', face: 1}, tod: 0.12, loc: 'clearing'}, 1),
  S(594.0, 599.0, 'w', C(1200, 700, 1.5, 1.5), {v: {x: [1230, 1260], y: [100, 140], pose: 'back'}, c: {x: [1150, 1150], mode: 'idle', face: 1}, tod: 0.12, loc: 'clearing'}),
  S(599.0, 606.0, 'w', C(1500, 680, 1.0, 1.0), {v: {x: [1260, 1260], y: [140, 140], pose: 'frozen'}, e: {x: [1990, 1990], mode: 'idle'}, c: {x: [1150, 1150], mode: 'idle', face: -1}, tod: 0.12, loc: 'clearing'}),
  S(606.0, 611.5, 'w', C(1750, 650, 1.0, 1.2, 1850, 650), {v: {x: [1260, 1260], y: [140, 140], pose: 'frozen'}, e: {x: [1990, 1950], mode: 'walk'}, c: {x: [1150, 1150], mode: 'idle', face: -1}, tod: 0.12, loc: 'clearing'}, 2),
  S(611.5, 617.2, 'w', C(1450, 700, 2.0, 2.2), {v: {x: [1260, 1260], y: [140, 140], pose: 'scared'}, tod: 0.12, loc: 'clearing'}, 2),
  S(617.2, 624.5, 'diag', C(960, 540, 1), {k: 'D9'}),
  S(624.5, 635.5, 'diag', C(960, 540, 1), {k: 'D9', t0: 7}),
  S(635.5, 641.0, 'w', C(1500, 680, 1.4, 1.5), {v: {x: [1260, 1260], y: [140, 140], pose: 'talk'}, e: {x: [1950, 1900], mode: 'walk'}, tod: 0.13, loc: 'clearing'}),
  S(641.0, 646.0, 'w', C(1650, 650, 1.0, 1.1), {v: {x: [1260, 1260], y: [140, 140], pose: 'talk'}, e: {x: [1900, 1740], mode: 'run'}, tod: 0.13, loc: 'clearing'}, 3),
  S(646.0, 652.0, 'w', C(1700, 650, 1.2, 1.4), {e: {x: [1740, 1740], mode: 'alert'}, v: {x: [1260, 1260], y: [140, 140], pose: 'frozen'}, tod: 0.13, loc: 'clearing'}, 2),
  S(652.0, 658.0, 'bearhead', C(900, 540, 1, 1.15), {mood: 'huff', tod: 0.13}, 4),
  S(658.0, 662.0, 'w', C(1260, 700, 2.4, 2.6), {v: {x: [1260, 1260], y: [140, 140], pose: 'frozen'}, tod: 0.13, loc: 'clearing'}, 2),
  S(662.0, 667.5, 'w', C(1700, 640, 1.8, 1.4), {e: {x: [1740, 1740], mode: 'alert'}, tod: 0.13, loc: 'clearing'}),
  S(667.5, 670.2, 'bearhead', C(900, 540, 1.1, 1.3), {mood: 'alert', tod: 0.13}, 3),
  S(670.2, 676.0, 'w', C(1600, 660, 1.0, 1.15, 1500, 660), {v: {x: [1260, 1260], y: [140, 140], pose: 'frozen'}, e: {x: [1740, 1620], mode: 'run'}, tod: 0.13, loc: 'clearing'}, 8),
  S(676.0, 680.0, 'w', C(1400, 700, 1.8, 1.4), {e: {x: [1620, 1560], mode: 'run'}, v: {x: [1260, 1260], y: [140, 140], pose: 'frozen'}, tod: 0.13, loc: 'clearing'}, 8),
  S(680.0, 686.0, 'paws', C(960, 540, 1), {speed: 2.2, tod: 0.13}, 9),
  S(686.0, 690.0, 'w', C(1500, 660, 1.1, 1.3), {v: {x: [1260, 1260], y: [140, 140], pose: 'frozen'}, e: {x: [1620, 1590], mode: 'run'}, tod: 0.13, loc: 'clearing', dist: 20}, 8),
  S(690.0, 693.0, 'paws', C(960, 540, 1), {speed: 2.6, tod: 0.13}, 10),
  S(693.0, 699.0, 'w', C(1400, 700, 1.7, 1.9), {v: {x: [1260, 1260], y: [140, 140], pose: 'scared'}, e: {x: [1590, 1560], mode: 'run'}, tod: 0.13, loc: 'clearing', dist: 10}, 9),
  S(699.0, 703.0, 'paws', C(960, 540, 1), {speed: 2.4, tod: 0.13}, 9),
  S(703.0, 708.2, 'w', C(1500, 680, 1.3, 1.5), {v: {x: [1260, 1260], y: [140, 140], pose: 'scared'}, e: {x: [1560, 1480], mode: 'run'}, tod: 0.13, loc: 'clearing'}, 9),
  S(708.2, 714.0, 'w', C(1500, 680, 1.3, 1.5), {v: {x: [1260, 1260], y: [140, 140], pose: 'frozen'}, e: {x: [1480, 1480], mode: 'huff'}, tod: 0.13, loc: 'clearing'}, 3),
  S(714.0, 722.0, 'w', C(1300, 700, 2.4, 2.6), {v: {x: [1260, 1260], y: [140, 140], pose: 'scared'}, tod: 0.13, loc: 'clearing'}, 1),
  S(722.0, 733.0, 'w', C(1600, 660, 1.0, 1.05), {v: {x: [1260, 1260], y: [140, 140], pose: 'frozen'}, e: {x: [1480, 1480], mode: 'idle'}, tod: 0.14, loc: 'clearing'}),
  S(733.0, 742.0, 'w', C(1500, 680, 1.4, 1.5), {v: {x: [1260, 1260], y: [140, 140], pose: 'frozen'}, e: {x: [1480, 1480], mode: 'huff'}, tod: 0.14, loc: 'clearing'}),
  S(742.0, 749.0, 'w', C(1250, 700, 2.4, 2.6), {v: {x: [1260, 1260], y: [140, 140], pose: 'legs'}, tod: 0.14, loc: 'clearing'}, 1),
  // ===== PART 5: rules 10-13, fall, lying =====
  S(749.0, 756.0, 'diag', C(960, 540, 1), {k: 'D10'}),
  S(756.0, 766.0, 'diag', C(960, 540, 1), {k: 'D10', t0: 7}),
  S(766.0, 772.0, 'w', C(1500, 690, 1.2, 1.2), {v: {x: [1260, 1260], y: [140, 140], pose: 'frozen'}, e: {x: [1480, 1480], mode: 'idle'}, tod: 0.14, loc: 'clearing'}),
  S(772.0, 780.0, 'w', C(1500, 690, 1.1, 1.1), {v: {x: [1260, 1150], y: [140, 140], pose: 'back'}, e: {x: [1480, 1580], mode: 'walk', face: -1}, tod: 0.14, loc: 'clearing'}),
  S(780.0, 785.0, 'w', C(1450, 690, 1.3, 1.4), {v: {x: [1150, 1150], y: [140, 140], pose: 'frozen'}, e: {x: [1580, 1580], mode: 'huff'}, tod: 0.14, loc: 'clearing'}, 3),
  S(785.0, 790.0, 'w', C(1350, 700, 1.6, 1.8), {v: {x: [1150, 1150], y: [140, 140], pose: 'scared'}, e: {x: [1580, 1400], mode: 'walk'}, tod: 0.14, loc: 'clearing'}, 1),
  S(790.0, 796.0, 'w', C(1250, 690, 2.4, 2.8), {v: {x: [1150, 1150], y: [140, 140], pose: 'scared'}, e: {x: [1400, 1330], mode: 'sniff'}, tod: 0.14, loc: 'clearing'}, 1),
  S(796.0, 802.0, 'w', C(1200, 700, 2.6, 2.8), {v: {x: [1150, 1150], y: [140, 140], pose: 'scared'}, tod: 0.14, loc: 'clearing'}, 1),
  S(802.0, 812.0, 'diag', C(960, 540, 1), {k: 'D11'}),
  S(812.0, 822.0, 'diag', C(960, 540, 1), {k: 'D11', t0: 10}),
  S(822.0, 834.0, 'diag', C(960, 540, 1), {k: 'D11', t0: 20}),
  S(834.0, 840.0, 'w', C(1300, 690, 1.4, 1.5), {v: {x: [1150, 1150], y: [140, 140], pose: 'frozen'}, e: {x: [1330, 1330], mode: 'sniff'}, tod: 0.15, loc: 'clearing'}),
  S(840.0, 845.0, 'w', C(1260, 700, 2.2, 2.4), {v: {x: [1150, 1150], y: [140, 140], pose: 'scared'}, e: {x: [1330, 1330], mode: 'idle'}, tod: 0.15, loc: 'clearing'}, 1),
  S(845.0, 849.0, 'w', C(1300, 690, 1.8, 1.8), {v: {x: [1150, 1150], y: [140, 140], pose: 'scared'}, e: {x: [1330, 1290], mode: 'run'}, tod: 0.15, loc: 'clearing'}, 6),
  S(849.0, 852.0, 'backpack', C(960, 540, 1), {paw: [0, 1, 849, 850.5]}, 7),
  S(852.0, 858.0, 'w', C(1200, 700, 1.6, 1.4), {v: {x: [1150, 1130], y: [140, 140], pose: 'fall', fall: [852, 857.5]}, e: {x: [1290, 1290], mode: 'idle'}, tod: 0.15, loc: 'clearing'}, 3),
  S(858.0, 864.0, 'w', C(1250, 720, 1.5, 1.6), {v: {x: [1130, 1130], y: [140, 140], pose: 'lie'}, e: {x: [1330, 1330], mode: 'idle'}, tod: 0.15, loc: 'clearing'}, 1),
  S(864.0, 871.0, 'w', C(1250, 740, 2.0, 2.2), {v: {x: [1130, 1130], y: [140, 140], pose: 'cover'}, tod: 0.15, loc: 'clearing'}),
  S(871.0, 878.0, 'diag', C(960, 540, 1), {k: 'D12'}),
  S(878.0, 884.0, 'diag', C(960, 540, 1), {k: 'D12', t0: 7}),
  S(884.0, 891.0, 'w', C(1200, 760, 3.0, 3.2), {v: {x: [1130, 1130], y: [140, 140], pose: 'cover'}, tod: 0.15, loc: 'clearing'}),
  S(891.0, 896.0, 'w', C(1350, 760, 1.6, 1.6), {v: {x: [1130, 1130], y: [140, 140], pose: 'cover'}, e: {x: [1330, 1330], mode: 'idle', y: 40}, tod: 0.15, loc: 'clearing'}),
  S(896.0, 905.0, 'w', C(1300, 740, 1.2, 1.2, 1300, 740), {v: {x: [1130, 1130], y: [140, 140], pose: 'cover'}, e: {x: [1700, 800], mode: 'walk', y: [120, 120], face: -1}, tod: 0.15, loc: 'clearing', front: 1}),
  S(905.0, 908.0, 'paws', C(960, 540, 1), {speed: 0.8, tod: 0.15}, 2),
  S(908.0, 915.0, 'backpack', C(960, 540, 1), {paw: [0, 1, 908.5, 910]}, 1),
  S(915.0, 922.0, 'w', C(1200, 740, 2.0, 2.2), {v: {x: [1130, 1130], y: [140, 140], pose: 'cover'}, e: {x: [1330, 1330], mode: 'sniff', y: 20}, tod: 0.15, loc: 'clearing'}),
  S(922.0, 929.0, 'bearhead', C(900, 540, 1, 1.2), {mood: 'sniff', tod: 0.15}, 1),
  S(929.0, 938.0, 'w', C(1200, 760, 3.0, 3.2), {v: {x: [1130, 1130], y: [140, 140], pose: 'cover'}, tod: 0.15, loc: 'clearing'}),
  S(938.0, 946.0, 'w', C(1260, 760, 2.2, 2.4), {v: {x: [1130, 1130], y: [140, 140], pose: 'cover'}, e: {x: [1330, 1330], mode: 'sniff', y: 20}, tod: 0.15, loc: 'clearing'}),
  S(946.0, 954.0, 'w', C(1130, 780, 3.0, 3.3), {v: {x: [1130, 1130], y: [140, 140], pose: 'cover'}, tod: 0.15, loc: 'clearing'}),
  S(954.0, 961.0, 'w', C(1350, 700, 1.3, 1.3), {v: {x: [1130, 1130], y: [140, 140], pose: 'cover'}, e: {x: [1330, 1340], mode: 'huff', y: 20}, tod: 0.15, loc: 'clearing'}, 2),
  S(961.0, 971.0, 'w', C(1700, 660, 1.0, 1.0, 2000, 660), {v: {x: [1130, 1130], y: [140, 140], pose: 'cover'}, e: {x: [1340, 1700], mode: 'walk', face: 1}, tod: 0.15, loc: 'clearing'}),
  S(971.0, 978.0, 'diag', C(960, 540, 1), {k: 'D13'}),
  S(978.0, 984.5, 'diag', C(960, 540, 1), {k: 'D13', t0: 7}),
  S(984.5, 992.0, 'w', C(1700, 660, 1.0, 1.0, 2100, 660), {v: {x: [1130, 1130], y: [140, 140], pose: 'cover'}, e: {x: [1700, 1900], mode: 'walk', face: 1}, c: {x: [1150, 1500], mode: 'walk', face: 1, y: 100}, tod: 0.16, loc: 'clearing', bush: [996, 998.5]}),
  S(992.0, 999.0, 'w', C(1250, 760, 2.4, 2.4), {v: {x: [1130, 1130], y: [140, 140], pose: 'cover'}, tod: 0.16, loc: 'clearing', bush: [996, 999]}),
  S(999.0, 1006.0, 'w', C(1200, 760, 2.0, 1.8), {v: {x: [1130, 1130], y: [140, 140], pose: 'cover'}, tod: 0.16, loc: 'clearing'}),
  S(1006.0, 1012.0, 'w', C(1500, 700, 0.9, 0.9), {v: {x: [1130, 1130], y: [140, 140], pose: 'lookup'}, tod: 0.16, loc: 'clearing', birds: 1}),
  S(1012.0, 1019.0, 'w', C(1500, 620, 0.9, 1.0), {tod: 0.17, loc: 'clearing', birds: 1, windleaf: 1, v: {x: [1130, 1130], y: [140, 140], pose: 'lookup'}}),
  S(1019.0, 1023.0, 'w', C(1130, 760, 2.4, 2.6), {v: {x: [1130, 1130], y: [140, 140], pose: 'cover'}, tod: 0.17, loc: 'clearing'}),
  // ===== PART 6: leaving, phone, road, cabin, finale =====
  S(1023.0, 1030.0, 'diag', C(960, 540, 1), {k: 'D14'}),
  S(1030.0, 1040.0, 'diag', C(960, 540, 1), {k: 'D14', t0: 7}),
  S(1040.0, 1044.0, 'w', C(1200, 740, 1.6, 1.6), {v: {x: [1130, 1130], y: [140, 140], pose: 'kneelup', rise: [1040, 1046]}, tod: 0.18, loc: 'clearing'}),
  S(1044.0, 1050.0, 'w', C(1150, 700, 1.6, 1.8), {v: {x: [1130, 1130], y: [140, 140], pose: 'stand'}, tod: 0.18, loc: 'clearing'}),
  S(1050.0, 1058.0, 'w', C(1150, 700, 2.4, 2.6), {v: {x: [1130, 1130], y: [140, 140], pose: 'stand'}, tod: 0.18, loc: 'clearing'}),
  S(1058.0, 1065.0, 'w', C(1400, 680, 1.0, 1.05), {v: {x: [1130, 1130], y: [140, 140], pose: 'scan'}, tod: 0.18, loc: 'clearing'}),
  S(1065.0, 1070.5, 'w', C(1150, 700, 2.6, 2.8), {v: {x: [1130, 1130], y: [140, 140], pose: 'pocket'}, tod: 0.18, loc: 'clearing'}),
  S(1070.5, 1076.0, 'w', C(1200, 760, 1.3, 1.5), {v: {x: [1130, 1130], y: [140, 140], pose: 'scan'}, tod: 0.18, loc: 'clearing', phone: 1}),
  S(1076.0, 1081.0, 'phoneg', C(960, 540, 1), {ring: false}),
  S(1081.0, 1086.0, 'w', C(1220, 720, 1.4, 1.5), {v: {x: [1130, 1190], y: [140, 140], pose: 'walk'}, tod: 0.18, loc: 'clearing', phone: 1}),
  S(1086.0, 1093.0, 'phoneg', C(960, 540, 1, 1.1), {ring: true}),
  S(1093.0, 1099.0, 'w', C(1300, 700, 1.3, 1.5), {v: {x: [1190, 1190], y: [140, 140], pose: 'frozen'}, tod: 0.18, loc: 'clearing', phone: 1, ring: 1, bush: [1095, 1101]}, 1),
  S(1099.0, 1103.0, 'phoneg', C(960, 540, 1, 1.15), {ring: true}),
  S(1103.0, 1109.0, 'w', C(1600, 680, 0.95, 1.0), {v: {x: [1190, 1190], y: [140, 140], pose: 'frozen'}, tod: 0.18, loc: 'clearing', phone: 1, ring: 1, bush: [1103, 1117]}),
  S(1109.0, 1114.0, 'phoneg', C(960, 540, 1.1, 1.0), {ring: true}),
  S(1114.0, 1119.0, 'w', C(1250, 700, 1.7, 1.7), {v: {x: [1190, 1190], y: [140, 140], pose: 'frozen'}, tod: 0.18, loc: 'clearing', phone: 1, ring: 1, bush: [1114, 1119]}),
  S(1119.0, 1126.0, 'w', C(1200, 700, 1.2, 1.1), {v: {x: [1190, 1060], y: [140, 140], pose: 'back'}, tod: 0.19, loc: 'clearing', phone: 1, bush: [1119, 1124]}),
  S(1126.0, 1135.0, 'w', C(vxR(1126), 680, 1.1, 1.1, vxR(1135), 680), {v: {x: [vxR(1126), vxR(1135)], pose: 'walk', flip: true}, tod: 0.19, loc: 'road2', rev: 1}),
  S(1135.0, 1141.0, 'w', C(vxR(1135), 680, 1.5, 1.4, vxR(1141), 680), {v: {x: [vxR(1135), vxR(1141)], pose: 'walk', flip: true}, tod: 0.2, loc: 'road2', rev: 1}),
  S(1141.0, 1146.0, 'w', C(2000, 640, 0.9, 0.95, 2300, 640), {v: {x: [1950, 2300], pose: 'walk'}, tod: 0.2, loc: 'road'}),
  S(1146.0, 1151.0, 'w', C(2300, 640, 1.4, 1.5), {v: {x: [2300, 2300], pose: 'sigh'}, tod: 0.2, loc: 'road'}),
  S(1151.0, 1160.0, 'w', C(2300, 560, 1.1, 1.0, 2400, 600), {v: {x: [2300, 2300], pose: 'stand'}, tod: 0.22, loc: 'road'}),
  S(1160.0, 1172.0, 'diag', C(960, 540, 1), {k: 'D15', t0: 0}),
  S(1172.0, 1184.0, 'diag', C(960, 540, 1), {k: 'D15', t0: 12}),
  S(1184.0, 1196.0, 'diag', C(960, 540, 1), {k: 'D15', t0: 24}),
  S(1196.0, 1203.0, 'w', C(1500, 700, 1.0, 1.0, 1700, 700), {tod: 0.4, loc: 'clearing', memory: 1}),
  S(1203.0, 1209.0, 'w', C(2200, 700, 1.0, 1.0, 2600, 700), {tod: 0.4, loc: 'clearing', memory: 1, e: {x: [1900, 2400], mode: 'walk', face: 1}}),
  S(1209.0, 1213.0, 'w', C(2300, 700, 0.9, 1.0), {tod: 0.45, loc: 'road', v: {x: [2300, 2380], pose: 'walk'}}),
  S(1213.0, 1220.0, 'w', C(2400, 600, 1.1, 1.1, 2600, 600), {v: {x: [2380, 2600], pose: 'walk'}, tod: 0.8, loc: 'road'}),
  S(1220.0, 1226.0, 'w', C(2800, 650, 1.1, 1.2), {v: {x: [2600, 2800], pose: 'walk'}, tod: 0.85, loc: 'road'}),
  S(1226.0, 1233.0, 'w', C(2900, 650, 1.6, 1.5), {v: {x: [2800, 2860], pose: 'listen'}, tod: 0.86, loc: 'road', bush: [1226, 1230]}),
  S(1233.0, 1241.0, 'w', C(3000, 640, 0.9, 0.95, 3200, 640), {v: {x: [2860, 3050], pose: 'walk'}, tod: 0.88, loc: 'cabin'}),
  S(1241.0, 1250.0, 'w', C(3100, 640, 1.0, 1.2, 3200, 640), {v: {x: [3050, 3150], pose: 'walk'}, tod: 0.9, loc: 'cabin'}),
  S(1250.0, 1255.0, 'w', C(3200, 640, 1.4, 1.5), {v: {x: [3150, 3170], pose: 'frozen'}, tod: 0.9, loc: 'cabin', bush: [1250, 1255]}, 3),
  S(1255.0, 1262.0, 'w', C(3150, 640, 1.6, 1.8), {v: {x: [3170, 3170], pose: 'scared'}, tod: 0.9, loc: 'cabin', bush: [1255, 1263]}, 2),
  S(1262.0, 1268.0, 'w', C(3300, 640, 1.2, 1.3), {v: {x: [3170, 3170], pose: 'frozen'}, tod: 0.9, loc: 'cabin', ranger: [1264, 1268]}),
  S(1268.0, 1276.0, 'w', C(3350, 660, 1.4, 1.5), {v: {x: [3170, 3170], pose: 'talk'}, tod: 0.9, loc: 'cabin', ranger: [1264, 1268]}),
  S(1276.0, 1281.0, 'w', C(3350, 660, 1.2, 1.1), {v: {x: [3170, 3170], pose: 'stand'}, tod: 0.9, loc: 'cabin', ranger: [1264, 1268], radio: 1}),
  S(1281.0, 1290.0, 'w', C(3300, 700, 1.6, 1.4), {v: {x: [3250, 3250], pose: 'sit'}, tod: 0.93, loc: 'cabin'}),
  S(1290.0, 1301.0, 'w', C(3000, 600, 1.0, 1.2, 3000, 560), {tod: 0.95, loc: 'cabin', v: {x: [3250, 3250], pose: 'sit'}}),
  S(1301.0, 1313.0, 'w', C(2600, 560, 0.9, 1.0, 2400, 520), {tod: 0.96, loc: 'road', birds: 0}),
  S(1313.0, 1324.2, 'w', C(2200, 540, 1.0, 0.85, 2000, 500), {tod: 0.98, loc: 'road', v: {x: [2100, 2100], pose: 'silhouette'}}),
];
function vxR(t: number) { return 2200 - (t - 1126) * 22; }

// ---------- rules ----------
const RULES: [number, string, number, number][] = [
  [1, 'НЕ УБЕГАЙ ОТ МЕДВЕДЯ', 94.9, 122], [2, 'СОХРАНЯЙ СПОКОЙСТВИЕ', 136, 162], [3, 'НЕ ПОВОРАЧИВАЙСЯ СПИНОЙ', 183, 197], [4, 'НЕ СПАСАЙСЯ НА ДЕРЕВЕ', 295, 322],
  [5, 'НЕ ПОДХОДИ РАДИ ФОТО', 350, 370], [6, 'ОТСТУПАЙ СПОКОЙНО', 389, 408], [7, 'НЕ ПОДХОДИ К МЕДВЕЖАТАМ', 500, 520], [8, 'НЕ СТОЙ МЕЖДУ МАТЕРЬЮ И ДЕТЁНЫШЕМ', 542, 559],
  [9, 'НЕ ПУГАЙ КРИКАМИ И БРОСКАМИ', 617, 636], [10, 'НЕ СОРЕВНУЙСЯ В СКОРОСТИ', 749, 766], [11, 'ЗАЩИТНАЯ ПОЗА: ЛЁЖА ЛИЦОМ ВНИЗ', 802, 832], [12, 'НЕ ВСТАВАЙ СЛИШКОМ РАНО', 871, 885],
  [13, 'НЕ ПОДНИМАЙСЯ, ПОКА МЕДВЕДЬ РЯДОМ', 971, 985], [14, 'ПОКИНЬ УЧАСТОК СПОКОЙНО', 1023, 1041], [15, 'ЗАЩИТНОЕ ИЛИ ХИЩНИЧЕСКОЕ?', 1159, 1200],
];

const TOD: [number, number][] = [[0, 0.02], [700, 0.12], [1000, 0.2], [1141, 0.25], [1209, 0.5], [1215, 0.8], [1320, 1.0]];

// ---------- scene renderer ----------
const tw = (v: any, t: number, a: number, b: number) => (Array.isArray(v) ? lerp(v[0], v[1], E(t, a, b)) : v ?? 0);
const poseOf = (name: string, t: number, p: any): Pose => {
  switch (name) {
    case 'walk': return poseWalk(t, 2.4, 8);
    case 'back': return poseWalk(-t, 2.0, 2, {hf: [30, -120]});
    case 'frozen': return poseStand({mood: 'scared', nod: 3, hf: [20, -122], hb: [-10, -120], lean: 3});
    case 'scared': return poseStand({mood: 'scared', nod: 6, lean: 8, hf: [26, -126], hb: [-6, -122]});
    case 'stand': return poseStand({mood: 'worried'});
    case 'talk': return poseStand({mood: 'neutral', hf: [64, -158], hb: [-6, -124]});
    case 'legs': return poseStand({mood: 'scared', lf: [14 + Math.sin(t * 30) * 2, 0], lb: [-12, 0]});
    case 'phone': return poseReach(30, -70, {mood: 'worried', lean: 6});
    case 'pocket': return poseReach(30, -66, {mood: 'worried', lean: 8});
    case 'hope': return poseStand({mood: 'neutral', hf: [30, -124], hb: [-10, -120], lean: 1});
    case 'lookback': return poseStand({mood: 'scared', nod: -10, lean: -4});
    case 'lookright': return poseStand({mood: 'scared', nod: 4, hf: [28, -124]});
    case 'tree': return poseStand({mood: 'scared', nod: -8, lean: 4, hf: [10, -150]});
    case 'lie': return poseCover();
    case 'cover': return poseCover();
    case 'kneelup': return poseKneel();
    case 'scan': return poseStand({mood: 'worried', nod: Math.sin(t * 1.5) * 8});
    case 'sigh': return poseStand({mood: 'neutral', nod: 10 + Math.sin(t * 1.2) * 3, lean: 2});
    case 'listen': return poseStand({mood: 'worried', nod: -6, hf: [20, -122]});
    case 'sit': return {hip: [0, -66], lean: 6, lf: [74, 0], lb: [50, 0], hf: [64, -80], hb: [22, -70], nod: 4, mood: 'neutral'};
    case 'lookup': return poseKneel();
    case 'silhouette': return poseStand({mood: 'neutral'});
    default: return poseStand({mood: 'worried'});
  }
};

const Bush: React.FC<{x: number; shake: number; t: number}> = ({x, shake, t}) => (
  <g transform={`translate(${x + Math.sin(t * 40) * shake * 6} ${G + 10})`}>
    {[-50, 0, 50].map((o, i) => <ellipse key={i} cx={o} cy={-40 + (i % 2) * 14} rx={64} ry={52} fill={['#2f6a2e', '#3a7a36', '#2a5a2a'][i]} />)}
    <ellipse cx={0} cy={-10} rx={110} ry={26} fill="#1f4a22" opacity={0.6} />
  </g>
);

const Scene: React.FC<{sh: Shot; t: number; fx: number}> = ({sh, t, fx}) => {
  const p = sh.p ?? {};
  const a = sh.a, b = sh.b;
  const tod = interp(TOD, t);
  switch (sh.sc) {
    case 'front': return <g><Forest tod={0.55} cx={960} t={t} loc="road" /><rect x={-2000} y={-1200} width={9000} height={2400} fill="#2a1a0a" opacity={0.25} /><BearFront t={t} s={lerp(p.s[0], p.s[1], E(t, a, b))} /></g>;
    case 'bearhead': return <BearHeadClose t={t} mood={p.mood} tod={p.tod ?? tod} />;
    case 'paws': return <PawsClose t={t} speed={p.speed} tod={p.tod ?? tod} />;
    case 'phoneg': return <PhoneGround t={t} ring={p.ring} />;
    case 'backpack': return <BackpackClose t={t} paw={tw(p.paw, t, p.paw[2], p.paw[3])} />;
    case 'diag': {
      const D = DIAGS[p.k];
      return <D t={t - a + (p.t0 ?? 0)} />;
    }
    case 'w': {
      const loc = p.loc === 'road2' ? 'road' : p.loc;
      const ents: React.ReactNode[] = [];
      const v = p.v;
      if (v) {
        const vx = tw(v.x, t, a, b), vy = tw(v.y ?? 0, t, a, b);
        let pose = poseOf(v.pose, t, p);
        let lie: number | undefined;
        if (v.pose === 'fall') { const k = E(t, v.fall[0], v.fall[1]); pose = k > 0.6 ? poseCover() : poseStand({mood: 'scared', lean: lerp(8, 40, k * 1.6)}); lie = k > 0.3 ? lerp(0, 86, (k - 0.3) / 0.7) : 0; }
        if (v.pose === 'lie' || v.pose === 'cover') lie = 86;
        if (v.pose === 'lookup') lie = 20;
        if (v.pose === 'kneelup') { const k = E(t, v.rise[0], v.rise[1]); pose = k > 0.5 ? poseStand({mood: 'scared'}) : poseKneel(); lie = lerp(60, 0, ease(clamp(k * 2))); }
        const flip = !!v.flip;
        const sit = v.pose === 'sit';
        ents.push(<Vasya key="v" v={{x: vx, y: vy + (sit ? 20 : 0), pose, flip, lie, s: 0.95}} />);
      }
      const e = p.e;
      const bears: {x: number; y: number; z: number; node: React.ReactNode}[] = [];
      if (e) {
        const ex = tw(e.x, t, a, b), ey = tw(e.y ?? 0, t, a, b);
        const face = e.face ?? (e.x[1] >= e.x[0] + 30 ? 1 : -1);
        const f = e.mode === 'walk' || e.mode === 'run' ? face : e.face ?? -1;
        bears.push({x: ex, y: ey, z: sh.p.front ? 2 : 0, node: <Bear key="e" b={{x: ex, y: ey, face: f, mode: e.mode, t}} />});
      }
      const c = p.c;
      if (c) {
        const cxp = tw(c.x, t, a, b);
        const rise = c.rise !== undefined ? tw(c.rise, t, c.rise[2] ?? a, c.rise[3] ?? b) : 0;
        bears.push({x: cxp, y: c.y ?? 0, z: 1, node: <Bear key="c" b={{x: cxp, y: c.y ?? 0, s: 0.46, face: c.face ?? 1, mode: c.mode, t, col: CUB.col, sn: CUB.sn, rise: Array.isArray(c.rise) ? tw(c.rise, t, c.rise[2], c.rise[3]) : rise}} />});
      }
      if (p.cubpeek) {
        const ph = E(t, 452, 456);
        ents.push(<g key="peek" transform={`translate(${900 + (1 - ph) * 40} ${G - 70})`} opacity={ph}><ellipse cx={0} cy={0} rx={34} ry={30} fill="#8a6440" /><circle cx={-14} cy={-28} r={11} fill="#8a6440" /><circle cx={16} cy={-28} r={11} fill="#8a6440" /><ellipse cx={14} cy={8} rx={18} ry={13} fill="#b08a60" /><circle cx={22} cy={4} r={5} fill="#1a1210" /><circle cx={2} cy={-8} r={4} fill="#1a1210" /></g>);
      }
      const bushShake = (x: number) => (p.bush && t >= p.bush[0] && t < p.bush[1] ? 1 : 0);
      const ranger = p.ranger && t >= p.ranger[0] ? <Lesnik key="r" x={lerp(3600, 3330, E(t, p.ranger[0], p.ranger[1]))} t={t} flip /> : null;
      return (
        <g>
          <Forest tod={p.tod ?? tod} cx={fx} loc={loc} t={t} />
          {loc === 'clearing' && <><Bush x={900} shake={bushShake(900)} t={t} /><Bush x={1700} shake={0} t={t} /></>}
          {(loc === 'road' || loc === 'cabin') && <Bush x={loc === 'road' ? 3000 : 3000} shake={bushShake(3000)} t={t} />}
          {p.phone && <g transform={`translate(${1290} ${G + 140})`}><ellipse cx={0} cy={8} rx={24} ry={5} fill="#000" opacity={0.3} /><rect x={-20} y={-12} width={40} height={14} rx={4} fill="#0b0d12" stroke={p.ring ? '#6fb8ff' : '#2a303c'} strokeWidth={3} />{p.ring && <circle cx={0} cy={-6} r={22 + Math.sin(t * 12) * 5} fill="#6fb8ff" opacity={0.18} />}</g>}
          {ents}
          {bears.sort((q, r) => q.z - r.z).map((q) => q.node)}
          {ranger}
          {p.birds && [0, 1, 2].map((i) => <path key={i} d={`M0 0 q10 -10 20 0 q10 -10 20 0`} stroke="#2a3a2a" strokeWidth={3} fill="none" transform={`translate(${((t * 60 + i * 380) % 2200) + fx - 1000} ${180 + i * 50 + Math.sin(t * 2 + i) * 14})`} />)}
          {p.windleaf && Array.from({length: 8}).map((_, i) => <ellipse key={i} cx={((t * 220 + i * 280) % 2400) + fx - 1200} cy={420 + ((i * 97) % 300) + Math.sin(t * 3 + i) * 30} rx={9} ry={4} fill="#7a8a3a" transform={`rotate(${t * 80 + i * 40} 0 0)`} />)}
          {p.dist && <Tx x={fx} y={G - 520} size={110} fill="#ff3b3b" stroke="#05070f">{`${p.dist} м`}</Tx>}
          {p.flash && <rect x={-2000} y={-1200} width={9000} height={2400} fill="#fff" opacity={clamp(1 - (t - a) / 0.5) * 0.8} />}
        </g>
      );
    }
    default: return null;
  }
};
function interp(pts: [number, number][], t: number) {
  if (t <= pts[0][0]) return pts[0][1];
  for (let i = 1; i < pts.length; i++) if (t <= pts[i][0]) return lerp(pts[i - 1][1], pts[i][1], (t - pts[i - 1][0]) / (pts[i][0] - pts[i - 1][0]));
  return pts[pts.length - 1][1];
}

const ShotView: React.FC<{sh: Shot; t: number}> = ({sh, t}) => {
  const k = ease(clamp((t - sh.a) / Math.max(0.01, sh.b - sh.a)));
  const c = sh.cam;
  const fx = lerp(c[0], c[3], k), fy = lerp(c[1], c[4], k), s = lerp(c[2], c[5], k);
  const shk = sh.shake ?? 0;
  const fixed = sh.sc === 'diag' || sh.sc === 'front' || sh.sc === 'bearhead' || sh.sc === 'paws' || sh.sc === 'phoneg' || sh.sc === 'backpack';
  const tf = fixed ? `translate(${shk * Math.sin(t * 61)} ${shk * Math.cos(t * 53)}) translate(960 540) scale(${s}) translate(-960 -540)` : `translate(${960 + shk * Math.sin(t * 61)} ${540 + shk * Math.cos(t * 53)}) scale(${s}) translate(${-fx} ${-fy})`;
  return (
    <AbsoluteFill>
      <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{position: 'absolute', left: 0, top: 0}}>
        <g transform={tf}><Scene sh={sh} t={t} fx={fixed ? 960 : fx} /></g>
      </svg>
    </AbsoluteFill>
  );
};

// ---------- overlays ----------
type RW = [string, number, number];
const Subs: React.FC<{t: number}> = ({t}) => {
  let p: [number, number, RW[]] | undefined;
  for (const x of subs as any) if (t >= x[0] - 0.04 && t < x[1] + 0.1) p = x;
  if (!p) return null;
  const k = clamp((t - p[0] + 0.04) / 0.1);
  const o = Math.min(k, clamp((p[1] + 0.1 - t) / 0.06));
  return (
    <AbsoluteFill style={{justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 64}}>
      <div style={{opacity: o, transform: `translateY(${(1 - k) * 10}px)`, width: 1720, textAlign: 'center', fontFamily: 'Montserrat, sans-serif', fontWeight: 800, fontSize: 68, lineHeight: 1.15, textTransform: 'uppercase', WebkitTextStroke: '8px #05070f', paintOrder: 'stroke fill', textShadow: '0 5px 0 rgba(0,0,0,0.35)'}}>
        {p[2].map(([w, s, e], i) => {
          const on = t >= s && t < e;
          return <span key={i} style={{display: 'inline-block', color: on ? '#FF2020' : '#ffffff', margin: '0 15px', textShadow: on ? '0 0 22px rgba(255,32,32,0.75), 0 5px 0 rgba(0,0,0,0.35)' : undefined}}>{w}</span>;
        })}
      </div>
    </AbsoluteFill>
  );
};

const RuleCard: React.FC<{t: number}> = ({t}) => {
  const r = RULES.find((x) => t >= x[2] - 0.05 && t < x[3] + 0.5);
  if (!r) return null;
  const into = t - r[2];
  const big = clamp(into / 0.5) * clamp((3.6 - into) / 0.5);
  const small = clamp((into - 3.1) / 0.5);
  const out = clamp((r[3] + 0.5 - t) / 0.5);
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      {big > 0 && (
        <div style={{position: 'absolute', top: 120, left: 0, right: 0, display: 'flex', justifyContent: 'center', opacity: big, transform: `scale(${0.88 + 0.12 * big})`}}>
          <div style={{background: 'rgba(8,10,14,0.82)', borderLeft: '14px solid #FF2020', padding: '26px 56px', borderRadius: 18, fontFamily: 'Montserrat, sans-serif', fontWeight: 800, textAlign: 'center', boxShadow: '0 12px 40px rgba(0,0,0,0.5)'}}>
            <div style={{fontSize: 56, color: '#FF2020', letterSpacing: 4}}>{`ПРАВИЛО №${r[0]}`}</div>
            <div style={{fontSize: 74, color: '#fff', marginTop: 6, maxWidth: 1500, lineHeight: 1.05}}>{r[1]}</div>
          </div>
        </div>
      )}
      <div style={{position: 'absolute', top: 28, left: 40, opacity: small * out, display: 'flex', alignItems: 'stretch', borderRadius: 14, overflow: 'hidden', fontFamily: 'Montserrat, sans-serif', fontWeight: 800, boxShadow: '0 6px 24px rgba(0,0,0,0.45)'}}>
        <div style={{background: '#FF2020', color: '#fff', padding: '10px 20px', fontSize: 32}}>{`№${r[0]}`}</div>
        <div style={{background: 'rgba(8,10,14,0.85)', color: '#fff', padding: '10px 22px', fontSize: 32}}>{r[1]}</div>
      </div>
    </AbsoluteFill>
  );
};

export const M64: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS64;
  const idx = SH.findIndex((s) => t >= s.a && t < s.b);
  const sh = SH[Math.max(0, idx)];
  const tod = interp(TOD, t);
  const SFX = (a: number, d: number, src: string, v: number | ((f: number) => number)) => (
    <Sequence key={`${src}${a}`} from={Math.round(a * FPS64)} durationInFrames={Math.max(1, Math.round(d * FPS64))}>
      <Audio src={staticFile(`sfx/${src}.mp3`)} volume={v} />
    </Sequence>
  );
  const rampT = (pts: [number, number][]) => ramp(pts);
  // music: calm until meeting, tension rises, drops in silent moments
  const calm = rampT([[0, 0.0], [6.8, 0.0], [10.4, 0.07], [50, 0.07], [53, 0.0], [1130, 0.0], [1141, 0.0], [1146, 0.05], [1210, 0.05], [1213, 0.0], [1280, 0.0], [1284, 0.06], [1320, 0.05], [1324, 0]]);
  const tense = rampT([[0, 0.09], [6.8, 0.05], [10.4, 0.0], [52, 0.0], [56, 0.07], [200, 0.08], [242, 0.0], [244, 0.0], [250, 0.09], [430, 0.09], [457, 0.0], [466, 0.0], [470, 0.08], [706, 0.09], [708, 0.0], [716, 0.03], [840, 0.07], [857, 0.0], [884, 0.0], [890, 0.04], [961, 0.04], [1004, 0.0], [1086, 0.0], [1090, 0.07], [1130, 0.07], [1141, 0.0], [1200, 0.0]]);
  const birds = rampT([[10.4, 0.0], [11, 0.11], [34, 0.1], [40, 0.03], [42, 0.0], [1010, 0.0], [1013, 0.08], [1030, 0.06], [1060, 0.0], [1141, 0.0], [1142, 0.07], [1210, 0.05], [1230, 0.0], [1290, 0.0], [1292, 0.04], [1320, 0.03], [1324, 0]]);
  const wind = rampT([[0, 0.0], [10.4, 0.05], [300, 0.04], [700, 0.05], [1010, 0.06], [1324, 0.05]]);
  const steps = rampT([[13.3, 0.0], [13.5, 0.11], [54, 0.11], [54.5, 0], [1141, 0], [1141.2, 0.1], [1146, 0.1], [1146.2, 0], [1209, 0], [1209.2, 0.1], [1233, 0.1], [1233.2, 0], [1241, 0], [1241.2, 0.1], [1250, 0.1], [1250.2, 0]]);
  const breath = rampT([[54, 0.0], [60, 0.05], [100, 0.04], [235, 0.04], [250, 0.08], [722, 0.08], [734, 0.1], [960, 0.1], [962, 0.0], [1090, 0.0], [1094, 0.05], [1100, 0.0]]);
  const run = rampT([[235.2, 0], [235.5, 0.12], [242, 0.12], [242.4, 0], [251, 0], [251.3, 0.12], [258, 0.12], [258.4, 0], [273, 0], [273.3, 0.1], [277, 0.1], [277.4, 0], [641, 0], [641.3, 0.1], [646, 0.1], [646.4, 0], [670.2, 0], [670.5, 0.14], [708.2, 0.14], [708.5, 0], [845, 0], [845.3, 0.1], [849, 0.1], [849.4, 0]]);
  const ev: React.ReactNode[] = [
    SFX(42.1, 1.2, 'crack', 0.1), SFX(436, 0.8, 'crunch', 0.09), SFX(437.5, 0.8, 'crack', 0.1), SFX(482, 0.8, 'crunch', 0.06),
    SFX(209.2, 1.2, 'huff', 0.16), SFX(279, 1.2, 'huff', 0.16), SFX(579, 1.2, 'huff', 0.15), SFX(655, 1.2, 'huff', 0.16), SFX(711.5, 1.4, 'huff', 0.17), SFX(783, 1.2, 'huff', 0.16), SFX(958, 1.4, 'huff', 0.12), SFX(1095, 1.4, 'huff', 0.14),
    SFX(217, 0.6, 'thud', 0.12), SFX(235.2, 0.8, 'thud', 0.12), SFX(251, 0.8, 'thud', 0.12), SFX(670.2, 0.8, 'thud', 0.14), SFX(848.2, 0.8, 'thud', 0.18), SFX(856.5, 0.9, 'thud', 0.16),
    SFX(606, 0.6, 'ping', 0.08), SFX(604, 0.7, 'squeak', 0.1), SFX(653, 0.7, 'squeak', 0.09), SFX(985, 0.7, 'squeak', 0.09),
    SFX(1086, 4.5, 'ring', 0.1), SFX(1100, 4.5, 'ring', 0.08),
    SFX(1250.2, 1.2, 'crack', 0.1), SFX(1264, 0.8, 'crunch', 0.08),
  ];
  return (
    <AbsoluteFill style={{backgroundColor: '#000'}}>
      <Audio src={staticFile('voice14.mp3')} volume={1} />
      <Audio src={staticFile('sfx/m64calm.mp3')} volume={calm} loop />
      <Audio src={staticFile('sfx/m64tense.mp3')} volume={tense} loop />
      <Audio src={staticFile('sfx/birds.mp3')} volume={birds} loop />
      <Audio src={staticFile('sfx/wind.mp3')} volume={wind} loop />
      <Audio src={staticFile('sfx/steps.mp3')} volume={steps} loop />
      <Audio src={staticFile('sfx/breath.mp3')} volume={breath} loop />
      <Audio src={staticFile('sfx/runsfx.mp3')} volume={run} loop />
      {ev}
      <ShotView sh={sh} t={t} />
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 60%, rgba(8,6,2,0.4) 100%)'}} />
      <AbsoluteFill style={{background: `rgba(255,120,30,${clamp((tod - 0.55) * 0.5)})`, mixBlendMode: 'multiply'}} />
      <RuleCard t={t} />
      <Subs t={t} />
      <AbsoluteFill style={{backgroundColor: '#000', opacity: t >= 1321.5 ? clamp((t - 1321.5) / 2.2) : 0}} />
    </AbsoluteFill>
  );
};
