import { Map, Marker } from 'leaflet';
import * as Routing from 'leaflet-routing-machine/src/index';
import { CLIENT } from '$config/frontend';
import { DomMarker } from '$utils/DomMarker';
import { editor } from "$modules/Editor";

interface ILatLng {
  lat: number, lng: number
}

interface IWaypoint {
  latLng: ILatLng
}

interface Props {
  setIsRouting: typeof editor.setIsRouting,
  map: Map,
  setRouterPoints: typeof editor.setRouterPoints,
  pushPolyPoints: typeof editor.pushPolyPoints,
  lockMapClicks: typeof editor.lockMapClicks;
}

export class Router {
  constructor({
    map, lockMapClicks, setRouterPoints, pushPolyPoints, setIsRouting,
  }: Props) {
    this.waypoints = [];
    this.lockMapClicks = lockMapClicks;
    this.setRouterPoints = setRouterPoints;
    this.pushPolyPoints = pushPolyPoints;
    this.setIsRouting = setIsRouting;

    const routeLine = r => Routing.line(r, {
      styles: [
        { color: 'white', opacity: 0.8, weight: 6 },
        { color: '#4597d0', opacity: 1, weight: 4, dashArray: '15,10' }
      ],
      addWaypoints: true,
    }).on('linetouched', this.lockPropagations);

    this.router = Routing.control({
      serviceUrl: CLIENT.OSRM_URL,
      profile: CLIENT.OSRM_PROFILE,
      fitSelectedRoutes: false,
      showAlternatives: false,
      routeLine,
      altLineOptions: {
        styles: [{ color: '#4597d0', opacity: 1, weight: 3 }]
      },
      show: false,
      plan: Routing.plan([], {
        createMarker: (i, wp) => new Marker(wp.latLng, {
          draggable: true,
          icon: this.createWaypointMarker(),
        }),
        routeWhileDragging: false,
      }),
      routeWhileDragging: false,
      routingOptions: {
        geometryOnly: false,
      },
      useHints: false,
    })
      .on('routingstart', this.showSpinner)
      .on('routesfound routingerror routeselected routingzoomend', this.hideSpinner)
      .on('waypointschanged', this.updateWaypointsCount);

    // deploy x 5

    this.router.addTo(map);
  }

  showSpinner = () => {
    this.setIsRouting(true);
  };

  hideSpinner = () => {
    this.setIsRouting(false);
  };

  pushWaypointOnClick = ({ latlng: { lat, lng } }: { latlng: ILatLng }): void => {
    const waypoints = this.router.getWaypoints().filter(({ latLng }) => !!latLng);
    this.router.setWaypoints([...waypoints, { lat, lng }]);
  };

  createWaypointMarker = (): DomMarker => {
    const element = document.createElement('div');

    element.addEventListener('mousedown', this.lockPropagations);
    element.addEventListener('mouseup', this.unlockPropagations);

    return new DomMarker({
      element,
      className: 'router-waypoint',
    });
  };

  lockPropagations = (): void => {
    window.addEventListener('mouseup', this.unlockPropagations);
    this.lockMapClicks(true);
  };

  unlockPropagations = (e): void => {
    if (e && e.preventPropagations) {
      e.preventDefault();
      e.preventPropagations();
    }

    window.removeEventListener('mouseup', this.unlockPropagations);
    setTimeout(() => this.lockMapClicks(false), 0);
  };

  startFrom = (latlngs: ILatLng): void => {
    const waypoints = this.router.getWaypoints();

    if (waypoints && waypoints.length) {
      waypoints[0] = { ...latlngs };
      this.router.setWaypoints(waypoints);
      return;
    }

    this.router.setWaypoints([{ ...latlngs }]);
  };

  moveStart = (latlng: ILatLng): void => {
    const waypoints = this.router.getWaypoints();
    const { latLng }: { latLng: ILatLng } = (waypoints[0] || {});

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

  updateWaypointsCount = (): void => {
    const waypoints = this.router.getWaypoints().filter(({ latLng }) => !!latLng);
    this.setRouterPoints(waypoints.length);
  };

  cancelDrawing = (): void => {
    this.router.setWaypoints([]);
  };

  submitDrawing = (): void => {
    const [route] = this.router._routes;
    if (!route) return;

    const { coordinates } = route;
    this.pushPolyPoints(coordinates);

    this.router.setWaypoints([]);

    // UNCOMMENT THIS TO CONTINUE DRAWING
    // const waypoints = this.router.getWaypoints().filter(({ latLng }) => !!latLng);
    // this.router.setWaypoints(waypoints[waypoints.length - 1]);
  };

  clearAll = (): void => {
    this.router.setWaypoints([]);
  };

  waypoints: Array<IWaypoint> = [];
  setIsRouting: Props['setIsRouting'];
  lockMapClicks: Props['lockMapClicks'];
  setRouterPoints: Props['setRouterPoints'];
  pushPolyPoints: Props['pushPolyPoints'];
  router: Routing;
}
