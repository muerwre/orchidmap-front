// @flow
import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { RouteRow } from '$components/maps/RouteRow';
import { Scroll } from '$components/Scroll';
import {
  searchSetDistance,
  searchSetTitle,
} from '$redux/user/actions';


import { Range } from 'rc-slider';

type Props = {
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
};

class Component extends React.Component<Props> {
  setTitle = ({ target: { value } }) => {
    this.props.searchSetTitle(value);
  };

  setDistanceMin = ({ target: { value } }) => {
    console.log('A');
    const parsed = parseInt(value > 0 ? value : 0, 10);
    const { distance } = this.props.routes.filter;

    this.props.searchSetDistance([parsed, distance[1] > parsed ? distance[1] : parsed]);
  };

  setDistanceMax = ({ target: { value } }) => {
    console.log('B');
    const parsed = parseInt(value > 0 ? value : 0, 10);
    const { distance } = this.props.routes.filter;

    this.props.searchSetDistance([distance[0], parsed > distance[0] ? parsed : distance[0]]);
  };

  render() {
    const {
      routes: {
        list,
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
        <div className="dialog-head">
          <div>
            <input
              type="text"
              placeholder="Поиск по названию"
              value={title}
              onChange={this.setTitle}
            />

            <br />

            <Range
              min={min}
              max={max}
              marks={marks}
              step={20}
              onChange={this.props.searchSetDistance}
              defaultValue={distance}
              pushable={20}
              disabled={list.length === 0 || min >= max}
            />

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
          </div>
        </Scroll>
      </div>
    );
  }
}

const mapStateToProps = ({ user: { editing, routes } }) => ({
  routes,
  editing,
  marks: [...new Array((routes.filter.max - routes.filter.min) / 20 + 1)].reduce((obj, el, i) => ({
    ...obj,
    [routes.filter.min + (i * 20)]: String(routes.filter.min + (i * 20)),
  }), {}),
});

const mapDispatchToProps = dispatch => bindActionCreators({
  searchSetDistance,
  searchSetTitle,
}, dispatch);

export const MapListMoreDialog = connect(mapStateToProps, mapDispatchToProps)(Component);
