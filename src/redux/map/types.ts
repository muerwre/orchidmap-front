import { LatLng } from 'leaflet';
import { IRoutePoint } from '~/utils/gpx';

export type ILatLng = {
  lat: number;
  lng: number;
};

export type IMapRoute = ILatLng[];

export interface IStickerDump {
  latlng: ILatLng;
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
  route: IRoutePoint[];
  stickers: IStickerDump[];
  provider: string;
  is_public: boolean;
  is_published: boolean;
  description: string;
  logo: string;
  distance: number;
}
