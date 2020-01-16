import React, { FC, memo } from 'react';
import classnames from 'classnames';
import { MapListDialog } from '~/components/dialogs/MapListDialog';
import { RouteRowView } from '~/components/maps/RouteRowView';
import { RouteRowEditor } from '~/components/maps/RouteRowEditor';
import { RouteRowDrop } from '~/components/maps/RouteRowDrop';
import { ReactElement } from 'react';

interface Props {
  address: string;
  tab: string;
  title: string;
  distance: number;
  is_public: boolean;
  is_published: boolean;

  is_admin: boolean;
  is_editing_target: boolean;
  is_menu_target: boolean;

  openRoute: typeof MapListDialog.openRoute;
  startEditing: typeof MapListDialog.startEditing;
  stopEditing: typeof MapListDialog.stopEditing;
  showMenu: typeof MapListDialog.showMenu;
  hideMenu: typeof MapListDialog.hideMenu;
  showDropCard: typeof MapListDialog.showDropCard;
  dropRoute: typeof MapListDialog.dropRoute;
  modifyRoute: typeof MapListDialog.modifyRoute;
  toggleStarred: typeof MapListDialog.toggleStarred;

  is_editing_mode: 'edit' | 'drop';
}

export const RouteRowWrapper: FC<Props> = memo(
  ({
    title,
    distance,
    address,
    openRoute,
    tab,
    startEditing,
    showMenu,
    showDropCard,
    is_public,
    is_editing_target,
    is_menu_target,
    is_editing_mode,
    dropRoute,
    stopEditing,
    modifyRoute,
    hideMenu,
    is_admin,
    is_published,
    toggleStarred,
  }) => (
    <div
      className={classnames('route-row-wrapper', {
        is_menu_target,
        is_editing_target,
      })}
    >
      {is_editing_target && is_editing_mode === 'edit' && (
        <RouteRowEditor
          title={title}
          address={address}
          is_public={is_public}
          modifyRoute={modifyRoute}
        />
      )}
      {is_editing_target && is_editing_mode === 'drop' && (
        <RouteRowDrop address={address} dropRoute={dropRoute} stopEditing={stopEditing} />
      )}
      {!is_editing_target && (
        <RouteRowView
          address={address}
          tab={tab}
          title={title}
          distance={distance}
          is_public={is_public}
          is_published={is_published}
          openRoute={openRoute}
          startEditing={startEditing}
          stopEditing={stopEditing}
          showMenu={showMenu}
          hideMenu={hideMenu}
          showDropCard={showDropCard}
          is_admin={is_admin}
          toggleStarred={toggleStarred}
        />
      )}
    </div>
  )
);
