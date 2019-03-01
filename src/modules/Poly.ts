import { Map, LatLng } from 'leaflet';
import { simplify } from '$utils/simplify';
import { CLIENT } from '$config/frontend';
import { editor, Editor } from "$modules/Editor";
import { ILatLng } from "$modules/Stickers";
import { InteractivePoly } from "$modules/InteractivePoly";
import { MarkerClusterGroup } from 'leaflet.markercluster/dist/leaflet.markercluster-src.js';
import { angleBetweenPoints, dist2, distToSegment, middleCoord } from "$utils/geom";
import { arrowClusterIcon, createArrow } from "$utils/arrow";
import { Arrows } from "$modules/Arrows";

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

    this.arrows = new Arrows({}).addTo(map);
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
    this.arrows.setLatLngs(latlngs);
  };

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

  dumpData = (): Array<LatLng> => this.latlngs;

  get latlngs(): Array<LatLng> {
    return (
      this.poly && this.poly.getLatLngs().length
        && this.poly.getLatLngs().map(el => ({ ...el }))) || [];
  }

  get isEmpty(): boolean {
    return (!this.latlngs || Object.values(this.latlngs).length <= 0);
  }

  arrows;
  poly;

  editor: Props['editor'];
  map: Props['map'];
  routerMoveStart: Props['routerMoveStart'];
  setDistance: Props['setDistance'];
  triggerOnChange: Props['triggerOnChange'];
  lockMapClicks: Props['lockMapClicks'];
}
