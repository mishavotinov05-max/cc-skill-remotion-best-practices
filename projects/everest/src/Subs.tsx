import React from 'react';
import {AbsoluteFill} from 'remotion';
import '@fontsource/montserrat/cyrillic-600.css';
import '@fontsource/montserrat/cyrillic-700.css';
import '@fontsource/montserrat/latin-600.css';
import '@fontsource/montserrat/latin-700.css';
import {clamp} from './util';

const strip = (w: string) => w.replace(/[.,:—…?!»«"]+/g, '').toLowerCase();

// One shared subtitle look for the series: Montserrat, soft outline, gentle bottom shade, amber key words.
export const StyledSub: React.FC<{t: number; subs: [number, number, string][]; hot?: Set<string>; bottom?: number; size?: number}> = ({t, subs, hot, bottom = 350, size = 62}) => {
  let p: [number, number, string] | undefined;
  for (const x of subs) if (t >= x[0] - 0.03 && t < x[1] + 0.14) p = x;
  const o = p ? Math.min(clamp((t - p[0] + 0.03) / 0.08), clamp((p[1] + 0.14 - t) / 0.08)) : 0;
  const rise = p ? (1 - clamp((t - p[0] + 0.03) / 0.14)) * 10 : 0;
  const words = p ? p[2].split(' ') : [];
  return (
    <>
      <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(0,0,0,0) 62%, rgba(0,0,0,0.5) 100%)', pointerEvents: 'none'}} />
      {p && (
        <AbsoluteFill style={{justifyContent: 'flex-end', alignItems: 'center', paddingBottom: bottom}}>
          <div style={{opacity: o, transform: `translateY(${rise}px)`, width: 900, textAlign: 'center', fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: size, lineHeight: 1.2, letterSpacing: '0.01em', color: '#ffffff', WebkitTextStroke: '5px rgba(6,6,10,0.88)', paintOrder: 'stroke fill', textShadow: '0 6px 20px rgba(0,0,0,0.7)'}}>
            {words.map((w, i) => (
              <span key={i} style={{color: hot && hot.has(strip(w)) ? '#ffd23f' : '#ffffff'}}>
                {w}
                {i < words.length - 1 ? ' ' : ''}
              </span>
            ))}
          </div>
        </AbsoluteFill>
      )}
    </>
  );
};
