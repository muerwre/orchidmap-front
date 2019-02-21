// @flow
import * as React from 'react';
import { Icon } from '$components/panels/Icon';
import classnames from 'classnames';

interface Props {
  _id: string,
  tab: string,
  is_editing: boolean,
  title: string,
  distance: number,
  is_public: boolean,

  openRoute: (_id: string) => void,
  startEditing: (_id: string) => void,
  stopEditing: () => void,
  key: string,
}

export const RouteRow = ({
  title, distance, _id, openRoute, tab, is_editing, startEditing
}: Props) => (
  <div className={classnames('route-row-wrapper', { is_editing })}>
    {
      tab === 'mine' &&
      <div className="route-row-edit" onClick={() => startEditing(_id)}>
        <Icon icon="icon-edit-1" />
      </div>
    }
      <div
        className="route-row"
      >
        <div onClick={() => openRoute(_id)}>
          <div className="route-title">
            <span>{(title || _id)}</span>
          </div>
          <div className="route-description">
            <span>
              <Icon icon="icon-link-1" />
              {_id}
            </span>
            <span>
              <Icon icon="icon-cycle-1" />
              {(distance && `${distance} km`) || '0 km'}
            </span>
          </div>
        </div>
        <div className="route-row-panel">
          <div className="">
            <Icon icon="icon-trash-4" size={24} />
            Удалить
          </div>
          <div className="flex_1 justify-end" onClick={() => startEditing(_id)}>
            <Icon icon="icon-edit-1" size={24} />
            Правка
          </div>
        </div>
      </div>

  </div>
);
