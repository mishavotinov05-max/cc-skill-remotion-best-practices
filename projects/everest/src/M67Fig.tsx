import React from 'react';
import {Look, Pose, Person, lerp} from './M60Base';

// Front / back / 3-4 view person so the hero is not always in profile.
type Mode = 'stand' | 'walk' | 'run' | 'sit' | 'scared' | 'hands';
export const PersonV: React.FC<{
  x: number; y: number; look: Look; view?: 'front' | 'back'; mode?: Mode; t?: number; s?: number;
  mood?: 'neutral' | 'worried' | 'scared' | 'happy'; sway?: number; shadow?: boolean; turn?: number;
}> = ({x, y, look, view = 'front', mode = 'stand', t = 0, s = 1, mood = 'worried', sway = 0, shadow = true, turn = 0}) => {
  const fat = look.fat ?? 1;
  const skin = look.skin ?? '#cda080';
  const sp = mode === 'run' ? 4.6 : mode === 'walk' ? 2.0 : 0;
  const ph = t * sp * Math.PI * 2;
  const sn = Math.sin(ph), cs = Math.cos(ph);
  const sit = mode === 'sit' || mode === 'hands';
  const amp = mode === 'run' ? 1 : mode === 'walk' ? 0.5 : 0;
  const bob = mode === 'run' ? Math.abs(cs) * 10 : mode === 'walk' ? Math.abs(cs) * 4 : Math.sin(t * 1.4) * 1.2;
  const hipY = sit ? -52 : -118 - bob * 0.4;
  const front = view === 'front';
  const shY = hipY - 104;
  const headY = shY - 44;
  // legs
  const leg = (side: 1 | -1) => {
    const lift = Math.max(0, (side === 1 ? sn : -sn)) * 34 * amp;
    const fwd = (side === 1 ? sn : -sn) * 14 * amp; // foreshortened step toward / away from viewer
    const hx = side * 15 * fat;
    if (sit) {
      return (
        <g key={side}>
          <path d={`M${hx} ${hipY} L${side * 30 * fat} -74 L${side * 28 * fat} -10`} stroke={look.pants} strokeWidth={34 * fat} strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <path d={`M${side * 28 * fat - 17} -4 L${side * 28 * fat + 17} -4 L${side * 28 * fat + 20} 10 L${side * 28 * fat - 20} 10 Z`} fill={look.boot} />
        </g>
      );
    }
    const fy = -lift;
    return (
      <g key={side}>
        <path d={`M${hx} ${hipY} L${hx + side * 2} ${(hipY + fy) / 2 - fwd * 0.3} L${hx + side * 4} ${fy - 6}`} stroke={look.pants} strokeWidth={36 * fat} strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <path d={`M${hx + side * 4 - 19} ${fy - 14} L${hx + side * 4 + 19} ${fy - 14} L${hx + side * 4 + 22} ${fy + 6} L${hx + side * 4 - 22} ${fy + 6} Z`} fill={look.boot} stroke="#000" strokeOpacity={0.4} strokeWidth={2} />
        {front && <ellipse cx={hx + side * 4} cy={fy + 4} rx={18} ry={5} fill="#000" opacity={0.18} />}
      </g>
    );
  };
  // arms
  const arm = (side: 1 | -1) => {
    const swing = (side === 1 ? -sn : sn) * 26 * amp;
    const sx = side * 38 * fat;
    let ex = side * 52 * fat, ey = shY + 112 + swing * 0.4;
    if (mode === 'scared') { ex = side * 44; ey = shY + 40; }
    if (mode === 'hands') { ex = side * 14; ey = shY - 16; }
    if (mode === 'sit') { ex = side * 46; ey = shY + 96; }
    const mx = (sx + ex) / 2 + side * 6, my = (shY + 8 + ey) / 2;
    return (
      <g key={side}>
        <path d={`M${sx} ${shY + 10} L${mx} ${my} L${ex} ${ey}`} stroke={look.arm ?? look.jacket} strokeWidth={26 * fat} strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <circle cx={ex} cy={ey + 4} r={13} fill={look.glove} />
      </g>
    );
  };
  const brow = mood === 'scared' ? -16 : mood === 'worried' ? -14 : -12;
  const hairCol = look.hair ?? '#1a1512';
  const tilt = turn * 14;
  return (
    <g transform={`translate(${x} ${y}) scale(${s}) rotate(${sway} 0 0)`}>
      {shadow && <ellipse cx={0} cy={5} rx={70 * fat} ry={9} fill="#000" opacity={0.3} />}
      {leg(-1)}{leg(1)}
      {/* torso */}
      <g>
        <rect x={-34 * fat} y={shY - 6} width={68 * fat} height={116} rx={26} fill={look.jacket} />
        <rect x={-34 * fat} y={shY - 6} width={26 * fat} height={116} rx={13} fill={look.jacket2} opacity={0.3} />
        {front ? <>
          <rect x={-2} y={shY + 8} width={4} height={96} fill="#000" opacity={0.3} />
          <path d={`M-18 ${shY - 4} L0 ${shY + 18} L18 ${shY - 4}`} stroke="#000" strokeOpacity={0.35} strokeWidth={4} fill="none" />
          <rect x={-26 * fat} y={shY + 74} width={52 * fat} height={5} fill="#000" opacity={0.2} />
        </> : <>
          <path d={`M-24 ${shY + 4} Q0 ${shY + 22} 24 ${shY + 4}`} stroke="#000" strokeOpacity={0.3} strokeWidth={4} fill="none" />
          <rect x={-2} y={shY + 20} width={4} height={80} fill="#000" opacity={0.18} />
        </>}
      </g>
      {arm(-1)}{arm(1)}
      {/* neck + head */}
      <g transform={`translate(0 ${headY}) rotate(${tilt})`}>
        <rect x={-14} y={16} width={28} height={26} rx={8} fill={skin} />
        {front ? (
          <g>
            <ellipse cx={-31} cy={4} rx={7} ry={10} fill={skin} /><ellipse cx={31} cy={4} rx={7} ry={10} fill={skin} />
            <circle cx={0} cy={0} r={31} fill={skin} />
            <path d="M-32 -2 Q-34 -36 0 -36 Q34 -36 32 -2 Q22 -18 0 -18 Q-22 -18 -32 -2 Z" fill={hairCol} />
            {look.hat === 'beanie' && <g><path d="M-34 -2 Q-34 -42 0 -42 Q34 -42 34 -2 Z" fill={look.hatCol ?? '#777'} /><rect x={-35} y={-12} width={70} height={11} rx={5} fill={look.hatCol ?? '#777'} /></g>}
            {[-1, 1].map((sd) => <g key={sd}><ellipse cx={sd * 12} cy={-2} rx={7} ry={mood === 'scared' ? 7.5 : 6} fill="#fff" /><circle cx={sd * 12 + turn * 3} cy={-2} r={3.4} fill="#1a1a22" /><path d={`M${sd * 5} ${brow + (sd === 1 ? 0 : 0)} L${sd * 20} ${brow + (mood === 'worried' || mood === 'scared' ? -3 : 0)}`} stroke={hairCol} strokeWidth={3.4} strokeLinecap="round" /></g>)}
            <path d="M-2 4 Q0 12 4 12" stroke="#000" strokeOpacity={0.25} strokeWidth={2.4} fill="none" />
            {mood === 'scared' ? <ellipse cx={0} cy={20} rx={6} ry={6.5} fill="#5a2a2a" /> : mood === 'happy' ? <path d="M-9 17 Q0 25 9 17" stroke="#7a3a30" strokeWidth={3} fill="none" strokeLinecap="round" /> : <path d={`M-8 ${mood === 'worried' ? 21 : 19} Q0 ${mood === 'worried' ? 16 : 22} 8 ${mood === 'worried' ? 21 : 19}`} stroke="#7a3a30" strokeWidth={3} fill="none" strokeLinecap="round" />}
            {look.stubble && Array.from({length: 22}).map((_, i) => <circle key={i} cx={-14 + (i % 7) * 4.6} cy={13 + Math.floor(i / 7) * 5} r={1.2} fill="#2a2420" opacity={0.55} />)}
          </g>
        ) : (
          <g>
            <ellipse cx={-31} cy={6} rx={6} ry={9} fill={skin} /><ellipse cx={31} cy={6} rx={6} ry={9} fill={skin} />
            <circle cx={0} cy={0} r={31} fill={skin} />
            <path d="M-32 6 Q-36 -38 0 -38 Q36 -38 32 6 Q26 28 0 30 Q-26 28 -32 6 Z" fill={hairCol} />
            {look.hat === 'beanie' && <g><path d="M-34 4 Q-34 -44 0 -44 Q34 -44 34 4 L34 0 Q0 -10 -34 0 Z" fill={look.hatCol ?? '#777'} /><rect x={-35} y={-12} width={70} height={11} rx={5} fill={look.hatCol ?? '#777'} /></g>}
            <path d="M-20 -22 Q0 -30 20 -22" stroke="#000" strokeOpacity={0.25} strokeWidth={3} fill="none" />
          </g>
        )}
      </g>
    </g>
  );
};

// Generic hero: chooses between profile rig and front/back rig.
export const HeroV: React.FC<{x: number; y: number; look: Look; v?: 'side' | 'front' | 'back'; pose?: Pose; mode?: Mode; t: number; s?: number; flip?: boolean; mood?: 'neutral' | 'worried' | 'scared' | 'happy'; turn?: number}> = ({x, y, look, v = 'side', pose, mode = 'stand', t, s = 1.4, flip, mood = 'worried', turn = 0}) =>
  v === 'side' && pose ? <Person x={x} y={y} look={look} pose={pose} flip={flip} s={s} /> : <PersonV x={x} y={y} look={look} view={v === 'back' ? 'back' : 'front'} mode={mode} t={t} s={s} mood={mood} turn={turn} />;

void lerp;
