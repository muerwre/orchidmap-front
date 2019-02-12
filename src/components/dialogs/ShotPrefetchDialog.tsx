import * as React from 'react';

interface Props {
  renderer: {
    info: string,
    progress: number,
  }
}

export const ShotPrefetchDialog = ({ renderer: { info, progress }}: Props) => (
  <div className="control-dialog control-dialog-small left">
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
