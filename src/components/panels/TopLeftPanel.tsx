// flow
import * as React from 'react';
import { UserLocation } from '$components/UserLocation';
import { DistanceBar } from '$components/panels/DistanceBar';
import { Tooltip } from "$components/panels/Tooltip";

export const TopLeftPanel = () => (
  <div className="status-panel top left">
    <UserLocation />
    <DistanceBar />
  </div>
);
