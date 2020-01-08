import React from 'react';
import { APP_INFO } from '~/constants/app_info';
import { userLogout } from "~/redux/user/actions";

interface Props {
  userLogout: typeof userLogout,
  openAppInfoDialog: () => void,
}

export const UserMenu = ({ userLogout, openAppInfoDialog }: Props) => (
  <div className="user-panel-menu">
    <div className="user-panel-title">
      ORCHID
      <br />
      MAP
      <span className="user-panel-ver">
        - {(APP_INFO.VERSION || 1)}.{(Object.keys(APP_INFO.CHANGELOG).length || 0)}
      </span>
    </div>
    <div className="user-panel-item" onClick={openAppInfoDialog}>
      О редакторе карт
    </div>
    <div className="user-panel-item" onClick={userLogout}>
      Выйти
    </div>
  </div>
);

/*
  <div className="user-panel-text small">
    <div>Мы храним следующие данные о вас:</div>
    { id && <div><u>ID:</u> {id}</div> }
    { agent && <div><u>Браузер:</u> {agent}</div> }
    { ip && <div><u>Адрес:</u> {ip}</div> }
    <div>Мы используем их для авторизации и исправления ошибок.</div>
  </div>
 */
