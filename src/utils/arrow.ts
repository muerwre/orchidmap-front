import { divIcon, LatLngLiteral, Marker, marker, DivIcon } from 'leaflet';

const arrow_image = require('~/sprites/arrow.svg');

export const createArrowIcon = (angle: number) =>
  divIcon({
    html: `
    <div class="leaflet-arrow" style="transform: rotate(${angle}deg);">
      <svg width="48" height="48" preserveAspectRatio="xMidYMid">        
        <image xlink:href="${arrow_image}" x="0" y="0" width="48" height="48"/>
      </svg>      
    </div>
  `,
    className: 'leaflet-arrow-icon',
    iconSize: [11, 11],
    iconAnchor: [6, 6],
  });

export const createArrow = (latlng: LatLngLiteral, angle: number): Marker =>
  new Marker(latlng, {
    draggable: false,
    interactive: false,
    icon: createArrowIcon(angle),
  });

export const arrowClusterIcon = (cluster): DivIcon => {
  const markers = cluster.getAllChildMarkers();

  // faster way
  cluster.setLatLng(markers[markers.length - 1].getLatLng());
  return markers[markers.length - 1].options.icon;
};
