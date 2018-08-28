import React from 'react';

export const UserMenu = ({ userLogout, user: { id, userdata: { agent, ip } } }) => (
  <div className="user-panel-menu">
    <div className="user-panel-text small">
      <div>Мы храним следующие данные о вас:</div>
      { id && <div><u>ID:</u> {id}</div> }
      { agent && <div><u>Браузер:</u> {agent}</div> }
      { ip && <div><u>Адрес:</u> {ip}</div> }
      <div>Мы используем их для авторизации и исправления ошибок.</div>
    </div>
    <a className="user-panel-item gray" href="https://github.com/muerwre/orchidMap" target="_blank" rel="noopener noreferrer">
      Проект на github
    </a>
    <div className="user-panel-item" onClick={userLogout}>
      Выйти
    </div>
  </div>
);
