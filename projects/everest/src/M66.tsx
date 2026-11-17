import React from 'react';
import '@fontsource/montserrat/cyrillic-800.css';
import '@fontsource/montserrat/latin-800.css';
import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {ramp} from './Everest';
import {clamp, ease, lerp, rnd, mixc, Tx, Glow, E, Pose, poseStand, poseWalk, poseSit, poseReach} from './M60Base';
import {Radio} from './M60Items';
import {Full, Man, VASYA, VASYA_PK, ANDREY, NEIGH, WOMAN, FIREMAN, WORKER, CityNight, Flat, Bath, Stairs, DoorFlat, PhoneScr, ListPaper, PackClose, FireIcons, MapTop, EarthStorm, Gym, Pump, BigText, Jar} from './M66Art';
import subs from './subs_s7.json';

export const FPS66 = 30;
const SPEED = 0.975;
export const DUR66 = 850.6 / SPEED;
const W = (o: number) => o / SPEED;

type Cam = [number, number, number, number, number, number];
type Shot = {a: number; b: number; sc: string; cam: Cam; p?: any; shake?: number};
const C = (x: number, y: number, z0: number, z1 = z0, x1 = x, y1 = y): Cam => [x, y, z0, x1, y1, z1];
const S = (a: number, b: number, sc: string, cam: Cam, p: any = {}, shake = 0): Shot => ({a, b, sc, cam, p, shake});
const C0: Cam = [960, 540, 1, 960, 540, 1];
const JARS: [number, number][] = [[0, 0], [90, 1], [92, 2], [94, 3], [444, 2]];
const FLAT_TABLE: [number, string][] = [[102, 'pasta'], [104, 'rice'], [105, 'cookie'], [248, 'beans'], [251, 'buck']];

const SH: Shot[] = [
  // ===== hook =====
  S(0, 5, 'city', C(1300, 520, 0.9, 1.0, 1800), {L: 1, clock: '20:00'}),
  S(5, 9, 'city', C(1200, 760, 1.4, 1.5), {L: 1, jam: 0, clock: '20:00'}),
  S(9, 13, 'city', C(2200, 700, 1.3, 1.1), {L: 1, crowd: 0.5, clock: '20:00'}),
  S(13, 19, 'flat', C(1000, 640, 1.1, 1.3), {lamp: 1, L: 1, v: 'sit', dark: 0.35}),
  S(19, 23, 'flat', C(1100, 640, 1.3, 1.5), {lamp: 1, L: 1, v: 'stand', dark: 0.35, clock: '20:00'}),
  S(23, 25, 'flat', C(1100, 640, 1.4, 1.4), {lamp: [1, 0, 23, 23.5], L: 1, v: 'stand', dark: 0.45}, 3),
  S(25, 27, 'flat', C(1100, 640, 1.3, 1.5), {lamp: 0, L: 1, v: 'stand', dark: 0.62, phoneLight: 1}),
  S(27, 29.2, 'flat', C(1500, 440, 1.2, 1.8), {lamp: 0, L: 1, v: 'window', dark: 0.5}),
  S(29.2, 31.5, 'city', C(1500, 520, 1.1, 1.25), {L: [1, 0.03, 29.4, 31.2]}),
  S(31.5, 34, 'city', C(900, 520, 0.95, 1.05, 2400), {L: 0.03, jam: 1}),
  S(34, 36, 'city', C(1900, 580, 2.2, 2.4), {L: 0.03, jam: 1}),
  S(36, 38, 'city', C(1000, 860, 1.6, 1.4), {L: 0.03, jam: 1}, 1),
  S(38, 40, 'city', C(2200, 720, 1.6, 1.8), {L: 0.03, crowd: 1, jam: 1}),
  S(40, 43, 'phone', C0, {mode: 'noinet'}),
  S(43, 47, 'phone', C0, {mode: 'emerg', k: [0.2, 0.6, 43, 47]}),
  S(47, 52, 'phone', C(960, 540, 1.1, 1.25), {mode: 'emerg', k: 1}),
  S(52, 54, 'flat', C(1000, 640, 1.3, 1.5), {lamp: 0, L: 0.03, v: 'stand', dark: 0.65, beam: true}),
  // ===== rule 1: water =====
  S(54, 60, 'bath', C(760, 640, 1.1, 1.3), {level: 0, flow: 0, bottles: 0, v: 'enter'}),
  S(60, 64, 'bath', C(760, 600, 1.2, 1.3), {level: [0, 0.5, 60, 64], flow: 1, bottles: 0}),
  S(64, 68, 'bath', C(1200, 640, 1.1, 1.3), {level: 0.5, flow: 0.6, bottles: [0, 6, 64, 68]}),
  S(68, 73, 'bath', C(1100, 660, 1.2, 1.2), {level: 0.62, flow: 0.6, bottles: 6}),
  S(73, 77, 'bath', C(700, 560, 2.0, 2.2), {level: 0.62, flow: [0.6, 0.25, 73, 77], bottles: 6}),
  S(77, 81, 'bath', C(700, 600, 2.2, 2.4), {level: 0.62, flow: [0.25, 0.04, 77, 81], bottles: 6}),
  S(81, 83, 'bath', C(700, 620, 2.4, 2.6), {level: 0.62, flow: 0, bottles: 6}),
  S(83, 86, 'bath', C(1000, 680, 1.2, 1.0), {level: 0.7, flow: 0, bottles: 6, v: 'relief'}),
  // ===== food =====
  S(86, 89, 'flat', C(700, 640, 1.2, 1.4), {lamp: 0, L: 0.03, v: 'walkcab', dark: 0.6, beam: true}),
  S(89, 95, 'flat', C(800, 650, 1.3, 1.6, 900), {lamp: 0, L: 0.03, v: 'cab', dark: 0.6, beam: true}, 0),
  S(95, 98, 'flat', C(1180, 700, 2.4, 2.6), {lamp: 0, L: 0.03, dark: 0.55}),
  S(98, 102, 'flat', C(1050, 650, 1.3, 1.3), {lamp: 0, L: 0.03, v: 'think', dark: 0.6, days: 1, beam: true}),
  S(102, 107, 'flat', C(1150, 680, 1.8, 2.0), {lamp: 0, L: 0.03, dark: 0.55}),
  S(107, 111, 'flat', C(800, 640, 1.2, 1.4), {lamp: 0, L: 0.03, v: 'tofridge', dark: 0.6, beam: true}),
  // ===== rule 2: fridge =====
  S(111, 118, 'flat', C(900, 600, 1.4, 1.5), {lamp: 0, L: 0.03, dark: 0.6, cold: [1, 0.9, 111, 118], beam: true}),
  S(118, 122, 'flat', C(1000, 600, 1.3, 1.4), {lamp: 0, L: 0.03, dark: 0.55, cold: [0.9, 0.8, 118, 122], v: 'tofridge'}),
  S(122, 126, 'flat', C(900, 600, 1.6, 1.7), {lamp: 0, L: 0.03, dark: 0.5, fridge: 1, cold: [0.8, 0.5, 122, 126]}),
  S(126, 130, 'flat', C(900, 600, 1.4, 1.4), {lamp: 0, L: 0.03, dark: 0.6, cold: 0.5, v: 'tofridge'}),
  S(130, 134, 'flat', C(900, 560, 1.8, 2.0), {lamp: 0, L: 0.03, dark: 0.5, fridge: [0, 1, 130, 133], cold: 0.5}),
  S(134, 141, 'flat', C(1000, 640, 1.2, 1.3), {lamp: 0, L: 0.03, dark: 0.55, prio: 1}),
  S(141, 149, 'list', C0, {title: 'ЗАПАСЫ', lines: ['Тушёнка — 3 банки', 'Макароны, рис, гречка', 'Печенье', 'Вода — 6 бутылок', 'Ванна — бытовая вода'], k: [0, 1, 141, 148]}),
  S(149, 151, 'flat', C(1050, 640, 1.4, 1.6), {lamp: 0, L: 0.03, v: 'think', dark: 0.65, beam: true}),
  S(151, 154, 'flat', C(1050, 640, 1.5, 1.5), {lamp: 0, L: 0.03, v: 'startle', dark: 0.65}, 4),
  // ===== lift =====
  S(154, 157, 'stairs', C(900, 640, 1.2, 1.3, 1500), {dark: 0.6, floor: '9', v: [350, 1300, 154, 157, 'run'], beam: 'v'}),
  S(157, 159, 'stairs', C(2500, 560, 1.5, 1.7), {dark: 0.6, floor: '9', elev: 1, v: [1900, 1900, 157, 159, 'stand'], beam: 'v'}, 2),
  S(159, 163, 'stairs', C(1900, 640, 1.2, 1.3), {dark: 0.6, floor: '9', v: [1500, 1500, 154, 163, 'stand'], a: [1860, 2000, 159, 163, 'walk'], beam: 'v'}),
  S(163, 168, 'stairs', C(2050, 660, 1.7, 1.9), {dark: 0.6, floor: '9', v: [1650, 1650, 163, 168, 'stand'], a: [2000, 2150, 163, 168, 'walk'], beam: 'v'}),
  S(168, 172, 'stairs', C(2300, 640, 1.5, 1.6), {dark: 0.6, floor: '9', elev: 1, v: [1900, 1900, 168, 172, 'stand'], a: [2250, 2250, 168, 172, 'talk'], beam: 'v'}),
  S(172, 178, 'stairs', C(2500, 540, 1.7, 1.9), {dark: 0.6, floor: '9', elev: 1, v: [1900, 1900, 172, 178, 'stand'], a: [2250, 2250, 172, 178, 'talk'], beam: 'v'}, 1),
  S(178, 185, 'stairs', C(2100, 650, 1.3, 1.3), {dark: 0.6, floor: '9', v: [1900, 1900, 178, 185, 'startle'], a: [2250, 2250, 178, 185, 'talk'], beam: 'v'}),
  S(185, 193, 'phone', C0, {mode: 'nosig'}),
  S(193, 196, 'phone', C(960, 540, 1.0, 1.4), {mode: 'nosig'}),
  // ===== episode 2 =====
  S(196, 206, 'stairs', C(2300, 640, 1.2, 1.3), {dark: 0.6, floor: '9', elev: 1, v: [1900, 1900, 196, 206, 'phone'], a: [2250, 2250, 196, 206, 'talk'], ex: [[NEIGH, 3300, 2700, 200, 206, 'walk']], beam: 'v'}),
  S(206, 212, 'stairs', C(1700, 640, 1.0, 1.1, 1000), {dark: 0.6, floor: '9', v: [1800, 1000, 206, 212, 'walk', 'flip'], a: [2000, 1200, 206, 212, 'walk', 'flip'], beam: 'v'}),
  S(212, 222, 'city', C(2200, 720, 1.4, 1.8), {L: 0.03, crowd: 1, jam: 1}, 1),
  S(222, 227, 'city', C(2200, 740, 2.0, 2.3), {L: 0.03, crowd: 1, jam: 1}, 1),
  S(227, 231, 'flat', C(1000, 640, 1.2, 1.3), {lamp: 0, L: 0.03, v: 'stand', andrey: true, dark: 0.6, beam: true}),
  S(231, 234, 'city', C(2200, 740, 1.8, 2.0), {L: 0.03, crowd: 1, jam: 1}, 3),
  S(234, 239, 'flat', C(1180, 680, 1.5, 1.6), {lamp: 0, L: 0.03, v: 'think', andrey: true, dark: 0.55, check: 1}),
  S(239, 241, 'flat', C(1000, 640, 1.3, 1.4), {lamp: 0, L: 0.03, v: 'stand', andrey: true, dark: 0.6, beam: true}),
  S(241, 248, 'stairs', C(900, 640, 1.2, 1.3), {dark: 0.6, floor: '8', v: [500, 600, 241, 248, 'stand'], a: [650, 700, 241, 248, 'talk'], ex: [[WOMAN, 880, 880, 241, 248, 'stand']], swap: [244, 248, 'batt'], beam: 'v'}),
  S(248, 255, 'stairs', C(1400, 640, 1.2, 1.3), {dark: 0.6, floor: '7', v: [1000, 1100, 248, 255, 'stand'], a: [1150, 1200, 248, 255, 'talk'], ex: [[NEIGH, 1420, 1420, 248, 255, 'stand']], swap: [251, 255, 'buck'], beam: 'v'}),
  S(255, 265, 'stairs', C(1000, 640, 1.2, 1.3), {dark: 0.65, floor: '6', v: [700, 800, 255, 265, 'stand'], a: [850, 900, 255, 265, 'talk'], knock: [256.5, 258], beam: 'v'}),
  S(265, 272, 'door', C(960, 540, 1.0, 1.1), {num: '42', tv: 1, ajar: 0, knocks: [267, 267.9, 268.8], dark: 0.55}),
  S(272, 282, 'door', C(960, 540, 1.1, 1.3), {num: '42', tv: 1, ajar: 0, dark: 0.55}),
  S(282, 292, 'door', C(960, 540, 1.3, 1.5), {num: '42', tv: 1, ajar: [0, 0.8, 282.5, 284], sil: [0, 1, 283, 284], closeAt: 291, dark: 0.5}, 0),
  S(292, 294, 'stairs', C(1500, 640, 1.0, 1.0, 1000), {dark: 0.6, floor: '9', v: [1500, 1000, 292, 294, 'walk', 'flip'], a: [1700, 1200, 292, 294, 'walk', 'flip'], beam: 'v'}),
  S(294, 299, 'flat', C(1000, 640, 1.2, 1.3), {lamp: 0, L: 0.03, v: 'stand', andrey: true, dark: 0.6, beam: true}),
  S(299, 306, 'flat', C(1180, 680, 1.5, 1.7), {lamp: 0, L: 0.03, dark: 0.55, big: 1}),
  S(306, 309, 'flat', C(1180, 700, 2.0, 2.2), {lamp: 0, L: 0.03, dark: 0.55, big: 1}),
  S(309, 314, 'flat', C(1900, 640, 1.8, 2.0), {lamp: 0, L: 0.03, dark: 0.55, stove: 1, v: 'stove'}),
  S(314, 317, 'flat', C(1900, 680, 2.0, 2.1), {lamp: 0, L: 0.03, dark: 0.55, stove: 1, v: 'stove'}),
  S(317, 322, 'flat', C(1100, 640, 1.2, 1.3), {lamp: 0, L: 0.03, v: 'stand', andrey: true, dark: 0.6, beam: true, big: 1}),
  S(322, 331, 'flat', C(1100, 640, 1.2, 1.4), {lamp: 0, L: 0.03, v: 'sniff', andrey: true, dark: 0.62, smoke: [0, 0.5, 323, 331], beam: true, big: 1}),
  S(331, 335, 'stairs', C(1600, 600, 1.2, 1.3), {dark: 0.55, floor: '9', smoke: [0.3, 0.8, 331, 335], a: [1800, 1800, 331, 335, 'stand'], v: [1500, 1500, 331, 335, 'stand'], beam: 'v'}),
  S(335, 340, 'stairs', C(1600, 600, 1.3, 1.4), {dark: 0.5, floor: '9', smoke: 1, a: [1800, 1800, 335, 340, 'startle'], v: [1500, 1500, 335, 340, 'startle'], beam: 'v'}, 4),
  // ===== episode 3 =====
  S(340, 348, 'stairs', C(1500, 620, 1.2, 1.4, 1100), {dark: 0.45, floor: '9', smoke: 1, v: [1500, 1000, 340, 348, 'run', 'flip'], beam: 'v'}, 3),
  S(348, 352, 'stairs', C(1300, 640, 1.5, 1.6), {dark: 0.45, floor: '9', smoke: 1, v: [1100, 1200, 348, 352, 'startle'], a: [1400, 1250, 348, 352, 'grab', 'flip'], beam: 'v'}, 2),
  S(352, 356, 'phone', C0, {mode: 'dial', k: [0, 0.4, 352, 356]}),
  S(356, 361, 'phone', C(960, 540, 1.0, 1.2), {mode: 'dial', k: 1}),
  S(361, 365, 'door', C(960, 700, 1.1, 1.3), {num: '37', tv: 0, ajar: 0, cloth: 1, smoke: 1, dark: 0.55}),
  S(365, 372, 'stairs', C(2300, 600, 1.2, 1.3), {dark: 0.5, floor: '9', smoke: 1, elev: 1, noLift: 1, beam: null}),
  S(372, 380, 'flat', C(1560, 460, 1.3, 1.6), {lamp: 0, L: 0.03, v: 'window', andrey: true, dark: 0.5, beam: true}),
  S(380, 384, 'city', C(1500, 700, 1.4, 1.5), {L: 0.03, trucks: 1, jam: 1}),
  S(384, 388, 'city', C(1700, 760, 1.8, 2.0), {L: 0.03, trucks: 1, jam: 1}),
  S(388, 390, 'icons', C0, {k: [0, 0.2, 388, 390]}),
  S(390, 401, 'icons', C0, {k: [0.2, 1, 390, 398]}),
  S(401, 407, 'stairs', C(1500, 640, 1.2, 1.3), {dark: 0.5, floor: '9', smoke: 0.15, v: [1300, 1300, 401, 407, 'stand'], ex: [[FIREMAN, 1700, 1700, 401, 407, 'talk']], beam: 'v'}),
  S(407, 411, 'flat', C(900, 700, 1.2, 1.4), {lamp: 0, L: 0.03, v: 'sit', dark: 0.6, andrey: true}),
  S(411, 417, 'bath', C(760, 640, 1.1, 1.2), {level: 0.9, flow: 0, bottles: 6, v: 'relief'}),
  S(417, 422, 'bath', C(1500, 640, 1.8, 2.0), {level: 0.9, flow: 0, bottles: 6}),
  S(422, 427, 'bath', C(900, 640, 1.2, 1.2), {level: 0.9, flow: 0, bottles: 6, v: 'relief'}),
  S(427, 431, 'city', C(1500, 520, 0.95, 1.05, 2200), {L: 0.0}),
  S(431, 434, 'flat', C(1180, 650, 1.8, 2.0), {lamp: 0, L: 0, dark: 0.6, openJar: 1, beam: true}),
  S(434, 438, 'flat', C(1180, 650, 1.9, 2.0), {lamp: 0, L: 0, dark: 0.6, eat: 1, beam: true}),
  S(438, 442, 'flat', C(900, 640, 1.4, 1.5), {lamp: 0, L: 0, dark: 0.6, fridge: 1, cold: 0.3, beam: true}),
  S(442, 447, 'flat', C(1180, 680, 2.0, 2.2), {lamp: 0, L: 0, dark: 0.55, beam: true}),
  S(447, 455, 'list', C0, {title: 'ЗАПАСЫ', lines: ['Тушёнка — 2 банки', 'Макароны, рис, гречка', 'Вода — 6 бутылок', 'Электричества нет...'], k: [0, 1, 447, 453]}),
  S(455, 462, 'flat', C(1100, 640, 1.2, 1.3), {lamp: 0, L: 0, v: 'stand', andrey: true, map: true, dark: 0.6, beam: true}),
  S(462, 470, 'map', C0, {k: [0, 0.4, 462, 470]}),
  S(470, 476, 'map', C(1000, 540, 1.1, 1.2), {k: [0.4, 0.8, 470, 476]}),
  S(476, 484, 'map', C(1420, 440, 1.4, 2.0), {k: 1}),
  S(484, 492, 'door', C(960, 540, 1.1, 1.2), {num: '41', tv: 0, ajar: 0, knocks: [485, 485.8, 486.6, 487.4, 488.4, 489.4, 490.4], dark: 0.5}, 2),
  // ===== episode 4 =====
  S(493, 498, 'door', C(960, 540, 1.2, 1.3), {num: '41', tv: 0, ajar: 0, knocks: [493.5, 494.3, 495.1, 495.9], dark: 0.5}, 2),
  S(498, 501, 'stairs', C(1500, 640, 1.3, 1.5), {dark: 0.6, floor: '9', v: [1200, 1200, 498, 501, 'stand'], a: [1350, 1350, 498, 501, 'stand'], ex: [[WOMAN, 1650, 1650, 498, 501, 'stand']], beam: 'v'}),
  S(501, 506, 'stairs', C(1650, 640, 1.8, 2.0), {dark: 0.6, floor: '9', v: [1300, 1300, 501, 506, 'stand'], ex: [[WOMAN, 1650, 1650, 501, 506, 'talk']], beam: 'v'}),
  S(506, 510, 'bath', C(1500, 640, 1.6, 1.8), {level: 0.9, flow: 0, bottles: [6, 4, 506, 510]}),
  S(510, 513, 'stairs', C(1500, 640, 1.5, 1.6), {dark: 0.6, floor: '9', v: [1300, 1350, 510, 513, 'give'], ex: [[WOMAN, 1560, 1560, 510, 513, 'stand']], beam: 'v'}),
  S(513, 521, 'stairs', C(1400, 640, 1.1, 1.2), {dark: 0.55, floor: '9', v: [1100, 1100, 513, 521, 'stand'], a: [1250, 1250, 513, 521, 'stand'], ex: [[WOMAN, 1500, 1500, 513, 521, 'stand'], [NEIGH, 1700, 1700, 513, 521, 'stand']], beam: 'v'}),
  S(521, 525, 'stairs', C(1500, 640, 1.2, 1.3), {dark: 0.55, floor: '9', v: [1100, 1100, 521, 525, 'stand'], a: [1250, 1250, 521, 525, 'talk'], ex: [[WOMAN, 1500, 1500, 521, 525, 'stand'], [NEIGH, 1700, 1700, 521, 525, 'stand']], beam: 'v'}),
  S(525, 531, 'stairs', C(1500, 640, 1.0, 1.2), {dark: 0.5, floor: '9', v: [1100, 1100, 525, 531, 'stand'], a: [1250, 1250, 525, 531, 'talk'], ex: [[WOMAN, 1450, 1450, 525, 531, 'stand'], [NEIGH, 1650, 1650, 525, 531, 'stand'], [FIREMAN, 1850, 1850, 525, 531, 'stand']], beam: 'v'}),
  S(531, 538, 'list', C0, {title: 'ОБЩИЕ ЗАПАСЫ', lines: ['Продукты — у соседей', 'Вода — у соседей', 'Инструменты, фонарики', 'Радиоприёмник — Андрей'], k: [0, 1, 531, 537]}),
  S(538, 544, 'city', C(900, 540, 1.0, 1.1, 1600), {L: 0, day: 0.85, jam: 1}),
  S(544, 552, 'city', C(1500, 780, 1.3, 1.5, 1900), {L: 0, day: 0.85, jam: 1}),
  S(552, 556, 'city', C(1500, 740, 1.4, 1.5), {L: 0, day: 0.85, queue: 1}),
  S(556, 564, 'flat', C(1100, 640, 1.2, 1.3), {lamp: 0, L: 0, day: 0.5, v: 'pack', andrey: true, dark: 0.45}),
  S(564, 568, 'pack', C0, {k: [0, 0.2, 564, 568]}),
  S(568, 579, 'pack', C(960, 540, 1.0, 1.1), {k: [0.2, 1, 568, 577]}),
  S(579, 587, 'stairs', C(1500, 640, 1.0, 1.1, 600), {dark: 0.5, floor: '9', v: [1800, 600, 579, 587, 'walk', 'flip', 'pk'], a: [1950, 750, 579, 587, 'walk', 'flip', 'pk'], beam: 'v'}),
  S(587, 591, 'city', C(1500, 720, 1.2, 1.3, 2200), {L: 0, day: 0.85, jam: 1, walkers: [1200, 2200, 587, 591]}),
  S(591, 597, 'city', C(2300, 740, 1.2, 1.3, 3000), {L: 0, day: 0.85, jam: 0, crowd: 0.6, walkers: [2000, 3000, 591, 597]}),
  S(597, 605, 'pump', C(1500, 640, 1.0, 1.4), {gen: 0, walkers: [300, 1000, 597, 605]}),
  S(605, 609, 'pump', C(1300, 640, 1.5, 1.6), {gen: 0, walkers: [1000, 1000, 605, 609], gateClosed: 1}),
  S(609, 612, 'pump', C(1900, 640, 1.3, 1.4), {gen: [0, 1, 609, 610], walkers: [1000, 1000, 609, 612]}, 1),
  S(612, 615, 'pump', C(1300, 640, 1.4, 1.5), {gen: 1, walkers: [900, 900, 612, 615], worker: [1500, 1250, 612, 615]}),
  S(615, 623, 'pump', C(1100, 640, 1.5, 1.6), {gen: 1, walkers: [900, 900, 615, 623], worker: [1250, 1250, 615, 623], talk: 1}),
  S(623, 627, 'map', C(1420, 440, 1.6, 1.8), {k: 1}),
  S(627, 632, 'pump', C(1100, 640, 1.1, 1.2), {room: true, walkers: [400, 900, 627, 632]}),
  S(632, 638, 'radio', C0, {noise: 0.6}),
  S(638, 646, 'radio', C(960, 540, 1.1, 1.3), {noise: 0.35}),
  S(646, 657, 'radio', C(960, 540, 1.3, 1.5), {noise: 0.3}),
  S(657, 662, 'flat', C(1180, 700, 1.8, 2.0), {lamp: 0, L: 0, dark: 0.6, jarsShow: 2, beam: true}),
  S(662, 668, 'big', C0, {lines: ['30 СУТОК', 'БЕЗ ЭЛЕКТРИЧЕСТВА'], k: [0, 1, 662, 665]}),
  // ===== episode 5 =====
  S(668, 670, 'radio', C(960, 540, 1.3, 1.1), {noise: 0.4}),
  S(670, 678, 'earth', C0, {}),
  S(678, 683, 'earth', C(1350, 600, 1.0, 1.4), {}),
  S(683, 687, 'earth', C(1350, 600, 1.4, 1.7), {}),
  S(687, 693, 'pump', C(1500, 640, 1.0, 1.1), {gen: 1, walkers: [1300, 500, 687, 693], flipW: 1}),
  S(693, 697, 'phone', C0, {mode: 'battery'}),
  S(697, 706, 'phone', C(960, 540, 1.1, 1.3), {mode: 'battery', off: [703, 706]}),
  S(706, 715, 'radio', C(960, 540, 1.0, 1.2), {noise: 0.25}),
  S(715, 721, 'city', C(2000, 700, 1.1, 1.2, 2800), {L: 0, day: 0.8, walkers: [1500, 2600, 715, 721], crowd: 0.5}),
  S(721, 730, 'gym', C(1500, 640, 0.95, 1.1, 2000), {}),
  S(730, 737, 'gym', C(2300, 700, 1.4, 1.6), {}),
  S(737, 742, 'city', C(1500, 720, 1.0, 1.1, 800), {L: 0, day: 0.35, walkers: [2200, 800, 737, 742], flipW: 1}),
  S(742, 750, 'flat', C(1180, 690, 1.5, 1.7), {lamp: 0, L: 0, dark: 0.55, beam: true, big: 1, extra: 1}),
  S(750, 754, 'flat', C(1180, 700, 1.9, 2.1), {lamp: 0, L: 0, dark: 0.55, big: 1, extra: 1, beam: true}),
  S(754, 766, 'list', C0, {title: 'ПЛАН ПИТАНИЯ', lines: ['Тушёнка — 2 банки: 4 дня', 'Каша, макароны — 3 дня', 'Вода — по 2 л в день', 'Пункт помощи — школа'], k: [0, 1, 755, 765]}),
  S(766, 775, 'list', C(960, 640, 1.2, 1.4), {title: 'ВОДА · ПУНКТЫ', lines: ['Вода: 8 бутылок', 'Ближайший пункт — школа', 'Резерв: насосная станция'], k: [0, 1, 767, 774]}),
  S(775, 784, 'stairs', C(1500, 640, 1.0, 1.2), {dark: 0.5, floor: '9', v: [1100, 1100, 775, 784, 'stand'], a: [1250, 1250, 775, 784, 'talk'], ex: [[WOMAN, 1450, 1450, 775, 784, 'stand'], [NEIGH, 1650, 1650, 775, 784, 'stand']], beam: 'v'}),
  S(784, 789, 'flat', C(1000, 760, 1.2, 1.4), {lamp: 0, L: 0, dark: 0.7, v: 'sleep'}),
  S(789, 793, 'flat', C(1000, 700, 1.3, 1.3), {lamp: 0, L: 0, day: 0.6, dark: 0.45, v: 'startle'}, 3),
  S(793, 798, 'city', C(1500, 700, 1.3, 1.4), {L: 0, day: 0.75, queue: 1}),
  S(798, 805, 'city', C(1500, 740, 1.5, 1.6), {L: 0, day: 0.75, queue: 1, trucks: 1, noFlash: 1}),
  S(805, 814, 'city', C(1400, 760, 1.7, 1.9), {L: 0, day: 0.75, queue: 1, trucks: 1, noFlash: 1}, 2),
  S(814, 819, 'bath', C(1500, 640, 1.6, 1.8), {level: 0.85, flow: 0, bottles: 3}),
  S(819, 823, 'flat', C(1180, 690, 2.0, 2.3), {lamp: 0, L: 0, day: 0.5, dark: 0.55, jarsShow: 2, beam: false}),
  S(823, 830, 'flat', C(1180, 690, 1.6, 1.4), {lamp: 0, L: 0, day: 0.5, dark: 0.55, jarsShow: 2, days27: 1}),
  S(830, 836, 'city', C(1900, 560, 0.95, 1.0, 2300), {L: 0, day: 0.12}),
  S(836, 839, 'city', C(2300, 560, 1.0, 1.1, 2700), {L: 0, day: 0.12, lit: [0, 1, 836, 839]}),
  S(839, 843, 'city', C(2700, 560, 1.15, 1.9, 2800, 560), {L: 0, day: 0.12, lit: 1}),
  S(843, 845.5, 'city', C(2820, 560, 1.9, 3.0), {L: 0, day: 0.12, lit: 1}),
  S(845.5, 847.2, 'city', C(2850, 560, 3.0, 3.1), {L: 0, day: 0.12, lit: 1}),
  S(847.2, 851, 'black', C0, {}),
];

const tw = (v: any, t: number) => (Array.isArray(v) && v.length === 4 && typeof v[2] === 'number' && v[3] > v[2] ? lerp(v[0], v[1], E(t, v[2], v[3])) : v);
const stepV = (pts: [number, number][], t: number) => { let v = pts[0][1]; for (const [a, b] of pts) if (t >= a) v = b; return v; };
const knockVal = (t: number, ks: number[]) => ks.reduce((mx, k) => (t >= k ? Math.max(mx, Math.exp(-(t - k) * 14)) : mx), 0);

const posOf = (n: string, t: number): Pose => {
  switch (n) {
    case 'walk': return poseWalk(t, 2.4, 6);
    case 'run': return poseWalk(t, 4.4, 16);
    case 'stand': return poseStand({mood: 'worried'});
    case 'talk': return poseStand({mood: 'neutral', hf: [64, -158], hb: [-6, -124]});
    case 'startle': return poseStand({mood: 'scared', lean: -8, nod: -4, hf: [30, -130]});
    case 'sit': return poseSit({mood: 'worried', nod: 8});
    case 'think': return poseStand({mood: 'worried', nod: 10, hf: [40, -150]});
    case 'window': return poseStand({mood: 'worried', nod: -4, lean: 8});
    case 'relief': return poseStand({mood: 'happy', nod: 6});
    case 'phone': return poseReach(40, -140, {lean: 6});
    case 'give': return poseReach(70, -100, {lean: 10});
    case 'grab': return poseReach(80, -130, {lean: 14});
    case 'sniff': return poseStand({mood: 'worried', nod: -10});
    case 'stove': return poseReach(50, -110, {lean: 12, mood: 'worried'});
    case 'cab': return poseReach(70, -150, {lean: 8});
    case 'pack': return poseReach(40, -80, {lean: 14});
    case 'sleep': return poseStand({mood: 'neutral'});
    default: return poseStand();
  }
};

const Scene: React.FC<{sh: Shot; t: number; fx: number}> = ({sh, t, fx}) => {
  const p = sh.p ?? {};
  const a = sh.a, b = sh.b;
  switch (sh.sc) {
    case 'city': {
      const L = tw(p.L ?? 1, t);
      const lit = tw(p.lit ?? 0, t);
      const wk = p.walkers ? lerp(p.walkers[0], p.walkers[1], E(t, p.walkers[2], p.walkers[3])) : null;
      const flip = p.walkers && p.walkers[1] < p.walkers[0];
      return (
        <g>
          <CityNight t={t} p={{L, jam: p.jam, crowd: p.crowd, trucks: p.trucks, queue: p.queue, lit, cx: fx, day: p.day} as any} />
          {wk !== null && <><Man x={wk} y={1010} pose={posOf('walk', t)} look={VASYA_PK} flip={flip} s={1.25} /><Man x={wk + (flip ? 130 : -130)} y={1018} pose={poseWalk(t + 0.3, 2.2, 4)} look={ANDREY} flip={flip} s={1.25} /></>}
          {p.clock && <Tx x={fx} y={190} size={0} fill="#fff">{''}</Tx>}
        </g>
      );
    }
    case 'flat': {
      const jars = p.jarsShow !== undefined ? p.jarsShow : stepV(JARS, t);
      const table = FLAT_TABLE.filter(([ts]) => t >= ts).map(([, n]) => n);
      const extra = p.extra ? ['pasta', 'rice', 'cookie', 'beans', 'buck'] : null;
      const big = p.big ? ['pasta', 'rice', 'cookie', 'beans', 'buck'].filter((_, i) => (p.big && a >= 299 && a < 310 ? t >= 299 + i * 1.4 : true)) : null;
      const lamp = tw(p.lamp ?? 1, t), fridge = tw(p.fridge ?? 0, t);
      const v = p.v;
      let chars: React.ReactNode = null;
      const vx = v === 'cab' || v === 'walkcab' ? 520 : v === 'tofridge' ? 760 : v === 'stove' ? 1700 : v === 'window' ? 1400 : v === 'startle' ? 1000 : 1000;
      if (v === 'sleep') chars = <g transform="rotate(-88 900 900)"><Man x={900} y={900} pose={poseStand({mood: 'neutral'})} s={1.3} /></g>;
      else if (v) chars = <Man x={vx} y={1010} pose={posOf(v, t)} s={1.4} />;
      if (p.andrey) chars = <>{chars}<Man x={vx + 360} y={1016} pose={posOf('talk', t)} look={ANDREY} flip s={1.4} /></>;
      const smoke = tw(p.smoke ?? 0, t);
      const cold = tw(p.cold ?? -1, t);
      return (
        <g>
          <Flat t={t} jars={jars} dark={(p.dark ?? 0.4) * 0.62} lamp={lamp} L={p.L ?? 0} fridge={fridge} table={extra ?? big ?? table} stove={p.stove ?? 0} beam={!!p.beam} chars={chars} />
          {p.openJar && <g transform="translate(1180 700)"><rect x={-40} y={-120} width={80} height={14} fill="#aab" transform={`rotate(${-30 * E(t, 432, 433.5)} 40 -120)`} /></g>}
          {p.eat && <g transform="translate(1180 700)"><rect x={60} y={-80} width={70} height={14} fill="#a86a3a" /></g>}
          {cold >= 0 && <g transform="translate(1150 300)"><rect x={-26} y={-120} width={52} height={240} rx={26} fill="#0a1218" stroke="#4a8ab8" strokeWidth={5} /><rect x={-14} y={100 - cold * 200} width={28} height={cold * 200} rx={10} fill={cold > 0.6 ? '#6ad0ff' : '#ff9a4a'} /><Tx x={0} y={-150} size={30} fill="#cfe8ff">ХОЛОД</Tx></g>}
          {p.prio && <g><g transform="translate(300 220)"><rect x={-200} y={-50} width={400} height={100} rx={14} fill="rgba(20,40,20,0.8)" stroke="#7affb0" strokeWidth={4} /><Tx x={0} y={-8} size={30} fill="#7affb0">СНАЧАЛА</Tx><Tx x={0} y={30} size={26} fill="#fff">мясо · молоко · сыр · яйца</Tx></g><g transform="translate(1000 220)"><rect x={-200} y={-50} width={400} height={100} rx={14} fill="rgba(30,30,30,0.8)" stroke="#aab" strokeWidth={4} /><Tx x={0} y={-8} size={30} fill="#cfd8e0">ПОТОМ</Tx><Tx x={0} y={30} size={26} fill="#fff">консервы · крупы</Tx></g><path d="M520 220 L790 220" stroke="#ffd23a" strokeWidth={8} /></g>}
          {p.days && <Tx x={1180} y={500} size={64} fill="#ffd23a" o={clamp((t - 98.3) * 2)}>≈ 2 ДНЯ</Tx>}
          {p.days27 && <Tx x={1180} y={440} size={84} fill="#ff6a5a" o={clamp((t - 823.5) * 1.5)}>ВПЕРЕДИ 27 ДНЕЙ</Tx>}
          {smoke > 0 && Array.from({length: 12}).map((_, i) => <ellipse key={i} cx={((i * 313 + t * 30) % 2200) + 100} cy={720 - smoke * (100 + rnd(i) * 300)} rx={160 + rnd(i + 2) * 120} ry={90 + rnd(i + 4) * 60} fill="#7a7e84" opacity={0.14 * smoke} />)}
          {p.phoneLight && <Glow x={1100} y={800} r={380} c="#8ab4ff" o={0.3} id="pl66" />}
        </g>
      );
    }
    case 'bath': {
      const bottles = tw(p.bottles ?? 0, t);
      let chars: React.ReactNode = null;
      if (p.v === 'enter') chars = <Man x={lerp(200, 560, E(t, a, a + 3))} y={1010} pose={posOf('walk', t)} s={1.4} />;
      if (p.v === 'relief') chars = <Man x={1100} y={1010} pose={posOf('relief', t)} s={1.4} />;
      return <g><Bath t={t} level={tw(p.level ?? 0, t)} flow={tw(p.flow ?? 0, t)} bottles={Math.floor(bottles)} dark={0.4} />{chars}</g>;
    }
    case 'stairs': {
      const mk = (spec: any[], look: any, key: string) => spec && spec.length >= 5 ? (() => { const x = lerp(spec[0], spec[1], E(t, spec[2], spec[3])); const flip = spec.includes('flip'); const pk = spec.includes('pk'); return <Man key={key} x={x} y={1000} pose={posOf(spec[4] === 'walk' || spec[4] === 'run' ? spec[4] : spec[4], t)} look={pk ? VASYA_PK : look} flip={flip} s={1.4} />; })() : null;
      const vNode = mk(p.v, VASYA, 'v'), aNode = mk(p.a, ANDREY, 'a');
      const exNodes = (p.ex ?? []).map((e: any, i: number) => <Man key={'e' + i} x={lerp(e[1], e[2], E(t, e[3], e[4]))} y={1000} pose={posOf(e[5], t)} look={e[0]} s={1.35} flip={e[2] < e[1]} />);
      const vx = p.v ? lerp(p.v[0], p.v[1], E(t, p.v[2], p.v[3])) : 800;
      const beam = p.beam === 'v' ? {x: vx + 60, y: 700} : undefined;
      const kv = p.knock ? knockVal(t, p.knock) : 0;
      const sw = p.swap && t >= p.swap[0] ? E(t, p.swap[0], p.swap[1]) : 0;
      return (
        <g>
          <Stairs t={t} smoke={tw(p.smoke ?? 0, t)} dark={(p.dark ?? 0.55) * 0.8} floor={p.floor ?? '9'} beam={beam} elev={p.elev ?? 0} chars={<>{vNode}{aNode}{exNodes}</>} />
          {sw > 0 && <g transform={`translate(${p.swap[2] === 'buck' ? 1300 : 760} ${700 - Math.sin(sw * Math.PI) * 40})`}><rect x={-40 + sw * 80} y={-60} width={50} height={90} fill={p.swap[2] === 'buck' ? '#8a6a3a' : '#c8a838'} /><Tx x={sw * 80} y={-90} size={26} fill="#fff">{p.swap[2] === 'buck' ? 'ГРЕЧКА' : 'БАТАРЕЙКИ ⇄ ФАСОЛЬ'}</Tx></g>}
          {kv > 0.05 && <g transform="translate(850 560)"><circle r={50 + kv * 30} fill="none" stroke="#fff" strokeWidth={4} opacity={kv * 0.6} /></g>}
          {p.noLift && <g><g transform="translate(2500 520)"><circle r={130} fill="none" stroke="#ff3b3b" strokeWidth={20} /><line x1={-92} y1={-92} x2={92} y2={92} stroke="#ff3b3b" strokeWidth={20} /></g><Tx x={2500} y={760} size={56} fill="#ff6a5a">НЕ ЛИФТ · НЕ ЧЕРЕЗ ДЫМ</Tx></g>}
        </g>
      );
    }
    case 'door': {
      const kv = knockVal(t, p.knocks ?? []);
      let aj = tw(p.ajar ?? 0, t);
      if (p.closeAt && t >= p.closeAt) aj = Math.max(0, 0.8 * (1 - (t - p.closeAt) * 6));
      return (
        <g>
          <g transform={`translate(${Math.sin(kv * 40) * kv * 6} 0)`}><DoorFlat t={t} num={p.num ?? '42'} tv={p.tv ?? 0} ajar={aj} sil={tw(p.sil ?? 0, t) * (p.closeAt && t >= p.closeAt - 0.5 ? 0 : 1)} dark={(p.dark ?? 0.5) * 0.6} /></g>
          {p.cloth && <g transform="translate(960 1010)"><rect x={-300} y={-50} width={600} height={46} rx={14} fill="#5a6a8a" /><Tx x={0} y={-16} size={28} fill="#cfe0ff">мокрая ткань</Tx></g>}
          {p.smoke && Array.from({length: 8}).map((_, i) => <ellipse key={i} cx={460 + i * 140} cy={980 - ((t * 40 + i * 50) % 160)} rx={90} ry={44} fill="#8a8e94" opacity={0.2} />)}
        </g>
      );
    }
    case 'phone': {
      const off = p.off ? tw([0, 1, p.off[0], p.off[1]], t) : 0;
      return <g><PhoneScr t={t} mode={p.mode} k={tw(p.k ?? 1, t)} />{off > 0 && <rect x={-100} y={-100} width={2200} height={1300} fill="#000" opacity={off} />}</g>;
    }
    case 'list': return <ListPaper t={t} lines={p.lines} k={tw(p.k ?? 1, t)} title={p.title} />;
    case 'pack': return <PackClose t={t} k={tw(p.k ?? 1, t)} />;
    case 'icons': return <FireIcons t={t} k={tw(p.k ?? 1, t)} />;
    case 'map': return <MapTop t={t} k={tw(p.k ?? 1, t)} />;
    case 'earth': return <EarthStorm t={t} />;
    case 'gym': return <Gym t={t} />;
    case 'pump': {
      const wk = p.walkers ? lerp(p.walkers[0], p.walkers[1], E(t, p.walkers[2], p.walkers[3])) : null;
      const flip = p.flipW || (p.walkers && p.walkers[1] < p.walkers[0]);
      const wr = p.worker ? lerp(p.worker[0], p.worker[1], E(t, p.worker[2], p.worker[3])) : null;
      return (
        <g>
          <Pump t={t} gen={tw(p.gen ?? 0, t)} room={!!p.room} />
          {wk !== null && <><Man x={wk} y={1010} pose={posOf(p.walkers[0] === p.walkers[1] ? 'talk' : 'walk', t)} look={VASYA_PK} flip={flip} s={1.3} /><Man x={wk + (flip ? 130 : -130)} y={1018} pose={poseWalk(t + 0.3, 2.2, 4)} look={ANDREY} flip={flip} s={1.3} /></>}
          {wr !== null && <Man x={wr} y={1010} pose={posOf(p.talk ? 'talk' : 'walk', t)} look={WORKER} flip s={1.3} />}
          {p.gateClosed && <g transform="translate(1000 820)"><rect x={-60} y={-250} width={14} height={250} fill="#3a3e44" /><Tx x={200} y={-300} size={36} fill="#ff6a5a">ВОРОТА ЗАКРЫТЫ</Tx></g>}
        </g>
      );
    }
    case 'radio':
      return (
        <g>
          <Full c="#120c08" />
          <Radio x={960} y={560} s={2.6} t={t} on={1} needle={0.5 + 0.02 * Math.sin(t)} noise={p.noise ?? 0.3} />
          {Array.from({length: 18}).map((_, i) => <rect key={i} x={560 + i * 46} y={960 - Math.abs(Math.sin(t * 7 + i * 1.3)) * 80} width={22} height={Math.abs(Math.sin(t * 7 + i * 1.3)) * 80 + 6} fill="#ffb04a" opacity={0.5} />)}
          <rect x={-100} y={-100} width={2200} height={1300} fill="#010308" opacity={0.25} />
        </g>
      );
    case 'big': return <BigText lines={p.lines} k={tw(p.k ?? 1, t)} />;
    case 'black': return <Full c="#000" />;
    default: return null;
  }
};

const ShotView: React.FC<{sh: Shot; t: number}> = ({sh, t}) => {
  const k = ease(clamp((t - sh.a) / Math.max(0.01, sh.b - sh.a)));
  const c = sh.cam;
  const fx = lerp(c[0], c[3], k), fy = lerp(c[1], c[4], k), s = lerp(c[2], c[5], k);
  const shk = sh.shake ?? 0;
  const fixed = ['phone', 'list', 'pack', 'icons', 'map', 'earth', 'radio', 'big', 'door'].includes(sh.sc);
  const sx = Math.sin(t * 0.83) * 4, sy = Math.cos(t * 0.71) * 3, rot = Math.sin(t * 0.5) * 0.25;
  const tf = fixed
    ? `translate(${shk * Math.sin(t * 61) + sx * 0.5} ${shk * Math.cos(t * 53) + sy * 0.5}) translate(960 540) scale(${s}) translate(${-fx} ${-fy})`
    : `translate(${960 + shk * Math.sin(t * 61) + sx} ${540 + shk * Math.cos(t * 53) + sy}) rotate(${rot}) scale(${s}) translate(${-fx} ${-fy})`;
  return (
    <AbsoluteFill style={{filter: 'saturate(0.85)'}}>
      <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{position: 'absolute', left: 0, top: 0}}>
        <g transform={tf}><Scene sh={sh} t={t} fx={fx} /></g>
      </svg>
    </AbsoluteFill>
  );
};

// ---------- HUD ----------
const RULES: [number, string, number, number][] = [
  [1, 'ЗАПАСИСЬ ВОДОЙ', 54, 109], [2, 'НЕ ВЫПУСКАЙ ХОЛОД ИЗ ХОЛОДИЛЬНИКА', 111, 150], [3, 'НЕ ВЫХОДИ БЕЗ НУЖДЫ', 224, 240], [4, 'НЕ ТРАТЬ ВСЕ ЗАПАСЫ СРАЗУ', 295, 322],
  [5, 'ПРИ ПОЖАРЕ — НЕ ЧЕРЕЗ ДЫМ', 365, 388], [6, 'НИКАКИХ ГОРЕЛОК В КВАРТИРЕ', 390, 405], [7, 'ПОМОГАЙ СОСЕДЯМ', 513, 538], [8, 'ТРЕВОЖНЫЙ РЮКЗАК', 564, 580],
  [9, 'ЭКОНОМЬ ЗАРЯД', 698, 716], [10, 'СЧИТАЙ ЗАПАСЫ НА ДНИ', 755, 785],
];
const EPS: [number, string, number][] = [[1, 'ПЕРВЫЕ ЧАСЫ', 14], [2, 'ЗАПЕРТЫЕ В МНОГОЭТАЖКЕ', 196.5], [3, 'ПОЖАР В ДОМЕ', 340], [4, 'ГОРОД БЕЗ ЭЛЕКТРИЧЕСТВА', 493.3], [5, '72 ЧАСА БЕЗ СВЕТА', 668]];
const TIMEL: [string, number, number][] = [['ЧАС 0', 19, 26], ['ЧАС 0', 154, 160], ['ЧАС 6', 427, 434], ['ДЕНЬ 2', 538, 545], ['ДЕНЬ 3', 736, 743], ['ДЕНЬ 3', 789, 796]];
const COUNT: [number, number][] = [[90, 112], [299, 312], [431, 450], [742, 754], [819, 830]];
const pillCss = {background: 'rgba(5,8,14,0.7)', color: '#fff', fontFamily: 'Montserrat, sans-serif', fontWeight: 800 as const, borderRadius: 14, padding: '8px 22px'};

const Hud: React.FC<{t: number}> = ({t}) => {
  const tl = TIMEL.find((x) => t >= x[1] && t < x[2]);
  const cnt = COUNT.find((x) => t >= x[0] && t < x[1]);
  const n = t < 90 ? 0 : t < 431.5 ? Math.min(3, stepV(JARS, t)) : 2;
  const rule = RULES.find((r) => t >= r[2] && t < r[3]);
  const clk = t < 23 ? '20:00' : null;
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      {tl && <div style={{position: 'absolute', left: 44, top: 30, fontSize: 42, letterSpacing: 4, opacity: Math.min(clamp((t - tl[1]) / 0.4), clamp((tl[2] - t) / 0.4)), transform: `translateX(${(1 - clamp((t - tl[1]) / 0.4)) * -30}px)`, ...pillCss}}>{tl[0]}</div>}
      {clk && t < 23 && <div style={{position: 'absolute', left: 44, top: 30, fontSize: 40, letterSpacing: 3, ...pillCss, color: '#ffd890'}}>{clk}</div>}
      {cnt && n > 0 && <div style={{position: 'absolute', left: 44, top: 106, fontSize: 36, opacity: Math.min(clamp((t - cnt[0]) / 0.3), clamp((cnt[1] - t) / 0.4)), ...pillCss, color: '#ffd23a'}}>{`ТУШЁНКА: ${n} ${n === 1 ? 'БАНКА' : 'БАНКИ'}`}</div>}
      {rule && (() => {
        const u = t - rule[2];
        const big = clamp(u / 0.4) * clamp((3.6 - u) / 0.4), small = clamp((u - 3.2) / 0.4) * clamp((rule[3] - t) / 0.4);
        return (
          <>
            {big > 0 && <div style={{position: 'absolute', top: 110, left: 0, right: 0, display: 'flex', justifyContent: 'center', opacity: big, transform: `scale(${0.9 + 0.1 * big})`}}><div style={{background: 'rgba(5,8,14,0.85)', borderLeft: '12px solid #ff3b3b', padding: '18px 50px', borderRadius: 16, textAlign: 'center', fontFamily: 'Montserrat, sans-serif', fontWeight: 800}}><div style={{fontSize: 44, color: '#ff3b3b', letterSpacing: 6}}>{`ПРАВИЛО ${rule[0]}`}</div><div style={{fontSize: 62, color: '#fff', maxWidth: 1500}}>{rule[1]}</div></div></div>}
            <div style={{position: 'absolute', left: 44, top: tl ? 106 : (cnt ? 170 : 30), opacity: small, display: 'flex', borderRadius: 12, overflow: 'hidden', fontFamily: 'Montserrat, sans-serif', fontWeight: 800, fontSize: 30}}><div style={{background: '#ff3b3b', color: '#fff', padding: '8px 16px'}}>{`№${rule[0]}`}</div><div style={{background: 'rgba(5,8,14,0.85)', color: '#fff', padding: '8px 18px'}}>{rule[1]}</div></div>
          </>
        );
      })()}
    </AbsoluteFill>
  );
};

const EpTitle: React.FC<{t: number}> = ({t}) => {
  const e = EPS.find((x) => t >= x[2] && t < x[2] + 4.6);
  if (!e) return null;
  const u = t - e[2];
  const a = Math.min(clamp(u / 0.7), clamp((4.6 - u) / 0.7));
  return (
    <AbsoluteFill style={{pointerEvents: 'none', justifyContent: 'center', alignItems: 'center'}}>
      <div style={{opacity: a, textAlign: 'center', background: 'linear-gradient(90deg, rgba(0,0,0,0), rgba(0,0,0,0.65) 20%, rgba(0,0,0,0.65) 80%, rgba(0,0,0,0))', padding: '34px 220px', transform: `translateY(${(1 - a) * 14}px)`}}>
        <div style={{fontFamily: 'Montserrat, sans-serif', fontWeight: 800, fontSize: 38, letterSpacing: 14, color: '#ff4a3a'}}>{`ЭПИЗОД ${e[0]}`}</div>
        <div style={{fontFamily: 'Montserrat, sans-serif', fontWeight: 800, fontSize: 92, color: '#fff', letterSpacing: 3, textShadow: '0 4px 30px rgba(0,0,0,0.8)', marginTop: 8}}>{e[1]}</div>
      </div>
    </AbsoluteFill>
  );
};

export const M66: React.FC = () => {
  const frame = useCurrentFrame();
  const t = (frame / FPS66) * SPEED;
  const idx = SH.findIndex((s) => t >= s.a && t < s.b);
  const sh = SH[Math.max(0, idx)];
  const V = 0.6;
  const SFX = (a: number, d: number, src: string, v: number) => (
    <Sequence key={`${src}${a}`} from={Math.round(W(a) * FPS66)} durationInFrames={Math.max(1, Math.round(d * FPS66))}>
      <Audio src={staticFile(`sfx/${src}.mp3`)} volume={v * V} />
    </Sequence>
  );
  const rampT = (pts: [number, number][]) => { const f = ramp(pts.map(([a, v]) => [W(a), v] as [number, number])); return (fr: number) => f(fr) * V; };
  const city = rampT([[0, 0.07], [22, 0.07], [26, 0.01], [31, 0.0], [537, 0], [538, 0.03], [552, 0.03], [556, 0], [586, 0], [587, 0.04], [598, 0.04], [599, 0], [714, 0], [715, 0.04], [722, 0.0]]);
  const crowd = rampT([[36, 0], [37, 0.06], [41, 0.06], [42, 0], [212, 0], [213, 0.06], [222, 0.06], [223, 0], [231, 0], [232, 0.08], [234, 0.0], [552, 0], [553, 0.05], [556, 0], [591, 0], [592, 0.04], [597, 0], [721, 0], [722, 0.06], [736, 0], [793, 0], [794, 0.06], [814, 0]]);
  const wind = rampT([[26, 0], [28, 0.04], [60, 0.04], [61, 0], [538, 0], [539, 0.05], [560, 0.05], [561, 0], [579, 0], [580, 0.06], [632, 0.05], [633, 0], [687, 0], [688, 0.05], [715, 0.05], [716, 0], [830, 0], [831, 0.04], [847, 0.04], [847.3, 0]]);
  const water = rampT([[60, 0], [60.5, 0.07], [73, 0.07], [77, 0.03], [78, 0]]);
  const trickle = rampT([[77, 0], [78, 0.08], [81, 0.08], [83, 0]]);
  const fridge = rampT([[111, 0], [112, 0.03], [150, 0.03], [151, 0], [438, 0], [439, 0.03], [442, 0.03], [442.5, 0]]);
  const elev = rampT([[157, 0], [158, 0.07], [178, 0.07], [179, 0]]);
  const tv = rampT([[265, 0], [266, 0.04], [292, 0.04], [292.5, 0]]);
  const fire = rampT([[322, 0], [331, 0.03], [335, 0.07], [365, 0.06], [372, 0.03], [380, 0.02], [381, 0]]);
  const siren = rampT([[378, 0], [380, 0.04], [401, 0.04], [402, 0]]);
  const gen = rampT([[609, 0], [610, 0.07], [670, 0.07], [671, 0], [687, 0], [688, 0.04], [694, 0.03], [695, 0]]);
  const stat = rampT([[632, 0], [633, 0.06], [665, 0.05], [666, 0], [668, 0], [669, 0.04], [670, 0], [706, 0], [707, 0.04], [715, 0]]);
  const steps = rampT([[154, 0], [154.2, 0.07], [157, 0.07], [157.2, 0], [206, 0], [206.2, 0.06], [212, 0.06], [212.2, 0], [340, 0], [340.2, 0.07], [352, 0.06], [352.2, 0], [579, 0], [579.2, 0.06], [598, 0.06], [598.2, 0], [687, 0], [687.2, 0.06], [693, 0.06], [693.2, 0], [715, 0], [715.2, 0.06], [721, 0.06], [721.2, 0], [737, 0], [737.2, 0.06], [742, 0.06], [742.2, 0]]);
  const scratch = rampT([[141, 0], [141.5, 0.05], [148.5, 0.05], [149, 0], [447, 0], [447.5, 0.05], [453, 0.05], [453.5, 0], [755, 0], [755.5, 0.05], [774.5, 0.04], [775, 0]]);
  const ev: React.ReactNode[] = [
    SFX(23, 3, 'powerdown', 0.14), SFX(29.6, 3, 'powerdown', 0.1), SFX(36, 2, 'horn', 0.05), SFX(37.5, 1.5, 'horn', 0.05), SFX(40, 1.2, 'vib', 0.07), SFX(43, 1.2, 'notif', 0.09),
    SFX(90, 0.6, 'clank', 0.1), SFX(92, 0.6, 'clank', 0.1), SFX(94, 0.6, 'clank', 0.1),
    SFX(185, 1.2, 'vib', 0.06), SFX(292, 1, 'hit', 0.1), SFX(352, 1.4, 'ring', 0.05), SFX(356, 1.2, 'click', 0.07),
    SFX(431, 0.8, 'click', 0.08), SFX(512, 1.6, 'creak', 0.05), SFX(693, 1.2, 'vib', 0.07), SFX(703, 1, 'click', 0.08), SFX(805, 2, 'pa', 0.07),
    ...[256.5, 257.3, 267, 267.9, 268.8, 485, 485.8, 486.6, 487.4, 488.4, 489.4, 490.4, 493.5, 494.3, 495.1, 495.9].map((k) => SFX(k, 0.5, 'knock', 0.1)),
    ...[337, 340].map((k) => SFX(k, 1.5, 'elevgroan', 0.06)),
  ];
  return (
    <AbsoluteFill style={{backgroundColor: '#000'}}>
      <Audio src={staticFile('voice18.mp3')} volume={1} />
      <Audio src={staticFile('sfx/city.mp3')} volume={city} loop />
      <Audio src={staticFile('sfx/crowd.mp3')} volume={crowd} loop />
      <Audio src={staticFile('sfx/wind.mp3')} volume={wind} loop />
      <Audio src={staticFile('sfx/water.mp3')} volume={water} loop />
      <Audio src={staticFile('sfx/trickle.mp3')} volume={trickle} loop />
      <Audio src={staticFile('sfx/hum.mp3')} volume={fridge} loop />
      <Audio src={staticFile('sfx/elevgroan.mp3')} volume={elev} loop />
      <Audio src={staticFile('sfx/static.mp3')} volume={tv} loop />
      <Audio src={staticFile('sfx/fire.mp3')} volume={fire} loop />
      <Audio src={staticFile('sfx/siren.mp3')} volume={siren} loop />
      <Audio src={staticFile('sfx/gen.mp3')} volume={gen} loop />
      <Audio src={staticFile('sfx/static.mp3')} volume={stat} loop />
      <Audio src={staticFile('sfx/steps.mp3')} volume={steps} loop />
      <Audio src={staticFile('sfx/scratch.mp3')} volume={scratch} loop />
      {ev}
      <ShotView sh={sh} t={t} />
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 52%, rgba(0,2,6,0.58) 100%)', pointerEvents: 'none'}} />
      <AbsoluteFill style={{backgroundImage: 'url(' + staticFile('noise.png') + ')', backgroundSize: '256px 256px', backgroundPosition: `${(frame * 37) % 256}px ${(frame * 91) % 256}px`, opacity: 0.06, mixBlendMode: 'overlay', pointerEvents: 'none'}} />
      <Hud t={t} />
      <EpTitle t={t} />
      <AbsoluteFill style={{backgroundColor: '#000', opacity: t >= 847.2 ? 1 : 0, pointerEvents: 'none'}} />
    </AbsoluteFill>
  );
};
