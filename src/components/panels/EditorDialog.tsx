import * as React from 'react';
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
  changeProvider,
} from '$redux/user/actions';
import { ProviderDialog } from '$components/dialogs/ProviderDialog';
import { ShotPrefetchDialog } from '$components/dialogs/ShotPrefetchDialog';
import { IRootState } from "$redux/user";

interface Props extends IRootState {
  width: number,
}

const DIALOG_CONTENTS: { [x: string]: any } = {
  [MODES.ROUTER]: RouterDialog,
  [MODES.STICKERS_SELECT]: StickersDialog,
  [MODES.TRASH]: TrashDialog,
  [MODES.LOGO]: LogoDialog,
  [MODES.SAVE]: SaveDialog,
  [MODES.CONFIRM_CANCEL]: CancelDialog,
  [MODES.PROVIDER]: ProviderDialog,
  [MODES.SHOT_PREFETCH]: ShotPrefetchDialog,
};

export const Component = (props: Props) => (
  props.mode && DIALOG_CONTENTS[props.mode]
    ? React.createElement(DIALOG_CONTENTS[props.mode], { ...props })
    : null
);

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
  changeProvider,
}, dispatch);

export const EditorDialog = connect(
  mapStateToProps,
  mapDispatchToProps
)(Component);

