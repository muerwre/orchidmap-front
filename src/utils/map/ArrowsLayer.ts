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

  // Tries to detect if marker changed for every marker starting from changed_at
  // setLatLngs = (route: LatLngLiteral[]): void => {
  //   if (!this.map) return;

  //   // this.arrowLayer.clearLayers();

  //   if (route.length === 0) return;

  //   console.time('total');

  //   const changed_at = this.getChangeIndex(this.prevState.route, route);

  //   console.log('changed at:', changed_at);
  //   console.log('recalc:', route.length - changed_at);

  //   const midpoints = this.prevState.midpoints.slice(0, changed_at - 1);
  //   const markers = this.prevState.markers.slice(0, changed_at - 1);

  //   console.time('recalc');
  //   for (let i = changed_at; i < route.length; i += 1) {
  //     const point =
  //       route[i + 1] && dist2(route[i], route[i + 1]) > 0.00005
  //         ? {
  //             latlng: middleCoord(route[i], route[i + 1]),
  //             angle: angleBetweenPoints(
  //               this.map.latLngToContainerPoint(route[i]),
  //               this.map.latLngToContainerPoint(route[i + 1])
  //             ),
  //           }
  //         : null;

  //     if (this.prevState.markers[i] && !point) {
  //       // the marker is gone
  //       this.arrowLayer.removeLayer(this.prevState.markers[i]);
  //       markers.push(null);
  //     }

  //     if (this.prevState.markers[i] && point) {
  //       // marker changed / created
  //       const is_same =
  //         this.prevState.markers[i] &&
  //         this.prevState.midpoints[i] &&
  //         this.prevState.midpoints[i].latlng.lat === point.latlng.lat &&
  //         this.prevState.midpoints[i].latlng.lng === point.latlng.lng;

  //       if (!is_same) {
  //         console.log('not same');
  //         this.prevState.markers[i].setLatLng(point.latlng);
  //         this.prevState.markers[i].setIcon(createArrowIcon(point.angle));
  //       }

  //       markers.push(this.prevState.markers[i]);
  //     }

  //     if (!this.prevState.markers[i] && point) {
  //       // new marker
  //       const marker = createArrow(point.latlng, point.angle);
  //       this.arrowLayer.addLayer(marker);
  //       markers.push(marker);
  //     }

  //     midpoints.push(point);
  //   }
  //   console.timeEnd('recalc');

  //   this.prevState = {
  //     route,
  //     markers,
  //     midpoints,
  //   };

  //   console.timeEnd('total');
  // };

  // Only creates from changed item to the end. Buggy when trying to delete and add points in the middle
  // setLatLngs = (route: LatLngLiteral[]): void => {
  //   if (!this.map) return;

  //   // this.arrowLayer.clearLayers();

  //   if (route.length === 0) return;

  //   console.time('total');

  //   const changed_at = this.getChangeIndex(this.prevState.route, route);

  //   console.log('changed at:', changed_at);
  //   console.log('recalc:', route.length - changed_at);

  //   const midpoints = this.prevState.midpoints.slice(0, changed_at - 1);
  //   const markers = this.prevState.markers.slice(0, changed_at - 1);

  //   console.time('recalc');
  //   for (let i = changed_at; i < route.length; i += 1) {
  //     const point =
  //       route[i + 1] && dist2(route[i], route[i + 1]) > 0.00005
  //         ? {
  //             latlng: middleCoord(route[i], route[i + 1]),
  //             angle: angleBetweenPoints(
  //               this.map.latLngToContainerPoint(route[i]),
  //               this.map.latLngToContainerPoint(route[i + 1])
  //             ),
  //           }
  //         : null;

  //     const marker = point ? createArrow(point.latlng, point.angle) : null;

  //     midpoints.push(point);
  //     markers.push(marker);
  //   }
  //   console.timeEnd('recalc');

  //   console.time('remove');
  //   this.arrowLayer.removeLayers(
  //     this.prevState.markers
  //       .slice(changed_at - 1, this.prevState.markers.length - 1)
  //       .filter(el => !!el)
  //   );
  //   console.timeEnd('remove');

  //   this.prevState = {
  //     route,
  //     markers,
  //     midpoints,
  //   };

  //   console.time('add');
  //   this.arrowLayer.addLayers(markers.filter(el => !!el));
  //   console.timeEnd('add');
  //   console.timeEnd('total');
  // };

  // TODO: iterate through all the route and detect if marker created, changed or deleted. Skip getting changed_at
  // TODO: try to figure why its not updated properly when you add / delete points in the middle

  // setLatLngs = (route: LatLngLiteral[]): void => {
  //   if (!this.map) return;
  //   if (route.length === 0) return;

  //   const newState: IPrevState = {
  //     route,
  //     markers: [null],
  //   };

  //   for (let i = 1; i < route.length; i += 1) {
  //     const current = route[i];
  //     const previous = route[i - 1];

  //     const is_new = !this.prevState.route[i];
  //     const is_changed =
  //       this.prevState.route[i] &&
  //       (this.prevState.route[i].lat !== current.lat ||
  //         this.prevState.route[i].lng !== current.lng ||
  //         this.prevState.route[i - 1].lng !== previous.lng ||
  //         this.prevState.route[i - 1].lng !== previous.lng);

  //     const need_to_add = dist2(route[i], route[i - 1]) > 0.00005;

  //     if (is_new) {
  //       const marker = need_to_add
  //         ? createArrow(
  //             middleCoord(route[i], route[i - 1]),
  //             angleBetweenPoints(
  //               this.map.latLngToContainerPoint(route[i]),
  //               this.map.latLngToContainerPoint(route[i - 1])
  //             )
  //           )
  //         : null;

  //       console.log(i, marker ? 'new create' : 'new skip');

  //       if (marker) {
  //         this.arrowLayer.addLayer(marker);
  //       }

  //       newState.markers.push(marker);
  //       continue;
  //     }

  //     if (is_changed) {
  //       const middle = middleCoord(route[i], route[i - 1]);
  //       const angle = angleBetweenPoints(
  //         this.map.latLngToContainerPoint(route[i]),
  //         this.map.latLngToContainerPoint(route[i - 1])
  //       );

  //       if (need_to_add && this.prevState.markers[i]) {
  //         console.log(i, 'change');

  //         this.prevState.markers[i].setLatLng(middle);
  //         this.prevState.markers[i].setIcon(createArrowIcon(angle));
  //         newState.markers.push(this.prevState.markers[i]);
  //         continue;
  //       }

  //       if (need_to_add && !this.prevState.markers[i]) {
  //         console.log(i, 'change create');

  //         const marker = createArrow(middle, angle);
  //         this.arrowLayer.addLayer(marker);
  //         newState.markers.push(marker);
  //         continue;
  //       }

  //       if (!need_to_add && this.prevState.markers[i]) {
  //         console.log(i, 'change remove');

  //         this.arrowLayer.removeLayer(this.prevState.markers[i]);
  //         newState.markers.push(null);
  //         continue;
  //       }

  //       if (!need_to_add && !this.prevState.markers[i]) {
  //         console.log(i, 'change skip');
  //         newState.markers.push(null);
  //         continue;
  //       }
  //     }

  //     if (!is_new && !is_changed) {
  //       console.log(i, 'not changed');

  //       newState.markers.push(this.prevState.markers[i]);
  //     }
  //   }

  //   console.log('------', newState.markers);

  //   if (newState.markers.length < this.prevState.markers.length) {
  //     this.arrowLayer.removeLayers(
  //       this.prevState.markers
  //         .slice(
  //           this.prevState.markers.length - newState.markers.length,
  //           this.prevState.markers.length - 1
  //         )
  //         .filter(el => !!el)
  //     );
  //   }

  //   this.prevState = newState;
  // };

  map: Map;
  arrowLayer: MarkerClusterGroup = new MarkerClusterGroup({
    spiderfyOnMaxZoom: false,
    showCoverageOnHover: false,
    zoomToBoundsOnClick: false,
    animate: false,
    maxClusterRadius: 120, // 120
    iconCreateFunction: arrowClusterIcon,
  });

  // prevState: IPrevState = {
  //   route: [],
  //   markers: [],
  //   midpoints: [],
  //   // distances: [],
  // };

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
