// @flow
import React from 'react';
import { DIALOGS } from '$constants/dialogs';
import { MapListDialog } from '$components/dialogs/MapListDialog';
import classnames from 'classnames';
import { AppInfoDialog } from '$components/dialogs/AppInfoDialog';

type Props = {
  dialog: String,
  dialog_active: Boolean,
}

const LEFT_DIALOGS = {
  [DIALOGS.MAP_LIST]: MapListDialog,
  [DIALOGS.APP_INFO]: AppInfoDialog,
};

export const LeftDialog = ({ dialog, dialog_active }: Props) => (
  Object.keys(LEFT_DIALOGS).map(item => (
    <div className={classnames('dialog', { active: dialog_active && (dialog === item) })} key={item}>
      { dialog && LEFT_DIALOGS[item] && React.createElement(LEFT_DIALOGS[item]) }
    </div>
  ))
);
