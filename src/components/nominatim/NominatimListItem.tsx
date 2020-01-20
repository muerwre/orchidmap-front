import React, { FC, useCallback } from 'react';
import { INominatimResult } from '~/redux/types';
import { MainMap } from '~/constants/map';

interface IProps {
  item: INominatimResult;
}

const NominatimListItem: FC<IProps> = ({ item }) => {
  const onClick = useCallback(() => {
    MainMap.panTo(item.latlng);
  }, [MainMap]);

  return (
    <div onClick={onClick} className="nominatim-list-item">
      <div className="title">{item.title}</div>
    </div>
  );
};

export { NominatimListItem };
