import React from 'react';
import { MODES } from '$constants/modes';

import { RouterHelper } from '$components/router/RouterHelper';

export const EditorDialog = ({ mode, routerPoints, editor }) => {
  const showDialog = (mode === MODES.ROUTER);

  return (
    showDialog &&
      <div id="control-dialog">
        { mode === MODES.ROUTER && <RouterHelper routerPoints={routerPoints} editor={editor} /> }
      </div>
  );
};
