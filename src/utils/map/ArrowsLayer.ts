/*

  TODO: increase step between arrows, but detect if arrows' count less than i.e. 5, so when draw additional ones
  TODO: or, maybe, combine arrows with km marks

*/

import { LatLng, LatLngLiteral, LayerGroup, Map, Marker } from 'leaflet';
import { arrowClusterIcon, createArrow } from '~/utils/arrow';
import { MarkerClusterGroup } from 'leaflet.markercluster/dist/leaflet.markercluster-src.js';
import { angleBetweenPoints, dist2, middleCoord } from '~/utils/geom';
import { MainMap } from '~/constants/map';

class ArrowsLayer extends LayerGroup {
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

  setLatLngs = (route: LatLng[]): void => {
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
      [] as Marker[]
    );

    this.arrowLayer.addLayers(midpoints);
  };

  map: Map = MainMap;
  arrowLayer = new MarkerClusterGroup({
    spiderfyOnMaxZoom: false,
    showCoverageOnHover: false,
    zoomToBoundsOnClick: false,
    animate: false,
    maxClusterRadius: 120, // 120
    iconCreateFunction: arrowClusterIcon,
  });

  layers: Marker[] = [];
}

ArrowsLayer.addInitHook(function(this: ArrowsLayer) {
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
