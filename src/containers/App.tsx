import React from 'react';

import { EditorPanel } from '~/components/panels/EditorPanel';
import { Fills } from '~/components/Fills';
import { UserPanel } from '~/components/panels/UserPanel';
import { connect } from 'react-redux';

import { Renderer } from '~/components/renderer/Renderer';
import { editorHideRenderer, editorSetDialogActive } from '~/redux/editor/actions';
import { LeftDialog } from '~/containers/LeftDialog';
import { TopLeftPanel } from '~/components/panels/TopLeftPanel';
import { TopRightPanel } from '~/components/panels/TopRightPanel';
import { LogoPreview } from '~/components/logo/LogoPreview';
import { IStickerPack } from '~/constants/stickers';
import { DIALOGS } from '~/constants/dialogs';

import { Map } from '~/map/Map';
import { IEditorState } from '~/redux/editor';
import { IState } from '~/redux/store';

type Props = {
  sticker: string;
  renderer_active: boolean;

  mode: IEditorState['mode'];
  dialog: keyof typeof DIALOGS;
  dialog_active: boolean;
  set: keyof IStickerPack;
  editorHideRenderer: typeof editorHideRenderer;
  editorSetDialogActive: typeof editorSetDialogActive;
};

const AppUnconnected = (props: Props) => (
  <div>
    <Fills />
    <UserPanel />
    <EditorPanel />

    <TopLeftPanel />
    <TopRightPanel />

    <LeftDialog
      dialog={props.dialog}
      dialog_active={props.dialog_active}
      editorSetDialogActive={props.editorSetDialogActive}
    />

    <LogoPreview />

    <Map />

    {props.renderer_active && <Renderer onClick={props.editorHideRenderer} />}
  </div>
);

const mapStateToProps = ({
  editor: {
    mode,
    dialog,
    dialog_active,
    renderer,
    activeSticker: { sticker, set },
  },
}: IState) => ({
  renderer_active: renderer.renderer_active,
  mode,
  dialog,
  dialog_active,
  sticker,
  set,
});

const mapDispatchToProps = { editorHideRenderer, editorSetDialogActive };

const App = connect(mapStateToProps, mapDispatchToProps)(AppUnconnected);

export { App };
