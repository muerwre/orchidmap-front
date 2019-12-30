import * as React from 'react';
import { LOGOS } from '$constants/logos';
import { Icon } from '$components/panels/Icon';
import classnames from 'classnames';
import * as MAP_ACTIONS from "$redux/map/actions"
import { IMapReducer } from '$redux/map';

interface Props  {
  logo: IMapReducer['logo'],
  mapSetLogo: typeof MAP_ACTIONS.mapSetLogo,
}

export const LogoDialog = ({ logo, mapSetLogo }: Props) => (
  <div className="control-dialog top">
    <div className="helper logo-helper">
      <div className="helper-back">
        <Icon icon="icon-logo" size={200} />
      </div>
      {
        Object.keys(LOGOS).map(item => (
          <div
            className={classnames('helper-menu-item', { active: (item === logo) })}
            onMouseDown={() => mapSetLogo(item)}
            key={item}
          >
            {LOGOS[item][0]}
          </div>
        ))
      }
    </div>
  </div>
);
