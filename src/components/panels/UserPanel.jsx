import React from 'react';

import { GuestButton } from '$components/user/GuestButton';
import { SERVER } from '$constants/api';
import { DEFAULT_USER, ROLES } from '$constants/auth';
import { UserButton } from '$components/user/UserButton';
import { UserMenu } from '$components/user/UserMenu';
import { setUser, userLogout, takeAShot } from '$redux/user/actions';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import type { UserType } from '$constants/types';
import { Icon } from '$components/panels/Icon';

type Props = {
  user: UserType,
  userLogout: Function,
  setUser: Function,
  takeAShot: Function,
};

export class Component extends React.PureComponent<Props, void> {
  state = {
    menuOpened: false,
  };

  componentDidMount() {
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

      this.setState({ menuOpened: false });
      this.props.setUser(user);
    });
  }

  setMenuOpened = () => this.setState({ menuOpened: !this.state.menuOpened });

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
      props: { user },
      state: { menuOpened },
    } = this;

    return (
      <div>
        <div className="panel active">
          <div className="user-panel">
            {
              !user || user.role === ROLES.guest
              ? <GuestButton onClick={this.openOauthFrame} />
              : <UserButton user={user} setMenuOpened={this.setMenuOpened} />
            }
            {
              (user && user.role && user.role !== 'guest' && menuOpened) &&
              <UserMenu user={user} userLogout={this.props.userLogout} />
            }
          </div>

          <div className="control-sep" />

          <div className="control-bar">
            <button
              onClick={this.props.takeAShot}
            >
              <Icon icon="icon-shot-2" />
            </button>
          </div>
        </div>
      </div>
    );
  }
}


const mapStateToProps = ({ user: { user } }) => ({ user });
const mapDispatchToProps = dispatch => bindActionCreators({ setUser, userLogout, takeAShot }, dispatch);

export const UserPanel = connect(mapStateToProps, mapDispatchToProps)(Component);
