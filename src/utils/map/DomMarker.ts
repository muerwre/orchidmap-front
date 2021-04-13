import { DivIcon, DivIconOptions } from 'leaflet';
//
// export const DomMarker = DivIcon.extend({
//   initialize: function (options) {
//     this.options = options;
//   },
//
//   options: {
//     element: null // a initialized DOM element
//     // same options as divIcon except for html
//   },
//
//   createIcon: function() {
//     const { element } = this.options;
//
//     this._setIconStyles(element, 'icon');
//
//     return element;
//   }
// });

export interface DomMarkerProps extends DivIconOptions {
  element: HTMLElement
}

export class DomMarker extends DivIcon {
  element: HTMLElement

  constructor({ element, ...props }: DomMarkerProps) {
    super(props);
    this.element = element;
  }

  createIcon(oldicon?: HTMLElement) {
    this.element.classList.add('icon')

    if (this.options.className) {
      this.element.classList.add(this.options.className);
    }
    return this.element;
  }
}
