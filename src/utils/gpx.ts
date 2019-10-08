import * as saveAs from 'file-saver';

export interface IRoutePoint {
  lat: number,
  lng: number,
}

interface IGPXSticker {
  latlng: IRoutePoint,
  text?: string,
}

interface IGetGPXString {
  route: Array<IRoutePoint>,
  stickers?: Array<IGPXSticker>
  title?: string,
}

export const getGPXString = ({ route, title, stickers }: IGetGPXString): string => (`<?xml version="1.0" encoding="UTF-8"?>
<gpx xmlns="http://www.topografix.com/GPX/1/1" version="1.1" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd">
  <metadata>
    <name>${title || 'GPX Track'}</name> 
  </metadata>
  ${
    stickers.reduce((cat, { latlng: { lat, lng }, text }) => (
        `${cat}
          <wpt lat="${lat}" lon="${lng}">            
            <name>${text}</name>
            <sym>generic</sym>
            <type>${title}</type>
          </wpt>`), '')
        }
      <trk>        
        <name>${title || 'GPX Track'}</name>
        <trkseg>
        ${
          route.reduce((cat, { lat, lng }) => (
          ` ${cat}
            <trkpt lat="${lat}" lon="${lng}" />`
          ), '')
        }
        </trkseg>
      </trk>      
    </gpx>
`);

export const downloadGPXTrack = ({ track, title }: { track: string, title?: string }): void => (
  saveAs(
    new Blob([track], { type: 'application/gpx+xml;charset=utf-8' }),
    `${(title || 'track').replace('.', '')}.gpx`
  )
);
