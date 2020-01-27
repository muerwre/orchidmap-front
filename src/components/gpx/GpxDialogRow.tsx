import React, { FC } from 'react';
import { IGpxRoute } from '~/redux/editor';
import { Switch } from '../Switch';
import { Icon } from '../panels/Icon';
import classnames from 'classnames';

interface IProps {
  item: IGpxRoute;
  index: number;
  enabled: boolean;

  onFocusRoute: (i: number) => void;
  onRouteDrop: (i: number) => void;
  onRouteToggle: (i: number) => void;
  onRouteColor: (i: number) => void;
}

const GpxDialogRow: FC<IProps> = ({
  item,
  index,
  enabled,
  onRouteToggle,
  onFocusRoute,
  onRouteDrop,
  onRouteColor,
}) => {
  return (
    <div className={classnames('gpx-row', { 'gpx-row_disabled': !enabled || !item.enabled })}>
      <div
        className="gpx-row__color"
        style={{ backgroundColor: item.color }}
        onClick={() => onRouteColor(index)}
      />

      <div className="gpx-row__title" onClick={() => onFocusRoute(index)}>
        {item.name}
      </div>

      <div className="gpx-row__buttons">
        {false && (
          <div onClick={() => onRouteDrop(index)}>
            <Icon icon="icon-to-poly" size={24} />
          </div>
        )}
        <div onClick={() => onRouteDrop(index)}>
          <Icon icon="icon-trash-6" size={24} />
        </div>
        <div>
          <Switch active={item.enabled} onPress={() => onRouteToggle(index)} />
        </div>
      </div>
    </div>
  );
};

export { GpxDialogRow };
