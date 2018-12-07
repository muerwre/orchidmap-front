// @flow
import React from 'react';

import { STICKERS } from '$constants/stickers';

type Props = {
  setActiveSticker: Function,
  width: Number,
};

export const StickersDialog = ({ setActiveSticker, width }: Props) => (
  <div className="control-dialog control-dialog-big" style={{ width }}>
    <div className="helper stickers-helper">
      {
        Object.keys(STICKERS).map(set => (
          <div key={set}>
            <div className="stickers-set-title">{STICKERS[set].title || null}</div>
            <div className="stickers-grid">
              {
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
              }
            </div>
          </div>
        ))
      }
    </div>
  </div>
);
