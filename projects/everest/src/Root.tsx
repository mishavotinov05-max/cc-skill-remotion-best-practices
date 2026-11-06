import React from 'react';
import {Composition} from 'remotion';
import {Everest, FPS, DURATION} from './Everest';

export const Root: React.FC = () => (
  <Composition id="Everest" component={Everest} durationInFrames={Math.round(DURATION * FPS)} fps={FPS} width={1080} height={1920} />
);
