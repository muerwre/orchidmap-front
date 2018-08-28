import React from 'react';

import { GuestButton } from '$components/user/GuestButton';
import { SERVER } from '$constants/api';
import { DEFAULT_USER, ROLES } from '$constants/auth';
import { UserButton } from '$components/user/UserButton';
import { Icon } from '$components/panels/Icon';

export class UserPanel extends React.PureComponent {
  componentDidMount() {
    window.doLogin = console.log;

    window.addEventListener('message', e => {
      const { data } = e;

      if (!data || !data.type || data.type !== 'oauth_login' || !data.user || !data.user.id || !data.user.token) return;

      const {
        id, token, role = 'vk', name = '', ip = '', photo = '', agent = '',
      } = data.user;

      const user = {
        ...DEFAULT_USER,
        role,
        id,
        token,
        userdata: {
          name,
          ip,
          agent,
          photo,
        }
      };

      this.props.setUser(user);
    });
  }

  openOauthFrame = () => {
    const width = parseInt(window.innerWidth, 10);
    const height = parseInt(window.innerHeight, 10);
    const top = (height - 370) / 2;
    const left = (width - 700) / 2;

    window.open(
      `https://oauth.vk.com/authorize?client_id=5987644&scope=&redirect_uri=${SERVER}/engine/oauthOrchid.php&response_type=code`,
      'socialPopupWindow',
      `location=no,width=700,height=370,scrollbars=no,top=${top},left=${left},resizable=no`
    );
  };

  render() {
    const {
      user
    } = this.props;

    return (
      <div>
        <div className="panel">
          <div className="control-bar">
            <button
              onClick={this.startShotterMode}
            >
              <Icon icon="icon-poly" />
            </button>
          </div>

          <div className="control-sep" />

          {
            !user || user.role === ROLES.guest
            ? <GuestButton onClick={this.openOauthFrame} />
            : <UserButton user={user} />
          }
        </div>
      </div>
    );
  }
}
