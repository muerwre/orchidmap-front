import * as saveAs from 'file-saver';

export interface IRoutePoint {
  lat: number,
  lng: number,
}

interface IGetGPXString {
  points: Array<IRoutePoint>,
  title?: string,
}

export const getGPXString = ({ points, title }: IGetGPXString): string => (`
  <?xml version="1.0" encoding="UTF-8" standalone="yes"?>
    <gpx>
      <rte>
        <name>${title || 'GPX Track'}</name>
        ${
          points.reduce((cat, { lat, lng }, index) => (
              ` ${cat}
                <wpt lat="${lat.toFixed(6)}" lon="${lng.toFixed(6)}"></wpt>`
          ), '')
        }        
      </rte>
    </gpx>
`);

// export const getGPXString = ({ points, title }: IGetGPXString): string => (`
//   <?xml version="1.0" encoding="UTF-8" standalone="yes"?>
//     <gpx>
//       <rte>
//         <name>${title || 'GPX Track'}</name>
//         ${
//           points.reduce((cat, { lat, lng }, index) => (
//               `${cat}
// <rtept lat="${lat}" lon="${lng}"></rtept>`
//           ), '')
//         }
//       </rte>
//     </gpx>
// `);

export const downloadGPXTrack = ({ track, title }: { track: string, title?: string }) => (
  saveAs(
    new Blob([track], { type: 'application/gpx+xml;charset=utf-8' }),
    `${title || 'track'}.gpx`
  )
);
