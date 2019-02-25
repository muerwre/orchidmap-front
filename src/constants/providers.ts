export interface IProvider {
  name: string,
  url: string,
  range: Array<string | number>,
}

export interface ITileMaps {
  WATERCOLOR: IProvider,
  DGIS: IProvider,
  DEFAULT: IProvider,
  DARQ: IProvider,
  BLANK: IProvider,
  HOT: IProvider,
  YSAT: IProvider,
  YMAP: IProvider,
  SAT: IProvider,
}


// Стили карт
const TILEMAPS: ITileMaps = {
  WATERCOLOR: {
    name: 'Watercolor',
    url: 'https://stamen-tiles-{s}.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.jpg',
    range: [1, 2, 3, 4],
  },
  DGIS: {
    name: '2gis',
    url: 'https://tile1.maps.2gis.com/tiles?x={x}&y={y}&z={z}&v=1',
    range: [1, 2, 3],
  },
  DEFAULT: {
    name: 'OpenStreetMap',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    range: ['a', 'b', 'c'],
  },
  DARQ: {
    name: 'Darq',
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
    range: [1, 2, 3, 4],
  },
  BLANK: {
    name: 'Blanque',
    url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
    range: [1, 2, 3, 4],
  },
  HOT: {
    name: 'Hot',
    url: 'https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png',
    range: ['a', 'b', 'c'],
  },
  SAT: {
    name: 'Google Sattelite',
    url: 'https://mt{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}',
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

const ENABLED: Array<keyof ITileMaps> = ['BLANK', 'DEFAULT', 'DGIS', 'HOT', 'DARQ'];

export const DEFAULT_PROVIDER: keyof ITileMaps = ENABLED[0];
export const PROVIDERS: Partial<ITileMaps> = ENABLED.reduce((obj, provider) => ({
  ...obj,
  [provider]: TILEMAPS[provider],
}), {});

export const replaceProviderUrl = (provider, { x, y, zoom }: { x: number, y: number, zoom: number }): string => {
  const { url, range } = (PROVIDERS[provider] || PROVIDERS[DEFAULT_PROVIDER]);
  const random: (number | string) = (range && range.length >= 2)
    ? range[Math.round((Math.random() * (range.length - 1)))]
    : 1;

  return url.replace('{x}', x).replace('{y}', y).replace('{z}', zoom).replace('{s}', String(random));
};
