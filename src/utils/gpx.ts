import saveAs from 'file-saver';
import GPX from 'gpx-parser-builder';
import { LatLng } from 'leaflet';

type GpxImportTrkPt = {
  $: { lat: string; lon: string }[];
  name: string;
};

type GpxImportTrkSeg = {
  trkpt: { trkpt: GpxImportTrkPt }[];
};

type GpxImportRaw = {
  metadata: { name: string };
  trk: {
    name: string;
    trkseg: GpxImportTrkSeg[];
  }[];
};
// export interface IRoutePoint {
//   lat: number;
//   lng: number;
// }

interface IGPXSticker {
  latlng: LatLng;
  text?: string;
}

interface IGetGPXString {
  route: Array<LatLng>;
  stickers?: Array<IGPXSticker>;
  title?: string;
}

export const getGPXString = ({
  route,
  title,
  stickers,
}: IGetGPXString): string => `<?xml version="1.0" encoding="UTF-8"?>
<gpx xmlns="http://www.topografix.com/GPX/1/1" version="1.1" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd">
  <metadata>
    <name>${title || 'GPX Track'}</name> 
  </metadata>
  ${stickers.reduce(
    (cat, { latlng: { lat, lng }, text }) =>
      `${cat}
          <wpt lat="${lat}" lon="${lng}">            
            <name>${text}</name>
            <sym>generic</sym>
            <type>${title}</type>
          </wpt>`,
    ''
  )}
      <trk>        
        <name>${title || 'GPX Track'}</name>
        <trkseg>
        ${route.reduce(
          (cat, { lat, lng }) =>
            ` ${cat}
            <trkpt lat="${lat}" lon="${lng}" />`,
          ''
        )}
        </trkseg>
      </trk>      
    </gpx>
`;

export const downloadGPXTrack = ({ track, title }: { track: string; title?: string }): void =>
  saveAs(
    new Blob([track], { type: 'application/gpx+xml;charset=utf-8' }),
    `${(title || 'track').replace(/\./gi, ' ')}.gpx`
  );

export const importGpxTrack = async (file: File) => {
  const reader = new FileReader();
  const content = await new Promise(resolve => {
    reader.readAsText(file);

    reader.onload = () => {
      resolve(reader.result);
    };

    reader.onerror = () => {
      resolve(null);
    };
  });

  const gpx: GpxImportRaw = GPX.parse(content);
  console.log(gpx);

  if (!gpx || !gpx.trk) return null;

  const latlngs: LatLng[] = gpx.trk.reduce((trk_res, trk) => {
    return trk.trkseg.reduce((trkseg_res, trkseg) => {
      return [
        ...trkseg_res,
        ...trkseg.trkpt.map(pnt => ({ lat: pnt['$'].lat, lng: pnt['$'].lon })),
      ];
    }, trk_res);
  }, []);

  return [
    {
      name: gpx.metadata.name || '',
      latlngs,
    },
  ];
};
