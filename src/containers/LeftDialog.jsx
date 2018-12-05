// @flow
import React from 'react';
import { DIALOGS } from '$constants/dialogs';
import { MapListDialog } from '$components/dialogs/MapListDialog';
import classnames from 'classnames';

type Props = {
  dialog: String,
  dialog_active: Boolean,
}

export const LeftDialog = ({ dialog, dialog_active }: Props) => (
  <div className={classnames('dialog', { active: dialog_active })}>
    { dialog === DIALOGS.MAP_LIST && <MapListDialog /> }
  </div>
);
