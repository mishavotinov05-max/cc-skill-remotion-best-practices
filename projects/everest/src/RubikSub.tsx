import React from 'react';
import '@fontsource/montserrat/cyrillic-800.css';
import '@fontsource/montserrat/latin-800.css';
import {AbsoluteFill} from 'remotion';
import {clamp} from './util';

export type RW = [string, number, number];
export const RubikSub: React.FC<{t: number; subs: [number, number, RW[]][]}> = ({t, subs}) => {
  let p: [number, number, RW[]] | undefined;
  for (const x of subs) if (t >= x[0] - 0.04 && t < x[1] + 0.1) p = x;
  if (!p) return null;
  const k = clamp((t - p[0] + 0.04) / 0.1);
  const o = Math.min(k, clamp((p[1] + 0.1 - t) / 0.06));
  return (
    <AbsoluteFill style={{justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 70}}>
      <div style={{opacity: o, transform: `translateY(${(1 - k) * 10}px)`, width: 1720, textAlign: 'center', fontFamily: 'Montserrat, sans-serif', fontWeight: 800, fontSize: 68, lineHeight: 1.15, textTransform: 'uppercase', letterSpacing: 0, WebkitTextStroke: '8px #05070f', paintOrder: 'stroke fill', textShadow: '0 5px 0 rgba(0,0,0,0.35)'}}>
        {p[2].map(([w, s, e], i) => {
          const on = t >= s - 0.02 && t < e + 0.12;
          return (
            <span key={i} style={{display: 'inline-block', color: on ? '#ff3030' : '#ffffff', marginRight: 20, textShadow: on ? '0 0 22px rgba(255,48,48,0.75), 0 5px 0 rgba(0,0,0,0.35)' : undefined}}>
              {w}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
