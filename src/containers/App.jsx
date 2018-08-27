import React from 'react';

import { Editor } from '$modules/Editor';
import { EditorPanel } from '$components/panels/EditorPanel';
import { Fills } from '$components/Fills';
import { DEFAULT_LOGO } from '$constants/logos';
import { getUserLocation } from '$utils/geolocation';
import { UserLocation } from '$components/UserLocation';

export class App extends React.Component {
  state = {
    mode: 'none',
    logo: DEFAULT_LOGO,
    routerPoints: 0,
    totalDistance: 0,
    estimateTime: 0,
    activeSticker: null,
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
  //
  // locateByGeo = () => {
  //   getUserLocation(this.setMapCenterByGeo);
  // };
  //
  // setMapCenterByGeo = position => {
  //   if (!position || !position.coords || !position.coords.latitude || !position.coords.longitude) return;
  //
  //   const { latitude, longitude } = position.coords;
  //
  //   console.log('panning to', { latitude, longitude });
  //
  //   this.editor.map.map.panTo([latitude, longitude]);
  // };

  editor = new Editor({
    container: 'map',
    mode: this.state.mode,
    setMode: this.setMode,
    setRouterPoints: this.setRouterPoints,
    setTotalDist: this.setTotalDist,
    setActiveSticker: this.setActiveSticker,
    setLogo: this.setLogo,
  });

  render() {
    const {
      editor,
      state: {
        mode, routerPoints, totalDistance, estimateTime, activeSticker, logo,
      },
    } = this;


    return (
      <div>
        <Fills />

        <UserLocation editor={editor} />

        <EditorPanel
          editor={editor}
          mode={mode}
          routerPoints={routerPoints}
          totalDistance={totalDistance}
          estimateTime={estimateTime}
          activeSticker={activeSticker}
          logo={logo}
        />
      </div>
    );
  }
}
