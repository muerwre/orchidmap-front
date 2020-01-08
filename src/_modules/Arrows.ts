import { LatLngLiteral, LayerGroup, Map } from "leaflet";
import { arrowClusterIcon, createArrow } from "$utils/arrow";
import { MarkerClusterGroup } from 'leaflet.markercluster/dist/leaflet.markercluster-src.js';
import { angleBetweenPoints, dist2, middleCoord } from "$utils/geom";

class Component extends LayerGroup {
  constructor(props){
    super(props);
  }

  setLatLngs = (latlngs: LatLngLiteral[]): void => {
    if (!this.map) return;

    this.arrowLayer.clearLayers();

    if (latlngs.length === 0) return;

    const midpoints = latlngs.reduce((res, latlng, i) => (
      latlngs[i + 1] && dist2(latlngs[i], latlngs[i + 1]) > 0.00005
        ? [
          ...res,
          {
            latlng: middleCoord(latlngs[i], latlngs[i + 1]),
            angle: angleBetweenPoints(
              this.map.latLngToContainerPoint(latlngs[i]),
              this.map.latLngToContainerPoint(latlngs[i + 1])
            ),
          }
        ]
        : res
    ), []);

    midpoints.forEach(({ latlng, angle }) => (
      this.arrowLayer.addLayer(createArrow(latlng, angle))
    ));
  };

  map: Map;
  arrowLayer: MarkerClusterGroup = new MarkerClusterGroup({
    spiderfyOnMaxZoom: false,
    showCoverageOnHover: false,
    zoomToBoundsOnClick: false,
    animate: false,
    maxClusterRadius: 120,
    iconCreateFunction: arrowClusterIcon,
  });
}


Component.addInitHook(function () {
  this.once('add', (event) => {
    if (event.target instanceof Arrows) {
      this.map = event.target._map;
      this.arrowLayer.addTo(this.map);
    }
  });

  this.once('remove', (event) => {
    if (event.target instanceof Arrows) {
      this.arrowLayer.removeFrom(this.map);
    }
  });
});

export const Arrows = Component;
