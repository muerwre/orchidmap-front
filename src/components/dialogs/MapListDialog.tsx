import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { RouteRowWrapper } from '~/components/maps/RouteRowWrapper';
import { Scroll } from '~/components/Scroll';
import {
  searchSetDistance,
  searchSetTitle,
  searchSetTab,
  mapsLoadMore,
  dropRoute,
  modifyRoute,
  toggleRouteStarred,
} from '~/redux/user/actions';

import { editorSetDialogActive } from '~/redux/editor/actions';

import { isMobile } from '~/utils/window';
import classnames from 'classnames';

import { TABS, TABS_TITLES } from '~/constants/dialogs';
import { Icon } from '~/components/panels/Icon';
import { pushPath } from '~/utils/history';
import { IRouteListItem } from '~/redux/user';
import { ROLES } from '~/constants/auth';
import { IState } from '~/redux/store';
import { MapListDialogHead } from '~/components/search/MapListDialogHead';

const mapStateToProps = ({
  editor: { editing },
  user: {
    routes,
    user: { role },
  },
}: IState) => {
  if (routes.filter.max >= 9999) {
    return {
      routes,
      editing,
      ready: false,
      role,
    };
  }

  return {
    role,
    routes,
    editing,
    ready: true,
  };
};

const mapDispatchToProps = {
  searchSetDistance,
  searchSetTitle,
  searchSetTab,
  editorSetDialogActive,
  mapsLoadMore,
  dropRoute,
  modifyRoute,
  toggleRouteStarred,
};

type Props = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps & {};

export interface State {
  menu_target: IRouteListItem['address'];
  editor_target: IRouteListItem['address'];

  is_editing: boolean;
  is_dropping: boolean;
}

class MapListDialogUnconnected extends PureComponent<Props, State> {
  state = {
    menu_target: null,
    editor_target: null,

    is_editing: false,
    is_dropping: false,
  };

  startEditing = (editor_target: IRouteListItem['address']): void =>
    this.setState({
      editor_target,
      menu_target: null,
      is_editing: true,
      is_dropping: false,
    });

  showMenu = (menu_target: IRouteListItem['address']): void =>
    this.setState({
      menu_target,
    });

  hideMenu = (): void =>
    this.setState({
      menu_target: null,
    });

  showDropCard = (editor_target: IRouteListItem['address']): void =>
    this.setState({
      editor_target,
      menu_target: null,
      is_editing: false,
      is_dropping: true,
    });

  stopEditing = (): void => {
    this.setState({ editor_target: null });
  };

  setTitle = ({ target: { value } }: { target: { value: string } }): void => {
    this.props.searchSetTitle(value);
  };

  openRoute = (_id: string): void => {
    if (isMobile()) this.props.editorSetDialogActive(false);

    this.stopEditing();

    pushPath(`/${_id}`);
  };

  onScroll = (e: {
    target: { scrollHeight: number; scrollTop: number; clientHeight: number };
  }): void => {
    const {
      target: { scrollHeight, scrollTop, clientHeight },
    } = e;
    const delta = scrollHeight - scrollTop - clientHeight;

    if (
      delta < 500 &&
      this.props.routes.list.length < this.props.routes.limit &&
      !this.props.routes.loading
    ) {
      this.props.mapsLoadMore();
    }
  };

  dropRoute = (address: string): void => {
    this.props.dropRoute(address);
  };

  modifyRoute = ({
    address,
    title,
    is_public,
  }: {
    address: string;
    title: string;
    is_public: boolean;
  }): void => {
    this.props.modifyRoute(address, { title, is_public });
    this.stopEditing();
  };

  toggleStarred = (id: string) => this.props.toggleRouteStarred(id);

  render() {
    const {
      ready,
      role,
      routes: {
        list,
        loading,
        filter: { min, max, title, distance, tab },
      },
    }: // marks,
    Props = this.props;

    const { editor_target, menu_target, is_editing, is_dropping } = this.state;

    return (
      <div className="dialog-content">
        {list.length === 0 && loading && (
          <div className="dialog-maplist-loader">
            <div className="dialog-maplist-icon spin">
              <Icon icon="icon-sync-1" />
            </div>
          </div>
        )}

        {ready && !loading && list.length === 0 && (
          <div className="dialog-maplist-loader">
            <div className="dialog-maplist-icon">
              <Icon icon="icon-sad-1" />
            </div>
            ТУТ ПУСТО <br />И ОДИНОКО
          </div>
        )}

        <div className="dialog-tabs">
          {Object.values(TABS).map(
            item =>
              (role === ROLES.admin || item !== TABS.PENDING) && (
                <div
                  className={classnames('dialog-tab', { active: tab === item })}
                  onClick={() => this.props.searchSetTab(item)}
                  key={item}
                >
                  {TABS_TITLES[item]}
                </div>
              )
          )}
        </div>

        <MapListDialogHead
          min={min}
          max={max}
          distance={distance}
          onDistanceChange={this.props.searchSetDistance}
          ready={ready}
          search={title}
          onSearchChange={this.setTitle}
        />

        <Scroll className="dialog-shader" onScroll={this.onScroll}>
          <div className="dialog-maplist">
            {list.map(route => (
              <RouteRowWrapper
                title={route.title}
                distance={route.distance}
                address={route.address}
                is_public={route.is_public}
                is_published={route.is_published}
                tab={tab}
                is_editing_mode={is_dropping ? 'drop' : 'edit'}
                is_editing_target={editor_target === route.address}
                is_menu_target={menu_target === route.address}
                openRoute={this.openRoute}
                startEditing={this.startEditing}
                stopEditing={this.stopEditing}
                showMenu={this.showMenu}
                hideMenu={this.hideMenu}
                showDropCard={this.showDropCard}
                dropRoute={this.dropRoute}
                modifyRoute={this.modifyRoute}
                toggleStarred={this.toggleStarred}
                key={route.address}
                is_admin={role === ROLES.admin}
              />
            ))}
          </div>
        </Scroll>

        <div className={classnames('dialog-maplist-pulse', { active: loading })} />
      </div>
    );
  }
}

const MapListDialog = connect(mapStateToProps, mapDispatchToProps)(MapListDialogUnconnected);

export { MapListDialog };
