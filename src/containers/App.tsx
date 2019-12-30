// @flow
import * as React from 'react';

import { EditorPanel } from '$components/panels/EditorPanel';
import { Fills } from '$components/Fills';
import { UserPanel } from '$components/panels/UserPanel';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { hot } from 'react-hot-loader';
import { Renderer } from '$components/renderer/Renderer';
import { hideRenderer, setDialogActive } from '$redux/user/actions';
import { Cursor } from '$components/Cursor';
import { LeftDialog } from '$containers/LeftDialog';
import { TopLeftPanel } from '$components/panels/TopLeftPanel';
import { TopRightPanel } from '$components/panels/TopRightPanel';
import { LogoPreview } from '$components/logo/LogoPreview';
import { IStickerPack } from "$constants/stickers";
import { IDialogs } from "$constants/dialogs";

import { Map } from "$containers/map/Map"
import { IRootReducer } from '$redux/user';

type Props = {
  sticker: string,
  renderer_active: boolean,

  mode: IRootReducer['mode'],
  dialog: keyof IDialogs,
  dialog_active: boolean,
  set: keyof IStickerPack,
  hideRenderer: typeof hideRenderer,
  setDialogActive: typeof setDialogActive,
}

const Component = (props: Props) => (
  <div>
    <Fills />
    <UserPanel />
    <EditorPanel />

    <TopLeftPanel />
    <TopRightPanel />
    <LogoPreview />

    <Cursor mode={props.mode} sticker={props.sticker} set={props.set} />

    <LeftDialog
      dialog={props.dialog}
      dialog_active={props.dialog_active}
      setDialogActive={props.setDialogActive}
    />

    <Map />

    { props.renderer_active &&
      <Renderer onClick={props.hideRenderer} />
    }
  </div>
);

const mapStateToProps = ({
  user: {
    mode, dialog, dialog_active, renderer, activeSticker: { sticker = null, set = null }
  }
}) => ({
  renderer_active: renderer.renderer_active,
  mode,
  dialog,
  dialog_active,
  sticker,
  set,
});

const mapDispatchToProps = dispatch => bindActionCreators({ hideRenderer, setDialogActive }, dispatch);
export const App = connect(mapStateToProps, mapDispatchToProps)(hot(module)(Component));
