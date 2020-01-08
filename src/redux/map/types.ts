import { LatLng } from "leaflet";

export type ILatLng = {
  lat: number,
  lng: number,
}

export type IMapRoute = ILatLng[];


export interface IStickerDump {
  latlng: ILatLng,
  set: string,
  sticker: string,
  angle?: number,
  text?: string,
}
