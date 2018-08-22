import L from 'leaflet';
import Routing from 'leaflet-routing-machine/src/index';
import { CONFIG } from '$config';
import { DomMarker } from '$utils/DomMarker';

export class Router {
  constructor({ map, lockMapClicks, setRouterPoints }) {
    const routeLine = r => Routing.line(r, {
      styles: [
        { color: 'white', opacity: 0.8, weight: 6 },
        {
          color: '#4597d0', opacity: 1, weight: 4, dashArray: '15,10'
        }
      ],
      addWaypoints: true,
    }).on('linetouched', this.lockPropagations);

    this.router = Routing.control({
      serviceUrl: CONFIG.OSRM_URL,
      profile: 'bike',
      fitSelectedRoutes: false,
      routeLine,
      altLineOptions: {
        styles: [{ color: '#4597d0', opacity: 1, weight: 3 }]
      },
      show: false,
      plan: Routing.plan([], {
        createMarker: (i, wp) => L.marker(wp.latLng, {
          draggable: true,
          icon: this.createWaypointMarker(),
        }),
        routeWhileDragging: true,
      }),
      routeWhileDragging: true
    }).on('waypointschanged', this.updateWaypointsCount);

    this.router.addTo(map);

    this.waypoints = [];
    this.lockMapClicks = lockMapClicks;
    this.setRouterPoints = setRouterPoints;
    // this.router._line.on('mousedown', console.log);
  }
  //
  pushWaypointOnClick = ({ latlng: { lat, lng } }) => {
    const waypoints = this.router.getWaypoints().filter(({ latLng }) => !!latLng);
    console.log('push', waypoints);
    this.router.setWaypoints([...waypoints, { lat, lng }]);
  };

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
    if (e && e.preventPropagations) {
      e.preventDefault();
      e.preventPropagations();
    }

    window.removeEventListener('mouseup', this.unlockPropagations);
    setTimeout(() => this.lockMapClicks(false), 300);
  };

  startFrom = latlngs => {
    const waypoints = this.router.getWaypoints();

    if (waypoints && waypoints.length) {
      waypoints[0] = { ...latlngs };
      this.router.setWaypoints(waypoints);
      return;
    }

    this.router.setWaypoints([{ ...latlngs }]);
  };

  moveStart = latlng => {
    const waypoints = this.router.getWaypoints();
    const { latLng } = (waypoints[0] || {});

    if (!latLng || !latlng) return;

    if (
      latlng.lat.toFixed(5) === latLng.lat.toFixed(5) &&
      latlng.lng.toFixed(5) === latLng.lng.toFixed(5)
    ) {
      return;
    }

    waypoints[0] = { ...latlng };

    this.router.setWaypoints(waypoints);
  };

  updateWaypointsCount = () => {
    const waypoints = this.router.getWaypoints().filter(({ latLng }) => !!latLng);
    this.setRouterPoints(waypoints.length);
  }
}
