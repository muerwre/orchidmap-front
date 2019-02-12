export interface ILogos {
  [x: string]: [string, string, string],
}

export const LOGOS = {
  default: ['Без лого', null, 'bottom-right'],
  nvs: ['НВС', require('../sprites/logos/lgo.png'), 'bottom-right'],
  pinmix: ['Пин-Микс', require('../sprites/logos/pin-mix.png'), 'top-right'],
  jolly: ['Пин-Микс + JW', require('../sprites/logos/jw.png'), 'top-right'],
  pedals: ['Усталые Педальки', require('../sprites/logos/pedals.png'), 'bottom-right'],
  rider: ['Райдер', require('../sprites/logos/rider.png'), 'bottom-right'],
  rider_evening: ['Вечерние городские', require('../sprites/logos/rider_evening.png'), 'top-right'],
};

export const DEFAULT_LOGO = 'nvs';
