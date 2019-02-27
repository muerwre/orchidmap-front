import { divIcon, LatLngLiteral, Marker, marker, DivIcon } from "leaflet";

export const createArrow = (latlng: LatLngLiteral, angle: number): Marker => marker(latlng, {
  draggable: false,
  interactive: false,
  icon: divIcon({
    html: `
      <div class="leaflet-arrow" style="transform: rotate(${angle}deg);">
        <svg width="48" height="48" preserveAspectRatio="xMidYMid">        
          <use xlink:href="#path-arrow" transform="scale(2) translate(5 -2)"/>
        </svg>      
      </div>
    `,
    className: 'leaflet-arrow-icon',
    iconSize: [11, 11],
    iconAnchor: [6, 6]
  })
});

export const arrowClusterIcon = (cluster): DivIcon => {
  const markers = cluster.getAllChildMarkers();

  // search for nearest marker to cluster (slow)
  // const nearest = markers.sort((a, b) => (
  //   dist2(a.getLatLng(), cluster.getLatLng()) - dist2(b.getLatLng(), cluster.getLatLng())
  // ));

  // faster way
  cluster.setLatLng(markers[markers.length - 1].getLatLng());
  return markers[markers.length - 1].options.icon;
};
