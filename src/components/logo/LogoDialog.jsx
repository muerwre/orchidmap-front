import React from 'react';
import { LOGOS } from '$constants/logos';
import { Icon } from '$components/panels/Icon';

export class LogoDialog extends React.Component {
  render() {
    return (
      <div className="helper logo-helper">
        <div className="helper-back">
          <Icon icon="icon-logo" size={200} />
        </div>
        {
          Object.keys(LOGOS).map(logo => (
            <div className="helper-menu-item" key={logo}>
              {LOGOS[logo][0]}
            </div>
          ))
        }
      </div>
    );
  }
}
