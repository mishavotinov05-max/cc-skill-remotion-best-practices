import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {clamp, ease, lerp, rnd} from './util';
import {Overlay, ramp} from './Everest';
import {AutoSub} from './AutoSub';
import subsS from './subs_shelter.json';
import {SnowRush, digPose, DIG_TIP, E, FONT, Log, LogEnd, mixc, Mountains, P, Pine, Pose, shivPose, Skier, SkierDefs, SnowParticles, Squirrel, StoveArt, TempHUD, V, walkPose} from './ShelterArt';

export const FPSS = 30;
export const DURATIONS = 92.9;
const SURF = 1000, FLOOR = 1345, PX0 = 260, PX1 = 820, SX0 = 100, SX1 = 260;
const X = (x: number) => 540 + ((x - 540) * 4) / 3;
const STOVE_X = Math.round(X(665));
const OFF = 2.4;
const depthAt = (t: number) => (t < 3.0 ? 205 : 205 + 140 * E(t, 3.0, 5.6));
const widthAt = (t: number) => 520 + 40 * E(t, 3.0, 5.6);

type H = {x: number; y: number; flip: boolean; pose: Pose; vis: boolean};
const hh = (x: number, y: number, pose: Pose, flip = false, vis = true): H => ({x, y, flip, pose, vis});
const rel = (a: V, h: H): V => [h.x + (h.flip ? -a[0] : a[0]), h.y + a[1]];

// ---------------- environment state ----------------
const drift = (t: number) => (t < 76.3 ? 0 : 130 * E(t, 76.3, 79.0));
const surfAt = (x: number, t: number) => {
  const d = drift(t);
  const bump = 120 * Math.exp(-Math.pow((x - 40) / 200, 2)) + 190 * Math.exp(-Math.pow((x - 930) / 220, 2)) + 80 * Math.exp(-Math.pow((x + 420) / 260, 2));
  return SURF - d - (d > 0 ? bump * (d / 130) : 0) + Math.sin(x / 70) * 3 * (d / 130);
};
const roofY = 957; // top of logs
const groundAt = (x: number, t: number) => (t >= 16.0 && x > PX0 - 6 && x < PX1 + 6 ? roofY : surfAt(x, t));

const climbPose = (t: number): Pose => {
  const s = Math.sin(t * 9);
  return {hip: [0, -112], lean: 6, lf: [14, -22 * Math.max(0, s)], lb: [-10, -22 * Math.max(0, -s)], hf: [34, -268 + 22 * s], hb: [6, -258 - 22 * s]};
};

const heroAt0 = (t: number): H => {
  const FY = SURF + depthAt(t);
  if (t < 2.7) {
    const p = P(t, 2.4, 2.7);
    const e = 1 - (1 - p) * (1 - p);
    const sw = Math.sin(t * 9);
    return hh(lerp(-330, 250, e), SURF, {hip: [0, -104], lean: 22, lf: [26, -8], lb: [-30, -8], hf: [60 + 8 * sw, -128], hb: [10 - 8 * sw, -122], ski: true});
  }
  if (t < 2.85) {
    const p = P(t, 2.7, 2.85);
    const s = Math.sin(p * Math.PI);
    return hh(250, SURF, {hip: [0, -100], lean: 12 + 34 * s, lf: [22, 0], lb: [-22, 0], hf: [50, -120 + 84 * s], hb: [20, -120 + 84 * s], pack: p < 0.5});
  }
  if (t < 3.0) {
    const p = E(t, 2.85, 3.0);
    const y = lerp(SURF, FY, p) - Math.sin(Math.PI * p) * 80;
    return hh(lerp(250, 540, p), y, {hip: [0, -108], lean: 10, lf: [12, -26], lb: [-12, -34], hf: [0, 0], hb: [0, 0], shovel: {hb: [18, -172], th: 62}, pack: false});
  }
  if (t < 5.6) {
    const ph = ((t - 3.0) / 0.95) % 1;
    return hh(540 + widthAt(t) / 2 - 110, FY, {...digPose(ph), pack: false});
  }
  const P0 = (o: Partial<Pose>): Pose => ({hip: [0, -116], lean: 5, lf: [18, 0], lb: [-16, 0], hf: [34, -128], hb: [-12, -126], nod: 0, pack: false, ...o});
  const up = (x: number, k: number): Partial<Pose> => ({lean: 3, hf: [50 + k, -345], hb: [22 + k, -338]});
  if (t < 5.8) return hh(lerp(640, 690, E(t, 5.6, 5.8)), FLOOR, P0(up(0, 0)));
  if (t < 6.9) {
    const p = E(t, 5.8, 6.9);
    return hh(lerp(690, 560, p), FLOOR, P0({lean: 4, hf: [-20 - 40 * p, -343], hb: [-40 - 40 * p, -340], nod: -6}), true);
  }
  if (t < 8.57) return hh(540, FLOOR, P0({lean: 6, nod: -8, hf: [30, -150], hb: [10, -146]}));
  if (t < 11.97) {
    const sag = 110 * E(t, 8.57, 11.5);
    return hh(540, FLOOR, P0({hip: [0, -96], lean: 14, nod: 14, hf: [30, -(345 - sag) / 0.9 + 6 * Math.sin(t * 20)], hb: [8, -(345 - sag) / 0.9 + 6 * Math.cos(t * 17)]}));
  }
  if (t < 12.55) {
    const p = E(t, 11.97, 12.55);
    return hh(lerp(540, 690, p), FLOOR, P0({lean: 3, hf: [50 + 20 * p, -345], hb: [22 + 20 * p, -338]}));
  }
  if (t < 16.05) {
    const k = Math.floor((t - 12.55) / 0.88);
    const q = ((t - 12.55) % 0.88) / 0.88;
    const sw = Math.sin(Math.min(1, q * 1.4) * Math.PI);
    return hh(690, FLOOR, P0({lean: 3, hf: [50 - 70 * Math.min(1, q * 1.5), -345 + 6 * sw], hb: [22 - 60 * Math.min(1, q * 1.5), -338]}));
  }
  if (t < 17.2) {
    const p = E(t, 16.1, 17.2);
    return hh(lerp(690, 520, p), FLOOR, P0({lean: 3, hf: [-20 - 40 * p, -345], hb: [-40 - 30 * p, -338]}), true);
  }
  if (t < 17.68) return hh(lerp(520, 480, E(t, 17.2, 17.68)), FLOOR, {...walkPose(t, 3.4), pack: false}, true);
  if (t < 19.65) {
    const ph = ((t - 17.68) / 0.8) % 1;
    return hh(580, FLOOR, {...digPose(ph), pack: false});
  }
  if (t < 21.8) return hh(520, FLOOR, P0({nod: -10 * Math.sin((t - 19.65) * 1.6), lean: 4}));
  if (t < 24.4) return hh(520, FLOOR, {...shivPose(t), pack: false});
  if (t < 25.1) return hh(lerp(520, 470, E(t, 24.4, 25.1)), FLOOR, {...walkPose(t, 3.2), pack: false}, true);
  if (t < 25.63) return hh(470, FLOOR, P0({hip: [0, -84], lean: 38, hf: [-52, -34], hb: [-26, -28]}), true);
  if (t < 27.35) return hh(lerp(470, 610, E(t, 25.63, 27.35)), FLOOR, {...walkPose(t, 3.4, 8, 'box'), pack: false});
  if (t < 29.0) {
    const c = P(t, 27.35, 27.6);
    return hh(610, FLOOR, P0({hip: [8, -84 - 10 * (1 - c)], lean: 38, lf: [30, 0], lb: [-24, 0], hf: [58, -30], hb: [34, -24]}));
  }
  if (t < 32.37) return hh(580, FLOOR, P0({lean: 8, hf: [56, -140 + Math.sin(t * 5) * 4], hb: [40, -134], nod: 4}));
  if (t < 34.58) return hh(580, FLOOR, P0({lean: 10, hf: [48, -150], hb: [30, -144], nod: -6}));
  if (t < 39.17) {
    const c = Math.sin(t * 14) * 4;
    return hh(520, FLOOR, P0({hip: [0, -108], lean: 22 + c, hf: [42, -248], hb: [20, -238], nod: 12}));
  }
  if (t < 39.7) return hh(lerp(520, 460, E(t, 39.17, 39.7)), FLOOR, {...walkPose(t, 3.2), pack: false}, true);
  if (t < 40.1) return hh(460, FLOOR, P0({hip: [0, -90], lean: 30, hf: [-50, -36], hb: [-28, -30]}), true);
  if (t < 40.6) return hh(lerp(460, 615, E(t, 40.1, 40.6)), FLOOR, {...walkPose(t, 3.4, 8, 'box'), pack: false});
  if (t < 43.4) {
    const upk = P(t, 40.7, 43.2);
    return hh(620, FLOOR, P0({lean: 4, hf: [46, lerp(-190, -343, upk)], hb: [28, lerp(-160, -290, upk)]}));
  }
  if (t < 48.33) return hh(580, FLOOR, P0({hf: [54, -144 + Math.sin(t * 4) * 3], hb: [36, -138], nod: 6}));
  if (t < 49.4) return hh(lerp(580, 400, E(t, 48.33, 49.4)), FLOOR, {...walkPose(t, 3.2), pack: false}, true);
  if (t < 50.8) return hh(400, FLOOR, P0({hf: [-52 - 8 * P(t, 49.5, 50.2), -112], hb: [-26, -118]}), true);
  if (t < 53.74) return hh(lerp(400, 520, E(t, 50.8, 51.5)), FLOOR, {...shivPose(t), pack: false}, true);
  if (t < 54.2) return hh(lerp(520, 330, E(t, 53.74, 54.2)), FLOOR, {...walkPose(t, 3.6), pack: false}, true);
  if (t < 56.6) {
    const e = E(t, 54.2, 56.5);
    return hh(255, FLOOR + 100 * e, {...digPose(((t - 54.2) / 0.85) % 1), pack: false});
  }
  if (t < 58.8) return hh(255, FLOOR + 100, {...digPose(((t - 56.6) / 0.8) % 1), pack: false});
  if (t < 59.5) return hh(255, FLOOR + 100, P0({hf: [40, -140], hb: [20, -140], nod: -4}));
  if (t < 60.2) return hh(lerp(255, 300, E(t, 59.5, 60.2)), lerp(FLOOR + 100, FLOOR, E(t, 59.8, 60.2)), {...walkPose(t, 3.2), pack: false});
  if (t < 61.7) return hh(lerp(300, 470, E(t, 60.2, 61.7)), FLOOR, {...walkPose(t, 3.2), pack: false});
  if (t < 63.0) return hh(480, FLOOR, P0({lean: 12, hf: [44, -120], hb: [24, -126], nod: 10}));
  if (t < 67.25) return hh(500, FLOOR, P0({lean: 14, lf: [20 + 4 * Math.sin(t * 2), 0], hf: [46, -112], hb: [26, -120], nod: 20}));
  if (t < 69.81) {
    const j = Math.min(4, Math.floor((t - 67.25) / 0.5));
    const xs = [700, 620, 540, 460, 380];
    return hh(xs[j] - 55, FLOOR, P0({hip: [6, -84], lean: 38, lf: [30, 0], lb: [-24, 0], hf: [58, -24], hb: [34, -20]}));
  }
  if (t < 72.37) {
    const rx = lerp(600, 430, E(t, 69.9, 71.8));
    return hh(rx + 55, FLOOR, P0({hip: [6, -90], lean: 36, hf: [-48, -22], hb: [-26, -18]}), true);
  }
  if (t < 81.73) {
    const upn = t > 76.4 && t < 77.6 ? -16 : 4;
    return hh(530, FLOOR, P0({hf: [54, -144], hb: [36, -138], nod: upn}));
  }
  if (t < 82.6) return hh(lerp(530, 400, E(t, 81.73, 82.6)), FLOOR, {...walkPose(t, 3.2), pack: false}, true);
  if (t < 83.4) return hh(lerp(400, 270, E(t, 82.6, 83.4)), FLOOR, {...walkPose(t, 3.2), pack: false}, true);
  const sy = surfAt(270, t);
  if (t < 84.6) return hh(270, lerp(FLOOR, sy, E(t, 83.4, 84.6)), {...climbPose(t), pack: false}, true);
  if (t < 87.2) return hh(270, sy, P0({nod: Math.sin(t * 1.5) * 8}));
  if (t < 92.6) return hh(270, sy, P0({}));
  const x = lerp(400, 545, E(t, 92.6, 94.2));
  return hh(x, surfAt(x, t), {...walkPose(t, 3.0), pack: false});
};
const standPoseS = (t: number): Pose => ({hip: [0, -116], lean: 4, lf: [18, 0], lb: [-16, 0], hf: [34, -128], hb: [-12, -126], nod: 0});

const stairPts = (t: number) => {
  const SY = SURF - drift(t);
  const sd = E(t, 54.2, 56.5), sp = E(t, 56.7, 58.7);
  const bottom = lerp(FLOOR, FLOOR + 100, sd);
  const ys = [0, 1, 2, 3].map((j) => SY + ((j + 1) / 4) * (bottom - SY));
  return {SY, ys, u1: lerp(bottom, FLOOR + 50, sp), u2: lerp(bottom, FLOOR, sp)};
};
const stairY = (x: number, t: number) => {
  const st = stairPts(t);
  if (x < SX0) return surfAt(x, t);
  if (x < 220) return st.ys[Math.min(3, Math.floor((x - 100) / 30))];
  if (x < 240) return st.u1;
  if (x < 260) return st.u2;
  return FLOOR;
};
const heroAt = (t: number): H => {
  const h = heroAt0(t);
  if (t < 5.6) return h;
  if (t >= 53.74 && t < 54.2) { const x = lerp(X(520), 235, E(t, 53.74, 54.2)); return {...h, x, y: stairY(x, t)}; }
  if (t >= 54.2 && t < 59.5) return {...h, x: 210, y: stairY(210, t)};
  if (t >= 59.5 && t < 61.7) { const x = lerp(215, X(470), E(t, 59.5, 61.7)); return {...h, x, y: stairY(x, t), pose: {...walkPose(t, 3.2), pack: false}, flip: false}; }
  if (t >= 82.6 && t < 83.4) return {...h, x: lerp(X(400), 255, E(t, 82.6, 83.4)), y: FLOOR};
  if (t >= 83.4 && t < 84.6) { const x = lerp(255, 105, E(t, 83.4, 84.6)); return {...h, x, y: stairY(x, t), pose: {...walkPose(t, 3.0, 16), pack: false}, flip: true}; }
  if (t >= 84.6 && t < 92.6) return {...h, x: 105, y: surfAt(105, t)};
  return {...h, x: X(h.x)};
};

// ---------------- camera ----------------
type CKS = [number, number, number, number];
const KEYS: CKS[] = [
  [2.4, 360, 930, 1.1], [2.9, 480, 1000, 1.25], [2.99, 520, 1010, 1.25], [3.0, 540, 1130, 1.25], [5.6, 560, 1110, 1.3],
  [5.7, 610, 1080, 1.35], [6.9, 620, 1060, 1.35],
  [8.1, 540, 1110, 1.25], [8.11, 540, 1110, 1.25], [11.9, 540, 1100, 1.4],
  [11.97, 640, 1070, 1.4], [16.05, 600, 1060, 1.35], [16.06, 560, 1050, 1.35], [17.68, 560, 1050, 1.3],
  [17.69, 560, 1100, 1.3], [19.6, 580, 1090, 1.45],
  [19.65, 540, 1120, 1.05], [21.0, 540, 1180, 1.25], [21.7, 540, 1200, 1.3], [24.4, 520, 1210, 1.45],
  [24.41, 450, 1230, 1.6], [25.6, 460, 1240, 1.6], [25.63, 520, 1230, 1.5], [27.4, 640, 1250, 1.7], [29.0, 600, 1200, 1.4],
  [32.3, 610, 1180, 1.45], [35.0, 560, 1160, 1.4], [39.1, 560, 1190, 1.45], [42.0, 640, 1100, 1.4], [44.2, 640, 1050, 1.25],
  [44.28, 665, 800, 1.9], [45.7, 640, 880, 1.4], [46.25, 640, 900, 1.3],
  [46.26, 560, 1200, 1.4], [48.3, 500, 1215, 1.4],
  [48.33, 390, 1230, 2.1], [50.8, 400, 1240, 2.0], [50.81, 470, 1260, 1.7], [53.7, 480, 1260, 1.6],
  [53.74, 300, 1300, 2.1], [56.6, 290, 1380, 2.4], [59.5, 330, 1340, 2.0], [60.2, 400, 1280, 1.7], [62.9, 480, 1280, 1.6],
  [63.0, 500, 1290, 2.2], [67.2, 520, 1285, 2.0], [67.21, 540, 1280, 1.8], [69.8, 540, 1280, 1.8], [69.81, 520, 1280, 1.8], [72.3, 540, 1210, 1.35],
  [76.29, 540, 1210, 1.3], [78.0, 540, 1200, 1.25], [81.7, 520, 1210, 1.4], [82.7, 380, 1230, 1.6], [83.4, 320, 1180, 1.4], [84.6, 270, 900, 1.4],
  [84.61, 300, 860, 1.15], [87.0, 460, 820, 1.0], [87.2, 540, 780, 1.1], [88.3, 640, 800, 1.8],
  [88.37, 665, 830, 2.0], [90.3, 665, 840, 2.15], [92.8, 640, 840, 2.4], [92.9, 650, 830, 2.9], [95.3, 656, 826, 3.1],
];
const ABS: Record<number, [number, number, number]> = {53.74: [170, 1330, 1.9], 56.6: [175, 1410, 2.1], 59.5: [200, 1380, 1.9], 83.4: [230, 1200, 1.4], 84.6: [110, 900, 1.4], 84.61: [150, 860, 1.15]};
const KEYS2: CKS[] = KEYS.map((k) => {
  if (k[0] < 2.995) return k;
  if (ABS[k[0]]) return [k[0], ABS[k[0]][0], ABS[k[0]][1], ABS[k[0]][2]] as CKS;
  return [k[0], X(k[1]), k[2] + (k[2] > 1100 ? 14 : 0), k[3] > 1.2 && k[0] < 44 || (k[0] > 46.2 && k[0] < 84) ? k[3] * 0.9 : k[3]] as CKS;
});
const camAt = (t: number) => {
  let r = KEYS2[KEYS2.length - 1].slice(1) as number[];
  if (t < KEYS2[0][0]) r = KEYS2[0].slice(1) as number[];
  else for (let i = 0; i < KEYS2.length - 1; i++) {
    if (t >= KEYS2[i][0] && t < KEYS2[i + 1][0]) {
      const d = KEYS2[i + 1][0] - KEYS2[i][0];
      const k = d < 0.05 ? 1 : ease((t - KEYS2[i][0]) / d);
      r = [lerp(KEYS2[i][1], KEYS2[i + 1][1], k), lerp(KEYS2[i][2], KEYS2[i + 1][2], k), lerp(KEYS2[i][3], KEYS2[i + 1][3], k)];
      break;
    }
  }
  const shk = t >= 76.29 && t < 78.6 ? 7 * (1 - P(t, 76.29, 78.6)) : 0;
  return {fx: r[0] + shk * Math.sin(t * 53), fy: r[1] + shk * Math.cos(t * 47), s: r[2]};
};

// ---------------- world ----------------
const CLOTH = '#d36a2a', CLOTH2 = '#a84f1c';
const LOGW = 580;
const WALL = '#e4effb';
const World: React.FC<{t: number; h: H; cx: number}> = ({t, h, cx}) => {
  const depth = depthAt(t);
  const w = widthAt(t);
  const pitL = 540 - w / 2, pitR = 540 + w / 2;
  const FY = SURF + depth;
  const shaftOn = t >= 19.65;
  const sump = 100 * E(t, 54.2, 56.5);
  const stepH = 100 * E(t, 56.7, 58.7);
  const dr = drift(t);
  const SY = SURF - dr;
  const warm = E(t, 27.8, 29.8);
  const roofDark = E(t, 19.65, 21.7);
  let ic = mixc('#7f99bd', '#31476c', roofDark);
  ic = mixc(ic, '#7a5238', warm * 0.85);
  const w1 = (a: number, b: number, c: number, d: number) => E(t, a, b) * (1 - E(t, c, d));
  const doorOpen = Math.max(w1(49.6, 50.4, 52.6, 53.2), w1(53.5, 53.9, 54.3, 54.6), w1(60.0, 60.3, 61.4, 61.8), w1(81.9, 82.4, 83.0, 83.6));
  const cp = E(t, 40.7, 43.2);
  const pipeBase = FLOOR - 88;
  const pipeTop = lerp(pipeBase, 838, cp);
  const fog = E(t, 32.4, 38) * 0.7 * (1 - E(t, 43.4, 45.8));
  const wet = E(t, 63, 66);
  const boardsAll = E(t, 67.25, 69.8);
  const rugP = E(t, 69.9, 71.8);
  const snowOnRoof = E(t, 17.68, 19.65);
  const showHero = h.vis && !(t >= 87.6 && t < 92.6);
  const ext = t >= 84.6;
  const plateP = E(t, 40.1, 40.6);
  const stoveCarry = t >= 25.1 && t < 27.6;
  // sliding logs
  const logAt = (k: number) => {
    const tp = 12.95 + 0.88 * k;
    const p = E(t, tp, tp + 0.55);
    const fin = 540 + 20 * (k % 2 ? -1 : 1);
    return {p, cx: lerp(1140, fin, p), cy: lerp(SURF - 15 - (3 - k) * 29 * 0 - k * 29, roofY0 + 15 - k * 9, p), done: t >= tp + 0.55, started: t >= tp};
  };
  const roofY0 = 957;
  // cloth segment
  const clothSeg = (): {L: number; R: number; y: number; sag: number} | null => {
    if (t < 5.8) return null;
    if (t < 12.55) {
      const sl = E(t, 5.8, 6.9);
      const L = lerp(PX1 + 2, PX0 + 2, sl);
      const pulled = E(t, 11.97, 12.55);
      return {L: lerp(L, PX1 + 2, pulled), R: lerp(PX1 + 40, PX1 + 62, pulled), y: SURF - 3, sag: 110 * E(t, 8.57, 11.5) * (1 - pulled) * (t > 6.9 ? 1 : 0)};
    }
    if (t < 16.2) return {L: PX1 + 2, R: PX1 + 62, y: SURF - 3, sag: 0};
    const L = lerp(PX1 + 2, PX0 - 4, E(t, 16.2, 17.2));
    return {L, R: PX1 + 62, y: roofY0 - 6, sag: 0};
  };
  const cs = clothSeg();
  const stoveX = 0;
  const stoveY = (() => {
    if (t < 25.1) return FY - 4;
    if (t < 25.63) return FY - 4 - 20 * E(t, 25.1, 25.63);
    if (t < 27.35) return h.y - 70;
    if (t < 27.6) return lerp(h.y - 70, FY - 4, E(t, 27.35, 27.6));
    return FY - 4;
  })();
  const stoveCX = (() => {
    if (t < 25.1) return X(400);
    if (t < 25.63) return lerp(X(400), h.x - 56, E(t, 25.1, 25.63));
    if (t < 27.35) return h.x + 50;
    if (t < 27.6) return lerp(h.x + 50, STOVE_X, E(t, 27.35, 27.6));
    return STOVE_X;
  })();
  void stoveX;
  return (
    <g>
      <Mountains cx={cx} />
      <path d={`M-1200 ${SY - 10} Q-300 ${SY - 50 - dr * 0.3} 300 ${SY - 20} T1700 ${SY - 14} L1700 2600 L-1200 2600 Z`} fill="#f6faff" />
      <Pine x={-420} y={SY + 4} s={0.9} />
      <Pine x={-300} y={SY + 8} s={0.7} />
      <Pine x={1180} y={SY + 6} s={0.8} />
      <Pine x={1320} y={SY + 4} s={1.0} />
      {t > 2.45 && (
        <g stroke="#cfe0f2" strokeWidth={4} strokeLinecap="round" opacity={0.9}>
          <line x1={-400} y1={SY + 5} x2={Math.min(250, h.x)} y2={SY + 5} />
          <line x1={-400} y1={SY + 12} x2={Math.min(250, h.x)} y2={SY + 12} />
        </g>
      )}
      <defs>
        <linearGradient id="cut" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#eef6ff" />
          <stop offset="0.35" stopColor="#d4e5f7" />
          <stop offset="1" stopColor="#9bb8dc" />
        </linearGradient>
      </defs>
      <rect x={-1200} y={SY} width={3200} height={2000} fill="url(#cut)" />
      {[60, 120, 190, 270, 360, 470, 600].map((d, i) => <path key={i} d={`M-1200 ${SURF + d} Q-400 ${SURF + d + 10} 200 ${SURF + d - 6} T1500 ${SURF + d + 4}`} stroke="#b4cce6" strokeWidth={3} fill="none" opacity={0.7} />)}
      <rect x={-1200} y={SY - 4} width={3200} height={8} fill="#ffffff" opacity={0.9} />
      {/* stairs (entrance) */}
      {shaftOn && (() => {
        const st = stairPts(t);
        const y = st.ys;
        const d = `M${SX0} ${st.SY} L${SX1} ${st.SY} L${SX1} ${st.u2} L240 ${st.u2} L240 ${st.u1} L220 ${st.u1} L220 ${y[3]} L190 ${y[3]} L190 ${y[2]} L160 ${y[2]} L160 ${y[1]} L130 ${y[1]} L130 ${y[0]} L100 ${y[0]} Z`;
        const prof = `M${SX0} ${y[0]} L130 ${y[0]} L130 ${y[1]} L160 ${y[1]} L160 ${y[2]} L190 ${y[2]} L190 ${y[3]} L220 ${y[3]} L220 ${st.u1} L240 ${st.u1} L240 ${st.u2} L${SX1} ${st.u2}`;
        return (
          <g>
            <defs><clipPath id="stairAir"><path d={d} /></clipPath></defs>
            <path d={d} fill={mixc('#8fa8c8', '#2a3c5c', roofDark * 0.4)} />
            <rect x={SX0} y={FLOOR + 25} width={SX1 - SX0} height={200} fill="#69b8ff" opacity={0.3 * E(t, 56.5, 58.5)} clipPath="url(#stairAir)" />
            <path d={prof} fill="none" stroke="#b4cce6" strokeWidth={5} strokeLinejoin="round" />
            {[0, 1, 2, 3].map((j) => <rect key={j} x={100 + 30 * j} y={y[j] - 3} width={30} height={7} rx={2} fill="#ffffff" />)}
            <rect x={220} y={st.u1 - 3} width={20} height={7} rx={2} fill="#ffffff" />
            <rect x={240} y={st.u2 - 3} width={20} height={7} rx={2} fill="#ffffff" />
          </g>
        );
      })()}
      {/* pit */}
      <rect x={pitL} y={SURF} width={pitR - pitL} height={depth} fill={ic} />
      <rect x={pitL} y={SURF} width={6} height={depth} fill="#000" opacity={0.18} />
      <rect x={pitR - 6} y={SURF} width={6} height={depth} fill="#000" opacity={0.18} />
      {/* wall + door */}
      {shaftOn && (
        <g>
          <rect x={SX1 - 6} y={SY} width={12} height={1015 - SY} fill={WALL} stroke="#b4cce6" strokeWidth={2} />
          <g transform={`translate(${SX1} 1015) rotate(${-86 * doorOpen})`}>
            <rect x={-6} y={0} width={12} height={FLOOR - 1015} rx={3} fill="#8a5a30" stroke="#4a2f16" strokeWidth={3} />
            <rect x={-6} y={0} width={5} height={FLOOR - 1015} fill="#a8733f" opacity={0.7} />
            <circle cx={5} cy={170} r={5} fill="#d9d9d9" />
          </g>
        </g>
      )}
      {/* interior */}
      <g>
        <rect x={pitL} y={FY - 6} width={pitR - pitL} height={10} fill={mixc('#dbe8f6', '#8ea6c4', wet * 0.6)} />
        {wet > 0 && (
          <g>
            <ellipse cx={540} cy={FY - 3} rx={20 + 140 * wet} ry={5 + 4 * wet} fill="#5aa6e8" opacity={0.65 * (1 - boardsAll * 0.9)} />
            {t > 63 && t < 67.3 && Array.from({length: 4}).map((_, i) => {
              const tt = (t * 1.3 + i * 0.37) % 1;
              return <circle key={i} cx={330 + i * 110} cy={1020 + tt * 290} r={4} fill="#8ac4ff" opacity={tt < 0.95 ? 0.9 : 0} />;
            })}
          </g>
        )}
        {/* boards: stack at right wall -> floor */}
        {Array.from({length: 5}).map((_, j) => {
          const tp = 67.25 + 0.5 * j;
          const p = E(t, tp, tp + 0.38);
          const x = [700, 620, 540, 460, 380].map(X)[j];
          const sx = X(733) - j * 6;
          if (p <= 0) return <rect key={j} x={sx - 4} y={FY - 150} width={8} height={146} fill="#c99a5a" stroke="#6a4a22" strokeWidth={2} />;
          const px = lerp(sx, x, ease(p));
          const py = lerp(FY - 80, FY - 10, ease(p)) - Math.sin(Math.PI * p) * 60;
          const rot = lerp(90, 0, ease(p));
          return <g key={j} transform={`translate(${px} ${py}) rotate(${rot})`}><rect x={-50} y={-5} width={100} height={10} rx={2} fill="#c99a5a" stroke="#6a4a22" strokeWidth={2} /></g>;
        })}
        {/* rug */}
        {(() => {
          const rx = lerp(X(600), X(430), rugP);
          return (
            <g>
              {t < 69.9 && <g><rect x={X(584)} y={FY - 26} width={40} height={24} rx={12} fill="#b8362a" stroke="#6a1a14" strokeWidth={3} /><circle cx={X(590)} cy={FY - 14} r={9} fill="#e4574a" /></g>}
              {t >= 69.9 && <rect x={rx} y={FY - 16} width={X(612) - rx} height={8} fill="#c8412e" stroke="#6a1a14" strokeWidth={2} />}
              {t >= 69.9 && rugP < 1 && <circle cx={rx} cy={FY - 16} r={10} fill="#e4574a" stroke="#6a1a14" strokeWidth={2} />}
              {t >= 69.9 && rugP >= 0.2 && Array.from({length: 4}).map((_, i) => <rect key={i} x={rx + 18 + i * 38} y={FY - 15} width={10} height={6} fill="#ffd23f" opacity={0.8} />)}
            </g>
          );
        })()}
        {/* pipe + plate stored at left wall */}
        {t < 40.5 && <line x1={X(352)} y1={FY - 4} x2={X(364)} y2={FY - 214} stroke="#8d94a3" strokeWidth={13} strokeLinecap="round" />}
        {t < 40.1 && <rect x={X(436)} y={FY - 66} width={46} height={62} rx={4} fill="#6a7180" stroke="#2a2d34" strokeWidth={3} />}
        {/* shovel leaning */}
        {((t >= 5.6 && t < 17.2) || (t >= 19.65 && t < 53.9)) && <g transform={`translate(${X(372)} ${FY}) rotate(8)`}><line x1={0} y1={0} x2={0} y2={-150} stroke="#8a6a3a" strokeWidth={7} strokeLinecap="round" /><path d="M-14 -4 L14 -4 L10 24 L-10 24 Z" fill="#b8c0cc" stroke="#6b7482" strokeWidth={3} /></g>}
        {/* stove */}
        <g transform={`translate(${stoveCX} ${stoveY}) scale(0.82) translate(${-stoveCX} ${-stoveY})`}><StoveArt x={stoveCX} y={stoveY} glow={warm} t={t} /></g>
        {warm > 0 && (
          <g>
            <defs>
              <radialGradient id="wg" cx="0.5" cy="0.5" r="0.5">
                <stop offset="0" stopColor="#ffb040" stopOpacity={0.55 * warm} />
                <stop offset="1" stopColor="#ff8a2a" stopOpacity={0} />
              </radialGradient>
            </defs>
            <circle cx={STOVE_X} cy={FLOOR - 50} r={270} fill="url(#wg)" />
          </g>
        )}
      </g>
      {/* chimney */}
      {t >= 40.1 && (
        <g>
          {(() => {
            const px = lerp(X(459), STOVE_X, plateP);
            const py = lerp(FY - 66, roofY0 - 4, plateP) - Math.sin(Math.PI * plateP) * 120;
            return <rect x={px - 28} y={py} width={56} height={66} rx={5} fill="#6a7180" stroke="#2a2d34" strokeWidth={3} />;
          })()}
          {cp > 0 && <rect x={STOVE_X - 8} y={pipeTop} width={16} height={pipeBase - pipeTop} fill="#8d94a3" stroke="#3a3f4a" strokeWidth={3} />}
          {cp > 0 && <rect x={STOVE_X - 12} y={pipeTop - 8} width={24} height={12} rx={3} fill="#555c6a" />}
        </g>
      )}
      {/* logs on pile + sliding + roof */}
      {[3, 2, 1, 0].map((k) => {
        const l = logAt(k);
        if (l.done) return <Log key={k} x={l.cx} y={l.cy} w={LOGW} r={15} />;
        return <Log key={k} x={l.cx} y={l.cy} w={LOGW} r={15} />;
      })}
      {cs && (() => {
        const pts: string[] = [];
        for (let i = 0; i <= 24; i++) {
          const u = i / 24;
          pts.push(`${cs.L + (cs.R - cs.L) * u},${cs.y + cs.sag * Math.sin(Math.PI * Math.min(1, Math.max(0, (cs.L + (cs.R - cs.L) * u - PX0) / (PX1 - PX0)))) * (cs.L < PX1 ? 1 : 0)}`);
        }
        const hp = 70 * E(t, 8.57, 11.9) * (1 - E(t, 11.97, 12.55)) * (t > 6.9 ? 1 : 0);
        return (
          <g>
            <polyline points={pts.join(' ')} fill="none" stroke={CLOTH2} strokeWidth={10} strokeLinejoin="round" />
            <polyline points={pts.join(' ')} fill="none" stroke={CLOTH} strokeWidth={6} strokeLinejoin="round" />
            {hp > 1 && <path d={`M${PX0} ${cs.y} ${pts.map((p) => { const [x, y] = p.split(',').map(Number); if (x < PX0 || x > PX1) return ''; const u = (x - PX0) / (PX1 - PX0); return `L${x} ${y - hp * Math.sin(Math.PI * u) - 6}`; }).join(' ')} L${PX1} ${cs.y} Z`} fill="#f7fbff" stroke="#cfe0f2" strokeWidth={3} />}
          </g>
        );
      })()}
      {t >= 17.68 && (() => {
        const xl = lerp(PX1 + 10, PX0 - 6, snowOnRoof);
        const th = 34;
        return <path d={`M${xl} ${roofY0 - 8} Q${(xl + PX1 + 10) / 2} ${roofY0 - 8 - th * 1.3} ${PX1 + 14} ${roofY0 - 8} Z`} fill="#f7fbff" stroke="#cfe0f2" strokeWidth={3} />;
      })()}
      {(() => {
        const mh = 70;
        return <path d={`M${pitR + 6} ${SURF + 2} Q${pitR + 50} ${SURF - mh * 1.3} ${pitR + 100} ${SURF + 2} Z`} fill="#f7fbff" stroke="#cfe0f2" strokeWidth={3} />;
      })()}
      {/* rock + gear */}
      <g transform={`translate(0 ${SY - SURF})`}>
        <path d="M70 1000 Q80 900 140 880 Q200 870 230 940 L240 1000 Z" fill="#6b7586" stroke="#3a4250" strokeWidth={4} />
        <path d="M110 920 Q150 890 190 905 Q160 915 120 940 Z" fill="#9aa5b8" />
      </g>
      {(() => {
        if (t < 2.7) return null;
        const sp = E(t, 2.7, 2.9);
        return (
          <g transform={`translate(0 ${SY - SURF})`}>
            {[0, 1].map((i) => (
              <g key={i} transform={`translate(${lerp(250 + i * 24, 196 + i * 14, sp)} ${SURF}) rotate(${lerp(-86, -80 + i * 3, sp)})`}>
                <rect x={-4} y={-4} width={230} height={8} rx={4} fill={i ? '#14161b' : '#0c0d10'} stroke="#3a3f4a" strokeWidth={1.5} />
              </g>
            ))}
            {[0, 1].map((i) => <line key={i} x1={226 + i * 10} y1={SURF - 8} x2={246 + i * 10} y2={SURF - 190} stroke="#3a3f4a" strokeWidth={4} opacity={sp} />)}
            {sp > 0.4 && <g><rect x={250} y={SURF - 50} width={34} height={50} rx={12} fill="#2a303b" stroke="#12151b" strokeWidth={3} /><rect x={256} y={SURF - 34} width={22} height={6} rx={3} fill="#444c5c" /></g>}
          </g>
        );
      })()}
      {t < 2.85 && <g transform={`translate(300 ${SURF}) rotate(-8)`}><line x1={0} y1={0} x2={0} y2={-150} stroke="#8a6a3a" strokeWidth={7} strokeLinecap="round" /><path d="M-14 -4 L14 -4 L10 24 L-10 24 Z" fill="#b8c0cc" stroke="#6b7482" strokeWidth={3} /></g>}
      {/* smoke inside */}
      {t >= 32.37 && t < 46 && Array.from({length: 46}).map((_, i) => {
        const b = 32.37 + i * 0.22;
        const tau = t - b;
        if (tau < 0 || tau > 5) return null;
        const piped = t > 43.2;
        const x0 = STOVE_X + (rnd(i) - 0.5) * 20;
        const x = piped ? STOVE_X + (rnd(i) - 0.5) * 12 : x0 + (rnd(i + 3) - 0.5) * (60 + tau * 200);
        const y = piped ? Math.max(pipeTop - 20, pipeBase - tau * 380) : Math.max(1018 + (i % 5) * 16, pipeBase - 5 - tau * 150);
        return <circle key={i} cx={Math.min(PX1 - 10, Math.max(PX0 + 10, x))} cy={y} r={14 + tau * 10} fill="#8a8f9a" opacity={0.5 * (1 - tau / 5)} />;
      })}
      {fog > 0.01 && <rect x={PX0} y={1005} width={PX1 - PX0} height={FLOOR - 1005} fill="#6a6f7a" opacity={fog * 0.55} />}
      {fog > 0.01 && <rect x={PX0} y={1005} width={PX1 - PX0} height={150} fill="#4c505a" opacity={fog * 0.5} />}
      {t >= 43.4 && Array.from({length: 24}).map((_, i) => {
        const tau = ((t - 43.4) * 0.7 + i * 0.18) % 4.3;
        const x = STOVE_X + (rnd(i) - 0.3) * 40 + tau * 28;
        const y = pipeTop - 10 - tau * 85;
        return <circle key={i} cx={x} cy={y} r={10 + tau * 12} fill="#e9eef5" opacity={Math.max(0, 0.6 * (1 - tau / 4.3))} />;
      })}
      {t >= 50.4 && t < 53.9 && Array.from({length: 40}).map((_, i) => {
        const f = clamp((t - 50.4) / 0.5) * (1 - clamp((t - 53.0) / 0.9));
        const tt = ((t - 50.4) * 0.9 + rnd(i) * 1.5) % 1;
        const x = 265 + tt * 540;
        const y = FLOOR - 30 - rnd(i + 2) * 200 + Math.sin(tt * 7 + i) * 18;
        return <g key={i} opacity={f * (1 - tt * 0.5)}><line x1={x} y1={y} x2={x - 40} y2={y + 4} stroke="#5ab4ff" strokeWidth={5} strokeLinecap="round" opacity={0.7} /><circle cx={x - 40} cy={y} r={4} fill="#fff" /></g>;
      })}
      {t >= 50.4 && t < 54 && <rect x={PX0} y={1005} width={PX1 - PX0} height={FLOOR - 1005} fill="#69b8ff" opacity={0.16 * clamp((t - 50.4) / 1.2) * (1 - clamp((t - 53) / 0.9))} />}
      {t >= 76.29 && t < 79 && Array.from({length: 18}).map((_, i) => <circle key={i} cx={PX0 + 20 + rnd(i) * 520} cy={1010 + ((t * 80 + rnd(i + 3) * 300) % 300)} r={3} fill="#f7fbff" opacity={0.7} />)}
      {/* exterior after avalanche */}
      {ext && (
        <g>
          <path d={`M-1200 ${surfAt(-1200, t)} ${Array.from({length: 60}).map((_, i) => { const x = -1200 + i * 50; return `L${x} ${surfAt(x, t)}`; }).join(' ')} L1800 2600 L-1200 2600 Z`} fill="#f4f9ff" />
          <path d={`M-1200 ${surfAt(-1200, t)} ${Array.from({length: 60}).map((_, i) => { const x = -1200 + i * 50; return `L${x} ${surfAt(x, t)}`; }).join(' ')}`} fill="none" stroke="#cfe0f2" strokeWidth={6} />
          {[40, 100, 170].map((d, i) => <path key={i} d={`M-1200 ${SY + d + 40} Q-400 ${SY + d + 50} 200 ${SY + d + 34} T1500 ${SY + d + 44}`} stroke="#d9e8f8" strokeWidth={3} fill="none" opacity={0.7} />)}
          <ellipse cx={110} cy={SY + 4} rx={46} ry={9} fill="#2a3c5c" />
          <rect x={STOVE_X - 8} y={pipeTop - 6} width={16} height={SY - pipeTop + 8} fill="#8d94a3" stroke="#3a3f4a" strokeWidth={3} />
          <rect x={STOVE_X - 12} y={pipeTop - 12} width={24} height={12} rx={3} fill="#555c6a" />
          {t >= 90.34 && (() => {
            const sx = lerp(1020, STOVE_X + 62, E(t, 90.34, 91.4));
            return <g transform={`translate(${2 * sx} 0) scale(-1 1)`}><Squirrel x={sx} y={surfAt(sx, t) + 2} t={t} s={0.5} squeak={t > 93.7 && t < 94.4 ? 1 : 0} /></g>;
          })()}
        </g>
      )}
      {showHero && <Skier x={h.x} y={h.y} flip={h.flip} pose={h.pose} s={0.9} />}
      {/* dig snow particles */}
      {(() => {
        const out: React.ReactNode[] = [];
        const add = (t0: number, n: number, cyc: number, dirx: number, tx0: number, base: number, up = 1) => {
          for (let c = 0; c < n; c++) {
            const tau = t - (t0 + c * cyc + 0.78 * cyc);
            if (tau < 0 || tau > 0.9) continue;
            for (let i = 0; i < 9; i++) {
              const vx = dirx * (150 + rnd(i + c * 11) * 170), vy = (-380 - rnd(i + 3 + c) * 260) * up;
              out.push(<circle key={`${t0}${c}${i}`} cx={tx0 + vx * tau} cy={base + vy * tau + 560 * tau * tau} r={7 - tau * 4 + rnd(i) * 4} fill="#f7fbff" stroke="#cfe0f2" strokeWidth={1.5} opacity={1 - tau} />);
            }
          }
        };
        if (t >= 3.0 && t < 5.7) {
          const hx = 540 + widthAt(Math.min(t, 5.6)) / 2 - 110;
          add(3.0, 3, 0.95, 1, hx + DIG_TIP[0] * 0.9, SURF + depthAt(Math.min(t, 5.6)) + DIG_TIP[1] * 0.9, 1.25);
        }
        if (t >= 17.68 && t < 19.8) add(17.68, 3, 0.8, 1, 580 + DIG_TIP[0] * 0.9, FLOOR + DIG_TIP[1] * 0.9, 1.3);
        if (t >= 54.2 && t < 56.7) add(54.2, 4, 0.85, 1, 210 + DIG_TIP[0] * 0.9, FLOOR + 100 * E(t, 54.2, 56.5) + DIG_TIP[1] * 0.9);
        if (t >= 56.6 && t < 58.8) add(56.6, 3, 0.8, 1, 210 + DIG_TIP[0] * 0.9, FLOOR + 100 + DIG_TIP[1] * 0.9);
        return out;
      })()}
      {t < 22 && <SnowParticles t={t} n={t >= 8.57 && t < 11.97 ? 140 : 40} speed={t >= 8.57 && t < 11.97 ? 380 : 80} wind={t >= 8.57 && t < 11.97 ? 380 : 40} op={0.85} w={1700} h={2200} />}
      {t >= 84.6 && <SnowParticles t={t} n={40} speed={70} wind={20} op={0.8} w={1700} h={2200} />}
    </g>
  );
};

// ---------------- top view overlay ----------------
const TopView: React.FC<{t: number}> = ({t}) => {
  const p = E(t, 6.95, 8.0);
  const edgeY = lerp(690, 1150, p);
  return (
    <AbsoluteFill>
      <svg width={1080} height={1920} viewBox="0 0 1080 1920">
        <defs><linearGradient id="tvs" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#f4f9ff" /><stop offset="1" stopColor="#dbe8f6" /></linearGradient></defs>
        <rect width={1080} height={1920} fill="url(#tvs)" />
        {Array.from({length: 18}).map((_, i) => <ellipse key={i} cx={rnd(i) * 1080} cy={rnd(i + 4) * 1920} rx={40 + rnd(i) * 70} ry={10 + rnd(i + 2) * 14} fill="#cfe0f2" opacity={0.7} />)}
        <rect x={200} y={640} width={680} height={560} rx={24} fill="#2a3c5c" stroke="#9bb8dc" strokeWidth={10} />
        <rect x={200} y={640} width={680} height={560} rx={24} fill="#5c7aa8" opacity={0.35} />
        <rect x={200} y={640} width={680} height={edgeY - 640} fill="#d36a2a" stroke="#a84f1c" strokeWidth={6} />
        {[0, 1, 2, 3, 4, 5].map((i) => <line key={i} x1={200} y1={700 + i * 80} x2={880} y2={700 + i * 80} stroke="#a84f1c" strokeWidth={3} opacity={0.5} />)}
        <g transform={`translate(${540 + Math.sin(t * 6) * 6} 920)`}>
          <ellipse cx={0} cy={0} rx={110} ry={50} fill="#1b1e25" />
          <circle cx={0} cy={-6} r={44} fill="#15181e" />
          <ellipse cx={0} cy={-16} rx={22} ry={14} fill="#0a0c10" stroke="#3a4050" strokeWidth={3} />
          <path d="M-90 -10 Q-130 -80 -80 -170" stroke="#1b1e25" strokeWidth={26} fill="none" strokeLinecap="round" />
          <path d="M90 -10 Q130 -80 80 -170" stroke="#1b1e25" strokeWidth={26} fill="none" strokeLinecap="round" />
          <circle cx={-80} cy={-176} r={14} fill="#08090b" />
          <circle cx={80} cy={-176} r={14} fill="#08090b" />
        </g>
        <SnowParticles t={t} n={30} speed={60} op={0.7} />
      </svg>
    </AbsoluteFill>
  );
};

// ---------------- composition ----------------
const insideVal = (t: number) => (t < 27.8 ? -38 + Math.sin(t) * 0.4 : lerp(-38, 15, E(t, 28.2, 31.6)));
const hudMode = (t: number): 'out' | 'in' | 'both' => {
  if (t < 19.65 || (t >= 44.28 && t < 46.26) || (t >= 73.15 && t < 76.29) || t >= 84.6) return 'out';
  if (t >= 76.29 && t < 81.73) return 'both';
  return 'in';
};

export const Shelter: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPSS + OFF;
  const h = heroAt(t);
  const cam = camAt(t);
  const showAv = t >= 73.15 && t < 76.29;
  const whiteout = t >= 76.29 && t < 76.6 ? 1 - clamp((t - 76.29) / 0.3) : 0;
  const gust = t >= 11.9 && t < 12.1 ? 0.8 * (1 - Math.abs(t - 12.0) / 0.1) : 0;
  const fadeEnd = clamp((t - 94.5) / 0.8);
  const rampW = (pts: [number, number][]) => ramp(pts.map(([a, v]) => [a - OFF, v] as [number, number]));
  const S = (a: number, d: number, src: string, v: number | ((f: number) => number)) =>
    a < OFF ? null : (
      <Sequence key={`${src}${a}`} from={Math.round((a - OFF) * FPSS)} durationInFrames={Math.round(d * FPSS)}>
        <Audio src={staticFile(`sfx/${src}.mp3`)} volume={v} />
      </Sequence>
    );
  const wind = rampW([[0, 0.05], [8.5, 0.05], [8.7, 0.13], [11.8, 0.13], [12.4, 0.05], [19.6, 0.05], [20.5, 0.02], [50.4, 0.02], [50.6, 0.09], [53.3, 0.09], [53.7, 0.02], [76.3, 0.02], [81.7, 0.02], [82, 0.05], [95, 0.04]]);
  const fire = rampW([[27.8, 0], [29, 0.07], [72, 0.06], [73.3, 0.02], [76.3, 0.05], [81.7, 0.05], [82.5, 0.02], [84.6, 0]]);
  const music = rampW([[2.4, 0], [3.4, 0.05], [90, 0.05], [95, 0]]);
  const logTimes = [13.3, 14.2, 15.1, 16.0];
  const boardTimes = [67.25, 67.75, 68.25, 68.75, 69.25];
  return (
    <AbsoluteFill style={{backgroundColor: '#cfe0f2'}}>
      <Audio src={staticFile('voice9.mp3')} volume={1} startFrom={Math.round(OFF * FPSS)} />
      <Audio src={staticFile('sfx/mtn.mp3')} volume={music} startFrom={Math.round(OFF * FPSS)} />
      <Audio src={staticFile('sfx/wind.mp3')} volume={wind} loop />
      <Audio src={staticFile('sfx/fire.mp3')} volume={fire} loop />
      {S(2.4, 0.6, 'whoosh', 0.09)}
      {S(2.9, 0.5, 'thud', 0.1)}
      {[3.25, 4.2, 5.15].map((d) => S(d, 0.6, 'crunch', 0.09))}
      {[3.1, 4.05, 5.0].map((d) => S(d, 0.7, 'drag', 0.06))}
      {S(5.9, 1.0, 'drag', 0.08)}
      {S(12.0, 0.8, 'drag', 0.08)}
      {logTimes.map((d) => S(d, 0.6, 'thud', 0.12))}
      {S(16.3, 0.9, 'drag', 0.07)}
      {[18.5, 19.2].map((d) => S(d, 0.6, 'crunch', 0.08))}
      {[49.7, 61.4, 82.0].map((d) => S(d, 1.0, 'creak', 0.09))}
      {S(27.45, 0.8, 'clank', 0.12)}
      {S(40.4, 0.7, 'clank', 0.1)}
      {S(42.0, 0.8, 'clank', 0.1)}
      {boardTimes.map((d) => S(d, 0.5, 'thud', 0.08))}
      {S(70.4, 1.0, 'drag', 0.07)}
      {[63.3, 64.2, 65.1, 65.9, 66.6].map((d) => S(d, 0.4, 'drip', 0.08))}
      {S(73.15, 4.2, 'rumble', ramp([[0, 0], [0.8, 0.09], [2.8, 0.13], [3.2, 0.11], [4.2, 0]]))}
      {S(76.3, 3, 'rumble', ramp([[0, 0.1], [1.5, 0.06], [3, 0]]))}
      {S(93.75, 0.6, 'squeak', 0.14)}
      {S(94.35, 0.6, 'squeak', 0.1)}
      {[53.9, 56.7].map((d) => S(d, 0.6, 'crunch', 0.08))}

      {!showAv && (
        <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{position: 'absolute', left: 0, top: 0}}>
          <SkierDefs />
          <g transform={`translate(540 960) scale(${cam.s}) translate(${-cam.fx} ${-cam.fy})`}>
            <World t={t} h={h} cx={cam.fx} />
          </g>
        </svg>
      )}
      {showAv && (
        <AbsoluteFill>
          <svg width={1080} height={1920} viewBox="0 0 1080 1920">
            <g transform={`translate(${Math.sin(t * 61) * 9} ${Math.cos(t * 53) * 9})`}>
              <SnowRush t={t} a={73.15} b={76.29} />
            </g>
          </svg>
        </AbsoluteFill>
      )}
      <AbsoluteFill><svg width={1080} height={1920} viewBox="0 0 1080 1920"><TempHUD t={t} mode={hudMode(t)} inside={insideVal(t)} /></svg></AbsoluteFill>
      <AutoSub t={t} subs={subsS as any} />
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 62%, rgba(10,20,45,0.22) 100%)'}} />
      <AbsoluteFill style={{backgroundColor: '#fff', opacity: Math.max(whiteout, gust)}} />
      <AbsoluteFill style={{backgroundColor: '#0b1226', opacity: Math.max(fadeEnd, 1 - clamp((t - OFF) / 0.25))}} />
    </AbsoluteFill>
  );
};
