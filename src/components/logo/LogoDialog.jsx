import React from 'react';
import { LOGOS } from '$constants/logos';
import { Icon } from '$components/panels/Icon';
import classnames from 'classnames';

type Props = {
  logo: String,
  setLogo: Function,
}

export const LogoDialog = ({ logo, setLogo }: Props)  => (
  <div className="helper logo-helper">
    <div className="helper-back">
      <Icon icon="icon-logo" size={200} />
    </div>
    {
      Object.keys(LOGOS).map(item => (
        <div
          className={classnames('helper-menu-item', { active: (item === logo) })}
          onClick={() => setLogo(item)}
          key={item}
        >
          {LOGOS[item][0]}
        </div>
      ))
    }
  </div>
);
