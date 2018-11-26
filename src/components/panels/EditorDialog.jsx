import React from 'react';
import { MODES } from '$constants/modes';

import { RouterDialog } from '$components/router/RouterDialog';
import { StickersDialog } from '$components/stickers/StickersDialog';
import { TrashDialog } from '$components/trash/TrashDialog';
import { LogoDialog } from '$components/logo/LogoDialog';
import { SaveDialog } from '$components/save/SaveDialog';
import { CancelDialog } from '$components/save/CancelDialog';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';


import {
  setMode,
  setLogo,
  routerCancel,
  routerSubmit,
  setActiveSticker,
  clearStickers,
  clearPoly,
  clearAll,
  clearCancel,
  stopEditing,
  setEditing,
} from '$redux/user/actions';

type Props = {
  mode: String,
  activeSticker: String,
}

export const Component = (props: Props) => {
  const {
    mode, activeSticker,
  } = props;

  const showDialog = (
    mode === MODES.ROUTER
    || (mode === MODES.STICKERS && !activeSticker)
    || mode === MODES.TRASH
    || mode === MODES.LOGO
    || mode === MODES.SAVE
    || mode === MODES.CONFIRM_CANCEL
  );

  return (
    showDialog &&
      <div id="control-dialog">
        { mode === MODES.ROUTER && <RouterDialog {...props} /> }
        { mode === MODES.STICKERS && <StickersDialog {...props} /> }
        { mode === MODES.TRASH && <TrashDialog {...props} /> }
        { mode === MODES.LOGO && <LogoDialog {...props} /> }
        { mode === MODES.SAVE && <SaveDialog {...props} /> }
        { mode === MODES.CONFIRM_CANCEL && <CancelDialog {...props} /> }
      </div>
  );
};

const mapStateToProps = ({ user }) => ({ ...user });

const mapDispatchToProps = dispatch => bindActionCreators({
  routerCancel,
  routerSubmit,
  setLogo,
  setActiveSticker,
  clearStickers,
  clearPoly,
  clearAll,
  clearCancel,
  stopEditing,
  setEditing,
  setMode,
}, dispatch);

export const EditorDialog = connect(
  mapStateToProps,
  mapDispatchToProps
)(Component);

