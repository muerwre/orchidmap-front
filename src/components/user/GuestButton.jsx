// @flow
import React from 'react';
import { Icon } from '$components/panels/Icon';

type Props = {
  onClick: Function,
}

export const GuestButton = ({ onClick }: Props) => (
  <div className="control-bar user-bar control-bar-padded">
    <button
      className="user-bar-guest"
      onClick={onClick}
    >
      <Icon icon="icon-reg-1" />
      <span>ВОЙТИ</span>
    </button>
  </div>
);