import React from 'react';
import { Scrollbars } from 'tt-react-custom-scrollbars';

export const Scroll = props => (
  // renderTrackVertical={props => <div {...props} className="track-vertical"/>}
  <Scrollbars
    renderTrackHorizontal={prop => <div {...prop} className="track-horizontal" />}
    renderTrackVertical={prop => <div {...prop} className="track-vertical" />}
    renderThumbHorizontal={prop => <div {...prop} className="thumb-horizontal" />}
    renderThumbVertical={prop => <div {...prop} className="thumb-vertical" />}
    {...props}
  >
    {props.children}
  </Scrollbars>
);
