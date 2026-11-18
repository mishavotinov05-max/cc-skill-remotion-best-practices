import React from 'react';
import '@fontsource/montserrat/cyrillic-800.css';
import '@fontsource/montserrat/latin-800.css';
import {AbsoluteFill, staticFile} from 'remotion';
import {poseStand} from './M60Base';
import {CityNight, Man, VASYA_PK, ANDREY} from './M66Art';

export const M66Cover: React.FC = () => {
  const st = {fontFamily: 'Montserrat, sans-serif', fontWeight: 800 as const, textTransform: 'uppercase' as const};
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{position: 'absolute'}}>
        <g transform="translate(960 600) scale(1.25) translate(-2450 -640)">
          <CityNight t={2} p={{L: 0, jam: 1, lit: 1, cx: 2450, day: 0.1} as any} />
          <polygon points="2000,860 2840,430 2840,760" fill="#fff6c8" opacity={0.12} />
          <Man x={1940} y={1015} pose={poseStand({mood: 'scared', nod: -4, lean: 4, hf: [70, -140], hb: [30, -130]})} look={VASYA_PK} s={1.75} />
          <Man x={2150} y={1022} pose={poseStand({mood: 'worried'})} look={ANDREY} s={1.7} />
        </g>
      </svg>
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 62% 50%, rgba(0,0,0,0) 28%, rgba(0,2,6,0.78) 100%)'}} />
      <AbsoluteFill style={{backgroundImage: 'url(' + staticFile('noise.png') + ')', backgroundSize: '256px 256px', opacity: 0.08, mixBlendMode: 'overlay'}} />
      <div style={{position: 'absolute', left: 64, top: 50, ...st, color: '#ff4a3a', fontSize: 52, letterSpacing: 10, textShadow: '0 0 24px rgba(255,74,58,0.7)'}}>● 30 суток без света</div>
      <div style={{position: 'absolute', left: 60, top: 118, ...st, color: '#fff', fontSize: 148, lineHeight: 0.98, WebkitTextStroke: '10px #05070f', paintOrder: 'stroke fill', textShadow: '0 8px 40px rgba(0,0,0,0.8)'}}>Глобальный<br /><span style={{color: '#ff3b3b'}}>блэкаут</span></div>
      <div style={{position: 'absolute', right: 56, bottom: 54, transform: 'rotate(-3deg)', background: '#ffd23a', border: '8px solid #0a0c10', borderRadius: 22, padding: '10px 40px', ...st, color: '#0a0c10', fontSize: 74, textAlign: 'center', lineHeight: 1.05, boxShadow: '0 12px 40px rgba(0,0,0,0.6)'}}>
        10 правил<div style={{fontSize: 44, letterSpacing: 3}}>выживания без электричества</div>
      </div>
    </AbsoluteFill>
  );
};
