import React from 'react';

const noPoints = () => (
  <div className="router-helper">
    <div className="router-helper__text">
      <div className="big white">Укажите на карте первую точку маршрута</div>
      <div className="small gray">Путь прокладывается по улицам, тротуарам и тропинкам</div>
    </div>
    <div className="router-helper__buttons">
      <div className="button router-helper__button">
        Отмена
      </div>
    </div>
  </div>
);

const firstPoint = () => (
  <div className="router-helper">
    <div className="router-helper__text">
      <div className="big white">Укажите на карте конечную точку маршрута</div>
      <div className="small gray"> Вы сможете добавить уточняющие точки</div>
    </div>
    <div className="router-helper__buttons">
      <div className="button router-helper__button">
        Отмена
      </div>
    </div>
  </div>
);

const draggablePoints = () => (
  <div className="router-helper">
    <div className="router-helper__text">
      <div className="big white">Продолжите маршрут, щелкая по карте</div>
      <div className="small gray">Потяните линию, чтобы указать промежуточные точки</div>
    </div>
    <div className="router-helper__buttons button-group">
      <div className="button button_red router-helper__button">
        Отмена
      </div>
      <div className="button primary router-helper__button">
        Применить
      </div>
    </div>
  </div>
);

export const RouterHelper = ({ routerPoints }) => (
  <div>
    { !routerPoints && noPoints() }
    { routerPoints === 1 && firstPoint() }
    { routerPoints >= 2 && draggablePoints() }
  </div>
);
