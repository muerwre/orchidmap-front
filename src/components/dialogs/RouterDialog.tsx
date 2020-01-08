import React from 'react';
import { Icon } from '$components/panels/Icon';
import {
  routerCancel as routerCancelAction,
  routerSubmit as routerSubmitAction,
} from "$redux/user/actions";
import classnames from "classnames";

type Props = {
  routerPoints: number,
  width: number,
  is_routing: boolean,

  routerCancel: typeof routerCancelAction,
  routerSubmit: typeof routerSubmitAction,
}

const noPoints = ({ routerCancel }: { routerCancel: typeof routerCancelAction }) => (
  <React.Fragment>
    <div className="helper router-helper">
      <div className="helper__text">
        <Icon icon="icon-pin-1" />
        <div className="big white upper">
          Укажите первую точку на карте
        </div>
      </div>
    </div>
    <div className="helper router-helper">
      <div className="helper__buttons flex_1">
        <div className="flex_1" />
        <div className="button router-helper__button" onClick={routerCancel}>
          Отмена
        </div>
      </div>
    </div>
  </React.Fragment>
);

const firstPoint = ({ routerCancel }: { routerCancel: typeof routerCancelAction }) => (
  <React.Fragment>
    <div className="helper router-helper">
      <div className="helper__text">
        <Icon icon="icon-pin-1" />
        <div className="big white upper">УКАЖИТЕ СЛЕДУЮЩУЮ ТОЧКУ</div>
      </div>
    </div>
    <div className="helper router-helper">
      <div className="helper__buttons flex_1">
        <div className="flex_1" />
        <div className="button router-helper__button" onClick={routerCancel}>
          Отмена
        </div>
      </div>
    </div>
  </React.Fragment>
);

const draggablePoints = ({
  routerCancel, routerSubmit
}: {
  routerCancel: typeof routerCancelAction,
  routerSubmit: typeof routerSubmitAction,
}) => (
  <React.Fragment>
    <div className="helper">
      <div className="helper__text success">
        <Icon icon="icon-check-1" />
        <div className="big upper">Продолжайте маршрут</div>
      </div>
    </div>
    <div className="helper router-helper">
      <div className="helper__buttons button-group flex_1">
        <div className="flex_1" />
        <div className="button button_red router-helper__button" onClick={routerCancel}>
          Отмена
        </div>
        <div className="button primary router-helper__button" onClick={routerSubmit}>
          Применить
        </div>
      </div>
    </div>
  </React.Fragment>
);

export const RouterDialog = ({
  routerPoints, routerCancel, routerSubmit, width, is_routing,
}: Props) => (
  <div className="control-dialog" style={{ width }}>
    <div className={classnames('save-loader', { active: is_routing })} />

    {!routerPoints && noPoints({ routerCancel })}
    {routerPoints === 1 && firstPoint({ routerCancel })}
    {routerPoints >= 2 && draggablePoints({ routerCancel, routerSubmit })}
  </div>
);
