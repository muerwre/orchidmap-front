// @flow
import React, { FC, memo } from 'react';
import { MapListDialog } from '~/components/dialogs/MapListDialog';
import { ReactElement } from 'react';

interface Props {
  address: string;
  stopEditing: typeof MapListDialog.stopEditing;
  dropRoute: typeof MapListDialog.dropRoute;
}

export const RouteRowDrop: FC<Props> = memo(({ address, stopEditing, dropRoute }) => (
  <div className="route-row-drop">
    <div className="route-row">
      <div className="button-group">
        <div className="button" onClick={dropRoute.bind(null, address)}>
          Удалить
        </div>
        <div className="button primary" onClick={stopEditing}>
          Отмена
        </div>
      </div>
    </div>
  </div>
));
