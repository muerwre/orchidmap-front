import L from 'leaflet';
import 'leaflet-geometryutil';
import '../utils/EditablePolyline';
import { simplify } from '$utils/simplify';
import { findDistance, middleCoord } from '$utils/geom';
import { CLIENT } from '$config/frontend';
import { MODES } from '$constants/modes';

const polyStyle = {
  color: 'url(#activePathGradient)',
  weight: '6',
  markerMid: 'url(#arrow)'
};
// const polyStyle = { color: '#ff3344', weight: '5' };

export class NewPoly {
  constructor({
    map, routerMoveStart, lockMapClicks, setTotalDist, triggerOnChange, editor,
  }) {
    // this.poly = L.polyline([], polyStyle);
    const coordinates = [
      // { lat: 54.9859, lng: 82.92154 },
      // { lat: 55.0384, lng: 82.97699 },
      // { lat: 55.0345, lng: 82.67699 },
      // { lat: 55.0145, lng: 82.67699 },
    ];

    const customPointListeners = {
      mousedown: console.log,
      mouseup: console.log,
      dragstart: console.log,
      dragend: console.log,
    };

    this.poly = L.Polyline.PolylineEditor(coordinates, {
      ...polyStyle,
      maxMarkers: 300,
      customPointListeners,
      customNewPointListenets: customPointListeners,
    }).addTo(map);

    this.latlngs = [];
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


  drawArrows = () => {
    this.arrows.clearLayers();
    const { latlngs } = this;

    if (!latlngs || latlngs.length <= 1) return;

    latlngs.map((latlng, i) => {
      if (i === 0) return;

      const mid = middleCoord(latlngs[i], latlngs[i - 1]);
      const dist = findDistance(latlngs[i - 1].lat, latlngs[i - 1].lng, latlngs[i].lat, latlngs[i].lng);

      if (dist <= 1) return;

      const slide = new L.Polyline(
        [
          latlngs[i - 1],
          [mid.lat, mid.lng]
        ],
        { color: 'none', weight: CLIENT.STROKE_WIDTH }
      ).addTo(this.arrows);

      slide._path.setAttribute('marker-end', 'url(#long-arrow)');
    });
  };

  updateMarks = () => {
    return;
    const coords = this.poly.toGeoJSON().geometry.coordinates;
    this.latlngs = (coords && coords.length && coords.map(([lng, lat]) => ({ lng, lat }))) || [];
    const meters = (this.poly && (L.GeometryUtil.length(this.poly) / 1000)) || 0;
    const kilometers = (meters && meters.toFixed(1)) || 0;

    this.setTotalDist(kilometers);
    this.routerMoveStart();

    // this.drawArrows(); // <-- uncomment

    if (coords.length > 1) this.triggerOnChange();
  };

  preventMissClicks = e => {
    const mode = this.editor.getMode();

    if (mode === MODES.POLY) return;

    e.cancel();

    if (mode === MODES.NONE) this.editor.setMode(MODES.POLY);
  };

  bindEvents = () => {
    // Если на карте что-то меняется, пересчитать километражи
    // this.map.editTools.addEventListener('editable:drawing:mouseup', this.updateMarks);
    // this.map.editTools.addEventListener('editable:vertex:dragend', this.updateMarks);
    // this.map.editTools.addEventListener('editable:vertex:mouseup', this.updateMarks);
    // this.map.editTools.addEventListener('editable:vertex:deleted', this.updateMarks);
    // this.map.editTools.addEventListener('editable:vertex:new', this.updateMarks);
    // this.map.editTools.addEventListener('editable:vertex:click', this.preventMissClicks);

    // this.map.editTools.addEventListener('editable:vertex:dragstart', this.lockMap);
    // this.map.editTools.addEventListener('editable:vertex:dragstart', this.clearArrows);

    // После удаления точки - продолжить рисование
    // this.map.editTools.addEventListener('editable:vertex:deleted', this.continueForward);
    //
    // map.editTools.addEventListener('editable:vertex:dragend', e => writeReduxData({ e, updatePolyCoords }));
    // map.editTools.addEventListener('editable:vertex:new', e => writeReduxData({ e, updatePolyCoords }));
    // map.editTools.addEventListener('editable:vertex:deleted', e => writeReduxData({ e, updatePolyCoords }));

    // Продолжить рисование после удаления точки
    // map.editTools.addEventListener('editable:vertex:deleted', e => {
    //   poly.editor.continueForward();
    //   updateMarks();
    // });

    // Добавлять точек в полилинию по щелчку
    // map.editTools.addEventListener('editable:drawing:click', e => insertVertex({ e, updatePolyCoords }));
    // map.editTools.addEventListener('editable:drawing:clicked', () => updateMarks({ updatePolyCoords }));

    // Это для точек. При перетаскивании конца указателя тащим точку
    // map.editTools.addEventListener('editable:vertex:drag', on_vertex_drag);

    // при перетаскивании ручек убирать все отметки километров
    // map.editTools.addEventListener('editable:vertex:dragstart', clearKmMarks);
  };

  continue = () => {
    this.poly.continueForwards();
    // if (this.latlngs && this.latlngs.length) {
    //   // this.poly.enableEdit().continueForward();
    //   // this.poly.editor.reset();
    //   this.poly.continueForward();
    // } else {
    //   // this.poly = this.map.editTools.startPolyline();
    //   // this.poly.setStyle(polyStyle);
    // }
  };

  stop = () => {
    if (this.poly) this.poly.stopDrawing();
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
    // this.poly._reloadPolyline();
    // this.updateMarks();
  };

  pushPoints = latlngs => {
    const { map } = this;
    const simplified = simplify({ map, latlngs });
    const summary = [
      ...this.poly.getLatLngs(),
      ...simplified,
    ];

    this.poly.setLatLngs(summary);
    this.poly.enableEdit();
    this.poly.editor.reset();
    this.updateMarks();
  };

  clearAll = () => {
    this.poly.setLatLngs([]);
    // this.poly.disableEdit();

    // this.updateMarks();
  };

  clearArrows = () => this.arrows.clearLayers();

  dumpData = () => this.latlngs;

  get isEmpty() {
    return (!this.latlngs || Object.values(this.latlngs).length <= 0);
  }
}
