// Стили карт
import { editor } from '$modules/Editor';

const TILEMAPS = {
  WATERCOLOR: {
    name: 'Watercolor',
    url: 'http://stamen-tiles-{s}.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.jpg',
    range: [1, 2, 3, 4],
  },
  DGIS: {
    name: '2gis',
    url: 'https://tile1.maps.2gis.com/tiles?x={x}&y={y}&z={z}&v=1',
    range: [1, 2, 3],
  },
  DEFAULT: {
    name: 'OpenStreetMap',
    url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    range: ['a', 'b', 'c'],
  },
  DARQ: {
    name: 'Darq',
    url: 'http://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
    range: [1, 2, 3, 4],
  },
  BLANK: {
    name: 'Blanque',
    url: 'http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
    range: [1, 2, 3, 4],
  },
  HOT: {
    name: 'Hot',
    url: 'http://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png',
    range: ['a', 'b', 'c'],
  },
  SAT: {
    name: 'Google Sattelite',
    url: 'http://mt{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}',
    range: [0, 1, 2, 3],
  },
  YMAP: {
    name: 'Yandex',
    url: 'https://vec0{s}.maps.yandex.net/tiles?l=map&v=17.04.16-0&x={x}&y={y}&z={z}&scale=1&lang=ru_RU',
    range: [1, 2, 3, 4],
  },
  YSAT: {
    name: 'YandexSat',
    url: 'https://sat0{s}.maps.yandex.net/tiles?l=sat&v=3.330.0&x={x}&y={y}&z={z}&lang=ru_RU',
    range: [1, 2, 3, 4],
  },
};

const ENABLED = ['BLANK', 'DEFAULT', 'DGIS', 'HOT'];

export const DEFAULT_PROVIDER = ENABLED[0];
export const PROVIDERS = ENABLED.reduce((obj, provider) => ({
  ...obj,
  [provider]: TILEMAPS[provider],
}), {});

export const replaceProviderUrl = (provider, { x, y, zoom }) => {
  const { url, range } = (PROVIDERS[provider] || PROVIDERS[DEFAULT_PROVIDER]);
  const random = (range && range.length >= 2) ? range[Math.round((Math.random() * (range.length - 1)))] : 1;

  return url.replace('{x}', x).replace('{y}', y).replace('{z}', zoom).replace('{s}', random);
};
