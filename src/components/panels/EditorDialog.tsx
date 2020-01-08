import React, { createElement } from 'react';
import { MODES } from '$constants/modes';

import { RouterDialog } from '$components/dialogs/RouterDialog';
import { StickersDialog } from '$components/dialogs/StickersDialog';
import { TrashDialog } from '$components/dialogs/TrashDialog';
import { LogoDialog } from '$components/dialogs/LogoDialog';
import { SaveDialog } from '$components/dialogs/SaveDialog';
import { CancelDialog } from '$components/dialogs/CancelDialog';

import { connect } from 'react-redux';

import { ProviderDialog } from '$components/dialogs/ProviderDialog';
import { ShotPrefetchDialog } from '$components/dialogs/ShotPrefetchDialog';
import { selectUserMode } from '$redux/user/selectors';

const mapStateToProps = state => ({ mode: selectUserMode(state) });

// const mapDispatchToProps = dispatch => bindActionCreators({
//   routerCancel: USER_ACTIONS.routerCancel,
//   routerSubmit: USER_ACTIONS.routerSubmit,
//   setActiveSticker: USER_ACTIONS.setActiveSticker,
//   clearStickers: USER_ACTIONS.clearStickers,
//   clearPoly: USER_ACTIONS.clearPoly,
//   clearAll: USER_ACTIONS.clearAll,
//   clearCancel: USER_ACTIONS.clearCancel,
//   stopEditing: USER_ACTIONS.stopEditing,
//   setEditing: USER_ACTIONS.setEditing,
//   setMode: USER_ACTIONS.setMode,
//   sendSaveRequest: USER_ACTIONS.sendSaveRequest,
//   changeProvider: USER_ACTIONS.changeProvider,
//   mapSetLogo: MAP_ACTIONS.mapSetLogo,
// }, dispatch);

type Props = ReturnType<typeof mapStateToProps> & {
    width: number;
  };

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

export const Component = (props: Props) =>
  props.mode && DIALOG_CONTENTS[props.mode]
    ? createElement(DIALOG_CONTENTS[props.mode])
    : null;

export const EditorDialog = connect(
  mapStateToProps
  // mapDispatchToProps
)(Component);
