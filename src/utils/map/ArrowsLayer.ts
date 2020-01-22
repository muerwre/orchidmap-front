/*

  TODO: increase step between arrows, but detect if arrows' count less than i.e. 5, so when draw additional ones
  TODO: or, maybe, combine arrows with km marks

*/

import { LatLngLiteral, LayerGroup, Map, LatLng, Marker, marker } from 'leaflet';
import { arrowClusterIcon, createArrow, createArrowIcon } from '~/utils/arrow';
import { MarkerClusterGroup } from 'leaflet.markercluster/dist/leaflet.markercluster-src.js';
import { angleBetweenPoints, dist2, middleCoord } from '~/utils/geom';

interface MidPoint {
  latlng: LatLngLiteral;
  angle: number;
}

// interface IPrevState {
//   route: LatLngLiteral[];
//   markers: Marker[];
//   midpoints: MidPoint[];
// }

class ArrowsLayer extends LayerGroup {
  /*
    without remove optimization

      first:
      recalc: 5.469970703125ms
      remove: 0.203857421875ms
      add: 53.658935546875ms
      total: 60.986083984375ms

      last:
      recalc: 0.010986328125ms
      remove: 0.220947265625ms
      add: 0.580078125ms
      total: 2.721923828125ms

    with remove optimization
  */

  constructor(props) {
    super(props);
  }

  getChangeIndex = (prev: LatLngLiteral[], next: LatLngLiteral[]): number => {
    const changed_at = next.findIndex(
      (item, index) => !prev[index] || prev[index].lat != item.lat || prev[index].lng != item.lng
    );

    return changed_at >= 0 ? changed_at : next.length;
  };

  // Reacreating all the markers

  setLatLngs = (route: LatLngLiteral[]): void => {
    if (!this.map) return;

    this.arrowLayer.clearLayers();

    if (route.length === 0) return;

    const midpoints = route.reduce(
      (res, latlng, i) =>
        route[i + 1] && dist2(route[i], route[i + 1]) > 0.0001
          ? [
              ...res,
              createArrow(
                middleCoord(route[i], route[i + 1]),
                angleBetweenPoints(
                  this.map.latLngToContainerPoint(route[i]),
                  this.map.latLngToContainerPoint(route[i + 1])
                )
              ),
            ]
          : res,
      []
    );

    this.arrowLayer.addLayers(midpoints);
  };

  map: Map;
  arrowLayer = new MarkerClusterGroup({
    spiderfyOnMaxZoom: false,
    showCoverageOnHover: false,
    zoomToBoundsOnClick: false,
    animate: false,
    maxClusterRadius: 120, // 120
    iconCreateFunction: arrowClusterIcon,
  });

  layers: Marker<any>[] = [];
}

ArrowsLayer.addInitHook(function() {
  this.once('add', event => {
    if (event.target instanceof ArrowsLayer) {
      this.map = event.target._map;
      this.arrowLayer.addTo(this.map);
    }
  });

  this.once('remove', event => {
    if (event.target instanceof ArrowsLayer) {
      this.arrowLayer.removeFrom(this.map);
    }
  });
});

export { ArrowsLayer };
