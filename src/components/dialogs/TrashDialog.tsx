import React from 'react';
import { Icon } from '$components/panels/Icon';

type Props = {
  clearPoly: () => void,
  clearStickers: () => void,
  clearAll: () => void,
  clearCancel: () => void,

  width: number,
}

export const TrashDialog = ({
  clearPoly, clearStickers, clearAll, clearCancel, width,
}: Props) => (
  <div className="control-dialog" style={{ width }}>
    <div className="helper trash-helper desktop-only">
      <div className="helper__text danger">
        <div className="big upper desktop-only">Удалить:</div>
      </div>
    </div>
    <div className="helper trash-helper">
      <div className="helper__buttons flex_1 trash-buttons">
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
        <div className="flex_1" />
        <div className="button primary router-helper__button" onClick={clearCancel}>
          Отмена
        </div>
      </div>
    </div>
  </div>
);
