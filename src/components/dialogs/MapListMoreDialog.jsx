// @flow
import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { RouteRow } from '$components/maps/RouteRow';
import { Scroll } from '$components/Scroll';
import {
  searchSetDistance,
  searchSetTitle,
  searchSetTab,
} from '$redux/user/actions';
import classnames from 'classnames';

import { Range } from 'rc-slider';
import { TABS } from '$constants/dialogs';
import { Icon } from '$components/panels/Icon';

type Props = {
  ready: Boolean,
  routes: {
    limit: Number,
    loading: Boolean, // <-- maybe delete this
    list: Array<Object>,
    filter: {
      title: String,
      author: String,
      distance: Array<Number>,
      tab: Array<string>,
    }
  },
  editing: Boolean,
  routes_sorted: Array<string>,

  searchSetAuthor: Function,
  searchSetDistance: Function,
  searchSetTitle: Function,
  searchSetTab: Function,
};

class Component extends React.Component<Props> {
  setTitle = ({ target: { value } }) => {
    this.props.searchSetTitle(value);
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

    return (
      <div className="dialog-content">
        <div className="dialog-tabs">
          {
            Object.keys(TABS).map(item => (
              <div
                className={classnames('dialog-tab', { active: tab === item})}
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
        <Scroll className="dialog-shader">
          <div className="dialog-maplist">
            {
              list.map(route => (
                <RouteRow
                  editing={editing}
                  {...route}
                  key={route._id}
                />
              ))
            }
            { list.length === 0 && loading &&
                <div className="dialog-maplist-loader">
                  <div className="dialog-maplist-icon spin">
                    <Icon icon="icon-sync-1" />
                  </div>
                  Загрузка
                </div>
            }
            { ready && !loading && list.length === 0 &&
                <div className="dialog-maplist-loader">
                  <div className="dialog-maplist-icon">
                    <Icon icon="icon-block-1" />
                  </div>
                  НИЧЕГО НЕ НАЙДЕНО
                </div>
            }
          </div>
        </Scroll>
      </div>
    );
  }
}

const mapStateToProps = ({ user: { editing, routes } }) => {
  if (routes.filter.max >= 9999){
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
}, dispatch);

export const MapListMoreDialog = connect(mapStateToProps, mapDispatchToProps)(Component);
