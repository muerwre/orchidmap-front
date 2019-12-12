// @flow
import * as React from 'react';
import { Icon } from '$components/panels/Icon';
import { MapListDialog } from "$components/dialogs/MapListDialog";
import { Tooltip } from "$components/panels/Tooltip";
import { ReactElement } from "react";

interface Props {
  address: string,
  stopEditing: typeof MapListDialog.stopEditing,
  dropRoute: typeof MapListDialog.dropRoute,
}

export const RouteRowDrop = ({
  address, stopEditing, dropRoute,
}: Props): ReactElement<Props, null> => (
  <div
    className="route-row-drop"
  >
    <div
      className="route-row"
    >
      <div className="button-group">
        <div className="button" onClick={dropRoute.bind(null, address)}>Удалить</div>
        <div className="button primary" onClick={stopEditing}>Отмена</div>
      </div>
    </div>
  </div>
);
