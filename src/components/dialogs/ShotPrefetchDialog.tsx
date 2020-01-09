import React from 'react';
import { connect } from 'react-redux';
import { selectEditorRenderer } from '~/redux/editor/selectors';

const mapStateToProps = state => ({
  renderer: selectEditorRenderer(state),
});

type Props = ReturnType<typeof mapStateToProps> & {};

const ShotPrefetchDialogUnconnected = ({ renderer: { info, progress }}: Props) => (
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

const ShotPrefetchDialog = connect(mapStateToProps)(ShotPrefetchDialogUnconnected);

export { ShotPrefetchDialog }