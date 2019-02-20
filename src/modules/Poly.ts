import { Map, LayerGroup } from 'leaflet';
import 'leaflet-geometryutil';
import { EditablePolyline } from '$utils/EditablePolyline';
import { simplify } from '$utils/simplify';
import { findDistance, middleCoord } from '$utils/geom';
import { CLIENT } from '$config/frontend';
import { MODES } from '$constants/modes';
import { editor, Editor } from "$modules/Editor";
import { ILatLng } from "$modules/Stickers";

const polyStyle = {
  color: 'url(#activePathGradient)',
  weight: '6',
  markerMid: 'url(#arrow)'
};

interface Props {
  map: Map;
  editor: Editor;
  routerMoveStart: typeof editor.routerMoveStart,
  lockMapClicks: typeof editor.lockMapClicks,
  setDistance: typeof editor.setDistance,
  triggerOnChange: typeof editor.triggerOnChange,
}

export class Poly {
  constructor({
    map, routerMoveStart, lockMapClicks, setDistance, triggerOnChange, editor,
  }: Props) {
    this.poly = new EditablePolyline([], {
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
    this.setDistance = setDistance;
    this.triggerOnChange = triggerOnChange;
    this.lockMapClicks = lockMapClicks;

    this.arrows.addTo(map);
  }

  setModeOnDrawing = (): void => {
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

  preventMissClicks = (e): void => {
    const mode = this.editor.getMode();

    if (mode === MODES.POLY) return;

    e.cancel();

    if (mode === MODES.NONE) this.editor.setMode(MODES.POLY);
  };

  continue = (): void => {
    this.poly.editor.continueForward();
  };

  stop = (): void => {
    if (this.poly) this.poly.editor.stopDrawing();
  };

  continueForward = (): void => {
    this.poly.continueForward();
  };

  lockMap = (): void => {
    this.lockMapClicks(true);
  };

  setPoints = (latlngs: Array<ILatLng>): void => {
    if (!latlngs || latlngs.length <= 1) return;
    this.poly.setPoints(latlngs);
  };

  pushPoints = (latlngs: Array<ILatLng>): void => {
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

  clearAll = (): void => {
    // this.poly.setLatLngs([]);
    this.poly.editor.clear();
    this.updateMarks();
  };

  clearArrows = (): LayerGroup<any> => this.arrows.clearLayers();

  dumpData = (): Array<ILatLng> => this.latlngs;

  get latlngs(): Array<ILatLng> {
    return (
      this.poly && this.poly.getLatLngs().length
        && this.poly.getLatLngs().map(el => ({ ...el }))) || [];
  }

  get isEmpty(): boolean {
    return (!this.latlngs || Object.values(this.latlngs).length <= 0);
  }

  poly: EditablePolyline;
  arrows: LayerGroup = new LayerGroup();

  editor: Props['editor'];
  map: Props['map'];
  routerMoveStart: Props['routerMoveStart'];
  setDistance: Props['setDistance'];
  triggerOnChange: Props['triggerOnChange'];
  lockMapClicks: Props['lockMapClicks'];
}
