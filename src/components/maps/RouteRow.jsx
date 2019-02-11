// @flow
import React from 'react';
import { Icon } from '$components/panels/Icon';
import classnames from 'classnames';
import { RouteRowEditor } from '$components/maps/RouteRowEditor';

type Props = {
  _id: string,
  title: string,
  distance: number,
  tab: string,
  is_editing: boolean,
  is_public: boolean,


  openRoute: (_id: string) => {},
  startEditing: (_id: string) => {},
  stopEditing: () => {},
};

export const RouteRow = ({
  title, distance, _id, openRoute, tab, is_editing, startEditing, stopEditing, is_public
}: Props) => (
  <div className={classnames('route-row-wrapper', { is_editing })}>
    {
      tab === 'mine' &&
      <div className="route-row-edit" onClick={() => startEditing(_id)}>
        <Icon icon="icon-edit-1" />
      </div>
    }
    {
      !is_editing
      ?
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
      : <RouteRowEditor title={title} is_public={is_public} distance={distance} _id={_id} />
    }

  </div>
);
