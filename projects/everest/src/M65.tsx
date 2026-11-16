import React from 'react';
import '@fontsource/montserrat/cyrillic-800.css';
import '@fontsource/montserrat/latin-800.css';
import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {ramp} from './Everest';
import {clamp, ease, lerp, rnd, Tx, E, Pose, poseStand, poseWalk, poseSit, poseReach} from './M60Base';
import {Full, Man, MAXIM, GENN, Corridor, DoorClose, PlayRoom, Canteen, ChairBack, Bedroom, KinderExt, PostRoom, Paper, Phone, ClockBig, FusePanel, HomeRoom, CarWreck} from './M65Art';
import subs from './subs_s6.json';

export const FPS65 = 30;
export const DUR65 = 785.2;
const END_VOICE = 782.4;

type Cam = [number, number, number, number, number, number];
type Shot = {a: number; b: number; sc: string; cam: Cam; p?: any; shake?: number};
const C = (x: number, y: number, z0: number, z1 = z0, x1 = x, y1 = y): Cam => [x, y, z0, x1, y1, z1];
const S = (a: number, b: number, sc: string, cam: Cam, p: any = {}, shake = 0): Shot => ({a, b, sc, cam, p, shake});
const C0: Cam = [960, 540, 1, 960, 540, 1];

const SH: Shot[] = [
  // ===== 0:00 hook =====
  S(0, 3.5, 'corr', C(2300, 440, 1.0, 1.15, 3000, 440), {lights: 0.7, flick: 1, dark: 0.25, bike: [1900, 3050, 0, 3.5]}),
  S(3.5, 5.6, 'door', C0, {knocks: [4.1, 4.6, 5.1], handle: 0}, 0),
  S(5.6, 8.4, 'corr', C(3500, 460, 1.4, 1.6), {lights: 0.6, flick: 1, dark: 0.3, cctv: 3, gone: 1}),
  S(8.4, 10.8, 'home', C(900, 640, 1.2, 1.4), {k: 'sit', light: 0.5, glitch: 1, rewind: 1}),
  S(10.8, 13.9, 'home', C(900, 640, 1.2, 1.4), {k: 'stand', light: 0.7}),
  // ===== accident =====
  S(13.9, 17.5, 'car', C(900, 700, 1.0, 1.25)),
  S(17.5, 21.0, 'car', C(600, 740, 1.9, 2.2, 560, 760)),
  S(21.0, 26.0, 'paper', C0, {kind: 'invoice', k: [0, 1, 22.5, 24.5]}),
  S(26.0, 30.0, 'paper', C(960, 700, 1.1, 1.7, 960, 760), {kind: 'invoice', k: 1}),
  S(30.0, 33.0, 'home', C(900, 700, 1.4, 1.6), {k: 'sit', light: 0.5}),
  // ===== vacancies =====
  S(33.0, 40.0, 'phone', C0, {mode: 'jobs', k: [0, 1, 36.5, 43.5]}),
  S(40.0, 44.0, 'phone', C(960, 450, 1.3, 1.4), {mode: 'jobs', k: [0, 1, 36.5, 43.5]}),
  S(44.0, 48.0, 'phone', C0, {mode: 'ad', k: [0, 0.3, 44, 48]}),
  S(48.0, 52.0, 'phone', C(960, 380, 1.3, 1.5), {mode: 'ad', k: [0.2, 0.5, 48, 52]}),
  S(52.0, 57.0, 'phone', C0, {mode: 'ad', k: [0.5, 1, 52, 57]}),
  S(57.0, 59.5, 'phone', C(960, 540, 1.1, 1.3), {mode: 'ad', k: 1}),
  S(59.5, 63.0, 'home', C(900, 650, 1.3, 1.5), {k: 'sit', light: 0.5}),
  S(63.0, 69.0, 'phone', C0, {mode: 'call', k: [0, 0.5, 63, 69]}),
  S(69.0, 76.0, 'phone', C(960, 540, 1.0, 1.2), {mode: 'call', k: [0.5, 1, 69, 76]}),
  S(76.0, 82.0, 'ext', C(1300, 640, 0.9, 1.1, 1100, 640), {swing: 0.5}),
  S(82.0, 86.0, 'ext', C(1000, 540, 1.3, 1.6, 1000, 500), {swing: 0.5}),
  S(86.0, 91.0, 'phone', C(960, 540, 1.1, 1.0), {mode: 'call', k: 1}),
  S(91.0, 95.0, 'home', C(900, 650, 1.3, 1.5), {k: 'sit', light: 0.5}),
  S(95.0, 99.0, 'home', C(1000, 650, 1.1, 1.2), {k: 'walk', light: 0.5}),
  // ===== arrival =====
  S(99.0, 105.0, 'ext', C(1000, 650, 1.0, 1.15), {swing: 1, walkM: [99, 105, 200, 800]}),
  S(105.0, 111.0, 'ext', C(2300, 700, 1.4, 1.6), {swing: 1.6}),
  S(111.0, 116.0, 'ext', C(1000, 680, 1.4, 1.5), {swing: 1, gv: 1, gx: 1050, mx: 700}),
  S(116.0, 118.0, 'ext', C(1000, 680, 1.5, 1.7), {swing: 1, gv: 1, gx: 1050, mx: 700}),
  S(118.0, 125.0, 'corr', C(500, 450, 1.0, 1.0, 1900, 450), {lights: 1, dark: 0.15, walkBoth: [118, 125, 300, 1700]}),
  S(125.0, 132.0, 'post', C(960, 540, 1.0, 1.25), {clock: '21:50', chars: 'duo'}),
  S(132.0, 135.0, 'post', C(1000, 640, 1.3, 1.4), {clock: '21:52', chars: 'duo'}),
  S(135.0, 138.5, 'paper', C0, {kind: 'contract', k: [0, 1, 135.5, 137.5]}),
  S(138.5, 143.0, 'paper', C(960, 700, 1.0, 1.3), {kind: 'rules', k: [0, 0.1, 138.5, 143]}),
  // ===== seven rules =====
  S(143.0, 149.0, 'play', C(960, 600, 1.0, 1.15), {dark: 0.6}),
  S(149.0, 153.0, 'paper', C0, {kind: 'rules', k: [0.12, 0.2, 149, 153]}),
  S(153.0, 158.0, 'corr', C(1600, 450, 1.1, 1.3), {lights: 0.5, flick: 1, dark: 0.3}),
  S(158.0, 161.0, 'paper', C0, {kind: 'rules', k: [0.26, 0.32, 158, 161]}),
  S(161.0, 166.0, 'fuse', C0, {sw: 0}),
  S(166.0, 169.0, 'paper', C0, {kind: 'rules', k: [0.38, 0.46, 166, 169]}),
  S(169.0, 176.0, 'canteen', C(960, 640, 1.0, 1.2), {dark: 0.5}),
  S(176.0, 180.0, 'canteen', C(1860, 740, 1.4, 1.9), {dark: 0.55}),
  S(180.0, 185.0, 'door', C(960, 540, 1.0, 1.1), {knocks: [], handle: 0}),
  S(185.0, 189.0, 'paper', C0, {kind: 'rules', k: [0.62, 0.7, 185, 189]}),
  S(189.0, 196.0, 'bed', C(1500, 760, 1.0, 1.4, 1900, 700), {light: 1, lump: 0, dark: 0.4}),
  S(196.0, 201.0, 'post', C(1500, 300, 1.4, 1.8), {clock: '05:55', chars: 'none'}),
  S(201.0, 207.0, 'clock', C0, {text: '05:55'}),
  S(207.0, 211.0, 'post', C(1100, 650, 1.2, 1.3), {clock: '21:55', chars: 'duo'}),
  S(211.0, 218.0, 'post', C(1300, 650, 1.2, 1.3), {clock: '21:58', chars: 'leave', leave: [214, 218]}),
  // ===== night begins =====
  S(218.0, 222.0, 'clock', C0, {text: [['22:00', 218], ['22:30', 221]]}),
  S(222.0, 227.0, 'corr', C(500, 460, 1.2, 1.2, 1500, 460), {lights: 0.6, dark: 0.4, walkM: [222, 227, 400, 1300], flash: 1}),
  S(227.0, 234.0, 'play', C(900, 650, 1.0, 1.1), {beam: [227, 234], dark: 0.75, maxim: 1}),
  S(234.0, 237.0, 'play', C(960, 860, 2.4, 2.7), {beamCube: 1, dark: 0.8}),
  S(237.0, 243.0, 'play', C(900, 760, 1.5, 1.7), {beamCube: 1, dark: 0.8, maxim: 'reach'}),
  S(243.0, 247.0, 'corr', C(1300, 460, 1.2, 1.2, 500, 460), {lights: 0.6, dark: 0.4, walkM: [243, 247, 1300, 400], flip: 1, flash: 1}),
  S(247.0, 252.0, 'play', C(960, 600, 1.0, 1.0), {cctv: 4, dark: 0.3, maxim: 'cam', cube: [1300, 860, 1300, 860]}),
  S(252.0, 260.0, 'play', C(1000, 820, 1.2, 1.7, 1000, 900), {cctv: 4, dark: 0.3, cube: [1300, 860, 980, 1010, 252, 259]}),
  S(260.0, 265.0, 'play', C(980, 960, 2.2, 2.4), {cctv: 4, dark: 0.3, cube: [980, 1010, 980, 1010], glitch: 0.4}),
  S(265.0, 272.0, 'play', C(960, 600, 1.0, 1.1), {cctv: 4, dark: 0.3, maxim: 'cam2', cube: [980, 1010, 980, 1010], kid: [268.1, 268.45], rewind: [263, 267.5], glitch: 0.5}, 2),
  S(272.0, 277.0, 'post', C(640, 330, 1.7, 1.9), {clock: '22:40', chars: 'sit', feeds: {kid: 0}}),
  S(277.0, 283.0, 'corr', C(1700, 450, 1.1, 1.2), {lights: 0.45, flick: 1, dark: 0.45}),
  S(283.0, 292.0, 'post', C(960, 560, 1.0, 1.2), {clock: '23:05', chars: 'sit'}),
  S(292.0, 297.0, 'door', C(960, 540, 1.0, 1.1), {knocks: [], handle: 1}),
  S(297.0, 302.0, 'post', C(960, 560, 1.1, 1.1), {clock: '23:15', chars: 'sit', dark: 0.5}),
  S(302.0, 310.0, 'corr', C(2200, 450, 1.1, 1.25, 3100, 450), {lights: 0.5, dark: 0.4, cctv: 3, bike: [2000, 3300, 304, 312]}),
  S(310.0, 318.0, 'post', C(640, 330, 2.3, 2.5, 620, 330), {clock: '23:20', chars: 'sit', feeds: {bike: [20, 270, 310, 318]}}),
  S(318.0, 323.0, 'door', C0, {knocks: [320.6, 321.5, 322.4], handle: 0}, 0),
  S(323.0, 328.0, 'corr', C(3500, 460, 1.4, 1.5), {lights: 0.5, dark: 0.4, cctv: 3, gone: 1, knocks: [326]}),
  S(328.0, 332.0, 'door', C0, {knocks: [], drag: [328.3, 331.2]}),
  S(332.0, 337.0, 'phone', C0, {mode: 'nonet'}),
  S(337.0, 342.0, 'corr', C(3100, 450, 1.1, 1.2, 2200, 450), {lights: 0.5, dark: 0.4, cctv: 3, bike: [3300, 2000, 338, 344], bikeDir: -1}),
  S(342.0, 347.0, 'clock', C0, {text: '23:55'}),
  S(347.0, 353.0, 'fuse', C0, {sw: [0, 1, 350, 350.6]}),
  S(353.0, 357.0, 'post', C(640, 330, 1.5, 1.8), {clock: '00:00', chars: 'sit', feeds: {light: 0}, dark: 0.5}),
  S(357.0, 364.0, 'corr', C(2000, 450, 1.1, 1.2), {lights: 0, dark: 0.82, cctv: 2, patter: 1}, 0),
  S(364.0, 369.0, 'clock', C0, {timer: 1, red: 0.2}),
  S(369.0, 371.0, 'corr', C(2800, 450, 1.3, 1.5), {lights: 0, dark: 0.9, cctv: 2}),
  S(371.0, 378.0, 'door', C(960, 540, 1.0, 1.15), {knocks: [], handle: 0, dark: 0.7}),
  S(378.0, 382.0, 'door', C(960, 540, 1.2, 1.5), {knocks: [], handle: 0, dark: 0.75}, 1),
  S(382.0, 385.0, 'clock', C0, {timer: 1, red: 0.8}),
  S(385.0, 391.0, 'door', C(960, 600, 1.4, 1.2), {knocks: [], handle: 0, dark: 0.8}, 1),
  S(391.0, 394.0, 'fuse', C0, {sw: [1, 0, 391.5, 392]}),
  S(394.0, 399.0, 'corr', C(700, 450, 1.1, 1.2, 1500, 450), {lights: 1, dark: 0.3, fp: [0, 0.5, 395, 399]}),
  S(399.0, 402.0, 'corr', C(1500, 450, 1.1, 1.2, 2400, 450), {lights: 1, dark: 0.3, fp: 1}),
  // ===== canteen =====
  S(402.0, 406.0, 'corr', C(2000, 460, 1.2, 1.2, 2400, 460), {lights: 0.6, dark: 0.4, fp: 1, walkM: [402, 406, 1800, 2380]}),
  S(406.0, 412.0, 'canteen', C(960, 640, 1.0, 1.1), {dark: 0.6, maxim: 'in'}),
  S(412.0, 419.0, 'canteen', C(960, 640, 1.1, 1.3, 1100, 700), {dark: 0.55, count: 1}),
  S(419.0, 425.0, 'canteen', C(1100, 700, 1.1, 1.15), {dark: 0.55, maxim: 'turn'}),
  S(425.0, 429.0, 'canteen', C(1860, 740, 1.6, 2.3), {dark: 0.5, th: [425.2, 426.2]}, 2),
  S(429.0, 434.0, 'canteen', C(1500, 760, 1.2, 1.1), {dark: 0.5, th: 1, maxim: 'back'}),
  S(434.0, 441.0, 'chair', C(960, 560, 1.0, 1.15), {k: [0, 1, 435, 439.5]}),
  S(441.0, 445.0, 'corr', C(2200, 450, 1.2, 1.3, 1800, 450), {lights: 0.5, flick: 1, dark: 0.4, walkM: [441, 445, 2400, 1700], flip: 1, run: 1}, 2),
  S(445.0, 448.0, 'canteen', C(960, 700, 1.1, 1.2), {dark: 0.7, th: 1, scrape: 1}, 3),
  S(448.0, 452.0, 'post', C(1700, 600, 1.3, 1.2), {clock: '01:20', chars: 'sit', dark: 0.5}),
  S(452.0, 458.0, 'phone', C0, {mode: 'call', k: [0, 1, 452, 458]}),
  S(458.0, 468.0, 'post', C(960, 600, 1.2, 1.3), {clock: '01:22', chars: 'sit', dark: 0.5}),
  S(468.0, 476.0, 'post', C(960, 620, 1.3, 1.5), {clock: '01:25', chars: 'sit', dark: 0.5}),
  S(476.0, 481.0, 'post', C(960, 620, 1.4, 1.6), {clock: '01:26', chars: 'sit', dark: 0.5}),
  S(481.0, 484.0, 'phone', C0, {mode: 'nonet'}),
  // ===== fake Gennady =====
  S(484.0, 490.0, 'door', C0, {knocks: [484.4, 485.3, 486.2], handle: 0}),
  S(490.0, 496.0, 'corr', C(3500, 740, 1.3, 1.4), {lights: 0.5, dark: 0.4, cctv: 3, gen: [0, 0]}),
  S(496.0, 503.0, 'corr', C(3450, 700, 1.5, 1.7), {lights: 0.5, dark: 0.4, cctv: 3, gen: [0, 0]}),
  S(503.0, 510.0, 'corr', C(3450, 640, 2.0, 2.6), {lights: 0.5, dark: 0.4, cctv: 3, gen: [0, 0]}),
  S(510.0, 517.0, 'phone', C0, {mode: 'call', k: [0, 1, 510, 517]}),
  S(517.0, 525.0, 'post', C(640, 330, 1.8, 2.2), {clock: '02:08', chars: 'sit', dark: 0.5, feeds: {}}),
  S(525.0, 530.0, 'corr', C(3450, 650, 2.2, 2.4), {lights: 0.5, dark: 0.4, cctv: 3, gen: [0, 0.3, 525, 528]}),
  S(530.0, 536.0, 'corr', C(3450, 620, 2.8, 3.8), {lights: 0.5, dark: 0.45, cctv: 3, gen: [0.3, 1, 528, 535]}, 2),
  S(536.0, 546.0, 'post', C(960, 560, 1.1, 1.3), {clock: '02:10', chars: 'recoil', dark: 0.5, glitch: 1}, 4),
  S(546.0, 551.0, 'door', C0, {knocks: [546.5, 547.5, 548.6, 549.6, 550.4], handle: 0, dark: 0.3}),
  S(551.0, 555.0, 'post', C(960, 600, 1.2, 1.2), {clock: '02:35', chars: 'sit', dark: 0.5, feeds: {off: 1}}),
  // ===== bedroom / double =====
  S(555.0, 560.0, 'post', C(1150, 330, 2.4, 2.6), {clock: '03:30', chars: 'sit', dark: 0.5, feeds: {kid: 1}}),
  S(560.0, 568.0, 'bed', C(1500, 760, 0.95, 1.1), {cctv: 6, light: 1, dark: 0.45}),
  S(568.0, 576.0, 'bed', C(1500, 760, 1.1, 1.3), {cctv: 6, light: 1, dark: 0.45, lump: [0, 1, 572, 574]}),
  S(576.0, 583.0, 'bed', C(1500, 700, 1.4, 2.0), {cctv: 6, light: 1, dark: 0.45, lump: 1}),
  S(583.0, 592.0, 'bed', C(1500, 650, 2.0, 2.0), {cctv: 6, light: 1, dark: 0.45, lump: 1, sit: [0, 1, 583, 587]}),
  S(592.0, 599.0, 'bed', C(1500, 640, 2.0, 2.3), {cctv: 6, light: 1, dark: 0.45, lump: 1, sit: 1, turn: [0, 1, 595, 598.5]}),
  S(599.0, 608.0, 'bed', C(1520, 620, 2.3, 2.5), {cctv: 6, light: 1, dark: 0.45, lump: 1, sit: 1, turn: 1, sign: [0, 1, 601, 605]}),
  S(608.0, 614.0, 'bed', C(1500, 680, 1.8, 1.4), {cctv: 6, light: [1, 0, 609.5, 610.2], dark: 0.5, lump: 0, sit: [1, 0, 613, 613.3], turn: 1, sign: 1, glitch: 0.8}, 3),
  S(614.0, 621.0, 'post', C(1000, 600, 1.2, 1.2), {clock: '03:40', chars: 'sit', dark: 0.55, feeds: {off: 1}}),
  S(621.0, 626.0, 'clock', C0, {text: [['04:00', 621], ['05:00', 622], ['05:30', 624]]}),
  S(626.0, 630.0, 'post', C(960, 600, 1.2, 1.1), {clock: '05:40', chars: 'sit', dark: 0.5, feeds: {off: 1}}),
  S(630.0, 634.0, 'clock', C0, {text: '05:55', red: 0.3}),
  S(634.0, 644.0, 'corr', C(300, 450, 1.0, 1.1, 3000, 450), {lights: 0.35, flick: 1, dark: 0.55, cctv: 2, shadow: [634, 646, 100, 3300]}),
  S(644.0, 651.0, 'door', C0, {knocks: [645.5, 647, 649], handle: 0, dark: 0.4}),
  S(651.0, 657.0, 'clock', C0, {text: '05:57', red: 0.6}),
  S(657.0, 668.0, 'door', C(960, 540, 1.1, 1.4), {knocks: [], handle: 0.5, dark: 0.55, glitch: 0.5}, 2),
  S(668.0, 673.0, 'post', C(960, 600, 1.2, 1.4), {clock: '05:59', chars: 'sit', dark: 0.7, feeds: {off: 1}}),
  S(673.0, 679.0, 'clock', C0, {text: [['05:59:57', 673], ['05:59:58', 675], ['05:59:59', 677]], red: 0.9}),
  S(679.0, 682.0, 'door', C(960, 540, 1.0, 1.5), {knocks: [], handle: [0, 1, 679.5, 680.5], dark: 0.1}),
  // ===== dawn / home =====
  S(682.0, 688.0, 'corr', C(400, 440, 1.0, 1.0, 1800, 440), {lights: 0.6, dark: 0.1, pale: 1}),
  S(688.0, 693.0, 'ext', C(1200, 650, 1.0, 1.2), {dawn: [0.2, 0.7, 688, 693], runM: [688, 693, 800, 2000], swing: 0.3}),
  S(693.0, 700.0, 'phone', C0, {mode: 'bank'}),
  S(700.0, 706.0, 'home', C(900, 700, 1.3, 1.5), {k: 'lie', light: 0.8}),
  S(706.0, 712.0, 'paper', C(960, 600, 1.0, 1.1), {kind: 'contract', k: 1}),
  S(712.0, 722.0, 'paper', C(960, 640, 1.1, 1.6, 960, 760), {kind: 'contract2', k: [0, 0.4, 712, 722]}),
  S(722.0, 727.0, 'paper', C(960, 780, 1.6, 1.8), {kind: 'contract2', k: [0.4, 1, 722, 727]}),
  S(727.0, 732.0, 'home', C(900, 700, 1.4, 1.5), {k: 'sit', light: 0.5, dark2: 1}),
  S(732.0, 738.0, 'phone', C0, {mode: 'notif'}),
  S(738.0, 746.0, 'phone', C0, {mode: 'cam', inner: 'empty'}),
  S(746.0, 753.0, 'phone', C(960, 540, 1.0, 1.25), {mode: 'cam', inner: 'sit'}),
  S(753.0, 760.0, 'phone', C(960, 480, 1.25, 1.5), {mode: 'cam', inner: 'look'}),
  S(760.0, 766.0, 'phone', C(960, 450, 1.5, 1.7), {mode: 'cam', inner: 'smile'}),
  S(766.0, 770.0, 'phone', C0, {mode: 'sms', k: [0, 1, 766, 769.5]}),
  S(770.0, 773.0, 'home', C(1400, 700, 1.2, 1.5, 1600, 700), {k: 'turn', light: 0.3}),
  S(773.0, 777.0, 'door', C(960, 540, 1.1, 1.2), {knocks: [774.2, 775.0, 775.8], handle: 0, dark: 0.45}),
  S(777.0, 779.2, 'door', C(960, 540, 1.2, 1.4), {knocks: [], handle: 0, dark: 0.6}, 1),
  S(779.2, 785.2, 'door', C(960, 540, 1.4, 1.7), {knocks: [], handle: 0.3, dark: 0.7, glitch: 1}, 3),
];

// ---------- helpers ----------
const interp = (pts: [number, number][], t: number) => {
  if (t <= pts[0][0]) return pts[0][1];
  for (let i = 1; i < pts.length; i++) if (t <= pts[i][0]) return lerp(pts[i - 1][1], pts[i][1], (t - pts[i - 1][0]) / (pts[i][0] - pts[i - 1][0]));
  return pts[pts.length - 1][1];
};
const tw = (v: any, t: number) => (Array.isArray(v) && v.length === 4 && typeof v[2] === 'number' && v[3] > v[2] ? lerp(v[0], v[1], E(t, v[2], v[3])) : v);
const clockMin: [number, number][] = [[0, 22 * 60 - 20], [218, 22 * 60], [222, 22 * 60 + 30], [277, 23 * 60], [342, 23 * 60 + 55], [347, 24 * 60], [402, 25 * 60 + 15], [450, 25 * 60 + 20], [484, 26 * 60], [555, 27 * 60 + 30], [621, 28 * 60], [622, 29 * 60], [624, 29 * 60 + 30], [630, 29 * 60 + 55], [679, 30 * 60], [790, 30 * 60 + 20]];
const stamp = (t: number) => {
  const m = interp(clockMin, t), h = Math.floor(m / 60) % 24, mm = Math.floor(m % 60), ss = Math.floor((m * 60) % 60);
  return `${String(h).padStart(2, '0')}:${String(mm).padStart(2, '0')}:${String(ss).padStart(2, '0')}`;
};
const knockVal = (t: number, ks: number[]) => ks.reduce((mx, k) => (t >= k ? Math.max(mx, Math.exp(-(t - k) * 14)) : mx), 0);
const timerSec = (t: number) => interp([[355, 120], [359, 90], [370, 60], [374, 45], [383, 20], [391, 0]], t);
const fmtTimer = (s: number) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
const GLITCH: [number, number, number][] = [[8.4, 10.8, 0.9], [5.0, 5.3, 0.5], [268.0, 268.6, 1], [425.1, 425.5, 0.6], [536.0, 546.0, 0.9], [596.5, 597.2, 0.7], [610.0, 610.5, 1], [779.2, 785.2, 1], [538.0, 538.5, 1]];

const Mx: React.FC<{x: number; y: number; pose: Pose; flip?: boolean; s?: number}> = ({x, y, pose, flip, s = 1.4}) => <Man x={x} y={y} pose={pose} flip={flip} s={s} />;

const Scene: React.FC<{sh: Shot; t: number; fx: number}> = ({sh, t, fx}) => {
  const p = sh.p ?? {};
  const a = sh.a, b = sh.b;
  const pose = (n: string): Pose => {
    switch (n) {
      case 'walk': return poseWalk(t, 2.4, 6);
      case 'run': return poseWalk(t, 4.4, 16);
      case 'stand': return poseStand({mood: 'worried'});
      case 'sit': return poseSit({mood: 'worried', nod: 8});
      case 'recoil': return poseStand({mood: 'scared', lean: -14, nod: -6, hf: [30, -130]});
      case 'reach': return poseReach(40, -60, {lean: 22, mood: 'worried'});
      default: return poseStand();
    }
  };
  switch (sh.sc) {
    case 'corr': {
      const bk = p.bike ? lerp(p.bike[0], p.bike[1], E(t, p.bike[2] ?? a, p.bike[3] ?? b)) : -1;
      const fp = tw(p.fp ?? 0, t);
      const mv = p.walkM ? lerp(p.walkM[2], p.walkM[3], E(t, p.walkM[0], p.walkM[1])) : null;
      const both = p.walkBoth ? lerp(p.walkBoth[2], p.walkBoth[3], E(t, p.walkBoth[0], p.walkBoth[1])) : null;
      const sh1 = p.shadow ? lerp(p.shadow[2], p.shadow[3], E(t, p.shadow[0], p.shadow[1])) : null;
      const g = p.gen ? tw([p.gen[0], p.gen[1], p.gen[2] ?? a, p.gen[3] ?? b], t) : null;
      return (
        <g>
          <Corridor t={t} lights={p.lights ?? 1} dark={p.dark ?? 0} bike={p.gone ? -1 : bk} bikeDir={p.bikeDir ?? 1} fp={fp} flick={p.flick ?? 0} />
          {p.pale && <rect x={-1000} y={-200} width={6400} height={1400} fill="#c8d8e8" opacity={0.1} />}
          {mv !== null && <>
            <Mx x={mv} y={1010} pose={pose(p.run ? 'run' : 'walk')} flip={!!p.flip} />
            {p.flash && <polygon points={`${mv + (p.flip ? -70 : 70)},700 ${mv + (p.flip ? -640 : 640)},560 ${mv + (p.flip ? -640 : 640)},900`} fill="#fff6c8" opacity={0.16 + 0.04 * Math.sin(t * 20)} />}
          </>}
          {both !== null && <><Mx x={both} y={1010} pose={pose('walk')} /><Man x={both - 130} y={1010} pose={poseWalk(t + 0.3, 2.2, 4)} look={GENN} s={1.4} /></>}
          {sh1 !== null && <g transform={`translate(${sh1} 1010)`}><rect x={-46} y={-420} width={92} height={330} rx={44} fill="#010203" /><circle cx={0} cy={-450} r={44} fill="#010203" /><rect x={-42} y={-110} width={30} height={110} fill="#010203" /><rect x={12} y={-110} width={30} height={110} fill="#010203" /></g>}
          {g !== null && <g><Man x={3420} y={1000} pose={poseStand({nod: g > 0 ? 8 + 6 * Math.sin(t * 0.6) : 0, lean: g > 0 ? 2 : 0})} look={GENN} s={1.5} /><path d={`M3396 626 Q3420 ${638 + g * 10} 3448 626 `} stroke="#fff" strokeWidth={3} fill="none" opacity={g * 0.7} /><rect x={3392} y={624} width={56} height={3 + g * 14} rx={5} fill="#000" opacity={g} /></g>}
        </g>
      );
    }
    case 'door': {
      const kv = knockVal(t, p.knocks ?? []);
      return <DoorClose t={t} knock={kv} handle={tw(p.handle ?? 0, t)} drag={tw(p.drag ?? 0, t)} dark={p.dark ?? 0.2} />;
    }
    case 'play': {
      const cube = p.cube ? (p.cube.length === 6 ? {x: lerp(p.cube[0], p.cube[2], E(t, p.cube[4], p.cube[5])), y: lerp(p.cube[1], p.cube[3], E(t, p.cube[4], p.cube[5]))} : {x: p.cube[0], y: p.cube[1]}) : {x: 960, y: 880};
      const beam = p.beam ? {x: lerp(500, 1500, (Math.sin((t - a) * 1.3) + 1) / 2), y: 860 - 120 * Math.abs(Math.sin((t - a) * 0.9))} : p.beamCube ? {x: 960, y: 880} : undefined;
      const kd = Array.isArray(p.kid) ? (t >= p.kid[0] && t < p.kid[1] ? 1 : 0) : 0;
      return (
        <g>
          <PlayRoom t={t} cube={cube} beam={beam} dark={p.dark ?? 0.55} kid={kd} />
          {p.maxim === 1 && <Mx x={lerp(500, 800, E(t, a, b))} y={990} pose={pose('walk')} />}
          {p.maxim === 'reach' && <Mx x={760} y={990} pose={pose('reach')} />}
          {p.maxim === 'cam' && <Mx x={lerp(400, 1500, E(t, a, a + 4)) } y={990} pose={pose('walk')} />}
          {p.maxim === 'cam2' && <Mx x={700} y={990} pose={pose('stand')} flip />}
        </g>
      );
    }
    case 'canteen': {
      const th = tw(p.th ?? 0, t);
      const cnt = p.count ? interp([[412, 0], [414, 1], [415, 3], [416, 10], [417, 11], [418, 12], [419, 12]], t) : 0;
      return (
        <g>
          <Canteen t={t} thirteenth={th} scrape={p.scrape ?? 0} dark={p.dark ?? 0.5} />
          {p.count && Array.from({length: 12}).map((_, i) => i < Math.floor(cnt) && <Tx key={i} x={280 + (i % 6) * 250 + (i < 6 ? 0 : 40)} y={(i < 6 ? 760 : 940) - 140} size={40} fill="#e8f0c0">{String(i + 1)}</Tx>)}
          {p.maxim === 'in' && <Mx x={lerp(100, 700, E(t, a, b))} y={1000} pose={pose('walk')} />}
          {p.count && <Mx x={760} y={1000} pose={pose('stand')} />}
          {p.maxim === 'turn' && <Mx x={lerp(900, 1500, E(t, a, a + 4))} y={1000} pose={pose('walk')} flip={t > a + 4} />}
          {p.maxim === 'back' && <Mx x={lerp(1500, 1000, E(t, a, b))} y={1000} pose={poseWalk(-t, 2, 4, {mood: 'scared'})} />}
        </g>
      );
    }
    case 'chair': return <ChairBack t={t} k={tw(p.k, t)} />;
    case 'bed': {
      const light = tw(p.light ?? 1, t);
      return <Bedroom t={t} light={light} lump={tw(p.lump ?? 0, t)} sit={tw(p.sit ?? 0, t)} turn={tw(p.turn ?? 0, t)} sign={tw(p.sign ?? 0, t)} dark={p.dark ?? 0.4} />;
    }
    case 'ext': {
      const mx = p.walkM ? lerp(p.walkM[2], p.walkM[3], E(t, p.walkM[0], p.walkM[1])) : p.mx;
      const rx = p.runM ? lerp(p.runM[2], p.runM[3], E(t, p.runM[0], p.runM[1])) : null;
      return (
        <g>
          <KinderExt t={t} swing={p.swing ?? 1} gx={p.gx ?? 1050} gv={p.gv ?? 0} dawn={tw(p.dawn ?? 0, t)} />
          {mx !== undefined && <Mx x={mx} y={940} pose={pose(p.walkM ? 'walk' : 'stand')} s={1.3} />}
          {rx !== null && <Mx x={rx} y={940} pose={pose('run')} s={1.3} />}
        </g>
      );
    }
    case 'post': {
      const f = p.feeds ?? {};
      const feeds = {cube: 60 + (f.cube ?? 0), bike: f.bike !== undefined ? tw(f.bike, t) : -1, kid: f.kid ?? 0, light: f.light ?? 1, off: f.off ?? 0};
      let chars: React.ReactNode = null;
      if (p.chars === 'duo') chars = <><Mx x={1000} y={1010} pose={pose('sit')} /><Man x={1300} y={1010} pose={poseStand()} look={GENN} flip s={1.4} /></>;
      if (p.chars === 'sit') chars = <Mx x={1000} y={1000} pose={pose('sit')} />;
      if (p.chars === 'recoil') chars = <Mx x={lerp(1000, 1250, E(t, 536, 538))} y={1000} pose={pose('recoil')} />;
      if (p.chars === 'leave') chars = <><Mx x={1000} y={1010} pose={pose('sit')} /><Man x={lerp(1300, 1800, E(t, p.leave[0], p.leave[1]))} y={1010} pose={poseWalk(t, 2.0, 4)} look={GENN} s={1.4} /></>;
      return <PostRoom t={t} clock={p.clock ?? '22:00'} feeds={feeds} chars={chars} dark={p.dark ?? 0.35} glitch={p.glitch ?? 0} />;
    }
    case 'paper': return <Paper kind={p.kind} k={tw(p.k ?? 0, t)} t={t} />;
    case 'phone': {
      let inner: React.ReactNode = null;
      if (p.mode === 'cam') {
        const sit = p.inner !== 'empty';
        const lookK = p.inner === 'look' || p.inner === 'smile' ? 1 : 0;
        inner = (
          <g transform="scale(0.9) translate(-960 -660)">
            <PostRoom t={t} clock="30:00" dark={0.45} chars={sit ? <><Mx x={960} y={1000} pose={poseSit({mood: 'neutral', nod: lookK ? -6 : 14})} />{p.inner === 'smile' && <path d="M938 610 Q962 640 988 608" stroke="#fff" strokeWidth={6} fill="none" opacity={clamp((t - 760) / 1.2)} />}</> : null} />
          </g>
        );
      }
      return <Phone t={t} mode={p.mode} k={tw(p.k ?? 1, t)} inner={inner} />;
    }
    case 'clock': {
      let text = p.text;
      if (Array.isArray(text)) { text = text[0][0]; for (const [s, st] of p.text) if (t >= st) text = s; }
      if (p.timer) text = fmtTimer(timerSec(t));
      return <ClockBig t={t} text={text ?? '00:00'} red={p.red ?? 0} sub={p.timer ? 'ТАЙМЕР' : undefined} />;
    }
    case 'fuse': return <FusePanel t={t} sw={tw(p.sw ?? 0, t) > 0.5 ? 1 : 0} dark={0.1} />;
    case 'home': {
      let chars: React.ReactNode = null;
      if (p.k === 'sit') chars = <Mx x={900} y={1000} pose={pose('sit')} />;
      if (p.k === 'stand') chars = <Mx x={900} y={1010} pose={pose('stand')} />;
      if (p.k === 'walk') chars = <Mx x={lerp(900, 1500, E(t, a, b))} y={1010} pose={pose('walk')} />;
      if (p.k === 'lie') chars = <g transform="rotate(-88 900 860)"><Man x={900} y={860} pose={poseStand({mood: 'neutral'})} look={MAXIM} s={1.2} /></g>;
      if (p.k === 'turn') chars = <Mx x={1050} y={1010} pose={pose('stand')} />;
      return <HomeRoom t={t} light={p.light ?? 1} chars={chars} door={p.k === 'turn' ? 1 : 0} />;
    }
    case 'car': return <CarWreck t={t} />;
    default: return null;
  }
};

const ShotView: React.FC<{sh: Shot; t: number; frame: number}> = ({sh, t, frame}) => {
  const k = ease(clamp((t - sh.a) / Math.max(0.01, sh.b - sh.a)));
  const c = sh.cam;
  const fx = lerp(c[0], c[3], k), fy = lerp(c[1], c[4], k), s = lerp(c[2], c[5], k);
  const shk = sh.shake ?? 0;
  const gl = GLITCH.reduce((mx, [a, b, v]) => (t >= a && t < b ? Math.max(mx, v) : mx), sh.p?.glitch && !Array.isArray(sh.p.glitch) ? sh.p.glitch * 0.4 : 0);
  const jit = gl > 0 ? (rnd(frame * 3 + 1) - 0.5) * 60 * gl : 0;
  const fixed = ['door', 'chair', 'paper', 'phone', 'clock', 'fuse'].includes(sh.sc);
  const tf = fixed
    ? `translate(${shk * Math.sin(t * 61) + jit} ${shk * Math.cos(t * 53)}) translate(960 540) scale(${s}) translate(${-fx} ${-fy})`
    : `translate(${960 + shk * Math.sin(t * 61) + jit} ${540 + shk * Math.cos(t * 53)}) scale(${s}) translate(${-fx} ${-fy})`;
  const cctv = sh.p?.cctv;
  return (
    <AbsoluteFill style={{filter: cctv ? 'grayscale(0.75) contrast(1.15) brightness(1.05)' : 'saturate(0.8)'}}>
      <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{position: 'absolute', left: 0, top: 0}}>
        <g transform={tf}><Scene sh={sh} t={t} fx={fx} /></g>
        {cctv && <rect width={1920} height={1080} fill="#4aff9a" opacity={0.1} />}
        {gl > 0.2 && Array.from({length: 6}).map((_, i) => <rect key={i} x={0} y={((frame * 37 + i * 191) % 1080)} width={1920} height={6 + (i % 3) * 10} fill="#fff" opacity={0.1 * gl} transform={`translate(${(rnd(frame + i) - 0.5) * 80 * gl} 0)`} />)}
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
    <AbsoluteFill style={{justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 62}}>
      <div style={{opacity: o, width: 1600, textAlign: 'center', fontFamily: 'Montserrat, sans-serif', fontWeight: 800, fontSize: 56, lineHeight: 1.15, textTransform: 'uppercase', WebkitTextStroke: '7px #05070f', paintOrder: 'stroke fill', textShadow: '0 4px 0 rgba(0,0,0,0.4)'}}>
        {p[2].map(([w, s, e], i) => {
          const on = t >= s && t < e;
          return <span key={i} style={{display: 'inline-block', color: on ? '#FF3535' : '#ffffff', margin: '0 13px', textShadow: on ? '0 0 18px rgba(255,53,53,0.7), 0 4px 0 rgba(0,0,0,0.4)' : undefined}}>{w}</span>;
        })}
      </div>
    </AbsoluteFill>
  );
};

const CctvHud: React.FC<{t: number; cam: number}> = ({t, cam}) => (
  <AbsoluteFill style={{pointerEvents: 'none', fontFamily: 'monospace', color: '#b8ffd0', fontSize: 34, fontWeight: 700, textShadow: '0 0 6px rgba(0,0,0,0.9)'}}>
    <div style={{position: 'absolute', left: 40, top: 30}}>{`CAM ${cam}`}</div>
    <div style={{position: 'absolute', left: 40, top: 76}}>{`${stamp(t)}`}</div>
    <div style={{position: 'absolute', right: 44, top: 30, color: '#ff4a4a', opacity: Math.sin(t * 5) > 0 ? 1 : 0.2}}>● REC</div>
  </AbsoluteFill>
);

const TimerHud: React.FC<{t: number}> = ({t}) => {
  if (t < 355 || t > 392) return null;
  const s = timerSec(t);
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <div style={{position: 'absolute', right: 44, top: 28, fontFamily: 'monospace', fontWeight: 700, fontSize: 56, color: s < 25 ? '#ff4a4a' : '#8affb0', textShadow: '0 0 10px rgba(0,0,0,0.9)', background: 'rgba(0,0,0,0.45)', padding: '4px 20px', borderRadius: 8}}>{fmtTimer(s)}</div>
    </AbsoluteFill>
  );
};

export const M65: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS65;
  const idx = SH.findIndex((s) => t >= s.a && t < s.b);
  const sh = SH[Math.max(0, idx)];
  const V = 0.6;
  const SFX = (a: number, d: number, src: string, v: number | ((f: number) => number)) => (
    <Sequence key={`${src}${a}`} from={Math.round(a * FPS65)} durationInFrames={Math.max(1, Math.round(d * FPS65))}>
      <Audio src={staticFile(`sfx/${src}.mp3`)} volume={typeof v === 'number' ? v * V : v} />
    </Sequence>
  );
  const rampT = (pts: [number, number][]) => { const f = ramp(pts); return (fr: number) => f(fr) * V; };
  const drone = rampT([[0, 0.08], [3, 0.09], [8, 0.0], [10, 0.05], [75, 0.06], [95, 0.04], [215, 0.05], [220, 0.07], [270, 0.08], [345, 0.05], [349, 0.02], [391, 0.02], [395, 0.08], [440, 0.09], [545, 0.1], [555, 0.07], [635, 0.09], [668, 0.02], [672, 0.0], [679, 0.0], [683, 0.04], [700, 0.04], [727, 0.07], [775, 0.09], [779, 0.0], [785, 0]]);
  const heart = rampT([[355, 0], [358, 0.08], [391, 0.12], [392, 0], [425, 0], [426, 0.09], [434, 0.07], [436, 0], [530, 0], [534, 0.08], [546, 0], [630, 0], [633, 0.1], [668, 0.14], [670, 0], [770, 0], [772, 0.1], [779, 0]]);
  const laugh = rampT([[277, 0], [278, 0.07], [296, 0.07], [297, 0.0]]);
  const bike = rampT([[0, 0.0], [0.3, 0.09], [3.5, 0.08], [4, 0], [304, 0], [304.5, 0.08], [319, 0.08], [319.5, 0], [337, 0], [337.5, 0.07], [344, 0.07], [344.5, 0]]);
  const patter = rampT([[357, 0], [358, 0.1], [368.5, 0.1], [369, 0]]);
  const whisper = rampT([[370, 0], [372, 0.06], [390, 0.09], [391, 0]]);
  const wind = rampT([[76, 0.0], [77, 0.06], [118, 0.06], [119, 0], [688, 0], [689, 0.08], [699, 0.06], [700, 0], [780, 0.0]]);
  const swing = rampT([[99, 0], [100, 0.05], [118, 0.05], [119, 0], [688, 0], [689, 0.04], [695, 0.04], [696, 0]]);
  const hum = rampT([[118, 0], [119, 0.04], [180, 0.04], [181, 0], [222, 0], [223, 0.04], [440, 0.05], [441, 0]]);
  const ticks = rampT([[201, 0], [202, 0.06], [207, 0.06], [207.5, 0], [621, 0], [621.5, 0.07], [626, 0.07], [626.5, 0], [630, 0], [630.5, 0.08], [634, 0.08], [634.5, 0], [651, 0], [651.5, 0.1], [657, 0.1], [657.5, 0], [673, 0], [673.5, 0.12], [679, 0.12], [679.2, 0]]);
  const ev: React.ReactNode[] = [
    ...[4.1, 4.6, 5.1, 320.6, 321.5, 322.4, 326, 484.4, 485.3, 486.2, 546.5, 547.5, 548.6, 549.6, 550.4, 645.5, 647, 649, 774.2, 775, 775.8].map((k) => SFX(k, 0.5, 'knock', 0.1)),
    SFX(5.0, 2.5, 'stinger', 0.1), SFX(268.1, 2.5, 'stinger', 0.1), SFX(425.2, 2.5, 'stinger', 0.1), SFX(530, 3, 'stinger', 0.08), SFX(596.2, 2.5, 'stinger', 0.1), SFX(779.3, 3, 'stinger', 0.12),
    SFX(8.4, 2.4, 'glitch', 0.07), SFX(263, 4.5, 'glitch', 0.05), SFX(536, 10, 'glitch', 0.07), SFX(609.8, 1, 'glitch', 0.08),
    SFX(33, 1, 'vib', 0.06), SFX(63, 1.5, 'ring', 0.05), SFX(86, 1.5, 'ring', 0.05), SFX(332, 1.2, 'vib', 0.06), SFX(452, 1.5, 'ring', 0.05), SFX(510, 1.5, 'ring', 0.05), SFX(693, 1, 'notif', 0.08), SFX(732, 1, 'notif', 0.09), SFX(766, 1, 'notif', 0.09),
    SFX(116, 1.4, 'creak', 0.07), SFX(421, 1.2, 'creak', 0.09), SFX(441, 1.0, 'hit', 0.11), SFX(445, 3.5, 'drag', 0.08), SFX(583.5, 1.4, 'creak', 0.07), SFX(679.5, 1.4, 'creak', 0.08),
    SFX(350.4, 0.5, 'click', 0.1), SFX(391.7, 0.5, 'click', 0.1), SFX(538, 2.2, 'static', 0.1), SFX(328.3, 3, 'scratch', 0.06),
  ];
  return (
    <AbsoluteFill style={{backgroundColor: '#000'}}>
      <Audio src={staticFile('voice15.mp3')} volume={1} />
      <Audio src={staticFile('sfx/m65drone.mp3')} volume={drone} loop />
      <Audio src={staticFile('sfx/heart.mp3')} volume={heart} loop />
      <Audio src={staticFile('sfx/laugh.mp3')} volume={laugh} loop />
      <Audio src={staticFile('sfx/bikeroll.mp3')} volume={bike} loop />
      <Audio src={staticFile('sfx/patter.mp3')} volume={patter} loop />
      <Audio src={staticFile('sfx/whisper.mp3')} volume={whisper} loop />
      <Audio src={staticFile('sfx/wind.mp3')} volume={wind} loop />
      <Audio src={staticFile('sfx/creak.mp3')} volume={swing} loop />
      <Audio src={staticFile('sfx/hum.mp3')} volume={hum} loop />
      <Audio src={staticFile('sfx/tick.mp3')} volume={ticks} loop />
      {ev}
      <ShotView sh={sh} t={t} frame={frame} />
      {/* VHS grain + scanlines + vignette */}
      <AbsoluteFill style={{backgroundImage: 'url(' + staticFile('noise.png') + ')', backgroundSize: '256px 256px', backgroundPosition: `${(frame * 37) % 256}px ${(frame * 91) % 256}px`, opacity: 0.11, mixBlendMode: 'overlay', pointerEvents: 'none'}} />
      <AbsoluteFill style={{backgroundImage: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.16) 0px, rgba(0,0,0,0.16) 2px, rgba(0,0,0,0) 2px, rgba(0,0,0,0) 5px)', pointerEvents: 'none'}} />
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 48%, rgba(0,4,8,0.62) 100%)', pointerEvents: 'none'}} />
      <AbsoluteFill style={{background: 'rgba(30,70,90,0.07)', mixBlendMode: 'screen', pointerEvents: 'none'}} />
      {sh.p?.cctv && <CctvHud t={t} cam={sh.p.cctv} />}
      <TimerHud t={t} />
      <Subs t={t} />
      <AbsoluteFill style={{backgroundColor: '#000', opacity: t >= 780.6 ? clamp((t - 780.6) / 1.6) : 0, pointerEvents: 'none'}} />
    </AbsoluteFill>
  );
};
