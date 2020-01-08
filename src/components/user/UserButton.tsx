// @flow
import React from "react";
import { UserPicture } from "$components/user/UserPicture";
import { IUser } from "$constants/auth";

interface Props {
  user: IUser;
  setMenuOpened: () => void;
}

export const UserButton = ({
  setMenuOpened,
  user: { uid, photo, name }
}: Props) => (
  <div className="control-bar user-bar">
    <div className="user-button" onClick={setMenuOpened}>
      <UserPicture photo={photo} />

      <div className="user-button-fields">
        <div className="user-button-name">{name || uid || "..."}</div>
        <div className="user-button-text">{uid || "пользователь"}</div>
      </div>
    </div>
  </div>
);
