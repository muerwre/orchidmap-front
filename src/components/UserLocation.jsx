import React from 'react';
import L, { marker } from 'leaflet';
import { DomMarker } from '$utils/DomMarker';
import { Icon } from '$components/panels/Icon';

export class UserLocation extends React.Component {
  constructor(props) {
    super(props);

    const element = document.createElement('div');

    this.icon = new DomMarker({
      element,
      className: 'location-marker',
    });

    this.mark = null;
    this.map = props.editor.map.map;
    this.location = [];
  }

  componentDidMount() {
    this.getUserLocation(this.updateLocationMark);
  }

  getUserLocation = callback => {
    if (!window.navigator || !window.navigator.geolocation) return;

    window.navigator.geolocation.getCurrentPosition(position => {
      if (!position || !position.coords || !position.coords.latitude || !position.coords.longitude) return;

      const { latitude, longitude } = position.coords;

      callback(latitude, longitude);
    });
  };

  centerMapOnLocation = () => {
    if (this.location && this.location.length === 2) {
      this.panMapTo(this.location[0], this.location[1]);
    } else {
      this.getUserLocation(this.panMapTo);
    }

    this.getUserLocation(this.updateLocationMark);
  };

  panMapTo = (latitude, longitude) => {
    if (!latitude || !longitude) return;

    this.map.panTo([latitude, longitude]);
  };

  updateLocationMark = (latitude, longitude) => {
    if (!latitude || !longitude) return;

    if (this.mark) this.map.removeLayer(this.mark);

    this.location = [latitude, longitude];
    this.mark = marker(this.location, { icon: this.icon }).addTo(this.map);
  };

  render() {
    return (
      <div className="locate-geo-button" onClick={this.centerMapOnLocation}>
        <Icon icon="icon-locate" size={30} />
      </div>
    );
  }
}
