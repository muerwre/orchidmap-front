// @flow
import React from 'react';
import { UserPicture } from '$components/user/UserPicture';
import type { UserType } from '$constants/types';

type Props = {
  user: UserType,
  setMenuOpened: Function,
};

const getUserName = name => name.split(' ')[0];

export const UserButton = ({
  setMenuOpened,
  user: {
    id,
    // userdata: { name, photo },
    photo,
    name,
  }
}: Props) => (
  <div className="control-bar user-bar">
    <div className="user-button" onClick={setMenuOpened}>
      <UserPicture photo={photo} />

      <div className="user-button-fields">
        <div className="user-button-name">{((name && getUserName(name)) || id || '...')}</div>
        <div className="user-button-text">{((name && id) || 'пользователь')}</div>
      </div>
    </div>
  </div>
);
