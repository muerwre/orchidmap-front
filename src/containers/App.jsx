import React from 'react';

import { Map } from '$modules/map';
import { MapScreen } from "$styles/mapScreen";

export class App extends React.Component {
  componentDidMount() {
    this.map = new Map('map');
  }

  render() {
    return (
      <MapScreen />
    );
  }
};
