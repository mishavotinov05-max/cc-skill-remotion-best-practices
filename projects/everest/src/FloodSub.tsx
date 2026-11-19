import React from 'react';
import {AbsoluteFill} from 'remotion';
import {clamp} from './util';

const RED = new Set(['ОШИБКИ', 'ОШИБКА', 'УПЛЫТЬ', 'СКОЛЬЗКАЯ', 'РАЗРУШАТЬСЯ', 'ТРЕСК', 'ПРОСЕДАТЬ', 'КОНТЕЙНЕР', 'ОПАСНОЕ', 'ПОТОК', 'КРАЮ', 'НАВОДНЕНИЕ', 'ГРОХОТА', 'ПРЫГАТЬ', 'СЕКУНДУ', 'ПОВРЕЖДЁН', 'СТОЛКНОВЕНИЯ']);
const YELLOW = new Set(['КРЫШЕ', 'КРЫШУ', 'ЧАСТИ', 'СТО', 'ДВЕНАДЦАТЬ', 'ДВАДЦАТЬ', 'МЕТРОВ', 'ФОНАРИКОМ', 'СПАСАТЕЛЕЙ', 'ОДИН', 'ДВА', 'ТРИ', 'НОМЕР', 'ТЕЛЕФОН', 'БЕЗОПАСНОМ', 'ЛОДКУ', 'ГРУЗОВОЙ']);
const colorOf = (w: string) => (RED.has(w) ? '#ff4a4a' : YELLOW.has(w) ? '#f2c94c' : '#ffffff');

export const FloodSub: React.FC<{t: number; subs: [number, number, string][]}> = ({t, subs}) => {
  let p: [number, number, string] | undefined;
  for (const x of subs) if (t >= x[0] - 0.03 && t < x[1] + 0.12) p = x;
  if (!p) return null;
  const k = clamp((t - p[0] + 0.03) / 0.1);
  const o = Math.min(k, clamp((p[1] + 0.12 - t) / 0.06));
  const words = p[2].split(' ');
  return (
    <AbsoluteFill style={{justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 320}}>
      <div style={{opacity: o, transform: `scale(${0.92 + 0.08 * k})`, width: 960, textAlign: 'center', fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: 92, lineHeight: 1.04, WebkitTextStroke: '10px #05070f', paintOrder: 'stroke fill', textShadow: '0 8px 0 rgba(0,0,0,0.35)'}}>
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
