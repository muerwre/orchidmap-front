import L, { Map, LayerGroup, Polyline } from 'leaflet';
import 'leaflet-geometryutil';
import { EditablePolyline } from '$utils/EditablePolyline';
import { simplify } from '$utils/simplify';
import { findDistance, middleCoord } from '$utils/geom';
import { CLIENT } from '$config/frontend';
import { MODES } from '$constants/modes';
import { Editor } from "$modules/Editor";

const polyStyle = {
  color: 'url(#activePathGradient)',
  weight: '6',
  markerMid: 'url(#arrow)'
};

interface IPoly {
  poly: EditablePolyline;
  editor: Editor;
  map: Map;
  routerMoveStart: () => void;
  setTotalDist: (dist: number) => void;
  triggerOnChange: () => void;
  lockMapClicks: (status: boolean) => void;
  arrows: LayerGroup;
}

export class Poly implements IPoly {
  constructor({
    map, routerMoveStart, lockMapClicks, setTotalDist, triggerOnChange, editor,
  }) {
    const coordinates = [];

    this.poly = new EditablePolyline(coordinates, {
      ...polyStyle,
      maxMarkers: 100,

      onPointsSet: this.updateMarks,
      onMarkerDragEnd: this.updateMarks,
      onPointAdded: this.updateMarks,
      onPointDropped: this.updateMarks,
      onContinueDrawing: this.setModeOnDrawing,

      onMarkersHide: () => editor.setMarkersShown(false),
      onMarkersShow: () => editor.setMarkersShown(true),
    }).addTo(map);

    this.poly.addTo(map);
    this.poly._reloadPolyline();
    this.editor = editor;

    this.map = map;

    this.routerMoveStart = routerMoveStart;
    this.setTotalDist = setTotalDist;
    this.triggerOnChange = triggerOnChange;
    this.lockMapClicks = lockMapClicks;

    this.arrows.addTo(map);
  }

  setModeOnDrawing = () => {
    if (this.editor.getMode() !== MODES.POLY) this.editor.setMode(MODES.POLY);
  };

  drawArrows = () => {
    // todo: fix this
    // this.arrows.clearLayers();
    // const { latlngs } = this;
    //
    // if (!latlngs || latlngs.length <= 1) return;
    //
    // latlngs.forEach((latlng, i) => {
    //   if (i === 0) return;
    //
    //   const mid = middleCoord(latlngs[i], latlngs[i - 1]);
    //   const dist = findDistance(latlngs[i - 1].lat, latlngs[i - 1].lng, latlngs[i].lat, latlngs[i].lng);
    //
    //   if (dist <= 1) return;
    //
    //   const slide = new Polyline(
    //     [
    //       latlngs[i - 1],
    //       [mid.lat, mid.lng]
    //     ],
    //     { color: 'none', weight: CLIENT.STROKE_WIDTH }
    //   ).addTo(this.arrows);
    //
    //   // todo: uncomment and fix this:
    //   // slide._path.setAttribute('marker-end', 'url(#long-arrow)');
    // });
  };

  updateMarks = () => {
    // todo: fix this
    // const coords = this.poly.toGeoJSON().geometry.coordinates;
    //
    // const meters = (this.poly && (L.GeometryUtil.length(this.poly) / 1000)) || 0;
    // const kilometers = (meters && meters.toFixed(1)) || 0;
    //
    // this.setTotalDist(kilometers);
    // this.routerMoveStart();
    //
    // this.drawArrows(); // <-- uncomment
    //
    // if (coords.length > 1) this.triggerOnChange();
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
    // this.poly.setLatLngs([]);
    this.poly.editor.clear();
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

  poly;
  editor;
  map;
  routerMoveStart;
  setTotalDist;
  triggerOnChange;
  lockMapClicks;
  arrows = new LayerGroup();
}
