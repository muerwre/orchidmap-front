import React from 'react';

import { stickers } from '$constants/stickers';
import sprite from '$sprites/stickers.svg';

export class StickersHelper extends React.Component {
  render() {
    return (
      <div className="stickers-helper">
        {
          stickers.map(sticker => (
            <div className="sticker-preview" key={sticker}>
              <svg width={48} height={48} viewBox="0 0 64 64" onClick={() => this.props.editor.setSticker(sticker)}>
                <use xlinkHref={`${sprite}#sticker-${sticker}`} x="0" y="0" width="64" height="64" />
              </svg>
            </div>
          ))
        }
      </div>
    );
  }
}
