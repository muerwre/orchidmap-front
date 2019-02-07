import L from 'leaflet';

L.Polyline.polylineEditor = L.Polyline.extend({
  _prepareMapIfNeeded() {
    const that = this;
    that._changed = false;

    if (this._map._editablePolylines != null) {
      return;
    }

    // Container for all editable polylines on this map:
    this._map._editablePolylines = [];
    this._map._editablePolylinesEnabled = true;

    // Click anywhere on map to add a new point-polyline:
    if (this._options.newPolylines) {
      that._map.on('dblclick', (event) => {
        // console.log(`click, target=${event.target == that._map} type=${event.type}`);
        if (that._map.isEditablePolylinesBusy()) { return; }

        const latLng = event.latlng;
        // if (that._options.newPolylineConfirmMessage) {
        //   if (!confirm(that._options.newPolylineConfirmMessage)) { return; }
        // }
        const contexts = [{ originalPolylineNo: null, originalPointNo: null }];
        L.Polyline.PolylineEditor([latLng], that._options, contexts).addTo(that._map);

        that._showBoundMarkers();
        that._changed = true;
      });
    }

    this.constrLineStyle = {
      dashArray: '2,10',
      weight: 4,
      color: 'red',
      opacity: 0.5,
    };

    /**
     * Check if there is *any* busy editable polyline on this map.
     */
    this._map.isEditablePolylinesBusy = () => this._editablePolylines.some(el => el._isBusy());
    // {
    //   for (let i = 0; i < this._editablePolylines.length; i += 1) {
    //     if (this._editablePolylines[i]._isBusy()) { return true; }
    //   }
    //
    //   return false;
    // };

    /**
     * Enable/disable editing.
     */
    this._map.setEditablePolylinesEnabled = enabled => {
      // const map = this;
      this._editablePolylinesEnabled = enabled;

      for (let i = 0; i < this._map._editablePolylines.length; i += 1) {
        const polyline = this._map._editablePolylines[i];

        if (enabled) {
          polyline._showBoundMarkers();
        } else {
          // polyline._hideAll();
          this._hideAllMarkers();
        }
      }
    };

    this.editor = {
      enable: () => {
        this._map.setEditablePolylinesEnabled(true);
      },

      disable: () => {
        this._map.setEditablePolylinesEnabled(false);
      },

      continueForward: () => {
        if (this.getLatLngs().length === 0) {
          return this._map.on('click', this._addFirstPoint);
        }

        if (!this._editablePolylinesEnabled) {
          this._map.setEditablePolylinesEnabled(true);
        }

        this._prepareForNewPoint(
          this._markers[this._markers.length - 1],
          this._markers.length,
        );

        return;
      },

      stopDrawing: () => {
        this._clearDragLines();

        this._map.off('click', this._addPointForward);
        this._map.off('click', this._addFirstPoint);
      },

      reset: () => {
        const latlngs = this.getLatLngs();

        this._markers = [];

        for (let i = 0; i < latlngs.length; i += 1) {
          this._addMarkers(i, latlngs[i]);
        }

        this._reloadPolyline();
      },

      clear: () => {
        this.setPoints([]);
      }
    };

    /*
     * Utility method added to this map to retreive editable
     * polylines.
     */
    this._map.getEditablePolylines = () => this._editablePolylines;

    this._map.fixAroundEditablePoint = marker => {
      for (let i = 0; i < this._editablePolylines.length; i += 1) {
        const polyline = this._editablePolylines[i];
        polyline._reloadPolyline(marker);
      }
    };
  },

  constr: {},
  /**
   * Will add all needed methods to this polyline.
   */
  _addMethods() {
    const that = this;

    this._init = (options, contexts) => {
      this._prepareMapIfNeeded();

      /**
       * Since all point editing is done by marker events, markers
       * will be the main holder of the polyline points locations.
       * Every marker contains a reference to the newPointMarker
       * *before* him (=> the first marker has newPointMarker=null).
       */
      this._parseOptions(options);

      this._markers = [];
      const points = this.getLatLngs();

      for (let i = 0; i < points.length; i += 1) {
        const marker = this._addMarkers(i, points[i]);

        if (!('context' in marker)) {
          marker.context = {};
          if (that._contexts != null) {
            marker.context = contexts[i];
          }
        }

        if (marker.context && !('originalPointNo' in marker.context)) { marker.context.originalPointNo = i; }
        if (marker.context && !('originalPolylineNo' in marker.context)) { marker.context.originalPolylineNo = that._map._editablePolylines.length; }
      }

      // Map move => show different editable markers:
      this._map.on('zoomend', this._showBoundMarkers);
      this._map.on('moveend', this._showBoundMarkers);

      if (this._desiredPolylineNo && this._desiredPolylineNo != null) {
        this._map._editablePolylines.splice(this._desiredPolylineNo, 0, this);
      } else {
        this._map._editablePolylines.push(this);
      }
    };

    // this.setLatLngs = latlngs => {
    //
    // };
    /**
     * Check if is busy adding/moving new nodes. Note, there may be
     * *other* editable polylines on the same map which *are* busy.
     */
    this._isBusy = function () {
      return that._busy;
    };

    this._setBusy = function (busy) {
      that._busy = busy;
    };

    /**
     * Get markers for this polyline.
     */
    this.getPoints = () => this._markers;

    this.isChanged = () => this._changed;

    this._parseOptions = (original = {}) => {
      const options = { ...original };
      // Do not show edit markers if more than maxMarkers would be shown:
      if (!('maxMarkers' in original)) { options.maxMarkers = 100; }
      if (!('newPolylines' in original)) { options.newPolylines = false; }
      if (!('newPolylineConfirmMessage' in options)) { options.newPolylineConfirmMessage = ''; }
      if (!('addFirstLastPointEvent' in options)) { options.addFirstLastPointEvent = 'click'; }
      if (!('customPointListeners' in options)) { options.customPointListeners = {}; }
      if (!('customNewPointListeners' in options)) { options.customNewPointListeners = {}; }

      this._options = options;

      // Icons:
      if (!options.pointIcon) {
        this._options.pointIcon = L.divIcon({
          className: 'leaflet-vertex-icon',
          iconSize: [11, 11],
          iconAnchor: [6, 6]
        });
      }
      // this._options.pointIcon = L.icon({
      //   iconUrl: '../static/img/editmarker.png', iconSize: [11, 11], iconAnchor: [6, 6]
      // });
      if (!options.newPointIcon) {
        this._options.newPointIcon = L.divIcon({
          className: 'leaflet-middle-icon',
          iconSize: [11, 11],
          iconAnchor: [6, 6]
        });
      }
      // this._options.newPointIcon = L.icon({
      //   iconUrl: '../static/img/editmarker2.png', iconSize: [11, 11], iconAnchor: [6, 6]
      // });
    };

    /**
     * Show only markers in current map bounds *is* there are only a certain
     * number of markers. This method is called on eventy that change map
     * bounds.
     */
    this._showBoundMarkers = () => {
      if (!this._map) {
        return;
      }

      this._setBusy(false);

      if (!this._editablePolylinesEnabled) return;

      const bounds = this._map.getBounds();
      let found = 0;

      // todo: optimise this FUCK THIS
      for (let polylineNo in this._map._editablePolylines) {
        const polyline = this._map._editablePolylines[polylineNo];

        for (let markerNo in polyline._markers) {
          const marker = polyline._markers[markerNo];
          if (bounds.contains(marker.getLatLng())) { found += 1; }
        }
      }

      if (found < that._options.maxMarkers) {
        // console.log('shown'); // todo: onHide
      } else {
        // console.log('hidden'); // todo: onShow
      }

      // todo: optimise this
      for (const polylineNo in that._map._editablePolylines) {
        const polyline = that._map._editablePolylines[polylineNo];

        for (const markerNo in polyline._markers) {
          const marker = polyline._markers[markerNo];

          if (found < that._options.maxMarkers) {
            that._setMarkerVisible(marker, bounds.contains(marker.getLatLng()));
            that._setMarkerVisible(marker.newPointMarker, markerNo > 0 && bounds.contains(marker.getLatLng()));
          } else {
            that._setMarkerVisible(marker, false);
            that._setMarkerVisible(marker.newPointMarker, false);
          }
        }
      }
    };

    this._hideAllMarkers = () => {
      this._markers.map(marker => {
        if (marker.newPointMarker) {
          this._map.removeLayer(marker.newPointMarker);
          marker.newPointMarker._visible = false;
        }
        marker._visible = false;
        this._map.removeLayer(marker);
      });
    };

    /**
     * Used when adding/moving points in order to disable the user to mess
     * with other markers (+ easier to decide where to put the point
     * without too many markers).
     */
    this._hideAll = (except) => {
      this._setBusy(true);
      for (const polylineNo in that._map._editablePolylines) {
        const polyline = that._map._editablePolylines[polylineNo];

        for (const markerNo in polyline._markers) {
          const marker = polyline._markers[markerNo];
          if (except == null || except !== marker) {
            polyline._setMarkerVisible(marker, false);
          }
          if (except == null || except !== marker.newPointMarker) {
            polyline._setMarkerVisible(marker.newPointMarker, false);
          }
        }
      }
    };

    /**
     * Show/hide marker.
     */
    this._setMarkerVisible = (marker, show) => {
      if (!marker) { return; }

      const map = this._map;
      if (show) {
        // if (!marker._visible) {
          if (!marker._map) { // First show for this marker:
            marker.addTo(map);
          } else { // Marker was already shown and hidden:
            map.addLayer(marker);
          }
          marker._map = map;
        // }
        marker._visible = true;
      } else {
        // if (marker._visible) {
          map.removeLayer(marker);
        // }
        marker._visible = false;
      }
    };

    this.setPoints = latlngs => {
      this.setLatLngs(latlngs);

      this._hideAllMarkers();
      this._markers = [];

      for (let i = 0; i < latlngs.length; i += 1) {
        this._addMarkers(i, latlngs[i]);
      }

      this._reloadPolyline();

      if (this._options.onPointsSet) this._options.onPointsSet(latlngs);
    };

    /**
     * Reload polyline. If it is busy, then the bound markers will not be
     * shown.
     */
    this._reloadPolyline = fixAroundPointNo => {
      this.setLatLngs(this._getMarkerLatLngs());

      if (fixAroundPointNo != null) this._fixAround(fixAroundPointNo);

      if (this._editablePolylinesEnabled) {
        this._showBoundMarkers();
      } else {
        this._hideAllMarkers();
      }

      this._changed = true;
    };

    this._onMarkerDrag = (event) => {
      // if (this.constr.is_drawing) {
      //   this._map.off('click', this._addFirstPoint);
      //   this._map.off('click', this._addPointForward);
      // }

      if (this._options.onMarkerDragStart) this._options.onMarkerDragStart(event);

      if (this.constr.line1) that._map.removeLayer(this.constr.line1);
      if (this.constr.line2) that._map.removeLayer(this.constr.line2);

      const marker = event.target;
      const point = that._getPointNo(event.target);
      const previousPoint = point && point > 0 ? that._markers[point - 1].getLatLng() : null;
      const nextPoint = point < that._markers.length - 1 ? that._markers[point + 1].getLatLng() : null;

      this._setupDragLines(marker, previousPoint, nextPoint);
      this._hideAll(marker);
    };

    this._onMarkerDrop = event => {
      const point = that._getPointNo(event.target);
      // setTimeout(() => {
      this._reloadPolyline(point);

      if (this._options.onMarkerDragEnd) this._options.onMarkerDragEnd(event);
      //
      // if (this.constr.is_drawing) {
      //   setTimeout(this._prepareForNewPoint.bind(this), 25);
      // }
      // }, 25);
    };
    /**
     * Add two markers (a point marker and his newPointMarker) for a
     * single point.
     *
     * Markers are not added on the map here, the marker.addTo(map) is called
     * only later when needed first time because of performance issues.
     */
    this._addMarkers = (pointNo, latLng, fixNeighbourPositions) => {
      const points = this.getLatLngs();
      const marker = L.marker(latLng, { draggable: true, icon: this._options.pointIcon });

      marker.newPointMarker = null;

      marker.on('dragstart', this._onMarkerDrag);
      marker.on('dragend', this._onMarkerDrop);

      marker.on('contextmenu', (event) => {
        const _marker = event.target;
        const _pointNo = this._getPointNo(event.target);

        if (!this._markers || this._markers.length <= 2) return;
        if (this.constr.is_drawing) return;

        this._map.removeLayer(_marker);
        // that._map.removeLayer(newPointMarker);

        this._markers.splice(_pointNo, 1);
        this._reloadPolyline(_pointNo);

        if (this._options.onPointAdded) this._options.onPointAdded(event, 'dropped');
      });

      // marker.on(that._options.addFirstLastPointEvent, (event) => {
      //   console.log('click on marker');
      //   const point = that._getPointNo(event.target);
      //   console.log(`pointNo=${point} that._markers.length=${that._markers.length}`);
      //
      //   if (pointNo === 0 || pointNo === that._markers.length - 1) {
      //     console.log('first or last');
      //     that._prepareForNewPoint(event.target, point === 0 ? 0 : point + 1);
      //   } else {
      //     console.log('not first or last');
      //   }
      // });

      // User-defined custom event listeners:
      if (that._options.customPointListeners) {
        for (let eventName in that._options.customPointListeners) {
          marker.on(eventName, that._options.customPointListeners[eventName]);
        }
      }
      if (that._options.customNewPointListeners) {
        for (let eventName in that._options.customNewPointListeners) {
          newPointMarker.on(eventName, that._options.customNewPointListeners[eventName]);
        }
      }

      // exit if its first marker
      if (!this._markers || this._markers.length === 0 || points.length === 0) {
        this._markers.push(marker);
        return marker;
      }

      const previousPoint = points[pointNo === 0 ? pointNo : pointNo - 1];
      const newPointMarker = L.marker(
        [
          (latLng.lat + previousPoint.lat) / 2.0,
          (latLng.lng + previousPoint.lng) / 2.0
        ],
        {
          draggable: true,
          icon: this._options.newPointIcon
        }
      );

      marker.newPointMarker = newPointMarker;

      newPointMarker.on('dragstart', (event) => {
        this._clearDragLines();
        const point = that._getPointNo(event.target);
        const previous = that._markers[point - 1].getLatLng();
        const next = that._markers[point].getLatLng();
        this._setupDragLines(marker.newPointMarker, previous, next);

        this._hideAll(marker.newPointMarker);
      });

      newPointMarker.on('dragend', (event) => {
        const marker = event.target;
        const pointNo = that._getPointNo(event.target);
        this._addMarkers(pointNo, marker.getLatLng(), true);

        // setTimeout(() => {
        this._reloadPolyline();
        if (this._options.onPointAdded) this._options.onPointAdded(event, 'added');
        // }, 25);
      });

      // newPointMarker.on('contextmenu', (event) => {
      //   // 1. Remove this polyline from map
      //   var marker = event.target;
      //   const pointNo = that._getPointNo(marker);
      //   const markers = that.getPoints();
      //   that._hideAll();
      //
      //   const secondPartMarkers = that._markers.slice(pointNo, pointNo.length);
      //   that._markers.splice(pointNo, that._markers.length - pointNo);
      //
      //   that._reloadPolyline();
      //
      //   const points = [];
      //   const contexts = [];
      //   for (let i = 0; i < secondPartMarkers.length; i += 1) {
      //     const item = secondPartMarkers[i];
      //     points.push(item.getLatLng());
      //     contexts.push(item.context);
      //   }
      //
      //   // Need to know the current polyline order numbers, because
      //   // the splitted one need to be inserted immediately after:
      //   const originalPolylineNo = that._map._editablePolylines.indexOf(that);
      //
      //   L.Polyline.PolylineEditor(points, that._options, contexts, originalPolylineNo + 1)
      //     .addTo(that._map);
      //
      //   that._showBoundMarkers();
      // });

      this._markers.splice(pointNo, 0, marker);

      if (fixNeighbourPositions) {
        this._fixAround(pointNo);
      }

      return marker;
    };
    //
    // this._addNewPoint = pointNo => event => {
    //   // if (that._markers.length === 1) {
    //   //   pointNo += 1;
    //   // }
    //   //
    //   that._addMarkers(pointNo, event.latlng, true);
    //   that._reloadPolyline();
    //
    //   if (pointNo === 0) {
    //     this._prepareForNewPoint(this._markers[0], 0);
    //   } else {
    //     this._prepareForNewPoint(this._markers[this._markers.length - 1], (this._markers.length));
    //   }
    // };

    this._addFirstPoint = event => {
      this._addMarkers(0, event.latlng, true);
      this._map.setEditablePolylinesEnabled(true);
      this._reloadPolyline();

      this._map.off('click', this._addFirstPoint);
      this._prepareForNewPoint(this._markers[0], 0);
    };

    this._addPointForward = event => {
      if (event.sourceTarget && typeof event.sourceTarget._moved === 'boolean' && event.sourceTarget._moved) {
        // prevent from adding markers after drag
        this._map.off('click', this._addPointForward);
        this._clearDragLines();

        setTimeout(this._prepareForNewPoint.bind(this), 25);
        return;
      }

      if (this._options.onPointAdded) this._options.onPointAdded(event);

      const pointNo = (this._markers && this._markers.length) || 0;

      this._addMarkers(pointNo, event.latlng, true);
      this._reloadPolyline();

      this._map.off('click', this._addPointForward);

      setTimeout(this._prepareForNewPoint.bind(this), 25);
    };

    /**
     * Event handlers for first and last point.
     */
    this._prepareForNewPoint = target => {
      if (this._options.onContinueDrawing) this._options.onContinueDrawing();

      const marker = target || this._markers[this._markers.length - 1];
      this._setupDragLines(marker, marker.getLatLng());

      this._map.on('click', this._addPointForward);
    };

    /**
     * Fix nearby new point markers when the new point is created.
     */
    this._fixAround = pointNoOrMarker => {
      const pointNo = (typeof pointNoOrMarker) === 'number'
        ? pointNoOrMarker
        : this._markers.indexOf(pointNoOrMarker);

      if (pointNo < 0) { return; }

      const previousMarker = pointNo === 0 ? null : this._markers[pointNo - 1];
      const marker = this._markers[pointNo];
      const nextMarker = pointNo < that._markers.length - 1 ? this._markers[pointNo + 1] : null;

      if (marker && previousMarker) {
        marker.newPointMarker.setLatLng([
          (previousMarker.getLatLng().lat + marker.getLatLng().lat) / 2.0,
          (previousMarker.getLatLng().lng + marker.getLatLng().lng) / 2.0
        ]);
      }
      if (marker && nextMarker) {
        nextMarker.newPointMarker.setLatLng([
          (marker.getLatLng().lat + nextMarker.getLatLng().lat) / 2.0,
          (marker.getLatLng().lng + nextMarker.getLatLng().lng) / 2.0
        ]);
      }
    };

    /**
     * Find the order number of the marker.
     */
    this._getPointNo = (marker) => {
      for (let i = 0; i < this._markers.length; i += 1) {
        if (marker === this._markers[i] || marker === this._markers[i].newPointMarker) {
          return i;
        }
      }
      return -1;
    };

    /**
     * Get polyline latLngs based on marker positions.
     */
    this._getMarkerLatLngs = () => this._markers.map(marker => marker.getLatLng());

    this._moveDragLines = event => {
      if (this.constr.line1) { this.constr.line1.setLatLngs([event.latlng, this.constr.point1]); }
      if (this.constr.line2) { this.constr.line2.setLatLngs([event.latlng, this.constr.point2]); }
    };

    this._clearDragLines = event => {
      if (that._map && this.constr.is_drawing) {
        if (this.constr.line1) that._map.removeLayer(this.constr.line1);
        if (this.constr.line2) that._map.removeLayer(this.constr.line2);
        that._map.off('mousemove', this._moveDragLines);
        that._map.off('click', this._clearDragLines);
        this.constr.marker.off('click', this._clearDragLines);
        this.constr.marker.off('dragend', this._clearDragLines);

        this.constr.is_drawing = false;

        if (event && event.target !== that._map) {
          that._map.fire('click', event);
        }
      }
    };

    this._setupDragLines = (marker, point1, point2) => {
      this.constr.line1 = null;
      this.constr.line2 = null;
      this.constr.point1 = point1;
      this.constr.point2 = point2;
      this.constr.marker = marker;
      this.constr.is_drawing = true;

      if (point1) {
        this.constr.line1 = L.polyline([marker.getLatLng(), this.constr.point1], this.constrLineStyle)
          .addTo(that._map);
      }

      if (point2) {
        this.constr.line2 = L.polyline([marker.getLatLng(), this.constr.point2], this.constrLineStyle)
          .addTo(that._map);
      }

      that._map.on('mousemove', this._moveDragLines);
      that._map.on('click', this._clearDragLines);
      this.constr.marker.on('dragend', this._clearDragLines);
      this.constr.marker.on('click', this._clearDragLines);
      if (this.constr.line1) this.constr.line1.on('click', this._clearDragLines);
      if (this.constr.line2) this.constr.line2.on('click', this._clearDragLines);
    };
  }
});

L.Polyline.polylineEditor.addInitHook(function () {
  this.on('add', function (event) {
    this._map = event.target._map;
    this._addMethods();

    /**
     * When addint a new point we must disable the user to mess with other
     * markers. One way is to check everywhere if the user is busy. The
     * other is to just remove other markers when the user is doing
     * somethinng.
     *
     * TODO: Decide the right way to do this and then leave only _busy or
     * _hideAll().
     */
    this._busy = false;
    this._initialized = false;

    this._init(this._options, this._contexts);

    this._initialized = true;

    return this;
  });

  this.on('remove', (event) => {
    const polyline = event.target;
    const map = polyline._map;
    const polylines = map.getEditablePolylines();
    const index = polylines.indexOf(polyline);
    if (index > -1) {
      polylines[index]._markers.forEach((marker) => {
        map.removeLayer(marker);
        if (marker.newPointMarker) { map.removeLayer(marker.newPointMarker); }
      });
      polylines.splice(index, 1);
    }
  });
});

/**
 * Construct a new editable polyline.
 *
 * latlngs    ... a list of points (or two-element tuples with coordinates)
 * options    ... polyline options
 * contexts   ... custom contexts for every point in the polyline. Must have the
 *                same number of elements as latlngs and this data will be
 *                preserved when new points are added or polylines splitted.
 * polylineNo ... insert this polyline in a specific order (used when splitting).
 *
 * More about contexts:
 * This is an array of objects that will be kept as "context" for every
 * point. Marker will keep this value as marker.context. New markers will
 * have context set to null.
 *
 * Contexts must be the same size as the polyline size!
 *
 * By default, even without calling this method -- every marker will have
 * context with one value: marker.context.originalPointNo with the
 * original order number of this point. The order may change if some
 * markers before this one are delted or new added.
 */
L.Polyline.PolylineEditor = (latlngs, options, contexts, polylineNo) => {
  // Since the app code may not be able to explicitly call the
  // initialization of all editable polylines (if the user created a new
  // one by splitting an existing), with this method you can control the
  // options for new polylines:
  if (options.prepareOptions) {
    options.prepareOptions(options);
  }

  const result = new L.Polyline.polylineEditor(latlngs, options);
  result._options = options;
  result._contexts = contexts;
  result._desiredPolylineNo = polylineNo;

  return result;
};
