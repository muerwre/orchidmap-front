import { Map, LayerGroup, LatLng, LatLngLiteral, LeafletEventHandlerFn, marker, divIcon, Marker } from 'leaflet';
import { EditablePolyline } from '$utils/EditablePolyline';
import { simplify } from '$utils/simplify';
import { CLIENT } from '$config/frontend';
import { editor, Editor } from "$modules/Editor";
import { ILatLng } from "$modules/Stickers";
import { InteractivePoly } from "$modules/InteractivePoly";
import { clusterIcon } from "$utils/clusterIcon";
import { MarkerClusterGroup } from 'leaflet.markercluster/dist/leaflet.markercluster-src.js';
import { angleBetweenPoints, dist2, distToSegment, middleCoord } from "$utils/geom";
import { arrowClusterIcon, createArrow } from "$utils/arrow";

interface Props {
  map: Map;
  editor: Editor;
  routerMoveStart: typeof editor.routerMoveStart,
  lockMapClicks: typeof editor.lockMapClicks,
  setDistance: typeof editor.setDistance,
  triggerOnChange: typeof editor.triggerOnChange,
}

export class Poly {
  constructor({
    map, routerMoveStart, lockMapClicks, setDistance, triggerOnChange, editor,
  }: Props) {
    this.poly = new InteractivePoly([], {
      color: 'url(#activePathGradient)',
      weight: 6,
      maxMarkers: 100,
      smoothFactor: 3,
      // bubblingMouseEvents: false,
    })
      .on('distancechange', this.onDistanceUpdate)
      .on('allvertexhide', this.onVertexHide)
      .on('allvertexshow', this.onVertexShow)
      .on('latlngschange', this.updateArrows);

    this.poly.addTo(map);
    this.editor = editor;

    this.map = map;

    this.routerMoveStart = routerMoveStart;
    this.setDistance = setDistance;
    this.triggerOnChange = triggerOnChange;
    this.lockMapClicks = lockMapClicks;

    this.arrowLayer.addTo(map);
  }

  onDistanceUpdate = (event) => {
    const { distance } = event as { distance: number };
    this.setDistance(parseFloat(distance.toFixed(2)));
  };

  onVertexHide = (): void => this.editor.setMarkersShown(false);
  onVertexShow = (): void => this.editor.setMarkersShown(true);

  updateArrows = event => {
    this.editor.setChanged(true);

    const { latlngs } = event;
    this.arrowLayer.clearLayers();

    if (latlngs.length === 0) return;

    const midpoints = latlngs.reduce((res, latlng, i) => (
      latlngs[i + 1] && dist2(latlngs[i], latlngs[i + 1]) > 0.00005
        ? [
            ...res,
            {
              latlng: middleCoord(latlngs[i], latlngs[i + 1]),
              angle: angleBetweenPoints(
                this.map.latLngToContainerPoint(latlngs[i]),
                this.map.latLngToContainerPoint(latlngs[i + 1])
              ),
            }
          ]
        : res
    ), []);

    midpoints.forEach(({ latlng, angle }) => (
      this.arrowLayer.addLayer(createArrow(latlng, angle))
    ));
  };

  // setModeOnDrawing = (): void => {
  //   if (this.editor.getMode() !== MODES.POLY) this.editor.setMode(MODES.POLY);
  // };
  //
  // drawArrows = () => {
  //   // todo: fix this
  //   this.arrows.clearLayers();
  //   const { latlngs } = this;
  //
  //   if (!latlngs || latlngs.length <= 1) return;
  //
  //   latlngs.forEach((latlng, i) => {
  //     if (i === 0) return;
  //
  //     const mid = middleCoord(latlngs[i], latlngs[i - 1]);
  //     const dist = findDistance(latlngs[i - 1].lat, latlngs[i - 1].lng, latlngs[i].lat, latlngs[i].lng);
  //
  //     if (dist <= 1) return;
  //
  //     const slide = new Polyline(
  //       [
  //         latlngs[i - 1],
  //         [mid.lat, mid.lng]
  //       ],
  //       { color: 'none', weight: CLIENT.STROKE_WIDTH }
  //     ).addTo(this.arrows) as any;
  //
  //     // todo: uncomment and fix this:
  //     slide._path.setAttribute('marker-end', 'url(#long-arrow)');
  //   });
  // };

  continue = (): void => {
    this.poly.editor.continue();
  };

  stop = (): void => {
    this.poly.stopDrawing();
  };

  enableEditor = (): void => {
    this.poly.editor.enable();
  };

  setPoints = (latlngs: Array<ILatLng>): void => {
    if (!latlngs || latlngs.length <= 1) return;
    this.poly.setPoints(latlngs);
  };

  pushPoints = (latlngs: Array<ILatLng>): void => {
    const { map } = this;
    const simplified = simplify({ map, latlngs });
    const summary = [
      ...this.poly.getLatLngs(),
      ...simplified,
    ];

    this.poly.setPoints(summary);
  };

  clearAll = (): void => {
    this.poly.setPoints([]);
  };

  // clearArrows = (): LayerGroup<any> => this.arrows.clearLayers();

  dumpData = (): Array<LatLng> => this.latlngs;

  get latlngs(): Array<LatLng> {
    return (
      this.poly && this.poly.getLatLngs().length
        && this.poly.getLatLngs().map(el => ({ ...el }))) || [];
  }

  get isEmpty(): boolean {
    return (!this.latlngs || Object.values(this.latlngs).length <= 0);
  }

  poly: EditablePolyline;
  arrowLayer: MarkerClusterGroup = new MarkerClusterGroup({
    spiderfyOnMaxZoom: false,
    showCoverageOnHover: false,
    zoomToBoundsOnClick: false,
    animate: false,
    maxClusterRadius: 120,
    // disableClusteringAtZoom: 13,
    iconCreateFunction: arrowClusterIcon,
  });

  editor: Props['editor'];
  map: Props['map'];
  routerMoveStart: Props['routerMoveStart'];
  setDistance: Props['setDistance'];
  triggerOnChange: Props['triggerOnChange'];
  lockMapClicks: Props['lockMapClicks'];
}
