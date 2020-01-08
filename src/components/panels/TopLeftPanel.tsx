import React from 'react';
import { UserLocation } from '$components/UserLocation';
import { DistanceBar } from '$components/panels/DistanceBar';

export const TopLeftPanel = () => (
  <div className="status-panel top left">
    <UserLocation />
    <DistanceBar />
  </div>
);
