import React, { createElement } from 'react';
import { DIALOGS, IDialogs } from '~/constants/dialogs';
import classnames from 'classnames';
import { AppInfoDialog } from '~/components/dialogs/AppInfoDialog';
import { Icon } from '~/components/panels/Icon';
import { MapListDialog } from '~/components/dialogs/MapListDialog';
import * as USER_ACTIONS from '~/redux/user/actions';

interface Props {
  dialog: keyof IDialogs;
  dialog_active: Boolean;
  setDialogActive: typeof USER_ACTIONS.setDialogActive;
}

const LEFT_DIALOGS = {
  [DIALOGS.MAP_LIST]: MapListDialog,
  [DIALOGS.APP_INFO]: AppInfoDialog,
};

const LeftDialog = ({ dialog, dialog_active, setDialogActive }: Props) => (
  <React.Fragment>
    {Object.keys(LEFT_DIALOGS).map(item => (
      <div
        className={classnames('dialog', { active: dialog_active && dialog === item })}
        key={item}
      >
        {dialog && LEFT_DIALOGS[item] && createElement(LEFT_DIALOGS[item], {})}

        <div className="dialog-close-button desktop-only" onClick={() => setDialogActive(false)}>
          <Icon icon="icon-cancel-1" />
        </div>

        <div className="dialog-close-button mobile-only" onClick={() => setDialogActive(false)}>
          <Icon icon="icon-chevron-down" />
        </div>
      </div>
    ))}
  </React.Fragment>
);

export { LeftDialog };
