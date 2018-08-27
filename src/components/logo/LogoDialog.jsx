import React from 'react';
import { LOGOS } from '$constants/logos';
import { Icon } from '$components/panels/Icon';
import classnames from 'classnames';

export class LogoDialog extends React.Component {
  changeLogo = logo => {
    this.props.editor.changeLogo(logo);
  };

  render() {
    return (
      <div className="helper logo-helper">
        <div className="helper-back">
          <Icon icon="icon-logo" size={200} />
        </div>
        {
          Object.keys(LOGOS).map(logo => (
            <div
              className={classnames('helper-menu-item', { active: (logo === this.props.logo) })}
              onClick={() => this.changeLogo(logo)}
              key={logo}
            >
              {LOGOS[logo][0]}
            </div>
          ))
        }
      </div>
    );
  }
}
