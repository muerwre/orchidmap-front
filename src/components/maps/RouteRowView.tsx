// @flow
import * as React from 'react';
import { Icon } from '$components/panels/Icon';
import { MapListDialog } from "$components/dialogs/MapListDialog";
import { Tooltip } from "$components/panels/Tooltip";
import { ReactElement } from "react";
import classnames from 'classnames';
import { toggleRouteStarred } from "$redux/user/actions";

interface Props {
  tab: string,

  _id: string,
  title: string,
  distance: number,
  is_public: boolean,
  is_admin: boolean,
  is_starred: boolean,

  openRoute: typeof MapListDialog.openRoute,
  toggleStarred: typeof MapListDialog.toggleStarred,
  startEditing: typeof MapListDialog.startEditing,
  stopEditing: typeof MapListDialog.stopEditing,
  showMenu: typeof MapListDialog.showMenu,
  hideMenu: typeof MapListDialog.hideMenu,
  showDropCard: typeof MapListDialog.showDropCard,
}

export const RouteRowView = ({
  title, distance, _id, openRoute, tab, startEditing, showMenu, showDropCard, hideMenu, is_admin, is_starred, toggleStarred,
}: Props): ReactElement<Props, null> => (
  <div
    className={classnames('route-row-view', { has_menu: (tab === 'mine') })}
  >
    {
      (tab === 'all' || tab === 'starred') && is_admin &&
      <div className="route-row-fav" onClick={toggleStarred.bind(null, _id)}>
        {
          is_starred
            ? <Icon icon="icon-star-fill" size={24} />
            : <Icon icon="icon-star-blank" size={24} />
        }
      </div>
    }
    <div
      className="route-row"
      onClick={() => openRoute(_id)}
    >
      <div className="route-title">
        {
          (tab === 'mine' || !is_admin) && is_starred &&
          <div className="route-row-corner"><Icon icon="icon-star-fill" size={18} /></div>
        }
        <span>
          {(title || _id)}
        </span>
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
    {
      tab === 'mine' &&
        <React.Fragment>
          <div
            className="route-row-edit-button pointer"
            onMouseOver={showMenu.bind(null, _id)}
            onMouseOut={hideMenu}
          >
            <Icon icon="icon-more-vert" />
            <div className="route-row-edit-menu pointer">
              <div onMouseDown={showDropCard.bind(null, _id)}>
                <Tooltip>Удалить</Tooltip>
                <Icon icon="icon-trash-3" size={32} />
              </div>
              <div onMouseDown={startEditing.bind(null, _id)} className="modify-button">
                <Tooltip>Редактировать</Tooltip>
                <Icon icon="icon-edit-1" size={32} />
              </div>
            </div>
          </div>
        </React.Fragment>
    }
  </div>
);
