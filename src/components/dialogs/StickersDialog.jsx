// @flow
import React from 'react';

import { STICKERS } from '$constants/stickers';

type Props = {
  setActiveSticker: Function
};

export const StickersDialog = ({ setActiveSticker }: Props) => (
  <div className="helper stickers-helper">
    {
      Object.keys(STICKERS).map(set => (
        Object.keys(STICKERS[set].layers).map(sticker => (
          <div
            style={{
              backgroundImage: `url(${STICKERS[set].url})`,
              backgroundPosition: `${-STICKERS[set].layers[sticker].off * 48}px 50%`,
            }}
            className="sticker-preview"
            key={`${set}-${sticker}`}
            onClick={() => setActiveSticker({ set, sticker })}
          />
        ))
      ))
    }
  </div>
);
