import React from 'react';
import '@fontsource/montserrat/cyrillic-800.css';
import '@fontsource/montserrat/latin-800.css';
import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {ramp} from './Everest';
import {clamp, ease, lerp, mixc, Tx, E, poseStand, poseSit, poseWalk, poseReach, Pose} from './M60Base';
import {Radio} from './M60Items';
import {Full, Chars, CS, CityScene, BusStop, Supermarket, Jam, CoolCenter, BusRide, Garage, FinalCity, CarSvg, VASYA, MAXL, NIKL, WORKER, MEDIC, CROWD} from './M63Art1';
import {Room, WindowClose, ThermoWall, TapScene, Hall, Stairs, TechRoom, Phone, Desk, Medical, Fridge, Timer40, TitleCard} from './M63Art2';
import subs from './subs_s4.json';

export const FPS63 = 30;
const SPEED = 0.85;
const VOICE_END = 432.4;
const END_WORLD = 461.4;
export const DUR63 = END_WORLD / SPEED;

type Cam = [number, number, number, number, number, number];
type Shot = {a: number; b: number; sc: string; cam: Cam; p?: any; shake?: number; dizzy?: number};
const S = (a: number, b: number, sc: string, cam: Cam, p: any = {}, extra: Partial<Shot> = {}): Shot => ({a, b, sc, cam, p, ...extra});
const C0: Cam = [960, 540, 1, 960, 540, 1];
const CC = (x: number, y: number, z0: number, z1 = z0, x1 = x, y1 = y): Cam => [x, y, z0, x1, y1, z1];

// ---------- story data ----------
const interp = (pts: [number, number][], t: number) => {
  if (t <= pts[0][0]) return pts[0][1];
  for (let i = 1; i < pts.length; i++) if (t <= pts[i][0]) return lerp(pts[i - 1][1], pts[i][1], (t - pts[i - 1][0]) / (pts[i][0] - pts[i - 1][0]));
  return pts[pts.length - 1][1];
};
const TEMP: [number, number][] = [[0, 33], [14, 38], [17, 42], [30, 43], [34, 45], [60, 47], [80, 49], [99, 52], [190, 53], [262, 54], [345, 55], [362, 56], [399, 50], [403, 45], [414.5, 45], [419, 34], [432, 33], [440, 30], [455, 27]];
const HOURS: [number, number][] = [[0, 72], [14, 72], [55, 71.3], [101, 68], [190, 60], [262, 48], [315, 30], [346, 14], [362, 12], [406, 6], [415, 3], [423.7, 0]];
const WATER: [number, number][] = [[50, 15], [124, 14], [204, 13], [262, 12], [371, 11], [374, 10.5], [424, 9]];
const hotAt = (t: number) => clamp((interp(TEMP, t) - 34) / 22);
const fmtT = (h: number) => {
  const s = Math.max(0, Math.round(h * 3600));
  return `${String(Math.floor(s / 3600)).padStart(2, '0')}:${String(Math.floor((s % 3600) / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
};

const RULES: [number, string, number, number][] = [
  [1, 'НЕ ОТКРЫВАЙ ОКНА', 22.5, 27.6], [2, 'ЗАПАСИСЬ ВОДОЙ', 40.6, 45.3], [3, 'ГОТОВЬСЯ К БЛЭКАУТУ', 59.7, 64.6], [4, 'НЕ ВЫХОДИ ПОД СОЛНЦЕ', 102.3, 107.9],
  [5, 'ПОКИНЬ ПЕРЕГРЕТОЕ ЗДАНИЕ', 117.0, 122.7], [6, 'НАЙДИ ПРОХЛАДНОЕ УКРЫТИЕ', 141.3, 146.1], [7, 'СЛЕДИ ЗА ПЕРЕГРЕВОМ', 195.1, 199.2], [8, 'НЕ РИСКУЙ РАДИ МАГАЗИНА', 215.3, 220.3],
  [9, 'НЕ ВЫЕЗЖАЙ НАУГАД', 227.3, 232.2], [10, 'ПРОВЕРЯЙ ПРЕДУПРЕЖДЕНИЯ', 277.1, 281.7], [11, 'ПОМОГАЙ ДРУГИМ БЕЗОПАСНО', 291.6, 297.0], [12, 'НЕ ЕШЬ ИСПОРЧЕННОЕ', 324.7, 329.1],
  [13, 'ЭКОНОМЬ СИЛЫ, ПЕЙ ВОДУ', 365.9, 370.7], [14, 'НЕ ПРОПУСКАЙ ЭВАКУАЦИЮ', 379.6, 384.8], [15, 'НЕ ВОЗВРАЩАЙСЯ В ОПАСНУЮ ЗОНУ', 406.8, 412.9],
];

// ---------- character helpers ----------
const V = (x: number, y: number, pose: Pose, flip = false, s = 1.6): CS => ({look: VASYA, x, y, pose, flip, s});
const N = (x: number, y: number, pose: Pose, flip = false, s = 1.6): CS => ({look: NIKL, x, y, pose, flip, s});
const W = (x: number, y: number, pose: Pose, flip = false, s = 1.6): CS => ({look: WORKER, x, y, pose, flip, s});

// ---------- shot list (world time = original audio time) ----------
const SH: Shot[] = [
  // ===== CHAPTER 1 =====
  S(0, 2.6, 'city', CC(1000, 520, 1.0, 1.05, 1700), {hot: 0, cars: 1, people: 0.7}),
  S(2.6, 4.0, 'city', CC(1500, 330, 1.15, 1.9, 1500, 260), {hot: 0.02, cars: 1}),
  S(4.0, 5.5, 'phone', C0, {mode: 'forecast', k: [0, 1, 4.0, 5.3]}),
  S(5.5, 8.7, 'city', CC(1300, 880, 1.5, 1.1, 1900, 800), {hot: [0.1, 0.25, 5.5, 8.7], cars: 0.8, shimmer: 1}),
  S(8.7, 12.5, 'city', CC(2400, 700, 1.1, 1.3, 1500, 700), {hot: 0.25, cars: 0.5, people: 0.3}),
  S(12.5, 14.2, 'room', CC(1000, 640, 1.2, 1.4), {k: 'stand', hot: 0.3, bed: 1}),
  S(14.2, 16.8, 'room', CC(1150, 660, 1.4, 1.7), {k: 'sit', hot: 0.35, bed: 1}),
  S(16.8, 19.4, 'thermo', C0, {val: [38, 42, 16.8, 18.5]}),
  S(19.4, 22.5, 'phone', C0, {mode: 'alert'}),
  S(22.5, 26.8, 'room', CC(760, 600, 1.3, 1.6), {k: 'window', hot: 0.4, blinds: 0}),
  S(26.8, 30.0, 'windowc', CC(960, 540, 1.0, 1.15), {blinds: [0, 1, 27.0, 29.5], hot: 0.4}),
  S(30.0, 34.0, 'thermo', CC(960, 540, 1.0, 1.15), {val: [42, 45, 30.2, 33.0]}),
  S(34.0, 37.1, 'room', CC(1000, 640, 1.2, 1.5, 1500, 640), {k: 'walk', hot: 0.45, blinds: 1}, {shake: 1.5}),
  S(37.1, 40.4, 'tap', CC(900, 560, 1.1, 1.5), {flow: [0.7, 0.12, 37.1, 39.5], fill: 0}),
  S(40.4, 44.6, 'tap', CC(1300, 700, 1.2, 1.0), {flow: 0.14, fill: 0}),
  S(44.6, 46.6, 'tap', CC(1450, 760, 1.5, 1.7), {flow: 0.3, fill: [0, 0.3, 44.6, 46.6]}),
  S(46.6, 50.8, 'tap', CC(1000, 640, 1.2, 1.35), {flow: [0.3, 0.0, 46.6, 50.0], fill: [0.3, 1, 46.6, 50.0]}),
  S(50.8, 54.1, 'city', CC(1100, 650, 1.6, 1.2), {hot: 0.45, cars: 0.8, flash: [51.25, 51.8]}, {shake: 6}),
  S(54.1, 55.5, 'city', CC(900, 520, 2.5, 2.7), {hot: 0.45, cars: 0.3, outage: [54.3, 54.5]}),
  S(55.5, 59.7, 'room', CC(1000, 640, 1.2, 1.4), {k: 'stand', hot: 0.5, bed: 1, dark: [0, 0.85, 55.5, 56.3]}, {shake: 3}),
  S(59.7, 63.8, 'room', CC(1000, 640, 1.3, 1.5), {k: 'flash', hot: 0.5, bed: 1, dark: 0.85, blinds: 1}),
  S(63.8, 65.2, 'desk', CC(440, 600, 1.4, 1.5), {item: 0}),
  S(65.2, 66.1, 'desk', CC(830, 560, 1.5, 1.6), {item: 1}),
  S(66.1, 67.0, 'desk', CC(1220, 550, 1.5, 1.6), {item: 2}),
  S(67.0, 68.0, 'desk', CC(1600, 540, 1.5, 1.6), {item: 3}),
  S(68.0, 70.7, 'room', CC(1000, 640, 1.2, 1.5), {k: 'sweat', hot: 0.6, bed: 1, dark: 0.7, blinds: 1}),
  S(70.7, 73.6, 'thermo', C0, {val: [40, 42, 70.7, 72.6], digital: 1}),
  S(73.6, 76.4, 'hall', CC(560, 540, 1.1, 1.5), {dark: 0.75, door: 0}, {shake: 0}),
  S(76.4, 77.7, 'hall', CC(700, 600, 1.2, 1.3), {dark: 0.75, door: [0, 1, 76.5, 77.3], k: 'vasya', beam: 1}),
  S(77.7, 79.5, 'hall', CC(1000, 700, 1.2, 1.6, 1300, 800), {dark: 0.75, door: 1, nik: 1, k: 'vasya', beam: 1}),
  S(79.5, 82.4, 'hall', CC(1300, 800, 1.6, 2.0), {dark: 0.75, door: 1, nik: 1, k: 'vasya', beam: 1}),
  S(82.4, 85.0, 'phone', C0, {mode: 'bldg'}),
  S(85.0, 89.0, 'thermo', C0, {val: [52, 58, 85.0, 88.5], digital: 1}),
  S(89.0, 93.0, 'hall', CC(1350, 780, 1.7, 1.4), {dark: 0.6, door: 1, nik: 1, k: 'kneel', beam: 1}),
  S(93.0, 94.8, 'phone', C0, {mode: 'call'}),
  S(94.8, 96.4, 'hall', CC(1350, 800, 1.5, 1.7), {dark: 0.5, door: 1, nik: 1, k: 'kneel', beam: 1}),
  S(96.4, 99.0, 'hall', CC(1300, 760, 1.4, 1.6), {dark: 0.4, door: 1, k: 'nsit', beam: 0}),
  S(99.0, 102.3, 'thermo', CC(960, 540, 1.0, 1.2), {val: [50, 52, 99.0, 101.5]}),
  // ===== CHAPTER 2 =====
  S(102.3, 107.2, 'city', CC(1500, 800, 1.3, 1.0, 1700, 700), {hot: 0.8, cars: 0.05, shimmer: 1}),
  S(107.2, 109.0, 'windowc', CC(960, 540, 1.1, 1.2), {blinds: 0.4, hot: 0.8}),
  S(109.0, 111.7, 'busstop', CC(1000, 780, 1.5, 1.2), {hot: 0.8, res: 0}),
  S(111.7, 113.7, 'busstop', CC(1200, 800, 1.3, 1.1), {hot: 0.8, res: 1}),
  S(113.7, 117.1, 'room', CC(1000, 640, 1.2, 1.4), {k: 'sweat', hot: 0.85, dark: 0.45, bed: 1, blinds: 1}),
  S(117.1, 120.2, 'thermo', C0, {val: [56, 58, 117.1, 119.5]}),
  S(120.2, 122.4, 'room', CC(1100, 640, 1.3, 1.5), {k: 'walk', hot: 0.9, dark: 0.45, bed: 1, blinds: 1}),
  S(122.4, 124.8, 'garage', CC(1400, 640, 1.0, 1.25, 1600, 700), {car: 0, green: 0, ch: 'none', dark: 1}),
  S(124.8, 127.8, 'stairs', CC(900, 560, 1.1, 1.3), {prog: [0, 0.35, 124.8, 127.5], floor: '9', crack: 0}),
  S(127.8, 130.9, 'stairs', CC(900, 600, 1.3, 1.6), {prog: [0.35, 0.45, 127.8, 130.5], floor: '6', crack: 0}),
  S(130.9, 132.8, 'stairs', CC(840, 720, 2.0, 2.2), {prog: 0.45, floor: '6', crack: 0}),
  S(132.8, 136.6, 'stairs', CC(1100, 480, 1.4, 1.2), {prog: 0.45, floor: '6', crack: [0, 1, 132.9, 133.5]}, {shake: 8}),
  S(136.6, 138.6, 'stairs', CC(950, 650, 1.1, 1.2), {prog: [0.45, 0.62, 136.6, 138.4], floor: '6', crack: 1}),
  S(138.6, 141.4, 'garage', CC(500, 760, 1.2, 1.1, 900, 760), {car: 0, green: 0, ch: 'enter', dark: 1}),
  S(141.4, 145.9, 'garage', CC(900, 640, 1.0, 1.15), {car: 0, green: 0, ch: 'stand', dark: 1}),
  S(145.9, 148.3, 'garage', CC(500, 800, 1.3, 1.5), {car: 0, green: 0, ch: 'rest', dark: 1}),
  S(148.3, 151.8, 'garage', CC(450, 780, 1.5, 1.4), {car: 0, green: 0, ch: 'rest', dark: 1}),
  S(151.8, 156.6, 'garage', CC(700, 760, 1.2, 1.5, 1100, 800), {car: [152.3, 155.4], green: 0, ch: 'rest', dark: 1}, {shake: 1}),
  S(156.6, 159.8, 'garage', CC(900, 800, 1.5, 1.4, 700, 800), {car: [156.6, 158.5], green: 0, ch: 'driver', dark: 1}),
  S(159.8, 162.1, 'garage', CC(1700, 640, 1.2, 1.8, 2400, 560), {car: 0, green: 0, ch: 'rest', dark: 1}),
  S(162.1, 165.5, 'garage', CC(2800, 420, 1.8, 2.8, 2850, 400), {car: 0, green: 1, ch: 'rest', dark: 1}),
  S(165.5, 167.8, 'city', CC(1500, 650, 1.0, 1.1), {hot: 0.9, cars: 0, aband: 0.5, outage: 1, night: 0}),
  S(167.8, 169.5, 'garage', CC(2800, 560, 2.0, 2.4), {car: 0, green: 1, ch: 'door', dark: 1}),
  S(169.5, 172.0, 'garage', CC(2700, 760, 1.6, 1.8), {car: 0, green: 1, ch: 'listen', dark: 1}),
  S(172.0, 174.0, 'garage', CC(2820, 700, 2.0, 2.5), {car: 0, green: 1, ch: 'listen', dark: 1}),
  S(174.0, 177.1, 'garage', CC(2600, 780, 1.5, 1.4), {car: 0, green: 1, ch: 'talk', dark: 1}),
  S(177.1, 180.1, 'garage', CC(2850, 540, 2.3, 2.8), {car: 0, green: 1, ch: 'door', dark: 1}),
  S(180.1, 183.6, 'city', CC(2100, 600, 1.0, 1.05, 1300, 600), {hot: 0.95, cars: 0, aband: 0.7, outage: 1}),
  S(183.6, 186.2, 'phone', C0, {mode: 'call'}),
  S(186.2, 188.6, 'garage', CC(2600, 740, 1.6, 1.5), {car: 0, green: 1, ch: 'listen', dark: 1, door: [0, 1, 186.6, 188.0]}),
  S(188.6, 191.5, 'garage', CC(2800, 660, 1.5, 2.2), {car: 0, green: 1, ch: 'in', dark: 1, door: 1}),
  // ===== CHAPTER 3 =====
  S(191.5, 193.0, 'tech', CC(1000, 640, 1.3, 1.5), {sit: 1, worker: 0}),
  S(193.0, 195.2, 'tech', CC(1000, 640, 1.8, 2.1), {sit: 1, worker: 0}, {dizzy: 1}),
  S(195.2, 199.2, 'tech', CC(1050, 640, 1.4, 1.6), {sit: 1, worker: 1}, {dizzy: 0.8}),
  S(199.2, 201.7, 'tech', CC(1200, 680, 1.3, 1.5), {sit: 1, worker: 1}),
  S(201.7, 205.2, 'tech', CC(1150, 660, 1.4, 1.2), {sit: 1, worker: 1}),
  S(205.2, 208.5, 'phone', C0, {mode: 'msgmax'}),
  S(208.5, 210.6, 'super', CC(960, 540, 1.0, 1.15), {crowd: 0.3}),
  S(210.6, 212.2, 'super', CC(960, 800, 1.5, 1.7), {crowd: 0.6}),
  S(212.2, 215.4, 'super', CC(700, 760, 1.2, 1.3, 1300, 760), {crowd: 1}),
  S(215.4, 219.8, 'super', CC(1300, 540, 1.1, 1.4, 700, 700), {crowd: 1}),
  S(219.8, 223.4, 'phone', C0, {mode: 'msgmax'}),
  S(223.4, 227.4, 'jam', CC(700, 780, 1.1, 1.2, 1800, 780), {dash: 0}),
  S(227.4, 231.8, 'jam', CC(1700, 760, 1.2, 1.0, 900, 760), {dash: 0}),
  S(231.8, 233.5, 'jam', CC(1000, 800, 1.1, 1.3), {dash: 0}),
  S(233.5, 235.3, 'jam', C0, {dash: 1}),
  S(235.3, 238.4, 'phone', C0, {mode: 'msgmax'}),
  S(238.4, 242.3, 'phone', C0, {mode: 'map', k: 0}),
  S(242.3, 244.7, 'phone', CC(960, 540, 1.0, 1.3), {mode: 'map', k: 0}),
  S(244.7, 249.5, 'phone', CC(960, 560, 1.2, 1.9, 960, 640), {mode: 'map', k: 1}),
  S(249.5, 253.0, 'phone', CC(960, 640, 1.9, 1.4, 960, 560), {mode: 'map', k: 1}),
  S(253.0, 258.9, 'phone', C0, {mode: 'voice'}),
  S(258.9, 265.9, 'phone', CC(960, 560, 1.0, 1.15), {mode: 'voice'}),
  // ===== CHAPTER 4 =====
  S(265.9, 270.6, 'center', CC(1000, 640, 1.0, 1.3), {lit: 1, max: 1}),
  S(270.6, 272.7, 'phone', C0, {mode: 'map', k: 1}),
  S(272.7, 277.1, 'center', CC(960, 380, 1.5, 1.9), {lit: 1, max: 0}),
  S(277.1, 281.4, 'center', CC(960, 800, 1.2, 1.4, 700, 800), {lit: 1, max: 1}),
  S(281.4, 284.2, 'phone', C0, {mode: 'call'}),
  S(284.2, 286.4, 'phone', C0, {mode: 'coords'}),
  S(286.4, 289.7, 'tech', CC(1150, 640, 1.3, 1.6), {sit: 1, worker: 0, nik: 1}),
  S(289.7, 291.7, 'tech', CC(1120, 700, 1.8, 2.1), {sit: 1, worker: 0, nik: 1}, {shake: 1}),
  S(291.7, 296.8, 'tech', CC(1100, 650, 1.3, 1.5), {sit: 1, worker: 0, nik: 1, help: 1}),
  S(296.8, 299.0, 'tech', CC(1300, 660, 1.2, 1.4), {sit: 1, worker: 1, nik: 1, help: 1}),
  S(299.0, 302.2, 'med', CC(700, 760, 1.2, 1.4), {kind: 'bag'}),
  S(302.2, 306.4, 'med', CC(520, 800, 1.5, 1.7), {kind: 'bag'}),
  S(306.4, 313.3, 'city', CC(800, 650, 1.0, 1.15, 2300, 650), {hot: 1, cars: 0, aband: 0.4, outage: 1}),
  S(313.3, 315.8, 'city', CC(1800, 800, 1.3, 1.0), {hot: 1, cars: 0, aband: 0.6, outage: 1, shimmer: 1}),
  S(315.8, 317.5, 'tech', CC(1000, 640, 1.2, 1.4), {sit: 1, worker: 0}),
  S(317.5, 320.9, 'fridge', CC(960, 540, 1.0, 1.15), {pick: 0}),
  S(320.9, 324.8, 'fridge', CC(960, 360, 1.3, 1.8), {pick: 0}),
  S(324.8, 328.8, 'fridge', CC(960, 400, 1.7, 1.3), {pick: 0}),
  S(328.8, 332.8, 'fridge', CC(960, 800, 1.3, 1.5), {pick: 1}),
  S(332.8, 336.4, 'phone', C0, {mode: 'notice18'}),
  S(336.4, 342.6, 'phone', CC(960, 600, 1.0, 1.5, 960, 640), {mode: 'notice18'}),
  S(342.6, 344.7, 'radio', C0, {noise: 0.6}),
  S(344.7, 346.9, 'radio', CC(960, 540, 1.3, 1.6), {noise: 0.4}),
  S(346.9, 348.9, 'timer40', C0, {v: [2400, 2370, 346.9, 348.9]}),
  S(348.9, 350.4, 'desk', CC(440, 600, 1.4, 1.5), {item: 0}),
  S(350.4, 353.6, 'phone', C0, {mode: 'missed'}),
  S(353.6, 355.9, 'phone', CC(960, 540, 1.0, 1.35), {mode: 'missed'}),
  S(355.9, 358.5, 'timer40', C0, {v: [2300, 2250, 355.9, 358.2]}),
  S(358.5, 360.8, 'phone', CC(960, 600, 1.4, 1.7), {mode: 'missed'}),
  // ===== CHAPTER 5 =====
  S(360.8, 362.6, 'room', CC(1100, 640, 1.3, 1.5), {k: 'pack', hot: 1, dark: 0.35, bed: 1, blinds: 1}),
  S(362.6, 366.0, 'thermo', C0, {val: [54, 56, 362.6, 365.0]}),
  S(366.0, 370.4, 'tap', CC(1500, 740, 1.4, 1.6), {flow: 0, fill: 1}),
  S(370.4, 371.9, 'tech', CC(1000, 640, 1.3, 1.4), {sit: 1, worker: 0}),
  S(371.9, 373.5, 'tap', CC(1550, 760, 1.7, 1.9), {flow: 0, fill: 1}),
  S(373.5, 377.2, 'phone', C0, {mode: 'coords'}),
  S(377.2, 379.7, 'busext', CC(1000, 700, 1.1, 1.1), {arrive: [377.2, 379.5]}),
  S(379.7, 384.4, 'busext', CC(1100, 780, 1.4, 1.2), {arrive: [377.2, 379.5], board: 1}),
  S(384.4, 386.4, 'busride', C0, {ppl: 1}),
  S(386.4, 388.8, 'busride', CC(960, 500, 1.0, 1.1), {ppl: 1}),
  S(388.8, 391.8, 'city', CC(500, 650, 1.1, 1.1, 1900, 650), {hot: 1, cars: 0, aband: 1, shut: 1, outage: 1}),
  S(391.8, 394.6, 'city', CC(1800, 700, 1.0, 1.15, 1100, 700), {hot: 1, cars: 0, aband: 0.8, shut: 1, outage: 1, shimmer: 1}),
  S(394.6, 397.5, 'med', CC(900, 700, 1.1, 1.3), {kind: 'room'}),
  S(397.5, 399.1, 'phone', C0, {mode: 'missed'}),
  S(399.1, 401.3, 'thermo', C0, {val: [52, 50, 399.1, 401.0]}),
  S(401.3, 403.2, 'thermo', CC(960, 540, 1.1, 1.2), {val: [50, 50, 401.3, 402.8]}),
  S(403.2, 404.5, 'thermo', CC(960, 540, 1.1, 1.2), {val: [47, 45, 403.2, 404.2]}),
  S(404.5, 406.9, 'med', CC(500, 760, 1.4, 1.3), {kind: 'room'}),
  S(406.9, 412.5, 'city', CC(1500, 800, 1.2, 1.0, 1700, 800), {hot: 0.7, cars: 0, aband: 0.5, shut: 1, outage: 1, shimmer: 1}),
  S(412.5, 414.6, 'med', CC(1000, 700, 1.2, 1.4), {kind: 'room'}),
  S(414.6, 419.1, 'thermo', C0, {val: [45, 34, 414.8, 418.5]}),
  S(419.1, 421.4, 'phone', C0, {mode: 'ended'}),
  S(421.4, 423.8, 'phone', CC(960, 540, 1.0, 1.3), {mode: 'ended'}),
  S(423.8, 426.4, 'title', C0, {lines: ['00:00:00'], sub: 'АНОМАЛЬНАЯ ЖАРА ЗАВЕРШИЛАСЬ', col: '#7fffa8'}),
  S(426.4, 428.5, 'med', CC(1200, 700, 1.2, 1.3), {kind: 'resc', t0: 426.4}),
  S(428.5, 432.4, 'med', CC(1000, 700, 1.3, 1.5), {kind: 'resc', t0: 426.4, alive: 1}),
  // ===== EPILOGUE (no voice) =====
  S(432.4, 436.6, 'title', C0, {lines: ['НЕДЕЛЮ СПУСТЯ'], col: '#fff'}),
  S(436.6, 441.0, 'final', CC(1200, 650, 1.1, 1.2, 1500, 600), {rec: 0.5}),
  S(441.0, 446.0, 'final', CC(800, 650, 1.0, 1.15, 2200, 650), {rec: 0.85}),
  S(446.0, 450.0, 'final', CC(1100, 700, 1.15, 1.25, 1500, 700), {rec: 1, walk: 1}),
  S(450.0, 454.6, 'room', CC(780, 720, 1.3, 1.5, 760, 740), {k: 'windowend', hot: 0, bed: 1, blinds: 0}),
  S(454.6, 461.4, 'room', CC(780, 740, 1.5, 0.9, 960, 560), {k: 'windowend', hot: 0, bed: 1, blinds: 0, wide: 1}),
];

const tw = (v: any, t: number) => (Array.isArray(v) ? lerp(v[0], v[1], E(t, v[2], v[3])) : v);

const Scene: React.FC<{sh: Shot; t: number; fx: number}> = ({sh, t, fx}) => {
  const p = sh.p ?? {};
  const T = interp(TEMP, t);
  switch (sh.sc) {
    case 'city':
      return (
        <g>
          <CityScene t={t} p={{hot: p.hot !== undefined ? tw(p.hot, t) : hotAt(t), cars: p.cars, outage: tw(p.outage, t) > 0.5 ? 1 : 0, aband: p.aband, people: p.people, shut: p.shut, cx: fx, night: p.night}} />
          {p.flash && t > p.flash[0] && t < p.flash[1] && <Full c="#fff" o={0.6 * (1 - (t - p.flash[0]) / (p.flash[1] - p.flash[0]))} />}
        </g>
      );
    case 'busstop': return <BusStop t={t - sh.a} hot={p.hot} res={p.res} />;
    case 'room': {
      const k = p.k;
      const ch: CS[] = [];
      const fl = 1010;
      if (k === 'stand') ch.push(V(1050, fl, poseStand({mood: 'worried', nod: 2})));
      if (k === 'sit') ch.push(V(1180, 880, poseSit({mood: 'worried', nod: 10, lean: 10})));
      if (k === 'window') ch.push(V(820, fl, poseReach(75, -170, {lean: 8, mood: 'worried'}), true));
      if (k === 'walk') ch.push(V(lerp(900, 1500, E(t, sh.a, sh.b)), fl, poseWalk(t, 2.8, 8), false));
      if (k === 'flash') ch.push(V(1050, fl, poseReach(80, -150, {lean: 8, mood: 'scared'})));
      if (k === 'sweat') ch.push(V(1050, fl, poseStand({mood: 'worried', nod: 12, lean: 12})));
      if (k === 'pack') ch.push(V(lerp(900, 1300, E(t, sh.a, sh.b)), fl, poseWalk(t, 2.8, 14, {hf: [64, -130]}), false));
      if (k === 'windowend') ch.push(V(780, fl, poseStand({mood: 'happy', nod: -4}), true, 1.6));
      return <Room t={t} hot={p.hot !== undefined ? tw(p.hot, t) : hotAt(t)} dark={tw(p.dark ?? 0, t)} blinds={p.blinds ?? 0} chars={ch} bed={!!p.bed} />;
    }
    case 'windowc': return <WindowClose t={t} blinds={tw(p.blinds, t)} hot={p.hot} />;
    case 'thermo': return <ThermoWall t={t} val={tw(p.val, t)} digital={!!p.digital} />;
    case 'tap': return <TapScene t={t} flow={tw(p.flow, t)} fill={tw(p.fill, t)} />;
    case 'hall': {
      const ch: CS[] = [];
      const k = p.k;
      if (k === 'vasya') ch.push(V(420, 1010, poseStand({mood: 'scared', hf: [60, -150]}), false, 1.5));
      if (k === 'kneel') ch.push(V(1220, 1010, poseReach(80, -80, {lean: 28, hip: [0, -86], mood: 'worried'}), false, 1.5));
      if (k === 'nsit') ch.push(N(1480, 1010, poseSit({nod: 6, lean: 10}), false, 1.5), V(1230, 1010, poseReach(70, -120, {lean: 20}), false, 1.5));
      return <Hall t={t} dark={tw(p.dark, t)} door={tw(p.door ?? 0, t)} nik={p.nik ?? 0} chars={ch} beam={!!p.beam} />;
    }
    case 'phone': return <Phone t={t} mode={p.mode} k={tw(p.k ?? 1, t)} />;
    case 'desk': return <Desk t={t} item={p.item} />;
    case 'stairs': return <Stairs t={t} prog={tw(p.prog, t)} crack={tw(p.crack, t)} floor={p.floor} />;
    case 'garage': {
      const ch: CS[] = [];
      const k = p.ch;
      const d = p.door ? tw(p.door, t) : 0;
      if (k === 'enter') ch.push(V(lerp(300, 700, E(t, sh.a, sh.b)), 1010, poseWalk(t, 2.4, 10), false, 1.5), N(lerp(150, 560, E(t, sh.a, sh.b)), 1010, poseWalk(t + 0.3, 2.0, 12), false, 1.5));
      if (k === 'stand') ch.push(V(700, 1010, poseStand({mood: 'worried'}), false, 1.5), N(560, 1010, poseStand({nod: 8}), false, 1.5));
      if (k === 'rest') ch.push(V(560, 1010, poseSit({nod: 6}), false, 1.5), N(380, 1010, poseSit({nod: 10, lean: 12}), false, 1.5));
      if (k === 'driver') ch.push(V(lerp(560, 820, E(t, sh.a, sh.b)), 1010, poseWalk(t, 2.6, 8, {hf: [70, -160]}), false, 1.5), {look: CROWD, x: 1250, y: 1010, pose: poseStand({mood: 'worried'}), flip: true, s: 1.5});
      if (k === 'listen') ch.push(N(2640, 1010, poseStand({nod: 12, lean: 12}), false, 1.5), V(2450, 1010, poseStand({mood: 'worried'}), false, 1.5));
      if (k === 'talk') ch.push(N(2640, 1010, poseStand({nod: 4, hf: [60, -150]}), false, 1.5), V(2450, 1010, poseStand({mood: 'worried'}), false, 1.5));
      if (k === 'in') ch.push(W(2780, 1010, poseStand(), true, 1.5), V(2500, 1010, poseWalk(t, 2.4, 8), false, 1.5), N(2350, 1010, poseWalk(t + 0.2, 2.0, 10), false, 1.5));
      return <Garage t={t} car={tw(p.car ?? 0, t) > 0.5 ? 1 : 0} green={p.green ?? 0} chars={ch} door={d} bench={k === 'rest' || k === 'driver'} />;
    }
    case 'tech': {
      let ch: CS[] | undefined;
      if (p.nik) {
        ch = [N(1000, 828, poseSit({mood: 'worried', nod: 14, lean: 12}), false, 1.5)];
        if (p.help) ch.push(V(780, 1010, poseReach(80, -120, {lean: 24, hip: [0, -100]}), false, 1.5));
        else ch.push(V(1400, 1010, poseStand({mood: 'worried'}), true, 1.5));
        if (p.worker) ch.push(W(lerp(1800, 1350, E(t, sh.a, sh.a + 1.5)), 1010, poseWalk(t, 2.4, 8), true, 1.5));
      }
      return <TechRoom t={t} sit={!!p.sit} worker={!!p.worker} chars={ch} />;
    }
    case 'super': return <Supermarket t={t} crowd={p.crowd} />;
    case 'jam': return <Jam t={t} dash={p.dash} />;
    case 'center': return <CoolCenter t={t} lit={p.lit} max={p.max} />;
    case 'med': return <Medical t={t - (p.t0 ?? 0)} kind={p.kind} />;
    case 'fridge': return <Fridge t={t} pick={p.pick} />;
    case 'timer40': return <Timer40 t={t} v={tw(p.v, t)} />;
    case 'title': return <TitleCard lines={p.lines} sub={p.sub} col={p.col} />;
    case 'radio':
      return (
        <g>
          <Full c="#2a1e16" />
          <Radio x={960} y={540} s={2.4} t={t} on={1} needle={0.55} noise={p.noise} />
          <Tx x={960} y={200} size={64} fill="#ffb04a" o={0.6 + 0.4 * Math.sin(t * 9)}>ЭКСТРЕННОЕ ОБЪЯВЛЕНИЕ</Tx>
        </g>
      );
    case 'busride': return <BusRide t={t} hot={hotAt(t)} ppl={!!p.ppl} />;
    case 'busext': {
      const k = E(t, p.arrive[0], p.arrive[1]);
      return (
        <g>
          <CityScene t={t} p={{hot: hotAt(t), cars: 0, aband: 0.3, cx: fx}} />
          <g transform={`translate(${lerp(2700, 1300, k)} 1030)`}>
            <rect x={-330} y={-250} width={660} height={230} rx={26} fill="#e8862a" /><rect x={-330} y={-130} width={660} height={20} fill="#fff" opacity={0.6} />
            {[0, 1, 2, 3, 4].map((i) => <rect key={i} x={-300 + i * 110} y={-230} width={90} height={80} rx={8} fill="#cfe6f7" />)}
            <rect x={-330} y={-250} width={0} height={0} /><Tx x={0} y={-110} size={44} fill="#fff">ЭВАКУАЦИЯ</Tx>
            <circle cx={-210} cy={-14} r={36} fill="#15171c" /><circle cx={200} cy={-14} r={36} fill="#15171c" />
          </g>
          {p.board && <Chars list={[V(1700, 1030, poseWalk(t, 2.6, 8), true, 1.3), N(1860, 1034, poseWalk(t + 0.3, 2.0, 12), true, 1.3)]} />}
        </g>
      );
    }
    case 'final': {
      const ch: CS[] = p.walk ? [V(lerp(900, 1700, E(t, sh.a, sh.b)), 1020, poseWalk(t, 2.6, 6, {hf: [60, -120]}), false, 1.2)] : [];
      return <g><FinalCity t={t} rec={p.rec} cx={fx} /><Chars list={ch} /></g>;
    }
    default: return null;
  }
};

const ShotView: React.FC<{sh: Shot; t: number}> = ({sh, t}) => {
  const k = ease(clamp((t - sh.a) / Math.max(0.01, sh.b - sh.a)));
  const c = sh.cam;
  const fx = lerp(c[0], c[3], k), fy = lerp(c[1], c[4], k), s = lerp(c[2], c[5], k);
  const shk = sh.shake ?? 0;
  const hot = hotAt(t);
  const content = <Scene sh={sh} t={t} fx={fx} />;
  const tf = `translate(${960 + shk * Math.sin(t * 61)} ${540 + shk * Math.cos(t * 53)}) scale(${s}) translate(${-fx} ${-fy})`;
  const dz = sh.dizzy ?? 0;
  return (
    <AbsoluteFill style={{filter: `saturate(${1 - hot * 0.3})`}}>
      <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{position: 'absolute', left: 0, top: 0}}>
        <g transform={tf}>{content}</g>
      </svg>
      {dz > 0 && (
        <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{position: 'absolute', left: 0, top: 0, opacity: 0.45 * dz, filter: 'blur(5px)'}}>
          <g transform={`translate(${Math.sin(t * 2.2) * 26} ${Math.cos(t * 1.7) * 14}) ${tf}`}>{content}</g>
        </svg>
      )}
    </AbsoluteFill>
  );
};

// ---------- overlays ----------
const Hud: React.FC<{t: number}> = ({t}) => {
  if (t > 457) return null;
  const epi = t > 432.2;
  const T = interp(TEMP, t);
  const red = clamp((T - 48) / 6);
  const col = mixc('#ffffff', '#ff5a4a', red);
  const hrs = interp(HOURS, t);
  const waterOn = t >= 50 && t < 432.2;
  const water = interp(WATER, t);
  const end = t >= 423.7;
  const pill = {height: 72, borderRadius: 36, background: 'rgba(8,12,20,0.68)', display: 'flex', alignItems: 'center', padding: '0 28px', color: '#fff', fontFamily: 'Montserrat, sans-serif', fontWeight: 800 as const, fontSize: 40, gap: 14};
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <div style={{position: 'absolute', top: 28, left: 40, ...pill, color: col, boxShadow: red > 0.5 ? '0 0 26px rgba(255,60,40,0.55)' : undefined}}>
        <span style={{fontSize: 36}}>🌡</span>{`${T >= 0 ? '+' : '−'}${Math.round(Math.abs(T))}°C`}
      </div>
      {!epi && <div style={{position: 'absolute', top: 28, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
        <div style={{...pill, fontSize: 44, color: end ? '#7fffa8' : '#fff'}}>
          <span style={{fontSize: 22, fontWeight: 700, color: '#9fb4d0', letterSpacing: 2}}>ДО КОНЦА</span>
          <span style={{fontVariantNumeric: 'tabular-nums'}}>{fmtT(hrs)}</span>
        </div>
      </div>}
      {waterOn && (
        <div style={{position: 'absolute', top: 28, right: 40, ...pill}}>
          <span style={{fontSize: 34}}>💧</span>{`${water.toFixed(1).replace('.', ',')} Л`}
        </div>
      )}
    </AbsoluteFill>
  );
};

const RuleCard: React.FC<{t: number}> = ({t}) => {
  const r = RULES.find((x) => t >= x[2] - 0.1 && t < x[3] + 0.4);
  if (!r) return null;
  const k = clamp((t - r[2] + 0.1) / 0.35);
  const o = Math.min(k, clamp((r[3] + 0.4 - t) / 0.35));
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <div style={{position: 'absolute', top: 126, left: 0, right: 0, display: 'flex', justifyContent: 'center', opacity: o, transform: `translateY(${(1 - k) * -26}px)`}}>
        <div style={{display: 'flex', alignItems: 'stretch', borderRadius: 20, overflow: 'hidden', boxShadow: '0 8px 30px rgba(0,0,0,0.45)', fontFamily: 'Montserrat, sans-serif', fontWeight: 800}}>
          <div style={{background: '#ff9a1f', color: '#1a1208', padding: '14px 26px', fontSize: 40}}>{`ПРАВИЛО ${r[0]}`}</div>
          <div style={{background: 'rgba(8,12,20,0.88)', color: '#fff', padding: '14px 28px', fontSize: 40}}>{r[1]}</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

type RW = [string, number, number];
const Subs: React.FC<{t: number}> = ({t}) => {
  let p: [number, number, RW[]] | undefined;
  for (const x of subs as any) if (t >= x[0] - 0.04 && t < x[1] + 0.1) p = x;
  if (!p) return null;
  const k = clamp((t - p[0] + 0.04) / 0.12);
  const o = Math.min(k, clamp((p[1] + 0.1 - t) / 0.06));
  const sc = 0.92 + 0.08 * ease(k);
  return (
    <AbsoluteFill style={{justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 118}}>
      <div style={{opacity: o, transform: `scale(${sc})`, width: 1720, textAlign: 'center', fontFamily: 'Montserrat, sans-serif', fontWeight: 800, fontSize: 70, lineHeight: 1.15, textTransform: 'uppercase', WebkitTextStroke: '8px #05070f', paintOrder: 'stroke fill', textShadow: '0 5px 0 rgba(0,0,0,0.35)'}}>
        {p[2].map(([w, s, e], i) => {
          const on = t >= s - 0.02 && t < e + 0.12;
          return <span key={i} style={{display: 'inline-block', color: on ? '#ffab26' : '#ffffff', margin: '0 17px', transform: on ? 'scale(1.06)' : undefined, textShadow: on ? '0 0 22px rgba(255,160,30,0.7), 0 5px 0 rgba(0,0,0,0.35)' : undefined}}>{w}</span>;
        })}
      </div>
    </AbsoluteFill>
  );
};

const FinalText: React.FC<{t: number}> = ({t}) => {
  if (t < 456.4) return null;
  const k = clamp((t - 456.4) / 1.2);
  return (
    <AbsoluteFill style={{justifyContent: 'flex-start', alignItems: 'center', paddingTop: 230, opacity: k}}>
      <div style={{background: 'rgba(6,8,12,0.62)', padding: '30px 56px', borderRadius: 28, fontFamily: 'Montserrat, sans-serif', fontWeight: 800, fontSize: 76, color: '#fff', letterSpacing: 1, textAlign: 'center'}}>
        72 ЧАСА. 15 ПРАВИЛ. <span style={{color: '#ffab26'}}>ОДНА ЖИЗНЬ.</span>
      </div>
    </AbsoluteFill>
  );
};

const AliveBanner: React.FC<{t: number}> = ({t}) => {
  if (t < 429.2 || t > 432.4) return null;
  const k = clamp((t - 429.2) / 0.5);
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <div style={{position: 'absolute', top: 250, left: 0, right: 0, display: 'flex', justifyContent: 'center', opacity: k}}>
        <div style={{background: '#2a7a4a', color: '#fff', padding: '16px 40px', borderRadius: 22, fontFamily: 'Montserrat, sans-serif', fontWeight: 800, fontSize: 52, boxShadow: '0 8px 30px rgba(0,0,0,0.4)'}}>МАКС НАЙДЕН ЖИВЫМ</div>
      </div>
    </AbsoluteFill>
  );
};

export const M63: React.FC = () => {
  const frame = useCurrentFrame();
  const t = (frame / FPS63) * SPEED;
  const idx = SH.findIndex((s) => t >= s.a && t < s.b);
  const sh = SH[Math.max(0, idx)];
  const hot = hotAt(t);
  const SFX = (a: number, d: number, src: string, v: number | ((f: number) => number)) => (
    <Sequence key={`${src}${a}`} from={Math.round((a / SPEED) * FPS63)} durationInFrames={Math.max(1, Math.round((d / SPEED) * FPS63))}>
      <Audio src={staticFile(`sfx/${src}.mp3`)} volume={v} />
    </Sequence>
  );
  const rampT = (pts: [number, number][]) => ramp(pts.map(([a, v]) => [a / SPEED, v] as [number, number]));
  const music = rampT([[0, 0.06], [55.0, 0.07], [55.5, 0], [59.5, 0], [61, 0.06], [190, 0.07], [264, 0.08], [265.5, 0.02], [268, 0.07], [360, 0.09], [420, 0.07], [423.5, 0.05], [433, 0.07], [455, 0.08], [460, 0.0], [461.4, 0]]);
  const traffic = rampT([[0, 0.07], [12, 0.07], [14, 0.02], [50, 0.02], [53, 0.06], [55, 0.0], [432.5, 0.0], [435, 0.07], [455, 0.05], [460, 0]]);
  const birds = rampT([[0, 0.08], [12, 0.06], [14, 0], [432.5, 0], [436, 0.08], [455, 0.06], [460, 0]]);
  const fan = rampT([[171, 0], [175, 0.05], [262, 0.05], [265, 0], [286, 0], [288, 0.05], [320, 0.05], [372, 0.05], [376, 0], [394, 0], [396, 0.05], [432, 0.05], [433, 0]]);
  const water = rampT([[37.0, 0], [37.3, 0.07], [39.5, 0.04], [46, 0.05], [49.8, 0.04], [50.2, 0]]);
  const siren = rampT([[110, 0], [111, 0.03], [116, 0.03], [117, 0], [378, 0], [379, 0.025], [392, 0.02], [394, 0]]);
  const engine = rampT([[152.2, 0], [152.6, 0.05], [155.2, 0.05], [155.6, 0], [377.5, 0], [378.5, 0.06], [391.5, 0.05], [392, 0]]);
  const horn = rampT([[223.5, 0], [224.5, 0.04], [232, 0.04], [233, 0]]);
  const stat = rampT([[342.5, 0], [343, 0.05], [346.8, 0.04], [347.2, 0]]);
  const hum = rampT([[34.8, 0], [35.2, 0.05], [37.0, 0.06], [37.4, 0]]);
  const ev: React.ReactNode[] = [
    SFX(19.4, 1.0, 'notif', 0.1), SFX(19.8, 0.8, 'vib', 0.07), SFX(27.0, 2.5, 'scroll', 0.06),
    SFX(51.2, 0.8, 'hit', 0.11), SFX(54.3, 0.4, 'click', 0.08), SFX(55.4, 0.8, 'static', 0.07), SFX(55.6, 0.6, 'click', 0.08),
    SFX(73.9, 0.6, 'thud', 0.12), SFX(74.5, 0.6, 'thud', 0.12), SFX(76.6, 1.2, 'creak', 0.08),
    SFX(82.4, 0.8, 'notif', 0.09), SFX(85.3, 0.6, 'beep', 0.05), SFX(87.0, 0.6, 'beep', 0.05), SFX(93.0, 1.6, 'ring', 0.06),
    SFX(133.0, 1.6, 'glass', 0.12), SFX(166.5, 0.5, 'click', 0.06), SFX(183.6, 1.6, 'ring', 0.06), SFX(187.2, 1.2, 'creak', 0.08),
    SFX(205.2, 0.8, 'notif', 0.09), SFX(253.0, 0.8, 'notif', 0.09), SFX(281.4, 1.6, 'ring', 0.06), SFX(332.8, 0.8, 'notif', 0.09),
    SFX(346.9, 0.5, 'beep', 0.07), SFX(355.9, 0.5, 'beep', 0.07), SFX(419.1, 0.8, 'notif', 0.09), SFX(421.4, 1.0, 'success', 0.08), SFX(423.8, 1.0, 'ping', 0.07),
  ];
  return (
    <AbsoluteFill style={{backgroundColor: '#000'}}>
      <Audio src={staticFile('voice13.mp3')} volume={1} />
      <Audio src={staticFile('sfx/m63.mp3')} volume={music} loop />
      <Audio src={staticFile('sfx/traffic.mp3')} volume={traffic} loop />
      <Audio src={staticFile('sfx/birds.mp3')} volume={birds} loop />
      <Audio src={staticFile('sfx/fan.mp3')} volume={fan} loop />
      <Audio src={staticFile('sfx/water.mp3')} volume={water} loop />
      <Audio src={staticFile('sfx/siren.mp3')} volume={siren} loop />
      <Audio src={staticFile('sfx/engine.mp3')} volume={engine} loop />
      <Audio src={staticFile('sfx/horn.mp3')} volume={horn} loop />
      <Audio src={staticFile('sfx/static.mp3')} volume={stat} loop />
      <Audio src={staticFile('sfx/hum.mp3')} volume={hum} loop />
      {ev}
      <ShotView sh={sh} t={t} />
      <AbsoluteFill style={{background: `linear-gradient(180deg, rgba(255,130,30,${hot * 0.1}) 0%, rgba(255,150,40,${hot * 0.14}) 100%)`, mixBlendMode: 'multiply', pointerEvents: 'none'}} />
      <AbsoluteFill style={{background: `radial-gradient(ellipse at 78% 12%, rgba(255,240,200,${0.06 + hot * 0.14}) 0%, rgba(255,240,200,0) 55%)`, pointerEvents: 'none'}} />
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 62%, rgba(10,6,4,0.32) 100%)'}} />
      <Hud t={t} />
      <RuleCard t={t} />
      <AliveBanner t={t} />
      <FinalText t={t} />
      <Subs t={t} />
      {t < 3.2 && (
        <AbsoluteFill style={{pointerEvents: 'none', justifyContent: 'center', alignItems: 'center', opacity: Math.min(clamp(t / 0.6), clamp((3.2 - t) / 0.6))}}>
          <div style={{marginTop: 20, fontFamily: 'Montserrat, sans-serif', fontWeight: 800, fontSize: 96, color: '#fff', WebkitTextStroke: '10px #05070f', paintOrder: 'stroke fill', textAlign: 'center', lineHeight: 1.1}}>+60°C<br /><span style={{fontSize: 58}}>72 ЧАСА ДО КОНЦА</span></div>
        </AbsoluteFill>
      )}
      <AbsoluteFill style={{backgroundColor: '#000', opacity: t >= 459.4 ? clamp((t - 459.4) / 2) : 0}} />
    </AbsoluteFill>
  );
};
