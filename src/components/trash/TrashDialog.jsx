import React from 'react';

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
    <div className="helper__text">
      <div className="big white">Уверены?</div>
      <div className="small gray">Мы все удалим</div>
    </div>
    <div className="helper__buttons button-group">
      <div className="button router-helper__button" onClick={clearStickers}>
        Стикеры
      </div>
      <div className="button router-helper__button" onClick={clearPoly}>
        Маршрут
      </div>
      <div className="button danger router-helper__button" onClick={clearAll}>
        Очистить
      </div>
      <div className="button primary router-helper__button" onClick={clearCancel}>
        Отмена
      </div>
    </div>
  </div>
);
