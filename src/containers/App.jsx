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
import { getUrlData, pushPath } from '$utils/history';

export class App extends React.Component {
  state = {
    mode: 'none',
    editing: false,
    logo: DEFAULT_LOGO,
    routerPoints: 0,
    totalDistance: 0,
    estimateTime: 0,
    activeSticker: null,
    user: {
      ...DEFAULT_USER,
    },
    title: '',
    address: '',
    changed: false,
  };

  componentDidMount() {
    this.authInit();
    window.editor = this.editor;
  }

  mapInit = () => {
    const { path, mode } = getUrlData();
    if (path) {
      getStoredMap({ name: path })
        .then(this.setDataOnLoad)
        .then(() => {
          if (mode && mode === 'edit') {
            this.editor.startEditing();
          } else {
            this.editor.stopEditing();
          }
        })
        .catch(this.startEmptyEditor);
    } else {
      // this.hideLoader();
      this.startEmptyEditor();
    }
  };

  startEmptyEditor = () => {
    const { user } = this.state;
    if (!user || !user.random_url || !user.id) return;

    pushPath(`/${user.random_url}/edit`);

    this.editor.owner = user.id;
    this.editor.startEditing();

    this.hideLoader();

    this.clearChanged();
  };

  setTitle = title => this.setState({ title });
  setAddress = address => this.setState({ address });

  setDataOnLoad = data => {
    this.clearChanged();
    this.editor.setData(data);
    this.hideLoader();
  };

  hideLoader = () => {
    document.getElementById('loader').style.opacity = 0;
    document.getElementById('loader').style.pointerEvents = 'none';
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

  setEditing = editing => {
    this.setState({ editing });
  };

  getUser = () => this.state.user;

  triggerOnChange = () => {
    if (!this.state.editing) return;
    console.log('CHANGED!');
    this.setState({ changed: true });
  };

  clearChanged = () => {
    console.log('clearing');
    this.setState({ changed: false });
  };

  editor = new Editor({
    container: 'map',
    mode: this.state.mode,
    setMode: this.setMode,
    setRouterPoints: this.setRouterPoints,
    setTotalDist: this.setTotalDist,
    setActiveSticker: this.setActiveSticker,
    setLogo: this.setLogo,
    setEditing: this.setEditing,
    setTitle: this.setTitle,
    setAddress: this.setAddress,
    getUser: this.getUser,
    triggerOnChange: this.triggerOnChange,
    clearChanged: this.clearChanged,
  });

  authInit = () => {
    const user = this.getUserData();

    const { id, token } = (user || {});

    if (id && token) {
      checkUserToken({
        id,
        token
      })
        .then(this.setUser)
        .then(this.mapInit);
    } else {
      getGuestToken()
        .then(this.setUser)
        .then(this.mapInit);
    }
  };

  setUser = user => {
    if (!user.token || !user.id) return;

    if (this.state.user.id === this.editor.owner) {
      this.editor.owner = user.id;
    }

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

  getUserData = () => getData('user') || null;

  userLogout = () => {
    if (this.state.user.id === this.editor.owner) {
      this.editor.owner = null;
    }
    //
    this.setState({
      user: DEFAULT_USER,
    });

    setTimeout(this.storeUserData, 0);
  };

  render() {
    const {
      editor,
      state: {
        mode, routerPoints, totalDistance, estimateTime, activeSticker, logo, user, editing, title, address, changed,
      },
    } = this;


    return (
      <div>
        <Fills />

        <UserLocation editor={editor} />

        <UserPanel
          editor={editor}
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
          editing={editing}
          title={title}
          address={address}
          changed={changed}
        />
      </div>
    );
  }
}
