// @flow
import React from 'react';
import { DIALOGS } from '$constants/dialogs';
import { MapListDialog } from '$components/dialogs/MapListDialog';
import classnames from 'classnames';
import { AppInfoDialog } from '$components/dialogs/AppInfoDialog';
import { Icon } from '$components/panels/Icon';

type Props = {
  dialog: String,
  dialog_active: Boolean,

  setDialogActive: Function,
}

const LEFT_DIALOGS = {
  [DIALOGS.MAP_LIST]: MapListDialog,
  [DIALOGS.APP_INFO]: AppInfoDialog,
};

export const LeftDialog = ({ dialog, dialog_active, setDialogActive }: Props) => (
  Object.keys(LEFT_DIALOGS).map(item => (
    <div className={classnames('dialog', { active: dialog_active && (dialog === item) })} key={item}>
      { dialog && LEFT_DIALOGS[item] && React.createElement(LEFT_DIALOGS[item]) }
      <div className="dialog-close-button" onClick={() => setDialogActive(false)}>
        <Icon icon="icon-cancel-1" />
      </div>
    </div>
  ))
);
