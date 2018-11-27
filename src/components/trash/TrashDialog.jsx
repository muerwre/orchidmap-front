import React from 'react';
import { Icon } from '$components/panels/Icon';

type Props = {
  clearPoly: Function,
  clearStickers: Function,
  clearAll: Function,
  clearCancel: Function,
}

export const TrashDialog = ({
  clearPoly, clearStickers, clearAll, clearCancel
}: Props) => (
  <div className="helper trash-helper">
    <div className="helper__text danger">
      <Icon icon="icon-trash-4" />
      <div className="big upper">Уверены?</div>
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
          Удалить все
        </div>
      </div>
      <div className="button primary router-helper__button" onClick={clearCancel}>
        Отмена
      </div>
    </div>
  </div>
);
