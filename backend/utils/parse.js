module.exports.parseRoute = route => route.filter(el => (
  Object.keys(el).length === 2
  && el.lat
    && parseInt(el.lat, 10) > 0
    && parseInt(el.lat, 10) < 1000
  && el.lng
    && parseInt(el.lng, 10) > 0
    && parseInt(el.lng, 10) < 1000
));

module.exports.parseStickers = stickers => stickers.filter(el => (
  Object.keys(el).length === 5
  && el.latlng
    && Object.keys(el.latlng).length === 2
      && el.latlng.lat
        && parseInt(el.latlng.lat, 10) > 0
        && parseInt(el.latlng.lat, 10) < 1000
      && el.latlng.lng
        && parseInt(el.latlng.lng, 10) > 0
        && parseInt(el.latlng.lng, 10) < 1000
));
// .map(el => ((el.text && String(el.text).substr(0, 100)) || ''));

module.exports.parseString = (value, size) => (value && String(value).substr(0, size)) || '';
module.exports.parseNumber = (value, min, max) => (value && Number(value) && Math.min(max, Math.max(min, value))) || 0;
