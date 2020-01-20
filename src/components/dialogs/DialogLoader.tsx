import React, { FC } from 'react';
import { Icon } from '~/components/panels/Icon';

interface IProps {}

const DialogLoader: FC<IProps> = ({}) => {
  return (
    <div className="dialog-maplist-loader">
      <div className="dialog-maplist-icon spin">
        <Icon icon="icon-sync-1" />
      </div>
    </div>
  );
};

export { DialogLoader };
