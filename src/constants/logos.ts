export interface ILogos {
  [x: string]: [string, string, string],
}

export const LOGOS = {
  default: ['Без лого', null, 'bottom-right'],
  nvs: ['НВС', '/images/logos/lgo.png', 'bottom-right'],
  pinmix: ['Пин-Микс', '/images/logos/pin-mix.png', 'top-right'],
  jolly: ['Пин-Микс + JW', '/images/logos/jw.png', 'top-right'],
  pedals: ['Усталые Педальки', '/images/logos/pedals.png', 'bottom-right'],
  rider: ['Райдер', '/images/logos/rider.png', 'bottom-right'],
  rider_evening: ['Вечерние городские', '/images/logos/rider_evening.png', 'top-right'],
  prokatimsya: ['PRO_КАТИМСЯ?!', '/images/logos/prokatimsya.png', 'top-right'],
};

export const DEFAULT_LOGO = 'nvs';
