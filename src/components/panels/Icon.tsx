import React, { memo } from 'react';

export const Icon = memo(({ icon, size = 32 }: { icon: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 32 32">
    <defs>
      <mask id={`icon-mask-${icon}`}>
        <use xlinkHref={`/images/icon.svg#${icon}`} x={0} y={0} />
      </mask>
    </defs>
    <rect x="0" y="0" width="32" height="32" stroke="none" mask={`url(#icon-mask-${icon})`} />
  </svg>
));
