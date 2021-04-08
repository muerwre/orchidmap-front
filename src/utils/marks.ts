import { divIcon, LatLngLiteral, LayerGroup, Map, marker, Marker } from 'leaflet';
import { arrowClusterIcon } from '~/utils/arrow';
import { MarkerClusterGroup } from 'leaflet.markercluster/dist/leaflet.markercluster-src.js';
import { allwaysPositiveAngleDeg, angleBetweenPoints, distKmHaversine } from '~/utils/geom';
import classNames from 'classnames';
import { MainMap } from '~/constants/map';

const arrow_image = '/images/arrow.svg';

interface KmMarksOptions {
  showStartMarker: boolean;
  showMiddleMarkers: boolean;
  showEndMarker: boolean;
  showArrows: boolean;
  kmMarksStep: number;
}

class KmMarksLayer extends LayerGroup {
  constructor(latlngs?: LatLngLiteral[], options?: KmMarksOptions) {
    super();

    this.options = {
      showStartMarker: true,
      showMiddleMarkers: true,
      showEndMarker: true,
      showArrows: true,
      kmMarksStep: 10,
      ...(options || {}),
    } as KmMarksOptions;
  }

  setLatLngs = (latlngs: LatLngLiteral[]): void => {
    if (!this.map) return;

    this.marksLayer.clearLayers();
    this.endMarker.clearLayers();

    this.distance = 0;

    if (latlngs.length <= 1) return;

    if (this.options.showMiddleMarkers) this.drawMiddleMarkers(latlngs);
    if (this.options.showEndMarker) this.drawEndMarker(latlngs);
  };

  drawMiddleMarkers = (latlngs: LatLngLiteral[]) => {
    const marks: Marker[] = [];
    let last_km_mark = 0;

    this.distance = latlngs.reduce((dist, current, index) => {
      if (index >= latlngs.length - 1) return dist;

      const next = latlngs[index + 1];
      const diff = distKmHaversine(current, next);
      const sum = dist + diff;
      const rounded = Math.floor(sum / this.options.kmMarksStep) * this.options.kmMarksStep;
      const count = Math.floor((rounded - last_km_mark) / this.options.kmMarksStep);

      if (rounded > last_km_mark) {
        const angle = angleBetweenPoints(
          this.map.latLngToContainerPoint(current),
          this.map.latLngToContainerPoint(next)
        );

        // if segment is too long, we'll add multiple markers on it
        for (let i = 1; i <= count; i += 1) {
          const step = last_km_mark + i * this.options.kmMarksStep;
          const shift = (step - dist) / diff;

          const coords = {
            lat: current.lat - (current.lat - next.lat) * shift,
            lng: current.lng - (current.lng - next.lng) * shift,
          };

          marks.push(this.createMiddleMarker(coords, angle, step));
        }

        last_km_mark = rounded;
      }

      return sum;
    }, 0);

    this.marksLayer.addLayers(marks);
  };

  createMiddleMarker = (latlng: LatLngLiteral, angle: number, distance: number): Marker =>
    marker(latlng, {
      draggable: false,
      interactive: false,
      icon: divIcon({
        html: `
        <div 
          class="leaflet-km-dist${allwaysPositiveAngleDeg(angle) !== angle ? ' reverse' : ''}" 
          style="transform: translate(-50%, -50%) rotate(${allwaysPositiveAngleDeg(angle)}deg);"
        >
          ${distance}
          <svg width="48" height="48" preserveAspectRatio="xMidYMid">        
            <image xlink:href="${arrow_image}" x="0" y="0" width="48" height="48"/>
          </svg> 
        </div>
      `,
        className: 'leaflet-km-marker',
        iconSize: [11, 11],
        iconAnchor: [6, 6],
      }),
    });

  createEndMarker = (latlng: LatLngLiteral, angle: number, distance: number): Marker =>
    marker(latlng, {
      draggable: false,
      interactive: false,
      icon: divIcon({
        html: `
        <div class="leaflet-km-dist">
          ${parseFloat(distance.toFixed(1))}
        </div>
      `,
        className: classNames('leaflet-km-marker end-marker', { right: angle > -90 && angle < 90 }),
        iconSize: [11, 11],
        iconAnchor: [6, 6],
      }),
      zIndexOffset: -100,
    });

  createStartMarker = (latlng: LatLngLiteral): Marker =>
    marker(latlng, {
      draggable: false,
      interactive: false,
      icon: divIcon({
        html: `
          <svg width="20" height="20" viewBox="0 0 32 32">
            <circle r="16" cx="16" cy="16" fill="red" />
            <circle r="13" cx="16" cy="16" fill="white" />
            <circle r="9" cx="16" cy="16" fill="red" />
          </svg>
      `,
        className: classNames('leaflet-km-marker start-marker'),
        iconSize: [20, 20],
        iconAnchor: [6, 6],
      }),
      zIndexOffset: -100,
    });

  drawEndMarker = (latlngs: LatLngLiteral[]): void => {
    this.endMarker.clearLayers();

    const current = latlngs[latlngs.length - 2];
    const next = latlngs[latlngs.length - 1];

    const angle = angleBetweenPoints(
      this.map.latLngToContainerPoint(current),
      this.map.latLngToContainerPoint(next)
    );

    this.endMarker.addLayer(this.createEndMarker(next, angle, this.distance));
    if (latlngs && latlngs.length) {
      this.endMarker.addLayer(this.createStartMarker(latlngs[0]));
    }
  };

  options: KmMarksOptions;
  map: Map = MainMap;
  marksLayer: MarkerClusterGroup = new MarkerClusterGroup({
    spiderfyOnMaxZoom: false,
    showCoverageOnHover: false,
    zoomToBoundsOnClick: false,
    animate: false,
    maxClusterRadius: 120,
    iconCreateFunction: arrowClusterIcon,
  });
  endMarker: LayerGroup = new LayerGroup();
  distance: number = 0;
}

KmMarksLayer.addInitHook(function(this: KmMarksLayer) {
  this.once('add', event => {
    if (event.target instanceof KmMarksLayer) {
      this.map = event.target._map;
      this.marksLayer.addTo(this.map);
      this.endMarker.addTo(this.map);
    }
  });

  this.once('remove', event => {
    if (event.target instanceof KmMarksLayer) {
      this.marksLayer.removeFrom(this.map);
      this.endMarker.removeFrom(this.map);
    }
  });
});

export { KmMarksLayer };
