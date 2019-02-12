// @flow
import * as React from 'react';
import { DIALOGS, IDialogs } from '$constants/dialogs';
import * as classnames from 'classnames';
import { AppInfoDialog } from '$components/dialogs/AppInfoDialog';
import { Icon } from '$components/panels/Icon';
import { MapListDialog } from '$components/dialogs/MapListDialog';
import * as ActionCreators from "$redux/user/actions";
import { StatelessComponent } from "react";

interface Props {
  dialog: keyof IDialogs,
  dialog_active: Boolean,
  setDialogActive: typeof ActionCreators.setDialogActive,
}

const LEFT_DIALOGS = {
  [DIALOGS.MAP_LIST]: MapListDialog,
  [DIALOGS.APP_INFO]: AppInfoDialog,
};

export const LeftDialog = ({ dialog, dialog_active, setDialogActive }: Props) => (
  <React.Fragment>
    {
      Object.keys(LEFT_DIALOGS).map(item => (
        <div className={classnames('dialog', { active: dialog_active && (dialog === item) })} key={item}>
          { dialog && LEFT_DIALOGS[item] && React.createElement(LEFT_DIALOGS[item]) }
          <div className="dialog-close-button" onClick={() => setDialogActive(false)}>
            <Icon icon="icon-cancel-1" />
          </div>
        </div>
      ))
    }
  </React.Fragment>
);

