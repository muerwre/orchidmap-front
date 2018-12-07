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

const DIALOG_CONTENTS = {
  [MODES.ROUTER]: RouterDialog,
  [MODES.STICKERS]: StickersDialog,
  [MODES.TRASH]: TrashDialog,
  [MODES.LOGO]: LogoDialog,
  [MODES.SAVE]: SaveDialog,
  [MODES.CONFIRM_CANCEL]: CancelDialog,
  [MODES.PROVIDER]: ProviderDialog,
};

export const Component = (props: Props) => {
  const { mode } = props;

  return (
    (mode && DIALOG_CONTENTS[mode] && React.createElement(DIALOG_CONTENTS[mode], { ...props }))
      || <div>null</div>
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

