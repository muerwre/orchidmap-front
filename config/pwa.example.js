const path = require('path');

module.exports = {
  MANIFEST: (src) => ({
    name: 'Редактор маршрутов',
    short_name: 'Маршруты',
    description: 'Велосипедные маршруты в новосибирске',
    background_color: '#333333',
    theme_color: '#01579b',
    display: 'fullscreen',
    'theme-color': '#01579b',
    start_url: '/',
    icons: [
      {
        src, // : path.resolve('./src/sprites/app.png')
        sizes: [96, 128, 192, 256, 384, 512],
        destination: path.join('assets', 'icons')
      }
    ]
  }),
  PUBLIC_PATH: 'https://alpha-map.vault48.org/',
};
