import React from 'react';
import {Composition} from 'remotion';
import {Everest, FPS, DURATION} from './Everest';
import {Ep2, FPS2, DURATION2} from './Ep2';

export const Root: React.FC = () => (
  <>
  <Composition id="Everest" component={Everest} durationInFrames={Math.round(DURATION * FPS)} fps={FPS} width={1080} height={1920} />
  <Composition id="Ep2" component={Ep2} durationInFrames={Math.round(DURATION2 * FPS2)} fps={FPS2} width={1080} height={1920} />
  </>
);
