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
          title,
          distance,
          tab,
        }
      },
      editing,
    } = this.props;

    return (
      <div className="dialog-content">
        <div className="dialog-head">
          <div className="dialog-head-title">
            маршруты
          </div>
          <div>
            <input
              type="text"
              placeholder="title/address"
              value={title}
              onChange={this.setTitle}
            />

            <br />

            <input
              type="text"
              placeholder="min"
              value={distance[0]}
              onChange={this.setDistanceMin}
            />

            <input
              type="text"
              placeholder="max"
              value={distance[1]}
              onChange={this.setDistanceMax}
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
  // routes_sorted: Object.keys(routes).sort((a, b) => (Date.parse(routes[b].updated_at) - Date.parse(routes[a].updated_at))),
});

const mapDispatchToProps = dispatch => bindActionCreators({
  searchSetDistance,
  searchSetTitle,
}, dispatch);

export const MapListMoreDialog = connect(mapStateToProps, mapDispatchToProps)(Component);
