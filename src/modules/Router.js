import L from 'leaflet';
import 'leaflet-routing-machine';
import { CONFIG } from '$config';
import { DomMarker } from '$utils/DomMarker';

export class Router {
  constructor({ map, lockMapClicks }) {
    const routeLine = r => L.Routing.line(r, {
      styles: [
        { color: 'white', opacity: 0.8, weight: 6 },
        { color: '#4597d0', opacity: 1, weight: 4, dashArray: '15,10' }
      ],
      addWaypoints: true,
    }).on('linetouched', this.lockPropagations);

    this.router = L.Routing.control({
      serviceUrl: CONFIG.OSRM_URL,
      profile: 'bike',
      fitSelectedRoutes: false,
      routeLine,
      altLineOptions: {
        styles: [{ color: '#4597d0', opacity: 1, weight: 3 }]
      },
      show: false,
      plan: L.Routing.plan([], {
        createMarker: (i, wp) => L.marker(wp.latLng, {
          draggable: true,
          icon: this.createWaypointMarker(),
        }),
        routeWhileDragging: true,
      }),
      routeWhileDragging: true
    });
    // .on('waypointschanged', this.updateWaypointsByEvent);

    this.router.addTo(map);

    this.waypoints = [];
    this.lockMapClicks = lockMapClicks;

    console.log('router', this.router);
    // this.router._line.on('mousedown', console.log);
    console.log('map', map);
  }
  //
  pushWaypointOnClick = ({ latlng: { lat, lng } }) => {
    const waypoints = this.router.getWaypoints().filter(({ latLng }) => !!latLng);
    console.log('push', waypoints);
    this.router.setWaypoints([...waypoints, { lat, lng }]);
  };
  //
  // pushWaypoint = latlng => {
  //   this.waypoints.push(latlng);
  //   this.updateWaypoints();
  // };
  //
  // updateWaypointsByEvent = (e) => {
  //   console.log('upd', e);
  //   // this.waypoints = waypoints.map(({ latlng }) => latlng);
  //
  // };
  //
  // updateWaypoints = () => {
  //   this.router.setWaypoints(this.waypoints);
  // };
  //
  createWaypointMarker = () => {
    const element = document.createElement('div');

    element.addEventListener('mousedown', this.lockPropagations);
    element.addEventListener('mouseup', this.unlockPropagations);

    return new DomMarker({
      element,
      className: 'router-waypoint',
    });
  };
  //
  lockPropagations = () => {
    console.log('lock');
    window.addEventListener('mouseup', this.unlockPropagations);
    this.lockMapClicks(true);
  };
  //
  unlockPropagations = e => {
    console.log('unlock');
    if (e && e.preventPropagations) {
      console.log('stop');
      e.preventDefault();
      e.preventPropagations();
    }

    window.removeEventListener('mouseup', this.unlockPropagations);
    setTimeout(() => this.lockMapClicks(false), 300);
  };

  startFrom = latlngs => {
    this.router.setWaypoints([{ ...latlngs }]);
  }
}
