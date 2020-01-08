import React from 'react';
import { connect } from 'react-redux';
import { RouteRowWrapper } from '$components/maps/RouteRowWrapper';
import { Scroll } from '$components/Scroll';
import {
  searchSetDistance,
  searchSetTitle,
  searchSetTab,
  setDialogActive,
  mapsLoadMore,
  dropRoute,
  modifyRoute,
  toggleRouteStarred,
} from '$redux/user/actions';
import { isMobile } from '$utils/window';
import classnames from 'classnames';

import Range from 'rc-slider/lib/Range';
import { TABS, TABS_TITLES } from '$constants/dialogs';
import { Icon } from '$components/panels/Icon';
import { pushPath } from '$utils/history';
import { IRootState, IRouteListItem } from '$redux/user';
import { ROLES } from '$constants/auth';
import { IState } from '$redux/store';

export interface IMapListDialogProps extends IRootState {
  marks: { [x: number]: string };
  routes_sorted: Array<IRouteListItem>;
  routes: IRootState['routes'];
  ready: IRootState['ready'];
  role: IRootState['user']['role'];

  mapsLoadMore: typeof mapsLoadMore;
  searchSetDistance: typeof searchSetDistance;
  searchSetTitle: typeof searchSetTitle;
  searchSetTab: typeof searchSetTab;
  setDialogActive: typeof setDialogActive;
  dropRoute: typeof dropRoute;
  modifyRoute: typeof modifyRoute;
  toggleRouteStarred: typeof toggleRouteStarred;
}

export interface IMapListDialogState {
  menu_target: IRouteListItem['address'];
  editor_target: IRouteListItem['address'];

  is_editing: boolean;
  is_dropping: boolean;
}

class MapListDialogUnconnected extends React.Component<IMapListDialogProps, IMapListDialogState> {
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
    if (isMobile()) this.props.setDialogActive(false);

    // pushPath(`/${_id}/${this.props.editing ? 'edit' : ''}`);
    this.stopEditing();

    pushPath(`/${_id}`);

    // pushPath(`/${_id}/${this.props.editing ? 'edit' : ''}`);
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
      marks,
    }: IMapListDialogProps = this.props;

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
        <div className="dialog-head">
          <div>
            <input
              type="text"
              placeholder="Поиск по названию"
              value={title}
              onChange={this.setTitle}
            />
            <br />
            {ready && Object.keys(marks).length > 2 ? (
              <Range
                min={min}
                max={max}
                marks={marks}
                step={25}
                onChange={this.props.searchSetDistance}
                defaultValue={[0, 10000]}
                value={distance}
                pushable={25}
                disabled={min >= max}
              />
            ) : (
              <div className="range-placeholder" />
            )}
          </div>
        </div>

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

const mapStateToProps = ({
  user: {
    editing,
    routes,
    user: { role },
  },
}: IState) => {
  if (routes.filter.max >= 9999) {
    return {
      routes,
      editing,
      marks: {},
      ready: false,
      role,
    };
  }

  return {
    role,
    routes,
    editing,
    ready: true,
    marks: [...new Array(Math.floor((routes.filter.max - routes.filter.min) / 25) + 1)].reduce(
      (obj, el, i) => ({
        ...obj,
        [routes.filter.min + i * 25]: ` ${routes.filter.min + i * 25}${
          routes.filter.min + i * 25 >= 200 ? '+' : ''
        }
      `,
      }),
      {}
    ),
  };
};

const mapDispatchToProps = {
  searchSetDistance,
  searchSetTitle,
  searchSetTab,
  setDialogActive,
  mapsLoadMore,
  dropRoute,
  modifyRoute,
  toggleRouteStarred,
};

const MapListDialog = connect(mapStateToProps, mapDispatchToProps)(MapListDialogUnconnected);

export { MapListDialog };
