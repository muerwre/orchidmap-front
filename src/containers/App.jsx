// @flow
import React from 'react';

import { EditorPanel } from '$components/panels/EditorPanel';
import { Fills } from '$components/Fills';
import { UserLocation } from '$components/UserLocation';
import { UserPanel } from '$components/panels/UserPanel';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { hot } from 'react-hot-loader';
import { Renderer } from '$components/renderer/Renderer';
import { hideRenderer } from '$redux/user/actions';
import { Cursor } from '$components/Cursor';

type Props = {
  renderer_active: Boolean,
  hideRenderer: Function,
  mode: String,
}

const Component = (props: Props) => (
  <div>
    <Fills />
    <UserLocation />
    <UserPanel />
    <EditorPanel />
    <Cursor mode={props.mode} />

    { props.renderer_active && <Renderer onClick={props.hideRenderer} /> }
  </div>
);


const mapStateToProps = ({ user }) => ({
  renderer_active: user.renderer.renderer_active,
  mode: user.mode,
});
const mapDispatchToProps = dispatch => bindActionCreators({ hideRenderer }, dispatch);
export const App = connect(mapStateToProps, mapDispatchToProps)(hot(module)(Component));
