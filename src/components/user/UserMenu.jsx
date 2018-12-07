import React from 'react';
import { CLIENT } from '$config/frontend';

type Props = {
  userLogout: Function,
}

export const UserMenu = ({ userLogout }: Props) => (
  <div className="user-panel-menu">
    <div className="user-panel-title">
      ORCHID
      <br />
      MAP
      <span className="user-panel-ver">
        - { CLIENT.VER }
      </span>
    </div>
    <a className="user-panel-item" href="https://github.com/muerwre/orchidMap" target="_blank" rel="noopener noreferrer">
      Проект на github
    </a>
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
