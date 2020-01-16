import React, { PureComponent } from 'react';

import { GuestButton } from '~/components/user/GuestButton';
import { DEFAULT_USER, ROLES } from '~/constants/auth';
import { UserButton } from '~/components/user/UserButton';
import { UserMenu } from '~/components/user/UserMenu';
import { setUser, userLogout, gotVkUser, openMapDialog } from '~/redux/user/actions';
import {
  editorTakeAShot,
  editorSetDialog,
  editorSetDialogActive,
  editorGetGPXTrack,
} from '~/redux/editor/actions';
import { connect } from 'react-redux';
import { Icon } from '~/components/panels/Icon';

import classnames from 'classnames';
import { CLIENT } from '~/config/frontend';
import { DIALOGS, TABS } from '~/constants/dialogs';
import { Tooltip } from '~/components/panels/Tooltip';
import { TitleDialog } from '~/components/dialogs/TitleDialog';

const mapStateToProps = ({
  user: { user },
  editor: { dialog, dialog_active },
  map: { route, stickers },
}) => ({
  editor: {
    dialog,
    dialog_active,
  },
  user: { user },
  map: {
    route,
    stickers,
  }
});

const mapDispatchToProps = {
  setUser,
  userLogout,
  editorTakeAShot,
  editorSetDialog,
  gotVkUser,
  editorSetDialogActive,
  openMapDialog,
  editorGetGPXTrack,
};

type Props = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps & {};

interface State {
  menuOpened: boolean;
}

export class UserPanelUnconnected extends PureComponent<Props, State> {
  state = {
    menuOpened: false,
  };

  componentDidMount() {
    window.addEventListener('message', e => {
      const { data } = e;

      if (
        !data ||
        !data.type ||
        data.type !== 'oauth_login' ||
        !data.user ||
        !data.user.id ||
        !data.user.token
      )
        return;

      const { id, token, role = 'vk', name = '', ip = '', photo = '', agent = '' } = data.user;

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
        },
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
    this.props.editorSetDialog(DIALOGS.APP_INFO);
    this.props.editorSetDialogActive(this.props.editor.dialog !== DIALOGS.APP_INFO);
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
      props: { user: { user }, editor: { dialog, dialog_active }, map: { route, stickers } },
      state: { menuOpened },
    } = this;

    const is_empty = !route.length && !stickers.length;

    return (
      <div>
        <TitleDialog />

        <div className="panel active panel-user">
          <div className="user-panel">
            {!user || user.role === ROLES.guest ? (
              <GuestButton onClick={this.openOauthFrame} />
            ) : (
              <UserButton user={user} setMenuOpened={this.setMenuOpened} />
            )}
            {user && user.role && user.role !== 'guest' && menuOpened && (
              <UserMenu
                userLogout={this.props.userLogout}
                openAppInfoDialog={this.openAppInfoDialog}
              />
            )}
          </div>

          <div className="control-sep" />

          <div className="control-bar">
            <button
              className={classnames({
                active: dialog_active && dialog === DIALOGS.MAP_LIST,
              })}
              onClick={this.openMapsDialog}
            >
              <Tooltip>Каталог маршрутов</Tooltip>
              <Icon icon="icon-folder-1" />
            </button>
          </div>

          <div className="control-sep" />

          <div className="control-bar">
            <button className={classnames({ active: false })} onClick={this.props.editorTakeAShot}>
              <Tooltip>Снимок карты</Tooltip>
              <Icon icon="icon-shot-4" />
            </button>
          </div>

          {!is_empty && (
            <React.Fragment>
              <div className="control-sep" />

              <div className="control-bar">
                <button
                  className={classnames({ active: false })}
                  onClick={this.props.editorGetGPXTrack}
                >
                  <Tooltip>Экспорт GPX</Tooltip>
                  <Icon icon="icon-gpx-1" />
                </button>
              </div>
            </React.Fragment>
          )}
        </div>
      </div>
    );
  }
}

const UserPanel = connect(mapStateToProps, mapDispatchToProps)(UserPanelUnconnected);

export { UserPanel };
