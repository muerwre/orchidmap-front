// @flow
import * as React from 'react';
import { Icon } from '$components/panels/Icon';
import classnames from 'classnames';
import { IMapListDialogState, MapListDialog } from "$components/dialogs/MapListDialog";
import { Tooltip } from "$components/panels/Tooltip";

interface Props {
  _id: string,
  tab: string,
  selected: boolean,
  title: string,
  distance: number,
  is_public: boolean,
  mode: IMapListDialogState['selected_item_mode'],

  openRoute: typeof MapListDialog.openRoute,
  startEditing: typeof MapListDialog.startEditing,
  stopEditing: typeof MapListDialog.stopEditing,
  showMenu: typeof MapListDialog.showMenu,
  showDropCard: typeof MapListDialog.showDropCard,
  key: string,
}

export const RouteRow = ({
  title, distance, _id, openRoute, tab, selected, startEditing, showMenu, showDropCard, mode
}: Props) => (
  <div
    className={classnames('route-row-wrapper', {
      selected,
      has_menu: selected && mode === 'menu',
      has_drop: selected && mode === 'drop',
      has_edit: selected && mode === 'edit',
    })}
  >
    <div
      className="route-row"
    >
      <div onClick={() => openRoute(_id)}>
        <div className="route-title">
          <span>{(title || _id)}</span>
        </div>
        <div className="route-description">
          <span>
            <Icon icon="icon-link-1" />
            {_id}
          </span>
          <span>
            <Icon icon="icon-cycle-1" />
            {(distance && `${distance} km`) || '0 km'}
          </span>
        </div>
      </div>
    </div>
    <div className="route-row-edit-button pointer" onClick={() => showMenu(_id)}>
      <Icon icon="icon-more-vert" />
      <div className="route-row-edit-menu">
        <div onClick={() => showDropCard(_id)}>
          <Tooltip>Удалить</Tooltip>
          <Icon icon="icon-trash-3" size={32} />
        </div>
        <div onClick={() => startEditing(_id)}>
          <Tooltip>Редактировать</Tooltip>
          <Icon icon="icon-edit-1" size={32} />
        </div>
      </div>
    </div>
  </div>
);
