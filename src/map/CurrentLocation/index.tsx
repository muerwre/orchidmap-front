import React, { FC, useState, useEffect, useCallback } from 'react';
import { LatLngLiteral, marker, Marker, DivIcon } from 'leaflet';
import { MainMap } from '~/constants/map';

interface IProps {
  location: LatLngLiteral;
}

const CurrentLocation: FC<IProps> = ({ location }) => {
  const zoomToLocation = useCallback(({ latlng }) => MainMap.setView(latlng, 17), [MainMap]);

  useEffect(() => {
    if (!location) return;

    const item = new Marker(location, {
      icon: new DivIcon({
        html: `
          <div class="current-location">
            <svg width="28" height="28" viewBox="0 0 20 20">
              <g transform="translate(5 0)">
                <circle r="1.846" cy="1.846" cx="5.088"/>
                <path d="M3.004 4.326h4l2-3 1 1-3 4v10h-1l-1-7-1 7h-1v-10s-3.125-4-3-4l1-1z"/>
                <ellipse ry="1" rx="4" cy="16.326" cx="5.004" opacity=".262" fill="black" />    
              </g>
            </svg>
          </div>
        `,
      }),
    })
      .on('click', zoomToLocation)
      .addTo(MainMap);

    return () => item.removeFrom(MainMap);
  }, [MainMap, location, zoomToLocation]);

  return null;
};

export { CurrentLocation };
