import React from 'react';
import { Icon } from '~/components/panels/Icon';
import * as EDITOR_ACTIONS from '~/redux/editor/actions'
import classnames from "classnames";

type Props = {
  routerPoints: number,
  width: number,
  is_routing: boolean,

  editorRouterCancel: typeof EDITOR_ACTIONS.editorRouterCancel,
  editorRouterSubmit: typeof EDITOR_ACTIONS.editorRouterSubmit,
}

const noPoints = ({ editorRouterCancel }: { editorRouterCancel: typeof EDITOR_ACTIONS.editorRouterCancel }) => (
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
        <div className="button router-helper__button" onClick={editorRouterCancel}>
          Отмена
        </div>
      </div>
    </div>
  </React.Fragment>
);

const firstPoint = ({ editorRouterCancel }: { editorRouterCancel: typeof EDITOR_ACTIONS.editorRouterCancel }) => (
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
        <div className="button router-helper__button" onClick={editorRouterCancel}>
          Отмена
        </div>
      </div>
    </div>
  </React.Fragment>
);

const draggablePoints = ({
  editorRouterCancel, editorRouterSubmit
}: {
  editorRouterCancel: typeof EDITOR_ACTIONS.editorRouterCancel,
  editorRouterSubmit: typeof EDITOR_ACTIONS.editorRouterSubmit,
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
        <div className="button button_red router-helper__button" onClick={editorRouterCancel}>
          Отмена
        </div>
        <div className="button primary router-helper__button" onClick={editorRouterSubmit}>
          Применить
        </div>
      </div>
    </div>
  </React.Fragment>
);

export const RouterDialog = ({
  routerPoints, editorRouterCancel, editorRouterSubmit, width, is_routing,
}: Props) => (
  <div className="control-dialog" style={{ width }}>
    <div className={classnames('save-loader', { active: is_routing })} />

    {!routerPoints && noPoints({ editorRouterCancel })}
    {routerPoints === 1 && firstPoint({ editorRouterCancel })}
    {routerPoints >= 2 && draggablePoints({ editorRouterCancel, editorRouterSubmit })}
  </div>
);
