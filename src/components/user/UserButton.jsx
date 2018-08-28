import React from 'react';
import { UserPicture } from '$components/user/UserPicture';

export const UserButton = ({
   user: {
     id,
     userdata: {
       name,
       photo,
     }
   }
}) => (
  <div className="control-bar user-bar">
    <div className="user-button">
      <UserPicture photo={photo} />

      <div className="user-button-fields">
        <div className="user-button-name">{(name || id || '...')}</div>
        <div className="user-button-text">{(id || 'пользователь')}</div>
      </div>
    </div>
  </div>
);
