import React from 'react';
import '@fontsource/montserrat/cyrillic-700.css';
import '@fontsource/montserrat/latin-700.css';
import {clamp, ease, lerp, rnd} from './util';
import {ik2, mixc, P, E, FONT, V} from './ShelterArt';
export {clamp, ease, lerp, rnd, mixc, P, E, FONT};
export type {V};

export const Tx: React.FC<{x: number; y: number; size?: number; fill?: string; anchor?: 'start' | 'middle' | 'end'; children: React.ReactNode; o?: number; stroke?: string; rot?: number; ls?: number}> = ({x, y, size = 48, fill = '#fff', anchor = 'middle', children, o = 1, stroke, rot = 0, ls = 0}) => (
  <text x={x} y={y} textAnchor={anchor} fontFamily={FONT} fontWeight={700} fontSize={size} fill={fill} opacity={o} stroke={stroke} strokeWidth={stroke ? 8 : 0} paintOrder="stroke" letterSpacing={ls} transform={rot ? `rotate(${rot} ${x} ${y})` : undefined}>
    {children}
  </text>
);

// ====================== people (faceless silhouettes) ======================
export type Look = {jacket: string; jacket2: string; pants: string; glove: string; boot: string; hood?: boolean; goggles?: boolean; hat?: 'fur' | 'beanie' | 'none'; hatCol?: string; beard?: boolean; hair?: string; skin?: string; fat?: number; pack?: boolean};
export const ILYA_OUT: Look = {jacket: '#33425e', jacket2: '#445678', pants: '#2c3a56', glove: '#1f2430', boot: '#3a2e28', hat: 'beanie', hatCol: '#1f2430', hair: '#2a2420', skin: '#3a3036', hood: false, goggles: false, pack: false};
export const ILYA_IN: Look = {jacket: '#5b6676', jacket2: '#6e7a8c', pants: '#2c3a56', glove: '#5b6676', boot: '#3a2e28', hood: false, goggles: false, hair: '#2a2420', skin: '#3a3036'};
export const DED_IN: Look = {jacket: '#6a5038', jacket2: '#80634a', pants: '#3a3d46', glove: '#6a5038', boot: '#5a4632', hat: 'none', beard: true, hair: '#9a9aa4', skin: '#3a3036', fat: 1.12};
export const DED_OUT: Look = {jacket: '#5b3f27', jacket2: '#70502f', pants: '#3a2c20', glove: '#2a1f16', boot: '#6a5a46', hat: 'fur', hatCol: '#4a3220', beard: true, hair: '#9a9aa4', skin: '#3a3036', fat: 1.12};
export const MAX_OUT: Look = {jacket: '#1f4a33', jacket2: '#2b6045', pants: '#252a33', glove: '#2a2f3a', boot: '#1a1c22', hat: 'beanie', hatCol: '#7a7f8a', hair: '#2a2420', skin: '#3a3036', fat: 1.05};
export type Pose = {hip: V; lean: number; lf: V; lb: V; hf: V; hb: V; nod?: number; hold?: React.ReactNode};
export const Person: React.FC<{x: number; y: number; look: Look; pose: Pose; flip?: boolean; s?: number; shadow?: boolean}> = ({x, y, look, pose, flip, s = 1, shadow = true}) => {
  const {hip, lean, lf, lb, hf, hb, nod = 0, hold} = pose;
  const fat = look.fat ?? 1;
  const la = (lean * Math.PI) / 180;
  const sh: V = [hip[0] + Math.sin(la) * 105, hip[1] - Math.cos(la) * 105];
  const na = la + (nod * Math.PI) / 180;
  const hd: V = [sh[0] + Math.sin(na) * 42, sh[1] - Math.cos(na) * 42];
  const lgF = ik2([hip[0] + 6, hip[1]], lf, 60, 60, (a, b) => a[0] > b[0]);
  const lgB = ik2([hip[0] - 6, hip[1]], lb, 60, 60, (a, b) => a[0] > b[0]);
  const ar1 = ik2([sh[0] + 4, sh[1] + 6], hf, 46, 46, (a, b) => a[1] > b[1]);
  const ar2 = ik2([sh[0] - 4, sh[1] + 6], hb, 46, 46, (a, b) => a[1] > b[1]);
  const Seg = ({a, b, c, w, col}: {a: V; b: V; c: V; w: number; col: string}) => <polyline points={`${a} ${b} ${c}`} stroke={col} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" fill="none" />;
  const boot = (p: V) => (
    <g transform={`translate(${p[0]} ${p[1]})`}>
      <path d="M-16 -16 L10 -16 L30 2 Q34 12 22 12 L-14 12 Q-22 10 -16 -16 Z" fill={look.boot} stroke="#000" strokeOpacity={0.4} strokeWidth={2} />
    </g>
  );
  const skin = look.skin ?? '#3a3036';
  return (
    <g transform={flip ? `translate(${x} ${y}) scale(${-s} ${s})` : `translate(${x} ${y}) scale(${s})`}>
      {shadow && <ellipse cx={0} cy={4} rx={70} ry={8} fill="#000" opacity={0.28} />}
      <Seg a={[hip[0] - 6, hip[1]]} b={lgB.j} c={lgB.e} w={34 * fat} col={look.pants} />
      {boot(lgB.e)}
      <Seg a={[sh[0] - 4, sh[1] + 6]} b={ar2.j} c={ar2.e} w={24 * fat} col={look.jacket} />
      <circle cx={ar2.e[0]} cy={ar2.e[1]} r={12} fill={look.glove} />
      <g transform={`translate(${hip[0]} ${hip[1]}) rotate(${lean})`}>
        {look.pack && <rect x={-54} y={-92} width={30} height={74} rx={12} fill="#2a303b" />}
        <rect x={-27 * fat} y={-108} width={54 * fat} height={112} rx={24} fill={look.jacket} />
        <rect x={-27 * fat} y={-108} width={20 * fat} height={112} rx={10} fill={look.jacket2} opacity={0.35} />
        <rect x={-3} y={-100} width={5} height={92} rx={2} fill="#000" opacity={0.25} />
      </g>
      <Seg a={[hip[0] + 6, hip[1]]} b={lgF.j} c={lgF.e} w={36 * fat} col={look.pants} />
      {boot(lgF.e)}
      <g transform={`translate(${hd[0]} ${hd[1]}) rotate(${lean + nod})`}>
        <rect x={-14} y={16} width={28} height={22} rx={8} fill={look.hood ? '#101218' : skin} />
        {look.hood ? (
          <g>
            <circle cx={0} cy={0} r={32} fill="#15181e" />
            <path d="M-32 0 Q-30 -30 4 -34 Q30 -34 34 -6 Q22 -22 4 -20 Q-14 -20 -24 6 Z" fill="#232831" />
            <ellipse cx={8} cy={4} rx={24} ry={24} fill="#0d0f13" />
            {look.goggles && (
              <g>
                <rect x={-2} y={-12} width={40} height={22} rx={9} fill="#0a0c10" stroke="#3a4050" strokeWidth={2} />
                <rect x={0} y={-10} width={36} height={18} rx={8} fill="#2c4f78" />
                <path d="M6 -8 L18 -8 L10 6 L2 6 Z" fill="#fff" opacity={0.28} />
              </g>
            )}
          </g>
        ) : (
          <g>
            <circle cx={0} cy={0} r={30} fill={skin} />
            {look.hat !== 'fur' && look.hat !== 'beanie' && <path d={`M-30 -4 Q-30 -34 0 -34 Q30 -34 30 -4 Q14 -22 0 -22 Q-14 -22 -30 -4 Z`} fill={look.hair ?? '#15171c'} />}
            {look.hat === 'beanie' && <path d="M-32 -2 Q-32 -38 0 -38 Q32 -38 32 -2 L32 6 L-32 6 Z" fill={look.hatCol ?? '#777'} />}
            {look.hat === 'fur' && <g><path d="M-36 -4 Q-34 -40 0 -40 Q34 -40 36 -4 L36 8 L-36 8 Z" fill={look.hatCol ?? '#4a3220'} /><rect x={-38} y={2} width={76} height={12} rx={6} fill="#6a4a2e" /></g>}
            {look.beard && <path d="M-22 6 Q-10 36 10 36 Q26 30 26 8 Q8 18 -22 6 Z" fill={look.hair ?? '#9a9aa4'} />}
          </g>
        )}
      </g>
      <Seg a={[sh[0] + 4, sh[1] + 6]} b={ar1.j} c={ar1.e} w={26 * fat} col={look.jacket} />
      <circle cx={ar1.e[0]} cy={ar1.e[1]} r={13} fill={look.glove} />
      {hold}
    </g>
  );
};
const P0: Pose = {hip: [0, -118], lean: 5, lf: [18, 0], lb: [-16, 0], hf: [34, -128], hb: [-12, -126], nod: 0};
export const poseStand = (o: Partial<Pose> = {}): Pose => ({...P0, ...o});
export const poseWalk = (t: number, sp = 3.2, lean = 8, o: Partial<Pose> = {}): Pose => {
  const ph = t * sp * Math.PI * 2;
  const sn = Math.sin(ph), cs = Math.cos(ph);
  return {hip: [0, -118 + Math.abs(cs) * 4], lean, lf: [26 * sn, -Math.max(0, 18 * cs)], lb: [-26 * sn, -Math.max(0, -18 * cs)], hf: [30 + 14 * sn, -118], hb: [-10 - 14 * sn, -118], nod: 0, ...o};
};
export const poseSit = (o: Partial<Pose> = {}): Pose => ({hip: [0, -66], lean: 6, lf: [74, 0], lb: [50, 0], hf: [64, -80], hb: [22, -70], nod: 4, ...o});
export const poseCarry = (t: number, sp = 3.0): Pose => poseWalk(t, sp, 10, {hf: [64, -150], hb: [34, -142]});
export const poseShiver = (t: number): Pose => ({hip: [Math.sin(t * 38) * 1.4, -112], lean: 14, lf: [12, 0], lb: [-14, 0], hf: [28, -186], hb: [8, -176], nod: 8});
export const poseReach = (hx: number, hy: number, o: Partial<Pose> = {}): Pose => ({...P0, lean: 6, hf: [hx, hy], hb: [hx - 24, hy + 6], ...o});

// ====================== particles / atmosphere ======================
export const Snow: React.FC<{t: number; n?: number; speed?: number; wind?: number; op?: number; w?: number; h?: number; size?: number; x0?: number; y0?: number}> = ({t, n = 70, speed = 90, wind = 30, op = 0.8, w = 1080, h = 1920, size = 1, x0 = 0, y0 = 0}) => (
  <g>
    {Array.from({length: n}).map((_, i) => {
      const sp = speed * (0.6 + rnd(i + 1) * 0.8);
      const y = ((rnd(i) * (h + 200) + t * sp) % (h + 200)) - 100 + y0;
      const x = ((((rnd(i + 7) * w + t * wind * (0.5 + rnd(i + 2)) + Math.sin(t * 1.3 + i) * 14) % (w + 100)) + w + 100) % (w + 100)) - 50 + x0;
      return <circle key={i} cx={x} cy={y} r={(1.5 + rnd(i + 3) * 3.5) * size} fill="#dfe9f7" opacity={op * (0.4 + rnd(i + 4) * 0.6)} />;
    })}
  </g>
);
export const Glow: React.FC<{x: number; y: number; r: number; c: string; o: number; id: string}> = ({x, y, r, c, o, id}) => (
  <g>
    <defs>
      <radialGradient id={id} cx="0.5" cy="0.5" r="0.5">
        <stop offset="0" stopColor={c} stopOpacity={o} />
        <stop offset="1" stopColor={c} stopOpacity={0} />
      </radialGradient>
    </defs>
    <circle cx={x} cy={y} r={r} fill={`url(#${id})`} />
  </g>
);

// ====================== HUD ======================
export const TempHud: React.FC<{value: number; t: number; mode?: 'out' | 'home'; red?: number; show?: number}> = ({value, t, mode = 'out', red = 0, show = 1}) => {
  const col = mixc('#ffffff', '#ff4a4a', red);
  const v = Math.round(value);
  return (
    <g opacity={show}>
      <rect x={34} y={96} width={mode === 'home' ? 380 : 330} height={92} rx={24} fill="#0a1020" opacity={0.62} />
      {mode === 'out' ? (
        <g transform="translate(78 142)" stroke="#bfe3ff" strokeWidth={4} strokeLinecap="round">
          {[0, 60, 120].map((a) => <line key={a} x1={-16} y1={0} x2={16} y2={0} transform={`rotate(${a})`} />)}
        </g>
      ) : (
        <g transform="translate(78 142)"><path d="M0 -20 Q14 -2 10 10 Q8 18 0 18 Q-8 18 -10 10 Q-14 -4 -4 -10 Q-2 -2 2 -4 Q4 -12 0 -20 Z" fill="#ff9a2a" /></g>
      )}
      <text x={mode === 'home' ? 360 : 308} y={160} textAnchor="end" fontFamily={FONT} fontWeight={700} fontSize={60} fill={col}>{`${v > 0 ? '+' : v < 0 ? '−' : ''}${Math.abs(v)}°C`}</text>
    </g>
  );
};
