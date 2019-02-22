import {
  LatLngExpression,
  Marker,
  Polyline,
  PolylineOptions,
  marker,
  divIcon,
  LayerGroup,
  LatLng,
  LeafletEventHandlerFn, LeafletEvent, LeafletMouseEvent, LatLngLiteral, latLng
} from 'leaflet';

interface InteractivePolylineOptions extends PolylineOptions {
  maxMarkers?: number,
  constraintsStyle?: PolylineOptions,
}

export class Component extends Polyline {
  constructor(latlngs: LatLngExpression[] | LatLngExpression[][], options?: InteractivePolylineOptions) {
    super(latlngs, options);

    this.constraintsStyle = { ...this.constraintsStyle, ...options.constraintsStyle };
    this.maxMarkers = options.maxMarkers || this.maxMarkers;

    this.constrLine = new Polyline([], this.constraintsStyle).addTo(this.constraintsLayer);
  }

  setPoints = (latlngs: LatLng[]) => {
    this.setLatLngs(latlngs);
    this.recreateMarkers();
  };

  createMarker = (latlng: LatLng): Marker => marker(latlng, {
    draggable: true,
    icon: divIcon({
      className: 'leaflet-vertex-icon',
      iconSize: [11, 11],
      iconAnchor: [6, 6]
    })
  })
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

    const { visible, hidden } = this.markers.reduce((obj, marker) => {
      const { lat, lng } = marker.getLatLng();
      const is_hidden = (lat > northEast.lat || lng > northEast.lng || lat < southWest.lat || lng < southWest.lng);

      return is_hidden
        ? { ...obj, hidden: [...obj.hidden, marker] }
        : { ...obj, visible: [...obj.visible, marker] }

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
      this.fire('editordisable');
    },
    enable: () => {
      this.is_editing = true;
      this.showVisibleMarkers();
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
    }
  };

  onMarkerDrag = ({ target }: { target: Marker}) => {
    console.log('drag?');
    const coords = new Array(0)
      .concat((this.vertex_index > 0 && this.markers[this.vertex_index - 1].getLatLng()) || [])
      .concat(target.getLatLng())
      .concat((this.vertex_index < (this.markers.length - 1) && this.markers[this.vertex_index + 1].getLatLng()) || []);

    this.setConstraints(coords);

    this.fire('vertexdrag', { index: this.vertex_index, vertex: target });
  };

  onMarkerDragStart = ({ target }: { target: Marker}) => {
    if (this.is_drawing) this.stopDrawing();

    this.vertex_index = this.markers.indexOf(target);

    this.is_dragging = true;
    this.constraintsLayer.addTo(this._map);

    this.fire('vertexdragstart', { index: this.vertex_index, vertex: target });
  };

  onMarkerDragEnd = ({ target }: { target: Marker}): void => {
    this.replaceLatlng(target.getLatLng(), this.vertex_index);

    this.is_dragging = false;
    this.constraintsLayer.removeFrom(this._map);

    this.fire('vertexdragend', { index: this.vertex_index, vertex: target });
    this.vertex_index = null;
    if (this.is_drawing) this.startDrawing();
  };

  startDrawing = (): void => {
    this.constraintsLayer.addTo(this._map);
    this._map.on('mousemove', this.onDrawingMove);
    this._map.on('click', this.onDrawingClick);
  };

  stopDrawing = (): void => {
    this.constraintsLayer.removeFrom(this._map);
    this._map.off('mousemove', this.onDrawingMove);
    this._map.off('click', this.onDrawingClick);
  };

  onDrawingMove = ({ latlng }: LeafletMouseEvent): void => {
    const marker = this.drawing_direction === 'forward'
      ? this.markers[this.markers.length - 1]
      : this.markers[0];

    this.setConstraints([latlng, marker.getLatLng()]);
  };

  onDrawingClick = ({ latlng }: LeafletMouseEvent): void => {
    this.stopDrawing();
    const latlngs = this.getLatLngs() as any[];

    if (this.drawing_direction === 'forward') {
      latlngs.push(latlng);
      this.markers.push(this.createMarker(latlng));
    } else {
      latlngs.unshift(latlng);
      this.markers.unshift(this.createMarker(latlng));
    }
    this.setLatLngs(latlngs);
    this.startDrawing();
  };

  replaceLatlng = (latlng: LatLng, index: number): void => {
    const latlngs = this.getLatLngs();
    latlngs.splice(index, 1, latlng);
    this.setLatLngs(latlngs);
  };

  setConstraints = (coords: LatLng[]) => {
    this.constrLine.setLatLngs(coords);
  };

  markers: Marker[] = [];
  maxMarkers: InteractivePolylineOptions['maxMarkers'] = 2;
  markerLayer: LayerGroup = new LayerGroup();
  constraintsLayer: LayerGroup = new LayerGroup();
  constraintsStyle: InteractivePolylineOptions['constraintsStyle'] = {
    weight: 6,
    color: 'red',
    dashArray: '5, 10',
    opacity: 0.5,
  };

  constrLine: Polyline;

  is_editing: boolean = true;
  is_dragging: boolean = false;
  is_drawing: boolean = false;

  drawing_direction: 'forward' | 'backward' = 'forward';
  vertex_index?: number = null;
}

Component.addInitHook(function () {
  this.once('add', (event) => {
    console.log('bup');

    if (event.target instanceof InteractivePoly) {
      this.map = event.target._map;
      this.markerLayer.addTo(event.target._map);

      this.map.on('moveend', this.updateMarkers);
    }
  });

  this.once('remove', (event) => {
    if (event.target instanceof InteractivePoly) {
      this.markerLayer.removeFrom(this.map);
      this.map.off('moveend', this.updateMarkers);
    }
  });
});

export const InteractivePoly = Component;
/*
  events:
  vertexdragstart,
  vertexdragend,
  vertexdrag,

  allvertexhide
  allvertexshow

  editordisable
  editorenable
 */
