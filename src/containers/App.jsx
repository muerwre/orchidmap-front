import React from 'react';

import { Editor } from '$modules/Editor';
import { EditorPanel } from '$components/panels/EditorPanel';
import { Fills } from '$components/Fills';
import { DEFAULT_LOGO } from '$constants/logos';
import { UserLocation } from '$components/UserLocation';
import { DEFAULT_USER } from '$constants/auth';
import { getGuestToken, checkUserToken, getStoredMap } from '$utils/api';
import { storeData, getData } from '$utils/storage';
import { UserPanel } from '$components/panels/UserPanel';
import { getPath } from '$utils/history';

export class App extends React.Component {
  state = {
    mode: 'none',
    logo: DEFAULT_LOGO,
    routerPoints: 0,
    totalDistance: 0,
    estimateTime: 0,
    activeSticker: null,
    user: {
      ...DEFAULT_USER,
    },
  };

  componentDidMount() {
    this.authInit();
    this.mapInit();
  }

  mapInit = () => {
    const path = getPath();
    if (path) getStoredMap({ name: path, callback: this.editor.setData });
  };

  setMode = mode => {
    this.setState({ mode });
  };

  setRouterPoints = routerPoints => {
    this.setState({ routerPoints });
  };

  setTotalDist = totalDistance => {
    const time = (totalDistance && (totalDistance / 15)) || 0;
    const estimateTime = (time && parseFloat(time.toFixed(1)));
    this.setState({ totalDistance, estimateTime });
  };

  setActiveSticker = activeSticker => {
    this.setState({ activeSticker });
  };

  setLogo = logo => {
    this.setState({ logo });
  };

  editor = new Editor({
    container: 'map',
    mode: this.state.mode,
    setMode: this.setMode,
    setRouterPoints: this.setRouterPoints,
    setTotalDist: this.setTotalDist,
    setActiveSticker: this.setActiveSticker,
    setLogo: this.setLogo,
  });

  authInit = () => {
    const user = this.getUserData();

    const { id, token } = (user || {});
    const fallback = () => getGuestToken({ callback: this.setUser });

    if (id && token) {
      checkUserToken({
        callback: this.setUser,
        fallback,
        id,
        token
      });
    } else {
      getGuestToken({ callback: fallback });
    }
  };

  setUser = user => {
    if (!user.token || !user.id) return;

    this.setState({
      user: {
        ...DEFAULT_USER,
        ...user,
      }
    });

    this.storeUserData();
  };

  storeUserData = () => {
    storeData('user', this.state.user);
  };

  getUserData = () => {
    return getData('user') || null;
  };

  userLogout = () => {
    this.setState({
      user: {
        ...DEFAULT_USER,
      }
    });

    this.storeUserData();
  };

  render() {
    const {
      editor,
      state: {
        mode, routerPoints, totalDistance, estimateTime, activeSticker, logo, user,
      },
    } = this;


    return (
      <div>
        <Fills />

        <UserLocation editor={editor} />

        <UserPanel
          user={user}
          setUser={this.setUser}
          userLogout={this.userLogout}
        />

        <EditorPanel
          editor={editor}
          mode={mode}
          routerPoints={routerPoints}
          totalDistance={totalDistance}
          estimateTime={estimateTime}
          activeSticker={activeSticker}
          logo={logo}
          user={user}
        />
      </div>
    );
  }
}
