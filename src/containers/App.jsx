// @flow
import React from 'react';

import { editor } from '$modules/Editor';
import { EditorPanel } from '$components/panels/EditorPanel';
import { Fills } from '$components/Fills';
import { UserLocation } from '$components/UserLocation';
import { UserPanel } from '$components/panels/UserPanel';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { hot } from 'react-hot-loader';
import type { UserType } from '$constants/types';

type Props = {
  user: UserType,
}


class Component extends React.Component<Props, void> {
  // state = {
  //   // mode: 'none',
  //   // editing: false,
  //   logo: DEFAULT_LOGO,
  //   routerPoints: 0,
  //   totalDistance: 0,
  //   estimateTime: 0,
  //   activeSticker: null,
  //   // user: {
  //   //   ...DEFAULT_USER,
  //   // },
  //   // title: '',
  //   // address: '',
  //   // changed: false,
  // };

  componentDidMount() {
    // this.authInit();
    window.editor = editor;
  }
  //
  // mapInit = () => {
  //   const { path, mode } = getUrlData();
  //   if (path) {
  //     getStoredMap({ name: path })
  //       .then(this.setDataOnLoad)
  //       .then(() => {
  //         if (mode && mode === 'edit') {
  //           editor.startEditing();
  //         } else {
  //           editor.stopEditing();
  //         }
  //       })
  //       .catch(this.startEmptyEditor);
  //   } else {
  //     // this.hideLoader();
  //     this.startEmptyEditor();
  //   }
  // };
  //
  // startEmptyEditor = () => {
  //   const { user } = this.state;
  //   if (!user || !user.random_url || !user.id) return;
  //
  //   pushPath(`/${user.random_url}/edit`);
  //
  //   editor.owner = user.id;
  //   editor.startEditing();
  //
  //   this.hideLoader();
  //
  //   this.clearChanged();
  // };
  //
  // setTitle = title => this.setState({ title });
  // setAddress = address => {
  //   this.setState({ address });
  // };
  //
  // getTitle = () => this.state.title;
  //
  // setDataOnLoad = data => {
  //   this.clearChanged();
  //   editor.setData(data);
  //   this.hideLoader();
  // };
  //
  // hideLoader = () => {
  //   document.getElementById('loader').style.opacity = 0;
  //   document.getElementById('loader').style.pointerEvents = 'none';
  // };
  //
  // setMode = mode => {
  //   this.setState({ mode });
  // };
  //
  // setRouterPoints = routerPoints => {
  //   this.setState({ routerPoints });
  // };
  //
  // setTotalDist = totalDistance => {
  //   const time = (totalDistance && (totalDistance / 15)) || 0;
  //   const estimateTime = (time && parseFloat(time.toFixed(1)));
  //   this.setState({ totalDistance, estimateTime });
  // };
  //
  // setActiveSticker = activeSticker => {
  //   this.setState({ activeSticker });
  // };
  //
  // setLogo = logo => {
  //   this.setState({ logo });
  // };
  //
  // setEditing = editing => {
  //   this.setState({ editing });
  // };
  //
  // getUser = () => this.state.user;
  // //
  // // triggerOnChange = () => {
  // //   if (!this.state.editing) return;
  // //
  // //   this.setState({ changed: true });
  // // };
  //
  // clearChanged = () => {
  //   this.setState({ changed: false });
  // };

  // editor = new Editor({
  //   container: 'map',
  //   mode: this.state.mode,
  //   setMode: this.setMode,
  //   setRouterPoints: this.setRouterPoints,
  //   setTotalDist: this.setTotalDist,
  //   setActiveSticker: this.setActiveSticker,
  //   setLogo: this.setLogo,
  //   setEditing: this.setEditing,
  //   setTitle: this.setTitle,
  //   setAddress: this.setAddress,
  //   getUser: this.getUser,
  //   triggerOnChange: this.triggerOnChange,
  //   clearChanged: this.clearChanged,
  //   getTitle: this.getTitle,
  // });

  // authInit = () => {
  //   const user = this.getUserData();
  //
  //   const { id, token } = (user || {});
  //
  //   if (id && token) {
  //     checkUserToken({
  //       id,
  //       token
  //     })
  //       .then(this.setUser)
  //       .then(this.mapInit);
  //   } else {
  //     getGuestToken()
  //       .then(this.setUser)
  //       .then(this.mapInit);
  //   }
  // };

  // setUser = user => {
  //   if (!user.token || !user.id) return;
  //
  //   if (this.state.user.id === editor.owner) {
  //     editor.owner = user.id;
  //   }
  //
  //   this.setState({
  //     user: {
  //       ...DEFAULT_USER,
  //       ...user,
  //     }
  //   });
  //
  //   this.storeUserData();
  // };

  // storeUserData = () => {
  //   storeData('user', this.state.user);
  // };

  // getUserData = () => getData('user') || null;
  //
  // userLogout = () => {
  //   if (this.state.user.id === editor.owner) {
  //     editor.owner = null;
  //   }
  //   //
  //   this.setState({
  //     user: DEFAULT_USER,
  //   });
  //
  //   setTimeout(this.storeUserData, 0);
  // };

  render() {
    const { props: { user } } = this;

    return (
      <div>
        <Fills />

        <UserLocation editor={editor} />

        <UserPanel
          editor={editor}
          user={user}
          // setUser={this.setUser}
          // userLogout={this.userLogout}
        />

        <EditorPanel />
      </div>
    );
  }
}

function mapStateToProps(state) {
  const {
    user: {
      user,
      editing,
      mode,
      routerPoints,
      totalDistance,
      estimateTime,
      activeSticker,
      logo,
      title,
      address,
      changed,
    },
  } = state;

  return {
    user,
    editing,
    mode,
    routerPoints,
    totalDistance,
    estimateTime,
    activeSticker,
    logo,
    title,
    address,
    changed,
  };
}

const mapDispatchToProps = dispatch => bindActionCreators({

}, dispatch);

export const App = connect(
  mapStateToProps,
  mapDispatchToProps
)(hot(module)(Component));
