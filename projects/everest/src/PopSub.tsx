import React from 'react';
import {AbsoluteFill} from 'remotion';
import '@fontsource/montserrat/cyrillic-700.css';
import '@fontsource/montserrat/latin-700.css';
import {clamp} from './util';

const GREEN = new Set(['МИЛЛИАРД', 'ДОЛЛАРОВ', 'ДЕНЬГИ', 'СЧЁТЕ', 'СЧЕТЕ', 'МАШИНУ', 'ОСОБНЯК', 'ДОРОГУЮ', 'ДОРОГОЕ', 'БАССЕЙНОМ']);
const PINK = new Set(['МАМА', 'МАМЕ', 'СЫНОК', 'ЛЮБИШЬ', 'МАМУ', 'МАМЫ']);
const YELLOW = new Set(['НЕДЕЛЮ', 'МОЛЧАНИЯ', 'ШЕСТЬ', 'МИНУТЫ', 'ДНЕЙ', 'ДОМАШКУ', 'ПАСПОРТ', 'ИСПЫТАНИЯ', 'СЛОВО', 'ПРИМЕР']);
const RED = new Set(['ЛИШУСЬ', 'ДВОЙКУ', 'ВСЕГО', 'ДА', 'МОЛЧАЛ', 'ПОНЯЛ']);
const colorOf = (w: string) => (GREEN.has(w) ? '#46e88a' : PINK.has(w) ? '#ff7ad9' : YELLOW.has(w) ? '#ffd23f' : RED.has(w) ? '#ff5050' : '#ffffff');

// Big all-caps subtitles with coloured key words, centred lower-middle (the look of the reference video).
export const PopSub: React.FC<{t: number; subs: [number, number, string][]}> = ({t, subs}) => {
  let p: [number, number, string] | undefined;
  for (const x of subs) if (t >= x[0] - 0.03 && t < x[1] + 0.12) p = x;
  if (!p) return null;
  const k = clamp((t - p[0] + 0.03) / 0.1);
  const o = Math.min(k, clamp((p[1] + 0.12 - t) / 0.06));
  const scale = 0.9 + 0.1 * k;
  const words = p[2].split(' ');
  return (
    <AbsoluteFill style={{justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 400}}>
      <div style={{opacity: o, transform: `scale(${scale})`, width: 960, textAlign: 'center', fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: 92, lineHeight: 1.04, letterSpacing: '0.01em', WebkitTextStroke: '10px #0b0b14', paintOrder: 'stroke fill', textShadow: '0 8px 0 rgba(0,0,0,0.35)'}}>
        {words.map((w, i) => (
          <span key={i} style={{color: colorOf(w.replace(/[?!]/g, ''))}}>
            {w}
            {i < words.length - 1 ? ' ' : ''}
          </span>
        ))}
      </div>
    </AbsoluteFill>
  );
};
