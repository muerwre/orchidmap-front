import React from 'react';
import { Icon } from '$components/panels/Icon';

type Props = {
  clearPoly: Function,
  clearStickers: Function,
  clearAll: Function,
  clearCancel: Function,

  width: Number,
}

export const TrashDialog = ({
  clearPoly, clearStickers, clearAll, clearCancel, width,
}: Props) => (
  <div className="control-dialog control-dialog-big" style={{ width }}>
    <div className="helper trash-helper">
      <div className="helper__text danger">
        <Icon icon="icon-trash-4" />
        <div className="big upper desktop-only">Удалить:</div>
      </div>
      <div className="helper__buttons">
        <div className="button-group">
          <div className="button router-helper__button" onClick={clearPoly}>
            Маршрут
          </div>
          <div className="button router-helper__button" onClick={clearStickers}>
            Стикеры
          </div>
          <div className="button router-helper__button" onClick={clearAll}>
            ВСЕ
          </div>
        </div>
        <div className="button primary router-helper__button" onClick={clearCancel}>
          Отмена
        </div>
      </div>
    </div>
  </div>
);
