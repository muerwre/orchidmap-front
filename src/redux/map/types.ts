import { LatLng } from 'leaflet';

export type IMapRoute = LatLng[];

export interface IStickerDump {
  latlng: LatLng;
  set: string;
  sticker: string;
  angle?: number;
  text?: string;
}

export interface IRoute {
  version: number;
  title: string; 
  owner: number;
  address: string;
  route: LatLng[];
  stickers: IStickerDump[];
  provider: string;
  is_public: boolean;
  is_published: boolean;
  description: string;
  logo: string;
  distance: number;
}
