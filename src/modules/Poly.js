import { polyline } from "leaflet";

const polyStyle = { color: 'url(#activePathGradient)', weight: '5' };

export class Poly {
  constructor({ map, routerMoveStart, lockMapClicks }) {
    this.poly = polyline([], polyStyle);
    this.latlngs = [];
    this.poly.addTo(map);
    this.map = map;

    this.routerMoveStart = routerMoveStart;
    this.lockMapClicks = lockMapClicks;
    this.bindEvents();
  }

  updateMarks = () => {
    console.log('upd');
    const coords = this.poly.toGeoJSON().geometry.coordinates;
    this.latlngs = (coords && coords.length && coords.map(([lng, lat]) => ({ lng, lat }))) || [];

    this.routerMoveStart();
  };

  bindEvents = () => {
    // Если на карте что-то меняется, пересчитать километражи
    this.map.editTools.addEventListener('editable:drawing:mouseup', this.updateMarks);
    this.map.editTools.addEventListener('editable:vertex:dragend', this.updateMarks);
    this.map.editTools.addEventListener('editable:vertex:mouseup', this.updateMarks);
    this.map.editTools.addEventListener('editable:vertex:deleted', this.updateMarks);
    this.map.editTools.addEventListener('editable:vertex:new', this.updateMarks);

    this.map.editTools.addEventListener('editable:vertex:dragstart', this.lockMap);

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
  }
}
