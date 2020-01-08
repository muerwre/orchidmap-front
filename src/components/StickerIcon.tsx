import React from 'react';
import { STICKERS } from '~/constants/stickers';

type Props = {
  set: string,
  sticker: string,
};

export const StickerIcon = ({ set, sticker }: Props) => (
  <div
    className="cursor-icon-sticker"
    style={{
      backgroundImage: `url(${STICKERS[set].url}`,
      backgroundPosition: `-${STICKERS[set].layers[sticker].off * 100}% 50%`,
    }}
  />
);

//
