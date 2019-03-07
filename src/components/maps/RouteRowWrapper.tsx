import * as React from 'react';
import classnames from 'classnames';
import { MapListDialog } from "$components/dialogs/MapListDialog";
import { RouteRowView } from "$components/maps/RouteRowView";
import { RouteRowEditor } from "$components/maps/RouteRowEditor";
import { RouteRowDrop } from "$components/maps/RouteRowDrop";
import { ReactElement } from "react";

interface Props {
  _id: string,
  tab: string,
  title: string,
  distance: number,
  is_public: boolean,

  is_editing_target: boolean,
  is_menu_target: boolean,

  openRoute: typeof MapListDialog.openRoute,
  startEditing: typeof MapListDialog.startEditing,
  stopEditing: typeof MapListDialog.stopEditing,
  showMenu: typeof MapListDialog.showMenu,
  hideMenu: typeof MapListDialog.hideMenu,
  showDropCard: typeof MapListDialog.showDropCard,
  dropRoute: typeof MapListDialog.dropRoute,
  modifyRoute: typeof MapListDialog.modifyRoute,

  is_editing_mode: 'edit' | 'drop',
}

export const RouteRowWrapper = ({
  title, distance, _id, openRoute, tab,  startEditing, showMenu,
  showDropCard, is_public, is_editing_target, is_menu_target, is_editing_mode,
  dropRoute, stopEditing, modifyRoute, hideMenu,
}: Props): ReactElement<Props, null> => (
  <div
    className={classnames('route-row-wrapper', {
      is_menu_target,
      is_editing_target,
    })}
  >
    {
      is_editing_target && is_editing_mode === 'edit' &&
        <RouteRowEditor
          title={title}
          _id={_id}
          is_public={is_public}
          modifyRoute={modifyRoute}
        />
    }
    {
      is_editing_target && is_editing_mode === 'drop' &&
        <RouteRowDrop
          _id={_id}
          dropRoute={dropRoute}
          stopEditing={stopEditing}
        />
    }
    {
      !is_editing_target &&
        <RouteRowView
          _id={_id}
          tab={tab}
          title={title}
          distance={distance}
          is_public={is_public}
          openRoute={openRoute}
          startEditing={startEditing}
          stopEditing={stopEditing}
          showMenu={showMenu}
          hideMenu={hideMenu}
          showDropCard={showDropCard}
        />
    }
  </div>
);
