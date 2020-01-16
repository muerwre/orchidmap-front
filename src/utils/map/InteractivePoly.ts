/*
  done IMPORTANT: select closest point on drag instead of first
  done add touch hint poly
  done approx radius for dragFindNearest
*/

import {
  LatLngExpression,
  Marker,
  Polyline,
  PolylineOptions,
  marker,
  divIcon,
  LayerGroup,
  LatLng,
  LeafletMouseEvent,
  latLng,
  LatLngLiteral,
} from 'leaflet';

import { distKmHaversine, distToSegment, getPolyLength, pointInArea } from '~/utils/geom';

interface InteractivePolylineOptions extends PolylineOptions {
  maxMarkers?: number;
  constraintsStyle?: PolylineOptions;
  kmMarksEnabled?: boolean;
  kmMarksStep?: number;
}

class InteractivePoly extends Polyline {
  constructor(
    latlngs: LatLngExpression[] | LatLngExpression[][],
    options?: InteractivePolylineOptions
  ) {
    super(latlngs, options);

    this.constraintsStyle = {
      ...this.constraintsStyle,
      ...options.constraintsStyle,
    };
    this.maxMarkers = options.maxMarkers || this.maxMarkers;

    this.constrLine = new Polyline([], this.constraintsStyle);

    this.startDragHinting();
  }

  updateTouchHinter = ({ latlngs }: { latlngs: LatLngLiteral[] }): void => {
    this.touchHinter.setLatLngs(latlngs);
  };

  setPoints = (latlngs: LatLng[], emitEvent = false) => {
    this.setLatLngs(latlngs);
    this.recreateMarkers();
    this.recalcDistance();
    this.touchHinter.setLatLngs(latlngs);

    if (emitEvent) {
      this.fire('latlngschange', { latlngs });
    }
  };

  createHintMarker = (latlng: LatLng): Marker =>
    marker(latlng, {
      draggable: false,
      icon: divIcon({
        className: 'leaflet-vertex-drag-helper',
        iconSize: [11, 11],
        iconAnchor: [6, 6],
      }),
    });

  createMarker = (latlng: LatLng): Marker =>
    marker(latlng, {
      draggable: true,
      icon: divIcon({
        className: 'leaflet-vertex-icon',
        iconSize: [11, 11],
        iconAnchor: [6, 6],
      }),
    })
      .on('contextmenu', this.dropMarker)
      .on('drag', this.onMarkerDrag)
      .on('dragstart', this.onMarkerDragStart)
      .on('dragend', this.onMarkerDragEnd)
      .addTo(this.markerLayer);

  recreateMarkers = () => {
    this.clearAllMarkers();
    const latlngs = this.getLatLngs();

    if (!latlngs || latlngs.length === 0) return;

    latlngs.forEach(latlng => this.markers.push(this.createMarker(latlng)));

    this.updateMarkers();
  };

  clearAllMarkers = (): void => {
    this.markerLayer.clearLayers();
    this.markers = [];
  };

  updateMarkers = (): void => {
    this.showVisibleMarkers();
  };

  showAllMarkers = (): void => {
    if (!this.is_editing) return;
    if (this._map.hasLayer(this.markerLayer)) return;

    this._map.addLayer(this.markerLayer);
    this.fire('allvertexshow');
  };

  hideAllMarkers = (): void => {
    if (!this._map.hasLayer(this.markerLayer)) return;

    this._map.removeLayer(this.markerLayer);
    this.fire('allvertexhide');
  };

  showVisibleMarkers = (): void => {
    if (!this.is_editing) return;

    const northEast = this._map.getBounds().getNorthEast();
    const southWest = this._map.getBounds().getSouthWest();

    const { visible, hidden } = this.markers.reduce(
      (obj, marker) => {
        const { lat, lng } = marker.getLatLng();
        const is_hidden =
          lat > northEast.lat || lng > northEast.lng || lat < southWest.lat || lng < southWest.lng;

        return is_hidden
          ? { ...obj, hidden: [...obj.hidden, marker] }
          : { ...obj, visible: [...obj.visible, marker] };
      },
      { visible: [], hidden: [] }
    );

    if (visible.length > this.maxMarkers) return this.hideAllMarkers();

    this.showAllMarkers();

    visible.forEach(marker => {
      if (!this.markerLayer.hasLayer(marker)) this.markerLayer.addLayer(marker);
    });

    hidden.forEach(marker => {
      if (this.markerLayer.hasLayer(marker)) this.markerLayer.removeLayer(marker);
    });
  };

  editor = {
    disable: () => {
      this.hideAllMarkers();
      this.is_editing = false;
      this.stopDragHinting();
      this.stopDrawing();
      this.touchHinter.removeFrom(this._map);
      this.fire('editordisable');
    },
    enable: () => {
      this.is_editing = true;
      this.showVisibleMarkers();
      this.startDragHinting();
      this.touchHinter.addTo(this._map);

      this.fire('editorenable');
    },
    continue: () => {
      this.is_drawing = true;
      this.drawing_direction = 'forward';
      this.startDrawing();
    },
    prepend: () => {
      this.is_drawing = true;
      this.drawing_direction = 'backward';
      this.startDrawing();
    },
    stop: () => {
      this.stopDrawing();
    },
  };

  moveDragHint = ({ latlng }: LeafletMouseEvent): void => {
    this.hintMarker.setLatLng(latlng);
  };

  hideDragHint = (): void => {
    if (this._map.hasLayer(this.hintMarker)) this._map.removeLayer(this.hintMarker);
  };

  showDragHint = (): void => {
    this._map.addLayer(this.hintMarker);
  };

  startDragHinting = (): void => {
    this.touchHinter.on('mousemove', this.moveDragHint);
    this.touchHinter.on('mousedown', this.startDragHintMove);
    this.touchHinter.on('mouseover', this.showDragHint);
    this.touchHinter.on('mouseout', this.hideDragHint);
  };

  stopDragHinting = (): void => {
    this.touchHinter.off('mousemove', this.moveDragHint);
    this.touchHinter.off('mousedown', this.startDragHintMove);
    this.touchHinter.off('mouseover', this.showDragHint);
    this.touchHinter.off('mouseout', this.hideDragHint);
  };

  startDragHintMove = (event: LeafletMouseEvent): void => {
    event.originalEvent.stopPropagation();
    event.originalEvent.preventDefault();

    if (this.is_drawing) {
      this.stopDrawing();
      this.is_drawing = true;
    }

    const prev = this.dragHintFindNearest(event.latlng);

    if (prev < 0) return;

    this.hint_prev_marker = prev;

    this.constrLine.setLatLngs([]).addTo(this._map);

    this._map.dragging.disable();

    this.is_dragging = true;

    this._map.on('mousemove', this.dragHintMove);
    this._map.on('mouseup', this.dragHintAddMarker);
    this._map.on('mouseout', this.stopDragHintMove);

    this.fire('vertexaddstart');
  };

  stopDragHintMove = (): void => {
    this._map.dragging.enable();

    this.constrLine.removeFrom(this._map);

    this._map.off('mousemove', this.dragHintMove);
    this._map.off('mouseup', this.dragHintAddMarker);
    this._map.off('mouseout', this.stopDragHintMove);

    if (this.is_drawing) this.startDrawing();

    setTimeout(() => {
      this.is_dragging = false;
      this.fire('vertexaddend');
    }, 0);
  };

  dragHintAddMarker = ({ latlng }: LeafletMouseEvent): void => {
    this.dragHintChangeDistance(this.hint_prev_marker, latlng);

    this.markers.splice(this.hint_prev_marker + 1, 0, this.createMarker(latlng));
    this.insertLatLng(latlng, this.hint_prev_marker + 1);
    this.hideDragHint();
    this.stopDragHintMove();
  };

  dragHintChangeDistance = (index: number, current: LatLngLiteral): void => {
    const prev = this.markers[index];
    const next = this.markers[index + 1];

    const initial_distance = distKmHaversine(prev.getLatLng(), next.getLatLng());

    const current_distance =
      ((prev && distKmHaversine(prev.getLatLng(), current)) || 0) +
      ((next && distKmHaversine(next.getLatLng(), current)) || 0);

    this.distance += current_distance - initial_distance;

    this.fire('distancechange', { distance: this.distance });
  };

  dragHintFindNearest = (latlng: LatLng): any => {
    const latlngs = this.getLatLngs() as LatLng[];

    const neighbours = latlngs
      .filter((current, index) => {
        const next = latlngs[index + 1] as LatLng;

        return next && pointInArea(current, next, latlng);
      })
      .map(el => latlngs.indexOf(el))
      .sort(
        (a, b) =>
          distToSegment(latlngs[a], latlngs[a + 1], latlng) -
          distToSegment(latlngs[b], latlngs[b + 1], latlng)
      );

    return neighbours.length > 0 ? neighbours[0] : -1;
  };

  dragHintMove = (event: LeafletMouseEvent): void => {
    event.originalEvent.stopPropagation();
    event.originalEvent.preventDefault();

    this.setConstraints([
      this.markers[this.hint_prev_marker].getLatLng(),
      event.latlng,
      this.markers[this.hint_prev_marker + 1].getLatLng(),
    ]);
  };

  onMarkerDrag = ({ target }: { target: Marker }) => {
    const coords = new Array(0)
      .concat((this.vertex_index > 0 && this.markers[this.vertex_index - 1].getLatLng()) || [])
      .concat(target.getLatLng())
      .concat(
        (this.vertex_index < this.markers.length - 1 &&
          this.markers[this.vertex_index + 1].getLatLng()) ||
          []
      );

    this.setConstraints(coords);

    this.fire('vertexdrag', { index: this.vertex_index, vertex: target });
  };

  onMarkerDragStart = ({ target }: { target: Marker }) => {
    if (this.is_drawing) {
      this.stopDrawing();
      this.is_drawing = true;
    }

    if (this.is_dragging) this.stopDragHintMove();

    this.vertex_index = this.markers.indexOf(target);

    this.is_dragging = true;
    this.constrLine.addTo(this._map);

    this.fire('vertexdragstart', { index: this.vertex_index, vertex: target });
  };

  onMarkerDragEnd = ({ target }: { target: Marker }): void => {
    const latlngs = this.getLatLngs() as LatLngLiteral[];
    this.markerDragChangeDistance(
      this.vertex_index,
      latlngs[this.vertex_index],
      target.getLatLng()
    );

    this.replaceLatlng(target.getLatLng(), this.vertex_index);

    this.is_dragging = false;
    this.constrLine.removeFrom(this._map);

    this.vertex_index = null;

    if (this.is_drawing) this.startDrawing();

    this.fire('vertexdragend', { index: this.vertex_index, vertex: target });
  };

  markerDragChangeDistance = (
    index: number,
    initial: LatLngLiteral,
    current: LatLngLiteral
  ): void => {
    const prev = index > 0 ? this.markers[index - 1] : null;
    const next = index <= this.markers.length + 1 ? this.markers[index + 1] : null;

    const initial_distance =
      ((prev && distKmHaversine(prev.getLatLng(), initial)) || 0) +
      ((next && distKmHaversine(next.getLatLng(), initial)) || 0);

    const current_distance =
      ((prev && distKmHaversine(prev.getLatLng(), current)) || 0) +
      ((next && distKmHaversine(next.getLatLng(), current)) || 0);

    this.distance += current_distance - initial_distance;

    this.fire('distancechange', { distance: this.distance });
  };

  startDrawing = (): void => {
    this.is_drawing = true;
    this.setConstraints([]);
    this.constrLine.addTo(this._map);
    this._map.on('mousemove', this.onDrawingMove);
    this._map.on('click', this.onDrawingClick);
  };

  stopDrawing = (): void => {
    this.constrLine.removeFrom(this._map);
    this._map.off('mousemove', this.onDrawingMove);
    this._map.off('click', this.onDrawingClick);
    this.is_drawing = false;
  };

  onDrawingMove = ({ latlng }: LeafletMouseEvent): void => {
    if (this.markers.length === 0) {
      this.setConstraints([]);
      return;
    }

    if (!this._map.hasLayer(this.constrLine)) this._map.addLayer(this.constrLine);

    const marker =
      this.drawing_direction === 'forward'
        ? this.markers[this.markers.length - 1]
        : this.markers[0];

    this.setConstraints([latlng, marker.getLatLng()]);
  };

  onDrawingClick = (event: LeafletMouseEvent): void => {
    if (this.is_dragging) return;

    const { latlng } = event;

    this.stopDrawing();

    const latlngs = this.getLatLngs() as any[];

    this.drawingChangeDistance(latlng);

    if (this.drawing_direction === 'forward') {
      latlngs.push(latlng);
      this.markers.push(this.createMarker(latlng));
    } else {
      latlngs.unshift(latlng);
      this.markers.unshift(this.createMarker(latlng));
    }

    this.setLatLngs(latlngs);
    this.fire('latlngschange', { latlngs });
    this.showVisibleMarkers();
    this.startDrawing();
  };

  drawingChangeDistance = (latlng: LatLngLiteral): void => {
    const latlngs = this.getLatLngs() as LatLngLiteral[];

    if (latlngs.length < 1) {
      this.distance = 0;
      this.fire('distancechange', { distance: this.distance });
      return;
    }

    const point = this.drawing_direction === 'forward' ? latlngs[latlngs.length - 1] : latlngs[0];

    this.distance += distKmHaversine(point, latlng);
    this.fire('distancechange', { distance: this.distance });
  };

  replaceLatlng = (latlng: LatLng, index: number): void => {
    const latlngs = this.getLatLngs() as LatLngLiteral[];
    latlngs.splice(index, 1, latlng);
    this.setLatLngs(latlngs);
    this.fire('latlngschange', { latlngs });
  };

  insertLatLng = (latlng, index): void => {
    const latlngs = this.getLatLngs();
    latlngs.splice(index, 0, latlng);
    this.setLatLngs(latlngs);
    this.fire('latlngschange', { latlngs });
  };

  setConstraints = (coords: LatLng[]) => {
    this.constrLine.setLatLngs(coords);
  };

  dropMarker = ({ target }: LeafletMouseEvent): void => {
    const index = this.markers.indexOf(target);
    const latlngs = this.getLatLngs();

    if (typeof index === 'undefined' || latlngs.length <= 2) return;

    this.dropMarkerDistanceChange(index);
    this._map.removeLayer(this.markers[index]);
    this.markers.splice(index, 1);
    latlngs.splice(index, 1);

    this.setLatLngs(latlngs);
    this.fire('latlngschange', { latlngs });
  };

  dropMarkerDistanceChange = (index: number): void => {
    const latlngs = this.getLatLngs() as LatLngLiteral[];

    const prev = index > 0 ? latlngs[index - 1] : null;
    const current = latlngs[index];
    const next = index <= latlngs.length + 1 ? latlngs[index + 1] : null;

    const initial_distance =
      ((prev && distKmHaversine(prev, current)) || 0) +
      ((next && distKmHaversine(next, current)) || 0);

    const current_distance = (prev && next && distKmHaversine(prev, next)) || 0;

    this.distance += current_distance - initial_distance;

    this.fire('distancechange', { distance: this.distance });
  };

  recalcDistance = () => {
    const latlngs = this.getLatLngs() as LatLngLiteral[];
    this.distance = getPolyLength(latlngs);

    this.fire('distancechange', { distance: this.distance });
  };

  markers: Marker[] = [];
  maxMarkers: InteractivePolylineOptions['maxMarkers'] = 2;
  markerLayer: LayerGroup = new LayerGroup();

  constraintsStyle: InteractivePolylineOptions['constraintsStyle'] = {
    weight: 6,
    color: 'red',
    dashArray: '10, 12',
    opacity: 0.5,
    interactive: false,
  };

  touchHinter: Polyline = new Polyline([], {
    weight: 24,
    smoothFactor: 3,
    className: 'touch-hinter-poly',
  });

  hintMarker: Marker = this.createHintMarker(latLng({ lat: 0, lng: 0 }));

  constrLine: Polyline;

  is_editing: boolean = true;
  is_dragging: boolean = false;
  is_drawing: boolean = false;

  drawing_direction: 'forward' | 'backward' = 'forward';
  vertex_index?: number = null;

  hint_prev_marker: number = null;
  distance: number = 0;
}

InteractivePoly.addInitHook(function() {
  this.once('add', event => {
    if (event.target instanceof InteractivePoly) {
      this.map = event.target._map;

      this.map.on('touch', console.log);

      this.markerLayer.addTo(event.target._map);
      this.hintMarker.addTo(event.target._map);
      this.constrLine.addTo(event.target._map);
      this.touchHinter.addTo(event.target._map);

      this.map.on('moveend', this.updateMarkers);

      this.on('latlngschange', this.updateTouchHinter);

      if (this.touchHinter && window.innerWidth < 768) {
        try {
          this.touchHinter.setStyle({ weight: 32 });
        } catch (e) {}
      }
    }
  });

  this.once('remove', event => {
    if (event.target instanceof InteractivePoly) {
      this.markerLayer.removeFrom(this._map);
      this.hintMarker.removeFrom(this._map);
      this.constrLine.removeFrom(this._map);
      this.touchHinter.removeFrom(this._map);

      this.map.off('moveend', this.updateMarkers);
    }
  });
});

export { InteractivePoly };
/*
  events:
  vertexdragstart,
  vertexdragend,
  vertexdrag,
  vertexaddstart
  vertexaddend

  allvertexhide
  allvertexshow

  editordisable
  editorenable

  distancechange

  latlngschange
 */
