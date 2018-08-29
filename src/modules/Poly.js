import L from 'leaflet';
import 'leaflet-geometryutil';
import { simplify } from '$utils/simplify';
import { findDistance, middleCoord } from '$utils/geom';

const polyStyle = {
  color: 'url(#activePathGradient)',
  weight: '6',
  markerMid: 'url(#arrow)'
};
// const polyStyle = { color: '#ff3344', weight: '5' };

export class Poly {
  constructor({
    map, routerMoveStart, lockMapClicks, setTotalDist
  }) {
    this.poly = L.polyline([], polyStyle);

    this.latlngs = [];
    this.poly.addTo(map);

    this.map = map;

    this.routerMoveStart = routerMoveStart;
    this.setTotalDist = setTotalDist;
    this.lockMapClicks = lockMapClicks;
    this.bindEvents();

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
        { color: 'none', weight: '5' }
      ).addTo(this.arrows);

      slide._path.setAttribute('marker-end', 'url(#long-arrow)');
    });
  };

  updateMarks = () => {
    const coords = this.poly.toGeoJSON().geometry.coordinates;
    this.latlngs = (coords && coords.length && coords.map(([lng, lat]) => ({ lng, lat }))) || [];
    const meters = (this.poly && (L.GeometryUtil.length(this.poly) / 1000)) || 0;
    const kilometers = (meters && meters.toFixed(1)) || 0;

    this.setTotalDist(kilometers);
    this.routerMoveStart();
    this.drawArrows();
  };

  bindEvents = () => {
    // Если на карте что-то меняется, пересчитать километражи
    this.map.editTools.addEventListener('editable:drawing:mouseup', this.updateMarks);
    this.map.editTools.addEventListener('editable:vertex:dragend', this.updateMarks);
    this.map.editTools.addEventListener('editable:vertex:mouseup', this.updateMarks);
    this.map.editTools.addEventListener('editable:vertex:deleted', this.updateMarks);
    this.map.editTools.addEventListener('editable:vertex:new', this.updateMarks);

    this.map.editTools.addEventListener('editable:vertex:dragstart', this.lockMap);
    this.map.editTools.addEventListener('editable:vertex:dragstart', this.clearArrows);

    // После удаления точки - продолжить рисование
    this.map.editTools.addEventListener('editable:vertex:deleted', this.continueForward);
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
    if (this.latlngs && this.latlngs.length) {
      this.poly.enableEdit().continueForward();
      this.poly.editor.reset();
    } else {
      this.poly = this.map.editTools.startPolyline();
      this.poly.setStyle(polyStyle);
    }
  };

  stop = () => {
    if (this.map.editTools) this.map.editTools.stopDrawing();
  };

  continueForward = () => {
    if (!this.poly.editor) return;
    this.poly.editor.continueForward();
  };

  lockMap = () => {
    this.lockMapClicks(true);
  };

  setPoints = latlngs => {
    if (!latlngs || latlngs.length <= 1) return;
    this.poly.setLatLngs(latlngs);
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
    this.poly.disableEdit();
    this.updateMarks();
  };

  clearArrows = () => this.arrows.clearLayers();
}
