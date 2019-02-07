import L from 'leaflet';
import 'leaflet-geometryutil';
import '$utils/EditablePolyline';
import { simplify } from '$utils/simplify';
import { findDistance, middleCoord } from '$utils/geom';
import { CLIENT } from '$config/frontend';
import { MODES } from '$constants/modes';

const polyStyle = {
  color: 'url(#activePathGradient)',
  weight: '6',
  markerMid: 'url(#arrow)'
};

export class NewPoly {
  constructor({
    map, routerMoveStart, lockMapClicks, setTotalDist, triggerOnChange, editor,
  }) {
    const coordinates = [];

    this.poly = L.Polyline.PolylineEditor(coordinates, {
      ...polyStyle,
      maxMarkers: 50,

      onPointsSet: this.updateMarks,
      onMarkerDragEnd: this.updateMarks,
      onPointAdded: this.updateMarks,
      onPointDropped: this.updateMarks,
      onContinueDrawing: this.setModeOnDrawing,

      onMarkersHide: () => console.log('all markers are hidden'),
      onMarkersShow: () => console.log('all markers are visible'),
    }).addTo(map);

    this.poly.addTo(map);
    this.poly._reloadPolyline();
    this.editor = editor;

    this.map = map;

    this.routerMoveStart = routerMoveStart;
    this.setTotalDist = setTotalDist;
    this.triggerOnChange = triggerOnChange;
    this.lockMapClicks = lockMapClicks;
    // this.bindEvents();

    this.arrows = new L.LayerGroup().addTo(map);
  }

  setModeOnDrawing = () => {
    if (this.editor.getMode() !== MODES.POLY) this.editor.setMode(MODES.POLY);
  };

  drawArrows = () => {
    this.arrows.clearLayers();
    const { latlngs } = this;

    if (!latlngs || latlngs.length <= 1) return;

    latlngs.forEach((latlng, i) => {
      if (i === 0) return;

      const mid = middleCoord(latlngs[i], latlngs[i - 1]);
      const dist = findDistance(latlngs[i - 1].lat, latlngs[i - 1].lng, latlngs[i].lat, latlngs[i].lng);

      if (dist <= 1) return;

      const slide = new L.Polyline(
        [
          latlngs[i - 1],
          [mid.lat, mid.lng]
        ],
        { color: 'blue', weight: CLIENT.STROKE_WIDTH }
      ).addTo(this.arrows);

      slide._path.setAttribute('marker-end', 'url(#long-arrow)');
    });
  };

  updateMarks = () => {
    // return;
    const coords = this.poly.toGeoJSON().geometry.coordinates;

    // this.latlngs = (coords && coords.length && coords.map(([lng, lat]) => ({ lng, lat }))) || [];
    const meters = (this.poly && (L.GeometryUtil.length(this.poly) / 1000)) || 0;
    const kilometers = (meters && meters.toFixed(1)) || 0;

    this.setTotalDist(kilometers);
    this.routerMoveStart();

    this.drawArrows(); // <-- uncomment

    if (coords.length > 1) this.triggerOnChange();
  };

  preventMissClicks = e => {
    const mode = this.editor.getMode();

    if (mode === MODES.POLY) return;

    e.cancel();

    if (mode === MODES.NONE) this.editor.setMode(MODES.POLY);
  };

  continue = () => {
    this.poly.editor.continueForward();
  };

  stop = () => {
    if (this.poly) this.poly.editor.stopDrawing();
  };

  continueForward = () => {
    this.poly.continueForward();
  };

  lockMap = () => {
    this.lockMapClicks(true);
  };

  setPoints = latlngs => {
    if (!latlngs || latlngs.length <= 1) return;
    this.poly.setPoints(latlngs);
  };

  pushPoints = latlngs => {
    const { map } = this;
    const simplified = simplify({ map, latlngs });
    const summary = [
      ...this.poly.getLatLngs(),
      ...simplified,
    ];

    this.poly.setLatLngs(summary);
    this.poly.editor.enable();
    this.poly.editor.reset();
    this.updateMarks();
  };

  clearAll = () => {
    this.poly.setLatLngs([]);
    this.poly.editor.reset();
    this.updateMarks();
  };

  clearArrows = () => this.arrows.clearLayers();

  dumpData = () => this.latlngs;

  get latlngs() {
    return (
      this.poly && this.poly.getLatLngs().length
        && this.poly.getLatLngs().map(el => ({ ...el }))) || [];
  }

  get isEmpty() {
    return (!this.latlngs || Object.values(this.latlngs).length <= 0);
  }
}
