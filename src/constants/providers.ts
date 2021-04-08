export interface IProvider {
  name: string,
  url: string,
  range: Array<string | number>,
}

export type ITileMaps = Record<string, IProvider>

// Стили карт
const TILEMAPS: ITileMaps = {
  DGIS: {
    name: '2gis',
    url: 'https://tile1.maps.2gis.com/tiles?x={x}&y={y}&z={z}&v=1',
    range: ['a','b','c'],
  },
  DEFAULT: {
    name: 'OpenStreetMap',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    range: ['a', 'b', 'c'],
  },
  BLANK: {
    name: 'Blanque',
    url: 'https://{s}.carto.tile.vault48.org/light_all/{z}/{x}/{y}.png',
    range: [1, 2, 3, 4],
  },
  HOT: {
    name: 'Hot',
    url: 'https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png',
    range: ['a', 'b', 'c'],
  },
  ESAT: {
    name: 'Sattelite',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    range: [1,2,3,4],
  }
};

const ENABLED: Array<keyof ITileMaps> = ['BLANK', 'DEFAULT', 'DGIS', 'HOT', 'ESAT'];

export const DEFAULT_PROVIDER: keyof ITileMaps = ENABLED[1];
export const PROVIDERS: ITileMaps = ENABLED.reduce((obj, provider) => ({
  ...obj,
  [provider]: TILEMAPS[provider],
}), {});

export const replaceProviderUrl = (provider, { x, y, zoom }: { x: number, y: number, zoom: number }): string => {
  const { url, range } = (PROVIDERS[provider] || PROVIDERS[DEFAULT_PROVIDER]);
  const random: (number | string) = (range && range.length >= 2)
    ? range[Math.round((Math.random() * (range.length - 1)))]
    : 1;

  return url.replace('{x}', String(x)).replace('{y}', String(y)).replace('{z}', String(zoom)).replace('{s}', String(random));
};
