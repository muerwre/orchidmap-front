import React from 'react';
import { PROVIDERS, replaceProviderUrl } from '$constants/providers';
import { Icon } from '$components/panels/Icon';
import classnames from 'classnames';

type Props = {
  changeProvider: Function,
  provider: String,
};

export const ProviderDialog = ({ provider, changeProvider }: Props) => (
  <div className="control-dialog top right control-dialog-provider">
    <div className="helper provider-helper">
      {
        Object.keys(PROVIDERS).map(item => (
          <div
            className={classnames('provider-helper-thumb', { active: provider === item })}
            style={{
              backgroundImage: `url(${replaceProviderUrl(item, { x: 5980, y: 2589, zoom: 13 })})`,
            }}
            onMouseDown={() => changeProvider(item)}
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
