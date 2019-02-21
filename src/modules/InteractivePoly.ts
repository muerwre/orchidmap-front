import { LatLngExpression, Marker, Polyline, PolylineOptions, marker, divIcon, LayerGroup, LatLng } from 'leaflet';

interface InteractivePolylineOptions extends PolylineOptions {
  maxMarkers?: number,
  constraintsStyle?: PolylineOptions,
}

export class InteractivePoly extends Polyline {
  constructor(latlngs: LatLngExpression[] | LatLngExpression[][], options?: InteractivePolylineOptions) {
    super(latlngs, options);

    this.constraintsStyle = { ...this.constraintsStyle, ...options.constraintsStyle };
    this.maxMarkers = options.maxMarkers || this.maxMarkers;

    this.constr1 = new Polyline([], this.constraintsStyle).addTo(this.constraintsLayer);
    this.constr2 = new Polyline([], this.constraintsStyle).addTo(this.constraintsLayer);
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

  };

  onMarkerDrag = ({ target }: { target: Marker}) => {
    console.log(this.vertex_index, this.markers.length);

    this.setConstraints(
      this.vertex_index > 0 && this.markers[this.vertex_index - 1].getLatLng(),
      target.getLatLng(),
      this.vertex_index < (this.markers.length - 1) && this.markers[this.vertex_index + 1].getLatLng(),
    );

    this.fire('vertexdrag', { index: this.vertex_index, vertex: target });
  };

  onMarkerDragStart = ({ target }: { target: Marker}) => {
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
  };

  replaceLatlng = (latlng: LatLng, index: number): void => {
    const latlngs = this.getLatLngs();
    latlngs.splice(index, 1, latlng);
    this.setLatLngs(latlngs);
  };

  setConstraints = (prev?: LatLng, marker?: LatLng, next?: LatLng) => {
    if (prev) this.constr1.setLatLngs([prev, marker]);
    if (next) this.constr2.setLatLngs([next, marker]);
  };

  markers: Marker[] = [];
  maxMarkers: InteractivePolylineOptions['maxMarkers'] = 2;
  markerLayer: LayerGroup = new LayerGroup();
  constraintsLayer: LayerGroup = new LayerGroup();
  constraintsStyle: InteractivePolylineOptions['constraintsStyle'] = {
    weight: 6,
    color: 'red',
    dashArray: '2, 10',
    opacity: 0.5,
  };

  constr1: Polyline;
  constr2: Polyline;

  is_dragging: boolean = false;
  vertex_index?: number = null;
  markers_visible: boolean = true;
}

InteractivePoly.addInitHook(function () {
  this.once('add', (event) => {
    if (event.target instanceof InteractivePoly) {
      this.map = event.target._map;
      this.markerLayer.addTo(event.target._map);

      this.map.on('moveend', this.updateMarkers);
    }
  });

  this.once('remove', () => {
    if (event.target instanceof InteractivePoly) {
      this.markerLayer.removeFrom(this.map);
      this.map.off('moveend', this.updateMarkers);
    }
  });
});

/*
  events:
  vertexdragstart,
  vertexdragend,
  vertexdrag,

  allvertexhide
  allvertexshow
 */
