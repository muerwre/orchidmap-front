import React from 'react';

export const GuestButton = ({ onClick }) => (
  <div className="control-bar user-bar">
    <button
      onClick={onClick}
    >
      <span>ВОЙТИ</span>
    </button>
  </div>
);
