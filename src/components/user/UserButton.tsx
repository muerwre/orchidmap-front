// @flow
import React, { FC, memo } from 'react';
import { UserPicture } from '~/components/user/UserPicture';
import { IUser } from '~/constants/auth';

interface Props {
  user: IUser;
  setMenuOpened: () => void;
}

export const UserButton: FC<Props> = memo(({ setMenuOpened, user: { uid, photo, name } }) => (
  <div className="control-bar user-bar">
    <div className="user-button" onClick={setMenuOpened}>
      <UserPicture photo={photo} />

      <div className="user-button-fields">
        <div className="user-button-name">{name || uid || '...'}</div>
        <div className="user-button-text">{uid || 'пользователь'}</div>
      </div>
    </div>
  </div>
));
