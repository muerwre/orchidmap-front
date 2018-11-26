import React from 'react';

type Props = {
  routerCancel: Function,
  routerSubmit: Function,
  routerPoints: Number,
}

const noPoints = ({ routerCancel }: Props) => (
  <div className="helper router-helper">
    <div className="helper__text">
      <div className="big white">Укажите на карте первую точку маршрута</div>
      <div className="small gray">Путь прокладывается по улицам, тротуарам и тропинкам</div>
    </div>
    <div className="helper__buttons">
      <div className="button router-helper__button" onClick={routerCancel}>
        Отмена
      </div>
    </div>
  </div>
);

const firstPoint = ({ routerCancel }: Props) => (
  <div className="helper router-helper">
    <div className="helper__text">
      <div className="big white">Укажите на карте конечную точку маршрута</div>
      <div className="small gray"> Вы сможете добавить уточняющие точки</div>
    </div>
    <div className="helper__buttons">
      <div className="button router-helper__button" onClick={routerCancel}>
        Отмена
      </div>
    </div>
  </div>
);

const draggablePoints = ({ routerCancel, routerSubmit }: Props) => (
  <div className="helper router-helper">
    <div className="helper__text">
      <div className="big white">Продолжите маршрут, щелкая по карте</div>
      <div className="small gray">Потяните линию, чтобы указать промежуточные точки</div>
    </div>
    <div className="helper__buttons button-group">
      <div className="button button_red router-helper__button" onClick={routerCancel}>
        Отмена
      </div>
      <div className="button primary router-helper__button" onClick={routerSubmit}>
        Применить
      </div>
    </div>
  </div>
);

export const RouterDialog = ({ routerPoints, routerCancel, routerSubmit }: Props) => (
  <div>
    {!routerPoints && noPoints({ routerCancel })}
    {routerPoints === 1 && firstPoint({ routerCancel })}
    {routerPoints >= 2 && draggablePoints({ routerCancel, routerSubmit })}
  </div>
);
