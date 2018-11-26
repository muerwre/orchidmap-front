import React from 'react';
import { MODES } from '$constants/modes';

import { RouterDialog } from '$components/router/RouterDialog';
import { StickersDialog } from '$components/stickers/StickersDialog';
import { TrashDialog } from '$components/trash/TrashDialog';
import { LogoDialog } from '$components/logo/LogoDialog';
import { SaveDialog } from '$components/save/SaveDialog';
import { CancelDialog } from '$components/save/CancelDialog';
import type { UserType } from '$constants/types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { editor } from '$modules/Editor';

import {
  setLogo,
  routerCancel,
  routerSubmit,
  setActiveSticker,
  clearStickers,
  clearPoly,
  clearAll,
  clearCancel,
} from '$redux/user/actions';

type Props = {
  mode: String,
  routerPoints: Number,
  editor: Object,
  activeSticker: String,
  logo: String,
  user: UserType,
  title: String,
  address: String,

  setLogo: Function,
  routerSubmit: Function,
  routerCancel: Function,
  setActiveSticker: Function,
  clearStickers: Function,
  clearPoly: Function,
  clearAll: Function,
  clearCancel: Function,
}

export const Component = (props: Props) => {
  const {
    mode, activeSticker, logo, user, title, address
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
        { mode === MODES.LOGO && <LogoDialog editor={editor} logo={logo} setLogo={setLogo} /> }
        { mode === MODES.SAVE && <SaveDialog editor={editor} user={user} title={title} address={address} /> }
        { mode === MODES.CONFIRM_CANCEL && <CancelDialog editor={editor} /> }
      </div>
  );
};

function mapStateToProps(state) {
  const {
    user: {
      mode, routerPoints, activeSticker, logo, user, title, address,
    },
  } = state;

  return {
    mode,
    routerPoints,
    activeSticker,
    logo,
    user,
    title,
    address,
    editor,
  };
}

const mapDispatchToProps = dispatch => bindActionCreators({
  routerCancel,
  routerSubmit,
  setLogo,
  setActiveSticker,
  clearStickers,
  clearPoly,
  clearAll,
  clearCancel,
}, dispatch);

export const EditorDialog = connect(
  mapStateToProps,
  mapDispatchToProps
)(Component);

