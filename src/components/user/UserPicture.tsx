import * as React from 'react';

export const UserPicture = ({ photo }) => (
  <div
    className="user-button-picture"
    style={{
      backgroundImage: `url(${photo})`
    }}
  />
);
