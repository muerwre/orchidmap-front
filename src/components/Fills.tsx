import React from 'react';

export const Fills = () => (
  <svg>
    <defs>

      <linearGradient id="activeButtonGradient" x1="-20%" x2="50%" y1="0%" y2="140%">
        <stop offset="0%" stopColor="#55ddff" />
        <stop offset="100%" stopColor="#7137c8" />
      </linearGradient>

      <linearGradient id="activePathGradient" x1="0%" x2="0%" y1="0%" y2="100%">
        <stop offset="0%" stopColor="#ff7700" />
        <stop offset="100%" stopColor="#ff3344" />
      </linearGradient>

      <marker
        id="arrow"
        viewBox="0 0 10 10"
        refX="10"
        refY="5"
        markerWidth="3"
        markerHeight="3"
        orient="auto"
      >
        <path d="M0,5a5,5 0 1,0 10,0a5,5 0 1,0 -10,0" fill="#ff3344" />
        <path d="M2.5 2L7.5 5L2.5 8z" fill="#ffffff" fillRule="evenodd" />
      </marker>

      <marker
        id="long-arrow"
        viewBox="0 0 15 15"
        refX="10"
        refY="10"
        markerWidth="5"
        markerHeight="5"
        orient="auto"
      >
        <path d="m 2.625,3.375 h 7.5 L 10.28125,1.609375 13.5,4.25 10.484375,6.921875 10.171875,5.15625 2.625,5.125 Z" fill="#ff3344" fillRule="evenodd" />
      </marker>

      <g id="path-arrow">
        <path d="m 2.625,3.375 h 7.5 L 10.28125,1.609375 13.5,4.25 10.484375,6.921875 10.171875,5.15625 2.625,5.125 Z" fill="#ff3344" fillRule="evenodd" />
      </g>
    </defs>
    <image xlinkHref="/images/stickers-base.svg" width={0} height={0} />
  </svg>
);
