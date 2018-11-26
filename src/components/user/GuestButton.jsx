// @flow
import React from 'react';

type Props = {
  onClick: Function,
}

export const GuestButton = ({ onClick }: Props) => (
  <div className="control-bar user-bar">
    <button
      className="user-bar-guest"
      onClick={onClick}
    >
      <span>ВОЙТИ</span>
    </button>
  </div>
);
