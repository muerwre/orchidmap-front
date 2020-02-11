import React, { FC } from 'react';

interface IProps {}

const GpxConfirm: FC<IProps> = ({}) => {
  return (
    <div className="gpx-confirm">
      <div className="gpx-confirm__text">Маршрут уже нанесен. Что делаем?</div>

      <div className="gpx-confirm__buttons">
        <div className="button success">Соединить</div>

        <div className="button danger">Переписать</div>

        <div className="button primary">Отмена</div>
      </div>
    </div>
  );
};

export { GpxConfirm };
