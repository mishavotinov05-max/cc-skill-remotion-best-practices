import React from 'react';
import '@fontsource/montserrat/cyrillic-800.css';
import '@fontsource/montserrat/latin-800.css';
import {AbsoluteFill, staticFile} from 'remotion';
import {ManiacFace, ARTEM} from './M67Art';
import {PersonV} from './M67Fig';

const st = {fontFamily: 'Montserrat, sans-serif', fontWeight: 800 as const, textTransform: 'uppercase' as const};
const Scene: React.FC<{vert?: boolean}> = ({vert}) => (
  <svg width={vert ? 1080 : 1920} height={vert ? 1920 : 1080} viewBox={vert ? '0 0 1080 1920' : '0 0 1920 1080'} style={{position: 'absolute'}}>
    <defs><radialGradient id="cvg" cx="0.5" cy="0.5" r="0.7"><stop offset="0.45" stopColor="#000" stopOpacity={0} /><stop offset="1" stopColor="#000" stopOpacity={0.85} /></radialGradient></defs>
    <rect width={1920} height={1920} fill="#05070b" />
    {vert
      ? <g transform="translate(-420 250) scale(1.0)"><ManiacFace t={3} look={0.7} smoke={0.6} /></g>
      : <g transform="translate(520 -20) scale(1.0)"><ManiacFace t={3} look={0.7} smoke={0.6} /></g>}
    {/* the hero, small and scared, in the corner */}
    {vert
      ? <g><ellipse cx={250} cy={1760} rx={220} ry={20} fill="#000" opacity={0.6} /><PersonV look={ARTEM} x={250} y={1800} view="front" mode="scared" t={0} s={2.1} mood="scared" shadow={false} /></g>
      : <g><ellipse cx={330} cy={1040} rx={220} ry={20} fill="#000" opacity={0.6} /><PersonV look={ARTEM} x={330} y={1080} view="front" mode="scared" t={0} s={2.1} mood="scared" shadow={false} /></g>}
    <rect width={vert ? 1080 : 1920} height={vert ? 1920 : 1080} fill="url(#cvg)" />
  </svg>
);

export const M67Cover: React.FC = () => (
  <AbsoluteFill style={{background: '#000'}}>
    <Scene />
    <AbsoluteFill style={{backgroundImage: 'url(' + staticFile('noise.png') + ')', backgroundSize: '256px 256px', opacity: 0.06, mixBlendMode: 'overlay'}} />
    <div style={{position: 'absolute', left: 60, top: 50, ...st, color: '#ff2a2a', fontSize: 48, letterSpacing: 8, textShadow: '0 0 26px rgba(255,42,42,0.7)'}}>Ты очнулся здесь…</div>
    <div style={{position: 'absolute', left: 54, top: 112, ...st, color: '#fff', fontSize: 190, lineHeight: 0.95, WebkitTextStroke: '12px #05070f', paintOrder: 'stroke fill', textShadow: '0 10px 50px rgba(0,0,0,0.9)'}}>Подвал<br /><span style={{color: '#ff2a2a', textShadow: '0 0 50px rgba(255,42,42,0.6), 0 10px 50px rgba(0,0,0,0.9)'}}>маньяка</span></div>
    <div style={{position: 'absolute', right: 56, bottom: 54, transform: 'rotate(-3deg)', background: '#ff2a2a', border: '8px solid #0a0c10', borderRadius: 20, padding: '10px 38px', ...st, color: '#fff', fontSize: 66, textAlign: 'center', lineHeight: 1.05}}>
      3 правила<div style={{fontSize: 38, letterSpacing: 3}}>которые помогут выжить</div>
    </div>
    <div style={{position: 'absolute', left: 60, bottom: 54, ...st, color: '#fff', fontSize: 36, background: 'rgba(5,7,11,0.8)', padding: '10px 24px', borderRadius: 12, border: '4px solid #ff2a2a'}}>5 эпизодов · выживший расскажет</div>
  </AbsoluteFill>
);

export const M67CoverV: React.FC = () => (
  <AbsoluteFill style={{background: '#000'}}>
    <Scene vert />
    <AbsoluteFill style={{backgroundImage: 'url(' + staticFile('noise.png') + ')', backgroundSize: '256px 256px', opacity: 0.06, mixBlendMode: 'overlay'}} />
    <div style={{position: 'absolute', left: 0, right: 0, top: 70, textAlign: 'center', ...st, color: '#ff2a2a', fontSize: 44, letterSpacing: 8, textShadow: '0 0 26px rgba(255,42,42,0.7)'}}>Ты очнулся здесь…</div>
    <div style={{position: 'absolute', left: 0, right: 0, top: 130, textAlign: 'center', ...st, color: '#fff', fontSize: 170, lineHeight: 0.95, WebkitTextStroke: '11px #05070f', paintOrder: 'stroke fill', textShadow: '0 10px 50px rgba(0,0,0,0.9)'}}>Подвал<br /><span style={{color: '#ff2a2a', textShadow: '0 0 50px rgba(255,42,42,0.6)'}}>маньяка</span></div>
    <div style={{position: 'absolute', right: 50, bottom: 110, transform: 'rotate(-3deg)', background: '#ff2a2a', border: '8px solid #0a0c10', borderRadius: 20, padding: '10px 34px', ...st, color: '#fff', fontSize: 70, textAlign: 'center', lineHeight: 1.05}}>
      3 правила<div style={{fontSize: 38, letterSpacing: 3}}>которые помогут выжить</div>
    </div>
  </AbsoluteFill>
);
