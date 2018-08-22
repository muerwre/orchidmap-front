import React from 'react';
import sprite from '$sprites/icon.svg';

export const Icon = ({ icon, size = 32 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32">
    <defs>
      <mask id={`icon-mask-${icon}`}>
        <use xlinkHref={`${sprite}#${icon}`} x={0} y={0} />
      </mask>
    </defs>
    <rect x="0" y="0" width="32" height="32" stroke="none" mask={`url(#icon-mask-${icon})`} />
  </svg>
);

