import L from 'leaflet';

import 'leaflet-editable';
import 'leaflet.markercluster';
import 'leaflet.markercluster.webpack';
import 'leaflet-geometryutil';

import { mapStyles } from '$constants/mapStyles';

import { stickers } from '$constants/stickers';

import { updateMarks } from '$utils/updater';
import { bindPolyEvents, preparePoly } from '$utils/poly';

// В этой штуке мы храним точки и выноски, их связки и всё такое
const point_array = {
  points: L.layerGroup(),
  vectors: L.layerGroup(),
  handles: L.layerGroup(),
  pairs: {},
  point_to_id: {},
  id_to_point: {},
  savedata: {}
};

const points = L.layerGroup();

let mode = 'none';
const current_map_style = 'default';

// Интересные места;
// const places_layer;

export const map = L.map('map', {
  editable: true,
  layers: [points, point_array.points, point_array.vectors, stickers.layers]
}).setView([55.0153275, 82.9071235], 13);

map.editTools.skipMiddleMarkers = true;

// Слой с интересными местами
// const places_layer =  L.markerClusterGroup({maxClusterRadius: 20});

// const poly = preparePoly(map); // начинаем новую полилинию

// const updateOverlays = () => updateMarks({ map, poly, km_marks });
const updateOverlays = e => console.log();

const prepareMapLayer = provider => {
  L.tileLayer(provider, {
    attribution: 'Независимое Велосообщество',
    maxNativeZoom: 18,
    maxZoom: 18,
    // minZoom: 11
  }).addTo(map);
};

const bindMapEvents = () => {
  // при масштабировании карты масштабировать стрелки
  // map.on('zoom', function (e) {
  //   $('.arr_mark > div').css('transform', 'scale(' + (map.getZoom()/13) + ')');
  // });

  map.on('click', updateOverlays);
};

export const setMode = variant => {
  mode = variant;
};

// prepareMap();

export const prepareMap = () => {
  // Эта функция создаёт саму карту и наносит на неё маршруты в самом начале работы
  // создаём объект с картой
  map.doubleClickZoom.disable();
  prepareMapLayer(mapStyles[current_map_style]);

  bindMapEvents();
  // bindPolyEvents({ poly, map, updateOverlays, clearKmMarks });
};
