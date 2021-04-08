import { Marker } from 'leaflet';
import * as Routing from 'leaflet-routing-machine/src/index';
import { CLIENT } from '~/config/frontend';
import { DomMarker } from '~/utils/map/DomMarker';
import { MainMap } from '~/constants/map';

const createWaypointMarker = () => {
  const element = document.createElement('div');

  return new DomMarker({
    element,
    className: 'router-waypoint',
  });
};

const routeLine = r =>
  Routing.line(r, {
    styles: [
      { color: 'white', opacity: 0.8, weight: 12 },
      { color: '#4597d0', opacity: 1, weight: 4, dashArray: '15,10' },
    ],
    addWaypoints: true,
  });
// .on('linetouched', this.lockPropagations);

export const OsrmRouter = Routing.control({
  serviceUrl: CLIENT.OSRM_URL,
  profile: CLIENT.OSRM_PROFILE,
  fitSelectedRoutes: false,
  showAlternatives: false,
  routeLine,
  altLineOptions: {
    styles: [{ color: '#4597d0', opacity: 1, weight: 3 }],
  },
  show: false,
  plan: Routing.plan([], {
    createMarker: (_, wp) => {
      const marker = new Marker(wp.latLng, {
        draggable: true,
        icon: createWaypointMarker(),
      })
        .on('dragstart', () => MainMap.disableClicks())
        .on('dragend', () => MainMap.enableClicks())
        .on('contextmenu', ({ latlng }: any) => {
          OsrmRouter.setWaypoints(
            OsrmRouter.getWaypoints().filter(
              point =>
                !point.latLng || (point.latLng.lat != latlng.lat && point.latLng.lng != latlng.lng)
            )
          );
        });

      return marker;
    },
    routeWhileDragging: false,
  }),
  routeWhileDragging: false,
  routingOptions: {
    geometryOnly: false,
  },
  useHints: false,
});
