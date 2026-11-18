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
        <defs>
          <clipPath id="skyclip"><rect x={0} y={0} width={1920} height={560} /></clipPath>
          <linearGradient id="au1" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#2aff9a" stopOpacity={0} /><stop offset="0.45" stopColor="#2aff9a" stopOpacity={0.55} /><stop offset="0.8" stopColor="#ff3a7a" stopOpacity={0.5} /><stop offset="1" stopColor="#ff3a7a" stopOpacity={0} /></linearGradient>
          <linearGradient id="au2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#4a8aff" stopOpacity={0.5} /><stop offset="1" stopColor="#4a8aff" stopOpacity={0} /></linearGradient>
        </defs>
        <rect width={1920} height={1080} fill="#02040a" />
        <g transform="translate(960 640) scale(1.25) translate(-2450 -640)">
          <CityNight t={2} p={{L: 0, jam: 1, lit: 1, cx: 2450, day: 0.1} as any} />
          {/* watcher in the lit window */}
          <g transform="translate(2862 440)"><rect x={-18} y={0} width={36} height={40} rx={10} fill="#05070c" /><circle cx={0} cy={-8} r={16} fill="#05070c" /></g>
          <polygon points="2000,860 2840,430 2840,760" fill="#fff6c8" opacity={0.1} />
          <Man x={1960} y={1018} pose={poseStand({mood: 'scared', nod: -6, lean: 4, hf: [70, -140], hb: [30, -130]})} look={VASYA_PK} s={1.7} />
          <Man x={2170} y={1024} pose={poseStand({mood: 'worried', nod: -4})} look={ANDREY} s={1.65} />
        </g>
        {/* aurora from the solar storm */}
        <g clipPath="url(#skyclip)" style={{mixBlendMode: 'screen'}}><path d="M-100 330 C300 120 700 420 1100 220 C1500 40 1800 260 2100 140 L2100 420 C1700 520 1400 300 1000 460 C600 600 300 380 -100 520 Z" fill="url(#au1)" opacity={0.9} />
        <path d="M-100 480 C400 300 800 560 1200 380 C1600 220 1900 420 2100 320 L2100 600 C1700 640 1400 520 1000 640 C600 740 300 560 -100 700 Z" fill="url(#au2)" opacity={0.6} /></g>
        {Array.from({length: 60}).map((_, i) => <circle key={i} cx={(i * 389) % 1920} cy={(i * 211) % 520} r={1.4 + (i % 3) * 0.7} fill="#cfe0ff" opacity={0.7} />)}
        <circle cx={1700} cy={130} r={90} fill="#ffb02a" opacity={0.22} /><circle cx={1700} cy={130} r={46} fill="#ffd23a" />
        {/* dead phone battery */}
        <g transform="translate(1790 640) rotate(8)"><rect x={-90} y={-46} width={170} height={92} rx={14} fill="#0a0c10" stroke="#e8e8e8" strokeWidth={8} /><rect x={80} y={-18} width={14} height={36} rx={4} fill="#e8e8e8" /><rect x={-80} y={-36} width={24} height={72} rx={5} fill="#ff4a3a" /><text x={20} y={22} textAnchor="middle" fontFamily="Montserrat, sans-serif" fontWeight={800} fontSize={54} fill="#ff6a5a">9%</text></g>
      </svg>
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 62% 55%, rgba(0,0,0,0) 30%, rgba(0,2,6,0.72) 100%)'}} />
      <AbsoluteFill style={{backgroundImage: 'url(' + staticFile('noise.png') + ')', backgroundSize: '256px 256px', opacity: 0.08, mixBlendMode: 'overlay'}} />
      <div style={{position: 'absolute', left: 64, top: 46, ...st, color: '#ffd23a', fontSize: 52, letterSpacing: 8, textShadow: '0 0 24px rgba(255,210,58,0.6)'}}>⚡ 30 суток без электричества</div>
      <div style={{position: 'absolute', left: 58, top: 112, ...st, color: '#fff', fontSize: 150, lineHeight: 0.98, WebkitTextStroke: '10px #05070f', paintOrder: 'stroke fill', textShadow: '0 8px 40px rgba(0,0,0,0.8)'}}>Глобальный<br /><span style={{color: '#ff3b3b'}}>блэкаут</span></div>
      <div style={{position: 'absolute', right: 52, bottom: 52, transform: 'rotate(-3deg)', background: '#ffd23a', border: '8px solid #0a0c10', borderRadius: 22, padding: '10px 40px', ...st, color: '#0a0c10', fontSize: 74, textAlign: 'center', lineHeight: 1.05, boxShadow: '0 12px 40px rgba(0,0,0,0.6)'}}>
        10 правил<div style={{fontSize: 44, letterSpacing: 3}}>как не сойти с ума и выжить</div>
      </div>
      <div style={{position: 'absolute', left: 64, bottom: 56, ...st, color: '#fff', fontSize: 40, background: 'rgba(5,8,14,0.78)', padding: '10px 26px', borderRadius: 14, border: '4px solid #ff3b3b'}}>Почему горит только это окно?</div>
    </AbsoluteFill>
  );
};
