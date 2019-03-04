import { divIcon, LatLngLiteral, LayerGroup, Map, marker, Marker } from "leaflet";
import { arrowClusterIcon, createArrow } from "$utils/arrow";
import { MarkerClusterGroup } from 'leaflet.markercluster/dist/leaflet.markercluster-src.js';
import { angleBetweenPoints, dist2, distKm, middleCoord, pointOnDistance } from "$utils/geom";

interface KmMarksOptions {
  showMiddleMarkers: boolean,
  showEndMarker: boolean,
  kmMarksStep: number,
}

class Component extends LayerGroup {
  constructor(latlngs?: LatLngLiteral[], options?: KmMarksOptions){
    super();

    this.options = {
      showMiddleMarkers: true,
      showEndMarker: true,
      kmMarksStep: 10,
      ...(options || {}),
    } as KmMarksOptions;
  }

  setLatLngs = (latlngs: LatLngLiteral[]): void => {
    if (!this.map) return;
    this.marksLayer.clearLayers();

    if (latlngs.length === 0) return;

    if (this.options.showMiddleMarkers) this.drawMiddleMarkers(latlngs);
    if (this.options.showEndMarker) this.drawEndMarker(latlngs);
  };

  drawMiddleMarkers = (latlngs: LatLngLiteral[]) => {
    const kmMarks = {};
    let last_km_mark = 0;

    latlngs.reduce((dist, current, index) => {
      if (index >= latlngs.length - 1) return;

      const next = latlngs[index + 1];
      const diff = distKm(current, next);
      const sum = dist + diff;
      const rounded = Math.floor(sum / this.options.kmMarksStep) * this.options.kmMarksStep;
      const count = Math.floor((rounded - last_km_mark) / this.options.kmMarksStep);

      if (rounded > last_km_mark) {
        const angle = angleBetweenPoints(
          this.map.latLngToContainerPoint(current),
          this.map.latLngToContainerPoint(next),
        );

        for (let i = 1; i <= count; i += 1) {
          const step = last_km_mark + (i * this.options.kmMarksStep);
          const shift = (step - dist) / diff;

          const coords = {
            lat: current.lat - ((current.lat - next.lat) * shift),
            lng: current.lng - ((current.lng - next.lng) * shift),
          };

          kmMarks[step] = { ...coords, angle };
          this.marksLayer.addLayer(this.createMiddleMarker(coords, angle, step));
        }

        last_km_mark = rounded;
      }

      return sum;
    }, 0);
  };

  createMiddleMarker = (latlng: LatLngLiteral, angle: number, distance: number): Marker => marker(latlng, {
    draggable: false,
    interactive: true,
    icon: divIcon({
      html: `
      <div class="leaflet-km-dist" style="transform: rotate(${angle}deg);">
        ${distance}
      </div>
    `,
      className: 'leaflet-km-marker',
      iconSize: [11, 11],
      iconAnchor: [6, 6]
    })
  });

  drawEndMarker = (latlngs: LatLngLiteral[]): void => {

  };

  options: KmMarksOptions;
  map: Map;
  marksLayer: MarkerClusterGroup = new MarkerClusterGroup({
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
    if (event.target instanceof KmMarks) {
      this.map = event.target._map;
      this.marksLayer.addTo(this.map);
    }
  });

  this.once('remove', (event) => {
    if (event.target instanceof KmMarks) {
      this.marksLayer.removeFrom(this.map);
    }
  });
});

export const KmMarks = Component;
