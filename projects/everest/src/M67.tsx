import React from 'react';
import '@fontsource/montserrat/cyrillic-800.css';
import '@fontsource/montserrat/latin-800.css';
import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {ramp} from './Everest';
import {clamp, ease, lerp, rnd, Tx, E, Pose, poseStand, poseWalk, poseSit, poseReach} from './M60Base';
import {PersonV} from './M67Fig';
import {poseRun, PhotoWall, HouseExt2, CarSide, CarInside2, PovRun} from './M67Art2';
import {Full, Man, ARTEM, OLEG, BROTHER, GRAN, LERA, SELLER, Maniac, ManiacFace, Basement, Alley, TokenClose, LockClose, StepClose, RulesSheet, Kitchen, ForestDark, HouseExt, LivingRoom, Garden, CarInside, ShopExt, ShopInt, Desk, AptHall} from './M67Art';
import subs from './subs_s8.json';

export const FPS67 = 30;
const SPEED = 0.975;
export const DUR67 = 1047.2 / SPEED;
const W = (o: number) => o / SPEED;
type Cam = [number, number, number, number, number, number];
type Shot = {a: number; b: number; sc: string; cam: Cam; p?: any; shake?: number};
const C = (x: number, y: number, z0: number, z1 = z0, x1 = x, y1 = y): Cam => [x, y, z0, x1, y1, z1];
const S = (a: number, b: number, sc: string, cam: Cam, p: any = {}, shake = 0): Shot => ({a, b, sc, cam, p, shake});
const C0: Cam = [960, 540, 1, 960, 540, 1];
const B = (cam: Cam, a: number, b: number, p: any = {}, shake = 0) => S(a, b, 'base', cam, p, shake);

const SH: Shot[] = [
  // ===== EPISODE 1 =====
  B(C(900, 560, 0.85, 0.95, 1100), 0, 4, {art: 'lie', dark: 0.6}),
  S(4, 7, 'sheet', C0, {k: [0.1, 0.35, 4, 7], hl: 0}),
  B(C(1150, 760, 1.2, 1.35), 7, 10, {art: 'sit', dark: 0.5}),
  S(10, 14.7, 'alley', C(1000, 560, 1.0, 1.1, 1000), {}),
  S(14.7, 18, 'alley', C(1100, 470, 1.05, 1.3, 1100), {}),
  S(18, 20, 'black', C0, {}),
  B(C(1150, 800, 1.3, 1.5), 20, 23, {art: 'lie2sit', dark: 0.5}),
  B(C(1150, 880, 2.2, 2.4), 23, 25, {v: 'front', art: 'sit', dark: 0.5}),
  S(25, 28, 'lock', C0, {k: 0}),
  B(C(1100, 520, 1.1, 1.4, 1400), 28, 32, {art: 'sit', photos: 1, crossed: 0, dark: 0.45}),
  B(C(1350, 520, 1.4, 1.6), 32, 34, {art: 'sit', photos: 1, crossed: [0, 1, 32, 34], dark: 0.45}),
  B(C(1250, 560, 1.9, 2.1, 1300), 34, 37, {art: 'sit', photos: 1, crossed: 1, dark: 0.45}),
  B(C(1050, 400, 3.2, 3.3), 37, 38, {art: 'sit', photos: 1, crossed: 1, dark: 0.4}),
  B(C(1240, 400, 3.2, 3.3), 38, 39, {art: 'sit', photos: 1, crossed: 1, dark: 0.4}),
  B(C(1430, 400, 3.2, 3.3), 39, 41, {art: 'sit', photos: 1, crossed: 1, dark: 0.4}),
  B(C(1150, 800, 1.5, 1.6), 41, 44, {art: 'sit', dark: 0.5}),
  B(C(1150, 840, 2.2, 2.4), 44, 49, {v: 'front', art: 'hands', dark: 0.62}),
  B(C(700, 700, 1.3, 1.4, 500), 49, 53, {art: 'sit', dark: 0.5}),
  B(C(1150, 800, 1.4, 1.5), 53, 56.8, {art: 'sit', dark: 0.45}),
  S(56.8, 60.7, 'sheet', C0, {k: [0.35, 0.6, 56.8, 60.7], hl: 1}),
  S(60.7, 64.7, 'sheet', C0, {k: [0.6, 0.8, 60.7, 64.7], hl: 2}),
  S(64.7, 69.2, 'sheet', C(960, 560, 1.0, 1.1), {k: [0.8, 1, 64.7, 69.2], hl: 3}),
  B(C(1100, 700, 1.1, 1.2, 1500), 69, 75, {art: 'walk', artX: [1100, 1500, 69, 75], dark: 0.45}),
  B(C(2300, 400, 1.2, 1.5, 2450), 75, 84, {art: 'sit', water: 1, pipeShake: 1, dark: 0.42}),
  B(C(560, 860, 1.6, 1.9), 84, 91, {art: 'stepplank', plank: [86.8, 90], dark: 0.4}),
  B(C(2050, 800, 1.3, 1.4), 91, 96, {art: 'sit', dark: 0.45}),
  B(C(560, 250, 1.5, 1.8), 96, 99, {art: 'sit', dark: 0.45}),
  B(C(450, 700, 1.1, 1.3), 99, 104, {art: 'sit', water: 0, dark: 0.5, stairLit: 0}),
  S(104, 106, 'step', C0, {k: [0, 0.4, 104, 106]}),
  S(106, 109, 'step', C0, {k: [0.4, 1, 106, 109]}, 1),
  S(109, 113, 'lock', C0, {k: [0, 1, 109, 112]}),
  B(C(600, 650, 1.1, 1.3), 113, 118, {art: 'sit', door: [0, 1, 113, 116], man: [330, 330, 114, 118, 0], dark: 0.5}),
  B(C(520, 640, 1.5, 1.7), 118, 122, {art: 'sit', door: 1, man: [330, 380, 118, 122, 0.3], dark: 0.45}),
  S(122, 127, 'face', C(960, 540, 1.0, 1.12), {look: [0, 1, 122, 126], smoke: 1}),
  S(127, 131, 'alley', C(1500, 600, 1.2, 1.4), {man: 1}),
  B(C(900, 700, 1.1, 1.2), 131, 137, {art: 'sit', door: 1, man: [400, 900, 131, 137, 1, 1], plate: 1, dark: 0.45}),
  B(C(1100, 600, 1.3, 1.4), 137, 142, {art: 'sit', door: 1, man: [900, 1000, 137, 142, 0.2, 1], plate: 1, dark: 0.42}),
  B(C(900, 800, 1.5, 1.6), 142, 146, {art: 'sit', door: 1, man: [1000, 800, 142, 146, 0.5, 1], plate: 1, plank: [143, 144.5], dark: 0.45}),
  B(C(1000, 700, 1.2, 1.3), 146, 151, {art: 'sit', door: 1, man: [800, 800, 146, 151, 0.2, 1], plate: 1, dark: 0.45}),
  B(C(1000, 760, 1.6, 1.8), 151, 158, {art: 'beg', door: 1, man: [800, 800, 151, 158, 0.2, 1], plate: 1, dark: 0.42}),
  S(158, 163, 'face', C(960, 540, 1.05, 1.2), {look: 1}),
  B(C(600, 640, 1.3, 1.4), 163, 168, {art: 'sit', door: [1, 0.2, 166, 168], man: [800, 340, 163, 167, 0.8, 1], plate: 1, dark: 0.45}),
  B(C(450, 740, 1.5, 1.7), 168, 178, {art: 'sit', door: 0.1, man: [340, 340, 168, 178, 0], token: [174, 178], plate: 1, dark: 0.5, stairLit: 0.3}),
  B(C(600, 860, 1.4, 1.5), 178, 185, {art: 'walk', artX: [1000, 650, 178, 184], token: 1, plate: 1, dark: 0.5}),
  S(185, 189, 'token', C0, {side: 0}),
  S(189, 192, 'token', C0, {side: 1}),
  B(C(600, 700, 1.2, 1.3), 192, 200, {art: 'startle', artX: 650, plate: 1, dark: 0.55, stairLit: 0.5}, 2),
  // ===== EPISODE 2 =====
  B(C(1200, 920, 1.7, 1.9), 200, 206, {art: 'hide', plate: 1, dark: 0.5}),
  S(206, 211, 'step', C0, {k: [0, 1, 206, 209]}),
  B(C(700, 700, 1.1, 1.3), 211, 216, {v: 'front', art: 'sit', door: 1, man: [330, 800, 211, 216, 1, 1], plate: 1, dark: 0.45}),
  B(C(1000, 760, 1.4, 1.5), 216, 223, {art: 'sit', door: 1, man: [850, 1000, 216, 223, 0.2, 1], plate: 1, dark: 0.45}),
  B(C(1900, 780, 1.2, 1.3, 2100), 223, 227, {art: 'sit', door: 1, man: [1000, 2000, 223, 227, 0.8, 1], plate: 1, dark: 0.45}),
  B(C(700, 640, 1.2, 1.4, 450), 227, 235, {art: 'sit', door: [1, 0.3, 233, 235], man: [2000, 340, 227, 233, 0.8, 1], plate: 1, dark: 0.45}),
  B(C(600, 640, 1.2, 1.3), 235, 237, {art: 'sit', door: 0, plate: 1, dark: 0.7}, 3),
  B(C(1100, 600, 0.95, 1.1, 1500), 237, 242, {art: 'walk', artX: [900, 1500, 237, 242], plate: 1, dark: 0.5}),
  B(C(1250, 220, 1.4, 1.7), 242, 246, {v: 'front', art: 'sit', plate: 1, dark: 0.5}),
  B(C(450, 640, 1.3, 1.4), 246, 250, {v: 'front', art: 'sit', plate: 1, dark: 0.5}),
  S(250, 254, 'sheet', C0, {k: 1, hl: 2}),
  B(C(560, 860, 1.4, 1.5), 254, 258, {art: 'sit', plate: 1, plank: [255, 257], dark: 0.45}),
  S(258, 262, 'step', C0, {k: [0, 1, 258, 261]}),
  B(C(2300, 400, 1.2, 1.4, 2450), 262, 269, {art: 'sit', water: 1, pipeShake: 1, plate: 1, dark: 0.45}),
  B(C(1150, 760, 1.4, 1.5), 269, 272, {v: 'front', art: 'think', plate: 1, dark: 0.45}),
  B(C(500, 640, 1.2, 1.4), 272, 275, {art: 'bang', plate: 1, dark: 0.45}, 3),
  B(C(2400, 860, 1.3, 1.5), 275, 280, {art: 'fake', bucket: [0, 1, 275, 276], artX: 2250, plate: 1, dark: 0.45}),
  S(280, 283, 'step', C0, {k: [0, 1, 280, 283]}),
  B(C(2200, 660, 1.1, 1.2), 283, 287, {art: 'fake', artX: 2250, bucket: 1, door: [0, 1, 284, 285], man: [330, 700, 284, 287, 1, 1], plate: 1, dark: 0.45}),
  B(C(2100, 700, 1.3, 1.4), 287, 291, {art: 'fake', artX: 2250, bucket: 1, door: 1, man: [700, 2000, 287, 291, 0.7, 1], plate: 1, dark: 0.42}),
  S(291, 294, 'face', C(960, 540, 1.1, 1.3), {look: 0.5}, 1),
  B(C(2300, 420, 1.3, 1.5), 294, 298, {art: 'fake', artX: 2250, bucket: 1, door: 1, man: [2000, 2000, 294, 298, 0.1, 1], water: 1.5, pipeShake: 3, plate: 1, dark: 0.35}, 5),
  B(C(2200, 740, 1.3, 1.5, 1600), 298, 302, {art: 'jump', artX: [2250, 1800, 298, 302], bucket: 1, door: 1, man: [2000, 2250, 298, 302, 0.1, 1], plate: 1, water: 1.5, pipeShake: 3, dark: 0.4}, 4),
  B(C(1500, 720, 1.2, 1.4, 700), 302, 305, {art: 'run', artX: [1800, 900, 302, 305], door: 1, man: [2250, 1700, 302, 305, 1, 1], plate: 1, dark: 0.42}, 3),
  S(305, 309, 'pov', C0, {env: 'basement'}, 2),
  S(309, 313, 'pov', C0, {env: 'kitchen'}, 2),
  S(313, 317, 'pov', C0, {env: 'door'}, 3),
  S(317, 322, 'forest', C(900, 640, 1.2, 1.3, 1400), {dusk: 0.4, walk: [317, 322, 600, 1500, 'run']}, 2),
  S(322, 325, 'forest', C(1650, 640, 1.2, 1.3), {dusk: 0.4, v: 'front', vs: [1.0, 1.7], walk: [322, 325, 1600, 1700, 'run']}, 3),
  S(325, 331, 'forest', C(1900, 640, 1.2, 1.4, 3000), {dusk: 0.45, walk: [325, 331, 1800, 3000, 'run']}, 3),
  S(331, 334, 'forest', C(3200, 640, 1.0, 1.1, 3800), {dusk: 0.45, v: 'back', vs: [1.5, 0.9], walk: [331, 334, 3000, 3800, 'run']}, 2),
  S(334, 337, 'forest', C(3900, 640, 1.0, 1.2, 4300), {dusk: 0.5, road: 1, suv: 1, walk: [334, 337, 3800, 4200, 'walk']}),
  S(337, 344, 'forest', C(4300, 640, 1.3, 1.5), {dusk: 0.5, road: 1, suv: 1, walk: [337, 340, 3900, 4200, 'run'], brother: [4350, 4350]}),
  S(344, 350, 'forest', C(4300, 640, 1.5, 1.6), {dusk: 0.5, road: 1, suv: 1, walk: [344, 344.1, 4200, 4200], brother: [4350, 4350]}),
  S(350, 358, 'forest', C(4300, 640, 1.2, 1.3), {dusk: 0.5, road: 1, suv: 1, walk: [350, 358, 4200, 4200], brother: [4350, 4350]}),
  S(358, 363, 'forest', C(4700, 640, 1.2, 1.3, 5100), {dusk: 0.55, road: 1, walk: [358, 363, 4400, 5000, 'walk'], brother: [4550, 5150, 358, 363], lighter: 360}),
  S(363, 370, 'forest', C(5100, 640, 1.7, 1.9), {dusk: 0.55, road: 1, walk: [363, 370, 5000, 5000], brother: [5150, 5150], smoke: 1}),
  S(370, 375, 'face', C(960, 540, 1.0, 1.1), {look: 0.6, smoke: 0.6}),
  S(375, 379, 'forest', C(5000, 640, 1.5, 1.7), {dusk: 0.55, road: 1, walk: [375, 379, 5000, 4850, 'back'], brother: [5150, 5150], smoke: 1}),
  S(379, 388, 'forest', C(5050, 640, 1.8, 2.0), {dusk: 0.55, road: 1, walk: [379, 388, 4850, 4850], brother: [5150, 5150], smoke: 1}, 1),
  // ===== EPISODE 3 =====
  S(388, 392, 'forest', C(5100, 640, 1.6, 1.8), {dusk: 0.55, road: 1, walk: [388, 392, 4850, 4850], brother: [5150, 5150]}),
  S(392, 397, 'forest', C(5100, 640, 1.8, 2.0), {dusk: 0.55, road: 1, walk: [392, 397, 4850, 4850], brother: [5150, 5150], smoke: 1}),
  S(397, 403, 'forest', C(4700, 640, 1.1, 1.3, 3800), {dusk: 0.6, road: 1, walk: [397, 403, 4800, 3800, 'run'], brother: [5100, 4300, 399, 403, 'run']}, 3),
  S(403, 408, 'forest', C(3200, 640, 1.1, 1.3, 2500), {dusk: 0.6, v: 'front', vs: [1.0, 1.6], walk: [403, 408, 3100, 2900, 'run']}, 3),
  S(408, 414, 'house', C(1100, 620, 1.0, 1.3, 1250), {walk: [408, 414, 300, 1050, 'run']}),
  S(414, 417, 'house', C(1250, 640, 1.2, 1.5), {v: 'back', walk: [414, 417, 1050, 1250, 'walk'], knock: 1}),
  S(417, 425, 'house', C(1250, 600, 1.5, 1.7), {v: 'back', walk: [417, 425, 1250, 1250], gran: 1}),
  S(425, 432, 'living', C(900, 640, 1.1, 1.3), {art: 'sitc', gran: [2500, 1500, 425, 430]}),
  S(432, 443, 'living', C(1000, 640, 1.2, 1.4), {v: 'front', art: 'sitc', gran: [1500, 1500, 432, 443], talk: 1}),
  S(443, 452, 'living', C(1100, 640, 1.5, 1.7), {art: 'sitc', gran: [1500, 1500, 443, 452], dark: 0.3}),
  S(452, 458, 'living', C(1300, 640, 1.2, 1.3, 2200), {art: 'sitc', gran: [1500, 2500, 452, 457]}),
  S(458, 464, 'living', C(900, 620, 1.2, 1.4), {v: 'front', art: 'sitc', dark: 0.4}),
  S(464, 470, 'living', C(900, 700, 1.6, 1.8), {v: 'front', art: 'sitc', dark: 0.45}),
  S(470, 474, 'sheet', C0, {k: 1, hl: 2}),
  S(474, 477, 'living', C(1500, 620, 1.1, 1.3, 2500), {art: 'sitc', dark: 0.4}),
  S(477, 480, 'living', C(2500, 860, 2.3, 2.5), {art: 'sitc', dark: 0.4}),
  S(480, 490, 'living', C(2090, 340, 1.4, 2.4), {art: 'stand', artX: 1650, photoK: [0, 1, 482, 488], dark: 0.35}),
  S(490, 497, 'living', C(2090, 330, 2.4, 2.9), {art: 'stand', artX: 1650, photoK: 1, dark: 0.35}, 1),
  S(497, 504, 'living', C(2090, 330, 2.9, 3.1), {art: 'stand', artX: 1650, photoK: 1, dark: 0.35}),
  S(504, 510, 'living', C(1400, 620, 1.0, 1.1), {art: 'startle', artX: 1650, photoK: 1, dark: 0.5}, 2),
  S(510, 517, 'living', C(2700, 640, 1.2, 1.5), {art: 'run', artX: [1650, 2500, 510, 513], dark: 0.4, locked: 1}, 2),
  S(517, 522, 'lock', C0, {k: 0}),
  S(522, 531, 'living', C(500, 560, 1.4, 1.7), {art: 'window', artX: 450, windowOpen: [0, 1, 524, 526], dark: 0.4}, 1),
  S(531, 537, 'garden', C(1100, 640, 1.1, 1.3), {art: 'jump', ax: [1100, 1800, 531, 536]}, 2),
  S(537, 541, 'garden', C(1800, 700, 1.2, 1.3, 2500), {art: 'run', ax: [1800, 2500, 537, 541]}, 3),
  S(541, 547, 'forest', C(1500, 640, 1.1, 1.3, 2400), {dusk: 0.6, road: 1, walk: [541, 547, 1400, 2400, 'run']}, 1),
  S(547, 551, 'forest', C(2500, 640, 1.1, 1.3), {dusk: 0.6, road: 1, walk: [547, 551, 2300, 2400, 'walk'], carFar: 1}),
  S(551, 556, 'forest', C(2600, 700, 1.4, 1.6), {dusk: 0.6, road: 1, walk: [551, 556, 2400, 2400, 'walk'], carNear: 1}),
  S(556, 566, 'forest', C(2600, 700, 1.7, 1.9), {dusk: 0.6, road: 1, walk: [556, 566, 2400, 2400], carNear: 1, talk: 1}),
  S(566, 572, 'forest', C(2600, 700, 1.7, 1.8), {dusk: 0.6, road: 1, walk: [566, 572, 2400, 2500, 'walk'], carNear: 1, doorOpen: 1}),
  S(572, 579, 'car', C0, {eyes: [0, 1, 572, 574], leraTurn: 1, olegTurn: [0, 1, 576, 578], dark: 0.35}),
  S(579, 584, 'car', C(960, 600, 1.0, 1.15), {eyes: 1, olegTurn: 1, leraTurn: 0, dark: 0.35}),
  S(584, 589, 'car', C(1200, 520, 1.2, 1.5), {eyes: 0, dark: 0.35}),
  // ===== EPISODE 4 =====
  S(589, 595, 'car', C(960, 560, 1.0, 1.05), {dark: 0.3}),
  S(595, 601, 'car', C(900, 560, 1.1, 1.2), {dark: 0.3}),
  S(601, 608, 'car', C(1200, 500, 1.3, 1.1), {dark: 0.3, speed: 360}),
  S(608, 620, 'car', C(960, 560, 1.0, 1.15), {dark: 0.32, eyes: [0, 0.6, 612, 616]}),
  S(620, 628, 'car', C(960, 200, 2.2, 2.6), {dark: 0.32, eyes: 1}),
  S(628, 635, 'car', C(960, 700, 1.3, 1.5), {dark: 0.3, note: [0, 0.4, 630, 634]}),
  S(635, 640, 'car', C(960, 800, 1.6, 1.8), {dark: 0.3, note: 1}),
  S(640, 646, 'car', C(960, 800, 1.8, 2.0), {dark: 0.3, note: 1}),
  S(646, 650, 'car', C(960, 220, 2.0, 2.4), {dark: 0.3, eyes: 1}),
  S(650, 656, 'car', C(960, 540, 1.0, 1.1), {dark: 0.4, speed: 520}),
  S(656, 663, 'car', C(1100, 520, 1.4, 1.6), {dark: 0.4, smoke: 1, lighter: 659}),
  S(663, 669, 'car', C(1100, 520, 1.6, 1.8), {dark: 0.4, smoke: 1}),
  S(669, 673, 'car', C(960, 880, 1.6, 1.8), {dark: 0.4}),
  S(673, 680, 'car', C(960, 880, 1.8, 2.0), {dark: 0.4, apron: [0, 1, 675, 677]}),
  S(680, 683, 'car', C(1030, 840, 2.6, 2.8), {dark: 0.4, apron: 1}),
  S(683, 688, 'token', C0, {side: [0, 1, 685, 685.2]}),
  S(688, 693, 'car', C(960, 700, 1.2, 1.3), {dark: 0.45, apron: 1}),
  S(693, 697, 'sheet', C0, {k: 1, hl: 3}),
  S(697, 704, 'car', C(960, 540, 1.0, 1.1), {dark: 0.4}),
  S(704, 717, 'car', C(960, 700, 1.2, 1.3), {dark: 0.4, speed: 100}),
  S(717, 725, 'shop', C(1500, 700, 1.0, 1.2), {car: 1, walk: [717, 725, 2000, 1600, 'walk'], lera: [717, 725, 2100, 1700]}),
  S(725, 729, 'shop', C(1500, 720, 1.2, 1.3), {car: 1, walk: [725, 729, 1900, 1600, 'walk'], lera: [725, 729, 2000, 1700]}),
  S(729, 736, 'shop', C(1500, 720, 1.2, 1.3), {car: 1, walk: [729, 736, 1700, 1300, 'run'], lera: [729, 736, 1800, 1400, 'run'], oleg: [734, 736]}, 2),
  S(736, 744, 'shopint', C(1400, 640, 1.0, 1.2), {seller: 1, art: [736, 740, 300, 1100], lera: [736, 740, 100, 900]}, 1),
  S(744, 750, 'shopint', C(1000, 620, 1.2, 1.3), {seller: 1, art: [744, 744.1, 1100, 1100], lera: [744, 744.1, 900, 900], lock: 1}),
  S(750, 757, 'shopint', C(800, 620, 1.4, 1.6), {seller: 1, art: [750, 750.1, 1100, 1100], lera: [750, 750.1, 800, 800]}),
  S(757, 763, 'shopint', C(1100, 640, 1.0, 1.1), {seller: 1, art: [757, 757.1, 1100, 1100], lera: [757, 757.1, 800, 800], oleg: [759, 763]}, 1),
  S(763, 774, 'shopint', C(1400, 640, 1.2, 1.4), {seller: 1, art: [763, 763.1, 1100, 1100], lera: [763, 763.1, 800, 800], oleg: [763, 774]}),
  S(774, 782, 'shopint', C(960, 560, 1.0, 1.2), {seller: 1, photo: [0, 1, 775, 777], oleg: [774, 782], dark: 0.3}),
  // ===== EPISODE 5 =====
  S(782, 795, 'shopint', C(960, 560, 1.2, 1.4), {seller: 1, photo: 1, dark: 0.3}),
  S(795, 810, 'shopint', C(1800, 620, 1.2, 1.4, 1400), {seller: 1, art: [795, 795.1, 1100, 1100], lera: [795, 795.1, 800, 800], oleg: [795, 810]}),
  S(810, 822, 'shopint', C(900, 620, 1.3, 1.5), {seller: 1, art: [810, 810.1, 1100, 1100], lera: [810, 822, 1000, 1500], oleg: [810, 822], bruise: 1}),
  S(822, 827, 'shopint', C(1800, 640, 1.2, 1.3), {seller: 1, art: [822, 822.1, 1100, 1100], lera: [822, 822.1, 1500, 1500], phone: 1}),
  S(827, 836, 'shop', C(1500, 700, 1.0, 1.1), {car: 1, oleg: [827, 836]}),
  S(836, 847, 'shopint', C(2700, 580, 1.4, 1.6), {storeroom: 1, seller: 0}, 3),
  S(847, 860, 'shopint', C(1000, 620, 1.3, 1.5), {art: [847, 847.1, 1000, 1000], lera: [847, 847.1, 800, 800], hide: 1}),
  S(860, 873, 'shopint', C(2300, 600, 1.2, 1.4), {storeroom: 1, hide: 1, art: [860, 860.1, 1000, 1000], lera: [860, 860.1, 800, 800]}, 2),
  S(873, 879, 'shopint', C(1000, 620, 1.1, 1.2), {hide: 1, art: [873, 873.1, 1000, 1000], lera: [873, 873.1, 800, 800], dark: 0.4}),
  S(879, 884, 'shop', C(2300, 800, 1.3, 1.4), {car: 1, oleg: [879, 884]}),
  S(884, 896, 'shop', C(1300, 700, 1.0, 1.2), {car: 1, cops: [0, 1, 884, 887]}, 1),
  S(896, 905, 'shop', C(1300, 720, 1.2, 1.3), {car: 1, cops: 1}),
  B(C(600, 640, 1.0, 1.3), 905, 913, {art: 'none', door: 1, dark: 0.45, stairLit: 1, mattress: true}),
  S(913, 920, 'basement', C(1200, 500, 1.0, 1.3), {art: 'none', photos: 1, crossed: 1}),
  S(920, 931, 'desk', C0, {shown: [0, 0.25, 920, 931]}),
  S(931, 936, 'alley', C(1100, 560, 1.0, 1.2), {man: 0}),
  S(936, 944, 'living', C(1500, 620, 1.1, 1.2), {empty: 1, dark: 0.5}),
  S(944, 950, 'desk', C0, {shown: [0, 0.3, 944, 950]}),
  S(950, 958, 'desk', C(560, 470, 1.3, 1.5), {shown: [0.3, 1, 950, 957]}),
  S(958, 966, 'desk', C(960, 520, 1.1, 1.3), {shown: 1}),
  S(966, 978, 'desk', C(960, 760, 1.8, 2.1), {shown: 1}),
  S(978, 992, 'desk', C(960, 760, 2.1, 2.4), {shown: 1}),
  S(992, 1005, 'desk', C(960, 700, 1.3, 1.4), {shown: 1}),
  S(1005, 1013, 'desk', C(960, 560, 1.2, 1.6), {shown: 1, flip: [0, 1, 1008, 1010]}),
  S(1013, 1026, 'desk', C(960, 560, 1.6, 1.8), {shown: 1, flip: 1}),
  S(1026, 1032, 'apt', C(1500, 620, 1.0, 1.3), {door: 0}),
  S(1032, 1036, 'apt', C(1500, 620, 1.3, 1.5), {door: [0, 1, 1032, 1035]}),
  S(1036, 1043, 'apt', C(1500, 620, 1.5, 2.0), {door: 1, dark: 0.6}),
  S(1043, 1047.2, 'black', C0, {}),
];

const tw = (v: any, t: number) => (Array.isArray(v) && v.length === 4 && typeof v[2] === 'number' && v[3] > v[2] ? lerp(v[0], v[1], E(t, v[2], v[3])) : v);
const fall = (a: number, b: number, t: number) => E(t, a, b);

const Scene: React.FC<{sh: Shot; t: number; fx: number}> = ({sh, t, fx}) => {
  const p = sh.p ?? {};
  const a = sh.a, b = sh.b;
  const artPose = (n: string): Pose => {
    switch (n) {
      case 'walk': return poseWalk(t, 2.0, 8);
      case 'run': return poseRun(t);
      case 'stand': return poseStand({mood: 'worried'});
      case 'startle': return poseStand({mood: 'scared', lean: -8, nod: -4, hf: [30, -130]});
      case 'sit': return poseSit({mood: 'worried', nod: 8});
      case 'sitc': return poseSit({mood: 'worried', nod: 10});
      case 'hands': return poseSit({mood: 'worried', nod: 24, lean: 14});
      case 'think': return poseSit({mood: 'worried', nod: 14});
      case 'beg': return poseSit({mood: 'worried', nod: 6, hf: [74, -90]});
      case 'bang': return poseReach(60, -170, {lean: 10, mood: 'scared'});
      case 'back': return poseWalk(-t, 2, 2, {mood: 'scared'});
      case 'jump': return poseRun(t);
      case 'window': return poseReach(40, -150, {lean: 12});
      default: return poseStand({mood: 'worried'});
    }
  };
  const man = (m: number[], extra?: any) => m && m.length >= 5 ? <Maniac x={lerp(m[0], m[1], E(t, m[2], m[3]))} y={970} s={0.88} t={t} step={m[5] ? (t * 1.1) % 1 : 0} arm={extra ?? 0} /> : null;
  switch (sh.sc) {
    case 'base':
    case 'basement': {
      let art: React.ReactNode = null;
      const ax = p.artX !== undefined ? (Array.isArray(p.artX) ? lerp(p.artX[0], p.artX[1], E(t, p.artX[2], p.artX[3])) : p.artX) : 1150;
      if (p.art === 'lie') art = <g transform={`rotate(-90 ${ax + 150} 918)`}><Man x={ax + 150} y={918} pose={poseStand({mood: 'neutral', nod: 8})} s={1.4} /></g>;
      else if (p.art === 'lie2sit') { const k = E(t, a + 0.5, b); art = <g transform={`rotate(${lerp(-90, 0, k)} ${ax + 150 - 150 * k} 918)`}><Man x={ax + 150 - 150 * k} y={918} pose={poseStand({mood: 'neutral', nod: 8})} s={1.4} /></g>; }
      else if (p.art === 'stepplank') art = <Man x={lerp(900, 640, E(t, a, a + 3))} y={960} pose={poseWalk(t, 1.2, 10)} s={1.4} />;
      else if (p.art === 'hide') art = <g transform="translate(0 0)"><Man x={1180} y={925} pose={poseReach(40, -40, {lean: 24, mood: 'scared'})} s={1.4} /></g>;
      else if (p.art === 'fake') { const k = E(t, 276.2, 277.4); art = <g transform={`rotate(${-90 * k} ${ax} 960)`}><Man x={ax} y={960} pose={poseStand({mood: 'scared', nod: 8})} s={1.4} /></g>; }
      else if (p.v && p.art && ['sit', 'hands', 'think', 'beg', 'sitc', 'stand', 'startle'].includes(p.art)) art = <PersonV look={ARTEM} x={ax} y={['sit', 'hands', 'think', 'beg', 'sitc'].includes(p.art) ? 925 : 975} view={p.v} mode={p.art === 'hands' ? 'hands' : ['sit', 'think', 'beg', 'sitc'].includes(p.art) ? 'sit' : p.art === 'startle' ? 'scared' : 'stand'} t={t} s={1.45} mood={p.art === 'startle' || p.art === 'beg' ? 'scared' : 'worried'} />;
      else if (p.art && p.art !== 'none') art = <Man x={ax} y={p.art === 'sit' || p.art === 'hands' || p.art === 'beg' || p.art === 'think' || p.art === 'sitc' ? 925 : 975} pose={artPose(p.art)} s={1.45} />;
      const m = p.man ? man(p.man, p.arm) : null;
      const plank = Array.isArray(p.plank) ? (t >= p.plank[0] && t < p.plank[1] ? 1 : 0) : 0;
      const tokenFall = Array.isArray(p.token) ? lerp(560, 930, E(t, p.token[0], p.token[1])) : null;
      return (
        <g>
          <Basement t={t} p={{door: tw(p.door ?? 0, t), water: p.water ?? 0, pipeShake: p.pipeShake ?? 0, dark: p.dark ?? 0.35, photos: p.photos ?? 0.0 + (p.photos === undefined ? 0 : 1), crossed: tw(p.crossed ?? 1, t), bucket: tw(p.bucket ?? 0, t), plankGlow: plank || (tw(p.plank ?? 0, t) as number), stairLit: p.stairLit ?? 1, mattress: p.mattress ?? true, chars: <>{art}</>, fgChars: <>{m}{p.plate && <g transform="translate(840 960)"><ellipse cx={0} cy={0} rx={70} ry={12} fill="#c8c4b8" opacity={0.85} /><ellipse cx={0} cy={-4} rx={52} ry={7} fill="#4a3a1a" opacity={0.8} /></g>}{tokenFall !== null && <circle cx={360} cy={tokenFall} r={14} fill="#8a6a3a" />}{p.token === 1 && null}</>} as any} />
        </g>
      );
    }
    case 'pov': return <PovRun t={t} a={a} b={b} env={p.env} />;
    case 'face': return <ManiacFace t={t} light={p.light ?? 1} look={tw(p.look ?? 0, t)} smoke={p.smoke ?? 0} />;
    case 'sheet': return <RulesSheet t={t} k={tw(p.k ?? 1, t)} hl={p.hl ?? 0} />;
    case 'alley': return <Alley t={t} man={1} />;
    case 'lock': return <LockClose t={t} k={tw(p.k ?? 0, t)} />;
    case 'step': return <StepClose t={t} k={tw(p.k ?? 0, t)} />;
    case 'token': return <TokenClose t={t} side={tw(p.side ?? 0, t)} />;
    case 'black': return <Full c="#000" />;
    case 'flash': return <g><Full c="#05070c" /><g transform="translate(960 1000)"><Maniac x={0} y={0} s={1.5} t={t} /></g><rect x={-100} y={-100} width={2200} height={1300} fill="#000" opacity={0.35} /></g>;
    case 'kitchen': {
      const wx = lerp(p.walk[2], p.walk[3], E(t, p.walk[0], p.walk[1]));
      return <Kitchen t={t} door={p.door ?? 1} chars={<Man x={wx} y={1010} pose={poseWalk(t, 4.6, 16)} s={1.45} />} />;
    }
    case 'forest': {
      const wx = p.walk ? lerp(p.walk[2], p.walk[3], E(t, p.walk[0], p.walk[1])) : null;
      const wk = p.walk && p.walk[4] === 'run' ? poseRun(t) : p.walk && p.walk[4] === 'back' ? poseWalk(-t, 2.0, 2, {mood: 'scared'}) : poseWalk(t, 2.2, 8);
      const br = p.brother ? lerp(p.brother[0], p.brother[1], p.brother.length > 3 ? E(t, p.brother[2], p.brother[3]) : 0) : null;
      const still = p.walk && p.walk[2] === p.walk[3];
      return (
        <g>
          <ForestDark t={t} cx={fx} road={!!p.road} dusk={p.dusk ?? 0.5} fog={0.6} suv={!!p.suv} />
          {p.carFar && <g transform="translate(3100 920)"><rect x={-60} y={-60} width={120} height={60} rx={14} fill="#1a1c22" /><circle cx={60} cy={-30} r={10} fill="#fff3b0" /><polygon points="60,-30 300,-80 300,20" fill="#fff3b0" opacity={0.12} /></g>}
          {p.carNear && <CarSide t={t} x={2900} y={970} k={1.15} flip doorOpen={p.doorOpen ?? 0} />}
          {wx !== null && (p.v ? <PersonV look={ARTEM} x={wx} y={1010 + (p.vs ? lerp(0, 30, E(t, p.walk[0], p.walk[1])) : 0)} view={p.v} mode={still ? 'stand' : p.walk[4] === 'run' ? 'run' : 'walk'} t={t} s={p.vs ? lerp(p.vs[0], p.vs[1], E(t, p.walk[0], p.walk[1])) : 1.4} mood="scared" /> : <Man x={wx} y={1010} pose={still ? poseStand({mood: 'scared'}) : wk} s={1.4} />)}
          {br !== null && <Man x={br} y={1015} pose={p.brother[4] === 'run' ? poseRun(t + 0.2) : poseStand({mood: 'neutral', hf: p.smoke ? [60, -150] : [30, -128]})} look={BROTHER} flip s={1.4} />}
          {p.smoke && br !== null && <g>{[0, 1, 2, 3].map((i) => <ellipse key={i} cx={br - 60 + Math.sin(t + i) * 14} cy={600 - i * 40 - ((t * 24) % 40)} rx={22 + i * 8} ry={12 + i * 4} fill="#c8c8d0" opacity={0.16 - i * 0.03} />)}<circle cx={br - 78} cy={640} r={5} fill="#ff6a2a" /></g>}
        </g>
      );
    }
    case 'house': {
      const wx = p.walk ? lerp(p.walk[2], p.walk[3], E(t, p.walk[0], p.walk[1])) : null;
      const near = p.v === 'back';
      const prog = p.walk ? E(t, p.walk[0], p.walk[1]) : 0;
      const gran = p.gran ? <PersonV x={0} y={0} look={GRAN} view="front" mode="stand" mood="worried" t={t} s={0.95} shadow={false} /> : null;
      return (
        <g>
          <HouseExt2 t={t} lit={1} open={p.gran ? 1 : 0} inDoor={gran} />
          {wx !== null && (near
            ? <PersonV look={ARTEM} x={1250 + (wx - 1050) * 0.3} y={lerp(1010, 870, prog)} view="back" mode={prog < 0.95 && !p.knock ? 'walk' : p.knock ? 'scared' : 'walk'} t={t} s={lerp(1.35, 0.95, prog)} />
            : <Man x={wx} y={1010} pose={p.walk[4] === 'run' ? poseRun(t) : poseStand({mood: 'scared'})} s={1.35} />)}
        </g>
      );
    }
    case 'living': {
      const gx = p.gran ? lerp(p.gran[0], p.gran[1], E(t, p.gran[2], p.gran[3])) : null;
      const ax = p.artX ?? 900;
      const front = p.v === 'front' && p.art === 'sitc';
      const hero = front ? <PersonV look={ARTEM} x={ax} y={940} view="front" mode="sit" t={t} s={1.45} mood="worried" /> : null;
      const arr = p.empty ? null : <>{gx !== null && <Man x={gx} y={1000} pose={poseStand({mood: 'neutral'})} look={GRAN} flip s={1.35} />}{front ? hero : <Man x={ax} y={p.art === 'sitc' ? 940 : 1000} pose={p.art === 'sitc' ? poseSit({mood: 'worried', nod: 8}) : p.art === 'run' ? poseRun(t) : p.art === 'startle' ? poseStand({mood: 'scared', lean: -8}) : p.art === 'window' ? poseReach(40, -150, {lean: 12}) : poseStand({mood: 'worried', nod: -6})} s={1.4} />}</>;
      return <LivingRoom t={t} wall={<PhotoWall photoK={tw(p.photoK ?? 0, t)} />} photoK={tw(p.photoK ?? 0, t)} windowOpen={tw(p.windowOpen ?? 0, t)} dark={p.dark ?? 0.3} chars={arr} />;
    }
    case 'garden': {
      const ax = lerp(p.ax[0], p.ax[1], E(t, p.ax[2], p.ax[3]));
      return <g><Garden t={t} /><Man x={ax} y={1000} pose={poseRun(t)} s={1.35} />{t >= 537 && <Man x={1160} y={720} pose={poseStand({mood: 'scared', hf: [60, -150]})} look={BROTHER} s={0.9} />}</g>;
    }
    case 'car': return <CarInside2 t={t} leraTurn={tw(p.leraTurn ?? 0, t)} olegTurn={tw(p.olegTurn ?? 0, t)} eyes={tw(p.eyes ?? 0, t)} note={tw(p.note ?? 0, t)} apron={tw(p.apron ?? 0, t)} dark={p.dark ?? 0.3} smoke={p.smoke ?? 0} speed={p.speed ?? 300} />;
    case 'shop': {
      const wx = p.walk ? lerp(p.walk[2], p.walk[3], E(t, p.walk[0], p.walk[1])) : null;
      const lx = p.lera ? lerp(p.lera[2], p.lera[3], E(t, p.lera[0], p.lera[1])) : null;
      const run = p.walk && p.walk[4] === 'run';
      return (
        <g>
          <ShopExt t={t} car={false} cops={tw(p.cops ?? 0, t)} />
          {p.car && <CarSide t={t} x={2300} y={940} k={1.05} people={!(p.walk)} leraIn={false} lights={0.5} />}
          {wx !== null && <Man x={wx} y={1010} pose={run ? poseRun(t) : poseWalk(t, 2.2, 8)} s={1.35} flip />}
          {lx !== null && <Man x={lx} y={1016} pose={run ? poseRun(t + 0.3) : poseWalk(t, 2.2, 8)} look={LERA} flip s={1.3} />}
          {p.oleg && t >= p.oleg[0] && t < p.oleg[1] && <Man x={2150} y={1010} pose={poseStand({mood: 'neutral'})} look={OLEG} flip s={1.4} />}
        </g>
      );
    }
    case 'shopint': {
      const ax = p.art ? lerp(p.art[2], p.art[3], E(t, p.art[0], p.art[1])) : null;
      const lx = p.lera ? lerp(p.lera[2], p.lera[3], E(t, p.lera[0], p.lera[1])) : null;
      const hide = p.hide;
      return (
        <g>
          <ShopInt t={t} storeroom={p.storeroom ? 1 : 0} photo={tw(p.photo ?? 0, t)} dark={p.dark ?? 0.25} chars={<>
            {p.seller !== 0 && <Man x={2150} y={880} pose={poseStand({mood: 'worried'})} look={SELLER} s={1.3} />}
            {ax !== null && <Man x={ax} y={hide ? 1000 : 1010} pose={hide ? poseSit({mood: 'scared'}) : poseStand({mood: 'scared'})} s={1.4} />}
            {lx !== null && <Man x={lx} y={hide ? 1006 : 1016} pose={hide ? poseSit({mood: 'scared'}) : poseStand({mood: 'worried'})} look={LERA} s={1.35} />}
            {p.oleg && t >= p.oleg[0] && t < p.oleg[1] && <g><rect x={-30} y={80} width={0} height={0} /><g transform="translate(120 0)"><rect x={0} y={200} width={160} height={620} fill="#0a0e14" opacity={0.0} /></g><Man x={40} y={880} pose={poseStand({mood: 'neutral', hf: [60, -150]})} look={OLEG} flip s={1.5} /></g>}
          </>} />
          {p.lock && <g transform="translate(120 560)"><rect x={-18} y={-14} width={36} height={28} rx={6} fill="#c8a838" /></g>}
        </g>
      );
    }
    case 'desk': return <Desk t={t} shown={tw(p.shown ?? 1, t)} flip={tw(p.flip ?? 0, t)} />;
    case 'apt': return <AptHall t={t} door={tw(p.door ?? 0, t)} dark={p.dark ?? 0.5} />;
    default: return null;
  }
};

const ShotView: React.FC<{sh: Shot; t: number}> = ({sh, t}) => {
  const k = ease(clamp((t - sh.a) / Math.max(0.01, sh.b - sh.a)));
  const c = sh.cam;
  const fx = lerp(c[0], c[3], k), fy = lerp(c[1], c[4], k), s = lerp(c[2], c[5], k);
  const shk = sh.shake ?? 0;
  const fixed = ['sheet', 'lock', 'step', 'token', 'flash', 'desk', 'face', 'pov'].includes(sh.sc);
  const sx = Math.sin(t * 0.83) * 4, sy = Math.cos(t * 0.71) * 3, rot = Math.sin(t * 0.5) * 0.25;
  const tf = fixed
    ? `translate(${shk * Math.sin(t * 61) + sx * 0.5} ${shk * Math.cos(t * 53) + sy * 0.5}) translate(960 540) scale(${s}) translate(${-fx} ${-fy})`
    : `translate(${960 + shk * Math.sin(t * 61) + sx} ${540 + shk * Math.cos(t * 53) + sy}) rotate(${rot}) scale(${s}) translate(${-fx} ${-fy})`;
  return (
    <AbsoluteFill style={{filter: 'saturate(0.85) contrast(1.05)'}}>
      <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{position: 'absolute', left: 0, top: 0}}>
        <g transform={tf}><Scene sh={sh} t={t} fx={fx} /></g>
      </svg>
    </AbsoluteFill>
  );
};

type RW = [string, number, number];
const Subs: React.FC<{t: number}> = ({t}) => {
  let p: [number, number, RW[], number] | undefined;
  for (const x of subs as any) if (t >= x[0] - 0.04 && t < x[1] + 0.1) p = x;
  if (!p) return null;
  const k = clamp((t - p[0] + 0.04) / 0.1);
  const o = Math.min(k, clamp((p[1] + 0.1 - t) / 0.06));
  return (
    <AbsoluteFill style={{justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 62}}>
      <div style={{opacity: o, transform: `translateY(${(1 - k) * 8}px)`, width: 1700, textAlign: 'center', fontFamily: 'Montserrat, sans-serif', fontWeight: 800, fontSize: 52, lineHeight: 1.15, textTransform: 'uppercase', WebkitTextStroke: '7px #05070f', paintOrder: 'stroke fill', textShadow: '0 5px 0 rgba(0,0,0,0.4)'}}>
        {p[2].map(([w], i) => <span key={i} style={{display: 'inline-block', color: i === p![3] ? '#FF2A2A' : '#ffffff', margin: '0 14px', textShadow: i === p![3] ? '0 0 22px rgba(255,42,42,0.6), 0 5px 0 rgba(0,0,0,0.4)' : undefined}}>{w}</span>)}
      </div>
    </AbsoluteFill>
  );
};

const EPS: [number, string, string, number][] = [[1, 'ПРОБУЖДЕНИЕ', 'ПРОБУЖДЕНИЕ', 6.2], [2, 'ПЕРВЫЙ ', 'ПОБЕГ', 199.2], [3, 'ЧУЖАЯ ', 'СЕМЬЯ', 385.2], [4, 'НИКОМУ НЕ ', 'ВЕРЬ', 588.7], [5, 'ПОСЛЕДНИЙ ', 'ШАНС', 779.2]];
const EpTitle: React.FC<{t: number; frame: number}> = ({t, frame}) => {
  const e = EPS.find((x) => t >= x[3] && t < x[3] + 2.05);
  if (!e) return null;
  const u = t - e[3];
  const a = Math.min(clamp(u / 0.4), clamp((2.0 - u) / 0.4));
  const jit = u < 0.35 ? (rnd(frame) - 0.5) * 22 : 0;
  return (
    <AbsoluteFill style={{pointerEvents: 'none', justifyContent: 'center', alignItems: 'center'}}>
      <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0.55), rgba(0,0,0,0.25) 70%, rgba(0,0,0,0))', opacity: a}} />
      <div style={{opacity: a, textAlign: 'center', transform: `translateX(${jit}px) scale(${1 + 0.04 * (1 - clamp(u / 1.5))})`}}>
        <div style={{fontFamily: 'Montserrat, sans-serif', fontWeight: 800, fontSize: 40, letterSpacing: 16, color: '#cfd4de', marginBottom: 14}}>{`ЭПИЗОД ${e[0]}`}</div>
        <div style={{fontFamily: 'Montserrat, sans-serif', fontWeight: 800, fontSize: 124, letterSpacing: 4, color: '#fff', textShadow: '0 0 40px rgba(0,0,0,0.9)'}}>
          {e[0] === 1 ? <span style={{color: '#fff'}}>ПРОБУДИ<span style={{color: '#ff2a2a'}}>ТЕЛЬНО</span></span> : <>{e[1]}<span style={{color: '#ff2a2a', textShadow: '0 0 30px rgba(255,42,42,0.6)'}}>{e[2]}</span></>}
        </div>
      </div>
      {a > 0.2 && Array.from({length: 3}).map((_, k) => <div key={k} style={{position: 'absolute', left: 0, right: 0, top: (frame * 29 + k * 311) % 1080, height: 3, background: 'rgba(255,255,255,0.06)'}} />)}
    </AbsoluteFill>
  );
};

export const M67: React.FC = () => {
  const frame = useCurrentFrame();
  const t = (frame / FPS67) * SPEED;
  const idx = SH.findIndex((s) => t >= s.a && t < s.b);
  const sh = SH[Math.max(0, idx)];
  const V = 0.6;
  const SFX = (a: number, d: number, src: string, v: number) => (
    <Sequence key={`${src}${a}`} from={Math.round(W(a) * FPS67)} durationInFrames={Math.max(1, Math.round(d * FPS67))}>
      <Audio src={staticFile(`sfx/${src}.mp3`)} volume={v * V} />
    </Sequence>
  );
  const rampT = (pts: [number, number][]) => { const f = ramp(pts.map(([a, v]) => [W(a), v] as [number, number])); return (fr: number) => f(fr) * V; };
  const dark = rampT([[0, 0], [1, 0.05], [1042, 0.05], [1046, 0]]);
  const pipes = rampT([[75, 0], [76, 0.07], [98.5, 0.07], [99.3, 0], [262, 0], [263, 0.07], [293.5, 0.08], [294, 0.14], [301, 0.1], [304, 0]]);
  const breath = rampT([[0, 0.04], [20, 0.04], [140, 0], [141, 0.06], [165, 0.06], [166, 0], [237, 0], [238, 0.05], [250, 0.05], [251, 0]]);
  const wind = rampT([[317, 0], [319, 0.07], [420, 0.06], [425, 0], [531, 0], [532, 0.07], [560, 0.06], [561, 0], [1026, 0], [1027, 0.03], [1040, 0.03], [1041, 0]]);
  const engine = rampT([[547, 0], [549, 0.05], [556, 0.04], [557, 0], [589, 0], [590, 0.07], [717, 0.07], [718, 0], [876, 0], [877, 0.05], [884, 0.05], [885, 0]]);
  const siren = rampT([[884, 0], [885, 0.04], [906, 0.04], [907, 0]]);
  const steps = rampT([[305, 0], [305.2, 0.07], [337, 0.07], [337.2, 0], [397, 0], [397.2, 0.07], [414, 0.07], [414.2, 0], [510, 0], [510.2, 0.07], [514, 0.06], [514.2, 0], [531, 0], [531.2, 0.07], [547, 0.07], [547.2, 0], [729, 0], [729.2, 0.07], [737, 0.06], [737.2, 0]]);
  const heart = rampT([[99, 0], [102, 0.08], [113, 0.1], [114, 0], [284, 0], [286, 0.08], [298, 0.1], [299, 0], [380, 0], [382, 0.08], [388, 0.08], [389, 0], [1026, 0], [1030, 0.07], [1042, 0.09], [1043, 0]]);
  const ev: React.ReactNode[] = [
    SFX(88.6, 1.4, 'stepcreak', 0.1), SFX(106, 1.4, 'stepcreak', 0.12), SFX(143.2, 1.4, 'stepcreak', 0.1), SFX(208, 1.4, 'stepcreak', 0.12), SFX(255.5, 1.2, 'stepcreak', 0.09), SFX(260, 1.4, 'stepcreak', 0.1), SFX(283, 1.4, 'stepcreak', 0.12),
    SFX(110, 0.5, 'click', 0.1), SFX(110.2, 0.6, 'clank', 0.08), SFX(113, 2, 'creak', 0.1), SFX(211, 2, 'creak', 0.1), SFX(284, 2, 'creak', 0.1),
    SFX(235, 1.5, 'slam', 0.12), SFX(167, 1.5, 'slam', 0.08), SFX(177, 0.6, 'clank', 0.08), SFX(275, 1.4, 'bucket', 0.1), SFX(272, 2.5, 'knock', 0.08),
    SFX(360, 0.5, 'lighter', 0.1), SFX(659, 0.5, 'lighter', 0.1), SFX(526, 1.4, 'creak', 0.09), SFX(414.5, 0.5, 'knock', 0.1), SFX(415.4, 0.5, 'knock', 0.1), SFX(416.2, 0.5, 'knock', 0.1),
    SFX(517, 0.6, 'click', 0.1), SFX(757, 0.5, 'knock', 0.1), SFX(758, 0.5, 'knock', 0.1), SFX(759.2, 0.5, 'knock', 0.1), SFX(836, 1, 'hit', 0.12), SFX(862, 1, 'hit', 0.12), SFX(744.5, 0.5, 'click', 0.1),
    ...[6.2, 199.2, 385.2, 588.7, 779.2].map((e) => SFX(e, 2.5, 'stinger', 0.09)),
  ];
  return (
    <AbsoluteFill style={{backgroundColor: '#000'}}>
      <Audio src={staticFile('voice19.mp3')} volume={1} />
      <Audio src={staticFile('sfx/m67dark.mp3')} volume={dark} loop />
      <Audio src={staticFile('sfx/pipes.mp3')} volume={pipes} loop />
      <Audio src={staticFile('sfx/breath2.mp3')} volume={breath} loop />
      <Audio src={staticFile('sfx/wind.mp3')} volume={wind} loop />
      <Audio src={staticFile('sfx/engine.mp3')} volume={engine} loop />
      <Audio src={staticFile('sfx/siren.mp3')} volume={siren} loop />
      <Audio src={staticFile('sfx/steps.mp3')} volume={steps} loop />
      <Audio src={staticFile('sfx/heart.mp3')} volume={heart} loop />
      {ev}
      <ShotView sh={sh} t={t} />
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 50%, rgba(0,2,6,0.5) 100%)', pointerEvents: 'none'}} />
      <AbsoluteFill style={{backgroundImage: 'url(' + staticFile('noise.png') + ')', backgroundSize: '256px 256px', backgroundPosition: `${(frame * 37) % 256}px ${(frame * 91) % 256}px`, opacity: 0.09, mixBlendMode: 'overlay', pointerEvents: 'none'}} />
      <Subs t={t} />
      <EpTitle t={t} frame={frame} />
      <AbsoluteFill style={{backgroundColor: '#000', opacity: t < 0.6 ? 1 - t / 0.6 : t >= 1040 ? clamp((t - 1040) / 3) : 0, pointerEvents: 'none'}} />
      {t >= 1043.5 && <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', opacity: clamp((t - 1043.5) / 1.2)}}><div style={{fontFamily: 'Montserrat, sans-serif', fontWeight: 800, fontSize: 96, letterSpacing: 18, color: '#fff'}}>КОНЕЦ <span style={{color: '#ff2a2a'}}>СЕЗОНА</span></div></AbsoluteFill>}
    </AbsoluteFill>
  );
};
