import React from 'react';
import {AbsoluteFill} from 'remotion';
import '@fontsource/montserrat/cyrillic-600.css';
import '@fontsource/montserrat/latin-600.css';
import {Figure, Outfit} from './Everest';

// One place for how every hero looks (see projects/noxargent-studio/characters.json).
export const OUTFITS: Record<string, Outfit> = {
  max: {top: '#2f5fa8', topDark: '#1d3f78', pants: '#0b0b0e', hair: '#4a3322', hat: 'hood', hatColor: '#25498a'},
  babushka: {top: '#6b4a5a', topDark: '#47303c', pants: '#2b2b30', skirt: '#3a3f46', hair: '#c9c9c4', skin: ['#e2b79a', '#b98366'], hat: 'scarf', hatColor: '#7a2e2e'},
  neighbor: {top: '#6a5a3a', topDark: '#463b25', pants: '#2a2f3a', hair: '#2a2018', hat: 'cap', hatColor: '#555a60', vest: '#2f3a2a'},
  neighbor_woman: {top: '#3f6a4f', topDark: '#274634', pants: '#22222c', skirt: '#2a2a38', hair: '#6a4426', skin: ['#efc3a4', '#c88f70']},
  old_man: {top: '#555a60', topDark: '#383c41', pants: '#1a1a1c', hair: '#d8d8d4', skin: ['#e0b595', '#b88467'], hat: 'beanie', hatColor: '#2a2f36'},
};

const Card: React.FC<{x: number; name: string; role: string; outfit: Outfit; look?: number; fear?: number; s?: number}> = ({x, name, role, outfit, look = 0, fear = 0.15, s = 1.22}) => (
  <g>
    <rect x={x - 150} y={90} width={300} height={880} rx={22} fill="#10141c" stroke="#27303f" strokeWidth={2} />
    <ellipse cx={x} cy={840} rx={110} ry={16} fill="#000" opacity={0.5} />
    <Figure x={x} y={840} s={s} face={{look, fear}} outfit={outfit} />
    <text x={x} y={905} textAnchor="middle" fontFamily="Montserrat, sans-serif" fontWeight={600} fontSize={30} fill="#f2f4f8">{name}</text>
    <text x={x} y={943} textAnchor="middle" fontFamily="Montserrat, sans-serif" fontWeight={600} fontSize={20} fill="#8c97a8">{role}</text>
  </g>
);

export const Characters: React.FC = () => (
  <AbsoluteFill style={{background: '#0a0d13'}}>
    <svg width={1920} height={1080} viewBox="0 0 1920 1080">
      <text x={960} y={62} textAnchor="middle" fontFamily="Montserrat, sans-serif" fontWeight={600} fontSize={36} fill="#f2f4f8">ПЕРСОНАЖИ · БУНКЕР</text>
      <Card x={160} name="МАКС" role="главный герой" outfit={OUTFITS.max} />
      <Card x={480} name="МАКС · тревога" role="тот же герой, испуг" outfit={OUTFITS.max} fear={0.9} look={0.6} />
      <Card x={800} name="БАБУШКА" role="деревня" outfit={OUTFITS.babushka} s={1.16} />
      <Card x={1120} name="СОСЕД" role="местный житель" outfit={OUTFITS.neighbor} />
      <Card x={1440} name="СОСЕДКА" role="местная жительница" outfit={OUTFITS.neighbor_woman} s={1.18} />
      <Card x={1760} name="ДЕД" role="местный житель" outfit={OUTFITS.old_man} s={1.15} />
    </svg>
  </AbsoluteFill>
);
