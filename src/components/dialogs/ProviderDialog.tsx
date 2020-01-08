import * as React from 'react';
import { PROVIDERS, replaceProviderUrl } from '$constants/providers';
import { Icon } from '$components/panels/Icon';
import classnames from 'classnames';
import * as MAP_ACTIONS from "$redux/map/actions";
import { IRootState } from "$redux/user";

interface Props extends IRootState {
  mapSetProvider: typeof MAP_ACTIONS.mapSetProvider,
}

export const ProviderDialog = ({ provider, mapSetProvider }: Props) => (
  <div className="control-dialog top right control-dialog-provider">
    <div className="helper provider-helper">
      {
        Object.keys(PROVIDERS).map(item => (
          <div
            className={classnames('provider-helper-thumb', { active: provider === item })}
            style={{
              backgroundImage: `url(${replaceProviderUrl(item, { x: 5980, y: 2589, zoom: 13 })})`,
            }}
            onMouseDown={() => mapSetProvider(item)}
            key={PROVIDERS[item].name}
          >
            {
              provider === item &&
                <div className="provider-helper-check">
                  <Icon icon="icon-check-1" />
                </div>
            }
          </div>
        ))
      }
    </div>
  </div>
);
