import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {poseStand, poseWalk} from './M60Base';
import {Forest, Bear, BearFront, Vasya, poseCover, poseLie, BearHeadClose, PawsClose, G} from './M64Art';
export const M64Test: React.FC<{k: number}> = ({k}) => {
  const f = useCurrentFrame(); const t = f / 30 + 2;
  return (
    <AbsoluteFill>
      <svg width={1920} height={1080} viewBox="0 0 1920 1080">
        {k === 0 && <g transform="translate(960 540) scale(0.9) translate(-1900 -600)"><Forest tod={0.1} cx={1900} t={t} />
          <Vasya v={{x: 1500, pose: poseWalk(t, 2.4, 8)}} />
          <Bear b={{x: 2900, mode: 'walk', t}} />
          <Bear b={{x: 2400, y: 40, s: 0.42, mode: 'sniff', t, col: '#8a6440', sn: '#b08a60'}} />
          <Bear b={{x: 2200, y: 90, mode: 'run', t, face: 1}} />
        </g>}
        {k === 1 && <g><Forest tod={0.2} cx={960} t={t} loc="road" /><BearFront t={t} s={0.9} /></g>}
        {k === 2 && <g transform="translate(960 540) scale(1.1) translate(-1500 -650)"><Forest tod={0.9} cx={1500} t={t} loc="cabin" /><Vasya v={{x: 1100, pose: poseCover(), lie: 86}} /><Vasya v={{x: 1500, pose: poseStand({mood: 'scared'})}} /><Bear b={{x: 1900, mode: 'huff', t, rise: 0}} /><Bear b={{x: 2300, s: 0.42, mode: 'idle', t, rise: 1, col: '#8a6440', sn: '#b08a60'}} /></g>}
        {k === 3 && <BearHeadClose t={t} mood="sniff" tod={0.3} />}
      </svg>
    </AbsoluteFill>
  );
};

export const T0 = () => <M64Test k={0} />;
export const T1 = () => <M64Test k={1} />;
export const T2 = () => <M64Test k={2} />;
export const T3 = () => <M64Test k={3} />;
