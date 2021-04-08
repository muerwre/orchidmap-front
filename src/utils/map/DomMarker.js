import { DivIcon } from 'leaflet';

export const DomMarker = DivIcon.extend({
  initialize: function (options: any) {
    this.options = options;
  },

  options: {
    element: null // a initialized DOM element
    // same options as divIcon except for html
  },

  createIcon: function() {
    const { html, element, className } = this.options;

    this._setIconStyles(element, 'icon');

    return element;
  }
});

