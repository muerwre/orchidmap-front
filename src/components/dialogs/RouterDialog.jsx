import React from 'react';
import { Icon } from '$components/panels/Icon';

type Props = {
  routerCancel: Function,
  routerSubmit: Function,
  routerPoints: Number,
  width: Number,
}

const noPoints = ({ routerCancel }: Props) => (
  <div className="helper router-helper">
    <div className="helper__text">
      <Icon icon="icon-pin-1" />
      <div className="big white upper">
        Укажите первую точку на карте
      </div>
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
      <Icon icon="icon-pin-1" />
      <div className="big white upper">УКАЖИТЕ СЛЕДУЮЩУЮ ТОЧКУ</div>
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
    <div className="helper__text success">
      <Icon icon="icon-check-1" />
      <div className="big upper">Продолжайте маршрут</div>
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

export const RouterDialog = ({ routerPoints, routerCancel, routerSubmit, width }: Props) => (
  <div className="control-dialog" style={{ width }}>
    {!routerPoints && noPoints({ routerCancel })}
    {routerPoints === 1 && firstPoint({ routerCancel })}
    {routerPoints >= 2 && draggablePoints({ routerCancel, routerSubmit })}
  </div>
);
