import React from 'react';
import {AbsoluteFill} from 'remotion';
import {clamp} from './util';

export type AW = [string, number, number];
export const AutoSub: React.FC<{t: number; subs: [number, number, AW[]][]; fs?: number; pb?: number; w?: number}> = ({t, subs, fs = 84, pb = 120, w = 980}) => {
  let p: [number, number, AW[]] | undefined;
  for (const x of subs) if (t >= x[0] - 0.04 && t < x[1] + 0.1) p = x;
  if (!p) return null;
  const k = clamp((t - p[0] + 0.04) / 0.1);
  const o = Math.min(k, clamp((p[1] + 0.1 - t) / 0.06));
  return (
    <AbsoluteFill style={{justifyContent: 'flex-end', alignItems: 'center', paddingBottom: pb}}>
      <div style={{opacity: o, transform: `translateY(${(1 - k) * 14}px)`, width: w, textAlign: 'center', fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: fs, lineHeight: 1.08, WebkitTextStroke: '10px #05070f', paintOrder: 'stroke fill', textShadow: '0 8px 0 rgba(0,0,0,0.35)'}}>
        {p[2].map(([w, s, e], i) => {
          const on = t >= s - 0.02 && t < e + 0.12;
          const past = t >= e + 0.12;
          const pop = on ? 1 + 0.08 * clamp(1 - (t - s) / 0.15) : 1;
          return (
            <span key={i} style={{display: 'inline-block', color: on ? '#39ff88' : past ? '#ffffff' : '#c9d2e6', transform: `scale(${pop})`, marginRight: Math.round(fs * 0.3), textShadow: on ? '0 0 28px rgba(57,255,136,0.9), 0 8px 0 rgba(0,0,0,0.35)' : undefined}}>
              {w}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
