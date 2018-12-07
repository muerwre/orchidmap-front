// @flow
import React from 'react';

import { EditorPanel } from '$components/panels/EditorPanel';
import { Fills } from '$components/Fills';
import { UserPanel } from '$components/panels/UserPanel';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { hot } from 'react-hot-loader';
import { Renderer } from '$components/renderer/Renderer';
import { hideRenderer } from '$redux/user/actions';
import { Cursor } from '$components/Cursor';
import { LeftDialog } from '$containers/LeftDialog';

type Props = {
  renderer_active: Boolean,
  hideRenderer: Function,
  mode: String,
  dialog: String,
  dialog_active: Boolean,
}

const Component = (props: Props) => (
  <div>
    <Fills />
    <UserPanel />
    <EditorPanel />
    <Cursor mode={props.mode} />
    <LeftDialog dialog={props.dialog} dialog_active={props.dialog_active} />

    { props.renderer_active &&
      <Renderer onClick={props.hideRenderer} />
    }
  </div>
);

const mapStateToProps = ({ user: { mode, dialog, dialog_active, renderer } }) => ({
  renderer_active: renderer.renderer_active,
  mode,
  dialog,
  dialog_active,
});

const mapDispatchToProps = dispatch => bindActionCreators({ hideRenderer }, dispatch);
export const App = connect(mapStateToProps, mapDispatchToProps)(hot(module)(Component));
