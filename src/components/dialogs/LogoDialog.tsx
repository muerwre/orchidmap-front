import * as React from 'react';
import { LOGOS } from '$constants/logos';
import { Icon } from '$components/panels/Icon';
import classnames from 'classnames';
import { setLogo as setLogoAction } from "$redux/user/actions";
import { IRootState } from "$redux/user/reducer";

interface Props extends IRootState {
  setLogo: typeof setLogoAction,
}

export const LogoDialog = ({ logo, setLogo }: Props) => (
  <div className="control-dialog top">
    <div className="helper logo-helper">
      <div className="helper-back">
        <Icon icon="icon-logo" size={200} />
      </div>
      {
        Object.keys(LOGOS).map(item => (
          <div
            className={classnames('helper-menu-item', { active: (item === logo) })}
            onMouseDown={() => setLogo(item)}
            key={item}
          >
            {LOGOS[item][0]}
          </div>
        ))
      }
    </div>
  </div>
);
