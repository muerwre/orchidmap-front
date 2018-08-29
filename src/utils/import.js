/*
  functions to parse old maps data
 */

export const parseStickerAngle = ({ angle, format }) => parseFloat((format === 'old' ? angle - 3.14 : angle));

export const parseStickerStyle = ({ style, format }) => (format === 'old' ? 'green' : style);
