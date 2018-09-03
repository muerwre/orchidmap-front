import React from 'react';
import { MODES } from '$constants/modes';

import { RouterDialog } from '$components/router/RouterDialog';
import { StickersDialog } from '$components/stickers/StickersDialog';
import { TrashDialog } from '$components/trash/TrashDialog';
import { LogoDialog } from '$components/logo/LogoDialog';
import { SaveDialog } from '$components/save/SaveDialog';

export const EditorDialog = ({
  mode, routerPoints, editor, activeSticker, logo, user, title, address,
}) => {
  const showDialog = (
    mode === MODES.ROUTER
    || (mode === MODES.STICKERS && !activeSticker)
    || mode === MODES.TRASH
    || mode === MODES.LOGO
    || mode === MODES.SAVE
  );

  return (
    showDialog &&
      <div id="control-dialog">
        { mode === MODES.ROUTER && <RouterDialog routerPoints={routerPoints} editor={editor} /> }
        { mode === MODES.STICKERS && <StickersDialog editor={editor} /> }
        { mode === MODES.TRASH && <TrashDialog editor={editor} /> }
        { mode === MODES.LOGO && <LogoDialog editor={editor} logo={logo} /> }
        { mode === MODES.SAVE && <SaveDialog editor={editor} user={user} title={title} address={address} /> }
      </div>
  );
};
