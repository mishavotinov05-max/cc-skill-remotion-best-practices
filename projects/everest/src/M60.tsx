import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {AutoSub} from './AutoSub';
import subsM from './subs_m60.json';
import {ramp} from './Everest';
import {clamp, ease, lerp, rnd, mixc, Tx, Glow, Snow, E, P, TempHud, Person, ILYA_OUT, ILYA_IN, DED_IN, DED_OUT, MAX_OUT, poseStand, poseWalk, poseSit, poseCarry, poseShiver, poseReach, Pose, Look} from './M60Base';
import {Skyline, TrafficLight, CityTop, Jam, Supermarket, GasStation, StreetDE, Airport, DotMap, EuropeMap} from './M60City';
import {Radio, TvSet, TvMode, Phone, PhoneMode, OutThermo, HomeThermo, ClockArt} from './M60Items';
import {Village, OldHouse, CharSpec, ILYA_HOME_X, SHED_X, CAR_X} from './M60Village';
import {Kitchen, Room, Cellar, Shed, TableTop} from './M60Rooms';

export const FPSM = 30;
export const DURATIONM = 490.0;
const KEYS = (k: [number, number][], t: number) => {
  if (t <= k[0][0]) return k[0][1];
  for (let i = 0; i < k.length - 1; i++) if (t < k[i + 1][0]) return lerp(k[i][1], k[i + 1][1], (t - k[i][0]) / (k[i + 1][0] - k[i][0]));
  return k[k.length - 1][1];
};
const tempAt = (t: number) => KEYS([[35, -18], [125, -18], [146, -27], [190, -34], [260, -40], [329, -48], [383, -55], [389, -58], [394, -60]], t);
const darkAt = (t: number) => KEYS([[35, 0.12], [150, 0.3], [190, 0.5], [260, 0.62], [276, 0.9], [330, 0.82], [390, 0.95], [400, 1]], t);
const snowN = (t: number) => Math.round(KEYS([[35, 50], [150, 90], [190, 150], [330, 220], [390, 260]], t));

type Cam = [number, number, number, number, number, number];
type Shot = {a: number; b: number; sc: string; cam: Cam; p?: any; shake?: number; hud?: 'out' | 'home' | 'none'; fi?: number};
const S = (a: number, b: number, sc: string, cam: Cam, p: any = {}, extra: Partial<Shot> = {}): Shot => ({a, b, sc, cam, p, ...extra});
const IL = (x: number, y: number, pose: Pose, flip = false, look: Look = ILYA_IN, s = 1): CharSpec => ({look, x, y, pose, flip, s});

const NightView: React.FC<{t: number; old: number; cx?: number}> = ({t, old}) => (
  <g>
    <rect x={100} y={430} width={320} height={420} fill="#070b14" />
    <path d="M100 760 Q260 730 420 770 L420 860 L100 860 Z" fill="#2a3a58" />
    {[0, 1, 2, 3, 4, 5].map((i) => <rect key={i} x={120 + i * 50} y={720 + (i % 2) * 8} width={10} height={70} fill="#10182a" />)}
    <path d="M300 740 L330 700 L366 740 Z" fill="#0c1220" /><rect x={304} y={740} width={58} height={34} fill="#0c1220" />
    <rect x={324} y={750} width={10} height={12} fill={mixc('#0c1220', '#ffd25a', old)} />
    {old > 0.02 && <Glow x={329} y={756} r={120} c="#ffd25a" o={0.7 * old} id="nvg" />}
    <Snow t={t} n={34} speed={150} wind={110} op={0.8} w={320} h={420} size={1.2} x0={100} y0={430} />
  </g>
);
const DoorOpen: React.FC<{t: number; open: number}> = ({t, open}) => (
  <g>
    <rect x={-100} y={-100} width={1300} height={2200} fill="#2a2018" />
    <rect x={200} y={300} width={680} height={1400} fill={mixc('#1c1812', '#dfe9f7', open * 0.9)} />
    {open > 0.1 && Array.from({length: 90}).map((_, i) => {
      const tt = ((t * 1.4 + rnd(i) * 2) % 1);
      return <circle key={i} cx={200 + rnd(i + 1) * 680 - tt * 0} cy={300 + rnd(i + 2) * 1400} r={4 + rnd(i + 3) * 10} fill="#fff" opacity={open * (0.5 + 0.4 * rnd(i + 5))} transform={`translate(${tt * 200 - 80} ${tt * 40})`} />;
    })}
    <g transform={`translate(200 300)`}><path d={`M0 0 L${-300 * open + 40} ${50 * open} L${-300 * open + 40} ${1400 - 50 * open} L0 1400 Z`} fill="#5a3a24" stroke="#2a1a0e" strokeWidth={8} /></g>
    <rect x={180} y={280} width={720} height={30} fill="#3a2818" /><rect x={180} y={280} width={30} height={1440} fill="#3a2818" /><rect x={870} y={280} width={30} height={1440} fill="#3a2818" />
    {open < 0.5 && <circle cx={800} cy={1000} r={22} fill="#d9d9d9" />}
    <rect x={0} y={1700} width={1080} height={400} fill="#9fb0c8" />
  </g>
);
const Door2: React.FC<{t: number; closed: number}> = ({t, closed}) => (
  <g>
    <rect x={-100} y={-100} width={1300} height={2200} fill="#4a3a30" />
    {Array.from({length: 14}).map((_, i) => <rect key={i} x={-100 + i * 90} y={-100} width={3} height={1700} fill="#000" opacity={0.2} />)}
    <rect x={260} y={420} width={560} height={1200} fill="#14100c" />
    <g transform="translate(260 420)"><path d={`M0 0 L${lerp(-200, 560, closed)} ${lerp(30, 0, closed)} L${lerp(-200, 560, closed)} ${lerp(1170, 1200, closed)} L0 1200 Z`} fill="#6a4a30" stroke="#2a1a0e" strokeWidth={6} /></g>
    <circle cx={lerp(60, 520, closed)} cy={1000} r={18} fill="#d9d9d9" />
    <rect x={-100} y={1620} width={1300} height={500} fill="#3a2a1c" />
  </g>
);
const Hands: React.FC<{t: number}> = ({t}) => (
  <g>
    <rect x={-100} y={-100} width={1300} height={2200} fill="#1a2234" />
    {[0, 1].map((i) => (
      <g key={i} transform={`translate(${i ? 640 : 220} ${900 + Math.sin(t * 40 + i) * 3})`}>
        <rect x={-60} y={-40} width={240} height={90} rx={44} fill="#08090b" />
        {[0, 1, 2, 3].map((k) => <rect key={k} x={150} y={-34 + k * 22} width={90} height={20} rx={10} fill="#0b0c10" />)}
        <rect x={-120} y={-30} width={90} height={70} fill="#1b1e25" />
        {Array.from({length: 20}).map((_, k) => <circle key={k} cx={rnd(k + i * 9) * 260 - 20} cy={rnd(k + 3 + i) * 80 - 40} r={3 + rnd(k) * 4} fill="#fff" opacity={0.8} />)}
      </g>
    ))}
    <Snow t={t} n={130} speed={500} wind={600} op={0.9} size={2.2} />
  </g>
);
const Silh: React.FC<{t: number; label?: string; sub?: string}> = ({t, label, sub}) => (
  <g>
    <rect x={-100} y={-100} width={1300} height={2200} fill="#141a28" />
    <Glow x={540} y={900} r={700} c="#5a7aa8" o={0.35} id="slg" />
    <g transform="translate(540 1500)"><Person x={0} y={0} look={ILYA_OUT} pose={poseStand({nod: 0})} s={2.2} /></g>
    {label && <Tx x={540} y={380} size={110} fill="#fff" ls={6}>{label}</Tx>}
    {sub && <Tx x={540} y={500} size={64} fill="#9fb4d0">{sub}</Tx>}
  </g>
);
const ViewFinder: React.FC<{t: number}> = ({t}) => (
  <g>
    {[[100, 200], [980, 200], [100, 1700], [980, 1700]].map(([x, y], i) => <g key={i} stroke="#fff" strokeWidth={6} fill="none" opacity={0.85}><path d={`M${x + (x < 500 ? 70 : -70)} ${y} L${x} ${y} L${x} ${y + (y < 900 ? 70 : -70)}`} /></g>)}
    <circle cx={150} cy={260} r={14} fill="#ff3b3b" opacity={0.5 + 0.5 * Math.sin(t * 6)} />
    <Tx x={190} y={274} anchor="start" size={34} fill="#fff">REC</Tx>
  </g>
);

const SH: Shot[] = [
  // ---------- 0:00 intro ----------
  S(0, 3.5, 'blackmap', [540, 960, 3.2, 540, 960, 1.0]),
  S(3.5, 7.4, 'dotmap', [540, 900, 1.0, 540, 880, 1.25]),
  S(7.4, 11.1, 'skyline', [700, 1000, 1.15, 1500, 1000, 1.15], {bo: [0, 0.8, 7.4, 11.1]}),
  S(11.1, 12.7, 'skyline', [1500, 1050, 2.1, 1550, 1000, 2.5], {bo: [0.8, 0.93, 11.1, 12.7]}),
  S(12.7, 15.0, 'traffic', [540, 960, 1.0, 540, 880, 1.35], {tl: 'seq'}, {shake: 0}),
  S(15.0, 17.0, 'jam', [500, 1050, 1.1, 1100, 1050, 1.1], {}),
  S(17.0, 19.8, 'skyline', [1700, 950, 1.2, 800, 950, 1.2], {bo: [1, 1, 0, 1]}),
  S(19.8, 24.6, 'village', [900, 1000, 1.1, 1800, 1000, 1.1], {dark: 1, others: 0, old: 0, intro: true}),
  S(24.6, 28.1, 'village', [1800, 1000, 1.1, 2900, 1000, 1.1], {dark: 1, others: 0, old: 0}),
  S(28.1, 30.3, 'village', [3000, 1100, 1.6, 3380, 1200, 2.6], {dark: 1, others: 0, oldAt: 28.3}),
  S(30.3, 33.8, 'oldhouse', [330, 1340, 2.2, 330, 1330, 2.7], {lit: 1, shadowAt: 32.2}),
  S(33.8, 35.45, 'black', [540, 960, 1, 540, 960, 1]),
  // ---------- 0:35 morning ----------
  S(35.45, 39.45, 'village', [500, 1000, 1.0, 1150, 1000, 1.0], {others: 0.3}),
  S(39.45, 41.95, 'clock', [540, 960, 1.0, 540, 960, 1.35]),
  S(41.95, 43.3, 'room', [900, 800, 1.2, 960, 780, 1.5], {chars: 'window'}),
  S(43.3, 46.5, 'thermo', [540, 960, 1.0, 540, 900, 1.3], {val: -18}, {hud: 'none'}),
  S(46.5, 49.3, 'village', [1150, 1000, 1.05, 700, 1000, 1.05], {others: 0.35}),
  S(49.3, 51.0, 'kitchen', [850, 1000, 1.0, 1000, 1000, 1.1], {k: 'in'}),
  S(51.0, 53.9, 'kitchen', [1150, 1050, 1.5, 1150, 1050, 1.8], {k: 'ded'}),
  S(53.9, 58.4, 'radio', [540, 960, 1.0, 540, 940, 1.35], {needle: [0.3, 0.55, 53.9, 58.4], noise: 0.1}, {hud: 'none'}),
  S(58.4, 62.2, 'radio', [540, 960, 1.3, 540, 960, 1.0], {needle: [0.55, 0.62, 58.4, 62.2], noise: 0.5}, {hud: 'none'}),
  S(62.2, 68.3, 'eumap', [560, 840, 0.9, 540, 800, 1.15], {drop: [62.2, 67.5]}, {hud: 'none'}),
  S(68.3, 70.7, 'de', [700, 1000, 1.1, 850, 1000, 1.25], {}, {hud: 'none'}),
  S(70.7, 73.1, 'airport', [700, 900, 1.2, 800, 940, 1.0], {}, {hud: 'none'}),
  S(73.1, 77.3, 'supermarket', [700, 1000, 1.0, 880, 1000, 1.3], {}, {hud: 'none'}),
  S(77.3, 81.0, 'kitchen', [800, 1000, 1.1, 700, 1000, 1.3], {k: 'doubt'}),
  S(81.0, 84.0, 'kitchen', [1150, 1050, 1.2, 1150, 1100, 1.6], {k: 'ded'}),
  S(84.0, 88.1, 'kitchen', [900, 1050, 1.1, 1000, 1050, 1.3], {k: 'point'}),
  S(88.1, 91.6, 'silh', [540, 1100, 1.0, 540, 1050, 1.12], {label: 'ИЛЬЯ', sub: '19 лет'}, {hud: 'none'}),
  S(91.6, 97.2, 'village', [1750, 650, 0.55, 1750, 700, 0.62], {others: 0.4}),
  S(97.2, 99.15, 'village', [800, 1000, 1.2, 2000, 1000, 1.2], {others: 0.4}),
  S(99.15, 101.0, 'village', [2660, 1100, 1.8, 2700, 1100, 2.1], {others: 0.4}),
  S(101.0, 103.8, 'village', [3000, 1100, 1.6, 3200, 1100, 1.8], {others: 0.4}),
  S(103.8, 107.7, 'room', [1150, 1000, 1.3, 1180, 1000, 1.7], {chars: 'dress', t0: 104.2}),
  S(107.7, 109.2, 'village', [1180, 1050, 1.5, 1450, 1050, 1.5], {others: 0.4, chars: 'exit'}),
  S(109.2, 112.1, 'village', [1650, 1050, 1.6, 1750, 1050, 1.8], {others: 0.4, chars: 'max'}),
  S(112.1, 114.8, 'village', [1750, 1150, 2.6, 1760, 1150, 2.8], {others: 0.4, chars: 'maxcar', hood: true}),
  S(114.8, 117.7, 'village', [1500, 1050, 1.4, 1650, 1050, 1.7], {others: 0.4, chars: 'meet'}),
  S(117.7, 121.2, 'phone', [540, 960, 1.0, 540, 940, 1.3], {mode: 'moscow'}, {hud: 'none'}),
  S(121.2, 123.4, 'jam', [600, 1000, 1.3, 1000, 1000, 1.3], {}, {hud: 'none'}),
  S(123.4, 125.5, 'phone', [540, 900, 1.5, 540, 860, 1.9], {mode: 'moscow'}, {hud: 'none'}),
  S(125.5, 129.6, 'village', [1600, 1050, 1.7, 1680, 1050, 2.0], {others: 0.4, chars: 'look'}),
  S(129.6, 135.9, 'phone', [540, 960, 1.0, 540, 900, 1.5], {mode: 'alert'}, {hud: 'none', shake: 3}),
  S(135.9, 139.0, 'village', [1620, 1050, 1.8, 1620, 1050, 2.1], {others: 0.4, chars: 'look'}),
  S(139.0, 143.6, 'phone', [540, 900, 1.4, 540, 950, 1.0], {mode: 'alert'}, {hud: 'none'}),
  S(143.6, 148.0, 'thermo', [540, 960, 1.0, 540, 900, 1.3], {val: [-18, -27, 145.6, 147.7]}, {hud: 'none'}),
  S(148.0, 151.4, 'village', [1300, 1050, 1.2, 1250, 1050, 1.3], {others: 0.4}),
  S(151.4, 154.2, 'shed', [850, 1000, 1.0, 850, 1000, 1.25], {wood: 0.9, chars: 'wood'}),
  S(154.2, 157.5, 'cellar', [900, 1000, 1.0, 700, 1000, 1.25], {chars: 'cellar'}),
  S(157.5, 162.5, 'cellar', [380, 1100, 1.8, 900, 1100, 1.8], {chars: 'cellarmin'}),
  S(162.5, 166.4, 'tabletop', [540, 960, 1.0, 540, 960, 1.15], {n: [162.5, 166.4]}, {hud: 'none'}),
  S(166.4, 169.4, 'shed', [850, 1100, 1.05, 850, 1100, 1.0], {wood: 0.07}, {fi: 0}),
  S(169.4, 172.4, 'shed', [500, 1350, 1.9, 900, 1350, 1.9], {wood: 0.07}),
  S(172.4, 177.2, 'kitchen', [1380, 1150, 1.6, 1300, 1100, 1.4], {k: 'feed'}),
  S(177.2, 181.5, 'village', [1150, 1050, 1.5, 1500, 1050, 1.5], {others: 0.4, chars: 'carrywood', blizz: 0.3}),
  S(181.5, 183.5, 'village', [1300, 1050, 1.6, 1400, 1050, 1.8], {others: 0.4, chars: 'carrywood', blizz: 1}),
  S(183.5, 185.7, 'silh', [540, 1100, 1.4, 540, 1050, 1.6], {snowhard: true}, {hud: 'none'}),
  S(185.7, 188.8, 'village', [1230, 1240, 3.4, 1190, 1240, 3.8], {others: 0.4, chars: 'carrywood', blizz: 1}),
  S(188.8, 192.6, 'thermo', [540, 960, 1.0, 540, 900, 1.3], {val: [-27, -34, 190.6, 192.4]}, {hud: 'none'}),
  S(192.6, 195.0, 'clock', [540, 960, 1.0, 540, 960, 1.3], {h: 10, m: 50}, {hud: 'none'}),
  S(195.0, 196.7, 'kitchen', [600, 1000, 1.1, 800, 1000, 1.2], {k: 'enter'}),
  S(196.7, 198.4, 'kitchen', [1200, 900, 1.9, 1200, 880, 2.3], {k: 'tv', tv: 'city'}),
  S(198.4, 201.1, 'kitchen', [1200, 880, 2.3, 1200, 880, 2.6], {k: 'tv', tv: 'city'}),
  S(201.1, 204.3, 'supermarket', [900, 1000, 1.0, 750, 1000, 1.25], {}, {hud: 'none'}),
  S(204.3, 207.8, 'gas', [850, 1000, 1.0, 600, 1000, 1.2], {}, {hud: 'none'}),
  S(207.8, 210.7, 'jam', [900, 1050, 1.1, 700, 1050, 1.4], {}, {hud: 'none', shake: 4}),
  S(210.7, 214.5, 'kitchen', [1100, 1000, 1.3, 1250, 1000, 1.6], {k: 'watch', tv: 'city'}),
  S(214.5, 218.3, 'skyline', [900, 1000, 1.2, 1500, 1000, 1.2], {bo: [0.25, 0.45, 214.5, 218.3]}, {hud: 'none'}),
  S(218.3, 220.3, 'tvfull', [540, 960, 1.0, 540, 960, 1.1], {mode: 'static'}, {hud: 'none', shake: 3}),
  S(220.3, 223.4, 'tvfull', [540, 960, 1.0, 540, 940, 1.25], {mode: 'host'}, {hud: 'none'}),
  S(223.4, 226.4, 'tvfull', [540, 960, 1.2, 540, 940, 1.35], {mode: 'host', banner: 223.8}, {hud: 'none'}),
  S(226.4, 230.2, 'kitchen', [1150, 1000, 1.2, 1100, 1000, 1.45], {k: 'tvdark', tv: 'host', banner: 1}),
  S(230.2, 233.2, 'tvfull', [540, 960, 1.35, 540, 940, 1.5], {mode: 'host', banner: 0}, {hud: 'none'}),
  S(233.2, 236.2, 'kitchen', [1000, 1000, 1.2, 1150, 1000, 1.6], {k: 'tvdark', tv: 'host', banner: 1}),
  S(236.2, 238.5, 'tvfull', [540, 960, 1.5, 540, 960, 1.55], {mode: 'host', banner: 1}, {hud: 'none'}),
  S(238.5, 243.8, 'tvfull', [540, 960, 1.4, 540, 940, 1.7], {mode: 'host', banner: 1, flick: [238.5, 243.8]}, {hud: 'none', shake: 2}),
  S(243.8, 246.6, 'kitchen', [1150, 1000, 1.3, 1100, 1000, 1.5], {k: 'tvdark', tv: 'flicker', banner: 1}),
  S(246.6, 251.6, 'tvfull', [540, 960, 1.6, 540, 940, 1.8], {mode: 'host', banner: 1, turn: [246.8, 250.0], flick: [246.6, 251.6]}, {hud: 'none', shake: 3}),
  S(251.6, 253.6, 'tvfull', [540, 960, 1.9, 540, 960, 2.0], {mode: 'host', banner: 1, turn: [251.6, 251.7], glitch: true}, {hud: 'none', shake: 8}),
  S(253.6, 259.7, 'tvfull', [540, 960, 1.6, 540, 960, 1.3], {mode: 'hoststatic', switchAt: 257.6, banner: 1}, {hud: 'none', shake: 6}),
  S(259.7, 260.35, 'black', [540, 960, 1, 540, 960, 1]),
  S(260.35, 261.3, 'bulb', [850, 600, 1.8, 850, 600, 2.2], {}, {hud: 'none'}),
  S(261.3, 262.6, 'bulb', [850, 600, 2.4, 850, 600, 2.6], {off: true}, {hud: 'none'}),
  S(262.6, 263.9, 'traffic', [540, 960, 1.1, 540, 900, 1.3], {tl: 'off', t0: 262.6}),
  S(263.9, 266.4, 'skyline', [600, 1000, 1.0, 1800, 1000, 1.0], {bo: [0, 1, 263.9, 266.4]}, {hud: 'none'}),
  S(266.4, 268.4, 'citytop', [540, 900, 1.0, 540, 1100, 1.0], {prog: [0, 1, 266.4, 268.4]}, {hud: 'none'}),
  S(268.4, 272.0, 'kitchen', [700, 1000, 1.5, 700, 1000, 1.9], {k: 'switch'}),
  S(272.0, 273.0, 'kitchen', [600, 1000, 2.5, 600, 1000, 2.9], {k: 'switchzoom'}),
  S(273.0, 274.6, 'kitchen', [300, 700, 1.7, 300, 680, 1.9], {k: 'window'}),
  S(274.6, 278.2, 'village', [1000, 1000, 1.1, 1500, 1000, 1.1], {others: [1, 0, 274.6, 277.8], chars: 'none'}),
  S(278.2, 281.2, 'phone', [540, 960, 1.0, 540, 940, 1.3], {mode: 'loading'}, {hud: 'none'}),
  S(281.2, 285.2, 'phone', [540, 900, 1.5, 540, 900, 1.9], {mode: 'loading'}, {hud: 'none'}),
  S(285.2, 288.0, 'phone', [540, 960, 1.0, 540, 930, 1.4], {mode: 'msg'}, {hud: 'none'}),
  S(288.0, 292.5, 'phone', [540, 840, 1.6, 540, 830, 2.0], {mode: 'msg'}, {hud: 'none'}),
  S(292.5, 296.2, 'phone', [540, 960, 1.0, 540, 960, 1.3], {mode: 'loading', bars: [4, 2, 292.5, 295.5]}, {hud: 'none'}),
  S(296.2, 298.0, 'phone', [540, 960, 1.3, 540, 960, 1.5], {mode: 'loading', bars: [1, 0.5, 296.2, 297.6]}, {hud: 'none'}),
  S(298.0, 300.5, 'phone', [540, 960, 1.4, 540, 960, 1.9], {mode: 'nosig', bars: [0, 0, 0, 1]}, {hud: 'none'}),
  S(300.5, 303.6, 'kitchen', [800, 1050, 1.6, 750, 1050, 1.9], {k: 'radioin'}),
  S(303.6, 306.3, 'radio', [540, 960, 1.1, 540, 940, 1.45], {needle: [0.2, 0.7, 303.6, 306.0], noise: 0.7}, {hud: 'none'}),
  S(306.3, 308.5, 'radio', [540, 960, 1.45, 540, 960, 1.6], {needle: [0.7, 0.66, 306.3, 308.5], noise: 0.12}, {hud: 'none'}),
  S(308.5, 312.2, 'kitchen', [900, 1050, 1.3, 800, 1050, 1.5], {k: 'radiolisten'}),
  S(312.2, 316.0, 'radio', [540, 960, 1.4, 540, 960, 1.2], {needle: [0.66, 0.66, 312, 316], noise: 0.25}, {hud: 'none'}),
  S(316.0, 319.6, 'kitchen', [1050, 1050, 1.3, 1150, 1050, 1.55], {k: 'radiolisten'}),
  S(319.6, 322.0, 'radio', [540, 960, 1.3, 540, 960, 1.6], {needle: [0.66, 0.66, 0, 1], noise: 1}, {hud: 'none', shake: 6}),
  S(322.0, 324.0, 'radio', [540, 960, 1.6, 540, 960, 1.6], {needle: [0.66, 0.66, 0, 1], noise: 0, dead: true}, {hud: 'none'}),
  S(324.0, 327.7, 'clock', [540, 960, 1.0, 540, 960, 1.3], {h: 14, m: 8}, {hud: 'none'}),
  S(327.7, 329.8, 'village', [1200, 1050, 1.3, 1300, 1050, 1.3], {others: 0, blizz: 1, nohouses: true}),
  S(329.8, 333.0, 'thermo', [540, 960, 1.0, 540, 900, 1.3], {val: [-40, -48, 330.4, 332.5]}, {hud: 'none'}),
  S(333.0, 336.6, 'kitchen', [1100, 1000, 1.4, 1150, 1000, 1.7], {k: 'ded'}),
  S(336.6, 339.1, 'door2', [540, 960, 1.0, 540, 960, 1.15], {}, {hud: 'none'}),
  S(339.1, 341.3, 'kitchen', [300, 750, 1.7, 300, 750, 1.9], {k: 'curtain', c0: 339.2}),
  S(341.3, 343.7, 'kitchen', [1400, 1250, 1.8, 1420, 1250, 2.2], {k: 'feedboost'}),
  S(343.7, 345.8, 'room', [900, 1000, 1.2, 800, 1000, 1.4], {chars: 'blanket', jacketNone: true}),
  S(345.8, 347.7, 'kitchen', [1400, 700, 1.9, 1400, 700, 2.1], {k: 'pipe'}),
  S(347.7, 353.0, 'kitchen', [1050, 1300, 1.8, 1050, 1300, 2.0], {k: 'water', t0: 347.7}),
  S(353.0, 355.5, 'kitchen', [520, 650, 1.7, 520, 640, 2.2], {k: 'homet'}, {hud: 'home'}),
  S(355.5, 358.1, 'kitchen', [200, 1000, 1.6, 200, 1000, 1.8], {k: 'cold'}),
  S(358.1, 359.6, 'kitchen', [900, 1000, 1.0, 900, 1000, 1.1], {k: 'cozy'}),
  S(359.6, 361.4, 'kitchen', [260, 640, 2.4, 260, 640, 2.8], {k: 'knock', knockAt: 359.8}),
  S(361.4, 362.8, 'kitchen', [260, 640, 2.8, 260, 640, 2.6], {k: 'knock2'}),
  S(362.8, 365.5, 'village', [1250, 1050, 1.7, 1250, 1050, 2.2], {others: 0, chars: 'maxsnow', blizz: 1}),
  S(365.5, 368.0, 'dooropen', [540, 960, 1.0, 540, 960, 1.2], {open: [365.7, 366.6]}, {hud: 'none', shake: 3}),
  S(368.0, 371.7, 'supermarket', [900, 1000, 1.1, 1000, 1000, 1.3], {dim: true}, {hud: 'none'}),
  S(371.7, 374.8, 'supermarket', [600, 1050, 1.7, 1000, 1050, 1.7], {dim: true}, {hud: 'none'}),
  S(374.8, 377.0, 'gas', [900, 1000, 1.2, 700, 1000, 1.3], {snowy: true}, {hud: 'none'}),
  S(377.0, 380.0, 'village', [2000, 1050, 1.4, 2400, 1050, 1.4], {others: 0, blizz: 1, drifts: 0.7}),
  S(380.0, 383.3, 'jam', [850, 1050, 1.2, 600, 1050, 1.5], {snowy: true}, {hud: 'none'}),
  S(383.3, 387.3, 'thermo', [540, 960, 1.0, 540, 900, 1.3], {val: [-52, -55, 383.4, 385.5]}, {hud: 'none'}),
  S(387.3, 389.0, 'kitchen', [300, 700, 1.9, 300, 700, 2.1], {k: 'window', temp: true}),
  S(389.0, 391.5, 'thermo', [540, 960, 1.1, 540, 900, 1.4], {val: [-55, -58, 389.2, 390.6]}, {hud: 'none'}),
  S(391.5, 392.6, 'village', [1250, 1050, 1.3, 1300, 1050, 1.3], {others: 0, blizz: 1, nohouses: true}),
  S(392.6, 395.5, 'thermo', [540, 960, 1.1, 540, 900, 1.5], {val: [-58, -60, 392.8, 394.2], hit: 394.2}, {hud: 'none'}),
  S(395.5, 397.8, 'kitchen', [330, 700, 1.7, 330, 700, 1.9], {k: 'dedwindow'}),
  S(397.8, 402.3, 'village', [1250, 1050, 1.4, 1200, 1050, 1.0], {others: 0, blizz: 1, nohouses: true, dim: true}),
  S(402.3, 406.3, 'kitchen', [1050, 1050, 1.3, 1150, 1050, 1.5], {k: 'three'}),
  S(406.3, 407.6, 'kitchen', [850, 600, 1.8, 850, 600, 1.8], {k: 'darkbulb'}),
  S(407.6, 409.0, 'phone', [540, 960, 1.4, 540, 960, 1.6], {mode: 'nosig', bars: [0, 0, 0, 1]}, {hud: 'none'}),
  S(409.0, 412.2, 'kitchen', [300, 750, 1.5, 300, 740, 1.7], {k: 'window'}),
  S(412.2, 414.4, 'kitchen', [300, 700, 1.7, 300, 700, 1.9], {k: 'shutters', c0: 412.4}),
  S(414.4, 417.7, 'kitchen', [260, 640, 1.9, 260, 640, 3.0], {k: 'view', old: [0, 1, 414.8, 416.2]}),
  S(417.7, 421.0, 'village', [2900, 1100, 1.2, 3300, 1150, 2.0], {others: 0, blizz: 1, oldAt: 417.9, flickOld: true}),
  S(421.0, 422.7, 'village', [3300, 1150, 2.0, 3400, 1190, 3.2], {others: 0, blizz: 1, oldAt: 0}),
  S(422.7, 427.0, 'oldhouse', [540, 1300, 1.1, 330, 1320, 1.9], {lit: 1}),
  S(427.0, 428.6, 'oldhouse', [540, 1200, 1.0, 540, 1250, 1.1], {lit: 1}),
  S(428.6, 431.7, 'oldhouse', [330, 1500, 2.4, 620, 1520, 2.4], {lit: 1}),
  S(431.7, 434.9, 'oldhouse', [540, 760, 2.0, 540, 1000, 1.8], {lit: 1}),
  S(434.9, 438.2, 'oldhouse', [480, 1560, 2.8, 480, 1560, 3.2], {lit: 1}),
  S(438.2, 439.7, 'kitchen', [600, 1000, 1.5, 600, 1000, 1.7], {k: 'call'}),
  S(439.7, 442.6, 'kitchen', [260, 640, 1.8, 260, 640, 2.0], {k: 'twowin', old: [1, 1, 0, 1]}),
  S(442.6, 445.1, 'kitchen', [300, 700, 1.4, 300, 700, 1.5], {k: 'twowin', old: [1, 1, 0, 1]}),
  S(445.1, 447.0, 'phone', [540, 960, 1.0, 540, 960, 1.15], {mode: 'blank', rec: true}, {hud: 'none'}),
  S(447.0, 449.8, 'village', [3000, 1150, 1.6, 3380, 1190, 3.4], {others: 0, blizz: 1, oldAt: 0, vf: true}),
  S(449.8, 451.0, 'oldhouse', [330, 1340, 2.8, 330, 1340, 3.0], {lit: 1, vf: true}),
  S(451.0, 453.1, 'oldhouse', [330, 1340, 3.0, 330, 1340, 3.2], {lit: 1, vf: true, shadowAt: 451.2}),
  S(453.1, 455.2, 'kitchen', [900, 1000, 1.3, 1000, 1000, 1.45], {k: 'ask'}),
  S(455.2, 457.3, 'kitchen', [1150, 1050, 1.5, 1150, 1050, 1.7], {k: 'ded'}),
  S(457.3, 459.9, 'kitchen', [1150, 1050, 1.7, 1150, 1050, 2.0], {k: 'dedstill'}),
  S(459.9, 462.8, 'kitchen', [300, 700, 1.4, 300, 700, 1.6], {k: 'dedwindow'}),
  S(462.8, 466.4, 'kitchen', [300, 700, 1.9, 300, 700, 2.2], {k: 'dedwindow', still: true}),
  S(466.4, 468.7, 'kitchen', [800, 1000, 1.3, 900, 1000, 1.5], {k: 'ask'}),
  S(468.7, 472.0, 'kitchen', [300, 700, 1.3, 300, 700, 1.4], {k: 'dedwindow'}),
  S(472.0, 474.8, 'kitchen', [650, 1000, 1.5, 650, 1000, 1.7], {k: 'twoshot'}),
  S(474.8, 477.6, 'kitchen', [260, 640, 2.3, 260, 640, 2.8], {k: 'view', old: [1, 1, 0, 1]}),
  S(477.6, 478.9, 'oldhouse', [540, 1000, 1.0, 540, 1000, 1.05], {lit: 1}),
  S(478.9, 480.8, 'oldhouse', [540, 1000, 1.05, 540, 1000, 1.1], {lit: 0, offAt: 479.0}),
  S(480.8, 482.3, 'oldhouse', [540, 1000, 1.1, 540, 900, 1.12], {lit: 0}),
  S(482.3, 484.6, 'oldhouse', [540, 1000, 1.1, 540, 560, 1.35], {lit: 0, top: [482.3, 483.0]}),
  S(484.6, 488.24, 'oldhouse', [540, 580, 1.35, 540, 570, 1.45], {lit: 0, top: [0, 0]}),
  S(488.24, 490.0, 'black', [540, 960, 1, 540, 960, 1]),
];

// ---------------- scene rendering ----------------
const lerpWin = (a: [number, number, number, number], t: number) => lerp(a[0], a[1], E(t, a[2], a[3]));
const tvOf = (p: any, t: number): TvMode => (p.mode === 'hoststatic' ? (t >= p.switchAt ? 'static' : 'host') : p.mode);

const kitchenProps = (t: number, p: any) => {
  const k: string = p.k ?? 'in';
  const dark = t > 261.3;
  const lampFlick = t > 260.4 && t < 261.3 ? (Math.sin(t * 40) > 0 ? 1 : 0.15) : 1;
  const lamp = dark ? 0 : 1;
  const flame = t < 49 ? 0.7 : k === 'feedboost' ? 1 : 0.8 + 0.1 * Math.sin(t * 3);
  const curtain = t >= 339.2 ? E(t, 339.2, 341.0) : 0.1;
  const water = t < 347.7 ? 0 : E(t, 347.7, 352.5);
  const shut = t >= 412.4 ? E(t, 412.4, 414.2) : 0;
  const radioOn = t >= 303 && t < 322 ? 1 : t >= 51 && t < 62 ? 0.8 : 0;
  let tv: TvMode = p.tv ?? 'off';
  if (!p.tv) tv = t >= 196 && t < 259.7 ? 'static' : 'off';
  const chars: CharSpec[] = [];
  const dedSit = IL(1170, 1500, poseSit({nod: Math.sin(t * 0.8) * 3}), false, DED_IN);
  const dedStand = (x: number, flip = false) => IL(x, 1500, poseStand({nod: Math.sin(t * 0.7) * 2}), flip, DED_IN);
  const ilyaStand = (x: number, flip = false, pose?: Pose) => IL(x, 1500, pose ?? poseStand({nod: 3}), flip, ILYA_OUT);
  const ilyaIn = (x: number, flip = false, pose?: Pose) => IL(x, 1500, pose ?? poseStand({nod: 3}), flip, ILYA_OUT);
  const mx = (x: number, flip = false) => IL(x, 1500, poseStand(), flip, MAX_OUT);
  switch (k) {
    case 'in': { const x = lerp(250, 650, E(t, 49.3, 50.8)); chars.push(dedSit, IL(x, 1500, t < 50.9 ? poseWalk(t, 3.2) : poseStand(), false, ILYA_IN)); break; }
    case 'ded': chars.push(dedSit, IL(620, 1500, poseStand({nod: 4}), false, ILYA_IN)); break;
    case 'doubt': chars.push(dedSit, IL(620, 1500, poseStand({nod: -5, hf: [42, -150], hb: [10, -126]}), false, ILYA_IN)); break;
    case 'point': chars.push(IL(1100, 1500, poseSit({hf: [100, -130], hb: [30, -76]}), false, DED_IN), IL(640, 1500, poseStand({nod: 5}), false, ILYA_IN)); break;
    case 'enter': { const x = lerp(220, 600, E(t, 195.0, 196.5)); chars.push(dedSit, IL(x, 1500, poseWalk(t, 3.2), false, ILYA_OUT)); break; }
    case 'tv': case 'watch': chars.push(IL(1170, 1500, poseSit({nod: 2}), false, DED_IN)); break;
    case 'tvdark': chars.push(IL(1130, 1500, poseSit({nod: 1}), false, DED_IN), IL(780, 1500, poseStand(), false, ILYA_OUT)); break;
    case 'feed': case 'feedboost': { const x = lerp(1150, 1190, E(t, 172.5, 174)); chars.push(IL(1180, 1500, poseReach(70, -90, {lean: 24, lf: [30, 0], lb: [-24, 0], hip: [0, -100]}), false, DED_IN)); break; }
    case 'switch': { const x = lerp(900, 650, E(t, 268.4, 270.0)); chars.push(dedSit, IL(x, 1500, t < 270.1 ? poseWalk(t, 3.2) : poseReach(70, -250, {lean: 4}), true, ILYA_OUT)); break; }
    case 'switchzoom': chars.push(dedSit, IL(600, 1500, poseReach(60, -250), true, ILYA_OUT)); break;
    case 'window': chars.push(IL(480, 1500, poseStand({lean: 8, nod: 4}), true, DED_IN), IL(700, 1500, poseStand(), false, ILYA_OUT)); break;
    case 'radioin': { const hx = lerp(40, 70, E(t, 301, 303)); chars.push(IL(840, 1500, poseReach(hx, -170, {lean: 14}), true, DED_IN), IL(1050, 1500, poseSit(), true, ILYA_OUT)); break; }
    case 'radiolisten': chars.push(IL(1020, 1500, poseSit({nod: 3}), true, DED_IN), IL(480, 1500, poseStand({nod: 4}), false, ILYA_OUT)); break;
    case 'curtain': chars.push(IL(480, 1500, poseReach(60, -300, {lean: 4}), true, ILYA_OUT)); break;
    case 'pipe': chars.push(IL(1180, 1500, poseReach(60, -300, {lean: 4}), false, DED_IN)); break;
    case 'water': chars.push(IL(1100, 1500, poseStand({lean: 20, hf: [60, -90], hb: [30, -86]}), true, ILYA_OUT)); break;
    case 'homet': chars.push(dedSit); break;
    case 'cold': chars.push(dedSit, IL(520, 1500, poseShiver(t), false, ILYA_OUT)); break;
    case 'cozy': chars.push(dedSit, IL(620, 1500, poseStand({nod: 4}), false, ILYA_OUT)); break;
    case 'knock': case 'knock2': chars.push(dedSit); break;
    case 'dedwindow': chars.push(IL(470, 1500, poseStand({lean: 6, nod: 2}), true, DED_IN)); break;
    case 'dedstill': chars.push(IL(1170, 1500, poseSit(), false, DED_IN)); break;
    case 'three': chars.push(dedSit, IL(980, 1500, poseSit({nod: 4}), true, ILYA_OUT), IL(1300, 1500, poseSit({nod: 3}), true, MAX_OUT)); break;
    case 'ask': chars.push(dedSit, IL(700, 1500, poseStand({nod: 6}), false, ILYA_OUT), IL(500, 1500, poseStand(), false, MAX_OUT)); break;
    case 'call': chars.push(dedSit, IL(620, 1500, poseStand({nod: -3, hf: [20, -126]}), true, ILYA_OUT)); break;
    case 'twowin': chars.push(IL(430, 1500, poseStand({nod: 5}), true, ILYA_OUT), IL(580, 1500, poseStand(), true, MAX_OUT)); break;
    case 'twoshot': chars.push(IL(560, 1500, poseStand({nod: 4}), true, DED_IN), IL(900, 1500, poseStand({nod: 3}), true, ILYA_OUT)); break;
    case 'view': case 'shutters': case 'darkbulb': case 'knock3': break;
    default: break;
  }
  if (k === 'shutters') chars.push(IL(480, 1500, poseReach(60, -300, {lean: 4}), true, ILYA_OUT));
  const knock = k === 'knock' ? E(t, p.knockAt, p.knockAt + 0.4) : k === 'knock2' ? 1 : 0;
  const view = k === 'view' || p.k === 'twowin' ? <NightView t={t} old={p.old ? lerpWin(p.old as any, t) : 1} /> : undefined;
  return {
    t, lamp, bulbFlick: lampFlick, power: dark ? 1 : 0, flame, curtain: k === 'view' || k === 'twowin' ? 0.05 : curtain, tv, tvBanner: p.banner === 1 ? 1 : p.banner > 1 ? E(t, p.banner, p.banner + 0.3) : 0,
    tvTurn: 0, radioOn, needle: 0.5, noise: 0.1, water, chars, outTemp: tempAt(t), outRed: t >= 394.2 ? 1 : 0, shutters: k === 'view' || k === 'twowin' ? 0 : shut,
    cold: k === 'cold' ? 1 : 0, view, knock,
  };
};

const SceneR: React.FC<{sh: Shot; t: number}> = ({sh, t}) => {
  const p = sh.p ?? {};
  const dark = darkAt(t);
  const blizz = p.blizz ?? KEYS([[35, 0.2], [190, 0.5], [330, 1]], t);
  switch (sh.sc) {
    case 'black': return <rect x={-500} y={-500} width={2500} height={3000} fill="#000" />;
    case 'blackmap': {
      const k = E(t, 0, 0.8);
      return (
        <g>
          <rect x={-500} y={-500} width={2500} height={3000} fill="#000" />
          <DotMap t={t} reveal={E(t, 1.0, 3.4)} />
          <Tx x={540} y={900} size={190} fill="#fff" o={k} stroke="#000">−60 °C</Tx>
        </g>
      );
    }
    case 'dotmap': return <g><rect x={-500} y={-500} width={2500} height={3000} fill="#05080f" /><DotMap t={t} reveal={1} /><Tx x={540} y={420} size={120} fill="#9fc4ff" o={0.35}>−60</Tx></g>;
    case 'skyline': { const b = p.bo as number[]; return <Skyline t={t} bo={lerp(b[0], b[1], E(t, b[2], b[3]))} cx={lerp(sh.cam[0], sh.cam[3], 0.5)} />; }
    case 'traffic': {
      if (p.tl === 'seq') { const g = t < 13.4 ? 1 : Math.max(0, 1 - (t - 13.4) * 6); const r = t < 13.4 ? 0 : t < 14.9 ? Math.min(1, (t - 13.4) * 6) : Math.max(0, 1 - (t - 14.9) * 12); return <TrafficLight t={t} green={g} red={r} />; }
      const r = t < p.t0 + 0.4 ? 1 : Math.max(0, 1 - (t - p.t0 - 0.4) * 5);
      return <TrafficLight t={t} green={0} red={r} />;
    }
    case 'jam': return <g><Jam t={t} />{p.snowy && <rect x={-300} y={-300} width={2000} height={2500} fill="#dfe9f7" opacity={0.12} />}</g>;
    case 'citytop': { const b = p.prog as number[]; return <CityTop t={t} prog={lerp(b[0], b[1], E(t, b[2], b[3]))} />; }
    case 'gas': return <GasStation t={t} />;
    case 'supermarket': return <g><Supermarket t={t} />{p.dim && <rect x={-200} y={-200} width={1900} height={2400} fill="#0a1020" opacity={0.35} />}</g>;
    case 'airport': return <Airport t={t} />;
    case 'de': return <StreetDE t={t} />;
    case 'eumap': return <EuropeMap t={t} drop={E(t, p.drop[0], p.drop[1])} />;
    case 'clock': return <g><rect x={-300} y={-300} width={1700} height={2500} fill="#3a2a1e" />{Array.from({length: 14}).map((_, i) => <rect key={i} x={-100 + i * 90} y={-300} width={3} height={2500} fill="#000" opacity={0.2} />)}<ClockArt x={540} y={900} s={1.5} h={p.h ?? 8} m={p.m ?? 0} t={t} /></g>;
    case 'thermo': {
      const v = Array.isArray(p.val) ? lerp(p.val[0], p.val[1], E(t, p.val[2], p.val[3])) : p.val;
      const red = t >= (p.hit ?? 9999) ? 1 : 0;
      return <g><rect x={-300} y={-300} width={1700} height={2500} fill="#8a96a8" /><rect x={-300} y={-300} width={1700} height={2500} fill="#0a1020" opacity={0.25 + dark * 0.3} /><Snow t={t} n={80} speed={200} wind={160} op={0.8} size={1.6} /><OutThermo x={540} y={960} s={2.0} value={v} red={red} t={t} /></g>;
    }
    case 'radio': {
      const nd = p.needle as number[];
      const needle = p.dead ? 0.66 : lerp(nd[0], nd[1], E(t, nd[2], nd[3]));
      return <g><rect x={-300} y={-300} width={1700} height={2500} fill="#2a1e16" /><Glow x={540} y={900} r={900} c="#ffb04a" o={p.dead ? 0 : 0.25} id="rbg" /><Radio x={540} y={960} s={2.3} t={t} on={p.dead ? 0 : 1} needle={needle} noise={p.noise} /></g>;
    }
    case 'phone': {
      const bars = p.bars ? lerp(p.bars[0], p.bars[1], E(t, p.bars[2] ?? 0, p.bars[3] ?? 1)) : 4;
      return <g><rect x={-300} y={-300} width={1700} height={2500} fill="#0a0e18" /><Glow x={540} y={960} r={800} c="#5a7aa8" o={0.25} id="phg" /><Phone x={540} y={960} s={2.1} mode={p.mode} t={t} bars={Math.round(bars)} />{p.rec && <ViewFinder t={t} />}</g>;
    }
    case 'tvfull': {
      let mode = tvOf(p, t);
      const turn = p.turn ? E(t, p.turn[0], p.turn[1]) : 0;
      const flick = p.flick ? (Math.sin(t * (10 + 20 * E(t, p.flick[0], p.flick[1]))) > 0.2 ? 1 : 0.25) : 1;
      const gl = p.glitch && Math.sin(t * 50) > 0;
      const bn = p.banner === undefined ? 0 : p.banner === 0 ? 0 : p.banner === 1 ? 1 : E(t, p.banner, p.banner + 0.3);
      return (
        <g>
          <rect x={-300} y={-300} width={1700} height={2500} fill="#0c0f16" />
          <g transform="translate(150 420) scale(2.0)" opacity={flick}><TvScreen2 mode={mode} t={t} banner={bn} turn={turn} /></g>
          {gl && <rect x={-100} y={700 + (t * 313) % 400} width={1300} height={30} fill="#fff" opacity={0.4} />}
          <Glow x={540} y={760} r={900} c="#9fc4ff" o={0.18 * flick} id="tvbg" />
        </g>
      );
    }
    case 'bulb': {
      const flick = p.off ? 0 : t < 261.1 ? (Math.sin(t * 45) > 0 ? 1 : 0.2) : 0;
      const on = p.off ? (t < 261.55 ? (Math.sin(t * 50) > 0 ? 1 : 0.1) : 0) : (t < 260.9 ? 1 : flick);
      return (
        <g>
          <rect x={-300} y={-300} width={2500} height={2500} fill={mixc('#12141c', '#7a6a56', on * 0.5)} />
          <line x1={850} y1={-300} x2={850} y2={540} stroke="#222" strokeWidth={5} />
          <circle cx={850} cy={580} r={44} fill={on > 0.2 ? '#fff2b0' : '#4a4a52'} />
          {on > 0.05 && <Glow x={850} y={580} r={900} c="#ffe9a0" o={0.6 * on} id="bgl" />}
        </g>
      );
    }
    case 'hands': return <Hands t={t} />;
    case 'silh': return p.snowhard ? <g><Silh t={t} /><Snow t={t} n={160} speed={700} wind={900} op={0.9} size={2.6} /></g> : <Silh t={t} label={p.label} sub={p.sub} />;
    case 'door2': return <Door2 t={t} closed={E(t, 336.9, 338.6)} />;
    case 'dooropen': return <DoorOpen t={t} open={E(t, p.open[0], p.open[1])} />;
    case 'tabletop': return <TableTop t={t} n={t - p.n[0]} />;
    case 'oldhouse': {
      const lit = p.offAt ? (t < p.offAt ? 1 : (Math.sin(t * 30) > 0 && t < p.offAt + 0.3 ? 0.6 : 0)) : p.lit;
      const sh1 = p.shadowAt ? E(t, p.shadowAt, p.shadowAt + 1.0) : 0;
      const top = p.top ? E(t, p.top[0], p.top[1]) : p.top === undefined ? 0 : 0;
      const topF = sh.a >= 484.6 ? 1 : top;
      return <g><OldHouse t={t} lit={lit} top={topF} shadow={sh1} cx={lerp(sh.cam[0], sh.cam[3], 0.5)} />{p.vf && <ViewFinder t={t} />}</g>;
    }
    case 'room': {
      const chars: CharSpec[] = [];
      if (p.chars === 'window') chars.push(IL(950, 1500, poseStand({lean: 6, nod: 4}), false, ILYA_IN));
      if (p.chars === 'dress') { const w = E(t, p.t0 + 1.4, p.t0 + 2.4); chars.push(IL(1190, 1500, w < 1 ? poseReach(60, -280, {lean: 6}) : poseStand(), true, t < p.t0 + 2.2 ? ILYA_IN : ILYA_OUT)); }
      if (p.chars === 'blanket') chars.push(IL(900, 1500, poseCarry(t), true, ILYA_OUT));
      return <Room t={t} jacket={p.chars === 'dress' && t >= p.t0 + 2.2 ? 'none' : p.jacketNone ? 'none' : 'hang'} chars={chars} />;
    }
    case 'cellar': {
      const chars: CharSpec[] = [];
      if (p.chars === 'cellar') chars.push(IL(lerp(1340, 700, E(t, 154.3, 157.0)), 1500, poseWalk(t, 3), true, DED_IN), IL(lerp(1400, 960, E(t, 155.0, 157.2)), 1500, poseWalk(t, 3), true, ILYA_OUT));
      if (p.chars === 'cellarmin') chars.push(IL(1000, 1500, poseStand({nod: 6}), true, ILYA_OUT));
      return <Cellar t={t} chars={chars} />;
    }
    case 'shed': {
      const chars: CharSpec[] = [];
      if (p.chars === 'wood') chars.push(IL(lerp(300, 1100, E(t, 151.4, 154.0)), 1500, poseCarry(t), false, ILYA_OUT));
      return <g><Shed t={t} wood={p.wood} chars={chars} dark={darkAt(t)} /><SceneTint t={t} /></g>;
    }
    case 'village': {
      const chars: CharSpec[] = [];
      const gy = 1380;
      if (p.chars === 'exit') chars.push(IL(lerp(1180, 1450, E(t, 107.8, 109.1)), gy, poseWalk(t, 3), false, ILYA_OUT, 1));
      if (p.chars === 'max') chars.push(IL(1650, gy, poseStand({nod: 3}), true, MAX_OUT));
      if (p.chars === 'maxcar') chars.push(IL(1660, gy, poseReach(60, -170, {lean: 26}), false, MAX_OUT));
      if (p.chars === 'meet') chars.push(IL(lerp(1250, 1560, E(t, 114.8, 117.3)), gy, poseWalk(t, 3), false, ILYA_OUT), IL(1700, gy, poseReach(50, -170), true, MAX_OUT));
      if (p.chars === 'look') chars.push(IL(1580, gy, poseStand({nod: 6}), false, ILYA_OUT), IL(1700, gy, poseReach(40, -160), true, MAX_OUT));
      if (p.chars === 'carrywood') chars.push(IL(lerp(1500, 1180, E(t, 177.4, 183)), gy, poseCarry(t), true, ILYA_OUT));
      if (p.chars === 'maxsnow') chars.push(IL(1250, gy, poseShiver(t), false, {...MAX_OUT, jacket: '#c9d6e8', jacket2: '#e8f0fb'}));
      const oth = Array.isArray(p.others) ? lerp(p.others[0], p.others[1], E(t, p.others[2], p.others[3])) : p.others ?? 0;
      const old = p.oldAt ? E(t, p.oldAt, p.oldAt + 1.0) * (p.flickOld ? (Math.sin(t * 8) > -0.5 ? 1 : 0.5) : 1) : p.old ?? (t > 330 ? 1 : 0);
      const stillOld = sh.a >= 417 ? 1 : old;
      return (
        <g>
          <Village t={t} dark={p.dark ?? darkAt(t)} others={p.nohouses ? 0 : oth} old={stillOld} snowI={blizz} hood={p.hood || (t > 112.1 && t < 114.8)} cx={lerp(sh.cam[0], sh.cam[3], 0.5)} chars={chars} drifts={p.drifts ?? (t > 377 ? 0.4 : 0)} />
          {p.nohouses && <rect x={-400} y={-400} width={4400} height={2800} fill="#0c1424" opacity={0.55} />}
          {p.dim && <rect x={-400} y={-400} width={4400} height={2800} fill="#05080f" opacity={0.3} />}
          {p.vf && <ViewFinder t={t} />}
        </g>
      );
    }
    case 'kitchen': {
      const kp = kitchenProps(t, p);
      return <g><Kitchen {...kp} />{p.k === 'tv' || p.k === 'watch' ? null : null}</g>;
    }
    default: return null;
  }
};
const TvScreen2: React.FC<{mode: TvMode; t: number; banner: number; turn: number}> = ({mode, t, banner, turn}) => <TvSet x={0} y={0} s={1} mode={mode} t={t} banner={banner} turn={turn} />;
const SceneTint: React.FC<{t: number}> = ({t}) => null;

const ShotView: React.FC<{sh: Shot; t: number; hudOn: boolean}> = ({sh, t, hudOn}) => {
  const k = ease(clamp((t - sh.a) / Math.max(0.01, sh.b - sh.a)));
  const c = sh.cam;
  const fx = lerp(c[0], c[3], k), fy = lerp(c[1], c[4], k), s = lerp(c[2], c[5], k);
  const shk = sh.shake ?? 0;
  const dx = shk * Math.sin(t * 61), dy = shk * Math.cos(t * 53);
  const outdoor = ['village', 'shed', 'oldhouse', 'thermo'].includes(sh.sc);
  const sn = snowN(t);
  return (
    <AbsoluteFill>
      <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{position: 'absolute', left: 0, top: 0}}>
        <g transform={`translate(${540 + dx} ${960 + dy}) scale(${s}) translate(${-fx} ${-fy})`}>
          <SceneR sh={sh} t={t} />
        </g>
        {(sh.sc === 'village' || sh.sc === 'shed') && (
          <g>
            <Snow t={t} n={Math.round(sn * 0.7)} speed={90} wind={70} op={0.7} size={1.0} />
            <Snow t={t + 5} n={Math.round(sn * 0.35)} speed={260} wind={200} op={0.75} size={2.4} />
          </g>
        )}
        {outdoor && sh.sc === 'village' && dark(t) > 0.5 && null}
      </svg>
    </AbsoluteFill>
  );
};
const dark = darkAt;

export const M60: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPSM;
  const idx = SH.findIndex((s) => t >= s.a && t < s.b);
  const sh = SH[Math.max(0, idx)];
  const temp = tempAt(t);
  const red = t >= 394.2 ? 1 : 0;
  const hudMode = sh.hud ?? 'out';
  const hudSc = ['village', 'shed', 'kitchen', 'room', 'cellar', 'oldhouse'].includes(sh.sc) && t >= 35.4 && hudMode !== 'none';
  const SFX = (a: number, d: number, src: string, v: number | ((f: number) => number)) => (
    <Sequence key={`${src}${a}`} from={Math.round(a * FPSM)} durationInFrames={Math.round(d * FPSM)}>
      <Audio src={staticFile(`sfx/${src}.mp3`)} volume={v} />
    </Sequence>
  );
  const rampT = (pts: [number, number][]) => ramp(pts);
  const music = rampT([[0, 0.055], [27.5, 0.055], [28.6, 0.0], [35.5, 0.0], [36.5, 0.05], [129.3, 0.05], [129.9, 0.012], [135.6, 0.012], [136.5, 0.05], [258.0, 0.05], [259.0, 0], [262.5, 0], [264.5, 0.035], [319.0, 0.035], [319.65, 0], [324, 0], [326, 0.03], [392.2, 0.03], [392.6, 0], [396, 0], [398, 0.03], [425, 0.035], [477.2, 0.035], [478.8, 0], [490, 0]]);
  const wind = rampT([[0, 0.07], [35, 0.07], [36, 0.05], [180.5, 0.05], [182, 0.12], [190, 0.1], [259, 0.06], [260, 0.0], [262.5, 0.03], [320, 0.04], [322.2, 0.02], [324, 0.06], [330, 0.1], [365.5, 0.14], [368, 0.07], [392, 0.1], [430, 0.04], [478, 0.03], [488.3, 0]]);
  const hum = rampT([[0, 0.07], [28, 0.07], [28.6, 0.02], [34, 0.02], [35.5, 0], [259, 0], [260.3, 0.05], [320, 0.05], [322, 0], [412, 0], [414, 0.05], [477, 0.05], [478.8, 0], [482.2, 0.05], [484.5, 0.03], [488.2, 0], [490, 0]]);
  const fire = rampT([[0, 0], [48.5, 0], [50, 0.035], [258, 0.035], [262, 0.04], [490, 0.04]]);
  const radioNoise = rampT([[53.9, 0.0], [54, 0.025], [62, 0.025], [62.4, 0], [303.5, 0], [303.7, 0.05], [306.3, 0.02], [308.5, 0.012], [319.6, 0.1], [321.9, 0.1], [322.0, 0]]);
  const ev: React.ReactNode[] = [
    SFX(8.0, 0.4, 'click', 0.08), SFX(9.5, 0.4, 'click', 0.07), SFX(10.4, 0.4, 'click', 0.07), SFX(13.4, 0.3, 'tick', 0.1), SFX(14.9, 0.3, 'tick', 0.1),
    SFX(15.0, 2.0, 'horn', 0.07), SFX(16.1, 1.0, 'horn', 0.06),
    SFX(104.6, 1.0, 'creak', 0.07), SFX(108.0, 1.0, 'creak', 0.08), SFX(108.3, 1.0, 'crunch', 0.08), SFX(109.0, 0.6, 'crunch', 0.08),
    SFX(112.3, 0.8, 'diesel', 0.09), SFX(113.1, 0.8, 'diesel', 0.09), SFX(113.9, 0.8, 'diesel', 0.08),
    SFX(129.95, 0.8, 'notif', 0.1), SFX(133.0, 0.8, 'notif', 0.06),
    SFX(152.0, 0.6, 'thud', 0.09), SFX(152.6, 0.6, 'thud', 0.08),
    SFX(155.1, 0.6, 'creak', 0.07), SFX(158.0, 0.5, 'clank', 0.07), SFX(160.2, 0.5, 'clank', 0.08), SFX(161.0, 0.5, 'clank', 0.07), SFX(161.8, 0.5, 'glass', 0.06),
    SFX(167.0, 0.6, 'thud', 0.06), SFX(177.6, 0.6, 'thud', 0.08), SFX(179.0, 0.6, 'thud', 0.08), SFX(181.7, 1.2, 'whoosh', 0.1),
    SFX(204.5, 1.4, 'horn', 0.05), SFX(206.0, 1.4, 'horn', 0.05), SFX(208.2, 1.5, 'crack', 0.08), SFX(209.0, 1.0, 'thud', 0.09),
    SFX(218.4, 2.0, 'static', 0.06), SFX(238.6, 5.0, 'hum', 0.07), SFX(246.7, 5.0, 'static', ramp([[0, 0.01], [3.5, 0.05], [5, 0.06]])), SFX(251.7, 2.0, 'static', 0.08), SFX(253.6, 4.0, 'static', ramp([[0, 0.06], [4, 0.1]])),
    SFX(260.8, 0.8, 'click', 0.08), SFX(261.3, 0.6, 'click', 0.1), SFX(261.6, 1.4, 'hit', 0.16), SFX(262.6, 0.6, 'click', 0.08), SFX(264.0, 2.6, 'rumble', ramp([[0, 0.0], [1.0, 0.08], [2.6, 0.0]])),
    SFX(270.2, 0.4, 'click', 0.08), SFX(271.0, 0.4, 'click', 0.08), SFX(271.7, 0.4, 'click', 0.07), SFX(272.2, 0.4, 'click', 0.07),
    SFX(285.2, 0.8, 'notif', 0.06), SFX(295.1, 0.8, 'err', 0.07), SFX(298.0, 0.8, 'err', 0.07),
    SFX(319.65, 0.8, 'crack', 0.14), SFX(322.0, 0.5, 'click', 0.07),
    SFX(344.0, 0.5, 'thud', 0.05), SFX(348.0, 4.5, 'pour', ramp([[0, 0.04], [4.5, 0.06]])),
    SFX(337.0, 1.0, 'creak', 0.07), SFX(359.8, 0.5, 'knock', 0.14), SFX(360.3, 0.5, 'knock', 0.14), SFX(360.9, 0.5, 'knock', 0.14), SFX(365.7, 1.2, 'creak', 0.08),
    SFX(394.2, 1.4, 'hit', 0.2), SFX(412.6, 0.8, 'thud', 0.07), SFX(445.4, 0.4, 'click', 0.07),
    SFX(478.9, 0.4, 'click', 0.14), SFX(482.2, 1.6, 'sting', 0.22),
  ];
  const fadeBlack = t >= 488.24 || (t >= 259.7 && t < 260.35) || (t >= 33.8 && t < 35.45) ? 1 : 0;
  return (
    <AbsoluteFill style={{backgroundColor: '#000'}}>
      <Audio src={staticFile('voice10.mp3')} volume={1} />
      <Audio src={staticFile('sfx/m60.mp3')} volume={music} />
      <Audio src={staticFile('sfx/wind.mp3')} volume={wind} loop />
      <Audio src={staticFile('sfx/drone.mp3')} volume={hum} loop />
      <Audio src={staticFile('sfx/fire.mp3')} volume={fire} loop />
      <Audio src={staticFile('sfx/static.mp3')} volume={radioNoise} loop />
      {ev}
      <ShotView sh={sh} t={t} hudOn={hudSc} />
      {sh.sc === 'black' ? null : null}
      {hudSc && (
        <AbsoluteFill>
          <svg width={1080} height={1920} viewBox="0 0 1080 1920">
            <TempHud value={hudMode === 'home' ? 18 : temp} t={t} mode={hudMode === 'home' ? 'home' : 'out'} red={red} />
          </svg>
        </AbsoluteFill>
      )}
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 55%, rgba(4,8,18,0.5) 100%)'}} />
      <AutoSub t={t} subs={subsM as any} />
      <AbsoluteFill style={{backgroundColor: '#000', opacity: fadeBlack}} />
    </AbsoluteFill>
  );
};
