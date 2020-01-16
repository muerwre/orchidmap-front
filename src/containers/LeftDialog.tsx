import React, { createElement, FC, memo } from 'react';
import { DIALOGS, IDialogs } from '~/constants/dialogs';
import classnames from 'classnames';
import { AppInfoDialog } from '~/components/dialogs/AppInfoDialog';
import { Icon } from '~/components/panels/Icon';
import { MapListDialog } from '~/components/dialogs/MapListDialog';
import * as EDITOR_ACTIONS from '~/redux/editor/actions';

interface Props {
  dialog: keyof IDialogs;
  dialog_active: Boolean;
  editorSetDialogActive: typeof EDITOR_ACTIONS.editorSetDialogActive;
}

const LEFT_DIALOGS = {
  [DIALOGS.MAP_LIST]: MapListDialog,
  [DIALOGS.APP_INFO]: AppInfoDialog,
};

const LeftDialog: FC<Props> = memo(({ dialog, dialog_active, editorSetDialogActive }) => (
  <React.Fragment>
    {Object.keys(LEFT_DIALOGS).map(item => (
      <div
        className={classnames('dialog', { active: dialog_active && dialog === item })}
        key={item}
      >
        {dialog && LEFT_DIALOGS[item] && createElement(LEFT_DIALOGS[item], {})}

        <div
          className="dialog-close-button desktop-only"
          onClick={() => editorSetDialogActive(false)}
        >
          <Icon icon="icon-cancel-1" />
        </div>

        <div
          className="dialog-close-button mobile-only"
          onClick={() => editorSetDialogActive(false)}
        >
          <Icon icon="icon-chevron-down" />
        </div>
      </div>
    ))}
  </React.Fragment>
));

export { LeftDialog };
