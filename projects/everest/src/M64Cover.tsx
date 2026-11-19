import React from 'react';
import '@fontsource/montserrat/cyrillic-800.css';
import '@fontsource/montserrat/latin-800.css';
import {AbsoluteFill} from 'remotion';
import {poseStand} from './M60Base';
import {Forest, Bear, Vasya, G} from './M64Art';

export const M64Cover: React.FC = () => {
  const stroke = {WebkitTextStroke: '14px #05070f', paintOrder: 'stroke fill' as const, fontFamily: 'Montserrat, sans-serif', fontWeight: 800, textTransform: 'uppercase' as const};
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{position: 'absolute'}}>
        <g transform="translate(960 540) scale(1.05) translate(-960 -560)">
          <Forest tod={0.62} cx={960} t={3} loc="road" />
        </g>
        <rect width={1920} height={1080} fill="#2a0a05" opacity={0.22} />
        <Bear b={{x: 1560, y: 150, s: 2.7, face: -1, mode: 'alert', t: 2.2}} />
        <g transform="translate(0 0)"><Vasya v={{x: 330, y: 150, pose: poseStand({mood: 'scared', nod: 4, lean: 6, hf: [26, -126], hb: [-6, -122]}), s: 1.7}} /></g>
      </svg>
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 62% 55%, rgba(0,0,0,0) 38%, rgba(8,4,2,0.7) 100%)'}} />
      <div style={{position: 'absolute', left: 70, top: 50, ...stroke, color: '#fff', fontSize: 78, lineHeight: 1.0}}>Что делать, если</div>
      <div style={{position: 'absolute', left: 70, top: 128, ...stroke, color: '#FF2020', fontSize: 128, lineHeight: 1.0, width: 1200}}>медведь<br />идёт на тебя?</div>
      <div style={{position: 'absolute', right: 60, bottom: 54, transform: 'rotate(-4deg)', background: '#FF2020', border: '10px solid #fff', borderRadius: 30, padding: '10px 46px', ...stroke, WebkitTextStroke: '0px', color: '#fff', fontSize: 104, boxShadow: '0 12px 40px rgba(0,0,0,0.55)', textAlign: 'center', lineHeight: 1.05}}>
        15 правил<div style={{fontSize: 52, letterSpacing: 2}}>выживания</div>
      </div>
    </AbsoluteFill>
  );
};
