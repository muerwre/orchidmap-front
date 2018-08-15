import L from 'leaflet';

export const DomMarker = L.DivIcon.extend({
  initialize: function (options) {
    this.options = options;
  },

  options: {
    element: null // a initialized DOM element
    // same options as divIcon except for html
  },

  createIcon: function() {
    const { html, element } = this.options;

    this._setIconStyles(element, 'icon');

    return element;
  }
});

