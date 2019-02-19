import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { RouteRow } from '$components/maps/RouteRow';
import { Scroll } from '$components/Scroll';
import {
  searchSetDistance,
  searchSetTitle,
  searchSetTab,
  setDialogActive, mapsLoadMore,
} from '$redux/user/actions';
import { isMobile } from '$utils/window';
import classnames from 'classnames';

import { Range } from 'rc-slider';
import { TABS } from '$constants/dialogs';
import { Icon } from '$components/panels/Icon';
import { pushPath } from '$utils/history';
import { IRootState } from '$redux/user/reducer';

interface Props extends IRootState {
  marks: { [x: number]: string },
  routes_sorted: Array<string>,
  mapsLoadMore: typeof mapsLoadMore,
  searchSetDistance: typeof searchSetDistance,
  searchSetTitle: typeof searchSetTitle,
  searchSetTab: typeof searchSetTab,
  setDialogActive: typeof setDialogActive,
}

interface State {
  editing_item: string,
}

class Component extends React.Component<Props, State> {
  state = {
    editing_item: null,
  };

  startEditing = editing_item => this.setState({ editing_item });
  stopEditing = () => this.setState({ editing_item: null });

  setTitle = ({ target: { value } }: { target: { value: string }}): void => {
    this.props.searchSetTitle(value);
  };

  openRoute = (_id: string): void => {
    if (isMobile()) this.props.setDialogActive(false);

    pushPath(`/${_id}/${this.props.editing ? 'edit' : ''}`);
  };

  onScroll = (e: { target: { scrollHeight: number, scrollTop: number, clientHeight: number }}): void => {
    const { target: { scrollHeight, scrollTop, clientHeight }} = e;
    const delta = scrollHeight - scrollTop - clientHeight;

    if (
      delta < 500 &&
      this.props.routes.list.length < this.props.routes.limit &&
      !this.props.routes.loading
    ) {
      this.props.mapsLoadMore();
    }
  };

  render() {
    const {
      ready,
      routes: {
        list,
        loading,
        filter: {
          min,
          max,
          title,
          distance,
          tab,
        }
      },
      editing,
      marks,
    } = this.props;

    const { editing_item } = this.state;

    return (
      <div className="dialog-content">
        { list.length === 0 && loading &&
          <div className="dialog-maplist-loader">
            <div className="dialog-maplist-icon spin">
              <Icon icon="icon-sync-1" />
            </div>
          </div>
        }
        { ready && !loading && list.length === 0 &&
          <div className="dialog-maplist-loader">
            <div className="dialog-maplist-icon">
              <Icon icon="icon-sad-1" />
            </div>
                ТУТ ПУСТО <br />
                И ОДИНОКО
          </div>
        }
        <div className="dialog-tabs">
          {
            Object.keys(TABS).map(item => (
              <div
                className={classnames('dialog-tab', { active: tab === item })}
                onClick={() => this.props.searchSetTab(item)}
                key={item}
              >
                {TABS[item]}
              </div>
            ))
          }
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
            {
              ready
                ?
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
                : <div className="range-placeholder" />
            }

          </div>
        </div>

        <Scroll
          className="dialog-shader"
          onScroll={this.onScroll}
        >
          <div className="dialog-maplist">
            {
              list.map(route => (
                <RouteRow
                  editing={editing}
                  {...route}
                  tab={tab}
                  is_editing={(editing_item === route._id)}
                  openRoute={this.openRoute}
                  startEditing={this.startEditing}
                  stopEditing={this.stopEditing}
                  key={route._id}
                />
              ))
            }
          </div>
        </Scroll>

        <div className={classnames('dialog-maplist-pulse', { active: loading })} />
      </div>
    );
  }
}

const mapStateToProps = ({ user: { editing, routes } }) => {
  if (routes.filter.max >= 9999) {
    return {
      routes, editing, marks: {}, ready: false,
    };
  }
  return ({
    routes,
    editing,
    ready: true,
    marks: [...new Array(Math.floor((routes.filter.max - routes.filter.min) / 25) + 1)].reduce((obj, el, i) => ({
      ...obj,
      [routes.filter.min + (i * 25)]:
        ` ${routes.filter.min + (i * 25)}${(routes.filter.min + (i * 25) >= 200) ? '+' : ''}
      `,
    }), {}),
  });
};

const mapDispatchToProps = dispatch => bindActionCreators({
  searchSetDistance,
  searchSetTitle,
  searchSetTab,
  setDialogActive,
  mapsLoadMore,
}, dispatch);

export const MapListDialog = connect(mapStateToProps, mapDispatchToProps)(Component);
