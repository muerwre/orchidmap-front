import L from "leaflet";
import { map } from "$utils/map";
import { findDistance, middle_latlng } from "../js/common";

let poly = null;
export const km_marks = L.layerGroup();

// const updateOverlays = () => updateMarks({ map, poly, km_marks });

const getRouteArray = poly => poly.toGeoJSON().geometry.coordinates;


export const writeReduxData = ({ e, updatePolyCoords }) => {
  const route = getRouteArray(poly);
  const latlngs = route.map(([lng, lat]) => ({lat, lng}));

  updatePolyCoords({ latlngs });
};

const endMarker = ({ end_latlng, length }) => L.marker(
  [end_latlng[1], end_latlng[0]],
  {
    icon: L.divIcon(
      {
        html: `${length}&nbsp;км`,
        className: 'end_mark'
      }
    )
  }
);

const startMarker = ({ start_latlng, map }) => L.marker(
  [start_latlng[1], start_latlng[0]],
  {
    icon: L.divIcon({
      html: `<div style="transform: scale(${(map.getZoom() / 13)});"><div class="arr_start"></div></div>`,
      className: 'arr_mark'
    })
  }
);

export const updateMarks = () => {
  km_marks.clearLayers();
  const route = getRouteArray(poly);
  const latlngs = poly.getLatLngs();
  let start_latlng;
  let end_latlng;
  let i;
  let rotation;
  let middle;
  let distance;

  if (route.length > 0) {
    start_latlng    = route[0];
    end_latlng      = route[route.length - 1];
    km_marks.addLayer(startMarker({ start_latlng, map }));
    if (route.length > 1) {
      const segs = L.GeometryUtil.accumulatedLengths(poly);
      const length = Math.round(segs[segs.length - 1] / 1000);
      // end mark
      km_marks.addLayer(endMarker({ end_latlng, length }));

      //and also length to panel:
      // $('#text_route_length').text(length + 'км');

      for (i = 1; i < latlngs.length; i += 1) {
        rotation = L.GeometryUtil.bearing(latlngs[i - 1], latlngs[i]);
        middle = middle_latlng(latlngs[i], latlngs[i - 1]);
        distance = findDistance(latlngs[i - 1].lat, latlngs[i - 1].lng, latlngs[i].lat, latlngs[i].lng);

        if (distance > 1) {
          km_marks.addLayer(L.marker([middle.lat, middle.lng], { icon: L.divIcon({ html: '<div style="transform: scale(' + (map.getZoom() / 13) + ');"><img src="misc/arr.png" style="transform: translateX(-4px) translateY(-4px) rotate(' + (270 + rotation) + 'deg);"></div>', className: 'arr_mark' }) }));
        }

      }
    } else {
      // $('#text_route_length').text('0 км');
    }
  }
  // updatePolyCoords({ latlngs: route });
  // local_store_data();
};

const clearKmMarks = () => km_marks.clearLayers();

const insertVertex = ({ e, updatePolyCoords }) => {
  // Добавляет редактирующую ручку по щелчку
  // если щелчок по кривой, а не по ручке И если ломаная в режиме редактирования. Иначе - перейти к редактированию
  if (e.originalEvent.target.tagName === 'path' && poly.editor._enabled) {
    // если щелкнуть по кривой во время редактирования, editable не должно рисовать новую точку
    if (e.type === 'editable:drawing:click') e.cancel();

    let latlngs = poly.getLatLngs(); // набор точек ломанной
    let best = 10000;
    let pos = []; // переменные для определения принадлежности точки отрезку на ломанной

    for(let i=0; i<latlngs.length-1; i++) {
      // Дальше определяем, лежит ли точка на отрезке ломаной перебором этих отрезков
      const x = e.latlng['lat'];
      const x1 = latlngs[i]['lat'];
      const x2 = latlngs[i+1]['lat'];
      const y = e.latlng['lng'];
      const y1 = latlngs[i]['lng'];
      const y2 = latlngs[i+1]['lng'];

      // эта странная конструкция определяет, лежит ли вообще точка между двумя соседями на отрезке
      if ((
        (x1<x2 && (x>x1 && x<x2))
        ||
        (x1>x2 && (x<x1 && x>x2))
        ||
        (x1 === x2 && Math.abs(x-x1)>0.001)
      ) && (
        (y1<y2 && (y>y1 && y<y2))
        ||
        (y1>y2 && (y<y1 && y>y2))
        ||
        (y1 === y2 && Math.abs(y-y1)>0.001)
      )
      ) {
        // если да, то проверяем, далеко ли точка от самого отрезка между двумя точками
        let dx1 = x2 - x1;
        let dy1 = y2 - y1;
        let dx = x - x1;
        let dy = y - y1;
        let result = Math.abs((dx1 * dy) - (dx * dy1));
        if (result < best) {
          // это - не очень-то точная функция. Но по клику она определяет, по какому отрезку мы кликнули
          best = result;
          pos = [i, i+1];
        }
      }
    }
    // если точка найдена, добавляем её в отрезок
    if (pos.length>1) {
      poly.editor.disable();
      latlngs.splice(pos[1],0,e.latlng);
      poly.setLatLngs(latlngs);
      poly.editor.initVertexMarkers();
      poly.editor.enable();
      poly.editor.continueForward();

      writeReduxData({ e, updatePolyCoords });
    }
  } else {
    // Рисование! Очистим буфер отмен :-)
    // redoBuffer = [];
    // если ломаная не в режиме редактирования или если мы, всё-таки, кликнули по ручке, просто активируем редактор
    // route_state('active');
  }
};

export const bindPolyEvents = ({ updatePolyCoords }) => {
  // Если на карте что-то меняется, пересчитать километражи
  map.editTools.addEventListener('editable:drawing:mouseup', updateMarks);
  map.editTools.addEventListener('editable:vertex:dragend', updateMarks);

  map.editTools.addEventListener('editable:vertex:dragend', e => writeReduxData({ e, updatePolyCoords }));
  map.editTools.addEventListener('editable:vertex:new', e => writeReduxData({ e, updatePolyCoords }));
  map.editTools.addEventListener('editable:vertex:deleted', e => writeReduxData({ e, updatePolyCoords }));

  // Продолжить рисование после удаления точки
  map.editTools.addEventListener('editable:vertex:deleted', e => {
    poly.editor.continueForward();
    updateMarks();
  });

  // Добавлять точек в полилинию по щелчку
  map.editTools.addEventListener('editable:drawing:click', e => insertVertex({ e, updatePolyCoords }));
  map.editTools.addEventListener('editable:drawing:clicked', () => updateMarks({ updatePolyCoords }));

  // Это для точек. При перетаскивании конца указателя тащим точку
  // map.editTools.addEventListener('editable:vertex:drag', on_vertex_drag);

  // при перетаскивании ручек убирать все отметки километров
  map.editTools.addEventListener('editable:vertex:dragstart', clearKmMarks);
};

export const updatePoly = (latlngs) => {
  // const route = latlngs.map(([lat, lng]) => new L.latLng(lat, lng));
  if (!latlngs || latlngs.length < 2) return;

  poly.setLatLngs(createLatLngs(latlngs));
  poly.addTo(map);
  poly.setStyle({ color: '#ff3333', weight: '5' });
  poly.editor.options.skipMiddleMarkers = true;
  poly.editor.disable().enable();
  poly.editor.continueForward();
  //
};

export const createLatLngs = latlngs => latlngs.map(({ lat, lng }) => new L.LatLng(lat, lng));

const createPoly = () => {
  const result = map.editTools.startPolyline();

  result.editor.enable();

  return result;
};

const restorePoly = latlngs => {
  const result = L.polyline(createLatLngs(latlngs), {color: 'red'}).addTo(map);

  result.enableEdit().continueForward();
  result.editor.options.skipMiddleMarkers = true;

  result.editor.reset();

  return result;
};

export const preparePoly = ({ updatePolyCoords, latlngs }) => {
  map.addLayer(km_marks);

  poly = (latlngs && latlngs.length)
    ? restorePoly(latlngs)
    : createPoly();

  updateMarks();

  poly.setStyle({ color: '#ff3333', weight: '5' });

  bindPolyEvents({ updatePolyCoords });

  return poly;
};

