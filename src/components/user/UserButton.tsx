// @flow
import * as React from 'react';
import { UserPicture } from '$components/user/UserPicture';
import { IUser } from "$constants/auth";

interface Props {
  user: IUser,
  setMenuOpened: () => void,
}

export const UserButton = ({
  setMenuOpened,
  user: {
    id,
    photo,
    first_name,
  }
}: Props) => (
  <div className="control-bar user-bar">
    <div className="user-button" onClick={setMenuOpened}>
      <UserPicture photo={photo} />

      <div className="user-button-fields">
        <div className="user-button-name">{(first_name || id || '...')}</div>
        <div className="user-button-text">{(id || 'пользователь')}</div>
      </div>
    </div>
  </div>
);
