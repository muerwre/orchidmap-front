import { divIcon, LatLngLiteral, Marker, marker, DivIcon } from "leaflet";

export const createArrow = (latlng: LatLngLiteral, angle: number): Marker => marker(latlng, {
  draggable: false,
  interactive: false,
  icon: divIcon({
    html: `
      <div class="leaflet-arrow" style="transform: rotate(${angle}deg);">
        <svg width="40" height="40" preserveAspectRatio="xMidYMid">        
          <use xlink:href="#path-arrow" transform="scale(2)"/>
        </svg>      
      </div>
    `,
    className: 'leaflet-arrow-icon',
    iconSize: [11, 11],
    iconAnchor: [6, 6]
  })
});

export const arrowClusterIcon = (): DivIcon => divIcon({
  html: `<div class="leaflet-arrow-cluster"></div>`
});
