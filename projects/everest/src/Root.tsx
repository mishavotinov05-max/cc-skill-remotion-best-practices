import React from 'react';
import {Composition} from 'remotion';
import {Everest, FPS, DURATION} from './Everest';
import {Ep2, FPS2, DURATION2} from './Ep2';
import {Ep3, FPS3, DURATION3} from './Ep3';
import {Characters, Characters2} from './Characters';
import {Bunker, FPSB, DURATIONB} from './Bunker';
import {Bunker2, FPSB2, DURATIONB2} from './Bunker2';
import {Million, FPSM, DURATIONM} from './Million';
import {FloodPreview} from './FloodStyle';
import {Flood, FPSF, DURATIONF} from './Flood';
import {Auto, FPSA, DURATIONA} from './Auto';
import {Shelter, FPSS, DURATIONS} from './Shelter';
import {M60, FPSM as FPS60, DURATIONM as DUR60} from './M60';
import {M61, FPS61, DUR61} from './M61';
import {M62, FPS62, DUR62} from './M62';
import {M63, FPS63, DUR63} from './M63';
import {T0, T1, T2, T3} from './M64Test';
import {M64, FPS64, DUR64} from './M64';
import {M65, FPS65, DUR65} from './M65';
import {M65Cover} from './M65Cover';
import {M64Cover} from './M64Cover';

export const Root: React.FC = () => (
  <>
  <Composition id="Everest" component={Everest} durationInFrames={Math.round(DURATION * FPS)} fps={FPS} width={1080} height={1920} />
  <Composition id="Ep2" component={Ep2} durationInFrames={Math.round(DURATION2 * FPS2)} fps={FPS2} width={1080} height={1920} />
  <Composition id="Ep3" component={Ep3} durationInFrames={Math.round(DURATION3 * FPS3)} fps={FPS3} width={1080} height={1920} />
  <Composition id="Characters" component={Characters} durationInFrames={1} fps={30} width={1920} height={1080} />
  <Composition id="Bunker" component={Bunker} durationInFrames={Math.round(DURATIONB * FPSB)} fps={FPSB} width={1080} height={1920} />
  <Composition id="Characters2" component={Characters2} durationInFrames={1} fps={30} width={1920} height={1080} />
  <Composition id="Bunker2" component={Bunker2} durationInFrames={Math.round(DURATIONB2 * FPSB2)} fps={FPSB2} width={1080} height={1920} />
  <Composition id="Million" component={Million} durationInFrames={Math.round(DURATIONM * FPSM)} fps={FPSM} width={1080} height={1920} />
  <Composition id="FloodPreview" component={FloodPreview} durationInFrames={1} fps={30} width={1080} height={1920} />
  <Composition id="Auto" component={Auto} durationInFrames={Math.round(DURATIONA * FPSA)} fps={FPSA} width={1080} height={1920} />
  <Composition id="Shelter" component={Shelter} durationInFrames={Math.round(DURATIONS * FPSS)} fps={FPSS} width={1080} height={1920} />
  <Composition id="M60" component={M60} durationInFrames={Math.round(DUR60 * FPS60)} fps={FPS60} width={1920} height={1080} />
  <Composition id="M61" component={M61} durationInFrames={Math.round(DUR61 * FPS61)} fps={FPS61} width={1920} height={1080} />
  <Composition id="M62" component={M62} durationInFrames={Math.round(DUR62 * FPS62)} fps={FPS62} width={1920} height={1080} />
  <Composition id="M63" component={M63} durationInFrames={Math.round(DUR63 * FPS63)} fps={FPS63} width={1920} height={1080} />
  <Composition id="Cover64" component={M64Cover} durationInFrames={1} fps={30} width={1920} height={1080} />
  <Composition id="Cover65" component={M65Cover} durationInFrames={1} fps={30} width={1920} height={1080} />
  <Composition id="M65" component={M65} durationInFrames={Math.round(DUR65 * FPS65)} fps={FPS65} width={1920} height={1080} />
  <Composition id="M64" component={M64} durationInFrames={Math.round(DUR64 * FPS64)} fps={FPS64} width={1920} height={1080} />
  <Composition id="T64-0" component={T0} durationInFrames={90} fps={30} width={1920} height={1080} />
  <Composition id="T64-1" component={T1} durationInFrames={90} fps={30} width={1920} height={1080} />
  <Composition id="T64-2" component={T2} durationInFrames={90} fps={30} width={1920} height={1080} />
  <Composition id="T64-3" component={T3} durationInFrames={90} fps={30} width={1920} height={1080} />
  <Composition id="Flood" component={Flood} durationInFrames={Math.round(DURATIONF * FPSF)} fps={FPSF} width={1080} height={1920} />
  </>
);
