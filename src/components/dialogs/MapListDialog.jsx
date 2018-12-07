// @flow
import React from 'react';
// import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { RouteRow } from '$components/maps/RouteRow';
import type { Route } from '$constants/types';
import { Scroll } from '$components/Scroll';

type Props = {
  routes: { [id: String]: Route },
  editing: Boolean,
  routes_sorted: Array<string>,
};

const Component = ({ routes, editing, routes_sorted }: Props) => (
  <Scroll
    className="dialog-content"
  >
    <div className="dialog-maplist">
      {
          routes_sorted.map(id => (
            <RouteRow
              editing={editing}
              {...routes[id]}
              key={id}
            />
          ))
        }
    </div>
  </Scroll>
);

const mapStateToProps = ({ user: { editing, user: { routes } } }) => ({
  routes,
  editing,
  routes_sorted: Object.keys(routes).sort((a, b) => (Date.parse(routes[b].updated_at) - Date.parse(routes[a].updated_at))),
});

// const mapDispatchToProps = dispatch => bindActionCreators({}, dispatch);

export const MapListDialog = connect(mapStateToProps)(Component);
