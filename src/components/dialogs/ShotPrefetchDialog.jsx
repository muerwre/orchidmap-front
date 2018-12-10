import React from 'react';

type Props = {
  renderer: {
    info: String,
    progress: Number,
  }
}

export const ShotPrefetchDialog = ({ renderer: { info, progress }}: Props) => (
  <div className="control-dialog control-dialog-small">
    <div className="helper helper-prefetch">
      <div className="dialog-prefetch-stage">{info}</div>
      <div className="dialog-prefetch-progress">
        <div className="progress">
          <div className="bar" style={{ width: `${progress * 100}%` }} />
        </div>
      </div>
    </div>
  </div>
);
