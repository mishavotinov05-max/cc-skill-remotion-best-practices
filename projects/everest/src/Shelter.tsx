import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {clamp, ease, lerp, rnd} from './util';
import {Overlay, ramp} from './Everest';
import {AutoSub} from './AutoSub';
import subsS from './subs_shelter.json';
import {Avalanche, digPose, DIG_TIP, E, FONT, Log, LogEnd, mixc, Mountains, P, Pine, Pose, shivPose, Skier, SkierDefs, SnowParticles, Squirrel, StoveArt, TempHUD, V, walkPose} from './ShelterArt';

export const FPSS = 30;
export const DURATIONS = 95.3;
const SURF = 1000, FLOOR = 1340, PX0 = 390, PX1 = 690, SX0 = 270, SX1 = 390;
const STOVE_X = 600;

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

const heroAt = (t: number): H => {
  if (t < 2.0) {
    const p = P(t, 0, 2.0);
    const e = 1 - (1 - p) * (1 - p);
    const sw = Math.sin(t * 5);
    return hh(lerp(-260, 250, e), SURF, {hip: [0, -104], lean: 22, lf: [26, -8], lb: [-30, -8], hf: [60 + 8 * sw, -128], hb: [10 - 8 * sw, -122], ski: true});
  }
  if (t < 2.5) {
    const s = Math.sin(P(t, 2.0, 2.5) * Math.PI);
    return hh(250, SURF, {hip: [0, -100], lean: 12 + 34 * s, lf: [22, 0], lb: [-22, 0], hf: [36, -120 + 84 * s], hb: [4, -120 + 84 * s], pack: P(t, 2.0, 2.5) < 0.6});
  }
  if (t < 2.95) return hh(lerp(250, 410, P(t, 2.5, 2.95)), SURF, {...walkPose(t, 3.4), pack: false});
  if (t < 5.6) {
    const e = E(t, 3.0, 5.6);
    const ph = ((t - 3.0) / 0.95) % 1;
    const w = 100 + 200 * e;
    const p = digPose(t < 3.0 ? 0 : ph);
    return hh(540 + w / 2 - 105, SURF + 340 * e, {...p, pack: false});
  }
  if (t < 6.2) {
    const p = P(t, 5.6, 6.2);
    return hh(lerp(585, 740, ease(p)), lerp(FLOOR, SURF, ease(clamp((p - 0.15) / 0.8))), {...climbPose(t), pack: false});
  }
  if (t < 6.55) return hh(lerp(740, 850, E(t, 6.2, 6.55)), SURF, {...walkPose(t, 3.4), pack: false});
  if (t < 6.7) return hh(850, SURF, {hip: [0, -100], lean: 30, lf: [22, 0], lb: [-22, 0], hf: [50, -60], hb: [30, -50], pack: false});
  if (t < 7.05) return hh(lerp(850, 740, E(t, 6.7, 7.05)), SURF, {...walkPose(t, 3.4, 8, 'box'), pack: false}, true);
  if (t < 8.1) {
    const k = Math.sin(t * 3);
    return hh(740, SURF, {hip: [0, -106], lean: 18, lf: [20, 0], lb: [-20, 0], hf: [-50, -110 + 12 * k], hb: [-30, -100], pack: false}, true);
  }
  if (t < 11.97) return hh(740, SURF, {...shivPose(t), pack: false}, true);
  if (t < 12.55) {
    const p = E(t, 11.97, 12.55);
    return hh(lerp(740, 790, p), SURF, {hip: [0, -108], lean: -10, lf: [20, 0], lb: [-14, 0], hf: [-60 + 20 * p, -100], hb: [-30, -96], pack: false}, true);
  }
  if (t < 16.05) {
    // log trips: tripA 12.55..14.3, tripB 14.3..16.05
    const k = t < 14.3 ? 0 : 1;
    const q = t - (12.55 + 1.75 * k);
    if (q < 0.35) return hh(790, SURF, {hip: [0, -104], lean: 20, lf: [20, 0], lb: [-20, 0], hf: [56, -170], hb: [30, -160], pack: false});
    if (q < 0.65) return hh(lerp(790, 735, P(q, 0.35, 0.65)), SURF, {...walkPose(t, 3.4, 8, 'log'), pack: false}, true);
    return hh(735, SURF, {hip: [0, -112], lean: 4, lf: [18, 0], lb: [-16, 0], hf: [58, -236 + 30 * Math.sin(P(q, 0.65, 1.1) * Math.PI)], hb: [10, -244], pack: false}, true);
  }
  if (t < 16.45) return hh(lerp(735, 800, E(t, 16.05, 16.45)), SURF, {...walkPose(t, 3.4, 8, 'box'), pack: false}, t < 16.2);
  if (t < 17.3) {
    const x = lerp(740, 410, E(t, 16.45, 17.3));
    return hh(x, groundAt(x, t), {...walkPose(t, 3.4, 8, 'box'), pack: false}, true);
  }
  if (t < 18.1) {
    const x = lerp(410, 735, E(t, 17.3, 18.1));
    return hh(x, groundAt(x, t), {...walkPose(t, 3.6), pack: false});
  }
  if (t < 19.65) {
    const ph = ((t - 18.1) / 0.8) % 1;
    return hh(735, SURF, {...digPose(ph), pack: false}, true);
  }
  if (t < 20.55) {
    const x = lerp(735, 400, E(t, 19.65, 20.55));
    return hh(x, groundAt(x, t), {...walkPose(t, 3.6), pack: false}, true);
  }
  if (t < 20.75) return hh(lerp(400, 335, E(t, 20.55, 20.75)), SURF, {...walkPose(t, 3.6, 8, 'box'), pack: false}, true);
  if (t < 21.75) return hh(335, lerp(SURF, FLOOR, E(t, 20.75, 21.75)), {...climbPose(t), pack: false}, true);
  if (t < 22.3) return hh(lerp(335, 480, E(t, 21.75, 22.3)), FLOOR, {...walkPose(t, 3.4, 8, 'box'), pack: false});
  if (t < 24.4) return hh(520, FLOOR, {...shivPose(t), pack: false});
  if (t < 24.7) return hh(lerp(520, 420, E(t, 24.4, 24.7)), FLOOR, {...walkPose(t, 3.4), pack: false}, true);
  if (t < 24.95) return hh(lerp(420, 335, E(t, 24.7, 24.95)), FLOOR, {...walkPose(t, 3.4), pack: false}, true);
  if (t < 25.55) return hh(335, lerp(FLOOR, SURF, E(t, 24.95, 25.55)), {...climbPose(t), pack: false}, true);
  if (t < 25.63) return hh(335, SURF, {hip: [0, -100], lean: 24, lf: [20, 0], lb: [-20, 0], hf: [56, -60], hb: [30, -50], pack: false}, true);
  if (t < 26.5) return hh(335, lerp(SURF, FLOOR, E(t, 25.63, 26.5)), {...climbPose(t), hf: [44, -170], hb: [14, -160], pack: false}, true);
  if (t < 27.35) return hh(lerp(340, 545, E(t, 26.6, 27.35)), FLOOR, {...walkPose(t, 3.4, 8, 'box'), pack: false});
  if (t < 29.0) {
    const c = P(t, 27.35, 27.6);
    return hh(545, FLOOR, {hip: [8, -84 - 10 * (1 - c)], lean: 38, lf: [30, 0], lb: [-24, 0], hf: [58, -30], hb: [34, -24], pack: false});
  }
  if (t < 32.37) return hh(535, FLOOR, {hip: [0, -116], lean: 8, lf: [20, 0], lb: [-16, 0], hf: [56, -140 + Math.sin(t * 5) * 4], hb: [40, -134], nod: 4, pack: false});
  if (t < 34.58) return hh(535, FLOOR, {hip: [0, -116], lean: 10, lf: [20, 0], lb: [-16, 0], hf: [48, -150], hb: [30, -144], nod: -6, pack: false});
  if (t < 39.17) {
    const c = Math.sin(t * 14) * 4;
    return hh(500, FLOOR, {hip: [0, -108], lean: 22 + c, lf: [20, 0], lb: [-16, 0], hf: [42, -248], hb: [20, -238], nod: 12, pack: false});
  }
  if (t < 40.6) {
    const a = P(t, 39.17, 39.7);
    const lift = P(t, 39.7, 40.5);
    return hh(lerp(500, 610, E(t, 39.17, 39.8)) - 0, FLOOR, {hip: [0, -114], lean: 6, lf: [18, 0], lb: [-16, 0], hf: [40, lerp(-100, -300, lift)], hb: [10, lerp(-100, -296, lift)], pack: false});
  }
  if (t < 43.4) {
    const up = P(t, 40.7, 43.2);
    return hh(560, FLOOR, {hip: [0, -114], lean: 4, lf: [18, 0], lb: [-16, 0], hf: [46, lerp(-190, -310, up)], hb: [28, lerp(-160, -290, up)], pack: false});
  }
  if (t < 48.33) return hh(540, FLOOR, {hip: [0, -116], lean: 5, lf: [18, 0], lb: [-16, 0], hf: [54, -144 + Math.sin(t * 4) * 3], hb: [36, -138], nod: 6, pack: false});
  if (t < 49.4) return hh(lerp(540, 438, E(t, 48.33, 49.4)), FLOOR, {...walkPose(t, 3.2), pack: false}, true);
  if (t < 50.8) return hh(438, FLOOR, {hip: [0, -116], lean: 6, lf: [18, 0], lb: [-16, 0], hf: [-34 - 8 * P(t, 49.5, 50.2), -112], hb: [-10, -118], pack: false}, true);
  if (t < 53.74) {
    const p = E(t, 50.8, 51.5);
    return hh(lerp(438, 520, p), FLOOR, {...shivPose(t), pack: false}, true);
  }
  if (t < 54.2) return hh(lerp(520, 345, E(t, 53.74, 54.2)), FLOOR, {...walkPose(t, 3.6), pack: false}, true);
  if (t < 56.6) {
    const e = E(t, 54.2, 56.5);
    const ph = ((t - 54.2) / 0.85) % 1;
    return hh(300, FLOOR + 100 * e, {...digPose(ph), pack: false});
  }
  if (t < 58.8) {
    const ph = ((t - 56.6) / 0.8) % 1;
    return hh(300, FLOOR + 100, {...digPose(ph), pack: false});
  }
  if (t < 59.5) return hh(300, FLOOR + 100, {hip: [0, -116], lean: 6, lf: [18, 0], lb: [-16, 0], hf: [40, -140], hb: [20, -140], nod: -4, pack: false});
  if (t < 60.2) {
    const p = E(t, 59.5, 60.2);
    return hh(lerp(300, 370, p), lerp(FLOOR + 100, FLOOR, E(t, 59.8, 60.2)), {...walkPose(t, 3.2), pack: false});
  }
  if (t < 61.7) return hh(lerp(370, 470, E(t, 60.2, 61.7)), FLOOR, {...walkPose(t, 3.2), pack: false});
  if (t < 63.0) return hh(480, FLOOR, {hip: [0, -112], lean: 12, lf: [20, 0], lb: [-14, 0], hf: [44, -120], hb: [24, -126], nod: 10, pack: false});
  if (t < 67.25) {
    const k = Math.sin(t * 2);
    return hh(500, FLOOR, {hip: [0, -112], lean: 14, lf: [20 + 4 * k, 0], lb: [-14, 0], hf: [46, -112], hb: [26, -120], nod: 20, pack: false});
  }
  if (t < 69.81) {
    const q = (t - 67.25) / 0.5;
    const j = Math.min(4, Math.floor(q));
    const xs = [655, 600, 540, 485, 430];
    const cur = xs[j] - 55;
    return hh(cur, FLOOR, {hip: [6, -84], lean: 38, lf: [30, 0], lb: [-24, 0], hf: [58, -24], hb: [34, -20], pack: false});
  }
  if (t < 72.37) {
    const p = E(t, 69.81, 72.0);
    return hh(lerp(470, 520, p), FLOOR, {hip: [6, -90], lean: 36, lf: [30, 0], lb: [-24, 0], hf: [60, -20], hb: [36, -16], pack: false});
  }
  if (t < 81.73) {
    const up = t > 76.4 && t < 77.6 ? -16 : 4;
    return hh(530, FLOOR, {hip: [0, -116], lean: 5, lf: [18, 0], lb: [-16, 0], hf: [54, -144], hb: [36, -138], nod: up, pack: false});
  }
  if (t < 82.6) return hh(lerp(530, 420, E(t, 81.73, 82.6)), FLOOR, {...walkPose(t, 3.2), pack: false}, true);
  if (t < 83.4) return hh(lerp(420, 335, E(t, 82.6, 83.4)), FLOOR, {...walkPose(t, 3.2), pack: false}, true);
  const sy = surfAt(335, t);
  if (t < 84.6) return hh(335, lerp(FLOOR, sy, E(t, 83.4, 84.6)), {...climbPose(t), pack: false}, true);
  if (t < 87.2) return hh(335, sy, {hip: [0, -116], lean: 4, lf: [18, 0], lb: [-16, 0], hf: [34, -128], hb: [-12, -126], nod: Math.sin(t * 1.5) * 8, pack: false}, false);
  if (t < 92.86) return hh(335, sy, {...standPoseS(t), pack: false});
  const x = lerp(380, 530, E(t, 92.6, 94.2));
  return hh(x, surfAt(x, t), {...walkPose(t, 3.0), pack: false});
};
const standPoseS = (t: number): Pose => ({hip: [0, -116], lean: 4, lf: [18, 0], lb: [-16, 0], hf: [34, -128], hb: [-12, -126], nod: 0});

// ---------------- camera ----------------
type CKS = [number, number, number, number];
const KEYS: CKS[] = [
  [0, 380, 930, 1.0], [2.0, 330, 960, 1.22], [2.9, 440, 1040, 1.4], [5.5, 520, 1130, 1.55],
  [5.6, 620, 1030, 1.4], [6.4, 820, 960, 1.45], [6.9, 740, 960, 1.4],
  [8.1, 540, 930, 1.15], [8.11, 540, 940, 1.0], [11.9, 560, 970, 1.15],
  [11.97, 760, 960, 1.35], [12.5, 770, 960, 1.4], [16.05, 640, 960, 1.35], [16.06, 780, 960, 1.5], [17.3, 560, 950, 1.35],
  [17.31, 700, 950, 1.45], [19.6, 640, 960, 1.55],
  [19.65, 540, 1130, 1.1], [20.5, 470, 1080, 1.35], [21.7, 330, 1200, 1.45], [21.71, 450, 1210, 1.5], [22.6, 520, 1220, 1.55], [24.4, 520, 1215, 1.7],
  [24.41, 420, 1180, 1.7], [25.5, 340, 1180, 1.5], [25.51, 340, 1160, 1.5], [26.5, 420, 1230, 1.55], [27.4, 570, 1240, 1.8], [29.0, 580, 1200, 1.55],
  [32.3, 600, 1170, 1.55], [35.0, 540, 1150, 1.5], [39.1, 560, 1170, 1.55], [42.0, 600, 1080, 1.5], [44.2, 600, 1050, 1.35],
  [44.28, 620, 800, 1.9], [45.7, 600, 860, 1.4], [46.25, 600, 900, 1.3], [46.26, 540, 1200, 1.5], [48.3, 500, 1215, 1.5],
  [48.33, 400, 1230, 2.3], [50.8, 420, 1240, 2.2], [50.81, 470, 1270, 1.9], [53.7, 500, 1270, 1.8],
  [53.74, 300, 1330, 2.2], [56.6, 300, 1400, 2.5], [59.5, 330, 1370, 2.1], [60.2, 400, 1290, 1.7], [62.9, 470, 1280, 1.7],
  [63.0, 500, 1320, 2.5], [67.2, 520, 1315, 2.3], [67.21, 540, 1300, 2.0], [69.8, 540, 1295, 2.0], [69.81, 520, 1290, 1.9], [72.3, 540, 1200, 1.5],
  [76.29, 540, 1200, 1.4], [78.0, 540, 1190, 1.35], [81.7, 520, 1200, 1.4], [82.7, 380, 1240, 1.6], [83.4, 330, 1200, 1.4], [84.6, 335, 900, 1.4],
  [84.61, 335, 860, 1.2], [87.0, 460, 820, 1.0], [87.2, 520, 780, 1.1], [88.3, 600, 800, 1.8],
  [88.37, 600, 830, 2.0], [90.3, 620, 840, 2.15], [92.8, 600, 840, 2.4], [92.9, 610, 830, 2.9], [95.3, 616, 826, 3.1],
];
const camAt = (t: number) => {
  let r = KEYS[KEYS.length - 1].slice(1) as number[];
  if (t < KEYS[0][0]) r = KEYS[0].slice(1) as number[];
  else for (let i = 0; i < KEYS.length - 1; i++) {
    if (t >= KEYS[i][0] && t < KEYS[i + 1][0]) {
      const d = KEYS[i + 1][0] - KEYS[i][0];
      const k = d < 0.05 ? 1 : ease((t - KEYS[i][0]) / d);
      r = [lerp(KEYS[i][1], KEYS[i + 1][1], k), lerp(KEYS[i][2], KEYS[i + 1][2], k), lerp(KEYS[i][3], KEYS[i + 1][3], k)];
      break;
    }
  }
  const shk = t >= 76.29 && t < 78.6 ? 7 * (1 - P(t, 76.29, 78.6)) : 0;
  const sx = shk * Math.sin(t * 53), sy = shk * Math.cos(t * 47);
  return {fx: r[0] + sx, fy: r[1] + sy, s: r[2]};
};

// ---------------- world ----------------
const Cloth: React.FC<{t: number}> = ({t}) => {
  if (t < 6.9) return null;
  const col = '#d36a2a', col2 = '#a84f1c';
  const cs = E(t, 6.9, 8.0);
  const sag = 150 * E(t, 8.57, 11.5);
  const pulled = E(t, 11.97, 12.55);
  if (t >= 12.55 && t < 16.4) {
    return <g><rect x={845} y={SURF - 26} width={60} height={26} rx={10} fill={col} stroke={col2} strokeWidth={3} /><path d="M850 -10 q20 -10 50 0" transform={`translate(0 ${SURF - 12})`} stroke={col2} strokeWidth={3} fill="none" /></g>;
  }
  if (t >= 16.4) {
    const xl = lerp(740, 388, E(t, 16.45, 17.3));
    if (t < 16.45) return null;
    return <rect x={xl} y={roofY - 7} width={700 - xl} height={9} fill={col} stroke={col2} strokeWidth={2} />;
  }
  const L = lerp(PX0 - 2, 850, pulled), R = lerp(PX0 - 2 + 304 * cs, 880, pulled);
  const w = R - L;
  const pts: string[] = [];
  for (let i = 0; i <= 24; i++) {
    const u = i / 24;
    const x = L + w * u;
    const y = SURF - 3 + sag * Math.sin(Math.PI * u) * (1 - pulled);
    pts.push(`${x},${y}`);
  }
  const hp = 70 * E(t, 8.57, 11.9) * (1 - pulled);
  return (
    <g>
      <polyline points={pts.join(' ')} fill="none" stroke={col2} strokeWidth={10} strokeLinejoin="round" />
      <polyline points={pts.join(' ')} fill="none" stroke={col} strokeWidth={6} strokeLinejoin="round" />
      {hp > 1 && (
        <path d={`M${L} ${SURF - 4 + 0} ${pts.map((p, i) => { const [x, y] = p.split(',').map(Number); const u = i / 24; return `L${x} ${y - hp * Math.sin(Math.PI * u) - 6}`; }).join(' ')} L${R} ${SURF - 4} Z`} fill="#f7fbff" stroke="#cfe0f2" strokeWidth={3} />
      )}
    </g>
  );
};

const World: React.FC<{t: number; h: H; cx: number}> = ({t, h, cx}) => {
  const e = E(t, 3.0, 5.6);
  const w = 100 + 200 * e;
  const pitL = 540 - w / 2, pitR = 540 + w / 2;
  const depth = 340 * e;
  const roofOn = t >= 16.0;
  const shaftOn = t >= 19.65;
  const sump = 100 * E(t, 54.2, 56.5);
  const stepH = 100 * E(t, 56.7, 58.7);
  const dr = drift(t);
  const SY = SURF - dr;
  const warm = E(t, 27.8, 29.8);
  const roofDark = E(t, 19.65, 21.7);
  const open0 = '#7f99bd';
  let ic = mixc(open0, '#31476c', roofDark);
  ic = mixc(ic, '#7a5238', warm * 0.85);
  const doorOpen = (() => {
    const w1 = (a: number, b: number, c: number, d: number) => E(t, a, b) * (1 - E(t, c, d));
    return Math.max(w1(21.7, 22.0, 22.3, 22.55), w1(24.6, 24.9, 26.4, 26.7), w1(26.5, 26.8, 27.3, 27.6) * 0, w1(49.6, 50.4, 52.6, 53.2), w1(53.7, 54.0, 60.0, 60.4) * 0.0, w1(53.5, 53.9, 54.3, 54.6), w1(60.0, 60.3, 61.4, 61.8), w1(81.9, 82.4, 83.0, 83.6));
  })();
  // chimney
  const cp = E(t, 40.7, 43.2);
  const pipeTop = lerp(1252, 838, cp);
  const plate = t >= 40.6;
  const fog = E(t, 32.4, 38) * 0.7 * (1 - E(t, 43.4, 45.8));
  const wet = E(t, 63, 66);
  const boardsP = (j: number) => E(t, 67.25 + 0.5 * j, 67.25 + 0.5 * j + 0.38);
  const boardsAll = E(t, 67.25, 69.8);
  const rugP = E(t, 69.9, 71.8);
  const stoveVis = t >= 27.5;
  const stoveDrop = E(t, 27.35, 27.6);
  const snowOnRoof = E(t, 18.1, 19.65);
  const showHero = h.vis && !(t >= 6.9 && t < 8.1) && !(t >= 87.6 && t < 92.6);
  const ext = t >= 84.6;
  // trip logs
  const logK = (k: number) => {
    const trip = k < 2 ? 0 : 1;
    const q = t - (12.55 + 1.75 * trip);
    const place0 = k % 2 === 0 ? 1.05 : 1.4;
    return {q, place0, p: clamp((q - place0) / 0.3)};
  };
  const pileTop = [0, 1, 2, 3];
  const hasPick = (k: number) => {
    const trip = k < 2 ? 0 : 1;
    return t >= 12.55 + 1.75 * trip + 0.35;
  };
  return (
    <g>
      <Mountains cx={cx} />
      {/* snow slope behind */}
      <path d={`M-1200 ${SY - 10} Q-300 ${SY - 50 - dr * 0.3} 300 ${SY - 20} T1700 ${SY - 14} L1700 2600 L-1200 2600 Z`} fill="#f6faff" />
      {/* surface rocks / trees */}
      <Pine x={-420} y={SY + 4} s={0.9} />
      <Pine x={-300} y={SY + 8} s={0.7} />
      <Pine x={1180} y={SY + 6} s={0.8} />
      <Pine x={1320} y={SY + 4} s={1.0} />
      {/* ski tracks */}
      {t > 0.4 && (
        <g stroke="#cfe0f2" strokeWidth={4} strokeLinecap="round" opacity={0.9}>
          <line x1={-400} y1={SY + 5} x2={Math.min(250, h.x * 1 + (t < 2 ? -100 : 0))} y2={SY + 5} />
          <line x1={-400} y1={SY + 12} x2={Math.min(250, h.x * 1 + (t < 2 ? -100 : 0))} y2={SY + 12} />
        </g>
      )}
      {/* cutaway snow body */}
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
      {/* shaft (entrance) */}
      {shaftOn && (
        <g>
          <rect x={SX0} y={SY} width={SX1 - SX0} height={FLOOR + sump - SY} fill={mixc('#8fa8c8', '#2a3c5c', roofDark * 0.4)} />
          {sump > 0 && <rect x={SX0} y={FLOOR} width={SX1 - SX0} height={sump} fill="#2b3f66" opacity={0.0} />}
          {stepH > 0 && <rect x={SX0 + 60} y={FLOOR + 100 - stepH} width={SX1 - SX0 - 60} height={stepH} fill="#e4effb" stroke="#b4cce6" strokeWidth={3} />}
          {sump > 20 && t > 56 && <rect x={SX0} y={FLOOR + 40} width={SX1 - SX0 - 60 + 60 * (1 - stepH / 100)} height={FLOOR + sump - FLOOR - 40} fill="#69b8ff" opacity={0.28 * E(t, 56.5, 58.5)} />}
          {/* ladder */}
          {[0, 1].map((i) => <line key={i} x1={SX0 + 22 + i * 70} y1={SY + 10} x2={SX0 + 22 + i * 70} y2={FLOOR} stroke="#8a6a3a" strokeWidth={5} opacity={0.0} />)}
        </g>
      )}
      {/* pit */}
      <rect x={pitL} y={SURF} width={pitR - pitL} height={depth} fill={ic} />
      {depth > 2 && <rect x={pitL} y={SURF} width={6} height={depth} fill="#000" opacity={0.18} />}
      {depth > 2 && <rect x={pitR - 6} y={SURF} width={6} height={depth} fill="#000" opacity={0.18} />}
      {/* wall + door */}
      {shaftOn && (
        <g>
          <rect x={SX1 - 6} y={SY} width={12} height={90 + (SURF - SY)} fill="#e4effb" stroke="#b4cce6" strokeWidth={2} />
          <rect x={SX1 - 6} y={1090} width={12} height={FLOOR - 1090} fill="#e4effb" opacity={0.0} />
          <g transform={`translate(${SX1} 1090) rotate(${-86 * doorOpen})`}>
            <rect x={-6} y={0} width={12} height={FLOOR - 1090} rx={3} fill="#8a5a30" stroke="#4a2f16" strokeWidth={3} />
            <rect x={-6} y={0} width={5} height={FLOOR - 1090} fill="#a8733f" opacity={0.7} />
            <circle cx={5} cy={150} r={5} fill="#d9d9d9" />
          </g>
        </g>
      )}
      {/* interior glow + stove */}
      {depth > 300 && (
        <g>
          {/* floor */}
          <rect x={pitL} y={FLOOR - 6} width={pitR - pitL} height={10} fill={mixc('#dbe8f6', '#8ea6c4', wet * 0.6)} />
          {wet > 0 && (
            <g>
              <ellipse cx={500} cy={FLOOR - 3} rx={20 + 120 * wet} ry={5 + 4 * wet} fill="#5aa6e8" opacity={0.65 * (1 - boardsAll * 0.9)} />
              {t > 63 && t < 67.3 && Array.from({length: 4}).map((_, i) => {
                const tt = (t * 1.3 + i * 0.37) % 1;
                return <circle key={i} cx={440 + i * 50} cy={1020 + tt * 310} r={4} fill="#8ac4ff" opacity={tt < 0.95 ? 0.9 : 0} />;
              })}
            </g>
          )}
          {/* boards */}
          {Array.from({length: 5}).map((_, j) => {
            const p = boardsP(j);
            const x = [655, 600, 540, 485, 430][j];
            const sx = 676 + (j % 5) * 3, sy = FLOOR - 4;
            if (t < 22.5) return null;
            if (p <= 0) return <rect key={j} x={sx - 4 - j * 5} y={FLOOR - 150} width={8} height={146} fill="#c99a5a" stroke="#6a4a22" strokeWidth={2} />;
            const px = lerp(sx - j * 5, x, ease(p));
            const py = lerp(FLOOR - 80, FLOOR - 10, ease(p)) - Math.sin(Math.PI * p) * 60;
            const rot = lerp(90, 0, ease(p));
            return <g key={j} transform={`translate(${px} ${py}) rotate(${rot})`}><rect x={-30} y={-5} width={58} height={10} rx={2} fill="#c99a5a" stroke="#6a4a22" strokeWidth={2} /></g>;
          })}
          {/* rug */}
          {t >= 22.5 && (() => {
            const rx = lerp(560, 432, rugP);
            const roll = t < 69.9 || rugP >= 1 ? null : true;
            return (
              <g>
                {t < 69.9 && <g><rect x={420} y={FLOOR - 26} width={40} height={24} rx={12} fill="#b8362a" stroke="#6a1a14" strokeWidth={3} /><circle cx={426} cy={FLOOR - 14} r={9} fill="#e4574a" /></g>}
                {t >= 69.9 && <rect x={rx} y={FLOOR - 16} width={560 - rx + 2} height={8} fill="#c8412e" stroke="#6a1a14" strokeWidth={2} />}
                {t >= 69.9 && rugP < 1 && <circle cx={rx} cy={FLOOR - 16} r={10} fill="#e4574a" stroke="#6a1a14" strokeWidth={2} />}
                {t >= 69.9 && rugP >= 0.2 && Array.from({length: 4}).map((_, i) => <rect key={i} x={rx + 12 + i * 32} y={FLOOR - 15} width={10} height={6} fill="#ffd23f" opacity={0.8} />)}
              </g>
            );
          })()}
          {/* pipe and plate leaning (before install) */}
          {t >= 27.35 && t < 40.5 && <line x1={436} y1={FLOOR - 4} x2={450} y2={FLOOR - 210} stroke="#8d94a3" strokeWidth={13} strokeLinecap="round" />}
          {t >= 27.35 && t < 40.0 && <rect x={462} y={FLOOR - 70} width={46} height={66} rx={4} fill="#6a7180" stroke="#2a2d34" strokeWidth={3} />}
          {stoveVis && <g transform={`translate(0 ${-(1 - stoveDrop) * 90 * 0})`}><g transform={`translate(${STOVE_X} ${FLOOR - 4 - (1 - stoveDrop) * 40}) scale(0.82) translate(${-STOVE_X} ${-(FLOOR - 4)})`}><StoveArt x={STOVE_X} y={FLOOR - 4} glow={warm} t={t} /></g></g>}
          {/* warm glow */}
          {warm > 0 && (
            <g>
              <defs>
                <radialGradient id="wg" cx="0.5" cy="0.5" r="0.5">
                  <stop offset="0" stopColor="#ffb040" stopOpacity={0.55 * warm} />
                  <stop offset="1" stopColor="#ff8a2a" stopOpacity={0} />
                </radialGradient>
              </defs>
              <circle cx={STOVE_X} cy={FLOOR - 50} r={260} fill="url(#wg)" />
            </g>
          )}
          {/* water puddle shine etc */}
        </g>
      )}
      {/* chimney */}
      {t >= 40.0 && (
        <g>
          {plate && <rect x={STOVE_X - 28} y={roofY - 4} width={56} height={66} rx={5} fill="#6a7180" stroke="#2a2d34" strokeWidth={3} />}
          {cp > 0 && <rect x={STOVE_X - 8} y={pipeTop} width={16} height={1252 - pipeTop} fill="#8d94a3" stroke="#3a3f4a" strokeWidth={3} />}
          {cp > 0 && <rect x={STOVE_X - 12} y={pipeTop - 8} width={24} height={12} rx={3} fill="#555c6a" />}
        </g>
      )}
      {/* logs + roof */}
      {t >= 13.5 && [3, 2, 1, 0].map((k) => {
        const {p} = logK(k);
        if (t < 12.55) return null;
        const fin: V = [540, roofY + 15 - k * 9 + 0];
        const done = p >= 1 || t >= 16.05;
        if (done) return <Log key={k} x={fin[0]} y={fin[1]} w={316} r={15} />;
        if (p <= 0) return null;
        const hp = rel([30, -246], h);
        return <Log key={k} x={lerp(hp[0], fin[0], ease(p))} y={lerp(hp[1], fin[1], ease(p))} w={316} r={15} />;
      })}
      {/* log pile */}
      {t < 16.05 && pileTop.map((k) => {
        const gone = (k >= 2 && t >= 12.55 + 0.35 + 0.0) || (k < 2 && t >= 14.3 + 0.35);
        const taken = k < 2 ? t >= 14.3 + 0.35 : t >= 12.55 + 0.35;
        if (taken) return null;
        return <Log key={k} x={965} y={SURF - 15 - k * 29} w={300} r={14} />;
      })}
      {/* carried logs in hands (before placing) */}
      {t >= 12.55 && t < 16.05 && (() => {
        const trip = t < 14.3 ? 0 : 1;
        const q = t - (12.55 + 1.75 * trip);
        if (q < 0.35) return null;
        const hp = rel([30, -246], h);
        const l1 = logK(trip * 2), l2 = logK(trip * 2 + 1);
        return (
          <g>
            {l1.p <= 0 && <Log x={hp[0]} y={hp[1]} w={316} r={15} />}
            {l2.p <= 0 && <Log x={hp[0]} y={hp[1] - 30} w={316} r={15} />}
          </g>
        );
      })()}
      <Cloth t={t} />
      {/* cloth carried / bundle */}
      {t >= 6.7 && t < 7.1 && <rect x={h.x - 40} y={h.y - 170} width={72} height={36} rx={12} fill="#d36a2a" stroke="#a84f1c" strokeWidth={3} />}
      {t >= 16.05 && t < 16.45 && <rect x={rel([40, -150], h)[0] - 36} y={h.y - 170} width={72} height={36} rx={12} fill="#d36a2a" stroke="#a84f1c" strokeWidth={3} />}
      {/* roof snow */}
      {t >= 18.1 && (() => {
        const xl = lerp(700, 388, snowOnRoof);
        const th = 34;
        return <path d={`M${xl} ${roofY - 4} Q${(xl + 700) / 2} ${roofY - 4 - th * 1.2} 704 ${roofY - 4} Z`} fill="#f7fbff" stroke="#cfe0f2" strokeWidth={3} />;
      })()}
      {/* mound */}
      {(() => {
        const mh = 70 * e;
        return <path d={`M${pitR - 10} ${SURF + 2} Q${pitR + 40} ${SURF - mh * 1.3} ${pitR + 110} ${SURF + 2} Z`} fill="#f7fbff" stroke="#cfe0f2" strokeWidth={3} />;
      })()}
      {/* rock, skis, pack, shovel, supplies */}
      <g transform={`translate(0 ${SY - SURF})`}>
        <path d="M70 1000 Q80 900 140 880 Q200 870 230 940 L240 1000 Z" fill="#6b7586" stroke="#3a4250" strokeWidth={4} />
        <path d="M110 920 Q150 890 190 905 Q160 915 120 940 Z" fill="#9aa5b8" />
      </g>
      {t >= 2.0 && t < 2.5 && null}
      {(() => {
        const sp = t < 2.0 ? null : E(t, 2.0, 2.55);
        if (sp === null) return null;
        const sx = lerp(h.x, 205, sp), sy = lerp(SURF, SY, sp);
        const rot = lerp(86, 12, sp);
        const buried = dr > 0;
        return (
          <g transform={`translate(0 ${SY - SURF})`}>
            {[0, 1].map((i) => (
              <g key={i} transform={`translate(${lerp(h.x + i * 24, 196 + i * 14, sp)} ${SURF}) rotate(${lerp(-86, -80 + i * 3, sp)})`}>
                <rect x={-4} y={-4} width={230} height={8} rx={4} fill={i ? '#14161b' : '#0c0d10'} stroke="#3a3f4a" strokeWidth={1.5} />
              </g>
            ))}
            {[0, 1].map((i) => <line key={i} x1={226 + i * 10} y1={SURF - 8} x2={246 + i * 10} y2={SURF - 190} stroke="#3a3f4a" strokeWidth={4} opacity={sp} />)}
            {sp > 0.5 && <g><rect x={246} y={SURF - 50} width={34} height={50} rx={12} fill="#2a303b" stroke="#12151b" strokeWidth={3} /><rect x={252} y={SURF - 34} width={22} height={6} rx={3} fill="#444c5c" /></g>}
          </g>
        );
      })()}
      {/* planted shovel */}
      {t < 2.95 && <g transform={`translate(400 ${SURF}) rotate(-12)`}><line x1={0} y1={0} x2={0} y2={-150} stroke="#8a6a3a" strokeWidth={7} strokeLinecap="round" /><path d="M-14 -4 L14 -4 L10 24 L-10 24 Z" fill="#b8c0cc" stroke="#6b7482" strokeWidth={3} /></g>}
      {t >= 5.6 && t < 18.1 && <g transform={`translate(775 ${SURF}) rotate(8)`}><line x1={0} y1={0} x2={0} y2={-150} stroke="#8a6a3a" strokeWidth={7} strokeLinecap="round" /><path d="M-14 -4 L14 -4 L10 24 L-10 24 Z" fill="#b8c0cc" stroke="#6b7482" strokeWidth={3} /></g>}
      {/* supplies cluster on surface (stove, pipe, plate, boards, rug) */}
      {t < 25.4 && t >= 0 && (
        <g transform={`translate(0 ${SY - SURF})`}>
          {t < 20.55 && <g><rect x={300} y={SURF - 46} width={80} height={46} rx={6} fill="#c8412e" stroke="#6a1a14" strokeWidth={3} /><rect x={312} y={SURF - 40} width={56} height={34} fill="#5a1a14" opacity={0.0} /></g>}
          {t < 20.55 && <g><rect x={296} y={SURF - 62} width={90} height={14} rx={6} fill="#c99a5a" stroke="#6a4a22" strokeWidth={2} /><rect x={300} y={SURF - 76} width={80} height={14} rx={6} fill="#b88848" stroke="#6a4a22" strokeWidth={2} /></g>}
          {t < 25.4 && <g><rect x={340} y={SURF - 74} width={46} height={74} rx={5} fill="#3a3f4a" stroke="#14161b" strokeWidth={3} transform="translate(60 0)" /><line x1={470} y1={SURF - 4} x2={470} y2={SURF - 150} stroke="#8d94a3" strokeWidth={12} strokeLinecap="round" /></g>}
        </g>
      )}
      {/* smoke inside */}
      {t >= 32.37 && t < 46 && Array.from({length: 46}).map((_, i) => {
        const b = 32.37 + i * 0.22;
        const tau = t - b;
        if (tau < 0 || tau > 5) return null;
        const piped = t > 43.2;
        const x0 = STOVE_X + (rnd(i) - 0.5) * 20;
        const x = piped ? STOVE_X + (rnd(i) - 0.5) * 12 : x0 + (rnd(i + 3) - 0.5) * (60 + tau * 200);
        const y = piped ? Math.max(pipeTop - 20, 1250 - tau * 380) : Math.max(1018 + (i % 5) * 16, 1245 - tau * 150);
        return <circle key={i} cx={x} cy={y} r={14 + tau * 10} fill="#8a8f9a" opacity={0.5 * (1 - tau / 5)} />;
      })}
      {fog > 0.01 && depth > 300 && <rect x={PX0} y={1005} width={PX1 - PX0} height={FLOOR - 1005} fill="#6a6f7a" opacity={fog * 0.55} />}
      {fog > 0.01 && depth > 300 && <rect x={PX0} y={1005} width={PX1 - PX0} height={150} fill="#4c505a" opacity={fog * 0.5} />}
      {/* smoke outside from pipe */}
      {t >= 43.4 && Array.from({length: 24}).map((_, i) => {
        const tau = ((t - 43.4) * 0.7 + i * 0.18) % 4.3;
        const x = STOVE_X + (rnd(i) - 0.3) * 40 + tau * 28;
        const y = pipeTop - 10 - tau * 85;
        const s0 = 10 + tau * 12;
        return <circle key={i} cx={x} cy={y} r={s0} fill="#e9eef5" opacity={Math.max(0, 0.6 * (1 - tau / 4.3))} />;
      })}
      {/* cold air streams */}
      {t >= 50.4 && t < 53.9 && Array.from({length: 40}).map((_, i) => {
        const f = clamp((t - 50.4) / 0.5) * (1 - clamp((t - 53.0) / 0.9));
        const tt = ((t - 50.4) * 0.9 + rnd(i) * 1.5) % 1;
        const x = 395 + tt * 260;
        const y = FLOOR - 30 - rnd(i + 2) * 200 + Math.sin(tt * 7 + i) * 18;
        return <g key={i} opacity={f * (1 - tt * 0.5)}><line x1={x} y1={y} x2={x - 40} y2={y + 4} stroke="#5ab4ff" strokeWidth={5} strokeLinecap="round" opacity={0.7} /><circle cx={x - 40} cy={y} r={4} fill="#fff" /></g>;
      })}
      {t >= 50.4 && t < 54 && <rect x={PX0} y={1005} width={PX1 - PX0} height={FLOOR - 1005} fill="#69b8ff" opacity={0.16 * clamp((t - 50.4) / 1.2) * (1 - clamp((t - 53) / 0.9))} />}
      {t >= 76.29 && t < 79 && Array.from({length: 18}).map((_, i) => <circle key={i} cx={420 + rnd(i) * 240} cy={1010 + ((t * 80 + rnd(i + 3) * 300) % 320)} r={3} fill="#f7fbff" opacity={0.7} />)}
      {ext && (
        <g>
          <path d={`M-1200 ${surfAt(-1200, t)} ${Array.from({length: 60}).map((_, i) => { const x = -1200 + i * 50; return `L${x} ${surfAt(x, t)}`; }).join(' ')} L1800 2600 L-1200 2600 Z`} fill="#f4f9ff" />
          <path d={`M-1200 ${surfAt(-1200, t)} ${Array.from({length: 60}).map((_, i) => { const x = -1200 + i * 50; return `L${x} ${surfAt(x, t)}`; }).join(' ')}`} fill="none" stroke="#cfe0f2" strokeWidth={6} />
          {[40, 100, 170].map((d, i) => <path key={i} d={`M-1200 ${SY + d + 40} Q-400 ${SY + d + 50} 200 ${SY + d + 34} T1500 ${SY + d + 44}`} stroke="#d9e8f8" strokeWidth={3} fill="none" opacity={0.7} />)}
          <ellipse cx={335} cy={SY + 4} rx={46} ry={9} fill="#2a3c5c" />
          <rect x={STOVE_X - 8} y={pipeTop - 6} width={16} height={SY - pipeTop + 8} fill="#8d94a3" stroke="#3a3f4a" strokeWidth={3} />
          <rect x={STOVE_X - 12} y={pipeTop - 12} width={24} height={12} rx={3} fill="#555c6a" />
          {t >= 90.34 && (() => {
            const sx = lerp(980, 665, E(t, 90.34, 91.4));
            const sit = t >= 91.4;
            return <g transform={`translate(${2 * sx} 0) scale(-1 1)`}><Squirrel x={sx} y={surfAt(sx, t) + 2} t={t} s={0.9} squeak={t > 93.7 && t < 94.4 ? 1 : 0} /></g>;
          })()}
        </g>
      )}
      {/* hero */}
      {showHero && <Skier x={h.x} y={h.y} flip={h.flip} pose={h.pose} />}
      {t >= 66.6 && t < 67.3 && null}
      {/* dig snow particles */}
      {Array.from({length: 3}).map((_, c) => null)}
      {(() => {
        const out: React.ReactNode[] = [];
        const add = (t0: number, n: number, ph0: number, cyc: number, dirx: number, tx0: number, base: number) => {
          for (let c = 0; c < n; c++) {
            const rel0 = t0 + c * cyc + ph0 * cyc;
            const tau = t - rel0;
            if (tau < 0 || tau > 0.9) continue;
            const ph = (c * cyc) / cyc;
            for (let i = 0; i < 9; i++) {
              const vx = dirx * (200 + rnd(i + c * 11) * 190), vy = -380 - rnd(i + 3 + c) * 260;
              const x = tx0 + vx * tau, y = base + vy * tau + 560 * tau * tau;
              out.push(<circle key={`${t0}${c}${i}`} cx={x} cy={y} r={7 - tau * 4 + rnd(i) * 4} fill="#f7fbff" stroke="#cfe0f2" strokeWidth={1.5} opacity={1 - tau} />);
            }
          }
        };
        if (t >= 3.0 && t < 5.7) {
          const e2 = E(Math.min(t, 5.6), 3.0, 5.6);
          const hx = 540 + (100 + 200 * e2) / 2 - 105;
          add(3.0, 3, 0.78, 0.95, 1, hx + DIG_TIP[0], SURF + 340 * e2 + DIG_TIP[1]);
        }
        if (t >= 18.1 && t < 19.8) add(18.1, 3, 0.78, 0.8, -1, 735 - DIG_TIP[0], SURF + DIG_TIP[1]);
        if (t >= 54.2 && t < 56.7) add(54.2, 4, 0.78, 0.85, 1, 300 + DIG_TIP[0], FLOOR + 100 * E(t, 54.2, 56.5) + DIG_TIP[1]);
        if (t >= 56.6 && t < 58.8) add(56.6, 3, 0.78, 0.8, 1, 300 + DIG_TIP[0], FLOOR + 100 + DIG_TIP[1]);
        return out;
      })()}
      {/* blizzard / falling snow */}
      <g opacity={1}>
        {t < 22 && <SnowParticles t={t} n={t >= 8.57 && t < 11.97 ? 140 : 40} speed={t >= 8.57 && t < 11.97 ? 380 : 80} wind={t >= 8.57 && t < 11.97 ? 380 : 40} op={0.85} w={1700} h={2200} />}
        {t >= 84.6 && <SnowParticles t={t} n={40} speed={70} wind={20} op={0.8} w={1700} h={2200} />}
      </g>
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
        <rect x={270} y={640} width={540} height={560} rx={24} fill="#2a3c5c" stroke="#9bb8dc" strokeWidth={10} />
        <rect x={270} y={640} width={540} height={560} rx={24} fill="#5c7aa8" opacity={0.35} />
        <rect x={270} y={640} width={540} height={edgeY - 640} fill="#d36a2a" stroke="#a84f1c" strokeWidth={6} />
        {[0, 1, 2, 3, 4, 5].map((i) => <line key={i} x1={270} y1={700 + i * 80} x2={810} y2={700 + i * 80} stroke="#a84f1c" strokeWidth={3} opacity={0.5} />)}
        <g transform={`translate(${540 + Math.sin(t * 6) * 6} ${edgeY + 40})`}>
          <ellipse cx={0} cy={0} rx={110} ry={50} fill="#1b1e25" />
          <circle cx={0} cy={-6} r={44} fill="#15181e" />
          <ellipse cx={0} cy={-16} rx={22} ry={14} fill="#0a0c10" stroke="#3a4050" strokeWidth={3} />
          <path d="M-90 -10 Q-120 -60 -80 -90" stroke="#1b1e25" strokeWidth={26} fill="none" strokeLinecap="round" />
          <path d="M90 -10 Q120 -60 80 -90" stroke="#1b1e25" strokeWidth={26} fill="none" strokeLinecap="round" />
          <circle cx={-80} cy={-94} r={14} fill="#08090b" />
          <circle cx={80} cy={-94} r={14} fill="#08090b" />
        </g>
        <SnowParticles t={t} n={30} speed={60} op={0.7} />
      </svg>
    </AbsoluteFill>
  );
};

// ---------------- composition ----------------
const insideVal = (t: number) => (t < 27.8 ? -38 + Math.sin(t) * 0.4 : lerp(-38, 15, E(t, 28.2, 31.6)));
const hudMode = (t: number): 'out' | 'in' | 'both' => {
  if (t < 22.0 || (t >= 44.28 && t < 46.26) || (t >= 73.15 && t < 76.29) || t >= 84.6) return 'out';
  if (t >= 76.29 && t < 81.73) return 'both';
  return 'in';
};

export const Shelter: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPSS;
  const h = heroAt(t);
  const cam = camAt(t);
  const showAv = t >= 73.15 && t < 76.29;
  const whiteout = t >= 75.5 && t < 76.29 ? clamp((t - 75.5) / 0.6) : t >= 76.29 && t < 76.6 ? 1 - clamp((t - 76.29) / 0.3) : 0;
  const gust = t >= 11.9 && t < 12.1 ? 0.8 * (1 - Math.abs(t - 12.0) / 0.1) : 0;
  const fadeEnd = clamp((t - 94.5) / 0.8);
  const fadeStart = 1 - clamp(t / 0.4);
  const S = (a: number, d: number, src: string, v: number | ((f: number) => number)) => (
    <Sequence key={`${src}${a}`} from={Math.round(a * FPSS)} durationInFrames={Math.round(d * FPSS)}>
      <Audio src={staticFile(`sfx/${src}.mp3`)} volume={v} />
    </Sequence>
  );
  const digT: number[] = [];
  for (let c = 0; c < 3; c++) digT.push(3.0 + c * 0.95 + 0.25);
  const wind = ramp([[0, 0.05], [8.5, 0.05], [8.7, 0.13], [11.8, 0.13], [12.4, 0.05], [22, 0.05], [22.5, 0.02], [50.4, 0.02], [50.6, 0.09], [53.3, 0.09], [53.7, 0.02], [76.3, 0.02], [81.7, 0.02], [82, 0.05], [95, 0.04]]);
  const fire = ramp([[27.8, 0], [29, 0.07], [72, 0.06], [73.3, 0.02], [76.3, 0.05], [81.7, 0.05], [82.5, 0.02], [84.6, 0]]);
  const music = ramp([[0, 0], [3, 0.05], [90, 0.05], [95, 0]]);
  const logTimes = [13.6, 13.95, 15.35, 15.7];
  const boardTimes = [67.25, 67.75, 68.25, 68.75, 69.25];
  return (
    <AbsoluteFill style={{backgroundColor: '#cfe0f2'}}>
      <Audio src={staticFile('voice9.mp3')} volume={1} />
      <Audio src={staticFile('sfx/mtn.mp3')} volume={music} />
      <Audio src={staticFile('sfx/wind.mp3')} volume={wind} loop />
      <Audio src={staticFile('sfx/fire.mp3')} volume={fire} loop />
      {S(1.0, 1.6, 'whoosh', 0.07)}
      {S(2.6, 0.5, 'crunch', 0.1)}
      {digT.map((d) => S(d, 0.6, 'crunch', 0.09))}
      {[3.0, 3.95, 4.9].map((d) => S(d + 0.15, 0.7, 'drag', 0.07))}
      {S(6.9, 1.2, 'drag', 0.08)}
      {S(12.0, 0.8, 'drag', 0.08)}
      {logTimes.map((d) => S(d, 0.6, 'thud', 0.12))}
      {S(17.9, 0.8, 'drag', 0.07)}
      {[18.5, 19.2].map((d) => S(d, 0.6, 'crunch', 0.08))}
      {[21.8, 24.7, 26.5, 49.7, 61.4, 82.0].map((d) => S(d, 1.0, 'creak', 0.09))}
      {S(27.45, 0.8, 'clank', 0.12)}
      {S(40.4, 0.7, 'clank', 0.1)}
      {S(42.0, 0.8, 'clank', 0.1)}
      {boardTimes.map((d) => S(d, 0.5, 'thud', 0.08))}
      {S(70.4, 1.0, 'drag', 0.07)}
      {[63.3, 64.2, 65.1, 65.9, 66.6].map((d) => S(d, 0.4, 'drip', 0.08))}
      {S(73.15, 4.2, 'rumble', ramp([[0, 0], [0.8, 0.09], [2.8, 0.13], [3.2, 0.11], [4.2, 0]]))}
      {S(73.4, 1.0, 'crack', 0.08)}
      {S(76.3, 3, 'rumble', ramp([[0, 0.1], [1.5, 0.06], [3, 0]]))}
      {S(93.75, 0.6, 'squeak', 0.14)}
      {S(94.35, 0.6, 'squeak', 0.1)}
      {[53.9, 56.7].map((d) => S(d, 0.6, 'crunch', 0.08))}

      {!showAv && !(t >= 6.9 && t < 8.1) && (
        <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{position: 'absolute', left: 0, top: 0}}>
          <SkierDefs />
          <g transform={`translate(540 960) scale(${cam.s}) translate(${-cam.fx} ${-cam.fy})`}>
            <World t={t} h={h} cx={cam.fx} />
          </g>
        </svg>
      )}
      {t >= 6.9 && t < 8.1 && <TopView t={t} />}
      {showAv && (
        <AbsoluteFill>
          <svg width={1080} height={1920} viewBox="0 0 1080 1920">
            <g transform={`translate(${Math.sin(t * 61) * 9} ${Math.cos(t * 53) * 9})`}>
              <Avalanche t={t} a={73.15} b={76.29} />
            </g>
          </svg>
        </AbsoluteFill>
      )}
      <AbsoluteFill><svg width={1080} height={1920} viewBox="0 0 1080 1920"><TempHUD t={t} mode={hudMode(t)} inside={insideVal(t)} fade={showAv ? 1 : 1} /></svg></AbsoluteFill>
      <AutoSub t={t} subs={subsS as any} />
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 62%, rgba(10,20,45,0.22) 100%)'}} />
      <AbsoluteFill style={{backgroundColor: '#fff', opacity: Math.max(whiteout, gust)}} />
      <AbsoluteFill style={{backgroundColor: '#0b1226', opacity: Math.max(fadeEnd, fadeStart)}} />
    </AbsoluteFill>
  );
};
