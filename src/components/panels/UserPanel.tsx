import * as React from 'react';

import { GuestButton } from '$components/user/GuestButton';
import { DEFAULT_USER, IUser, ROLES } from '$constants/auth';
import { UserButton } from '$components/user/UserButton';
import { UserMenu } from '$components/user/UserMenu';
import { setUser, userLogout, takeAShot, setDialog, gotVkUser, setDialogActive, openMapDialog, getGPXTrack } from '$redux/user/actions';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Icon } from '$components/panels/Icon';

import classnames from 'classnames';
import { CLIENT } from '$config/frontend';
import { DIALOGS, TABS } from '$constants/dialogs';
import { IRootState } from "$redux/user/reducer";
import { Tooltip } from "$components/panels/Tooltip";
import { TitleDialog } from "$components/dialogs/TitleDialog";

interface Props extends IRootState {
  userLogout: typeof userLogout,
  setDialog: typeof setDialog,
  setDialogActive: typeof setDialogActive,
  gotVkUser: typeof gotVkUser,
  takeAShot: typeof takeAShot,
  openMapDialog: typeof openMapDialog,
  getGPXTrack: typeof getGPXTrack,
}

interface State {
  menuOpened: boolean
}

export class Component extends React.PureComponent<Props, State> {
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
      this.props.gotVkUser(user);
    });
  }

  setMenuOpened = () => this.setState({ menuOpened: !this.state.menuOpened });
  openMapsDialog = () => {
    this.props.openMapDialog(TABS.MY);
  };

  openAppInfoDialog = () => {
    this.setMenuOpened();
    this.props.setDialog(DIALOGS.APP_INFO);
    this.props.setDialogActive(this.props.dialog !== DIALOGS.APP_INFO);
  };

  openOauthFrame = () => {
    const width = parseInt(String(window.innerWidth), 10);
    const height = parseInt(String(window.innerHeight), 10);
    const top = (height - 370) / 2;
    const left = (width - 700) / 2;

    window.open(
      `https://oauth.vk.com/authorize?client_id=5987644&scope=&redirect_uri=${CLIENT.API_ADDR}/api/auth/vk`,
      'socialPopupWindow',
      `location=no,width=700,height=370,scrollbars=no,top=${top},left=${left},resizable=no`
    );
  };

  render() {
    const {
      props: { user, dialog, dialog_active, is_empty },
      state: { menuOpened },
    } = this;

    return (
      <div>
        {
          <TitleDialog />
        }
        <div className="panel active panel-user">
          <div className="user-panel">
            {
              !user || user.role === ROLES.guest
              ? <GuestButton onClick={this.openOauthFrame} />
              : <UserButton user={user} setMenuOpened={this.setMenuOpened} />
            }
            {
              (user && user.role && user.role !== 'guest' && menuOpened) &&
                <UserMenu userLogout={this.props.userLogout} openAppInfoDialog={this.openAppInfoDialog} />
            }
          </div>

          <div className="control-sep" />

          <div className="control-bar">
            <button
              className={classnames({
                active: dialog_active && (dialog === DIALOGS.MAP_LIST)
              })}
              onClick={this.openMapsDialog}
            >
              <Tooltip>Каталог маршрутов</Tooltip>
              <Icon icon="icon-folder-1" />
            </button>
          </div>

          <div className="control-sep" />

          <div className="control-bar">
            <button
              className={classnames({ active: false })}
              onClick={this.props.takeAShot}
            >
              <Tooltip>Снимок карты</Tooltip>
              <Icon icon="icon-shot-4" />
            </button>
          </div>
          {
            !is_empty &&
              <React.Fragment>
                <div className="control-sep" />

                <div className="control-bar">
                  <button
                    className={classnames({ active: false })}
                    onClick={this.props.getGPXTrack}
                  >
                    <Tooltip>Экспорт GPX</Tooltip>
                    <Icon icon="icon-gpx-1" />
                  </button>
                </div>
              </React.Fragment>
          }
        </div>
      </div>
    );
  }
}


const mapStateToProps = ({ user: { dialog, dialog_active, user, is_empty } }) => ({ dialog, dialog_active, user, is_empty });
const mapDispatchToProps = dispatch => bindActionCreators({
  setUser,
  userLogout,
  takeAShot,
  setDialog,
  gotVkUser,
  setDialogActive,
  openMapDialog,
  getGPXTrack,
}, dispatch);

export const UserPanel = connect(mapStateToProps, mapDispatchToProps)(Component);
