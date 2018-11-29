// Стили карт
const TILEMAPS = {
  WATERCOLOR: {
    name: 'Watercolor',
    url: 'http://stamen-tiles-{s}.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.jpg',
    range: [1, 4],
  },
  DGIS: {
    name: '2gis',
    url: 'https://tile1.maps.2gis.com/tiles?x={x}&y={y}&z={z}&v=1',
    range: [1, 3],
  },
  DEFAULT: {
    name: 'OpenStreetMap',
    url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    range: [1, 4],
  },
  DARQ: {
    name: 'Darq',
    url: 'http://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
    range: [1, 4],
  },
  BLANK: {
    name: 'Blanque',
    url: 'http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
    range: [1, 4],
  },
  HOT: {
    name: 'Hot',
    url: 'http://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png',
    range: [1, 4],
  },
  SAY: {
    name: 'Google?',
    url: 'http://mt{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}',
    range: [0, 3],
  },
  YMAP: {
    name: 'Yandex',
    url: 'https://vec0{s}.maps.yandex.net/tiles?l=map&v=17.04.16-0&x={x}&y={y}&z={z}&scale=1&lang=ru_RU',
    range: [1, 4],
  },
  YSAT: {
    name: 'YandexSat',
    url: 'https://sat0{s}.maps.yandex.net/tiles?l=sat&v=3.330.0&x={x}&y={y}&z={z}&lang=ru_RU',
    range: [1, 4],
  },
};

const ENABLED = ['BLANK', 'DEFAULT', 'DGIS'];

export const DEFAULT_PROVIDER = ENABLED[0];
export const PROVIDERS = ENABLED.reduce((obj, provider) => ({
  ...obj,
  [provider]: TILEMAPS[provider],
}), {});
