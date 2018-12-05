// @flow
import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { RouteRow } from '$components/maps/RouteRow';
import type { Route } from '$constants/types';

type Props = {
  routes: { [id: String]: Route },
  editing: Boolean,
};

const Component = ({ routes, editing }: Props) => (
  <div className="dialog-maplist">
    {
     Object.keys(routes).map(id => (
       <RouteRow
         editing={editing}
         {...routes[id]}
         key={id}
       />
      ))
    }
  </div>
);

const mapStateToProps = ({ user: { editing, user: { routes } } }) => ({
  routes, editing,
});

const mapDispatchToProps = dispatch => bindActionCreators({

}, dispatch);

export const MapListDialog = connect(mapStateToProps, mapDispatchToProps)(Component);
