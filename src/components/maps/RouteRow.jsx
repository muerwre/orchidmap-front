// @flow
import React from 'react';
import { Icon } from '$components/panels/Icon';
import { pushPath } from '$utils/history';

type Props = {
  title: String,
  distance: Number,
  created_at: String,
  _id: String,
  editing: Boolean,
};

export const RouteRow = ({
  title, distance, created_at, _id, editing
}: Props) => (
  <div
    className="route-row"
    onClick={() => pushPath(`/${_id}/${editing ? 'edit' : ''}`)}
  >
    <div className="route-title">
      {title || _id}
    </div>
    <div className="route-description">
      <span>
        <Icon icon="icon-link-1" />
        {_id}
      </span>
    </div>
    <div className="route-description">
      <span>
        <Icon icon="icon-cycle-1" />
        {(distance && `${distance} km`) || '0 km'}
      </span>
    </div>

  </div>
);
