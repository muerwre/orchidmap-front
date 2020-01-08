// @flow
import React from "react";
import { Icon } from "$components/panels/Icon";
import { MapListDialog } from "$components/dialogs/MapListDialog";
import { Tooltip } from "$components/panels/Tooltip";
import { ReactElement } from "react";
import classnames from "classnames";
import { toggleRouteStarred } from "$redux/user/actions";
import { TABS } from "$constants/dialogs";

interface Props {
  tab: string;

  address: string;
  title: string;
  distance: number;
  is_public: boolean;
  is_admin: boolean;
  is_published: boolean;

  openRoute: typeof MapListDialog.openRoute;
  toggleStarred: typeof MapListDialog.toggleStarred;
  startEditing: typeof MapListDialog.startEditing;
  stopEditing: typeof MapListDialog.stopEditing;
  showMenu: typeof MapListDialog.showMenu;
  hideMenu: typeof MapListDialog.hideMenu;
  showDropCard: typeof MapListDialog.showDropCard;
}

export const RouteRowView = ({
  title,
  distance,
  address,
  openRoute,
  tab,
  startEditing,
  showMenu,
  showDropCard,
  hideMenu,
  is_admin,
  is_published,
  toggleStarred
}: Props): ReactElement<Props, null> => (
  <div className={classnames("route-row-view", { has_menu: tab === "my" })}>
    {(tab === TABS.PENDING || tab === TABS.STARRED) && is_admin && (
      <div className="route-row-fav" onClick={toggleStarred.bind(null, address)}>
        {is_published ? (
          <Icon icon="icon-star-fill" size={24} />
        ) : (
          <Icon icon="icon-star-blank" size={24} />
        )}
      </div>
    )}
    <div className="route-row" onClick={() => openRoute(address)}>
      <div className="route-title">
        {(tab === "my" || !is_admin) && is_published && (
          <div className="route-row-corner">
            <Icon icon="icon-star-fill" size={18} />
          </div>
        )}
        <span>{title || address}</span>
      </div>

      <div className="route-description">
        <span>
          <Icon icon="icon-link-1" />
          {address}
        </span>
        <span>
          <Icon icon="icon-cycle-1" />
          {(distance && `${distance} km`) || "0 km"}
        </span>
      </div>
    </div>
    {tab === "my" && (
      <React.Fragment>
        <div
          className="route-row-edit-button pointer"
          onMouseOver={showMenu.bind(null, address)}
          onMouseOut={hideMenu}
        >
          <Icon icon="icon-more-vert" />
          <div className="route-row-edit-menu pointer">
            <div onMouseDown={showDropCard.bind(null, address)}>
              <Tooltip>Удалить</Tooltip>
              <Icon icon="icon-trash-3" size={32} />
            </div>
            <div
              onMouseDown={startEditing.bind(null, address)}
              className="modify-button"
            >
              <Tooltip>Редактировать</Tooltip>
              <Icon icon="icon-edit-1" size={32} />
            </div>
          </div>
        </div>
      </React.Fragment>
    )}
  </div>
);
