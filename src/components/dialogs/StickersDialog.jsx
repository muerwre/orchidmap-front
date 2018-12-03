// @flow
import React from 'react';

import { STICKERS } from '$constants/stickers';
import sprite from '$sprites/stickers.svg';

type Props = {
  setActiveSticker: Function
};

export const StickersDialog = ({ setActiveSticker }: Props) => (
  <div className="helper stickers-helper">
    {
      Object.keys(STICKERS).map(set => (
        STICKERS[set].layers.map((sticker, i) => (
          <div
            style={{
              backgroundImage: `url(${STICKERS[set].url})`,
              backgroundPosition: `${-sticker.off * 48}px 50%`,
            }}
            className="sticker-preview"
            key={`${set}-${i}`}
          />
        ))
      ))
    }
  </div>
);
