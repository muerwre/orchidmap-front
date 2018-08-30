/*
  functions to parse old maps data
 */

export const parseStickerAngle = ({ sticker, version }) => {
  console.log('stick', sticker, version);
  return sticker && version && parseInt(version, 10) === 2
    ? parseFloat(sticker.angle)
    : parseFloat(sticker.ang - 3.14);
};

export const parseStickerStyle = ({ sticker, version }) => (
  sticker && version && parseInt(version, 10) === 2
    ? sticker.sticker
    : 'basic'
);
