import React from 'react';
import {Composition} from 'remotion';
import {FsaReel} from './Reel';

export const RemotionRoot: React.FC = () => (
  <Composition id="AppleStoreFsaReel" component={FsaReel}
    durationInFrames={750} fps={30} width={1080} height={1920}/>
);
