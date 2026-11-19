import React from 'react';
import '@fontsource/montserrat/cyrillic-800.css';
import '@fontsource/montserrat/latin-800.css';
import {AbsoluteFill, staticFile} from 'remotion';
import {poseStand} from './M60Base';
import {Corridor, Bike, Man, MAXIM, GENN} from './M65Art';

export const M65Cover: React.FC = () => {
  const stroke = {fontFamily: 'Montserrat, sans-serif', fontWeight: 800 as const, textTransform: 'uppercase' as const};
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{position: 'absolute'}}>
        <g transform="translate(960 560) scale(1.5) translate(-2700 -520)">
          <Corridor t={1.5} lights={0.8} dark={0.38} flick={1} bike={-1} />
          <Bike x={2540} y={738} s={1.5} flip={false} rot={20} />
          {/* tall shadow figure at the far door */}
          <g transform="translate(3150 1010)"><rect x={-42} y={-410} width={84} height={320} rx={40} fill="#010203" /><circle cx={0} cy={-440} r={42} fill="#010203" />
            <rect x={-40} y={-110} width={28} height={110} fill="#010203" /><rect x={12} y={-110} width={28} height={110} fill="#010203" />
            <path d="M-24 -432 Q0 -408 24 -432" stroke="#e8f0e0" strokeWidth={4} fill="none" opacity={0.85} />
            <circle cx={-14} cy={-452} r={4} fill="#e8f0e0" /><circle cx={14} cy={-452} r={4} fill="#e8f0e0" />
          </g>
          <Man x={2230} y={1010} pose={poseStand({mood: 'scared', nod: 4, lean: 4})} look={MAXIM} s={1.5} />
        </g>
        <rect width={1920} height={1080} fill="#ff2a2a" opacity={0.06} />
      </svg>
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 55% 55%, rgba(0,0,0,0) 30%, rgba(0,2,6,0.82) 100%)'}} />
      <AbsoluteFill style={{backgroundImage: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.2) 0px, rgba(0,0,0,0.2) 2px, rgba(0,0,0,0) 2px, rgba(0,0,0,0) 5px)'}} />
      <AbsoluteFill style={{backgroundImage: 'url(' + staticFile('noise.png') + ')', backgroundSize: '256px 256px', opacity: 0.12, mixBlendMode: 'overlay'}} />
      <div style={{position: 'absolute', left: 70, top: 46, ...stroke, color: '#FF3535', fontSize: 54, letterSpacing: 10, textShadow: '0 0 24px rgba(255,53,53,0.7)'}}>● REC · НОЧНАЯ СМЕНА</div>
      <div style={{position: 'absolute', left: 64, top: 120, ...stroke, color: '#fff', fontSize: 150, lineHeight: 0.98, WebkitTextStroke: '10px #05070f', paintOrder: 'stroke fill', textShadow: '8px 0 0 rgba(255,40,40,0.55), -8px 0 0 rgba(40,220,255,0.4)'}}>Детский<br />сад № 17</div>
      <div style={{position: 'absolute', right: 60, bottom: 56, transform: 'rotate(-3deg)', background: '#FF3535', border: '8px solid #fff', borderRadius: 24, padding: '10px 40px', ...stroke, color: '#fff', fontSize: 78, textAlign: 'center', lineHeight: 1.05, boxShadow: '0 12px 40px rgba(0,0,0,0.6)'}}>
        60 000 ₽ за ночь<div style={{fontSize: 40, letterSpacing: 3}}>7 правил · не нарушай</div>
      </div>
    </AbsoluteFill>
  );
};
