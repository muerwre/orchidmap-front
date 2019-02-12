// @flow
import * as React from 'react';
import { UserPicture } from '$components/user/UserPicture';
import { IUser } from '$constants/auth';

type Props = {
  user: IUser,
  setMenuOpened: Function,
};

export const UserButton = ({
  setMenuOpened,
  user: {
    _id,
    photo,
    first_name,
  }
}: Props) => (
  <div className="control-bar user-bar">
    <div className="user-button" onClick={setMenuOpened}>
      <UserPicture photo={photo} />

      <div className="user-button-fields">
        <div className="user-button-name">{(first_name || _id || '...')}</div>
        <div className="user-button-text">{(_id || 'пользователь')}</div>
      </div>
    </div>
  </div>
);
