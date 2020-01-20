import React, { FC, useCallback } from 'react';
import { IState } from '~/redux/store';
import { selectUserLocation } from '~/redux/user/selectors';
import { connect } from 'react-redux';
import { Tooltip } from './panels/Tooltip';
import { MainMap } from '~/constants/map';

const mapStateToProps = (state: IState) => ({
  location: selectUserLocation(state),
});

type Props = ReturnType<typeof mapStateToProps> & {};

const UserLocationUnconnected: FC<Props> = ({ location }) => {
  const onClick = useCallback(() => {
    if (!location) return;

    MainMap.setView(location, 17);
  }, [MainMap, location]);

  return (
    <div className="status-bar location-bar pointer tooltip-container" onClick={onClick}>
      <Tooltip position="top">Где&nbsp;я?</Tooltip>

      <svg width="20" height="20" viewBox="0 0 20 20" style={{ opacity: location ? 1 : 0.5 }}>
        <g transform="translate(7 2)">
          <circle r="1.846" cy="1.846" cx="5.088" />
          <path d="M3.004 4.326h4l2-3 1 1-3 4v10h-1l-1-7-1 7h-1v-10s-3.125-4-3-4l1-1z" />
          <ellipse ry="1" rx="4" cy="16.326" cx="5.004" opacity=".262" fill="black" />
        </g>
      </svg>
    </div>
  );
};

export const UserLocation = connect(mapStateToProps)(UserLocationUnconnected);
