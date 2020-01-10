import React from 'react';

import { STICKERS } from '~/constants/stickers';
import * as EDITOR_ACTIONS from '~/redux/editor/actions';
import { connect } from 'react-redux';

const mapStateToProps = () => ({});
const mapDispatchToProps = {
  editorSetActiveSticker: EDITOR_ACTIONS.editorSetActiveSticker,
};

type Props = ReturnType<typeof mapStateToProps> &
  typeof mapDispatchToProps & {
    width: number;
  };

const StickersDialogUnconnected = ({ editorSetActiveSticker, width }: Props) => (
  <div className="control-dialog control-dialog-big bottom right" style={{ width }}>
    <div className="helper stickers-helper">
      {Object.keys(STICKERS).map(set => (
        <div key={set}>
          <div className="stickers-set-title">{STICKERS[set].title || null}</div>
          <div className="stickers-grid">
            {Object.keys(STICKERS[set].layers).map(sticker => (
              <div
                style={{
                  backgroundImage: `url(${STICKERS[set].url})`,
                  backgroundPosition: `${-STICKERS[set].layers[sticker].off * 48}px 50%`,
                }}
                className="sticker-preview"
                key={`${set}-${sticker}`}
                onClick={() => editorSetActiveSticker({ set, sticker })}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);

const StickersDialog = connect(mapStateToProps, mapDispatchToProps)(StickersDialogUnconnected);

export { StickersDialog };