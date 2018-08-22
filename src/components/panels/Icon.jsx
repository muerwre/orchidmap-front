import React from 'react';
import sprite from '$sprites/icon.svg';

export const Icon = ({ icon, size = 32 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32">
    <use xlinkHref={`${sprite}#${icon}`} x={0} y={0} />
  </svg>
);

