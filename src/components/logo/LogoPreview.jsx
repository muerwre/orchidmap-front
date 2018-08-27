import React from 'react';
import { LOGOS } from '$constants/logos';

export const LogoPreview = ({ logo }) => (
  <div
    className="logo-preview"
    style={{
      backgroundImage: logo
        ? `url(${LOGOS[logo][1]})`
        : 'none'
    }}
  />
);
