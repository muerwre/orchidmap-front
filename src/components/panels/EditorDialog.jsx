import React from 'react';
import { MODES } from '$constants/modes';

import { RouterDialog } from '$components/router/RouterDialog';
import { StickersDialog } from '$components/stickers/StickersDialog';
import { TrashDialog } from '$components/trash/TrashDialog';
import { LogoDialog } from '$components/logo/LogoDialog';

export const EditorDialog = ({
  mode, routerPoints, editor, activeSticker, logo
}) => {
  const showDialog = (
    mode === MODES.ROUTER
    || (mode === MODES.STICKERS && !activeSticker)
    || mode === MODES.TRASH
    || mode === MODES.LOGO
  );

  return (
    showDialog &&
      <div id="control-dialog">
        { mode === MODES.ROUTER && <RouterDialog routerPoints={routerPoints} editor={editor} /> }
        { mode === MODES.STICKERS && <StickersDialog editor={editor} /> }
        { mode === MODES.TRASH && <TrashDialog editor={editor} /> }
        { mode === MODES.LOGO && <LogoDialog editor={editor} logo={logo} /> }
      </div>
  );
};
