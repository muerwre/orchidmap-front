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
      [54.985987, 82.921543],
      [55.03845, 82.97699],
      [55.0345, 82.67699],
      [55.0145, 82.67699],
    ];
    this.poly = L.Polyline.PolylineEditor(coordinates, { ...polyStyle, maxMarkers: 300 }).addTo(map);
    this.poly.addTo(map);
    map.fitBounds(this.poly.getBounds());
    //
    // this.latlngs = [];
    // this.poly.addTo(map);
    // this.editor = editor;
    //
    // this.map = map;
    //
    // this.routerMoveStart = routerMoveStart;
    // this.setTotalDist = setTotalDist;
    // this.triggerOnChange = triggerOnChange;
    // this.lockMapClicks = lockMapClicks;
    // this.bindEvents();
    //
    // this.arrows = new L.LayerGroup().addTo(map);
  }
}
