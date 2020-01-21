import React, { createElement } from 'react';
import { MODES } from '~/constants/modes';

import { RouterDialog } from '~/components/dialogs/RouterDialog';
import { PolylineDialog } from '~/components/dialogs/PolylineDialog';
import { StickersDialog } from '~/components/dialogs/StickersDialog';
import { TrashDialog } from '~/components/dialogs/TrashDialog';
import { LogoDialog } from '~/components/dialogs/LogoDialog';
import { SaveDialog } from '~/components/dialogs/SaveDialog';
import { CancelDialog } from '~/components/dialogs/CancelDialog';

import { connect } from 'react-redux';

import { ProviderDialog } from '~/components/dialogs/ProviderDialog';
import { ShotPrefetchDialog } from '~/components/dialogs/ShotPrefetchDialog';
import { selectEditorMode } from '~/redux/editor/selectors';

const mapStateToProps = state => ({ mode: selectEditorMode(state) });

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
  [MODES.POLY]: PolylineDialog,
};

const EditorDialogUnconnected = (props: Props) =>
  props.mode && DIALOG_CONTENTS[props.mode] ? createElement(DIALOG_CONTENTS[props.mode]) : null;

const EditorDialog = connect(mapStateToProps)(EditorDialogUnconnected);

export { EditorDialog };
