import React from 'react';
import { MODES } from '$constants/modes';

import { RouterHelper } from '$components/router/RouterHelper';
import { StickersHelper } from '$components/stickers/StickersHelper';

export const EditorDialog = ({ mode, routerPoints, editor, activeSticker }) => {
  const showDialog = (
    mode === MODES.ROUTER
    || (mode === MODES.STICKERS && !activeSticker)
  );

  return (
    showDialog &&
      <div id="control-dialog">
        { mode === MODES.ROUTER && <RouterHelper routerPoints={routerPoints} editor={editor} /> }
        { mode === MODES.STICKERS && <StickersHelper editor={editor} /> }
      </div>
  );
};
