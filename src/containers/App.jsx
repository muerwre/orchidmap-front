// @flow
import React from 'react';

import { EditorPanel } from '$components/panels/EditorPanel';
import { Fills } from '$components/Fills';
import { UserLocation } from '$components/UserLocation';
import { UserPanel } from '$components/panels/UserPanel';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { hot } from 'react-hot-loader';

const Component = () => (
  <div>
    <Fills />
    <UserLocation />
    <UserPanel />
    <EditorPanel />
  </div>
);


const mapStateToProps = () => ({});
const mapDispatchToProps = dispatch => bindActionCreators({}, dispatch);
export const App = connect(mapStateToProps, mapDispatchToProps)(hot(module)(Component));
