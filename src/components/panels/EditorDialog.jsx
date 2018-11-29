import React from 'react';
import { MODES } from '$constants/modes';

import { RouterDialog } from '$components/dialogs/RouterDialog';
import { StickersDialog } from '$components/dialogs/StickersDialog';
import { TrashDialog } from '$components/dialogs/TrashDialog';
import { LogoDialog } from '$components/dialogs/LogoDialog';
import { SaveDialog } from '$components/dialogs/SaveDialog';
import { CancelDialog } from '$components/dialogs/CancelDialog';

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
  sendSaveRequest,
  setProvider,
} from '$redux/user/actions';
import { ProviderDialog } from '$components/dialogs/ProviderDialog';

type Props = {
  mode: String,
  activeSticker: String,
  width: Number,
}

export const Component = (props: Props) => {
  const {
    mode, activeSticker, width
  } = props;

  const showDialog = (
    mode === MODES.ROUTER
    || (mode === MODES.STICKERS && !activeSticker)
    || mode === MODES.TRASH
    || mode === MODES.LOGO
    || mode === MODES.SAVE
    || mode === MODES.CONFIRM_CANCEL
    || mode === MODES.PROVIDER
  );

  const dialogIsSmall = (
    mode === MODES.LOGO
  );

  return (
    showDialog &&
      <div
        id="control-dialog"
        style={{
          width: dialogIsSmall ? 201 : width,
          right: dialogIsSmall ? 217 : 10,
        }}
      >
        { mode === MODES.ROUTER && <RouterDialog {...props} /> }
        { mode === MODES.STICKERS && <StickersDialog {...props} /> }
        { mode === MODES.TRASH && <TrashDialog {...props} /> }
        { mode === MODES.LOGO && <LogoDialog {...props} /> }
        { mode === MODES.SAVE && <SaveDialog {...props} /> }
        { mode === MODES.CONFIRM_CANCEL && <CancelDialog {...props} /> }
        { mode === MODES.PROVIDER && <ProviderDialog {...props} /> }
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
  sendSaveRequest,
  setProvider,
}, dispatch);

export const EditorDialog = connect(
  mapStateToProps,
  mapDispatchToProps
)(Component);

